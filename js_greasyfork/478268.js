// ==UserScript==
// @name         One Click Pending
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Add a button to set a service call to 'Pending ETA' status.
// @author       Anton Grouchtchak
// @match        https://office.roofingsource.com/admin/ProjectView.php*
// @icon         https://office.roofingsource.com/images/roofing-source-logo.png
// @license      GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478268/One%20Click%20Pending.user.js
// @updateURL https://update.greasyfork.org/scripts/478268/One%20Click%20Pending.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // Set the 'Tech' dropdown to 'On Account', 'Status' dropdown to 'Pending ETA', clear the 'Confirmed Appointment Date' input box and set time dropdown to 12 PM.
    const setPending = () => {
        const $techDropdown = $('select[name="tech_sid"]').first(); // eslint-disable-line no-undef
        const $dateInput = $("#proj_sch_date_start"); // eslint-disable-line no-undef
        const $timeDropdown = $('select[name="proj_sch_time_start"]'); // eslint-disable-line no-undef
        const $statusDropdown = $('select[name="proj_status_sid"]'); // eslint-disable-line no-undef

        $techDropdown.val("0") // Value '0' is sometimes both 'No Tech Assigned' and 'On Account'. But the last option is selected.
        $statusDropdown.val("1"); // Value '1' is 'Pending ETA'.
        $dateInput.val('');
        $timeDropdown.val('12:00:00');
    }


    const $PendingButton = $('<button id="setPendingBtn" type="button"></button>') // eslint-disable-line no-undef
    .addClass('ui-button ui-widget ui-state-default ui-corner-all')
    .button({ label: "Set Pending" })
    .click(() => setPending());

    const $deleteButton = $('#delete-button').length ? $('#delete-button') : $('#delete-button-disabled'); // eslint-disable-line no-undef

    $deleteButton.before($PendingButton);
    $deleteButton.css({'margin-left': '', 'float': 'right', 'margin-right': '1rem'});

})();
