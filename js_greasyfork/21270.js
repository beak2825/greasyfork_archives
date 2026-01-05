// ==UserScript==
// @name         動漫花園 Copy torrent link shortcut
// @namespace    https://github.com/whoisnull
// @version      0.4
// @description  Generate a link to copy the torrent link.
// @author       James Smith
// @match        http://share.dmhy.org/topics/view/*
// @match        https://share.dmhy.org/topics/view/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21270/%E5%8B%95%E6%BC%AB%E8%8A%B1%E5%9C%92%20Copy%20torrent%20link%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/21270/%E5%8B%95%E6%BC%AB%E8%8A%B1%E5%9C%92%20Copy%20torrent%20link%20shortcut.meta.js
// ==/UserScript==

(() => {
  let torrentUrl = document.querySelector('#tabs-1 > p:nth-child(1) > a').href

  let a = document.createElement('a')
  a.href = torrentUrl
  a.textContent = 'Copy torrent link to the clipboard'
  a.style = `
    display: block;
    padding: 10px;
  `
  a.addEventListener('click', onClick)

  let div = document.createElement('div')
  div.id = 'torrent-link'
  div.appendChild(a)
  div.style = `
    position: fixed;
    left: 0;
    bottom: 0;
    margin: 10px;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  `

  document.body.appendChild(div)

  function onClick(event) {
    a.removeEventListener('click', onClick)

    event.preventDefault()

    a.textContent = torrentUrl

    let range = document.createRange()
    range.selectNode(a)

    let selection = window.getSelection()
    selection.empty()
    selection.addRange(range)

    document.execCommand('copy')

    a.textContent = 'Copied. Click again to download the torrent.'
  }
})()
