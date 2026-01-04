// ==UserScript==
// @name      Get m3u8 URL
// @name:en      Get m3u8 URL
// @namespace   Violentmonkey Scripts
// @match        https://missav.com/*
// @grant       none
// @icon  https://i.imgur.com/ufHwbFY.jpeg
// @description  获取网页中m3u8视频地址
// @description:en  获取网页中m3u8视频地址
// @version     1.2
// @license      MIT
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/502491/Get%20m3u8%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/502491/Get%20m3u8%20URL.meta.js
// ==/UserScript==

const purgeSpecialCharacters = (str) => str.replace(/[<>:"/|?*\x00-\x1F]/g, '')
const isM3u8Url = (url) => /\.m3u8$/.test(url.split('?')[0])

localStorage.setItem('m3u8Url', '')
localStorage.setItem('title', '')

const findTitleAndM3u8 = (m3u8Box, titleBox) => {
  let title = purgeSpecialCharacters(document.title)
  titleBox.innerText = title
  if (title === localStorage.getItem('title')) {
    m3u8Box.innerText = localStorage.getItem('m3u8Url')
    return
  }
  console.log('找到标题:', title)
  localStorage.setItem('title', title)

  const resources = window.performance.getEntries()
  for (const resource of resources) {
    const m3u8Url = resource.name
    if (isM3u8Url(m3u8Url)) {
      m3u8Box.innerText = m3u8Url
      console.log('找到m3u8:', m3u8Url)
      localStorage.setItem('m3u8Url', m3u8Url)
      return
    }
  }
  m3u8Box.innerText = '未找到m3u8地址'
  console.log('未找到m3u8地址')
}

const copyToClipboard = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => console.log('复制成功:', text))
    .catch((err) => console.error('复制失败:', err))
}

const createDynamicElement = (type, text, styles, onClick, onDblClick) => {
  const element = document.createElement(type)
  Object.assign(element.style, styles)
  element.innerText = text
  if (onClick) element.addEventListener('click', onClick)
  if (onDblClick) element.addEventListener('dblclick', onDblClick)
  return element
}

const getContainer = () => {
  let isVisible = true
  let isDragging = false
  let offsetX, offsetY

  const mainContainer = createDynamicElement('div', '', {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '10px',
    backgroundColor: '#C4B6D7',
    border: '2px solid black',
    zIndex: '9999',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    resize: 'both',
    overflow: 'auto',
    minWidth: '300px',
    minHeight: '200px',
  })

  const m3u8UrlBox = createDynamicElement(
    'div',
    '',
    {
      width: 'calc(100% - 20px)',
      margin: '5px 0',
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      backgroundColor: 'white',
      wordBreak: 'break-all',
      cursor: 'pointer',
    },
    () => copyToClipboard(m3u8UrlBox.innerText),
  )

  const titleBox = createDynamicElement(
    'div',
    '',
    {
      width: 'calc(100% - 20px)',
      margin: '5px 0',
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      backgroundColor: 'white',
      wordBreak: 'break-all',
      cursor: 'pointer',
    },
    () => copyToClipboard(titleBox.innerText),
  )

  const toggleButton = createDynamicElement(
    'button',
    '',
    {
      position: 'absolute',
      top: '5px',
      left: '5px',
      width: '20px',
      height: '20px',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
    },
    () => {
      isVisible = !isVisible
      mainContainer.style.display = isVisible ? 'flex' : 'none'
    },
  )

  const refreshButton = createDynamicElement(
    'button',
    '',
    {
      position: 'absolute',
      top: '5px',
      left: '30px',
      width: '20px',
      height: '20px',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
    },
    () => findTitleAndM3u8(m3u8UrlBox, titleBox),
  )

  toggleButton.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v4"/><path d="M7.998 9.003a5 5 0 1 0 8-.005"/><circle cx="12" cy="12" r="10"/></svg>'
  refreshButton.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>'

  mainContainer.addEventListener('mousedown', (e) => {
    isDragging = true
    offsetX = e.clientX - mainContainer.offsetLeft
    offsetY = e.clientY - mainContainer.offsetTop
  })

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      mainContainer.style.left = e.clientX - offsetX + 'px'
      mainContainer.style.top = e.clientY - offsetY + 'px'
    }
  })

  document.addEventListener('mouseup', () => {
    isDragging = false
  })

  mainContainer.style.paddingTop = '30px'
  mainContainer.appendChild(toggleButton)
  mainContainer.appendChild(refreshButton)
  mainContainer.appendChild(m3u8UrlBox)
  mainContainer.appendChild(titleBox)
  return mainContainer
}

const main = () => {
  const mainButton = createDynamicElement(
    'button',
    '',
    {
      position: 'fixed',
      width: '50px',
      height: '50px',
      borderRadius: '25px',
      backgroundColor: '#C4B6D7',
      top: '50%',
      right: '0',
      transform: 'translate(-50%, -50%)',
      zIndex: '9999',
      border: 'none',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      cursor: 'pointer',
    },
    () => {},
    showBox,
  )

  mainButton.innerHTML =
    '<div style="margin-inline: 12px"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg></div>'

  document.body.appendChild(mainButton)
}

const showBox = () => {
  const container = getContainer()
  const m3u8UrlBox = container.querySelectorAll('div')[0]
  const titleBox = container.querySelectorAll('div')[1]
  findTitleAndM3u8(m3u8UrlBox, titleBox)
  document.body.appendChild(container)
}

main()
