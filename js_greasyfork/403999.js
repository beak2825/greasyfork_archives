// ==UserScript==
// @name           Zive.cz / Mobilmania.cz / AutoRevue.cz - Join chapters of paged articles
// @name:cs        Zive.cz / Mobilmania.cz / AutoRevue.cz - Spojení kapitol stránkovaných článků
// @namespace      https://greasyfork.org/cs/users/571292-ron-jeremy
// @homepageURL    https://greasyfork.org/cs/scripts/403999
// @supportURL     https://greasyfork.org/cs/scripts/403999/feedback
// @version        0.1.3
// @description    For paged articles - displays all chapters at once without need of paging, and hides paging element.
// @description:cs Pro stránkované články - zobrazí všechny kapitoly najednou, a skryje stránkovací prvek.
// @author         Ron.Jeremy
// @grant          none
// @match        *://*.zive.cz/*
// @match        *://*.mobilmania.cz/*
// @match        *://*.autorevue.cz/*
// @downloadURL https://update.greasyfork.org/scripts/403999/Zivecz%20%20Mobilmaniacz%20%20AutoRevuecz%20-%20Join%20chapters%20of%20paged%20articles.user.js
// @updateURL https://update.greasyfork.org/scripts/403999/Zivecz%20%20Mobilmaniacz%20%20AutoRevuecz%20-%20Join%20chapters%20of%20paged%20articles.meta.js
// ==/UserScript==

$(document).ready(function() {
    'use strict';
    // Hide paging bar
    var elems = document.getElementsByClassName("body-part-switcher");
    var i;
    for (i = 0; i < elems.length; i++) {
        elems[i].style.display = "none";
    }
    // Hide continuation part numbers
    elems = document.getElementsByTagName("h3");
    var html;
    var findStr = "Pokračování ";
    for (i = 0; i < elems.length; i++) {
        html = elems[i].innerHTML;
        if (html.slice(0, findStr.length) == findStr) {
          elems[i].style.display = "none";
        }
    }
    // Unhide all chapters at once
    elems = document.getElementsByClassName("bodyPart");
    for (i = 0; i < elems.length; i++) {
        elems[i].style.display = "block";
    }
});