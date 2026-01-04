// ==UserScript==
// @name         DB9 Auto-Thanks on Torrent Download
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Automatically says thanks when clicking a download button
// @author       ivylab
// @match        https://www.deepbassnine.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400096/DB9%20Auto-Thanks%20on%20Torrent%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/400096/DB9%20Auto-Thanks%20on%20Torrent%20Download.meta.js
// ==/UserScript==

(() => {
  'use strict'

  const downloadButtons = document.querySelectorAll('a#download')
  const thanksButton = document.querySelector('#thanksbutton')

  const thanksUrl = 'https://www.deepbassnine.com/torrents.php?action=thanks&groupid='
  const isTorrentGroupPage = !!thanksButton

  const downloadButtonClick = (e) => {
    if (isTorrentGroupPage) {
      thanksButton.click()
    } else {
      const torrentGroupId = e.target.parentNode.parentNode.parentNode.className.match(/groupid_(\d*)/)[1]
      fetch(thanksUrl + torrentGroupId)
    }
  }

  downloadButtons.forEach(button => button.addEventListener('click', downloadButtonClick))
})()