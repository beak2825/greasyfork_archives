// ==UserScript==
// @name         Comment Replacer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       @TheUltimatum
// @match        http*://scratch.mit.edu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25731/Comment%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/25731/Comment%20Replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.onload=function() {
        var comments=document.getElementsByClassName("comments")[0].getElementsByClassName("content");
        for (var comment in comments) {
            comments[comment].innerHTML=comments[comment].innerHTML.toString().replace("_test_","Potato!");
        }
    };
})();