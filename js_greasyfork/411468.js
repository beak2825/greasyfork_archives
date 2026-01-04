// ==UserScript==
// @name        Udemy video downloader
// @namespace   Udemy video downloader
// @match       https://www.udemy.com/*
// @grant       none
// @version     1.0
// @author      Asimo10
// @description Download Udemy videos
// @downloadURL https://update.greasyfork.org/scripts/411468/Udemy%20video%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/411468/Udemy%20video%20downloader.meta.js
// ==/UserScript==



document.onkeydown = function(){
console.log(event.keyCode);
    if (event.keyCode == "16"){
         if (event.code=="ShiftRight") var videoLink = document.querySelector(".vjs-tech").getAttribute('src'); 
                                        window.open(videoLink,'_blank');
    }
}