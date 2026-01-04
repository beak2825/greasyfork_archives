// ==UserScript==
// @name         Valorant BPC Save Pls!
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a save and automatic load feature to the "Valorant Battlepass Calculator". Now, it can be used like a dashboard.
// @author       simondoesstuff
// @match        https://www.valorantbpc.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438856/Valorant%20BPC%20Save%20Pls%21.user.js
// @updateURL https://update.greasyfork.org/scripts/438856/Valorant%20BPC%20Save%20Pls%21.meta.js
// ==/UserScript==

'use strict';

window.addEventListener("load", function(event) {
    const calculatorDiv = $("#calculator");

    const saveButton = document.createElement("button");
    saveButton.innerText = 'Save';
    saveButton.classList.add('btn');
    saveButton.classList.add('btn-primary');
    saveButton.style.margin = '1rem 1rem 2rem 1rem';
    saveButton.onclick = () => onSave(saveButton);

    calculatorDiv.prepend(saveButton);

    loadFromStorage();


    function onSave(btn) {
        btn.innerText = 'D O N E';
        setTimeout(() => {btn.innerText = 'Save'}, 1500);

        let inputs = calculatorDiv.find('input');
        let correspondingValues = inputs.toArray().map(e => e.value);

        console.log(`Stored the following values:\n${JSON.stringify(correspondingValues, null, 2)}`);

        // now to store the values

        localStorage.setItem('formInputValues', JSON.stringify(correspondingValues));
    }


    function loadFromStorage() {
        let inputs = calculatorDiv.find('input');
        let correspondingValues = JSON.parse(localStorage.getItem('formInputValues'));

        inputs.toArray().forEach((e, i) => {
            let value = correspondingValues[i];

            if (value) {
                e.value = value;
            }

            e.focus();
        });

        // done loading values

        console.log(`Loaded the following values:\n${JSON.stringify(correspondingValues, null, 2)}`);
    }
});