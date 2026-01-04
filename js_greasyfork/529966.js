// ==UserScript==
// @name         爱学习水印
// @namespace    http://tampermonkey.net/
// @version      2025-03-16
// @description  爱学习去水印
// @author       You
// @match        https://bsk.aixuexi.com/courseInfo.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aixuexi.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/529966/%E7%88%B1%E5%AD%A6%E4%B9%A0%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/529966/%E7%88%B1%E5%AD%A6%E4%B9%A0%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styl = `<style>#printArea .module-watermark-wrap{display:none}</style>`
   document.documentElement.insertAdjacentHTML('afterbegin', styl);
})();