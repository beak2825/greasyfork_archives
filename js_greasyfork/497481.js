// ==UserScript==
// @name         Grundos Cafe Snow Wars Keyboard Controls
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Grundos.Cafe: Use the enter key to click the buttons and reveal cells in a checkerboard pattern.
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @author       Dij
// @noframes
// @match        https://www.grundos.cafe/games/snowwars/*
// @match        https://grundos.cafe/games/snowwars/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @license      GPL 3.0
// @downloadURL https://update.greasyfork.org/scripts/497481/Grundos%20Cafe%20Snow%20Wars%20Keyboard%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/497481/Grundos%20Cafe%20Snow%20Wars%20Keyboard%20Controls.meta.js
// ==/UserScript==

function nextCellNum(i) {
    i = i % 48;
    if (i%8 === 7 && i < 47) { // On end of row, offset
        return i + 3;
    } else if (i%8 ===0 && i > 0) {
        return i + 1;
    }
    return i + 2;
}
function selectNextCell(gameboard, i) {
    let total = GM_getValue("Dij_SnowwarsTotal", 0);
    while (total < 48) {
        let cell = gameboard[i].querySelector("a");
        if (cell != null)
        {
            total = total + 1;
            GM_setValue("Dij_SnowwarsTotal", total);
            cell.click();
            return i;
        }
        i = nextCellNum(i);
    }
    return -1; // all possible cells are chosen. I dont think this will ever happen.
}

function resetValues() {
    GM_deleteValue("Dij_SnowwarsCell");
    GM_deleteValue("Dij_SnowwarsTotal");
}
(function() {
    'use strict';
    let submitButton = document.querySelector("#page_content input[type=\"submit\"]");
    if (submitButton) {
        if (submitButton.getAttribute("name") === "start_round") {
            submitButton.addEventListener("click", resetValues); // just in case you click instead of use the enter key
        }
    }
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            if (submitButton) {
                submitButton.click();
            } else {
                let i = GM_getValue("Dij_SnowwarsCell", 1);
                let gameboard = document.querySelectorAll(".center>div:first-child .snowwars-spot:not(.snowwars-axis)");
                i = selectNextCell(gameboard, i)
                if (i > 0) {
                    GM_setValue("Dij_SnowwarsCell", i);
                }
            }
        }
    });
})();