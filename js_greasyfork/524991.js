// ==UserScript==
// @name        One Piece Fans Enhanced Reader
// @name:es     Lector Mejorado One Piece Fans
// @namespace   Violentmonkey Scripts
// @match       https://onepiece-fans2.net/*
// @match       https://one-piece-fans2.com/*
// @grant       none
// @version     1.6
// @author      donkikote
// @description Enhanced One Piece Fans reader
// @description:es Lector mejorado de One Piece Fans
// @grant GM.addElement
// @grant GM.addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM.xmlHttpRequest
// @grant GM.notification
// @grant GM.addValueChangeListener
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524991/One%20Piece%20Fans%20Enhanced%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/524991/One%20Piece%20Fans%20Enhanced%20Reader.meta.js
// ==/UserScript==

const enableDebugging = false

const doublePageWidth = 1565
const pageWidth = 780
const style = `
  nav {
    position: absolute;
    flex-wrap: wrap;
  }
  .fullmanga {
    display: flex;
    justify-content: center;
    overflow: visible;
  }
  .zoom-left {
    transform-origin: top left;
  }
  .zoom-right {
    transform-origin: top right;
  }
  .zoom {
    transform: scale(2);
  }
  .manga-container {
    flex-direction: row-reverse;
    flex-wrap: wrap;
    gap: 5px;
    max-width: ${doublePageWidth}px;
    overflow: visible;
  }
  .page-navigation {
    width: 40%;
    height: 100%;
    position: absolute;
  }
  .next-page {
    left: 0;
  }
  .prev-page {
    right: 0;
  }
  .prev-page:hover {
    background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.3));
  }
  .next-page:hover {
    background-image: linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,0.3));
  }
  .page-wrapper {
    position: relative;
    max-height: 100vh;
  }
  .page-wrapper img {
    max-height: 100vh;
  }
  .enhanced-nav {
    display: flex;
    grow: 4;
    gap: 1em;
  }
  button {
    background: #171717;
    color: #fff;
    text-transform: uppercase;
    padding: 0 1.5rem;
    height: 100%;
    border: none;
    border-radius: .35rem;
    outline: none;
  }
  button:hover {
    color: #f55;
    cursor: pointer;
  }
  button:disabled {
    color: #999;
    cursor: not-allowed;
  }
  .hex-selecthome button {
    font-size: .75rem;
    font-weight: 700;
    line-height: 3.5rem;
  }

`
const maxRetries = 60
const remoteStorageHost = 'https://keyvalue.immanuel.co/api/KeyVal'
const remoteKeyPrefix = 'MMER_'
const updated_at = 'updated_at'
const reading_status = 'reading_status'
const sync_key = 'sync_key'
const enhanced_nav_id = 'enhanced-nav'

const languageEditions = {
  es: ['todos', 'rioponeglyph-scan', 'quinto-scans', 'mugiwara-scans', 'full-color'],
  en: ['all', 'full-color']
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
const getSyncKey = () => GM_getValue(sync_key)
const setSyncKey = value => GM_setValue(sync_key, value)
const getChapterUrl = (language, edition, chapter) => `${window.location.protocol}//${window.location.host}/manga/${language}/${edition}/${chapter > 10 ? chapter : '0' + chapter}`
const isDoublePage = async () => (await getLoadedContainer()).getBoundingClientRect().width >= doublePageWidth
const zoomIn = async (horizontalAnchor = 'left') => {
  const classList = (await getLoadedContainer()).classList
  classList.remove('zoom-right', 'zoom-left')
  classList.add('zoom', `zoom-${horizontalAnchor}`)
}
const zoomOut = async () => (await getLoadedContainer()).classList.remove('zoom', 'zoom-left', 'zoom-right')
const refreshFocus = () => window.location.href = window.location.href


let chapterNumber
let language
let edition
let currentUrl
let lastUrl
let loaded = false
let debug = enableDebugging && GM_getValue('debug')
GM.addValueChangeListener('debug', (name, oldValue, newValue, remote) => {
  debug = newValue
  log("Debug:", debug)
  if (enableDebugging)
    document.getElementById('loggingPanel').style.display = debug ? 'block' : 'none'
})

function log(...args) {
  addLogLine(args.join(" "))
  console.log(...args)
}

function extractUrlData() {
  const url = window.location.href
  const match = /manga\/([^\/]+)\/([^\/]+)\/(\d+)(#.+)?$/.exec(url)
  language = match[1]
  edition = match[2]
  chapterNumber = Number(match[3])
}

function storeReadingStatus(currentUrl) {
  let readingStatus = GM_getValue(reading_status)
  if (!readingStatus) readingStatus = {}
  if (!readingStatus[language]) readingStatus[language] = {}
  if (!readingStatus[language][edition]) readingStatus[language][edition] = {}

  if (language && edition && chapterNumber && readingStatus[language][edition].chapter != chapterNumber) {
    if (!readingStatus[language]) readingStatus[language] = {}
    if (!readingStatus[language][edition]) readingStatus[language][edition] = {}
    readingStatus[language][edition] = {
      'chapter': chapterNumber ? chapterNumber : 1,
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

function mangaStatusKey(language, edition) {
  return `${remoteKeyPrefix}${language}_${edition}`
}

async function fetchReadingStatus(language, edition) {
  log("fetchReadingStatus ", language, edition)
  return await fetchKey(mangaStatusKey(language, edition))
}

async function uploadReadingStatus(language, edition) {
  const status = JSON.stringify(GM_getValue(reading_status)[language][edition])
  const statusBase64 = btoa(status)
  log("uploadReadingStatus ", language, edition, status)
  return await uploadKey(mangaStatusKey(language, edition), statusBase64)
}

async function syncAllReadingStatus() {
  log('Starting all editions sync...')
  for (let language in languageEditions) {
    let editions = languageEditions[language]
    for (let edition of editions) {
      syncReadingStatus(language, edition)
    }
  }
}

async function syncReadingStatus(language, edition) {
  if (!getSyncKey()) {
    console.info('Missing sync key. Skipping...')
    return
  }
  const response = await fetchReadingStatus(language, edition)
  if (response.status == 200) {
    const responseText = JSON.parse(response.responseText)
    if (responseText == '') {
      log('Upload status for the first time')
      storeReadingStatus()
      await uploadReadingStatus(language, edition)
    } else {
      const remoteStatus = JSON.parse(atob(responseText))
      const localStatus = GM_getValue(reading_status)
      if (!localStatus[language]) localStatus[language] = {}
      if (!localStatus[language][edition]) localStatus[language][edition] = {}
      const localMangaStatus = localStatus[language][edition]
      if (localMangaStatus && localMangaStatus.updated_at > remoteStatus.updated_at) {
        log('Upload status because is newer')
        await uploadReadingStatus(language, edition)
      } else if (!localMangaStatus || localMangaStatus.updated_at < remoteStatus.updated_at) {
        log('Store remote status in local')
        localStatus[language][edition] = remoteStatus
        GM_setValue(reading_status, localStatus)
        if (window.location.href.includes('/manga/') && localStatus[language][edition].chapter != chapterNumber) {
          window.location.href = getChapterUrl(language, edition, localStatus[language][edition].chapter)
        }
      }
    }
  } else {
    log('Error fetching remote status: ', response)
  }
}


async function getLoadedElement(getElementFunction) {
  let element
  let c = 0
  let notReady = true
  do {
    element = getElementFunction()
    c++
    notReady = !element || element.length == 0
    if (notReady) await sleep(1000)
  } while (notReady && c <= maxRetries)
  if (!element) {
    const functionString = getElementFunction.toString()
    if (debug && functionString.includes('loggingPanel'))
      console.log('Element not found', functionString) // To avoid recursion
    else
      log('Element not found', functionString)
  }
  return element
}

async function getLoadedContainer() {
  return getLoadedElement(() => document.getElementsByClassName('manga-container')[0])
}

async function getLoadedImages(container) {
  const imageArray = await getLoadedElement(() => container.getElementsByTagName('img'))
  const promiseArray = [];
  for (let i=0;i < imageArray.length;i++) {
    const image = imageArray[i]
    if (!image.complete) {
      promiseArray.push(new Promise(resolve => {
        image.addEventListener('load', () => resolve())
      }));
      image.addEventListener('error', async event => {
        log('Failed to load image ', i, event)
        window.location.reload()
      })
    }
  }

  await Promise.all(promiseArray); // wait for all the images to be loaded
  return imageArray;
}

async function getNav() {
  return await getLoadedElement(() => document.getElementsByTagName('nav')[0])
}

async function addNavUtils() {
  const nav = await getNav()
  let enhancedNav = document.getElementById(enhanced_nav_id)
  if (!enhancedNav) {
    enhancedNav = document.createElement('div')
    enhancedNav.id = enhanced_nav_id
    enhancedNav.classList.add('enhanced-nav')

    const syncGroup = GM.addElement(enhancedNav, 'form')
    const syncKeyInput = GM.addElement(syncGroup, 'input', {placeholder: 'Sync key'})
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
      if (language && edition) {
        syncReadingStatus(language, edition)
      } else {
        syncAllReadingStatus()
      }

      syncKeyApplyButton.disabled = false
      syncKeyAppliedText.style.opacity = 1
      await sleep(5000)
      syncKeyAppliedText.style.opacity = 0
      return false
    })
    if (enableDebugging) {
      const debugGroup = GM.addElement(enhancedNav, 'div')
      GM.addElement(debugGroup, 'span', {textContent: "DEBUG"})
      const debugCheckbox = GM.addElement(debugGroup, 'input', {type: 'checkbox'})
      debugCheckbox.checked = debug
      debugCheckbox.addEventListener('change', (event) => {
        GM_setValue('debug', event.currentTarget.checked)
      })
    }



    nav.insertBefore(enhancedNav, nav.getElementsByClassName('nav-right-items')[0])
  }
}

async function addLoggingPanel() {
  let loggingPanel = document.getElementById('loggingPanel')
  if (!loggingPanel) {
    const nav = await getNav()
    const main = nav.parentNode
    const loggingPanel = GM.addElement('div', {id: 'loggingPanel', class: 'loggingPanel'})
    main.insertBefore(loggingPanel, nav.nextSibling)
  }
}

async function addLogLine(message) {
  const loggingPanel = await getLoadedElement(() => document.getElementById('loggingPanel'))
  GM.addElement(loggingPanel, 'div', {class: 'logline', textContent: message})
}

async function addImageNavigation(container, chapterNumber) {
  const images = await getLoadedImages(container)
  const pagesCount = images.length
  let j = 0
  for (let i=0;i < pagesCount;i++, j++) {
    const image = images[i]
    const wrapper = GM.addElement(container, 'div', {'id': `page${j}`, 'class': 'page-wrapper'})
    container.replaceChild(wrapper, image)
    wrapper.appendChild(image)
    if (i > 0) GM.addElement(wrapper, 'a', {'href': `#page${j-1}`, 'class': `page-navigation prev-page`})
    else GM.addElement(wrapper, 'a', {'href': chapterNumber-1, 'class': `page-navigation prev-page`})
    if (image.getBoundingClientRect().width > pageWidth) {
      j++
      image.id = `page${j}`
    }
    if (i < pagesCount-1) GM.addElement(wrapper, 'a', {'href': `#page${j+1}`, 'class': `page-navigation next-page`})
    else GM.addElement(wrapper, 'a', {'href': chapterNumber+1, 'class': `page-navigation next-page`})
  }
  addKeyboardNavigation(j, chapterNumber+1)
}

async function enhancedReader() {
  if (!window.location.href.includes('/manga/')) return
  extractUrlData()
  syncReadingStatus(language, edition)
  storeReadingStatus()
  const container = await getLoadedContainer()
  if (!container) {
    console.error('Did not find the manga container')
    return
  }
  await addImageNavigation(container, chapterNumber)
  const firstPage = await getLoadedElement(() => document.getElementById('page0'))
  window.location.href = '#page0'
  firstPage.scrollIntoView()
}

async function addContinueButtons(container, language, before) {
  const selects = await getLoadedElement(() => container.getElementsByTagName('select'))
  const langReadingStatus = (GM_getValue(reading_status) || {})[language] || {}
  for (let select of selects) {
    let edition = select.id
    const chapter = langReadingStatus[edition]?.chapter || 1
    const button = GM.addElement('button', {
      textContent: `Resume ${chapter}`,
      class: 'resume-button'
    })
    button.onclick = () => window.location.href = getChapterUrl(language, edition, chapter)
    if (before) select.parentNode.insertBefore(button, select)
    else select.parentNode.appendChild(button)

  }
}

async function enhancedMainPage() {
  if (window.location.href.includes('/manga/')) return
  syncAllReadingStatus()
  const fansubContainers = await getLoadedElement(() => document.getElementsByClassName('fansub-container'))
  if (fansubContainers.length != 2) {
    console.warn('Unexpected page structure. Aborting enhanced main page')
    return
  }
  addContinueButtons(fansubContainers[0], 'es', false)
  addContinueButtons(fansubContainers[1], 'en', true)
}

function enhancedReaderObserver() {
  // Observe for chapter changes and reload to rebuild reader
  const targetNode = document.getElementById('root')
  const config = { attributes: false, childList: true }
  const callback = (mutationList, observer) => {
    let currentUrl=window.location.href.split('#')[0]
    if (currentUrl != lastUrl) {
      loaded = false
      lastUrl = currentUrl
    }
    if (!loaded) {
      enhancedReader()
      enhancedMainPage()
    }
    loaded = true
  }
  new MutationObserver(callback).observe(targetNode, config)
}

function addKeyboardNavigation(pageCount, nextChapterUrl) {
  // Add lef/right keys navigation
  document.addEventListener('keydown', async function(event) {
    const currentUrl = window.location.href
    const urlSplit = currentUrl.split('#page')
    const cleanPage = urlSplit[0]
    const currentPage = urlSplit.length > 1 ? Number(urlSplit[1]) : 0
    const increment = (await isDoublePage()) ? 2 : 1
    const lastPage = pageCount-1
    const nextPage = currentPage == lastPage ? pageCount : Math.min(currentPage+increment, lastPage)
    const prevPage = Math.max(currentPage-increment, 0)
    console.log(document.body.scrollWidth)
    if(event.keyCode == 37) {
      if (nextPage < pageCount) {
        document.location.href = '#page'+nextPage
      } else {
        document.location.href = nextChapterUrl
      }
    }
    else if(event.keyCode == 39) { // Right
      document.location.href = '#page'+prevPage
    } else if (event.keyCode == 49) { // 1
      // Zoom in and move to the left
      await zoomIn('left')
      refreshFocus()
    } else if (event.keyCode == 50) { // 2
      // Zoom in and move to the right
      await zoomIn('right')
      refreshFocus()
    } else if (event.keyCode == 81) { // Q
      await zoomOut()
      refreshFocus()
    }
  });
}


addNavUtils()
addLoggingPanel()
GM.addStyle(style)
enhancedReader()
enhancedMainPage()
lastUrl = window.location.href.split('#')[0]
loaded = true
enhancedReaderObserver()
