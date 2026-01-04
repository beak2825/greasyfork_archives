// ==UserScript==
// @name         Remove Ignored Posts and Comments
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Удаляет комментарии и посты с классом "ignored"
// @author       eretly
// @match        https://lolz.live/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528988/Remove%20Ignored%20Posts%20and%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/528988/Remove%20Ignored%20Posts%20and%20Comments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeIgnoredElements() {
        const ignoredElements = document.querySelectorAll('.ignored');
        ignoredElements.forEach(element => {
            if (element.closest('li.message, li.comment, li.messageSimple')) {
                element.closest('li.message, li.comment, li.messageSimple').remove();
            } else {
                element.style.display = 'none';
            }
        });
    }

    removeIgnoredElements();

    const observer = new MutationObserver(() => {
        removeIgnoredElements();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
