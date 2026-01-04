// ==UserScript==
// @name         TorrentBD Forum Smilies
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Shoutbox emoji/smilies in forum reply
// @author       Khaled
// @match        https://*.torrentbd.com/forums.php*
// @match        https://*.torrentbd.org/forums.php*
// @match        https://*.torrentbd.net/forums.php*
// @match        https://*.torrentbd.me/forums.php*
// @match        https://*.torrentbd.com/torrents-details.php*
// @match        https://*.torrentbd.org/torrents-details.php*
// @match        https://*.torrentbd.net/torrents-details.php*
// @match        https://*.torrentbd.me/torrents-details.php*
// @icon         https://www.torrentbd.net/themes/material/static/favicon/favicon-32x32.png
// @grant        none
// @license      GPL-3.0
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/464761/TorrentBD%20Forum%20Smilies.user.js
// @updateURL https://update.greasyfork.org/scripts/464761/TorrentBD%20Forum%20Smilies.meta.js
// ==/UserScript==

var injectForumSmilies = function () {
    const emojiOutlineElm = document.getElementById("smilies-outline");
    if (emojiOutlineElm) return;

    //Inject smilies container
    $(`<div id="smilies-outline" class="col s12 toggle-outline" style="padding: 1.5rem">
                <div class="loading-container">
                    <div class="loader-dzg"></div>
                </div>
            </div>`).insertAfter(".col.s12.center");

    //Inject smilies toggle button
    $(`<span class="btn orange darken-2 mb-5 toggle-trigger"
             onclick="toggleSmilies()"
             title="Smilies &amp; Stickers">
                   <i class="material-icons">mood</i>
          </span>`
     ).insertAfter(".btn.blue.darken-3.mb-5.toggle-trigger");

    //Additional whitespace as a margin
    $(".btn.blue.darken-3.mb-5.toggle-trigger").after(" ");

    //Modify the function that injects the emoji in textbox
    //So it actually can add emoji to corrct textbox
    smiliefy = function (gesture) {
        $('#forum-reply-text').val($('#forum-reply-text').val() + gesture).focus();
    }
};

var injectTorrentDetailsSmilies = function () {
    const emojiOutlineElm = document.getElementById("smilies-outline");
    if (emojiOutlineElm) return;

    //Inject smilies container
    $(`<div id="smilies-outline" class="col s12 toggle-outline" style="padding: 1.5rem">
                <div class="loading-container">
                    <div class="loader-dzg"></div>
                </div>
            </div>`).insertAfter("#comment-button");

    //Inject smilies toggle button
    $(`<span class="btn waves-effect waves-light toggle-trigger"
             onclick="toggleSmilies()"
             title="Smilies &amp; Stickers">
                   <i class="material-icons">mood</i>
          </span>`
     ).insertAfter("#comment-button");

    //Additional whitespace as a margin
    $("#comment-button").after(" ");

    //Modify the function that injects the emoji in textbox
    //So it actually can add emoji to corrct textbox
    smiliefy = function (gesture) {
        $('#textarea1').val($('#textarea1').val() + gesture).focus();
    }
};

(function () {
    "use strict";
    //Haxx to use embedded jQuery
    var script = document.createElement("script");
    script.type = "text/javascript";

    if(window.location.href.includes("forums.php")){
        script.textContent = "(" + injectForumSmilies.toString() + ")();";
    } else if (window.location.href.includes("torrents-details.php")){
        script.textContent = "(" + injectTorrentDetailsSmilies.toString() + ")();";
    }

    document.body.appendChild(script);
})();
