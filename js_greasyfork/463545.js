// ==UserScript==
// @name        Twitter Logo on Blue
// @namespace   https://greasyfork.org/kchamat
// @version     0.2.5
// @description         Enhance Twitter user experience. Change Twitter Logo to blue color.
// @author      kchamat
// @icon        https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @match       https://twitter.com/*
// @match       https://mobile.twitter.com/*
// @license     AGPL-3.0-or-later
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/463545/Twitter%20Logo%20on%20Blue.user.js
// @updateURL https://update.greasyfork.org/scripts/463545/Twitter%20Logo%20on%20Blue.meta.js
// ==/UserScript==

GM_addStyle(`
svg.r-13v1u17 g path {
   color: rgb(29, 155, 240);
   display: block;
}
`);

(function () {
    'use strict';

    }
)();