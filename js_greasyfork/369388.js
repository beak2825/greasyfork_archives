// ==UserScript==
// @name         CSDN 阅读更多 && 免登陆查看
// @namespace    http://github.com/soxfmr
// @version      0.5
// @description  CSDN 自动展开全文 && 免登陆查看
// @author       soxfmr
// @match        https://blog.csdn.net/*/article/details/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369388/CSDN%20%E9%98%85%E8%AF%BB%E6%9B%B4%E5%A4%9A%20%20%E5%85%8D%E7%99%BB%E9%99%86%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/369388/CSDN%20%E9%98%85%E8%AF%BB%E6%9B%B4%E5%A4%9A%20%20%E5%85%8D%E7%99%BB%E9%99%86%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
    * We shall never surrender - by Churchill
    *
    * To prevent the further changes, you may add the following JavaScript files to the blacklist of adblock:
    * - /check-adblock/1.1.1/check-adblock.js
    *
    */

    var hookedInterval = window.setInterval;

    window.setInterval = function(callback, seconds) {
        // Magic time
        if (seconds == 1e3) {
            document.querySelector('#check-adblock-time').remove();
            return;
        }
        hookedInterval(callback, seconds);
    };

    var btnMore = document.getElementsByClassName("btn-readmore");
    if (btnMore !== undefined) {
        btnMore[0].click();
    } else {
        console.log("No button found.");
    }
})();