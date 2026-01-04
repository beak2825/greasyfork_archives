// ==UserScript==
// @name         清除简书无关内容
// @namespace    https://www.jianshu.com/
// @version      0.1
// @description  清除简书右侧推荐和底部推荐
// @author       MorganWang
// @match        https://www.jianshu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jianshu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471310/%E6%B8%85%E9%99%A4%E7%AE%80%E4%B9%A6%E6%97%A0%E5%85%B3%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/471310/%E6%B8%85%E9%99%A4%E7%AE%80%E4%B9%A6%E6%97%A0%E5%85%B3%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeIrrelevantContent(){
        console.log("HHHH");
//         var irrelevantContent = document.getElementsByClassName('ant-affix');
//         irrelevantContent.remove;

        var irrelevantContents=document.querySelectorAll("._3Z3nHf");
        var irrelevantContent=irrelevantContents[1];
        irrelevantContent.remove();

        var recommendContents = document.querySelectorAll(".ouvJEz");
        var recommendContent = recommendContents[1];
        recommendContent.remove();
    }

    window.addEventListener('load', function() {
        removeIrrelevantContent();
    }, false);

    setTimeout(()=>{
        removeIrrelevantContent();
    },2000);
})();