// ==UserScript==
// @name         See Safety Form
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Affiche un formulaire pour générer un titre selon les informations fournies, avec date formatée en JJ/MM/AAAA
// @author       achrqast
// @match        https://eu.ehs-amazon.com/actions/list/findings
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/516608/See%20Safety%20Form.user.js
// @updateURL https://update.greasyfork.org/scripts/516608/See%20Safety%20Form.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fonction pour initialiser le script
    function initScript() {
        // Vérifie si le bouton existe déjà pour éviter les doublons
        if (document.getElementById('seesafety-btn')) return;

        // Création du bouton
        const button = document.createElement('button');
        button.id = 'seesafety-btn';
        button.textContent = 'Safety Observation'; // Texte du bouton
        document.body.appendChild(button);

        // Création du formulaire
        const form = document.createElement('div');
        form.id = 'seesafety-form';
        form.innerHTML = `
            <h4>Informations pour le titre</h4>
            <label>Date: <input type="date" id="date"></label><br>
            <label>Time: <input type="time" id="time"></label><br>
            <label>Auditee Login: <input type="text" id="auditee"></label><br>
            <label>Second Observer: <input type="text" id="observer"></label><br>
            <label>Badge:
                <select id="badge">
                    <option value="AA">AA</option>
                    <option value="TA">TA</option>
                    <option value="DA">DA</option>
                    <option value="Contractor">Contractor</option>
                </select>
            </label><br>
            <label>Status:
                <select id="status">
                    <option value="At Risk">At Risk</option>
                    <option value="Positive">Positive</option>
                </select>
            </label><br>
            <label>Shift:
                <select id="shift">
                    <option value="Night">Night</option>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Day">Day</option>
                </select>
            </label><br>
            <label>Process:
                <select id="process">
                    <option value="Ambassadeur">Ambassadeur</option>
                    <option value="Containerization">Containerization</option>
                    <option value="Debriefer">Debriefer</option>
                    <option value="Loader">Loader</option>
                    <option value="Manager">Manager</option>
                    <option value="Ops sup">Ops sup</option>
                    <option value="Picker (route)">Picker (route)</option>
                    <option value="Picker to buffer">Picker to buffer</option>
                    <option value="Problem solver">Problem solver</option>
                    <option value="Pusher">Pusher</option>
                    <option value="Repacker">Repacker</option>
                    <option value="Scanner">Scanner</option>
                    <option value="Stager">Stager</option>
                    <option value="Stower">Stower</option>
                    <option value="Waterspider">Waterspider</option>
                    <option value="YM Truck">YM Truck</option>
                    <option value="Contractor">Contractor</option>
                </select>
            </label><br>
            <label>Rule: <input type="text" id="rule"></label><br>
            <label>Feedback:
                <select id="feedback">
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </label><br>
            <button id="generate-title">Générer le Titre</button>
            <button id="close-form">Fermer</button>
            <p style="font-size: 10px; text-align: right; color: grey;">@achrqast<br><span style="font-size: 9px;">get shit done</span></p>
        `;
        document.body.appendChild(form);

        // Style du bouton et du formulaire
        GM_addStyle(`
            #seesafety-btn {
                position: fixed;
                bottom: 10px;
                left: 10px;
                background-color: #4CAF50;
                color: white;
                border: none;
                padding: 15px;
                border-radius: 5px;
                cursor: pointer;
                z-index: 1000;
                font-family: Arial, sans-serif;
                font-size: 16px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                transition: background-color 0.3s;
            }

            #seesafety-btn:hover {
                background-color: #45a049;
            }

            #seesafety-form {
                position: fixed;
                bottom: 60px;
                left: 10px;
                width: 300px;
                max-height: 400px;
                overflow-y: auto;
                background-color: #f9f9f9;
                border: 1px solid #ddd;
                padding: 15px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                z-index: 1001;
                font-family: Arial, sans-serif;
                display: none;
            }
        `);

        // Afficher le formulaire lors du clic sur le bouton
        button.addEventListener('click', () => {
            form.style.display = 'block';
        });

        // Fermer le formulaire
        document.getElementById('close-form').addEventListener('click', () => {
            form.style.display = 'none';
        });

        // Fonction pour générer le titre
        function generateTitle() {
            let date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const auditee = document.getElementById('auditee').value;
            const observer = document.getElementById('observer').value;
            const badge = document.getElementById('badge').value;
            const status = document.getElementById('status').value;
            const shift = document.getElementById('shift').value;
            const process = document.getElementById('process').value;
            const rule = document.getElementById('rule').value;
            const feedback = document.getElementById('feedback').value;

            // Remplacer les tirets par des barres obliques dans la date
            date = date.replace(/-/g, "/");

            // Créer le titre selon le format demandé
            const title = `${date}|${time}|${auditee}|${observer}|${badge}|${status}|${shift}|${process}|${rule}|${feedback}`;

            // Copier le titre dans le presse-papiers
            GM_setClipboard(title);
            
            // Alerter l'utilisateur que le titre a été copié
            alert('Titre copié dans le presse-papiers : ' + title);
        }

        // Générer le titre au clic
        document.getElementById('generate-title').addEventListener('click', generateTitle);
    }

    // Exécute le script après le chargement complet du DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }

})();
