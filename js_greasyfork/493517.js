// ==UserScript==
// @name         NPO Bankers Script
// @namespace    npo.torn.com.echotte
// @version      1.1
// @description  Opens a pre-filled NPO Torn Cross Faction Banking form
// @author       echotte [2834135]
// @match        *://www.torn.com/profiles.php?*
// @license      MIT
// @icon         https://static.wikia.nocookie.net/cybernations/images/b/b8/NPObannerflagnew.png/revision/latest/scale-to-width-down/200?cb=20121128045516
// @downloadURL https://update.greasyfork.org/scripts/493517/NPO%20Bankers%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/493517/NPO%20Bankers%20Script.meta.js
// ==/UserScript==

// ------------------------------------------------------------------
// NPO bankers, please enter your own details below:

var ownName = "your_Torn_name_here";
var ownID = "your_Torn_ID_here";
var ownFaction = "Prosperity"; // Strength, Prosperity, Endurance or Valour

// ------------------------------------------------------------------

setTimeout(func, 1000);

function func() {
    'use strict';
    var npoFactions = ['NPO - Strength', 'NPO - Prosperity', 'NPO - Endurance', 'NPO - Valour', 'NPO - Peace'];
    var recipientFaction = document.querySelectorAll('a[href*="/factions.php?step=profile"]')[1].textContent;

    // If the profile is on an NPO member, add the new button to beside the name
    if (npoFactions.includes(recipientFaction)) {

        // create the new button
        var btn = document.createElement('BUTTON');
        btn.innerHTML = ' NPO Banking Form ';
        btn.type = "button";
        btn.style.backgroundColor = "#4169E1";
        btn.style.color = "#ffffff";
        btn.style.cursor = "pointer";
        btn.style.padding = "5px";
        btn.addEventListener("click", ButtonClickAction);

        let tutorial = document.querySelector(".tutorial-switcher");
        tutorial.parentNode.insertBefore(btn, tutorial);
    }

    function ButtonClickAction (zEvent) {
        var recipientName = document.querySelector(".user-info-value").textContent.replace(" ", "+").replace("[", "%5B").replace("]", "%5D");
        let amount = document.querySelector(".confirm-action").parentNode.previousElementSibling.textContent.match(/\$(\d{1,3}(,\d{3})*(\.\d+)?)?/)[1].replace(/,/g, '');

        let url = `https://docs.google.com/forms/d/e/1FAIpQLSdEkeqf2fH76hyIqlXhSqK1MBbFIX0P-zo14ifMMiN0mhjPew/viewform?` +
            `usp=pp_url&entry.1152512924=${recipientName}` +
            `&entry.216494152=${recipientFaction.replace(/ /g,"+")}` +
            `&entry.174769969=${amount}` +
            `&entry.115946209=${ownName}+%5B${ownID}%5D` +
            `&entry.1068288178=NPO+-+${ownFaction}`;

        window.open(url);
    }
};