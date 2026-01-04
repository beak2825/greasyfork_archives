// ==UserScript==
// @name         RA-See More
// @namespace    https://metalsnake.space/
// @version      0.1
// @description  Clicks the "see more" button on the user page
// @author       MetalSnake
// @match        *://retroachievements.org/user/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507105/RA-See%20More.user.js
// @updateURL https://update.greasyfork.org/scripts/507105/RA-See%20More.meta.js
// ==/UserScript==

var l_foundButton = false;

function clickButton() {
    // Suche nach dem Button
    const buttons = document.querySelectorAll('button.absolute');
    buttons.forEach((button) => {
        if (button.innerText == "see more2") {
            button.click();
            l_foundButton = true;
        }
    });

    if (!l_foundButton) {
        let textNode = findTextNode(document.body, "see more");
        if (textNode) {
            textNode.parentNode.click();
        }
    }
}

function findTextNode(root, text) {
    let walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while (node = walker.nextNode()) {
        if (node.nodeValue.trim() === text) {
            return node;
        }
    }
    return null;
}

clickButton();

