// ==UserScript==
// @name         Homepage-Widget-Lock
// @namespace    whiskysip.torn.chilliking.userscripts
// @version      1.0
// @description  Prevents the widgets so they can't be moved by accident by removing the move button
// @author       ChilliKing [2949201]
// @license      GNU GPLv3
// @run-at       document-start
// @match        https://www.torn.com/index.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490120/Homepage-Widget-Lock.user.js
// @updateURL https://update.greasyfork.org/scripts/490120/Homepage-Widget-Lock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set this variable to true to enable the removal of accordion-header-move elements
    var removeAccordions = true;

    window.addEventListener('load', function() {
        if (removeAccordions) {
            var elements = document.querySelectorAll('.accordion-header-move');
            elements.forEach(function(element) {
                element.parentNode.removeChild(element);
            });
        }
    });
})();
