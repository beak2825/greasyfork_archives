// ==UserScript==
// @name         Cita
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically select option with value "36" on specified page
// @author       Vladimir Bryksin
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500036/Cita.user.js
// @updateURL https://update.greasyfork.org/scripts/500036/Cita.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var NIE = "Y9651473C";
    var NAME = "VLADIMIR BRYKSIN";

    // Helper function to create a delay
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max-min + 1)) + max;
    }

    function selectOficina() {
        var selectElement = document.getElementById("sede");;
        if (selectElement && selectElement.value != "36") {
            selectElement.value = "36";
            selectElement.dispatchEvent(new Event('change'));
        }
    };

    function selectTramite() {
        var tramiteElement = document.getElementById("tramiteGrupo[0]");
        if (tramiteElement) {
            for (var i = 0; i < tramiteElement.options.length; i++) {
                if (tramiteElement.options[i].value === "4047") {
                    tramiteElement.selectedIndex = i;
                    break;
                }
            }
        }
    };

    function selectProvincia() {
        var provinciaElement = document.getElementById("form");
        if (provinciaElement) {
            for (var i = 0; i < provinciaElement.options.length; i++) {
                if (provinciaElement.options[i].text === "Madrid") {
                    provinciaElement.selectedIndex = i;
                    break;
                }
            }
        }
    };

    function inputNIE() {
        var input = document.getElementById("txtIdCitado");
        if (input) {
            input.value = NIE;
        }
    };

    function inputName() {
        var input = document.getElementById("txtDesCitado");
        if (input) {
            input.value = NAME;
        }
    };

    async function clickForward() {
        var buttonStep1 = document.getElementById("btnAceptar");
        if (buttonStep1) {
            sleep(getRandomNumber(1000, 2000));
            buttonStep1.click();
        }
        var buttonStep2 = document.getElementById("btnEntrar");
        if (buttonStep2) {
            await sleep(getRandomNumber(1000, 2000));
            buttonStep2.click();
        }
        var buttonStep3 = document.getElementById("btnEnviar");
        if (buttonStep3) {
            await sleep(getRandomNumber(1000, 2000));
            buttonStep3.click();
        }
    }

    async function checkCitaAccess() {
        if (window.location.href === "https://icp.administracionelectronica.gob.es/icpplustiem/acValidarEntrada"
            || window.location.href === "https://icp.administracionelectronica.gob.es/icpplustiem/acCitar") {
            if (document.body.innerText.includes("En este momento no hay citas disponibles")){
                var returnButton = document.getElementById("btnSubmit");
                if (returnButton) {
                    await sleep(getRandomNumber(5000, 10000));
                    returnButton.click();
                }
                var salirButton = document.getElementById("btnSalir");
                if (salirButton) {
                    await sleep(getRandomNumber(50000, 100000));
                    salirButton.click();
                }
            } else if (!document.body.innerText.includes("de las siguientes opciones")) {
                window.open("https://google.com", '_blank');
                await sleep(getRandomNumber(50000, 100000));
            }
        }
    }

    async function initialize() {
        selectProvincia();
        selectOficina();
        selectTramite();
        inputNIE();
        inputName();
        await checkCitaAccess();
        await clickForward();
    }

    window.onload = initialize;
})();
