// ==UserScript==
// @name         SteamGifts Access Keys
// @namespace    http://www.linuxmint.ro/
// @version      1.0
// @description  Access Key Helpers for SteamGifts
// @author       Nicolae Crefelean
// @match        https://www.steamgifts.com/giveaway/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415309/SteamGifts%20Access%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/415309/SteamGifts%20Access%20Keys.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // these are the control elements for the "back" and "hide" features
    const head = document.head;
    const hidePopup = document.querySelector(".popup--hide-games");
    const hideButton = document.querySelector(".trigger-popup");
    const hideConfirm = document.querySelector(".js__submit-hide-games");

    // these are the control elements for the giveaway's "enter/remove entry"
    const form = document.querySelector(".sidebar > form");
    const addButton = document.querySelector("div[data-do='entry_insert']");
    const removeButton = document.querySelector("div[data-do='entry_delete']");

    // there is no form to enter/withdraw in/from the giveaway when you lack the points
    // own the game or it's above your level, so make sure there is a form before using it
    if (form !== null) {
        // define the access key and event handler for toggling the entrance/withdrawal in/from a giveaway
        form.setAttribute("accesskey", "a");
        form.addEventListener("click", toggleEntry, true);
    }

    // don't try to add hiding controls for games that are already hidden
    if (hidePopup !== null) {
        // define the access key and event handler for hiding games
        hidePopup.setAttribute("accesskey", "q");
        hidePopup.addEventListener("click", clickHide, true);
    }

    // define the access key and event handler for going back to the previous page
    head.setAttribute("accesskey", "z");
    head.addEventListener("click", goBack, true);

    // event handler for entering/withdrawing in/from a giveaway
    function toggleEntry() {
        addButton.classList.contains("is-hidden") ? removeButton.click() : addButton.click();
    }

    // event handler for hiding games
    function clickHide() {
        switch (hidePopup.style.display) {
            case "none":
            case "":
                if (hideButton !== null) {
                    hideButton.click();
                }
                break;
            case "block":
                hideConfirm.click();
        }
    }

    // event handler for returning to the giveaways page
    function goBack() {
        history.length > 1 ? history.back() : location.href = "/";
    }
})();