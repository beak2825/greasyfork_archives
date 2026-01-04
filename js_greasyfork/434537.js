// ==UserScript==
// @name         屏蔽百度搜索右边栏热搜
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  屏蔽百度搜索热搜
// @author       reallybigmistake
// @match        https://www.baidu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434537/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8F%B3%E8%BE%B9%E6%A0%8F%E7%83%AD%E6%90%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/434537/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8F%B3%E8%BE%B9%E6%A0%8F%E7%83%AD%E6%90%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = () => {
        var p;
        var cnt = 0;
        var cnt2 = 0;
        function clear(){
            clearInterval(p);
        }
        p = setInterval(function(){
            cnt++;
            console.log('hello ' + cnt);
            var hs = document.getElementById("content_right");
            if(cnt > 20){
                clear();
            }
            if(hs){
                hs.remove();
                clear();
            }
        }, 100);
        setInterval(function(){
            console.log(cnt2++);
            var hs = document.getElementById("content_right");
            if(hs){
                hs.remove();
            }
        }, 1000);
    };
})();