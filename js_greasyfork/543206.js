// ==UserScript==
// @name         FAB (Unreal Engine) Asset Auto Redeemer
// @namespace    https://github.com/creosB
// @version      2.1
// @description  Automatically redeem free FAB products with Dynamic Island
// @author       CreosB
// @match        https://www.fab.com/*
// @grant        none
// @license     This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License. 
// @downloadURL https://update.greasyfork.org/scripts/543206/FAB%20%28Unreal%20Engine%29%20Asset%20Auto%20Redeemer.user.js
// @updateURL https://update.greasyfork.org/scripts/543206/FAB%20%28Unreal%20Engine%29%20Asset%20Auto%20Redeemer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const utils = {
        wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
        log: (message, type = 'info') => {
            const timestamp = new Date().toLocaleTimeString();
            console.log(`[FAB-GRABBER ${timestamp}] ${message}`);
            utils.updateStatus(message, type);
        },
        updateStatus: (message, type = 'info') => {
            const statusEl = document.getElementById('status');
            if (statusEl) {
                statusEl.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
                statusEl.className = `status-${type}`;
            }
        },
        generateAssetId: (card) => {
            const linkEl = card.querySelector('a[href*="/listings/"]');
            return linkEl ? linkEl.href.split('/').pop() : `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        },
        safeClick: async (element, description) => {
            try {
                if (!element) {
                    throw new Error(`Element not found: ${description}`);
                }
                element.focus();
                await utils.wait(100);
                element.click();
                await utils.wait(200);
                if (element.disabled || !element.offsetParent) {
                    element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                }
                utils.log(`Successfully clicked: ${description}`);
                return true;
            } catch (error) {
                utils.log(`Failed to click ${description}: ${error.message}`, 'error');
                return false;
            }
        },
        waitForElement: (selector, timeout = 5000, parent = document) => {
            return new Promise((resolve, reject) => {
                const startTime = Date.now();
                const checkElement = () => {
                    const element = parent.querySelector(selector);
                    if (element) {
                        resolve(element);
                        return;
                    }
                    if (Date.now() - startTime > timeout) {
                        reject(new Error(`Element not found: ${selector} (timeout: ${timeout}ms)`));
                        return;
                    }
                    setTimeout(checkElement, 100);
                };
                checkElement();
            });
        },
        waitForElementToDisappear: (selector, timeout = 5000, parent = document) => {
            return new Promise((resolve) => {
                const startTime = Date.now();
                const checkElement = () => {
                    const element = parent.querySelector(selector);
                    if (!element) {
                        resolve(true);
                        return;
                    }
                    if (Date.now() - startTime > timeout) {
                        resolve(false);
                        return;
                    }
                    setTimeout(checkElement, 100);
                };
                checkElement();
            });
        }
    };

    const licenseProcessor = {
        selectLicenseAndAdd: async (dialog, assetName) => {
            try {
                const licenseOptions = licenseProcessor.findLicenseOptions(dialog);
                let selectedLicense;
                let selectedRadio;
                if (!licenseOptions.personal && !licenseOptions.professional) {
                    utils.log('No license options found, attempting direct add for ' + assetName);
                    const addButton = await utils.waitForElement('button:not([disabled])[class*="Button--primary"]', 10000, dialog);
                    if (!addButton) {
                        throw new Error('Direct add button not found');
                    }
                    const addButtonText = addButton.textContent.toLowerCase();
                    if (!addButtonText.includes('add') && !addButtonText.includes('library')) {
                        throw new Error('Direct add button not ready');
                    }
                    await utils.safeClick(addButton, 'Direct Add to Library button');
                    const closed = await utils.waitForElementToDisappear('[role="dialog"][aria-modal="true"]', 5000);
                    if (!closed) {
                        throw new Error('Dialog did not close after direct add');
                    }
                    return { success: true, license: 'direct' };
                }
                if (config.preferredLicense === 'personal') {
                    if (licenseOptions.personal && licenseOptions.personal.isFree) {
                        selectedLicense = 'personal';
                        selectedRadio = licenseOptions.personal.radio;
                    } else if (licenseOptions.professional && licenseOptions.professional.isFree) {
                        selectedLicense = 'professional';
                        selectedRadio = licenseOptions.professional.radio;
                    }
                } else {
                    if (licenseOptions.professional && licenseOptions.professional.isFree) {
                        selectedLicense = 'professional';
                        selectedRadio = licenseOptions.professional.radio;
                    } else if (licenseOptions.personal && licenseOptions.personal.isFree) {
                        selectedLicense = 'personal';
                        selectedRadio = licenseOptions.personal.radio;
                    }
                }
                if (!selectedLicense) {
                    throw new Error('No free license available');
                }
                await utils.safeClick(selectedRadio, `${selectedLicense} license`);
                await utils.wait(1000);
                const addButton = await utils.waitForElement('button:not([disabled])[class*="Button--primary"]', 3000, dialog);
                if (!addButton) {
                    throw new Error('Add button not found or not enabled');
                }
                const addButtonText = addButton.textContent.toLowerCase();
                if (!addButtonText.includes('add') && !addButtonText.includes('library')) {
                    throw new Error('Add button not found or not ready');
                }
                await utils.safeClick(addButton, 'Add to Library button');
                await utils.waitForElementToDisappear('[role="dialog"][aria-modal="true"]', 5000);
                return {
                    success: true,
                    license: selectedLicense
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message
                };
            }
        },
        findLicenseOptions: (dialog) => {
            const options = { personal: null, professional: null };
            const formFields = dialog.querySelectorAll('[class*="FormField-root"]');
            formFields.forEach(field => {
                const label = field.querySelector('[class*="FormField-label"]');
                const radio = field.querySelector('input[type="radio"]');
                const priceEl = field.querySelector('[class*="Typography--intent-primary"][class*="Text--lg"][class*="Text--bold"]');
                if (label && radio) {
                    const labelText = label.textContent.toLowerCase();
                    const isFree = priceEl && priceEl.textContent.trim().toLowerCase() === 'free';
                    if (labelText.includes('personal')) {
                        options.personal = { radio, isFree };
                    } else if (labelText.includes('professional')) {
                        options.professional = { radio, isFree };
                    }
                }
            });
            return options;
        },
        closeDialog: async (dialog) => {
            try {
                const closeMethods = [
                    () => dialog.querySelector('button[aria-label="Close"]'),
                    () => dialog.querySelector('[class*="closeButton"]'),
                    () => dialog.querySelector('[class*="Modal-closeButton"]'),
                    () => dialog.querySelector('button:has(svg)')
                ];
                for (const method of closeMethods) {
                    const closeBtn = method();
                    if (closeBtn) {
                        await utils.safeClick(closeBtn, 'close button');
                        await utils.wait(500);
                        if (!document.querySelector('[role="dialog"][aria-modal="true"]')) {
                            return true;
                        }
                    }
                }
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
                await utils.wait(500);
                return !document.querySelector('[role="dialog"][aria-modal="true"]');
            } catch (error) {
                utils.log(`Error closing dialog: ${error.message}`, 'error');
                return false;
            }
        }
    };

    const assetProcessor = {
        getFreeAssetCards: () => {
            const cards = document.querySelectorAll('[class*="fabkit-Stack-root"][class*="nTa5u2sc"], [class*="card"], [class*="asset-card"]');
            const freeCards = [];
            cards.forEach(card => {
                const priceElements = card.querySelectorAll('*');
                for (const el of priceElements) {
                    if (el.textContent && el.textContent.trim().toLowerCase() === 'free') {
                        freeCards.push(card);
                        break;
                    }
                }
            });
            return freeCards;
        },
        getAssetName: (card) => {
            const nameSelectors = [
                '[class*="Typography--intent-primary"][class*="Text--bold"]',
                '[class*="asset-name"]',
                '[class*="title"]',
                'a[href*="/listings/"]'
            ];
            for (const selector of nameSelectors) {
                const nameEl = card.querySelector(selector);
                if (nameEl && nameEl.textContent.trim()) {
                    return nameEl.textContent.trim();
                }
            }
            return 'Unknown Asset';
        },
        findCartButton: (card) => {
            const buttonSelectors = [
                'button[aria-label*="Add"][aria-label*="cart"]',
                'button[aria-label*="Add to cart"]',
                'button[class*="cart"]',
                'button:has([class*="shopping-cart"])',
                '[class*="shopping-cart-plus"]'
            ];
            for (const selector of buttonSelectors) {
                const button = card.querySelector(selector);
                if (button) return button;
            }
            return null;
        },
        processCard: async (card, retryCount = 0) => {
            const assetId = utils.generateAssetId(card);
            const assetName = assetProcessor.getAssetName(card);
            try {
                utils.log(`Processing: ${assetName} (Attempt ${retryCount + 1})`, 'info');
                utils.log(`Simulating hover on card for ${assetName}`);
                card.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
                card.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
                await utils.wait(500);
                const cartButton = await utils.waitForElement('button[aria-label*="Add"], button[class*="cart"], button:has([class*="shopping-cart"]), [class*="shopping-cart-plus"]', 3000, card);
                if (!cartButton) {
                    throw new Error('Cart button not found after hover');
                }
                await utils.safeClick(cartButton, 'cart button');
                await utils.wait(500);
                const dialog = await utils.waitForElement('[role="dialog"][aria-modal="true"]', config.dialogTimeout);
                utils.log(`Dialog opened for: ${assetName}`);
                const result = await licenseProcessor.selectLicenseAndAdd(dialog, assetName);
                if (result.success) {
                    state.processedAssets.set(assetId, {
                        name: assetName,
                        license: result.license,
                        status: 'success',
                        timestamp: new Date().toISOString()
                    });
                    utils.log(`✅ Successfully added: ${assetName} (${result.license})`, 'success');
                    return true;
                } else {
                    throw new Error(result.error || 'Failed to add asset');
                }
            } catch (error) {
                utils.log(`❌ Error processing ${assetName}: ${error.message}`, 'error');
                const dialog = document.querySelector('[role="dialog"][aria-modal="true"]');
                if (dialog) {
                    await licenseProcessor.closeDialog(dialog);
                }
                if (retryCount < config.maxRetries) {
                    utils.log(`Retrying ${assetName} in 3 seconds...`);
                    await utils.wait(3000);
                    return assetProcessor.processCard(card, retryCount + 1);
                }
                state.processedAssets.set(assetId, {
                    name: assetName,
                    license: 'none',
                    status: 'error',
                    timestamp: new Date().toISOString(),
                    error: error.message
                });
                return false;
            }
        }
    };

    const controller = {
        start: async () => {
            if (state.isRunning) return;
            state.isRunning = true;
            state.processedAssets = new Map();
            state.errors = [];
            state.currentAssetIndex = 0;
            updateDynamicIsland();
            const exportBtn = document.getElementById('fab-export-btn');
            if (exportBtn) exportBtn.disabled = true;
            utils.log('🚀 Starting auto-grabber...');
            const cards = assetProcessor.getFreeAssetCards();
            state.totalAssets = cards.length;
            utils.log(`Found ${cards.length} free assets`);
            updateDynamicIsland();
            for (let i = 0; i < cards.length && state.isRunning; i++) {
                state.currentAssetIndex = i + 1;
                utils.log(`Processing asset ${state.currentAssetIndex}/${state.totalAssets}`);
                try {
                    await assetProcessor.processCard(cards[i]);
                } catch (error) {
                    utils.log(`Unexpected error: ${error.message}`, 'error');
                }
                updateDynamicIsland();
                if (state.isRunning && i < cards.length - 1) {
                    await utils.wait(config.delayBetweenActions);
                }
            }
            controller.stop();
            utils.log('🎉 Auto-grabber finished!', 'success');
        },
        stop: () => {
            state.isRunning = false;
            const exportBtn = document.getElementById('fab-export-btn');
            if (exportBtn) exportBtn.disabled = false;
            updateDynamicIsland();
            updateAssetsList();
            utils.log('🛑 Auto-grabber stopped');
        }
    };

    const assetList = {
        addAsset: (name, license, status, error = null) => {
            // Deprecated: now using updateAssetsList()
        },
        clear: () => {
            const listEl = document.getElementById('fab-assets-list');
            if (listEl) listEl.innerHTML = '';
        },
        exportData: () => {
            const data = Array.from(state.processedAssets.values());
            const csv = 'Name,License,Status,Timestamp,Error\n' + data.map(item => `\"${item.name}\",\"${item.license}\",\"${item.status}\",\"${item.timestamp}\",\"${item.error || ''}\"`).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `fab-assets-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    function createDynamicIsland() {
        const svgFilter = document.createElement('div');
        svgFilter.innerHTML = `
            <svg style="display: none">
                <filter id="glass-distortion">
                    <feTurbulence type="turbulence" baseFrequency="0.008" numOctaves="2" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
                </filter>
            </svg>
        `;
        document.head.appendChild(svgFilter);
        const container = document.createElement('div');
        container.id = 'fab-dynamic-island';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            transition: all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
            user-select: none;
            pointer-events: auto;
        `;
        const island = document.createElement('div');
        island.id = 'fab-island';
        island.style.cssText = `
            position: relative;
            border-radius: 20px;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3);
            min-width: 200px;
        `;
        const glassFilter = document.createElement('div');
        glassFilter.className = 'glass-filter';
        glassFilter.style.cssText = `
            position: absolute;
            inset: 0;
            border-radius: inherit;
            z-index: 1;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            filter: url(#glass-distortion) saturate(120%) brightness(1.15);
        `;
        const glassOverlay = document.createElement('div');
        glassOverlay.className = 'glass-overlay';
        glassOverlay.style.cssText = `
            position: absolute;
            inset: 0;
            border-radius: inherit;
            z-index: 2;
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        const glassSpecular = document.createElement('div');
        glassSpecular.className = 'glass-specular';
        glassSpecular.style.cssText = `
            position: absolute;
            inset: 0;
            border-radius: inherit;
            z-index: 3;
            box-shadow: inset 1px 1px 1px rgba(255, 255, 255, 0.4);
        `;
        const glassContent = document.createElement('div');
        glassContent.className = 'glass-content';
        glassContent.style.cssText = `
            position: relative;
            z-index: 4;
            padding: 12px 20px;
            color: white;
            display: flex;
            align-items: center;
            gap: 12px;
            min-height: 44px;
        `;
        const dragHandle = document.createElement('div');
        dragHandle.style.cssText = `
            width: 4px;
            height: 20px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 2px;
            cursor: move;
            flex-shrink: 0;
            border: 1px solid rgba(0, 0, 0, 0.2);
        `;
        const statusDot = document.createElement('div');
        statusDot.id = 'fab-status-dot';
        statusDot.style.cssText = `
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #34c759;
            transition: all 0.3s ease;
            flex-shrink: 0;
            box-shadow: 0 0 10px rgba(52, 199, 89, 0.5);
        `;
        const textContent = document.createElement('div');
        textContent.style.cssText = `
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 2px;
        `;
        const mainText = document.createElement('span');
        mainText.id = 'fab-main-text';
        mainText.textContent = 'Fab Auto Grab';
        mainText.style.cssText = `
            color: white;
            font-size: 14px;
            font-weight: 600;
            white-space: nowrap;
            transition: all 0.3s ease;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
        `;
        const subText = document.createElement('span');
        subText.id = 'fab-sub-text';
        subText.textContent = 'Ready';
        subText.style.cssText = `
            color: rgba(255, 255, 255, 0.9);
            font-size: 11px;
            font-weight: 400;
            white-space: nowrap;
            transition: all 0.3s ease;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 200px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
        `;
        textContent.appendChild(mainText);
        textContent.appendChild(subText);
        glassContent.appendChild(dragHandle);
        glassContent.appendChild(statusDot);
        glassContent.appendChild(textContent);
        island.appendChild(glassFilter);
        island.appendChild(glassOverlay);
        island.appendChild(glassSpecular);
        island.appendChild(glassContent);
        const expandedPanel = document.createElement('div');
        expandedPanel.id = 'fab-expanded-panel';
        expandedPanel.style.cssText = `
            position: absolute;
            top: 60px;
            right: 0;
            width: 350px;
            max-height: 500px;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 8px 24px rgba(0, 0, 0, 0.4);
            opacity: 0;
            pointer-events: none;
            transform: scale(0.9) translateY(-10px);
            transition: all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
        `;
        const expandedGlassFilter = document.createElement('div');
        expandedGlassFilter.style.cssText = `
            position: absolute;
            inset: 0;
            border-radius: inherit;
            z-index: 1;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            filter: url(#glass-distortion) saturate(120%) brightness(1.15);
        `;
        const expandedGlassOverlay = document.createElement('div');
        expandedGlassOverlay.style.cssText = `
            position: absolute;
            inset: 0;
            border-radius: inherit;
            z-index: 2;
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        const expandedGlassSpecular = document.createElement('div');
        expandedGlassSpecular.style.cssText = `
            position: absolute;
            inset: 0;
            border-radius: inherit;
            z-index: 3;
            box-shadow: inset 1px 1px 1px rgba(255, 255, 255, 0.4);
        `;
        const expandedGlassContent = document.createElement('div');
        expandedGlassContent.style.cssText = `
            position: relative;
            z-index: 4;
            padding: 20px;
            color: white;
            height: 100%;
        `;
        expandedPanel.appendChild(expandedGlassFilter);
        expandedPanel.appendChild(expandedGlassOverlay);
        expandedPanel.appendChild(expandedGlassSpecular);
        expandedPanel.appendChild(expandedGlassContent);
        createExpandedContent(expandedGlassContent);
        container.appendChild(island);
        container.appendChild(expandedPanel);
        setupEventListeners(container, island, dragHandle);
        document.body.appendChild(container);
        return container;
    }

    function createExpandedContent(container) {
        const mainContent = document.createElement('div');
        mainContent.id = 'fab-main-content';
        mainContent.style.cssText = `
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 1;
            transform: translateX(0);
        `;
        const progressSection = document.createElement('div');
        progressSection.style.cssText = `
            margin-bottom: 20px;
        `;
        const progressTitle = document.createElement('h4');
        progressTitle.style.cssText = `
            margin: 0 0 10px 0;
            font-size: 16px;
            font-weight: 600;
            color: white;
        `;
        progressTitle.textContent = 'Current Progress';
        const progressBar = document.createElement('div');
        progressBar.id = 'fab-progress-bar';
        progressBar.style.cssText = `
            width: 100%;
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            overflow: hidden;
            margin-bottom: 8px;
        `;
        const progressFill = document.createElement('div');
        progressFill.id = 'fab-progress-fill';
        progressFill.style.cssText = `
            height: 100%;
            background: linear-gradient(90deg, #34c759, #30d158);
            border-radius: 3px;
            width: 0%;
            transition: width 0.3s ease;
        `;
        const progressText = document.createElement('div');
        progressText.id = 'fab-progress-text';
        progressText.style.cssText = `
            font-size: 12px;
            color: rgba(255, 255, 255, 0.9);
            text-align: center;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
        `;
        progressText.textContent = 'Ready to start';
        const foundText = document.createElement('div');
        foundText.id = 'fab-found-text';
        foundText.style.cssText = `
            font-size: 12px;
            color: rgba(255, 255, 255, 0.9);
            text-align: center;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
        `;
        foundText.textContent = `Found: 0 assets`;
        progressBar.appendChild(progressFill);
        progressSection.appendChild(progressTitle);
        progressSection.appendChild(progressBar);
        progressSection.appendChild(progressText);
        progressSection.appendChild(foundText);
        const configSection = document.createElement('div');
        configSection.style.cssText = `
            margin-bottom: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
        `;
        const licenseGroup = document.createElement('div');
        licenseGroup.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 5px;
        `;
        const licenseLabel = document.createElement('label');
        licenseLabel.textContent = 'License Preference:';
        licenseLabel.style.cssText = `
            font-size: 12px;
            color: rgba(255, 255, 255, 0.9);
        `;
        const licenseSelect = document.createElement('select');
        licenseSelect.id = 'fab-license-select';
        licenseSelect.innerHTML = `
            <option value="personal">Personal</option>
            <option value="professional">Professional</option>
        `;
        licenseSelect.style.cssText = `
            padding: 8px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            font-size: 13px;
        `;
        licenseGroup.appendChild(licenseLabel);
        licenseGroup.appendChild(licenseSelect);
        const delayGroup = document.createElement('div');
        delayGroup.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 5px;
        `;
        const delayLabel = document.createElement('label');
        delayLabel.textContent = 'Delay (ms):';
        delayLabel.style.cssText = `
            font-size: 12px;
            color: rgba(255, 255, 255, 0.9);
        `;
        const delayInput = document.createElement('input');
        delayInput.id = 'fab-delay-input';
        delayInput.type = 'number';
        delayInput.value = config.delayBetweenActions;
        delayInput.min = '500';
        delayInput.max = '10000';
        delayInput.style.cssText = `
            padding: 8px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            font-size: 13px;
        `;
        delayGroup.appendChild(delayLabel);
        delayGroup.appendChild(delayInput);
        configSection.appendChild(licenseGroup);
        configSection.appendChild(delayGroup);
        const buttonsSection = document.createElement('div');
        buttonsSection.style.cssText = `
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        `;
        const actionButton = document.createElement('button');
        actionButton.id = 'fab-action-btn';
        actionButton.style.cssText = `
            flex: 1;
            padding: 12px;
            border-radius: 12px;
            background: linear-gradient(135deg, #34c759, #30d158);
            border: none;
            color: white;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px rgba(52, 199, 89, 0.3);
        `;
        actionButton.textContent = 'Start Auto Grab';
        const showAssetsButton = document.createElement('button');
        showAssetsButton.id = 'fab-show-assets-btn';
        showAssetsButton.style.cssText = `
            padding: 12px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;
        `;
        showAssetsButton.textContent = `Assets (0)`;
        buttonsSection.appendChild(actionButton);
        buttonsSection.appendChild(showAssetsButton);


        // Social buttons
        const socialContainer = document.createElement('div');
        socialContainer.style.cssText = `
            display: flex;
            gap: 8px;
            justify-content: center;
            margin-bottom: 15px;
        `;

        const socialButtons = [
            { 
               icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 64 64"><style><![CDATA[.C{clip-rule:evenodd}.D{fill:#100f0d}]]></style><defs><clipPath id="A"><path d="M2332.45 5723.53v37c0 20.44-16.57 37-37 37h-12.33c-20.44 0-37-16.57-37-37v-37h-37c-20.44 0-37-16.57-37-37v-12.33c0-20.44 16.57-37 37-37h37v-37c0-20.44 16.57-37 37-37h12.33c20.44 0 37 16.57 37 37v37h37c20.44 0 37 16.57 37 37v12.33c0 20.44-16.57 37-37 37z" class="C"/></clipPath><clipPath id="B"><path d="M-2297.97 261.46H12137.2v9623.42H-2297.97z"/></clipPath><clipPath id="C"><path d="M1534.22 5533.96l-387.92 2.36 190.5-1210.2h464.12l190.5 1210.2z" class="C"/></clipPath><clipPath id="D"><path d="M-2297.97 261.46H12137.2v9623.42H-2297.97z"/></clipPath><clipPath id="E"><path d="M1534.22 5533.96l-387.92 2.36 190.5-1210.2h367.14l190.5 1210.2z" class="C"/></clipPath><clipPath id="F"><path d="M-2297.97 261.46H12137.2v9623.42H-2297.97z"/></clipPath><clipPath id="G"><path d="M1035.47 5536.32h1000.97v111.602H1035.47z"/></clipPath><clipPath id="H"><path d="M1842.48 5829.28H1222.5l-72.73-167.4h765.44z" class="C"/></clipPath><clipPath id="I"><path d="M-2297.97 261.46H12137.2v9623.42H-2297.97z"/></clipPath><clipPath id="J"><path d="M2005.26 5194.53H1059.7l85.37-481.3 387.4 4.2 387.4-4.2z" class="C"/></clipPath><clipPath id="K"><path d="M-2297.97 261.46H12137.2v9623.42H-2297.97z"/></clipPath><clipPath id="L"><path d="M707.297 5228.36c78.582 0 142.293 63.7 142.293 142.3s-63.7 142.3-142.293 142.3S565 5449.24 565 5370.65c0-78.58 63.7-142.3 142.297-142.3z" class="C"/></clipPath><clipPath id="M"><path d="M-2297.97 261.46H12137.2v9623.42H-2297.97z"/></clipPath><clipPath id="N"><path d="M2188.83 4876.8c36.98 0 66.96 29.98 66.96 66.96s-29.98 66.96-66.96 66.96-66.95-29.98-66.95-66.96 29.97-66.96 66.95-66.96z" class="C"/></clipPath><clipPath id="O"><path d="M-2297.97 261.46H12137.2v9623.42H-2297.97z"/></clipPath><clipPath id="P"><path d="M933.293 4491.78c36.98 0 66.957 29.98 66.957 66.96s-29.977 66.96-66.957 66.96-66.965-29.98-66.965-66.96 29.98-66.96 66.965-66.96z" class="C"/></clipPath><clipPath id="Q"><path d="M-2297.97 261.46H12137.2v9623.42H-2297.97z"/></clipPath></defs><g transform="matrix(2.704792 0 0 2.704792 -90.948353 -1833.1808)"><g transform="matrix(.012849 0 0 -.012849 26.365039 755.74948)"><g clip-path="url(#A)"><g clip-path="url(#B)"><path d="M2111.94 5503.03h354.66v354.66h-354.66z" fill="#f9dd05"/></g></g><g clip-path="url(#C)"><g clip-path="url(#D)"><path d="M1086.15 4265.97h965.402v1330.5H1086.15z" fill="#f68313"/></g></g><g clip-path="url(#E)"><g clip-path="url(#F)"><path d="M1086.15 4265.97h868.43v1330.5h-868.43z" fill="#f9dd05"/></g></g><g clip-path="url(#G)"><path d="M975.32 5476.17h1121.26v231.898H975.32z" fill="#fff"/></g></g><path d="M40.004 684.277h12.194v-.766H40.004zm12.862.668h-13.53v-2.102h13.53v2.102" class="D"/><g transform="matrix(.012849 0 0 -.012849 26.365039 755.74948)" clip-path="url(#H)"><g clip-path="url(#I)"><path d="M1089.62 5601.72h885.738v287.703H1089.62z" fill="#fff"/></g></g><path d="M41.648 682.664h8.818l-.645-1.484h-7.53zm9.835.667H40.63l1.225-2.82h8.404l1.225 2.82" fill="#12110f"/><path d="M42.937 699.828h6.283l2.342-14.88-5.486.028-5.482-.028zm6.854.667h-7.424l-2.553-16.22 6.265.032 6.266-.032-2.553 16.22" class="D"/><g transform="matrix(.012849 0 0 -.012849 26.365039 755.74948)" clip-path="url(#J)"><g clip-path="url(#K)"><path d="M999.563 4653.1h1065.85v601.578H999.563z" fill="#fff"/></g></g><path d="M46.053 694.8l4.702.05.978-5.514H40.38l.978 5.514zm5.26.724l-5.26-.057-5.254.057-1.216-6.855H52.53l-1.216 6.855" class="D"/><g transform="matrix(.012849 0 0 -.012849 26.365039 755.74948)"><g clip-path="url(#L)"><g clip-path="url(#M)"><path d="M707.297 5429.25c-32.3 0-58.598-26.3-58.598-58.6s26.3-58.6 58.598-58.6 58.594 26.3 58.594 58.6-26.3 58.6-58.594 58.6zm0-284.6c-124.62 0-225.996 101.38-225.996 226s101.375 226 225.996 226 225.996-101.38 225.996-226c0-124.6-101.38-226-225.996-226" fill="#f1f1f1"/></g></g><g clip-path="url(#N)"><g clip-path="url(#O)"><path d="M2061.73 4816.66h254.2v254.22h-254.2z" fill="#f1f1f1"/></g></g><g clip-path="url(#P)"><g clip-path="url(#Q)"><path d="M806.184 4431.63H1060.4v254.223H806.184z" fill="#f46c35"/></g></g></g></g></svg>`,
                url: 'http://buymeacoffee.com/creos', 
                title: 'Buy me a coffee' 
            },
            { 
                icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.300 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>`, 
                url: 'https://github.com/creosb', 
                title: 'GitHub' 
            },
            { 
                icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                </svg>`, 
                url: 'https://x.com/CreosB', 
                title: 'X (Twitter)' 
            },
            { 
                icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>`, 
                url: 'https://www.youtube.com/@CreosB', 
                title: 'YouTube' 
            }
        ];

        socialButtons.forEach(btn => {
            const button = document.createElement('button');
            button.style.cssText = `
                width: 40px;
                height: 40px;
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.15);
                color: white;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            `;
            button.innerHTML = btn.icon;
            button.title = btn.title;
            button.addEventListener('click', () => window.open(btn.url, '_blank'));
            button.addEventListener('mouseenter', () => {
                button.style.background = 'rgba(255, 255, 255, 0.2)';
                button.style.transform = 'scale(1.1)';
            });
            button.addEventListener('mouseleave', () => {
                button.style.background = 'rgba(255, 255, 255, 0.1)';
                button.style.transform = 'scale(1)';
            });
            socialContainer.appendChild(button);
        });

        // Tip text
        const tipText = document.createElement('p');
        tipText.style.cssText = `
            color: rgba(255, 255, 255, 0.8);
            font-size: 11px;
            margin: 0;
            line-height: 1.4;
            text-align: center;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
        `;
        tipText.textContent = 'Depends on your filters on this page, it automatically adjusts what needs to be grabbed';



        mainContent.appendChild(progressSection);
        mainContent.appendChild(configSection);
        mainContent.appendChild(buttonsSection);
        mainContent.appendChild(socialContainer);
        mainContent.appendChild(tipText);
        const assetsView = document.createElement('div');
        assetsView.id = 'fab-assets-view';
        assetsView.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            padding: 20px;
            background: inherit;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            display: flex;
            flex-direction: column;
        `;
        const assetsHeader = document.createElement('div');
        assetsHeader.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        `;
        const assetsTitle = document.createElement('h4');
        assetsTitle.style.cssText = `
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: white;
        `;
        assetsTitle.textContent = 'Grabbed Assets';
        const backButton = document.createElement('button');
        backButton.id = 'fab-back-btn';
        backButton.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 8px 12px;
            border-radius: 8px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 6px;
        `;
        backButton.innerHTML = '← Back';
        assetsHeader.appendChild(assetsTitle);
        assetsHeader.appendChild(backButton);
        const searchContainer = document.createElement('div');
        searchContainer.style.cssText = `
            position: relative;
            margin-bottom: 15px;
        `;
        const searchInput = document.createElement('input');
        searchInput.id = 'fab-assets-search';
        searchInput.type = 'text';
        searchInput.placeholder = 'Search assets...';
        searchInput.style.cssText = `
            width: 100%;
            padding: 12px 40px 12px 15px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            color: white;
            font-size: 14px;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        `;
        const searchIcon = document.createElement('div');
        searchIcon.style.cssText = `
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(255, 255, 255, 0.6);
            font-size: 16px;
            pointer-events: none;
        `;
        searchIcon.textContent = '🔍';
        const clearButton = document.createElement('button');
        clearButton.id = 'fab-search-clear';
        clearButton.style.cssText = `
            position: absolute;
            right: 40px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.6);
            font-size: 18px;
            cursor: pointer;
            padding: 2px;
            border-radius: 50%;
            opacity: 0;
            transition: all 0.3s ease;
        `;
        clearButton.innerHTML = '×';
        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(searchIcon);
        searchContainer.appendChild(clearButton);
        const exportButton = document.createElement('button');
        exportButton.id = 'fab-export-btn';
        exportButton.textContent = 'Export CSV';
        exportButton.style.cssText = `
            padding: 10px;
            background: linear-gradient(135deg, #2196F3, #1E88E5);
            border: none;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            cursor: pointer;
            margin-bottom: 15px;
            box-shadow: 0 2px 10px rgba(33, 150, 243, 0.3);
        `;
        const assetsList = document.createElement('div');
        assetsList.id = 'fab-assets-list';
        assetsList.style.cssText = `
            flex: 1;
            overflow-y: auto;
            max-height: 300px;
            padding-right: 8px;
        `;
        assetsView.appendChild(assetsHeader);
        assetsView.appendChild(searchContainer);
        assetsView.appendChild(exportButton);
        assetsView.appendChild(assetsList);
        container.appendChild(mainContent);
        container.appendChild(assetsView);
        setupSearchFunctionality(searchInput, clearButton, assetsList);
        setupViewSwitching(showAssetsButton, backButton, mainContent, assetsView, exportButton);
    }

    function setupEventListeners(container, island, dragHandle) {
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };
        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = container.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            dragHandle.style.cursor = 'grabbing';
            container.style.transition = 'none';
            island.style.transition = 'none';
            e.preventDefault();
            e.stopPropagation();
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;
            const maxX = window.innerWidth - container.offsetWidth;
            const maxY = window.innerHeight - container.offsetHeight;
            const clampedX = Math.max(0, Math.min(newX, maxX));
            const clampedY = Math.max(0, Math.min(newY, maxY));
            container.style.left = clampedX + 'px';
            container.style.top = clampedY + 'px';
            container.style.right = 'auto';
        });
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                dragHandle.style.cursor = 'move';
                container.style.transition = 'all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)';
                island.style.transition = 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)';
            }
        });
        island.addEventListener('click', (e) => {
            if (e.target !== dragHandle && !isDragging) {
                toggleExpanded();
            }
        });
        setTimeout(() => {
            const actionButton = document.getElementById('fab-action-btn');
            if (actionButton) {
                actionButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    console.log('[DEBUG] Action button clicked, isRunning:', state.isRunning);
                    if (state.isRunning) {
                        controller.stop();
                    } else {
                        controller.start();
                    }
                });
                actionButton.addEventListener('mouseenter', () => {
                    actionButton.style.transform = 'scale(1.05)';
                });
                actionButton.addEventListener('mouseleave', () => {
                    actionButton.style.transform = 'scale(1)';
                });
            } else {
                console.log('[DEBUG] Action button not found');
            }
            const licenseSelect = document.getElementById('fab-license-select');
            if (licenseSelect) {
                licenseSelect.value = config.preferredLicense;
                licenseSelect.addEventListener('change', (e) => {
                    config.preferredLicense = e.target.value;
                });
            }
            const delayInput = document.getElementById('fab-delay-input');
            if (delayInput) {
                delayInput.addEventListener('change', (e) => {
                    config.delayBetweenActions = parseInt(e.target.value) || 2000;
                });
            }
        }, 100);
        let animationFrame;
        container.addEventListener('mousemove', (e) => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(() => {
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const specular = container.querySelector('.glass-specular');
                if (specular) {
                    specular.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0) 60%)`;
                }
            });
        });
        container.addEventListener('mouseleave', () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
            const specular = container.querySelector('.glass-specular');
            if (specular) {
                specular.style.background = 'none';
            }
        });
        island.addEventListener('mouseenter', () => {
            if (!isExpanded && !isDragging) {
                island.style.transform = 'scale(1.02)';
            }
        });
        island.addEventListener('mouseleave', () => {
            if (!isExpanded && !isDragging) {
                island.style.transform = 'scale(1)';
            }
        });
    }

    let isExpanded = false;
    function toggleExpanded() {
        isExpanded = !isExpanded;
        const island = document.getElementById('fab-island');
        const expandedPanel = document.getElementById('fab-expanded-panel');
        if (isExpanded) {
            expandedPanel.style.opacity = '1';
            expandedPanel.style.transform = 'scale(1) translateY(0)';
            expandedPanel.style.pointerEvents = 'auto';
            island.style.borderBottomLeftRadius = '12px';
            island.style.borderBottomRightRadius = '12px';
        } else {
            expandedPanel.style.opacity = '0';
            expandedPanel.style.transform = 'scale(0.9) translateY(-10px)';
            expandedPanel.style.pointerEvents = 'none';
            island.style.borderBottomLeftRadius = '20px';
            island.style.borderBottomRightRadius = '20px';
        }
    }

    function updateDynamicIsland() {
        const statusDot = document.getElementById('fab-status-dot');
        const mainText = document.getElementById('fab-main-text');
        const subText = document.getElementById('fab-sub-text');
        const actionButton = document.getElementById('fab-action-btn');
        const showAssetsButton = document.getElementById('fab-show-assets-btn');
        const progressFill = document.getElementById('fab-progress-fill');
        const progressText = document.getElementById('fab-progress-text');
        const foundTextEl = document.getElementById('fab-found-text');
        if (!statusDot || !mainText || !subText) return;
        if (state.isRunning) {
            statusDot.style.background = '#ff3b30';
            statusDot.style.boxShadow = '0 0 10px rgba(255, 59, 48, 0.5)';
            if (state.totalAssets > 0) {
                const progress = (state.currentAssetIndex / state.totalAssets) * 100;
                mainText.textContent = `${state.currentAssetIndex}/${state.totalAssets}`;
                subText.textContent = 'Processing...';
                if (progressFill) {
                    progressFill.style.width = progress + '%';
                }
                if (progressText) {
                    progressText.textContent = `${state.currentAssetIndex} of ${state.totalAssets} assets`;
                }
            } else {
                mainText.textContent = 'Running...';
                subText.textContent = 'Searching for assets...' ;
                if (progressText) {
                    progressText.textContent = 'Initializing...';
                }
            }
            if (actionButton) {
                actionButton.textContent = 'Stop Process';
                actionButton.style.background = 'linear-gradient(135deg, #ff3b30, #ff453a)';
                actionButton.style.boxShadow = '0 4px 20px rgba(255, 59, 48, 0.3)';
            }
        } else {
            statusDot.style.background = '#34c759';
            statusDot.style.boxShadow = '0 0 10px rgba(52, 199, 89, 0.5)';
            mainText.textContent = 'Fab Auto Grab';
            subText.textContent = `Ready • ${state.processedAssets.size} assets grabbed`;
            if (actionButton) {
                actionButton.textContent = 'Start Auto Grab';
                actionButton.style.background = 'linear-gradient(135deg, #34c759, #30d158)';
                actionButton.style.boxShadow = '0 4px 20px rgba(52, 199, 89, 0.3)';
            }
            if (progressFill) {
                progressFill.style.width = '0%';
            }
            if (progressText) {
                progressText.textContent = 'Ready to start';
            }
        }
        if (showAssetsButton) {
            showAssetsButton.textContent = `Assets (${state.processedAssets.size})`;
        }
        if (foundTextEl) {
            foundTextEl.textContent = `Found: ${state.totalAssets} assets`;
        }
    }

    function updateAssetsList() {
        const assetsList = document.getElementById('fab-assets-list');
        if (!assetsList) return;
        assetsList.innerHTML = '';
        const assets = Array.from(state.processedAssets.values());
        if (assets.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.style.cssText = `
                text-align: center;
                color: rgba(255, 255, 255, 0.6);
                font-size: 14px;
                padding: 40px 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
            `;
            emptyMessage.innerHTML = `
                <div style="font-size: 32px; opacity: 0.5;">📦</div>
                <div>No assets grabbed yet</div>
                <div style="font-size: 12px; opacity: 0.7;">Start the auto grabber to grab free assets</div>
            `;
            assetsList.appendChild(emptyMessage);
            return;
        }
        assets.forEach((asset, index) => {
            const assetItem = document.createElement('div');
            assetItem.className = 'asset-item';
            assetItem.style.cssText = `
                padding: 12px;
                margin-bottom: 8px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                opacity: 0;
                transform: translateY(10px);
                animation: fadeInUp 0.3s ease forwards;
                animation-delay: ${index * 0.05}s;
            `;
            const assetHeader = document.createElement('div');
            assetHeader.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 6px;
            `;
            const assetName = document.createElement('div');
            assetName.style.cssText = `
                font-weight: 600;
                font-size: 14px;
                color: white;
                line-height: 1.3;
                flex: 1;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
            `;
            assetName.textContent = asset.name;
            const assetIndex = document.createElement('div');
            assetIndex.style.cssText = `
                font-size: 11px;
                color: rgba(255, 255, 255, 0.5);
                background: rgba(255, 255, 255, 0.1);
                padding: 2px 6px;
                border-radius: 6px;
                margin-left: 8px;
            `;
            assetIndex.textContent = `#${index + 1}`;
            const assetInfo = document.createElement('div');
            assetInfo.style.cssText = `
                font-size: 12px;
                color: rgba(255, 255, 255, 0.6);
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
            const assetLicense = document.createElement('span');
            assetLicense.style.cssText = `
                font-family: monospace;
                background: rgba(255, 255, 255, 0.1);
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 11px;
            `;
            assetLicense.textContent = asset.license;
            const assetTime = document.createElement('span');
            assetTime.style.cssText = `
                font-size: 11px;
                opacity: 0.7;
            `;
            assetTime.textContent = new Date(asset.timestamp).toLocaleTimeString();
            assetInfo.appendChild(assetLicense);
            assetInfo.appendChild(assetTime);
            assetHeader.appendChild(assetName);
            assetHeader.appendChild(assetIndex);
            assetItem.appendChild(assetHeader);
            assetItem.appendChild(assetInfo);
            assetItem.addEventListener('mouseenter', () => {
                assetItem.style.background = 'rgba(255, 255, 255, 0.1)';
                assetItem.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                assetItem.style.transform = 'translateY(-2px)';
                assetItem.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
            });
            assetItem.addEventListener('mouseleave', () => {
                assetItem.style.background = 'rgba(255, 255, 255, 0.05)';
                assetItem.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                assetItem.style.transform = 'translateY(0)';
                assetItem.style.boxShadow = 'none';
            });
            assetsList.appendChild(assetItem);
        });
        if (!document.getElementById('fab-assets-animation')) {
            const style = document.createElement('style');
            style.id = 'fab-assets-animation';
            style.textContent = `
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    function filterAssetsList(searchTerm) {
        const assetItems = document.querySelectorAll('.asset-item');
        let visibleCount = 0;
        assetItems.forEach((item, index) => {
            const assetName = item.querySelector('div div').textContent.toLowerCase();
            const shouldShow = assetName.includes(searchTerm);
            if (shouldShow) {
                item.style.display = 'block';
                item.style.animationDelay = `${visibleCount * 0.03}s`;
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        const assetsList = document.getElementById('fab-assets-list');
        if (assetsList && searchTerm && visibleCount === 0 && state.processedAssets.size > 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results-message';
            noResults.style.cssText = `
                text-align: center;
                color: rgba(255, 255, 255, 0.6);
                font-size: 14px;
                padding: 40px 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
            `;
            noResults.innerHTML = `
                <div style="font-size: 32px; opacity: 0.5;">🔍</div>
                <div>No assets found</div>
                <div style="font-size: 12px; opacity: 0.7;">Try a different search term</div>
            `;
            const existingNoResults = assetsList.querySelector('.no-results-message');
            if (existingNoResults) {
                existingNoResults.remove();
            }
            assetsList.appendChild(noResults);
        } else {
            const existingNoResults = assetsList.querySelector('.no-results-message');
            if (existingNoResults) {
                existingNoResults.remove();
            }
        }
    }

    function setupSearchFunctionality(searchInput, clearButton, assetsList) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterAssetsList(searchTerm);
            if (searchTerm.length > 0) {
                clearButton.style.opacity = '1';
            } else {
                clearButton.style.opacity = '0';
            }
        });
        searchInput.addEventListener('focus', () => {
            searchInput.style.background = 'rgba(255, 255, 255, 0.15)';
            searchInput.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            searchInput.style.transform = 'translateY(-1px)';
            searchInput.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
        });
        searchInput.addEventListener('blur', () => {
            searchInput.style.background = 'rgba(255, 255, 255, 0.1)';
            searchInput.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            searchInput.style.transform = 'translateY(0)';
            searchInput.style.boxShadow = 'none';
        });
        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            clearButton.style.opacity = '0';
            filterAssetsList('');
            searchInput.focus();
        });
        clearButton.addEventListener('mouseenter', () => {
            clearButton.style.background = 'rgba(255, 255, 255, 0.1)';
            clearButton.style.color = 'white';
        });
        clearButton.addEventListener('mouseleave', () => {
            clearButton.style.background = 'none';
            clearButton.style.color = 'rgba(255, 255, 255, 0.6)';
        });
    }

    function setupViewSwitching(showAssetsButton, backButton, mainContent, assetsView, exportButton) {
        let isInAssetsView = false;
        showAssetsButton.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('[DEBUG] Show assets button clicked');
            if (!isInAssetsView) {
                updateAssetsList();
                mainContent.style.opacity = '0';
                mainContent.style.transform = 'translateX(-100%)';
                setTimeout(() => {
                    assetsView.style.opacity = '1';
                    assetsView.style.transform = 'translateX(0)';
                    assetsView.style.pointerEvents = 'auto';
                    const searchInput = document.getElementById('fab-assets-search');
                    if (searchInput) {
                        setTimeout(() => searchInput.focus(), 200);
                    }
                }, 200);
                isInAssetsView = true;
            }
        });
        backButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isInAssetsView) {
                assetsView.style.opacity = '0';
                assetsView.style.transform = 'translateX(100%)';
                assetsView.style.pointerEvents = 'none';
                setTimeout(() => {
                    mainContent.style.opacity = '1';
                    mainContent.style.transform = 'translateX(0)';
                }, 200);
                isInAssetsView = false;
                const searchInput = document.getElementById('fab-assets-search');
                if (searchInput) {
                    searchInput.value = '';
                    filterAssetsList('');
                }
            }
        });
        exportButton.addEventListener('click', (e) => {
            e.stopPropagation();
            assetList.exportData();
        });
        backButton.addEventListener('mouseenter', () => {
            backButton.style.background = 'rgba(255, 255, 255, 0.15)';
            backButton.style.transform = 'translateX(-2px)';
        });
        backButton.addEventListener('mouseleave', () => {
            backButton.style.background = 'rgba(255, 255, 255, 0.1)';
            backButton.style.transform = 'translateX(0)';
        });
    }
    document.addEventListener('click', (e) => {
        if (isExpanded && !e.target.closest('#fab-dynamic-island')) {
            toggleExpanded();
        }
    });
    let config = {
        preferredLicense: 'professional',
        delayBetweenActions: 2000,
        maxRetries: 2,
        dialogTimeout: 10000,
        autoStart: false
    };
    let state = {
        isRunning: false,
        processedAssets: new Map(),
        currentAssetIndex: 0,
        totalAssets: 0,
        errors: []
    };
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        const checkInterval = setInterval(() => {
            const cards = assetProcessor.getFreeAssetCards();
            if (cards.length > 0) {
                clearInterval(checkInterval);
                createDynamicIsland();
                console.log('[INFO] Fab.com Free Assets Auto-Grabber Pro loaded with Dynamic Island UI.');
            }
        }, 1000);
        setTimeout(() => {
            clearInterval(checkInterval);
        }, 30000);
        setInterval(() => {
            if (!state.isRunning) {
                const cards = assetProcessor.getFreeAssetCards();
                state.totalAssets = cards.length;
                updateDynamicIsland();
            }
        }, 5000);
    }
    init();
})(); 