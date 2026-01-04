// ==UserScript==
// @name        Remove Main codepen bar
// @namespace   Violentmonkey Scripts
// @match       https://codepen.io/*/pen/*
// @grant       none
// @version     1.0
// @author      RedsonBr140
// @description 7/3/2023, 9:21:35 AM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470041/Remove%20Main%20codepen%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/470041/Remove%20Main%20codepen%20bar.meta.js
// ==/UserScript==

document.querySelector(".editor-header").remove()
document.querySelector(".main-header").remove()