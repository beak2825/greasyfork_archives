// ==UserScript==
// @name         Fix cours exia cesi
// @namespace    http://tampermonkey.net/
// @version      0.0.0.0.0.0.0.1
// @description  Fix bug caused by useless people (can't call them dev or equivalent)
// @author       You
// @match        https://moodle-exia.cesi.fr/pluginfile.php/35484/mod_resource/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382527/Fix%20cours%20exia%20cesi.user.js
// @updateURL https://update.greasyfork.org/scripts/382527/Fix%20cours%20exia%20cesi.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var els = null;

//     els = document.getElementsByClassName("activite");

//     Array.prototype.forEach.call(els, function(el) {
//         // Do stuff here
//         if (el.children[0].children[0].innerText != "Bilan Briefing" &&
//             !el.children[0].children[0].innerText.startsWith("WS") &&
//             !el.children[0].children[0].innerText.startsWith("Corbeille") &&
//             !el.children[0].children[0].innerText.startsWith("CCTL")){
//             return;
//         }

//         el.children[1].children[0].children[0].click();
//     });

    els = document.getElementsByClassName("activite_co");
    Array.prototype.forEach.call(els, function(el) {

        var bloc = el.children[0];

        var act = [...el.children].splice(1);
        Array.prototype.forEach.call(act, function(a){
            bloc.children[1].appendChild(a);
        });
    });

})();