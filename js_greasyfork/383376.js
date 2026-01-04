// ==UserScript==
// @name            Filmozer Next-Previous Feature
// @name:pl         Przyciski „Poprzedni” oraz „Następny” dla strony Filmozer.pl
// @namespace       http://tampermonkey.net/
// @version         0.1.2
// @description     Script adds "next" and "previous" buttons to the page.
// @description:pl  Skrypt dodaje na stronie przyciski "następny" i "poprzedni".
// @author          DaveIT
// @match           https://filmozer.pl/player/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/383376/Filmozer%20Next-Previous%20Feature.user.js
// @updateURL https://update.greasyfork.org/scripts/383376/Filmozer%20Next-Previous%20Feature.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var titles = ["The 100", "Gra o tron", "The umbrella academy", "13 powodow", "The walking dead", "Arrow", "Templariusze", "Agenci NCIS", "American Horror Story", "Belfer"];
    var links = ["the_100", "gra_o_tron", "the_umbrella_academy", "13_powodow", "the_walking_dead", "arrow", "templariusze", "agenci_ncis", "american_horror_story", "belfer"];

    // Getting an address of the current page and splitting it by words.
    var url = window.location.href;
    var tokens = url.split("/");

    // Getting a number of the current episode.
    var n = Number(tokens.pop(-1));

    // Creating links to the previous and next episode.
    var prev = tokens.join("/") + "/" + String(n - 1);
    var next = tokens.join("/") + "/" + String(n + 1);

    // Getting a text from above the video player.
    var el = document.getElementsByTagName("h4")[0];
    var text = el.innerHTML;

    // Adding buttons to the received text.
    text += "<br/><a style=\"padding: 0\" href=\"" + prev + "\"><< Poprzedni</a> <a style=\"padding: 0\" href=\"" + next + "\">Następny >></a>";

    // Replacing a title of the current series with a link to the page of seasons.
    for(var i = 0; i < titles.length; i++) {
        text = text.replace(titles[i], "<a style=\"padding: 0\" href=\"https://filmozer.pl/serial/" + links[i] + "\">" + titles[i] + "</a>");
    }

    // Changing the page content.
    el.innerHTML = text;
})();