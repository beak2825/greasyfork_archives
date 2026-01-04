// ==UserScript==
// @name         Aternos SkipClick
// @namespace    http://cdn.playingallday383.pages.dev/plugins/aternos.js
// @version      1.0.2a
// @description  Make aternos's stupid adblock thing auto click the skip button.
// @author       Notplayingallday383
// @match        https://aternos.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aternos.org
// @license      AGPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497319/Aternos%20SkipClick.user.js
// @updateURL https://update.greasyfork.org/scripts/497319/Aternos%20SkipClick.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function () {
        const btn = document.querySelector('.btn.btn-white.VaVTvFhvRoIo')
        btn.click()
    }, 1000);
})();