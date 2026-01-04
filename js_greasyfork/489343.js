// ==UserScript==
// @name         Remove Cookie Banner from Beta Reddit
// @namespace    https://reddit.com/
// @version      0.1
// @description  Remove cookie banner from Beta Reddit
// @author       Andrew Beaton
// @match        https://beta.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/489343/Remove%20Cookie%20Banner%20from%20Beta%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/489343/Remove%20Cookie%20Banner%20from%20Beta%20Reddit.meta.js
// ==/UserScript==   

(function() {
    'use strict';

    document.querySelector(".infobar-toaster-container").remove();
})();