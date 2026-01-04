// ==UserScript==
// @name               ReturnInvidiousDislike
// @name:de            ReturnInvidiousDislike
// @name:en            ReturnInvidiousDislike
// @namespace          sun/userscripts
// @version            1.2.10
// @description        Displays the dislike count of videos accessed via Invidious.
// @description:de     Zeigt die Dislike-Anzahl von Videos auf Invidious an.
// @description:en     Displays the dislike count of videos accessed via Invidious.
// @compatible         chrome
// @compatible         edge
// @compatible         firefox
// @compatible         opera
// @compatible         safari
// @homepageURL        https://forgejo.sny.sh/sun/userscripts
// @supportURL         https://forgejo.sny.sh/sun/userscripts/issues
// @contributionURL    https://liberapay.com/sun
// @contributionAmount €1.00
// @author             Sunny <sunny@sny.sh>
// @include            *://*/watch?v=*
// @match              *://*/watch?v=*
// @connect            returnyoutubedislikeapi.com
// @run-at             document-end
// @inject-into        auto
// @grant              GM.xmlHttpRequest
// @grant              GM_xmlhttpRequest
// @noframes
// @require            https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon               https://forgejo.sny.sh/sun/userscripts/raw/branch/main/icons/ReturnInvidiousDislike.png
// @copyright          2021-present, Sunny (https://sny.sh/)
// @license            Hippocratic License; https://forgejo.sny.sh/sun/userscripts/src/branch/main/LICENSE.md
// @downloadURL https://update.greasyfork.org/scripts/436254/ReturnInvidiousDislike.user.js
// @updateURL https://update.greasyfork.org/scripts/436254/ReturnInvidiousDislike.meta.js
// ==/UserScript==

(() => {
  const video = new URLSearchParams(window.location.search).get("v");
  const views = document.getElementById("views")?.childNodes[1];
  const likes = document.getElementById("likes")?.childNodes[1];
  const dislikes = document.getElementById("dislikes")?.childNodes[1];
  const rating = document.getElementById("rating");

  if (video && views && likes && rating) {
    GM.xmlHttpRequest({
      url: `https://returnyoutubedislikeapi.com/votes?videoId=${video}`,
      onload: (response) => {
        const data = JSON.parse(response.responseText);

        views.textContent = ` ${data.viewCount.toLocaleString()}`;
        likes.textContent = ` ${data.likes.toLocaleString()}`;
        rating.textContent = `Rating: ${data.rating.toFixed(4)} / 5`;

        if (dislikes) {
          dislikes.textContent = ` ${data.dislikes.toLocaleString()}`;
        } else {
          const clone = likes.parentElement.cloneNode(true);
          const icon = clone.getElementsByClassName("icon")[0];
          const text = clone.childNodes[1];

          icon.classList.replace("ion-ios-thumbs-up", "ion-ios-thumbs-down");
          text.textContent = ` ${data.dislikes.toLocaleString()}`;
          likes.parentElement.insertAdjacentElement("afterend", clone);
        }
      },
    });
  }
})();
