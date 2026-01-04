// ==UserScript==
// @name         GogoRandom
// @namespace    https://github.com/ArjixWasTaken/my-userscripts
// @version      0.5
// @description  A userscript that adds a random button to gogoanime, that one feature we all wanted years now but didn't get.
// @author       Arjix
// @license      MIT
// @include      /.+:\/\/.*?gogoanime\..+/
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/423703/GogoRandom.user.js
// @updateURL https://update.greasyfork.org/scripts/423703/GogoRandom.meta.js
// ==/UserScript==

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

(function() {
    'use strict';
    const link = "https://raw.githubusercontent.com/ArjixGamer/gogoanime-random/main/all_anime.json"
    const getRandomAnime = () => {
        GM_xmlhttpRequest({
            method: "GET",
            url: link,
            onload: function(res) {
                const ALL_ANIME = JSON.parse(res.response)
                const getDomainLink = () => {
                    return "https://" + document.location.href.match(/gogoanime[s]?\.[a-z]+/)?.[0]
                }
                const index = getRandomInt(1, ALL_ANIME.length-1)
                document.location.href = getDomainLink() + ALL_ANIME[index]
            }

    })}
    const button = `<li class="movies"><a title="Random Anime" href="#" class="random ads-evt">Random</a></li>`
    $("nav.menu_top > ul > li").last().after(button)
    document.querySelector("li.movies > a.random").onclick = getRandomAnime
})();
