// ==UserScript==
// @name         Element Compact room list
// @namespace    http://artificialworlds.net/
// @version      0.1
// @description  Shrinks room list items in Element to fit more on the screen
// @author       Andy Balaam
// @match        https://app.element.io/*
// @grant        none
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/433493/Element%20Compact%20room%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/433493/Element%20Compact%20room%20list.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addStyle(css) {
        const style = document.getElementById("GM_addStyleContainer") || (function() {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = "GM_addStyleContainer";
            document.head.appendChild(style);
            return style;
        })();
        const sheet = style.sheet;
        sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
    }

    addStyle(`
        .mx_BaseAvatar_image {
            width: 16px !important;
            height: 16px !important;
        }
    `);

    addStyle(`
        .mx_RoomTile {
            padding: 2px;
            margin-bottom: 0px;
            height: 20px
        }
    `);

    addStyle(`
        .mx_RoomBreadcrumbs .mx_RoomBreadcrumbs_crumb {
            margin-right: 2px;
        }
    `);
})();
