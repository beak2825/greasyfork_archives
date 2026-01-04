// ==UserScript==
// @name         百度翻译美化
// @namespace    http://tampermonkey.net/
// @version      1.0.1
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
    document.querySelector("#multiContainer > div.ZHrlRAUU > div").style="width:60%;margin:0 auto";
    document.querySelector("#root > div:nth-child(2) > div > div.QWmdE1v6 > div").style="visibility: hidden;";
    document.querySelector("#multiContainer > div.ZHrlRAUU > div > div.atNgw6Cp > div.UUQFuhdE > div.YGx8668_").style="visibility: hidden;";
    document.querySelector("#root > div:nth-child(2) > div > span.URCZyDIb").style="visibility: hidden;";
    document.querySelector("#multiContainer > div.ZHrlRAUU > div > div.lslKUKjX > div.qJU3axmS > div.LxF9kyWA > span").click();
    setTimeout(()=>{
        document.querySelector("#root > div.KxVKmLZM").style="display: none;";
    },500)
    // Your code here...
})();