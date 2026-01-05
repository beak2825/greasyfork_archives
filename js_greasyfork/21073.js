// ==UserScript==
// @name        Replace the Viglink ad link redirector in Proboards
// @description Make the links crystal clear, without referrer crap.
// @author      Swyter
// @namespace   https://greasyfork.org/users/4813-swyter
// @license     Unlicense
// @match       *://*.proboards.com/*
// @match       *://*.boards.net/*
// @match       *://*.freeforums.net/*
// @version     2023.01.27.1
// @grant       none
// @run-at      document-start
// @icon        https://storage.proboards.com/homepage/images/hotlink/proboards_blue_36x36.png
// @downloadURL https://update.greasyfork.org/scripts/21073/Replace%20the%20Viglink%20ad%20link%20redirector%20in%20Proboards.user.js
// @updateURL https://update.greasyfork.org/scripts/21073/Replace%20the%20Viglink%20ad%20link%20redirector%20in%20Proboards.meta.js
// ==/UserScript==

window.addEventListener('DOMContentLoaded', function(e)
{
  /* swy: their wrapper script skips links that have a .norewrite HTML class; add it to everyone */
  for (var elem of document.querySelectorAll(`a:not(.norewrite)`))
  {
      elem.classList.add("norewrite");
      console.info(`[/] swy: protecting link against viglink: `, elem);
  }

  console.info(`[/] swy: done`);
});