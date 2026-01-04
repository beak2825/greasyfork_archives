// ==UserScript==
// @name         [DC] Copy Paste All - Forum
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Ajoute un bouton "Tout copier" en haut à gauche de votre écran qui vous permet de copier tous les posts d'une page forum dans votre presse-papier.
// @author       Mnemoria
// @match        https://www.dreadcast.net/Forum/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/529290/%5BDC%5D%20Copy%20Paste%20All%20-%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/529290/%5BDC%5D%20Copy%20Paste%20All%20-%20Forum.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS personnalisé
    const styles = `
        .copier-bouton {
            cursor: pointer;
            color: white;
            font-size: 10px;
            left: 680px;
            top: 5px;
        }

        .copier-bouton:hover {
            background-color: black;
        }

        /* Style du bouton "Tout Copier" */
        #tout-copier-bouton {
            position: fixed;
            top: 10px;
            left: 10px;
            background-color: #007BFF;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 5px;
            font-size: 14px;
            cursor: pointer;
            z-index: 1000;
        }

        #tout-copier-bouton:hover {
            background-color: #0056b3;
        }
    `;

    // Ajouter le style au document
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Fonction pour ajouter le bouton "Tout Copier"
    function ajouterBoutonToutCopier() {
        if (document.getElementById('tout-copier-bouton')) return;

        let boutonToutCopier = document.createElement('button');
        boutonToutCopier.id = 'tout-copier-bouton';
        boutonToutCopier.textContent = 'Tout Copier';

        document.body.appendChild(boutonToutCopier);

        boutonToutCopier.addEventListener('click', function() {
            let texteTotal = "";

            document.querySelectorAll('.bandeau').forEach(function(bandeau) {
                let idMessage = bandeau.id.replace('bandeau_', '');

                // Récupérer le nom de l'auteur
                let auteurElement = document.querySelector(`#message_${idMessage}_auteur`);
                let auteurNom = auteurElement ? auteurElement.textContent.trim() : "Auteur inconnu";

                // Récupérer la date
                let descriptionElement = bandeau.querySelector('.description');
                let dateTexte = "Date inconnue";
                if (descriptionElement) {
                    let dateMatch = descriptionElement.textContent.match(/Posté le (.*?) à/);
                    if (dateMatch) {
                        let dateOriginale = dateMatch[1].trim();
                        const moisNumerique = {
                            "Janvier": "01", "Février": "02", "Mars": "03", "Avril": "04",
                            "Mai": "05", "Juin": "06", "Juillet": "07", "Août": "08",
                            "Septembre": "09", "Octobre": "10", "Novembre": "11", "Décembre": "12"
                        };
                        let [jour, moisTexte, annee] = dateOriginale.split(" ");
                        let mois = moisNumerique[moisTexte] || "00";
                        dateTexte = `PTI${jour.padStart(2, '0')}${mois}${annee}`;
                    }
                }

                // Récupérer le texte du message
                let zoneTexte = document.querySelector(`#message_${idMessage}_edit textarea`);
                let texteMessage = zoneTexte ? zoneTexte.value.trim() : "Message non trouvé";

                // Ajouter le message formaté à la sélection
                texteTotal += `[quote]${auteurNom} a écrit le ${dateTexte} :\n${texteMessage}\n[/quote]\n\n`;
            });

            // Copier au presse-papier
            if (texteTotal) {
                navigator.clipboard.writeText(texteTotal).then(function() {
                    alert('Tous les messages ont été copiés avec succès !');
                }).catch(function(err) {
                    console.error('Erreur de copie : ', err);
                });
            } else {
                alert('Aucun message trouvé à copier.');
            }
        });
    }

    // Ajouter le bouton "Tout Copier" après le chargement de la page
    window.addEventListener('load', ajouterBoutonToutCopier);
})();
