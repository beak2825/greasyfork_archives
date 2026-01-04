// ==UserScript==
// @name         ServiceNow Knowledge Record Reminder
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Rappel de remplir le champ "Knowledge Record" sur ServiceNow
// @author       Emir Tlich
// @match        https://servier2.service-now.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513917/ServiceNow%20Knowledge%20Record%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/513917/ServiceNow%20Knowledge%20Record%20Reminder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Créer un élément pour afficher le message
    var messageElement = document.createElement('div');
    messageElement.style.position = 'fixed';
    messageElement.style.top = '10px';
    messageElement.style.right = '10px';
    messageElement.style.backgroundColor = '#ffcccc'; // Fond rouge clair
    messageElement.style.color = 'red'; // Texte en rouge
    messageElement.style.padding = '10px';
    messageElement.style.border = '1px solid red';
    messageElement.style.borderRadius = '5px';
    messageElement.style.zIndex = '1000';
    messageElement.style.display = 'none'; // Cacher par défaut
    document.body.appendChild(messageElement);

    // Fonction pour vérifier le champ et afficher ou cacher le message
    function checkKnowledgeRecordField() {
        var knowledgeRecordField = document.querySelector('#sys_display\\.incident\\.u_knowledge_record');

        // Vérifiez si le champ existe
        if (knowledgeRecordField) {
            // Vérifiez si le champ est vide
            if (knowledgeRecordField.value.trim() === "") {
                messageElement.innerText = "Veuillez remplir le champ Knowledge Record avant de soumettre l'incident.";
                messageElement.style.display = 'block'; // Afficher le message
            } else {
                messageElement.style.display = 'none'; // Cacher le message si le champ est rempli
            }
        } else {
            console.warn("Le champ 'Knowledge Record' n'a pas été trouvé.");
        }
    }

    // Délai pour laisser la page se charger
    setTimeout(function() {
        // Appel initial pour vérifier le champ
        checkKnowledgeRecordField();
        
        // Vérification répétée toutes les 10 secondes
        setInterval(checkKnowledgeRecordField, 10000); // 10000 ms = 10 secondes
    }, 3000); // Délai initial pour laisser la page se charger
})();
