// ==UserScript==
// @name         NoAddsForZhanTPO
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动移除小站托福TPO测试中的遮罩广告
// @author       宮商kyusho antoineyang@gmail.com
// @license MIT
// @match        https://top.zhan.com/toefl/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481170/NoAddsForZhanTPO.user.js
// @updateURL https://update.greasyfork.org/scripts/481170/NoAddsForZhanTPO.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the modal ad
    function removeModalAd() {
        const ele = document.querySelector('.model_mask');
        ele && ele.remove();
    }

    // Run the function every 400ms
    setInterval(removeModalAd, 400);
})();
