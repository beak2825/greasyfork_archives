// ==UserScript==
// @name        Twitteando con Yuyito
// @namespace   https://greasyfork.org/kchamat
// @version     0.2.10
// @description         Enhance Twitter experience with the wonderfull Yuyito Gonzalez
// @author      kchamat
// @icon        https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @match       https://twitter.com/*
// @match       https://mobile.twitter.com/*
// @license     AGPL-3.0-or-later
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/471720/Twitteando%20con%20Yuyito.user.js
// @updateURL https://update.greasyfork.org/scripts/471720/Twitteando%20con%20Yuyito.meta.js
// ==/UserScript==

GM_addStyle(`
svg.r-8kz0gk g  {

   display:none;

 }`);
GM_addStyle(`

.r-64el8z {
  padding:0px;
  border-width:0px;
width: 120px;
      height:120px;
   background-image: url("https://pbs.twimg.com/media/F16ArsgWYBY9IlL?format=png&name=120x120");
}
 }`);