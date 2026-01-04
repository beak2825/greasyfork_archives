// ==UserScript==
// @name         [Neopets] Grumpy Old King and Wise Old King Randomizer
// @namespace    https://greasyfork.org/en/scripts/447682
// @version      0.4.2
// @description  Sets avatar joke for Skarl, randomized answers for Skarl and Hagan. Now only randomizes if you click the Randomize! button
// @author       Piotr Kardovsky
// @match        http*://www.neopets.com/medieval/grumpyking.phtml
// @match        http*://neopets.com/medieval/grumpyking.phtml
// @match        http*://www.neopets.com/medieval/wiseking.phtml
// @match        http*://neopets.com/medieval/wiseking.phtml
// @icon         https://www.neopets.com//favicon.ico
// @grant        GM.getValue
// @grant        GM.setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447682/%5BNeopets%5D%20Grumpy%20Old%20King%20and%20Wise%20Old%20King%20Randomizer.user.js
// @updateURL https://update.greasyfork.org/scripts/447682/%5BNeopets%5D%20Grumpy%20Old%20King%20and%20Wise%20Old%20King%20Randomizer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Set to true to randomize joke instead of using avatar joke
    let A_JOKE = GM.getValue('np_kswhaj', true).then( (np_kshwaj) => {
        A_JOKE = np_kshwaj;
    });
    // Default refresh-randomize behavior
    let RF_RD = GM.getValue('np_kswhar', true).then((np_kswhar) => {
        RF_RD = np_kswhar;
    });

    // rando function
    var newr = (l) => { return 1 + Math.floor(Math.random() * (l - 1)); }
    const AV = [3, 8, 6, 1, 39, 118, 1, 32, 1, 143];
    let grump = window.location.href.includes('/grumpyking.phtml');
    let rdgn = () => {
        document.querySelectorAll('.form-container__2021 select').forEach((j, idx) => {
            j.selectedIndex = j.id[0] === 'q' ? A_JOKE === true ? grump ? AV[idx] : newr(j.length) : newr(j.length) : newr(j.length);
        });
    }
    // randomize on reload
    window.addEventListener('load', () => { if (RF_RD === true) { rdgn(); } });

    // Making some buttons
    let rBtn = document.createElement('button');
    rBtn.classList.add("button-default__2020", "button-blue__2020");
    rBtn.innerText = "Randomize!";
    rBtn.type = "button";
    rBtn.value = "rnd";
    rBtn.addEventListener('click', () =>{ rdgn(); });

    let rTellBtn = document.createElement('button');
    rTellBtn.classList.add("button-default__2020", "button-green__2020");
    rTellBtn.innerText = `Randomize and ${grump ? "tell the King" : "impress the King"}!`;
    rTellBtn.type = "button";
    rTellBtn.value = "rndTell";
    rTellBtn.addEventListener('click', () =>{ rdgn(); document.querySelector('button[type="submit"]').click()});

    document.querySelector(".button-grid2__2020").append(rTellBtn);
    document.querySelector(".button-grid2__2020").append(rBtn);

    let rfrd = document.createElement('input');
    let rfrdLabel = document.createElement('label');
    rfrdLabel.innerText = "Randomize on refresh";
    rfrd.type = "checkbox";
    rfrd.checked = GM.getValue('np_kswhar', true).then((np_kswhar) => {
        rfrd.checked = np_kswhar;
    });
    rfrd.addEventListener('change', () => {GM.setValue("np_kswhar", rfrd.checked);});
    document.querySelector(".button-grid2__2020").appendChild(rfrdLabel);
    rfrdLabel.prepend(rfrd);

    if (grump) {
        let useAVJ = document.createElement('input');
        let useAVJLabel = document.createElement('label');
        useAVJLabel.innerText = "Use avatar joke";
        useAVJ.type = "checkbox";
        useAVJ.checked = GM.getValue('np_kswhaj', true).then( (np_kshwaj) => {
            useAVJ.checked = np_kshwaj;
        });
        useAVJ.addEventListener('change', () => {GM.setValue("np_kswhaj", useAVJ.checked);});
        rBtn.parentNode.appendChild(useAVJLabel);
        useAVJLabel.prepend(useAVJ);
    }

})();