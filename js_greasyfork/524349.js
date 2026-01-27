// ==UserScript==
// @name         百度翻译美化
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  新版不好用，不顺手，优化成精简版，哈哈哈
// @author       You
// @match        https://fanyi.baidu.com/mtpe-individual/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @run-at 		 document-idle
// @grant        unsafeWindow
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/524349/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/524349/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector("#multiContent > div > div.DLUyugHN").style="width:60%;margin:0 auto";
   document.querySelector("#multiContent > div > div:nth-child(2) > div.Hu5qsRSB").style.display="none"
    // Your code here...
})();