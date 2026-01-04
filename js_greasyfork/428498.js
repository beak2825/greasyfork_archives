// ==UserScript==
// @name         Score11
// @namespace    http://score11.de/
// @version      0.1
// @description  Automatische Anmeldung auf Score11
// @author       THS
// @match        https://www.score11.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428498/Score11.user.js
// @updateURL https://update.greasyfork.org/scripts/428498/Score11.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var inputs	= document.getElementsByTagName("input");
    var inName	= null;
    var inPass	= null;
    var inBut	= null;

    for (var i=0; i < inputs.length; i++) {
        if (inputs[i].name == "login") 		inName	= inputs[i];
        if (inputs[i].name == "password") 	inPass	= inputs[i];
        if (inputs[i].name == "dologin") 	inBut	= inputs[i];
    }

    if (inName != null) {

        inName.value = "";
        inPass.value = "";
        inBut.click();
    };

})();
