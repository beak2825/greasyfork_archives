// ==UserScript==
// @name         FFXIV Online Shop – New Tab Support
// @namespace    https://fabulous.cupcake.jp.net
// @version      2024.08.11.1
// @description  Adds href to .item-card anchor elements
// @author       FabulousCupcake
// @include      https://store.finalfantasyxiv.com/ffxivstore/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/406332/FFXIV%20Online%20Shop%20%E2%80%93%20New%20Tab%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/406332/FFXIV%20Online%20Shop%20%E2%80%93%20New%20Tab%20Support.meta.js
// ==/UserScript==

const locale = new URL(location.href).pathname.match(/\w\w-\w\w/)[0];

// waitForElementToExist keeps checking if `selector` exists every second
//   Once it exists, it executes `action` and stops checking.
const waitForElementToExist = (selector, action) => {
    const el = document.querySelector(selector);
    if (el !== null) return action(el);

    setTimeout(waitForElementToExist.bind(null, selector, action), 1000);
}

// observeNewCards observes .content for new .item-card and adds href to it
const observeNewCards = () => {
    const content = document.querySelector(".content");
    const config = { childList: true, subtree: true };
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                // Apparently this also catches HTML comments and they do not have this method
                if (!node.getElementsByClassName) return;

                const cards = node.getElementsByClassName("item-card");
                if (cards.length === 0) return;

                cards.forEach(card => addHrefToCard(card));
            });
        });
    });

    observer.observe(content, config);
}

// addHrefToCard adds href to .item-card element
const addHrefToCard = card => {
    const id = card?.__vue__?.$props?.item?.id;
    if (!id) return;

    const url = `/ffxivstore/${locale}/product/${id}`;

    card.setAttribute("href", url);
}

// addHrefToAllCards adds href to all .item-card elements
const addHrefToAllCards = () => {
    const cards = document.querySelectorAll(".item-card");
    cards.forEach(card => addHrefToCard(card));
};

// Main ¯\_(ツ)_/¯
const main = () => {
    waitForElementToExist(".item-card", () => {
        addHrefToAllCards();
        observeNewCards();
    });
}

main();