// ==UserScript==
// @name         WH balancer
// @version      1.1
// @description  send ress automatically at WH at random intervals (10-20 minutes) with a countdown, reset button, and customizable settings
// @include      https://*/game.php*screen=storage*
// @namespace https://greasyfork.org/users/1388863
// @downloadURL https://update.greasyfork.org/scripts/537824/WH%20balancer.user.js
// @updateURL https://update.greasyfork.org/scripts/537824/WH%20balancer.meta.js
// ==/UserScript==

// Variabel global untuk menyimpan referensi timer
let countdownTimer = null;

// Fungsi untuk menghasilkan waktu tunggu acak dalam milidetik
function getRandomInterval(min, max) {
    return Math.random() * (max - min) + min;
}

// Fungsi untuk mendapatkan nilai dari localStorage atau nilai default jika tidak ada
function getFromStorage(key, defaultValue) {
    return localStorage.getItem(key) || defaultValue;
}

// Fungsi untuk menjalankan langkah-langkah dengan jeda
function executeSteps() {
    console.log('Eksekusi langkah utama dimulai...');

    setTimeout(() => {
        setTimeout(() => {
            balancingResources();
            setTimeout(() => {
                function pressEnterContinuously() {
                    console.log('Menekan tombol Enter...');
                    const event = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true,
                    });
                    document.dispatchEvent(event);
                    setTimeout(pressEnterContinuously, getRandomInterval(500, 1000));
                }

                pressEnterContinuously();
            }, getRandomInterval(2000, 3000));
        }, getRandomInterval(2000, 3000));
    }, getRandomInterval(2000, 3000));
}

// Fungsi utama untuk memulai script
function main() {
    console.log('Menunggu sebelum memuat script eksternal...');
    setTimeout(() => {
        console.log('Memuat script eksternal...');
        $.getScript("https://dl.dropboxusercontent.com/s/bytvle86lj6230c/resBalancer.js?dl=0")
            .done(() => {
                console.log('Script eksternal berhasil dimuat.');
                setTimeout(() => {
                    console.log('Melanjutkan ke langkah utama...');
                    executeSteps();
                }, getRandomInterval(1000, 2000));
            })
            .fail(() => {
                console.error('Gagal memuat script eksternal.');
            });
    }, getRandomInterval(1000, 2000));
}

// Countdown logic
function startCountdown(minutes) {
    const countdownElement = document.getElementById('countdown-timer');
    const endTime = Date.now() + minutes * 60000;
    localStorage.setItem('countdownEndTime', endTime);

    // Hentikan timer sebelumnya jika ada
    if (countdownTimer) {
        clearTimeout(countdownTimer);
    }

    function updateCountdown() {
        const remainingTime = Math.max(0, endTime - Date.now());
        const mins = Math.floor(remainingTime / 60000);
        const secs = Math.floor((remainingTime % 60000) / 1000);

        countdownElement.textContent = `Next execution in: ${mins}m ${secs}s`;

        if (remainingTime > 0) {
            countdownTimer = setTimeout(updateCountdown, 1000);
        } else {
            countdownElement.textContent = 'Executing...';
            main();
            startCountdown(Math.random() * 60 + 60); // Start new countdown with 20-30 minutes
        }
    }

    updateCountdown();
}

// Inisialisasi UI
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
    resetButton.textContent = 'Forced Start';
    resetButton.style.padding = '5px 10px';
    resetButton.style.marginRight = '5px';
    resetButton.style.border = 'none';
    resetButton.style.borderRadius = '3px';
    resetButton.style.cursor = 'pointer';
    resetButton.style.backgroundColor = '#007bff';
    resetButton.style.color = '#fff';

    resetButton.addEventListener('click', () => {
        console.log('Reset button clicked.');
        // main();
        // startCountdown(Math.random() * 10 + 20); // Start new countdown with 20-30 minutes
        startCountdown(0.02); // Start new countdown with 20-30 minutes
        location.reload();
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
        const newTarget = prompt('Masukkan Koordinat Target:', getFromStorage('mintingTarget', ' '));
        if (newTarget !== null) {
            localStorage.setItem('mintingTarget', newTarget);
            console.log('Target baru disimpan:', newTarget);
        }

        const newOrigin = prompt('Masukkan Koordinat Origin:', getFromStorage('mintingOrigin', ' '));
        if (newOrigin !== null) {
            localStorage.setItem('mintingOrigin', newOrigin);
            console.log('Origin baru disimpan:', newOrigin);
        }
    });

    container.appendChild(resetButton);
    container.appendChild(settingsButton);
    document.body.appendChild(container);
}

// Mulai program
(function () {
    initializeUI();

    const savedEndTime = localStorage.getItem('countdownEndTime');
    const remainingTime = savedEndTime ? Math.max(0, savedEndTime - Date.now()) : 0;

    if (remainingTime > 0) {
        console.log('Melanjutkan countdown sebelumnya.');
        startCountdown(remainingTime / 60000);
    } else {
        console.log('Memulai countdown baru.');
        startCountdown(Math.random() * 60 + 60); // Random interval between 20-30 minutes
    }
})();
