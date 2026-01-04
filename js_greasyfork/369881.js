// ==UserScript==
// @name         Print Code
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Print.
// @author       Feng Ya
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369881/Print%20Code.user.js
// @updateURL https://update.greasyfork.org/scripts/369881/Print%20Code.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  // Your code here...
  if (!document.querySelector('div.file')) return

  console.log('print code')

  const btnPrint = document.createElement('a')
  btnPrint.classList.add('btn')
  btnPrint.classList.add('btn-sm')
  btnPrint.classList.add('BtnGroup-item')
  console.log(btnPrint.classList)
  btnPrint.innerHTML = 'Print'
  btnPrint.addEventListener('click', printCode)

  document
    .querySelector('div.file-actions > div.BtnGroup')
    .appendChild(btnPrint)

  function printCode () {
    const file = document.querySelector('div.file')
    const header = document.querySelector('div.file-header')

    header.style.display = 'none'

    const css = document.createElement('style')
    css.type = 'text/css'
    css.innerHTML = `
    .file { width: 210mm; }
    .blob-code { line-height: 1.2; }
    .blob-code-inner { font-size: 12pt; }
    `
    document.head.appendChild(css)

    document.querySelectorAll('body > div').forEach(div => {
      div.style.display = 'none'
    })

    document.body.appendChild(file)
  }
})()
