// ==UserScript==
// @name Ylilauta download button
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://gitcdn.xyz/repo/Stuk/jszip/9fb481ac2a294f9c894226ea2992919d9d6a70aa/dist/jszip.js
// @grant none
// @version 0.1
// @locale en
// @description Download all media from Ylilauta threads as zip
// @downloadURL https://update.greasyfork.org/scripts/39897/Ylilauta%20download%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/39897/Ylilauta%20download%20button.meta.js
// ==/UserScript==

const buttonsRight = document.querySelector('.buttons_right')
if (buttonsRight) {
  var btn = document.createElement('button')
  btn.innerText = 'Lataa kaikki!'
  btn.className = 'linkbutton'
  btn.onclick = () => downloadAll()
  buttonsRight.insertBefore(btn, buttonsRight.firstChild)
}

const downloadAll = () => {
  btn.disabled = 'disabled'
  btn.innerText = 'Ladataan...'
  const zip = new JSZip()
  const links = collectLinks()
  const promises = makePromises(links)
  Promise.all(promises)
    .then((responses) => {
      responses.map((response) => {
        const responseURL = response.url
        const filename = responseURL.substr(responseURL.lastIndexOf('/')+1, responseURL.length)
        const content = response.blob()
        zip.file(filename, content)
      })
      downloadZip(zip)
    }
  )
}

const makePromises = (links) => links.map((link) => fetch(link))

const collectLinks = () => Array.from(document.querySelectorAll('figcaption'))
    .map((caption) => caption.firstChild.href)
    .filter((link) => link.indexOf("/youtube.com/") === -1)

const downloadZip = (zip) => zip.generateAsync({type:'blob'})
  .then((content) => {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(content)

    const currentUrl = window.location.href
    const threadId = currentUrl.substr(currentUrl.lastIndexOf('/')+1, currentUrl.length)

    link.download = threadId+'.zip'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    btn.innerText = "Lataa kaikki!"
    btn.disabled = false
  })