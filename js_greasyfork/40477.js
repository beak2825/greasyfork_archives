// ==UserScript==
// @name         Twitch Rerun Hider
// @namespace    http://grh.se
// @version      1.3.0
// @description  Hide Reruns from the following page
// @author       Markus 'Ragowit' Persson
// @include      *://www.twitch.tv/*
// @grant        GM_getResourceText
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @resource     waitForKeyElements https://cdn.jsdelivr.net/gh/CoeJoder/waitForKeyElements.js@v1.2/waitForKeyElements.js
// @comment      Based upon the work of Max Brown, "Twitch VODCAST remover".
// @comment      Thanks to Skiftcha
// @downloadURL https://update.greasyfork.org/scripts/40477/Twitch%20Rerun%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/40477/Twitch%20Rerun%20Hider.meta.js
// ==/UserScript==

eval(GM_getResourceText("waitForKeyElements"));

waitForKeyElements(".stream-type-indicator--rerun", hideRerun);
waitForKeyElements(".live-channel-card", hideRerunLive);

function hideRerun(jNode) {
    // Good streams, they tag it as a rerun
    $(jNode).parents(".live-channel-card").parent().hide();
}

function hideRerunLive(jNode) {
    // Mediocre streams, they don't tag it right but at least type it in the title...
    var title = $(jNode).find("h3").text().toLowerCase();
    var badWords = [
        "re-run",
        "rebroadcast",
        "recap",
        "rerun",
        "rewatch"
    ];

    if (badWords.some(x => title.includes(x))) {
        $(jNode).parent().hide();
    }
}
