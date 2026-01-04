// ==UserScript==
// @name         Соревнования| Заказчик - Mary ❤
// @version      0.2
// @description  По всем вопросам обращайтесь в группу SNSbot
// @author       Максим Мирный
// @match        https://www.lowadi.com/centre/competition/cross/
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @grant        GM_addStyle
// @namespace    https://vk.com/c888cc98
// @downloadURL https://update.greasyfork.org/scripts/403104/%D0%A1%D0%BE%D1%80%D0%B5%D0%B2%D0%BD%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%7C%20%D0%97%D0%B0%D0%BA%D0%B0%D0%B7%D1%87%D0%B8%D0%BA%20-%20Mary%20%E2%9D%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/403104/%D0%A1%D0%BE%D1%80%D0%B5%D0%B2%D0%BD%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%7C%20%D0%97%D0%B0%D0%BA%D0%B0%D0%B7%D1%87%D0%B8%D0%BA%20-%20Mary%20%E2%9D%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var knopochka = document.querySelector('.parcours');
     console.log(knopochka);
     var knp_btn = knopochka.querySelector('div[data-pos-x="1"]');
     simulateMouseClick(knp_btn);
     var boll = document.querySelector('#obstacle_1_1').click();
     var perekladina = document.querySelector('a[data-name="virage-droite-bas"]').click();
     var visoko_shirot = document.querySelector('a[data-name="stere-bois-bas"]').click();
     var vertikalnoe = document.querySelector('a[data-name="virage-pente-gauche-droite"]').click();
     var barierr = document.querySelector('a[data-name="obstacle-contrebas-droite"]').click();
     var right_one = document.querySelector('a[data-name="virage-gauche-haut"]').click();
     var right_two = document.querySelector('a[data-name="stere-bois-haut"]').click();
     var rodnik = document.querySelector('a[data-name="virage-pente-droite-droite"]').click();
     var visoko_shirot_two = document.querySelector('a[data-name="gue-droite"]').click();
     var ploskost = document.querySelector('a[data-name="virage-droite-bas"]').click();
     var povorot_levo_one = document.querySelector('a[data-name="stere-bois-bas"]').click();
     var povorot_levo_two = document.querySelector('a[data-name="virage-pente-droite-gauche"]').click();
     var vertt = document.querySelector('a[data-name="virage-pente-gauche-bas"]').click();
     var visoko = document.querySelector('a[data-name="stere-bois-bas"]').click();
     var peeerekl = document.querySelector('a[data-name="virage-pente-gauche-droite"]').click();
     var vert_planka_ = document.querySelector('a[data-name="gue-droite"]').click();
     var perekla = document.querySelector('a[data-name="plat-droite"]').click();
     var pravo_onth = document.querySelector('a[data-name="stere-bois-droite"]').click();
     var pravo_tweenth = document.querySelector('a[data-name="virage-droite-bas"]').click();
     var spa_gauch = document.querySelector('a[data-name="stere-bois-bas"]').click();
     var mur_gauch = document.querySelector('a[data-name="virage-droite-gauche"]').click();
     var pa_gauch = document.querySelector('a[data-name="stere-bois-gauche"]').click();
     var seno = document.querySelector('a[data-name="virage-droite-haut"]').click();
     var op_pov_pravo = document.querySelector('a[data-name="virage-pente-gauche-gauche"]').click();
     var eshe_pravo = document.querySelector('a[data-name="piano-gauche"]').click();
     var pusto = document.querySelector('a[data-name="virage-gauche-bas"]').click();
     var mur_doite = document.querySelector('a[data-name="stere-bois-bas"]').click();
     var opyat_bl_perekla = document.querySelector('a[data-name="virage-gauche-droite"]').click();
     var pizdaa = document.querySelector('a[data-name="parc-moutons-droite"]').click();
     var ebanaya_perekla = document.querySelector('a[data-name="virage-droite-bas"]').click();
     var pov_pr = document.querySelector('a[data-name="stere-bois-bas"]').click();
     var por_pv = document.querySelector('a[data-name="plat-bas"]').click();
     var pr_v = document.querySelector('a[data-name="stere-bois-bas"]').click();
     var zbb = document.querySelector('a[data-name="virage-pente-gauche-droite"]').click();
     var ploska = document.querySelector('a[data-name="virage-pente-droite-bas"]').click();
     var sh_v = document.querySelector('a[data-name="stere-bois-bas"]').click();
     var le = document.querySelector('a[data-name="virage-pente-gauche-droite"]').click();
     var le_l = document.querySelector('a[data-name="virage-pente-gauche-haut"]').click();
     var z_pravo = document.querySelector('a[data-name="plat-haut"]').click();
     var les_l = document.querySelector('a[data-name="virage-droite-droite"]').click();
     var pereekkk = document.querySelector('a[data-name="fosse-droite"]').click();
     var vt_per = document.querySelector('a[data-name="virage-droite-bas"]').click();
     var super_per = document.querySelector('a[data-name="stere-bois-bas"]').click();
     var vsk = document.querySelector('a[data-name="virage-pente-gauche-droite"]').click();
     var vle = document.querySelector('a[data-name="gue-droite"]').click();
     var vlevo = document.querySelector('a[data-name="arrivee-droite"]').click();

     var rb = document.querySelector('#reservationCompetitionChampion').click();
     var race = document.querySelector('#race');
     console.log(race);
     var pony = race.querySelector('optgroup[label="Лошади"]');
     console.log(pony);
     $("#race [value='52']").attr("selected", "selected");
     var name_scatch = document.getElementById('nom').value = 'Золотое сечение';
     var btnall = document.querySelector('#bouton-enregistrer');
     var button_save = btnall.querySelector('.button-text-0').click();
    // Your code here...
})();

function simulateMouseClick(targetNode) {
    function triggerMouseEvent(targetNode, eventType) {
        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent(eventType, true, true);
        targetNode.dispatchEvent(clickEvent);
    }
    ["mouseover", "mousedown", "mouseup", "click"].forEach(function(eventType) {
        triggerMouseEvent(targetNode, eventType);
    });
}