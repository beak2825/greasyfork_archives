// ==UserScript==
// @id             Remove Amazon popups
// @name           Remove Amazon popups
// @description    Some marketing idiot at Amazon must have decided to make every link a popup.  This script prevents Amazon links from opening a new tab.
// @include        https://www.amazon.*
// @version 0.0.1
// @namespace https://greasyfork.org/users/39602
// @downloadURL https://update.greasyfork.org/scripts/18960/Remove%20Amazon%20popups.user.js
// @updateURL https://update.greasyfork.org/scripts/18960/Remove%20Amazon%20popups.meta.js
// ==/UserScript==

(function() {
    'use strict';

    [].forEach.call(document.querySelectorAll('a[target="_blank"]'),
                    function(link) {
        link.removeAttribute('target');
    });
})();