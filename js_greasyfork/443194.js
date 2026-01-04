// ==UserScript==
// @name         Poem downloader
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Download Poem txt for cnkgraph.com
// @author       LiHowe
// @match        https://cnkgraph.com/Poem/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnkgraph.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443194/Poem%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/443194/Poem%20downloader.meta.js
// ==/UserScript==
(function() {
 'use strict';
  const nodeList = document.querySelectorAll('.my-4')
  const buttonStyle = `
  position: absolute;
  top: 20px;
  right: 10px;
  border: none;
  font-size: 16px;
  border-radius: 4px;
  padding: 5px 10px;
  `

  function analysis(node) {
    const titleEl = node.querySelector('.poemTitle ')
    const allTitleContent = titleEl.textContent

    const descriptionEl = node.querySelector('.titleIndent')

    const dropdownEl = node.querySelector('.dropdown-menu')
    const dropdownContent = dropdownEl.textContent

    const description = descriptionEl.textContent
    const title = allTitleContent.substring(dropdownContent.length, allTitleContent.length - description.length)
    const poem = node.querySelector('.poemContent').textContent
    
    return `
    ${title}
    ${description}

    ${poem}
    `
  }

  function downloadText(str, name) {
    const a = document.createElement('a')
    const blob = new Blob([str], { type: 'plain/text' })
    a.href = URL.createObjectURL(blob)
    a.download = `${name}.txt`
    a.click()
    URL.revokeObjectURL(a.href)
  }
  for (const node of nodeList) {
    const button = document.createElement('button')
    button.innerText = '下载txt'
    button.style.cssText = buttonStyle
    button.addEventListener('click', () => {
      const res = analysis(node)
      downloadText(res, title)
      URL.revokeObjectURL(a.href)
    })
    node.style.position = 'relative'
    node.appendChild(button)
  }

  const navEl = document.querySelector('#pageContent')
  navEl.style.position = 'relative'
  const downloadAllButton = document.createElement('button')
  downloadAllButton.innerText = '下载当前页'
  downloadAllButton.style.cssText = `
  ${buttonStyle}
  top: 4px;`
  downloadAllButton.addEventListener('click', () => {
    const res = []
    for(const node of nodeList) {
      res.push(analysis(node))
    }
    const fileName = decodeURI(location.pathname).split('/').slice(2, 4).join('-')
    downloadText(res.join('\n'), fileName)
  })
  navEl.append(downloadAllButton)
})();