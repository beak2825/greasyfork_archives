// ==UserScript==
// @name         SRM Reactivate "Revalidate" Option
// @namespace    http://tampermonkey.net/
// @version      2023.05.17.1
// @description  Enable Revalidate option on unmodified trials
// @author       Vance M. Allen
// @match        https://srm.sde.idaho.gov/srm/protected/listUserTrials.do?currentReportManifestId=*
// @match        https://srmtest.sde.idaho.gov/srm/protected/listUserTrials.do?currentReportManifestId=*
// @match        https://srm2.sde.idaho.gov/srm/protected/listUserTrials.do?currentReportManifestId=*
// @match        https://srmtest2.sde.idaho.gov/srm/protected/listUserTrials.do?currentReportManifestId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idaho.gov
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475146/SRM%20Reactivate%20%22Revalidate%22%20Option.user.js
// @updateURL https://update.greasyfork.org/scripts/475146/SRM%20Reactivate%20%22Revalidate%22%20Option.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let content = document.getElementById('content');
    if(content === null) return;

    let trials = content.getElementsByClassName('trial');

    for(let i = 0; i < trials.length; i++) {
        let item = trials.item(i);
        let trialId;
        if(item.tagName === 'TABLE') {
            let buttons = item.getElementsByClassName('active');
            for(let j = 0; j < buttons.length; j++) {
                if(buttons.item(j).tagName === 'A') {
                    let pattern = /trialId=(\d+)/;
                    let possMatch = buttons.item(j).href.match(pattern);
                    if(possMatch === null) continue;

                    // Pull out the trial ID and stop looping.
                    trialId = buttons.item(j).href.match(pattern)[1];
                    break;
                }
            }

            // If no trialId could be found, then we can't reactivate the Revalidate button.
            if(!trialId) continue;

            // Cycle through the buttons in the trial to see if there are any inactive "Reactivate" buttons.
            let inactive = item.getElementsByClassName('inactive');
            for(let j = 0; j < inactive.length; j++) {
                if(inactive.item(j).innerText === 'Revalidate') {
                    inactive.item(j).href = `trialAction.do?trialId=${trialId}&revalidate=1`;
                }
            }
        }
    }

    console.warn('Disabled "Revalidate" buttons reinstated by "SRM Reactivate Revalidate Option" script.');
})();