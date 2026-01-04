// ==UserScript==
// @name         Hide Messenger Active Status
// @namespace    AAAAAAAA.com
// @version      1.1
// @description  I'm a mess
// @author       ducktrshessami
// @match        *://www.messenger.com/*
// @match        *://www.facebook.com/*
// @run-at       document-end
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/398429/Hide%20Messenger%20Active%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/398429/Hide%20Messenger%20Active%20Status.meta.js
// ==/UserScript==

(function() {
    function messenger() {
        $("[role='main'] > span > div > div > div > div:contains('Active '):first:visible").hide(); // Top middle
        $("[role='main'] .uiScrollableAreaContent div > div > div > div > div:contains('Active '):visible").hide(); // Top right
    }

    function facebook() {
        $(".uiScrollableAreaContent .fbChatOrderedList > div > div > ul > li[data-id] > a > div > div:visible").filter(function() {
            return $(this).css("float") == "right";
        }).hide();
    }

    var observe = new MutationObserver(location.hostname == "www.messenger.com" ? messenger : facebook)
    observe.observe(document.body, { // Wait for page change
        childList: true,
        subtree: true
    });
})();