// ==UserScript==
// @name        Back to Bird Original Twitter Logo
// @namespace   https://greasyfork.org/kchamat
// @version     0.2.9
// @description         Enhance Twitter experience with the Original Logo
// @author      kchamat
// @icon        https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @match       https://twitter.com/*
// @match       https://mobile.twitter.com/*
// @license     AGPL-3.0-or-later
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/471719/Back%20to%20Bird%20Original%20Twitter%20Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/471719/Back%20to%20Bird%20Original%20Twitter%20Logo.meta.js
// ==/UserScript==

GM_addStyle(`
svg.r-8kz0gk g  {

   display:none;

 }`);
GM_addStyle(`

.r-64el8z {
  padding:0px;
  border-width:0px;
width: 64px;
      height:64px;
   background-image: url("https://pbs.twimg.com/media/F11ZlptWwAEvHUm?format=png&name=120x120");
}
 }`);