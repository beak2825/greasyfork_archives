// ==UserScript==
// @name         Youtube short pop out
// @description  Youtube Short Full Video Pop out
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/shorts/*
// @icon         https://www.youtube.com/shorts/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493882/Youtube%20short%20pop%20out.user.js
// @updateURL https://update.greasyfork.org/scripts/493882/Youtube%20short%20pop%20out.meta.js
// ==/UserScript==

(function() {
    'use strict';

     document.onkeypress = function (e) {
    e = e || window.event;
    // alert(e.keyCode);
    if (e.keyCode == 108){   //change this for your desired key
    const currentUrl = window.location.href;
    var splited = currentUrl.split("shorts/");
    var splitedAgain = splited[1].split(" ");
    window.location.href = "https://www.youtube.com/watch?v=" + splitedAgain[0];
    }
};


})();