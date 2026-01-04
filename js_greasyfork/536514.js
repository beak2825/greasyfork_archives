// ==UserScript==
// @name         Eazy Quizdana
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Eazy Quizdana: Hitung otomatis + isi input + klik tombol Check dan elemen #Tester setelah captcha diselesaikan, tanpa refresh manual di quizdana.com/game/pertambahan.php secara berulang otomatis.
// @author       Haiqal Syafawi
// @match        https://quizdana.com/game/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536514/Eazy%20Quizdana.user.js
// @updateURL https://update.greasyfork.org/scripts/536514/Eazy%20Quizdana.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let soalTerakhir = "";

    const observer = new MutationObserver(() => {
        const soal = document.querySelector('.soal-countdown');
        const input = document.querySelector('#coin-user');
        const tombol = document.querySelector('.check-btn');
        const tester = document.querySelector('#recaptcha');

        if (soal && input && tombol) {
            const teksSoal = soal.textContent.trim();

            if (teksSoal !== soalTerakhir && input.value === "") {
                const match = teksSoal.match(/(\d+)\s*\+\s*(\d+)/);
                if (match) {
                    const hasil = parseInt(match[1]) + parseInt(match[2]);
                    input.value = hasil;
                    soalTerakhir = teksSoal;
                    console.log(`✅ ${match[1]} + ${match[2]} = ${hasil} dimasukkan.`);

                    // Klik tombol Check jika tidak disabled
                    if (!tombol.disabled) {
                        tombol.click();
                        console.log("✅ Tombol 'Check' diklik langsung.");
                    } else {
                        // Tunggu sampai tombol tidak disabled (captcha selesai)
                        const tombolEnableObserver = new MutationObserver(() => {
                            if (!tombol.disabled) {
                                tombol.click();
                                console.log("✅ Tombol 'Check' diklik setelah captcha.");
                                tombolEnableObserver.disconnect();
                            }
                        });
                        tombolEnableObserver.observe(tombol, {
                            attributes: true,
                            attributeFilter: ['disabled']
                        });
                    }

                    // Klik elemen dengan id="Tester" jika ada
                    if (tester) {
                        tester.click();
                        console.log("✅ Elemen #recaptcha diklik setelah input.");
                    }
                }
            }
        }
    });

    setTimeout(() => {
        observer.observe(document.body, { childList: true, subtree: true });
        console.log("🚀 Script aktif: Eazy Quizdana dijalankan.");
    }, 1000);
})();
