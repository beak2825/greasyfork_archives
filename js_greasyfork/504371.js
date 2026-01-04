// ==UserScript==
// @name         Free Atlassian Jira
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes annoying "buy premium window"
// @author       Tornamic
// @match        *://*.atlassian.net/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/504371/Free%20Atlassian%20Jira.user.js
// @updateURL https://update.greasyfork.org/scripts/504371/Free%20Atlassian%20Jira.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const targetImgSrc = "https://jira-frontend-bifrost.prod-east.frontend.public.atl-paas.net/assets/modal-graphic-dark.6f94c997.svg";
    function hasTargetImage(element) {
        if (!element) return false;
        if (element.tagName === 'IMG' && element.src === targetImgSrc) {
            return true;
        }
        for (let i = 0; i < element.children.length; i++) {
            if (hasTargetImage(element.children[i])) {
                return true;
            }
        }

        return false;
    }
    function removeElements() {
        let elements = document.getElementsByClassName('css-1yerbni');
        if (elements.length > 0) {
            Array.from(elements).forEach(element => {
                if (element.getAttribute('aria-hidden') === 'false') {
                    if (hasTargetImage(element)) {
                        element.remove();
                    }
                }
            });
        }
    }
    setInterval(removeElements, 1000);

})();