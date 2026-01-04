// ==UserScript==
// @name         Auto BUY V5.9 Under 64
// @description  Auto buy dengan countdown dan notifikasi error ke Telegram
// @version      1.45
// @include      https://*en145*/game.php*&screen=market&mode=exchange*
// @namespace https://greasyfork.org/users/1388863
// @downloadURL https://update.greasyfork.org/scripts/519846/Auto%20BUY%20V59%20Under%2064.user.js
// @updateURL https://update.greasyfork.org/scripts/519846/Auto%20BUY%20V59%20Under%2064.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isRunning = true;
    let intervalId;
    let lastSubmitTime = 0;

    // Konfigurasi Telegram
    const botToken = "8151644407:AAEzt2C10IC8xGIc_Iaoeno02aPHg-cQFVU";
    const chatId = 0;

    // Default batas premium points
    let limitPremiumPoints = parseInt(localStorage.getItem('limitPremiumPoints'), 10) || 100;

    // Tambahkan tombol untuk mengatur batas premium poin
    let limitButton = document.createElement("button");
    limitButton.innerText = `Set Limit: ${limitPremiumPoints}`;
    limitButton.style.position = "fixed";
    limitButton.style.bottom = "20px";
    limitButton.style.left = "20px";
    limitButton.style.padding = "8px 15px";
    limitButton.style.fontSize = "16px";
    limitButton.style.zIndex = "1000";
    limitButton.style.backgroundColor = "#007BFF"; // Biru
    limitButton.style.color = "white";
    limitButton.style.border = "none";
    limitButton.style.borderRadius = "5px";
    limitButton.style.cursor = "pointer";

    // Tambahkan event listener untuk tombol set limit
    limitButton.addEventListener("click", function () {
        let newLimit = prompt("Masukkan batas Premium Points:", limitPremiumPoints);
        if (newLimit !== null && !isNaN(newLimit) && newLimit >= 0) {
            limitPremiumPoints = parseInt(newLimit, 10);
            localStorage.setItem('limitPremiumPoints', limitPremiumPoints); // Simpan ke local storage
            limitButton.innerText = `Set Limit: ${limitPremiumPoints}`;
        }
    });

    // Tambahkan tombol start/stop
    let toggleButton = document.createElement("button");
    toggleButton.innerText = "Stop Auto Fill";
    toggleButton.style.position = "fixed";
    toggleButton.style.bottom = "20px";
    toggleButton.style.right = "20px";
    toggleButton.style.padding = "8px 15px";
    toggleButton.style.fontSize = "16px";
    toggleButton.style.zIndex = "1000";
    toggleButton.style.backgroundColor = "#FF0000"; // Merah untuk stop
    toggleButton.style.color = "white";
    toggleButton.style.border = "none";
    toggleButton.style.borderRadius = "5px";
    toggleButton.style.cursor = "pointer";

    // Fungsi untuk mendapatkan sisa Premium Points
    function getPremiumPoints() {
        return parseInt(document.getElementById('premium_points')?.textContent.trim(), 10) || 0;
    }

    // Fungsi untuk mendapatkan resource stok tertinggi
    function getHighestStockResource() {
        let woodStock = parseInt(document.getElementById('premium_exchange_stock_wood').innerHTML);
        let ironStock = parseInt(document.getElementById('premium_exchange_stock_iron').innerHTML);
        let stoneStock = parseInt(document.getElementById('premium_exchange_stock_stone').innerHTML);

        if (woodStock >= ironStock && woodStock >= stoneStock && woodStock > 15) {
            return { type: 'wood', stock: woodStock };
        } else if (stoneStock >= woodStock && stoneStock >= ironStock && stoneStock > 15) {
            return { type: 'stone', stock: stoneStock };
        } else if (ironStock > 15) {
            return { type: 'iron', stock: ironStock };
        } else {
            return null;
        }
    }

    // Fungsi untuk mengirim pesan ke Telegram
    function sendTelegramMessage(message) {
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        }).then(response => console.log("Pesan dikirim ke Telegram:", response.status));
    }

    // Fungsi untuk mendeteksi error
    function checkForErrors() {
        let errorMessage = document.querySelector('.error_box .content')?.textContent.match(/Premium Exchange/);
        if (errorMessage) {
            sendTelegramMessage("Pembelian Terhenti");
            clearInterval(intervalId); // Hentikan autofill
            toggleButton.innerText = "Start Auto Fill";
            toggleButton.style.backgroundColor = "#4CAF50"; // Hijau untuk start
            isRunning = false;

            // Mulai countdown 3-5 menit
            let countdownTime = Math.floor(Math.random() * (150000 - 90000 + 1)) + 90000; // antara 3-5 menit (dalam ms)
            let countdownDisplay = document.createElement("div");
            countdownDisplay.style.position = "fixed";
            countdownDisplay.style.bottom = "80px";
            countdownDisplay.style.right = "20px";
            countdownDisplay.style.padding = "10px";
            countdownDisplay.style.backgroundColor = "#FF8C00"; // Orange
            countdownDisplay.style.color = "white";
            countdownDisplay.style.fontSize = "18px";
            countdownDisplay.style.borderRadius = "5px";
            countdownDisplay.style.zIndex = "1000";
            countdownDisplay.innerText = `Dimulai kembali dalam ${Math.floor(countdownTime / 1000)} detik`;
            sendTelegramMessage(`Dimulai kembali dalam ${Math.floor(countdownTime / 1000)} detik`);

            document.body.appendChild(countdownDisplay);

            // Menghitung mundur
            let countdownInterval = setInterval(function () {
                countdownTime -= 1000;
                countdownDisplay.innerText = `Dimulai kembali dalam ${Math.floor(countdownTime / 1000)} detik`;

                // Jika waktu habis
                if (countdownTime <= 0) {
                    clearInterval(countdownInterval);
                    sendTelegramMessage("⏳ Countdown selesai, Pembelian akan kembali dimulai.");
                    setTimeout(function () {
                        toggleAutoFill();
                        location.reload(); // Reload halaman setelah countdown selesai
                    }, 1000);
                }
            }, 1000);
        }
    }

    // Fungsi utama autofill
    function autoFill() {
        let premiumPoints = getPremiumPoints();

        // Hentikan autofill jika sisa premium points kurang dari batas
        if (premiumPoints < limitPremiumPoints) {
            clearInterval(intervalId);
            toggleButton.innerText = "Start Auto Fill";
            toggleButton.style.backgroundColor = "#4CAF50"; // Hijau untuk start
            isRunning = false;
            sendTelegramMessage("Auto Fill dihentikan: Sisa Premium Points di bawah batas");
            console.log("Auto Fill dihentikan: Sisa Premium Points di bawah batas.")
            // alert("Auto Fill dihentikan: Sisa Premium Points di bawah batas.");
            return;
        }

        checkForErrors();

        let resource = getHighestStockResource();
        if (resource) {
            let resourceName = resource.type;
            let buyAmount = 15 * Math.floor(resource.stock / 15);
            document.getElementsByName(`buy_${resourceName}`)[0].value = buyAmount;
            document.getElementsByName(`buy_${resourceName}`)[0].focus();

            let currentTime = new Date().getTime();
            if (currentTime - lastSubmitTime >= 6000) {
                setTimeout(function () {
                    let submitButton = document.querySelector('input[type="submit"][value="Calculate best offer "]');
                    if (submitButton) {
                        submitButton.click();
                        lastSubmitTime = currentTime;

                        setTimeout(function () {
                            let confirmButton = document.querySelector('.confirmation-buttons .btn.evt-confirm-btn.btn-confirm-yes');
                            if (confirmButton) {
                                confirmButton.click();
                                setTimeout(function () {
                                    location.reload();
                                }, 6000);
                            }
                        }, Math.floor(Math.random() * (750 - 500 + 1)) + 500);
                    }
                }, Math.floor(Math.random() * (750 - 500 + 1)) + 500);
            }
        }
    }

    // Fungsi untuk mengaktifkan/mematikan autofill
    function toggleAutoFill() {
        if (isRunning) {
            clearInterval(intervalId);
            toggleButton.innerText = "Start Auto Fill";
            toggleButton.style.backgroundColor = "#4CAF50"; // Hijau
            isRunning = false;
        } else {
            intervalId = setInterval(autoFill, 100);
            toggleButton.innerText = "Stop Auto Fill";
            toggleButton.style.backgroundColor = "#FF0000"; // Merah
            isRunning = true;
        }
    }

    // Tambahkan event listener ke tombol start/stop
    toggleButton.addEventListener("click", toggleAutoFill);

    // Tambahkan tombol ke body
    document.body.appendChild(toggleButton);
    document.body.appendChild(limitButton);

    // Mulai autofill saat halaman dimuat
    intervalId = setInterval(autoFill, 100);
})();
