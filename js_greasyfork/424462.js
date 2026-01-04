// ==UserScript==
// @name         屏蔽百度热榜
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  百度热榜扰我心智
// @author       King
// @match        https://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424462/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E7%83%AD%E6%A6%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/424462/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E7%83%AD%E6%A6%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var s = null
    var q = null;
    var interval = null;
    console.log("启动");
    function go(){
        interval = setInterval(function(){
            if(interval != null ) clearInterval(interval);
            s = document.getElementById("con-ar");
            q = document.getElementById("FYB_RD");
            if(s != null) s.style.display="none";
            if(q != null) q.style.display="none";
            go();
        },30)
    }
     go();
})();