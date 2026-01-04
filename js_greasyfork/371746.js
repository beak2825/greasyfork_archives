// ==UserScript==
// @name         Watch2Gether
// @namespace    http://tampermonkey.net/
// @version      2.2.1
// @description  Change video player to full browser width/height, removing chat, removed blue tabs.
// @author       Kalila Violette
// @match        https://www.watch2gether.com/rooms/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/371746/Watch2Gether.user.js
// @updateURL https://update.greasyfork.org/scripts/371746/Watch2Gether.meta.js
// ==/UserScript==


$(document).ready(function() {
    setTimeout(function() {
        $('.w2g-main-right').remove();
        $('.w2g-userbar').remove();
        $('.w2g-sidebar-message').remove();
        $('.w2g-main-spacer').remove();
        $('.w2g-player-search').css("max-width","100%");
        $('.w2g-topbar-logo').css("width","70px");
        $('.w2g-topbar-logo').css("min-width","70px");
        $('.record').remove();
        $('.w2g-topbar-roominfo').css("margin-right","0em");
        $('.w2g-topbar-menu').css("margin-right","0em");
        $('.w2g-topbar-menu').css("min-width","3vw");
        $('.w2g-topbar-menu').css("max-width","3vw");

        $('.w2g-video-container').css("max-height","calc(100vh - 84px)");
        $('.w2g-video-container').css("height","calc(100vh - 84px)");
        $('.w2g-player-video').css("max-height","calc(100vh - 84px)");
        $('.w2g-player-video').css("height","calc(100vh - 84px)");

        $('.w2g-search-nomore').remove();
        $('.ui.cancel.button').click();
    }, 2000);
    setTimeout(function() { // remove this to disable auto reload page every 6 hours
        location.reload();
    }, 6*60*60*1000);
});