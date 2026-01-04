// ==UserScript==
// @name        BitChute Auto Uncensor
// @namespace   http://bitch.oot
// @description Automatically click through "Some videos are not shown due to your current sensitivity settings, click here to show them."
// @include     https://www.bitchute.com/channel/*/
// @include     https://bitchute.com/channel/*/
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/396867/BitChute%20Auto%20Uncensor.user.js
// @updateURL https://update.greasyfork.org/scripts/396867/BitChute%20Auto%20Uncensor.meta.js
// ==/UserScript==

var wclh = window.content.location.href;
if (wclh.match(/channel\/\w+\//)) {
  var redsg = wclh+"?showall=1";
  window.content.location.replace(redsg);
}
