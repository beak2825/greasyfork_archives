// ==UserScript==
// @name         Download Button for Uber Reciepts
// @namespace    https://xorcerer.github.io/
// @version      1.1
// @license      MIT
// @description  Added PDF download link for each invoice in the trip list.
// @author       Logan Zhou
// @match        https://riders.uber.com/trips*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uber.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462456/Download%20Button%20for%20Uber%20Reciepts.user.js
// @updateURL https://update.greasyfork.org/scripts/462456/Download%20Button%20for%20Uber%20Reciepts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getUUID(url) {
        const jobIDRe = /trips\/([^?]+)/g;
        let m = url.matchAll(jobIDRe);
        for(let a of m) {
            return a[1];
        }
    }

    function addDownloadButton(a) {
        let uuid = getUUID(a.href);
        let db = document.createElement('a');
        db.innerHTML = 'PDF';
        db.href = `https://riders.uber.com/trips/${uuid}/receipt?contentType=PDF`;
        db.style = a.style;
        db.className = a.className;
        a.parentElement.append(db);

        a.dataset['LinkAdded'] = true;
    }

    function main() {
        let links = document.getElementsByTagName('a');
        for(let a of links) {
            if (a.innerHTML.includes('View') && !a.dataset['LinkAdded']) {
                addDownloadButton(a)
            }
        }
        setTimeout(main, 2000); // Repeat. Delay for the loading of the list.
    }

    setTimeout(main, 2000); // Delay for the loading of the list.
})();