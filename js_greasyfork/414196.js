// ==UserScript==
// @name         去除V2EX列表广告
// @namespace    remove ad
// @version      1.0
// @description  去除V2EX列表内行广告
// @author       shag
// @match        https://www.v2ex.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414196/%E5%8E%BB%E9%99%A4V2EX%E5%88%97%E8%A1%A8%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/414196/%E5%8E%BB%E9%99%A4V2EX%E5%88%97%E8%A1%A8%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function() {
    'use strict';

    setTimeout(function(){
        var list = document.getElementsByTagName("ins");
        for(var i = 0;i<list.length;i++){
            var dom = list[i];
            dom.remove();
        }

        var list2 = document.getElementsByClassName("adsbygoogle");
        for(var i = 0;i<list2.length;i++){
            var dom = list2[i];
            dom.remove();
        }
    },20)
})();