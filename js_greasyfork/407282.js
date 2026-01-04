// ==UserScript==
// @name         romhacking.net robot verification bypass
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Robot verification of this website is kinda... insecure
// @author       Nightdavisao
// @match        https://www.romhacking.net/download/*
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/407282/romhackingnet%20robot%20verification%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/407282/romhackingnet%20robot%20verification%20bypass.meta.js
// ==/UserScript==

setTimeout(function() {
    'use strict';
    var input = document.querySelector('input[type="password"]');
    var parentNote = input.parentNode.querySelector(".note");
    var button = document.querySelector('input[value="I am Human"]');
    var sub = parentNote.innerText.trim().split(' ');
    sub = sub[sub.length - 1];
    sub = sub.substring(0, sub.length - 1);
    sub = sub.trim();
    GM_log("[romhacking.net robot verification bypass] Matched verification string: " + sub);
    input.value = sub;
    button.click();
}, 1000)