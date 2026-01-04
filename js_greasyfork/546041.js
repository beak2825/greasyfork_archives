// ==UserScript==
// @name         Pinterest Mass Deleter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Select and delete pins with modern panel and progress bar
// @author       HorrorAmphibian
// @icon         https://s.pinimg.com/webapp/favicon_48x48-7470a30d.png
// @match        https://www.pinterest.*/*
// @match        https://*.pinterest.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546041/Pinterest%20Mass%20Deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/546041/Pinterest%20Mass%20Deleter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let selectionMode = false;
    let selectedPins = new Set();

    // ---- Get CSRF token ----
    function getCSRFToken() {
        const match = document.cookie.match(/csrftoken=([^;]+)/);
        return match ? match[1] : null;
    }

    // ---- Create side panel ----
    function createPanel() {
        if (document.getElementById('massDeletePanel')) return;

        const panel = document.createElement('div');
        panel.id = 'massDeletePanel';
        panel.style.position = 'fixed';
        panel.style.top = '80px';
        panel.style.right = '20px';
        panel.style.width = '220px';
        panel.style.background = '#fff';
        panel.style.border = '1px solid #ccc';
        panel.style.borderRadius = '12px';
        panel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        panel.style.padding = '15px';
        panel.style.zIndex = 9999;
        panel.style.fontFamily = 'Arial, sans-serif';
        panel.style.display = 'flex';
        panel.style.flexDirection = 'column';
        panel.style.gap = '10px';

        const title = document.createElement('div');
        title.textContent = '📌 Pinterest Mass Deleter';
        title.style.fontWeight = 'bold';
        title.style.fontSize = '16px';
        title.style.textAlign = 'center';
        panel.appendChild(title);

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = 'Selection Mode: OFF';
        toggleBtn.style.background = '#e60023';
        toggleBtn.style.color = '#fff';
        toggleBtn.style.border = 'none';
        toggleBtn.style.borderRadius = '8px';
        toggleBtn.style.padding = '8px';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.addEventListener('click', () => {
            selectionMode = !selectionMode;
            toggleBtn.textContent = selectionMode ? 'Selection Mode: ON' : 'Selection Mode: OFF';
            if (!selectionMode) clearSelections();
        });
        panel.appendChild(toggleBtn);

        const counter = document.createElement('div');
        counter.id = 'selectedCounter';
        counter.textContent = 'Selected: 0';
        counter.style.textAlign = 'center';
        counter.style.fontWeight = 'bold';
        panel.appendChild(counter);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️ Delete Selected';
        deleteBtn.style.background = '#444';
        deleteBtn.style.color = '#fff';
        deleteBtn.style.border = 'none';
        deleteBtn.style.borderRadius = '8px';
        deleteBtn.style.padding = '8px';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.addEventListener('click', () => {
            if (selectedPins.size === 0) {
                alert("No pins selected.");
                return;
            }
            deletePinsAPI();
        });
        panel.appendChild(deleteBtn);

        document.body.appendChild(panel);
    }

    // ---- Update counter ----
    function updateCounter() {
        const counter = document.getElementById('selectedCounter');
        if (counter) counter.textContent = `Selected: ${selectedPins.size}`;
    }

    // ---- Toggle pin selection ----
    function togglePinSelection(pinCard) {
        const pinId = pinCard.getAttribute("data-test-pin-id");
        if (!pinId) return;

        if (selectedPins.has(pinId)) {
            selectedPins.delete(pinId);
            pinCard.style.outline = "";
        } else {
            selectedPins.add(pinId);
            pinCard.style.outline = "4px solid red";
        }

        updateCounter();
    }

    // ---- Clear selections ----
    function clearSelections() {
        document.querySelectorAll('[data-test-id="pin"]').forEach(el => el.style.outline = "");
        selectedPins.clear();
        updateCounter();
    }

    // ---- Create progress bar ----
    function createProgressBar(total) {
        let container = document.getElementById('deleteProgressContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'deleteProgressContainer';
            container.style.position = 'fixed';
            container.style.top = '20px';
            container.style.left = '50%';
            container.style.transform = 'translateX(-50%)';
            container.style.width = '300px';
            container.style.background = '#fff';
            container.style.border = '1px solid #ccc';
            container.style.borderRadius = '12px';
            container.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            container.style.padding = '10px';
            container.style.zIndex = 10000;
            container.style.fontFamily = 'Arial, sans-serif';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = '8px';

            const text = document.createElement('div');
            text.id = 'progressText';
            text.style.textAlign = 'center';
            text.style.fontWeight = 'bold';
            container.appendChild(text);

            const barContainer = document.createElement('div');
            barContainer.style.width = '100%';
            barContainer.style.height = '16px';
            barContainer.style.background = '#eee';
            barContainer.style.borderRadius = '8px';
            container.appendChild(barContainer);

            const bar = document.createElement('div');
            bar.id = 'progressBar';
            bar.style.width = '0%';
            bar.style.height = '100%';
            bar.style.background = '#e60023';
            bar.style.borderRadius = '8px';
            barContainer.appendChild(bar);

            document.body.appendChild(container);
        }
        document.getElementById('progressText').textContent = `Deleting 0 / ${total}`;
        document.getElementById('progressBar').style.width = '0%';
    }

    function updateProgress(deleted, total) {
        const text = document.getElementById('progressText');
        const bar = document.getElementById('progressBar');
        if (text && bar) {
            text.textContent = `Deleting ${deleted} / ${total}`;
            bar.style.width = `${(deleted / total) * 100}%`;
        }
    }

    function hideProgress() {
        const container = document.getElementById('deleteProgressContainer');
        if (container) container.remove();
    }

    // ---- Delete pins via API ----
    async function deletePinsAPI() {
        if (selectedPins.size === 0) return;

        const baseUrl = location.origin;
        const total = selectedPins.size;
        let deletedCount = 0;

        createProgressBar(total);

        for (const pinId of selectedPins) {
            try {
                const csrfToken = getCSRFToken();
                if (!csrfToken) {
                    alert("CSRF token not found. Refresh page and try again.");
                    hideProgress();
                    return;
                }

                const payload = new URLSearchParams();
                payload.append("source_url", location.pathname);
                payload.append("data", JSON.stringify({ options: { id: pinId }, context: {} }));

                const res = await fetch(`${baseUrl}/resource/PinResource/delete/`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Accept": "application/json, text/javascript, */*; q=0.01",
                        "x-csrftoken": csrfToken
                    },
                    body: payload
                });

                if (res.ok) {
                    deletedCount++;
                    const el = document.querySelector(`[data-test-pin-id="${pinId}"]`);
                    if (el) el.remove();
                } else {
                    console.warn(`Failed to delete ${pinId}`, await res.text());
                }

            } catch (err) {
                console.error("Error:", err);
            }

            updateProgress(deletedCount, total);
        }

        hideProgress();
        clearSelections();
        location.reload(); // Reload page after deletion
    }

    // ---- Attach pin click listener ----
    function attachPinClickListener() {
        document.body.addEventListener("click", (e) => {
            if (!selectionMode) return;
            const pinCard = e.target.closest('[data-test-id="pin"]');
            if (pinCard) {
                e.preventDefault();
                e.stopPropagation();
                togglePinSelection(pinCard);
            }
        }, true);
    }

    // ---- Initialize panel ----
    function initPanel() {
        if (!document.body) {
            setTimeout(initPanel, 500);
            return;
        }
        createPanel();
        attachPinClickListener();

        const observer = new MutationObserver(() => {
            if (!document.getElementById('massDeletePanel')) {
                createPanel();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    initPanel();

})();
