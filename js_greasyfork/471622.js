// ==UserScript==
// @name        HIdden Twitter Logo
// @namespace   https://greasyfork.org/kchamat
// @version     0.2.5
// @description         Enhance Twitter user experience. HIde Twitter Logo
// @author      kchamat
// @icon        https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @match       https://twitter.com/*
// @match       https://mobile.twitter.com/*
// @license     AGPL-3.0-or-later
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/471622/HIdden%20Twitter%20Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/471622/HIdden%20Twitter%20Logo.meta.js
// ==/UserScript==

GM_addStyle(`
svg.r-13v1u17 g path {
   color: rgb(29, 155, 240);
   display: none;
}
`);