// ==UserScript==
// @name         CoreTax DJP Auto Fill - Fast with Retry System
// @namespace    http://tampermonkey.net/
// @version      1.5.7
// @description  Auto fill pajak form in CoreTax DJP (Fast with Retry) - Fixed Interceptor & Loading Issue
// @author       SKyReborN
// @match        https://coretaxdjp.pajak.go.id/payment-portal/id-ID/self-billing?data=*
// @match        https://bappeda.kaltimprov.go.id/smart-spj/spj/kegiatan/create/detail/id=*
// @grant        GM_info
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544076/CoreTax%20DJP%20Auto%20Fill%20-%20Fast%20with%20Retry%20System.user.js
// @updateURL https://update.greasyfork.org/scripts/544076/CoreTax%20DJP%20Auto%20Fill%20-%20Fast%20with%20Retry%20System.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // AUTO FORCE UPDATE - Tidak perlu edit version manual
    async function checkAndForceUpdate() {
        try {
            const currentVersion = GM_info.script.version;
            console.log(`Current version: ${currentVersion}`);

            const response = await fetch('https://greasyfork.org/scripts/544076.json');
            const scriptInfo = await response.json();
            const latestVersion = scriptInfo.version;

            console.log(`Latest version: ${latestVersion}`);

            if (currentVersion !== latestVersion) {
                console.log('🚀 Versi lama terdeteksi! Melakukan force update...');
                showUpdateLoader(currentVersion, latestVersion);
                setTimeout(() => {
                    forceInstallUpdate();
                }, 2000);
                return false;
            }
            return true;

        } catch (error) {
            console.error('Error checking version:', error);
            return true;
        }
    }

    function addReloadButton(wrapper){
        const btn=document.createElement('button');
        btn.textContent='🔄 Muat Ulang Halaman';
        btn.style.cssText='margin-top:24px;padding:12px 28px;font-size:15px;font-weight:600;\
color:#fff;background:#007bff;border:none;border-radius:8px;\
cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.15);';
        btn.onclick=()=>location.reload();
        wrapper.appendChild(btn);
    }

    function showUpdateLoader(currentVer, latestVer) {
        const loader = document.createElement('div');
        loader.id = 'script-update-loader';
        loader.innerHTML = `
            <div style="
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Segoe UI', Arial, sans-serif;
                color: white;
            ">
                <div style="
                    background: rgba(255,255,255,0.1);
                    backdrop-filter: blur(10px);
                    padding: 50px;
                    border-radius: 20px;
                    text-align: center;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.3);
                    border: 1px solid rgba(255,255,255,0.2);
                    max-width: 500px;
                ">
                    <div style="
                        width: 80px;
                        height: 80px;
                        border: 6px solid rgba(255,255,255,0.2);
                        border-top: 6px solid white;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 25px;
                    "></div>

                    <style>
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                        @keyframes pulse {
                            0%, 100% { transform: scale(1); }
                            50% { transform: scale(1.05); }
                        }
                        .update-text {
                            animation: pulse 2s ease-in-out infinite;
                        }
                    </style>

                    <div class="update-text">
                        <h2 style="color: white; margin-bottom: 15px; font-weight: 300; font-size: 28px;">
                            🔄 Script Update
                        </h2>
                        <div style="margin-bottom: 20px;">
                            <p style="margin: 5px 0; font-size: 16px; opacity: 0.9;">
                                <span style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px;">
                                    Versi Saat Ini: <strong>${currentVer}</strong>
                                </span>
                            </p>
                            <p style="margin: 5px 0; font-size: 16px; opacity: 0.9;">
                                <span style="background: rgba(40,167,69,0.8); padding: 4px 8px; border-radius: 4px;">
                                    Versi Terbaru: <strong>${latestVer}</strong>
                                </span>
                            </p>
                        </div>
                        <p style="color: rgba(255,255,255,0.8); margin: 15px 0; font-size: 16px;">
                            Menyiapkan instalasi otomatis...
                        </p>
                        <div style="
                            background: rgba(255,255,255,0.1);
                            padding: 15px;
                            border-radius: 8px;
                            border-left: 4px solid #ffc107;
                            margin-top: 20px;
                            font-size: 14px;
                        ">
                            <strong>⚠️ Penting:</strong> Jangan tutup halaman ini sampai update selesai
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(loader);
        const innerCard = loader.querySelector('div[style*="max-width: 500px"]');
        if (innerCard) addReloadButton(innerCard);
    }

    function forceInstallUpdate() {
        const installURL = 'https://update.greasyfork.org/scripts/544076/CoreTax%20DJP%20Auto%20Fill%20-%20Fast%20with%20Retry%20System.user.js';

        setTimeout(() => {
            const loader = document.getElementById('script-update-loader');
            if(loader){
                loader.innerHTML=`
        <div style="position:fixed;top:0;left:0;width:100%;height:100%;
                    background:linear-gradient(135deg,#28a745 0%,#20c997 100%);
                    z-index:99999;display:flex;align-items:center;justify-content:center;
                    font-family:'Segoe UI',Arial,sans-serif;color:white;">
            <div style="background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);
                        padding:50px;border-radius:20px;text-align:center;
                        box-shadow:0 15px 35px rgba(0,0,0,0.3);
                        border:1px solid rgba(255,255,255,0.2);max-width:500px;
                        animation:bounceIn .6s ease-out;">
                <div style="font-size:72px;margin-bottom:20px;">🔄</div>
                <h2 style="margin-bottom:20px;font-weight:300;">Menginstall Otomatis...</h2>
                <p style="margin:0 0 10px 0;font-size:15px;opacity:.9;">
                    Tab konfirmasi Tampermonkey akan terbuka. Setelah menekan
                    <strong>Overwrite</strong>, klik tombol di bawah bila halaman tidak
                    menyegarkan diri.
                </p>
            </div>
        </div>`;
                const innerCard=loader.querySelector('div[style*="max-width:500px"]');
                if(innerCard) addReloadButton(innerCard);
                setTimeout(()=>window.location.replace(installURL),400);
            }
        }, 1000);
    }

    // Main execution
    checkAndForceUpdate().then(continueScript => {
        if (!continueScript) {
            console.log('Script stopped for update');
            return;
        }

        console.log('✅ Script versi terbaru, melanjutkan eksekusi...');

        let taxData = null;
        let currentStep = 1;
        let errorNotificationShown = false;
        let wrongPICDetected = false;
        let currentWrongPICName = '';
        let nextButtonsIntercepted = new Set(); // Track button yang sudah di-intercept
        let picCheckCompleted = false; // Flag untuk pastikan PIC check hanya sekali

        // ===== CUSTOM NOTIFICATION SYSTEM =====
        function createCustomNotificationSystem() {
            const customCSS = document.createElement('style');
            customCSS.id = 'coretax-custom-notifications';
            customCSS.innerHTML = `
    /* Custom Notification System untuk CoreTax Script */
    .coretax-notification-backdrop {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: rgba(0, 0, 0, 0.6) !important;
        z-index: 99998 !important;
        opacity: 0 !important;
        transition: opacity 0.4s ease-in-out !important;
        backdrop-filter: blur(3px) !important;
        visibility: hidden !important;
    }

    .coretax-notification-backdrop.show {
        opacity: 1 !important;
        visibility: visible !important;
    }

    .coretax-notification-backdrop.hide {
        opacity: 0 !important;
        visibility: hidden !important;
        transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out !important;
    }

    .coretax-notification-container {
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        z-index: 99999 !important;
        pointer-events: none !important;
    }

    .coretax-notification {
        pointer-events: auto !important;
        min-width: 450px !important;
        max-width: 550px !important;
        width: 500px !important;
        margin: 10px 0 !important;
        border-radius: 12px !important;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4) !important;
        font-family: 'Segoe UI', Arial, sans-serif !important;
        position: relative !important;
        opacity: 0 !important;
        transform: scale(0.9) translateY(-20px) !important;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
    }

    .coretax-notification.show {
        opacity: 0.8 !important;
        transform: scale(1) translateY(0) !important;
    }

    .coretax-notification.hide {
        opacity: 0 !important;
        transform: scale(0.9) translateY(-20px) !important;
        transition: all 0.3s ease-in-out !important;
    }

    .coretax-notification-error {
        background: #dc3545 !important;
        color: #fff !important;
        border: 2px solid #c82333 !important;
    }

    .coretax-notification-warning {
        background: #ffc107 !important;
        color: #212529 !important;
        border: 2px solid #e0a800 !important;
    }

    .coretax-notification-success {
        background: #28a745 !important;
        color: #fff !important;
        border: 2px solid #1e7e34 !important;
    }

    .coretax-notification-content {
        padding: 25px !important;
        text-align: center !important;
    }

    .coretax-notification-close {
        position: absolute !important;
        top: 12px !important;
        right: 18px !important;
        color: #fff !important;
        background: none !important;
        border: none !important;
        font-size: 20px !important;
        cursor: pointer !important;
        opacity: 0.8 !important;
        width: 28px !important;
        height: 28px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: 50% !important;
        transition: all 0.2s ease !important;
    }

    .coretax-notification-warning .coretax-notification-close {
        color: #212529 !important;
    }

    .coretax-notification-close:hover {
        opacity: 1 !important;
        background: rgba(255, 255, 255, 0.1) !important;
        transform: scale(1.1) !important;
    }

    .coretax-notification-warning .coretax-notification-close:hover {
        background: rgba(0, 0, 0, 0.1) !important;
    }

    .coretax-error-title, .coretax-warning-title {
        font-size: 22px !important;
        font-weight: bold !important;
        margin-bottom: 18px !important;
        display: block !important;
        text-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
    }

    .coretax-warning-title {
        color: #212529 !important;
        text-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
    }

    .coretax-current-name {
        background: rgba(255,255,255,0.2) !important;
        padding: 10px 14px !important;
        border-radius: 8px !important;
        display: inline-block !important;
        margin: 10px 0 !important;
        font-style: italic !important;
        max-width: 90% !important;
        word-wrap: break-word !important;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.1) !important;
    }

    .coretax-notification-warning .coretax-current-name {
        background: rgba(0,0,0,0.1) !important;
        color: #212529 !important;
    }

    .coretax-required-name {
        background: rgba(255,255,255,0.25) !important;
        padding: 14px !important;
        border-radius: 8px !important;
        margin: 12px 0 !important;
        font-weight: bold !important;
        font-size: 16px !important;
        display: block !important;
        border: 1px solid rgba(255,255,255,0.3) !important;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.1) !important;
    }

    .coretax-notification-warning .coretax-required-name {
        background: rgba(0,0,0,0.1) !important;
        color: #212529 !important;
        border: 1px solid rgba(0,0,0,0.2) !important;
    }

    .coretax-instruction-text {
        margin: 18px 0 !important;
        font-style: italic !important;
        color: #ffe6e6 !important;
        line-height: 1.6 !important;
        font-size: 15px !important;
    }

    .coretax-notification-warning .coretax-instruction-text {
        color: #856404 !important;
    }

    .coretax-dismiss-btn {
        background: #fff !important;
        color: #dc3545 !important;
        border: none !important;
        padding: 14px 28px !important;
        border-radius: 8px !important;
        font-weight: bold !important;
        cursor: pointer !important;
        margin-top: 22px !important;
        font-size: 15px !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        min-width: 160px !important;
    }

    .coretax-notification-warning .coretax-dismiss-btn {
        background: #212529 !important;
        color: #ffc107 !important;
    }

    .coretax-dismiss-btn:hover {
        background: #f8f9fa !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 16px rgba(0,0,0,0.25) !important;
    }

    .coretax-notification-warning .coretax-dismiss-btn:hover {
        background: #343a40 !important;
    }

    .coretax-dismiss-btn:active {
        transform: translateY(0) !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
    }
`;
            document.head.appendChild(customCSS);

            // Buat backdrop
            const backdrop = document.createElement('div');
            backdrop.className = 'coretax-notification-backdrop';
            backdrop.id = 'coretax-backdrop';
            document.body.appendChild(backdrop);

            // Buat container untuk notifications
            const container = document.createElement('div');
            container.className = 'coretax-notification-container';
            container.id = 'coretax-notifications';
            document.body.appendChild(container);
        }

        // Custom notification functions - FIXED DUPLICATE ISSUE
        function showCustomNotification(content, type = 'error', duration = 0) {
            const container = document.getElementById('coretax-notifications');
            const backdrop = document.getElementById('coretax-backdrop');
            if (!container || !backdrop) return;

            // CLEAR EXISTING NOTIFICATIONS IMMEDIATELY
            const existingNotifications = container.querySelectorAll('.coretax-notification');
            existingNotifications.forEach(notif => {
                notif.remove();
            });

            const notification = document.createElement('div');
            notification.className = `coretax-notification coretax-notification-${type}`;

            // Close function
            const closeNotification = () => {
                console.log('Closing notification...');

                notification.classList.add('hide');
                backdrop.classList.remove('show');
                backdrop.classList.add('hide');

                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                    backdrop.classList.remove('show', 'hide');
                    backdrop.style.display = 'none';

                    // Reset error flag hanya untuk success notification
                    if (type === 'success') {
                        errorNotificationShown = false;
                    }
                }, 300);
            };

            // Close button
            const closeBtn = document.createElement('button');
            closeBtn.className = 'coretax-notification-close';
            closeBtn.innerHTML = '×';
            closeBtn.onclick = closeNotification;

            // Content
            const contentDiv = document.createElement('div');
            contentDiv.className = 'coretax-notification-content';
            contentDiv.innerHTML = content;

            notification.appendChild(closeBtn);
            notification.appendChild(contentDiv);
            container.appendChild(notification);

            // Show backdrop
            backdrop.style.display = 'block';
            backdrop.classList.remove('hide');
            backdrop.classList.add('show');

            // Show notification dengan delay untuk smooth animation
            requestAnimationFrame(() => {
                setTimeout(() => {
                    notification.classList.add('show');
                }, 50);
            });

            // Auto remove jika ada duration
            if (duration > 0) {
                setTimeout(() => {
                    closeNotification();
                }, duration);
            }

            // Setup event listeners untuk dismiss button
            setTimeout(() => {
                const dismissBtn = notification.querySelector('.coretax-dismiss-btn');
                if (dismissBtn) {
                    dismissBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        closeNotification();
                    });
                }
            }, 100);

            return notification;
        }

        // Show error notification - FIXED LOADING 3X ISSUE
        function showPICError(currentName) {
            // SINGLE FLAG CHECK - hanya jalankan sekali
            if (errorNotificationShown) {
                console.log('PIC Error notification already shown, skipping...');
                return;
            }

            // SET FLAG IMMEDIATELY untuk prevent duplicate
            errorNotificationShown = true;

            // Show notification langsung tanpa setTimeout untuk avoid race condition
            const errorContent = `
                <div class="coretax-error-title">
                    ❌ NAMA WAJIB PAJAK SALAH!
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>Nama saat ini:</strong><br>
                    <div class="coretax-current-name">${currentName}</div>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>Harap ubah PIC terlebih dahulu ke:</strong>
                    <div class="coretax-required-name">
                        "BADAN PERENCANAAN PEMBANGUNAN DAERAH"
                    </div>
                </div>
                <div class="coretax-instruction-text">
                    Setelah mengubah PIC, anda dapat melanjutkan pembuatan <strong>Kode Billing</strong>
                </div>
                <div style="text-align: center;">
                    <button class="coretax-dismiss-btn">
                        ✖️ Tutup Pesan Ini
                    </button>
                </div>
            `;

            showCustomNotification(errorContent, 'error', 0);
        }

        // Show warning notification untuk user yang ngeyel
        function showPICWarning(currentName) {
            const warningContent = `
                <div class="coretax-warning-title">
                    ⚠️ PERINGATAN: PIC BELUM DIUBAH!
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>Nama PIC saat ini masih:</strong><br>
                    <div class="coretax-current-name">${currentName}</div>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>Anda WAJIB mengubah PIC ke:</strong>
                    <div class="coretax-required-name">
                        "BADAN PERENCANAAN PEMBANGUNAN DAERAH"
                    </div>
                </div>
                <div class="coretax-instruction-text">
                    <strong>Tombol "Lanjut" akan tetap diblokir</strong> hingga PIC diubah dengan benar!<br>
                    Silakan refresh halaman setelah mengubah PIC.
                </div>
                <div style="text-align: center;">
                    <button class="coretax-dismiss-btn">
                        ✖️ Tutup Pesan Ini
                    </button>
                </div>
            `;

            showCustomNotification(warningContent, 'warning', 0);
        }

        // Show success notification dengan custom system
        function showSuccessNotification() {
            const successContent = `
                <div style="font-size: 20px; font-weight: bold; margin-bottom: 12px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                    ✅ Verifikasi Berhasil
                </div>
                <div style="font-size: 16px; margin-bottom: 8px;">
                    Nama Wajib Pajak sudah sesuai!
                </div>
                <div style="font-size: 15px; opacity: 0.9;">
                    Melanjutkan proses automasi...
                </div>
            `;

            showCustomNotification(successContent, 'success', 3000);
        }

        // STRONGER INTERCEPTOR - Disable button completely dan ganti ID
        function disableAndReplaceNextButtons() {
            const nextSelectors = [
                'button#Next',
                'button[id="Next"]',
                'button[label="Lanjut"]',
                'button.ct-ovw-btn-save'
            ];

            nextSelectors.forEach(selector => {
                const buttons = document.querySelectorAll(selector);
                buttons.forEach((button, index) => {
                    if (!nextButtonsIntercepted.has(button)) {
                        console.log(`Disabling and replacing Next button: ${selector} #${index}`);

                        // Mark as intercepted
                        nextButtonsIntercepted.add(button);

                        // GANTI ID untuk prevent original handler
                        const originalId = button.id;
                        button.id = `${originalId}_BLOCKED_${Date.now()}`;

                        // DISABLE button completely
                        button.disabled = true;
                        button.style.opacity = '0.5';
                        button.style.cursor = 'not-allowed';
                        button.style.pointerEvents = 'none';

                        // Remove ALL event listeners by cloning
                        const newButton = button.cloneNode(true);
                        newButton.disabled = false;
                        newButton.style.opacity = '1';
                        newButton.style.cursor = 'pointer';
                        newButton.style.pointerEvents = 'auto';

                        // Add interceptor to new button
                        newButton.addEventListener('click', function(e) {
                            console.log('BLOCKED: Next button clicked with wrong PIC');
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();

                            // Show warning
                            showPICWarning(currentWrongPICName);
                            return false;
                        }, true); // Use capture phase

                        // Replace button
                        button.parentNode.replaceChild(newButton, button);
                        nextButtonsIntercepted.add(newButton);
                    }
                });
            });
        }

        // Monitor untuk button baru yang muncul
        function startNextButtonMonitoring() {
            const observer = new MutationObserver(() => {
                if (wrongPICDetected) {
                    disableAndReplaceNextButtons();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['id', 'class']
            });

            console.log('Next button monitoring started');
        }

        // Extract data from URL parameter
        function extractDataFromURL() {
            const urlParams = new URLSearchParams(window.location.search);
            const dataParam = urlParams.get('data');
            if (dataParam) {
                try {
                    taxData = JSON.parse(decodeURIComponent(dataParam));
                    console.log('Tax data loaded:', taxData);
                } catch (e) {
                    console.error('Error parsing tax data:', e);
                }
            }
        }

        // Fast waitForElement with retry system
        function waitForElement(selector, timeout = 10000, checkInterval = 100) {
            return new Promise((resolve, reject) => {
                const startTime = Date.now();

                function checkForElement() {
                    const element = document.querySelector(selector);
                    if (element) {
                        resolve(element);
                        return;
                    }

                    if (Date.now() - startTime > timeout) {
                        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                    } else {
                        setTimeout(checkForElement, checkInterval);
                    }
                }

                checkForElement();
            });
        }

        // Fast retry system for actions
        async function retryAction(actionFn, maxRetries = 3, delay = 200) {
            for (let i = 0; i < maxRetries; i++) {
                try {
                    const result = await actionFn();
                    if (result) return result;
                } catch (error) {
                    console.log(`Retry ${i + 1}/${maxRetries} failed:`, error.message);
                    if (i === maxRetries - 1) throw error;
                }
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            return false;
        }

        // Fast input filling
        function fillInput(selector, value) {
            return retryAction(async () => {
                const element = await waitForElement(selector, 3000, 50);
                if (element) {
                    element.value = value;
                    element.focus();
                    ['input', 'change', 'blur'].forEach(eventName => {
                        element.dispatchEvent(new Event(eventName, { bubbles: true }));
                    });
                    return true;
                }
                return false;
            });
        }

        // Fast dropdown selection with retry
        function selectDropdownOption(dropdownSelector, optionText) {
            return retryAction(async () => {
                const dropdown = await waitForElement(dropdownSelector, 3000, 50);
                console.log(`Clicking dropdown: ${dropdownSelector}`);

                const trigger = dropdown.querySelector('.p-dropdown-trigger') || dropdown;
                trigger.click();

                await new Promise(resolve => setTimeout(resolve, 300));

                const optionSelectors = [
                    `li[aria-label*="${optionText}"]`,
                    '.p-dropdown-item:not(.p-dropdown-item-group)',
                    'p-dropdownitem li[role="option"]',
                    '.p-dropdown-items li'
                ];

                for (const selector of optionSelectors) {
                    const options = document.querySelectorAll(selector);
                    for (let option of options) {
                        const text = option.textContent.trim();
                        if (text.includes(optionText)) {
                            console.log(`Found option: ${text}, clicking...`);
                            option.click();
                            return true;
                        }
                    }
                }

                throw new Error(`Option "${optionText}" not found`);
            }, 3, 300);
        }

        // Fast button click with retry - BYPASS untuk automasi jika PIC benar
        function clickButton(selectors) {
            return retryAction(async () => {
                for (const selector of selectors) {
                    // Jika PIC salah dan ini tombol Next, skip
                    if (wrongPICDetected && (selector.includes('Next') || selector.includes('Lanjut'))) {
                        console.log('Skipping Next button click - wrong PIC detected');
                        throw new Error('Next button blocked due to wrong PIC');
                    }

                    const button = document.querySelector(selector);
                    if (button && !button.disabled) {
                        console.log(`Clicking button with selector: ${selector}`);
                        button.click();
                        return true;
                    }
                }
                throw new Error('Button not found or disabled');
            });
        }

        // Get tax type description for dropdown selection
        function getTaxTypeDescription(jenispajak) {
            switch (jenispajak) {
                case 'PPN':
                    return 'Pembayaran PPN Dalam Negeri';
                case 'PPh22':
                    return 'Pembayaran PPh Pasal 22';
                case 'PPh23':
                    return 'Pembayaran PPh Pasal 23';
                case 'PPh21':
                    return 'Pembayaran PPh Pasal 21';
                default:
                    return 'Pembayaran PPN Dalam Negeri';
            }
        }

        // Get current month name
        function getCurrentMonth() {
            const months = [
                'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
            ];
            return months[new Date().getMonth()];
        }

        // Get current year
        function getCurrentYear() {
            return new Date().getFullYear().toString();
        }

        // Update status pajak via API
        function updateStatusPajak(detailId) {
            fetch('https://bappeda.kaltimprov.go.id/smart-spj/spj/kegiatan/create/detail/api/update-status-pajak', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ detail_id: detailId })
            }).then(response => response.json())
            .then(data => {
                console.log('Status pajak updated:', data);
            }).catch(error => {
                console.error('Error updating status pajak:', error);
            });
        }

        // Step 1: Fast organization verification and next click - FIXED DUPLICATE LOADING
        async function processStep1() {
            // PREVENT MULTIPLE CALLS
            if (picCheckCompleted) {
                console.log('PIC check already completed, skipping...');
                return;
            }

            console.log('Processing Step 1: Verifying organization...');

            try {
                const orgVerified = await retryAction(async () => {
                    const orgSelectors = [
                        'div.grid.ct-center-label.ct-label div.col-10.ct-center-label.p-0 span.font-weight-bold',
                        '.col-10.ct-center-label.p-0 span.font-weight-bold',
                        'div.col-10 span.font-weight-bold',
                        'span.font-weight-bold'
                    ];

                    let currentWPName = '';

                    for (const selector of orgSelectors) {
                        const elements = document.querySelectorAll(selector);
                        for (let element of elements) {
                            const text = element.textContent.trim();

                            const parentDiv = element.closest('div.grid.ct-center-label.ct-label');
                            if (parentDiv && parentDiv.textContent.includes('Nama Wajib Pajak')) {
                                currentWPName = text;
                                console.log(`Found Nama Wajib Pajak: "${text}"`);

                                if (text.includes('BADAN PERENCANAAN PEMBANGUNAN DAERAH') ||
                                    text.includes('BAPPEDA') ||
                                    text.toUpperCase().includes('KALIMANTAN TIMUR')) {
                                    console.log(`Organization verified! Found: "${text}"`);

                                    // PIC BENAR - Reset flags dan lanjutkan
                                    wrongPICDetected = false;
                                    currentWrongPICName = '';
                                    picCheckCompleted = true; // SET FLAG

                                    showSuccessNotification();
                                    return true;
                                }
                            }
                        }
                    }

                    if (currentWPName) {
                        console.log(`Wrong taxpayer name found: "${currentWPName}"`);

                        // SET FLAGS untuk PIC salah
                        wrongPICDetected = true;
                        currentWrongPICName = currentWPName;
                        picCheckCompleted = true; // SET FLAG

                        // Aktivasi monitoring dan blocking
                        startNextButtonMonitoring();
                        disableAndReplaceNextButtons();

                        // Show error notification SEKALI saja
                        showPICError(currentWPName);
                        throw new Error(`Wrong taxpayer name: ${currentWPName}`);
                    }

                    throw new Error('Taxpayer name not found');
                }, 3, 500); // Reduced retry untuk avoid multiple calls

                if (orgVerified && !wrongPICDetected) {
                    console.log('Looking for Lanjut button...');

                    const nextSelectors = [
                        'button#Next',
                        'button[id="Next"]',
                        'button[label="Lanjut"]',
                        'button.ct-ovw-btn-save',
                        'button:contains("Lanjut")'
                    ];

                    const clicked = await clickButton(nextSelectors);

                    if (clicked) {
                        currentStep = 2;
                        console.log('Next button clicked, moving to step 2...');
                        setTimeout(() => processStep2(), 800);
                    } else {
                        console.error('Could not click Next button');
                    }
                }
            } catch (error) {
                console.error('Error in Step 1:', error);

                if (!error.message.includes('Wrong taxpayer name')) {
                    console.log('DEBUG: Page HTML structure around nama wajib pajak:');
                    const namaWpElements = document.querySelectorAll('div.grid.ct-center-label.ct-label');
                    namaWpElements.forEach((div, index) => {
                        if (div.textContent.includes('Nama Wajib Pajak')) {
                            console.log(`Found nama WP section ${index}:`, div.innerHTML);
                        }
                    });
                }
            }
        }

        // Step 2: Fast tax type and period selection
        async function processStep2() {
            console.log('Processing Step 2: Selecting tax type and period...');
            try {
                console.log('Selecting tax type...');
                await selectDropdownOption('p-dropdown[id="TaxTypeTaxPayment"]', '411618-100 Setoran untuk Deposit Pajak');

                await new Promise(resolve => setTimeout(resolve, 300));

                console.log('Selecting tax period...');
                await selectDropdownOption('p-dropdown[id="TaxPeriod"]', 'Januari - Desember 2025');

                await new Promise(resolve => setTimeout(resolve, 300));

                const nextClicked = await clickButton(['button#Next']);

                if (nextClicked) {
                    currentStep = 3;
                    console.log('Moved to Step 3');
                    setTimeout(() => processStep3(), 800);
                }
            } catch (error) {
                console.error('Error in Step 2:', error);
            }
        }

        // Step 3: Fast form filling - COMPLETE VERSION
        async function processStep3() {
            console.log('Processing Step 3: Filling form details...');
            try {
                await new Promise(resolve => setTimeout(resolve, 500));

                console.log('Filling amount and remarks...');
                const formActions = [
                    fillInput('#AmountInput', taxData.dataobjek_nilaipajak.toString()),
                    fillInput('#Remarks', taxData.dataobjek_redaksipajak)
                ];

                await Promise.all(formActions);
                console.log('Amount and remarks filled successfully');

                await new Promise(resolve => setTimeout(resolve, 300));

                console.log('Selecting deposit description...');
                const taxTypeDesc = getTaxTypeDescription(taxData.dataobjek_jenispajak);
                await selectDropdownOption('p-dropdown[id="deposit-desc"]', taxTypeDesc);

                await new Promise(resolve => setTimeout(resolve, 300));

                console.log('Selecting month...');
                await selectDropdownOption('p-dropdown[id="deposit-month"]', getCurrentMonth());

                await new Promise(resolve => setTimeout(resolve, 300));

                console.log('Selecting year...');
                await selectDropdownOption('p-dropdown[id="deposit-year"]', getCurrentYear());

                await new Promise(resolve => setTimeout(resolve, 400));

                console.log('Clicking download billing code...');
                const downloadSelectors = [
                    'button[id="Download Billing Code"]',
                    'button#Download\\ Billing\\ Code',
                    'button[label*="Unduh"]',
                    'button:contains("Unduh")',
                    '.ct-ovw-btn-save',
                    'button.p-button:contains("Unduh")'
                ];

                const downloaded = await clickButton(downloadSelectors);

                if (downloaded) {
                    console.log('Download initiated successfully');

                    try {
                        console.log(`Updating status pajak for detail ID: ${taxData.dataobjek_id}...`);

                        await new Promise(resolve => setTimeout(resolve, 2000));

                        await updateStatusPajak(taxData.dataobjek_id);
                        console.log('Status pajak updated successfully, closing window in 2 seconds...');

                        setTimeout(() => {
                            console.log('Closing window...');
                            window.close();
                        }, 2000);

                    } catch (error) {
                        console.error('Failed to update status pajak:', error);

                        try {
                            console.log('Retrying status update...');
                            await updateStatusPajak(taxData.dataobjek_id);
                            console.log('Status pajak updated on retry, closing window...');
                        } catch (retryError) {
                            console.error('Retry also failed:', retryError);
                        }

                        setTimeout(() => {
                            console.log('Closing window despite API failure...');
                            window.close();
                        }, 2000);
                    }
                } else {
                    console.error('Failed to click download button');

                    const allButtons = document.querySelectorAll('button');
                    console.log('Available buttons:');
                    allButtons.forEach((btn, index) => {
                        if (btn.textContent.trim()) {
                            console.log(`Button ${index}: id="${btn.id}", class="${btn.className}", text="${btn.textContent.trim()}"`);
                        }
                    });
                }

            } catch (error) {
                console.error('Error in Step 3:', error);

                try {
                    console.log('Error occurred, attempting final status update...');
                    await updateStatusPajak(taxData.dataobjek_id);
                } catch (finalError) {
                    console.error('Final status update failed:', finalError);
                }

                setTimeout(() => {
                    console.log('Closing window due to error...');
                    window.close();
                }, 3000);
            }
        }

        // Fast automation startup
        async function startAutomation() {
            if (!taxData) {
                console.log('No tax data available');
                return;
            }

            console.log('Starting fast automation process...');

            await retryAction(async () => {
                return document.readyState === 'complete' || document.querySelector('button#Next');
            }, 10, 200);

            processStep1();
        }

        // Initialize
        extractDataFromURL();

        // Initialize custom notification system
        createCustomNotificationSystem();

        // Start automation
        if (taxData) {
            setTimeout(startAutomation, 1500);
        }
    });

})();