// ==UserScript==
// @name         Get Branch Name
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Uses ticket type and description to generate a branch name
// @author       https://github.com/cgriebel
// @match        https://roger-team.atlassian.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461553/Get%20Branch%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/461553/Get%20Branch%20Name.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const getTitle = () =>
        document
            .querySelector('[data-test-id="issue.views.issue-base.foundation.summary.heading"]')
            .textContent
            .trim()
            // Remove common branch prefixes
            .replaceAll(/\[US\]|(FE|BE) \- /g, '')
            // Replace invalid branch characters with '_'
            .replaceAll(/[ "'&:]+/g, '_')
            // Replace regex special characters separate so the other regexs are easier to grok
            .replaceAll(/[/\-\\^$*+?.()|[\]{}]+/g, '_')
            // Compress repeated '_'
            .replaceAll(/_+/g, '_')
            // Trim trailing '_'
            .replaceAll(/^_*([^_].*[^_])_*$/g, '$1')
            .toLowerCase();

    function getPrefix() {
        const ticketType = document
            .querySelector('[data-testid="issue.views.issue-base.foundation.change-issue-type.button"] img')
            .getAttribute("alt")

        console.log(ticketType);
        switch (ticketType) {
            case 'Bug':
            case 'Escalation':
            case 'QA Test Bugs':
            case 'QA Test Bug (Sub Task)': // this should probably match the parent ticket
                return 'fix';
            case 'Task':
            case 'Spike':
                return 'chore';
            case 'Story':
            case 'Sub-task':
            case 'New Feature':
            default:
                return 'feature';
        }
    }

    const getIssueId = () =>
        document
            .querySelector('[data-testid="issue.views.issue-base.foundation.breadcrumbs.current-issue.item"]')
            .textContent;

    const getBranch = () => `${getPrefix()}/${getIssueId()}_${getTitle()}`;

    function init() {
        addStyles()
        if (document.getElementById('cg-copy-branch-name')) return;

        window.getBranch = getBranch;
        window.init = init;

        const createCommitElem = document
            .querySelector('[data-testid="development-summary-branch.ui.summary-item"]')

        if (!createCommitElem) return;

        const devContainer = createCommitElem.parentElement;
        const copyBranchNameBtn = document.createElement('div');
        copyBranchNameBtn.setAttribute('id', 'cg-copy-branch-name')
        copyBranchNameBtn.innerHTML = `<span>Copy branch name</span>`;
        copyBranchNameBtn.addEventListener("click", () => {
            const branchName = getBranch();
            console.log(branchName)
            navigator.clipboard.writeText(branchName);
        })
        devContainer.insertBefore(copyBranchNameBtn, createCommitElem)
    }

    function addStyles() {
        const existing = document.querySelector('#cg-style-copy-branch');
        if (existing) return;
        console.log("adding custom styles");
        const styleElem = document.createElement('style');
        styleElem.setAttribute('id', 'cg-style-copy-branch')
        styleElem.innerHTML = `
#cg-copy-branch-name {
  color: var(--ds-link, #0052CC) !important;
  font-weight: 500;
  height: 32px;
  display: flex;
  align-items: center;
  margin: 2px -8px 0px;
  width: 100%;
  max-width: 150px;
  cursor: pointer;
  padding-left: 32px;
}

#cg-copy-branch-name:hover {
  background-color: var(--ds-background-neutral-subtle-hovered,#EBECF0);
  border-radius: 3px;
}
      `
        const head = document.querySelector('head');
        head.append(styleElem);
    }

    setInterval(() => {
        init();
    }, 250)
})();