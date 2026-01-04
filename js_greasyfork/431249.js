// ==UserScript==
// @name         Show Task Assigned To
// @namespace    http://tampermonkey.net/
// @description  Shows the number of times a card has gone from Ready for Test or In Test to the Ready for Dev or In Dev columns
// @version      0.1
// @author       Craig Holland
// @include      /^https?://datainterchange\.visualstudio\.com.*
// @include      /^https?://dev\.azure\.com/datainterchange.*
// @grant        none
// @run-at       document-body
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.11/lodash.min.js#sha256-7/yoZS3548fXSRXqc/xYzjsmuW3sFKzuvOCHd06Pmps=

// @downloadURL https://update.greasyfork.org/scripts/431249/Show%20Task%20Assigned%20To.user.js
// @updateURL https://update.greasyfork.org/scripts/431249/Show%20Task%20Assigned%20To.meta.js
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
        updateTasks();
    }


    function updateTasks(){
        var count = $('div.work-item').length;
        $('div.work-item').each(function(index){
            var id = $( this ).attr("id");
            var api_url = `${azdoApiBaseUrl}/_apis/wit/workItems/${id}?api=version=5.1`;
            $.ajax({
                url: api_url,
                json: true
            }).then(function(data) {
                var taskTitle = data.fields["System.Title"];
                var assignedToObject = data.fields["System.AssignedTo"];
                if(assignedToObject != null)
                {
                    var assignedToTaskPerson = assignedToObject["displayName"];
                    $(`div#${id}.work-item span.clickable-title`).text(taskTitle + " - Assigned To: " + assignedToTaskPerson);
                    $(`div#PopupContentContainer div.popup-content-container:contains('${taskTitle}')`).text(taskTitle + " - Assigned To: " + assignedToTaskPerson);
                    $(`div#PopupContentContainer div.popup-content-container:contains("${taskTitle}")`).text(taskTitle + " - Assigned To: " + assignedToTaskPerson);
                }
                else
                {
                    $(`div#${id}.work-item span.clickable-title`).text(taskTitle + " - Unassigned");
                    $(`div#PopupContentContainer div.popup-content-container:contains('${taskTitle}')`).text(taskTitle + " - Unassigned");
                    $(`div#PopupContentContainer div.popup-content-container:contains("${taskTitle}")`).text(taskTitle + " - Unassigned");
                }
            });
       });
    }

  // Start modifying the page once the DOM is ready.
  if (document.readyState !== 'loading') {
    onReady();
  } else {
    document.addEventListener('DOMContentLoaded', onReady);
  }
})();