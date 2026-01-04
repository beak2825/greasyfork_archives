// ==UserScript==
// @name         QuickToolsSupport - Domilink
// @version      0.5.3
// @description  QoL for Domilink
// @author       BS
// @require      https://code.jquery.com/jquery-3.6.4.js
// @match        https://www.dicsit-hds.fr/*
// @match        https://www.dicsit-nds.fr/*
// @match        https://dicsit-nds.fr/*
// @match        https://dicsit-hds.fr/*
// @match        */Microsoins*
// @match        */Anthadine*
// @match        */Microsoins*
// @match        */Memorialis*
// @match        */Memorialis*
// @match        */Domilink*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/413260
// @downloadURL https://update.greasyfork.org/scripts/462408/QuickToolsSupport%20-%20Domilink.user.js
// @updateURL https://update.greasyfork.org/scripts/462408/QuickToolsSupport%20-%20Domilink.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
        // Variables
        var clientUrl = window.location.href.split("/")[0] + "/" +  window.location.href.split("/")[1] + "/" + window.location.href.split("/")[2] + "/" + window.location.href.split("/")[3] + "/";
        var discitFormationURL = window.location.href.split("/")[0] + "/" +  window.location.href.split("/")[1] + "/" + window.location.href.split("/")[2] + "/" + window.location.href.split("/")[3] + "/" + window.location.href.split("/")[4] + "/" + window.location.href.split("/")[5] + "/";
        var clientName = window.location.href.split("/")[3];

        // Liste des mots-clés à vérifier dans l'URL
        var keywords = ["Mobisoins.api", "Logiclic", "Create", "DomilinkCLIC", "PasswordDicsit", "CheckPassword"];

        // Vérifie si l'URL actuelle contient un des mots-clés
        if (keywords.some(keyword => window.location.href.includes(keyword))) {
            // Nothing
        } else {
            // Create "Mobisoins" Button
            var mobisoinsApiBT = document.createElement('div');
            mobisoinsApiBT.id = 'mobisoinApiBTID';

            // Aappend to version
            // DomilinkFormation ?
            if (window.location.href.includes("Formation/F1")) {
                mobisoinsApiBT.innerHTML = '<a href="'+ discitFormationURL +'Mobisoins.api" target="_blank">Mobisoins API</a>';
                document.body.appendChild(mobisoinsApiBT);
            } else {
                mobisoinsApiBT.innerHTML = '<a href="'+ clientUrl +'Mobisoins.api" target="_blank">Mobisoins API</a>';
                document.body.appendChild(mobisoinsApiBT);
            }

            // CSS
            GM_addStyle(" #mobisoinApiBTID { font-size: smaller; color: gray; position: fixed; bottom: 40px; left: 5px; cursor: pointer; text-align: right; box-shadow: 1px -1px 5px rgba(0, 0, 0, 0.20); padding: 1px 4px; }");
            console.log("[Q.DomiTools] Create Mobisoins Button");
        }

        // #divcontenufieldFenPerso
        // #divcontenufieldFenPerso
        if (window.location.href.includes("Droits")) {
            console.log("yes");
                // Create "Afficher tout les droits" Button
                var droitsBT = document.createElement('div');

                // Give ID, function, append
                droitsBT.id = 'showRightsBTID';
                droitsBT.addEventListener("click", afficherTout, false);
                droitsBT.innerHTML = '<p>Afficher tous les droits</p>';
                document.body.appendChild(droitsBT);

                // CSS
                GM_addStyle(" #showRightsBTID { font-size: 10px; width: 120px; color: gray; position: fixed; bottom: 0; left: 50%; cursor: pointer; text-align: center; box-shadow: 1px -1px 5px rgba(0, 0, 0, 0.20); padding: 1px 1px; }");
                GM_addStyle(" #showRightsBTID:hover { text-decoration: underline;)");
        } else {
            // Nothing
        }

        function afficherTout() {
            // Get all elements with the class "ui-tabs-panel"
            var tabs = document.getElementsByClassName("ui-tabs-panel");

            // Loop through each tab element
            for (var i = 0; i < tabs.length; i++) {
                // Find the element with the ID "divcontenufieldFenPerso" inside each tab
                var contenufield = tabs[i].querySelector("#divcontenufieldFenPerso");

                // If the element is found, modify its overflow style
                if (contenufield) {
                    contenufield.style.overflow = "visible";
                }
            }

            console.log("[Q.DomiTools] Open All Rights");
        }
        // CSS pour l'overlay et une classe spécifique au menu quand l'overlay est actif
        GM_addStyle(`
        .custom-menu-overlay-xyz123 {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 9998;
            display: none;
        }
        .menu-active-overlay {
            z-index: 9999 !important; /* Appliquer un z-index uniquement quand cette classe est active */
        }

        .ui-div-navigation li a.active,
        .ui-div-navigation li ul li a.active {
            background-color: #EAEAEA;
            color: #000000;
            font-weight: bold;
        }
    `);

        // Créer l'élément overlay avec une classe unique
        const overlay = document.createElement('div');
        overlay.className = 'custom-menu-overlay-xyz123';
        document.body.appendChild(overlay);

        // Fonction pour activer/désactiver l'overlay et appliquer le z-index au menu
        function toggleOverlay(show) {
            overlay.style.display = show ? 'block' : 'none';
            const menu = document.querySelector('.ui-div-navigation');
            if (menu) {
                if (show) {
                    menu.classList.add('menu-active-overlay');
                } else {
                    menu.classList.remove('menu-active-overlay');
                }
            }
        }

        // Écouter l'événement keydown pour détecter la pression de F8
        document.addEventListener('keydown', function(event) {
            // Vérifier si la touche F8 est pressée
            if (event.key === 'F8') {
                // Inverser l'état actuel de l'overlay
                const isOverlayVisible = overlay.style.display === 'block';
                toggleOverlay(!isOverlayVisible);
            }
        });

        // Fermeture de l'overlay lorsqu'on clique en dehors du menu
        overlay.addEventListener('click', function() {
            toggleOverlay(false);
            document.querySelectorAll('.ui-div-navigation li a').forEach(item => {
                item.classList.remove('active');
            });
        });
        // END
    });
})();