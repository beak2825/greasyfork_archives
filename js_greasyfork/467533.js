// ==UserScript==
// @name         RoyalRoad Exact Ratings Display
// @namespace    http://oberdiah.com/
// @version      1.0
// @description  Displays the exact RoyalRoad star rating for every story.
// @author       Oberdiah
// @match        https://www.royalroad.com/fictions/*
// @icon         https://www.royalroad.com/icons/favicon-32x32.png?v=20200125
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467533/RoyalRoad%20Exact%20Ratings%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/467533/RoyalRoad%20Exact%20Ratings%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var mainList = document.getElementById("result");
    for (var child of mainList.childNodes) {
        if (child.tagName === "DIV") {
            for (var childChild of child.childNodes) {
                if (childChild.tagName === "DIV") {
                    var rowStats = childChild.getElementsByClassName("row stats")[0];
                    var starsElement = rowStats.children[1];
                    var starsText = starsElement.getAttribute("aria-label");
                    starsText = starsText.substring(8);
                    starsText = starsText.substring(0, starsText.indexOf(" "));
                    var stars = parseFloat(starsText);
                    starsElement.innerHTML = starsElement.innerHTML + starsText;
                }
            }
        }
    }
})();