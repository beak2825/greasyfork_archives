// ==UserScript==
// @name         Remove Cookie Banner from Reddit
// @namespace    https://reddit.com/
// @version      0.1
// @description  Remove cookie banner from Old Reddit
// @author       You
// @match        https://old.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440160/Remove%20Cookie%20Banner%20from%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/440160/Remove%20Cookie%20Banner%20from%20Reddit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector(".infobar-toaster-container").remove();
})();