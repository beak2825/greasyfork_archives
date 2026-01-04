// ==UserScript==
// @name         Daily auto click
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto press the Probot's daily button
// @author       Xuser
// @match        https://probot.io/daily
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467284/Daily%20auto%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/467284/Daily%20auto%20click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickElement() {
        var element = document.querySelector('.daily-logo-text i');
        if (element) {
            element.click();
        }
    }

    function waitForElement() {
        var element = document.querySelector('#main > div:nth-child(3) > section > div > div > div:nth-child(1) > div.daily-parent > div > div.daily-logo-text');
        if (element) {
            clickElement();
        } else {
            setTimeout(waitForElement, 100); 
        }
    }
    window.addEventListener('load', waitForElement);
})();
