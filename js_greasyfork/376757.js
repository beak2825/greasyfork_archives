// ==UserScript==
// @name       BGA Shortcuts
// @namespace  BGA Shortcuts
// @version    0.2.1
// @description  Keyboard shortcuts for the Atlas
// @include     http://*.boardgameatlas.*/*
// @include     http://boardgameatlas.*/*
// @include     https://*.boardgameatlas.*/*
// @include     https://boardgameatlas.*/*
// @copyright  2019+, JB McMichael
// @downloadURL https://update.greasyfork.org/scripts/376757/BGA%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/376757/BGA%20Shortcuts.meta.js
// ==/UserScript==

/*
 * CHANGLOG::
 * ============================================
 * 0.2.1 - Change how the focus works
 * 0.2.0 - Add / to jump to search
 * 0.1.3 - Fix copypasta error
 * 0.1.2 - Adding a changelog
 * 0.1.1 - Auto run the main function
 * 0.1.0 - First version
 */

(function () {
    "use strict";
    console.log('Loaded BGA Shortcuts');

    /** Keyboard Shortcuts **/
    document.body.addEventListener('keydown', function (e) {
        let active = document.activeElement.tagName.toLowerCase(),
            badElements = ['input', 'textarea', 'select'];

        // ignore shortcuts if we are in some form of input
        if (badElements.indexOf(active) === -1) {
            // Search box jump /
            if (e.key === '?') {
                let searchbox = document.querySelector('#bg-search');
                document.body.scrollTop = 0;
                window.setTimeout(function () {
                    searchbox.value = '';
                    searchbox.focus();
                }, 10);
            }
        }
    });

    /**
     * If we are on the edit page, do some things
     */
    if (window.location.search.search(/search\/game\/[a-zA-Z0-9]+\/edit$/)) {
        makeLabelsClickable();
    }

    /** Functions **/

    /**
     * Add IDs to the checkboxes, and then set the label's FOR attribute to allow clicking on the labels
     * to click the checkbox
     */
    function makeLabelsClickable() {
        let labels = document.querySelectorAll('.form-inline label');
        labels.forEach((label) => {
            let node = label.previousSibling;

            if (node !== null && node.matches('[type="checkbox"]')) {
                if (node.getAttribute('id') === null) {
                    node.setAttribute('id', node.value);
                    label.setAttribute('for', node.value);
                }
            }
        });
    }
}
());
