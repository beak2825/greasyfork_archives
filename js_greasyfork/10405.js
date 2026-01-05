// ==UserScript==
// @name        Remove Freckle Tags
// @description Remove Freckle tags from freckle. It greatly improves browser speed on projects with many tags
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @namespace   http://userscripts.org/users/sildur
// @include     https://*.letsfreckle.com/time/dashboard
// @include     https://*.letsfreckle.com/timer
// @include     https://*.letsfreckle.com/time/dashboard/recent
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10405/Remove%20Freckle%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/10405/Remove%20Freckle%20Tags.meta.js
// ==/UserScript==

var script = document.createElement('script');
// Put parenthesis after source so that it will be invoked.
//script.innerHTML = "window.addEventListener('load', function(){Freckle.Tags.set([])})";
script.innerHTML = "window.addEventListener('load', function(){setInterval(function(){ Freckle.Tags.set([]); }, 1000);})";
document.body.appendChild(script);
