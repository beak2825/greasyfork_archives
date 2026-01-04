// ==UserScript==
// @name Wattpad++
// @namespace http://tampermonkey.net/
// @description Removes the media container,suggsted stories and comment for faster loading and more efficient way to read story from wattpad
// @include https://www.wattpad.com
// @version 0.1.0
// @downloadURL https://update.greasyfork.org/scripts/372283/Wattpad%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/372283/Wattpad%2B%2B.meta.js
// ==/UserScript==

document.getElementsByClassName('media-wrapper,part-recommendations-container')[0].remove()
var elem = document.getElementById("comment-container");
elem.parentNode.removeChild(elem);