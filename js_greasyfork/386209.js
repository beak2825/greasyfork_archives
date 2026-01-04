// ==UserScript==
// @name         Flash iframe allowfullscreen
// @namespace    https://greasyfork.org/zh-CN/users/306433
// @version      0.2
// @description  解决某些网页flash播放器点击全屏无效的问题 (请求全屏已拒绝，至少一个文档包含的元素不是一个 iframe，或没有"allowfullscreen"属性。 index TypeError: The expression cannot be converted to return the specified type.)
// @author       baster
// @supportURL   https://greasyfork.org/zh-CN/users/306433-baster
// @homepageURL  https://greasyfork.org/zh-CN/users/306433
// @match        *://*/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386209/Flash%20iframe%20allowfullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/386209/Flash%20iframe%20allowfullscreen.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  var iframes = document.getElementsByTagName('iframe')
  for (var i = 0; i < iframes.length; i++) {
    iframes[i].setAttribute('allowfullscreen', true)
  }
})()
