// ==UserScript==
// @name         CCTL Navigation fixe
// @namespace    Exia Tools
// @version      1.1
// @description  Fixe le panneau de navigation du test lors du CCTL et de la relecture.
// @author       Aurélien KLEIN
// @match        https://moodle-examens.cesi.fr/mod/quiz/*
// @grant        none
// @copyright	2019+, Aurélien KLEIN
// @downloadURL https://update.greasyfork.org/scripts/386404/CCTL%20Navigation%20fixe.user.js
// @updateURL https://update.greasyfork.org/scripts/386404/CCTL%20Navigation%20fixe.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var bloc = document.getElementById('mod_quiz_navblock') ? document.getElementById('mod_quiz_navblock').parentElement : null;
    if (bloc) {
        bloc.style.position = 'fixed';
        bloc.style.right = '20px';
        bloc.style.maxWidth = '325px';
    }

    window.onload = function() {
        // Block oncontextmenu function
        alert = null;

        document.body = document.body.cloneNode(true);
    }
})();