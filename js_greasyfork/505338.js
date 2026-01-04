// ==UserScript==
// @name         GogoRandom
// @namespace    https://github.com/ArjixWasTaken/my-userscripts
// @version      0.5
// @description  A userscript that adds a random button to gogoanime, that one feature we all wanted years now but didn't get.
// @author       Arjix
// @license      MIT
// @include      /.+:\/\/.*?gogoanime\..+/
// @include      /^https?:\/\/(w+.?\.)?gogoanime3\.co\//
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/505338/GogoRandom.user.js
// @updateURL https://update.greasyfork.org/scripts/505338/GogoRandom.meta.js
// ==/UserScript==

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

(function() {
    'use strict';
    const link = "https://raw.githubusercontent.com/ArjixGamer/gogoanime-random/main/all_anime.json";

    const getRandomAnime = () => {
        GM_xmlhttpRequest({
            method: "GET",
            url: link,
            onload: function(res) {
                try {
                    const ALL_ANIME = JSON.parse(res.responseText);
                    const getDomainLink = () => {
                        const domainMatch = document.location.host.match(/gogoanime[s]?\.[a-z]+/);
                        if (domainMatch) {
                            return "https://" + domainMatch[0];
                        } else {
                            console.error("Domain not matched or incorrect.");
                            return "";
                        }
                    };
                    const index = getRandomInt(0, ALL_ANIME.length - 1);
                    const newLocation = getDomainLink() + ALL_ANIME[index];
                    if (newLocation) {
                        document.location.href = newLocation;
                    }
                } catch (e) {
                    console.error("Error parsing JSON or redirecting:", e);
                }
            },
            onerror: function(e) {
                console.error("Error fetching anime list:", e);
            }
        });
    };

    const button = `<li class="movies"><a title="Random Anime" href="#" class="random ads-evt">Random</a></li>`;
    $("nav.menu_top > ul > li").last().after(button);

    document.querySelector("li.movies > a.random").addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default action for anchor
        getRandomAnime();
    });
})();
