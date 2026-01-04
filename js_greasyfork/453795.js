// ==UserScript==
// @name         Youtube Thumbnail Unfucker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script to unfuck the shitty rounded thumbnails introduced in the new downgrade
// @author       TB-303
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/453795/Youtube%20Thumbnail%20Unfucker.user.js
// @updateURL https://update.greasyfork.org/scripts/453795/Youtube%20Thumbnail%20Unfucker.meta.js
// ==/UserScript==

(function() {
    'use strict';


    GM_addStyle // Small
    (`ytd-thumbnail[size=small] a.ytd-thumbnail,ytd-thumbnail[size=small]:before {
    border-radius: 0px;
    }
   `);

    GM_addStyle // Medium
    (`ytd-thumbnail[size=medium] a.ytd-thumbnail,ytd-thumbnail[size=medium]:before {
    border-radius: 0px;
    }
   `);

    GM_addStyle // Large
    (`ytd-thumbnail[size=large] a.ytd-thumbnail,ytd-thumbnail[size=large]:before {
    border-radius: 0px;
    }
   `);

    GM_addStyle
    (`ytd-thumbnail[size=large] ytd-thumbnail-overlay-time-status-renderer.ytd-thumbnail,ytd-thumbnail[size=large] ytd-thumbnail-overlay-button-renderer.ytd-thumbnail {
    border-radius: 0px;
    }
   `);

    GM_addStyle
    (`ytd-thumbnail[size] ytd-thumbnail-overlay-time-status-renderer.ytd-thumbnail,ytd-thumbnail[size] ytd-thumbnail-overlay-button-renderer.ytd-thumbnail {
    border-radius: 0px;
}
   `);

    GM_addStyle
    (`ytd-thumbnail[size][has-clip] a.ytd-thumbnail,ytd-thumbnail[size][has-clip]:before {
    border-radius: 0px;
    }
   `);
})();