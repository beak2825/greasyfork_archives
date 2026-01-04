// ==UserScript==
// @name         ExamTopics Popup Remover and Right-Click Enabler
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hides the "notRemoverPopup" and enables right-click on examtopics.com
// @author       Aruna Telshan
// @match        https://www.examtopics.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532822/ExamTopics%20Popup%20Remover%20and%20Right-Click%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/532822/ExamTopics%20Popup%20Remover%20and%20Right-Click%20Enabler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hidePopup() {
        const popup = document.getElementById('notRemoverPopup');
        if (popup) {
            popup.style.display = 'none';
        }
    }

    function enableRightClick() {
        document.addEventListener('contextmenu', function(e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.returnValue = true;
            return true;
        }, true);
        document.addEventListener('mousedown', function(e) {
            if (e.button === 2) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                e.returnValue = true;
                return true;
            }
        }, true);
        document.addEventListener('mouseup', function(e) {
            if (e.button === 2) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                e.returnValue = true;
                return true;
            }
        }, true);
        document.addEventListener('click', function(e) {
            if (e.button === 2) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                e.returnValue = true;
                return true;
            }
        }, true);

        // Remove potential inline event handlers that might be blocking right-click.
        document.querySelectorAll('*').forEach(function(element) {
            element.oncontextmenu = null;
            element.onmousedown = null;
            element.onmouseup = null;
            element.onclick = null;
        });

    }

    hidePopup();
    enableRightClick();

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            hidePopup();
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();