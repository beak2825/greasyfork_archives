// ==UserScript==
// @name         Redirect to SciHub
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Adds SciHub and LibGen buttons to Google Scholar articles and redirects DOI links to Scihub.
// @author       Bui Quoc Dung
// @match        https://scholar.google.com/*
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524914/Redirect%20to%20SciHub.user.js
// @updateURL https://update.greasyfork.org/scripts/524914/Redirect%20to%20SciHub.meta.js
// ==/UserScript==

const sciHubBaseUrl = 'https://www.tesble.com/';
const libGenBaseUrl = 'https://libgen.li/index.php?req=';
const libGenliBaseUrl = 'https://books.ms/scimag/';

function addButton(h3, url, text, className, bgColor, linkTarget = '_blank') {
    const button = document.createElement('a');
    button.textContent = text;
    button.href = url;
    button.target = linkTarget;
    button.className = className;
    button.style = `margin-left: 10px; padding: 5px 10px; background-color: ${bgColor}; color: #fff; border: none; border-radius: 5px; font-size: 12px; text-decoration: none;`;
    h3.appendChild(button);
}

function addSciHubAndLibGenButtons() {
    document.querySelectorAll('.gs_r.gs_or.gs_scl').forEach(gsR => {
      if (gsR.querySelector('.gs_ggs.gs_fl')) return;
        const h3 = gsR.querySelector('h3');
        const link = h3.querySelector('a');
        if (!link || gsR.querySelector('.scihub-button')) return;

        const originalURL = link.href;
        const sciHubURL = `${sciHubBaseUrl}${originalURL}`;
        addButton(h3, sciHubURL, 'SciHub', 'scihub-button', '#4CAF50');

        const doiMatch = originalURL.match(/doi\/abs\/(10\.[\d\.]+\/[^\?]+)/);
        if (doiMatch && doiMatch[1]) {
            addButton(h3, `${libGenliBaseUrl}${doiMatch[1]}`, 'Libgen.is', 'libgen.is-button', '#00BFFF'); // Sky blue for Libgen.is button
        }

        const searchQuery = encodeURIComponent(link.textContent || 'unknown title');
        addButton(h3, `${libGenBaseUrl}${searchQuery}`, 'LibGen', 'libgen-button', '#00BFFF'); // Sky blue for LibGen button
    });
}

const observer = new MutationObserver(addSciHubAndLibGenButtons);
observer.observe(document.body, { childList: true, subtree: true });
addSciHubAndLibGenButtons();

function convertDOIToSciHub(doiURL) {
    return `${sciHubBaseUrl}${doiURL.replace('https://doi.org/', '')}`;
}

document.querySelectorAll('a[href^="http://dx.doi.org/"], a[href^="https://doi.org/"]').forEach(link => {
    link.style.cssText = 'background-color: #4CAF50; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none;';
    link.addEventListener('mouseenter', () => link.style.backgroundColor = '#45a049');
    link.addEventListener('mouseleave', () => link.style.backgroundColor = '#4CAF50');
    link.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = convertDOIToSciHub(link.href);
    });
});
