// ==UserScript==
// @name        Cool Cat Game Deluxe
// @namespace   Violentmonkey Scripts
// @match       https://*.melvoridle.com/*
// @exclude     https://wiki.melvoridle.com/*
// @grant       none
// @version     1.1
// @author      Gardens#3738
// @description A stupid game I made with a friend because we could
// @downloadURL https://update.greasyfork.org/scripts/422746/Cool%20Cat%20Game%20Deluxe.user.js
// @updateURL https://update.greasyfork.org/scripts/422746/Cool%20Cat%20Game%20Deluxe.meta.js
// ==/UserScript==

miceCaught = 0
cats = 0
catCost = 10
oldLadies = 0
oldLadyCost = 10

catchMouseButton = `<button onClick="catchMouse(1)">Catch 🐭</button>`
buyCatButton = `<button id="buyCatButton" onClick="buyCat()">Recruit 😸 for ${catCost}</button>`
buyOldLadyButton = `<button id="buyOldLadyButton" onClick="buyOldLady()">Bribe 👵 for ${oldLadyCost}</button>`

catchMouse = function(mice = 1) {
    miceCaught += mice;
    updateDisplay()
}

gatherCats = function(newCats = 1) {
    cats += newCats;
    updateDisplay()
}

buyCat = function() {
    console.log("mice:", miceCaught, "cats:", cats);
    if (miceCaught >= catCost) {
        cats += 1;
        miceCaught -= catCost;
        catCost += 5;
        console.log("cats total:", cats);
    }
    updateDisplay()
}

buyOldLady = function() {
    if (cats >= oldLadyCost) {
        oldLadies += 1;
        cats -= oldLadyCost;
        oldLadyCost += 5;
        console.log("old ladies total:", oldLadies);
    }
    updateDisplay()
}

updateDisplay = function() {
    $("#catDisplay").html("😸: " + cats)
    $("#mouseDisplay").html("🐭: " + miceCaught)
    $("#oldLadyDisplay").html("👵: " + oldLadies)
    $("#buyCatButton").html("Recruit 😸 for " + catCost + " 🐭");
    $("#buyOldLadyButton").html("Bribe 👵 for " + oldLadyCost + " 😸");
}

window.openGame = function() {
        Swal.fire({
            title: 'Cool cat game by Gardens and Tiramisu',
            html: `${catchMouseButton} ${buyCatButton} ${buyOldLadyButton} 
      <br> <p id="mouseDisplay">🐭: ${miceCaught}</p> <p id="catDisplay">😸: ${cats}</p><p id="oldLadyDisplay">👵: ${oldLadies}</p>`,
        })
    }
    // 


function injectGameButton() {

    if (document.getElementById("nav-menu-show") == null) {
        setTimeout(injectGameButton, 1000)
    } else {
        let dashButton = `
        <li class="nav-main-item">
        <div class="nav-main-link nav-compact pointer-enabled" onclick="openGame();">
        <span class="nav-main-link-name">😸 Stupid Cat Game 😸</span>
        </div>
        </li>`
        $("#nav-menu-show").before(dashButton);

        setInterval(() => { catchMouse(cats) }, 1000);
        setInterval(() => { gatherCats(oldLadies) }, 1000);
    }
}

injectGameButton();