// ==UserScript==
// @name     Recruiter Rodeo Search
// @version  3
// @description  Searches for the company on Recruiter Rodeo
// @author       Sebastian Gumprich
// @license      GPLv3
// @match        https://www.freelancermap.com/project/*
// @match        https://www.freelancermap.de/projekt/*
// @match        https://www.freelancermap.at/projekt/*
// @namespace https://greasyfork.org/users/1342736
// @downloadURL https://update.greasyfork.org/scripts/502214/Recruiter%20Rodeo%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/502214/Recruiter%20Rodeo%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const span = document.querySelector('span[itemprop="name"]');
    if (!span) return; // Exit if no such span is found

    let spanContent = span.textContent.trim();
    const companyName = spanContent.replace(/gmbh/i,''); 

    const button = document.createElement('button');
    button.textContent = 'Search in Recruiter Rodeo';
    
    const urlPrefix = 'https://recruiter.rodeo/recruiters/list?filters[search]=';
    const urlSuffix = '&filters[order]=ratings_count';

    button.addEventListener('click', () => {
        const newUrl = urlPrefix + encodeURIComponent(companyName) + urlSuffix;
        window.open(newUrl, '_blank');
    });

    span.parentNode.insertBefore(button, span.nextSibling);
})();