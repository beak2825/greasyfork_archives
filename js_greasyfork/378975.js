// ==UserScript==
// @name         Gamdom XP Percentile
// @namespace    http://tampermonkey.net/
// @version      1
// @description  try to take over the world!
// @author       KenYuis
// @match        https://gamdom.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378975/Gamdom%20XP%20Percentile.user.js
// @updateURL https://update.greasyfork.org/scripts/378975/Gamdom%20XP%20Percentile.meta.js
// ==/UserScript==

setInterval(function() {
    if(window.location.href.indexOf("") > -1) {
        if ((document.getElementsByClassName("result_heading")[0].innerText === "LAST 24 HOURS RESULTS")) {


            document.getElementsByClassName("result_heading")[0].innerText = "LAST 24 HOURS RESULTS.";

            var za = document.getElementsByClassName("xp_level")[0].style.width;
            var olo = document.getElementsByClassName("name_and_xp")[0];
            var dab = document.createElement("span");
            var t = document.createTextNode("XP:  " + za);
            dab.className = "biggest_counts";
			dab.id = "okidoki";
            dab.appendChild(t);
            olo.appendChild(dab);



        } else {
            return;
        };
    };
},1);
