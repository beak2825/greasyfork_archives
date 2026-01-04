// ==UserScript==
// @name         Typeracer No Spacebar Scroll
// @version      1.0
// @description  It's just so annoying...
// @author       Octahedron
// @match        https://play.typeracer.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=typeracer.com
// @grant        none
// @namespace https://greasyfork.org/users/929264
// @downloadURL https://update.greasyfork.org/scripts/481132/Typeracer%20No%20Spacebar%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/481132/Typeracer%20No%20Spacebar%20Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('keydown', function(e) {
        if(e.keyCode == 32 && e.target == document.body) {
            e.preventDefault();
        }
    });
})();