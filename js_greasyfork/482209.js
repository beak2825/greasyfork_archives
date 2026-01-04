// ==UserScript==
// @name         Moodle remove forceautodownload
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Opens file instead of downloading it in moodle.
// @author       Doriano DiPierro
// @license      MIT
// @match        https://moodle.ost.ch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ost.ch
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482209/Moodle%20remove%20forceautodownload.user.js
// @updateURL https://update.greasyfork.org/scripts/482209/Moodle%20remove%20forceautodownload.meta.js
// ==/UserScript==
 
 
// Function to remove 'forcedownload=1' from a URL
function removeForcedDownloadParam(url) {
  return url.replace(/([?&])forcedownload=1(&|$)/ig, '$1$2');
}
 
 
(function() {
    'use strict';
 
    // Select all links on the page
    const links = document.querySelectorAll('a');
 
    // Loop through each link and update its href attribute
    links.forEach(link => {
        const currentHref = link.getAttribute('href');
 
        if (currentHref) {
            const updatedHref = removeForcedDownloadParam(currentHref);
            link.setAttribute('href', updatedHref);
        }
        link.setAttribute("onclick", "");
    });
})();