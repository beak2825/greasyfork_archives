// ==UserScript==
// @name         [Fixed] SoundCloud DL
// @namespace    SCDL
// @version      1.7.5
// @description  Download SoundCloud tracks as mp3!
// @author       Kıraç Armağan Önal
// @match        https://soundcloud.com/*
// @match        https://soundcloud.com/*/*
// @match        https://soundcloud.com/*/*/*
// @match        https://soundcloud.com/*/*/*/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/392793/%5BFixed%5D%20SoundCloud%20DL.user.js
// @updateURL https://update.greasyfork.org/scripts/392793/%5BFixed%5D%20SoundCloud%20DL.meta.js
// ==/UserScript==

(function() {
    "use strict";

    var OPTIONS = {
        /* true or false */
        autodownload: false,
        autoplay: false
    }

    /* don't change */
    var isLoaded = false;


    function createElementByHTML(html) {
    var divElm = document.createElement("div");
    divElm.innerHTML = html;
    return divElm.firstElementChild;
    };

    function loadSCDL(event) {
        if (isLoaded) return;
        isLoaded = true;
     setInterval(function(){
     if (!document.querySelector("#scdl-download-btn")) {
         var button_list = document.querySelector(".sc-button-group.sc-button-group-medium");
         if (button_list) button_list.appendChild(createElementByHTML(`<a id="scdl-download-btn" title="Download with SCDL!" href="javascript:openSCDL()"> <button class=" sc-button" alt="Download with SCDL">⬇ Download ⬇</button></a>`));
         unsafeWindow.openSCDL = function (){
           var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
             var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

             var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
             var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

             var left = ((width / 2) - (1000 / 2)) + dualScreenLeft;
             var top = ((height / 2) - (1000 / 2)) + dualScreenTop;
             var newWindow = window.open(`https://soundcloud-dl.glitch.me/?autoplay=${OPTIONS.autoplay}&autodownload=${OPTIONS.autodownload}&url=${window.location.href}`, "SCDLWindow", 'width=1000, height=1000, top=' + top + ', left=' + left);

             if (window.focus) {
                 newWindow.focus();
             }
         }
     }
     },5000)
     }
    unsafeWindow.loadSCDL = loadSCDL;
    if (document.readyState == "loading") {
      document.addEventListener("DOMContentLoaded", (e)=>{loadSCDL(e)})
      document.addEventListener("DomContentLoaded", (e)=>{loadSCDL(e)})
    } else {
      loadSCDL();
    }

})();
