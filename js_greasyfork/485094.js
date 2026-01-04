// ==UserScript==
// @name         Get name in random
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Get name in randomizer
// @author       TheGeogeo
// @match        https://fr.fantasynamegenerators.com/warhammer-noms-*.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485094/Get%20name%20in%20random.user.js
// @updateURL https://update.greasyfork.org/scripts/485094/Get%20name%20in%20random.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const newInputNameEl = document.createElement('input');
    newInputNameEl.type = "text";
    newInputNameEl.placeholder = "Que doit contenir le nom/prénom";

    const newBtnGoEl = document.createElement('input');
    newBtnGoEl.type = "button";
    newBtnGoEl.value = "GO";

    const newCheckBoxEl = document.createElement('input');
    newCheckBoxEl.type = "checkbox";
    newCheckBoxEl.name = "boygirl";
    newCheckBoxEl.checked = true;
    const newLabelBoyEl = document.createElement('label');
    newLabelBoyEl.innerHTML = "Boy/Girl";

    const newDivEl = document.createElement('div');
    newDivEl.setAttribute("id", "result2");
    newDivEl.setAttribute("bis_skin_checked", "1");

    document.addEventListener("DOMContentLoaded", (event) => {

        const nameGenEl = document.getElementById('nameGen');
        let resultEl = document.getElementById('result');
        const btnBoyEl = document.querySelector("#nameGen > input[type=button]:nth-child(2)")
        const btnGirlEl = document.querySelector("#nameGen > input[type=button]:nth-child(3)");

        nameGenEl.appendChild(newInputNameEl);
        nameGenEl.appendChild(newBtnGoEl);
        nameGenEl.appendChild(newCheckBoxEl);
        nameGenEl.appendChild(newLabelBoyEl);
        nameGenEl.appendChild(newDivEl);

        newBtnGoEl.addEventListener('click', (e) => {
            newBtnGoEl.disabled = true;
            go();
            newBtnGoEl.disabled = false;
        });

        let nameSaved = [];
        let countCurrentSaved = 0;

        const go = async () => {
            if (newInputNameEl.value === "") return;

            let btnEl = btnBoyEl;
            if (newCheckBoxEl.checked) btnEl = btnGirlEl;

            if (newCheckBoxEl.checked) await nameGen(); // nameGen() generate names param define girl
            else if (!newCheckBoxEl.checked) await nameGen(1); // nameGen() generate names param define girl

            while (true) {
                if (newInputNameEl.value === "") return;

                resultEl = await document.getElementById('result');
                let testStr = await checkStrInArr(resultEl.innerHTML.split("<br>"));

                if (testStr !== null) {
                    await nameSaved.push(testStr)

                    if (nameSaved.length > countCurrentSaved) {
                        newDivEl.innerHTML = nameSaved.join("<br>");
                        countCurrentSaved++;
                    }
                }

                if (newCheckBoxEl.checked) await nameGen(); // nameGen() generate names param define girl
                else if (!newCheckBoxEl.checked) await nameGen(1); // nameGen() generate names param define girl
                await new Promise(r => setTimeout(r, 50));
            }
        }

        const checkStrInArr = (arr) => {
            let returnStr = null;
            arr.forEach(str => {
                if (str.includes(newInputNameEl.value)) {
                    let alreadyExist = false;
                    nameSaved.forEach(str2 => {
                        if (str2 === str) {
                            alreadyExist = true;
                        }
                    });
                    if (!alreadyExist) returnStr = str;
                }
            });
            return returnStr;
        }

    });
})();

