// ==UserScript==
// @name         Numerade Get Video
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  PHY1201 assignments now become a easy job
// @author       You
// @match        https://www.numerade.com/questions/*
// @match        https://www.numerade.com/ask/question*
// @icon         https://www.google.com/s2/favicons?domain=numerade.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435899/Numerade%20Get%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/435899/Numerade%20Get%20Video.meta.js
// ==/UserScript==

(function() {
    'use strict';



    var btn = document.createElement("button")
    btn.innerHTML = "Click me to watch the video"
    btn.style.marginRight = "10px"
    document.getElementsByClassName("flash-container")[0].appendChild(btn)

    var btn2 = document.createElement("button")
    btn2.innerHTML = "Try this if the first one doesn't work"
    document.getElementsByClassName("flash-container")[0].appendChild(btn2)



    //if(window.location.href.indexOf("numerade.com/ask/question") == -1){
        btn.onclick = () => {
            var url = document.querySelector("meta[property='twitter:image']").content
            if(url.indexOf("previews/") == -1){
                url = document.getElementsByClassName("background-gif")[0].src
            }
            var id = url.substring(url.indexOf("previews/")+9, url.indexOf("_large"))
            window.open(`https://cdn.numerade.com/encoded/${id}.webm`, "_blank");
        }
   // } else {
        btn2.onclick = () => {
            var url = document.getElementsByClassName("background-gif")[0].src
            var id = url.substring(url.indexOf("previews/")+9, url.indexOf("_large"))
            window.open(`https://cdn.numerade.com/ask_video/${id}.webm`, "_blank");
        }

   // }
})();