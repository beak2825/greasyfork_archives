// ==UserScript==
// @name         GitLab Raw File Fix
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add line numbers to raw files at GitLab
// @author       Lasse Brustad
// @match        https://gitlab.com/*/raw/*
// @match        https://gitlab.*/*/raw/*
// @match        https://git.coolaj86.com/*/raw/*
// @grant        none
// @locale       en
// @downloadURL https://update.greasyfork.org/scripts/369232/GitLab%20Raw%20File%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/369232/GitLab%20Raw%20File%20Fix.meta.js
// ==/UserScript==
// jshint esversion: 6

(() => {
    'use strict';

    // Get the text block
    let pre = document.getElementsByTagName('pre')[0];

    // Split the lines into an array
    let arr = pre.innerText.trim().split('\n');

    // Create the new text
    for (let i = 0; i < arr.length; i++) {
        arr[i] = (i + 1) + ': ' + arr[i];
    }

    // Replace the text with the fixed text
    pre.innerText = arr.join('\n');
})();