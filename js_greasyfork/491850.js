// ==UserScript==
// @name         WaniKani Level Up Speed Assistant
// @namespace    http://tampermonkey.net/
// @version      7
// @description  Display time of next reviews and lessons for the fastest level up
// @author       vbomedeiros
// @match        https://www.wanikani.com/
// @match        https://www.wanikani.com/dashboard
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491850/WaniKani%20Level%20Up%20Speed%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/491850/WaniKani%20Level%20Up%20Speed%20Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!window.wkof) {
        alert('WaniKani Level Up Speed Assistant requires Wanikani Open Framework.\n' +
              'You will now be forwarded to installation instructions.');
        window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        return;
    }


    window.wkof.include('ItemData, Apiv2');
    window.wkof.ready('ItemData, Apiv2').then(loadUserData);

    function loadUserData() {
        const userOptions = {
            'wkof.Apiv2': {
                endpoint: 'user'
            }
        };
        window.wkof.Apiv2.fetch_endpoint('user').then(userData => {
            const currentLevel = userData.data.level;
            // console.log("User level: " + currentLevel);
            loadItems(currentLevel);
        });
    }

    function loadItems(currentLevel) {
        const options = {
            wk_items: {
                options: {
                    assignments: true,
                    //study_materials: true,
                },
                filters: {
                    item_type: 'rad,kan',
                    srs: ['init','appr1','appr2','appr3','appr4'],
                    level: String(currentLevel),
                }
            }
        };

        window.wkof.ItemData.get_items(options).then(processItems);
    }

    function processItems(items) {
        if (showMessageForType(items, 'radical')) return;
        if (showMessageForType(items, 'kanji')) return;

        displayMessage('All caught up! No new lessons or reviews below Guru level.', '#59C274');
    }

    function showMessageForType(all_items, type) {
        const items = all_items.filter(item => item.object == type);
        const lessons = items.filter(item => item.assignments.srs_stage == 0);
        const reviews = items.filter(item => item.assignments.srs_stage != 0);
        // console.log("Looking at "+type);
        // console.log(reviews);

        if (lessons.length > 0) {
            displayMessage('You have ' + lessons.length + ' new ' + type + ' lessons available! Go learn them now.', '#F03');
            return true;
        } else if (reviews.length > 0) {
            // Step 1: Sort the reviews by `available_at`, then by `srs_stage` in case of a tie.
            reviews.sort((a, b) => {
                const dateA = new Date(a.assignments.available_at), dateB = new Date(b.assignments.available_at);
                if (dateA.getTime() === dateB.getTime()) {
                    return a.assignments.srs_stage - b.assignments.srs_stage; // Sort by srs_stage in case of a tie
                }
                return dateA - dateB; // Regular sort by available_at
            });

            // Step 2: Extract the earliest reviews.
            // Assuming the first item now has the smallest `available_at`,
            // find all items with the same `available_at` value.
            const earliestDate = new Date(reviews[0].assignments.available_at);
            const dateNow = new Date();
            const level = reviews[0].assignments.srs_stage;

            if (dateNow.getTime() < earliestDate.getTime()) {
                displayMessage(
                    'Next ' + type + ' review, apprentice ' + level + ':<br>'
                    + formatDate(earliestDate),
                    earliestDate.getDate() == dateNow.getDate() ? '#ffcc00' : '#59C274',
                );
            } else {
                displayMessage(
                    'Next ' + type + ' review, apprentice ' + level + ' available now!',
                    '#F03',
                );
            }
            return true;
        } else {
            return false;
        }
    }

    function displayMessage(message, color) {
        const dashboard = document.querySelector('.wk-panel--review-forecast');
        if (!dashboard) {
            console.log("Can't find panel to insert");
            return;
        }
        const div = document.createElement('div');
        div.style.padding = '10px';
        div.style.background = color;
        div.innerHTML = message;

        const targetChild = dashboard.querySelector('.wk-panel__content') || dashboard.firstChild;

        dashboard.insertBefore(div, targetChild);
    }

    function formatDate(date) {
        const options = {
            weekday: 'long', // Full name of the day of the week
            month: 'short', // Short name of the month
            day: 'numeric', // Numeric day of the month
            hour: 'numeric', // Numeric hour
            hour12: true, // Use 12-hour format
            minute: '2-digit' // 2-digit minute
        };

        return date.toLocaleString('en-US', options).replace(/:00$/, ''); // Remove ":00" for exact hours
    }

})();
