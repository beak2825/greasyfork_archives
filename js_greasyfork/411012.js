// ==UserScript==
// @name               Collapsit
// @name:de            Collapsit
// @name:en            Collapsit
// @namespace          sun/userscripts
// @version            1.0.21
// @description        Enables collapsing (and expanding) of comments on Removeddit.
// @description:de     Ermöglicht das Ein- und Ausklappen von Kommentaren auf Removeddit.
// @description:en     Enables collapsing (and expanding) of comments on Removeddit.
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
// @include            *://*.removeddit.com/r/*/comments/*
// @match              *://*.removeddit.com/r/*/comments/*
// @run-at             document-end
// @inject-into        auto
// @grant              none
// @noframes
// @icon               https://forgejo.sny.sh/sun/userscripts/raw/branch/main/icons/Collapsit.ico
// @copyright          2020-present, Sunny (https://sny.sh/)
// @license            Hippocratic License; https://forgejo.sny.sh/sun/userscripts/src/branch/main/LICENSE.md
// @downloadURL https://update.greasyfork.org/scripts/411012/Collapsit.user.js
// @updateURL https://update.greasyfork.org/scripts/411012/Collapsit.meta.js
// ==/UserScript==

(() => {
  document.addEventListener("click", (event) => {
    if (event.target?.matches(".comment-head .author:not(.comment-author)")) {
      event.preventDefault();
      if (event.target.textContent === "[\u2013]") {
        for (const x of Array.from(
          event.target.parentNode.parentNode.children,
        ).slice(1))
          x.style.display = "none";
        event.target.textContent = "[+]";
      } else {
        for (const x of Array.from(
          event.target.parentNode.parentNode.children,
        ).slice(1))
          x.style.display = "";
        event.target.textContent = "[\u2013]";
      }
    }
  });
})();
