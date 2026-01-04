// ==UserScript==
// @name        Fix SVGs on HackerRank.com
// @description If you have a hard time reading some of the text on HackerRank.com this may help. Some of the text in the problems are SVG and the stoke creates a messy, jagged edge unless you zoom in on them. This removes the stoke of all svgs on challenge screens and allows you to change the SVG fill color to whatever you want (by editing the commented line in the script).
// @namespace   z3r0cool
// @include     https://www.hackerrank.com/*
// @version     1.1
// @license     Apache 2.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/449700/Fix%20SVGs%20on%20HackerRankcom.user.js
// @updateURL https://update.greasyfork.org/scripts/449700/Fix%20SVGs%20on%20HackerRankcom.meta.js
// ==/UserScript==
var url = document.location.toString();
function scriptBody() {
    if (document.location.toString().includes('/challenges/')) {
        let svgs = document.querySelectorAll('svg');
        if (svgs) {
            svgs.forEach(svg => {
                let path = svg.querySelector('g');
                if (path) {
                    path.setAttribute("stroke", "transparent");
                    // change svg color here
                    path.setAttribute("fill", "#00aaEE");
                }
            });
        }
    }
}
setTimeout(scriptBody(), 1000);
document.querySelector('html') .addEventListener('DOMNodeInserted', function (ev) {
    var new_url = document.location.toString();
    if (url == new_url) return ;
    url = new_url;
    setTimeout(scriptBody(), 1000);
});