// ==UserScript==
// @name        BookWalker Cover Page Extractor
// @description Aids in uploading covers to MD
// @namespace   https://github.com/Christopher-McGinnis
// @author      Christopher McGinnis & Cwavs
// @license     MIT
// @icon        https://mangadex.org/favicon-96x96.png
// @version     0.1.44
// @include     /^(?:https?:\/\/)?.*bookwalker\.jp\/de[a-zA-Z0-9]+-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]+(\/.*)?/
// @include     /^(?:https?:\/\/)?.*bookwalker\.jp\/series\/\d+(\/.*)?/
// @include     /^(?:https?:\/\/)?mangadex\.org\/title\/\d+(\/.*)?/
// @grant       GM_xmlhttpRequest
// @require     https://gitcdn.xyz/repo/rsmbl/Resemble.js/db6f0b8298b4865c0d28ff68fab842254a249b9d/resemble.js
// @downloadURL https://update.greasyfork.org/scripts/425308/BookWalker%20Cover%20Page%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/425308/BookWalker%20Cover%20Page%20Extractor.meta.js
// ==/UserScript==
// Temporarily using github directly due to issues
// @require     https://gitcdn.xyz/repo/evidentpoint/buffer-image-size/92d014e394c05542c320c94c7d7f2b23ad449330/lib/index.js
// No longer needed
// @grant unsafeWindow
// @require https://gitcdn.xyz/repo/nodeca/pica/5.0.0/dist/pica.min.js
// FIXME: GM4 compatibility
// TODO: Amazon search?
// Manga only search query component (Does this work with Kindel? No?)
// rh=n%3A465392%2Cn%3A466280%2Cp_n_srvg_2374648051%3A86141051
// Search Title
// s?k=${MANGA_TITLE}
// s?k=こちらラスボス
// Title List document.querySelectorAll('[data-component-type="s-search-results"] .s-result-list.s-search-results > div a img')
// Preview Image List document.querySelectorAll('[data-component-type="s-search-results"] .s-result-list.s-search-results > div h2 > a')
// AmazonID = document.querySelectorAll('[data-component-type="s-search-results"] .s-result-list.s-search-results > div').dataset.asin
// Link = `https://www.amazon.co.jp/dp/${AmazonID}`
/* AMAZON Volume Page Cover Search
// Comic version
P.when("ImageBlockATF").execute((b)=>{console.log(b.imageGalleryData[0].mainUrl)}) ;
console.log(document.querySelectorAll('.sims-fbt-image'));
// Kindel version

Object.values(document.querySelectorAll('.a-carousel [data-a-dynamic-image]')).map(e=>e.src.match(/\/I\/([^.]+).*\.([^.]+)$/)).filter(e=>e!=undefined).filter(([,id,ext])=>id.startsWith('91')).map(([,id,ext])=>`https://images-na.ssl-images-amazon.com/images/I/${id}.${ext}`).map(url=>{const img = document.createElement('img')
img.crossOrigin = "Anonymous"
//fetch(url).then((r)=>r.blob()).then(b=>img.src= URL.createObjectURL(b))
img.src=url
return img}).map(img=>{document.body.appendChild(img)
return img})


// Combined
//let comicImg
//P.when("ImageBlockATF").execute((b)=>{comicImg=b.imageGalleryData[0].mainUrl}) ;
Object.values(
//[
//comicImg
//...document.querySelectorAll('img.sims-fbt-image')
//,...document.querySelectorAll('.a-carousel img[data-a-dynamic-image]')
//]
document.querySelectorAll('img')
).map(e=>e.src.match(/\/I\/([^.]+).*\.([^.]+)$/)).filter(e=>e!=undefined).filter(([,id,ext])=>id.match(/^[6789]1/)!=undefined).map(([,id,ext])=>`https://images-na.ssl-images-amazon.com/images/I/${id}.${ext}`).map(url=>{const img = document.createElement('img')
img.crossOrigin = "Anonymous"
//fetch(url).then((r)=>r.blob()).then(b=>img.src= URL.createObjectURL(b))
img.src=url
return img}).map(img=>{document.body.appendChild(img)
return img})
/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["serialData","serialDataAll","serialDataOrig"] }] */

'use strict'

function compareImages(image1 ,image2 ,options) {
  return new Promise((resolve ,reject) => {
    resemble.compare(image1 ,image2 ,options ,(err ,data) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(data)
      }
    })
  })
}
async function imagePixelsAreComparable(coverP ,previewP ,requiredSimularityPercentage) {
  const misMatchThreashold = 100 - (requiredSimularityPercentage * 100)
  const cover = await coverP
  const preview = await previewP
  return new Promise((res ,rej) => {
    resemble.compare(cover ,preview ,{ misMatchThreashold } ,(err ,data) => {
      if (err) {
        return rej(err)
      }
      console.log(`Comparing Images: ${data.rawMisMatchPercentage} >= ${misMatchThreashold}`)
      return res(data.rawMisMatchPercentage >= misMatchThreashold)
    })
  })
}
// declare function sizeOf(buffer: Buffer): ImageSizeInfo;
const ERROR_IMG = 'https://i.postimg.cc/4NbKcsP6/404.gif'
// const LOADING_IMG = 'https://i.redd.it/ounq1mw5kdxy.gif'
const LOADING_IMG = 'https://media1.tenor.com/images/de4defabd471cd1150534357644aeaf2/tenor.gif?itemid=12569177'
/*
  Error Classes
*/
// FIXME use class
// FIXME add undefined type
// FIXME use status message stack
let statusMessageCallback
function setStatusMessage(status) {
  if (statusMessageCallback !== undefined) statusMessageCallback(status)
}
class BookwalkerErrorBase extends Error {
  constructor(message ,isFatal ,shouldRemoveInterface) {
    super(message)
    this.name = 'BookwalkerErrorBase'
    this.isFatal = false
    this.shouldRemoveInterface = false
    if (isFatal !== undefined) this.isFatal = isFatal
    if (shouldRemoveInterface !== undefined) this.shouldRemoveInterface = shouldRemoveInterface
    setStatusMessage(this)
    console.error(message)
  }
}
class VolumeNameParseError extends BookwalkerErrorBase {
  constructor() {
    super(...arguments)
    this.name = 'VolumeNameParseError'
  }
}
class BookwalkerLinkError extends BookwalkerErrorBase {
  constructor(message ,serialDetails ,isFatal ,shouldRemoveInterface) {
    super(message ,isFatal ,shouldRemoveInterface)
    this.name = 'BookwalkerLinkError'
    this.serialDetails = serialDetails
  }
}
class BookwalkerSearchError extends BookwalkerErrorBase {
  constructor(message ,shouldRemoveInterface) {
    super(message ,true ,shouldRemoveInterface)
    this.name = 'BookwalkerLinkError'
  }
}
class PromiseIteratorEndError extends Error {
  constructor() {
    super(...arguments)
    this.name = 'PromiseIteratorEndError'
  }
}
class PromiseIteratorBreakError extends Error {
  constructor() {
    super(...arguments)
    this.name = 'PromiseIteratorBreakError'
  }
}
class PromiseIteratorContinueError extends Error {
  constructor() {
    super(...arguments)
    this.name = 'PromiseIteratorContinueError'
  }
}
class DebugableError extends Error {
  constructor(message ,object) {
    super(message)
    this.name = 'DebugableError'
    this.object = object
    console.error(object)
  }
}
/*
  Utilities
*/
function copyToClipboard(a) {
  const b = document.createElement('textarea')
  const c = document.getSelection()
  b.textContent = a
  document.body.appendChild(b)
  if (c) c.removeAllRanges()
  b.select()
  document.execCommand('copy')
  if (c) c.removeAllRanges()
  document.body.removeChild(b)
  console.log(`Copied '${a}'`)
}
function isUserscript() {
  if (window.unsafeWindow == null) {
    return false
  }
  return true
}
// taken from https://stackoverflow.com/a/20488304
function toAsciiEquivilent(str) {
  return str.replace(/[\uff01-\uff5e]/g ,ch => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
}
// Ignore CORS
function fetchNoCORS(url) {
  return new Promise((ret ,err) => {
    GM_xmlhttpRequest({
      method: 'GET'
      ,url
      ,onerror: err
      ,ontimeout: err
      ,onload: (response) => {
        if (response.status >= 200 && response.status <= 299) {
          return ret(response)
        }
        if (response.statusText && response.statusText.length > 0) return err(Error(response.statusText))
        return err(Error(response.status.toString()))
      }
    })
  })
}
function fetchDomNoCORS(url) {
  return fetchNoCORS(url).then((r) => {
    if (r.status >= 200 && r.status <= 299) {
      const parser = new DOMParser()
      const htmlDocument = parser.parseFromString(r.responseText ,'text/html')
      return Promise.resolve(htmlDocument.documentElement)
    }
    if (r.statusText && r.statusText.length !== 0) return Promise.reject(Error(r.statusText))
    return Promise.reject(Error(r.status.toString()))
  })
}
function fetchDom(url) {
  return fetchDomNoCORS(url)
  /* return fetch(url).then((r) => {
      if (r.ok) {
        return r.text().then((html) => {
          const doctype = document.implementation.createDocumentType('html' ,'' ,'')
          const dom = document.implementation.createDocument('' ,'html' ,doctype)
          dom.documentElement.innerHTML = html
          return dom.documentElement
        })
      }
      return Promise.reject(r.statusText)
    }) */
}
// Image Utilities
function isComparableAspectRatio(coverNaturalWidth ,coverNaturalHeight ,previewNaturalWidth ,previewNaturalHeight ,tollerance = 1) {
  // Reject failed images
  if (coverNaturalWidth === 0 || coverNaturalHeight === 0) {
    return false
  }
  // const previewNaturalWidth = preview.naturalWidth
  // const previewNaturalHeight = preview.naturalHeight
  const widthDelta = previewNaturalWidth / coverNaturalWidth
  const convertW = coverNaturalWidth * widthDelta
  const convertH = coverNaturalHeight * widthDelta
  if (previewNaturalHeight > convertH + tollerance || previewNaturalHeight < convertH - tollerance) {
    return false
  }
  return true
}
// Ignore CORS
// FIXME cache 1 seriese worth of images.
// OR do not reload page when uploading.
function getImageBlobIgnoreCORS(url) {
  return new Promise((ret ,err) => {
    GM_xmlhttpRequest({
      method: 'GET'
      ,url
      ,responseType: 'blob'
      ,onerror: err
      ,ontimeout: err
      ,onload: (response) => {
        if (response.status >= 200 && response.status <= 299) {
          return ret(response.response)
        }
        return err(response)
      }
    })
  })
}
/*
  Bookwalker Utilities
*/
function getCoverUrlFromRID(rid) {
  return `https://c.bookwalker.jp/coverImage_${rid}.jpg`
}
function getVolumePageFromSeriesPage(doc) {
  const volumePage = doc.querySelector('.overview-synopsis-hdg > a')
  if (volumePage) {
    return fetchDom(volumePage.href)
  }
  return Promise.reject(Error('No volume pages found'))
}
function getCoverImgElmsFromVolumePage(doc) {
  const volumeContainerElms = doc.querySelectorAll('.detail-section.series .cmnShelf-list')
  const imgs = []
  volumeContainerElms.forEach((list) => {
    list.querySelectorAll('.cmnShelf-item').forEach((e) => {
      const img = e.querySelector('.cmnShelf-image > img')
      if (img) {
        imgs.push(img)
      }
    })
  })
  return imgs
}
function getIdFromImg(img) {
  return img.src.split('/')[3]
}
async function toImgPromiseIgnoreCORS(uri) {
  const img = document.createElement('img')
  img.crossOrigin = 'anonymous'
  let src
  if (uri instanceof Blob) {
    src = URL.createObjectURL(uri)
  }
  else if (uri instanceof Promise) {
    src = URL.createObjectURL(await uri)
  }
  else if (typeof (uri) === 'string') {
    src = uri
  }
  else if (typeof (uri) === 'object' && uri.tagName === 'IMG') {
    // FIXME double fetch
    src = uri.src
  }
  else {
    return Promise.reject(Error(`Invalid URI '${uri}'`))
  }
  return new Promise((ret ,err) => {
    img.onload = () => {
      URL.revokeObjectURL(src)
      ret(img)
    }
    img.onerror = (e) => {
      URL.revokeObjectURL(src)
      err(Error(e.toString()))
    }
    img.src = src
  })
}
function searchBookWalkerForMangaTitle(manga) {
  // cat 2 = manga
  return fetchDomNoCORS(`https://bookwalker.jp/search/?qcat=2&word=${encodeURIComponent(manga)}`)
    .catch((err) => {
      // FIXME copy stack?
      throw new BookwalkerSearchError(`Bookwalker search for '${manga}' failed: ${err.message}`)
    })
    .then(doc => Object.values(doc.querySelectorAll('.bookItem'))
      .map(bookItem => bookItem.querySelector('[class*="bookItemHover"]'))
      .filter((bookItemHover) => {
        // NOTE: only becomes more lenient if no matches found
        if (bookItemHover) {
          if (bookItemHover.title.includes(manga)) return true
          if (toAsciiEquivilent(bookItemHover.title).replace(/\s/ ,'').includes(toAsciiEquivilent(manga).replace(/\s/ ,''))) return true
        }
        return false
      }))
    .then((bookItems) => {
      if (bookItems.length === 1) {
        const { url } = bookItems[0].dataset
        if (url) return Promise.resolve(url)
        return Promise.reject(new BookwalkerSearchError('Manga Match found but failed to find Seriese/Volume URL'))
      }
      return Promise.reject(new BookwalkerSearchError('Multiple Matching Manga Found!'))
    })
}
function toImgPromise(uri) {
  let img = document.createElement('img')
  img.crossOrigin = 'anonymous'
  let src
  if (uri instanceof Blob) {
    src = URL.createObjectURL(uri)
  }
  else if (typeof (uri) === 'string') {
    src = uri
  }
  else if (typeof (uri) === 'object' && uri.tagName === 'IMG') {
    img = uri
    src = uri.src
  }
  else {
    return Promise.reject(Error(`Invalid URI '${uri}'`))
  }
  return new Promise((ret ,err) => {
    img.onload = () => {
      URL.revokeObjectURL(src)
      return ret(img)
    }
    img.onerror = (e) => {
      URL.revokeObjectURL(src)
      return err(e)
    }
    if (img.complete) {
      return ret(img)
    }
    if (img.src !== src) img.src = src
  })
}
/* function toBuffer(ab: ArrayBuffer) {
  const buf = Buffer.alloc(ab.byteLength)
  const view = new Uint8Array(ab)
  for (let i = 0; i < buf.length; ++i) {
    buf[i] = view[i]
  }
  return buf
} */
function checkValidURL(url) {
  return new Promise((ret ,err) => {
    const request = GM_xmlhttpRequest({
      method: 'HEAD'
      ,url
      ,onerror: err
      ,ontimeout: err
      ,onload: (response) => {
        if (!(response.status >= 200 && response.status <= 299)) {
          return err(Error(response.statusText))
        }
        return ret(true)
      }
    })
  })
}
function getPartialBlob(url ,startByte ,endByte) {
  return new Promise((ret ,err) => {
    const request = GM_xmlhttpRequest({
      method: 'GET'
      ,url
      ,responseType: 'blob'
      ,onerror: err
      ,ontimeout: err
      ,headers: { Range: `bytes=${startByte}-${endByte !== undefined ? endByte : ''}` }
      ,onload: (response) => {
        if (!(response.status >= 200 && response.status <= 299)) {
          return err(Error(response.statusText))
        }
        return ret(response)
      }
    })
  })
}
async function getImgIncrementaly(url ,previewPromise ,imgPart = new Blob() ,downloadToCompletion = false) {
  // Downloads in 3 steps
  // Step 1: Validate existance
  // Step 2: Validate Dimensions
  // Step 3: Download Full image
  const startByte = imgPart.size
  let stopByte
  if (!downloadToCompletion) {
    // if (imgPart.size === 0) {
    //  stopByte = 1024
    // }
    // else {
    stopByte = imgPart.size + 65536
    // }
  }
  if (imgPart.size === 0) {
    // FIXME: Beter covention
    // Checks if url returns valid statu (200-299). Throws error otherwise
    // Relying on errors this way feels wrong
    // I should at least catch and rethrow, for fun.
    checkValidURL(url)
  }
  const preview = await previewPromise
  const previewNaturalWidth = preview.naturalWidth
  const previewNaturalHeight = preview.naturalHeight
  return getPartialBlob(url ,startByte ,stopByte)
    .then(async (response) => {
      // Ensure response sanity
      const rangeMatch = response.responseHeaders.match(/content-range: bytes (\d+)-(\d+)\/(\d+)/i)
      if (!rangeMatch) {
        throw new DebugableError('Could not determin blob partial range' ,response)
      }
      const [,start ,stop ,size] = rangeMatch
      const isFinished = parseInt(stop) >= parseInt(size) - 1
      // FIXME Check for overlaps
      imgPart = new Blob([imgPart ,response.response] ,{ type: response.response.type })
      // FIXME Faster method? But... cannot find GM supported library withour hacks
      let partialCoverImg
      try {
        partialCoverImg = await toImgPromiseIgnoreCORS(imgPart)
      }
      catch (err) {
        if (!isFinished) {
          throw new PromiseIteratorContinueError(err.toString())
        }
        throw err
      }
      if (partialCoverImg.naturalWidth === 0 || partialCoverImg.naturalHeight === 0) {
        if (!isFinished) {
          throw new PromiseIteratorContinueError('Cover Image width/height cannot be 0')
        }
        else {
          throw new Error('Cover Image width/height cannot be 0')
        }
      }
      // FIXME: Ensure full size metadata was recieved? is it possible to parse while missing bytes for dimension?
      if (isComparableAspectRatio(partialCoverImg.naturalWidth ,partialCoverImg.naturalHeight ,previewNaturalWidth ,previewNaturalHeight)) {
        if (isFinished) {
          return imgPart
        }
        return getImgIncrementaly(url ,previewPromise ,imgPart ,true)
      }
      // Specialized library. Use?
      /* const coverSizeInfo = sizeOf(toBuffer(response.arraybuffer))
        if (!coverSizeInfo && parseInt(stop) >= parseInt(size) - 1) {
          throw Error('Failed to parse cover size. No more data to download')
        }
        if (!coverSizeInfo) {
        // FIXME loop
          return ret(imgBuffer + LoopSelfSomehow(stop))
        }
        if (coverSizeInfo
        && coverSizeInfo.width
        && coverSizeInfo.height
        && isComparableAspectRatio(coverSizeInfo.width ,coverSizeInfo.height ,previewNaturalWidth ,previewNaturalHeight)) {
        // FIXME Fetch rest
          return ret(response.response)
        }
        */
      throw Error('Fetched invalid image aspect ratio!')
    })
    .then((b) => {
      if (b instanceof Blob) {
        return {
          img: toImgPromiseIgnoreCORS(b) ,blob: b
        }
      }
      return b
    })
    .catch((err) => {
      if (err instanceof PromiseIteratorContinueError) {
        return getImgIncrementaly(url ,previewPromise ,imgPart)
      }
      throw err
    })
}
async function getCoverFromRid(rid ,previewPromise) {
  const url = getCoverUrlFromRID(rid)
  // NOTE: onprogress/onreadystatechange do not set response unless readyState=4 (aka, loaded state)...
  // Using partial/range request as a workaround
  return getImgIncrementaly(url ,previewPromise)
  /* return getImageBlobIgnoreCORS(url)
      .then(b => ({
        img: toImgPromiseIgnoreCORS(b) ,blob: b
      })) */
}
function getRidFromId(id) {
  return parseInt(id.toString().split('').reverse().join(''))
}
function serializeImg(img) {
  const id = getIdFromImg(img)
  const previewBlob = getImageBlobIgnoreCORS(img.src)
  const serialData = {
    id
    ,serialLevel: 0 /* BASE */
    ,preview: toImgPromiseIgnoreCORS(previewBlob)
    ,previewBlob
    ,rid: getRidFromId(id)
    ,title: img.alt
  }
  // FIXME: definitly not the right go about this.
  // new Promise((upperRes) => {
  serialData.coverPromise = new Promise((res ,rej) => {
    serialData.coverResolver = res
    serialData.coverRejector = rej
    // return upperRes()
  })
  // }).then()
  return serialData
}
function getSerialDataFromVolumePage(doc) {
  const serialData = getCoverImgElmsFromVolumePage(doc).map(img => serializeImg(img))
  return serialData
}
function getSerialDataFromSeriesPage(doc) {
  setStatusMessage('Fetching BookWalker Volume Page')
  return getVolumePageFromSeriesPage(doc)
    .then(volDoc => getSerialDataFromVolumePage(volDoc))
}
function getSerialDataFromBookwalker(url ,doc) {
  if (url.match(/^(?:https?:\/\/)?.*bookwalker\.jp\/series\/\d+(\/.*)?/)) {
    return getSerialDataFromSeriesPage(doc)
  }
  if (url.match(/^(?:https?:\/\/)?.*bookwalker\.jp\/de[a-zA-Z0-9]+-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]+(\/.*)?/)) {
    return Promise.resolve(getSerialDataFromVolumePage(doc))
  }
  return Promise.reject(Error(`Bookwalker URL expected. Got '${url}'`))
}
function fetchCoverImageFromSerialData(serialDataOrig) {
  let serialData
  if (serialDataOrig.serialLevel === 2 /* COVER */) {
    if (serialDataOrig.fetchLocked === true) {
      return Promise.reject(Error('fetchLocked'))
    }
    serialData = serialDataOrig
  }
  else {
    serialDataOrig.ready = false
    serialDataOrig.fetchLocked = true
    serialDataOrig.fetchLockedId = 0
    if (serialDataOrig.serialLevel === 0 /* BASE */) {
      serialDataOrig.maxTries = 15
    }
    serialDataOrig.triesLeft = serialDataOrig.maxTries
    serialData = serialDataOrig
    serialData.serialLevel = 2 /* COVER */
  }
  serialData.fetchLocked = true
  serialData.fetchLockedId++
  const ourLock = serialData.fetchLockedId
  // Add 1 to rid. We will premptivly subtract one in out loop
  if (!serialData.ready) {
    serialData.rid++
  }
  serialData.ready = false
  // FIXME Work with CORS/Non-Userscript mode
  function loopRun(fn) {
    return fn()
      .catch((e) => {
        // FIXME type errors
        if (e.message !== 'Out of Tries') return loopRun(fn)
        return Promise.reject(e)
      })
  }
  return loopRun(() => {
    if (serialData.triesLeft <= 0) {
      serialData.fetchLocked = false
      return Promise.reject(Error('Out of Tries'))
    }
    serialData.triesLeft--
    serialData.rid--
    setStatusMessage(`Testing BookWalker Cover: ${serialData.rid}`)
    return getCoverFromRid(serialData.rid ,serialData.preview)
      .then(async ({ img ,blob }) => {
        serialData.cover = img
        const preview = await serialData.preview
        const previewNaturalWidth = preview.naturalWidth
        const previewNaturalHeight = preview.naturalHeight
        const cover = await serialData.cover
        const coverNaturalWidth = cover.naturalWidth
        const coverNaturalHeight = cover.naturalHeight
        if (!isComparableAspectRatio(coverNaturalWidth ,coverNaturalHeight ,previewNaturalWidth ,previewNaturalHeight)) {
          return Promise.reject(Error('Invalid Aspect Ratio'))
          // return Promise.reject(Error('Invalid Aspect Ratio'))
        }
        if (blob) serialData.blob = blob
        img.then(() => {
          if (serialData.coverResolver) {
            setStatusMessage('Covers Found!')
            return serialData.coverResolver(img)
          }
          return Promise.reject(Error('Cover Resolver failed to initialize before images were found!'))
        })
        // this should never happen. else isComparableAspectRatio would fail
        img.catch(() => {
          if (serialData.coverRejector) return serialData.coverRejector(img)
          return Promise.reject(Error('Cover Rejector failed to initialize and an attempt to use it was made!'))
        })
        serialData.ready = true
        serialData.fetchLocked = false
        return serialData
      })
  })
}
function getExistingCoversFromMD() {
  return Object.values(document.querySelectorAll('.edit div[id^="volume_"]')).map((e) => {
    if (e.id) return e.id.match(/volume_(.*)/)[1]
    throw Error('Failed to find volume Id from MD cover image')
  })
}
function getSerieseDetailsFromMD(mangadexId) {
  return fetch(`https://mangadex.org/api/manga/${mangadexId}`)
    .then((r) => {
      if (r.ok) {
        return r.json().then(j => j)
      }
      return Promise.reject(r.statusText)
    })
}
function getTitleIdFromMD() {
  const m = window.location.href.match(/^https?:\/\/(?:www\.)?mangadex\.org\/title\/(\d+)(?:\/.*)?$/)
  if (m) {
    return parseInt(m[1])
  }
  throw Error('No MD Title ID Found')
}
function filterBwLink(url) {
  const series = url.match(/^((?:https?:\/\/)?bookwalker\.jp\/series\/\d+)(\/.*)?/)
  if (series) return series[1]
  const volume = url.match(/^((?:https?:\/\/)?bookwalker\.jp\/de[a-zA-Z0-9]+-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]+)(\/.*)?/)
  if (volume) return volume[1]
  return undefined
}
function japaneseConfidenceRating(str) {
  // Regex for matching Hirgana or Katakana (*)
  if (str.match(/[ぁ-んァ-ンｧ-ﾝﾞﾟ]/)) return 1
  // Regex for matching ALL Japanese common & uncommon Kanji (4e00 – 9fcf) ~ The Big Kahuna!
  if (str.match(/[一-龯]/)) return 0.8
  return 0
  // str.match(/[Ａ - ｚ]/)
  // Regex for matching Hirgana
  // str.match(/[ぁ-ん]/)
  // Regex for matching full-width Katakana (zenkaku 全角)
  // str.match(/[ァ-ン]/)
  // Regex for matching half-width Katakana (hankaku 半角)
  // str.match(/[ｧ-ﾝﾞﾟ]/)
  // Regex for matching full-width Numbers (zenkaku 全角)
  // str.match(/[０-９]/)
  // str.match(/[Ａ - ｚ]/)
  // str.match(/[ぁ - ゞ]/)
  // str.match(/[ァ - ヶ]/)
  // str.match(/[ｦ - ﾟ]/)
}
function getJapaneseTitlesFromMD() {
  const cont = document.querySelector('#content')
  if (cont) {
    return Object.values(cont.querySelectorAll('.fa-book')).map((e) => {
      // Parent has to exist. We are a child of cont after all
      if (e.parentElement.textContent) {
        const trimed = e.parentElement.textContent.trim()
        if (trimed.length > 0) return trimed
      }
      return undefined
    })
      .filter(e => e !== undefined) // Definitly defined now
      .sort((a ,b) => {
        const conf = japaneseConfidenceRating(b) - japaneseConfidenceRating(a)
        if (conf !== 0) return conf
        return b.length - a.length
      })
  }
  throw Error('Could not find MD Titles')
}
function getBW_CoversFromMD() {
  const id = getTitleIdFromMD()
  // FIXME why am I doing this again?
  let resolveAllSerialData
  let rejectAllSerialData
  const allSerialDataPromise = new Promise((r ,e) => {
    resolveAllSerialData = r
    rejectAllSerialData = e
  })
  let resolveBookwalkerSerieseUrl
  let rejectBookwalkerSerieseUrl
  const bookwalkerSerieseUrlPromise = new Promise((r ,e) => {
    resolveBookwalkerSerieseUrl = r
    rejectBookwalkerSerieseUrl = e
  })
  return getSerieseDetailsFromMD(id)
    .then((mangaDexDetails) => {
      // FIXME this is a little late... but until we parse the flag from current page, it will have to do
      createInterface(allSerialDataPromise ,bookwalkerSerieseUrlPromise)
      setStatusMessage('Checking for BookWalker link')
      // Try to get BW link from MD page
      if (mangaDexDetails.manga.links) {
        const { bw } = mangaDexDetails.manga.links
        if (bw) {
          const usableBw = filterBwLink(`https://bookwalker.jp/${bw}`)
          if (usableBw) {
            return Promise.resolve({
              bwLink: usableBw ,mangaDexDetails
            })
          }
          return Promise.reject(new BookwalkerLinkError(`Unusable Bookwalker Url Recieved! '${bw}'` ,mangaDexDetails))
        }
      }
      return Promise.reject(new BookwalkerLinkError('Bookwalker Url Not Found!' ,mangaDexDetails))
    })
    .then(({ bwLink ,mangaDexDetails }) => {
      setStatusMessage('Verifying Link is to a Manga!')
      return fetchDom(bwLink).then(dom => ({
        bwLink ,dom ,mangaDexDetails
      }))
    })
  // Error if non manga title
    .then(({ bwLink ,dom ,mangaDexDetails }) => {
      /*
        if (dom.querySelector('#detail-productInfo .work-tag-item a[href="https://bookwalker.jp/category/2/"]')) {
          return {
            bwLink ,dom ,mangaDexDetails
          }
        }
        */
      // Alternitivly, use
      /*
        const mainGenreElm = dom.querySelector('.detail-header-main .main-info .main-genre')
        let mainGenere
        if (mainGenreElm && mainGenreElm.textContent) mainGenere = mainGenreElm.textContent
        if (mainGenere) {
          if (mainGenere.match('マンガ')) {
            return {
              bwLink ,dom ,mangaDexDetails
            }
          }
          throw new BookwalkerLinkError(`Provided BookWalker Url is not a manga!「${mainGenere}}」!=「マンガ」` ,mangaDexDetails)
        }
        */
      // One more try
      const categoryElm = dom.querySelector('.bw_link-breadcrumb li.breadcrumb-item a[href^="https://bookwalker.jp/category/"]')
      let category
      if (categoryElm != null) category = categoryElm.textContent
      if (category != null) {
        if (category.match('マンガ')) {
          return {
            bwLink ,dom ,mangaDexDetails
          }
        }
        throw new BookwalkerLinkError(`Provided BookWalker Url is not a manga!「${category}}」!=「マンガ」` ,mangaDexDetails)
      }
      throw new BookwalkerLinkError('Failed to determine if BookWalker link is to a manga!' ,mangaDexDetails ,true)
    })
  // Chose Title to Search Bookwalker for if link is not provided or link is invalid
    .catch((err) => {
      if (!(err instanceof BookwalkerLinkError) || err.isFatal) {
        throw err
      }
      const mangaDexDetails = err.serialDetails
      if (mangaDexDetails.manga.lang_flag !== 'jp') {
        return Promise.reject(new BookwalkerLinkError(`Bookwalker is for Japanese Manga Only. This is '${mangaDexDetails.manga.lang_name}'` ,mangaDexDetails ,true ,true))
      }
      // Try auto-search
      const titles = getJapaneseTitlesFromMD()
      // FIXME do not just assume 1st result is correct
      if (titles && titles[0]) {
        setStatusMessage(`Searching BookWalker for '${titles[0]}'`)
        return searchBookWalkerForMangaTitle(titles[0]).then((searchRes) => {
          // This will be a seriese link if more than 1 volume is out
          // Else it will be a volume link
          const usableBw = filterBwLink(searchRes)
          if (usableBw) {
            setStatusMessage(`BookWalker Search resolved to '${usableBw}'`)
            return fetchDom(usableBw).then((dom) => {
              if (usableBw.startsWith('https://bookwalker.jp/series')) {
                resolveBookwalkerSerieseUrl(usableBw)
              }
              else {
                const seriesBreadcrumb = dom.querySelector('.bw_link-breadcrumb li.breadcrumb-item a[href^="https://bookwalker.jp/series/"]')
                if (seriesBreadcrumb && seriesBreadcrumb.href && seriesBreadcrumb.href.length !== 0) {
                  const seriesLink = filterBwLink(seriesBreadcrumb.href)
                  if (seriesLink) resolveBookwalkerSerieseUrl(seriesLink)
                }
              }
              // NOTE: Double resolve is safe atm BECAUSE it is a promise
              // If we move to another callback, be sure to fix this
              resolveBookwalkerSerieseUrl(usableBw)
              return Promise.resolve({
                bwLink: usableBw ,dom ,mangaDexDetails
              })
            })
          }
          return Promise.reject(new BookwalkerLinkError(`Search Gave Unusable Bookwalker Url! '${searchRes}'` ,mangaDexDetails ,true))
        })
      }
      return Promise.reject(new BookwalkerLinkError('Failed to find Bookwalker URL!' ,mangaDexDetails ,true))
    })
  // Load Serial Details
    .then(({ bwLink ,dom }) => getSerialDataFromBookwalker(bwLink ,dom))
  // Add on volume number, if possible
    .then((serialDataAll) => {
      serialDataAll.forEach((serialData) => {
        try {
          serialData.volumeNumber = toVolumeNumber(serialData.title)
        }
        catch { }
      })
      return serialDataAll
    })
  // NOTE: This filter awaits all preview images. Then REMOVES serial data with identicle previews
    .then((serialDataAll) => {
      setStatusMessage('Filtering out duplicate volume covers for same volume')
      function loopRun(fn) {
        return fn().then(serialData => loopRun(fn))
      }
      let idx = 0
      const resSerial = []
      return loopRun(() => {
        const serialData1 = serialDataAll[idx]
        idx++
        if (!serialData1) return Promise.reject(new PromiseIteratorEndError('Out of IDXs'))
        let idx2 = idx
        return loopRun(async () => {
          const serialData2 = serialDataAll[idx2]
          idx2++
          if (!serialData2) return Promise.reject(new PromiseIteratorEndError('Out of IDXs'))
          // Ignore/Skip diffrent volumes
          if (serialData1.volumeNumber !== serialData2.volumeNumber) return Promise.resolve(resSerial)
          // Compare Image size
          const [previewImg1 ,previewImg2] = [await serialData1.preview ,await serialData2.preview]
          if (previewImg1.naturalWidth !== previewImg2.naturalWidth) return Promise.resolve(resSerial)
          if (previewImg1.naturalHeight !== previewImg2.naturalHeight) return Promise.resolve(resSerial)
          // WARNING! same cover & visual same preview (for volume on sale compared to normal volume preview)
          // are generating 13% diffrence. 13%, however, is far more than large enough for false positives
          // Unexpected since preview was generated by same site
          return imagePixelsAreComparable(serialData1.previewBlob ,serialData2.previewBlob ,0.98)
            .then((b) => {
              if (!b) {
                throw new PromiseIteratorBreakError('Duplicate Found')
              }
              return resSerial
            })
        }).then(() => {
          resSerial.push(serialData1)
          return resSerial
        })
          .catch((e) => {
            if (e instanceof PromiseIteratorBreakError) return resSerial
            if (e instanceof PromiseIteratorEndError) {
              resSerial.push(serialData1)
              return resSerial
            }
            throw e
          })
      })
        .catch(() => resSerial)
    })
    .then((serialDataAll) => {
      serialDataAll.forEach((serialData) => {
        serialData.mangadexId = id
        serialData.mangadexCoverIds = getExistingCoversFromMD()
        const currentChapterCover = Object.values(document.querySelectorAll('#content .card .card-body a img')).filter(e => e.src.match(/^(?:https?:\/\/)?(?:mangadex\.org)?\/images\/manga/))[0]
        if (currentChapterCover) serialData.mangadexCurrentCover = Promise.resolve(currentChapterCover)
        try {
          serialData.volumeDecimal = toVolumeDecimal(serialData ,serialDataAll)
        }
        catch { }
        try {
          serialData.volumeLevel = toVolumeLevel(serialData ,serialDataAll)
        }
        catch { }
      })
      return serialDataAll
    })
    .then((serialDataAll) => {
      resolveAllSerialData(serialDataAll)
      function loopRun(fn) {
        return fn().then(() => loopRun(fn)).catch(() => { })
      }
      let idx = 0
      const serialDataAllSortedByLevel = serialDataAll.slice().sort((a ,b) => a.volumeLevel - b.volumeLevel)
      loopRun(() => {
        if (serialDataAllSortedByLevel[idx]) {
          return fetchCoverImageFromSerialData(serialDataAllSortedByLevel[idx]).then(() => idx++)
        }
        return Promise.reject(Error('Out of Idxs'))
      })
    })
}
function listUploadBtn(serialData ,volumeNumber ,filename) {
  const { blob } = serialData
  const form = document.querySelector('#manga_cover_upload_form')
  if (!form) {
    throw Error('No Cover Upload Form Found')
  }
  const fileNameField = form.querySelector("input[name='old_file']")
  if (!fileNameField) {
    throw Error('No Cover File Name Field Found')
  }
  fileNameField.value = filename
  const volumeNameField = form.querySelector("input[name='volume']")
  if (!volumeNameField) {
    throw Error('No Cover Volume Field Found')
  }
  volumeNameField.classList.remove('bg-danger')
  volumeNameField.classList.remove('bg-warning')
  volumeNameField.classList.remove('bg-success')
  if (volumeNumber !== '') volumeNameField.value = volumeNumber
  if (volumeNumber !== '') {
    try {
      if (serialData.volumeLevel === 0 /* NEW */) volumeNameField.classList.add('bg-success')
      else if (serialData.volumeLevel === 2 /* CONTESTED */) volumeNameField.classList.add('bg-warning')
      else if (serialData.volumeLevel === 3 /* UPLOADED */) volumeNameField.classList.add('bg-danger')
    }
    catch (e) {
      console.warn(e)
    }
  }
  const uploadBtn = form.querySelector('#upload_cover_button')
  if (!uploadBtn) {
    throw Error('No Submit Button Found')
  }
  const fileField = form.querySelector("input[type='file']")
  if (!fileField) {
    throw Error('No Cover File Field Found')
  }
  const dt = new DataTransfer() // specs compliant (as of March 2018 only Chrome)
  dt.items.add(new File([blob] ,filename))
  fileField.files = dt.files
  const showDiagBtn = document.querySelector('a[data-target="#manga_cover_upload_modal"]')
  if (showDiagBtn) showDiagBtn.click()
  return undefined
}
function blobPost(mangadexId ,volume ,blob ,filename) {
  if (!['image/png' ,'image/jpeg' ,'image/gif'].includes(blob.type)) {
    throw Error(`Unsupported Image Format '${blob.type}'`)
  }
  if (volume.trim() === '') {
    throw new VolumeNameParseError(`Invalid Volume Number '${volume}'`)
  }
  const formData = new FormData()
  formData.append('volume' ,volume)
  formData.append('old_file' ,filename)
  formData.append('file' ,blob ,filename)
  // unsafeWindow.formData = formData
  // return undefined
  fetch(`https://mangadex.org/ajax/actions.ajax.php?function=manga_cover_upload&id=${mangadexId}` ,{
    credentials: 'include'
    ,headers: {
      // 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:70.0) Gecko/20100101 Firefox/70.0'
      // ,'Accept': '*/*'
      // ,'Accept-Language': 'en-US,en;q=0.5'
      'cache-control': 'no-cache'
      ,'X-Requested-With': 'XMLHttpRequest'
      // ,'Content-Type': 'multipart/form-data; boundary=---------------------------157450823414663905041102867756'
    }
    ,referrer: `https://mangadex.org/title/${mangadexId}/ijiranaide-nagatoro-san/covers/`
    ,body: formData
    ,method: 'POST'
    ,mode: 'cors'
  })
}
/*
  Interface
*/
function toVolumeNumber(title) {
  // FIXME regex delete BookWalker seriese title out prior to search
  // NOTE. Chapter number is sometimes placed in middle of title...
  let volumeMatch = toAsciiEquivilent(title).match(/\((\d+(?:\.\d+)?)\)$/)
  if (!volumeMatch) volumeMatch = toAsciiEquivilent(title).match(/\D(\d+(?:\.\d+)?)$/)
  if (!volumeMatch) volumeMatch = toAsciiEquivilent(title).match(/\D(\d+(?:\.\d+)?)\D*?$/)
  let volume
  if (volumeMatch) {
    [,volume] = volumeMatch
  }
  if (volume) return volume
  throw new VolumeNameParseError(`Failed to parse volume number for title '${title}'`)
}
function toVolumeDecimal(serialData ,allSerialData) {
  let volumeNumber
  try {
    volumeNumber = toVolumeNumber(serialData.title)
    // Consider checking if we already have a decimal place?
    if (allSerialData) {
      const decimalPlace = allSerialData.filter(e => toVolumeNumber(e.title) === volumeNumber)
        .indexOf(serialData)
      if (decimalPlace !== 0) {
        volumeNumber = `${volumeNumber}.${decimalPlace}`
      }
    }
  }
  catch (e) {
    // Failed to calculate decimal place
    console.log(e)
  }
  return volumeNumber
}
function toVolumeLevel(serialData ,allSerialData) {
  let volumeLevel = 1 /* UNKNOWN */
  if (serialData.mangadexId !== undefined) {
    try {
      const volumeNumber = toVolumeDecimal(serialData ,allSerialData)
      let volumeNumberIsSane = true
      // FIXME Multiple covers same volume needs work
      try {
        // Ensure we do not already have a decimal place
        if (allSerialData) {
          if (volumeNumber) {
            if (parseInt(volumeNumber) > 2
                            && !allSerialData.find(e => parseInt(toVolumeNumber(e.title)) === parseInt(volumeNumber) - 1)) volumeNumberIsSane = false
          }
          else volumeNumberIsSane = false
        }
      }
      catch (e) {
        // Failed to calculate decimal place
        console.log(e)
      }
      if (volumeNumberIsSane && volumeNumber) {
        const hasVolume = serialData.mangadexCoverIds.map((e) => {
          // Prefers IDK state 2 over Do Not Upload state 1 and Do upload state 0
          if (e === volumeNumber) return 1
          if (parseInt(e) === parseInt(volumeNumber)) return 2
          return 0
        }).sort((a ,b) => b - a)[0]
        if (hasVolume === 0 || hasVolume === undefined) volumeLevel = 0 /* NEW */
        else if (hasVolume === 2) volumeLevel = 2 /* CONTESTED */
        else if (hasVolume === 1) volumeLevel = 3 /* UPLOADED */
      }
    }
    catch (e) {
      console.warn(e)
    }
  }
  return volumeLevel
}
function createSingleInterface(serialData ,allSerialData) {
  const cont = document.createElement('div')
  const titleInfoContainer = document.createElement('div')
  const imageInfoContainer = document.createElement('div')
  const title = document.createElement('h4')
  const sizeInfo = document.createElement('small')
  const coverCont = document.createElement('div')
  const cover = document.createElement('img')
  const copy = document.createElement('button')
  const next = document.createElement('button')
  const controls = document.createElement('div')
  controls.appendChild(copy)
  controls.appendChild(next)
  controls.style.position = 'relative'
  controls.style.display = 'flex'
  copy.style.flexGrow = '1'
  copy.style.whiteSpace = 'normal'
  copy.type = 'button'
  copy.classList.add('btn' ,'btn-secondary')
  next.style.flexGrow = '1'
  next.style.whiteSpace = 'normal'
  next.type = 'button'
  next.classList.add('btn' ,'btn-secondary')
  coverCont.style.position = 'relative'
  // title.style.wordWrap = 'anywhere'
  // FIXME: Hacky way to format MD and BW. Should just set fontsize em
  title.classList.add('h6')
  titleInfoContainer.appendChild(title)
  imageInfoContainer.appendChild(sizeInfo)
  const coverDisplayWidth = 200
  controls.style.width = `${coverDisplayWidth}px`
  coverCont.style.width = `${coverDisplayWidth}px`
  coverCont.appendChild(cover)
  let preview
  serialData.preview.then((serialPreview) => {
    preview = serialPreview
    preview.width = Math.ceil(coverDisplayWidth / 4)
    preview.style.left = '5px' // `${-coverDisplayWidth}px`
    preview.style.position = 'absolute'
    preview.style.bottom = '5px' // `${(Math.ceil(expectedHeight/4)) - expectedHeight}px`
    preview.style.outlineWidth = '5px'
    preview.style.outlineStyle = 'none'
    const aspectDelta = preview.naturalWidth / coverDisplayWidth
    const expectedHeight = preview.naturalHeight * aspectDelta
    // coverCont.style.maxHeight=`${Math.ceil(expectedHeight)}px`
    // coverCont.style.minHeight=`${Math.ceil(expectedHeight)}px`
    coverCont.style.height = `${Math.ceil(expectedHeight)}px`
    coverCont.appendChild(preview)
  })
  // preview.style.zIndex=1
  coverCont.style.display = 'flex'
  cover.style.alignSelf = 'center'
  cover.style.outlineWidth = '5px'
  cover.style.outlineStyle = 'none'
  cover.style.width = '100%'
  titleInfoContainer.style.marginBottom = 'auto'
  ;[titleInfoContainer ,imageInfoContainer].forEach((info) => {
    info.style.display = 'flex'
    info.style.alignItems = 'center'
    info.style.flexDirection = 'column'
    cont.appendChild(info)
  })
  cont.style.marginLeft = '5px'
  cont.appendChild(coverCont)
  cont.appendChild(controls)
  cont.style.display = 'flex'
  cont.style.flexDirection = 'column'
  cont.style.width = `${coverDisplayWidth}px`
  next.innerText = 'Next'
  copy.innerText = 'Copy'
  const uploadBtn = copy.cloneNode()
  uploadBtn.innerText = 'Upload'
  // FIXME: do this once. reuse code
  // Only add Upload button if we are on mangadex's site
  if (serialData.mangadexId !== undefined) {
    if (serialData.volumeLevel === 0 /* NEW */) title.classList.add('text-success')
    else if (serialData.volumeLevel === 2 /* CONTESTED */) title.classList.add('text-warning')
    else if (serialData.volumeLevel === 3 /* UPLOADED */) title.classList.add('text-danger')
    controls.appendChild(uploadBtn)
  }
  let copyTimeout1
  let copyTimeout2
  function tryUpload() {
    if (serialData.serialLevel === 2 /* COVER */
            && serialData.blob && serialData.mangadexId !== undefined) {
      const imageTypeMatch = serialData.blob.type.match(/^image\/(.+)/)
      let volumeNumber = serialData.volumeDecimal
      if (serialData.volumeLevel === 1 /* UNKNOWN */) volumeNumber = ''
      if (serialData.volumeNumber === undefined) volumeNumber = ''
      if (imageTypeMatch !== null && volumeNumber !== null) {
        const imageType = imageTypeMatch[1]
        listUploadBtn(serialData ,volumeNumber ,`${serialData.title}.${imageType}`)
      }
    }
  }
  function tryCopy() {
    if (!copy.disabled) {
      cover.style.outlineStyle = 'double'
      cover.style.outlineColor = 'yellow'
      if (preview) {
        preview.style.outlineStyle = 'double'
        preview.style.outlineColor = 'yellow'
      }
      cover.style.zIndex = '1'
      copyToClipboard(getCoverUrlFromRID(serialData.rid))
      copy.innerText = 'Coppied!'
      clearTimeout(copyTimeout1)
      clearTimeout(copyTimeout2)
      copyTimeout1 = setTimeout(() => {
        copy.innerText = 'Copy'
      } ,2000)
    }
    else {
      cover.style.outlineStyle = 'solid'
      if (preview) {
        preview.style.outlineStyle = 'solid'
        preview.style.outlineColor = 'red'
      }
      cover.style.outlineColor = 'red'
      copy.innerText = 'Cannot Copy!'
    }
    copyTimeout2 = setTimeout(() => {
      cover.style.outlineStyle = 'none'
      if (preview) {
        preview.style.outlineStyle = 'none'
      }
      cover.style.zIndex = '0'
    } ,500)
  }
  copy.onclick = () => {
    tryCopy()
  }
  cover.onclick = () => {
    tryCopy()
  }
  uploadBtn.onclick = () => {
    tryUpload()
  }
  let lastBlobUri
  function revokeLastUri() {
    if (lastBlobUri !== undefined) {
      URL.revokeObjectURL(lastBlobUri)
      lastBlobUri = undefined
    }
  }
  cover.onload = revokeLastUri
  cover.onerror = revokeLastUri
  // NOTE: this is same serial data obj as above, just some more type narowing done.
  function updateCover(serialDataCover) {
    let url = getCoverUrlFromRID(serialDataCover.rid)
    revokeLastUri()
    if (serialDataCover.blob) {
      url = URL.createObjectURL(serialDataCover.blob)
      lastBlobUri = url
    }
    cover.src = url
    serialDataCover.coverPromise.then((coverImg) => {
      sizeInfo.innerText = `${coverImg.naturalWidth}×${coverImg.naturalHeight}`
      if (serialDataCover.mangadexCurrentCover) {
        serialDataCover.mangadexCurrentCover.then((mdChapterCover) => {
          sizeInfo.title = `MD Chapter Cover: ${mdChapterCover.naturalWidth}×${mdChapterCover.naturalHeight}`
          sizeInfo.classList.remove('text-danger')
          sizeInfo.classList.remove('text-warning')
          if (mdChapterCover.naturalWidth - 10 > coverImg.naturalWidth
                        || mdChapterCover.naturalHeight - 10 > coverImg.naturalHeight) {
            sizeInfo.classList.add('text-danger')
            sizeInfo.title = `Smaller than Chapter Cover: ${mdChapterCover.naturalWidth}×${mdChapterCover.naturalHeight}`
          }
          // TODO aspect ratio check
          else {
            // const coverImg = await serialData.cover
            const coverNaturalWidth = coverImg.naturalWidth
            const coverNaturalHeight = coverImg.naturalHeight
            if (!isComparableAspectRatio(coverNaturalWidth ,coverNaturalHeight ,mdChapterCover.naturalWidth ,mdChapterCover.naturalHeight ,10)) {
              sizeInfo.classList.add('text-warning')
              sizeInfo.title = `Chapter Cover Aspect Ratio Missmatch: ${mdChapterCover.naturalWidth}×${mdChapterCover.naturalHeight}`
            }
          }
          //  sizeInfo.title = `MD Aspect Ratio Missmatch: ${mdChapterCover.naturalWidth}×${mdChapterCover.naturalHeight}`
          // }
        })
      }
    }).catch()
  }
  function enable() {
    next.disabled = false
    copy.disabled = false
    uploadBtn.disabled = false
    next.innerText = 'Wrong Image?'
    copy.innerText = 'Copy'
  }
  function loading() {
    cover.src = LOADING_IMG
    sizeInfo.innerText = ''
    next.disabled = true
    copy.disabled = true
    uploadBtn.disabled = true
    next.innerText = 'Looking for Image'
  }
  function fail() {
    cover.src = ERROR_IMG
    sizeInfo.innerText = ''
    next.disabled = false
    copy.disabled = true
    uploadBtn.disabled = true
    next.innerText = 'Not Found! Retry?'
    serialData.rid = getRidFromId(serialData.id)
    serialData.triesLeft = serialData.maxTries
    serialData.ready = false
  }
  loading()
  title.innerText = serialData.title
  serialData.coverPromise.then(() => {
    updateCover(serialData)
    enable()
  }).catch(fail)
  next.onclick = () => {
    loading()
    fetchCoverImageFromSerialData(serialData).then((/* same serialData Object */) => {
      enable()
      updateCover(serialData)
    }).catch(fail)
  }
  return cont
}
function createInterface(allSerialDataPromise ,bookwalkerUrlPromise) {
  const cont = document.createElement('div')
  const copyAll = document.createElement('button')
  copyAll.type = 'button'
  copyAll.style.whiteSpace = 'normal'
  copyAll.style.display = 'flex'
  copyAll.style.flexGrow = '1'
  copyAll.style.flexDirection = 'column'
  copyAll.style.width = '100%'
  copyAll.style.outlineStyle = 'none'
  copyAll.style.outlineWidth = '5px'
  copyAll.style.outlineColor = 'yellow'
  copyAll.innerText = 'Copy All Cover URLs'
  copyAll.style.fontSize = '3em'
  copyAll.disabled = true
  copyAll.classList.add('btn')
  const copyBookwalkerUrl = copyAll.cloneNode()
  copyBookwalkerUrl.innerText = 'Copy BookWalker Series URL'
  copyBookwalkerUrl.classList.add('btn-primary')
  copyAll.classList.add('btn-secondary')
  // cont.style.marginLeft = '200px'
  cont.style.marginLeft = '35px'
  cont.style.marginRight = '35px'
  cont.style.display = 'flex'
  cont.style.flexWrap = 'wrap'
  cont.appendChild(copyAll)
  if (bookwalkerUrlPromise) {
    bookwalkerUrlPromise.then((url) => {
      let copyTimeout
      copyBookwalkerUrl.disabled = false
      cont.insertBefore(copyBookwalkerUrl ,copyAll)
      copyBookwalkerUrl.addEventListener('click' ,() => {
        // copyBookwalkerUrl.style.outlineStyle = 'double'
        copyBookwalkerUrl.style.zIndex = '1'
        copyBookwalkerUrl.innerText = 'Coppied BookWalker Series URL!'
        copyToClipboard(url)
        clearTimeout(copyTimeout)
        copyTimeout = setTimeout(() => {
          copyBookwalkerUrl.style.outlineStyle = 'none'
          copyBookwalkerUrl.innerText = 'Copy BookWalker Series URL'
          copyBookwalkerUrl.style.zIndex = '0'
        } ,2000)
      })
    })
  }
  statusMessageCallback = (status) => {
    if (status instanceof BookwalkerErrorBase) {
      copyAll.innerText = status.message
      if (status.isFatal) copyAll.classList.replace('btn-secondary' ,'btn-danger')
      if (status.shouldRemoveInterface) {
        copyAll.remove()
        // setTimeout(() => copyAll.remove() ,5000)
      }
    }
    else copyAll.innerText = status
  }
  allSerialDataPromise.then((allSerialData) => {
    copyAll.disabled = false
    let copyTimeout1
    function tryCopy() {
      if (!copyAll.disabled) {
        // copyAll.style.outlineStyle = 'double'
        copyAll.style.zIndex = '1'
        copyAll.innerText = 'Coppied All Cover URLs!'
        const urls = allSerialData.reduce((a ,e) => {
          if (e.ready) {
            return `${a}\n${getCoverUrlFromRID(e.rid)}`.trim()
          }
          return a
        } ,'')
        copyToClipboard(urls)
        clearTimeout(copyTimeout1)
        copyTimeout1 = setTimeout(() => {
          copyAll.style.outlineStyle = 'none'
          copyAll.innerText = 'Copy All Cover URLs'
          copyAll.style.zIndex = '0'
        } ,2000)
      }
    }
    copyAll.addEventListener('click' ,tryCopy)
    const faces = allSerialData.map(e => createSingleInterface(e ,allSerialData))
    faces.forEach((e) => {
      cont.appendChild(e)
    })
  })
  document.body.appendChild(cont)
  return cont
}
// Run On MD
if (window.location.href.match(/^(?:https?:\/\/)?mangadex\.org\/title\/\d+\/[^/]+\/covers(\/.*)?/)) {
  getBW_CoversFromMD()
    .catch((e) => {
      if (e instanceof Error) setStatusMessage(e.message)
      throw e
    })
}
// Run On BW
else if (window.location.href.match(/^https?:\/\/(?:www\.)?book/)) {
  const sideMenu = document.querySelector('.side-deals')
  if (sideMenu) sideMenu.remove()
  getSerialDataFromBookwalker(window.location.href ,document.documentElement)
    .then((serialData) => {
      createInterface(Promise.resolve(serialData))
      function loopRun(fn) {
        return fn().then(() => loopRun(fn)).catch(() => { })
      }
      let idx = 0
      loopRun(() => {
        if (serialData[idx]) {
          return fetchCoverImageFromSerialData(serialData[idx]).then(() => idx++)
        }
        return Promise.reject(Error('Out of Idxs'))
      })
    })
    .catch((e) => {
      if (e instanceof Error) setStatusMessage(e.message)
      throw e
    })
}
