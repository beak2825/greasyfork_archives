// ==UserScript==
// @name         BetterMoodle (Dcode feature)
// @namespace    http://tampermonkey.net/
// @version      v0.2
// @description  Calcul des matrices de Moodle automatiquement
// @author       Noann
// @match        https://www.dcode.fr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dcode.fr
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511974/BetterMoodle%20%28Dcode%20feature%29.user.js
// @updateURL https://update.greasyfork.org/scripts/511974/BetterMoodle%20%28Dcode%20feature%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -------------------------------------------- dcode --------------------------------------------
    // Fonction sleep
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const all = window.location.href.replace("https://www.dcode.fr/","");
    const type = all.split("?")[0];

    if (all.includes("?")){
        sleep(1000).then(() => {

            // ---------------------- Get data ----------------------
            // Get the current link
            var link = window.location.href;

            link = ((link.replace(`https://www.dcode.fr/${type}?`,"")).replaceAll("%2C", ",")).split(",");
            var nbLignes = link[0]
            var nbCols = link[1]
            link.shift()
            link.shift()
            // console.log(link);

            // ---------------------- Matrix size ----------------------
            var options = document.querySelector("td[class='options'] div");

            if (type == "determinant-matrice") {
                options = document.querySelectorAll("td[class='options'] div")[document.querySelectorAll("td[class='options'] div").length - 1];
            }
            // Pour avoir le bon nombre de lignes
            options.childNodes[1].value = nbLignes

            // Pour avoir le bon nombre de colonnes
            options.childNodes[4].value = nbCols

            // Pour valider la taille et mettre full 0
            options.childNodes[7].click()
            options.childNodes[9].click()

            // ---------------------- Fill matrix ----------------------
            // Pour lire la valeur de la case 'X'
            // document.querySelector("input[data-index='X']").value

            // Pour remplir la matrice (uniquement visuel)
            var CaseCount = 0;
            console.log(link);
            for (let col = 0; col < nbCols; col++) {
                for (let li = 0; li < nbLignes; li++) {
                    if (type == "determinant-matrice") {
                        try {
                            document.querySelectorAll(`input[data-index='${CaseCount}']`)[document.querySelectorAll(`input[data-index='${CaseCount}']`).length - 1].value = link[CaseCount] // futur matrice
                            // console.log(document.querySelectorAll(`input[data-index='${CaseCount}']`));
                        }
                        catch (e) {
                            console.log("Visual issue : " + e);
                        }
                    }
                    else {
                        document.querySelector(`input[data-index='${CaseCount}']`).value = link[CaseCount] // futur matrice
                    }
                    CaseCount++;
                }
            }

            // Pour remplir la matrice (uniquement pour l'api)
            var matrix = document.querySelector("input[name='matrix']").value;

            if (type == "determinant-matrice") {
                matrix = document.querySelectorAll("input[name='matrix']")[document.querySelectorAll("input[name='matrix']").length - 1].value;
            }

            let BeforeVal = matrix.slice(0, matrix.indexOf('[')+1);
            let AfterVal = matrix.slice(matrix.indexOf(']'), matrix.length);

            if (type == "determinant-matrice") {
                document.querySelectorAll("input[name='matrix']")[document.querySelectorAll("input[name='matrix']").length - 1].value = (BeforeVal + link.map((x) => String(x)) + AfterVal);
            }
            else {
                document.querySelector("input[name='matrix']").value = (BeforeVal + link.map((x) => String(x)) + AfterVal);
            }

        });

        // Pour cliquer sur calculer
        sleep(2000).then(() => {
            if (type == "determinant-matrice") {
                document.querySelectorAll("button[data-post='matrix']")[document.querySelectorAll("button[data-post='matrix']").length - 1].click();
            }
            else {
                document.querySelector("button[data-post='matrix']").click();
            }
        });
    }
})();