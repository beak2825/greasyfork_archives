// ==UserScript==
// @name         Turn Off Youtube Annotations
// @version      1.0
// @description  Script to deactivate annotations toggle from youtube video settings
// @author       Hephaistoz
// @match        https://youtube.com/*
// @match        https://www.youtube.com/*
// @match        http://youtube.com/*
// @match        http://www.youtube.com/*
// @grant        none
// @namespace https://greasyfork.org/users/725305
// @downloadURL https://update.greasyfork.org/scripts/419917/Turn%20Off%20Youtube%20Annotations.user.js
// @updateURL https://update.greasyfork.org/scripts/419917/Turn%20Off%20Youtube%20Annotations.meta.js
// ==/UserScript==

(function () {
    'use strict';

    (function TurnOFF(){
        try {
            var ytplayer = document.getElementById("movie_player");

            if(ytplayer.getCurrentTime() <= 0.5)// check if has passed 0.5 seconds since video started // useful to not block the user from changing quality etc.
            {
                var settings_button = document.querySelector(".ytp-settings-button");
                settings_button.click(); settings_button.click(); // open and close settings, so annotations label is created

                var all_labels = document.getElementsByClassName("ytp-menuitem-label");
                for (var i = 0; i < all_labels.length; i++) {
                    if ((all_labels[i].innerHTML == "Annotations") || (all_labels[i].innerHTML == "Anotações") && (all_labels[i].parentNode.getAttribute("aria-checked") == "true")) { // find the correct label and see if it is active
                        all_labels[i].click(); // and in that case, click it
                    }
                }
            }
        } catch (e) {}
        setTimeout(TurnOFF,800);
    })();
})();



