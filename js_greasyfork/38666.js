// ==UserScript==
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @name         CCMA
// @namespace    http://www.ccma.cat/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @include      http://*ccma.cat/*
// @downloadURL https://update.greasyfork.org/scripts/38666/CCMA.user.js
// @updateURL https://update.greasyfork.org/scripts/38666/CCMA.meta.js
// ==/UserScript==

;(function() {
  'use strict'
  window.onload = function() {
    setInterval(function() {
      $('#contenidor_megabanner').remove()
      $('*[id^=publi_]').remove()
      $('*[id^=publicitat_]').remove()
      $('*[class^=M-publicitat]').remove()
    }, 1)
  }
})()
