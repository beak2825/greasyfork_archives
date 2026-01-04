// ==UserScript==
// @name        hotleak.vip,thotporn.tv,leakedzone.com image scraper
// @namespace   Violentmonkey Scripts
// @match       https://hotleak.vip/*
// @match       https://thotporn.tv/*
// @match       https://leakedzone.com/*
// @version     1.8
// @author      -
// @license     MIT
// @description 13/12/2022, 4:02:01 pm
// @grant GM_registerMenuCommand
// @grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/456530/hotleakvip%2Cthotporntv%2Cleakedzonecom%20image%20scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/456530/hotleakvip%2Cthotporntv%2Cleakedzonecom%20image%20scraper.meta.js
// ==/UserScript==

const linksContainerStyle = `
  position:absolute;
  z-index:99999999;
  top:20px;
  left:20px;
  width:800px;
  height:600px;
  background-color:white;
  padding:10px;
  color:black;
  display:flex;
  flex-direction:column;
  overflow:scroll;
`

const createHTMLPageToCopy = (html) =>
  `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title></title>
  <style type="text/css">
    body{
      display: flex;
      flex-direction: column;
    }
    a {
      display: block;
      margin-bottom: 5px;
      width: fit-content;
    }
  </style>
</head>
<body>
  <h1>From: ${window.location.href} </h1>
  ${html}
</body>
</html>`

let idx = 0

function createLinksContainer(){
  const linksContainer = document.createElement('div')
  linksContainer.setAttribute('style', linksContainerStyle)
  linksContainer.setAttribute('id', 'getLinksTextarea')

  const info = document.createElement('div')
  info.setAttribute('style', 'margin-bottom:5px;')
  info.setAttribute('class', 'links-info')

  linksContainer.appendChild(info)

  document.body.appendChild(linksContainer)

  const closeButton = document.createElement('button')
  closeButton.textContent = 'Close'
  closeButton.setAttribute('id','closeButton')
  closeButton.setAttribute('style', `
    position:absolute;
    top:20px;
    left: 845px;
    z-index:999999991;
  `)
  closeButton.addEventListener('mouseup', () => {
    document.querySelector('#getLinksTextarea').remove()
    document.querySelector('#closeButton').remove()
    document.querySelector('#copyToClipboardButton').remove()
    idx = 0
  })
  document.body.appendChild(closeButton)

  const copyToClipboardButton = document.createElement('button')
  copyToClipboardButton.textContent = 'Copy To Clipboard'
  copyToClipboardButton.setAttribute('id','copyToClipboardButton')
  copyToClipboardButton.setAttribute('style', `
    position:absolute;
    top:60px;
    left: 845px;
    z-index:999999991;
  `)
  copyToClipboardButton.addEventListener('mouseup', () => {
    GM_setClipboard(createHTMLPageToCopy(linksContainer.innerHTML))
  })
  document.body.appendChild(copyToClipboardButton)

  return [linksContainer, info]
}

const userName = window.location.pathname.split('/')[1]

function findLinksOnPage(){
  return Array.from(document.querySelectorAll(`a[href*="${userName}/photo/"]`))
}

// Couldnt get auto downloading to work with GM_download. Dunno why.
// let images = []

// const createFilename = fileUrl => {
//   var u = new URL(fileUrl)
//   return u.pathname.slice(u.pathname.lastIndexOf('/')+1)
// }

// const downloadFile = fileUrl => new Promise((resolve, reject) => {
//   // alert(`name: ${createFilename(fileUrl)}`)
//   GM_download({url:fileUrl, name:createFilename(fileUrl), onload:() => {
//     // alert('finished download')
//     resolve()
//   }, onerror:(e) => {
//     alert(`error downloading ${e.toString()}`)
//     // reject()
//   }})
// })

const createLink = (url) => {
  const newLink = document.createElement('a')
  newLink.setAttribute('href', url)
  newLink.setAttribute('class', 'gm-links')
  newLink.setAttribute('title', 'gm-links')
  newLink.setAttribute('style', 'color:black;')
  newLink.textContent = url
  return newLink
}

const getImage = (link, imageLinks, infoElem, linksContainer, retry) => fetch(link).then(resp => resp.text()).then(resp => {
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(resp, 'text/html')
  const newImage = htmlDoc.querySelector('.light-gallery-item').getAttribute('data-src')
  idx = idx + 1
  infoElem.textContent = `Done ${idx} of ${imageLinks.length} (use DownThemAll to download)`
  linksContainer.appendChild(createLink(newImage))
})

async function getLinks(){
  const [linksContainer, infoElem] = createLinksContainer()

  const imageLinks = findLinksOnPage()


  window.scrollTo(0, 0)

  for (const link of imageLinks) {
    await getImage(link, imageLinks, infoElem, linksContainer)
    .catch(err => {
      // This actually seems to pause the promise!
      let confirmDialog = window.confirm(`An error occured.\nYou may need to refresh the page in another tab to pass the js test.\nClick Ok when done. \n\n Error: ${err.toString()}`)
      // Retry if they do the thing
      return confirmDialog ? getImage(link, imageLinks, infoElem, linksContainer).catch(err => console.error(err)) : Promise.reject('cancelled')
    })

  }

}

GM_registerMenuCommand('get links ', () => {
  getLinks().catch(err => console.error(err).then(() => {
    idx = 0
  }))
})









