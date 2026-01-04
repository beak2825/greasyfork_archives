// ==UserScript==
// @name         Advent Of Code Easter Eggs
// @namespace    chimichanga
// @version      0.1
// @description  Show easter eggs on adventofcode.com
// @author       chimichanga
// @match        https://adventofcode.com/*/day/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=adventofcode.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481160/Advent%20Of%20Code%20Easter%20Eggs.user.js
// @updateURL https://update.greasyfork.org/scripts/481160/Advent%20Of%20Code%20Easter%20Eggs.meta.js
// ==/UserScript==

(function() {
    'use strict';
    for(const node of document.querySelectorAll('span[title]')){
       node.style.outline="1px dashed gold";
       node.style.outlineOffset="2px";
    }
})();