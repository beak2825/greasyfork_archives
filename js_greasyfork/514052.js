// ==UserScript==
// @name         SIF - Hyperlink CEDS References
// @namespace    http://tampermonkey.net/
// @version      2024.10.25.1
// @description  Make references to CEDS better!
// @author       Vance M. Allen
// @match        http://specification.sifassociation.org/Implementation/NA/4.3/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sifassociation.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514052/SIF%20-%20Hyperlink%20CEDS%20References.user.js
// @updateURL https://update.greasyfork.org/scripts/514052/SIF%20-%20Hyperlink%20CEDS%20References.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.warn('SIF - Hyperlink CEDS References userscript activated.');

    // REGEX pattern to find the CEDS URLs
    let CEDS_REGEX = new RegExp('https://ceds.ed.gov/element/\\d+');

    // Scan the page for any <td> elements with CEDS links
    let linkBoxes = Array.prototype.slice.call(document.getElementsByTagName('td')).filter(x => CEDS_REGEX.test(x.innerText));

    // Cycle through the <td> elements and make the CEDS links actually links!
    linkBoxes.forEach(x => {
        x.innerHTML = x.innerHTML.replace(CEDS_REGEX,x => `<a target="_blank" rel="noopener noreferrer" href="${x}">${x}</a>`)
    });
})();