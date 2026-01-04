// ==UserScript==
// @name         Gist Downloader Plus
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Directly download GitHub gists as source files.
// @author       Ahmed Mohamed Abdelaty
// @match        https://gist.github.com/*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license      MIT; https://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/490952/Gist%20Downloader%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/490952/Gist%20Downloader%20Plus.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  // get the name of the gist
  const gistName = document.querySelector('.gist-blob-name').innerText

  // get the raw url of the gist
  const rawUrl = document.querySelector('.file-actions')
  // get the first a element
  const a = rawUrl.querySelector('a')
  // get the href attribute
  const href = a.getAttribute('href')

  // create button next to the raw button
  const button = document.createElement('button')

  // copy the properties of the raw button to the new button
  const rawButton = document.querySelector('.file-actions a')
  const rawButtonStyles = getComputedStyle(a)
  button.textContent = rawButton.textContent
  button.style.cssText = rawButtonStyles.cssText
  button.style.marginLeft = '5px'
  button.style.padding = '5px'
  button.style.backgroundColor = 'green'
  button.innerText = 'Download'
  button.style.borderRadius = '10px'

  // add the button to the rawUrl div
  rawUrl.appendChild(button)

  button.addEventListener('click', () => {
    // get the raw content of the gist
    GM_xmlhttpRequest({
      method: 'GET',
      url: href,
      onload: function (response) {
        const blob = new Blob([response.responseText], {
          type: 'text/plain',
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = gistName
        a.click()
      },
    })
  })
})()
