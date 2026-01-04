// ==UserScript==
// @name         F95 Compressed button
// @namespace    http://tampermonkey.net/
// @description  Added a 'compressed' search button
// @version      3
// @author       You
// @match        https://f95zone.to/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=f95zone.to
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543896/F95%20Compressed%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/543896/F95%20Compressed%20button.meta.js
// ==/UserScript==
{

    
    //Ver Compressed
    var button1 = '<input type="button" value="New+Compressed" ' +
        'style="position: fixed; top: 25%; right: 120px; z-index: 9999;line-height: 30px;font-size: 20px; ">';
    jQuery('body').append(button1);
    var labelAppend = document.querySelector('div.p-title h1.p-title-value');
    var match = labelAppend.textContent.match(/\[(.*?)\]/);
    var extractedString = match[1] + ' Compressed';
    jQuery('body').on('click', 'input[type="button"][value="New+Compressed"]', function() {

        const searchInput = document.querySelector('.uix_searchInput');
        if (searchInput) {
            searchInput.value = extractedString;

            const event = new Event('input', { bubbles: true });
            searchInput.dispatchEvent(event);

            const searchButton = document.querySelector('button.button--primary.button--icon--search');
            if (searchButton) {
                searchButton.click();
            }
        }
    });
	
	//Compressed
    var button4 = '<input type="button" value="Compressed" ' +
        'style="position: fixed; top: 30%; right: 120px; z-index: 9999;line-height: 30px;font-size: 20px; ">';
    jQuery('body').append(button4);
    jQuery('body').on('click', 'input[type="button"][value="Compressed"]', function() {
        const searchInput = document.querySelector('.uix_searchInput');
        if (searchInput) {
            searchInput.value = 'Compressed';
            const event = new Event('input', { bubbles: true });
            searchInput.dispatchEvent(event);
            const searchButton = document.querySelector('button.button--primary.button--icon--search');
            if (searchButton) {
                searchButton.click();
            }
        }
    });
}