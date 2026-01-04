// ==UserScript==
// @name         BGG - Utilities
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Look up printable models for the current game in thangs. The link is inside the "More" menu under "More of this game".
// @author       Jimonthebarn
// @match        https://boardgamegeek.com/boardgame/*
// @match        https://boardgamegeek.com/boardgameexpansion/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamegeek.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522137/BGG%20-%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/522137/BGG%20-%20Utilities.meta.js
// ==/UserScript==

const nameSpan = document.querySelector('span[itemprop="name"]');
const name = nameSpan.textContent;

const linkToThangs = createLink("Thangs models", `https://thangs.com/search/${encodeURIComponent(name + " +board game")}?scope=all&view=grid`);
const linkToBa = createLink("Brettspiel-Angebote", `https://www.brettspiel-angebote.de/suche/${encodeURIComponent(name)}/`);

const moreMenu = locateMenuElement();

const thangsLi = createListItem(linkToThangs);
const brettspielAngeboteLi = createListItem(linkToBa);

moreMenu.appendChild(thangsLi);
moreMenu.appendChild(brettspielAngeboteLi);

function createLink(title, source) {
    const link = document.createElement("a")
    link.href = source
    link.textContent = title;
    link.target = "_blank";

    return link;
}

function locateMenuElement() {
    const heading = Array.from(document.querySelectorAll("h3")).find(
        h3 => h3.textContent.trim() === "More of this Game"
    );
    const moreMenu = heading?.nextElementSibling.tagName === "UL"
        ? heading.nextElementSibling
        : null;

    return moreMenu;
}

function createListItem(element) {
    const li = document.createElement("li")
    li.className = "ng-scope"
    li.appendChild(element)

    return li;
}