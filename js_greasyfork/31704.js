// ==UserScript==
// @name        Imgur remove key listener
// @namespace   xxx
// @description Removes the key shortcuts on imgur
// @include     *://imgur.com/*
// @version     1
// @grant       none
// @locale       en
// @downloadURL https://update.greasyfork.org/scripts/31704/Imgur%20remove%20key%20listener.user.js
// @updateURL https://update.greasyfork.org/scripts/31704/Imgur%20remove%20key%20listener.meta.js
// ==/UserScript==

$(document).unbind('keydown').unbind('keyup');