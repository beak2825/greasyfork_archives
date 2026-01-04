// ==UserScript==
// @name        Button Remover
// @namespace   http://tampermonkey.net/
// @version     1.3
// @description Removes the "Explore Premium" and "Install App" buttons from Spotify web player.
// @author      InariOkami
// @icon        https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @match       https://open.spotify.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/502648/Button%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/502648/Button%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElements(selector) {
        let elements = document.querySelectorAll(selector);
        elements.forEach(el => el.remove());
    }

    removeElements('.ButtonInner-sc-14ud5tc-0.gDlqhe.encore-over-media-set');
    removeElements('.ButtonInner-sc-14ud5tc-0.fcsOIN.encore-inverted-light-set.Upqw01TOXETOmR5Td7Dj');
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(() => {
            removeElements('.ButtonInner-sc-14ud5tc-0.gDlqhe.encore-over-media-set');  // Install App button
            removeElements('.ButtonInner-sc-14ud5tc-0.fcsOIN.encore-inverted-light-set.Upqw01TOXETOmR5Td7Dj');
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();