// ==UserScript==
// @name         YouTube Watch-Later Playlist Nuker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Batch-remove every video in your YouTube Watch-Later Playlist
// @author       Edwinem
// @match        https://www.youtube.com/playlist?list=WL&disable_polymer=true
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/386615/YouTube%20Watch-Later%20Playlist%20Nuker.user.js
// @updateURL https://update.greasyfork.org/scripts/386615/YouTube%20Watch-Later%20Playlist%20Nuker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $( document ).ready(function() {
        setTimeout(function() {
            $(".pl-video-edit-remove").each(function() {
                $(this).click();
                setTimeout(300);
            });
        }, 1000);

        setTimeout(function() {
            location.reload();
        }, 5000);
    });
})();