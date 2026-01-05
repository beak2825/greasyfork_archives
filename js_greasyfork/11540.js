// ==UserScript==
// @name         Fallen London AdvTimers
// @namespace    http://nekoinemo.net/
// @version      1.0
// @description  Adds quality of life timers for actions and cards
// @author       NekoiNemo
// @match        http://fallenlondon.storynexus.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11540/Fallen%20London%20AdvTimers.user.js
// @updateURL https://update.greasyfork.org/scripts/11540/Fallen%20London%20AdvTimers.meta.js
// ==/UserScript==

function createActTimer() {
    var timer = document.createElement("span");
    timer.className = "time";
    timer.id = "advActTimer";
    timer.style.display = "none";

    document.getElementById("actionsCountdownMinutes").parentNode.appendChild(document.createElement("br"));
    document.getElementById("actionsCountdownMinutes").parentNode.appendChild(timer);

    return timer;
}
function createCrdTimer() {
    var timer = document.createElement("span");
    timer.id = "advCrdTimer";
    timer.style.display = "none";

    document.getElementsByClassName("deck-contents-description")[0].getElementsByTagName("strong")[0].appendChild(timer);

    return timer;
}
function updateTimers() {
    var isFriend = parseInt(document.getElementById("infoBarCurrentActions").parentElement.lastChild.nodeValue.slice(1)) == 40;

    // Action timer
    var actTimer = document.getElementById("advActTimer");
    if (actTimer == null) actTimer = createActTimer();

    var remActions = (isFriend ? 40 : 20) - parseInt(document.getElementById("infoBarCurrentActions").innerHTML);
    if (remActions == 0) actTimer.style.display = "none";
    else {
        actTimer.style.display = "inline";

        var remActTime = new Date(600000 * (remActions - 1) + new Date(0, 0, 0, 0, document.getElementById("actionsCountdownMinutes").innerHTML, document.getElementById("actionsCountdownSeconds").innerHTML, 0).getTime());
        actTimer.innerHTML = " (" + remActTime.toTimeString().replace(/.*(\d:\d{2}:\d{2}).*/, "$1") + ")";
    }

    // Card timer
    if (document.getElementsByClassName("deck-contents-description").length > 0) {
        var crdTimer = document.getElementById("advCrdTimer");
        if (crdTimer == null) crdTimer = createCrdTimer();

        var remCardsRaw = document.getElementsByClassName("deck-contents-description")[0].childNodes[0].nodeValue.match("\\d\\d?");
        var remCards = (isFriend ? 10 : 6) - (remCardsRaw == null ? 0 : parseInt(document.getElementsByClassName("deck-contents-description")[0].innerHTML.match("\\d\\d?")[0]));
        if (remCards == 0) crdTimer.style.display = "none";
        else {
            crdTimer.style.display = "inline";

            var remCrdTime = new Date(600000 * (remCards - 1) + new Date(0, 0, 0, 0, document.getElementById("cardsCountdownMinutes").innerHTML, document.getElementById("cardsCountdownSeconds").innerHTML, 0).getTime());
            crdTimer.innerHTML = " (" + remCrdTime.toTimeString().replace(/.*(\d:\d{2}:\d{2}).*/, "$1") + ")";
        }
    }
}

// Check if page has timer
if (document.getElementById("infoBarCurrentActions") != null) {
    setInterval(updateTimers, 100);
    console.log("AdvTimer is loaded");
} else {
    console.log("AdvTimer is not loaded");
}