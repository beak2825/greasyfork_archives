// ==UserScript==
// @name         Get Free Azure Pass Credit
// @namespace    https://greasyfork.org/users/8650
// @version      0.2
// @description  Get Free Azure Pass Credit automatically
// @author       @LegendTang
// @match        https://www.itprocloudessentials.com/dashboard/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20741/Get%20Free%20Azure%20Pass%20Credit.user.js
// @updateURL https://update.greasyfork.org/scripts/20741/Get%20Free%20Azure%20Pass%20Credit.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.readyState === 'complete' || document.readyState !== 'loading') {
        eventHandler();
    } else {
        document.addEventListener('DOMContentLoaded', eventHandler);
    }

    function eventHandler (){
        document.getElementById('nav-cloudservices').childNodes[1].click();
        setInterval(function(){
            var code_btn = document.getElementsByClassName('cta-link -background _lightbluebg -expander')[0];
            code_btn.click();
        }, 2000);
    }
})();