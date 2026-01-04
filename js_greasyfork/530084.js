// ==UserScript==
// @name         Discord Message Modifier (2 Modes)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Permet de modifier un message en deux modes : via API pour vos messages ou localement pour ceux d'une autre personne, via une popup personnalisée sombre et moderne.
// @author       Ezio
// @match        https://discord.com/channels/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530084/Discord%20Message%20Modifier%20%282%20Modes%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530084/Discord%20Message%20Modifier%20%282%20Modes%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Variable pour savoir si la sélection est activée
    let selectionEnabled = false;
    let currentMessageID = "";
    let currentMessageContent = "";
    let currentMessageElement = null; // Stocke l'élément cliqué

    // Création du bouton de basculement (ne pas modifier)
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "Activer la modification";
    toggleBtn.style.position = "fixed";
    toggleBtn.style.bottom = "20px";
    toggleBtn.style.right = "20px";
    toggleBtn.style.zIndex = "10000";
    toggleBtn.style.padding = "10px 20px";
    toggleBtn.style.fontSize = "14px";
    toggleBtn.style.border = "none";
    toggleBtn.style.borderRadius = "5px";
    toggleBtn.style.cursor = "pointer";
    toggleBtn.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
    toggleBtn.style.transition = "background 0.3s, transform 0.3s";
    toggleBtn.style.background = "linear-gradient(135deg, #7289da, #5b6eae)";
    toggleBtn.style.color = "#fff";
    toggleBtn.addEventListener("mouseover", () => {
        toggleBtn.style.transform = "scale(1.05)";
    });
    toggleBtn.addEventListener("mouseout", () => {
        toggleBtn.style.transform = "scale(1)";
    });
    toggleBtn.addEventListener("click", () => {
        selectionEnabled = !selectionEnabled;
        toggleBtn.textContent = selectionEnabled ? "Désactiver la modification" : "Activer la modification";
        toggleBtn.style.background = selectionEnabled
            ? "linear-gradient(135deg, #43b581, #1abc9c)"
            : "linear-gradient(135deg, #7289da, #5b6eae)";
    });
    document.body.appendChild(toggleBtn);

    // Création de la popup sombre et centrée
    const popupOverlay = document.createElement("div");
    popupOverlay.style.position = "fixed";
    popupOverlay.style.top = "0";
    popupOverlay.style.left = "0";
    popupOverlay.style.width = "100%";
    popupOverlay.style.height = "100%";
    popupOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    popupOverlay.style.display = "none";
    popupOverlay.style.justifyContent = "center";
    popupOverlay.style.alignItems = "center";
    popupOverlay.style.zIndex = "11000";

    const popupBox = document.createElement("div");
    popupBox.style.background = "#2f3136";
    popupBox.style.padding = "20px";
    popupBox.style.borderRadius = "8px";
    popupBox.style.boxShadow = "0 0 15px rgba(0,0,0,0.7)";
    popupBox.style.width = "400px";
    popupBox.style.maxWidth = "90%";
    popupBox.style.color = "#fff";
    popupBox.style.fontFamily = "Arial, sans-serif";
    popupBox.style.textAlign = "center";
    popupOverlay.appendChild(popupBox);

    // Titre de la popup
    const popupTitle = document.createElement("h3");
    popupTitle.textContent = "Modifier le message";
    popupTitle.style.marginTop = "0";
    popupTitle.style.marginBottom = "15px";
    popupBox.appendChild(popupTitle);

    // Zone de texte
    const inputArea = document.createElement("textarea");
    inputArea.style.width = "100%";
    inputArea.style.height = "100px";
    inputArea.style.marginBottom = "15px";
    inputArea.style.padding = "10px";
    inputArea.style.border = "none";
    inputArea.style.borderRadius = "4px";
    inputArea.style.fontSize = "14px";
    inputArea.style.background = "#202225";
    inputArea.style.color = "#dcddde";
    inputArea.style.resize = "vertical";
    popupBox.appendChild(inputArea);

    // Options de modification
    const optionsContainer = document.createElement("div");
    optionsContainer.style.marginBottom = "15px";
    optionsContainer.style.textAlign = "left";

    const apiOption = document.createElement("input");
    apiOption.type = "radio";
    apiOption.name = "modType";
    apiOption.value = "api";
    apiOption.id = "modApi";
    apiOption.checked = true;

    const apiLabel = document.createElement("label");
    apiLabel.textContent = "Modifier mon message (API)";
    apiLabel.htmlFor = "modApi";
    apiLabel.style.marginRight = "15px";

    const localOption = document.createElement("input");
    localOption.type = "radio";
    localOption.name = "modType";
    localOption.value = "local";
    localOption.id = "modLocal";

    const localLabel = document.createElement("label");
    localLabel.textContent = "Modifier localement (Autre)";
    localLabel.htmlFor = "modLocal";
    localLabel.style.color = "#f04747"; // couleur différente pour indiquer une modification locale

    optionsContainer.appendChild(apiOption);
    optionsContainer.appendChild(apiLabel);
    optionsContainer.appendChild(localOption);
    optionsContainer.appendChild(localLabel);
    popupBox.appendChild(optionsContainer);

    // Conteneur des boutons
    const buttonsContainer = document.createElement("div");
    buttonsContainer.style.display = "flex";
    buttonsContainer.style.justifyContent = "flex-end";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Annuler";
    cancelBtn.style.marginRight = "10px";
    cancelBtn.style.padding = "8px 16px";
    cancelBtn.style.border = "none";
    cancelBtn.style.borderRadius = "4px";
    cancelBtn.style.cursor = "pointer";
    cancelBtn.style.background = "#f04747";
    cancelBtn.style.color = "#fff";
    cancelBtn.style.fontSize = "14px";

    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = "Valider";
    confirmBtn.style.padding = "8px 16px";
    confirmBtn.style.border = "none";
    confirmBtn.style.borderRadius = "4px";
    confirmBtn.style.cursor = "pointer";
    confirmBtn.style.background = "#43b581";
    confirmBtn.style.color = "#fff";
    confirmBtn.style.fontSize = "14px";

    buttonsContainer.appendChild(cancelBtn);
    buttonsContainer.appendChild(confirmBtn);
    popupBox.appendChild(buttonsContainer);
    document.body.appendChild(popupOverlay);

    // Gestion des événements sur les messages si la modification est activée
    document.addEventListener('mouseover', function(e) {
        if (!selectionEnabled) return;
        const msgDiv = e.target.closest('div[id^="message-content-"]');
        if (msgDiv) {
            msgDiv.style.outline = "2px solid #7289da";
            msgDiv.style.cursor = "pointer";
        }
    });
    document.addEventListener('mouseout', function(e) {
        if (!selectionEnabled) return;
        const msgDiv = e.target.closest('div[id^="message-content-"]');
        if (msgDiv) {
            msgDiv.style.outline = "";
        }
    });
    document.addEventListener('click', function(e) {
        if (!selectionEnabled) return;
        const msgDiv = e.target.closest('div[id^="message-content-"]');
        if (msgDiv) {
            e.preventDefault();
            // Stocker l'élément cliqué, son ID et son contenu
            currentMessageElement = msgDiv;
            currentMessageID = msgDiv.id.replace("message-content-", "");
            currentMessageContent = msgDiv.innerText;
            inputArea.value = currentMessageContent;
            // Afficher la popup
            popupOverlay.style.display = "flex";
        }
    });

    // Bouton Annuler ferme la popup
    cancelBtn.addEventListener("click", () => {
        popupOverlay.style.display = "none";
    });

    // Bouton Valider traite la modification selon l'option choisie
    confirmBtn.addEventListener("click", () => {
        const newContent = inputArea.value.trim();
        if (!newContent || newContent === currentMessageContent) {
            popupOverlay.style.display = "none";
            return;
        }
        // Vérifier l'option sélectionnée
        const modType = document.querySelector('input[name="modType"]:checked').value;
        if (modType === "api") {
            // Modification via API pour "mon message"
            modifyMessage(currentMessageID, newContent);
        } else {
            // Modification locale pour le message d'une autre personne
            // On modifie uniquement le HTML affiché
            if (currentMessageElement) {
                currentMessageElement.innerHTML = `<span>${newContent}</span>`;
            }
        }
        popupOverlay.style.display = "none";
    });

    // Fonction d'envoi de la requête de modification via API
    async function modifyMessage(messageID, newContent) {
        const parts = window.location.pathname.split("/");
        const channelID = parts[3];
        try {
            await fetch("https://discord.com/api/v9/channels/" + channelID + "/messages", {
                "credentials": "include",
                "headers": {
                    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:136.0) Gecko/20100101 Firefox/136.0",
                    "Accept": "*/*",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Content-Type": "application/json",
                    "Authorization": "ODMwODU4NjMwMzE1Mzc2NzMw.GHLe_I.PSYBrtGR5-4mXyA_Z87EvM1WkhwvH6K9-7_L6g",
                    "X-Super-Properties": "eyJvcyI6IkxpbnV4IiwiYnJvd3NlciI6IkZpcmVmb3giLCJkZXZpY2UiOiIiLCJzeXN0ZW1fbG9jYWxlIjoiZW4tVVMiLCJoYXNfY2xpZW50X21vZHMiOmZhbHNlLCJicm93c2VyX3VzZXJfYWdlbnQiOiJNb3ppbGxhLzUuMCAoWDExOyBMaW51eCB4ODZfNjQ7IHJ2OjEzNi4wKSBHZWNrby8yMDEwMDEwMSBGaXJlZm94LzEzNi4wIiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTM2LjAiLCJvc192ZXJzaW9uIjoiIiwicmVmZXJyZXIiOiIiLCJyZWZlcnJpbmdfZG9tYWluIjoiIiwicmVmZXJyZXJfY3VycmVudCI6Imh0dHBzOi8vZGlzY29yZC5jb20vIiwicmVmZXJyZXJfY3VycmVudCI6Imh0dHBzOi8vZGlzY29yZC5jb20iLCJyZWxlYXNlX2NoYW5uZWwiOiJzdGFibGUiLCJjbGllbnRfYnVpbGRfbnVtYmVyIjozNzc5OTMsImNsaWVudF9ldmVudF9zb3VyY2UiOm51bGx9",
                    "X-Discord-Locale": "fr",
                    "X-Discord-Timezone": "Europe/Paris",
                    "X-Debug-Options": "bugReporterEnabled",
                    "Sec-GPC": "1",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin",
                    "Priority": "u=0"
                },
                "referrer": "https://discord.com/channels/@me/" + channelID,
                "body": "{\"mobile_network_type\":\"unknown\",\"content\":\"" + newContent + "\",\"nonce\":\"" + messageID + "\",\"tts\":false,\"flags\":0}",
                "method": "POST",
                "mode": "cors"
            });
        } catch (error) {
            console.error("Erreur lors de la requête :", error);
        }
    }
})();
