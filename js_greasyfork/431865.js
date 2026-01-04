// ==UserScript==
// @name         Dark mode for Messenger
// @version      0.1
// @description  Dark mode for messenger.com
// @author       Ibrahim
// @match        https://www.messenger.com/*
// @grant        none
// @namespace https://greasyfork.org/users/737196
// @downloadURL https://update.greasyfork.org/scripts/431865/Dark%20mode%20for%20Messenger.user.js
// @updateURL https://update.greasyfork.org/scripts/431865/Dark%20mode%20for%20Messenger.meta.js
// ==/UserScript==

(function () {
    "use strict";
    
    document.querySelector("head > style").innerHTML = document.querySelector("head > style").innerHTML.replace(":root,.__fb-light-mode", "none").replace("__fb-dark-mode:root,.__fb-dark-mode", ":root,.__fb-light-mode");
})();

