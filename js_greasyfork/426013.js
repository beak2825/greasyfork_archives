// ==UserScript==
// @name         Fix FA submissions html
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  fix some of FA's HTML
// @author       You
// @match        https://www.furaffinity.net/msg/submissions/*
// @icon         https://www.google.com/s2/favicons?domain=furaffinity.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426013/Fix%20FA%20submissions%20html.user.js
// @updateURL https://update.greasyfork.org/scripts/426013/Fix%20FA%20submissions%20html.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var headings = document.getElementsByClassName("date-divider")
    var sections = document.getElementsByClassName("gallery")
    var i
    for (i=0; i < headings.length; i++){sections[i].prepend(headings[i]);}
})();