// ==UserScript==
// @name         Trello Colors
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows for more color options on Trello labels.
// @author       SimplexShotz
// @match        https://trello.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416394/Trello%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/416394/Trello%20Colors.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        var labels = document.querySelectorAll(".card-label[title*='#']");
        for (var i = 0, len = labels.length, color; i < len; i++) {
            if (labels[i].title.indexOf(":") > 0) {
                color = labels[i].title.split(":")[0];
                labels[i].style.backgroundColor = color;
                labels[i].title = labels[i].title.substring(color.length + 1);
                if (labels[i].innerText != "") {
                    labels[i].innerText = labels[i].innerText.substring(color.length + 1);
                }
            }
        }
    }, 0);
})();