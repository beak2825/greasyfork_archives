// ==UserScript==
// @name         Infinite Worlds tweaks
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Keeps the story illustrations onscreen, closes Discord popup, story keyboard navigation (1-5 for prompts, "s" to swap images, "e" to edit images), and adds arrow key navigation to community worlds.  Keyboard navigation only works when the focus is not on an "input" element (use "ESC" to leave input focus).
// @author       HiEv
// @license      MIT
// @match        https://infiniteworlds.app/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=infiniteworlds.app
// @grant        none
// @require      http://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/468247/Infinite%20Worlds%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/468247/Infinite%20Worlds%20tweaks.meta.js
// ==/UserScript==

/*
	global $
*/

(function() {
	'use strict';

    setTimeout(() => {
        $(document).on("keyup", function (event) { // Keyboard handler
            if (($("input:focus").length === 0) && ($("textarea:focus").length === 0) && ($("div[contenteditable='true']:focus").length == 0)) {
                if (event.key === "ArrowRight") { // Community Worlds navigate next
                    let links = $("i.left.fa-angle-right");
                    for (let i = links.length - 1; i >= 0; i--) {
                        // console.log(i + " = " + (!$(links[i]).parent().is(".anvil-role-disabled-link") && !$(links[i]).parent().is("button")) + " (" + $(links[i]).parent().is(".anvil-role-disabled-link") + "/" + $(links[i]).parent().is("button") + ")");
                        if (!$(links[i]).parent().is(".anvil-role-disabled-link") && !$(links[i]).parent().is("button")) {
                            // console.log($(links[i]).parent());
                            $(links[i]).parent().click();
                            break;
                        }
                    }
                }
                if (event.key === "ArrowLeft") { // Community Worlds navigate previous
                    let links = $("i.left.fa-angle-left");
                    for (let i = links.length - 1; i >= 0; i--) {
                        // console.log(i + " = " + (!$(links[i]).parent().is(".anvil-role-disabled-link") && !$(links[i]).parent().is("button")) + " (" + $(links[i]).parent().is(".anvil-role-disabled-link") + "/" + $(links[i]).parent().is("button") + ")");
                        if (!$(links[i]).parent().is(".anvil-role-disabled-link") && !$(links[i]).parent().is("button")) {
                            // console.log($(links[i]).parent());
                            $(links[i]).parent().click();
                            break;
                        }
                    }
                }
                if (event.key === "e") { // Open the edit dialog
                    if ($("div.modal.alert-modal").length == 0) {
                        let links = $('[title="View/modify image instructions"] button');
                        if (links.length >= 1) {
                            links[0].click();
                        }
                    } else { // Close the edit dialog
                        $("button.close").click();
                    }
                }
                if (event.key === "s") { // Swap image
                    let links = $('button').children("i.fa-rotate");
                    if (links.length >= 1) {
                        $(links[0]).parent().click();
                    }
                }
                if (event.key === "1") { // Option #1
                    let links = $('[anvil-role="option-button"] button');
                    if (links.length >= 1) {
                        links[0].click();
                    }
                }
                if (event.key === "2") { // Option #2
                    let links = $('[anvil-role="option-button"] button');
                    if (links.length >= 2) {
                        links[1].click();
                    }
                }
                if (event.key === "3") { // Option #3
                    let links = $('[anvil-role="option-button"] button');
                    if (links.length >= 3) {
                        links[2].click();
                    }
                }
                if (event.key === "4") { // Action input
                    let links = $('textarea');
                    if (links.length >= 1) {
                        links[0].focus();
                    }
                }
                if (event.key === "5") { // AI input
                    let links = $('textarea');
                    if (links.length >= 2) {
                        links[1].focus();
                    }
                }
            } else { // Focus is on an input.
                if (event.key === "Escape") {
                    document.activeElement.blur(); // Remove input focus.
                }
            }
        });
    }, 500);

    $('html > head').append($('<style>img { transition: margin-top 0.5s ease-out; }</style>'));
    setInterval(() => { // Reposition the illustration image
        for (let i = 0; i < $(".anvil-spacing-above-small > img").length; i++) {
            let img = $(".anvil-spacing-above-small > img")[i];
            if ($(img).height() > 400) {
                if (Math.abs(Math.max(0, $("html").scrollTop() - 234) - parseFloat($(img).css("margin-top"))) >= 4) {
                    $(img).css("margin-top", Math.max(0, $("html").scrollTop() - 234));
                }
                break;
            }
        }
        if ($('.modal-content a[href="https://discord.gg/eJKbKwdArY"]').length > 0) { // Close Discord popup.
            $(".modal-content .btn-success").click();
        }
    }, 300);
})();