// ==UserScript==
// @name         Search Result Links
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Allow middle-clicking search results to open them in new tab.
// @author       Anton Grouchtchak
// @match        https://office.roofingsource.com/admin/*
// @icon         https://office.roofingsource.com/images/roofing-source-logo.png
// @license      GPLv3
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/478961/Search%20Result%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/478961/Search%20Result%20Links.meta.js
// ==/UserScript==


(function() {
    'use strict';

    GM_addStyle(`
        .autocomplete-item {
            padding: 0 !important;
        }

        .autocomplete-link {
            display: block;
            text-decoration: none;
            padding: 3px 1em 3px .4em;
        }

        /* Remove bold style on hover to prevent shifting. */
        .ui-autocomplete .ui-state-hover, .ui-autocomplete .ui-state-focus {
            font-weight: normal;
        }
    `);

    const searchInput = $('#search_bar'); // eslint-disable-line no-undef

    // Modify the rendering behavior to wrap items in anchor tags
    searchInput.autocomplete().data("ui-autocomplete")._renderItem = function(ul, item) {
        return $('<li>') // eslint-disable-line no-undef
            .addClass('autocomplete-item')
            .append($('<a>') // eslint-disable-line no-undef
                    .addClass('autocomplete-link')
                    .attr('href', item.value)
                    .text(item.label)
                   )
            .appendTo(ul);
    };

})();
