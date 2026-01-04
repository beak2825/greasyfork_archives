// ==UserScript==
// @name         Disneyland Paris Waiting List Position BETA
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Shows your position on DLP waiting lists. Only tested with reservations of 1 annual pass.
// @author       Msama#0001
// @match        https://register.disneylandparis.com/entry-reservation*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=disneylandparis.com
// @connect      disney.com
// @connect      disneylandparis.com
// @grant GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459198/Disneyland%20Paris%20Waiting%20List%20Position%20BETA.user.js
// @updateURL https://update.greasyfork.org/scripts/459198/Disneyland%20Paris%20Waiting%20List%20Position%20BETA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var useCountstarted = false;
    console.log("Running script");
    const target = document.querySelector('body');
    const observer = new MutationObserver(function() {
        try{
            if (document.getElementsByTagName("tnp-reservations-spa")[0].shadowRoot.querySelector("tnp-hub-page").shadowRoot.querySelectorAll("tnp-waiting-list-res-details")[0]) {
                var waitlists = document.getElementsByTagName("tnp-reservations-spa")[0].shadowRoot.querySelector("tnp-hub-page").shadowRoot.querySelectorAll("tnp-waiting-list-res-details");
                for (let i = 0; i < waitlists.length; i++){
                    var json = waitlists[i].shadowRoot.querySelectorAll("a.link")[0].getAttribute("data-details");
                    var obj = obj = JSON.parse(json);
                    var visualId = obj["registrations"][0]["visualId"]
                    var resDate = obj["registrations"][0]["reservationDate"]
                    var token = getCookie("DLP_ONEID_IDTOKEN");
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "https://register.disneylandparis.com/retrieval/api/waiting-lists/registrations?visual-id=" + visualId + "&date=" + resDate,
                        headers: {"authorization" : "BEARER " + token, "user-agent" : "okhttp/4.9.2"},
                        onload: function(response) {
                            var position = JSON.parse(response["responseText"])[0]["position"]
                            //console.log(position);
                            waitlists[i].shadowRoot.querySelectorAll(".confirmationNumber")[0].parentElement.append("Position: " + position)
                        }})}
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://dlp-is-guest-tms-tickets-linking-ag.wdprapps.disney.com/prod/v1/tickets/guest/" + encodeURI(getCookie("SWID")),
                    headers: {"authorization" : "BEARER " + token, "user-agent" : "okhttp/4.9.2", "x-api-key" : "STwI0MxcoK4xEWoLu7oGNadhs9GMNbU531tkisdY"},
                    onload: function(response) {
                        var jsonInput = JSON.parse(response["responseText"]);
                        var newul = document.createElement('ul');
                        newul.id = "useCount";
                        newul.style.listStyle = "disc";
                        newul.style.marginTop = "32px";
                        jsonInput.forEach(function(ticket) {
                            if (ticket.productTypeId === "annual-pass-infinity") {
                                let primaryGuestNickName = ticket.primaryGuestNickName;
                                let useCount = ticket.useCount;
                                newul.innerHTML = newul.innerHTML + "<li>Pass Annuel de " + primaryGuestNickName + " utilisé " + useCount + " fois.</li>";
                                console.log(`Primary Guest Nickname: ${primaryGuestNickName}, Use Count: ${useCount}`);
                            }
                        });
                        document.getElementsByTagName("tnp-reservations-spa")[0].shadowRoot.querySelector("tnp-hub-page").shadowRoot.appendChild(newul);
                    }})
                observer.disconnect();
            }} catch (e) {}
    });
    const config = { childList: true };
    observer.observe(target, config);
})();

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}