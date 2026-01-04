// ==UserScript==
// @name        Starry background
// @namespace   Violentmonkey Scripts
// @match       https://www.free4talk.com/room/*
// @grant GM_addStyle
// @version     1.0
// @author      Azeez
// @description Change the free4talk room background
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492550/Starry%20background.user.js
// @updateURL https://update.greasyfork.org/scripts/492550/Starry%20background.meta.js
// ==/UserScript==


(function(){
  const imageURL = "https://i.imgur.com/zjRp8Yt.jpeg";
 GM_addStyle(`
    .ant-drawer-content,body{
      background: url(${imageURL}) 0% 0% / contain rgb(16, 24, 28) !important;
    }
`)
 })();