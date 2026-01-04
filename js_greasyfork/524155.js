// ==UserScript==
// @name         Fix scrollbar on twitch.tv
// @name:ru      Исправление скроллбара на twitch.tv
// @namespace    https://github.com/Limekys
// @version      2025-01-18
// @description  Fix the silly 1 pixel on right of the scrollbar on twitch.tv
// @description:ru Исправление глупого 1 пустого пикселя справа от скроллбара на twitch.tv
// @author       Limekys
// @match        *://*.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524155/Fix%20scrollbar%20on%20twitchtv.user.js
// @updateURL https://update.greasyfork.org/scripts/524155/Fix%20scrollbar%20on%20twitchtv.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let is_fixed = false;

    function tryToFixScrollbar() {
        let _elms = document.getElementsByClassName("simplebar-scrollbar")
        let _arr = Array.from(_elms);
        _arr.forEach((element) => {
            element.style.right = "0px";
            is_fixed = true;
        });
    }

    // found simplebar-scrollbar
    // set parameter right: 0px;
    let interval = setInterval(() => {
        tryToFixScrollbar();
        console.log(" === test === test === test === test === test === test === test === test === test === test");
        if (is_fixed == true) {
            clearInterval(interval);
        }
    }
    , 500);
})();