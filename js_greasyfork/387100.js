// ==UserScript==
// @name         reddit threadline for vimium
// @namespace    pmhgms
// @version      0.3
// @description  change threadline's tag to button, so vimium can follow it
// @author       pmhgms
// @match        https://www.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387100/reddit%20threadline%20for%20vimium.user.js
// @updateURL https://update.greasyfork.org/scripts/387100/reddit%20threadline%20for%20vimium.meta.js
// ==/UserScript==


function swap(){
    var e = document.getElementsByClassName("threadline");
    for(var i = 0; i < e.length; i++){
        var d = document.createElement('button');
        d.setAttribute("class","threadline");
        e[i].parentNode.replaceChild(d, e[i]);
    }
}

function swapagain(event) {
    if(event.code == "Space"){
        swap();
    }
}

document.addEventListener('keypress', swapagain);
swap();
setTimeout(function(){swap();}, 10000);