// ==UserScript==
// @name         Awards on Homepage
// @version      1.0
// @description  Adds award count to the General Information widget on the homepage.
// @author       Pagey [2129946]
// @match        https://www.torn.com/index.php
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @namespace https://greasyfork.org/users/1170880
// @downloadURL https://update.greasyfork.org/scripts/475030/Awards%20on%20Homepage.user.js
// @updateURL https://update.greasyfork.org/scripts/475030/Awards%20on%20Homepage.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // Define your API key
    const apiKey = '';

    // Define the updated API endpoint
    const apiUrl = `https://api.torn.com/user/?selections=profile&key=${apiKey}`;

    // Make the API request using GM_xmlhttpRequest
    GM_xmlhttpRequest({
        method: 'GET',
        url: apiUrl,
        onload: function(response) {
            if (response.status === 200) {
                // Parse the JSON response
                const responseData = JSON.parse(response.responseText);

                // Extract the Awards result from the response
                const awardsResult = responseData.awards || 'No awards found';

                // Find the "info-cont-wrap" element within the "General Information" section
                const infoContWrapElement = $('.sortable-box#item10674115 .cont-gray.bottom-round .info-cont-wrap');

                // Create a new li element to display the Awards result
                const awardsElement = $('<li tabindex="0" aria-label="Awards">' +
                    '<span class="divider"><span>Awards</span></span>' +
                    '<span class="desc">' + awardsResult + '</span>' +
                    '</li>');

                // Insert the Awards element as the third item (index 2) of the "info-cont-wrap" element
                infoContWrapElement.find('li:eq(3)').after(awardsElement);
            } else {
                console.error('API Request failed with status:', response.status);
            }
        },
        onerror: function(error) {
            console.error('API Request error:', error);
        }
    });
})(jQuery);
