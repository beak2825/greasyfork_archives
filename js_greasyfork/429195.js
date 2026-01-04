// ==UserScript==
// @name            YouTrack - Custom Issue Icons
// @description     Replace the "Priority"-only issue icons with any other field you have set up.
// @license         All rights reserved
// @version         1.0.1

// @author          Alexandre Schweig-Peters (AlexandreSP)
// @website         https://alexandresp.dev

// @namespace       https://gitlab.com/AlexandreSP/youtrack-custom-issue-icons
// @supportURL      https://gitlab.com/AlexandreSP/youtrack-custom-issue-icons#report-an-issue
// @contributionURL https://ko-fi.com/alexandresp

// @icon            https://www.google.com/s2/favicons?domain=jetbrains.com
// @match           https://*.myjetbrains.com/youtrack/*
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/429195/YouTrack%20-%20Custom%20Issue%20Icons.user.js
// @updateURL https://update.greasyfork.org/scripts/429195/YouTrack%20-%20Custom%20Issue%20Icons.meta.js
// ==/UserScript==

/**
 * - Key: Domain accessed. Should reflect `location.hostname`.
 * - Token: Authentication token.
 * - ReplacementField: Name of the field that should be used as a replacement.
 */
const YOUTRACK_PROFILES = {
    "location.hostname": {
        token: "perm:***********",
        replacementField: "Field"
    }
};

init();

const ISSUE_DATA = {};

function init() {
    loadIssueData();

    // enableDynamicDraw observer cannot be called until "yt-sortable-tree" is loaded.
    const issueTableSelector = document.querySelector("body");
    new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            const issue = mutation.target;
            if (issue.localName === "yt-sortable-tree") {
                enableDynamicDraw();
            }
        }
    }).observe(issueTableSelector, {childList: true, subtree: true});

    // When the following API calls are made, reload issue data and redraw the issues currently visible.
    const proxied = window.XMLHttpRequest.prototype.send;
    window.XMLHttpRequest.prototype.send = function () {
        const pointer = this;
        const intervalId = window.setInterval(() => {
            const responseURL = pointer.responseURL;
            if (responseURL.match("api/issuesGetter") ||
                responseURL.match("api/inbox/threads") ||
                responseURL.match("api/issueListSubscription")) {

                loadIssueData().then(drawVisible);
                clearInterval(intervalId);
            }

        }, 1);

        return proxied.apply(this, [].slice.call(arguments));
    };
}

function enableDynamicDraw() {
    const issueSelector = document.querySelector("yt-sortable-tree");

    // Trigger when issue table is loaded.
    new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            const issue = mutation.target;

            if (issue.localName === "yt-sortable-tree-node" && mutation.addedNodes.length > 0) {
                const issueIdSelector = issue.querySelector("yt-issue-list-item-leading");

                // Trigger when issue icon is loaded.
                new MutationObserver((mutationsList) => {
                    for (const mutation of mutationsList) {
                        const issueSelector = mutation.target.closest("yt-issue-list-item");
                        draw(issueSelector);
                    }
                }).observe(issueIdSelector, {childList: true, subtree: true});
            }
        }
    }).observe(issueSelector, {childList: true, subtree: true});
}

function drawVisible() {
    const issueList = document.querySelectorAll("yt-issue-list-item");
    issueList.forEach(draw);
}

function draw(issueSelector) {
    const replacementField = YOUTRACK_PROFILES[location.hostname].replacementField;

    const issueId = issueSelector.querySelector("yt-issue-id").textContent;
    const issueFieldData = ISSUE_DATA[issueId][replacementField];

    const issueIconSelector = issueSelector.querySelector("yt-priority-issue-sign");

    if (issueIconSelector) {
        const issueIconClassList = issueIconSelector.classList;

        issueIconClassList?.forEach(iconClass => {
            if (iconClass.match("color")) {
                issueIconClassList.replace(iconClass, "color-fields__field-" + issueFieldData.color);
            }
        });

        issueIconSelector.firstChild.textContent = issueFieldData.value.charAt(0);
    }
}

async function loadIssueData() {
    const response = await queryYoutrack("issues?fields=idReadable,customFields(name,value(name,color(id)))");

    for (const issue of response) {
        const issueId = issue.idReadable;
        ISSUE_DATA[issueId] = {};

        const customFields = issue.customFields;
        for (const field of customFields) {
            if (!field.value || Array.isArray(field.value) || !field.value.name) {
                continue;
            }

            ISSUE_DATA[issueId][field.name] = {
                value: field.value.name,
                color: field.value.color.id
            };
        }
    }
}

async function queryYoutrack(params) {
    const youtrackURLHead = `https://${location.hostname}/youtrack/api/`;
    const options = {
        "method": "GET",
        "headers": {
            "Authorization": "Bearer " + YOUTRACK_PROFILES[location.hostname].token,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    };

    return (await fetch(youtrackURLHead + params, options)).json();
}
