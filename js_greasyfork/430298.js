// ==UserScript==
// @name         Show Percentage Capacity on Sprint
// @namespace    http://datainterchange.com/
// @version      0.2
// @description  Shows the percentage of capacity used on the Work Details
// @author       Marty Lowrie
// @include      /^https?://datainterchange\.visualstudio\.com.*
// @include      /^https?://dev\.azure\.com/datainterchange.*
// @grant        none
// @run-at       document-body
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.11/lodash.min.js#sha256-7/yoZS3548fXSRXqc/xYzjsmuW3sFKzuvOCHd06Pmps=
// @downloadURL https://update.greasyfork.org/scripts/430298/Show%20Percentage%20Capacity%20on%20Sprint.user.js
// @updateURL https://update.greasyfork.org/scripts/430298/Show%20Percentage%20Capacity%20on%20Sprint.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let currentUser;
    let azdoApiBaseUrl;
    let theme;
    var $ = window.jQuery;

    // Save CPU cycles - throttle requests to the onPageUpdated function
    const onPageUpdatedThrottled = _.throttle(onPageUpdated, 3000, { leading: false, trailing: true });

    function onReady() {
        // Find out who is our current user. In general, we should avoid using pageData because it doesn't always get updated when moving between page-to-page in AzDO's single-page application flow. Instead, rely on the AzDO REST APIs to get information from stuff you find on the page or the URL. Some things are OK to get from pageData; e.g. stuff like the user which is available on all pages.
        const pageData = JSON.parse(document.getElementById('dataProviders').innerHTML).data;
        currentUser = pageData['ms.vss-web.page-data'].user;

        // Because of CORS, we need to make sure we're querying the same hostname for our AzDO APIs.
        azdoApiBaseUrl = `${window.location.origin}${pageData['ms.vss-tfs-web.header-action-data'].suiteHomeUrl}`;
        theme = pageData["ms.vss-web.theme-data"].requestedThemeId;

        // Call our event handler if we notice new elements being inserted into the DOM. This happens as the page is loading or updating dynamically based on user activity.
        $('body > div.full-size')[0].addEventListener('DOMNodeInserted', onPageUpdatedThrottled);
    }

    function onPageUpdated(){
        updateCapacityPercentage();
    }

    function updateCapacityPercentage(){

        $('div.progress-text').each(function() {

            // Only do this if we've not already done it
            if($(this).text().includes("%") == false)
            {
                var originalText = $(this).text();
                originalText = originalText.replace(",", ".");
                var splitText = originalText.split(' ');
                var remainingWork = splitText[0].substr(1);
                var availableCapacity = splitText[2];

                var percentage = remainingWork / availableCapacity * 100;
                percentage = parseFloat(percentage).toFixed(0) +"%"

                var newText = [originalText.substr(0, originalText.length - 1), " - ", percentage, ")"].join('');

                $(this).text(newText);
            }
        });
    }

  // Start modifying the page once the DOM is ready.
  if (document.readyState !== 'loading') {
    onReady();
  } else {
    document.addEventListener('DOMContentLoaded', onReady);
  }
})();