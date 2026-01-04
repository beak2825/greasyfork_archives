// ==UserScript==
// @name         Auto Labeling
// @version      2.0
// @include      https://*tribalwars.net/game.php?*screen=overview_villages&mode=incomings*subtype=attacks*
// @namespace https://greasyfork.org/users/1388863
// @description Auto labeling incoming attack
// @downloadURL https://update.greasyfork.org/scripts/525046/Auto%20Labeling.user.js
// @updateURL https://update.greasyfork.org/scripts/525046/Auto%20Labeling.meta.js
// ==/UserScript==

// Mengambil elemen yang dibutuhkan
let countdownTimer = null;
const elements = document.querySelectorAll('.quickedit-label');
const labelButton = document.querySelector('input[type="submit"][value="Label"]');
const red = document.querySelectorAll('.command_hover_details');

const NobleCount = Array.from(elements).filter(el => el.textContent.trim() === 'Noble').length;
const largeAttacks = Array.from(red).filter(el =>
    el.getAttribute('data-command-type') === 'attack' &&
    el.getAttribute('data-icon-hint') === 'Large attack (5000+ troops)'
);

let minInterval = parseInt(localStorage.getItem('minInterval')) || 300; // Default 5 minutes
let maxInterval = parseInt(localStorage.getItem('maxInterval')) || 720; // Default 12 minutes
const Player = localStorage.getItem('Player') || '';

// Mengambil flag dan data dari localStorage
let flag = parseInt(localStorage.getItem('autoLabelFlag')) || 0;
let lastNobleCount = parseInt(localStorage.getItem('lastNobleCount')) || 0;
let lastLargeCount = parseInt(localStorage.getItem('lastLargeCount')) || 0;

// Fungsi delay acak (1-2 detik)
function randomDelay() {
    return Math.random() * 1000 + 1000;
}

// Fungsi untuk mengirim pesan ke Telegram
function sendToTelegram(message) {
    const token = '8151644407:AAHl5d3W8wZnQeCaFJHLNouYQCzqgS7zi-s';
    const chatId = '@TW_IncomingATT';
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                console.log('Pesan berhasil dikirim ke Telegram');
            } else {
                console.log('Terjadi kesalahan:', data.description);
            }
        })
        .catch(error => {
            console.log('Error:', error);
        });
}

// Eksekusi langkah-langkah
function executeSteps() {
    if (flag === 0) {
        setTimeout(() => {
            flag = 1;
            localStorage.setItem('autoLabelFlag', flag);
            document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = true;
            });
            console.log('Checkbox "Select All" telah dipilih');
            executeSteps();
        }, randomDelay());
    } else if (flag === 1) {
        setTimeout(() => {
            flag = 2;
            localStorage.setItem('autoLabelFlag', flag);
            if (labelButton) {
                labelButton.click();
                console.log('Tombol "Label" telah diklik');
            }
            executeSteps();
        }, randomDelay());
    } else if (flag === 2) {
        setTimeout(() => {
            console.log(`Jumlah "Noble": ${NobleCount}`);
            console.log(`Jumlah "Large Attacks": ${largeAttacks.length}`);
            if ((NobleCount > 0 && NobleCount !== lastNobleCount) ||
                (largeAttacks.length > 0 && largeAttacks.length !== lastLargeCount)) {
                sendToTelegram(
                    `Player: ${Player}\nIncoming Noble: ${NobleCount}\nIncoming Large Attack: ${largeAttacks.length}`
                );
                localStorage.setItem('lastNobleCount', NobleCount);
                localStorage.setItem('lastLargeCount', largeAttacks.length);
            }
            flag = 0;
            localStorage.setItem('autoLabelFlag', flag);
            startCountdown(Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval);
        }, randomDelay());
    }
}

// Fungsi countdown
function startCountdown(minutes) {
    const countdownElement = document.getElementById('countdown-timer');
    const endTime = Date.now() + minutes * 60000;
    localStorage.setItem('countdownEndTime', endTime);

    if (countdownTimer) clearTimeout(countdownTimer);

    function updateCountdown() {
        const remainingTime = Math.max(0, endTime - Date.now());
        const mins = Math.floor(remainingTime / 60000);
        const secs = Math.floor((remainingTime % 60000) / 1000);

        countdownElement.textContent = `Next execution in: ${mins}m ${secs}s`;

        if (remainingTime > 0) {
            countdownTimer = setTimeout(updateCountdown, 1000);
        } else {
            flag = 0;
            countdownElement.textContent = 'Executing...';
            // startCountdown(0.05);
            executeSteps();
        }
    }

    updateCountdown();
}

// Fungsi menyimpan interval
function saveIntervals() {
    localStorage.setItem('minInterval', minInterval);
    localStorage.setItem('maxInterval', maxInterval);
}

// Fungsi mendapatkan data dari localStorage
function getFromStorage(key, defaultValue) {
    return localStorage.getItem(key) || defaultValue;
}

// UI Pengaturan
function initializeUI() {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.left = '20px';
    container.style.backgroundColor = '#333';
    container.style.color = '#fff';
    container.style.padding = '10px';
    container.style.borderRadius = '5px';
    container.style.zIndex = 10000;

    const countdownElement = document.createElement('div');
    countdownElement.id = 'countdown-timer';
    countdownElement.style.marginBottom = '10px';
    container.appendChild(countdownElement);

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Start Labeling';
    resetButton.style.padding = '5px 10px';
    resetButton.style.marginRight = '5px';
    resetButton.style.border = 'none';
    resetButton.style.borderRadius = '3px';
    resetButton.style.cursor = 'pointer';
    resetButton.style.backgroundColor = '#007bff';
    resetButton.style.color = '#fff';

    resetButton.addEventListener('click', () => {
        console.log('Reset button clicked.');
        startCountdown(0.05);
        setTimeout(() => {
          location.reload();
        }, 2800);
    });

    const settingsButton = document.createElement('button');
    settingsButton.textContent = 'Settings';
    settingsButton.style.padding = '5px 10px';
    settingsButton.style.border = 'none';
    settingsButton.style.borderRadius = '3px';
    settingsButton.style.cursor = 'pointer';
    settingsButton.style.backgroundColor = '#28a745';
    settingsButton.style.color = '#fff';

    settingsButton.addEventListener('click', () => {
        const newPlayer = prompt('Masukkan Nama Player:', getFromStorage('Player', ' '));
        if (newPlayer !== null) {
            localStorage.setItem('Player', newPlayer);
            console.log('Player baru disimpan:', newPlayer);
        }

        const newMin = parseInt(prompt('Minimum Interval (Menit):', minInterval));
        const newMax = parseInt(prompt('Maximum Interval (Menit):', maxInterval));

        if (!isNaN(newMin) && !isNaN(newMax) && newMin > 0 && newMax > newMin) {
            minInterval = newMin;
            maxInterval = newMax;
            saveIntervals();
            alert(`Intervals updated! Min: ${minInterval} Menit, Max: ${maxInterval} Menit`);
        } else {
            alert('Input tidak valid. Masukkan interval yang benar.');
        }
    });

    container.appendChild(resetButton);
    container.appendChild(settingsButton);
    document.body.appendChild(container);
}

// Mulai proses
(function () {
    initializeUI();

    const savedEndTime = localStorage.getItem('countdownEndTime');
    const remainingTime = savedEndTime ? Math.max(0, savedEndTime - Date.now()) : 0;

    if (remainingTime > 0) {
        console.log('Melanjutkan countdown sebelumnya.');
        startCountdown(remainingTime / 60000);
    } else {
        // flag = 0;
        executeSteps();
    }
})();
