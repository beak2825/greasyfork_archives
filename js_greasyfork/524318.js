// ==UserScript==
// @name         WME Beta UR Links
// @namespace    https://fxzfun.com/userscripts
// @version      2025-01-21
// @description  Open UR links in Beta WME
// @author       FXZFun
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524318/WME%20Beta%20UR%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/524318/WME%20Beta%20UR%20Links.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    function replaceLinks() {
        let wmeLinks = [...document.querySelectorAll('a')].filter(link => /.*\.waze\.com\/.*editor.*/i.test(link.href));
 
        wmeLinks.forEach(linkEl => {
            let url = new URL(linkEl.href);
            let params = new URLSearchParams(url.search);
 
            // only apply to UR links
            if (params.has('mapUpdateRequest')) {
                // Adjust zoom value
                params.delete('zoom');
                params.delete('zoomLevel');
                params.append('zoomLevel', 18);
 
                // Change to beta WME
                url.hostname = url.hostname.replace('www.', 'beta.');
                let newLink = url.origin + url.pathname + '?' + params.toString();
 
                // Replace with new link
                linkEl.href = newLink;
                linkEl.setAttribute('data-saferedirecturl', newLink);
            }
        });
    }
 
    replaceLinks();
 
    if (location.href.includes('mail.google.com')) {
        setInterval(replaceLinks, 1000);
    }
 
})();