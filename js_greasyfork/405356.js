// ==UserScript==
// @name         Insert a C?
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405356/Insert%20a%20C.user.js
// @updateURL https://update.greasyfork.org/scripts/405356/Insert%20a%20C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.getElementById('stage').insertAdjacentHTML('beforebegin','<img id="c" src="https://imgur.com/plFJQN8.png" alt="C">')
    document.getElementById("c").style.position = 'absolute';
    document.getElementById("c").style.top = '10em';
    document.getElementById("c").style.left = '3em';
    document.getElementById("c").style.width = '40px';
})();