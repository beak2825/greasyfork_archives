// ==UserScript==
// @name         ^V for SauceNAO
// @description  Adds ^V handler for SauceNAO
// @version      0.2
// @author       LuK1337
// @match        *://saucenao.com
// @grant        none
// @namespace    https://greasyfork.org/users/721956
// @downloadURL https://update.greasyfork.org/scripts/419314/%5EV%20for%20SauceNAO.user.js
// @updateURL https://update.greasyfork.org/scripts/419314/%5EV%20for%20SauceNAO.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.onpaste = function(event) {
        let clipboardData = event.clipboardData || event.originalEvent.clipboardData;

        if (clipboardData.items.length == 1 && clipboardData.items[0].kind === "file") {
            document.getElementById("fileInput").files = clipboardData.files;
            document.getElementsByTagName("form")[0].submit();
        }
    }
})();