// ==UserScript==
// @name         YouTube - Stay Active and Play Forever
// @namespace    q1k
// @version      3.1.1
// @description  Tired of Youtube pausing playback asking you to click 'yes' to continue playing? This script will make the popup never appear, music will never stop. Never pause, never inactive, never worry. The script will keep you active and keep playing music FOREVER. Enables playing in background on mobile.
// @author       q1k
// @match        *://*.youtube.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/390352/YouTube%20-%20Stay%20Active%20and%20Play%20Forever.user.js
// @updateURL https://update.greasyfork.org/scripts/390352/YouTube%20-%20Stay%20Active%20and%20Play%20Forever.meta.js
// ==/UserScript==

Object.defineProperties(document, { /*'hidden': {value: false},*/ 'webkitHidden': {value: false}, 'visibilityState': {value: 'visible'}, 'webkitVisibilityState': {value: 'visible'} });

setInterval(function(){
    document.dispatchEvent( new KeyboardEvent( 'keyup', { bubbles: true, cancelable: true, keyCode: 143, which: 143 } ) );
}, 60000);

