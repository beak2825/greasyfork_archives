// ==UserScript==
// @name           Roll20 Add black border to canvas
// @description    Makes the canvas more visible for dropping maps in
// @match          https://app.roll20.net/editor/*
// @grant          GM_addStyle
// @version      1
// @namespace https://greasyfork.org/users/823025
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456846/Roll20%20Add%20black%20border%20to%20canvas.user.js
// @updateURL https://update.greasyfork.org/scripts/456846/Roll20%20Add%20black%20border%20to%20canvas.meta.js
// ==/UserScript==

GM_addStyle("#editor-wrapper .canvas-container { border: 1px solid black; }");