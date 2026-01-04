// ==UserScript==
// @name         Rig Google Coinflip
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  title
// @author       Colin Simon-Fellowes
// @match        https://www.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479450/Rig%20Google%20Coinflip.user.js
// @updateURL https://update.greasyfork.org/scripts/479450/Rig%20Google%20Coinflip.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Check if the page contains a coinflip game
    let is_coinflip = (document.querySelector("div[data-parent-funbox='Flip a coin']") != null);
    if (!is_coinflip){return 0;}

    // Functions to overload Math.random with
    let all_heads = function(){return 0;}
    let all_tails = function(){return 1;}
    let rand = Math.random; // Keep a back-up of Math.random for when we overwrite it

    function processKey(e) {
        switch (e.key.toLowerCase()){
            case 'h':
                window.Math.random = all_heads;
                console.log("To Heads!"); // debug
                break;
            case 't':
                window.Math.random = all_tails;
                console.log("To tails!"); // debug
                break;
            case 'r':
                window.Math.random = rand;
                console.log("Back to random!"); // debug
                break;
        }
    }

    document.addEventListener("keydown", processKey);

    // Your code here...
})();