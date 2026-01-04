// ==UserScript==
// @name         Трейл, serendipity
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Тейл с названием serendipity
// @author       Максим Мирный
// @match        https://www.lowadi.com/centre/competition/trailClass/
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @grant  GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/404545/%D0%A2%D1%80%D0%B5%D0%B9%D0%BB%2C%20serendipity.user.js
// @updateURL https://update.greasyfork.org/scripts/404545/%D0%A2%D1%80%D0%B5%D0%B9%D0%BB%2C%20serendipity.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var proxod_l = document.getElementById('fig-patron-caption-15');
    proxod_l.click();
    var otk_i_zakr = document.getElementById('fig-patron-caption-20');
    otk_i_zakr.click();
    var chet_zhedri = document.getElementById('fig-patron-caption-21');
    chet_zhedri.click();
    proxod_l.click();
    var povorot = document.getElementById('fig-patron-caption-19');
    povorot.click();
    var stay = document.getElementById('fig-patron-caption-17');
    stay.click()
    proxod_l.click();
    var prud = document.getElementById('fig-patron-caption-22');
    prud.click();
    otk_i_zakr.click();
    var der_most = document.getElementById('fig-patron-caption-23');
    der_most.click()
    var name_scatch = document.getElementById('nom').value = 'serendipity';
    var rb = document.querySelector('#reservationCompetitionChampion').click();
    $("#race [value='56']").attr("selected", "selected");
    var btnall = document.querySelector('#bouton-enregistrer');
    var button_save = btnall.querySelector('.button-text-0').click();
    // Your code here...
})();