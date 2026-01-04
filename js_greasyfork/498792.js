// ==UserScript==
// @name         GeoGuessr Duels Chat Opener
// @namespace    https://greasyfork.org/en/users/1323365
// @version      1
// @description  Opens and closes the chat in team duels and parties with a custom shortcut. Removes avatars when opened.
// @author       Funnier04
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498792/GeoGuessr%20Duels%20Chat%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/498792/GeoGuessr%20Duels%20Chat%20Opener.meta.js
// ==/UserScript==

// YOU MAY EDIT THE TWO VARIABLES BELOW

var openKey = "Enter"
var hideKey = "\/"

// Key name reference: https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
// ---------------------------

var openClass = "chat-input_isTextInputActive__5bzDX";

(function() {
    'use strict';

    function openChat() {
        let element = document.querySelector(".chat-input_root__XUwKM");
        if (element) {
            if (element.classList.contains("chat-input_isTextInputActive__5bzDX")) {
                element.classList.remove("chat-input_isTextInputActive__5bzDX");
            } else {
                element.classList.add("chat-input_isTextInputActive__5bzDX");
            }
        }
        hideAvatars()
    }

    function hideAvatars(){
        let avatars = document.querySelectorAll(".animated-player-item_avatarContainer__F9CSU")
        for (var i = 0; i < avatars.length; i++){
            avatars[i].remove();
        }
    }

    document.addEventListener("keydown", function(event) {
        if (event.key === openKey) {
            openChat();
        }
        if (event.key === hideKey) {
            hideAvatars();
        }
    });
})();