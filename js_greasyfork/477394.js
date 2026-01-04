// ==UserScript==
// @name         [AO3] Better Work Buttons
// @namespace    https://greasyfork.org/en/users/1138163-dreambones
// @version      0.7.1
// @description  Configure the buttons for works by hiding or rearranging their order.
// @author       DREAMBONES
// @match        http*://archiveofourown.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477394/%5BAO3%5D%20Better%20Work%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/477394/%5BAO3%5D%20Better%20Work%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configure here! Set to "true" if you want the button hidden, "false" if you want it to be seen.
    var topButtonPos = ["Add Chapter", "Edit", "Edit Tags", "Entire Work", "Previous Chapter", "Chapter Index", "Next Chapter", "Mark as Read", "Subscribe", "Bookmark", "Comments", "Share", "Download", "Hide Creator's Style"]
    var bottomButtonPos = ["Top", "Mark as Read", "Kudos", "Bookmark", "Comments"]

    var hideTopButtons = {
        "Add Chapter": false,
        "Bookmark": false,
        "Chapter Index": false,
        "Comments": false,
        "Download": false,
        "Edit": false,
        "Edit Tags": false,
        "Entire Work": false,
        "Hide Creator's Style": false,
        "Mark as Read": false,
        "Next Chapter": false,
        "Previous Chapter": false,
        "Share": false,
        "Subscribe": false
    }

    var hideBottomButtons = {
        "Bookmark": false,
        "Comments": false,
        "Kudos": false,
        "Mark as Read": false,
        "Top": false
    }

    // Will hide these buttons if the current work is completed.
    var hideWhenCompleted = {
        "Add Chapter": false,
        "Bookmark": false,
        "Chapter Index": false,
        "Comments": false,
        "Download": false,
        "Edit": false,
        "Edit Tags": false,
        "Entire Work": false,
        "Hide Creator's Style": false,
        "Mark as Read": false,
        "Next Chapter": false,
        "Previous Chapter": false,
        "Share": false,
        "Subscribe": false
    }

    // Will hide these buttons if you are the current work's author.
    var hideWhenAuthor = {
        "Add Chapter": false,
        "Bookmark": false,
        "Chapter Index": false,
        "Comments": false,
        "Download": false,
        "Edit": false,
        "Edit Tags": false,
        "Entire Work": false,
        "Hide Creator's Style": false,
        "Mark as Read": false,
        "Next Chapter": false,
        "Previous Chapter": false,
        "Share": false,
        "Subscribe": false
    }
    //Config ends here!

    var topButtons = {
        "Add Chapter": "li[class='add']",
        "Bookmark": "li[class='bookmark']",
        "Chapter Index": "li[class='chapter']",
        "Comments": "li[class='comments']",
        "Download": "li[class='download']",
        "Edit": "li[class='edit']",
        "Edit Tags": "li.edit.tag",
        "Entire Work": "li.chapter.entire",
        "Hide Creator's Style": "li[class='style']",
        "Mark as Read": "li[class='mark']",
        "Next Chapter": "li.chapter.next",
        "Previous Chapter": "li.chapter.previous",
        "Share": "li[class='share']",
        "Subscribe": "li[class='subscribe']"
    }

    var bottomButtons = {
        "Bookmark": "li > a[href='#bookmark-form']",
        "Comments": "li > a[href^='/comments/']",
        "Kudos": "li > form[id='new_kudo']",
        "Mark as Read": "li > a[href$='mark_as_read']",
        "Top": "li > a[href='#main']"
    }

    var domainRe = /https?:\/\/archiveofourown\.org\/works\/\d+/i;
    if (domainRe.test(document.URL)) {
        var topRow = document.querySelector("ul.work.navigation.actions");
        var bottomRow = document.querySelector("ul[class='actions'][role='navigation']");

        arrangeButtons(topRow, topButtons, topButtonPos);
        arrangeButtons(bottomRow, bottomButtons, bottomButtonPos);

        if (isCompleted()) { toggleButtons(topRow, topButtons, hideWhenCompleted); }
        if (isAuthor()) { toggleButtons(topRow, topButtons, hideWhenAuthor); }

        toggleButtons(topRow, topButtons, hideTopButtons);
        toggleButtons(bottomRow, bottomButtons, hideBottomButtons);
    }

    function arrangeButtons(obj, array, settings) {
        for (let i = 0; i < (settings.length); i++) {
            try {
                let button = obj.querySelector(array[settings[i]]);
                if (button.nodeName != "LI") { button = button.parentElement; }
                obj.insertBefore(button, obj.children[i]);
            }
            catch (TypeError) { null; }
        }
    }

    function toggleButtons(obj, array, settings) {
        for (let key in settings) {
            if (settings.hasOwnProperty(key)) {
                if (settings[key] == true) {
                    try {
                        let button = obj.querySelector(array[key]);
                        if (button.nodeName != "LI") { button = button.parentElement; }
                        button.remove();
                    }
                    catch (TypeError) { null; }
                }
            }
        }
    }

    function isCompleted() {
        let chapters = document.querySelector("dd.chapters").innerHTML.split("/");
        if (chapters[0] == chapters[1]) { return true; }
    }

    function isAuthor() {
        let re = /https:\/\/archiveofourown\.org\/users\/(?<user>[^\/]+)(?:\/pseuds\/.+)?/;
        let authorLink = document.querySelector("a[rel='author']").href;
        let userLink = document.querySelector("div#greeting > p.icon > a").href; // .href gets absolute path, .getAttribute("href") gets the exact href value listed.
        let author = authorLink.match(re).groups.user;
        let user = userLink.match(re).groups.user;
        if (author == user) { return true; }
    }
})();