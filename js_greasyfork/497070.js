"use strict";
// ==UserScript==
// @name         New Reddit Submission Delete
// @version      1.0
// @description  Automatically deletes all submissions on your userpage
// @author       RootInit
// @match        https://www.reddit.com/user/*
// @grant        none
// @license      GPL V3
// @namespace https://greasyfork.org/users/1312559
// @downloadURL https://update.greasyfork.org/scripts/497070/New%20Reddit%20Submission%20Delete.user.js
// @updateURL https://update.greasyfork.org/scripts/497070/New%20Reddit%20Submission%20Delete.meta.js
// ==/UserScript==
//
//
const DELAY = 800;
// For debugging
window.deleteNext = deleteNext;
// Program begins here
(async () => {
    const deleteConfirmation = confirm("Are you sure you want to delete ALL comments/posts?");
    if (deleteConfirmation) {
        // Get API token
        const token = getCSRFToken();
        if (token === null) {
            alert("Failed to get csrf_token. Unable to continue.");
            return;
        }
        // Loop deleting
        while (await deleteNext()) {
            await new Promise(resolve => setTimeout(resolve, DELAY));
            // Scroll down to load more
            window.scrollTo(0, document.body.scrollHeight);
        }
    }
})();
function getCSRFToken() {
    const match = document.cookie.match(RegExp('(?:^|;\\s*)csrf_token=([^;]*)'));
    if (match === null) {
        return null;
    }
    return match[1];
}
async function deleteNext() {
    const next = document.querySelector("shreddit-post, shreddit-profile-comment");
    if (next == null) {
        alert("No submissions found. Done.");
        return false;
    }
    let operation = "";
    let input;
    switch (next.tagName) {
        case "SHREDDIT-POST":
            operation = "DeletePost";
            input = { "postId": next.getAttribute("id") };
            break;
        case "SHREDDIT-PROFILE-COMMENT":
            operation = "DeleteComment";
            input = { "commentId": next.getAttribute("comment-id") };
            break;
        default:
            alert("Error: Invalid tag. This error should be impossible.");
            return false;
    }
    const data = {
        "operation": operation,
        "variables": {
            "input": input
        },
        "csrf_token": getCSRFToken()
    };
    const res = await graphqlPostRequest(JSON.stringify(data));
    if (res.status !== 200) {
        alert(`Error: Bad http response ${res.status}:\n${res.statusText}`);
        return false;
    }
    next.remove();
    return true;
}
async function graphqlPostRequest(body) {
    const response = await fetch("https://www.reddit.com/svc/shreddit/graphql", {
        "credentials": "include",
        "headers": {
            "User-Agent": navigator.userAgent,
            "Accept": "application/json",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/json",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "Priority": "u=1"
        },
        "referrer": window.location.href,
        "body": body,
        "method": "POST",
        "mode": "cors"
    });
    return response;
}
