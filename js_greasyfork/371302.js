// ==UserScript==
// @name         隐藏开通QQ空间提示横幅
// @description  隐藏关闭QQ空间后出现的“开通空间”提示横幅
// @namespace    https://greasyfork.org/users/197529
// @version      0.3.7
// @author       kkocdko
// @license      Unlicense
// @match        *://user.qzone.qq.com/*
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/371302/%E9%9A%90%E8%97%8F%E5%BC%80%E9%80%9AQQ%E7%A9%BA%E9%97%B4%E6%8F%90%E7%A4%BA%E6%A8%AA%E5%B9%85.user.js
// @updateURL https://update.greasyfork.org/scripts/371302/%E9%9A%90%E8%97%8F%E5%BC%80%E9%80%9AQQ%E7%A9%BA%E9%97%B4%E6%8F%90%E7%A4%BA%E6%A8%AA%E5%B9%85.meta.js
// ==/UserScript==
'use strict'

document.head.insertAdjacentHTML('beforeend', `<style>

#top_tips_container, #top_tips_seat {
  display: none;
}

.top-fix-inner {
  margin: 0;
}

</style>`.replace(/;/g, '!important;'))
