// ==UserScript==
// @name         Gdynianka Gamesense
// @namespace    http://tampermonkey.net/
// @version      2023-12-04
// @description  Gdynianka Gamesense Gaming
// @author       peony
// @match        https://testy.gdynianka.pl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gdynianka.pl
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487363/Gdynianka%20Gamesense.user.js
// @updateURL https://update.greasyfork.org/scripts/487363/Gdynianka%20Gamesense.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let areButtonsVisible = false;

    // Initialization
    if (document.getElementById('tryb_nauki')) {
        document.getElementById('tryb_nauki').value = '1';
        document.getElementById('ukryj_wstecz').value = '0';
        document.getElementById('wykryj_blur').value = '0';
    }


    const buttons = Array.from(document.getElementsByTagName('button'))
    buttons.forEach(btn => {
        if (btn.innerText == 'Wstecz') {
            btn.style.display = areButtonsVisible ? 'inline-block' : 'none';
            btn.style['margin-right'] = areButtonsVisible ? '10px' : '0px';
        }

        if (btn.innerText == 'Zobacz odpowiedź') {
            btn.style.display = 'none';
        }
    })

    const divs = Array.from(document.getElementsByClassName('list-group'))
    divs.forEach(div => {
        if (div.id.startsWith('odpowiedz')) {
            div.style.display = areButtonsVisible ? 'block' : 'none';
        }
    })

    document.addEventListener('keyup', e => {
        if (e.code == "ArrowUp") {
            areButtonsVisible = !areButtonsVisible

            const buttons = Array.from(document.getElementsByTagName('button'))
            buttons.forEach(btn => {
                if (btn.innerText == 'Wstecz') {
                    btn.style.display = areButtonsVisible ? 'inline-block' : 'none';
                    btn.style['margin-right'] = areButtonsVisible ? '10px' : '0px';
                }
            })

            const divs = Array.from(document.getElementsByClassName('list-group'))
            divs.forEach(div => {
                if (div.id.startsWith('odpowiedz')) {
                    div.style.display = areButtonsVisible ? 'block' : 'none';
                }
            })
        }

        if (e.code == "ArrowRight") {
            const sek = document.getElementById('sekundy')
            if (sek) {
                sek.value = parseInt(sek.value) + 10
            }
        }

        if (e.code == "ArrowLeft") {
            const sek = document.getElementById('sekundy')
            if (sek) {
                sek.value = parseInt(sek.value) - 10
            }
        }
    })
})();