// ==UserScript==
// @name         Coolcollege 16倍数刷课
// @namespace    http://coolcollege.cn/
// @version      0.1.2
// @description  Coolcollege 16倍数刷课，自动播放
// @author       Knight
// @match        *.coolcollege.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coolcollege.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454501/Coolcollege%2016%E5%80%8D%E6%95%B0%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/454501/Coolcollege%2016%E5%80%8D%E6%95%B0%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(letsGo, 5000);
    function letsGo() {
        document.querySelector("video").playbackRate = "16";
    }
})();