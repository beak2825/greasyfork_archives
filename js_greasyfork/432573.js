// ==UserScript==
// @name         KW - Crappy ELIM script
// @author       Kivou [2000607]
// @namespace    yata.yt
// @version      0.1
// @description  Display online status
// @match        https://www.torn.com/competition.php*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432573/KW%20-%20Crappy%20ELIM%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/432573/KW%20-%20Crappy%20ELIM%20script.meta.js
// ==/UserScript==

// enter your API key here
var apiKey = "";


// Online status will be displayed in place off the status **upon refresh of the page only**.
// WARNING: it will make 1 API call / player displayed in the list. That can be a lot since we're lmited to 100 calls / minutes.
// So try not to refresh too much and click on the "only available button" to save some calls.

// Mind you that this script is as crappy and untested as one script can be.

(function() {
    setTimeout(function () {
        console.log("coucou");
        document.querySelectorAll("span.t-hide a.name").forEach(targetNode => {
            const playerId = targetNode.href.split("=")[1]
            console.log("Getting state of player ID = " + playerId)
            fetch("https://api.torn.com/user/"+playerId+"?selections=&key="+apiKey).then(function(response) {
                return response.json();
            }).then(function(data) {
                const span = targetNode.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.querySelector("span");
                console.log(span);
                span.innerHTML = data.last_action.status;
                if(data.last_action.status === "Offline") {
                    span.classList.remove("t-green");
                    span.classList.add("t-red");
                } else if (data.last_action.status === "Idle") {
                    span.classList.remove("t-green");
                }
            });
        });
    }, 2000);
})();