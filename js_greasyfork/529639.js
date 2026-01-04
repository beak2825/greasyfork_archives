// ==UserScript==
// @name         Discord Kill Autofocus
// @description  Prevent chat auto focus on Discord desktop and mobile.
// @author C89sd
// @version      0.6
// @match        https://discord.com/*
// @namespace https://greasyfork.org/users/1376767
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/529639/Discord%20Kill%20Autofocus.user.js
// @updateURL https://update.greasyfork.org/scripts/529639/Discord%20Kill%20Autofocus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let clickInTextbox = false;
    document.addEventListener('mousedown', (event) => {
        if (event.target.closest('div[role="textbox"], textarea')) {
            clickInTextbox = true;
        }
    });
    document.addEventListener('mouseup', (event) => {
        setTimeout(() => {
          clickInTextbox = false;
        }, 100);
    });

    function detectAndRemoveFocus(event) {
        const target = event.target;
        if (!clickInTextbox && target && target.matches && target.matches('div[role="textbox"], textarea')) {
            target.blur();
        } else {
          clickInTextbox = false;
        }
    }
    document.addEventListener('focus', detectAndRemoveFocus, true);
})();