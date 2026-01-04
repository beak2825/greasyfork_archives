// ==UserScript==
// @name         Geoguessr Deny All
// @description  Adds 2 buttons to allow you to accept or deny all friend requests at once
// @version      1.0.3
// @author       victheturtle#5159
// @license      MIT
// @match        https://www.geoguessr.com/*
// @require      https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js?version=1151654
// @icon         https://www.geoguessr.com/images/auto/48/48/ce/0/plain/pin/99358f9464f5a7e8aa43826ed4d41a29.png
// @namespace    https://greasyfork.org/users/967692-victheturtle
// @downloadURL https://update.greasyfork.org/scripts/459280/Geoguessr%20Deny%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/459280/Geoguessr%20Deny%20All.meta.js
// ==/UserScript==

async function fetchWithCors(url, method, body) {
    return await fetch(url, {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.8",
            "content-type": "application/json",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "sec-gpc": "1",
            "x-client": "web"
        },
        "referrer": "https://www.geoguessr.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": (method == "GET") ? null : JSON.stringify(body),
        "method": method,
        "mode": "cors",
        "credentials": "include"
    });
};

let friend_reqs_api = "https://www.geoguessr.com/api/v3/social/friends/received";
let delete_friend_req_api = (id) => `https://www.geoguessr.com/api/v3/social/friends/${id}`;

async function denyPlayer(id) {
    await fetchWithCors(delete_friend_req_api(id), "DELETE", {});
    console.log(`${id} denied`);
};

async function acceptPlayer(id) {
    await fetchWithCors(delete_friend_req_api(id), "PUT", {});
    console.log(`${id} accepted`);
};

function doit(accept) {
    fetchWithCors(friend_reqs_api, "GET")
    .then(ans => ans.json())
    .then(json => {
        for (let item of json) {
            accept ? acceptPlayer(item.userId) : denyPlayer(item.userId);
        }
    });
};

document.acceptAll = () => doit(true);
document.denyAll = () => doit(false);
document.doit = doit;

function makeButtons() {
    const button = document.createElement("li");
    button.classList.add(cn("notification-list_notification__"));
    button.style = "display: flex; justify-content: center; padding: 0 0; padding-bottom: 15px;";
    button.innerHTML = `
        <div class="${cn("notification-list_notificationActions__")}" style="margin: auto;">
            <button type="button" class="${cn("button_button__")} ${cn("button_variantPrimary__")} ${cn("button_sizeSmall__")}" onclick="doit(true)" id="friend-reqs-true">
                <div class="${cn("button_wrapper__")}">
                    <span>Accept everyone</span>
                </div>
            </button>
            <button type="button" class="${cn("button_button__")} ${cn("button_variantSecondary__")} ${cn("button_sizeSmall__")}" onclick="doit(false)" id="friend-reqs-false">
                <div class="${cn("button_wrapper__")}">
                    <span>Deny everyone</span>
                </div>
            </button>
        </div>`;
   return button;
}

let makingButton = false

new MutationObserver(async (mutations) => {
    if (document.getElementById("friend-reqs-true")) return;
    const notifications = document.querySelector('ul[class*="notification-list_notifications__"]') || document.querySelector('div[class*="notification-list_noNotifications__"]');
    if (notifications && !makingButton) {
        makingButton = true
        await scanStyles();
        const buttons = makeButtons();
        notifications.insertBefore(buttons, notifications.childNodes[0]);
        makingButton = false;
    }
}).observe(document.body, { subtree: true, childList: true });
