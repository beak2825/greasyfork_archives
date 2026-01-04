// ==UserScript==
// @name         Dark Google Voice 2019
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Goes best with this https://userstyles.org/styles/172278/
// @author       You
// @match        https://voice.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383567/Dark%20Google%20Voice%202019.user.js
// @updateURL https://update.greasyfork.org/scripts/383567/Dark%20Google%20Voice%202019.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.querySelector('header').style.backgroundColor = '#090909';
    document.querySelector('.gb_ne').style.background = "none"
        // Your code here..
})();