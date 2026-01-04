// ==UserScript==
// @name         Add Button for Generating Acceptance Tests
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Add a button to Jira tickets to generate acceptance tests via an n8n workflow.
// @author       Jérémy STEPHAN
// @match        https://obat.atlassian.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542708/Add%20Button%20for%20Generating%20Acceptance%20Tests.user.js
// @updateURL https://update.greasyfork.org/scripts/542708/Add%20Button%20for%20Generating%20Acceptance%20Tests.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const POST_URL = 'https://n8n-ops.obat.fr/webhook/fcebecd5-7d68-44c5-8c2a-f6d7e321b977';

    function getStoryKey() {
        const url = new URL(window.location.href);
        const selectedIssue = url.searchParams.get('selectedIssue');
        if (selectedIssue) return selectedIssue;

        const pathParts = url.pathname.split('/').filter(Boolean);
        const lastPart = pathParts[pathParts.length - 1];
        if (/^[A-Z]+-\d+$/.test(lastPart)) return lastPart;

        return '';
    }

    function showModal() {
        let storyKey = getStoryKey();

        // Supprime ancienne modale si existante
        const oldModal = document.getElementById('acceptanceTestModal');
        if (oldModal) oldModal.remove();

        const overlay = document.createElement('div');
        overlay.id = 'acceptanceTestModal';
        overlay.style = `
            position: fixed; top: 0; left: 0;
            width: 100vw; height: 100vh;
            background-color: rgba(0,0,0,0.4);
            display: flex; align-items: center; justify-content: center;
            z-index: 9999;
        `;

        const modal = document.createElement('div');
        modal.style = `
            background-color: #fff; padding: 20px;
            border-radius: 10px; min-width: 350px;
            box-shadow: 0 0 10px rgba(0,0,0,0.25);
            position: relative;
        `;

        // Texte initial avec crayon et contentEditable
        modal.innerHTML = `
            <button id="closeAcceptanceModal" style="
                position: absolute; top: 5px; right: 10px;
                border: none; background: none; font-size: 18px; cursor: pointer;">🗙</button>
            <h3 style="margin-top:0;">Générer les tests d'acceptation</h3>
            <p id="story-text">
                Les tests seront générés pour la Story
                <b id="story-key" contenteditable="false" style="border-bottom: 1px dashed #999; padding: 2px 4px;">${storyKey}</b>
                <span id="edit-story" style="cursor: pointer; margin-left: 5px;">✏️</span>
            </p>
            <div style="text-align: center; margin-top: 15px;">
                <button id="generate-btn" class="aui-button aui-button-primary" style="width: 100%;">Générer</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Fermeture de la modale
        document.getElementById('closeAcceptanceModal').addEventListener('click', () => overlay.remove());

        // Crayon pour activer la modification
        const editIcon = document.getElementById('edit-story');
        const storyB = document.getElementById('story-key');
        editIcon.addEventListener('click', () => {
            storyB.contentEditable = "true";
            storyB.focus();

            // Valider avec Enter ou blur
            const saveStory = () => {
                storyB.contentEditable = "false";
                storyKey = storyB.textContent.trim() || storyKey;
            };
            storyB.addEventListener('blur', saveStory, { once: true });
            storyB.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    saveStory();
                }
            }, { once: true });
        });

        // Bouton Générer
        document.getElementById('generate-btn').addEventListener('click', () => {
            const btn = document.getElementById('generate-btn');
            btn.remove();
            modal.querySelector('p')?.remove();

            const statusMessage = document.createElement('p');
            statusMessage.innerText = 'Envoi de la demande au webhook...';
            modal.appendChild(statusMessage);

            fetch(POST_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ issue: storyKey }) // <-- clé reste "issue"
            })
                .then(res => {
                if (res.ok) {
                    statusMessage.innerHTML = `
                        ✅ La génération des tests d'acceptation est en cours.<br>
                        Cela peut prendre plusieurs secondes.<br>
                        Un message sera visible dans le canal Slack <a href="https://obat.slack.com/archives/C094Z9B0KRV" target="_blank">#ia-qa-tests-generator</a>.
                    `;
                } else {
                    statusMessage.innerText = '⚠️ Erreur lors de la demande : ' + res.status;
                }
            })
                .catch(err => {
                statusMessage.innerText = '❌ Erreur : ' + err.message;
            });
        });
    }

    function addButton() {
        const h2List = document.querySelectorAll('h2');
        h2List.forEach(h2 => {
            if (!h2.textContent.includes("Tests d'acceptance")) return;

            const closestBlock = h2.closest('div');
            const topBlock = closestBlock?.parentElement;
            if (!topBlock) return;

            if (topBlock.nextElementSibling?.id === 'btn-generate-acceptance') return;

            const button = document.createElement('button');
            button.id = 'btn-generate-acceptance';
            button.textContent = "⚡ Générer les tests d'acceptation";
            button.className = 'aui-button aui-button-primary';
            button.style.marginTop = '10px';
            button.addEventListener('click', showModal);

            topBlock.after(button);
            console.log('[Tampermonkey] Bouton de génération des tests d’acceptation ajouté');
        });
    }

    const observer = new MutationObserver(addButton);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', addButton);
})();
