// ==UserScript==
// @name         SRM Trial Downloader
// @namespace    http://tampermonkey.net/
// @version      2023.08.07.1
// @description  Gives quick access to download buttons on saved trials
// @author       Vance M. Allen
// @match        https://srm.sde.idaho.gov/srm/protected/gettingStarted.do*
// @match        https://srm2.sde.idaho.gov/srm/protected/gettingStarted.do*
// @match        https://srmtest.sde.idaho.gov/srm/protected/gettingStarted.do*
// @match        https://srmtest2.sde.idaho.gov/srm/protected/gettingStarted.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idaho.gov
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475156/SRM%20Trial%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/475156/SRM%20Trial%20Downloader.meta.js
// ==/UserScript==

(function() {
    return;

    console.warn('SRM Trial Downloader');
    let h3 = document.getElementsByTagName('h3');

    // Bail if we're not seeing what we expect to see...
    if(h3.item(0).innerText !== 'Current State Reports') return;

    let table = document.getElementById('scrollTable');
    if(table.firstElementChild.tagName !== 'THEAD') return;

    // Create and insert new header
    let trialName = table.firstElementChild.firstElementChild.children.item(1);
    let th = document.createElement('th');
    th.innerHTML = 'Download';
    trialName.parentNode.insertBefore(th,trialName.nextElementSibling);

    // Loop through the rows
    for(let i = 0; i < table.lastElementChild.children.length; i++) {
        // Select row
        let tr = table.lastElementChild.children.item(i);

        // Get the hyperlink for that row
        let a = tr.children.item(1).firstElementChild;
        let href = a.getAttribute('href');
        // table.lastElementChild.children.item(0).children.item(3).innerText - trial status
        let td = document.createElement('td');

        // Only set text if this is actually a trial
        if(tr.children.item(3).innerText.trim()) {
            td.innerHTML = 'test';
            let newA = document.createElement('a');
            newA.href = a.replace('generateTrial.do','downloadTrial.do');

            // generateTrial.do?currentReportManifestId=133
            // downloadTrial.do?trialId=80196&redirect=listUserTrials.do?currentReportManifestId=70
        }

        // Insert the Download column
        tr.insertBefore(td,tr.children.item(2));
    }
})();
