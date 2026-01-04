// ==UserScript==
// @name        Keine PDF popups - Logineo
// @namespace   Violentmonkey Scripts
// @match       https://*.logineonrw-lms.de/course/view.php
// @grant       none
// @version     1.0
// @author      mueller_minki (iAmInActions)
// @license     WTFPL
// @description Behebt ein Problem mit Logineo, bei dem PDFs als eingebettetes Popup geöffnet werden, was das Herunterladen und paralleles Öffnen mehrerer PDFs erschwert.
// @downloadURL https://update.greasyfork.org/scripts/479365/Keine%20PDF%20popups%20-%20Logineo.user.js
// @updateURL https://update.greasyfork.org/scripts/479365/Keine%20PDF%20popups%20-%20Logineo.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    setTimeout(function() {
        recursiveRemoveAttributes(document.getElementById('single_section_tiles'));
        document.getElementById('single_section_tiles').removeAttribute('id');
    }, 1000); // You can adjust the delay time here if necessary

    function recursiveRemoveAttributes(element) {
        if (!element) {
            return;
        }

        for (let i = 0; i < element.children.length; i++) {
            const child = element.children[i];
            for (let j = child.attributes.length - 1; j >= 0; j--) {
                const attributeName = child.attributes[j].name;
                if (
                    attributeName !== 'class' &&
                    !(child.tagName.toLowerCase() === 'a' && attributeName === 'href') &&
                    !(child.tagName.toLowerCase() === 'img' && attributeName === 'src')
                ) {
                    child.removeAttribute(attributeName);
                }
            }
            if (child.tagName.toLowerCase() === 'a') {
                child.setAttribute('target', '_blank');
            }
            recursiveRemoveAttributes(child);
        }
    }
});