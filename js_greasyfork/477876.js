// ==UserScript==
// @name         Multi-Image Delete
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Delete multiple tech images directly via API.
// @author       Anton Grouchtchak
// @match        https://office.roofingsource.com/admin/ProjectView.php*
// @icon         https://office.roofingsource.com/images/roofing-source-logo.png
// @license      GPLv3
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/477876/Multi-Image%20Delete.user.js
// @updateURL https://update.greasyfork.org/scripts/477876/Multi-Image%20Delete.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const deleteAfterIds = new Set();


    const toggleFloatingButton = () => {
        $('#deleteImages').toggle(deleteAfterIds.size > 0); // eslint-disable-line no-undef
    };


    const deleteAfterOverride = (id) => {
        return; // Override original function.
    };


    const deleteAfterMultiple = async () => {
        const totalImages = deleteAfterIds.size;

        if (totalImages === 0) return;

        const isConfirmed = confirm(`Delete ${totalImages} image${totalImages === 1 ? '' : 's'}?`);

        if (!isConfirmed) return;

        const $deleteImagesButton = $('#deleteImages'); // eslint-disable-line no-undef
        $deleteImagesButton.prop("disabled", true);

        const currentURL = new URL(window.location.href);

        $deleteImagesButton.button('option', { label: `Deleting... (0/${totalImages})` });

        for (const id of deleteAfterIds) {
            currentURL.searchParams.set('delete_after', id);

            try {
                const response = await fetch(currentURL.toString(), { method: 'GET' });

                if (response.ok) {
                    deleteAfterIds.delete(id);
                    $deleteImagesButton.button('option', { label: `Deleting... (${totalImages - deleteAfterIds.size}/${totalImages})` });

                    // Delete images from frontend.
                    // const $imageListItem = $(`.button[onclick^="deleteAfter(${id})"]`).closest('li'); // eslint-disable-line no-undef
                    // $imageListItem.parent('ul').remove();
                } else {
                    console.error(`Error while sending GET request for ID ${id}: ${response.statusText}`);
                }
            } catch (error) {
                console.error(`Error while sending GET request for ID ${id}: ${error}`);
            }
        }

        $deleteImagesButton.prop("disabled", false);
        $deleteImagesButton.button('option', { label: 'Delete Images' });
    };


    const $floatingButton = $('<button id="deleteImages">Delete Images</button>') // eslint-disable-line no-undef
    .addClass('ui-button ui-widget ui-state-default ui-corner-all')
    .css({
        position: 'fixed',
        bottom: '15px',
        right: '15px',
    })
    .button({ icons: { primary: 'ui-icon-trash' } })
    .hide()
    .click(() => deleteAfterMultiple());


    const toggleIconClass = (button, isActive) => {
        const iconClass = isActive ? 'ui-icon-check' : 'ui-icon-trash';
        $(button).find('.ui-icon').attr('class', `ui-icon ${iconClass}`); // eslint-disable-line no-undef
    };


    const handleButtonClick = (e) => {
        const button = e.currentTarget;
        const deleteAfterID = button.getAttribute('onclick').match(/\d+/)[0];

        if (deleteAfterIds.has(deleteAfterID)) {
            deleteAfterIds.delete(deleteAfterID);
        } else {
            deleteAfterIds.add(deleteAfterID);
        }

        $(button).trigger('iconUpdate'); // eslint-disable-line no-undef
        toggleFloatingButton();
    };


    $(document).on('click', '.button[onclick^="deleteAfter("]', handleButtonClick); // eslint-disable-line no-undef
    $(document).on('iconUpdate', '.button[onclick^="deleteAfter("]', (e) => { // eslint-disable-line no-undef
        const button = e.currentTarget;
        const deleteAfterID = button.getAttribute('onclick').match(/\d+/)[0];
        toggleIconClass(button, deleteAfterIds.has(deleteAfterID));
    });

    $('body').append($floatingButton); // eslint-disable-line no-undef
    window.deleteAfter = deleteAfterOverride;

})();
