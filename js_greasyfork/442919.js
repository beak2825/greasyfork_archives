// ==UserScript==
// @name         NoGithub
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Stop students using GitHub.
// @author       fyc
// @match        https://github.com/*
// @license      GPL 3.0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442919/NoGithub.user.js
// @updateURL https://update.greasyfork.org/scripts/442919/NoGithub.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var i = 0;
    while (i < 5){
        alert("You should not use github!");
        console.warn("Attempt of visiting GitHub detected.");
        i++;
    }
    location.assign("https://www.baidu.com");
})();