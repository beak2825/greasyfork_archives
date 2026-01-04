// ==UserScript==
// @name         TikTok Creator Support Tool
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Creator support tool for TikTok profiles
// @author       You
// @match        https://www.tiktok.com/@*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547621/TikTok%20Creator%20Support%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/547621/TikTok%20Creator%20Support%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for element with better error handling
    function waitForElement(selector, callback, maxAttempts = 20) {
        let attempts = 0;
        const checkElement = () => {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(checkElement, 500);
            }
        };
        checkElement();
    }

    // Create professional support button
    function createSupportButton() {
        const button = document.createElement('button');
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px;">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Support Creator
        `;
        button.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 140px;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
        });

        button.addEventListener('click', showSupportModal);
        return button;
    }

    const supportPackages = [
    { amount: 100, price: '$2.99', label: 'Hearts Support', icon: '<img src="https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/6cd022271dc4669d182cad856384870f~tplv-obj.png" width="32" height="32" />' },
    { amount: 250, price: '$4.99', label: 'Corgie Support', icon: '<img src="https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/148eef0884fdb12058d1c6897d1e02b9~tplv-obj.png" width="32" height="32" />' },
    { amount: 500, price: '$9.99', label: 'Money Gun Support', icon: '<img src="https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/e0589e95a2b41970f0f30f6202f5fce6~tplv-obj.png" width="32" height="32" />' },
    { amount: 1000, price: '$19.99', label: 'Galaxy Support', icon: '<img src="https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/resource/79a02148079526539f7599150da9fd28.png~tplv-obj.png" width="32" height="32" />' },
    { amount: 2500, price: '$49.99', label: 'Band Support', icon: '<img src="https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/resource/60d8c4148c9cd0c268e570741ccf4150.png~tplv-obj.png" width="32" height="32" />' },
    { amount: 5000, price: '$99.99', label: 'Jets Support', icon: '<img src="https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/resource/1d067d13988e8754ed6adbebd89b9ee8.png~tplv-obj.png" width="32" height="32" />' },
    { amount: 7500, price: '$149.99', label: 'Throne Support', icon: '<img src="https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/30063f6bc45aecc575c49ff3dbc33831~tplv-obj.png" width="32" height="32" />' },
    { amount: 10000, price: '$199.99', label: 'Yacht Support', icon: '<img src="https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/resource/a97ef636c4e0494b2317c58c9edba0a8.png~tplv-obj.png" width="32" height="32" />' },
    { amount: 15000, price: '$299.99', label: 'Party Support', icon: '<img src="https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/resource/c45505ece4a91d9c43e4ba98a000b006.png~tplv-obj.png" width="32" height="32" />' },
    { amount: 25000, price: '$499.99', label: 'Universe Support', icon: '<img src="https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/8f471afbcebfda3841a6cc515e381f58~tplv-obj.png" width="32" height="32" />' }
];


    // Add global styles
    function addGlobalStyles() {
        if (document.getElementById('creator-support-styles')) return;

        const style = document.createElement('style');
        style.id = 'creator-support-styles';
        style.textContent = `
            @keyframes modalFadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }
            @keyframes loadingPulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            @keyframes progressBar {
                from { width: 0%; }
                to { width: 100%; }
            }
            .support-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                backdrop-filter: blur(8px);
            }
            .support-modal-content {
                background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
                border-radius: 20px;
                padding: 0;
                max-width: 600px;
                width: 95%;
                max-height: 90vh;
                overflow: hidden;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
                animation: modalFadeIn 0.3s ease-out;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .support-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 25px 30px;
                text-align: center;
                position: relative;
            }
            .support-close {
                position: absolute;
                top: 15px;
                right: 20px;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                width: 35px;
                height: 35px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            .support-close:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: rotate(90deg);
            }
            .support-package {
                background: white;
                border: 2px solid #e2e8f0;
                border-radius: 16px;
                padding: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            .support-package::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
                transition: left 0.5s ease;
            }
            .support-package:hover::before {
                left: 100%;
            }
            .support-package:hover {
                border-color: #667eea;
                transform: translateY(-4px);
                box-shadow: 0 12px 25px rgba(102, 126, 234, 0.15);
            }
            .package-icon {
                font-size: 32px;
                margin-bottom: 12px;
                display: block;
            }
            .package-amount {
                font-size: 18px;
                font-weight: 700;
                color: #1a202c;
                margin-bottom: 8px;
            }
            .package-label {
                font-size: 14px;
                color: #667eea;
                font-weight: 600;
                margin-bottom: 12px;
            }
            .package-price {
                font-size: 20px;
                font-weight: 800;
                color: #667eea;
                background: linear-gradient(135deg, #667eea, #764ba2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
        `;
        document.head.appendChild(style);
    }

    // Create modal with proper event handling
    function showSupportModal() {
        addGlobalStyles();

        // Remove existing modal if any
        const existingModal = document.querySelector('.support-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'support-modal';

        const modalContent = document.createElement('div');
        modalContent.className = 'support-modal-content';

        modalContent.innerHTML = `
            <div class="support-header">
                <button class="support-close" type="button">×</button>
                <div style="font-size: 28px; margin-bottom: 8px;">💝</div>
                <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700;">Support This Creator</h2>
                <p style="margin: 0; opacity: 0.9; font-size: 16px;">Show your appreciation with a support package</p>
            </div>

            <div style="padding: 30px; max-height: 60vh; overflow-y: auto;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                    ${supportPackages.map(pkg => `
                        <div class="support-package" data-amount="${pkg.amount}" data-price="${pkg.price}" data-label="${pkg.label}">
                            <div class="package-icon">${pkg.icon}</div>
                            <div class="package-amount">${pkg.amount.toLocaleString()} Points</div>
                            <div class="package-label">${pkg.label}</div>
                            <div class="package-price">${pkg.price}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Add event listeners with proper cleanup
        const closeBtn = modalContent.querySelector('.support-close');
        const packages = modalContent.querySelectorAll('.support-package');

        const closeModal = () => {
            modal.remove();
        };

        closeBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        packages.forEach(pkg => {
            pkg.addEventListener('click', (e) => {
                const amount = e.currentTarget.dataset.amount;
                const price = e.currentTarget.dataset.price;
                const label = e.currentTarget.dataset.label;
                showReceipt(amount, price, label, modal);
            });
        });

        // Add escape key handler
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    // Show professional receipt
    function showReceipt(amount, price, label, originalModal) {
        const receiptModal = document.createElement('div');
        receiptModal.className = 'support-modal';

        const receiptContent = document.createElement('div');
        receiptContent.className = 'support-modal-content';
        receiptContent.style.maxWidth = '450px';

        receiptContent.innerHTML = `
            <div class="support-header">
                <div style="font-size: 32px; margin-bottom: 12px;">📋</div>
                <h3 style="margin: 0; font-size: 22px; font-weight: 700;">Support Summary</h3>
            </div>

            <div style="padding: 30px;">
                <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 25px; border-radius: 16px; margin-bottom: 25px; border: 1px solid #e2e8f0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <span style="color: #64748b; font-weight: 500;">Package:</span>
                        <span style="font-weight: 700; color: #1a202c;">${label}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <span style="color: #64748b; font-weight: 500;">Points:</span>
                        <span style="font-weight: 700; color: #1a202c;">${parseInt(amount).toLocaleString()}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <span style="color: #64748b; font-weight: 500;">Amount:</span>
                        <span style="font-weight: 700; color: #1a202c;">${price}</span>
                    </div>
                    <hr style="border: none; border-top: 2px solid #cbd5e1; margin: 20px 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 18px;">
                        <span style="font-weight: 700; color: #1a202c;">Total:</span>
                        <span style="font-weight: 800; color: #667eea; font-size: 20px;">${price}</span>
                    </div>
                </div>

                <button id="confirmSupport" style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 16px 32px;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    width: 100%;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                    margin-bottom: 12px;
                ">Confirm Support</button>

                <button id="cancelSupport" style="
                    background: white;
                    border: 2px solid #e2e8f0;
                    color: #64748b;
                    padding: 14px 32px;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    width: 100%;
                    transition: all 0.3s ease;
                ">Cancel</button>
            </div>
        `;

        receiptModal.appendChild(receiptContent);
        document.body.appendChild(receiptModal);

        // Event handlers
        const confirmBtn = receiptContent.querySelector('#confirmSupport');
        const cancelBtn = receiptContent.querySelector('#cancelSupport');

        confirmBtn.addEventListener('click', () => {
            showProcessing(receiptModal, amount, label);
        });

        cancelBtn.addEventListener('click', () => {
            receiptModal.remove();
            originalModal.remove();
        });

        // Close on outside click
        receiptModal.addEventListener('click', (e) => {
            if (e.target === receiptModal) {
                receiptModal.remove();
                originalModal.remove();
            }
        });
    }

    // Show processing and success
    function showProcessing(receiptModal, amount, label) {
        const content = receiptModal.querySelector('.support-modal-content');
        content.innerHTML = `
            <div style="text-align: center; padding: 50px 30px;">
                <div style="font-size: 48px; margin-bottom: 25px; animation: loadingPulse 1.5s infinite;">⚡</div>
                <h3 style="color: #1a202c; margin-bottom: 20px; font-size: 20px; font-weight: 700;">Processing Support...</h3>
                <div style="width: 100%; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden; margin-bottom: 15px;">
                    <div style="height: 100%; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 3px; animation: progressBar 2s ease-in-out forwards;"></div>
                </div>
                <p style="color: #64748b; margin: 0; font-size: 14px;">Securing your support transaction...</p>
            </div>
        `;

        setTimeout(() => {
            content.innerHTML = `
                <div style="text-align: center; padding: 50px 30px;">
                    <div style="font-size: 64px; margin-bottom: 25px;">✨</div>
                    <h3 style="color: #10b981; margin-bottom: 20px; font-size: 24px; font-weight: 700;">Support Sent Successfully!</h3>
                    <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); padding: 20px; border-radius: 12px; margin-bottom: 25px; border: 1px solid #a7f3d0;">
                        <p style="color: #065f46; margin: 0; font-weight: 600;">
                            ${parseInt(amount).toLocaleString()} support points delivered!
                        </p>
                        <p style="color: #047857; margin: 8px 0 0 0; font-size: 14px;">
                            Thank you for supporting this creator with ${label}
                        </p>
                    </div>
                    <button onclick="this.closest('.support-modal').remove()" style="
                        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                        color: white;
                        border: none;
                        padding: 14px 32px;
                        border-radius: 12px;
                        font-size: 16px;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
                    ">Close</button>
                </div>
            `;
        }, 2000);
    }

    // Replace follow button
    function replaceSupportButton() {
        waitForElement('[data-e2e="follow-button"]', (followButton) => {
            const container = followButton.closest('.TUXTooltip-reference') || followButton.parentElement;
            if (container && !container.querySelector('.support-replaced')) {
                const supportButton = createSupportButton();
                supportButton.classList.add('support-replaced');
                container.innerHTML = '';
                container.appendChild(supportButton);
                container.style.width = 'fit-content';
            }
        });
    }

    // Initialize with better navigation handling
    function init() {
        replaceSupportButton();

        let currentUrl = location.href;
        const observer = new MutationObserver(() => {
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                if (currentUrl.includes('/@')) {
                    setTimeout(replaceSupportButton, 1500);
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Start when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();