// ==UserScript==
// @name         Eksisozluk Bahar Temizliği
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Ekşi sözlük bahar temizliği otomasyonu. Yıkar siler tertemiz hale getirir. Acayip bir seviyede betadır. Geliştirme hakkı ona buna herkese açıktır. Geliştir geliştir kullan yani.
// @author       You
// @match        https://eksisozluk.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/531328/Eksisozluk%20Bahar%20Temizli%C4%9Fi.user.js
// @updateURL https://update.greasyfork.org/scripts/531328/Eksisozluk%20Bahar%20Temizli%C4%9Fi.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const DELAY_BETWEEN_REQUESTS = 3000;
    const BLOCK_LINK_SELECTOR = 'a.relation-link[data-name="engelle"]';
    const UNBLOCK_LINK_SELECTOR = 'a.relation-link[data-name="engellemeyi bırak"]';
    const ALREADY_BLOCKED_TEXT = 'isimli kullanıcıyı engellediniz';
    const MAX_RETRIES = 3;

    // State variables
    let statusContainer;
    let progressBar;
    let urlInput;
    let currentRetries = 0;
    let processing = false;
    let processingTimeout = null;
    let tmUsernames = [];
    let currentUsernameIndex = 0;

    // Create Bahar Temizliği UI
    function createUI() {
        // Create main container
        const container = document.createElement('div');
        container.id = 'tm-container';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.zIndex = '99999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        container.style.alignItems = 'flex-end';

        // Create URL input container
        const urlContainer = document.createElement('div');
        urlContainer.style.display = 'flex';
        urlContainer.style.gap = '10px';
        urlContainer.style.width = '100%';
        urlContainer.style.alignItems = 'center';

        // Create URL label
        const urlLabel = document.createElement('label');
        urlLabel.textContent = 'URL:';
        urlLabel.style.color = 'white';
        urlLabel.style.fontWeight = 'bold';

        // Create URL input
        urlInput = document.createElement('input');
        urlInput.id = 'tm-url-input';
        urlInput.type = 'text';
        urlInput.placeholder = 'https://example.com/usernames.txt';
        urlInput.style.flex = '1';
        urlInput.style.padding = '8px';
        urlInput.style.borderRadius = '4px';
        urlInput.style.border = '1px solid #ddd';
        urlInput.style.backgroundColor = 'white';
        urlInput.style.color = 'black';

        // Create main button
        const button = document.createElement('button');
        button.id = 'tm-bahar-temizligi';
        button.textContent = 'Bahar Temizliği';
        button.style.padding = '12px 18px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '6px';
        button.style.cursor = 'pointer';
        button.style.fontWeight = 'bold';
        button.style.fontSize = '14px';
        button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        button.style.transition = 'all 0.3s ease';
        button.style.width = '100%';

        // Create status container
        statusContainer = document.createElement('div');
        statusContainer.id = 'tm-status-container';
        statusContainer.style.width = '350px';
        statusContainer.style.maxHeight = '300px';
        statusContainer.style.overflowY = 'auto';
        statusContainer.style.backgroundColor = 'rgba(255,255,255,0.95)';
        statusContainer.style.padding = '15px';
        statusContainer.style.borderRadius = '8px';
        statusContainer.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        statusContainer.style.display = 'none';
        statusContainer.style.fontFamily = 'Arial, sans-serif';
        statusContainer.style.fontSize = '13px';
        statusContainer.style.color = '#333';

        // Create progress bar container
        const progressContainer = document.createElement('div');
        progressContainer.style.marginTop = '15px';
        progressContainer.style.display = 'flex';
        progressContainer.style.alignItems = 'center';
        progressContainer.style.gap = '10px';

        // Create progress text
        const progressText = document.createElement('div');
        progressText.id = 'tm-progress-text';
        progressText.style.flex = '1';
        progressText.style.fontWeight = 'bold';
        progressText.textContent = 'Hazır';

        // Create progress bar
        progressBar = document.createElement('div');
        progressBar.id = 'tm-progress-bar';
        progressBar.style.height = '8px';
        progressBar.style.backgroundColor = '#e0e0e0';
        progressBar.style.borderRadius = '4px';
        progressBar.style.flex = '3';
        progressBar.style.overflow = 'hidden';

        const progressBarFill = document.createElement('div');
        progressBarFill.id = 'tm-progress-bar-fill';
        progressBarFill.style.height = '100%';
        progressBarFill.style.width = '0%';
        progressBarFill.style.backgroundColor = '#4CAF50';
        progressBarFill.style.transition = 'width 0.5s ease';

        progressBar.appendChild(progressBarFill);
        progressContainer.appendChild(progressText);
        progressContainer.appendChild(progressBar);
        statusContainer.appendChild(progressContainer);

        // Button hover effects
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        });

        // Button click handler
        button.addEventListener('click', function() {
            if (processing) {
                if (confirm('İşlemi durdurmak istediğinize emin misiniz?')) {
                    stopProcessing();
                }
                return;
            }

            const url = urlInput.value.trim();
            if (!url) {
                alert('Lütfen geçerli bir URL girin!');
                return;
            }

            if (confirm('Bahar temizliğine başlamak istediğinize emin misiniz?')) {
                startProcessing();
                loadTextFile(url);
            }
        });

        // Assemble UI
        urlContainer.appendChild(urlLabel);
        urlContainer.appendChild(urlInput);
        container.appendChild(urlContainer);
        container.appendChild(button);
        container.appendChild(statusContainer);
        document.body.appendChild(container);
    }

    // Add status message
    function addStatusMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.style.margin = '8px 0';
        messageDiv.style.padding = '8px 12px';
        messageDiv.style.borderLeft = `4px solid ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'}`;
        messageDiv.style.backgroundColor = 'rgba(255,255,255,0.7)';
        messageDiv.style.borderRadius = '0 4px 4px 0';

        const timestamp = new Date().toLocaleTimeString();
        messageDiv.innerHTML = `<small style="opacity:0.7;">[${timestamp}]</small> <span>${message}</span>`;

        statusContainer.insertBefore(messageDiv, statusContainer.firstChild);
        console.log(`[${type}] ${message}`);
    }

    // Update progress display
    function updateProgress() {
        const button = document.getElementById('tm-bahar-temizligi');
        const progressText = document.getElementById('tm-progress-text');

        if (button && progressText && tmUsernames) {
            const progress = Math.round((currentUsernameIndex / tmUsernames.length) * 100);
            progressText.textContent = `İşleniyor: ${currentUsernameIndex}/${tmUsernames.length} (${progress}%)`;
            document.getElementById('tm-progress-bar-fill').style.width = `${progress}%`;
        }
    }

    // Start processing
    function startProcessing() {
        processing = true;
        const button = document.getElementById('tm-bahar-temizligi');
        button.textContent = 'Durdur';
        button.style.backgroundColor = '#f44336';
        statusContainer.style.display = 'block';
        // Clear any existing timeouts
        if (processingTimeout) {
            clearTimeout(processingTimeout);
            processingTimeout = null;
        }
        // Clear stopped flag
        sessionStorage.removeItem('processingStopped');
    }

    // Stop processing completely
    function stopProcessing() {
        processing = false;
        const button = document.getElementById('tm-bahar-temizligi');
        button.textContent = 'Bahar Temizliği';
        button.style.backgroundColor = '#4CAF50';

        // Clear any pending timeouts
        if (processingTimeout) {
            clearTimeout(processingTimeout);
            processingTimeout = null;
        }

        // Set stopped flag
        sessionStorage.setItem('processingStopped', 'true');

        addStatusMessage('İşlem tamamen durduruldu', 'error');
    }

    // Load and process the text file
    function loadTextFile(fileUrl) {
        GM_xmlhttpRequest({
            method: "GET",
            url: fileUrl,
            onload: function(response) {
                const usernames = response.responseText.split('\n')
                    .map(line => line.trim().replace('@', ''))
                    .filter(line => line.length > 0 && !line.startsWith('//'));

                addStatusMessage(`<strong>${usernames.length}</strong> kullanıcı adı yüklendi`, 'success');

                // Store usernames
                tmUsernames = usernames;
                currentUsernameIndex = 0;
                sessionStorage.setItem('tmUsernames', JSON.stringify(tmUsernames));
                sessionStorage.setItem('currentUsernameIndex', currentUsernameIndex.toString());
                sessionStorage.setItem('fileUrl', fileUrl);

                // Start processing
                processUsernames();
            },
            onerror: function(error) {
                addStatusMessage(`Metin dosyası yüklenirken hata: ${error.statusText}`, 'error');
                stopProcessing();
            }
        });
    }

    // Process each username from the text file
    function processUsernames() {
        if (!processing) return;

        if (!tmUsernames || tmUsernames.length === 0) {
            addStatusMessage('İşlenecek kullanıcı adı bulunamadı!', 'error');
            stopProcessing();
            return;
        }

        // Check if we're already on a profile page
        checkCurrentPage();
    }

    // Check current page state
    function checkCurrentPage() {
        if (!processing) return;

        const profilePattern = /eksisozluk\.com\/biri\/([^\/]+)/;
        const match = window.location.href.match(profilePattern);

        if (match) {
            // We're on a profile page
            const username = decodeURIComponent(match[1]);
            const currentIndex = tmUsernames.indexOf(username);

            if (currentIndex >= 0 && currentIndex === currentUsernameIndex) {
                // This is the expected profile page
                handleProfilePage(username);
                return;
            }
        }

        // Not on the expected profile page, navigate to next
        navigateToNextUser();
    }

    // Navigate to next user profile
    function navigateToNextUser() {
        if (!processing) return;

        if (currentUsernameIndex >= tmUsernames.length) {
            addStatusMessage('<strong>Bahar temizliği tamamlandı!</strong>', 'success');
            stopProcessing();
            sessionStorage.removeItem('tmUsernames');
            sessionStorage.removeItem('currentUsernameIndex');
            sessionStorage.removeItem('fileUrl');
            return;
        }

        const username = tmUsernames[currentUsernameIndex];
        updateProgress();

        const profileUrl = `https://eksisozluk.com/biri/${encodeURIComponent(username)}`;

        if (window.location.href !== profileUrl) {
            addStatusMessage(`<strong>${username}</strong> için profil sayfasına gidiliyor...`);
            window.location.href = profileUrl;
        } else {
            handleProfilePage(username);
        }
    }

    // Handle profile page actions
    function handleProfilePage(username) {
        if (!processing) return;

        // Verify we're on the correct profile
        const currentUrlUsername = decodeURIComponent(window.location.href.split('/biri/')[1] || '');
        if (currentUrlUsername !== username) {
            addStatusMessage(`URL ile beklenen kullanıcı uyuşmuyor: ${currentUrlUsername} != ${username}`, 'error');
            moveToNextUser();
            return;
        }

        // Check if user is already blocked by message
        if (document.body.textContent.includes(`${username} ${ALREADY_BLOCKED_TEXT}`)) {
            addStatusMessage(`<strong>${username}</strong> zaten engellenmiş (mesaj tespit edildi)`, 'info');
            moveToNextUser();
            return;
        }

        // Check if user not found
        if (document.querySelector('.error-page, .not-found')) {
            addStatusMessage(`<strong>${username}</strong> kullanıcısı bulunamadı`, 'error');
            moveToNextUser();
            return;
        }

        // Check if already blocked via UI element
        const unblockLink = document.querySelector(UNBLOCK_LINK_SELECTOR);
        if (unblockLink) {
            addStatusMessage(`<strong>${username}</strong> zaten engellenmiş (buton tespit edildi)`, 'info');
            moveToNextUser();
            return;
        }

        // Find block link
        const blockLink = document.querySelector(BLOCK_LINK_SELECTOR);

        if (blockLink) {
            addStatusMessage(`<strong>${username}</strong> engelleniyor...`, 'success');
            highlightElement(blockLink);

            // Use standard click first
            blockLink.click();

            // Verify if block was successful
            processingTimeout = setTimeout(() => {
                if (!processing) return;

                // Check for either the unblock button OR the success message
                const verifyUnblockLink = document.querySelector(UNBLOCK_LINK_SELECTOR);
                const verifySuccessMessage = document.body.textContent.includes(`${username} ${ALREADY_BLOCKED_TEXT}`);

                if (verifyUnblockLink || verifySuccessMessage) {
                    addStatusMessage(`<strong>${username}</strong> başarıyla engellendi`, 'success');
                    moveToNextUser();
                } else {
                    currentRetries++;
                    if (currentRetries < MAX_RETRIES) {
                        addStatusMessage(`<strong>${username}</strong> engelleme tekrar deneniyor (${currentRetries}/${MAX_RETRIES})`, 'info');
                        processingTimeout = setTimeout(() => handleProfilePage(username), 1000); // Retry
                    } else {
                        addStatusMessage(`<strong>${username}</strong> engelleme işlemi başarısız`, 'error');
                        moveToNextUser();
                    }
                }
            }, 1000);
        } else {
            addStatusMessage(`<strong>${username}</strong> için engelleme bağlantısı bulunamadı`, 'error');
            moveToNextUser();
        }
    }

    // Move to next user
    function moveToNextUser() {
        if (!processing) return;

        currentUsernameIndex++;
        currentRetries = 0;
        sessionStorage.setItem('currentUsernameIndex', currentUsernameIndex.toString());

        if (currentUsernameIndex < tmUsernames.length) {
            processingTimeout = setTimeout(navigateToNextUser, DELAY_BETWEEN_REQUESTS);
        } else {
            addStatusMessage('<strong>Bahar temizliği tamamlandı!</strong>', 'success');
            stopProcessing();
        }
    }

    // Highlight element temporarily
    function highlightElement(element) {
        if (!element) return;
        element.classList.add('tm-highlight');
        setTimeout(() => {
            if (element) element.classList.remove('tm-highlight');
        }, 1000);
    }

    // Initialize script
    function init() {
        GM_addStyle(`
            #tm-container {
                font-family: Arial, sans-serif;
            }
            #tm-url-input {
                min-width: 200px;
            }
            .tm-highlight {
                border: 2px solid red !important;
                animation: tm-pulse 1s infinite;
            }
            @keyframes tm-pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }
            #tm-status-container::-webkit-scrollbar {
                width: 6px;
            }
            #tm-status-container::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 3px;
            }
            #tm-status-container::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 3px;
            }
            #tm-status-container::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
            #tm-bahar-temizligi:focus {
                outline: none;
                box-shadow: 0 0 0 2px rgba(76,175,80,0.5);
            }
            #tm-url-input:focus {
                outline: none;
                border-color: #4CAF50;
                box-shadow: 0 0 0 2px rgba(76,175,80,0.3);
            }
        `);

        createUI();

        // Check if we have usernames in storage (page reload)
        const storedUsernames = sessionStorage.getItem('tmUsernames');
        const storedUrl = sessionStorage.getItem('fileUrl');
        const processingStopped = sessionStorage.getItem('processingStopped');

        if (storedUsernames && storedUrl && !processingStopped) {
            tmUsernames = JSON.parse(storedUsernames);
            currentUsernameIndex = parseInt(sessionStorage.getItem('currentUsernameIndex')) || 0;

            if (tmUsernames && tmUsernames.length > 0) {
                urlInput.value = storedUrl;
                startProcessing();
                checkCurrentPage();
            }
        }
    }

    // Wait for page to load completely
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();