// ==UserScript==
// @name         干掉百度新闻蛋疼版块
// @namespace    wyxhydd
// @version      0.2
// @description  try to take over the world!
// @author       wyxhydd
// @match        http*://news.baidu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35876/%E5%B9%B2%E6%8E%89%E7%99%BE%E5%BA%A6%E6%96%B0%E9%97%BB%E8%9B%8B%E7%96%BC%E7%89%88%E5%9D%97.user.js
// @updateURL https://update.greasyfork.org/scripts/35876/%E5%B9%B2%E6%8E%89%E7%99%BE%E5%BA%A6%E6%96%B0%E9%97%BB%E8%9B%8B%E7%96%BC%E7%89%88%E5%9D%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ids = ["EnterNews", "MilitaryNews", "DiscoveryNews", "LadyNews", "HealthNews"];

    function blockSection() {
        for (var i = 0; i < ids.length; i++) {
            var obj = $("." + ids[i]);
            if (obj.size() == 1) {
                obj.hide();
            }
        }
    }

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var observer = new MutationObserver(blockSection);
    var option = {
        'childList': true
    };
    document.onreadystatechange = function(){
        if(document.readyState == "complete"){
            observer.observe($("#body")[0], option);
            blockSection();
        }
    };
})();