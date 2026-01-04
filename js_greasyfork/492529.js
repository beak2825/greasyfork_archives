// ==UserScript==
// @name         Better Roblox Website
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Makes the Roblox Site look better.
// @author       chalkboardninja5
// @match        https://*.roblox.com/*
// @icon         https://www.google.com/s2/favicons?sz=256&domain=roblox.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492529/Better%20Roblox%20Website.user.js
// @updateURL https://update.greasyfork.org/scripts/492529/Better%20Roblox%20Website.meta.js
// ==/UserScript==

// applyDarker() - Makes the site blacker, so it's better on your eyes
function applyDarker() {
    var styleDoc = document.createElement("style"); // Creates a "style" element
    styleDoc.innerHTML = `
    .container-header { background-color: black !important; }
    .home-container { background-color: black !important; }
    .abp-container { background-color: black !important; }
    .rbx-body { background-color: black !important; }
    .content { background-color: black !important; }
    #container-main { background-color: black !important; }
    .container-footer { background-color: black !important; }
    #navigation { background-color: black !important; }
    .dark-theme { background-color: black !important; }
    body { background-color: black !important; }
    html { background-color: black !important; }
    head { background-color: black !important; }

    .home-interleave-divider {
        background-color: black !important;
        border-top: black !important;
        border-bottom: black !important;
        height: 0%;
    }

    .rbx-divider {
        background-color: black !important;
        border-top: black !important;
        border-bottom: black !important;
        height: 0%;
    }
    `; // Adds the text
    document.body.appendChild(styleDoc); // Then appends it to the site
}

var setHomeText = (text) => {document.querySelector("#HomeContainer > div.section > div > h1").innerText = text}; // setHomeText(text) - Set the text saying "Home" on the homepage to something else
function killPartOfTheSite() { // killPartOfTheSite() - Removes useless stuff
    // kill every single instance of Recommended For You
    var containersContainer = document.querySelector("#place-list > div > div");
    for (let child of containersContainer.children) { // for each item in the place list
        if ((child.getAttribute("data-testid") == "home-page-game-grid") && (child.getAttribute("class") != "game-sort-container-header")) {
            child.remove(); // remove it if its a grid of Recommended For You and not the Continue text
        }
    }

    // this code is to kill Today's Picks
    document.querySelector("#place-list > div > div > div.game-carousel.wide-game-tile-carousel").remove();
    document.querySelector("#place-list > div > div > div:nth-child(2)").remove();

    // removing every horizontal bar because they look ugly
    var bars = document.querySelector("#place-list > div").children; // First batch of bars
    var bars2 = document.querySelector("#place-list > div > div").children; // Second batch
    var list = []; // List for combining
    for (let bar of bars) {
        if (bar.getAttribute("class") == "home-interleave-divider") { list.push(bar); } // For each bar if its a bar add it to the list of bars
    }
    for (let bar of bars2) {
        if (bar.getAttribute("class") == "home-interleave-divider") { list.push(bar); } // Same tongue twister goes here
    }
    for (let bar of list) {
        if (bar.getAttribute("class") != "game-sort-container-header") { bar.remove(); } // For each bar in the list of bars remove the bar
    }
    document.querySelector("#navigation > ul > li.rbx-divider").remove(); // remove the ugly divider left at the left side of the screen
}

async function getUsername() { // this function is for a feature coming up - getUsername() - Gets the username/display name of the player
    var responseOfAuth = await fetch("https://users.roblox.com/v1/users/authenticated");
    var accDataWeNeed = await responseOfAuth.json();
    return accDataWeNeed.displayName || accDataWeNeed.name;
}

function getSubpage() { // getSubpage() - Get's the part that isn't the domain
    // Get the current URL
    var url = window.location.href;

    // Split the URL by '/'
    var parts = url.split('/');

    // Get the subpage parts
    var subpageParts = parts.slice(3, parts.length);

    // Combine subpage parts with '/'
    var subpage = subpageParts.join('/');

    // Return the subpage
    return subpage;
}

var subpage = getSubpage();

if (subpage.includes("home")) { // If its the homepage
    setTimeout(()=>{ // After a second
        setHomeText("Painting everything black...");
        applyDarker(); // Paint the site black
        setHomeText("Removing useless stuff...");
        killPartOfTheSite(); // Remove the useless stuff
        setHomeText("Home"); // Then go back to normal
    },1000);
} else { // Otherwise
    console.log("Painting everything black...");
    applyDarker(); // Only paint the site black
}