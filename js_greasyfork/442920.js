// ==UserScript==
// @name         Auto Fill iGracias's Surveys
// @namespace    https://igracias.telkomuniversity.ac.id/
// @version      1.4
// @description  Kamu capek ngisi survey satu-satu? Dengan script ini, kamu hanya perlu next-next saja
// @author       UltraMasterX
// @match        https://igracias.telkomuniversity.ac.id/*
// @icon         https://igracias.telkomuniversity.ac.id/styles/dashboard2018/img/igracias2.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442920/Auto%20Fill%20iGracias%27s%20Surveys.user.js
// @updateURL https://update.greasyfork.org/scripts/442920/Auto%20Fill%20iGracias%27s%20Surveys.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let pilihan = 2   // isi angka sesuai urutan jawaban, misal 2 = pilihan ke dua
    for(let a of document.querySelectorAll("[id = 'radioX']")) {
        a.querySelectorAll("[type='radio']")[pilihan - 1].checked = true
    }
})();