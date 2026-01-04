// ==UserScript==
// @name         TinderLikeScript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match          http://*.tinder.com/*
// @match          https://*.tinder.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418569/TinderLikeScript.user.js
// @updateURL https://update.greasyfork.org/scripts/418569/TinderLikeScript.meta.js
// ==/UserScript==

function ClickLike()
{
 var buttons = document.getElementsByClassName("button");

    if(buttons[3]!=null){
    buttons[3].click();
    }

    var timeout = Math.random(3500,7500);
    setTimeout(ClickLike, timeout);

}

var injectCode = function() {

    var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ ClickLike +')();'));
(document.body || document.head || document.documentElement).appendChild(script);

};

injectCode();