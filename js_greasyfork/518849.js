// ==UserScript==
// @name         Change Color and Warn for Customer
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Change color, warn on close, and suggest name updates from forms with ignore functionality.
// @author       Swiftlyx
// @match        https://askcrew.zendesk.com/agent/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/518849/Change%20Color%20and%20Warn%20for%20Customer.user.js
// @updateURL https://update.greasyfork.org/scripts/518849/Change%20Color%20and%20Warn%20for%20Customer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 1 = ON (Enabled), 0 = OFF (Disabled)
    const CONFIG = {
        // Warning when trying to submit a ticket if the customer name is still default ('Customer').
        ENABLE_SUBMIT_WARNING: 1,

        // Popup suggestion to update name if a name is found in the chat form.
        ENABLE_NAME_SUGGESTION: 1
    };

    const CUSTOMER_DEFAULT_NAME = "Customer";
    const CUSTOMER_NAME_SELECTOR = "span[data-test-id='tabs-nav-item-users']";
    const SUBMIT_BUTTON_SELECTOR = "[data-test-id='submit_button-button'], [data-test-id='submit_button-menu-button']";
    const WARNING_MESSAGE = `Customer name is '${CUSTOMER_DEFAULT_NAME}'.\n\nHave you checked the chat for the real name?\n\nClick 'OK' to proceed, or 'Cancel' to stay and edit.`;

    const ignoredTickets = new Set();
    const warnedTickets = new Set();
    const ticketDataCache = {};
    const ticketDataPromises = {};
    const ticketDataResolvers = {};

    function getTicketData(ticketId) {
        if (ticketDataCache[ticketId]) {
            return Promise.resolve(ticketDataCache[ticketId]);
        }
        if (!ticketDataPromises[ticketId]) {
            ticketDataPromises[ticketId] = new Promise((resolve) => {
                ticketDataResolvers[ticketId] = resolve;
            });
        }
        return ticketDataPromises[ticketId];
    }

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        this._url = url;
        originalOpen.apply(this, arguments);
    };

    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
        this.addEventListener("load", function () {
            const url = this._url;
            if (url) {
                const ticketIdMatch = url.match(/\/api\/v2\/tickets\/(\d+)/);
                if (ticketIdMatch && this.readyState === 4 && this.status === 200) {
                    const ticketId = ticketIdMatch[1];
                    try {
                        const data = JSON.parse(this.responseText);
                        if (data && data.users && data.ticket) {
                            const ticketInfo = { users: data.users, ticket: data.ticket };
                            ticketDataCache[ticketId] = ticketInfo;

                            if (ticketDataResolvers[ticketId]) {
                                ticketDataResolvers[ticketId](ticketInfo);
                                delete ticketDataResolvers[ticketId];
                            }
                        }
                    } catch (e) {
                        console.error("Userscript: Error parsing XHR response data:", e);
                    }
                }
            }
        });
        originalSend.apply(this, arguments);
    };

    function getCurrentTicketId() {
        const match = window.location.pathname.match(/\/agent\/tickets\/(\d+)/);
        return match ? match[1] : null;
    }

    async function isCurrentTicketUserDefault() {
        const ticketId = getCurrentTicketId();
        if (!ticketId) return false;

        try {
            const { users, ticket } = await getTicketData(ticketId);
            if (!users || !ticket || !ticket.requester_id) return false;

            const requester = users.find(user => user.id === ticket.requester_id);
            if (!requester) return false;

            return requester.name.trim() === CUSTOMER_DEFAULT_NAME;
        } catch (error) {
            console.error("Userscript: Error checking ticket user:", error);
            return false;
        }
    }

    function changeNameColor() {
        const elements = document.querySelectorAll(CUSTOMER_NAME_SELECTOR);
        elements.forEach((element) => {
            if (element.textContent.trim().toLowerCase() === CUSTOMER_DEFAULT_NAME.toLowerCase()) {
                element.style.color = "red";
            } else {
                element.style.color = "green";
            }
        });
    }

    async function handleSubmitClick(event) {
        if (!CONFIG.ENABLE_SUBMIT_WARNING) return;

        const ticketId = getCurrentTicketId();
        if (ticketId && (ignoredTickets.has(ticketId) || warnedTickets.has(ticketId))) {
            return;
        }

        if (await isCurrentTicketUserDefault()) {
            warnedTickets.add(ticketId);
            if (!confirm(WARNING_MESSAGE)) {
                event.preventDefault();
                event.stopPropagation();
            }
        }
    }

    function attachWarningToSubmitButtons() {
        const submitButtons = document.querySelectorAll(SUBMIT_BUTTON_SELECTOR);
        submitButtons.forEach(button => {
            if (!button.dataset.warningListenerAttached) {
                button.addEventListener('click', handleSubmitClick);
                button.dataset.warningListenerAttached = 'true';
            }
        });
    }

    function createSuggestionModal() {
        if (document.getElementById('name-suggestion-modal')) return;

        const modalHTML = `
            <div id="name-suggestion-modal" class="modal-overlay" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Name Suggestion</h2>
                        <span class="close-button">&times;</span>
                    </div>
                    <div class="modal-body">
                        <p>The customer provided a name in the form:</p>
                        <p id="suggested-name" class="suggested-name-display"></p>
                        <p>Please consider updating the customer's profile.</p>
                    </div>
                    <div class="modal-footer">
                        <button id="ignore-suggestion-button" class="modal-button ignore">Ignore for this ticket</button>
                    </div>
                </div>
            </div>
        `;

        const modalStyle = `
            .modal-overlay { position: fixed; z-index: 10000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; }
            .modal-content { background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); width: 90%; max-width: 400px; font-family: sans-serif; }
            .modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px; }
            .modal-header h2 { margin: 0; font-size: 18px; color: #333; }
            .close-button { color: #aaa; font-size: 28px; font-weight: bold; cursor: pointer; }
            .close-button:hover { color: #000; }
            .modal-body p { margin: 10px 0; color: #555; }
            .suggested-name-display { font-weight: bold; background-color: #f0f8ff; color: #005a9e; padding: 10px; border-radius: 5px; text-align: center; font-size: 1.2em; }
            .modal-footer { text-align: right; margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; }
            .modal-button.ignore { background-color: #f44336; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-size: 14px; }
            .modal-button.ignore:hover { background-color: #d32f2f; }
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        GM_addStyle(modalStyle);

        const modal = document.getElementById('name-suggestion-modal');
        const closeButton = modal.querySelector('.close-button');
        const ignoreButton = document.getElementById('ignore-suggestion-button');
        const closeModal = () => modal.style.display = 'none';

        closeButton.onclick = closeModal;
        ignoreButton.onclick = () => {
            const ticketId = getCurrentTicketId();
            if (ticketId) {
                ignoredTickets.add(ticketId);
            }
            closeModal();
        };
        modal.onclick = (event) => {
            if (event.target === modal) {
                closeModal();
            }
        };
    }

    function showNameSuggestionModal(foundName) {
        const modal = document.getElementById('name-suggestion-modal');
        if (modal) {
            modal.querySelector('#suggested-name').textContent = foundName;
            modal.style.display = 'flex';
        }
    }

    async function checkForNameInForm() {
        if (!CONFIG.ENABLE_NAME_SUGGESTION) return;

        const ticketId = getCurrentTicketId();
        if (!ticketId || ignoredTickets.has(ticketId)) {
            return;
        }

        if (!(await isCurrentTicketUserDefault())) return;

        const activeTicketPane = document.querySelector('div[data-test-id^="ticket-"][data-is-active="true"]');
        if (!activeTicketPane || activeTicketPane.dataset.nameSuggestionShown === 'true') return;

        // Search specifically within the omni-log comment container provided by user
        const omniLogContainer = activeTicketPane.querySelector('div[data-test-id="omni-log-omni-to-ag-comment"]');
        if (!omniLogContainer) return;

        // Look for the specific structure: Label (.sc-11wpqtg-0) -> Value sibling
        const nameLabels = omniLogContainer.querySelectorAll('.sc-11wpqtg-0');
        let foundName = null;

        for (const label of nameLabels) {
            if (label.textContent.trim() === 'Name') {
                const valueDiv = label.nextElementSibling;
                if (valueDiv) {
                    const nameInForm = valueDiv.textContent.trim();
                    if (nameInForm && nameInForm.toLowerCase() !== CUSTOMER_DEFAULT_NAME.toLowerCase()) {
                        foundName = nameInForm;
                        break;
                    }
                }
            }
        }

        if (foundName) {
            showNameSuggestionModal(foundName);
            activeTicketPane.dataset.nameSuggestionShown = 'true';
        }
    }

    async function runUpdates() {
        changeNameColor();
        attachWarningToSubmitButtons();
        await checkForNameInForm();
    }

    createSuggestionModal();

    const observer = new MutationObserver(() => {
        runUpdates();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    runUpdates();
})();

