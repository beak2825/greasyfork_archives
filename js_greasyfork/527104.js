// ==UserScript==
// @name        center reddit
// @namespace   Violentmonkey Scripts
// @match       *://old.reddit.com/*
// @grant       none
// @version     1.0
// @author      harvastum
// @description 3/20/2024, 10:30:43 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527104/center%20reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/527104/center%20reddit.meta.js
// ==/UserScript==



window.onload= function () {

  // remove custom css
  'use strict';
  $('link[rel=stylesheet][title="applied_subreddit_stylesheet"]').remove()

  var styles = document.createElement("style");
  styles.innerHTML = `.linklisting, .commentarea {max-width: 800px;          margin-left: auto;          margin-right: auto;        }      `;
  document.body.appendChild(styles);
  var taglines = document.getElementsByClassName("tagline");
  for (var i = 0; i < taglines.length; i++) {
    var tagline = taglines[i];
    tagline.setAttribute("onclick", "return togglecomment(this)");
  }
};
