// ==UserScript==
// @name        Imgur remove share buttons
// @description Removes the share box
// @namespace   http://userscripts.org/users/scuzzball/scripts
// @include     http*://imgur.com/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4380/Imgur%20remove%20share%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/4380/Imgur%20remove%20share%20buttons.meta.js
// ==/UserScript==

var toRemove = document.getElementsByClassName("fixed-share-container")[0];
toRemove.parentElement.removeChild(toRemove);