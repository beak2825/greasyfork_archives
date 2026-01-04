// ==UserScript==
// @name        theme_title
// @namespace   1
// @include     http://www.eador.com/B2/viewtopic.php*
// @include     http://eador.com/B2/viewtopic.php*
// @version     1
// @grant       none
// @description Add normal titles
// @downloadURL https://update.greasyfork.org/scripts/33986/theme_title.user.js
// @updateURL https://update.greasyfork.org/scripts/33986/theme_title.meta.js
// ==/UserScript==

document.title = document.querySelector('h1 > a.nul').text;