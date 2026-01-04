// ==UserScript==
// @name         hwm_autobattle_checker
// @namespace    Striker
// @author       Striker
// @version      0.1.1
// @description  Определение бесплатного автобоя
// @include      /^https?:\/\/(www\.heroeswm\.ru|178\.248\.235\.15|www\.lordswm\.com)\/war\.php.+/
// @downloadURL https://update.greasyfork.org/scripts/389701/hwm_autobattle_checker.user.js
// @updateURL https://update.greasyfork.org/scripts/389701/hwm_autobattle_checker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var autoBtn = document.getElementById("fastbattle_on");
    if(autoBtn && (document.body.innerHTML.indexOf("fastbut|1") > -1)){
        autoBtn.style.filter="grayscale(100%)";
        window.addEventListener("load", function(event) {
            if(fastbut_ok === true) fastbut_ok = 1;
            var timer = setInterval(function(){ if(fastbut_ok === true){ autoBtn.style.filter=""; clearInterval(timer); }}, 3000);
        });
    }

})();