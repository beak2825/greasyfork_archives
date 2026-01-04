// ==UserScript==
// @name         DH3 Friend/Ignore List Upsidedownifier
// @namespace    com.anwinity.dh3
// @version      1.0.0
// @description  Puts the add/cancel buttons in friends and ignore list at the top so you don't have to scroll so much.
// @author       Anwinity
// @match        dh3.diamondhunt.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418874/DH3%20FriendIgnore%20List%20Upsidedownifier.user.js
// @updateURL https://update.greasyfork.org/scripts/418874/DH3%20FriendIgnore%20List%20Upsidedownifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("#dialogue-friends-list").append($("#dialogue-friends-list-section"));
    $("#dialogue-friends-list > hr").hide();
    $("#dialogue-friends-list #dialogue-text-input-cancel").css("margin-bottom", "1em");

    $("#dialogue-ignore-list").append($("#dialogue-ignore-list-section"));
    $("#dialogue-ignore-list > hr").hide();
    $("#dialogue-ignore-list #dialogue-text-input-cancel").css("margin-bottom", "1em");

})();