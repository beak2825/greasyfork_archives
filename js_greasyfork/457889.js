// ==UserScript==
// @name         https://www.speedrun.com run mover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically move run between games
// @author       Penguin#7568
// @include      *
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/457889/https%3Awwwspeedruncom%20run%20mover.user.js
// @updateURL https://update.greasyfork.org/scripts/457889/https%3Awwwspeedruncom%20run%20mover.meta.js
// ==/UserScript==

(async () => {
    if (window.location.href.indexOf("/new") > -1) {
        document.getElementById("player1field").value = await GM.getValue("player");
        /**document.getElementById("player2field").value = await GM.getValue("player2");
        document.getElementById("player3field").value = await GM.getValue("player3");
        document.getElementById("player4field").value = await GM.getValue("player4");
        document.getElementById("player5field").value = await GM.getValue("player5");
        document.getElementById("player6field").value = await GM.getValue("player6");
        document.getElementById("player7field").value = await GM.getValue("player7");
        document.getElementById("player8field").value = await GM.getValue("player8");
        document.getElementById("player9field").value = await GM.getValue("player9");
        document.getElementById("player10field").value = await GM.getValue("player10");
        document.getElementById("player11field").value = await GM.getValue("player11");
        document.getElementById("player12field").value = await GM.getValue("player12");
        document.getElementById("player13field").value = await GM.getValue("player13");
        document.getElementById("player14field").value = await GM.getValue("player14");
        document.getElementById("player15field").value = await GM.getValue("player15");
        document.getElementById("player16field").value = await GM.getValue("player16");*/
        document.getElementById("hour").value = await GM.getValue("hour");
        document.getElementById("minute").value = await GM.getValue("minute");
        document.getElementById("second").value = await GM.getValue("second");
        document.getElementById("milliseconds").value = await GM.getValue("ms");
        // document.getElementById("igthour").value = await GM.getValue("igthour");
        // document.getElementById("igtminute").value = await GM.getValue("igtminute");
        // document.getElementById("igtsecond").value = await GM.getValue("igtsecond");
        // document.getElementById("igtmilliseconds").value = await GM.getValue("igtms");
        document.getElementsByName("platform")[0].value = await GM.getValue("platform");
        document.getElementById("date").value = await GM.getValue("date");
        document.getElementById("video").value = await GM.getValue("video");
        document.getElementById("comment").value = await GM.getValue("comment");
        document.getElementById("category").value = {
            200362: 'Flat',
            200363: 'Slight',
            200364: 'Staircase',
            200365: 'Diagonal_Flat',
            200366: 'Diagonal_Slight',
            200367: 'Diagonal_Staircase',
        }[await GM.getValue("category")];
        document.getElementById("variable89149").value = {
            200359: 317933,
            200360: 317934,
            200361: 317935,
        }[await GM.getValue("mode")];
    } else {
        await GM.setValue("player", document.getElementById("player1field").value);
        /**await GM.setValue("player2", document.getElementById("player2field").value);
        await GM.setValue("player3", document.getElementById("player3field").value);
        await GM.setValue("player4", document.getElementById("player4field").value);
        await GM.setValue("player5", document.getElementById("player5field").value);
        await GM.setValue("player6", document.getElementById("player6field").value);
        await GM.setValue("player7", document.getElementById("player7field").value);
        await GM.setValue("player8", document.getElementById("player8field").value);
        await GM.setValue("player9", document.getElementById("player9field").value);
        await GM.setValue("player10", document.getElementById("player10field").value);
        await GM.setValue("player11", document.getElementById("player11field").value);
        await GM.setValue("player12", document.getElementById("player12field").value);
        await GM.setValue("player13", document.getElementById("player13field").value);
        await GM.setValue("player14", document.getElementById("player14field").value);
        await GM.setValue("player15", document.getElementById("player15field").value);
        await GM.setValue("player16", document.getElementById("player16field").value);*/
        await GM.setValue("hour", document.getElementById("hour").value);
        await GM.setValue("minute", document.getElementById("minute").value);
        await GM.setValue("second", document.getElementById("second").value);
        await GM.setValue("ms", document.getElementById("milliseconds").value);
        // await GM.setValue("igthour", document.getElementById("igthour").value);
        // await GM.setValue("igtminute", document.getElementById("igtminute").value);
        // await GM.setValue("igtsecond", document.getElementById("igtsecond").value);
        // await GM.setValue("igtms", document.getElementById("igtmilliseconds").value);
        await GM.setValue("platform", document.getElementsByName("platform")[0].value);
        await GM.setValue("date", document.getElementById("date").value);
        await GM.setValue("video", document.getElementById("video").value);
        await GM.setValue("comment", document.getElementById("comment").value);
        await GM.setValue("mode", document.getElementById("variable57511").value);
        await GM.setValue("category", document.getElementById("variable57512").value);
        window.location.assign('https://www.speedrun.com/hypixel_bridging/run/new#Flat');
    }
})();