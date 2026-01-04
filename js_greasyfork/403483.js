// ==UserScript==
// @name        Imgur Album NSFW Bypass
// @namespace   Violentmonkey Scripts
// @version     1.2
// @homepage    https://greasyfork.org/en/scripts/403483-imgur-album-nsfw-bypass
// @description This script will automatically bypass Imgur Album NSFW pages
// @include     https://imgur.com/a/*
// @include     https://www.imgur.com/a/*
// @author      P35 at SpeakJS discord - https://discord.gg/dAF4F28
// @description Original script by Aar318 rewritten by P35 - 5/16/2020, 12:47:17 PM
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/403483/Imgur%20Album%20NSFW%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/403483/Imgur%20Album%20NSFW%20Bypass.meta.js
// ==/UserScript==

  // Redirect user to imgur page bypassing NSFW warning //

(function () {
"use strict";

const { pathname, origin } = window.location;
  console.log("Imgur Album Redirection");
  
if (!pathname.includes("/embed"))
  window.location.href = `${origin}${pathname}${
    pathname.endsWith("/")
      ? ""
      : "/"
  }embed?pub=true`;
  console.log("Redirected to bypass warning");
})();