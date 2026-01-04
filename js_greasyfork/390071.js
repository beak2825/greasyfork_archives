// ==UserScript==
// @name         Elimina Required
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       SStvAA!
// @match        https://render.figure-eight.io/assignments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390071/Elimina%20Required.user.js
// @updateURL https://update.greasyfork.org/scripts/390071/Elimina%20Required.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var a = document.getElementsByClassName("cml_row")
    a[0].remove(a[0])
    a[1].remove(a[1])
    a[2].remove(a[2])
    a[3].remove(a[3])
    a[4].remove(a[4])
})();