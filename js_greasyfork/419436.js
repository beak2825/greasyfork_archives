// ==UserScript==
// @name        AniList - Search Title on AnimeBytes
// @namespace   https://greasyfork.org/en/users/96096-purplepinapples
// @match       https://anilist.co/*
// @grant       none
// @run-at      document-end
// @version     1.2
// @author      purplepinapples
// @description adds a button on AniList anime pages to search AnimeBytes for the title
// @downloadURL https://update.greasyfork.org/scripts/419436/AniList%20-%20Search%20Title%20on%20AnimeBytes.user.js
// @updateURL https://update.greasyfork.org/scripts/419436/AniList%20-%20Search%20Title%20on%20AnimeBytes.meta.js
// ==/UserScript==

(function () {

  function createSearchButton() {
    const navEl = document.querySelector(".content div.nav");
    if (navEl) {
      const lastChild = navEl.children[navEl.children.length - 1];
      const cloned = lastChild.cloneNode(true);
      cloned.innerText = "Search on AB";
      cloned.href = "#";
      cloned.addEventListener("click", function (e) {
        const seriesName = document.querySelector("h1").innerText;
        const targetUrl =
          "https://animebytes.tv/torrents.php?searchstr=" +
          encodeURIComponent(seriesName);
        e.preventDefault();
        window.open(targetUrl, "_blank"); // new tab
      });
      cloned.href = navEl.appendChild(cloned);
    } else {
      // check every 500ms if the page has loaded, so we can add the button
      setTimeout(() => createSearchButton(), 500);
    }
  }

  createSearchButton();
})();