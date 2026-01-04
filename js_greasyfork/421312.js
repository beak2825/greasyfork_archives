// ==UserScript==
// @name         Vc-test
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.baidu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421312/Vc-test.user.js
// @updateURL https://update.greasyfork.org/scripts/421312/Vc-test.meta.js
// ==/UserScript==
;(function () {
  'use strict'
  if (location.href === 'http://localhost:8080/') return
  var script = document.createElement('script')
  script.src = 'http://localhost:8080/app.bundle.js'
  document.body.appendChild(script)
})()
