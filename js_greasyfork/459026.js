// ==UserScript==
// @name         Type release on new item
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  When entering a list item on RYM, release is auto-selected
// @author       jermrellum
// @match        https://rateyourmusic.com/lists/new_item*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459026/Type%20release%20on%20new%20item.user.js
// @updateURL https://update.greasyfork.org/scripts/459026/Type%20release%20on%20new%20item.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById('type_album').click();
    document.getElementById('searchtype').value = 'l';
})();