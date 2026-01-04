// ==UserScript==
// @name         Geoguessr clickable party cards
// @description  Lets you click on player cards in the lobby to access profile pages
// @version      1.0.1
// @author       victheturtle#5159
// @license      MIT
// @require      https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js?version=1151668
// @match        https://www.geoguessr.com/*
// @namespace    https://greasyfork.org/users/967692-victheturtle
// @icon         https://www.geoguessr.com/images/auto/144/144/ce/0/plain/pin/22ebcf2199ca13ac99694aa475587923.png
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462083/Geoguessr%20clickable%20party%20cards.user.js
// @updateURL https://update.greasyfork.org/scripts/462083/Geoguessr%20clickable%20party%20cards.meta.js
// ==/UserScript==

let pfpToLink = {};

const originalSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(...args) {
    window.ws = this;
    if (this.geoguessrClickablePartyCards == 0) return originalSend.call(this, ...args);
    this.geoguessrClickablePartyCards = 0
    const originalOnmessage = this.onmessage;
    this.onmessage = ({ data }) => {
        if (originalOnmessage != null) originalOnmessage({ data });
        const received = JSON.parse(data);
        if (received.code == 'PartyMemberListUpdated') {
            let payload = JSON.parse(received.payload);
            let members = payload.members;
            for (let member of members) {
                if (member.pin != "") pfpToLink[member.pin] = "user/"+member.userId;
                if (member.fullBodyPin != "") pfpToLink[member.fullBodyPin] = "user/"+member.userId;
            }
        }
    };
    return originalSend.call(this, ...args);
};

function addOnclick(imgElt) {
    const imgPin = imgElt.src.substr(57);
    const link = pfpToLink[imgPin];
    if (link != null) {
        imgElt.parentNode.parentNode.onclick = function () {window.open(link, '_blank');};
        imgElt.parentNode.parentNode.style="cursor: pointer;";
    }
}


function handleMutations() {
    if (location.pathname != "/party") return;
    // for the host
    const overlayImg = document.querySelector("[class*='overlay-modal_content__'] img[class*='styles_image__']");
    if (!!overlayImg) {
        addOnclick(overlayImg);
    }
    // for the guests
    if (!!document.querySelector("[class*='status-section_waitingMessage__']")) {
        const cards = document.querySelectorAll("[class*='standard-card-layout_card__'] img");
        for (let card of cards) {
            addOnclick(card);
        }
    }
}

new MutationObserver((mutations) => handleMutations()).observe(document.body, { subtree: true, childList: true});
