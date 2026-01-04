// ==UserScript==
// @name         imagestwist自动跳转到图片页
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  imagestwist自动跳转
// @author       Levinism
// @match        https://imagestwist.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imagestwist.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475743/imagestwist%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E5%9B%BE%E7%89%87%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/475743/imagestwist%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E5%9B%BE%E7%89%87%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var xx=document.getElementsByName("next");
    xx[0].click()
    // Your code here...
})();