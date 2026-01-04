// ==UserScript==
// @name        Kanji Lookup
// @description Adds a button to quickly lookup the Kanji on Jisho or WaniKani.
// @match       https://jpdb.io/kanji/*
// @match       https://jpdb.io/search*
// @match       https://jpdb.io/vocabulary/*
// @grant       GM_addStyle
// @version     0.4.2
// @author      Malox10
// @namespace   jpdb_kanji_lookup
// @license     GNU GPLv3

// @downloadURL https://update.greasyfork.org/scripts/459548/Kanji%20Lookup.user.js
// @updateURL https://update.greasyfork.org/scripts/459548/Kanji%20Lookup.meta.js
// ==/UserScript==

const [hbox, kanji] = createHBox();
hbox.appendChild(createButton("Jisho", `https://jisho.org/search/${kanji}`));
hbox.appendChild(createButton("WK Kanji", `https://www.wanikani.com/kanji/${kanji}`));
hbox.appendChild(createButton("WK Search", `https://www.wanikani.com/search?query=${kanji}`));

function createHBox() {
   const hbox = document.createElement('div');
   hbox.classList.add("hbox");
   hbox.classList.add("hbox-malox");
   hbox.classList.add("gap");
   //hbox.classList.add("vbox-when-small-20");
   //hbox.style.marginBottom = "0.5rem";

   const searchBar = document.querySelector("div > #q");
   const searchBarContainer = searchBar.parentElement.parentElement;
   insertAfter(searchBarContainer, hbox);

   return [hbox, searchBar.value]
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function createButton(name, url) {
    const button = document.createElement('a');
    button.classList.add("kanji-search-malox");
    button.href = url;
    button.innerText = name;

    return button;
}

GM_addStyle (`
    .kanji-search-malox {
        border: 1px solid var(--input-border-color);
        border-radius: 0.4rem;
        padding: 0.4rem 1rem;
        color: var(--text-color);

        text-align: center;
    }

    .hbox-malox {
        margin-bottom: 0.5rem;
    }
`);