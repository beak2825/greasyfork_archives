// ==UserScript==
// @name         AO3 Bookmark Back Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  Add a back button to the bookmark page on AO3
// @author       sunkitten_shash
// @match        http://archiveofourown.org/*
// @match        https://archiveofourown.org/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/444036/AO3%20Bookmark%20Back%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/444036/AO3%20Bookmark%20Back%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var scrollPos = 0;

    // add back button which redirects to the previous page
    function addButton() {
        $(".bookmarks-show > .navigation").prepend(`<li><a href="${document.referrer}" id="backButton">← Go Back</a></li>`);
    }

    // scroll to saved position on page
    async function scrollToPos() {
        scrollPos = await GM.getValue("scroll");
        window.scrollTo(0, scrollPos);
    }

    // save the current position that the page is scrolled to
    function saveScrollPos() {
        scrollPos = window.scrollY;
        console.log(scrollPos);
        GM.setValue("scroll", scrollPos);
    }

    // when the page loads
    $(document).ready(function() {
        let url = window.location.href;

        // if we're coming from a bookmarks page, scroll to your previous position on the page
        if (document.referrer.includes("archiveofourown.org/bookmarks/")) {
            scrollToPos();
        }

        // when you click the bookmark form trigger, save the scroll position
        // this way, when you move back to that position, it isn't way down because of the room the form took up
        $("a[id^=bookmark_form_trigger]").click(saveScrollPos)
        if (url.includes("archiveofourown.org/bookmarks/")) {
            addButton();
        }
    });
})();