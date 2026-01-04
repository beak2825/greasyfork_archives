// ==UserScript==
// @name         Wonders Score Counters
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Counts the wonders score for each alliance by additionning the level of each wonders.
// @author       Draub
// @match        https://*.grepolis.com/game/*
// @run-at       document-end
// @icon         https://www.prod.antoinebouard.com/wondersscorecounters/wonders.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490655/Wonders%20Score%20Counters.user.js
// @updateURL https://update.greasyfork.org/scripts/490655/Wonders%20Score%20Counters.meta.js
// ==/UserScript==


(function() {
    'use strict';
    function countWondersScore() {
        // Tableau des points par niveau de merveilles
        const levelWondersScore = new Array(0,1,3,6,10,15,21,28,36,45,55);
        // Selection de l'écran des merveilles
        const wonderdiv = document.getElementsByClassName("world_wonders_info");
        // Sélection du tableau
        const table = wonderdiv[0].querySelector('table');

        /// Sélection de l'entête du tableau
        const headerRow = table.querySelector('thead tr');

        // Création d'une nouvelle cellule d'entête pour la colonne "Score"
        const scoreHeader = document.createElement('th');
        scoreHeader.textContent = 'Score';

        // Ajout de la classe "header_data" à la nouvelle cellule d'entête
        scoreHeader.classList.add('header_data');

        // Ajout de la nouvelle cellule d'entête à la fin de l'entête
        headerRow.appendChild(scoreHeader);


        // Sélection de toutes les lignes du tableau, sauf la première (entête)
        const rows = table.querySelectorAll('tbody tr');

        // Boucle sur chaque ligne du tableau
        rows.forEach(row => {
            // Récupération de la valeur de data-rank pour chaque ligne
            const rank = parseInt(row.getAttribute('data-rank'));

            // Sélection de toutes les colonnes de la ligne ayant l'attribut data-level
            const columnsWithDataLevel = row.querySelectorAll('td[data-level]');

            // Initialisation de la somme à 0
            let sum = 0;

            // Boucle sur chaque colonne avec data-level pour additionner leur valeur
            columnsWithDataLevel.forEach(column => {
                // Récupération de la valeur de data-level et conversion en entier
                const level = parseInt(column.getAttribute('data-level'));

                // Ajout de la valeur de data-level à la somme
                sum += levelWondersScore[level];
            });

            // Création d'une nouvelle colonne pour afficher le score
            const scoreColumn = document.createElement('td');
            scoreColumn.textContent = sum; // Ajout du score calculé dans la colonne

            // Ajout de la classe "score" à la nouvelle colonne
            scoreColumn.classList.add('score');

            // Ajout de la nouvelle colonne à la fin de la ligne actuelle
            row.appendChild(scoreColumn);
        });
    }

    function waitForKeyElements (
        selectorTxt,    /* Required: The jQuery selector string that
                            specifies the desired element(s).
                        */
        actionFunction, /* Required: The code to run when elements are
                            found. It is passed a jNode to the matched
                            element.
                        */
        bWaitOnce,      /* Optional: If false, will continue to scan for
                            new elements even after the first match is
                            found.
                        */
        iframeSelector  /* Optional: If set, identifies the iframe to
                            search.
                        */
    ) {
        var targetNodes, btargetsFound;

        if (typeof iframeSelector == "undefined")
            targetNodes     = $(selectorTxt);
        else
            targetNodes     = $(iframeSelector).contents ()
                                               .find (selectorTxt);

        if (targetNodes  &&  targetNodes.length > 0) {
            btargetsFound   = true;
            /*--- Found target node(s).  Go through each and act if they
                are new.
            */
            targetNodes.each ( function () {
                var jThis        = $(this);
                var alreadyFound = jThis.data ('alreadyFound')  ||  false;

                if (!alreadyFound) {
                    //--- Call the payload function.
                    var cancelFound     = actionFunction (jThis);
                    if (cancelFound)
                        btargetsFound   = false;
                    else
                        jThis.data ('alreadyFound', true);
                }
            } );
        }
        else {
            btargetsFound   = false;
        }

        //--- Get the timer-control variable for this selector.
        var controlObj = waitForKeyElements.controlObj  ||  {};
        var controlKey = selectorTxt.replace (/[^\w]/g, "_");
        var timeControl = controlObj [controlKey];

        //--- Now set or clear the timer as appropriate.
        if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
            //--- The only condition where we need to clear the timer.
            clearInterval (timeControl);
            delete controlObj [controlKey]
        }
        else {
            //--- Set a timer, if needed.
            if ( ! timeControl) {
                timeControl = setInterval ( function () {
                        waitForKeyElements (    selectorTxt,
                                                actionFunction,
                                                bWaitOnce,
                                                iframeSelector
                                            );
                    },
                    300
                );
                controlObj [controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj   = controlObj;
    }

    waitForKeyElements (
        ".world_wonders_info",
        countWondersScore
    );

})();
