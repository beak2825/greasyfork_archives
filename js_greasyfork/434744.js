// ==UserScript==
// @name         Imgur auto resize
// @namespace    https://greasyfork.org/en/scripts/434744-imgur-auto-resize
// @version      1.3
// @description  Automatically resizes imgur videos to fit the screen height
// @icon         https://imgur.com/favicon.ico
// @author       NotJ3st3r
// @license      MIT
// @match        https://i.imgur.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434744/Imgur%20auto%20resize.user.js
// @updateURL https://update.greasyfork.org/scripts/434744/Imgur%20auto%20resize.meta.js
// ==/UserScript==

(function() {
    'use strict';
    addGlobalStyle('body { overflow: hidden !important; }');
  
    try {
        var video = document.getElementsByTagName('video');  
        video[0].style.height = "100vh";
        video[0].style.width = "auto";
        video[0].muted = false;
        setInterval(function(){
            if(video[0]){
                video[0].setAttribute("controls", "controls");
            }
        }, 100);
    }
    catch{}
    
    try {
        var image = document.getElementsByTagName("img");
        image[0].style.height = "100vh";
        image[0].style.width = "auto";
    }
    catch{}
})();

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
