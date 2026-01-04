// ==UserScript==
// @name         TMVN Club Economy
// @namespace    https://trophymanager.com
// @version      1
// @description  Trophymanager: represent economy in numbers
// @include      https://trophymanager.com/club/*
// @include      https://trophymanager.com/club/*/
// @exclude      https://trophymanager.com/club/
// @exclude      https://trophymanager.com/club/*/squad/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446121/TMVN%20Club%20Economy.user.js
// @updateURL https://update.greasyfork.org/scripts/446121/TMVN%20Club%20Economy.meta.js
// ==/UserScript==

(function () {
    'use strict';

    $(document).ready(function () {
        var clubInfoArr = $('#club_info div')[0].innerText.split('\n');
        var economy;
        for (var i = clubInfoArr.length - 1; i >= 0; i--) {
            if (clubInfoArr[i].trim().startsWith('Economy:')) {
                economy = clubInfoArr[i].replace('Economy:', '').trim();

                if (economy == 'Terrible') {
                    $('#club_info div')[0].innerHTML = $('#club_info div')[0].innerHTML.replace('Terrible', 'Terrible (less -150M)');
                } else if (economy == 'Grave') {
                    $('#club_info div')[0].innerHTML = $('#club_info div')[0].innerHTML.replace('Grave', 'Grave (-200M - -50M)');
                } else if (economy == 'Very poor') {
                    $('#club_info div')[0].innerHTML = $('#club_info div')[0].innerHTML.replace('Very poor', 'Very poor (-50M - 0)');
                } else if (economy == 'Poor') {
                    $('#club_info div')[0].innerHTML = $('#club_info div')[0].innerHTML.replace('Poor', 'Poor (0 - 5M)');
                } else if (economy == 'OK') {
                    $('#club_info div')[0].innerHTML = $('#club_info div')[0].innerHTML.replace('OK', 'OK (5M - 15M)');
                } else if (economy == 'Fine') {
                    $('#club_info div')[0].innerHTML = $('#club_info div')[0].innerHTML.replace('Fine', 'Fine (15M - 30M)');
                } else if (economy == 'Good') {
                    $('#club_info div')[0].innerHTML = $('#club_info div')[0].innerHTML.replace('Good', 'Good (30M - 75M)');
                } else if (economy == 'Really good') {
                    $('#club_info div')[0].innerHTML = $('#club_info div')[0].innerHTML.replace('Really good', 'Really good (75M - 150M)');
                } else if (economy == 'Wealthy') {
                    $('#club_info div')[0].innerHTML = $('#club_info div')[0].innerHTML.replace('Wealthy', 'Wealthy (150M - 250M)');
                } else if (economy == 'Rich') {
                    $('#club_info div')[0].innerHTML = $('#club_info div')[0].innerHTML.replace('Rich', 'Rich (250M - 400M)');
                } else if (economy == 'Very rich') {
                    $('#club_info div')[0].innerHTML = $('#club_info div')[0].innerHTML.replace('Very rich', 'Very rich (400M - 600M)');
                } else if (economy == 'Fantastically rich') {
                    $('#club_info div')[0].innerHTML = $('#club_info div')[0].innerHTML.replace('Fantastically rich', 'Fantastically rich (600M - 1B)');
                } else if (economy == 'Incredibly rich') {
                    $('#club_info div')[0].innerHTML = $('#club_info div')[0].innerHTML.replace('Incredibly rich', 'Incredibly rich (1B - 1.5B)');
                } else if (economy == 'Astonishingly rich') {
                    $('#club_info div')[0].innerHTML = $('#club_info div')[0].innerHTML.replace('Astonishingly rich', 'Astonishingly rich (more 1.5B)');
                } else {
                    console.log('Không xác định');
                }
                break;
            }
        }
    });
})();
