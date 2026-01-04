// ==UserScript==
// @name         Give Madfish to Stephanie
// @namespace    http://tampermonkey.net/
// @version      2025-02-22
// @description  Give all your Madfish to Stephanie
// @author       You
// @match        https://www.grundos.cafe/useobject/*/?action=give
// @match        https://www.grundos.cafe/itemview/*
// @match        https://www.grundos.cafe/useobject/giveitem/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527770/Give%20Madfish%20to%20Stephanie.user.js
// @updateURL https://update.greasyfork.org/scripts/527770/Give%20Madfish%20to%20Stephanie.meta.js
// ==/UserScript==

var submitbutton = document.getElementById('submit');
const actionDropdown = document.getElementById('itemaction_select');
var giveButton = document.querySelector('input[type="submit"][value="Give Item!"]');
const neofriend = document.getElementById('recip');
var closeAndRefreshButton = document.querySelector('button[name="button"]');

function prepopulate() {
    if (actionDropdown) {
        // Give to Neofriend
        actionDropdown.value = "give"
    }
    if (neofriend) {
        // Give to Stephanie
        neofriend.value = "stephanie"
    }
}

// Only populate if page contains "Madfish" in text
if($("*:contains('Madfish')").length > 0) {
    prepopulate();
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'Enter':
            if (submitbutton) {
                submitbutton.click();
            } else if (giveButton) {
                giveButton.click();
            } else if (closeAndRefreshButton) {
                closeAndRefreshButton.click();
            }
            break;
    }
});
