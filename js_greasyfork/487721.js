// ==UserScript==
// @name         Shopware Issue-Tracker & Jira Redirect
// @namespace    http://tampermonkey.net/
// @version      2024-02-19
// @description  Add Redirect Buttons from Shopware Issue-Tracker Ticket to internal Jira Ticket and vice versa
// @author       Marcel Brode
// @match        https://issues.shopware.com/issues/*
// @match        https://shopware.atlassian.net/browse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shopware.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487721/Shopware%20Issue-Tracker%20%20Jira%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/487721/Shopware%20Issue-Tracker%20%20Jira%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let exists;
    if (location.origin.includes('shopware.atlassian.net')) {
        exists = setInterval(function() {
            const target = document.querySelector('#jira-issue-header');

            if (target !== null) {
                jiraToIssueTracker();
                clearInterval(exists);
            }
        }, 100);
    } else if (location.origin.includes('issues.shopware.com')) {
        let exists = setInterval(function() {
            const target = document.querySelector('#issue');

            if (target !== null) {
                issueTrackerToJira();
                clearInterval(exists);
            }
        }, 100);
    }
})();

function issueTrackerToJira() {
    const containerStyles = `
        position: relative;
        top: -24px;
        right: 4px;
        background: transparent;
        height: 0;
    `;

    const targetElement = document.querySelector('#issue');
    targetElement.innerHTML = getRedirectButton('Jira Ticket', containerStyles) + targetElement.innerHTML;
}

function jiraToIssueTracker() {
    const containerStyles = `
        display: flex;
        position: absolute;
        right: 0;
        top: 0;
        width: 200px;
        justify-content: flex-end;
        transform: translateY(7px);
    `;

    const targetElement = document.querySelector('#jira-issue-header');
    targetElement.innerHTML = getRedirectButton('Issue Tracker', containerStyles) + targetElement.innerHTML;
}

function getRedirectButton(label, containerStyles) {
    containerStyles = containerStyles.trim();

    const linkStyles = `
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    `.trim();

    const textStyles= `
        transform: translateY(-2px);
    `.trim();

    const targetUrl = location.origin.includes('shopware.atlassian.net') ? getIssueTrackerUrl() : getJiraUrl();

    return `
        <div style="${containerStyles}">
            <a href="${targetUrl}" style="${linkStyles}">
                <div>${getShortcutIconHtml()}</div>
                <div style="${textStyles}">${label}</div>
            </a>
        </div>
    `;
}

function getIssueTrackerUrl() {
    const ticket = location.pathname.split('/').slice(-1);

    return `https://issues.shopware.com/issues/${ticket}`;
}

function getJiraUrl() {
    const ticket = location.pathname.split('/').slice(-1);

    return `https://shopware.atlassian.net/browse/${ticket}`;
}

function getShortcutIconHtml(color='#1491e7') {
    const iconStyles = `
        height: 18px;
    `.trim();

    return `<svg style="${iconStyles}" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path fill="${color}" d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/></svg>`;
}