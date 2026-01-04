// ==UserScript==
// @name         Polygon Problem Share
// @namespace    http://tampermonkey.net/
// @version      2024-10-20
// @description  polygon
// @author       You
// @match        *://polygon.codeforces.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codeforces.com
// @grant        GM_xmlhttpRequest
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/513335/Polygon%20Problem%20Share.user.js
// @updateURL https://update.greasyfork.org/scripts/513335/Polygon%20Problem%20Share.meta.js
// ==/UserScript==

const POLYGON_URL = "https://polygon.codeforces.com"
const USER_HANDLE = "itmo-olymp"
const GRANT_ACCESS = "Write"

const getProblemsWorkingCopyCol = () => {
    return $("tbody#body-problems tr td:last-child")
}

const SHARE_PROBLEM_BUTTON = "SHARE_PROBLEM_BUTTON"

const createShareButton = (callback) => {
    const button = document.createElement("button");
    button.className = SHARE_PROBLEM_BUTTON;
    button.style.margin = "2.5px";
    button.style.width = "150px";
    button.innerText = "Share [" + USER_HANDLE + "]";
    button.onclick = () => callback(button);
    return button
}

const createRemoveButton = (callback) => {
    const button = document.createElement("button");
    button.className = SHARE_PROBLEM_BUTTON;
    button.style.margin = "2.5px";
    button.style.width = "75px";
    button.innerText = "Remove";
    button.onclick = () => callback(button);
    return button
}

const getCsidFromUrl = (url) => {
    return new URL(url).searchParams.toString()
}

const getEnterSessionPath = (element) => {
    const startSeesion = $(element).find(".START_EDIT_SESSION")
    const continueSeesion = $(element).find(".CONTINUE_EDIT_SESSION")
    return (startSeesion.length != 0 ? startSeesion : continueSeesion).attr('href')
}

const getStopSessionPath = (element) => {
    return $(element).find(".DISCARD_EDIT_SESSION").attr('href')
}

const shareAccessInSession = (button, sessionEnterPath) => {
    button.innerText = "🔄 Creating session"
    const stopSessionPath = "/edit-stop?" + sessionEnterPath.split('?', 2)[1]
    return fetch(POLYGON_URL + sessionEnterPath, {"method": "GET"})
        .then((response) => {
           console.log("session started: " + sessionEnterPath)
           const csid = getCsidFromUrl(response.url)
           button.innerText = "🟡 Granting access"
           return fetch(POLYGON_URL + "/access?action=add", {
               "headers": {
                   "content-type": "application/x-www-form-urlencoded",
               },
               "body": "submitted=true&users_added=" + USER_HANDLE + "&type=" + GRANT_ACCESS + "&" + csid,
               "method": "POST"
           }).then((response) => console.log('access granted: /access?action=add'))
        .then((_) => {
           button.innerText = "🔄 Stopping session"
           return fetch(POLYGON_URL + stopSessionPath, {
               "method": "GET"
           }).then((response) => { console.log('session stopped: ' + stopSessionPath); button.innerText = "✅ Completed!"} )
        })
    })
}


const removeAccessInSession = (button, sessionEnterPath) => {
    button.innerText = "🔄 Creating session"
    const stopSessionPath = "/edit-stop?" + sessionEnterPath.split('?', 2)[1]
    return fetch(POLYGON_URL + sessionEnterPath, {"method": "GET"})
        .then((response) => {
           console.log("session started: " + sessionEnterPath)
           const csid = getCsidFromUrl(response.url)
           button.innerText = "🔴 Removing access"
           return fetch(POLYGON_URL + "/access?action=remove", {
               "headers": {
                   "content-type": "application/x-www-form-urlencoded",
               },
               "body": "user=" + USER_HANDLE + "&" + csid,
               "method": "POST"
           }).then((response) => console.log('access removed: /access?action=remove'))
        .then((_) => {
           button.innerText = "🔄 Stopping session"
           return fetch(POLYGON_URL + stopSessionPath, {
               "method": "GET"
           }).then((response) => { console.log('session stopped: ' + stopSessionPath); button.innerText = "❎ Completed!"} )
        })
    })
}

const patchProblems = () => {
    const elements = getProblemsWorkingCopyCol();
    elements.find('a:first-child').before((i) => {
        const sessionEnterPath = getEnterSessionPath(elements[i])
        return [createShareButton((button) => shareAccessInSession(button, sessionEnterPath)),
                createRemoveButton((button) => removeAccessInSession(button, sessionEnterPath))]
    })
}

(function() {
    'use strict';

    patchProblems()
})();