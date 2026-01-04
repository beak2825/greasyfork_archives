// ==UserScript==
// @name         SweepOverflow
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Cleans question contents by fixing common typos, to save your brain the hassle.
// @author       Jabster28
// @license      MIT
// @copyright    2020, Jabster28 (https://openuserjs.org/users/Jabster28)
// @require      https://gitcdn.xyz/cdn/surfinzap/typopo/af175ce4eb7ac506ad771db4a9679c179aa49e81/dist/typopo_dist.min.js
// @match        https://stackoverflow.com/questions/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407501/SweepOverflow.user.js
// @updateURL https://update.greasyfork.org/scripts/407501/SweepOverflow.meta.js
// ==/UserScript==

var elements = document.querySelectorAll(".post-text p");
Array.prototype.forEach.call(elements, function (el, i) {
  el.textContent = typopo.fixTypos(el.textContent, "en-us", {
    removeLines: false,
  });
});
