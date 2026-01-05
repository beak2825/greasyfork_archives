// ==UserScript==
// @name        Lone Pine Message Board Tweaks
// @namespace   http://lonepineclassical.com/colloquium/
// @description Wrangles Lone Pine Latin's emojii selector to be less unweildy
// @include     http://lonepineclassical.com/colloquium/posting.php*
// @version     0.0.1
// @grant       GM_addStyle
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/14130/Lone%20Pine%20Message%20Board%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/14130/Lone%20Pine%20Message%20Board%20Tweaks.meta.js
// ==/UserScript==

GM_addStyle([
'div#smiley-box {',
'  height: ' + window.getComputedStyle(document.getElementById("message-box"), null).getPropertyValue("height") + ';',
'  overflow: scroll;'
].join('\n'));