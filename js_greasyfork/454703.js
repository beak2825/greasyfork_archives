// ==UserScript==
// @name         Display Bounty Amounts
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Merges hover over label text for bounty reports with the default table body
// @author       Luvaboy
// @license      MIT
// @grant GM_addStyle
// @match        *.travian.com/position_details.php?*
// @match        *.travian.com/build.php?id=39&gid=16&tt=99
// @downloadURL https://update.greasyfork.org/scripts/454703/Display%20Bounty%20Amounts.user.js
// @updateURL https://update.greasyfork.org/scripts/454703/Display%20Bounty%20Amounts.meta.js
// ==/UserScript==

GM_addStyle(`#center #contentOuterContainer.contentPage {
    width: 650px !important;
    translate: -20px;
}`);

GM_addStyle("#raidList .villageWrapper .dropContainer .raidList .raidListContent table td.troops { width: 0px !important; }");

(function() {
    'use strict';

     if (window.location.href.indexOf("build.php") !== -1) {
         setTimeout(exposeLabelTextOnFarmLists, 1000);
     }
     if (window.location.href.indexOf("position_details.php") !== -1) {
         exposeLabelText();
     }

     function exposeLabelText() {
        let reportIcons = document.querySelectorAll(".reportInfoIcon");

        if (reportIcons) {
            for (let i = 0; i < reportIcons.length; i++) {
                // New Element
                const span = document.createElement("span");
                span.innerText = reportIcons[i].alt;

                var colour = "rgb(255 210 210)";

                if (span.innerText.indexOf("/") !== -1) {
                    colour = "rgb(109 235 107 / 56%)";
                }

                span.style.background = colour;
                span.style["border-radius"] = "5px"
                span.style.padding = "2px"
                span.style.margin = "2px 4px"

                // Insert
                reportIcons[i].parentElement.after(span);

                // Tidy up
                reportIcons[i].style.margin = "0px 4px 0px 8px";
                reportIcons[i].style.float = "none";
            }
        }
    }

    function exposeLabelTextOnFarmLists() {
        let carryIcons = document.querySelectorAll(".carry");

        console.log("carryIcons", carryIcons);

        if (carryIcons) {
            for (let i = 0; i < carryIcons.length; i++) {
                // New Element
                if (carryIcons[i].alt) {
                    console.log("carryIcons[i].alt", carryIcons[i].alt);

                    const span = document.createElement("span");
                    let matches = carryIcons[i].alt.match(/\d+/g);

                    if (matches) {
                        span.innerText = matches.map(Number).join("/");
                    }

                    var colour = "rgb(255 210 210)";

                    if (span.innerText.indexOf("/") === -1) {
                        colour = "rgb(109 235 107 / 56%)";
                    }

                    span.style.background = colour;
                    span.style["border-radius"] = "5px";
                    span.style.padding = "2px";
                    span.style.margin = "2px 4px";

                    // Insert
                    carryIcons[i].after(span);
                }

                // Tidy up
                carryIcons[i].style.margin = "0px 4px 0px 8px";
                carryIcons[i].style.float = "none";
            }
        }
    }

})();