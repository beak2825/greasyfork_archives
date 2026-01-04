// ==UserScript==
// @name         贴吧不自动播放视频
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  百度贴吧不自动播放视频。
// @author       only1word
// @include     /http(?:s|)://(?:tieba\.baidu\.com|.+\.tieba\.com)//
// @run-at      document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39558/%E8%B4%B4%E5%90%A7%E4%B8%8D%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/39558/%E8%B4%B4%E5%90%A7%E4%B8%8D%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

window.localStorage.videoOpenAutoPlay = 0;