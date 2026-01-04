// ==UserScript==
// @name         Semesta Bangkom Auto Sertifikat
// @namespace    https://semestabangkom.id/
// @version      1.0
// @description  Automasi proses sertifikat webinar dengan progress bar dan pause/resume
// @author       You
// @match        https://semestabangkom.id/member/monitor_webinar/monitor?data=*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545376/Semesta%20Bangkom%20Auto%20Sertifikat.user.js
// @updateURL https://update.greasyfork.org/scripts/545376/Semesta%20Bangkom%20Auto%20Sertifikat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // State management
    let isRunning = false;
    let isPaused = false;
    let currentStep = 0;
    let totalSteps = 6;
    let monevCompleted = false;
    let evalCompleted = false;
    let currentDataParam = '';
    let backdrop = null;

    // Get URL parameters
    function getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Set automation status in URL
    function setAutomationStatus(running) {
        const url = new URL(window.location);
        if (running) {
            url.searchParams.set('status_automaton', 'true');
        } else {
            url.searchParams.delete('status_automaton');
        }
        window.history.replaceState({}, '', url.toString());
    }

    // Get unique storage key based on data parameter
    function getStorageKey() {
        const dataParam = getUrlParameter('data') || 'default';
        currentDataParam = dataParam;
        return `autoCertState_${dataParam}`;
    }

    // Create backdrop overlay
    function createBackdrop() {
        backdrop = document.createElement('div');
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(2px);
            z-index: 9999;
            pointer-events: all;
        `;
        document.body.appendChild(backdrop);
    }

    // Remove backdrop overlay
    function removeBackdrop() {
        if (backdrop && backdrop.parentNode) {
            backdrop.parentNode.removeChild(backdrop);
            backdrop = null;
        }
    }

    // Suppress error alerts/popups
    function suppressErrorPopups() {
        // Override window.alert
        window.alert = function(message) {
            if (message && message.toString().toLowerCase().includes('error')) {
                console.log('Suppressed error alert:', message);
                return;
            }
            // Keep original alert for non-error messages
            console.log('Alert:', message);
        };

        // Override console.error to catch and suppress
        const originalConsoleError = console.error;
        console.error = function(...args) {
            const message = args.join(' ');
            if (message.toLowerCase().includes('sertifikat')) {
                console.log('Suppressed certificate error:', message);
                return;
            }
            originalConsoleError.apply(console, args);
        };

        // Listen for error events and suppress them
        window.addEventListener('error', function(e) {
            if (e.message && e.message.toLowerCase().includes('sertifikat')) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Suppressed error event:', e.message);
                return false;
            }
        }, true);
    }

    // CSS untuk UI yang lebih keren
    const styles = `
        .auto-cert-container {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 10001;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(15px);
            border-radius: 20px;
            padding: 20px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.3);
            min-width: 320px;
        }

        .auto-cert-title {
            font-size: 16px;
            font-weight: 700;
            color: #333;
            margin-bottom: 15px;
            text-align: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .auto-cert-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 14px 24px;
            border-radius: 15px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
            transition: all 0.3s ease;
            letter-spacing: 0.5px;
            width: 100%;
            display: block;
            margin-bottom: 15px;
        }

        .auto-cert-button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
        }

        .auto-cert-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .control-buttons {
            display: none;
            gap: 8px;
            margin-bottom: 15px;
            justify-content: space-between;
        }

        .control-btn {
            flex: 1;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            border: none;
            padding: 10px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
        }

        .control-btn:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(240, 147, 251, 0.3);
        }

        .control-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        .control-btn.stop {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
        }

        .progress-container {
            display: none;
            margin-bottom: 15px;
        }

        .progress-text {
            font-size: 13px;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
            text-align: center;
        }

        .progress-bar-container {
            background: rgba(102, 126, 234, 0.1);
            border-radius: 12px;
            height: 10px;
            overflow: hidden;
            margin-bottom: 10px;
        }

        .progress-bar {
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            height: 100%;
            transition: width 0.4s ease;
            border-radius: 12px;
        }

        .step-info {
            font-size: 11px;
            color: #666;
            text-align: center;
            font-weight: 500;
        }

        .status-indicator {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 8px;
        }

        .status-running {
            background: #4caf50;
            animation: pulse 1.5s ease-in-out infinite;
        }

        .status-paused {
            background: #ff9800;
        }

        .status-stopped {
            background: #f44336;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    `;

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Create UI
    const container = document.createElement('div');
    container.className = 'auto-cert-container';
    container.innerHTML = `
        <div class="auto-cert-title">🤖 Auto Sertifikat</div>
        <div class="progress-container" id="progressContainer">
            <div class="progress-text" id="progressText">
                <span class="status-indicator status-running" id="statusIndicator"></span>
                Mempersiapkan automasi...
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar" id="progressBar" style="width: 0%"></div>
            </div>
            <div class="step-info" id="stepInfo">Step 0 dari ${totalSteps}</div>
        </div>
        <div class="control-buttons" id="controlButtons">
            <button class="control-btn" id="pauseBtn">⏸️ Pause</button>
            <button class="control-btn" id="resumeBtn" disabled>▶️ Resume</button>
            <button class="control-btn stop" id="stopBtn">⏹️ Stop</button>
        </div>
        <button class="auto-cert-button" id="mainButton">🚀 Mulai Automasi</button>
    `;
    document.body.appendChild(container);

    // Get elements
    const mainButton = document.getElementById('mainButton');
    const controlButtons = document.getElementById('controlButtons');
    const progressContainer = document.getElementById('progressContainer');
    const progressText = document.getElementById('progressText');
    const progressBar = document.getElementById('progressBar');
    const stepInfo = document.getElementById('stepInfo');
    const statusIndicator = document.getElementById('statusIndicator');
    const pauseBtn = document.getElementById('pauseBtn');
    const resumeBtn = document.getElementById('resumeBtn');
    const stopBtn = document.getElementById('stopBtn');

    // Check if registration is closed
    function isRegistrationClosed() {
        const closedSpan = document.querySelector('span.badge.rounded-pill.badge-danger.text-white');
        return closedSpan && closedSpan.textContent.includes('pendaftaran ditutup');
    }

    // Load saved state
    function loadState() {
        const storageKey = getStorageKey();
        const savedState = localStorage.getItem(storageKey);
        if (savedState) {
            const state = JSON.parse(savedState);
            if (state.isRunning && !state.isPaused) {
                currentStep = state.currentStep || 0;
                monevCompleted = state.monevCompleted || false;
                evalCompleted = state.evalCompleted || false;
                console.log('🔄 Auto-resume dari step:', currentStep, 'untuk data:', currentDataParam);

                // Set automation status in URL
                setAutomationStatus(true);

                setTimeout(() => {
                    resumeFromStep(currentStep);
                }, 2000);
            }
        }
    }

    // Save state
    function saveState() {
        const storageKey = getStorageKey();
        localStorage.setItem(storageKey, JSON.stringify({
            isRunning,
            isPaused,
            currentStep,
            monevCompleted,
            evalCompleted,
            dataParam: currentDataParam,
            timestamp: Date.now()
        }));
    }

    // Clear state
    function clearState() {
        const storageKey = getStorageKey();
        localStorage.removeItem(storageKey);
        setAutomationStatus(false);
    }

    // Update UI
    function updateUI() {
        if (isRunning) {
            mainButton.style.display = 'none';
            controlButtons.style.display = 'flex';
            progressContainer.style.display = 'block';
            pauseBtn.disabled = isPaused;
            resumeBtn.disabled = !isPaused;
            createBackdrop();

            if (isPaused) {
                statusIndicator.className = 'status-indicator status-paused';
            } else {
                statusIndicator.className = 'status-indicator status-running';
            }
        } else {
            mainButton.style.display = 'block';
            controlButtons.style.display = 'none';
            progressContainer.style.display = 'none';
            removeBackdrop();
            statusIndicator.className = 'status-indicator status-stopped';
        }
    }

    // Update progress
    function updateProgress(step, message) {
        currentStep = step;
        const percentage = (step / totalSteps) * 100;
        progressBar.style.width = percentage + '%';
        progressText.innerHTML = `<span class="status-indicator ${isPaused ? 'status-paused' : 'status-running'}" id="statusIndicator"></span>${message}`;
        stepInfo.textContent = `Step ${step} dari ${totalSteps}`;
        saveState();
    }

    // Utility functions
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function findAndClickButton(text) {
        const buttons = Array.from(document.querySelectorAll('button, a'));
        const button = buttons.find(btn => btn.textContent.trim().includes(text));
        if (button) {
            button.click();
            return true;
        }
        return false;
    }

    function clickSwalButton(text) {
        return new Promise((resolve) => {
            const checkSwal = setInterval(() => {
                const swalButtons = document.querySelectorAll('.swal2-confirm, .swal2-cancel, .swal2-deny');
                const targetButton = Array.from(swalButtons).find(btn =>
                    btn.textContent.trim().includes(text)
                );

                if (targetButton) {
                    targetButton.click();
                    clearInterval(checkSwal);
                    resolve(true);
                }
            }, 100);

            setTimeout(() => {
                clearInterval(checkSwal);
                resolve(false);
            }, 5000);
        });
    }

    // Check if modal is open and visible
    function isModalOpen(modalId) {
        const modal = document.getElementById(modalId);
        return modal && modal.classList.contains('show');
    }

    // Wait for modal to open
    function waitForModal(modalId, maxAttempts = 20) {
        return new Promise((resolve) => {
            let attempts = 0;
            const checkModal = setInterval(() => {
                attempts++;
                if (isModalOpen(modalId) || attempts >= maxAttempts) {
                    clearInterval(checkModal);
                    resolve(isModalOpen(modalId));
                }
            }, 500);
        });
    }

    function fillSurvey() {
        const radioInputs = document.querySelectorAll('#modal-survey input[type="radio"]');

        radioInputs.forEach(input => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label && (label.textContent.includes('Sangat Setuju') || label.textContent.includes('Setuju'))) {
                if (label.textContent.includes('Sangat Setuju') ||
                    (label.textContent.includes('Setuju') && !document.querySelector(`input[name="${input.name}"]:checked`))) {
                    input.checked = true;
                }
            }
        });
    }

    function fillEvaluation() {
        const questionGroups = {};
        const radioInputs = document.querySelectorAll('#modal-eval input[type="radio"]');

        radioInputs.forEach(input => {
            const name = input.name;
            if (!questionGroups[name]) {
                questionGroups[name] = [];
            }
            questionGroups[name].push(input);
        });

        Object.keys(questionGroups).forEach(groupName => {
            const options = questionGroups[groupName].filter(input => {
                const label = document.querySelector(`label[for="${input.id}"]`);
                return label && !label.textContent.includes('-') && !input.closest('.d-none');
            });

            if (options.length > 0) {
                const randomIndex = Math.floor(Math.random() * options.length);
                options[randomIndex].checked = true;
            }
        });
    }

    // Check if can pause
    function checkPauseRequest() {
        return new Promise((resolve) => {
            if (isPaused) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    // Wait for registration to open
    async function waitForRegistrationOpen() {
        let attempts = 0;
        const maxAttempts = 30;

        while (isRegistrationClosed() && attempts < maxAttempts) {
            console.log(`⏳ Pendaftaran ditutup, menunggu... (${attempts + 1}/${maxAttempts})`);
            updateProgress(currentStep, `⏳ Menunggu pendaftaran terbuka... (${attempts + 1}/${maxAttempts})`);

            await delay(10000);

            console.log('🔄 Reload page untuk cek status pendaftaran...');
            window.location.reload();
            return;
        }

        if (attempts >= maxAttempts) {
            console.log('❌ Timeout menunggu pendaftaran terbuka');
            updateProgress(currentStep, '❌ Timeout menunggu pendaftaran');
            return false;
        }

        return true;
    }

    // Check if certificate release button exists
    function checkCertificateReleaseButton() {
        const rilisLink = Array.from(document.querySelectorAll('a')).find(link =>
            link.textContent.includes('Rilis Sertifikat')
        );
        return !!rilisLink;
    }

    // Check if download button exists
    function checkDownloadButton() {
        const downloadLink = Array.from(document.querySelectorAll('a')).find(link =>
            link.textContent.includes('Download Sertifikat')
        );
        return !!downloadLink;
    }

    // Main automation steps
    const automationSteps = [
        {
            name: "Cek Pendaftaran Webinar",
            action: async () => {
                if (isRegistrationClosed()) {
                    console.log('🔒 Pendaftaran masih ditutup, menunggu...');
                    await waitForRegistrationOpen();
                    return false;
                }

                const notFollowingSpan = document.querySelector('span.badge.rounded-pill.badge-danger.text-white');
                if (notFollowingSpan && notFollowingSpan.textContent.includes('Anda tidak mengikuti webinar ini')) {
                    const daftarButton = Array.from(document.querySelectorAll('button')).find(btn =>
                        btn.textContent.includes('Daftar Webinar')
                    );

                    if (daftarButton) {
                        daftarButton.classList.remove('disabled');
                        daftarButton.click();
                        await delay(1000);
                        await clickSwalButton('Ya, Yakin !');

                        await delay(2000);
                        console.log('🔄 Reloading page setelah daftar webinar...');
                        window.location.reload();
                        return true;
                    }
                }
                return false;
            }
        },
        {
            name: "Cek Absensi",
            action: async () => {
                const notAbsentSpan = Array.from(document.querySelectorAll('span.badge.rounded-pill.badge-danger.text-white'))
                    .find(span => span.textContent.includes('belum melakukan absensi'));

                if (notAbsentSpan) {
                    if (findAndClickButton('Absen Webinar')) {
                        await delay(1000);
                        await clickSwalButton('Ya, Yakin !');
                        await delay(3000);
                        return true;
                    }
                }
                return false;
            }
        },
        {
            name: "Mengisi Monev",
            action: async () => {
                if (monevCompleted) {
                    console.log('Monev sudah selesai, skip...');
                    return false;
                }

                if (isModalOpen('modal-survey')) {
                    console.log('Modal survey sudah terbuka, isi langsung...');
                } else {
                    if (!findAndClickButton('Isi Monev')) {
                        return false;
                    }

                    const modalOpened = await waitForModal('modal-survey');
                    if (!modalOpened) {
                        console.log('Modal survey gagal terbuka');
                        return false;
                    }
                }

                await delay(2000);

                if (await checkPauseRequest()) return false;

                fillSurvey();
                await delay(1000);

                const simpanButtons = Array.from(document.querySelectorAll('#modal-survey button'));
                const targetSimpan = simpanButtons.find(btn => btn.textContent.includes('Simpan Data'));

                if (targetSimpan) {
                    targetSimpan.click();
                    monevCompleted = true;
                    await delay(3000);
                    return true;
                }
                return false;
            }
        },
        {
            name: "Mengisi Evaluasi",
            action: async () => {
                if (evalCompleted) {
                    console.log('Evaluasi sudah selesai, skip...');
                    return false;
                }

                if (isModalOpen('modal-eval')) {
                    console.log('Modal eval sudah terbuka, isi langsung...');
                } else {
                    await delay(2000);

                    if (!findAndClickButton('Isi Evaluasi')) {
                        return false;
                    }

                    const modalOpened = await waitForModal('modal-eval');
                    if (!modalOpened) {
                        console.log('Modal eval gagal terbuka');
                        return false;
                    }
                }

                await delay(2000);

                if (await checkPauseRequest()) return false;

                fillEvaluation();
                await delay(1000);

                const simpanButtons = Array.from(document.querySelectorAll('#modal-eval button'));
                const targetSimpan = simpanButtons.find(btn => btn.textContent.includes('Simpan Data'));

                if (targetSimpan) {
                    targetSimpan.click();
                    evalCompleted = true;
                    await delay(3000);
                    return true;
                }
                return false;
            }
        },
        {
            name: "Merilis Sertifikat",
            action: async () => {
                // Suppress any error popups during certificate release
                suppressErrorPopups();

                let attempts = 0;
                const maxAttempts = 10;

                while (attempts < maxAttempts) {
                    // Cek apakah sudah ada button Download Sertifikat
                    if (checkDownloadButton()) {
                        console.log('✅ Button Download Sertifikat sudah tersedia');
                        return false; // Skip ke step berikutnya
                    }

                    // Cek apakah masih ada button Rilis Sertifikat
                    if (checkCertificateReleaseButton()) {
                        console.log(`🔄 Button Rilis Sertifikat masih ada, attempt ${attempts + 1}/${maxAttempts}`);

                        const rilisLink = Array.from(document.querySelectorAll('a')).find(link =>
                            link.textContent.includes('Rilis Sertifikat')
                        );

                        if (rilisLink) {
                            try {
                                rilisLink.click();
                                await delay(1000);

                                // Klik konfirmasi tanpa menunggu pop-up error
                                await clickSwalButton('Ya, Yakin !');

                                // Tunggu proses selesai dan force reload
                                await delay(3000);
                                console.log('🔄 Force reloading page setelah rilis sertifikat...');
                                window.location.reload();
                                return true; // Will continue after reload
                            } catch (error) {
                                console.log('Suppressed error during certificate release:', error.message);
                                // Continue anyway
                            }
                        }
                    }

                    // Tunggu dan coba lagi
                    await delay(2000);
                    attempts++;

                    // Force reload untuk refresh status
                    if (attempts < maxAttempts) {
                        console.log('🔄 Force refresh page untuk cek status sertifikat...');
                        window.location.reload();
                        return true; // Exit and let auto-resume handle it
                    }
                }

                console.log('⚠️ Maksimal attempts tercapai untuk rilis sertifikat');
                return false;
            }
        },
        {
            name: "Mendownload Sertifikat",
            action: async () => {
                const downloadLink = Array.from(document.querySelectorAll('a')).find(link =>
                    link.textContent.includes('Download Sertifikat')
                );

                if (downloadLink) {
                    downloadLink.click();
                    console.log('✅ Sertifikat berhasil didownload');
                    return true;
                }

                console.log('❌ Button Download Sertifikat tidak ditemukan');
                return false;
            }
        }
    ];

    // Resume from specific step
    async function resumeFromStep(stepIndex) {
        isRunning = true;
        isPaused = false;
        setAutomationStatus(true);
        updateUI();

        try {
            for (let i = stepIndex; i < automationSteps.length; i++) {
                if (isPaused) {
                    updateProgress(i, "⏸️ Dijeda - " + automationSteps[i].name);
                    return;
                }

                updateProgress(i + 1, "🔄 " + automationSteps[i].name + "...");

                const result = await automationSteps[i].action();

                if (isPaused) {
                    updateProgress(i, "⏸️ Dijeda - " + automationSteps[i].name);
                    return;
                }

                if (result) {
                    updateProgress(i + 1, "✅ " + automationSteps[i].name + " - Selesai");
                } else {
                    updateProgress(i + 1, "⏭️ " + automationSteps[i].name + " - Dilewati");
                }

                await delay(1000);
            }

            // Completed
            updateProgress(totalSteps, "🎉 Automasi Selesai!");
            setTimeout(() => {
                stopAutomation();
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: 'Berhasil!',
                        text: 'Automasi sertifikat telah selesai!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                }
            }, 2000);

        } catch (error) {
            console.error('Error dalam automasi:', error);
            updateProgress(currentStep, "❌ Error: " + error.message);
            setTimeout(() => stopAutomation(), 3000);
        }
    }

    // Start automation
    async function startAutomation() {
        currentStep = 0;
        monevCompleted = false;
        evalCompleted = false;
        setAutomationStatus(true);
        resumeFromStep(0);
    }

    // Stop automation
    function stopAutomation() {
        isRunning = false;
        isPaused = false;
        currentStep = 0;
        monevCompleted = false;
        evalCompleted = false;
        clearState();
        updateUI();
    }

    // Pause automation
    function pauseAutomation() {
        isPaused = true;
        saveState();
        updateUI();
    }

    // Resume automation
    function resumeAutomation() {
        isPaused = false;
        saveState();
        updateUI();
        resumeFromStep(currentStep);
    }

    // Event listeners
    mainButton.addEventListener('click', () => {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Mulai Automasi?',
                text: 'Apakah Anda yakin ingin menjalankan automasi sertifikat?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Ya, Jalankan!',
                cancelButtonText: 'Batal',
                confirmButtonColor: '#667eea',
                cancelButtonColor: '#d33'
            }).then((result) => {
                if (result.isConfirmed) {
                    startAutomation();
                }
            });
        } else {
            if (confirm('Apakah Anda yakin ingin menjalankan automasi sertifikat?')) {
                startAutomation();
            }
        }
    });

    pauseBtn.addEventListener('click', pauseAutomation);
    resumeBtn.addEventListener('click', resumeAutomation);
    stopBtn.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin menghentikan automasi?')) {
            stopAutomation();
        }
    });

    // Initialize error suppression
    suppressErrorPopups();

    // Initialize
    updateUI();
    loadState();

    console.log('🚀 Semesta Bangkom Auto Sertifikat v2.6 loaded!');
    console.log('📋 Data param:', currentDataParam);
    console.log('🔗 Storage key:', getStorageKey());

})();