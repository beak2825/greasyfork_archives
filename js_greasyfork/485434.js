// ==UserScript==
// @name         Resolve audit log user IDs
// @namespace    http://schuppentier.org/
// @version      2024-02-19
// @description  This script calls the Jira user API, resolves user IDs in the Jira audit log and replaces them with the display names.
// @author       You
// @match        https://*.atlassian.net/auditing/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @grant        none
// @require      https://bowercdn.net/c/arrive-2.4.1/minified/arrive.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485434/Resolve%20audit%20log%20user%20IDs.user.js
// @updateURL https://update.greasyfork.org/scripts/485434/Resolve%20audit%20log%20user%20IDs.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

(function() {
    'use strict';

    const resolveUserId = async (userId) => {
        const userResponse = await fetch(`/rest/api/3/user?accountId=${userId}`);
        const userObject = await userResponse.json();
        const userDisplayName = userObject.displayName;
        return userDisplayName;
    };

    document.arrive("span.delta-from, span.delta-to", async (elem) => {
        const detailsRow = elem.closest("tr.record-row-details");
        const recordRow = detailsRow.previousElementSibling;
        const summary = recordRow.querySelector("td.summary").innerText;
        if (summary != "Project roles changed") {
            return;
        }

        const fromElem = detailsRow.querySelector("span.delta-from");
        const toElem = detailsRow.querySelector("span.delta-to");

        var fromUserIds = new Set(fromElem.innerText.split(",").map(item => item.trim()));
        var toUserIds = new Set(toElem.innerText.split(",").map(item => item.trim()));

        const duplicateUserIds = fromUserIds.intersection(toUserIds);

        fromUserIds = fromUserIds.difference(duplicateUserIds);
        toUserIds = toUserIds.difference(duplicateUserIds);

        const fromUserNames = await Promise.all(fromUserIds.map(resolveUserId));
        const toUserNames = await Promise.all(toUserIds.map(resolveUserId));

        fromElem.innerText = fromUserNames.join(", ");
        toElem.innerText = toUserNames.join(", ");
    });
})();