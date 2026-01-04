// ==UserScript==
// @name        CGUnchat
// @namespace   BlaiseEbuth
// @match       https://www.codingame.com/*
// @grant       none
// @version     1.1
// @author      BlaiseEbuth
// @description Hide the CodinGame web-chat.
// @icon https://i.imgur.com/E39sADi.png
// @downloadURL https://update.greasyfork.org/scripts/409838/CGUnchat.user.js
// @updateURL https://update.greasyfork.org/scripts/409838/CGUnchat.meta.js
// ==/UserScript==

'use strict';

var hide = function()
{
  document.getElementsByClassName("chat-wrapper")[0].style.cssText = "display:none !important";
}

setInterval(hide, 1000);