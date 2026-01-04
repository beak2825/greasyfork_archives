// ==UserScript==
// @name         JANDAN_AD_REMOVER
// @name:en      JANDAN_AD_REMOVER
// @namespace    2b079a7c
// @version      1.0
// @icon         http://cdn.jandan.net/static/img/favicon.ico
// @description  删除jandan.net广告
// @description:en  Remove Ad for jandan.net
// @author       2b079a7c
// @match        http*://jandan.net/*
// @match        http*://i.jandan.net/*
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502951/JANDAN_AD_REMOVER.user.js
// @updateURL https://update.greasyfork.org/scripts/502951/JANDAN_AD_REMOVER.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var timer;
    timer = setInterval(function(){
        try{
            //Ad conver Remove
            document.getElementsByClassName("fc-ab-root")[0].remove()

            //Width-screen mode
            document.getElementById("sidebar").remove()
            document.getElementById("body").style.background = "None"
            document.getElementById("content").style.width = "100%"
            document.querySelectorAll(".row").forEach((ele)=>{ele.style.width = "100%";})
            document.querySelectorAll(".row>.text>p img").forEach((ele)=>{ele.style.width = "100%";ele.style.maxHeight="none"});

            //Auto load gifs
            Array.from(document.getElementsByClassName('gif-mask')).forEach( v=> {v.click()})

            if(timer)
            {
                clearInterval(timer);
                console.log("Jandan AD Removed");
            }
        }catch{}
    },50);

})();