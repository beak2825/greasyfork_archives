// ==UserScript==
// @name         Copy VGMdb Tracks
// @namespace    https://github.com/nini22P/monkey-script/tree/main/copy-vgmdb-tracks
// @version      2025-05-13
// @description  Copy tracks from VGMdb | 从 VGMdb 复制曲目
// @author       22
// @match        https://vgmdb.net/album/*
// @icon         https://vgmdb.net/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520098/Copy%20VGMdb%20Tracks.user.js
// @updateURL https://update.greasyfork.org/scripts/520098/Copy%20VGMdb%20Tracks.meta.js
// ==/UserScript==

(function () {
  'use strict'

  const createCopyButton = (tracklistIndex, discIndex) => {
    const button = document.createElement('button')
    button.innerText = 'COPY'
    button.style.margin = '0 10px'
    button.style.color = '#CEFFFF'
    button.style.background = 'transparent'
    button.style.border = '1px solid #CEFFFF'
    button.style.cursor = 'pointer'
    button.style.transition = 'background 0.3s, color 0.3s'

    button.onmouseover = () => {
      button.style.background = '#CEFFFF'
      button.style.color = '#000000'
    }

    button.onmouseout = () => {
      button.style.background = 'transparent'
      button.style.color = '#CEFFFF'
    }

    button.onmousedown = () => {
      button.style.transform = 'scale(0.95)'
    }

    button.onmouseup = () => {
      button.style.transform = 'scale(1)'
    }

    button.onclick = () => {
      const tracklistElement = document.querySelectorAll('.tl')[tracklistIndex].querySelectorAll('table')[discIndex]
      const rows = tracklistElement.querySelectorAll('tr')
      let tracklistText = []

      rows.forEach(row => {
        const trackNameCell = row.querySelector('td:nth-child(2)')
        if (trackNameCell) {
          if (trackNameCell.innerText.trim().length === 0) return
          if (['A-Side', 'B-Side'].includes(trackNameCell.innerText.trim())) return
          tracklistText = [...tracklistText, trackNameCell.innerText.trim()]
        }
      })

      navigator.clipboard.writeText(tracklistText.join('\n'))
    }

    return button
  }

  const tracklists = document.querySelectorAll('.tl')

  tracklists.forEach((tracklist, tracklistIndex) => {
    const discs = tracklist.querySelectorAll('span b')
    discs.forEach((title, discIndex) => {
      if (title) {
        const copyButton = createCopyButton(tracklistIndex, discIndex)
        title.appendChild(copyButton)
      }
    })
  })
})()
