// ==UserScript==
// @name         微博不自动播放视频
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  微博不自动播放视频。
// @author       only1word
// @include     /http(s|):\/\/([^.]+\.|)weibo\.com/
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/40975/%E5%BE%AE%E5%8D%9A%E4%B8%8D%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/40975/%E5%BE%AE%E5%8D%9A%E4%B8%8D%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

$CONFIG.isAuto = 1
Object.freeze($CONFIG)