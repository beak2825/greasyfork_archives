// ==UserScript==
// @name         Le Marché Jap - Hide unavailable products
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hide unavailable products
// @author       Shuunen
// @match        https://www.lemarchejaponais.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34962/Le%20March%C3%A9%20Jap%20-%20Hide%20unavailable%20products.user.js
// @updateURL https://update.greasyfork.org/scripts/34962/Le%20March%C3%A9%20Jap%20-%20Hide%20unavailable%20products.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var els = document.querySelectorAll('.nostock');

    els.forEach(function(el){
        el = el.parentElement.parentElement;
        el.style.display = 'none';
        el = el.nextElementSibling;
        el.style.display = 'none';
        el = el.previousElementSibling.previousElementSibling;
        el.style.display = 'none';
        el = el.previousElementSibling;
        el.style.display = 'none';
        el = el.previousElementSibling;
        el.style.display = 'none';
    });
})();