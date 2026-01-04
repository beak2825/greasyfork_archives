// ==UserScript==
// @name               RuffleInjector
// @name:de            RuffleInjector
// @name:en            RuffleInjector
// @namespace          sun/userscripts
// @version            1.0.13
// @description        Automatically inject the latest version of Ruffle into any webpage.
// @description:de     Bindet die neueste Ruffle-Version automatisch in jede Webseite ein.
// @description:en     Automatically inject the latest version of Ruffle into any webpage.
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
// @include            *://*/*
// @exclude            *://www.ebay.com/*
// @exclude            *://trakt.tv/*
// @match              *://*/*
// @run-at             document-end
// @inject-into        auto
// @grant              none
// @noframes
// @require            https://unpkg.com/@ruffle-rs/ruffle
// @icon               https://forgejo.sny.sh/sun/userscripts/raw/branch/main/icons/RuffleInjector.png
// @copyright          2022-present, Sunny (https://sny.sh/)
// @license            Hippocratic License; https://forgejo.sny.sh/sun/userscripts/src/branch/main/LICENSE.md
// @downloadURL https://update.greasyfork.org/scripts/445765/RuffleInjector.user.js
// @updateURL https://update.greasyfork.org/scripts/445765/RuffleInjector.meta.js
// ==/UserScript==

(() => {
  window.RufflePlayer.config = {
    publicPath: "https://unpkg.com/@ruffle-rs/ruffle",
  };
})();
