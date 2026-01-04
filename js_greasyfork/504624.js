// ==UserScript==
// @name         Portail Famille Colorblind
// @namespace    http://tampermonkey.net/
// @version      2024-08-22
// @description  Updates the colors in Portail Famille for colorblind people
// @author       @FredericEspiau
// @match        https://www.mon-portail-famille.fr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mon-portail-famille.fr
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504624/Portail%20Famille%20Colorblind.user.js
// @updateURL https://update.greasyfork.org/scripts/504624/Portail%20Famille%20Colorblind.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function runWhenReady(readySelector, callback) {
        var numAttempts = 0;
        var tryNow = function() {
            var elem = document.querySelector(readySelector);
            if (elem) {
                callback(elem);
            } else {
                numAttempts++;
                if (numAttempts >= 34) {
                    console.warn('Giving up after 34 attempts. Could not find: ' + readySelector);
                } else {
                    setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
                }
            }
        };

        tryNow();
    }

    const classNameToColor = [
        ['non-disponible', 'black'],
        ['disponible', 'blue'],
        ['reserve', 'orange'],
        ['complet', 'red'],
        ['demande', 'white'],
        ['refuse', 'grey'],
        ['annule', 'yellow'],
    ];

    const changeColors = () => {
        classNameToColor.forEach(([className, color]) => {
            const elem = document.querySelectorAll('.' + className);
            elem.forEach(_ => {
                _.style.background = color;
            });
        });
    }

    const addEventToButtons = () => {
        document.querySelectorAll('.pointer').forEach((_) => {
            _.addEventListener('click', () => {
                runWhenReady('case-planning-ecole.non-disponible', changeColors);
            });
        });
    }

    runWhenReady('case-planning-ecole.non-disponible', () => {
        addEventToButtons();
        changeColors();
    });
})();