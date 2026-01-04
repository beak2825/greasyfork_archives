// ==UserScript==
// @name         Revive Checker
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Shows if the user has revives enabled on the profile page
// @author       ThatJimmyGuy [2924303]
// @license      MIT
// @run-at       document-end
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/525491/Revive%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/525491/Revive%20Checker.meta.js
// ==/UserScript==

let apiKey = "YOUR API KEY HERE";

let miniProfileUserID;

function interceptFetch() {
    const targetWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const origFetch = targetWindow.fetch;
    targetWindow.fetch = async (...args) => {
        const rsp = await origFetch(...args);

        try {
            const url = new URL(args[0], location.origin);
            const params = new URLSearchParams(url.search);
            const reqBody = args[1]?.body;
            if (url.pathname === '/page.php' && params.get('sid') === 'UserMiniProfile' ) {
                miniProfileUserID = JSON.parse(reqBody).userID;
            }
        } catch {
            // ignore
        }
        return rsp;
    };
}

async function delay(time, callback) {
    await setTimeout(callback, time);
}

async function checkRevivableMiniProfile() {
    let revivable;
    if (!miniProfileUserID)
    {
        await delay(50, checkRevivableMiniProfile);
        return;
    }
    GM_xmlhttpRequest({
        method: 'GET',
        url: `https://api.torn.com/user/${miniProfileUserID}?key=${apiKey}&comment=ReviveChecker`,
        onload: function (response) {
            if (response.error)
            {
                alert("An error has occurred while fetching revive status");
                return;
            }
            if (document.querySelector(".rc-revives-text")) { return };
            revivable = JSON.parse(response.response).revivable;
            let newNode = document.createElement("span");
            newNode.className = "rc-revives-mini-text";
            newNode.innerHTML = `Revives: <span class="${revivable?"rc-revives-on":"rc-revives-off"} bold">${revivable?"ON":"OFF"}</span>`
            let mainDesc =document.querySelector("div#profile-mini-root div div.profile-mini-_userProfileWrapper___iIXVW div.profile-container div span.main-desc")
            console.log(mainDesc)
            mainDesc.insertAdjacentElement("afterEnd", newNode);
            miniProfileUserID = null;
        }
    })
}

function checkAddedNode(mutationList, observer, firstAdd) {
    for (const mutation of mutationList) {
        if (mutation.type === "childList" && mutation.addedNodes.length) {
            if (!firstAdd)
            {
                checkRevivableMiniProfile();
            }
            Array.from(mutation.addedNodes).some(node => {
                if (node.id === "profile-mini-root") {
                    checkRevivableMiniProfile();
                    observer.disconnect();
                    observer = new MutationObserver((mutationList, observer) => {checkAddedNode(mutationList, observer, false)});
                    observer.observe(document.querySelector("#profile-mini-root"), {childList: true})
                    return true;
                }
            })
        }
    }
}

(function() {
    'use strict';

    let url = window.location.href;
    if (url.match(/profiles.php*/g)){
        let userId = url.match(/[0-9]+/g)[0];
        let revivable;
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.torn.com/user/${userId}?key=${apiKey}&comment=ReviveChecker`,
            onload: function (response) {
                if (response.error)
                {
                    alert("An error has occurred while fetching revive status");
                    return;
                }
                revivable = JSON.parse(response.response).revivable;
                let node = document.createElement("span");
                node.innerHTML = `Revives: <span class="${revivable?"rc-revives-on":"rc-revives-off"} bold">${revivable?"ON":"OFF"}</span>`
                node.className = "rc-revives-profile-text";
                document.querySelector("div.profile-status div.title-black").appendChild(node);
            }
        })
    }
    interceptFetch();


    GM_addStyle(`
    .rc-revives-on { color: #00a500; }
    .rc-revives-off { color: #d83500; }
    .rc-revives-profile-text, .rc-revives-text { float: right; padding-right: 7px; }
    .rc-revives-mini-text { display: block;}
    `);

    let observer = new MutationObserver((mutationList, observer) => {checkAddedNode(mutationList, observer, true)});
    observer.observe(document.querySelector("body"), {childList: true});
})();