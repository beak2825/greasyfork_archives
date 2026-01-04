// ==UserScript==
// @name         淘宝广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏蔽淘宝（taobao.com）搜索后，结果带有"广告"的推广条目
// @author       Andan（97960910@qq.com）
// @match        https://s.taobao.com/search*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436393/%E6%B7%98%E5%AE%9D%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/436393/%E6%B7%98%E5%AE%9D%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    var url = window.location.hostname;
    if (url == 's.taobao.com') {
        process();
        document.addEventListener("DOMSubtreeModified", process);
    }

    function process() {
        var results = document.getElementsByClassName('item-ad');
        if (results && results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                results[i].parentNode.removeChild(results[i]);
            }
        }
    }
})();