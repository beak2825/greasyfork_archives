// ==UserScript==
// @name         B站主页清理助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  清理掉主页无用内容
// @author       Zszen
// @match        https://www.bilibili.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406941/B%E7%AB%99%E4%B8%BB%E9%A1%B5%E6%B8%85%E7%90%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/406941/B%E7%AB%99%E4%B8%BB%E9%A1%B5%E6%B8%85%E7%90%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    hiddenEL_CLS("extension","rank-list","manga-rank","pgc-rank","home-slide","bypb-window");
    //hiddenEL("rank-list");
    //hiddenEL("manga-rank");
    //hiddenEL("pgc-rank");
    //hiddenEL("home-slide");
    //hiddenEL("bypb-window");
    //hiddenEL("report-scroll-module");
    hiddenEL_TAG("iframe");
    widthEL_CLS("bili-banner","first-screen");

    function hiddenEL_CLS(...className){
        for(var i=0;i<className.length;i++){
            document.getElementsByClassName(className[i]).forEach((el)=>{
                el.style.display = "none";
                el.style.width = "0px";
            });
        }
    }
    function hiddenEL_TAG(...tagName){
        for(var i=0;i<tagname.length;i++){
            document.getElementsByTagName(tagname[i]).forEach((el)=>{
                el.style.display = "none";
                el.style.width = "0px";
            });
        }
    }

    function widthEL_CLS(...className){
        for(var i=0;i<className.length;i++){
            document.getElementsByClassName(className[i]).forEach((el)=>{
                el.style.minWidth = "100%";
                el.style.width = "100%";
            });
        }
    }
    // Your code here...
})();