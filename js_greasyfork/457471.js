// ==UserScript==
// @name         AO3 Bookmark Improver
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  Bookmark a work directly from any page and go back from bookmarking to browsing quickly
// @author       sunkitten_shash
// @match        https://archiveofourown.org/*
// @match        http://archiveofourown.org/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/457471/AO3%20Bookmark%20Improver.user.js
// @updateURL https://update.greasyfork.org/scripts/457471/AO3%20Bookmark%20Improver.meta.js
// ==/UserScript==

// Much of the popup settings code heavily references BrickGrass' Blanket Permission Highlighter
// (https://github.com/BrickGrass/Blanket-Permission-Highlighter)

(function() {
    'use strict';

    // ---HTML AND CSS---

    // Styles for settings menu
    const css = `
    #bookmark-settings {
        position: fixed;
        z-index: 21;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0, 0, 0, 0.4);
    }
    #bookmark-settings-content {
        background-color: #fff;
        color: #2a2a2a;
        margin: 10% auto;
        padding: 1em;
        width: 500px;
    }
    #bookmark-settings-content form {
        margin: 1em auto;
    }
    #bookmark-settings a {
        color: #111;
    }
    #bookmark-settings a:hover {
        color: #999;
    }
    #bookmark-settings .progress {
        color: green;
        font-size: .75rem;
    }
    #bookmark-settings button {
        background: #eee;
        color: #444;
        width: auto;
        font-size: 100%;
        line-height: 1.286;
        height: 1.286em;
        vertical-align: middle;
        display: inline-block;
        padding: 0.25em 0.75em;
        white-space: nowrap;
        overflow: visible;
        position: relative;
        text-decoration: none;
        border: 1px solid #bbb;
        border-bottom: 1px solid #aaa;
        background-image: -moz-linear-gradient(#fff 2%,#ddd 95%,#bbb 100%);
        background-image: -webkit-linear-gradient(#fff 2%,#ddd 95%,#bbb 100%);
        background-image: -o-linear-gradient(#fff 2%,#ddd 95%,#bbb 100%);
        background-image: -ms-linear-gradient(#fff 2%,#ddd 95%,#bbb 100%);
        background-image: linear-gradient(#fff 2%,#ddd 95%,#bbb 100%);
        border-radius: 0.25em;
        box-shadow: none;
    }
    @media only screen and (max-width: 625px) {
        #bookmark-settings-content {
            width: 80%;
        }
    }`;

    const bookmark_settings_html = `
    <div id="bookmark-settings">
        <div id="bookmark-settings-content">
            <h2>Ao3 Bookmark Improver Settings</h2>
            <br><br>
            <button id="bookmark-update">Update bookmarks list</button>
            <p>For if you have created a lot of bookmarks in a different browser or when not running this script</p><br>
            <button id="bookmark-clear">Clear bookmarks list</button>
            <p>Clear your entire bookmarks list, for if you have deleted a lot of bookmarks, switched users, or the list seems wrong</p>
            <button id="bookmark-settings-close">Close</button>
        </div>
    </div>`

    // ---GLOBAL VARIABLES---
    // variable that saves the scroll position on a page
    var scrollPos = 0;

    // cutoff variable for updating bookmarks
    let endOfPage = false;

    // abstracting out getting/setting the bookmark id lists into functions doesn't work
    // therefore their names are global variables for easier switching to new variables
    let workListName = "bookmarkWorkIds";
    let bookmarkListName = "bookmarkBookmarkIds";

    // ---SETTINGS PAGE CODE---
    GM.registerMenuCommand("AO3 Bookmark Improver Settings", function() {
        const settings_menu_exists = $("#bookmark-settings").length;
        if (settings_menu_exists) {
            console.log("settings already open");
            return;
        }

        $("body").prepend(bookmark_settings_html);

        $("#bookmark-update").click(updateBookmarkList);
        $("#bookmark-clear").click(clearBookmarks);

        $("#bookmark-settings-close").click(settings_close);
    });

    // close the settings dialog
    function settings_close() {
        $("#bookmark-settings").remove();

        window.location.reload();
    }

    // clear your entire bookmarks list
    async function clearBookmarks() {
        GM.setValue(workListName, []);
        GM.setValue(bookmarkListName, []);
        console.log("clear bookmarks");
        $("#bookmark-clear").after(`<p id="bookmark-clear-feedback" class="progress">Bookmark list cleared!</p>`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        $("#bookmark-clear-feedback").remove();
    }

    // Goes through all of the user's bookmarks until it reaches the end or until there's < n (n being 10 here)
    // new bookmarks on a page, at which point it figures it's updated enough and terminates
    // This runs slowly. There's a 5 second pause in between requesting each page, and if there's an error, it waits
    // 5 minutes (since it assumes that means rate limiting)
    async function updateBookmarkList() {
        // get your userId from the little greeting in the corner
        let userId = $("#greeting > .user > .dropdown > .dropdown-toggle").attr("href").split('/')[2];
        let pageNum = 1;
        let newBookmarksNum = 0;
        endOfPage = false;

        let bookmarkWorkIds = await GM.getValue(workListName, []);
        let bookmarkBookmarkIds = await GM.getValue(bookmarkListName, []);
        console.log("initial bookmarks length: " + bookmarkWorkIds.length);

        $("button#bookmark-update").after(`<p id="bookmark-update-progress" class="progress">On page ${pageNum}...</p>`);
        // loop to go through all the bookmark pages that have new-to-us bookmarks
        while (!endOfPage) {
        //while (counter < 3) {
            // didn't feel like wrapping the entire thing in a timeout or making another function for it
            // bc I'm lazy, so here's just a timeout for 5 secs
            // this doesn't usually run into rate limiting for me
            //console.log({ counter });
            //counter++;
            await new Promise(resolve => setTimeout(resolve, 5000));
            try {
                await $.get(`https://archiveofourown.org/users/${userId}/bookmarks?page=${pageNum}`, (data) => {
                    console.log(pageNum);
                    /*if ($("#bookmark-update-progress").length > 0) {
                        console.log("already there");
                        console.log($("#bookmark-update-progress"));
                        $("#bookmark-update-progress").innerText = `page num: ${pageNum}`;
                    } else {
                        console.log("not there");
                        $("button#bookmark-update").after(`<p id="bookmark-update-progress" style="font-size:.75rem; color:green">page num: ${pageNum}</p>`);
                    }*/
                    $("#bookmark-update-progress").text(`On page ${pageNum}...`);
                    //$("button#bookmark-update").after(`<p id="bookmark-update-progress" style="font-size:.5rem">page num: ${pageNum}</p>`);
                    //console.log($("button#bookmark-update"));
                    let workLinks = $("li[role=article] > .header > .heading:first-child > a:not([href*=users]):not([href*=gifts])", data);
                    let bookmarkLinks = $(`li[role=article] > .own > .actions > li > a:contains("Edit")`, data);
                    if (workLinks.length === 0) {
                        console.log("no work links");
                        endOfPage = true;
                    } else {
                        let work_id = "";

                        // for each of the links in the page
                        // see if the work id is already in your bookmarks
                        // if it's not, add it to bookmarks
                        for (var i = 0, workLink; i < workLinks.length; i++) {
                            workLink = $(workLinks[i]);
                            work_id = workLink.attr("href").split('/')[2];
                            let bookmark_id = $(bookmarkLinks[i]).attr("href").split('/')[2];
                            // if this work_id is not in the bookmarks list
                            if (!bookmarkWorkIds.includes(work_id)) {
                                bookmarkWorkIds.push(work_id);
                                bookmarkBookmarkIds.push(bookmark_id);
                                newBookmarksNum++;
                            }
                        } // end for loop
                        console.log("new bookmarks num: " + newBookmarksNum);
                        // if you have more than 10 deleted or unrevelead bookmarks in a page, well, sucks to be you I guess
                        // otherwise good chance you've exhausted the bookmarks that you need to update, good job
                        if (newBookmarksNum < 10) {
                            console.log(`Terminating bookmarks list update on ${pageNum} with ${newBookmarksNum} new bookmarks`);
                            endOfPage = true;
                        }
                    } // endif
                    pageNum++;
                    newBookmarksNum = 0;
                }) // end the get thingy
            } // end try
            // if there's an error, wait five minutes cause it's probably rate limiting you
            catch (e) {
                console.log("Error requesting bookmarks page: " + e);
                await new Promise(resolve => setTimeout(resolve, 50000))
            }

            if (endOfPage) {
                console.log("Done updating bookmarks list");
                $("#bookmark-update-progress").text("Done updating bookmarks!");
                break;
            }
        } // end while loop
        GM.setValue(workListName, bookmarkWorkIds);
        GM.setValue(bookmarkListName, bookmarkBookmarkIds);
        await new Promise(resolve => setTimeout(resolve, 5000));
        $("#bookmark-update-progress").remove();
    }

    async function doFunctions(url) {
        if (url.includes("archiveofourown.org/bookmarks/")) {
            handleNewBookmark(url);
        }

        let userId = $("#greeting > .user > .dropdown > .dropdown-toggle").attr("href").split('/')[2];
        // this is the slightly nuclear option: if it's one of your pages, just don't show the bookmark button at all
        // it also eliminates all bookmark pages and lists of a user's collections (but not the list of works in the collection)
        // the reason we're eliminating all your pages is that they already have the edit navigation
        // section, so there's duplication
        if (!url.includes("/bookmarks") && !(url.includes("users") && url.includes("collection"))) {
            if (url.includes(userId)) {
                addYourSaveButtons(url);
            } else {
                addSaveButtons(url);
            }
        }
    }

    // adds buttons to create bookmarks on pages w/ your works
    async function addYourSaveButtons(url) {
        let bookmarkWorkIds = await GM.getValue(workListName, []);
        let bookmarkBookmarkIds = await GM.getValue(bookmarkListName, []);

        for (var i = 0, link, links = $("li[role=article] > .header > .heading:first-child > a:not([href*=users]):not([href*=gifts])"); i < links.length; i++) {
            let link = $(links[i]);
            let work_id = link.attr("href").split('/')[2];
            let btnText = 'Save';
            let urlModifier = `works/${work_id}/bookmarks/new`;
            if (bookmarkWorkIds.includes(work_id)) {
                let index = bookmarkWorkIds.indexOf(work_id);
                let bookmark_id = bookmarkBookmarkIds[index];
                btnText = 'Saved';
                urlModifier = `bookmarks/${bookmark_id}/edit`;
            }
            link.closest(".header")
                .nextAll(".stats")
                .after(`<ul class="actions" role="navigation"> <li> <a id="bookmark_form_trigger_` + work_id + `" data-remote="true" href="https://archiveofourown.org/` + urlModifier + `">${btnText}</a> </li> </ul>`);

            // when you click on this work's bookmark form trigger, it adds a div after it and loads in the bookmark form part
            // of the bookmark page
            $("#bookmark_form_trigger_" + work_id).click(function() {
                link.closest(".header")
                    .nextAll(".actions")
                    .after("<div id='bookmark_ext_div'></div>");
                $("#bookmark_ext_div").load(`https://archiveofourown.org/${urlModifier} #bookmark-form`, () => {
                    $("legend:contains('Bookmark')")
                        .after(`<p class="close actions"><a id="bookmark-form-close">×</a></p>`);

                    $("#bookmark-form-close").click(() => $("#bookmark_ext_div").remove());
                });
            });
        }

        $("a[id^=bookmark_form_trigger]").click(saveScrollPos);
    }

    // adds the buttons to create bookmarks
    async function addSaveButtons(url) {
        let bookmarkWorkIds = await GM.getValue(workListName, []);
        let bookmarkBookmarkIds = await GM.getValue(bookmarkListName, []);

        // go through all of the works on the page
        // and add the save/saved button and its functionality
        for (var i = 0, link, links = $("li[role=article]:not([id*=bookmark]) > .header > .heading:first-child > a:not([href*=users]):not([href*=gifts])"); i < links.length; i++) {
            let link = $(links[i]);
            let work_id = link.attr("href").split('/')[2];
            let btnText = 'Save';
            let urlModifier = `works/${work_id}/bookmarks/new`;
            // if this is already bookmarked
            // then we need to indicate that and put in the proper link to edit the bookmark
            if (bookmarkWorkIds.includes(work_id)) {
                let index = bookmarkWorkIds.indexOf(work_id);
                let bookmark_id = bookmarkBookmarkIds[index];
                btnText = 'Saved';
                urlModifier = `bookmarks/${bookmark_id}/edit`;
            }
            link.closest(".header")
                .nextAll(".stats")
                .after(`<ul class="actions" role="navigation"> <li> <a id="bookmark_form_trigger_` + work_id + `" data-remote="true" href="https://archiveofourown.org/` + urlModifier + `">${btnText}</a> </li> </ul>`);

            // when you click on this work's bookmark form trigger, it adds a div after it and loads in the bookmark form part
            // of the bookmark page
            $("#bookmark_form_trigger_" + work_id).click(function() {
                link.closest(".header")
                    .nextAll(".actions")
                    .after("<div id='bookmark_ext_div'></div>");
                $("#bookmark_ext_div").load(`https://archiveofourown.org/${urlModifier} #bookmark-form`, () => {
                    $("legend:contains('Bookmark')")
                        .after(`<p class="close actions"><a id="bookmark-form-close">×</a></p>`);

                    $("#bookmark-form-close").click(() => $("#bookmark_ext_div").remove());
                });
            });

        } // end for loop

        // after we've loaded in all our bookmark form triggers, set the onclick to save the scroll position for the back button
        $("a[id^=bookmark_form_trigger]").click(saveScrollPos);
    } // end addSaveButtons

    // on the dedicated bookmark page (usually when creating/updating a bookmark)
    // first of all, if it has the flash notice to show that it's a newly created bookmark
    // then get both the work id and the bookmark id and add them to the global list of created bookmarks
    // second, it also adds the back button to get back to where you were browsing
    async function handleNewBookmark(url) {
        let bookmarkWorkIds = await GM.getValue(workListName, []);
        let bookmarkBookmarkIds = await GM.getValue(bookmarkListName, []);

        // if this is a newly created bookmark
        if ($("div.flash.notice").text().includes("Bookmark was successfully created. It should appear in bookmark listings within the next few minutes.")) {
            let links = $("li[role=article] > .header > .heading:first-child > a:not([href*=users])");
            let link = $(links[0]);
            let work_id = link.attr("href").split('/')[2];
            let bookmark_id = url.split('/')[4];

            if (!bookmarkWorkIds.includes(work_id)) {
                console.log("this is a new work bookmarked!");
                bookmarkWorkIds.push(work_id);
                bookmarkBookmarkIds.push(bookmark_id);
                GM.setValue(workListName, bookmarkWorkIds);
                GM.setValue(bookmarkListName, bookmarkBookmarkIds);
            }
        }

        // back button
        addButton();
    }

    // add back button which redirects to the previous page
    // for "you created a new bookmark" or "you updated this bookmark" pages
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
        GM.setValue("scroll", scrollPos);
    }

    // when the page loads
    $(document).ready(function() {
        let url = window.location.href;

        // add custom CSS for settings menu
        let head = document.getElementsByTagName('head')[0];
        if (head) {
            let style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = css;
            head.appendChild(style);
        }

        // if we're coming from a bookmarks page, scroll to your previous position on the page
        if (document.referrer.includes("archiveofourown.org/bookmarks/")) {
            scrollToPos();
        }

        doFunctions(url);
    });
})();