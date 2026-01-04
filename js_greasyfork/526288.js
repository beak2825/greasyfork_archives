// ==UserScript==
// @name         Erev - Auto click Fight Button
// @namespace    https://erevollution.com/
// @version      0.0.7
// @description  Clicks until stopped or energy < 1000
// @author       SkyIsTheLimit
// @match        https://www.erevollution.com/*/battlefield/*/*
// @match        https://www.erevollution.com/*/pvp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=erevollution.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526288/Erev%20-%20Auto%20click%20Fight%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/526288/Erev%20-%20Auto%20click%20Fight%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let lowerBound = 2100;
    let upperBound = 2800;
    let afInterval;

    let btnContent = document.createElement('div');
    btnContent.className = 'content';
    btnContent.id = 'af-btn-content';
    btnContent.textContent = 'AutoFight';

    let btnElem = document.createElement('button');
    btnElem.className = 'buttonT';
    btnElem.id = 'af-btn';
    btnElem.style = 'margin-left: 10px';
    btnElem.appendChild(btnContent);

    let battleCaptchaElem = document.getElementById('battleCaptcha');
    var battleCaptchaObserver = new MutationObserver(function(mutations) {
        if (battleCaptchaElem.style.display === 'none') {
            battleCaptchaObserver.disconnect();
            if (btnContent.textContent === 'AutoFight') {
                btnElem.click();
            }
        }
    });


    function randomTime(min, max) {
        return min + (max - min) * Math.random();
    }

    function clickButton() {
        if (btnContent.textContent === 'StopFight') {
            let energy = parseInt(document.getElementById("energyBarT").textContent.split(" / ")[0]);
            if (battleCaptchaElem.style.display === 'block') {
                battleCaptchaObserver.observe(battleCaptchaElem, { attributes : true, attributeFilter : ['style'] });
                stopAutoFight();
            } else if (energy < 1000) {
                stopAutoFight();
            } else {
                let fightBtn = document.getElementById("battleFight");
                if (fightBtn && fightBtn.text === 'Fight') {
                    fightBtn.click();
                }
            }
        }
    }

    (new MutationObserver(check)).observe(document, {childList: true, subtree: true});

    function check(_changes, pageLoadObserver) {
        if (document.querySelector('#battleFight')) {
            pageLoadObserver.disconnect();
            let he = document.querySelector("#content-wrapper > div > div > div > header");
            he.style ='display: flex';
            he.appendChild(btnElem);

            btnElem.onclick = function () {
                if (btnContent.textContent === 'AutoFight') {
                    btnContent.textContent = 'StopFight';
                    btnElem.className = 'buttonT cancel';
                    clickButton();
                    afInterval = setInterval(clickButton, randomTime(lowerBound, upperBound));
                } else {
                    stopAutoFight();
                }
            };
        }
    }

    function stopAutoFight() {
        if (afInterval) {
            clearInterval(afInterval);
        }
        btnContent.textContent = 'AutoFight';
        btnElem.className = 'buttonT';
    }

})();