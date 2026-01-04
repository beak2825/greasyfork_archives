// ==UserScript==
// @name         1688屏蔽搜索广告
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  屏蔽阿里巴巴（1688.com）搜索后，结果带有"广告"的推广条目
// @author       cakiihana（cakiihana@live.cn）
// @match        https://s.1688.com/selloffer/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379416/1688%E5%B1%8F%E8%94%BD%E6%90%9C%E7%B4%A2%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/379416/1688%E5%B1%8F%E8%94%BD%E6%90%9C%E7%B4%A2%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    var hostname = window.location.hostname;
    if (hostname == 's.1688.com') {
        process();
        document.addEventListener("DOMSubtreeModified", process);
    }

    function process() {
        var results = document.getElementsByClassName('ad-item');
        if (results && results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                results[i].parentNode.parentNode.removeChild(results[i].parentNode);
            }
        }
    }
})();