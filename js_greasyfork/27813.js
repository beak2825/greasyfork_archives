// ==UserScript==
// @name         MyAnimeList(MAL) - Preview BBCODE
// @version      1.0.4
// @description  This script will add the MAL BBCODE Editor where it is currently not enabled.
// @author       Cpt_mathix
// @match        https://myanimelist.net/*
// @grant        none
// @run-at document-body
// @namespace    https://greasyfork.org/users/16080
// @downloadURL https://update.greasyfork.org/scripts/525685/MyAnimeList%28MAL%29%20-%20Preview%20BBCODE.user.js
// @updateURL https://update.greasyfork.org/scripts/525685/MyAnimeList%28MAL%29%20-%20Preview%20BBCODE.meta.js
// ==/UserScript==

init();

function init() {
    if (document.location.href.includes("myanimelist.net/clubs.php?action=create")
        || document.location.href.includes("myanimelist.net/editclub.php")) {
        resizeDialog();

        // Create/Edit Club Description
        transformTextArea('textarea[name="club_description"]');
        return;
    }

    if (document.location.href.includes("myanimelist.net/clubs")) {
        // Club Comments
        transformTextArea("form.form-club-user-comment textarea");
        return;
    }

    if (document.location.href.includes("myanimelist.net/blog.php")) {
        // Blog Comments
        transformTextArea(".blog_detail_comment_wrapper form textarea");
        return;
    }

    if (document.location.href.includes("myanimelist.net/myblog.php")) {
        resizeDialog();

        // Blog Entry
        transformTextArea("#blogForm textarea[name=\"entry_text\"");
        return;
    }

    if (document.location.href.includes("myanimelist.net/editprofile.php")) {
        // Profile About Me
        transformTextArea("#content form textarea[name=\"profile_aboutme\"", (textarea) => {
            textarea.insertAdjacentHTML("afterend", "<small><b>You can also preview bbcode with: <a href='https://cptmathix.github.io/MyAnimeList-BBCODE2HTML/'>https://cptmathix.github.io/MyAnimeList-BBCODE2HTML/</a><b></small>");
        });
        return;
    }

    if (document.location.href.includes("myanimelist.net/ownlist/manga")) {
        resizeDialog();

        // Edit Manga Notes
        transformTextArea("#add_manga_comments");
        return;
    }

    if (document.location.href.includes("myanimelist.net/ownlist/anime")) {
        resizeDialog();

        // Edit Anime Notes
        transformTextArea("#add_anime_comments");
        return;
    }
}

function transformTextArea(selector, action) {
    var textarea = document.querySelector(selector);
    if (textarea) {
        textarea.classList.add("bbcode-message-editor");
        textarea.rows = 15;

        if (action) {
            action(textarea);
        }
    }
}

function resizeDialog() {
    var dialog = document.getElementById("dialog");
    if (dialog) {
        if (document.location.href.includes("hideLayout=1")){
            var clientWidth = document.body.clientWidth;
            dialog.style.width = clientWidth + "px";
        } else {
            dialog.style.width = "804px";
        }
    }
}