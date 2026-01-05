// ==UserScript==
// @name         itch.io "Open in app" button
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  "Open in app" button for itch.io
// @author       Amos Wenger
// @match        https://*.itch.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/19960/itchio%20%22Open%20in%20app%22%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/19960/itchio%20%22Open%20in%20app%22%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var pathTag = document.querySelector("meta[name='itch:path']");
    if (!pathTag) {
        return;
    }

    var leftCol = document.querySelector(".left_col");
    if (leftCol) {
        var gameButton = document.createElement("div");
        gameButton.innerHTML = "<div class=\"uploads has_buttons\">" +
            "<h2>Open in app</h2>" +
            "<div class=\"upload\">" +
              "<a href=\"itchio://" + pathTag.content + "\" class=\"button\">" +
                "Open in app" +
              "</a>" +
              "<span style=\"padding: 0 .5em;\">or</span>" +
              "<a class=\"button\" href=\"https://itch.io/app\">" +
                "<span class=\"icon icon-download\"></span> Download the itch app" +
              "</a>" +
            "</div>" +
          "</div>";
        leftCol.insertBefore(gameButton, leftCol.querySelector(".uploads"));
        return;
    }

    var userLinks = document.querySelector(".profile_column .user_links");
    if (userLinks) {
        var userButton = document.createElement("div");
        userButton.innerHTML = "<div class=\"user_website\"><a href=\"itchio://" + pathTag.content + "\">Open in app</a></div>";
        userLinks.appendChild(userButton);
        return;
    }
})();