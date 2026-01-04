// ==UserScript==
// @name         其乐新标签打开帖子
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  新标签打开帖子
// @author       楪蘭楓
// @match        *://*keylol.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421779/%E5%85%B6%E4%B9%90%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/421779/%E5%85%B6%E4%B9%90%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

(function() {
    function setAttr(){
        document.querySelectorAll('a.xst').forEach(function(item){
            item.setAttribute('target','_blank');
            item.removeAttribute("onclick");
        });
    }

    setAttr();

    setInterval(function() {
        setAttr();
    },1000);
})();