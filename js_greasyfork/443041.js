// ==UserScript==
// @name         Sunflower Land Farmer Ly
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  sunflower 自动收菜脚本
// @author       Lotty
// @match        https://sunflower-land.com/play/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sunflower-land.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443041/Sunflower%20Land%20Farmer%20Ly.user.js
// @updateURL https://update.greasyfork.org/scripts/443041/Sunflower%20Land%20Farmer%20Ly.meta.js
// ==/UserScript==
//

;(function () {
  'use strict'
  var script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/gh/summertian4/files@master/sunflower.js'
  document.body.appendChild(script)

})()
