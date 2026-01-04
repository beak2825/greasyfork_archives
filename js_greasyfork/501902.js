// ==UserScript==
// @name         pixiv 你正試圖跳轉至其他網站 直接跳轉
// @namespace    https://greasyfork.org/scripts/501902
// @version      2.3
// @description  不要問，跳轉就對了
// @author       fmnijk
// @match        https://www.pixiv.net/*
// @icon         https://www.google.com/s2/favicons?domain=pixiv.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501902/pixiv%20%E4%BD%A0%E6%AD%A3%E8%A9%A6%E5%9C%96%E8%B7%B3%E8%BD%89%E8%87%B3%E5%85%B6%E4%BB%96%E7%B6%B2%E7%AB%99%20%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/501902/pixiv%20%E4%BD%A0%E6%AD%A3%E8%A9%A6%E5%9C%96%E8%B7%B3%E8%BD%89%E8%87%B3%E5%85%B6%E4%BB%96%E7%B6%B2%E7%AB%99%20%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%89.meta.js
// ==/UserScript==

(window.onload = function() {
    'use strict';

    if (!window.location.href.startsWith('https://www.pixiv.net/jump.php?')) {
        return false;
    }

    var stop1 = -100;
    function keeptrying1() {
        if(document.getElementsByTagName("a") == null){
            stop1 += 1;
            if(stop1 < 0){
                setTimeout(( () => keeptrying1() ), 20);
            }
        }else{
            document.getElementsByTagName("a")[0].click();
        }
    }
    setTimeout(( () => keeptrying1() ), 0);
})();

