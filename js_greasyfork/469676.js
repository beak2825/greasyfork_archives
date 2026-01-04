// ==UserScript==
// @name         Calculatrice RotopServ.net
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fais le calcul automatiquement pour voter
// @match        https://www.rotopserv.net/serveurs/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469676/Calculatrice%20RotopServnet.user.js
// @updateURL https://update.greasyfork.org/scripts/469676/Calculatrice%20RotopServnet.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var labelElement = document.querySelector('label[for="question"]');
    console.log("Label element:", labelElement);
    var calcul = labelElement.textContent.trim();
    console.log("Calcul:", calcul);

    var regexChiffre = /(\d+|\b(zero|un|deux|trois|quatre|cinq|six|sept|huit|neuf|dix)\b)/gi;

    var chiffres = calcul.match(regexChiffre);
    console.log("Chiffres:", chiffres);

    if (chiffres === null || chiffres.length !== 2) {
        console.log("Nombre d'opérandes incorrect");
        return;
    }
    var operande1 = chiffreEnNombre(chiffres[0]);
    var operande2 = chiffreEnNombre(chiffres[1]);
    console.log("Opérande 1:", operande1);
    console.log("Opérande 2:", operande2);

    var operateur;
    if (calcul.includes("plus") || calcul.includes("+")) {
        operateur = '+';
    } else if (calcul.includes("moins") || calcul.includes("-")) {
        operateur = '-';
    } else if (calcul.includes("fois") || calcul.includes("multiplié par") || calcul.includes("*")) {
        operateur = '*';
    } else if (calcul.includes("divisé par")) {
        operateur = '/';
    } else {
        console.log("Opérateur non pris en charge");
        return;
    }
    console.log("Opérateur:", operateur);

    var expression = operande1 + operateur + operande2;
    var resultat = eval(expression);
    console.log("Résultat du calcul:", resultat);

    var inputElement = document.querySelector('input[name="answer"]');
    console.log("InputElement:", inputElement);

    inputElement.value = resultat;

    console.log("Résultat du calcul (dans la console):", resultat);

    function chiffreEnNombre(chiffre) {
        var nombresEnTexte = {
            zero: 0,
            un: 1,
            deux: 2,
            trois: 3,
            quatre: 4,
            cinq: 5,
            six: 6,
            sept: 7,
            huit: 8,
            neuf: 9,
            dix: 10
        };

        var nombre = nombresEnTexte[chiffre.toLowerCase()];
        if (nombre !== undefined) {
            return nombre;
        } else {
            return parseFloat(chiffre);
        }
    }
})();