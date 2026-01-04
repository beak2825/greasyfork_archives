// ==UserScript==
// @name         StackOverflow Distraction Blocker
// @namespace    https://stackoverflow.com/
// @version      1.0
// @description  Block distractions on StackExchange sites!
// @author       Simon Baars
// @match        https://stackoverflow.com/*
// @match        *.stackexchange.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369952/StackOverflow%20Distraction%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/369952/StackOverflow%20Distraction%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var sidebar = document.getElementById("sidebar");
    if(sidebar != null)
        sidebar.parentElement.removeChild(sidebar);

    var mainbar = document.getElementById("mainbar");
    if(mainbar != null)
        mainbar.style.width = "100%";

    var answersBlock = document.getElementById("answers");
    if(answersBlock != null)
        answersBlock.style.width = "100%";

    var answers = document.getElementsByClassName("answer");
    for(var i = 0; i<answers.length; i++){
        answers[i].style.width = "100%";
    }

    var topBar = document.getElementsByTagName("header")[0];
    topBar.parentElement.removeChild(topBar);

    document.getElementsByClassName("container")[0].style.maxWidth = "100%";
    document.getElementById("content").style.maxWidth = "100%";
    document.getElementsByTagName("body")[0].style.paddingTop = "0px";
})();