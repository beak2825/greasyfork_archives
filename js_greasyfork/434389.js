// ==UserScript==
// @name         Fix Typingclub's bug.(修复typingclub.com的bug)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fix Typingclub's bug.
// @author       XSlime_001
// @match        https://www.typingclub.com/*
// @match        https://www.edclub.com/*
// @icon         https://www.google.com/s2/favicons?domain=typingclub.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434389/Fix%20Typingclub%27s%20bug%28%E4%BF%AE%E5%A4%8Dtypingclubcom%E7%9A%84bug%29.user.js
// @updateURL https://update.greasyfork.org/scripts/434389/Fix%20Typingclub%27s%20bug%28%E4%BF%AE%E5%A4%8Dtypingclubcom%E7%9A%84bug%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll("link").forEach(function(c,a,b){
        document.querySelectorAll("link")[a].href = document.querySelectorAll("link")[a].href.replace("static.","");
    });
    document.querySelectorAll("script").forEach(function(c,a,b){
        document.querySelectorAll("script")[a].src = document.querySelectorAll("script")[a].src.replace("static.","");
    });
    document.querySelectorAll("img").forEach(function(c,a,b){
        document.querySelectorAll("img")[a].src = document.querySelectorAll("img")[a].src.replace("static.","");
    });
})();