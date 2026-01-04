// ==UserScript==
// @name         myScript
// @author       GinoLoSpazzino[ITA]
// @namespace    NomeSpazio
// @version      1.1
// @description  TESTING Stiddari Script
// @include      *.stiddari.com/game/*
// @downloadURL https://update.greasyfork.org/scripts/36047/myScript.user.js
// @updateURL https://update.greasyfork.org/scripts/36047/myScript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var lnk = document.getElementsByTagName('a');
    lnk[15].style.color = "yellow";
    
    if (location.pathname.search('overview.php') != -1) {
        var img = document.getElementsByTagName('img')[10];
        img.style.visibility = "hidden"
    }


})();