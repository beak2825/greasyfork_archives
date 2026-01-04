// ==UserScript==
// @name         Autofillup ESMIS
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  emis lmao get rekt
// @author       SEAN GODRIC REYES
// @match        https://esmis.smu.edu.ph/survey/fill/*
// @icon         https://i.idol.st/u/idol/symbol/97Tennoji-Rina-ei7HCw.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445910/Autofillup%20ESMIS.user.js
// @updateURL https://update.greasyfork.org/scripts/445910/Autofillup%20ESMIS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var labels = document.getElementsByTagName('span');
    for (var i = 0; i < labels.length; ++i)
    {
        if (labels[i].textContent == "Often")
        {
            labels[i].click();
        }
    }

})();