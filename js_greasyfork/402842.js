// ==UserScript==
// @name         Inkbunny:  Fit image to window by default
// @namespace    https://greasyfork.org/en/users/553652-lutris
// @version      2.1
// @description  Clicks twice on the submission image, scrolling to the image and scaling it to fit in view.
// @author       Lutris
// @match        *://inkbunny.net/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402842/Inkbunny%3A%20%20Fit%20image%20to%20window%20by%20default.user.js
// @updateURL https://update.greasyfork.org/scripts/402842/Inkbunny%3A%20%20Fit%20image%20to%20window%20by%20default.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    });

    setTimeout( () => {
        document.getElementById("magicbox").dispatchEvent(clickEvent);
        document.getElementById("magicbox").dispatchEvent(clickEvent);
    }, 500);  // You might need to adjust this.  100 wasn't enough on a 2012 laptop, 300 was.

})();