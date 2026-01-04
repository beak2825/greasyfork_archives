// ==UserScript==
// @name         Image Hashinator
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Get all image hashes from a service call.
// @author       Anton Grouchtchak
// @match        https://office.roofingsource.com/admin/ProjectView.php*
// @icon         https://office.roofingsource.com/images/roofing-source-logo.png
// @license      GPLv3
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/478740/Image%20Hashinator.user.js
// @updateURL https://update.greasyfork.org/scripts/478740/Image%20Hashinator.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const autoImageIds = new Set();


    const $floatingButton = $('<button id="autoDeleteImagesBtn"></button>') // eslint-disable-line no-undef
    .addClass('ui-button ui-widget ui-state-default ui-corner-all')
    .css({
        position: 'fixed',
        bottom: '55px',
        right: '15px',
    })
    .button({ icons: { primary: 'ui-icon-trash' } })
    .hide();


    const calculateHash = async (image) => {
        const blob = await fetch(image.src).then(response => response.blob());
        const buffer = await new Response(blob).arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }


    const getImageId = (src) => {
        const url = new URL(src);
        const pathnameParts = url.pathname.split('/');
        const idIndex = pathnameParts.indexOf('inspection_photos') + 1;
        const imageId = pathnameParts[idIndex];
        return imageId;
    }


    const autoDeleteImages = async () => {
        const totalImages = autoImageIds.size;

        if (totalImages === 0) return;

        const isConfirmed = confirm(`Delete ${totalImages} autodetected duplicate image${totalImages === 1 ? '' : 's'}?`);

        if (!isConfirmed) return;

        $floatingButton.prop("disabled", true);

        const currentURL = new URL(window.location.href);

        $floatingButton.button('option', { label: `Deleting... (0/${totalImages})` });

        for (const id of autoImageIds) {
            currentURL.searchParams.set('delete_after', id);

            try {
                const response = await fetch(currentURL.toString(), { method: 'GET' });

                if (response.ok) {
                    autoImageIds.delete(id);
                    $floatingButton.button('option', { label: `Deleting... (${totalImages - autoImageIds.size}/${totalImages})` });
                } else {
                    console.error(`Error while sending GET request for ID ${id}: ${response.statusText}`);
                }
            } catch (error) {
                console.error(`Error while sending GET request for ID ${id}: ${error}`);
            }
        }

        $floatingButton.prop("disabled", false);
        $floatingButton.button('option', { label: 'No Duplicates Found' });
    }


    const images = document.querySelectorAll('img[src^="/wms/"]');
    const imageInfo = {};


    const processImage = async (image, index) => {
        const hash = await calculateHash(image);
        const id = getImageId(image.src);

        imageInfo[index] = {id, hash, image};

        // Format the hash objects once all images are checked.
        if (Object.keys(imageInfo).length === images.length) {
            const hashGroups = {};

            Object.values(imageInfo).forEach((item) => {
                if (!hashGroups[item.hash]) {
                    hashGroups[item.hash] = [];
                }
                hashGroups[item.hash].push(item);
            });

            const hashGroupsWithDuplicates = Object.values(hashGroups).filter(group => group.length > 1);
            const duplicates = hashGroupsWithDuplicates.flatMap(group => group.slice(0, -1));

            duplicates.forEach(item => {
                autoImageIds.add(item.id);
            });

            // Duplicate images.
            duplicates.forEach(object => {
                object.image.style.boxShadow = '0 0 5px 3px red';
            });

            hashGroupsWithDuplicates.forEach(group => {
                // Main image.
                group[group.length - 1].image.style.boxShadow = '0 0 5px 3px green';
            });

            if (autoImageIds.size === 0) {
                $floatingButton.button('option', { label: 'No Duplicates Found' });
            } else {
                $floatingButton.button('option', { label: `Found ${autoImageIds.size} duplicate${autoImageIds.size === 1 ? '' : 's'}` });
            }
            $floatingButton.show();
            $floatingButton.click(() => autoDeleteImages());

        }
    }


    $('body').append($floatingButton); // eslint-disable-line no-undef
    images.forEach(processImage);

})();
