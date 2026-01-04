// ==UserScript==
// @name        Seed Like Button for Seed Hunt
// @description Adds a like button to seeds on Seed Hunt.
// @version     1.0
// @author      Veeno
// @include     https://seedhunt.net/*
// @grant       none
// @namespace   slb-seedhunt.net
// @downloadURL https://update.greasyfork.org/scripts/404445/Seed%20Like%20Button%20for%20Seed%20Hunt.user.js
// @updateURL https://update.greasyfork.org/scripts/404445/Seed%20Like%20Button%20for%20Seed%20Hunt.meta.js
// ==/UserScript==

/******************************************************************************/

function GM_addStyle(aCss) {
    "use strict";
    let head = document.getElementsByTagName("head")[0];
    if(head){
        let style = document.createElement("style");
        style.setAttribute("type", "text/css");
        style.textContent = aCss;
        head.appendChild(style);
        return style;
    }
    return null;
}

const __GM_STORAGE_PREFIX = ["", GM_info.script.namespace, GM_info.script.name, ""].join("***");

function GM_getValue(aKey, aDefault) {
    "use strict";
    let val = localStorage.getItem(__GM_STORAGE_PREFIX + aKey)
    if (null === val && "undefined" != typeof aDefault) return aDefault;
    return val;
}

function GM_setValue(aKey, aVal) {
    "use strict";
    localStorage.setItem(__GM_STORAGE_PREFIX + aKey, aVal);
}

/******************************************************************************/

const base64Digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/";

function numberToBase64(number){
    let residual = Math.floor(Math.abs(Number(number)));
    let result = [];

    do{
        result.push(base64Digits.charAt(residual & 63));
        // Not "residual >> 6" because bitwise operators truncate to 32 bits.
        residual = Math.floor(residual / 64);
    } while(residual > 0);

    return result.reverse().join("");
}

/******************************************************************************/

let seeds = null;

function loadSeeds(){
    let seedList = GM_getValue("seedList", "");
    if(seedList.length < 1) seeds = new Set();
    else seeds = new Set(seedList.split(","));
}

function saveSeeds(){
    GM_setValue("seedList", Array.from(seeds).join(","));
}

/******************************************************************************/

let cards = null;

function processCards(){
    for(let i = cards.length - 1; i >= 0; --i){
        let card = cards[i];
        if(card.dataset.slbB64Seed) continue;

        let seedContainer = card.getElementsByClassName("v-card__title")[0];
        if(!seedContainer) continue;

        let seed = numberToBase64(seedContainer.innerHTML.trim());
        card.dataset.slbB64Seed = seed;
        if(seeds.has(seed)) card.classList.add("slb-liked-seed");

        let likeButton = document.createElement("div");
        likeButton.appendChild(document.createTextNode("👍"));
        likeButton.classList.add("slb-like-button");
        seedContainer.parentElement.appendChild(likeButton);

        likeButton.addEventListener("mousedown", event => event.stopPropagation());

        likeButton.addEventListener("click", event => {
            event.stopPropagation();
            let card = event.target.parentElement;
            while(!card.dataset.slbB64Seed) card = card.parentElement;
            if(card.classList.contains("slb-liked-seed")){
                card.classList.remove("slb-liked-seed");
                seeds.delete(card.dataset.slbB64Seed);
            } else{
                card.classList.add("slb-liked-seed");
                seeds.add(card.dataset.slbB64Seed);
            }
            saveSeeds();
        });
    }
}

/******************************************************************************/

let main = null;
const styleText = [
    ".slb-like-button {",
    "    position: absolute;",
    "    bottom: 5px;",
    "    right: 5px;",
    "    filter: grayscale() brightness(0.5);",
    "    font-size: 25px;",
    "    line-height: normal;",
    "}",
    "",
    ".slb-liked-seed .slb-like-button {",
    "    filter: none;",
    "}",
    "",
    ".slb-liked-seed > div {",
    "    background-color: rgba(0, 255, 0, 0.25);",
    "}"
].join("\n");

function start(){
    main = document.getElementsByTagName("main")[0];
    if(!main){
        setTimeout(start, 25);
        return;
    }

    GM_addStyle(styleText);

    loadSeeds();

    cards = main.getElementsByClassName("v-card v-card--link v-sheet");
    processCards();

    let observer = new MutationObserver(processCards);
    observer.observe(main, { childList: true, subtree: true });
}

start();