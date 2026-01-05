// ==UserScript==
// @name        HTML5 player for Metacritic
// @namespace   https://greasyfork.org/users/4813-swyter
// @description Avoid having to use Flash Player to watch videos. No ads.
// @match       http://www.metacritic.com/*
// @version     2015.11.19
// @noframes
// @icon        https://i.imgur.com/CecLLKu.png
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/14010/HTML5%20player%20for%20Metacritic.user.js
// @updateURL https://update.greasyfork.org/scripts/14010/HTML5%20player%20for%20Metacritic.meta.js
// ==/UserScript==

/* wait until the page is ready for the code snipped to run */
document.addEventListener('DOMContentLoaded', function()
{
  window.MetaC = window.MetaC || {};
  window.MetaC.CANPlayer = window.MetaC.CANPlayer || {};

  /* override the flash video function and call it a day */
  Object.defineProperty(window.MetaC.CANPlayer, 'initPlayer',
  {
    configurable: false,
    writable: false,
    value: function(elem, width, height, options)
    {
      console.info("check overriden! video arguments =>", arguments);

      v = document.createElement("video");

      v.width = width;
      v.height = height;
      v.src = options[0].assetURL;

      v.poster = options[0].prevImg;
      v.controls = 'true';

      /* replace the old SWF Flash object with it, voilà */
      elem = document.getElementById(elem);
      elem.parentNode.replaceChild(v, elem);

      console.log("video replaced =>", v, elem);
    }
  });
});