//
// Written by Glenn Wiking
// Script Version: 1.1.1a
// Date of issue: 23/01/19
// Date of resolution: 23/01/19
//
// ==UserScript==
// @name        ShadeFix Shuttle API
// @namespace   SFSH
// @description Quality of work improvements in Shuttle
// @include     *.shuttle.be/admin*
// @require		http://code.jquery.com/jquery-3.3.1.min.js

// @version     1.1.1a
// @downloadURL https://update.greasyfork.org/scripts/377480/ShadeFix%20Shuttle%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/377480/ShadeFix%20Shuttle%20API.meta.js
// ==/UserScript==

function ShadeFixSH(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
  	$(".shuttle-Tree-itemTarget .shuttle-Tree-title:contains('Detail')").css({"color":"#DDD"});
  	console.log("Loaded");
}

window.onload = function() {
  	console.log("G");
}
  


ShadeFixSH (
	'.shuttle-Panel-inner .TreeScroller {height: 32vh !important;}'
  +
  '.shuttle-Panel-inner .TreeScroller--inner {height: 31.8vh !important;}'
  +
  '.shuttle-Panel-inner tr[data-type="image"] td img {height: 52px !important; width: 52px !important; transform: scale(1.1); transition: all 90ms ease-in-out 0s;}'
  +
  '.shuttle-Panel-inner tr[data-type="image"] td img:hover {transform: scale(1.25); height: 64px; width: 64px; transition: all 90ms ease-in-out 0s;}'
  +
  '.shuttle-Panel-inner {padding: 14px !important;}'
  +
  '.shuttle-Panel--mainNav > .shuttle-Panel-inner {overflow-x: hidden;}'
  +
  '.ace_editor {font-size: 13.5px !important;}'
  +
  '.shuttle-Tree {position: relative; left: -12px;}'
  +
  '.shuttle-Tree-item--root > .shuttle-Tree-itemTarget {padding-left: 7px !important;}'
  +
  '.shuttle-widget-master-style .shuttle-widget-title {left: 0 !important; top: 62px !important; width: 100% !important; text-align: center; font-size: 12px; text-overflow: clip; overflow: visible;}'
  /*+
  '.shuttle-Panel--sub {width: 500px !important;}'*/
);