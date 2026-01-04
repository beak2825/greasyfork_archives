// ==UserScript==
// @name         AtCoder open-file-button Eraser
// @namespace    https://github.com/ShuheiKuriki
// @version      1.0.2
// @description  hide atcoder open file button
// @author       shuheiKuriki
// @license      MIT
// @match       https://atcoder.jp/contests/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449993/AtCoder%20open-file-button%20Eraser.user.js
// @updateURL https://update.greasyfork.org/scripts/449993/AtCoder%20open-file-button%20Eraser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const button = document.querySelector("#btn-open-file");
    button.style.display = "none";

})();