// ==UserScript==
// @name        Bypass wikifeet.com EU restriction
// @namespace   Violentmonkey Scripts
// @match       https://www.wikifeet.com/*
// @grant       none
// @version     1.1
// @author      feetfan
// @description 26/10/2024 10:39:14
// @license copyleft
// @downloadURL https://update.greasyfork.org/scripts/514122/Bypass%20wikifeetcom%20EU%20restriction.user.js
// @updateURL https://update.greasyfork.org/scripts/514122/Bypass%20wikifeetcom%20EU%20restriction.meta.js
// ==/UserScript==

document.querySelectorAll(".thumb").forEach((thumbnail) => {
  var thumbnail_style = window.getComputedStyle(thumbnail, false);
  var thumbnail_url = thumbnail_style.backgroundImage.slice(4, -1).replace(/"/g, "");
  var hq_image_url = thumbnail_url.replace("thumbs.wikifeet", "pics.wikifeet");
  var a = thumbnail.parentNode;
  a.href = hq_image_url;
});
