// ==UserScript==
// @name         WoD Hero Roster
// @namespace    https://www.wannaexpresso.com
// @version      0.1
// @description  One click hero switching.
// @author       DotIN13
// @include      http*://*.wannaexpresso.*/*
// @include      http*://*.world-of-dungeons.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407514/WoD%20Hero%20Roster.user.js
// @updateURL https://update.greasyfork.org/scripts/407514/WoD%20Hero%20Roster.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Build select from array of heroes
    function buildSelect(heroes) {
        var select = document.createElement("select");
        heroes.forEach(h => {
            select.innerHTML += "<option value='" + h.link + "' data-name='" + h.name + "'>" + h.name + "</option>";
        })
        return select;
    }

    function buildLinkArray(heroes) {
        var searchArgs = window.location.search.match(/[^\?&]*=[^\?&]*/g).filter(i => !i.match(/goto|session_hero_id/));
        var newSearch = "?" + searchArgs.join("&");
        var currentURL = window.location.pathname + newSearch;
        heroes.forEach((h, i) => {
            var reference = (i == heroes.length - 1 ? 0 : i + 1);
            h.link = currentURL + "&goto=prevactivehero&session_hero_id=" + heroes[reference].id;
        })
        return heroes;
    }

    /* Remove hero links
    document.getElementsByClassName("prevHeroLink")[0].remove();
    document.getElementsByClassName("nextHeroLink")[0].remove();*/

    var heroesBanner = document.getElementsByClassName("hero_short")[0];

    if (heroesBanner) {
        var heroesLink = heroesBanner.getElementsByClassName("changeHeroLink")[0];

        // Get hero list with XML request
        var XmlHttp = new XMLHttpRequest();
        XmlHttp.onreadystatechange = function() {
            if (XmlHttp.readyState == 4 && XmlHttp.status == 200) {
                var activeHeroes = [];
                var response = XmlHttp.responseText;
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(response,"text/html");
                var activeHeroesLink = xmlDoc.querySelectorAll(".content_table .hero_active");
                //console.log(activeHeroesLink);
                for (const el of activeHeroesLink) {
                    activeHeroes.push({name: el.innerText, id: el.closest(".content_table").firstElementChild.value});
                };
                //console.log(activeHeroes);

                // Add hero select
                var select = buildSelect(buildLinkArray(activeHeroes))
                heroesLink.parentNode.prepend(select);

                // Preselect current hero
                select.querySelector("option[data-name=" + heroesLink.innerHTML + "]").selected = true;

                // Open link on select change
                select.addEventListener("change", function(e) {
                    window.open(e.target.value, "_self");
                })
            };
        };
        XmlHttp.open("GET", heroesLink.href, true);
        XmlHttp.send();
    }
})();