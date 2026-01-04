// ==UserScript==
// @name         Untranslate Reddit Results on Google
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add "-inurl:?tl=" suffix to search queries with Shift+T by modifying URL
// @author       Joaquín Suez
// @match        https://www.google.com/search*
// @match        https://google.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542573/Untranslate%20Reddit%20Results%20on%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/542573/Untranslate%20Reddit%20Results%20on%20Google.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addSuffix() {
        try {
            const currentUrl = new URL(window.location.href);
            const suffix = ' -inurl:?tl=';

            let queryParam = null;
            let currentQuery = '';

            if (currentUrl.searchParams.has('q')) {
                queryParam = 'q';
                currentQuery = currentUrl.searchParams.get('q') || '';
            } else if (currentUrl.searchParams.has('search')) {
                queryParam = 'search';
                currentQuery = currentUrl.searchParams.get('search') || '';
            } else if (currentUrl.searchParams.has('query')) {
                queryParam = 'query';
                currentQuery = currentUrl.searchParams.get('query') || '';
            }

            if (!queryParam) {
                console.log('No query parameter found in URL');
                return;
            }

            if (!currentQuery.includes('-inurl:?tl=')) {
                const newQuery = currentQuery + suffix;
                currentUrl.searchParams.set(queryParam, newQuery);

                window.location.href = currentUrl.toString();

                console.log('Successfully added suffix');
            } else {
                console.log('Suffix already exists in query');
            }
        } catch (error) {
            console.log('Error in addSuffix:', error);
        }
    }

    document.addEventListener('keydown', function(event) {
        if (event.shiftKey && event.key === 'T') {
            try {
                event.preventDefault();
                addSuffix();
            } catch (error) {
                console.log('Error: ', error);
            }
        }
    });

})();