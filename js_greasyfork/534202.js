// ==UserScript==
// @name         Daggerfall Unity - NexusMods Know Issues
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Shows a warning for Mods in the Know-IssuesList for Daggerfall mods on NexusMods.
// @author       Excoriated
// @match        https://www.nexusmods.com/daggerfallunity/mods/*
// @grant        GM_xmlhttpRequest
// @connect      docs.google.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534202/Daggerfall%20Unity%20-%20NexusMods%20Know%20Issues.user.js
// @updateURL https://update.greasyfork.org/scripts/534202/Daggerfall%20Unity%20-%20NexusMods%20Know%20Issues.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sheetURL = "https://docs.google.com/spreadsheets/d/1q35AGp4v7ARCliygZdG8kJUYsfE339teE5I4PANqq3g/gviz/tq?tqx=out:json&gid=657665941";

    function getModName() {
        const el = document.querySelector("#pagetitle h1");
        return el ? el.textContent.trim() : null;
    }

    function showWarning(modName, reason, details) {
        const warningBox = document.createElement("div");
        warningBox.style.background = "red";
        warningBox.style.color = "white";
        warningBox.style.padding = "10px";
        warningBox.style.margin = "10px 0";
        warningBox.style.fontSize = "16px";
        warningBox.style.fontWeight = "bold";
        warningBox.style.borderRadius = "5px";
        warningBox.innerHTML = `<div style='text-align:center;font-size:2rem'>⚠ This Mod (${modName}) is in the know issues list.</div>`;
        warningBox.innerHTML += `<br /> Severity: ${reason}`;
        warningBox.innerHTML += `<br /> Details: ${details}<br />`;
        warningBox.innerHTML += ` <a href="https://docs.google.com/spreadsheets/d/1q35AGp4v7ARCliygZdG8kJUYsfE339teE5I4PANqq3g/edit#gid=657665941" target="_blank" style="color: yellow; text-decoration: underline;">Go to mod list</a>`;

        const container = document.querySelector(".container.tab-description");
        if (container) {
            container.prepend(warningBox);
        }
    }

    GM_xmlhttpRequest({
        method: "GET",
        url: sheetURL,
        onload: function(response) {
            try {
                const json = JSON.parse(response.responseText.substr(47).slice(0, -2));
                const rows = json.table.rows;

                const modName = getModName();
                if (!modName) return;

                const modNameNormalized = modName.trim().toLowerCase();

                for (let row of rows) {
                    const nameCell = row.c[1];
                    const reasonCell = row.c[2];
                    const detailsCell = row.c[3];

                    if (!nameCell || nameCell.v === "Mod") continue;

                    let modNameList = [];

                    if(nameCell.v.indexOf('&') > 0) {
                        modNameList = nameCell.v.split('&');
                    }
                    else {
                        modNameList.push(nameCell.v);
                    }

                    for (let listMod of modNameList) {

                        const sheetNameNormalized = listMod.trim().toLowerCase();
                        const reason = reasonCell ? reasonCell.v : null;
                        const details = detailsCell ? detailsCell.v : null;

                        if (modNameNormalized === sheetNameNormalized) {
                            showWarning(modName, reason, details);
                            break;
                        }
                    }
                }
            } catch (e) {
                console.error("Error while parsing Google Sheet data:", e);
            }
        }
    });
})();