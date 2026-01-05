// ==UserScript==
// @namespace     http://javascript.about.com
// @author        Stephen Chapman
// @name          Exit Block Blocker
// @description   Blocks onbeforeunload
// @include       *
// @version 0.0.1.20161108220241
// @downloadURL https://update.greasyfork.org/scripts/24670/Exit%20Block%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/24670/Exit%20Block%20Blocker.meta.js
// ==/UserScript==

var th = document.getElementsByTagName('body')[0];
var s = document.createElement('script');
s.setAttribute('type','text/javascript');
s.innerHTML = "window.onbeforeunload = function() {}";
th.appendChild(s);
