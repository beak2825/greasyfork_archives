// ==UserScript==
// @name         Focus Comment Box
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlight the comment box
// @author       Alex Kwon
// @match        https://www.facebook.com/groups/gmymu/permalink/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.4.6/mousetrap.min.js
// @downloadURL https://update.greasyfork.org/scripts/420779/Focus%20Comment%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/420779/Focus%20Comment%20Box.meta.js
// ==/UserScript==

(function() {

    Mousetrap.bind('f4', async function() {
        const mybox = document.querySelector('[role="textbox"]');
        mybox.focus();
    });
})();