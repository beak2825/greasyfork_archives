// ==UserScript==
// @name         视频自动播放
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  识别网页中的视频，并且自动播放的脚本
// @author       Mumu
// @match        https://wangda.chinamobile.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476092/%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/476092/%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(()=> {document.getElementsByTagName("video").item(0).play()},60000)
    // Your code here...
})();