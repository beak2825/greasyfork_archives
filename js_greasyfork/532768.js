// ==UserScript==
// @name         Qrev for TornPDA Mobile
// @version      3.8
// @description  Fast revive with percentage notifications (TornPDA-native)
// @author       Sa1nt [2929191] (TornPDA adaptation by Qwen)
// @match        *://*.torn.com/profiles.php*
// @namespace namespace
// @downloadURL https://update.greasyfork.org/scripts/532768/Qrev%20for%20TornPDA%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/532768/Qrev%20for%20TornPDA%20Mobile.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class QrevPDA {
        constructor() {
            this.id = 'qrev-pda';
            this.name = 'Qrev';
            this.description = 'Fast revive with percentage notifications';
            this.observers = [];
            this.lastPercentage = null;
        }

        async initialize() {
            this.setupReviveButton();
            this.setupObservers();
            this.interceptRequests();
            this.showInitialNotification();
        }

        async setupReviveButton() {
            const reviveBtn = await TornPDA.waitForElement('.profile-button-revive');
            if (!reviveBtn) return;

            const qrevBtn = document.createElement('button');
            qrevBtn.textContent = '⚡ Revive';
            qrevBtn.className = 'torn-btn torn-btn--primary';
            qrevBtn.style.marginLeft = '10px';
            
            qrevBtn.addEventListener('click', () => {
                if (this.lastPercentage) {
                    TornPDA.notifications.show({
                        title: 'Revive Status',
                        message: `Revive chance: ${this.lastPercentage}%`,
                        type: 'info'
                    });
                }
                TornPDA.api.skipConfirmation = true;
                reviveBtn.click();
            });

            reviveBtn.parentElement.appendChild(qrevBtn);
        }

        setupObservers() {
            this.observers.push(
                TornPDA.observe('.confirmation-dialog', (dialog) => {
                    const percentage = dialog.textContent.match(/(\d+)%/);
                    if (percentage) {
                        this.lastPercentage = percentage[1];
                        TornPDA.notifications.show({
                            title: 'Revive Confirmation',
                            message: `Success chance: ${this.lastPercentage}%`,
                            type: 'success'
                        });
                    }
                }),
                TornPDA.observe('.revive-success', () => {
                    TornPDA.notifications.show({
                        title: 'Revive Successful',
                        message: 'Player revived successfully!',
                        type: 'success'
                    });
                    this.lastPercentage = null;
                })
            );
        }

        interceptRequests() {
            TornPDA.api.intercept('revive', (req) => {
                if (TornPDA.api.skipConfirmation) {
                    req.url += '&skipConfirmation=1';
                    TornPDA.api.skipConfirmation = false;
                }
            });
        }

        showInitialNotification() {
            TornPDA.notifications.show({
                title: 'Qrev Loaded',
                message: 'Fast revive ready',
                type: 'info',
                duration: 2000
            });
        }

        cleanup() {
            this.observers.forEach(obs => obs.disconnect());
        }
    }

    // Register with TornPDA
    TornPDA.registerModule(new QrevPDA());
})();