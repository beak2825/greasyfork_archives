// ==UserScript==
// @name         Building Update Button
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Add an 'Update' button to the building edit page at the top left.
// @author       Anton Grouchtchak
// @match        https://office.roofingsource.com/admin/BuildingModify.php*
// @icon         https://office.roofingsource.com/images/roofing-source-logo.png
// @license      GPLv3
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/488365/Building%20Update%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/488365/Building%20Update%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const $form = $('.rs-ui-content form'); // eslint-disable-line no-undef
    $form.attr('id', 'buildingForm');

    const $newUpdateBtn = $('<button id="newUpdate" type="submit" form="buildingForm"></button>') // eslint-disable-line no-undef
    .addClass('ui-button ui-widget ui-state-default ui-corner-all')
    .button({ label: "Update" });

    const lineBreaks = $('<br><br>'); // eslint-disable-line no-undef
    $('.button-icon:last').after($newUpdateBtn); // eslint-disable-line no-undef
    $('.button-icon:last').after(lineBreaks); // eslint-disable-line no-undef
})();
