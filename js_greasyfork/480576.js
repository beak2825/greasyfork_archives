// ==UserScript==
// @name         Blacket QOL
// @namespace    https://blacket.org
// @version      1.0.0
// @description  QOL Features for Blacket!
// @author       Piotr
// @match        https://blacket.org/*
// @icon         https://blacket.org/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480576/Blacket%20QOL.user.js
// @updateURL https://update.greasyfork.org/scripts/480576/Blacket%20QOL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.onkeypress = function (e) {
        e = e || window.event;
        if (e.keyCode === 99 && !document.querySelector('input:focus') && !document.querySelector('textarea:focus')) blacket.toggleChat();
    };

    console.log("[Blacket QOL] Successfully launched!")
})();