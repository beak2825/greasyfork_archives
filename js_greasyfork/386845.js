// ==UserScript==
// @name         Messenger Auto "See Group"
// @namespace    AAAAAAAA.com
// @version      1.0
// @description  The message box was getting annoying
// @author       ducktrshessami
// @match        *://www.messenger.com/*
// @match        *://www.facebook.com/*
// @run-at       document-end
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/386845/Messenger%20Auto%20%22See%20Group%22.user.js
// @updateURL https://update.greasyfork.org/scripts/386845/Messenger%20Auto%20%22See%20Group%22.meta.js
// ==/UserScript==

(function() {
    function thing() {
        var see = $(location.hostname == "www.messenger.com" ? "[aria-label='Dialog content'] button:contains('See Group'):visible:first" : "[aria-label='Dialog content'] a[role='button'][href]:contains('See Group'):visible:first");
        if (see.length) {
            see.get(0).click();
            console.log("Message box destroyed");
        }
    }

    var observer = new MutationObserver(thing);
    observer.observe(document.body, { // Wait for page change
        childList: true,
        subtree: true
    });
})();