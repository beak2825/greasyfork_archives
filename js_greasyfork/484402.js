// ==UserScript==
// @name         Replace YouTube Logo
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Replaces the YouTube logo with a cute Cinnamoroll logo.
// @author       Zachary Kosove
// @match        *://www.youtube.com/*
// @icon         https://pbs.twimg.com/ext_tw_video_thumb/1732743347775868928/pu/img/Y6uLkpaeb8e7_9vD.jpg
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/484402/Replace%20YouTube%20Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/484402/Replace%20YouTube%20Logo.meta.js
// ==/UserScript==

GM_addStyle(`
  #logo-icon {
    content: url("https://i.pinimg.com/originals/26/76/1b/26761bb6052727e18ddf0022bf45d7e6.gif") !important;
    width: 85px;
    height: 50px;
    object-fit: cover;
  }

  ytd-topbar-logo-renderer {
    width: 0%;
  }
`);