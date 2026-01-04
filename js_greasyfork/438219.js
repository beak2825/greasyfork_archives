// ==UserScript==
// @name         itch.io "Open in App" Button
// @namespace    http://tampermonkey.net/
// @version      1.2.5
// @description  "Open in App" Button for itch.io
// @author       xadxtya
// @match        https://*.itch.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438219/itchio%20%22Open%20in%20App%22%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/438219/itchio%20%22Open%20in%20App%22%20Button.meta.js
// ==/UserScript==

(function() {
    "use strict";

    var $ = document.querySelectorAll.bind(document);
    var pathTag = document.querySelector("meta[name='itch:path']");
    if (!pathTag) {
        return;
    }

    var Row = $(".buy_row")[1] || $(".upload_list_widget")[0];
    if (Row) {
        var openButton = document.createElement("div");
        openButton.innerHTML =
        "<div class=\"upload\" style=\"padding-top: 1em\">" +
            "<a href=\"itchio://" + pathTag.content + "\" class=\"button\">" +
                "Open in App" +
            "</a>" +
        "</div>";

        Row.appendChild(openButton);
    }
})();