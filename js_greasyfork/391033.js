// ==UserScript==
// @name         ExHentai - Hide Comments
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hides entire comment section. Save screen space, less scrolling. 
// @author       miwoj
// @match        https://exhentai.org/g/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391033/ExHentai%20-%20Hide%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/391033/ExHentai%20-%20Hide%20Comments.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var element = document.getElementById("cdiv");
    element.style.display = "none";
    // Your code here...
})();