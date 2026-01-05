// ==UserScript==
// @name        Auto Reload
// @namespace   L8RPKaiko
// @description Reload pages every X minutes
// @include     http://lang-8.com/
// @grant       none
// @version 0.0.1.20161111101957
// @downloadURL https://update.greasyfork.org/scripts/24726/Auto%20Reload.user.js
// @updateURL https://update.greasyfork.org/scripts/24726/Auto%20Reload.meta.js
// ==/UserScript==

var numMinutes = 15;
setTimeout(function(){window.location.reload(1);}, numMinutes*60*1000);