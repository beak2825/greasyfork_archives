// ==UserScript==
// @name         Spacebattles hides autor on reader mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hides autor bar in reader mode
// @author       You
// @match        *://forums.spacebattles.com/*/reader/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427970/Spacebattles%20hides%20autor%20on%20reader%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/427970/Spacebattles%20hides%20autor%20on%20reader%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var style = document.createElement('style');
    style.innerHTML =
	`
    .message-cell.message-cell--user {
       display: none;
    }
    `

// Get the first script tag
    var ref = document.querySelector('script');

// Insert our new styles before the first script tag
    ref.parentNode.insertBefore(style, ref);
})();