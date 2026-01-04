// ==UserScript==
// @name        Mismangas Enhanced Reader
// @name:es     Mismangas Lector Mejorado
// @namespace   Violentmonkey Scripts
// @match       https://mismangas.com/*
// @grant       none
// @version     1.19.1
// @author      donkikote
// @description Enhanced mismangas.com reader
// @description:es Lector mejorado de mismangas.com
// @license MIT
// @grant GM_getValue
// @grant GM_setValue
// @grant GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/524397/Mismangas%20Enhanced%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/524397/Mismangas%20Enhanced%20Reader.meta.js
// ==/UserScript==
const styles = `
    .reader-container {
      padding: 0;
      margin: 0 auto;
    }
    .pages-container {
      display: flex;
      flex-flow: row-reverse wrap;
      justify-content: center;
      column-gap: 5px;
    }
    .pageWrapper {
      position: relative;
      max-width: 100%;
      display: flex;
      justify-content: center;
    }
    @media (max-width: 1200px) {
      .pageWrapper {
        margin-bottom: 50vh;
      }
    }
    .pageFlipButton {
      width: 40%;
      height: 100%;
      position: absolute
    }
    .nextPageBtn {
      left: 0;
    }
    .prevPageBtn {
      right: 0;
    }
    .prevPageBtn:hover {
      background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.3));
    }
    .nextPageBtn:hover {
      background-image: linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,0.3));
    }

    .chapter-header {
      display: flex;
      justify-content: space-between;
      padding-right: 1em;
    }

    .nav-insert {
      display: flex;
      flex-grow: 4;
      gap: 1em;
    }
    .disabled ul li {
      opacity: 0.4;
    }
    .enhanced-nav {
      display: flex;
      grow: 4;
      gap: 1em;
    }
`
const chapterUrl = 'https://mismangas.com/capitulo'

const reading_status = 'reading_status'
const last_url = 'last_url'
const updated_at = 'updated_at'
const sync_key = 'sync_key'
const enhanced_nav_id = 'enhanced-nav'

const remoteStorageHost = 'https://keyvalue.immanuel.co/api/KeyVal'
const remoteKeyPrefix = 'MMER_'

const started = 'S'
const read = 'R'

const sleep = ms => new Promise(r => setTimeout(r, ms));
let debounceTimeoutId = null;
const debounce = (callback, wait) => {
  return (...args) => {
    window.clearTimeout(debounceTimeoutId);
    debounceTimeoutId = window.setTimeout(() => {
      callback(...args);
      debounceTimeoutId = null;
    }, wait);
  };
}

let currentData = undefined
let mangaId = undefined
let currentChapter = undefined
let isDoublePage = false


function getBigContainer() {
  return document.getElementsByTagName('main')[0].getElementsByClassName('container-site-web')[0]
}

function getPagesContainer() {
  return document.getElementsByClassName('grid-img-capitulo')[0]
}

function addStyles() {
  var styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}

function getSyncKey() {
  return GM_getValue(sync_key)
}

function setSyncKey(value) {
  return GM_setValue(sync_key, value)
}

function getChapterUrl(mangaId, chapterNumber) {
  return `${chapterUrl}/${chapterNumber}/${mangaId}`
}

function addNavUtils() {
  const nav = document.getElementsByTagName('nav')[0].getElementsByTagName('div')[0]
  let enhancedNav = document.getElementById(enhanced_nav_id)
  if (!enhancedNav) {
    enhancedNav = document.createElement('div')
    enhancedNav.id = enhanced_nav_id
    enhancedNav.classList.add('enhanced-nav')

    const syncGroup = document.createElement('form')
    const syncKeyInput = document.createElement('input')
    syncKeyInput.placeholder = 'Sync key'
    const syncKey = getSyncKey()
    if (syncKey) {
      syncKeyInput.value = syncKey
    }
    const syncKeyApplyButton = document.createElement('button')
    syncKeyApplyButton.type = 'submit'
    syncKeyApplyButton.textContent = 'Save'
    syncKeyApplyButton.disabled = true
    const syncKeyAppliedText = document.createElement('span')
    syncKeyAppliedText.textContent = 'Applied!'
    syncKeyAppliedText.style.opacity = 0
    syncKeyInput.addEventListener('input', () => {
      syncKeyApplyButton.disabled = false
    })
    syncGroup.appendChild(syncKeyInput)
    syncGroup.appendChild(syncKeyApplyButton)
    syncGroup.appendChild(syncKeyAppliedText)
    syncGroup.addEventListener('submit', async (e) => {
      e.preventDefault()
      const newSyncKey = syncKeyInput.value

      setSyncKey(newSyncKey)
      if (newSyncKey && mangaId) {
        syncReadingStatus(mangaId)
      }
      syncKeyApplyButton.disabled = false
      syncKeyAppliedText.style.opacity = 1
      await sleep(5000)
      syncKeyAppliedText.style.opacity = 0
      return false
    })


    enhancedNav.appendChild(syncGroup)
    nav.insertBefore(enhancedNav, nav.getElementsByTagName('button')[0])
  }
}

function hideAds() {
  let ads = document.getElementsByClassName('sticky-ad-pop')
  for (let i=0;i<ads.length;i++) {
    let ad = ads[i]
    ad.style.display = 'none'
  }
}

async function resetImageSizes() {
  console.log("Resetting image sizes")
  const container = getBigContainer()
  //bigContainer.style['max-width'] = ''
  const images = await getLoadedImages()
  const viewportSize = getViewportSize()
  for (let image of images) {
    setImageSize(image, viewportSize.vh, viewportSize.vw)
  }
  const commonPageWidth = getCommonPageWidth(images)
  const doublePageWidth = getDoublePageWidth(commonPageWidth)
  container.style.maxWidth = `${doublePageWidth}px`
  isDoublePage = container.getBoundingClientRect().width == doublePageWidth
  document.location.href = document.location.href

}

function setImageSize(image, height, width) {
  image.style['max-height'] = height + 'px'
  image.style['max-width'] = width + 'px'
}

function getViewportSize() {
  return {
    vh: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
    vw: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  }
}

function wrapImages(images) {
  // Wrap page images with anchor that scrolls to next page except last one that redirects to next chapter
  const viewportSize = getViewportSize()
  const imgCount = images.length

  const imageWrappers = []
  for (let i=0;i<imgCount;i++) {
    const image = images[i]
    const wrapper = document.createElement('span')
    wrapper.classList.add('pageWrapper')

    imageWrappers.push(wrapper)
  }

  const pagesContainer = getPagesContainer()
  for (let i=0;i<images.length;i++) {
    const image = images[i]
    image.classList.add('page')
    setImageSize(image, viewportSize.vh, viewportSize.vw)
    image.style.width = 'auto'
    imageWrappers[i].appendChild(image)
    pagesContainer.appendChild(imageWrappers[i])
  }
}

function getCommonPageWidth(images) {
  const imageWidths = {}
  for (let image of images) {
    if (imageWidths[image.width]) {
      imageWidths[image.width] += 1
    } else {
      imageWidths[image.width] = 1
    }
  }
  // Get common page width for double paging
  let commonPageWidth = 0
  let commonPageWidthCount = 0
  for (i in imageWidths) {
    if (imageWidths[i] > commonPageWidthCount) {
      commonPageWidth = i
      commonPageWidthCount = imageWidths[i]
    }
  }
  return commonPageWidth
}

function addPagination(images, commonPageWidth, nextChapterUrl) {
  // Assign ids and add placeholder id for double pagers to keep scrolling consistent
  let j = 0
  const imgCount = images.length
  for (let i=0;i<imgCount;i++,j++) {
    const id = 'page'+j
    const wrapper = images[i].parentNode
    const doublePager = images[i].width != commonPageWidth

    images[i].id = id
    if (doublePager) {
      j++
      images[i].parentNode.id = 'page'+j
    }

    // Add scrolling buttons
    const nextImgAnchor = document.createElement('a')
    nextImgAnchor.classList.add('pageFlipButton')
    nextImgAnchor.classList.add('nextPageBtn')
    if (i == imgCount-1) {
      nextImgAnchor.href = nextChapterUrl
    } else {
      nextImgAnchor.href = '#page'+(j+1)
    }
    wrapper.appendChild(nextImgAnchor)

    if (i > 0) {
      const prevImgAnchor = document.createElement('a')
      prevImgAnchor.classList.add('pageFlipButton')
      prevImgAnchor.classList.add('prevPageBtn')
      prevImgAnchor.href = '#page'+(j - (doublePager ? 2 : 1))
      wrapper.appendChild(prevImgAnchor)
    }
  }
  return j
}

function addKeyboardNavigation(pageCount, nextChapterUrl) {
  // Add lef/right keys navigation
  document.addEventListener('keydown', function(event) {
    const currentUrl = window.location.href
    const urlSplit = currentUrl.split('#page')
    const cleanPage = urlSplit[0]
    const currentPage = urlSplit.length > 1 ? Number(urlSplit[1]) : 0
    const increment = isDoublePage ? 2 : 1
    const lastPage = pageCount-1
    const nextPage = currentPage == lastPage ? pageCount : Math.min(currentPage+increment, lastPage)
    const prevPage = Math.max(currentPage-increment, 0)
    if(event.keyCode == 37) {
      if (nextPage < pageCount) {
        document.location.href = cleanPage+'#page'+nextPage
      } else {
        document.location.href = nextChapterUrl
      }
    }
    else if(event.keyCode == 39) {
      document.location.href = cleanPage+'#page'+prevPage
    }
  });
}

function setPageGridStyle(doublePageWidth) {
  const bigContainer = getBigContainer()
  const pagesContainer = getPagesContainer()
  bigContainer.classList.add('reader-container')
  bigContainer.style.maxWidth = `${doublePageWidth}px`
  pagesContainer.classList.add('pages-container')
  pagesContainer.parentNode.style.padding = '0'
  function addStyles() {
    var styleSheet = document.createElement('style')
    styleSheet.textContent = styles
    document.head.appendChild(styleSheet)
  }
}

async function getLoadedImages() {
  const imageArray = [].slice.call(getPagesContainer().getElementsByTagName('img'))
  const promiseArray = [];
  for (let image of imageArray) {
    if (!image.complete) {
      promiseArray.push(new Promise(resolve => {
        image.addEventListener('load', () => resolve())
      }));
    }
  }

  await Promise.all(promiseArray); // wait for all the images to be loaded
  return imageArray;
}

function getDoublePageWidth(commonPageWidth) {
  return commonPageWidth*2 + 6
}

async function enhancedReader() {
  console.log('Setting up enhanced reader...')

  const images = await getLoadedImages()

  const chapterButtons = document.getElementsByClassName('btn-capitulo')
  const nextChapterUrl = chapterButtons[chapterButtons.length-1].href

  wrapImages(images)
  const commonPageWidth = getCommonPageWidth(images)
  const doublePageWidth = getDoublePageWidth(commonPageWidth)
  const realPages = addPagination(images, commonPageWidth, nextChapterUrl)



  setPageGridStyle(doublePageWidth)

  // Scroll to current reading page
  const currentUrl = window.location.href
  if (currentUrl.search('#page') ==-1) {
    document.location.href = document.location.href+'#page0'
  } else {
    document.location.href = document.location.href
  }

  isDoublePage = getBigContainer().getBoundingClientRect().width == doublePageWidth

  addKeyboardNavigation(realPages, nextChapterUrl)
  console.log('Finished setting up enhanced reader. Enjoy ;)')
}

async function tryEnhancedReader() {
  try {
    enhancedReader()
  } catch (error) {
    console.error('Something went wrong when loading the enhanced reader', error)
    await sleep(2000);
    tryEnhancedReader()
  }
}

function extractUrlData(url) {
  let match
  if (!url) {
    return {}
  }
  if (url.includes('capitulo')) {
    match = /capitulo\/(\d+)\/(\w+)/.exec(url)
    return {
      'chapter': match[1],
      'mangaId': match[2]
    }
  } else if (url.includes('/manga/')) {
    match = /manga\/([^\/]+)\/(\w+)/.exec(url)
    return {
      'mangaName': match[1],
      'mangaId': match[2]
    }
  }

}

function storeReadingStatus(currentUrl) {
  let readingStatus = GM_getValue(reading_status)
  if (!readingStatus) {
    readingStatus = {}
  }
  const currentData = extractUrlData(currentUrl)
  const mangaId = currentData.mangaId
  const currentChapter = currentData.chapter

  if (currentChapter && readingStatus[mangaId]?.chapter != currentChapter) {
    readingStatus[mangaId] = {
      'chapter': currentChapter ? currentChapter : 1,
      'updated_at': Date.now()
    }
    GM_setValue(reading_status, readingStatus)
  }
}

async function fetchKey(key) {
  const url = `${remoteStorageHost}/GetValue/${getSyncKey()}/${key}`
  return await GM.xmlHttpRequest({ url })
}

async function uploadKey(key, value) {
  const url = `${remoteStorageHost}/UpdateValue/${getSyncKey()}/${key}/${value}`
  return await GM.xmlHttpRequest({ url,  method: 'POST'})
}

function mangaStatusKey(mangaId) {
  return `${remoteKeyPrefix}${mangaId}`
}

async function fetchReadingStatus(mangaId) {
  console.log("fetchReadingStatus ", mangaId)
  return await fetchKey(mangaStatusKey(mangaId))
}

async function uploadReadingStatus(mangaId) {
  const status = btoa(JSON.stringify(GM_getValue(reading_status)[mangaId]))
  console.log("uploadReadingStatus ", mangaId, status)
  return await uploadKey(mangaStatusKey(mangaId), status)
}

async function syncReadingStatus(mangaId) {
  const response = await fetchReadingStatus(mangaId)
  if (response.status == 200) {
    const responseText = JSON.parse(response.responseText)
    if (responseText == '') {
      console.log('Upload status for the first time')
    } else {
      const remoteStatus = JSON.parse(atob(responseText))
      const localStatus = GM_getValue(reading_status)
      const localMangaStatus = localStatus[mangaId]
      if (localMangaStatus && localMangaStatus.updated_at > remoteStatus.updated_at) {
        console.log('Upload status because is newer')
        await uploadReadingStatus(mangaId)
      } else if (!localMangaStatus || localMangaStatus.updated_at < remoteStatus.updated_at) {
        console.log('Store remote status in local')
        localStatus[mangaId] = remoteStatus
        GM_setValue(reading_status, localStatus)
        if (window.location.href.includes('/manga/')) {
          enhancedMangaStatus()
        } else if(window.location.href.includes('/capitulo/') && localStatus[mangaId].chapter != currentChapter) {
          window.location.href = getChapterUrl(mangaId, localStatus[mangaId].chapter)
        }
      }
    }
  }
}

function enhancedMangaStatus() {
  console.log('Setting up enhanced manga status...')
  const currentData = extractUrlData(window.location.href)
  const mangaId = currentData.mangaId
  const readingStatus = GM_getValue(reading_status)[mangaId]
  const currentChapterNumber = Number(readingStatus.chapter)
  const currentChapterUrl = getChapterUrl(mangaId, currentChapterNumber)

  const chaptersContainer = document.getElementsByClassName('capitulos-manga-page')[0]
  const header = chaptersContainer.getElementsByClassName('titulo-ficha-cap')[0]
  let continueButton = document.getElementById('continue-reading')
  if (!continueButton) {
    const wrapper = document.createElement('div')
    wrapper.classList.add('chapter-header')
    continueButton = document.createElement('a')
    continueButton.id = 'continue-reading'

    chaptersContainer.replaceChild(wrapper, header)
    wrapper.appendChild(header)
    wrapper.appendChild(continueButton)
  }
  continueButton.textContent = `Continue chapter ${currentChapterNumber}`
  continueButton.href = currentChapterUrl

  const chapters = chaptersContainer.getElementsByClassName('scroll-list')[0].getElementsByTagName('a')
  for (let i=0;i < chapters.length;i++) {
    const chapterAnchor = chapters[i]
    const chapterData = extractUrlData(chapterAnchor.href)
    if (chapterData.chapter < currentChapterNumber) {
      chapterAnchor.classList.add('disabled')
    } else {
      chapterAnchor.classList.remove('disabled')
    }
  }
  console.log('Done setting up enhanced manga status...')
}

async function tryEnhancedMangaStatus() {
  try {
    enhancedMangaStatus()
  } catch (error) {
    console.error('Something went wrong when loading the enhanced manga status', error)
    await sleep(2000);
    tryEnhancedMangaStatus()
  }
}

let loaded = false

function enhancedReaderObserver() {
  addStyles()
  // Observe for chapter changes and reload to rebuild reader
  const targetNode = document.getElementsByTagName('body')[0]
  const config = { attributes: false, childList: true }
  const callback = (mutationList, observer) => {
    let currentUrl=window.location.href.split('#')[0]
    currentData = extractUrlData(currentUrl)
    mangaId = currentData?.mangaId
    currentChapter = currentData?.chapter
    const lastUrl = GM_getValue(last_url)
    if (currentUrl != lastUrl) {
      loaded = false
      storeReadingStatus(currentUrl)
      GM_setValue(last_url, currentUrl)
    }
    if (!loaded) {
      addNavUtils()
      hideAds()
      if (mangaId) {
        syncReadingStatus(mangaId)
      }
      if (currentUrl.includes('capitulo')) {
        tryEnhancedReader()
      } else if (currentUrl.includes('/manga/')) {
        tryEnhancedMangaStatus()
      }
    }
    loaded = true
  }
  new MutationObserver(callback).observe(targetNode, config)
}

window.addEventListener('load', enhancedReaderObserver, false)
window.addEventListener('resize', (e) => {
  debounce(resetImageSizes, 200)()
}, false)
