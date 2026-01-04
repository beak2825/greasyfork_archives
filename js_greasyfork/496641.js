// ==UserScript==
// @name         ServiceNow - Activity actions
// @version      0.1.1
// @description  Additional actions in Activity section: Button to copy comments and work notes to clipboard, Filter for type
// @author       Matteo Lecca
// @match        *.service-now.com/*.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=service-now.com
// @grant        none
// @license MIT
// @namespace    https://greasyfork.org/users/1246673
// @downloadURL https://update.greasyfork.org/scripts/496641/ServiceNow%20-%20Activity%20actions.user.js
// @updateURL https://update.greasyfork.org/scripts/496641/ServiceNow%20-%20Activity%20actions.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let noteTextBlocks = document.querySelectorAll('.sn-widget-textblock-body');

    // Copy button in comments and notes
    noteTextBlocks.forEach(textBlock => {
        let copyButton = document.createElement('a');
        copyButton.title = '[WK - SN] Copy text';
        copyButton.onclick = copyTextWK;
        copyButton.classList.add('btn', 'btn-secondary', 'btn-ref', 'icon', 'icon-copy');
        copyButton.style.position = 'absolute';
        copyButton.style.top = '-5px';
        copyButton.style.right = '0px';

        textBlock.parentNode.append(copyButton);
    });

    function copyTextWK(evt) {
        evt.preventDefault();
        navigator.clipboard.writeText(evt.target.parentNode.children[0].innerText).then(() => {
            console.log('[WK - SN] Text copied to clipboard');
        }, () => {
            g_form.addErrorMessage('[WK - SN] Error, it\'s not possible to copy the text');
        });
    }



    // Button to opean search
    let activityFilterButton = document.getElementById('activity_field_filter_button');

    if (activityFilterButton) {
        let searchButton = document.createElement('a');
        searchButton.title = '[WK - SN] Search Activity';
        searchButton.classList.add('btn', 'btn-primary', 'icon', 'icon-search');
        searchButton.onclick = openActivitySearchWK;

        activityFilterButton.parentNode.append(searchButton);
    }

    openActivitySearchWK();

    function openActivitySearchWK() {
        let activityEntriesContainer = document.getElementById('sn_form_inline_stream_entries');

        // Activity filters
        if (activityEntriesContainer) {
            let inputId = 'wk-sn-activity-search';

            if (document.getElementById(inputId)) {
                return;
            }

            let activityFilterInput = document.createElement('input');
            activityFilterInput.id = inputId;
            activityFilterInput.placeholder = 'Search';
            activityFilterInput.style.margin = '10px 5px';
            activityFilterInput.style.borderRadius = '30px';
            activityFilterInput.style.height = '32px';
            activityFilterInput.style.width = '400px';
            activityFilterInput.style.padding = '10px';
            activityFilterInput.oninput = filterActivitiesInput;

            activityEntriesContainer.prepend(activityFilterInput);

            let workNotesFilterBtn = document.createElement('a');
            workNotesFilterBtn.title = '[WK - SN] Work Notes filter';
            workNotesFilterBtn.innerText = 'Work Notes';
            workNotesFilterBtn.classList.add('btn', 'btn-warning');
            workNotesFilterBtn.style.margin = '10px 5px';
            workNotesFilterBtn.style.borderRadius = '30px';
            workNotesFilterBtn.onclick = showOnlyWorkNotes;

            activityEntriesContainer.prepend(workNotesFilterBtn);

            let commentsFilterBtn = document.createElement('a');
            commentsFilterBtn.title = '[WK - SN] Comments filter';
            commentsFilterBtn.innerText = 'Comments';
            commentsFilterBtn.classList.add('btn', 'btn-default');
            commentsFilterBtn.style.margin = '10px 5px';
            commentsFilterBtn.style.borderRadius = '30px';
            commentsFilterBtn.onclick = showOnlyComments;

            activityEntriesContainer.prepend(commentsFilterBtn);

            let showAllBtn = document.createElement('a');
            showAllBtn.title = '[WK - SN] Show All filter';
            showAllBtn.innerText = 'All';
            showAllBtn.classList.add('btn', 'btn-primary');
            showAllBtn.style.margin = '10px 5px';
            showAllBtn.style.borderRadius = '30px';
            showAllBtn.onclick = showAllActivities;

            activityEntriesContainer.prepend(showAllBtn);
        }
    }

    function showOnlyWorkNotes() {
        let activitesCards = document.querySelectorAll('.h-card');

        activitesCards.forEach(card => {
            if (card.childNodes[1].childNodes[0].childNodes[0].innerText === 'Work notes')
                card.style.display = 'block';
            else
                card.style.display = 'none';
        });
    }

    function showOnlyComments() {
        let activitesCards = document.querySelectorAll('.h-card');

        activitesCards.forEach(card => {
            if (card.childNodes[1].childNodes[0].childNodes[0].innerText === 'Additional comments')
                card.style.display = 'block';
            else
                card.style.display = 'none';
        });
    }

    function showAllActivities() {
        let activitesCards = document.querySelectorAll('.h-card');

        activitesCards.forEach(card => {
            card.style.display = 'block';
        });
    }

    function filterActivitiesInput(evt) {
        let inputValue = evt.target.value.toLowerCase();

        if (inputValue === '') {
            showAllActivities();
        }
        else {
            let activitesCards = document.querySelectorAll('.h-card');

            activitesCards.forEach(card => {
                if (card.childNodes[2].childNodes[0].childNodes[0].innerText.toLowerCase().indexOf(inputValue) > -1)
                    card.style.display = 'block';
                else
                    card.style.display = 'none';
            });
        }

    }

})();