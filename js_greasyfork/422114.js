// ==UserScript==
// @name         GitLab show milestones
// @namespace    https://github.com/mkczyk/tools/tree/main/userscripts/gitlab-show-milestones
// @version      0.1
// @description  GitLab show milestones on board in tasks
// @author       mkczyk
// @include      *gitlab*/boards*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/422114/GitLab%20show%20milestones.user.js
// @updateURL https://update.greasyfork.org/scripts/422114/GitLab%20show%20milestones.meta.js
// ==/UserScript==

const LOAD_AFTER = 500;

const HSL_COLORS = 360;
const COLOR_CONFIG = {
    OFFSET: 150,
    SATURATION: 80,
    LIGHTNESS: 40
};

(function () {
    'use strict';
    setTimeout(main, LOAD_AFTER);
})();

function main() {
    const pageId = document.getElementsByTagName('body')[0].getAttribute("data-page-type-id");
    const boardsElements = document.getElementsByClassName('board');
    Array.from(boardsElements).forEach(boardElement => fillBoard(boardElement, pageId));
}

const fillBoard = (boardElement, pageId) => {
    const boardId = boardElement.getAttribute("data-id");
    GM_xmlhttpRequest({
        method: 'GET',
        url: `/-/boards/${pageId}/lists/${boardId}/issues`,
        onload: issuesResponse => {
            const issuesOnBoard = JSON.parse(issuesResponse.responseText);
            fillList(boardElement, issuesOnBoard);
        }
    });
};

const fillList = (boardElement, issuesOnBoard) => {
    const cardElements = boardElement.getElementsByClassName('board-card');
    Array.from(cardElements).forEach(cardElement => fillCard(cardElement, issuesOnBoard));
};

const fillCard = (cardElement, issues) => {
    const issueId = cardElement.getAttribute("data-issue-id");
    const issue = findIssueById(issues, issueId);
    const milestone = issue.milestone;
    if (milestone) {
        const numberElem = cardElement.getElementsByClassName('board-card-number')[0];
        const milestoneTag = generateMilestoneElement(milestone);
        numberElem.innerHTML = `<span>${numberElem.innerHTML} | ${milestoneTag}</span>`;
    }
};

const findIssueById = (issues, issueIdToFind) => {
    const issueId = parseInt(issueIdToFind);
    return Object.entries(issues.issues).find(([key, value]) => value.id === issueId)[1];
};

const generateMilestoneElement = milestone => {
    const color = idToHslColor(milestone.id);
    return `<b style="color: ${hslColorToTag(color)}">${milestone.title}</b>`
}

const hslColorToTag = color => `hsl(${color}, ${COLOR_CONFIG.SATURATION}%, ${COLOR_CONFIG.LIGHTNESS}%)`;

const idToHslColor = id => id * COLOR_CONFIG.OFFSET % HSL_COLORS;
