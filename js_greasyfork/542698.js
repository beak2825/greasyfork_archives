// ==UserScript==
// @name         Add Button for Generating Functional Tests
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Adds a button on Atlassian Jira tickets to generate functional tests via an n8n workflow.
// @author       Jérémy STEPHAN
// @match        https://obat.atlassian.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542698/Add%20Button%20for%20Generating%20Functional%20Tests.user.js
// @updateURL https://update.greasyfork.org/scripts/542698/Add%20Button%20for%20Generating%20Functional%20Tests.meta.js
// ==/UserScript==

;(function () {
    'use strict'

    // Webhook n8n
    const POST_URL = 'https://n8n-ops.obat.fr/webhook/8f1c19dd-2c06-4305-b098-7b0833900225'

    function addButton() {
        const h2List = document.querySelectorAll('h2');
        h2List.forEach(h2 => {
            if (h2.textContent.includes('Couverture de Test')) {
    
                // Go up to the closest direct div container of the h2
                const closestBlock = h2.closest('div');
    
                // Go one level higher to get the main block containing the whole field
                const topBlock = closestBlock?.parentElement;
    
                if (!topBlock) return;
    
                // Prevent adding multiple buttons if already present
                if (topBlock.nextElementSibling?.classList?.contains('btn-generate-tests')) return;
    
                // Create the button element
                const button = document.createElement('button');
                button.textContent = '⚡ Générer les tests fonctionnels';
                button.className = 'btn-generate-tests css-1pxwk5s';
                button.style.marginTop = '10px';
                button.addEventListener('click', showModal);
    
                // Insert the button after the main block
                topBlock.after(button);
            }
        });
    }

    function getIssueKey() {
        const url = new URL(window.location.href);

        // 1. Check if selectedIssue is present in the URL parameters
        const selectedIssue = url.searchParams.get('selectedIssue');
        if (selectedIssue) return selectedIssue;

        // 2. Otherwise, get the last segment of the pathname
        const pathParts = url.pathname.split('/').filter(Boolean);
        const lastPart = pathParts[pathParts.length - 1];

        // 3. If the last segment matches the issue key format (e.g., ABC-123), return it
        if (/^[A-Z]+-\d+$/.test(lastPart)) return lastPart;

        // 4. If no issue key is found, return an empty string
        return '';
    }

    function showModal() {
        // Remove old modal if exists
        const oldModal = document.getElementById('fonctionnalTestModal')
        if (oldModal) oldModal.remove()

        const overlay = document.createElement('div')
        overlay.id = 'fonctionnalTestModal'
        overlay.style = `
	  position: fixed; top: 0; left: 0;
	  width: 100vw; height: 100vh;
	  background-color: rgba(0, 0, 0, 0.4);
	  display: flex; align-items: center; justify-content: center;
	  z-index: 9999;
	`

		const modal = document.createElement('div')
        modal.style = `
	  background-color: #fff; padding: 20px;
	  border-radius: 10px; min-width: 300px;
	  box-shadow: 0 0 10px rgba(0,0,0,0.25);
	`
		modal.innerHTML = `
	  <h3 style="margin-top: 0;">Générer les tests fonctionnels</h3>
	  <label>Projet :</label><br>
	  <select id="projet-select" style="width: 100%; margin-bottom: 10px;">
		  <option value="QA Devis/Factures">TCOR - QA Devis/Factures</option>
		  <option value="QA Planning & Calendrier">TPLA - QA Planning & Calendrier</option>
	  </select>
	  <label>Issue:</label><br>
	  <input type="text" id="url-suffix" style="width: 100%; margin-bottom: 15px;" value="${getIssueKey()}" />
	  <div style="text-align: right;">
		  <button id="generate-btn" style="margin-right: 10px;">Générer</button>
		  <button id="close-btn">Fermer</button>
	  </div>
	`
		overlay.appendChild(modal)
        document.body.appendChild(overlay)

        document.getElementById('close-btn').addEventListener('click', () => overlay.remove())

        document.getElementById('generate-btn').addEventListener('click', () => {
            const projet = document.getElementById('projet-select').value
            const suffix = document.getElementById('url-suffix').value
            const payload = { project: projet, issue: suffix }

            overlay.remove() // ferme modale principale

            // Création de la modale d'attente
            const waitingOverlay = document.createElement('div')
            waitingOverlay.id = 'modale-attente'
            waitingOverlay.style = `
		position: fixed; top: 0; left: 0;
		width: 100vw; height: 100vh;
		background-color: rgba(0, 0, 0, 0.4);
		display: flex; align-items: center; justify-content: center;
		z-index: 9999;
	  `

			const modalWaiting = document.createElement('div')
            modalWaiting.style = `
		background-color: #fff; padding: 20px;
		border-radius: 10px; min-width: 300px;
		box-shadow: 0 0 10px rgba(0,0,0,0.25);
		position: relative;
	  `
			modalWaiting.innerHTML = `
		<button id="btn-close-error" style="position: absolute; top: 5px; right: 10px; border: none; background: none; font-size: 18px; display: none; cursor: pointer;">🗙</button>
		<p id="waitMessage">Envoie de la demande à n8n en cours...</p>
	  `

			waitingOverlay.appendChild(modalWaiting)
            document.body.appendChild(waitingOverlay)

            const btnClose = document.getElementById('btn-close-error')
            btnClose.addEventListener('click', () => waitingOverlay.remove())

            fetch(POST_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
                .then(response => {
                const msg = document.getElementById('waitMessage')
                const btnClose = document.getElementById('btn-close-error')

                if (response.status === 200) {
                    msg.innerHTML = `
        ✅ La génération des tests fonctionnels est en cours.<br><br>
        Cela peut prendre plusieurs minutes.<br>
        Un message sera visible dans le canal Slack <a href="https://obat.slack.com/archives/C094Z9B0KRV" target="_blank">#ia-qa-tests-generator</a>.
      `
      btnClose.style.display = 'inline'
                } else {
                    msg.innerHTML = '⚠️ Erreur lors de la demande. Code retour : ' + response.status
                    btnClose.style.display = 'inline'
                }
            })
                .catch(error => {
                const msg = document.getElementById('waitMessage')
                const btnClose = document.getElementById('btn-close-error')
                msg.innerHTML = '❌ Une erreur est survenue :<br>' + error.message
                btnClose.style.display = 'inline'
            })


        })
    }

    const observer = new MutationObserver(() => {
        addButton()
    })
    observer.observe(document.body, { childList: true, subtree: true })
})()

