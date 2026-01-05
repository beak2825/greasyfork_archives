// ==UserScript==
// @name         JV Notes de test
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Affiche les notes des jeux sur la page de listing
// @author       Shuunen
// @match        http://www.jeuxvideo.com/tests/*/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29593/JV%20Notes%20de%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/29593/JV%20Notes%20de%20test.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // enlève la colonne de droite
    var col = document.querySelector('.col-right');
    if (col) {
        col.remove();
    }

    // resize la colonne principale
    col = document.querySelector('.col-main');
    if (col) {
        col.style.maxWidth = '100%';
    }

    // affiche les notes pour chaque jeux
    var jeux = document.querySelectorAll('.pres-item-jaq');

    jeux.forEach(function(jeu) {

        var url = jeu.querySelector('a').href;
        var content = jeu.querySelector('.mask-img');

        // enlève les notes déjà présentes
        content.querySelectorAll('.note').forEach(function(note) {
            note.remove();
        });

        fetch(url, {
            credentials: 'same-origin'
        }).then(function(response) {
            return response.text();
        }).then(function(html) {
            var htmlEl = document.createElement("div");
            htmlEl.innerHTML = html;
            var notes = htmlEl.querySelectorAll('.note');
            var note = '';
            if (!notes || !notes.length) {
                note = 'introuvable...';
            } else {
                note = parseInt(notes[0].innerText.split('/')[0]) + parseInt(notes[1].innerText.split('/')[0]);
                note = Math.round(note / 2);
            }
            var fontSize = parseInt((Math.log10(note)+'').split('.')[1].substr(0,2))*1.2 + 10;
            var color = (note > 15 ? 'crimson' : note > 12 ? 'navy' : 'gray');
            var newHtml = '<span class="note" style="font-size:'+ fontSize +'px; color: '+color+'; letter-spacing: -1px; white-space: nowrap; font-weight: 600; padding-left: 10px; margin-top: 15px; display: block; border-left: 4px solid;">';
            newHtml += '<strong>' + note + '</strong><small>&nbsp;/&nbsp;20</small>';
            newHtml += '</span>';
            content.innerHTML += newHtml;
        });

    });

})();