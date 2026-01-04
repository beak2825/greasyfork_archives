// ==UserScript==
// @name        layerd_disabled
// @namespace   shjanken
// @include     http://blog.csdn.net/fengbingchun/article/details/51872436
// @version     1
// @grant       none
// @description:en display the ad
// @description display the ad
// @downloadURL https://update.greasyfork.org/scripts/30828/layerd_disabled.user.js
// @updateURL https://update.greasyfork.org/scripts/30828/layerd_disabled.meta.js
// ==/UserScript==

var layerd = document.getElementById('layerd');
if (layerd)
  layerd.style.visibility = 'hidden'