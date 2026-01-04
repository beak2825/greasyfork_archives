// ==UserScript==
// @name         Google Scholar go brr
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  This script adds buttons for direct access to SciHub and LibGen from Google Scholar articles.
// @author       bobbymoli
// @match        https://scholar.google.com/*
// @match        *://*/*
// @grant        none
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://scholar.google.com&size=64
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537443/Google%20Scholar%20go%20brr.user.js
// @updateURL https://update.greasyfork.org/scripts/537443/Google%20Scholar%20go%20brr.meta.js
// ==/UserScript==

const baseUrlSciHub = 'https://www.tesble.com/';
const baseUrlLibGen = 'https://libgen.li/index.php?req=';
const baseUrlLibGenLi = 'https://books.ms/scimag/';

function createButtonElement(titleElement, url, textLabel, buttonClass, color, tooltipText) {
    const btnElement = document.createElement('a');
    btnElement.textContent = textLabel;
    btnElement.href = url;
    btnElement.target = '_blank';
    btnElement.className = buttonClass;
    btnElement.style = `margin-left: 10px; padding: 6px 12px; background-color: ${color}; color: #fff; border: none; border-radius: 5px; font-size: 12px; text-decoration: none; position: relative;`;

    const tooltip = document.createElement('span');
    tooltip.textContent = tooltipText;
    tooltip.style = `visibility: hidden; width: 120px; background-color: black; color: #fff; text-align: center; border-radius: 5px; padding: 5px; position: absolute; z-index: 1; bottom: 125%; left: 50%; margin-left: -60px; opacity: 0; transition: opacity 0.3s;`;

    btnElement.appendChild(tooltip);

    btnElement.onmouseover = function() {
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
    };
    btnElement.onmouseout = function() {
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '0';
    };

    titleElement.appendChild(btnElement);
}

function insertButtonsForSciHubAndLibGen() {
    document.querySelectorAll('.gs_r.gs_or.gs_scl').forEach(scholarResult => {
        if (scholarResult.querySelector('.gs_ggs.gs_fl')) return;
        const titleElement = scholarResult.querySelector('h3');
        const linkElement = titleElement.querySelector('a');
        if (!linkElement || scholarResult.querySelector('.scihub-button')) return;

        const currentURL = linkElement.href;
        const sciHubRedirectURL = `${baseUrlSciHub}${currentURL}`;
        createButtonElement(titleElement, sciHubRedirectURL, 'SciHub', 'scihub-button', '#4CAF50', 'Access via SciHub');

        const doiMatch = currentURL.match(/doi\/abs\/(10\.[\d\.]+\/[^\?]+)/);
        if (doiMatch && doiMatch[1]) {
            createButtonElement(titleElement, `${baseUrlLibGenLi}${doiMatch[1]}`, 'LibGen', 'libgen.li-button', '#00BFFF', 'Find on LibGen');
        }

        const searchString = encodeURIComponent(linkElement.textContent || 'unknown title');
        createButtonElement(titleElement, `${baseUrlLibGen}${searchString}`, 'LibGen Search', 'libgen-button', '#FF6347', 'Search LibGen');
    });
}

const observerInstance = new MutationObserver(insertButtonsForSciHubAndLibGen);
observerInstance.observe(document.body, { childList: true, subtree: true });
insertButtonsForSciHubAndLibGen();

function convertDOIToSciHubUrl(doiLink) {
    return `${baseUrlSciHub}${doiLink.replace('https://doi.org/', '')}`;
}

document.querySelectorAll('a[href^="http://dx.doi.org/"], a[href^="https://doi.org/"]').forEach(doilink => {
    doilink.style.cssText = 'background-color: #4CAF50; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; position: relative;';
    doilink.addEventListener('mouseenter', () => doilink.style.backgroundColor = '#45a049');
    doilink.addEventListener('mouseleave', () => doilink.style.backgroundColor = '#4CAF50');
    doilink.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = convertDOIToSciHubUrl(doilink.href);
    });
});
