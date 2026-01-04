// ==UserScript==
// @name         SlackMediaDeletion
// @namespace    https://*.slack.com/messages/*
// @version      1.2
// @description  Delete media from Slack to save some space.
// @author       Matthew Beaudin
// @match        https://*.slack.com/messages/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369816/SlackMediaDeletion.user.js
// @updateURL https://update.greasyfork.org/scripts/369816/SlackMediaDeletion.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function initButton() {
        const deleteButtonHTML = "<button id='deleteButton' class='btn btn_danger' style='margin-left: 30px;'> Delete Media in Channel</button>";

        document.getElementsByClassName('channel_header_drag_region')[0].innerHTML = deleteButtonHTML;
        var deleteButton = document.getElementById("deleteButton");

        deleteButton.addEventListener("click", function(e) {
            deleteProcess();
        });
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function deleteProcess() {
        var messageList = document.querySelectorAll(".c-message");

        for (var i = 0; i < messageList.length; i++) {
            // If message is a file
            if (messageList[i].querySelector("button.c-button-unstyled.c-file__action_button.c-file__action_button--icon") !== null) {
                // Click action button to open up context menu
                messageList[i].querySelector("button.c-button-unstyled.c-file__action_button.c-file__action_button--icon").click();
                await sleep(500);
                // Click delete action in context menu
                document.querySelector("button.c-button-unstyled.c-menu_item__button.c-menu_item__button--danger").click();
                await sleep(500);

                // Click delete confirmation button
                document.querySelector("button.btn.dialog_go.c-modal_footer__go--default.btn_danger").click();
            }
        }

        await sleep(1000);
        alert("All media has been deleted from this channel.");
    }

    setInterval(() => {
        if (document.getElementById("deleteButton") === null) {
            initButton();
        }
    }, 2500);
})();
