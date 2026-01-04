// ==UserScript==
// @name Youtube Remove Video Elements
// @description Remove stupid squares of information near the end of youtube videos (not annotations)
// @namespace Violentmonkey Scripts
// @match https://www.youtube.com/watch
// @grant MIT License
// @version 1
// @downloadURL https://update.greasyfork.org/scripts/391566/Youtube%20Remove%20Video%20Elements.user.js
// @updateURL https://update.greasyfork.org/scripts/391566/Youtube%20Remove%20Video%20Elements.meta.js
// ==/UserScript==
document.getElementsByClassName('ytp-ce-top-right-quad')[0].remove();
document.getElementsByClassName('ytp-ce-bottom-right-quad')[0].remove();
document.getElementsByClassName('ytp-ce-bottom-left-quad')[0].remove();
