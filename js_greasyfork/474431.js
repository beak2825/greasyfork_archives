// ==UserScript==
// @name           facebook - sfoca contatti in chat
// @namespace      https://greasyfork.org/users/237458
// @version        1.1
// @description    casella di controllo contatti in chat sfocati attivata
// @author         figuccio
// @match          https://www.facebook.com/*
// @icon           https://facebook.com/favicon.ico
// @grant          GM_registerMenuCommand
// @grant          GM_addStyle
// @grant          GM_getValue
// @grant          GM_setValue
// @run-at         document-start
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @noframes
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/474431/facebook%20-%20sfoca%20contatti%20in%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/474431/facebook%20-%20sfoca%20contatti%20in%20chat.meta.js
// ==/UserScript==
(function () {
    'use strict';
    GM_addStyle(`
    input[type=checkbox] {accent-color:green;}

    input[type=checkbox] {
    accent-color:red;
    outline:2px solid lime;
    width:18px;
    height:18px;
  }

   input[type=checkbox]:checked {
   outline:2px solid yellow;
  }
     `);
    const $ = window.jQuery.noConflict();

    function saveCheckboxState() {
        const isChecked = $("#blurCheckbox").is(":checked");
        GM_setValue("checkboxState", isChecked);
        toggleBlur(isChecked);
    }

    function toggleBlur(blurState) {
        const chatList = document.querySelector(".xwib8y2 ul");
        if (chatList) {
            chatList.style.filter = blurState ? "blur(7px)" : "";
        }
        const labelText = blurState ? "Show Chat😃" : "Hide Chat😩";
        $("#blurLabel").text(labelText);
        $("#blurCheckbox").val(labelText);
    }

    function initializeBlurControl() {
        const chatContainer = $(".xwib8y2 ul").parent();
        if (!chatContainer || $("#blurCheckbox").length > 0) return;

        const blurState = GM_getValue("checkboxState", false); // Imposta lo stato iniziale a false (disattivato)

        const $flexContainer = $("<div>")
            .css({
                display: "flex",
                alignItems: "center",
                margin: "15px",
                background: "aquamarine"
            });

        const $checkbox = $("<input>")
            .attr({
                type: "checkbox",
                id: "blurCheckbox",
                title: "Sfoca",
                value: blurState ? "Show Chat😃" : "Hide Chat😩",
                checked: blurState
            })
            .css({ cursor: "pointer" })
            .on("change", saveCheckboxState);

        const $label = $("<label>")
            .attr({
                for: "blurCheckbox",
                id: "blurLabel",
                title: "Sfoca"
            })
            .text(blurState ? "Show Chat😃" : "Hide Chat😩")
            .css({
                cursor: "pointer",
                marginLeft: "5px",
                color: "lime",
                background:"brown"
            });

        $flexContainer.append($checkbox, $label);
        chatContainer.prepend($flexContainer);

        toggleBlur(blurState);
    }

    $(document).ready(function () {
        initializeBlurControl();

        const blurState = GM_getValue("checkboxState", false); // Legge lo stato iniziale da GM_getValue
        if (blurState) {
            toggleBlur(blurState);// Applica lo stato iniziale
        }
    });

    function observeDOMChanges() {
        var observer = new MutationObserver(function (mutationsList, observer) {
            for (var mutation of mutationsList) {
                initializeBlurControl();
            }
        });

        var config = { childList: true, attributes: true, subtree: true };
        observer.observe(document.body, config);
    }

    observeDOMChanges();
})();
