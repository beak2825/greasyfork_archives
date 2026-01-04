// ==UserScript==
// @name         Unblur Discord Content
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Unblurs the content on paywalls in discord
// @author       Devappl
// @match        https://discord.com/*
// @match        https://discord.gg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482891/Unblur%20Discord%20Content.user.js
// @updateURL https://update.greasyfork.org/scripts/482891/Unblur%20Discord%20Content.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var repetitions = 0;
    function removeLockedContent() {
        var lockedContentElements = document.getElementsByClassName('lockedContentInner-2_OoQ7');
        for (var i = 0; i < lockedContentElements.length; i++) {
            var element = lockedContentElements[i];
            element.parentNode.removeChild(element);
        }
        repetitions++;
        if (repetitions === 10) {
            clearInterval(intervalId);
        }
    }
    var intervalId = setInterval(removeLockedContent, 0);
})();
