// ==UserScript==
// @name         RoyalRoad HotKeys
// @namespace    https://tagnumelite.com/
// @version      1.0.0
// @description  Add hotkeys to RoyalRoad
// @author       TagnumElite
// @match        https://www.royalroad.com/*/chapter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373923/RoyalRoad%20HotKeys.user.js
// @updateURL https://update.greasyfork.org/scripts/373923/RoyalRoad%20HotKeys.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var prev_link, next_link;

    var btn_links = document.querySelectorAll("a.btn.btn-primary");
    var i;

    for (i = 0; i < btn_links.length; i++) {
        if (btn_links[i].innerText === "Previous Chapter") {
            prev_link = btn_links[i];
        }

        if (btn_links[i].innerText === "Next Chapter") {
            next_link = btn_links[i];
        }
    }

    document.onkeydown = function (e) {
        e = e || window.event;
        switch(e.keyCode){
            case 37:
                prev_link.click();
                break;
            case 39:
                next_link.click();
                break;
            default:
                break;
        }
    }
})();