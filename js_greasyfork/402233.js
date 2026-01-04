// ==UserScript==
// @name         SwitchDD
// @namespace    https://greasyfork.org/en/users/2205
// @version      0.5
// @description  Switch back deals with discussions
// @author       Rudokhvist
// @match        https://www.steamgifts.com/giveaways/*
// @match        https://www.steamgifts.com/
// @grant        none
// @license      Apache-2.0
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/402233/SwitchDD.user.js
// @updateURL https://update.greasyfork.org/scripts/402233/SwitchDD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let previews = document.querySelectorAll(".block_header_text");
    let deals = null;
    let discussions = null;
    for (let i = 0; i<previews.length; i++){
        if (previews[i].textContent=="Deals") {
            deals = previews[i].parentElement.parentElement.parentElement;
        }
        if (previews[i].textContent=="Discussions") {
            discussions = previews[i].parentElement.parentElement.parentElement;
        }
    }
    if (deals!=null && discussions!=null){
        let newdeals=deals.cloneNode(true);
        let newdiscussions=discussions.cloneNode(true);
        deals.parentNode.replaceChild(newdiscussions, deals);
        discussions.parentNode.replaceChild(newdeals,discussions);
    }
})();