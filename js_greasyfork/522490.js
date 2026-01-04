// ==UserScript==
// @name         BaseLinker productization count in Allegro listing & errors export
// @namespace    http://tampermonkey.net/
// @version      2025-05-27
// @license      MIT
// @description  Check BaseLinker productization count in Allegro
// @author       You
// @match        https://*.baselinker.com/allegro_sell_form.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baselinker.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522490/BaseLinker%20productization%20count%20in%20Allegro%20listing%20%20errors%20export.user.js
// @updateURL https://update.greasyfork.org/scripts/522490/BaseLinker%20productization%20count%20in%20Allegro%20listing%20%20errors%20export.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Listing error messages
    var errorMessagesInfo = [];
    $('#sell_form_log').after('<div id="error_messages_info_box" class="padding-sm well no-border" id="error_messages"></div>');
    $('#error_messages_info_box').append('<button id="download_errors_csv" class="btn btn-primary">Download errors to CSV</button>');
    $('#error_messages_info_box').append('<button id="download_errors_csv_grouped" class="btn btn-primary">Download errors to CSV Grouped</button>');
 
    $('#download_errors_csv').click(() => {
        const header = `"EAN";"Error message"`;
        const csv = [
            header,
            ...errorMessagesInfo.map(({ ean, message }) => {
                const cleanEan = ean.replace(/"/g, '""');
                const cleanMessage = message.replace(/"/g, '""');
                return `"${cleanEan}";"${cleanMessage}"`;
            })
        ].join('\n');
 
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'errors.csv';
        a.click();
    });
 
    $('#download_errors_csv_grouped').click(() => {
        // Group errors by the message field
        const groupedErrors = errorMessagesInfo.reduce((acc, { ean, message }) => {
            if (!acc[message]) {
                acc[message] = { count: 0, eans: [] };
            }
            acc[message].count++;
            acc[message].eans.push(ean);
            return acc;
        }, {});
 
        // Prepare the CSV data
        const csv = [
            `"Error";"Count";"Products"`,
            ...Object.entries(groupedErrors).map(([message, { count, eans }]) => {
                const cleanMessage = message.replace(/"/g, '""');
                const productList = eans.join(', ').replace(/"/g, '""');
                return `"${cleanMessage}";"${count}";"${productList}"`;
            })
        ].join('\n');
 
        // Create and download the CSV file
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'grouped_errors.csv';
        a.click();
    });
 
 
    //productization info
    const $table = $('.sell_form_starter-top table tbody');
 
    // Add rows for status and counts
    const addRow = (label, id) => {
        $table.append(`
            <tr>
                <td><b>${label}:</b></td>
                <td id="${id}"></td>
            </tr>
        `);
    };
 
    addRow('Search status', 'search_complete_status');
    addRow('Found count', 'search_found_count');
    addRow('Not found count', 'search_notfound_count');
 
    const $status = $('#search_complete_status');
    const $foundCount = $('#search_found_count');
    const $notFoundCount = $('#search_notfound_count');
 
    const $elements = $('.info_tr button[onclick="showProductizationModal($(this))"]:not([typ])');
    const allElementsCount = $elements.length;
    $status.text(`0/${allElementsCount}`);
 
    const updateCounts = () => {
        const completedCount = $('.info_tr button[onclick="showProductizationModal($(this))"][typ]').length;
        const foundCount = $('.info_tr button[typ="selected"]').length;
        const notFoundCount = $('.info_tr button[typ="notfound"]').length + $('.info_tr button[typ="create"]').length;
 
        $status.text(`${completedCount}/${allElementsCount}`);
        $foundCount.text(foundCount);
        $notFoundCount.text(notFoundCount);
    };
 
    // Observe button attribute changes
    const observer = new MutationObserver(() => updateCounts());
 
    $elements.each((_, button) => {
        observer.observe(button, { attributes: true });
    });
 
    const processListings = () => {
        errorMessagesInfo = [];
        $('.result_error').each(function () {
            const error = $(this);
            const errorMessage = error.find('td').clone() // Clone to avoid modifying original
                .find('button').remove().end()            // Remove buttons from the clone
                .text().trim();
 
            const error_el_id = error.attr('id').split('_')[0];
            const eanInput = $(`#${error_el_id}_params_tr span:contains("EAN")`).siblings('input').val() || '';
 
            if (errorMessage) {
                errorMessagesInfo.push({ ean: eanInput, message: errorMessage });
            }
        });
    };
 
    const trObserver = new MutationObserver(() => processListings());
 
    $('.info_tr td:first-child').each(function () {
        trObserver.observe(this, { attributes: true, attributeFilter: ['class'] });
    });
})();