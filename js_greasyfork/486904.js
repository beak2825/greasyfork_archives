// ==UserScript==
// @name         Royal Road - Toggle Show Only Unread for My Follows
// @namespace    http://tampermonkey.net/
// @version      2025-02-17
// @description  Button to Toggle hiding/showing stories on my follows list that don't have unread chapters
// @author       You
// @match        https://www.royalroad.com/my/follows*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=royalroad.com
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/486904/Royal%20Road%20-%20Toggle%20Show%20Only%20Unread%20for%20My%20Follows.user.js
// @updateURL https://update.greasyfork.org/scripts/486904/Royal%20Road%20-%20Toggle%20Show%20Only%20Unread%20for%20My%20Follows.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var buttonState = GM_getValue("RR-TSOUFMF-ButtonState", "off");

    var button = document.createElement('a');
    button.innerHTML = "Show Only Unread";
    button.id = "btnToggleUnreadStories";
    button.classList.add("btn");
    button.classList.add("btn-circle");
    button.classList.add("btn-sm");
    button.classList.add("blue");
    if(buttonState=="off"){
        button.classList.add("btn-outline");
    }
    document.querySelector(".actions").prepend(button);

    if(buttonState=="on"){
        toggleStories();
    }

    $('#btnToggleUnreadStories').click(function() {
        toggleStories();
        if(buttonState == "on"){
            button.classList.add("btn-outline");
            buttonState = "off";
            GM_setValue("RR-TSOUFMF-ButtonState", "off");
        } else {
            button.classList.remove("btn-outline");
            buttonState = "on";
            GM_setValue("RR-TSOUFMF-ButtonState", "on");
        }
    });

    function toggleStories() {
        var stories = document.querySelectorAll(".fiction-list-item");
        for (var story of stories) {var chapterButton = story.querySelector(".btn-primary"); if(chapterButton == null) {story.hidden = !story.hidden;}}
    }
})();