// ==UserScript==
// @name         Reddit Live Highlight New
// @namespace    http://kmcgurty.com
// @version      1
// @description  Highlights new posts on a Reddit Live thread
// @author       Kmc - admin@kmcdeals.com
// @match        *://*.reddit.com/live/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/16759/Reddit%20Live%20Highlight%20New.user.js
// @updateURL https://update.greasyfork.org/scripts/16759/Reddit%20Live%20Highlight%20New.meta.js
// ==/UserScript==

var windowIsActive = false;

window.onfocus = function () {
    windowIsActive = true;
    
    var divs = document.querySelectorAll(".gm_solid");

    if(divs.length !== 0){
        for(var i = 0; i < divs.length; i++){
            divs[i].className = "body gm_fade";
        }
    }
}; 

window.onblur = function () {
    windowIsActive = false;
};


function highlightPost(div){
    if(windowIsActive){
        div.className = "body gm_fade";
    } else {
        div.className = "body gm_solid";
    }
}

// create an observer instance
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        highlightPost(target.querySelector(".body"));
    });    
});
 
var target = document.querySelector('.liveupdate-listing');
// configuration of the observer:
var config = { attributes: true, childList: true, characterData: true };
 
// pass in the target node, as well as the observer options
observer.observe(target, config);


var css = `
@keyframes fade_out {
    0%   { background-color: rgba(255, 153, 0, .7); }
    100% { background-color: rgba(0, 0, 0, 0); }
}

.gm_solid{
    background-color: rgba(255, 153, 0, .7);
}

.gm_fade{
    animation: fade_out 5s ease-in-out;
}`;
GM_addStyle(css);