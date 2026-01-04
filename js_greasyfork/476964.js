// ==UserScript==
// @name         阿部寛のホームページRTA
// @namespace    https://x.com/mersnn621
// @version      0.1
// @description  阿部寛のホームページをクリックする前から開きます(カーソルがリンクに触れると開きます)。
// @author       mersnn621
// @grant        none
// @match        http*://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476964/%E9%98%BF%E9%83%A8%E5%AF%9B%E3%81%AE%E3%83%9B%E3%83%BC%E3%83%A0%E3%83%9A%E3%83%BC%E3%82%B8RTA.user.js
// @updateURL https://update.greasyfork.org/scripts/476964/%E9%98%BF%E9%83%A8%E5%AF%9B%E3%81%AE%E3%83%9B%E3%83%BC%E3%83%A0%E3%83%9A%E3%83%BC%E3%82%B8RTA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const abehiroshi = document.querySelectorAll("a[href*='://abehiroshi.la.coocan.jp']");
    for(let i = 0; i < abehiroshi.length; i++){
      abehiroshi[i].addEventListener('mouseover',function(){
        location.href = abehiroshi[i].getAttribute('href');
    });
    }
})();