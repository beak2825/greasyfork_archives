// ==UserScript==
// @name         移除知乎顶栏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  移除知乎内容页的顶栏
// @author       fengsy
// @match        *://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386277/%E7%A7%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E9%A1%B6%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/386277/%E7%A7%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E9%A1%B6%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    removeHeard();
    document.title = ' zhihu';

    function removeHeard(){
        var RH = document.getElementsByClassName('Sticky AppHeader');
        for(var i=0;i<RH.length;i++){
            RH[i].parentNode.removeChild(RH[0]);
        }
    }
})();