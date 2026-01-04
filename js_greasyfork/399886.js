// ==UserScript==
// @name         animate.css copy selected animate name
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  try to take over the world!
// @author       You
// @match        https://daneden.github.io/animate.css/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399886/animatecss%20copy%20selected%20animate%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/399886/animatecss%20copy%20selected%20animate%20name.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
;(function () {
  'use strict'
  // Your code here...
  const wrap = document.querySelector('.site__content .wrap')
  const btn = document.createElement('button')
  btn.classList.add('butt')
  btn.innerText = 'Copy Animate Name'
  btn.onclick = function () {
    const select = document.querySelector(
      '.input.input--dropdown.js--animations'
    )
    const text = select.options[select.selectedIndex].text
    const handleCopy = function (e) {
      e.clipboardData.setData('text/plain', text)
      e.preventDefault() // We want our data, not data from any selection, to be written to the clipboard
    }
    document.addEventListener('copy', handleCopy)
    document.execCommand('copy')
    document.removeEventListener('copy', handleCopy)
  }
  wrap.appendChild(btn)
})()
