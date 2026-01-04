// ==UserScript==
// @name        BC: fixed/sticky player
// @namespace   userscript1
// @match       https://*.bandcamp.com/album/*
// @match       https://*.bandcamp.com/music/*
// @match       https://*.bandcamp.com/track/*
// @grant       GM_addStyle
// @run-at      document-start
// @version     0.1.4
// @author      -
// @description keeps player visible when scrolling. choose a style in the code
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/512740/BC%3A%20fixedsticky%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/512740/BC%3A%20fixedsticky%20player.meta.js
// ==/UserScript==

(function() {
  'use strict';


  // sticky, follows when scrolling
  const style1 = `.inline_player {
                    position: sticky !important;
                    top: 50px;
                    background: white;
                    box-shadow: 3px 3px 10px rgb(0 0 0 / 0.5);
                    z-index: 999;
                  } `;

  // fixed at bottom
  const style2 = `.inline_player {
                    position: fixed !important;
                    bottom: 5px;
                    background: white;
                    box-shadow: 3px 3px 10px rgb(0 0 0 / 0.5);
                    z-index: 999;
                 } `;

  // fixed at top
  const style3 = `.inline_player {
                    position: fixed !important;
                    top: 25px;
                    background: white;
                    box-shadow: 3px 3px 10px rgb(0 0 0 / 0.5);
                    z-index: 999;
                 } `;


  GM_addStyle( style3 );


})();