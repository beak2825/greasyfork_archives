// ==UserScript==
// @name         Regex Converter
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Konvertuje DC regex na funkci pro konzoli a naopak.
// @author       MK
// @match        http://*
// @match        https://*
// @icon         https://lh3.googleusercontent.com/1UFqRHsobU1HVUElYoMEqwFG3jUTblA2xMuEbULMI8F4LYTyqrpe8QYKzrHZIGIUXE8AVHGvZtIa2czvutKDnoXM=s60
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/498158/Regex%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/498158/Regex%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Vytvoření kontejneru pro textová pole a tlačítka
    let container = document.createElement('div');
    container.setAttribute('id', 'container');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.left = '10px';
    container.style.backgroundColor = 'white';
    container.style.padding = '10px';
    container.style.border = '1px solid black';
    container.style.zIndex = '1000';
    document.body.appendChild(container);

    // Vytvoření textového pole pro vstup
    let inputField = document.createElement('textarea');
    inputField.setAttribute('id', 'jsInput');
    inputField.setAttribute('rows', '10');
    inputField.setAttribute('cols', '50');
    inputField.style.display = 'block';
    inputField.style.marginBottom = '10px';
    container.appendChild(inputField);

    // Vytvoření tlačítek
    let convertButton = document.createElement('button');
    convertButton.innerText = 'Console Function to DC Regex';
    convertButton.setAttribute('id', 'convertButton');
    convertButton.style.display = 'block';
    convertButton.style.marginBottom = '10px';
    container.appendChild(convertButton);

    let revertButton = document.createElement('button');
    revertButton.innerText = 'DC Regex to Console Function';
    revertButton.setAttribute('id', 'revertButton');
    revertButton.style.display = 'block';
    revertButton.style.marginBottom = '10px';
    container.appendChild(revertButton);

    // Vytvoření textového pole pro výstup
    let outputField = document.createElement('textarea');
    outputField.setAttribute('id', 'jsOutput');
    outputField.setAttribute('rows', '10');
    outputField.setAttribute('cols', '50');
    outputField.style.display = 'block';
    container.appendChild(outputField);

    // Funkce pro přeměnu kódu
    function convertCode() {
        let code = document.getElementById('jsInput').value;
        code = code.replace(/\s+/g, ' ').trim();
        code = code.replace(/console\.log/g, 'return');
        let convertedCode = '/.*/(' + code + ')';
        document.getElementById('jsOutput').value = convertedCode;
    }

    // Funkce pro zpětnou přeměnu kódu
    function revertCode() {
        let code = document.getElementById('jsInput').value;
        // Odebrání všeho mezi prvním a druhým lomítkem včetně lomítek samotných
        code = code.replace(/\/.*?\//, '');
        // Kontrola, jestli kód končí s "()" a dočasné odstranění, aby zůstaly po odstranění závorek kolem funkce
        let endsWithParens = code.endsWith('()');
        if (endsWithParens) {
            code = code.slice(0, -2); // Odebrání "()" z konce
        }
        // Odebrání závorek kolem funkce
        code = code.replace(/^\((.*)\)$/, '$1');
        // Nahrazení return na console.log s ohledem na závorky
        code = code.replace(/return\s+([^;]+);/g, 'console.log($1);');
        // Zpětné formátování kódu
        code = code.replace(/\s*;\s*/g, ';\n    ');
        code = code.replace(/function\s*\(\)\s*\{\s*/g, 'function() {\n    ');
        code = code.replace(/\s*\}$/g, '\n}');
        // Přidání "()" zpět na konec, pokud byly původně přítomny
        if (endsWithParens) {
            code += '()';
        }
        document.getElementById('jsOutput').value = code;
    }

    // Přiřazení funkcí k tlačítkům
    document.getElementById('convertButton').onclick = convertCode;
    document.getElementById('revertButton').onclick = revertCode;

})();