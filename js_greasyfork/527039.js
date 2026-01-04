// ==UserScript==
// @name         Youtrack Buddy
// @namespace    http://acc.si/
// @version      2025-04-25
// @description  A tool for youtrack
// @author       Arivo
// @match        https://youtrack.acc.si/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         http://design.acc.si/Arivo_A_blautrans_sehrklein.png
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/527039/Youtrack%20Buddy.user.js
// @updateURL https://update.greasyfork.org/scripts/527039/Youtrack%20Buddy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //let styleReset = `<span style="font-size: 14pt; font-family: Roboto, sans-serif; color: rgb(255, 255, 255); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; font-variant-emoji: normal; vertical-align: baseline; white-space-collapse: preserve;">`;

function _getIssueIdFromDetailPage() {
    let el = $("[class^='ticketContent_']");
    if (el) {
        let issueId = $(el).find("[id^='id-link']").text();
        if (!issueId) {
            return;
        }
        return issueId;
    }
}

function _getIssueIdFromIssueList() {
    // class yt-issue and .selected or .focused
    let idsSelected = [];
    let idsFocused = [];

    // css selector sselecting ticketListWrapper__.*
    let ticketList = $('[class^="ticketListWrapper__"], [class*=" ticketListWrapper__"]');

    $(ticketList).find('[class^="outerWrapper__"], [class*=" outerWrapper__"]').each(function (index) {
        let el = $(this);
        let ticketId = el.find('[data-test~="ticket-id"]').text();
        if (!ticketId || !ticketId.length)
            return;

        let isSelected = el.is('[class^="selectedWrapper__"], [class*=" selectedWrapper__"]');
        let isFocused = el.is('[class^="focusedWrapper__"], [class*=" focusedWrapper__"]');
        if (isSelected) {
            idsSelected.push(ticketId);
        } else if (isFocused) {
            idsFocused.push(ticketId);
        }
    });

    return idsSelected.length ? idsSelected : idsFocused;
}

function _getIssueIdFromAgileBoardCard() {
    let idsSelected = [];
    let idsFocused = [];

    // same as from list but .yt-agile-card and .yt-agile-card_selected and .yt-agile-card_focused
    $(".yt-agile-card.yt-agile-card_selected, .yt-agile-card.yt-agile-card_focused").each(function (index) {
        let id = $(this).find(".yt-issue-id").text();
        if (!id || !id.length)
            return;
        if ($(this).hasClass("yt-agile-card_selected")) {
            idsSelected.push(id);
        } else {
            idsFocused.push(id);
        }
    });

    return idsSelected.length ? idsSelected : idsFocused;
}

async function resolveIssueIds(issueIds) {
    let token = undefined;
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key.endsWith('-token') && !key.startsWith('0-0-0-0')) {
            token = JSON.parse(localStorage.getItem(key))["accessToken"];
            break;
        }
    }
    let apiCalls = [];
    for (let id of issueIds) {
        apiCalls.push(fetch(`/api/issues/${id}?fields=idReadable,resolved,summary,tags(name,color(background)),fields(name,value(name,color(foreground,background)))`,
            {
                method: 'GET',
                headers: {
                    "Authorization": "Bearer " + token
                }
            }));
    }
    let responses = await Promise.all(apiCalls);
    let data = [];
    for (let response of responses) {
        let json = await response.json();
        data = data.concat(json);
    }

    let result = [];
    for (let issue of data) {
        let convertedIssue = {
            id: issue.idReadable, summary: issue.summary.trim(),
            tags: issue.tags.map(x => ({name: x.name, color: x.color.background}))
        };
        for (let field of issue.fields) {
            if (field.name === "Priority") {
                convertedIssue.priority = (field.value.name || "?")[0].toLocaleUpperCase();
                convertedIssue.color = field.value.color.foreground;
                convertedIssue.background = field.value.color.background;
                convertedIssue.resolved = !!issue.resolved;
            }
        }
        result.push(convertedIssue);
    }
    return result;
}

function getSelectedIssues() {
    let issue = _getIssueIdFromDetailPage();
    if (issue) {
        return [issue];
    }

    let issues = _getIssueIdFromIssueList();
    if (issues.length) {
        return issues;
    }

    issues = _getIssueIdFromAgileBoardCard();
    if (issues.length) {
        return issues;
    }

    return [];
}

let _lastPopup = undefined;
let _lastPopupTimeout = undefined;

function spawnPopup(message) {
    // a popup bottom right with the message
    let popupHtml = `
<div style="z-index: 1000; position: fixed; bottom: 0; right: 0; background-color: #333; color: #fff; padding: 10px; border-radius: 5px; margin: 10px;">
    <span style="font-size: 14pt; font-family: 'Roboto', sans-serif; color: rgb(255, 255, 255); vertical-align: baseline;">${message}</span>
</div>
`;

    if (_lastPopup) {
        _lastPopup.remove();
        clearTimeout(_lastPopupTimeout);
    }

    let popup = $(popupHtml);
    $("body").append(popup);

    _lastPopup = popup;
    _lastPopupTimeout = setTimeout(() => {
        _lastPopupTimeout = undefined;
        _lastPopup = undefined;
        popup.remove();
    }, 2000);
}

function sortIssuesByPriority(issues) {
    // sort by known priorities, then by id
    let priorities = ['1', 'S', '2', 'H', 'M', '3', 'N', '4', 'L'];
    issues.sort((a, b) => {
        let aPriority = priorities.indexOf(a.priority);
        let bPriority = priorities.indexOf(b.priority);
        if (aPriority === bPriority) {
            return a.id.localeCompare(b.id);
        }
        return aPriority - bPriority;
    });
}

function generateIssueLine({priority, id, summary, color, background, tags, resolved}) {
    const paddingLeft = '';
    const paddingRight = ''

    let tagsString = "";
    for (let i = 0; i < tags.length; i++) {
        let tag = tags[i];
        let comma = i < (tags.length - 1) ? ', ' : '';
        let first = i === 0 ? ' ' : '';
        tagsString += `<span style="font-size: 14pt; font-family: Roboto, sans-serif; color: ${tag.color}; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; font-variant-emoji: normal; vertical-align: baseline; white-space-collapse: preserve;">\
<span style="font-size:0.6em;vertical-align:super;">${first}${tag.name}${comma}</span></span>`
    }

    const issueIdStyleOpen = `color: rgb(74, 195, 184); text-decoration-line: none;`;
    const issueIdStyleResolved = `color: rgb(183, 183, 183); text-decoration-line: line-through;`;

    const issueSummaryStyleOpen = `color: rgb(255, 255, 255);`;
    const issueSummaryStyleResolved = `color: rgb(183, 183, 183);`;

    let issueIdStyle = resolved ? issueIdStyleResolved : issueIdStyleOpen;
    let issueSummaryStyle = resolved ? issueSummaryStyleResolved : issueSummaryStyleOpen;

    return `\
<span style="font-size: 14pt; font-family: 'Roboto', sans-serif; color: rgb(255, 255, 255); background-color: ${background}; vertical-align: baseline;">&nbsp;</span>\
<span style="font-size: 14pt; font-family: 'Roboto Mono', monospace; color: ${color}; background-color: ${background}; vertical-align: baseline;">${priority}</span>\
<span style="font-size: 14pt; font-family: 'Roboto', sans-serif; color: rgb(255, 255, 255); background-color: ${background}; vertical-align: baseline;">&nbsp;</span>\
<span style="font-size: 14pt; font-family: 'Roboto', sans-serif; color: rgb(255, 255, 255); vertical-align: baseline;"> </span>\
<span style="font-size: 14pt; font-family: 'Roboto Mono', monospace; color: rgb(74, 195, 184); text-decoration-skip-ink: none; vertical-align: baseline;">${paddingLeft}</span>\
<a href="https://youtrack.acc.si/issue/${id}" style="text-decoration-line: none;">\
<span style="font-size: 14pt; font-family: 'Roboto Mono', monospace; font-weight: 700; ${issueIdStyle} text-decoration-skip-ink: none; vertical-align: baseline;">${id}</span>\
</a>\
<span style="font-size: 14pt; font-family: 'Roboto Mono', monospace; color: rgb(74, 195, 184); text-decoration-skip-ink: none; vertical-align: baseline;">${paddingRight}</span>\
<span style="font-size: 14pt; font-family: 'Roboto', sans-serif; ${issueSummaryStyle} vertical-align: baseline;"> ${summary}</span>${tagsString}\
`;
}

//console.log(`<p dir="ltr" style="line-height:1.1;margin-top:0pt;margin-bottom:12pt;">`);
//console.log(generateTestModule('S', 'CRM-123', 'This is a test error message'));
//console.log(generateTestModule('L', 'OM-1234', 'This is a test error message'));
//console.log(`</p>`);
function registerShortcuts() {
    // register alt+c keyboard shortcut
    document.addEventListener('keydown', function (event) {
        if (event.altKey && event.key === 'c') {
            let issues = getSelectedIssues();
            if (!issues.length) {
                console.log('%cNo issue(s) found', 'color: red; 16px; font-weight: bold;');
                return;
            }

            resolveIssueIds(issues).then(issues => {
                sortIssuesByPriority(issues);
                let issueHtml = issues.map(issue => generateIssueLine(issue)).join('<br>');
                if (issues.length > 1) {
                    let pStart = `<p dir="ltr" style="line-height:1.15;margin-top:0pt;margin-bottom:12pt;">`;
                    let pEnd = '</p>';
                    issueHtml = pStart + issueHtml + pEnd;
                }

                GM_setClipboard(issueHtml, 'html');
                spawnPopup(`Copied ${issues.length} issue(s) to clipboard`);
            });
        }
    });
}

function documentReady() {
    console.log(`%cYT Buddy is started`, 'color: green; font-size: 16px; font-weight: bold;');
    registerShortcuts();
}

function ytBuddyStart() {
    $(document).ready(documentReady);
}

    ytBuddyStart();
})();
