// ==UserScript==
// @name         Соревнования| Заказчик - Сергей
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  При возникновении проблем пишите в группу SNSbot
// @author       Максим Мирный
// @match        https://www.lowadi.com/centre/competition/cso/
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @grant  GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/402691/%D0%A1%D0%BE%D1%80%D0%B5%D0%B2%D0%BD%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%7C%20%D0%97%D0%B0%D0%BA%D0%B0%D0%B7%D1%87%D0%B8%D0%BA%20-%20%D0%A1%D0%B5%D1%80%D0%B3%D0%B5%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/402691/%D0%A1%D0%BE%D1%80%D0%B5%D0%B2%D0%BD%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%7C%20%D0%97%D0%B0%D0%BA%D0%B0%D0%B7%D1%87%D0%B8%D0%BA%20-%20%D0%A1%D0%B5%D1%80%D0%B3%D0%B5%D0%B9.meta.js
// ==/UserScript==

//plat-sable-droite mur-droite
(function() {
    'use strict';
     var knopochka = document.querySelector('.parcours');
     console.log(knopochka);
     var knp_btn = knopochka.querySelector('div[data-pos-x="1"]');
     simulateMouseClick(knp_btn);
     var boll = document.querySelector('#obstacle_1_1').click();
     var perekladina = document.querySelector('a[data-name="croisillon-droite"]').click();
     var visoko_shirot = document.querySelector('a[data-name="barre-large-droite"]').click();
     var vertikalnoe = document.querySelector('a[data-name="barre-droite"]').click();
     var barierr = document.querySelector('a[data-name="barriere-droite"]').click();
     var right_one = document.querySelector('a[data-name="virage-sable-droite-bas"]').click();
     var right_two = document.querySelector('a[data-name="virage-sable-droite-gauche"]').click();
     var rodnik = document.querySelector('a[data-name="spa-gauche"]').click();
     var visoko_shirot_two = document.querySelector('a[data-name="barre-large-gauche"]').click();
     var ploskost = document.querySelector('a[data-name="plat-sable-gauche"]').click();
     var povorot_levo_one = document.querySelector('a[data-name="virage-sable-gauche-bas"]').click();
     var povorot_levo_two = document.querySelector('a[data-name="virage-sable-gauche-droite"]').click();
     var vertt = document.querySelector('a[data-name="barre-droite"]').click();
     var visoko = document.querySelector('a[data-name="barre-large-droite"]').click();
     var peeerekl = document.querySelector('a[data-name="croisillon-droite"]').click();
     var vert_planka_ = document.querySelector('a[data-name="barre-verticale-droite"]').click();
     var perekla = document.querySelector('a[data-name="croisillon-droite"]').click();
     var pravo_onth = document.querySelector('a[data-name="virage-sable-droite-bas"]').click();
     var pravo_tweenth = document.querySelector('a[data-name="virage-sable-droite-gauche"]').click();
     var spa_gauch = document.querySelector('a[data-name="spa-gauche"]').click();
     var mur_gauch = document.querySelector('a[data-name="mur-gauche"]').click();
     var pa_gauch = document.querySelector('a[data-name="spa-gauche"]').click();
     var seno = document.querySelector('a[data-name="haie-gauche"]').click();
     var op_pov_pravo = document.querySelector('a[data-name="virage-sable-gauche-bas"]').click();
     var eshe_pravo = document.querySelector('a[data-name="virage-sable-gauche-droite"]').click();
     var pusto = document.querySelector('a[data-name="plat-sable-droite"]').click();
     var mur_doite = document.querySelector('a[data-name="mur-droite"]').click();
     var opyat_bl_perekla = document.querySelector('a[data-name="croisillon-droite"]').click();
     var pizdaa = document.querySelector('a[data-name="barre-large-droite"]').click();
     var ebanaya_perekla = document.querySelector('a[data-name="croisillon-droite"]').click();
     var pov_pr = document.querySelector('a[data-name="virage-sable-droite-bas"]').click();
     var por_pv = document.querySelector('a[data-name="virage-sable-droite-gauche"]').click();
     var pr_v = document.querySelector('a[data-name="barre-gauche"]').click();
     var zbb = document.querySelector('a[data-name="barre-verticale-gauche"]').click();
     var ploska = document.querySelector('a[data-name="plat-sable-gauche"]').click();
     var sh_v = document.querySelector('a[data-name="barre-large-gauche"]').click();
     var le = document.querySelector('a[data-name="virage-sable-gauche-bas"]').click();
     var le_l = document.querySelector('a[data-name="virage-sable-gauche-droite"]').click();
     var z_pravo = document.querySelector('a[data-name="virage-sable-droite-bas"]').click();
     var les_l = document.querySelector('a[data-name="virage-sable-gauche-droite"]').click();
     var pereekkk = document.querySelector('a[data-name="croisillon-droite"]').click();
     var vt_per = document.querySelector('a[data-name="croisillon-milieu-droite"]').click();
     var super_per = document.querySelector('a[data-name="croisillon-droite"]').click();
     var vsk = document.querySelector('a[data-name="barre-large-droite"]').click();
     var vle = document.querySelector('a[data-name="virage-sable-gauche-haut"]').click();
     var vlevo = document.querySelector('a[data-name="virage-sable-gauche-gauche"]').click();
     var rodnichok = document.querySelector('a[data-name="spa-gauche"]').click();
     var finish = document.querySelector('a[data-name="arrivee-sable-gauche"]').click();

     var rb = document.querySelector('#reservationCompetitionChampion').click();
     var race = document.querySelector('#race');
     console.log(race);
     var pony = race.querySelector('optgroup[label="Пони"]');
     console.log(pony);
     $("#race [value='76']").attr("selected", "selected");
     var name_scatch = document.getElementById('nom').value = 'Dead grates';
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