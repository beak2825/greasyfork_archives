// ==UserScript==
// @name         Test for YouTube
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://tampermonkey.net/index.php?version=4.5&ext=dhdg&updated=true
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @include     *://m.youtube.com/*
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/40533/Test%20for%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/40533/Test%20for%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    new MutationObserver(function () {
        var checkButton = $("#koya_elem_0_9 > div > div.lr");
        if (checkButton !== null) {
            $("#koya_elem_0_9 > div > div.lr").remove();
        }
    }).observe(document.body, {
        childList: true,
        subtree: true
    });

})();