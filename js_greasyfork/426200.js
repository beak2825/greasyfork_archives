// ==UserScript==
// @name         Snow Wars Autoplayer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Play Snow Wars automatically
// @author       DLim
// @include      http://www.neopets.com/games/snowwars.phtml*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426200/Snow%20Wars%20Autoplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/426200/Snow%20Wars%20Autoplayer.meta.js
// ==/UserScript==

// Functional
var maxWait = 2000;
var minWait = 500;
var waitTime = Math.random() * (maxWait - minWait) + minWait;
var re = /\d+/g;
var i;
var cell;
var part;
var action = false;

// Game progression buttons
var continueGame = document.querySelector("input[value='Continue Game']");
var playAgain = document.querySelector("input[value='Play Again!']");
var letsPlay = document.querySelector("input[value='Lets Play!']");

// hit locations
var locations = document.querySelectorAll("a[href*='snowwars.phtml?type=attack']>font"); // for random

// objects
var snowmanCells = [4];
var snowman = [
    document.querySelector("div[style*='padding']>table:nth-of-type(1)>tbody>tr>td>table>tbody>tr>td[background*='2_1']"),
    document.querySelector("div[style*='padding']>table:nth-of-type(1)>tbody>tr>td>table>tbody>tr>td[background*='2_2']"),
    document.querySelector("div[style*='padding']>table:nth-of-type(1)>tbody>tr>td>table>tbody>tr>td[background*='2_3']"),
    document.querySelector("div[style*='padding']>table:nth-of-type(1)>tbody>tr>td>table>tbody>tr>td[background*='2_4']"),
];
var cannonCells = [2];
var cannon = [
    document.querySelector("div[style*='padding']>table:nth-of-type(1)>tbody>tr>td>table>tbody>tr>td[background*='5_1']"),
    document.querySelector("div[style*='padding']>table:nth-of-type(1)>tbody>tr>td>table>tbody>tr>td[background*='5_2']")
];
var snowballCells = [2];
var snowball = [
    document.querySelector("div[style*='padding']>table:nth-of-type(1)>tbody>tr>td>table>tbody>tr>td[background*='6_1']"),
    document.querySelector("div[style*='padding']>table:nth-of-type(1)>tbody>tr>td>table>tbody>tr>td[background*='6_2']")
];
var sledCells = [3];
var sled = [
    document.querySelector("div[style*='padding']>table:nth-of-type(1)>tbody>tr>td>table>tbody>tr>td[background*='7_1']"),
    document.querySelector("div[style*='padding']>table:nth-of-type(1)>tbody>tr>td>table>tbody>tr>td[background*='7_2']"),
    document.querySelector("div[style*='padding']>table:nth-of-type(1)>tbody>tr>td>table>tbody>tr>td[background*='7_3']")
];
var castleCells = [4];
var castle = [
    document.querySelector("div[style*='padding']>table:nth-of-type(1)>tbody>tr>td>table>tbody>tr>td[background*='8_1']"),
    document.querySelector("div[style*='padding']>table:nth-of-type(1)>tbody>tr>td>table>tbody>tr>td[background*='8_2']"),
    document.querySelector("div[style*='padding']>table:nth-of-type(1)>tbody>tr>td>table>tbody>tr>td[background*='8_3']"),
    document.querySelector("div[style*='padding']>table:nth-of-type(1)>tbody>tr>td>table>tbody>tr>td[background*='8_4']")
];

// GAMEPLAY
setTimeout(attack, waitTime);

function attack() {
    // Continue button actions
    if (continueGame != null) {
        continueGame.click();
        action = true;
    }
    if (playAgain != null) {
        playAgain.click();
        action = true;
    }
    if (letsPlay != null) {
        letsPlay.click();
        action = true;
    }

    // Object identification
    // snowman
    i = 0;
    for (part in snowman) {
        if (snowman[i] != null) {
            cell = parseInt(snowman[i].querySelector("a").getAttribute("href").match(re));
            switch (i) {
                case 0: snowmanCells[0] = cell; snowmanCells[1] = cell+1; snowmanCells[2] = cell+8; snowmanCells[3] = cell+9; break;
                case 1: snowmanCells[0] = cell-1; snowmanCells[1] = cell; snowmanCells[2] = cell+7; snowmanCells[3] = cell+8; break;
                case 2: snowmanCells[0] = cell-8; snowmanCells[1] = cell-7; snowmanCells[2] = cell; snowmanCells[3] = cell+1; break;
                case 3: snowmanCells[0] = cell-9; snowmanCells[1] = cell-8; snowmanCells[2] = cell-1; snowmanCells[3] = cell; break;
            }
            i = 0;
            for (part in snowman) {
                if (snowman[i] == null) {
                    console.log("Click cell "+snowmanCells[i]);
                    window.location.href = "http://www.neopets.com/games/snowwars.phtml?type=attack&cell="+snowmanCells[i];
                    action = true;
                    break;
                }
                i++;
            }
            break;
        }
        i++;
    }

    // cannon
    i = 0;
    for (part in cannon) {
        if (cannon[i] != null) {
            cell = parseInt(cannon[i].querySelector("a").getAttribute("href").match(re));
            switch (i) {
                case 0: cannonCells[0] = cell; cannonCells[1] = cell+8; break;
                case 1: cannonCells[0] = cell-8; cannonCells[1] = cell; break;
            }
            i = 0;
            for (part in cannon) {
                if (cannon[i] == null) {
                    console.log("Click cell "+cannonCells[i]);
                    window.location.href = "http://www.neopets.com/games/snowwars.phtml?type=attack&cell="+cannonCells[i];
                    action = true;
                    break;
                }
                i++;
            }
            break;
        }
        i++;
    }

    // snowball
    i = 0;
    for (part in snowball) {
        if (snowball[i] != null) {
            cell = parseInt(snowball[i].querySelector("a").getAttribute("href").match(re));
            switch (i) {
                case 0: snowballCells[0] = cell; snowballCells[1] = cell+8; break;
                case 1: snowballCells[0] = cell-8; snowballCells[1] = cell; break;
            }
            i = 0;
            for (part in snowball) {
                if (snowball[i] == null) {
                    console.log("Click cell "+snowballCells[i]);
                    window.location.href = "http://www.neopets.com/games/snowwars.phtml?type=attack&cell="+snowballCells[i];
                    action = true;
                    break;
                }
                i++;
            }
            break;
        }
        i++;
    }

    // sled
    i = 0;
    for (part in sled) {
        if (sled[i] != null) {
            cell = parseInt(sled[i].querySelector("a").getAttribute("href").match(re));
            switch (i) {
                case 0: sledCells[0] = cell; sledCells[1] = cell+1; sledCells[2] = cell+2; break;
                case 1: sledCells[0] = cell-1; sledCells[1] = cell; sledCells[2] = cell+1; break;
                case 2: sledCells[0] = cell-2; sledCells[1] = cell-1; sledCells[2] = cell; break;
            }
            i = 0;
            for (part in sled) {
                if (sled[i] == null) {
                    console.log("Click cell "+sledCells[i]);
                    window.location.href = "http://www.neopets.com/games/snowwars.phtml?type=attack&cell="+sledCells[i];
                    action = true;
                    break;
                }
                i++;
            }
            break;
        }
        i++;
    }

    // castle
    i = 0;
    for (part in castle) {
        if (castle[i] != null) {
            cell = parseInt(castle[i].querySelector("a").getAttribute("href").match(re));
            switch (i) {
                case 0: castleCells[0] = cell; castleCells[1] = cell+1; castleCells[2] = cell+8; castleCells[3] = cell+9; break;
                case 1: castleCells[0] = cell-1; castleCells[1] = cell; castleCells[2] = cell+7; castleCells[3] = cell+8; break;
                case 2: castleCells[0] = cell-8; castleCells[1] = cell-7; castleCells[2] = cell; castleCells[3] = cell+1; break;
                case 3: castleCells[0] = cell-9; castleCells[1] = cell-8; castleCells[2] = cell-1; castleCells[3] = cell; break;
            }
            i = 0;
            for (part in castle) {
                if (castle[i] == null) {
                    console.log("Click cell "+castleCells[i]);
                    window.location.href = "http://www.neopets.com/games/snowwars.phtml?type=attack&cell="+castleCells[i];
                    action = true;
                    break;
                }
                i++;
            }
            break;
        }
        i++;
    }

    if (!action) {
        var unknown = Math.floor(Math.random() * locations.length);
        //console.log(locations);
        //console.log("Click unknown cell "+unknown);
        locations[unknown].click();
    }
}