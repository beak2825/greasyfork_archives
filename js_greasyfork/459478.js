// ==UserScript==
// @name         Same Day Reservation - Pass Annuel
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  On DLP Annual Pass website you can't make reservations for the same day. Now you can.
// @author       Msama#0001
// @match        https://pass-annuel.disneylandparis.com/module.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=disneylandparis.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459478/Same%20Day%20Reservation%20-%20Pass%20Annuel.user.js
// @updateURL https://update.greasyfork.org/scripts/459478/Same%20Day%20Reservation%20-%20Pass%20Annuel.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let today = new Date()
    var calendar = document.querySelectorAll('#step-calendar')[0];
    var days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    var months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    var fulldate = days[today.getDay()] + " " + today.getDate() + " " + months[today.getMonth()] + " " + today.getFullYear();
    today = today.toISOString().split('T')[0];
    calendar.innerHTML = '<h3 class="calendar" style="padding-bottom:25px"><a id="date-' + today + '" data-date="' + today + '" data-date-txt="' + fulldate + '" class="open m-button" data-infos="</br></br><strong>Voir page suivante.|||<span class=\'is-soldout\' > ATTENTION ! Une réservation pour le jour même ne pourra pas être annulée</span>">Réserver pour aujourd\'hui</a></h3>' + calendar.innerHTML;
})();