// ==UserScript==
// @name         Give Chaosfish to Cash
// @namespace    http://tampermonkey.net/
// @version      2025-02-22
// @description  Give all your chaosfish
// @author       You
// @match        https://www.grundos.cafe/useobject/*/?action=give
// @match        https://www.grundos.cafe/itemview/*
// @match        https://www.grundos.cafe/useobject/giveitem/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527771/Give%20Chaosfish%20to%20Cash.user.js
// @updateURL https://update.greasyfork.org/scripts/527771/Give%20Chaosfish%20to%20Cash.meta.js
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
        neofriend.value = "cash"
    }
}

// Only populate if page contains "Madfish" in text
if($("*:contains('Chaosfish')").length > 0) {
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
