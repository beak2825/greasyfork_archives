// ==UserScript==
// @name         Print PDF
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Print.
// @author       Feng Ya
// @match        http://www.imsdb.com/scripts/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370078/Print%20PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/370078/Print%20PDF.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  // Your code here...
  print()

  function print () {
    const script = document.querySelector('pre')
    document.body.innerHTML = script.outerHTML
  }
})()
