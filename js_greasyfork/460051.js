// ==UserScript==
// @name         hue helper
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  hue helper :P
// @author       Kite
// @include      */hue/editor*
// @match        https://emrhue.yimian.com.cn/*
// @match        https://183.131.12.3/*
// @icon         https://www.google.com/s2/favicons?domain=yimian.com.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460051/hue%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/460051/hue%20helper.meta.js
// ==/UserScript==
(function () {
  'use strict'
  function createElementFromHTML(htmlString) {
    var div = document.createElement('div')
    div.innerHTML = htmlString.trim()
    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild
  }

  window.go_notebook = function () {
    const url = window.location.href.replaceAll('editor', 'notebook')
    window.location.href = url 
  }

  window.gethoverBtnStyle = function (flag) {
    const btn = document.querySelector('#root').shadowRoot.querySelector('.mark_success_btn')
    btn.style['background-color'] = flag ? '#c0defb' : '#fff'
  }

  function addNoteBookButton() {
    const htmlString =
      `<button
        onclick="go_notebook()"
        style="color: #017cee; border-radius: 50%; position:fixed; bottom: 20px; right: 20px"
        onmouseover="gethoverBtnStyle(true)"
        onmouseout="gethoverBtnStyle(false)"
      >
        notebook
	     </button>
	  </div>`
    const el = createElementFromHTML(htmlString)
    document.body.appendChild(el)
  }

  function mainEntry() {
    if (window.location.href.includes('hue/editor')) {
      addNoteBookButton()
    }
  }
  mainEntry()

  window.addEventListener(
    'load',
    mainEntry,
  )
  // Your code here...
})()