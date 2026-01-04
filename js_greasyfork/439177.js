// ==UserScript==
// @name         Spacebar scroll marker
// @namespace    None
// @version      0.1
// @description  Fading marker line when you hit space to scroll.
// @match        *://*/*
// @exclude      *://*.reddit.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439177/Spacebar%20scroll%20marker.user.js
// @updateURL https://update.greasyfork.org/scripts/439177/Spacebar%20scroll%20marker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let i, elements=document.querySelectorAll('body *');
    for (i=0;i < elements.length;i++) {
        if (getComputedStyle(elements[i]).position === 'fixed' || getComputedStyle(elements[i]).position === 'sticky') {
            elements[i].parentNode.removeChild(elements[i]);
        }
    }
    let elem=Array.from(document.getElementsByTagName("body"))[0].appendChild(document.createElement('div'));
    elem.style.width="100%";
    elem.style.borderTop="1px solid red";
    elem.style.position="absolute";
    elem.style.top="0px";
    elem.style.opacity="0";
    elem.style.transition="opacity 1500ms";
    window.addEventListener('keydown', e => {
        if(e.code === "Space"){
            elem.style.transition="";
            elem.style.top=(window.innerHeight + window.scrollY) + "px";
            elem.style.opacity="1";
            setTimeout(function(){
                elem.style.transition="opacity 1500ms";
                elem.style.opacity="0";
            }, 200);
        }
    }
);
}())();
