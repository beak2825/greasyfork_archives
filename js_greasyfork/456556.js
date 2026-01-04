// ==UserScript==
// @name         Auto Fullscreen (Sokoban Online)
// @namespace    http://mattrangel.net/
// @version      0.1
// @description  Automatically fullscreens game
// @author       MattRangel
// @match        https://www.sokobanonline.com/play/*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sokobanonline.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/456556/Auto%20Fullscreen%20%28Sokoban%20Online%29.user.js
// @updateURL https://update.greasyfork.org/scripts/456556/Auto%20Fullscreen%20%28Sokoban%20Online%29.meta.js
// ==/UserScript==
window.onload = () => document.querySelector(".fs-button").click();