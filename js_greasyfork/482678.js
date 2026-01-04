// ==UserScript==
// @name         remove shapka
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove specific line with class "svgIcon nyCapIcon"
// @author       You
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @match        https://lolz.guru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482678/remove%20shapka.user.js
// @updateURL https://update.greasyfork.org/scripts/482678/remove%20shapka.meta.js
// ==/UserScript==

(function() {
    'use strict';

 var elementToRemove = document.querySelector('div.tournament-block');
    if (elementToRemove) {
        elementToRemove.remove();
    	    }
})();