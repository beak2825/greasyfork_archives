// ==UserScript==
// @name        LumiNUSAutoSort
// @description Sorts files alphabetically by default when you view the "Files" section of a module in LumiNUS
// @author      Soh Thiam Hing
// @license     OSL-3.0
// @version     1.0
// @match       https://luminus.nus.edu.sg/*
// @namespace   com.daffodilistic.tampermonkey
// @require     https://cdn.jsdelivr.net/gh/CoeJoder/waitForKeyElements.js@6b9ca81bf32899b4274086aa9d48c3ce5648e0b6/waitForKeyElements.js
// @downloadURL https://update.greasyfork.org/scripts/440282/LumiNUSAutoSort.user.js
// @updateURL https://update.greasyfork.org/scripts/440282/LumiNUSAutoSort.meta.js
// ==/UserScript==

waitForKeyElements(selectSortIconElement, sortByFilename, false);

function selectSortIconElement() {
    let targets = document.querySelectorAll("list-view > section > header > column.name > div > i");
    let elements = [];
    for (const t of targets) {
        if (t.parentNode.textContent.includes("File Name") && !t.hasAttribute('data-userscript-alreadyfound')) {
            elements.push(t);
        }
    }
    return elements;
}

function sortByFilename(node) {
    let event = new Event('click');
    node.dispatchEvent(event);
    return false;
}