// ==UserScript==
// @name         MoveSearch
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  划词搜索技术类文章
// @author       kinyaying
// @match        https://*/*
// @match        http://*/*
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/481688/MoveSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/481688/MoveSearch.meta.js
// ==/UserScript==
 
;(function () {
  'use strict'
  var script = document.createElement('script')
  script.src = 'https://raw.githubusercontent.com/kinyaying/wokoo/master/example/MoveSearch/dist/app.bundle.js'
  document.body.appendChild(script)
})()