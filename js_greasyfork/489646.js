// ==UserScript==
// @name         GeoGuessr is User Banned
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  Show whether a player is banned or not on their profile page
// @author       sp4ghet
// @match        https://www.geoguessr.com/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/en/users/1273557-sp4ghet
// @downloadURL https://update.greasyfork.org/scripts/489646/GeoGuessr%20is%20User%20Banned.user.js
// @updateURL https://update.greasyfork.org/scripts/489646/GeoGuessr%20is%20User%20Banned.meta.js
// ==/UserScript==

function checkURL() {
    if (location.pathname.includes("/user") || location.pathname.includes("/me/profile")) return 1;
    return 0;
}

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

async function checkUser(profileId) {
    return fetch(location.origin + "/api/v3/users/" + profileId)
        .then(out => out.json())
        .catch(err => { console.log(err); return null; });
}

let observer = new MutationObserver((mutations) => {
    if (checkURL() == 1) {
        const profileLink = (location.pathname.includes("/me/profile")) ? document.querySelector('[name="copy-link"]').value : location.href;
        const profileId = profileLink.substr(profileLink.lastIndexOf("/") + 1);
        checkUser(profileId).then(user => {
            if (user.isBanned === false && user.suspendedUntil === null) {
                return;
            }
            if (document.getElementById("isBanned") == null) {
                let proDiv = document.querySelector("[class*='profile-v2_headerMainContent__']");
                let baseDiv = document.querySelector("[class*='profile-v2_socialLinks__']");
                let bannedDiv = document.createElement("div");
                bannedDiv.innerHTML = `<div id="isBanned"></div>`;
                if (proDiv) {
                    baseDiv.style = "display: inline-block; margin-right: 10px";
                    bannedDiv.style.display = "inline-block";
                }
                insertAfter(bannedDiv, baseDiv);
                let banText = user.isBanned ? `User is banned.` : "";
                let suspensionText = "";
                if (user.suspendedUntil !== null) {
                    let suspensionDate = new Date(user.suspendedUntil);
                    suspensionText = "User " +
                        (Date.now() < suspensionDate ? "is" : "was last") +
                        " suspended until " + suspensionDate.toLocaleString() + ".";
                }
                document.getElementById("isBanned").innerText = banText + (banText && suspensionText ? " " : "") + suspensionText;
            }
        });
    }
})

observer.observe(document.body, { subtree: true, childList: true });
