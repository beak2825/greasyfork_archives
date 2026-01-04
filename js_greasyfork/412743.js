// ==UserScript==
// @name         DB9 Easier Download Buttons
// @description  Makes it easier to download a torrent by making the whole row act like the download button
// @namespace    ivylab
// @version      1.0.1
// @author       ivylab
// @match        https://www.deepbassnine.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412743/DB9%20Easier%20Download%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/412743/DB9%20Easier%20Download%20Buttons.meta.js
// ==/UserScript==

(() => {
  const torrents = [...document.querySelectorAll('#download')].map(torrent => torrent.closest('td'))

  torrents.forEach((torrent) => {
    const downloadButton = torrent.querySelector('#download')
    const isGoatpowerSkin = document.querySelector('link[title="goatpower"]')
    const isNotifyPage = document.location.href.match(/action=notify/)

    torrent.addEventListener('click', (e) => {
      if (e.target === torrent || e.target.className === 'tags') downloadButton.click()
    })

    torrent.style.setProperty('cursor', 'pointer')

    if (isGoatpowerSkin && isNotifyPage) {
      torrent.onmouseover = () => {
        torrent.parentNode.style.background = 'url("https://www.deepbassnine.com/static/styles/goatpower/images/bgblue.png")'
      }

      torrent.onmouseout = () => {
        torrent.parentNode.style.background = 'url("https://www.deepbassnine.com/static/styles/goatpower/images/bg2e.png")'
      }
    }
  })
})()
