// ==UserScript==
// @name         Ultimate Auto Refresh with Countdown
// @namespace    http://tampermonkey.net/
// @version      3.8
// @description  Page refresh script with advanced features
// @author       ibomen
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496183/Ultimate%20Auto%20Refresh%20with%20Countdown.user.js
// @updateURL https://update.greasyfork.org/scripts/496183/Ultimate%20Auto%20Refresh%20with%20Countdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultRefreshInterval = 60; // Varsayılan yenileme süresi (saniye)
    let refreshInterval = defaultRefreshInterval;
    let timeLeft = refreshInterval;
    let isRunning = true;
    let theme = localStorage.getItem('theme') || 'dark'; // Tema tercihini yerel depodan al
    let currentLanguage = localStorage.getItem('scriptLanguage') || 'en'; // Dil ayarını yerel depodan al

    const translations = {
        en: {
            pageRefresh: 'Page will refresh in',
            refreshStopped: 'Refresh stopped',
            stop: 'Stop',
            start: 'Start',
            reset: 'Reset',
            refreshInterval: 'Refresh interval (seconds)',
            changeTheme: 'Change Theme',
            donate: 'Donate',
            donationInfo: 'TRX: TC9bVN7tBr6DBjKGDZ51pz8D9TdD4DqreF',
        },
        tr: {
            pageRefresh: 'Sayfa içinde yenilenecek',
            refreshStopped: 'Yenileme durduruldu',
            stop: 'Durdur',
            start: 'Başlat',
            reset: 'Sıfırla',
            refreshInterval: 'Yenileme süresi (saniye)',
            changeTheme: 'Tema Değiştir',
            donate: 'Bağış Yap',
            donationInfo: 'TRX: TC9bVN7tBr6DBjKGDZ51pz8D9TdD4DqreF',
        }
    };

    // Log ekranı oluşturma
    const logDiv = document.createElement('div');
    logDiv.style.position = 'fixed';
    logDiv.style.bottom = '10px';
    logDiv.style.right = '10px';
    logDiv.style.width = '250px';
    logDiv.style.padding = '10px';
    logDiv.style.backgroundColor = theme === 'dark' ? '#000000' : '#ffffff';
    logDiv.style.color = theme === 'dark' ? '#ffffff' : '#000000';
    logDiv.style.fontFamily = 'Arial, sans-serif';
    logDiv.style.zIndex = '9999';
    logDiv.style.borderRadius = '5px';
    document.body.appendChild(logDiv);

    // Site adı ve iconu
    const siteName = document.createElement('div');
    const siteIcon = document.createElement('img');
    siteIcon.src = getFavicon();
    siteIcon.style.width = '16px';
    siteIcon.style.height = '16px';
    siteIcon.style.marginRight = '5px';
    siteName.appendChild(siteIcon);
    siteName.appendChild(document.createTextNode(document.title));
    logDiv.appendChild(siteName);

    // Bağış bölümü
    const donationDiv = document.createElement('div');
    donationDiv.style.display = 'none';
    donationDiv.style.marginTop = '10px';
    donationDiv.style.backgroundColor = theme === 'dark' ? '#000000' : '#ffffff';
    donationDiv.style.padding = '10px';
    donationDiv.style.borderRadius = '5px';
    donationDiv.style.color = theme === 'dark' ? '#ffffff' : '#000000';
    donationDiv.style.wordWrap = 'break-word'; // Ekrana sığmasını sağlamak için eklenen stil
    donationDiv.innerHTML = `<b>${translations[currentLanguage].donationInfo}</b>`;
    logDiv.appendChild(donationDiv);

    // Geri sayım göstergesi
    const countdown = document.createElement('div');
    countdown.style.marginTop = '10px';
    logDiv.appendChild(countdown);

    // Azalan bar
    const progressBar = document.createElement('div');
    progressBar.style.width = '100%';
    progressBar.style.height = '10px';
    progressBar.style.backgroundColor = 'gray';
    progressBar.style.marginTop = '10px';
    progressBar.style.borderRadius = '5px';
    logDiv.appendChild(progressBar);

    const progress = document.createElement('div');
    progress.style.height = '100%';
    progress.style.backgroundColor = 'red';
    progress.style.borderRadius = '5px';
    progressBar.appendChild(progress);

    // Başlat/Durdur butonu
    const toggleButton = document.createElement('button');
    toggleButton.textContent = translations[currentLanguage].stop;
    toggleButton.style.marginTop = '10px';
    toggleButton.style.width = '100%';
    logDiv.appendChild(toggleButton);

    // Sıfırla butonu
    const resetButton = document.createElement('button');
    resetButton.textContent = translations[currentLanguage].reset;
    resetButton.style.marginTop = '5px';
    resetButton.style.width = '100%';
    logDiv.appendChild(resetButton);

    // Yenileme süresi girişi
    const intervalInput = document.createElement('input');
    intervalInput.type = 'number';
    intervalInput.value = refreshInterval;
    intervalInput.style.marginTop = '5px';
    intervalInput.style.width = '100%';
    intervalInput.placeholder = translations[currentLanguage].refreshInterval;
    logDiv.appendChild(intervalInput);

    // Tema değiştirme butonu
    const themeButton = document.createElement('button');
    themeButton.textContent = translations[currentLanguage].changeTheme;
    themeButton.style.marginTop = '5px';
    themeButton.style.width = '100%';
    logDiv.appendChild(themeButton);

    // Bağış butonu
    const donationButton = document.createElement('button');
    donationButton.textContent = translations[currentLanguage].donate;
    donationButton.style.marginTop = '5px';
    donationButton.style.width = '100%';
    logDiv.appendChild(donationButton);

    // Dil seçme butonu
    const languageButton = document.createElement('button');
    languageButton.textContent = currentLanguage === 'en' ? 'Türkçe' : 'English';
    languageButton.style.marginTop = '5px';
    languageButton.style.width = '100%';
    logDiv.appendChild(languageButton);

    // Favicon alma fonksiyonu
    function getFavicon() {
        let favicon = '/favicon.ico';
        const nodeList = document.getElementsByTagName('link');
        for (let i = 0; i < nodeList.length; i++) {
            if (nodeList[i].getAttribute('rel') === 'icon' || nodeList[i].getAttribute('rel') === 'shortcut icon') {
                favicon = nodeList[i].getAttribute('href');
            }
        }
        return favicon;
    }

    // Geri sayım fonksiyonu
    function updateCountdown() {
        if (isRunning) {
            countdown.textContent = `${translations[currentLanguage].pageRefresh} ${timeLeft}`;
            progress.style.width = `${(timeLeft / refreshInterval) * 100}%`;

            if (timeLeft <= 0) {
                refreshPage();
            } else {
                timeLeft--;
            }
        } else {
            countdown.textContent = '';
        }
    }

    // Sayfa yenileme fonksiyonu
    function refreshPage() {
        playSound();
        location.reload();
    }

    // Tema değiştirme fonksiyonu
    function toggleTheme() {
        theme = theme === 'dark' ? 'light' : 'dark';
        logDiv.style.backgroundColor = theme === 'dark' ? '#000000' : '#ffffff';
        logDiv.style.color = theme === 'dark' ? '#ffffff' : '#000000';
        donationDiv.style.backgroundColor = theme === 'dark' ? '#000000' : '#ffffff';
        donationDiv.style.color = theme === 'dark' ? '#ffffff' : '#000000';
        if (theme === 'dark') {
            themeButton.style.backgroundColor = '#ffffff';
            themeButton.style.color = '#000000';
        } else {
            themeButton.style.backgroundColor = '#000000';
            themeButton.style.color = '#ffffff';
        }
        localStorage.setItem('theme', theme); // Tema tercihini yerel depoya kaydet
    }

    // Dil değiştirme fonksiyonu
    function toggleLanguage() {
        currentLanguage = currentLanguage === 'en' ? 'tr' : 'en';
        localStorage.setItem('scriptLanguage', currentLanguage); // Dil ayarını yerel depoya kaydet
        updateTexts();
    }

    // Metinleri güncelleme fonksiyonu
    function updateTexts() {
        toggleButton.textContent = isRunning ? translations[currentLanguage].stop : translations[currentLanguage].start;
        resetButton.textContent = translations[currentLanguage].reset;
        intervalInput.placeholder = translations[currentLanguage].refreshInterval;
        themeButton.textContent = translations[currentLanguage].changeTheme;
        donationButton.textContent = translations[currentLanguage].donate;
        languageButton.textContent = currentLanguage === 'en' ? 'Türkçe' : 'English';
        donationDiv.innerHTML = `<b>${translations[currentLanguage].donationInfo}</b>`;
    }

    // Sesli bildirim oynatma
    function playSound() {
        const audio = new Audio('https://www.soundjay.com/button/beep-07.wav');
        audio.play();
    }

    // Başlat/Durdur butonu tıklama olayını işleme
    toggleButton.addEventListener('click', () => {
        isRunning = !isRunning;
        toggleButton.textContent = isRunning ? translations[currentLanguage].stop : translations[currentLanguage].start;
    });

    // Sıfırla butonu tıklama olayını işleme
    resetButton.addEventListener('click', () => {
        timeLeft = refreshInterval;
    });

    // Yenileme süresi giriş değişikliği olayını işleme
    intervalInput.addEventListener('change', () => {
        refreshInterval = parseInt(intervalInput.value);
        timeLeft = refreshInterval;
    });

    // Tema değiştirme butonu tıklama olayını işleme
    themeButton.addEventListener('click', toggleTheme);

    // Dil seçme butonu tıklama olayını işleme
    languageButton.addEventListener('click', toggleLanguage);

    // Bağış butonu tıklama olayını işleme
    donationButton.addEventListener('click', () => {
        donationDiv.style.display = donationDiv.style.display === 'none' ? 'block' : 'none';
    });

    // Log ekranını göster
    logDiv.style.display = 'block';

    // Geri sayımı başlatma
    updateCountdown();
    setInterval(updateCountdown, 1000);
    updateTexts(); // Dil ayarını yükledikten sonra metinleri güncelle
})();
