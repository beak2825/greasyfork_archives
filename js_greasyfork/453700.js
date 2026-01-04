// ==UserScript==
// @name         96编辑器企业VIP
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  96编辑器企业VIP随便使用
// @author       moxiaoying
// @match        https://bj.96weixin.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=96weixin.com
// @run-at       document-end
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453700/96%E7%BC%96%E8%BE%91%E5%99%A8%E4%BC%81%E4%B8%9AVIP.user.js
// @updateURL https://update.greasyfork.org/scripts/453700/96%E7%BC%96%E8%BE%91%E5%99%A8%E4%BC%81%E4%B8%9AVIP.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(()=>$("#user_vip").data("vip", 5),1000)
    // Your code here...
})();