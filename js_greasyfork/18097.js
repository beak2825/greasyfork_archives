// ==UserScript==
// @name        Netflix Disable Billboard Video
// @description Removes the background video trailers that sometimes appear on Netflix.
// @namespace   aninhumer
// @include     https://www.netflix.com/browse
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18097/Netflix%20Disable%20Billboard%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/18097/Netflix%20Disable%20Billboard%20Video.meta.js
// ==/UserScript==

var billboard = document.getElementsByClassName('billboard-motion')[0];

billboard.parentNode.removeChild(billboard);