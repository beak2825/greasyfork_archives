// ==UserScript==
// @name         PDFAid Zendesk and Solid Enhance
// @namespace    http://tampermonkey.net/
// @version      8.8
// @description  Enhance Zendesk with Solidgate avatar button (with brand switching), context menus, note buttons, service name in history, a copy message button, and card number highlighting. Adds channel highlighting and sticky "Liquid Glass" header in Solidgate.
// @author       Swiftlyx
// @match        https://*.zendesk.com/agent/*
// @match        https://*.solidgate.com/*
// @match        https://*.apps.zdusercontent.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @connect      self
// @connect      hub.solidgate.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522783/PDFAid%20Zendesk%20and%20Solid%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/522783/PDFAid%20Zendesk%20and%20Solid%20Enhance.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- START: Configuration Object ---
    const CONFIG = {
        // --- START: User Settings ---
        // Налаштування для ввімкнення/вимкнення функцій.
        // 1 = ввімкнено, 0 = вимкнено.
        SETTINGS: {
            // === Zendesk Features ===
            enableSolidgateButton: 1,
            // (Avatar -> Solidgate Button) Замінює аватар клієнта на кнопку Solidgate для швидкого доступу
            enableCopyMessageButton: 1,
            // (Copy Message Button) Додає кнопку "Copy" до повідомлень у тікеті
            enableNoteButtons: 1,
            // (Note Buttons) Додає кнопки (✅, ❌, 🔴...) у поле нотаток
            enableShortcutColoring: 1,
            // (Shortcut Coloring) Розфарбовує макроси (шорткати)
            autoUpdateNoteOnShortcutClick: 1,
            // (Shortcut Auto-Note) Автоматично додає "Verified" / "Not verified" у нотатки при кліку на шорткат
            enableHistoryNamer: 1,
            // (History Namer) Додає назву бренду (PDFAid, PDFHouse) до історії тікетів
            enableCardDigitsHighlighter: 1,
            // (Card Highlighter) Підсвічує зайві цифри в номерах карток
            hideZendeskAddressNotification: 1,
            // (Hide Notification) Приховує сповіщення "Select an Address:"
            replaceBrandCopyButtonWithReload: 1,
            // (Reload Button) Замінює кнопку "Copy" біля "Brand" на "Reload Apps"

            // === Solidgate Features ===
            enableSolidgateHeaderColoring: 1,
            // (Header Coloring) Змінює колір хедера Solidgate відповідно до бренду
            enableSolidgateDynamicTabTitle: 1,
            // (Dynamic Tab Title) Змінює заголовок вкладки Solidgate на email/карту
            highlightSolidgateChannels: 1,
            // (Channel Highlighter) Підсвічує канали (pdfaid, pdfhouse...)
            enableSolidgateLogHighlighter: 1,
            // (Log Highlighter) Підсвічує лог "subscription.restore"
            enableCancellationDateCopier: 1,
            // (Copy Cancellation Date) Додає кнопку "Copy" до дати скасування
            enableSolidgateStickyHeader: 1,
            // (Sticky Header) Робить хедер Solidgate "липким"
            enableSolidgateLiquidGlass: 1,
            // (Liquid Glass) Додає ефект блюр та прозорість до липкого хедера

            // === Other Features ===
            enableGlobalContextMenus: 1,
            // (Context Menus) Додає меню правої кнопки "Search in Solid" (тільки на Zendesk)
            enableTrustpilotFilter: 1,
            // (Trustpilot Filter) Фільтрує кнопки у додатку Trustpilot
            enableBrandFilter: 1,
            // (Brand Filter) Фільтр брендів у випадаючому списку (PDFAid, PDF House, Howly Docs)
            enableAutoReloadAndTake: 1,
            // (Auto Reload & Take) Автоматично натискає "Reload Apps" та "Take it" при виборі бренду
        },
        // --- END: User Settings ---

        SELECTORS: {
            // Zendesk
            messageBubble: '[data-test-id="omni-log-item-message"]',
            messageContent: '[data-test-id="omni-log-message-content"]',
            messageFlexContainer: '.sc-hcsjy3-0.ddcesT',
            avatar: 'figure[data-test-id="icon-avatar-test-id"]',
            notesTextarea: 'textarea[data-test-id="notes-edit-text-area-test-id"]',
            shortcutItem: '.sc-1nc17b4-0.gTfRJ',
            historyItem: 'li[data-customercontext-id="timeline.event"]',
            historyItemTitle: 'div[data-test-id="ticket-event-title-relative"]',
            cardComment: '[data-test-id="omni-log-omni-to-ag-comment"]',
            // --- START: NEW ---
            zendeskNotification: 'div[data-test-id="notification"]', // Загальний селектор для сповіщень
            zendeskBrandNameDisplay: '[data-test-id="ticket-system-field-brand-select"] [data-garden-id="typography.ellipsis"]', // Елемент, що показує назву бренду
            zendeskReloadAppsButton: 'div[data-test-id="sidebar-controls"] button', // Кнопка "Reload all apps"
            zendeskBrandCopyButton: '[data-test-id="ticket-system-field-brand-select"] + button[aria-label="Copy"]', // Кнопка "Copy" біля поля "Brand"
            zendeskBrandDropdown: 'ul[data-garden-id="dropdowns.combobox.listbox"]', // Випадаючий список брендів (ul)
            zendeskBrandOption: 'li[data-garden-id="dropdowns.combobox.option"]', // Опції брендів (li)
            zendeskTakeItButton: '[data-test-id="assignee-field-take-it-button"]', // Кнопка "take it"
            // --- END: NEW ---
            // Solidgate
            solidHeaderMenu: 'div._root_1ifco_1',
            solidHeaderNav: 'div._navigation_15csf_1',
            solidActiveBrand: 'div._activeName_ht7yz_15',
            solidHeaderMain: '._header_10cie_7',
            solidUserEmailValue: 'div[data-testid="user_email_value"]',
            solidUserEmailSpan: 'div[class*="_root_8z012_1"] span',
            solidLogItem: 'button[data-testid^="payment_logs_item-button"]',
            solidgateChannelCell: 'td[data-testid*="cell_channel"]',
            solidgateCancellationNotice: 'div._notification_16fag_30',
            // Trustpilot App
            trustpilotReviewButton: '.columns .aiButton',
        },
        API: {
            zendeskTicket: (origin, ticketId) => `${origin}/api/v2/tickets/${ticketId}.json`,
            solidgateSwitchAccount: 'https://hub.solidgate.com/grpc/solidgate.hub_bff.platform.settings.v1.UserSettingsService/BatchSetUserSettings',
        },
        URLS: {
            solidgateSubscriptions: (email) => `https://hub.solidgate.com/subscriptions/subscription?customer_email=${encodeURIComponent(email)}`,
            solidgatePaymentsByBin: (bin) => `https://canary.solidgate.com/payments/order?card_bin=${bin}`,
            solidgatePaymentsByLastFour: (lastFour) => `https://canary.solidgate.com/payments/order?card_last_four=${lastFour}`,
            solidgatePaymentsByBinAndLastFour: (bin, lastFour) => `https://canary.solidgate.com/payments/order?card_bin=${bin}&card_last_four=${lastFour}`,
            solidgatePaymentsByCardholder: (name) => `https://canary.solidgate.com/payments/order?cardholder_name=${encodeURIComponent(name)}`,
        },
        ACCOUNT_IDS: {
            pdfaid: 'e43174ae-3231-4283-8800-9d185a3dcf59',
            howly: 'eccc7c43-1105-4800-ad8f-66b7b955b963',
        },
        STATE: {
            processed: 'data-script-processed',
        },
        HISTORY_NAMER: {
            targetText: 'Conversation with',
            serviceMap: {
                'pdfaid': 'PDFAid',
                'pdfhouse': 'PDFHouse',
                'howly': 'Howly Docs'
            },
        },
    };
    // --- END: Configuration Object ---

    // --- START: Helper Functions ---
    function gmFetch(options) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                ...options,
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(response);
                    } else {
                        reject(response);
                    }
                },
                onerror: (response) => reject(response),
            });
        });
    }

    function setTemporaryButtonState(button, text, className, duration = 1500) {
        const originalText = button.textContent;
        button.textContent = text;
        if (className) button.classList.add(className);

        setTimeout(() => {
            button.textContent = originalText;
            if (className) button.classList.remove(className);
        }, duration);
    }
    // --- END: Helper Functions ---


    // --- START: Feature Modules ---

    const features = {
        copyButton: {
            init() {
                if (CONFIG.SETTINGS.enableCopyMessageButton !== 1) return;
                const style = document.createElement('style');
                style.innerHTML = `
                            .copy-message-btn {
                                position: absolute;
                                top: 4px;
                                right: 4px;
                                background: transparent;
                                border: none;
                                cursor: pointer;
                                color: #68737d; /* Zendesk gray */
                                opacity: 0;
                                transition: opacity 0.2s ease-in-out, color 0.2s;
                                padding: 4px;
                                border-radius: 4px;
                                z-index: 10;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }
                            .copy-message-btn:hover {
                                background-color: rgba(0,0,0,0.05); /* Light gray hover */
                                color: #2f3941; /* Dark gray active */
                            }
                            .copy-message-btn svg {
                                width: 18px;
                                height: 18px;
                                fill: currentColor; /* Inherit color from button */
                            }
                            .copy-message-btn.copied {
                                color: #28a745; /* Green */
                            }
                            /* Show button on hover of the message bubble */
                            [data-test-id="omni-log-item-message"]:hover .copy-message-btn {
                                opacity: 1;
                            }
                            /* Ensure relative positioning for the bubble so absolute works */
                            [data-test-id="omni-log-item-message"] {
                                position: relative !important;
                            }
                        `;
                document.head.appendChild(style);
            },
            process(element) {
                if (CONFIG.SETTINGS.enableCopyMessageButton !== 1) return;
                // Target the message bubble directly
                const messageBubble = element; // based on CONFIG.SELECTORS.messageBubble which matches data-test-id="omni-log-item-message"
                if (!messageBubble) return;

                // React re-render check
                if (messageBubble.querySelector('.copy-message-btn')) return;

                const messageContentContainer = element.querySelector(CONFIG.SELECTORS.messageContent);
                if (!messageContentContainer) return;

                const copyBtn = document.createElement('button');
                copyBtn.className = 'copy-message-btn';
                copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M120-220v-80h80v80h-80Zm0-140v-80h80v80h-80Zm0-140v-80h80v80h-80ZM260-80v-80h80v80h-80Zm100-160q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480Zm40 240v-80h80v80h-80Zm-200 0q-33 0-56.5-23.5T120-160h80v80Zm340 0v-80h80q0 33-23.5 56.5T540-80ZM120-640q0-33 23.5-56.5T200-720v80h-80Zm420 80Z"/></svg>';
                copyBtn.title = 'Copy message';

                copyBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const contentClone = messageContentContainer.cloneNode(true);
                    contentClone.querySelectorAll('button, a').forEach(el => {
                        if (['Show original', 'Show translation'].includes(el.textContent.trim())) {
                            el.remove();
                        }
                    });
                    const textToCopy = contentClone.innerText.trim();
                    try {
                        await navigator.clipboard.writeText(textToCopy);
                        copyBtn.classList.add('copied');

                        setTimeout(() => {
                            copyBtn.classList.remove('copied');
                        }, 2000);

                    } catch (err) {
                        console.error('Failed to copy text: ', err);
                        // Optional: show error state
                    }
                });

                messageBubble.appendChild(copyBtn);
            }
        },

        solidgateButton: {
            showError(button) {
                const originalColor = button.style.borderColor;
                button.style.borderColor = '#dc3545';
                setTimeout(() => { button.style.borderColor = originalColor; }, 1500);
            },
            async handleClick(e, button) {
                e.preventDefault();
                e.stopPropagation();

                const ticketIdMatch = window.location.pathname.match(/tickets\/(\d+)/);
                if (!ticketIdMatch) {
                    console.error('Solidgate Script: Could not find Ticket ID.');
                    this.showError(button);
                    return;
                }
                const ticketId = ticketIdMatch[1];
                const apiUrl = CONFIG.API.zendeskTicket(window.location.origin, ticketId) + '?include=users,brands';

                try {
                    const response = await gmFetch({ method: "GET", url: apiUrl });
                    const data = JSON.parse(response.responseText);
                    const user = data.users.find(u => u.id === data.ticket.requester_id);
                    const brand = data.brands?.[0];

                    if (!user?.email) {
                        throw new Error('Requester email not found.');
                    }

                    const targetAccountId = (brand?.name === 'Howly Docs') ? CONFIG.ACCOUNT_IDS.howly : CONFIG.ACCOUNT_IDS.pdfaid;

                    await gmFetch({
                        method: "POST",
                        url: CONFIG.API.solidgateSwitchAccount,
                        headers: { "Content-Type": "application/json" },
                        data: JSON.stringify({
                            userSettings: [{ key: "account.current_account_id", value: targetAccountId }]
                        }),
                    });

                    GM_openInTab(CONFIG.URLS.solidgateSubscriptions(user.email), { active: true });

                } catch (error) {
                    console.error('Solidgate Script: Action failed.', error);
                    this.showError(button);
                }
            },
            process(avatar) {
                if (CONFIG.SETTINGS.enableSolidgateButton !== 1) return;
                const parent = avatar.parentElement;
                if (!parent) return;

                const button = document.createElement('button');
                Object.assign(button.style, {
                    width: '32px', height: '32px', padding: '0', backgroundColor: '#ffffff',
                    border: '1px solid #ddd', borderRadius: '50%', cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out', backgroundImage: 'url(https://hub.solidgate.com/favicon.ico)',
                    backgroundSize: '18px 18px', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', flexShrink: '0'
                });

                button.addEventListener('mouseover', () => { button.style.transform = 'scale(1.1)'; button.style.borderColor = '#007bff'; });
                button.addEventListener('mouseout', () => { button.style.transform = 'scale(1.0)'; button.style.borderColor = '#ddd'; });
                button.addEventListener('click', (e) => this.handleClick(e, button));

                avatar.style.display = 'none';
                parent.insertBefore(button, avatar);
            }
        },

        noteButtons: {
            createButton(text, title, onClick) {
                const button = document.createElement('button');
                button.textContent = text;
                button.title = title;
                Object.assign(button.style, { border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px' });
                button.addEventListener('click', onClick);
                return button;
            },
            updateNote(textarea, newContent, isToggle = false) {
                const serviceMap = { 'PDFAid': '🔴', 'PDFHouse': '🟣', 'Howly Docs': '🔵' };
                const noteRegex = /(Verified ✅|Not verified ❌)(?:\s\[(.*?)\])?/;
                const match = textarea.value.match(noteRegex);

                let newValue;
                if (isToggle) {
                    const serviceString = `${newContent} ${serviceMap[newContent]}`;
                    if (match) {
                        const status = match[1];
                        let services = match[2] ? match[2].split(' + ') : [];
                        const serviceIndex = services.findIndex(s => s.includes(newContent));

                        if (serviceIndex > -1) services.splice(serviceIndex, 1);
                        else services.push(serviceString);

                        const newServicesStr = services.join(' + ');
                        const updatedNote = newServicesStr ? `${status} [${newServicesStr}]` : status;
                        newValue = textarea.value.replace(noteRegex, updatedNote);
                    }
                } else {
                    if (match) {
                        newValue = textarea.value.replace(noteRegex, `${newContent}${match[2] ? ` [${match[2]}]` : ''}`);
                    } else {
                        newValue = (textarea.value.trim() ? textarea.value + '\n' : '') + newContent;
                    }
                }

                if (newValue !== undefined) {
                    textarea.value = newValue;
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                }
            },
            process(textarea) {
                if (CONFIG.SETTINGS.enableNoteButtons !== 1) return;
                const container = textarea.parentElement;
                if (!container) return;

                let buttonContainer = container.querySelector('.note-buttons-container');
                if (buttonContainer) buttonContainer.remove();

                buttonContainer = document.createElement('div');
                buttonContainer.className = 'note-buttons-container';
                Object.assign(buttonContainer.style, {
                    position: 'absolute', bottom: '10px', left: '10px', display: 'flex', gap: '10px', zIndex: '10'
                });

                buttonContainer.appendChild(this.createButton('✅', 'Verified ✅', () => this.updateNote(textarea, 'Verified ✅')));
                buttonContainer.appendChild(this.createButton('❌', 'Not verified ❌', () => this.updateNote(textarea, 'Not verified ❌')));
                buttonContainer.appendChild(this.createButton('🔴', 'PDFAid', () => this.updateNote(textarea, 'PDFAid', true)));
                buttonContainer.appendChild(this.createButton('🟣', 'PDFHouse', () => this.updateNote(textarea, 'PDFHouse', true)));
                buttonContainer.appendChild(this.createButton('🔵', 'Howly Docs', () => this.updateNote(textarea, 'Howly Docs', true)));

                container.style.position = 'relative';
                container.appendChild(buttonContainer);
            }
        },

        shortcutColoring: {
            process(item) {
                if (CONFIG.SETTINGS.enableShortcutColoring !== 1) return;
                const text = item.textContent.trim().toLowerCase();
                if (text.includes('general verification confirmed')) {
                    item.style.backgroundColor = 'lightgreen'; item.style.color = 'black';
                } else if (text.includes('general verification failed')) {
                    item.style.backgroundColor = 'orange'; item.style.color = 'white';
                } else if (text.match(/\baid\b/)) {
                    item.style.backgroundColor = '#fc8c88'; item.style.color = 'white';
                } else if (text.includes('house')) {
                    item.style.backgroundColor = '#5643d6'; item.style.color = 'white';
                } else if (text.includes('hdocs')) {
                    item.style.backgroundColor = '#0f72ff'; item.style.color = 'white';
                }
            },
            init() {
                document.body.addEventListener('click', (event) => {
                    const shortcut = event.target.closest(CONFIG.SELECTORS.shortcutItem);
                    if (!shortcut) return;

                    const text = shortcut.textContent.toLowerCase();
                    const textareas = document.querySelectorAll(CONFIG.SELECTORS.notesTextarea);
                    let status;
                    if (text.includes('general verification confirmed')) status = 'Verified ✅';
                    else if (text.includes('general verification failed')) status = 'Not verified ❌';

                    if (status && CONFIG.SETTINGS.autoUpdateNoteOnShortcutClick === 1) {
                        textareas.forEach(textarea => features.noteButtons.updateNote(textarea, status));
                    }
                });
            }
        },

        historyNamer: {
            ticketBrandCache: {},
            async getBrandForTicket(ticketId) {
                if (!ticketId) return null;
                if (this.ticketBrandCache[ticketId]) return this.ticketBrandCache[ticketId];

                try {
                    const apiUrl = CONFIG.API.zendeskTicket(window.location.origin, ticketId);
                    const response = await gmFetch({ method: "GET", url: apiUrl, responseType: "json" });
                    const recipientEmail = response.response.ticket?.recipient?.toLowerCase();
                    if (recipientEmail) {
                        for (const [keyword, brandName] of Object.entries(CONFIG.HISTORY_NAMER.serviceMap)) {
                            if (recipientEmail.includes(keyword)) {
                                this.ticketBrandCache[ticketId] = brandName;
                                return brandName;
                            }
                        }
                    }
                } catch (error) {
                    console.error(`HistoryNamer: Failed to fetch ticket ${ticketId}`, error);
                }
                this.ticketBrandCache[ticketId] = null;
                return null;
            },
            async process(item) {
                if (CONFIG.SETTINGS.enableHistoryNamer !== 1) return;
                const titleElement = item.querySelector(CONFIG.SELECTORS.historyItemTitle);
                if (!titleElement || !titleElement.innerText.startsWith(CONFIG.HISTORY_NAMER.targetText)) return;

                const linkElement = item.querySelector('a[href]');
                if (!linkElement) return;

                const href = linkElement.getAttribute('href');
                let ticketId = null;
                if (href === '#') {
                    ticketId = window.location.href.match(/\/agent\/tickets\/(\d+)/)?.[1];
                } else if (href.startsWith('/agent/tickets/')) {
                    ticketId = href.split('/').pop();
                }

                const brandName = await this.getBrandForTicket(ticketId);
                if (brandName) {
                    titleElement.innerText = `${brandName} | ${titleElement.innerText}`;
                }
            }
        },

        solidgateUI: {
            updateHeaderStyles() {
                if (CONFIG.SETTINGS.enableSolidgateHeaderColoring !== 1) return;
                const activeNameElement = document.querySelector(CONFIG.SELECTORS.solidActiveBrand);
                let headerColor = '#0f72ff'; // Default blue
                if (activeNameElement) {
                    const activeNameText = activeNameElement.textContent.trim();
                    if (activeNameText === 'PDFAid') headerColor = '#fc8c88';
                    else if (activeNameText === 'Howly') headerColor = '#0f72ff';
                }
                document.querySelectorAll(`${CONFIG.SELECTORS.solidHeaderMenu}, ${CONFIG.SELECTORS.solidHeaderNav}`)
                    .forEach(el => { el.style.backgroundColor = headerColor; });

                if (CONFIG.SETTINGS.enableSolidgateLiquidGlass === 1) {
                    features.solidgateStickyHeader.solidColor = headerColor;
                    features.solidgateStickyHeader.updateStyle();
                }
            },
            changeTabTitle() {
                if (CONFIG.SETTINGS.enableSolidgateDynamicTabTitle !== 1) return;
                const urlParams = new URLSearchParams(window.location.search);
                const getParam = (p) => urlParams.get(p);
                const email = getParam('customer_email');
                const bin = getParam('card_bin');
                const lastFour = getParam('card_last_four');
                const name = getParam('cardholder_name');

                let title = '';
                if (email) title = email;
                else if (bin && lastFour) title = `${bin}-${lastFour}`;
                else if (bin) title = bin;
                else if (lastFour) title = lastFour;
                else if (name) title = name;
                else {
                    const emailEl = document.querySelector(`${CONFIG.SELECTORS.solidUserEmailValue}, ${CONFIG.SELECTORS.solidUserEmailSpan}`);
                    if (emailEl) title = emailEl.textContent.trim();
                }

                if (title) document.title = title;
            },
            initContextMenus() {
                if (CONFIG.SETTINGS.enableGlobalContextMenus !== 1) return;
                GM_registerMenuCommand('Search selected email in Solid', () => {
                    const selection = window.getSelection().toString().trim();
                    if (/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(selection)) {
                        GM_openInTab(CONFIG.URLS.solidgateSubscriptions(selection).replace('hub.solidgate', 'canary.solidgate'), { active: true });
                    } else alert('Please select a valid email address.');
                });
                GM_registerMenuCommand('Search selected card in Solid', () => {
                    const selection = window.getSelection().toString().trim().replace(/\s+/g, '');
                    if (/^\d{6}$/.test(selection)) {
                        GM_openInTab(CONFIG.URLS.solidgatePaymentsByBin(selection), { active: true });
                    } else if (/^\d{4}$/.test(selection)) {
                        GM_openInTab(CONFIG.URLS.solidgatePaymentsByLastFour(selection), { active: true });
                    } else {
                        const match = /^(\d{6})(?:\d*)(\d{4})$/.exec(selection);
                        if (match) {
                            GM_openInTab(CONFIG.URLS.solidgatePaymentsByBinAndLastFour(match[1], match[2]), { active: true });
                        } else alert('Please select a valid card number (BIN, Last 4, or full number).');
                    }
                });
                GM_registerMenuCommand('Search selected cardholder name in Solid', () => {
                    const selection = window.getSelection().toString().trim();
                    if (/^[a-zA-Z]+(?:\s+[a-zA-Z]+)+$/.test(selection)) {
                        GM_openInTab(CONFIG.URLS.solidgatePaymentsByCardholder(selection), { active: true });
                    } else alert('Please select a valid cardholder name.');
                });
            }
        },

        trustpilotFilter: {
            run() {
                if (CONFIG.SETTINGS.enableTrustpilotFilter !== 1) return;
                const allowedButtonsText = ['PDFAid', 'PDF House'];
                document.querySelectorAll(CONFIG.SELECTORS.trustpilotReviewButton).forEach(button => {
                    if (allowedButtonsText.includes(button.textContent.trim())) {
                        button.style.display = '';
                    } else {
                        button.style.display = 'none';
                    }
                });
            }
        },

        cardDigitsHighlighter: {
            highlightExtraDigits(valueText, validLength, highlightAtStart) {
                const digitsOnly = valueText.replace(/\D/g, '');
                if (digitsOnly.length <= validLength) {
                    return valueText;
                }

                const htmlParts = [];
                let currentPart = { text: '', highlight: false };
                let digitCount = 0;
                const invalidDigitCount = digitsOnly.length - validLength;

                for (const char of valueText) {
                    const isDigit = /\d/.test(char);
                    if (isDigit) {
                        digitCount++;
                    }

                    let shouldHighlight = false;
                    if (isDigit) {
                        if (highlightAtStart) {
                            if (digitCount <= invalidDigitCount) {
                                shouldHighlight = true;
                            }
                        } else {
                            if (digitCount > validLength) {
                                shouldHighlight = true;
                            }
                        }
                    }

                    if (shouldHighlight !== currentPart.highlight && currentPart.text) {
                        htmlParts.push(currentPart);
                        currentPart = { text: '', highlight: shouldHighlight };
                    }

                    currentPart.text += char;
                    currentPart.highlight = shouldHighlight;
                }
                htmlParts.push(currentPart);

                return htmlParts.map(part => {
                    if (!part.text) return '';
                    const safeText = part.text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    if (part.highlight) {
                        return `<span style="color: red; font-weight: bold;">${safeText}</span>`;
                    }
                    return safeText;
                }).join('');
            },

            process(element) {
                if (CONFIG.SETTINGS.enableCardDigitsHighlighter !== 1) return;
                const fields = element.querySelectorAll('.sc-1ytiim1-1.jXZCHK');
                fields.forEach(field => {
                    const labelEl = field.querySelector('.sc-11wpqtg-0.cUlBwk');
                    const valueEl = field.querySelector('.sc-11wpqtg-1.fCGxBG');
                    if (!labelEl || !valueEl) return;

                    const labelText = labelEl.textContent.trim();
                    const valueText = valueEl.textContent.trim();
                    let newHtml = valueText;

                    if (labelText === 'First 6 digits of the charged card') {
                        newHtml = this.highlightExtraDigits(valueText, 6, false);
                    } else if (labelText === 'Last 4 digits of the charged card') {
                        newHtml = this.highlightExtraDigits(valueText, 4, true);
                    }

                    if (newHtml !== valueText) {
                        setTimeout(() => {
                            if (document.body.contains(valueEl)) {
                                valueEl.innerHTML = newHtml;
                            }
                        }, 0);
                    }
                });
            }
        },

        // --- START: Hide Zendesk Notification ---
        zendeskNotificationHider: {
            process(notification) {
                // 1. Перевіряємо, чи ввімкнена функція
                if (CONFIG.SETTINGS.hideZendeskAddressNotification !== 1) {
                    return;
                }

                const title = notification.querySelector('[data-test-id="notification-title"]');
                const body = notification.querySelector('[data-test-id="notification-body"]');

                if (title && title.textContent.trim() === 'Select an Address:' &&
                    body && body.textContent.includes('New recipient address is recorded')) {

                    notification.style.display = 'none';
                    console.log('PDFAid Script: Hiding "Select an Address:" notification.');
                }
            }
        },
        // --- END: Hide Zendesk Notification ---

        // --- START: NEW FEATURE ---
        brandCopyButtonReloader: {
            reloadIconSvgPath: '<path fill="none" stroke="currentColor" stroke-linecap="round" d="M13.1 12c-1.2 1.5-3 2.5-5.1 2.5-3.6 0-6.5-2.9-6.5-6.5S4.4 1.5 8 1.5c2.2 0 4.1 1.1 5.3 2.7m.2-3.7V4c0 .3-.2.5-.5.5H9.5" data-darkreader-inline-stroke="" style="--darkreader-inline-stroke: currentColor;"></path>',

            process(button) {
                if (CONFIG.SETTINGS.replaceBrandCopyButtonWithReload !== 1) {
                    return;
                }

                button.setAttribute('aria-label', 'Reload Apps');
                button.setAttribute('title', 'Reload Apps');

                const svg = button.querySelector('svg');
                if (svg) {
                    svg.innerHTML = this.reloadIconSvgPath;
                }

                button.removeAttribute('aria-describedby');

                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const mainReloadButton = document.querySelector(CONFIG.SELECTORS.zendeskReloadAppsButton);
                    if (mainReloadButton) {
                        mainReloadButton.click();
                        console.log('PDFAid Script: Reloading apps via brand button click.');
                    } else {
                        console.error('PDFAid Script: Could not find main "Reload all apps" button.');
                    }
                });
            }
        },
        // --- END: NEW FEATURE ---

        // --- START: BRAND FILTER FEATURE ---
        brandFilter: {
            allowedBrands: ['Howly Docs', 'PDFAid', 'PDF House'],
            storageKey: 'pdfaid_brand_filter_enabled',

            init() {
                // Initialize default state if not present
                if (localStorage.getItem(this.storageKey) === null) {
                    localStorage.setItem(this.storageKey, 'true'); // Default to enabled
                }
            },

            isEnabled() {
                return localStorage.getItem(this.storageKey) === 'true';
            },

            toggleState() {
                const newState = !this.isEnabled();
                localStorage.setItem(this.storageKey, newState);
                return newState;
            },

            filterBrands(dropdown, enable) {
                const options = dropdown.querySelectorAll(CONFIG.SELECTORS.zendeskBrandOption);
                options.forEach(option => {
                    const brandNameEl = option.querySelector('[data-garden-id="dropdowns.combobox.option.content"]');
                    if (!brandNameEl) return;

                    const brandName = brandNameEl.textContent.trim();
                    if (enable) {
                        if (this.allowedBrands.includes(brandName)) {
                            option.style.display = '';
                        } else {
                            option.style.display = 'none';
                        }
                    } else {
                        option.style.display = ''; // Show all
                    }
                });
            },

            createToggle(dropdown) {
                const container = document.createElement('div');
                Object.assign(container.style, {
                    padding: '8px 12px',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    position: 'sticky',
                    top: '0',
                    zIndex: '1',
                    marginBottom: '4px'
                });

                const label = document.createElement('span');
                label.textContent = 'Filter Brands';
                label.style.fontWeight = 'bold';
                label.style.fontSize = '12px';
                label.style.color = '#333';

                const toggleSwitch = document.createElement('div');
                Object.assign(toggleSwitch.style, {
                    width: '32px',
                    height: '18px',
                    backgroundColor: this.isEnabled() ? '#28a745' : '#ccc',
                    borderRadius: '9px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                });

                const toggleKnob = document.createElement('div');
                Object.assign(toggleKnob.style, {
                    width: '14px',
                    height: '14px',
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '2px',
                    left: this.isEnabled() ? '16px' : '2px',
                    transition: 'left 0.2s'
                });

                toggleSwitch.appendChild(toggleKnob);
                toggleSwitch.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const newState = this.toggleState();

                    // Update UI
                    toggleSwitch.style.backgroundColor = newState ? '#28a745' : '#ccc';
                    toggleKnob.style.left = newState ? '16px' : '2px';

                    // Apply filter
                    this.filterBrands(dropdown, newState);
                });

                container.appendChild(label);
                container.appendChild(toggleSwitch);

                // Insert at the top of the dropdown
                dropdown.insertBefore(container, dropdown.firstChild);
            },

            process(dropdown) {
                if (CONFIG.SETTINGS.enableBrandFilter !== 1) return;

                // Check if toggle already exists
                if (dropdown.querySelector('.brand-filter-toggle-container')) {
                    // Even if toggle exists, ensure filter is applied
                    this.filterBrands(dropdown, this.isEnabled());
                    return;
                }

                this.createToggle(dropdown);

                // Apply initial filter state
                this.filterBrands(dropdown, this.isEnabled());

                // Observe the dropdown for changes (re-rendering of options)
                const observer = new MutationObserver((mutations) => {
                    let shouldRefilter = false;
                    for (const mutation of mutations) {
                        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                            shouldRefilter = true;
                            break;
                        }
                    }
                    if (shouldRefilter) {
                        this.filterBrands(dropdown, this.isEnabled());
                    }
                });

                observer.observe(dropdown, { childList: true });
            }
        },
        // --- END: BRAND FILTER FEATURE ---

        // --- START: BRAND SELECTION AUTOMATION FEATURE ---
        brandSelectionAutomation: {
            process(element) {
                if (CONFIG.SETTINGS.enableAutoReloadAndTake !== 1) return;

                if (element.hasAttribute('data-automation-observer-attached')) return;

                let lastBrandName = element.textContent.trim();

                const observer = new MutationObserver(() => {
                    if (!window.location.href.includes('/new/')) return;

                    const newBrandName = element.textContent.trim();
                    if (newBrandName !== lastBrandName) {
                        lastBrandName = newBrandName;

                        setTimeout(() => {
                            const ticketContainer = element.closest('[data-test-id*="-layout"]');

                            if (ticketContainer && ticketContainer.getAttribute('data-is-active') !== 'true') {
                                return;
                            }

                            const layoutId = ticketContainer ? ticketContainer.getAttribute('data-test-id') : '';
                            const idMatch = layoutId.match(/ticket(?:-new\/|-)(\d+)/);

                            if (idMatch && idMatch[1]) {
                                const ticketId = idMatch[1];
                                if (!window.location.href.includes(ticketId)) {
                                    return;
                                }
                            }

                            const scope = ticketContainer || document;

                            let attempts = 0;
                            const maxAttempts = 40; // 2 seconds (40 * 50ms)

                            const clickInterval = setInterval(() => {
                                attempts++;
                                const takeItButton = scope.querySelector(CONFIG.SELECTORS.zendeskTakeItButton);

                                if (takeItButton) {
                                    clearInterval(clickInterval);

                                    try {
                                        takeItButton.focus();

                                        const win = document.defaultView || window;
                                        ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(eventType => {
                                            const EventClass = (eventType.startsWith('pointer')) ? PointerEvent : MouseEvent;
                                            const event = new EventClass(eventType, {
                                                bubbles: true,
                                                cancelable: true,
                                                view: win,
                                                buttons: 1
                                            });
                                            takeItButton.dispatchEvent(event);
                                        });
                                        takeItButton.click();
                                    } catch (err) {
                                        takeItButton.click();
                                    }

                                    setTimeout(() => {
                                        const reloadButton = document.querySelector(CONFIG.SELECTORS.zendeskReloadAppsButton);
                                        if (reloadButton) {
                                            reloadButton.click();
                                        }
                                    }, 100);

                                } else if (attempts >= maxAttempts) {
                                    clearInterval(clickInterval);
                                    const reloadButton = document.querySelector(CONFIG.SELECTORS.zendeskReloadAppsButton);
                                    if (reloadButton) {
                                        reloadButton.click();
                                    }
                                }
                            }, 50);

                        }, 100);
                    }
                });

                observer.observe(element, { childList: true, characterData: true, subtree: true });
                element.setAttribute('data-automation-observer-attached', 'true');
            }
        },
        // --- END: BRAND SELECTION AUTOMATION FEATURE ---

        solidgateLogHighlighter: {
            process(element) {
                if (CONFIG.SETTINGS.enableSolidgateLogHighlighter !== 1) return;
                const nameSpan = element.querySelector('._nameColumn_1smgo_39 ._monospaced_19fu8_1');
                if (nameSpan && nameSpan.textContent.trim() === 'subscription.restore') {
                    nameSpan.style.color = 'red';
                    nameSpan.style.fontWeight = 'bold';
                }
            }
        },

        solidgateChannelHighlighter: {
            process(element) {
                if (CONFIG.SETTINGS.highlightSolidgateChannels !== 1) return;
                const span = element.querySelector('span');
                if (!span) return;

                const text = span.textContent.trim().toLowerCase();

                if (text.includes('pdfaid')) {
                    span.style.color = '#ff4d4d'; // Red
                    span.style.fontWeight = 'bold';
                } else if (text.includes('pdfhouse')) {
                    span.style.color = '#9a52ff'; // Purple
                    span.style.fontWeight = 'bold';
                } else if (text.includes('docs.howly.com/pdf-to-edit')) {
                    span.style.color = '#0f72ff'; // Blue
                    span.style.fontWeight = 'bold';
                } else {
                    span.style.color = '';
                    span.style.fontWeight = '';
                }
            }
        },
        cancellationDateCopier: {
            process(element) {
                if (CONFIG.SETTINGS.enableCancellationDateCopier !== 1) return;
                if (element.querySelector('.cancellation-copy-btn')) return;

                const textElement = element.querySelector('._badgeText_1k6vu_14');
                if (!textElement) return;

                const textContent = textElement.textContent;
                const dateMatch = textContent.match(/\d{1,2}\s[A-Za-z]{3}\s\d{4}/);
                if (!dateMatch) return;

                const dateToCopy = dateMatch[0];

                const copyBtn = document.createElement('button');
                copyBtn.textContent = 'Copy';
                copyBtn.className = 'cancellation-copy-btn';
                Object.assign(copyBtn.style, {
                    padding: '2px 8px',
                    fontSize: '11px',
                    backgroundColor: '#e9ecef',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginLeft: '12px',
                    alignSelf: 'center',
                    transition: 'background-color 0.2s'
                });

                copyBtn.addEventListener('mouseover', () => { copyBtn.style.backgroundColor = '#dee2e6'; });
                copyBtn.addEventListener('mouseout', () => { copyBtn.style.backgroundColor = '#e9ecef'; });


                copyBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    try {
                        await navigator.clipboard.writeText(dateToCopy);
                        setTemporaryButtonState(copyBtn, 'Copied!', null);
                    } catch (err) {
                        console.error('Failed to copy date: ', err);
                        setTemporaryButtonState(copyBtn, 'Error', null);
                    }
                });

                element.style.display = 'flex';
                element.style.alignItems = 'center';
                element.appendChild(copyBtn);
            }
        },

        // --- START: ОНОВЛЕНА ФУНКЦІЯ ---
        solidgateStickyHeader: {
            solidColor: null,

            initScrollListener() {
                if (CONFIG.SETTINGS.enableSolidgateLiquidGlass !== 1) return;

                let ticking = false;
                window.addEventListener('scroll', () => {
                    if (!ticking) {
                        window.requestAnimationFrame(() => {
                            this.updateStyle();
                            ticking = false;
                        });
                        ticking = true;
                    }
                });
                this.updateStyle();
            },

            process(element) {
                if (CONFIG.SETTINGS.enableSolidgateStickyHeader === 1) {
                    element.style.position = 'sticky';
                    element.style.top = '0';
                    element.style.zIndex = '999';
                }

                if (CONFIG.SETTINGS.enableSolidgateLiquidGlass === 1) {
                    const coloredElement = element.querySelector(CONFIG.SELECTORS.solidHeaderMenu);
                    if (coloredElement) {
                        coloredElement.style.transition = 'background-color 0.3s ease, backdrop-filter 0.3s ease, -webkit-backdrop-filter 0.3s ease';
                    }
                    this.updateStyle();
                }
            },

            updateStyle() {
                const coloredElement = document.querySelector(CONFIG.SELECTORS.solidHeaderMenu);
                if (!coloredElement) return;

                if (CONFIG.SETTINGS.enableSolidgateLiquidGlass !== 1) {
                    const currentBg = coloredElement.style.backgroundColor;
                    if (currentBg && !currentBg.startsWith('rgba')) {
                        this.solidColor = currentBg;
                    }
                    if (this.solidColor) {
                        coloredElement.style.backgroundColor = this.solidColor;
                    }
                    coloredElement.style.backdropFilter = 'none';
                    coloredElement.style.webkitBackdropFilter = 'none';
                    return;
                }

                const isScrolled = window.scrollY > 0;
                const currentBg = coloredElement.style.backgroundColor;

                if (currentBg && !currentBg.startsWith('rgba')) {
                    this.solidColor = currentBg;
                }

                if (!this.solidColor) {
                    return;
                }

                if (isScrolled) {
                    const rgbaColor = this.solidColor.replace('rgb(', 'rgba(').replace(')', ', 0.25)');
                    coloredElement.style.backgroundColor = rgbaColor;
                    coloredElement.style.backdropFilter = 'blur(10px)';
                    coloredElement.style.webkitBackdropFilter = 'blur(10px)'; // для Safari
                } else {
                    coloredElement.style.backgroundColor = this.solidColor;
                    coloredElement.style.backdropFilter = 'none';
                    coloredElement.style.webkitBackdropFilter = 'none';
                }
            }
        }
        // --- END: ОНОВЛЕНА ФУНКЦІЯ ---
    };

    // --- END: Feature Modules ---

    // --- START: Main Execution ---

    function main() {
        if (CONFIG.SETTINGS.enableCopyMessageButton === 1) {
            features.copyButton.init();
        }
        if (CONFIG.SETTINGS.enableShortcutColoring === 1 || CONFIG.SETTINGS.autoUpdateNoteOnShortcutClick === 1) {
            features.shortcutColoring.init();
        }
        if (window.location.hostname.includes('zendesk.com') && CONFIG.SETTINGS.enableGlobalContextMenus === 1) {
            features.solidgateUI.initContextMenus();
        }
        // --- START: ЗМІНЕНИЙ РЯДОК ---
        if (window.location.hostname.includes('solidgate.com')) {
            features.solidgateStickyHeader.initScrollListener();
        }
        // --- END: ЗМІНЕНИЙ РЯДОК ---

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type !== 'childList' || mutation.addedNodes.length === 0) continue;

                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== 1) continue;

                    const findAndProcess = (selector, feature) => {
                        const elementsToProcess = [];
                        if (node.matches(selector)) {
                            elementsToProcess.push(node);
                        }
                        node.querySelectorAll(`${selector}:not([${CONFIG.STATE.processed}])`).forEach(el => elementsToProcess.push(el));

                        elementsToProcess.forEach(element => {
                            if (element.hasAttribute(CONFIG.STATE.processed)) return;
                            feature.process(element);
                            element.setAttribute(CONFIG.STATE.processed, 'true');
                        });
                    };

                    // Zendesk Features
                    findAndProcess(CONFIG.SELECTORS.messageBubble, features.copyButton);
                    findAndProcess(CONFIG.SELECTORS.avatar, features.solidgateButton);
                    findAndProcess(CONFIG.SELECTORS.notesTextarea, features.noteButtons);
                    findAndProcess(CONFIG.SELECTORS.shortcutItem, features.shortcutColoring);
                    findAndProcess(CONFIG.SELECTORS.historyItem, features.historyNamer);
                    findAndProcess(CONFIG.SELECTORS.cardComment, features.cardDigitsHighlighter);
                    findAndProcess(CONFIG.SELECTORS.zendeskNotification, features.zendeskNotificationHider);
                    findAndProcess(CONFIG.SELECTORS.zendeskBrandCopyButton, features.brandCopyButtonReloader);
                    findAndProcess(CONFIG.SELECTORS.zendeskBrandDropdown, features.brandFilter);
                    findAndProcess(CONFIG.SELECTORS.zendeskBrandNameDisplay, features.brandSelectionAutomation);

                    if (window.location.hostname.includes('solidgate.com')) {
                        findAndProcess(CONFIG.SELECTORS.solidHeaderMain, features.solidgateStickyHeader);
                        findAndProcess(CONFIG.SELECTORS.solidLogItem, features.solidgateLogHighlighter);
                        findAndProcess(CONFIG.SELECTORS.solidgateCancellationNotice, features.cancellationDateCopier);
                    }
                }
            }

            if (window.location.hostname.includes('solidgate.com')) {
                features.solidgateUI.updateHeaderStyles();
                features.solidgateUI.changeTabTitle();

                document.querySelectorAll(CONFIG.SELECTORS.solidgateChannelCell).forEach(cell => {
                    features.solidgateChannelHighlighter.process(cell);
                });
            }

            if (window.location.hostname.includes('apps.zdusercontent.com')) {
                features.trustpilotFilter.run();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        if (window.location.hostname.includes('solidgate.com')) {
            features.solidgateUI.changeTabTitle();
            features.solidgateUI.updateHeaderStyles();
        }
        if (window.location.hostname.includes('apps.zdusercontent.com')) {
            setTimeout(features.trustpilotFilter.run, 500);
        }
    }

    main();

})();