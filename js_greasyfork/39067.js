// ==UserScript==
// @name         iGracias Custom Background
// @namespace    https://github.com/zafitract
// @version      0.1
// @description  Custom background for iGracias login page
// @author       Rezza Nafi
// @match        https://igracias.telkomuniversity.ac.id/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39067/iGracias%20Custom%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/39067/iGracias%20Custom%20Background.meta.js
// ==/UserScript==

var bg_image = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/M82_HST_ACS_2006-14-a-large_web.jpg/1280px-M82_HST_ACS_2006-14-a-large_web.jpg";

(function() {
    'use strict';

    // Your code here...
    var bg = document.getElementById("ac_bgimage");
    bg.setAttribute("src", bg_image);
    bg.style.content = "url('" + bg_image + "')";
})();
