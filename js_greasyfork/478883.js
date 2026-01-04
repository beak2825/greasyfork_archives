// ==UserScript==
// @name         Actual Map Refresh
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Refresh the map without resetting the form to default values.
// @author       Anton Grouchtchak
// @match        https://office.roofingsource.com/admin/test.php*
// @icon         https://office.roofingsource.com/images/roofing-source-logo.png
// @license      GPLv3
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/478883/Actual%20Map%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/478883/Actual%20Map%20Refresh.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const $refreshBtn = $('#refresh'); // eslint-disable-line no-undef
    $refreshBtn.hide();

    const $form = $('#right-panel form'); // eslint-disable-line no-undef
    $form.attr('id', 'regionForm');

    const $newRefreshBtn = $('<button id="newRefresh" type="submit" form="regionForm"></button>') // eslint-disable-line no-undef
    .addClass('ui-button ui-widget ui-state-default ui-corner-all')
    .button({ label: "Refresh" });

    $refreshBtn.before($newRefreshBtn);
})();
