// ==UserScript==
// @name        Mine Defense stylesheet fix
// @namespace   MineDefense
// @match       https://scholtek.com/minedefense*
// @grant       none
// @version     2024-10-25
// @author      subanark
// @description Fixes the insecure link to the stylesheet, courtesy of https://redd.it/1gc283b
// @icon        https://www.google.com/s2/favicons?sz=64&domain=scholtek.com

// @downloadURL https://update.greasyfork.org/scripts/541830/Mine%20Defense%20stylesheet%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/541830/Mine%20Defense%20stylesheet%20fix.meta.js
// ==/UserScript==

(function() {
'use strict';
document.querySelectorAll("head link[href^=http\\:]").forEach(function(link) {
link.href = link.href.replace("http:", "https:");
});
})();