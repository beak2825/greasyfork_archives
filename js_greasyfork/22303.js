// ==UserScript==
// @name         Youtube Autoplay Off
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Set YouTube's Autoplay mode off by default
// @author       Eric Mintz
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22303/Youtube%20Autoplay%20Off.user.js
// @updateURL https://update.greasyfork.org/scripts/22303/Youtube%20Autoplay%20Off.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load',function(){
        var autoplay = document.querySelector('input[id="autoplay-checkbox"]');
        if (autoplay.value == "on"){
            setTimeout(function(){
            document.querySelector('input[id="autoplay-checkbox"]').click();
            },1000);
        }
    });
})();