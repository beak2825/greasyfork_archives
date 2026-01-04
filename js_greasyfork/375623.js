// ==UserScript==
// @name         NGA去掉tagtic.cn等推广链接
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  NGA去掉tagtic.cn、hm.baidu.com推广链接
// @author       NGA
// @match        *://*.ngacn.cc/*
// @match        *://*.nga.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375623/NGA%E5%8E%BB%E6%8E%89tagticcn%E7%AD%89%E6%8E%A8%E5%B9%BF%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/375623/NGA%E5%8E%BB%E6%8E%89tagticcn%E7%AD%89%E6%8E%A8%E5%B9%BF%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceSponsoredLinks(){
        var scripts = document.querySelectorAll('script');
        scripts.forEach(function (script) {
            //删生成tagtic.cn的js
            var minnerText = script.innerText.match(/http:\/\/g1.tagtic.cn\/v1\/xingyou\/c/);
            if (minnerText) {
                //console.log("Running");
                var a = script.innerText;
                a = a.replace(/http:\/\/g1.tagtic.cn\/v1\/xingyou\/c/,"");
                script.innerText = a;
                //console.log( script.innerText );
            }
            //删tagtic.cn的js
            var msrc = script.src.match(/g1.tagtic.cn/);
            //delete hm.baidu.com
            var mbaidu = script.src.match(/hm.baidu.com/);
            if (msrc||mbaidu) {
               script.remove();
            }
        });
    }
    replaceSponsoredLinks();
})();