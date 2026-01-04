// ==UserScript==
// @name         Show profile details
// @version      0.4.2
// @description  Display the country code and account creation date under the name in profile pages
// @author       victheturtle#5159
// @license      MIT
// @match        https://www.geoguessr.com/*
// @icon         https://www.svgrepo.com/show/256769/pl.svg
// @grant        none
// @namespace    https://greasyfork.org/users/967692-victheturtle
// @downloadURL https://update.greasyfork.org/scripts/452754/Show%20profile%20details.user.js
// @updateURL https://update.greasyfork.org/scripts/452754/Show%20profile%20details.meta.js
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
    .catch(err => {console.log(err); return null;});
}

let observer = new MutationObserver((mutations) => {
    if (checkURL() == 1) {
        if (document.getElementById("countryCode") == null) {
            let proDiv = document.querySelector("[class*='profile-header_proBadgeWrapper__']");
            let baseDiv = (proDiv) ? proDiv.firstChild : document.querySelector("[data-qa='user-card-title']");
            let countryCodeDiv = document.createElement("div");
            countryCodeDiv.innerHTML = `<div id="countryCode"></div>`;
            if (proDiv) {
                baseDiv.style = "display: inline-block; margin-right: 10px";
                countryCodeDiv.style.display = "inline-block";
            }
            insertAfter(countryCodeDiv, baseDiv);
            const profileLink = (location.pathname.includes("/me/profile")) ? document.querySelector('[name="copy-link"]').value : location.href;
            const profileId = profileLink.substr(profileLink.lastIndexOf("/")+1);
            checkUser(profileId).then(user => { document.getElementById("countryCode").innerText =
                `[${user.countryCode.toUpperCase()}] [${user.created.slice(0, 16).replace("T"," ")}]`;
            });
        }
    }
})

observer.observe(document.body, {subtree: true, childList: true});
