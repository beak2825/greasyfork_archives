// ==UserScript==
// @name         Hulu - No Grey Overlay
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  gets rid of grey overlay that shows up when you move the mouse
// @author       yu
// @match        https://www.tampermonkey.net/scripts.php
// @grant        try to take over the world!
// @include *hulu.com*
// @downloadURL https://update.greasyfork.org/scripts/403765/Hulu%20-%20No%20Grey%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/403765/Hulu%20-%20No%20Grey%20Overlay.meta.js
// ==/UserScript==

//sorry but this script is terrible.. anyways it is working for me to get rid of the
//get rid of the grey overlay that shows up when you move the mouse
//with the three different things going on here,
//one of which definitely isn't doing anything
//who knows what's going on h ere
//i think 70% likely its that global styles function and the one line calling it
//but eh who knows
//anyways check out my music at streaming sites worldwide lololololol

try
{
function dongo() {
    'use strict';
    var gg2 = document.getElementsByClassName("player-mask__gradient");
    gg2[0].style.background = "";
    var style = document.createElement('style');
    style.innerHTML = `
    .player-mask__gradient {
    background: linear-gradient(180deg,rgba(38,41,48,0) 0,rgba(38,41,48,0) 50%,#262930);
    }
    `;
  document.head.appendChild(style);
    // Your code here...
    var gg = document.getElementsByClassName("player-mask");
    const config = { attributes: true, childList: true, subtree: true };
    const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            console.log('A child node has been added or removed.');
        }
        else if (mutation.type === 'attributes') {
            console.log('The ' + mutation.attributeName + ' attribute was modified.');
        }
    }
    const observerb = new MutationObserver(callback);
    observerb.observe(gg[0], config);
}


}


    function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

dongo();
    addGlobalStyle(".player-mask__gradient {background:#000000;}");
}
catch(err)
{
    var ggp = 1;
}