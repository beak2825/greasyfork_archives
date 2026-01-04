// ==UserScript==
// @name         Egg Navigator Pro
// @namespace    eggHunt.Navigator.Pro
// @version      3.2.1
// @description  AIO Enhanced Egg Navigator with built-in egg detection and navigation across 200+ pages — the largest, cleanest collection available anywhere.
// @author       Oo_Max_Payne_oO [2909733]
// @match        https://www.torn.com/*
// @grant        GM.addStyle
// @run-at       document-start
// @license      CC-BY
// @homepageURL  https://greasyfork.org/en/scripts/533245-egg-hunt-navigator-pro
// @supportURL  https://www.torn.com/forums.php#p=threads&f=67&t=16464782&b=0&a=0
// @downloadURL https://update.greasyfork.org/scripts/533245/Egg%20Navigator%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/533245/Egg%20Navigator%20Pro.meta.js
// ==/UserScript==

// Egg Hunt Navigator Pro
//
// Features:
// - Now works on EVERY page in Torn. No more hitting the "Back" button.
// - Automatically detects eggs on the page, alerts you, and moves them to the top of the screen for easier interaction.
// - Click the egg icon to toggle the Navigator between minimized (1 line) and expanded (4 lines).
// - Drag and drop the Navigator by holding and moving the title bar ("Egg Finder").
// - Navigate through predefined links using the "Next Page" button or right arrow button.
// - Directly jump to a specific page by entering an index number in the "Nav Jump" input box.
// - The Navigator remembers its position and visibility state across sessions.
//
// Usage:
// - Egg Detection: Automatically finds and positions eggs for quick collection.
// - Minimize/Maximize: Click the egg icon to save space or reveal full functionality.
// - Move: Drag the title bar to reposition the Navigator; changes are saved automatically.
// - Navigate: Click "Next Page" or the right arrow button to visit the next link in the sequence.
// - Jump: Enter a valid page index in "Nav Jump" to navigate directly to that page.
//
// Note:
// Some pages may appear more than once in the navigation list, however they have different URLs.

'use strict';

let linkIndex = parseInt(localStorage.getItem("eeh-index")) || 0; // Current page index
const EVERY_LINK = [
// Player Pages
//unprogrammable: "https://www.torn.com/level2.php"
// - leveling up page.  For level holders, you can still visit this page, once there just choose "hold"
  "",
  "/preferences.php",
  "/personalstats.php",
  "/playerreport.php",
  "/page.php?sid=report#/add",
  "/authenticate.php",
  "/page.php?sid=log",
  "/page.php?sid=events",
  "/page.php?sid=events#onlySaved=true",
  "/events.php#/step=all",
  "/page.php?sid=list&type=friends",
  "/friendlist.php#p=add",
  "/page.php?sid=list&type=enemies",
  "/page.php?sid=list&type=targets",
  "/messages.php",
  "/messages.php#/p=inbox",
  "/messages.php#/p=compose",
  "/messages.php#/p=outbox",
  "/messages.php#/p=saved",
  "/messages.php#/p=ignorelist",
  "/awards.php",
  "/index.php",
  "/page.php?sid=gallery",
  "/item.php",
  "/itemuseparcel.php",
  "/page.php?sid=ammo",
  "/displaycase.php",
  "/displaycase.php#display/",
  "/displaycase.php#manage",
  "/displaycase.php#add",
  "/page.php?sid=hof",
  "/trade.php",
  "/bazaar.php#/",
  "/bazaar.php#/add",
  "/bazaar.php#/personalize",
  "/loader.php?sid=itemsMods",
  "/companies.php?step=your&type=1",
  "/pc.php",
//
// Torn Info Pages
  "/calendar.php",
  "/usersonline.php",
  "/page.php?sid=UserList",
  "/bringafriend.php",
  "/forums.php",
  "forums.php#/p=threads&f=67&t=16464782&b=0&a=0",
  "/old_forums.php",
  "/rules.php",
  "/credits.php",
  "/undefined.php",
  "/citystats.php",
//
// City
  "/city.php",
// West Side
  "/page.php?sid=education",
  "/education.php#/step=main",
  "/gym.php",
  "/page.php?sid=travel",
// North Side
  "/amarket.php",
  "/church.php",
  "/church.php?step=proposals",
  "/page.php?sid=ItemMarket#/market/view=category&categoryName=Most%20Popular",
  "/points.php",
  "/pmarket.php",
  "/shops.php?step=pawnshop",
  "/shops.php?step=pharmacy",
  "/shops.php?step=postoffice",
  "/shops.php?step=printstore",
  "/shops.php?step=recyclingcenter",
  "/shops.php?step=super",
  "/shops.php?step=candy",
  "/shops.php?step=clothes",
  "/token_shop.php",
// Red Light
  "/casino.php",
    "/page.php?sid=slots",
    "/page.php?sid=slotsLastRolls",
    "/page.php?sid=slotsStats",
    "/page.php?sid=roulette",
    "/page.php?sid=rouletteLastSpins",
    "/page.php?sid=rouletteStatistics",
    "/page.php?sid=highlow",
    "/page.php?sid=highlowLastGames",
    "/page.php?sid=highlowStats",
    "/page.php?sid=keno",
    "/page.php?sid=kenoLastGames",
    "/page.php?sid=kenoStatistics",
    "/page.php?sid=craps",
    "/page.php?sid=crapsLastRolls",
    "/page.php?sid=crapsStats",
    "/page.php?sid=bookie",
    "/page.php?sid=bookie#/your-bets",
    "/page.php?sid=bookie#/stats/",
    "/page.php?sid=lottery",
    "/page.php?sid=lotteryTicketsBought",
    "/page.php?sid=lotteryPreviousWinners",
    "/page.php?sid=blackjack",
    "/page.php?sid=blackjackLastGames",
    "/page.php?sid=blackjackStatistics",
    "/page.php?sid=holdem",
    "/page.php?sid=holdemStats",
    "/page.php?sid=holdemFull",
    "/page.php?sid=russianRoulette",
    "/loader.php?sid=viewRussianRouletteLastGames",
    "/loader.php?sid=viewRussianRouletteStats",
    "/page.php?sid=spinTheWheel",
    "/page.php?sid=spinTheWheelLastSpins",
  "/dump.php",
  "/dump.php#/trash",
  "/loan.php",
  "/loader.php?sid=missions",
  "/loader.php?sid=racing",
// Residential
  "/properties.php",
  "/properties.php#/p=yourProperties",
  "/properties.php#/p=spousesProperties",
// City Center
  "/archives.php#",
  "/archives.php#/TheBirthOfTorn",
  "/archives.php#/Factions",
  "/archives.php#/Employment",
  "/archives.php#/TheMarkets",
  "/archives.php#/RealEstate",
  "/fans.php",
  "/hospitalview.php",
  "/jailview.php",
  "/committee.php#/step=main",
  "/staff.php",
// Financial
//nb: checked to here
  "/bank.php",
  "/donator.php",
  "/messageinc.php",
  "/messageinc2.php#!p=main",
  "/messageinc2.php#!p=viewall",
  "/messageinc2.php#!p=viewall",
  "/newspaper.php#/",
    "/newspaper.php#/archive",
    "/joblist.php#!p=main",
	"/joblist.php#/p=corpinfo&userID=1699485",
    "/joblist.php?step=search#!p=corpinfo&ID=79286",
    "/freebies.php#!p=main",
    "/newspaper_class.php",
    "/personals.php#!p=main",
    "/bounties.php#!p=main",
    "/bounties.php#/p=add",
    "/comics.php#!p=main",
    "/chronicles.php",
    "/newspaper.php#/tell_your_story",
  "/page.php?sid=stocks",
// East Side
  "/bigalgunshop.php",
  "/shops.php?step=bitsnbobs",
  "/shops.php?step=cyberforce",
  "/shops.php?step=docks",
  "/estateagents.php",
    "/properties.php?step=rentalmarket",
    "/properties.php?step=sellingmarket",
  "/shops.php?step=jewelry",
  "/shops.php?step=nikeh",
//
// Other Torn Stores
  "/page.php?sid=keepsakes",
  "/page.php?sid=bunker",
  "/museum.php",
//
  "/page.php?sid=crimes2",
  "/crimes.php",
    "/loader.php?sid=crimes#/searchforcash",
    "/loader.php?sid=crimes#/bootlegging",
    "/loader.php?sid=crimes#/graffiti",
    "/loader.php?sid=crimes#/shoplifting",
    "/loader.php?sid=crimes#/pickpocketing",
    "/loader.php?sid=crimes#/cardskimming",
    "/loader.php?sid=crimes#/burglary",
    "/loader.php?sid=crimes#/hustling",
    "/loader.php?sid=crimes#/disposal",
    "/loader.php?sid=crimes#/cracking",
    "/loader.php?sid=crimes#/forgery",
    "/loader.php?sid=crimes#/scamming",
//
// NPCS:
  "/profiles.php?XID=1",
  "/userimages.php?XID=1",
  "/bazaar.php?userId=1",
  "/personalstats.php?ID=1",
  "/displaycase.php#display/1",
  "/loader.php?sid=attack&user2ID=1",
  "/profiles.php?XID=3",
  "/profiles.php?XID=4",
  "/bazaar.php?userId=4",
  "/displaycase.php#display/4",
  "/profiles.php?XID=7",
  "/bazaar.php?userId=7",
  "/displaycase.php#display/7",
  "/profiles.php?XID=8",
  "/profiles.php?XID=9",
  "/profiles.php?XID=10",
  "/bazaar.php?userId=10",
  "/displaycase.php#display/10",
  "/profiles.php?XID=15",
  "/bazaar.php?userId=15",
  "/displaycase.php#display/15",
  "/profiles.php?XID=17",
  "/loader.php?sid=attack&user2ID=17",
  "/profiles.php?XID=19",
  "/bazaar.php?userId=19",
  "/profiles.php?XID=20",
  "/bazaar.php?userId=20",
  "/loader.php?sid=attackLog&ID=62ffe20613b5b8cc8821c38989873f4b",
  "/profiles.php?XID=21",
  "/bazaar.php?userId=21",
  "/profiles.php?XID=23",
  "/bazaar.php?userId=23",
  "/profiles.php?XID=50",
  "/bazaar.php?userId=50",
  "/displaycase.php#display/50",
  "/profiles.php?XID=100",
  "/profiles.php?XID=101",
  "/profiles.php?XID=102",
  "/profiles.php?XID=103",
  "/profiles.php?XID=104",
//
  // Faction Specific
  "/factions.php",
  "/factions.php?step=your",
  "/factions.php?step=your#/tab=info",
  "/factions.php?step=your#/tab=territory",
  "/factions.php?step=your#/tab=rank",
  "/factions.php?step=your#/tab=oc",
  "/factions.php?step=your#/tab=upgrades",
  "/factions.php?step=your#/tab=armoury",
  "/factions.php?step=your#/tab=controls",
  "/page.php?sid=factionWarfare",
  "/page.php?sid=factionWarfare#/ranked",
  "/page.php?sid=factionWarfare#/territory",
  "/page.php?sid=factionWarfare#/raids",
  "/page.php?sid=factionWarfare#/chains",
  "/page.php?sid=factionWarfare#/dirty-bombs",
  "/war.php?step=chainreport&chainID=36587144",
  "/war.php?step=warreport&warID=41189",
  "/war.php?step=rankreport&rankID=12096",
//
  // Other
  "/christmas_town.php#/",
  "/christmas_town.php#/mymaps",
  "/christmas_town.php#/mapeditor",
  "/christmas_town.php#/parametereditor",
  "/christmas_town.php#/npceditor",
  "/joblisting.php",
//
  //Overseas
  "/index.php?page=fortune",
  "/index.php?page=rehab",
  "/index.php?page=people",
// To Add - Faction senate specific, eg: applications, musuem contributions, etc.

];
let pressTimer;

const easteregg_svg = `
<svg xmlns="http://www.w3.org/2000/svg" fill="url(#egg-gradient)" stroke="transparent" stroke-width="0" width="15" height="20" viewBox="0 0 15 20">
    <defs>
        <linearGradient id="egg-gradient" gradientTransform="rotate(90)">
            <stop offset="0%" stop-color="#FFD700" /> <!-- Gold -->
            <stop offset="100%" stop-color="#FF4500" /> <!-- Orange -->
        </linearGradient>
        <filter id="egg-shadow" x="0" y="0" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0, 0, 0, 0.25)" />
        </filter>
    </defs>
    <path style="filter: url(#egg-shadow);" d="M1.68,16a5.6,5.6,0,0,0,.43.41A5.72,5.72,0,0,0,3,17a4.73,4.73,0,0,0,.74.39,5.08,5.08,0,0,0,.8.3,5.35,5.35,0,0,0,.69.17,8.62,8.62,0,0,0,.87.11h.84a8.46,8.46,0,0,0,.88-.11l.69-.17a7.14,7.14,0,0,0,.81-.31q.38-.18.72-.39a6.57,6.57,0,0,0,.9-.67,5.14,5.14,0,0,0,.41-.4A6.3,6.3,0,0,0,13,11.67a8.86,8.86,0,0,0-.09-1.21c0-.31-.1-.64-.17-1s-.2-.85-.33-1.29-.3-.93-.48-1.39-.33-.81-.51-1.2c-.1-.2-.19-.39-.29-.58L11,4.72c-.18-.33-.4-.69-.64-1s-.4-.55-.62-.82A4.41,4.41,0,0,0,6.5,1,4.41,4.41,0,0,0,3.29,2.86a9.15,9.15,0,0,0-.61.82c-.24.34-.44.68-.62,1L1.87,5l-.33.66c-.16.36-.32.72-.46,1.09S.74,7.7.61,8.16a13.14,13.14,0,0,0-.34,1.3,10,10,0,0,0-.18,1A8.47,8.47,0,0,0,0,11.67a6.29,6.29,0,0,0,.89,3.25A6.63,6.63,0,0,0,1.68,16Z">
    </path>
</svg>`;


if (document.readyState === "interactive" || document.readyState === "complete") {
    console.log("Page already interactive or fully loaded, initializing...");
    setupEggDetection();
    createEggNavigatorButton();
    ensureNavigatorInBounds();
} else {
    document.addEventListener("DOMContentLoaded", function () {
        console.log("DOM fully loaded, initializing navigator and egg detection...");
        setupEggDetection();
        createEggNavigatorButton();
        ensureNavigatorInBounds();
    });
};

function createEggNavigatorButton() {
    let buttonWrapper = document.getElementById("eggNavigatorButton");
    if (buttonWrapper) return;

    buttonWrapper = document.createElement("div");
    buttonWrapper.id = "eggNavigatorButton";
    buttonWrapper.style.position = "fixed";

    const defaultTop = "10px";
    const defaultLeft = "90%";
    const storedTop = localStorage.getItem("buttonTop");
    const storedLeft = localStorage.getItem("buttonLeft");

    buttonWrapper.style.top = storedTop || defaultTop;
    buttonWrapper.style.left = storedLeft || defaultLeft;

    buttonWrapper.style.width = "150px";
    buttonWrapper.style.zIndex = "399999";
    buttonWrapper.style.padding = "10px";
    buttonWrapper.style.cursor = "move";
    buttonWrapper.style.display = "flex";
    buttonWrapper.style.flexDirection = "column";
    buttonWrapper.style.alignItems = "center";
    buttonWrapper.style.gap = "10px";
    buttonWrapper.style.backgroundColor = "var(--default-bg-panel-color)";
    buttonWrapper.style.border = "1px solid var(--default-panel-divider-outer-side-color)";
    buttonWrapper.style.borderRadius = "5px";
    buttonWrapper.style.boxShadow = "0 2px 12px rgba(0, 0, 0, 0.15)";

    document.body.appendChild(buttonWrapper);

    makeButtonDraggable(buttonWrapper);

    const titleWrapper = document.createElement("div");
    titleWrapper.style.display = "flex";
    titleWrapper.style.flexDirection = "row";
    titleWrapper.style.alignItems = "center";
    titleWrapper.style.justifyContent = "center";
    titleWrapper.style.width = "100%";
    titleWrapper.style.whiteSpace = "nowrap";
    titleWrapper.style.gap = "4px";
    titleWrapper.style.position = "relative";

    const rightArrowButton = document.createElement("button");
    rightArrowButton.innerHTML = "&#9654;";
    rightArrowButton.style.width = "30px";
    rightArrowButton.style.height = "20px";
    rightArrowButton.style.position = "absolute";
    rightArrowButton.style.top = "50%";
    rightArrowButton.style.transform = "translateY(-50%)";
    rightArrowButton.style.right = "0";
    rightArrowButton.style.padding = "0";
    rightArrowButton.style.background = "linear-gradient(00deg, #444444 0%, #222222 60%, #111111 100%)";
    rightArrowButton.style.border = "none";
    rightArrowButton.style.borderRadius = "5px";
    rightArrowButton.style.color = "#DDDDDD";
    rightArrowButton.style.cursor = "pointer";
    rightArrowButton.style.boxShadow = "0 2px 12px rgba(0, 0, 0, 0.15)";

    rightArrowButton.addEventListener("mouseover", () => {
        rightArrowButton.style.background = "linear-gradient(180deg, #333333 0%, #111111 60%, #000000 100%)";
        rightArrowButton.style.color = "#CCCCCC";
    });

    rightArrowButton.addEventListener("mouseout", () => {
        rightArrowButton.style.background = "linear-gradient(00deg, #444444 0%, #222222 60%, #111111 100%)";
        rightArrowButton.style.color = "#DDDDDD";
    });

    titleWrapper.appendChild(rightArrowButton);

    const eggImage = document.createElement("div");
    eggImage.innerHTML = easteregg_svg;
    eggImage.style.flexShrink = "0";
    eggImage.style.width = "20px";
    eggImage.style.height = "20px";
    eggImage.style.cursor = "pointer";

    const title = document.createElement("span");
    title.textContent = "Navigator Pro";
    title.style.fontWeight = "bold";
    title.style.fontSize = "12px";
    title.style.overflow = "hidden";
    title.style.textOverflow = "ellipsis";
    title.style.whiteSpace = "nowrap";
    title.style.marginLeft = "3px";
    title.style.marginRight = "25px";
    title.style.color = "#FFFFFF";

    titleWrapper.appendChild(eggImage);
    titleWrapper.appendChild(title);
    buttonWrapper.appendChild(titleWrapper);

    const contentWrapper = document.createElement("div");
    contentWrapper.style.display = localStorage.getItem("navigatorContentState") === "hidden" ? "none" : "flex";
    contentWrapper.style.flexDirection = "column";
    contentWrapper.style.width = "100%";
    contentWrapper.style.gap = "10px";

    rightArrowButton.style.display = localStorage.getItem("navigatorContentState") === "hidden" ? "block" : "none";

    const nextPageButton = document.createElement("button");
    nextPageButton.textContent = "Next Page";
    nextPageButton.style.padding = "5px 10px";
    nextPageButton.style.borderRadius = "3px";
    nextPageButton.style.border = "1px solid var(--default-panel-divider-outer-side-color)";
    nextPageButton.style.backgroundColor = "var(--info-msg-bg-gradient)";
    nextPageButton.style.cursor = "pointer";
    nextPageButton.style.width = "auto";
nextPageButton.style.color = "#FFFFFF";
nextPageButton.addEventListener("click", navigateToNextPage);

contentWrapper.appendChild(nextPageButton);

rightArrowButton.addEventListener("click", navigateToNextPage);


    const navLabelWrapper = document.createElement("div");
    navLabelWrapper.style.width = "100%";
    navLabelWrapper.style.textAlign = "left";
    const navLabel = document.createElement("span");
    navLabel.textContent = "Nav Jump:";
    navLabel.style.color = "#FFFFFF";
    navLabelWrapper.appendChild(navLabel);
    contentWrapper.appendChild(navLabelWrapper);

    const navJumpWrapper = document.createElement("div");
    navJumpWrapper.style.whiteSpace = "nowrap";
    navJumpWrapper.style.display = "flex";
    navJumpWrapper.style.flexDirection = "row";
    navJumpWrapper.style.alignItems = "center";
    navJumpWrapper.style.justifyContent = "center";
    navJumpWrapper.style.gap = "6px";
    navJumpWrapper.style.width = "100%";

    const navJumpInput = document.createElement("input");
    navJumpInput.type = "number";
    navJumpInput.min = "0";
    navJumpInput.max = EVERY_LINK.length - 1;
    navJumpInput.value = linkIndex;
    navJumpInput.style.width = "50px";
    navJumpInput.style.textAlign = "center";
    navJumpInput.style.flexShrink = "0";

    navJumpInput.addEventListener("change", () => {
        const newIndex = parseInt(navJumpInput.value, 10);
        if (!isNaN(newIndex) && newIndex >= 0 && newIndex < EVERY_LINK.length) {
            linkIndex = newIndex;
            localStorage.setItem("eeh-index", linkIndex);
        } else {
            navJumpInput.value = linkIndex;
        }
    });

    const pageCount = document.createElement("span");
    pageCount.textContent = ` / ${EVERY_LINK.length}`;
    pageCount.style.flexShrink = "0";
    pageCount.style.color = "#FFFFFF";
    navJumpWrapper.appendChild(navJumpInput);
    navJumpWrapper.appendChild(pageCount);

    contentWrapper.appendChild(navJumpWrapper);

    buttonWrapper.appendChild(contentWrapper);

    eggImage.addEventListener("click", function () {
        if (contentWrapper.style.display === "none") {
            contentWrapper.style.display = "flex";
            rightArrowButton.style.display = "none";
            localStorage.setItem("navigatorContentState", "visible");
        } else {
            contentWrapper.style.display = "none";
            rightArrowButton.style.display = "block";
            localStorage.setItem("navigatorContentState", "hidden");
        }
    });

    console.log("[Egg Finder] Button created with toggle functionality.");

    window.addEventListener("resize", () => {
        const rect = buttonWrapper.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (rect.right > viewportWidth) {
            buttonWrapper.style.left = `${viewportWidth - buttonWrapper.offsetWidth}px`;
        }
        if (rect.bottom > viewportHeight) {
            buttonWrapper.style.top = `${viewportHeight - buttonWrapper.offsetHeight}px`;
        }
    });
}

function navigateToNextPage() {
    linkIndex++;
    if (linkIndex >= EVERY_LINK.length) linkIndex = 0;
    localStorage.setItem("eeh-index", linkIndex);
    window.location.href = EVERY_LINK[linkIndex];
}


function ensureNavigatorInBounds() {
    const buttonWrapper = document.getElementById("eggNavigatorButton");

    if (buttonWrapper) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const rect = buttonWrapper.getBoundingClientRect();
        let adjusted = false;

        if (rect.right > viewportWidth) {
            buttonWrapper.style.left = `${viewportWidth - buttonWrapper.offsetWidth}px`;
            adjusted = true;
        }
        if (rect.bottom > viewportHeight) {
            buttonWrapper.style.top = `${viewportHeight - buttonWrapper.offsetHeight}px`;
            adjusted = true;
        }
        if (rect.left < 0) {
            buttonWrapper.style.left = "0px";
            adjusted = true;
        }
        if (rect.top < 0) {
            buttonWrapper.style.top = "0px";
            adjusted = true;
        }

        if (adjusted) {
            console.log("Navigator position adjusted to stay in bounds.");
        }
    }
}

function makeButtonDraggable(button) {
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;

    function preventDefaultTouch(e) {
        e.preventDefault();
    }

    button.addEventListener("mousedown", function (e) {
        isDragging = true;
        offsetX = e.clientX - button.getBoundingClientRect().left;
        offsetY = e.clientY - button.getBoundingClientRect().top;
    });

    document.addEventListener("mousemove", function (e) {
        if (isDragging) {
            const newLeft = Math.max(0, Math.min(window.innerWidth - button.offsetWidth, e.clientX - offsetX));
            const newTop = Math.max(0, Math.min(window.innerHeight - button.offsetHeight, e.clientY - offsetY));

            button.style.left = `${newLeft}px`;
            button.style.top = `${newTop}px`;
        }
    });

    document.addEventListener("mouseup", function () {
        if (isDragging) {
            isDragging = false;
            localStorage.setItem("buttonLeft", button.style.left);
            localStorage.setItem("buttonTop", button.style.top);
        }
    });

    button.addEventListener("touchstart", function (e) {
        isDragging = true;
        const touch = e.touches[0];
        offsetX = touch.clientX - button.getBoundingClientRect().left;
        offsetY = touch.clientY - button.getBoundingClientRect().top;
        document.addEventListener("touchmove", preventDefaultTouch, { passive: false }); // Prevent scrolling
    });

    document.addEventListener("touchmove", function (e) {
        if (isDragging) {
            const touch = e.touches[0];
            const newLeft = Math.max(0, Math.min(window.innerWidth - button.offsetWidth, touch.clientX - offsetX));
            const newTop = Math.max(25, Math.min(window.innerHeight - button.offsetHeight, touch.clientY - offsetY));

            button.style.left = `${newLeft}px`;
            button.style.top = `${newTop}px`;
        }
    });

    document.addEventListener("touchend", function () {
        if (isDragging) {
            isDragging = false;
            localStorage.setItem("buttonLeft", button.style.left);
            localStorage.setItem("buttonTop", button.style.top);
            document.removeEventListener("touchmove", preventDefaultTouch);
        }
    });
}

function setupEggDetection() {
    const egg = document.getElementById('easter-egg-hunt-root');
    if (egg) {
        if (egg.classList.contains('egg-finder-found')) {
            return;
        }
        egg.classList.add('egg-finder-found');
        alert('Egg found!');
        moveEgg(egg);
    }
}

function moveEgg(egg) {
    const buttons = egg.querySelectorAll('button');

    if (buttons.length === 0) {
        setTimeout(() => moveEgg(egg), 50);
        return;
    }

    buttons.forEach(b => {
        // Move and size the entire button container
        b.style.top = '50%';
        b.style.left = '50%';
        b.style.transform = 'translate(-50%, -50%)';
        b.style.height = '50%';
        b.style.width = '50%';
        b.style.position = 'fixed';
        b.style.zIndex = '9999';
        b.style.display = 'flex';
        b.style.alignItems = 'center';
        b.style.justifyContent = 'center';
        b.style.overflow = 'visible';
b.style.borderStyle = 'solid';
b.style.borderWidth = '6px';
b.style.borderColor = 'gold';
b.style.borderRadius = '50%';
b.style.boxShadow = '0 0 16px 6px rgba(255, 215, 0, 1)';
b.style.webkitBoxShadow = '0 0 16px 6px rgba(255, 215, 0, 1)';

        const children = b.children;

        // Enlarge egg image
        if (children.length > 0) {
            const eggImage = children[0];
            eggImage.style.height = '100%';
            eggImage.style.width = '100%';
            eggImage.style.objectFit = 'contain';
        }

        // Ensure particle effects fill the space
        const particles = children[children.length - 1];
        if (particles) {
            particles.style.left = '0';
            particles.style.top = '0';
            particles.style.width = '100%';
            particles.style.height = '100%';
            particles.style.position = 'absolute';
        }
    });
    if (!document.getElementById('egg-mobile-resize-style')) {
    const style = document.createElement('style');
    style.id = 'egg-mobile-resize-style';
    style.textContent = `
        @media (max-width: 768px) {
            .eggAnim___ktpqQ {
                width: 80% !important;
                height: 80% !important;
            }
            .eggAnim___ktpqQ img {
                width: 100% !important;
                height: 100% !important;
                object-fit: contain !important;
            }
        }
    `;
    document.head.appendChild(style);
}

}






GM.addStyle(`
    #eggNavigatorButton {
        background: linear-gradient(00deg, #555555 0%, #333333 60%, #222222 100%);
        border-radius: 5px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
        padding: 10px;
    }

    #eggNavigatorButton button {
        border: none;
        border-radius: 5px;
        padding: 5px 10px;
        cursor: pointer;
        font-weight: bold;
        background-color: #666666 !important;
        color: #FFFFFF;
    }

    #eggNavigatorButton button:hover {
    background: linear-gradient(180deg, #444444 0%, #222222 60%, #111111 100%);
    color: #DDDDDD;
}

    #eggNavigatorButton input {
        text-align: center;
        width: 50px;
    }

    #eggNavigatorButton span {
        font-weight: bold;
    }

    #eggNavigatorButton div {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
    }



@media (max-width: 768px) {
  #eggNavigatorButton button {
    all: unset; /* Resets most browser-specific styles */
    background-color: #444444;
    color: #FFFFFF;
    padding: 5px 10px;
    border: 1px solid var(--default-panel-divider-outer-side-color);
    border-radius: 3px;
    cursor: pointer;
  }

  #eggNavigatorButton button:hover {
    background: #333333;
    color: #FFFFFF;
  }
}
`);