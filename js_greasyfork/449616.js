// ==UserScript==
// @name         蝦皮清空購物車
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  蝦皮自動清空購物車
// @author       You
// @match        https://shopee.tw/cart
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shopee.tw
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449616/%E8%9D%A6%E7%9A%AE%E6%B8%85%E7%A9%BA%E8%B3%BC%E7%89%A9%E8%BB%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/449616/%E8%9D%A6%E7%9A%AE%E6%B8%85%E7%A9%BA%E8%B3%BC%E7%89%A9%E8%BB%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(function(){document.querySelectorAll('.RCd1Gx')[0].click();},1000);
    setTimeout(function(){window.location.reload();},1100);
    
})();