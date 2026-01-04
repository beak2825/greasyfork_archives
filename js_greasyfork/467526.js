// ==UserScript==
// @name         T-Rex utilities
// @namespace    Reycko.TRU
// @version      0.1
// @description  Utilities for elgoog t-rex
// @author       Reycko
// @match        https://elgoog.im/t-rex/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=elgoog.im
// @license      GNU
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467526/T-Rex%20utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/467526/T-Rex%20utilities.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function print(text) {
        console.log(text); // no more accidentally calling JS's print()
    }

    const debug = false;
    const r = window.Runner;
    const inst = r.instance_;
    const prot = r.prototype;
    const gameOverScr = prot.gameOver;
    let oldSpd;

    function setSpeed(speed) {
        inst.setSpeed(speed);
        if (debug) { print("Speed set to " + speed); }
    }

    function speedChange(event) {
        if (event.target.checked) {
            oldSpd = inst.currentSpeed;
            prot.gameOver = function () { };
            setSpeed(1000);
        } else {
            setSpeed(oldSpd);
            prot.gameOver = gameOverScr;
        }
    }

    const title = document.createElement('div');
    title.id = 'title';
    title.style.position = 'fixed';
    title.style.zIndex = '10000';
    title.style.bottom = '57%';
    title.style.left = '50%';
    title.style.fontSize = '20px';
    title.style.transform = 'translate(-50%, 57%)';
    title.style.display = 'flex';
    title.style.alignItems = 'center';
    title.style.justifyContent = 'center';
    title.innerText = 'T-REX UTILITIES';
    title.className = 'title';

    const checkboxContainer = document.createElement('div');
    checkboxContainer.style.position = 'fixed';
    checkboxContainer.style.bottom = '55%';
    checkboxContainer.style.left = '50%';
    checkboxContainer.style.transform = 'translate(-50%, 55%)';
    checkboxContainer.style.display = 'flex';
    checkboxContainer.style.alignItems = 'center';
    checkboxContainer.style.justifyContent = 'center';
    checkboxContainer.style.zIndex = '9999';

    const checkboxLabel = document.createElement('label');
    checkboxLabel.innerText = 'Speedhack';
    checkboxLabel.style.marginRight = '5px';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', speedChange);
    checkbox.style.marginRight = '5px';

    checkboxLabel.insertBefore(checkbox, checkboxLabel.firstChild);

    checkboxContainer.appendChild(checkboxLabel);
    document.body.appendChild(checkboxContainer);

    document.body.appendChild(title);
})();
