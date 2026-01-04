// ==UserScript==
// @name         JoyReactor Kurs
// @namespace    http://joyreactor.cc
// @version      0.2
// @description  Lower values' size
// @author       no-name
// @include      *.reactor.cc/*
// @include      *://joyreactor.cc/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440731/JoyReactor%20Kurs.user.js
// @updateURL https://update.greasyfork.org/scripts/440731/JoyReactor%20Kurs.meta.js
// ==/UserScript==

(function () {
  var setSize = (fontSize) => {
    var style = document.querySelector('.size-css')
    if (!style) {
      style = document.createElement('style')
      document.head.appendChild(style)
    }
    style.innerHTML = `
    #quotes .item .value {
      font-size: ${fontSize}px !important;
    }`
    return style;
  }
  setSize(100)
})()
