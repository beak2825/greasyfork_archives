// ==UserScript==
// @name         BetterTwitchTV for FrankerFaceZ
// @namespace    http://deepbot.xyz/
// @version      2.1.2
// @description  Better Twitch TV emotes for FrankerFaceZ
// @author       iiNinetales
// @match        *://*.twitch.tv/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/23975/BetterTwitchTV%20for%20FrankerFaceZ.user.js
// @updateURL https://update.greasyfork.org/scripts/23975/BetterTwitchTV%20for%20FrankerFaceZ.meta.js
// ==/UserScript==

function inject() {
    var s = document.createElement('script');
    s.src = "https://deepbot.xyz/inject.js";
    s.onload = function() {
        this.parentNode.removeChild(this);
    };
    (document.head || document.documentElement).appendChild(s);
}

inject();