// ==UserScript==
// @name         Make Tsumanne links open in self window
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  tsumanne.
// @author       eggplants
// @homepage     https://github.com/eggplants
// @include      https://tsumanne.net/si/*
// @include      https://tsumanne.net/my/*
// @include      https://tsumanne.net/tj/*
// @include      https://tsumanne.net/my/*
// @include      https://tsumanne.net/sp/*
// @include      https://tsumanne.net/si/*/*
// @include      https://tsumanne.net/my/*/*
// @include      https://tsumanne.net/tj/*/*
// @include      https://tsumanne.net/my/*/*
// @include      https://tsumanne.net/sp/*/*
// @exclude      https://tsumanne.net/*/data/*/*/*/*/*
// @grant        none
// @esversion    6
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/430469/Make%20Tsumanne%20links%20open%20in%20self%20window.user.js
// @updateURL https://update.greasyfork.org/scripts/430469/Make%20Tsumanne%20links%20open%20in%20self%20window.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';
    Array.from(
        document.querySelectorAll("a[target=t]")
    ).map(n=>n.target="_self");
 
})();