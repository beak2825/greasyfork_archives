// ==UserScript==
// @name         Buka Dokumen pengeNIPan
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Buka semua dokumen
// @author       Bu Nur
// @license      Xkhd
// @match        https://siasn-instansi.bkn.go.id/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535248/Buka%20Dokumen%20pengeNIPan.user.js
// @updateURL https://update.greasyfork.org/scripts/535248/Buka%20Dokumen%20pengeNIPan.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const delay = ms => new Promise(res => setTimeout(res, ms));

    async function bukaSemuaDokumen() {
        console.log("Cari tombol Preview");
        const previewButtons = [...document.querySelectorAll("button")].filter(btn =>
            btn.textContent.trim().toLowerCase() === "preview"
        );

        if (previewButtons.length === 0) {
            alert("❌ gagal, mungkin masalah koneksi");
            return;
        }

        for (let i = 0; i < previewButtons.length; i++) {
            console.log(`▶️ [${i + 1}/${previewButtons.length}] Klik Preview`);
            previewButtons[i].click();

            await delay(100); // tunggu modal

            let modal = document.querySelector('.modal.show');
            if (!modal) {
                console.warn("❌ gagal Modal, mungkin masalah koneksi");
                continue;
            }

            let tries = 0;
            let blobLink = null;

            while (tries < 10 && !blobLink) {
                blobLink = modal.querySelector("a[href^='blob:']");
                if (!blobLink) {
                    await delay(100);
                    tries++;
                }
            }

            if (!blobLink) {
                console.warn("❌ Blob gak ketemu.");
            } else {
                console.log(`✅ Blob ketemu: ${blobLink.href}`);
                window.open(blobLink.href, '_blank');
            }

            // Tutup modal
            const closeBtn = [...modal.querySelectorAll("button")].find(btn => btn.textContent.trim().toLowerCase() === "tutup");
            if (closeBtn) {
                console.log("🔒 Tutup modal.");
                closeBtn.click();
            }

            await delay(100);
        }

        console.log("✅ OK");
    }

    function tambahLinkImage() {
        const link = document.createElement('a');
        link.href = '#';
        link.style.position = 'fixed';
        link.style.bottom = '70%';
        link.style.right = '30px';
        link.style.zIndex = 9999;

        const img = document.createElement('img');
        img.src = 'https://lh3.googleusercontent.com/a/AGNmyxaEnKjzfKogUt2-V-11G5OAQMl0OZKBz7562IzJ=s96-c';
        img.alt = 'Buka Semua Dokumen';
        img.style.width = '60px';
        img.style.height = '60px';
        img.style.borderRadius = '50%';
        img.style.cursor = 'pointer';

        img.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        img.onmouseover = () => {
            img.style.transform = 'scale(1.1)';
            img.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.2)';
        };
        img.onmouseout = () => {
            img.style.transform = 'scale(1)';
            img.style.boxShadow = 'none';
        };

        link.appendChild(img);
        link.onclick = bukaSemuaDokumen;

        document.body.appendChild(link);
    }

    window.addEventListener('load', () => {
        setTimeout(tambahLinkImage, 2000);
    });
})();
