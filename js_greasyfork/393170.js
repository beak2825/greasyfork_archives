// ==UserScript==
// @author      Lokryushed
// @version     1.0
// @name        XVideosExpandedPlayer
// @description Expand Video player automatically
// @namespace   XVideosExpandedPlayer
// @date        2019-02-23
// @include     *xvideos.com*
// @run-at      document-start
// @grant       none
// @license     Public Domain
// @icon        https://www.xvideos.com/apple-touch-icon.png
// @downloadURL https://update.greasyfork.org/scripts/393170/XVideosExpandedPlayer.user.js
// @updateURL https://update.greasyfork.org/scripts/393170/XVideosExpandedPlayer.meta.js
// ==/UserScript==

/**
 * Run on page load
 */
window.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('#html5video video'); // References the HTML5 Video element

    /**
     * Initialize video pages containing valid video element
     */
    if (/^http[s]*:\/\/[www.]*xvideos\.com\/video/.test(window.location.href) && video) {
        /**
         * Auto-enable cinema mode if enabled
         */
        document.querySelector('.buttons-bar img[src*="icon-screen-expand"]').dispatchEvent(new MouseEvent('click'));
    }

});
