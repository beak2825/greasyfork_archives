// ==UserScript==
// @name         Skribbl - Quality of Life
// @version      0.2
// @description  Quality of life improvements for Skribbl.io
// @author       4TSOS
// @match        http*://skribbl.io/*
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=skribbl.io
// @namespace https://greasyfork.org/users/784494
// @downloadURL https://update.greasyfork.org/scripts/445287/Skribbl%20-%20Quality%20of%20Life.user.js
// @updateURL https://update.greasyfork.org/scripts/445287/Skribbl%20-%20Quality%20of%20Life.meta.js
// ==/UserScript==

(function() {
    'use strict';
    qol_info();
    qol_globalObserver();
    qol_buttons();
    const input_chat = document.querySelector("#inputChat");
    const input_name = document.querySelector("#inputName");
    const header = document.querySelector("body > div.container-fluid > div.header");
    const timer = document.querySelector("#timer");
    const chat_free_space = document.querySelector("#containerFreespace");
    var chat_messages = null;
    var current_word = null;
    function qol_info() {
        setInterval(function() {
            document.title = `(${timer.innerHTML}) Skribbl.io`;
        }, 500);
    };
    function qol_globalObserver() {
        var globalObserver = new MutationObserver(function(mutation) {
            document.body.addEventListener('keydown', function(event) {
                input_chat.focus();
                input_name.focus();
            });
        });
        globalObserver.observe(document.querySelector("div.container-fluid"), {childList: true, attributes: false, subtree: true});
    };
    function qol_buttons() {
        const qol_buttonsList = document.createElement("div");
        const qol_word_toggle = document.createElement("button");
        const qol_clear_chat = document.createElement("button");
        qol_buttonsList.id = "qol-buttons-list";
        qol_buttonsList.style.display = "flex";
        qol_buttonsList.style.justifyContent = "center";
        qol_buttonsList.style.flexDirection = "row";
        qol_word_toggle.innerHTML = "Hide Word";
        qol_word_toggle.onclick = function() {
            if (!document.querySelector("#containerBoard > div.containerToolbar").style.display === "none") {
                
            };
        };
        qol_clear_chat.innerHTML = "Clear Chat";
        qol_clear_chat.onclick = function() {
            var chat_messages = document.querySelectorAll("#boxMessages > *");
            chat_messages.forEach(function(message) {
                message.remove();
            });
        };
        qol_buttonsList.appendChild(qol_word_toggle);
        qol_buttonsList.appendChild(qol_clear_chat);
        document.querySelector("body > div.container-fluid > div.header").appendChild(qol_buttonsList);
    };
})();