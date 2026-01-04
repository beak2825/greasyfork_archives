// ==UserScript==
// @name         Mixer Options - Chat and Mute
// @description  Make sure the main streamer's chat is focused and mute concurrent streams
// @version      1.3
// @namespace    http://www.linuxmint.ro/
// @author       Nicolae Crefelean
// @license      CC BY 4.0
// @match        https://mixer.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380340/Mixer%20Options%20-%20Chat%20and%20Mute.user.js
// @updateURL https://update.greasyfork.org/scripts/380340/Mixer%20Options%20-%20Chat%20and%20Mute.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var mySwitch = "<input type='checkbox' id='myChatSwitch' value='ChatSwitch' checked> ChatSwitch";
    var myMute = "<input type='checkbox' id='myAutoMute' value='AutoMute'> AutoMute";
    var minQuality = "<input type='checkbox' id='myMinQuality' value='MinQuality'> MinQuality";

    document.querySelector("nav button").insertAdjacentHTML("afterend", makeButton(mySwitch));
    document.querySelector("nav button").insertAdjacentHTML("afterend", makeButton(myMute));
    document.querySelector("nav button").insertAdjacentHTML("afterend", makeButton(minQuality));

    setInterval(function() {
        // switch to the hoster's chat if it isn't focused
        var tabs = document.querySelector("b-channel-chat-tabs bui-tab-bar");
        if (tabs !== null && !tabs.children[0].classList.contains('selected') && chatSwitch()) {
            tabs.children[0].click();
        }

        // mute the stream's sound
        if (autoMute()) {
            var mute = document.querySelectorAll("button[aria-label='Mute']");
            if (mute.length > 0) {
                mute.forEach(function(e) {
                    e.click();
                });
            }
        }

        // switch to the lowest video quality
        var videoQuality = document.querySelectorAll("div.sub-menu.qualities div.menu-option");
        if (lowestQuality()) {
            if (!lowestQualitySelected(videoQuality)) {
                switchToLowestQuality(videoQuality);
                // hide the settings
                if (settingsVisible()) {
                    hideSettings();
                }
            }
        }

    }, 500);

    function chatSwitch() {
        return document.querySelector("#myChatSwitch").checked;
    }

    function autoMute() {
        return document.querySelector("#myAutoMute").checked;
    }

    function lowestQuality() {
        return document.querySelector("#myMinQuality").checked;
    }

    function makeButton(input) {
        return "<label _ngcontent-c5 class='nav-link'>" + input + "</label>";
    }

    function currentQuality() {
        return document.querySelector(".current-quality").innerText;
    }

    function lowestQualitySelected(list) {
        return currentQuality() === list[list.length - 2].querySelector("div.label").innerText;
    }

    function switchToLowestQuality(videoQuality) {
        videoQuality[videoQuality.length-2].click();
    }

    function settingsVisible() {
        return !document.querySelector("div.sub-menu.main").hasAttribute("hidden");
    }

    function hideSettings() {
        document.querySelector("#settings-button").click()
    }
})();
