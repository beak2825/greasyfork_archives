// ==UserScript==
// @name           GoComics open image directly
// @namespace      https://github.com/AbdurazaaqMohammed
// @version        1.0
// @author         Abdurazaaq Mohammed
// @description    Adds button to open image directly on GoComics comic pages
// @match          https://www.gocomics.com/*
// @homepage       https://github.com/AbdurazaaqMohammed/userscripts
// @supportURL     https://github.com/AbdurazaaqMohammed/userscripts/issues
// @license        The Unlicense
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/520187/GoComics%20open%20image%20directly.user.js
// @updateURL https://update.greasyfork.org/scripts/520187/GoComics%20open%20image%20directly.meta.js
// ==/UserScript==
(function() {
  'use strict';

  document.querySelector(".gc-calendar-nav").insertAdjacentHTML('beforebegin', `<a style = "margin-top: 10px;" class = "btn btn-outline-primary gc-button" href = "` + document.querySelector('.item-comic-image img').src +`">Open Image Directly</a>`);
  /*
  If you want the image to open in new tab just add the following:
    target = "_blank"
  After "<a " (Make sure you space properly)
  */
})();