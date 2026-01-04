// ==UserScript==
// @name         parici.Sopra.Steria.JS
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Amélioration de l'affichage de Pléiades (absences affichage annuel)
// @author       You
// @match        https://parici.soprasteria.com/*
// @grant        none
// @require https://greasyfork.org/scripts/394970-css-rules-utilities/code/CSS%20rules%20utilities.js?version=765728
// @downloadURL https://update.greasyfork.org/scripts/395211/pariciSopraSteriaJS.user.js
// @updateURL https://update.greasyfork.org/scripts/395211/pariciSopraSteriaJS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const modCss = [{
        "selectors": [
            "body",
            "[class^='PTitle']",
            "[class*='Bandeau']",
            "[class^='RoleActive']",
            "[class^='PWelcome']",
            ".TableContainerMiddleLeft",
            ".TableContainerMiddleRight",
            ".TableContainerTopLeft",
            ".TableContainerTopCenter",
            ".TableContainerTopRight",
            ".TableContainerBottomLeft",
            ".TableContainerBottomCenter",
            ".TableContainerBottomRight"
        ],
        "rule": { cssNormal: { "background": "none !important", "background-image": "none !important" } },
    }];
    const listOfFrames = [
        "ACCU",
        "BandeauSeparateur",
        "MENU",
        "rightFrame",
        "principal"
    ];
    const mutConfig = {
        childList: true, // si l’ajout ou la suppression des éléments enfants du nœud visé (incluant les nœuds de texte) sont à observer.
        attributes: false, // si les mutations d’attributs du nœud visé sont à observer.
        characterData: false, // si les mutation de texte du nœud visé sont à observer.
        subtree: true, // si les descendants du nœud visé sont également à observer.
        attributeOldValue: false, // si attributes est true et si la valeur des attributs avant mutation doit être enregistrée.
        characterDataOldValue: false, // si characterData est true et si la valeur des données avant mutation doit être enregistrée.
        //attributeFilter: [] // Spécifiez un tableau de noms d’attributs locaux (sans namespace) si vous souhaitez n’observer les mutations que sur une partie des attributs.
    };

    let observer = new MutationObserver((mutationsList) => {
        for(var mutation of mutationsList) {
            if (mutation.type == 'childList') {
                console.log('Un noeud enfant a été ajouté ou supprimé.');
            }
            else if (mutation.type == 'attributes') {
                console.log("L'attribut '" + mutation.attributeName + "' a été modifié.");
            }
            else if (mutation.type == 'subtree') {
                console.log(mutation);
            }
        }
    });

    for (let frame in listOfFrames) {
        let frameName = top.frames[frame].name,
            //frameWin = top.frames[frame].window,
            frameDoc = top.frames[frame].document;
        //frameBody = frameDoc.body;
        frameDoc.onreadystatechange = () => {
            if (frameDoc.readyState === "complete") {
                console.log(frameName);
                modCss.forEach(el => {
                    el.selectors.forEach(selector => {
                        let elements = frameDoc.querySelectorAll(selector);
                        for (let element of elements) {
                            modCssRules(element, el.rule, frameDoc);
                        }
                    })
                });
            }
        }
    }

    waitForKeyElements(".totalTable", table => survey(table));


    function survey(table) {
        console.log("TABLE SURVEILLEE : ", table);
        for (let row of table.rows) {

            observer.observe(row, mutConfig);

            for (let cell of row.cells) {
                if ((!cell.classList.contains('libelleMois')) && (!cell.classList.contains('libelleMoisAncien')) && (!cell.classList.contains('celluleApres'))) {
                    console.log(cell.id, cell);
                    let cellDate = cell.id.split("-")[0];
                    let yearNum = "",
                        monthNum = "",
                        dayNum = "";
                    for (let i = 0; i < cellDate.length; i++) {
                        if (i <= 3) {
                            yearNum += cellDate[i]
                        } else if (i >= 6) {
                            dayNum += cellDate[i]
                        } else {
                            monthNum += cellDate[i]
                        }
                    }
                    monthNum = parseInt(monthNum) - 1;
                    let date = new Date(yearNum, monthNum, dayNum),
                        shortDay = new Intl.DateTimeFormat('fr-FR', {
                            weekday: "short"
                        }).format(date),
                        longDay = new Intl.DateTimeFormat('fr-FR', {
                            weekday: "long"
                        }).format(date)
                    cell.classList.add('cellDay', longDay);
                    if ((date.getDay() === 6) || (date.getDay() === 0)) {
                        cell.classList.add("weekend")
                } else {
                    cell.classList.add("week")
                }

                    let dayDiv = document.createElement('DIV'),
                        content = document.createElement('DIV');
                    content.classList.add('cellContent');
                    content.appendChild(cell.childNodes[0]);
                    dayDiv.classList.add('dayName');
                    dayDiv.innerText = shortDay;
                    cell.appendChild(dayDiv);
                    cell.appendChild(content);
                };

                modCssRules(cell, {
                    cssNormal: {
                        border: "none"
                    }
                }, window);
            }
        }
    }
})();