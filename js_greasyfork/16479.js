// ==UserScript==
// @name         Anidub Firefighter
// @namespace    lainscripts_anidub_firefighter
// @version      0.1
// @description  Less attention to fire → more to content.
// @author       lainverse
// @license      CC BY-SA
// @match        http://online.anidub.com/*
// @match        https://online.anidub.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16479/Anidub%20Firefighter.user.js
// @updateURL https://update.greasyfork.org/scripts/16479/Anidub%20Firefighter.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

function extinguisher(n) {
    window.setTimeout(function(n){
        if(window.getComputedStyle(n,null).backgroundImage.indexOf('data:image') > -1) {
            n.parentNode.removeChild(n);
            console.log('Fire extinguished.');
        }
    },0,n);
}

var obs = new MutationObserver(function(mts){
    mts.forEach(function(m){
        var i = m.addedNodes.length;
        while(i--)
            extinguisher(m.addedNodes[i]);
    });
});

obs.observe(document.body, {childList: true, subtree: true});