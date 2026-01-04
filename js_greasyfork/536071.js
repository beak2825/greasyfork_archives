// ==UserScript==
// @name         Sanuli Sanan Selvittäjä
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Näyttää oikean sanan Sanuli-pelissä.
// @author       @theyhoppingonme on Discord
// @match        https://sanuli.fi/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sanuli.fi
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536071/Sanuli%20Sanan%20Selvitt%C3%A4j%C3%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/536071/Sanuli%20Sanan%20Selvitt%C3%A4j%C3%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // määrittele toiminto
    const päivitäSana = () => {
        // etsi tallennetut tiedot pelistä
        const data = localStorage.getItem('game|"Classic"|"Common"|5');
        if (!data) return;
        // järjestä tiedot
        const peli = JSON.parse(data);
        // etsi sana
        const sana = peli.word.join('');
        // etsi putki
        const streak = peli.streak;
        // laita otsikko
        const otsikko = document.querySelector("h1.title");
        if (otsikko) {
            otsikko.style = "color: rgb(179, 64, 64);";
            otsikko.innerHTML = `SanuHack - Putki: ${streak} <h3>Sana: ${sana}</h3>`;
            if (!document.querySelector("h4#mark")) {
            const h4 = document.createElement('h4');
            h4.id = "mark";
            h4.innerHTML = `Tekijä: <a href="https://greasyfork.org/en/users/1426915">theyhoppingonme</a>`;
            h4.style = "color: rgb(183, 121, 39); position: absolute; top: 0; right: 0; margin: 10px;";
            document.body.appendChild(h4);
            }
        }
        // etsi selitys ja vaihda se
        const modal = document.querySelector("div.modal");
        if (modal) {
            modal.innerHTML = `
                <p>Sanuli Sanan Selvittäjä, Tekijä: <i>theyhoppingonme</i>.</p>
                <p>Linkki scriptiin: <a href="https://tinyurl.com/sanuliscript">tässä</a>.</p>
            `;
        }
    };

    setInterval(päivitäSana, 100); // päivitys 10 kertaa sekunnissa

})();
