// ==UserScript==
// @name         zenmod clear view
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove blur over vape juices.
// @author       anon
// @match        https://*.zenmod.ru/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423846/zenmod%20clear%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/423846/zenmod%20clear%20view.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var divs = document.getElementsByClassName("has_nicotine");

    divs=Array.from(divs);

    divs.forEach(function(div){
        div.classList.remove('has_nicotine');
    });
})();