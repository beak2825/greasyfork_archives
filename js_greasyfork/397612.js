// ==UserScript==
// @name           yande.re refine
// @namespace      https://greasyfork.org/scripts/397612-yande-re-refine
// @description    Refining yande.re
// @include        *://behoimi.org/*
// @include        *://www.behoimi.org/*
// @include        *://*.donmai.us/*
// @include        *://konachan.tld/*2
// @include        *://yande.re/*
// @include        *://chan.sankakucomplex.com/*
// @version        2021.08.28.a
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/397612/yandere%20refine.user.js
// @updateURL https://update.greasyfork.org/scripts/397612/yandere%20refine.meta.js
// ==/UserScript==

// You can found alternatives in https://gist.github.com/jimmywarting/ac1be6ea0297c16c477e17f8fbe51347
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'
const CORS_ENABLED = false
const CACHE_ENABLED = true
const CACHE_ONLY_LIKE = true

const STORAGE_KEY = 'yandere-refine-liked'
const INDEXED_DB_NAME = 'yandere-refine-cache'
const SUGGEST_WIDTH = 300
// Minimum amount of window left to scroll, maintained by loading more pages.
const scrollBuffer = 600
// Time (in ms) the script will wait for a response from the next page before attempting to fetch the page again.  If the script gets trapped in a loop trying to load the next page, increase this value.
const timeToFailure = 15000

//= ===========================================================================
//= ========================Script initialization==============================
//= ===========================================================================

let nextPage, mainTable, mainParent, timeout, iframe
let previewIframe, previewImage, previewImageDiv, previewDialog
const imagesList = []
let currentImage = 0
const pending = ref(false, v =>
  document.getElementById('loader').classList.toggle('hidden', !v),
)
const likedList = readLikeList()
const viewingFavorites = isViewingFavorites()
let db
const memcache = {}

injectGlobalStyle()
initialize()

function initialize() {
  // Stop if inside an iframe
  if (window !== window.top || scrollBuffer === 0) return

  // Stop if no "table"
  mainTable = getMainTable(document)
  if (!mainTable) return

  injectStyle()
  initDOM()
  addImages(getImages())

  // Stop if no more pages
  nextPage = getNextPage(document)
  if (!nextPage) return

  // Hide the blacklist sidebar, since this script breaks the tag totals and post unhiding.
  const sidebar = document.getElementById('blacklisted-sidebar')
  if (sidebar) sidebar.style.display = 'none'

  // Other important variables:
  mainParent = mainTable.parentNode
  pending.value = false

  iframe = document.createElement('iframe')
  iframe.width = iframe.height = 0
  iframe.style.visibility = 'hidden'
  document.body.appendChild(iframe)

  // Slight delay so that Danbooru's initialize_edit_links() has time to hide all the edit boxes on the Comment index
  iframe.addEventListener(
    'load',
    (e) => {
      setTimeout(appendNewContent, 100)
    },
    false,
  )

  window.addEventListener('scroll', testScrollPosition, false)
  testScrollPosition()

  if (CACHE_ENABLED) {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/dexie@latest/dist/dexie.js'
    script.onload = () => {
      // eslint-disable-next-line no-undef
      db = new Dexie(INDEXED_DB_NAME)

      db.version(1).stores({
        images: 'id, blob',
      })
    }
    document.head.appendChild(script)
  }
}

//= ===========================================================================
//= ===========================Script functions================================
//= ===========================================================================

function awaitImage(img) {
  if (img.completed)
    return
  return new Promise((resolve) => {
    img.onload = () => {
      resolve(img)
      img.onload = undefined
    }
  })
}

async function setCache(id, img) {
  if (!db)
    return false

  console.log(`Caching ${id}`)
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight

  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0)

  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve)
  })

  await db.images.put({ id, blob })
  return true
}

async function getCache(id) {
  if (memcache[id])
    return URL.createObjectURL(memcache[id])
  if (!db)
    return
  const data = await db.images.get(id)
  if (data && data.blob) {
    console.log(`Loading cache of ${id}`)
    memcache[id] = data.blob
    return URL.createObjectURL(data.blob)
  }
}

async function removeCache(id) {
  if (!db)
    return
  await db.images.delete(id)
}

// Some pages match multiple "tables", so order is important.
function getMainTable(source) {
  // Special case: Sankaku post index with Auto Paging enabled
  if (
    /sankaku/.test(location.host)
    && /auto_page=1/.test(document.cookie)
    && /^(post(\/|\/index\/?)?|\/)$/.test(location.pathname)
  )
    return null

  const xpath = [
    './/div[@id=\'c-favorites\']//div[@id=\'posts\']', // Danbooru (/favorites)
    './/div[@id=\'posts\']/div', // Danbooru; don't want to fall through to the wrong xpath if no posts ("<article>") on first page.
    './/div[@id=\'c-pools\']//section/article/..', // Danbooru (/pools/####)

    './/div[@id=\'a-index\']/table[not(contains(@class,\'search\'))]', // Danbooru (/forum_topics, ...), take care that this doesn't catch comments containing tables
    './/div[@id=\'a-index\']', // Danbooru (/comments, ...)

    './/table[contains(@class,\'highlight\')]', // large number of pages
    './/div[@id=\'content\']/div/div/div/div/span[@class=\'author\']/../../../..', // Sankaku: note search
    './/div[contains(@id,\'comment-list\')]/div/..', // comment index
    './/*[not(contains(@id,\'popular\'))]/span[contains(@class,\'thumb\')]/a/../..', // post/index, pool/show, note/index
    './/li/div/a[contains(@class,\'thumb\')]/../../..', // post/index, note/index
    './/div[@id=\'content\']//table/tbody/tr[@class=\'even\']/../..', // user/index, wiki/history
    './/div[@id=\'content\']/div/table', // 3dbooru user records
    './/div[@id=\'forum\']', // forum/show
  ]

  for (let i = 0; i < xpath.length; i++) {
    // eslint-disable-next-line no-func-assign
    getMainTable = (function(query) {
      return function(source) {
        const mTable = new XPathEvaluator().evaluate(
          query,
          source,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null,
        ).singleNodeValue
        if (!mTable) return mTable

        // Special case: Danbooru's /favorites lacks the extra DIV that /posts has, which causes issues with the paginator/page break.
        const xDiv = document.createElement('div')
        xDiv.style.overflow = 'hidden'
        mTable.parentNode.insertBefore(xDiv, mTable)
        xDiv.appendChild(mTable)
        return xDiv
      }
    })(xpath[i])

    const result = getMainTable(source)
    if (result) {
      // alert("UPW main table query: "+xpath[i]+"\n\n"+location.pathname);
      return result
    }
  }

  return null
}

function getNextPage(doc = document) {
  return (doc.querySelector('a.next_page') || {}).href
}

function testScrollPosition() {
  if (!nextPage) return

  // Take the max of the two heights for browser compatibility
  if (
    !pending.value
    && window.pageYOffset + window.innerHeight + scrollBuffer
      > Math.max(
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
      )
  ) {
    console.log(`loading ${nextPage}`)
    pending.value = true
    timeout = setTimeout(() => {
      pending.value = false
      testScrollPosition()
    }, timeToFailure)
    iframe.contentDocument.location.replace(nextPage)
  }
}

function appendNewContent() {
  // Make sure page is correct.  Using 'indexOf' instead of '!=' because links like "https://danbooru.donmai.us/pools?page=2&search%5Border%5D=" become "https://danbooru.donmai.us/pools?page=2" in the iframe href.
  clearTimeout(timeout)
  if (!nextPage.includes(iframe.contentDocument.location.href)) {
    setTimeout(() => {
      pending.value = false
    }, 1000)
    return
  }

  const images = getImages(iframe.contentDocument)
  addImages(images)

  if (!images.length) nextPage = null
  else
    nextPage = getNextPage(iframe.contentDocument)

  if (nextPage) {
    history.pushState({}, iframe.contentDocument, nextPage)
  }
  else {
    // TODO: end of pages
    console.log('End of pages')
  }

  pending.value = false
  testScrollPosition()
}

function injectGlobalStyle() {
  const s = document.createElement('style')
  s.innerHTML = `
body { padding: 0; }
#header { margin: 0 !important; text-align: center; }
#header ul { float: none !important; display: inline-block;}
#content > div:first-child > div.sidebar { position: fixed; left: 0; top: 0; bottom: 0; overflow: auto !important; z-index: 2; width: 250px !important; transform: translate(-246px, 0); background: #171717dd; transition: all .2s ease-out; float: none !important; padding: 15px; }
#content > div:first-child > div.sidebar:hover { transform: translateX(0); }
div.content { width: 100vw; text-align: center; float: none }
div.footer { clear: both !important; }
div#paginator a { border: none; }
#comments { max-width: unset !important; width: unset !important; padding: 20px; }
.avatar { border-radius: 1000px; }
form textarea { color: white; background: inherit; padding: 10px 5px; }
.comment .content { text-align: left; }
`
  document.body.appendChild(s)
}

function injectStyle() {
  const s = document.createElement('style')
  s.innerHTML = `
#gallery .row { width: 100vw; white-space: nowrap; height: var(--image-height); --image-height: 300px; }
#gallery .row .thumb { position: relative; display: inline-block; transition: .2s ease-out; overflow: hidden; }
#gallery .row .thumb.liked::after { position: absolute; top: 3px; right: 3px; content: url('https://api.iconify.design/mdi:cards-heart.svg?color=%23f37e92&height=20'); vertical-align: -0.125em; }
#gallery .row .thumb:first-child { transform-origin: left; }
#gallery .row .thumb:last-child { transform-origin: right; }
#gallery .row .thumb img { height: var(--image-height); }
#gallery .row:hover { z-index: 1; }
#gallery .row .thumb:hover { transform: scale(1.3); z-index: 1; opacity: 1; box-shadow: 8px 8px 100px 10px rgba(0, 0, 0, 0.8); border-radius: 5px;  }

#loader { padding: 10px; text-align: center; }

.hidden { display: none !important; }
.preview-dialog { position: fixed; top: 0; left: 0; height: 100vh; width: 100vw; background: rgba(0,0,0,0.7); z-index: 100; }
.preview-dialog iframe { position: absolute; height: 90vh; width: 80vw; top: 50%; left: 50%; transform: translate(-50%, -50%); background: grey; border: none; border-radius: 5px; overflow: hidden; }
.preview-dialog .image-host { position: fixed; top: 0; left: 0; height: 100vh; width: 100vw; overflow: auto; text-align: center; }
.preview-dialog .image-host img { margin: auto; }
.preview-dialog .image-host img.loading { filter: blur(3px); height: 100vh; }
.preview-dialog .image-host.full { overflow: hidden }
.preview-dialog .image-host.full img { max-width: 100vw; max-height: 100vh; }
`
  document.body.appendChild(s)
}

function initPreviewIframe() {
  previewDialog = document.createElement('div')
  previewDialog.addClassName('preview-dialog hidden')
  previewDialog.onclick = (e) => {
    if (e.target === previewDialog)
      previewDialog.classList.toggle('hidden', true)
  }
  window.onkeydown = (e) => {
    if (!previewDialog.classList.contains('hidden')) {
      if (e.key === 'ArrowLeft') {
        currentImage = Math.max(0, currentImage - 1)
        openImage(currentImage)
        e.preventDefault()
      }
      if (e.key === 'ArrowRight') {
        currentImage = Math.min(imagesList.length - 1, currentImage + 1)
        openImage(currentImage)
        e.preventDefault()
      }
      if (e.key === 'Escape') {
        previewDialog.classList.toggle('hidden', true)
        e.preventDefault()
      }
      if (e.key === 'Tab') {
        openImage(currentImage, 'page')
        e.preventDefault()
      }
      if (e.code === 'Space') {
        previewImageDiv.classList.toggle('full')
        e.preventDefault()
      }
      if (e.code === 'KeyL') {
        like(currentImage, 3)
        e.preventDefault()
      }
      if (e.code === 'KeyU') {
        unlike(currentImage, 2)
        e.preventDefault()
      }
    }
  }

  previewIframe = document.createElement('iframe')
  previewImageDiv = document.createElement('div')
  previewImageDiv.className = 'image-host full'
  previewImage = document.createElement('img')

  previewImageDiv.onclick = (e) => {
    previewDialog.classList.toggle('hidden', true)
  }

  previewDialog.appendChild(previewIframe)
  previewImageDiv.appendChild(previewImage)
  previewDialog.appendChild(previewImageDiv)
  document.body.appendChild(previewDialog)
}

function ref(v, handler) {
  let value = v
  return new Proxy(
    {},
    {
      get(obj, prop) {
        return value
      },
      set(obj, prop, v) {
        if (value !== v) {
          value = v
          handler(value)
        }
      },
    },
  )
}

function getImages(doc = document) {
  const result = Array.from(
    doc.querySelectorAll('ul#post-list-posts > li'),
  ).map((li) => {
    const page = (li.querySelector('a.thumb') || {}).href
    const thumb = (li.querySelector('a.thumb img') || {}).src
    const large = (li.querySelector('a.largeimg') || {}).href || (li.querySelector('a.smallimg') || {}).href
    const id = page.split('/').slice(-1)[0]
    const resText = (li.querySelector('.directlink-res') || {}).textContent
    let res
    if (resText && resText.includes('x')) {
      const [height, width] = resText.split(' x ').map(i => +i)
      res = { height, width, radio: width / height }
    }
    if (viewingFavorites) setLiked(id, true)
    const liked = isLiked(id)

    return { page, thumb, large, id, res, liked }
  })
  doc.getElementById('post-list-posts').remove()
  return result
}

function initDOM() {
  const list = document.getElementById('post-list')
  const gallery = document.createElement('div')
  gallery.id = 'gallery'
  list.appendChild(gallery)
  const loader = document.createElement('div')
  loader.id = 'loader'
  loader.textContent = 'Loading...'
  list.appendChild(loader)
}

function addImages(images) {
  const gallery = document.getElementById('gallery')
  const RADIO = Math.round(window.innerWidth / SUGGEST_WIDTH)

  images.forEach((info, i) => {
    const idx = imagesList.length + i
    let row = gallery.querySelector('.row:last-child:not(.full)')
    if (!row) {
      row = document.createElement('div')
      row.className = 'row'
      gallery.appendChild(row)
    }
    row.dataset.width = +(row.dataset.width || 0) + 1 / info.res.radio

    if (+row.dataset.width >= RADIO) {
      row.classList.toggle('full', true)
      row.style = `--image-height: calc(100vw / ${row.dataset.width})`
    }

    const thumb = document.createElement('div')
    thumb.className = 'thumb'
    row.appendChild(thumb)

    const img = document.createElement('img')
    img.src = info.thumb
    thumb.appendChild(img)
    info.dom = thumb
    thumb.classList.toggle('liked', info.liked)

    let lastClicked = -Infinity
    let timer = null
    img.onclick = (e) => {
      e.preventDefault()
      // double click
      if (Date.now() - lastClicked < 300) {
        if (info.liked) unlike(idx)
        else like(idx)

        clearTimeout(timer)
        // click
      }
      else {
        lastClicked = +Date.now()
        timer = setTimeout(() => openImage(idx), 400)
      }
      return false
    }
  })
  imagesList.push(...images)
}

function getProxiedUrl(url) {
  if (!CORS_ENABLED)
    return url
  return CORS_PROXY + url
}

async function openImage(idx, type = 'image') {
  currentImage = idx
  const img = imagesList[idx]
  const { page, large, id, thumb } = img
  if (!previewIframe) initPreviewIframe()

  if (!large) type = 'page'

  previewDialog.classList.toggle('hidden', false)
  previewImage.dataset.id = id

  if (type === 'image') {
    previewImage.crossOrigin = null
    const cache = await getCache(id)
    if (cache) {
      previewImage.src = cache
      // show image
      previewIframe.classList.toggle('hidden', true)
      previewImageDiv.classList.toggle('hidden', false)
    }
    else {
      // show image
      previewIframe.classList.toggle('hidden', true)
      previewImageDiv.classList.toggle('hidden', false)

      // thumbnail
      previewImage.classList.toggle('loading', true)
      previewImage.src = thumb
      await awaitImage(previewImage)

      // full image
      if (CORS_ENABLED)
        previewImage.crossOrigin = 'Anonymous'
      const url = getProxiedUrl(large)
      previewImage.src = url
      await awaitImage(previewImage)
      previewImage.classList.toggle('loading', false)

      // image changed
      if (previewImage.dataset.id !== id)
        return

      // cache
      if (!CACHE_ONLY_LIKE || isLiked(id))
        await setCache(id, previewImage)
    }
  }
  else {
    previewIframe.src = page
    previewIframe.classList.toggle('hidden', false)
    previewImageDiv.classList.toggle('hidden', true)
    await awaitImage(previewIframe)
    if (
      previewIframe.contentWindow.location.href !== page
        && !previewIframe.contentWindow.location.pathname.startsWith('/post/show/')
    ) {
      location.href = previewIframe.contentWindow.location.href
      previewDialog.classList.toggle('hidden', true)
      previewIframe.onload = null
    }
  }
}

function getFavoritesLike() {
  return document.querySelector('.user .submenu li:nth-child(3) a').href
}

function isViewingFavorites() {
  const fav = getFavoritesLike()
  if (!fav)
    return false

  const a = (new URL(fav).searchParams.get('tags') || '')
    .toLowerCase()
    .split(' ')
    .sort()
  const b = (new URL(location.href).searchParams.get('tags') || '')
    .toLowerCase()
    .split(' ')
    .sort()

  return a[0] && a[0] === b[0] && a[1] === b[1]
}

async function vote(id, score) {
  const body = new FormData()
  body.append('id', id)
  body.append('score', score)
  const rawResponse = await fetch('https://yande.re/post/vote.json', {
    method: 'POST',
    headers: {
      'X-CSRF-Token': document.querySelector('meta[name=csrf-token]').attributes
        .content.value,
    },
    body,
  })
  await rawResponse.json()
}

function readLikeList() {
  return Object.fromEntries(
    (localStorage.getItem(STORAGE_KEY) || '').split(',').map(i => [i, true]),
  )
}

function isLiked(id) {
  return !!likedList[id]
}

function setLiked(id, v) {
  likedList[id] = v
  localStorage.setItem(
    STORAGE_KEY,
    Object.entries(likedList)
      .map(([i, v]) => (v ? i : null))
      .filter(i => i)
      .join(','),
  )
}

function like(idx) {
  const image = imagesList[idx]
  vote(image.id, 3)
  image.liked = true
  setLiked(image.id, true)
  image.dom.classList.toggle('liked', image.liked)
}

function unlike(idx) {
  const image = imagesList[idx]
  vote(image.id, 2)
  image.liked = false
  setLiked(image.id, false)
  image.dom.classList.toggle('liked', image.liked)
  removeCache(image.id)
}
