// ==UserScript==
// @name         super-drag
// @namespace    https://greasyfork.org/users/1203219
// @author       harutya
// @match        *://*/*
// @license      MIT
// @version      0.0.1
// @description  超级拖拽
// @downloadURL https://update.greasyfork.org/scripts/481667/super-drag.user.js
// @updateURL https://update.greasyfork.org/scripts/481667/super-drag.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Prevent default behavior for the drop event
    document.addEventListener('dragover', function(event) {
        event.preventDefault();
    });

    // Handle the drop event
    document.addEventListener('drop', function(event) {
        // Prevent the default drop behavior
        event.preventDefault();

        // Access dropped data
        const droppedData = event.dataTransfer.getData('text/plain');

        // Check if the dropped data is a link
        if (droppedData.startsWith('http') || droppedData.startsWith('www')) {
            // Open the link in a new tab
            window.open(droppedData, '_blank');
        } else {
            // Check if the selected text is a valid URL
            const isURL = /^(ftp|http|https):\/\/[^ "]+$/.test(droppedData);

            if (droppedData !== '' && isURL) {
                // Open the URL in a new tab
                window.open(droppedData, '_blank');
            } else {
                // Create a Bangumi search URL with the selected text
                const bangumiSearchURL = `https://bangumi.tv/subject_search/${encodeURIComponent(droppedData)}?cat=all`;

                // Open the Bangumi search URL in a new tab
                window.open(bangumiSearchURL, '_blank');
            }
        }
    });
})();
