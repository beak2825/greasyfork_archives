// ==UserScript==
// @name         fuck baijiahao
// @namespace    http://tampermonkey.net/
// @version      2024-04-01
// @description  删掉bing搜索结果中的百家号
// @author       You
// @match        *://*bing*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491420/fuck%20baijiahao.user.js
// @updateURL https://update.greasyfork.org/scripts/491420/fuck%20baijiahao.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load", function(){
       	let doms = document.querySelectorAll("li:has(a[href*='baijiahao.baidu.com'].tilk)");

        if(doms != null){
            for(let i=0; i<doms.length;i++){
                doms[i].remove();
            }
        }

    });



})();