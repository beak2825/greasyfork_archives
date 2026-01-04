// ==UserScript==
// @name                Selection and Copying Restorer
// @version             0.4
// @description         Unlock right-click, remove restrictions on copy, cut, select text, right-click menu, text copying, text selection, image right-click
// @namespace           https://greasyfork.org/users/1300060
// @author              AstralRift
// @run-at              document-end
// @match               *://*/*
// @grant               GM_registerMenuCommand
// @grant               GM_unregisterMenuCommand
// @grant               GM.setValue
// @grant               GM.getValue
// @grant               GM_addValueChangeListener
// @grant               unsafeWindow
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/494674/Selection%20and%20Copying%20Restorer.user.js
// @updateURL https://update.greasyfork.org/scripts/494674/Selection%20and%20Copying%20Restorer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function unlockTextSelection() {
        const style = document.createElement('style');
        style.textContent = `
            * {
                user-select: text !important;
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
            }
        `;
        document.head.appendChild(style);
    }

    function hasCopyRestrictions() {
        const testElement = document.createElement('div');
        testElement.style.userSelect = 'none';
        document.body.appendChild(testElement);
        const userSelect = getComputedStyle(testElement).userSelect;
        document.body.removeChild(testElement);

        if (userSelect === 'none') return true;

        const events = ['contextmenu', 'copy', 'cut', 'selectstart'];
        const isBlocked = events.some(event => {
            let blocked = false;
            document.addEventListener(event, function tempListener(e) {
                e.stopImmediatePropagation();
                blocked = true;
                document.removeEventListener(event, tempListener, true);
            }, true);

            const evt = new Event(event, { bubbles: true, cancelable: true });
            document.dispatchEvent(evt);
            return blocked;
        });

        return isBlocked;
    }

    function stopEventPropagation(event) {
        event.stopPropagation();
    }

    function stopEventDefault(event) {
        event.preventDefault();
    }

    function toggleEnabled() {
        GM.getValue('enabled', true).then(enabled => {
            enabled = !enabled;
            GM.setValue('enabled', enabled).then(() => {
                location.reload();
            });
        });
    }

    GM_registerMenuCommand('Toggle Selection and Copying Restorer', toggleEnabled);

    GM.getValue('enabled', true).then(enabled => {
        if (enabled && hasCopyRestrictions()) {
            unlockTextSelection();

            const eventOptions = { capture: true, passive: true };
            const eventOptionsNoPassive = { capture: true };

            document.addEventListener('contextmenu', stopEventPropagation, eventOptions);
            document.addEventListener('copy', stopEventDefault, eventOptionsNoPassive);
            document.addEventListener('cut', stopEventDefault, eventOptionsNoPassive);
        }
    });
})();
