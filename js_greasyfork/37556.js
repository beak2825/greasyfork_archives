// ==UserScript==
// @name         MyAnimeList Seasonal Anime Hide Dropped.
// @namespace    https://greasyfork.org/en/users/96096-purple-pinapples
// @version      0.1.3
// @description  Hides Dropped Shows on the Seasonal Page
// @author       PurplePinapples
// @license      WTFPL
// @run-at       document-end
// @include      https://myanimelist.net/anime/season*
// @downloadURL https://update.greasyfork.org/scripts/37556/MyAnimeList%20Seasonal%20Anime%20Hide%20Dropped.user.js
// @updateURL https://update.greasyfork.org/scripts/37556/MyAnimeList%20Seasonal%20Anime%20Hide%20Dropped.meta.js
// ==/UserScript==

(() => {
    "use strict";
    // hmm -- since the new update just removing the class doesnt work -- need to do this manually
    document.querySelectorAll(".seasonal-anime").forEach((anime_card) => {
      if(anime_card.querySelector(".btn-anime-watch-status.dropped")) {
        // settings this to None doesnt even work, it resets after a few seconds
        // anime_card.style.display = "none";
        // think removing it is the easiest thing to do -- user'll have to toggle with their userscript runner if they want to view dropped
        anime_card.outerHTML = '';
      }
    });
})();
