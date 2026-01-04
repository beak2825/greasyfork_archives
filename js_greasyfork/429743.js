// ==UserScript==
// @name         Revert User Headers
// @namespace    JunkiEDM/sc-userfix
// @version      0.1
// @description  No more "Popular Tracks by..." where the artist name should be!
// @author       JunkiEDM
// @match        https://soundcloud.com/*
// @icon         https://www.google.com/s2/favicons?domain=soundcloud.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429743/Revert%20User%20Headers.user.js
// @updateURL https://update.greasyfork.org/scripts/429743/Revert%20User%20Headers.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var oldHref = document.location.href;
    function repl(){
        document.getElementsByClassName("profileHeaderInfo__userName")[0].innerHTML = document.getElementsByClassName("profileHeaderInfo__userName")[0].innerHTML.replace(new RegExp("(?:Popular tracks by|Tracks by|Albums by|Playlists by|Reposts by) ","gm"), "");
    }
    window.onload = function (){
        repl();
    var
        bodyList = document.querySelector("body")
        ,observer = new MutationObserver(function(mutations) {
            mutations.forEach(function() {
                if (oldHref != document.location.href) {
                    oldHref = document.location.href;
                    repl();
                }
            });
        });
    var config = {
        childList: true,
        subtree: true
    };
    observer.observe(bodyList, config);
    }
})();