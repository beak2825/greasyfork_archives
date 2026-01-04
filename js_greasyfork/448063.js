// ==UserScript==
// @name         Backlog Styling
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Styles the ticket status in our backlog.
// @author       https://github.com/cgriebel
// @match        https://roger-team.atlassian.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/448063/Backlog%20Styling.user.js
// @updateURL https://update.greasyfork.org/scripts/448063/Backlog%20Styling.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const interval = setInterval(() => {
        initInterval();
    }, 250)

    function initInterval()
    {
        addStyles();
    }

    function addStyles()
    {
        const existing = document.querySelector('#cg-style');
        if(existing) return;
        console.log("adding custom styles");
        const styleElem = document.createElement('style');
        styleElem.setAttribute('id', 'cg-style')
        styleElem.innerHTML = `
.ghx-plan-band-2 .ghx-backlog-container .ghx-issue-content {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 8px !important;
}

.ghx-plan-band-2 .ghx-backlog-container .ghx-issue-content .ghx-end.ghx-items-container {
    display: flex;
    align-items: center;
    top: initial !important;
}

.ghx-plan-band-2 .ghx-backlog-container .ghx-issue-content .ghx-end.ghx-items-container .ghx-priority {
    display: flex;
    align-items: center;
}

.ghx-plan-band-2 .ghx-backlog-container .ghx-issue-content .ghx-backlog-card-expander-spacer {
    display: none;
}

.ghx-plan-band-2 .ghx-backlog-container .ghx-issue-content .ghx-plan-main-fields {
    display: flex;
    margin: 0;
    align-items: center;
    gap: 8px;
}

.ghx-plan-band-2 .ghx-backlog-container .ghx-issue-content .ghx-plan-main-fields .ghx-type.items-spacer {
    margin: 0;
    display: flex;
    align-items: center;
}

.ghx-plan-band-2 .ghx-backlog-container .ghx-issue-content .ghx-plan-extra-fields {
    display: inline-block;
    margin: 0;
}

.ghx-plan-band-2 .ghx-backlog-container .ghx-issue-content .ghx-plan-extra-fields [data-tooltip^="Status"] {
    display: inline-block;
    margin: 0;
}

.ghx-backlog-container .ghx-issue-content .ghx-plan-extra-fields [data-tooltip^="Status"] {
    border: 1px solid #0000;
    border-radius: 3px;
    padding: 0 6px !important;
    font-weight: 500;
    min-width: initial;
}

.ghx-plan-extra-fields [data-tooltip="Status: To Do"],
.ghx-plan-extra-fields [data-tooltip="Status: New"]
{
    color: var(--ds-text,#42526E);
    background-color: var(--ds-background-neutral,#DFE1E6);
}

.ghx-plan-extra-fields [data-tooltip="Status: Blocked"],
.ghx-plan-extra-fields [data-tooltip="Status: Returned for Info"]
{
    color: var(--ds-text,#DE1306);
    background-color: var(--ds-background-neutral,#FEEBEA);
}

.ghx-plan-extra-fields [data-tooltip="Status: Ready for test"],
.ghx-plan-extra-fields [data-tooltip="Status: Test"],
.ghx-plan-extra-fields [data-tooltip="Status: Acceptance Test"]
{
    color: var(--ds-text,#863DFF);
    background-color: var(--ds-background-neutral,#F4EEFF);
}

.ghx-plan-extra-fields [data-tooltip="Status: In Progress"],
.ghx-plan-extra-fields [data-tooltip="Status: Code Review"]
{
    color: var(--ds-text-information,#0088F5);
    background-color: var(--ds-background-information,#E7F4FF);
}

.ghx-plan-extra-fields [data-tooltip="Status: Done"],
.ghx-plan-extra-fields [data-tooltip="Status: Ready for Deployment"],
.ghx-plan-extra-fields [data-tooltip="Status: Won&#39;t Do"]
{
    color: var(--ds-text-success,#009417);
    background-color: var(--ds-background-success,#E5FDE8);
}

.ghx-plan-extra-fields [data-tooltip="Status: Planning"]

{
    color: var(--ds-text-information,#FF8B00);
    background-color: var(--ds-background-information,#FFFAE6);
}

.ghx-plan-extra-fields [data-tooltip="Status: Ready for Development"]

{
    color: var(--ds-text-information,#009A9A);
    background-color: var(--ds-background-information,#E5FEFC);
}

        `
        const head = document.querySelector('head');
        head.append(styleElem);
    }

    initInterval();
})();