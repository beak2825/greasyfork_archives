// ==UserScript==
// @name         Auto Input Event
// @description  Auto ALLLLL
// @version      1.1
// @include      https://*/game.php*screen=event_horde*
// @namespace https://greasyfork.org/users/1388863
// @downloadURL https://update.greasyfork.org/scripts/530039/Auto%20Input%20Event.user.js
// @updateURL https://update.greasyfork.org/scripts/530039/Auto%20Input%20Event.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Membuat tombol untuk memulai skrip
    let button = document.createElement("button");
    button.innerText = "Auto Fill";
    button.style.position = "fixed";
    button.style.bottom = "50px";
    button.style.right = "20px";
    button.style.padding = "30px 50px";
    button.style.fontSize = "20px";
    button.style.zIndex = "1000";
    button.style.backgroundColor = "#4CAF50";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    document.body.appendChild(button);

    let isRunning = false;
    let confirmButton = document.querySelector('.btn.btn-confirm-yes.btn-centered.btn-confirm-yes-large.btn-puzzle-attempt');
    let count = 0;

    function newgame() {
      setTimeout(() => {
          let newButton = document.querySelector('.btn-default.btn-puzzle-new');
          if (newButton) {
            newButton.click();
            console.log("New Game");
          } else {
            console.log("Tombol konfirmasi tidak ditemukan.");
          }
      }, 1000);  // Delay in milliseconds
    }


    function autoinputevent(slotNumber) {
        let unitData = { available: [], disabled: [] };
        let slotElement = document.querySelector(`.horde-unit-selection[data-slot='${slotNumber}']`);

        if (!slotElement) {
            console.log(`Slot ${slotNumber} tidak ditemukan.`);
            return;
        }

        // Klik elemen untuk membuka popup
        slotElement.click();

        // Tunggu hingga popup muncul
        setTimeout(() => {
            let popup = document.querySelector(".popup_box_content");
            if (!popup) return console.log("Popup tidak ditemukan.");

            // Ambil data unit yang tersedia dan dinonaktifkan
            document.querySelectorAll(".popup_box_content .btn.btn-image.btn-select-unit").forEach(unit => {
                let unitName = unit.getAttribute("data-unit");
                (unit.classList.contains("btn-disabled") ? unitData.disabled : unitData.available).push(unitName);
            });

            console.log(`Slot ${slotNumber} - Available Units:`, unitData.available);
            console.log(`Slot ${slotNumber} - Disabled Units:`, unitData.disabled);

            // Setelah 150ms, tutup popup
            setTimeout(() => {
                let closeButton = document.querySelector('.popup_box_close');
                if (closeButton) {
                    closeButton.click();
                    console.log("Popup ditutup.");

                    // Setelah 150ms, isi input dengan unit random
                    setTimeout(() => {
                        let input = document.querySelector(`input[name='attempt[${slotNumber}]']`);
                        if (input && unitData.available.length > 0) {
                            let randomUnit = unitData.available[Math.floor(Math.random() * unitData.available.length)];
                            input.value = randomUnit;
                            console.log(`Mengisi attempt[${slotNumber}] dengan ${randomUnit}`);
                        } else {
                            console.log(`Tidak ada unit yang tersedia untuk attempt[${slotNumber}].`);
                        }
                    }, 150);
                } else {
                    console.log("Tombol Close tidak ditemukan.");
                }
            }, 150);
        }, 150);
    }

  function getRemainingEnergy() {
    let energyElement = document.querySelector("#horde_energy_display");

    if (!energyElement) {
        console.log("Elemen energi tidak ditemukan.");
        return null;
    }

    let energyText = energyElement.innerText.trim(); // Dapatkan teks "1 / 10"
    let energyParts = energyText.split(" / "); // Pisahkan berdasarkan " / "

    if (energyParts.length !== 2) {
        console.log("Format energi tidak valid.");
        return null;
    }

    let remainingEnergy = parseInt(energyParts[0], 10); // Ambil angka pertama sebagai sisa energi

    if (isNaN(remainingEnergy)) {
        console.log("Energi tidak valid.");
        return null;
    }

    // console.log("Sisa energi:", remainingEnergy);
    return remainingEnergy;
}

    function runAutoInput() {
        let delay = 0;
        for (let slot = 0; slot <= 4; slot++) {
            setTimeout(() => {
                autoinputevent(slot);
            }, delay);
            delay += 750; // Tetap mempertahankan delay seperti pada skrip asli
        }

        // Klik tombol konfirmasi setelah semua proses selesai
        setTimeout(() => {
            let confirmButton = document.querySelector('.btn.btn-confirm-yes.btn-centered.btn-confirm-yes-large.btn-puzzle-attempt');
            if (confirmButton) {
                confirmButton.click();
                console.log("Tombol konfirmasi diklik.");
            } else {
                console.log("Tombol konfirmasi tidak ditemukan.");
            }
        }, delay + 500); // Tetap mempertahankan delay tambahan
    }

  function beliEnergi(pilih) {
    setTimeout(() => {
        document.getElementById('buy-energy-link').click();
    }, 0);

    setTimeout(() => {
        document.querySelector(`a[data-section_id="attack_plans"][data-offer_index="${pilih}"]`).click();
    }, 500);

    setTimeout(() => {
        document.querySelector('.btn.evt-confirm-btn.btn-confirm-yes').click();
    }, 1000);
}


function runLoop() {
    let energy = getRemainingEnergy();
    console.log("Sisa energy = ", energy);

    if (energy < 1) {
        console.log("Membeli 10 energy");
        beliEnergi(2);
        setTimeout(runLoop, 5000);
    } else {
        console.log("Mencari tombol konfirmasi...");

        let buttonFound = false; // Flag untuk menandai apakah tombol sudah ditemukan
        let checkInterval = setInterval(() => {
            let confirmButton = document.querySelector('.btn.btn-confirm-yes.btn-centered.btn-confirm-yes-large.btn-puzzle-attempt');
            if (confirmButton) {
                buttonFound = true;
                console.log("Tombol konfirmasi ditemukan, menjalankan runAutoInput...");
                clearInterval(checkInterval);
                runAutoInput();
                setTimeout(runLoop, 7000);
            }
        }, 1000);

        setTimeout(() => {
            if (!buttonFound) { // Hanya dijalankan jika tombol tidak ditemukan
                if (energy == 1){
                    console.log("Membeli 1 energy");
                    beliEnergi(0);
                    setTimeout(runLoop, 5000);
                }
                clearInterval(checkInterval);
                console.log("Tombol tidak ditemukan dalam 10 detik.");
                newgame();
                count++;
                setTimeout(runLoop, 3000);

            }
        }, 5000);
    }
}






    // Event listener untuk tombol
    button.addEventListener("click", function() {
            runLoop(); // Jalankan fungsi
    });

})();
