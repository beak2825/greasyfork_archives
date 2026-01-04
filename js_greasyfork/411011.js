// ==UserScript==
// @name               BandcampTrackCover
// @name:de            BandcampTrackCover
// @name:en            BandcampTrackCover
// @namespace          sun/userscripts
// @version            1.0.23
// @description        Forces showing track instead of album covers on Bandcamp.
// @description:de     Ersetzt gegebenenfalls Album- mit Trackcovern auf Bandcamp.
// @description:en     Forces showing track instead of album covers on Bandcamp.
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
// @include            https://*.bandcamp.com/*
// @match              https://*.bandcamp.com/*
// @run-at             document-end
// @inject-into        auto
// @grant              GM.xmlHttpRequest
// @grant              GM_xmlhttpRequest
// @noframes
// @require            https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon               https://forgejo.sny.sh/sun/userscripts/raw/branch/main/icons/BandcampTrackCover.png
// @copyright          2019-present, Sunny (https://sny.sh/)
// @license            Hippocratic License; https://forgejo.sny.sh/sun/userscripts/src/branch/main/LICENSE.md
// @downloadURL https://update.greasyfork.org/scripts/411011/BandcampTrackCover.user.js
// @updateURL https://update.greasyfork.org/scripts/411011/BandcampTrackCover.meta.js
// ==/UserScript==

(() => {
  const observer = new MutationObserver(() => {
    GM.xmlHttpRequest({
      url: document
        .querySelector(".title_link.primaryText")
        .getAttribute("href"),
      onload: (response) => {
        const result = document.createElement("html");
        result.innerHTML = response.responseText;

        document
          .querySelector("#tralbumArt a")
          .setAttribute(
            "href",
            result.querySelector("#tralbumArt a").getAttribute("href"),
          );
        document
          .querySelector("#tralbumArt a img")
          .setAttribute(
            "src",
            result.querySelector("#tralbumArt a img").getAttribute("src"),
          );
      },
    });
  });

  observer.observe(document.getElementsByClassName("play_cell")[0], {
    attributes: true,
    childList: true,
    subtree: true,
  });
})();
