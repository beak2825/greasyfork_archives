// ==UserScript==
// @name         Pixel SpamBot (TURKISH)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  CanvasPix Spam Bot (made by xm01)
// @match        https://pixelroyal.fun/*
// @match        https://pixmap.fun/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541014/Pixel%20SpamBot%20%28TURKISH%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541014/Pixel%20SpamBot%20%28TURKISH%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let spamInterval = null;
    let aktif = false;
    const intervalMs = 1000;
    const karakterLimiti = 200;

    if (!localStorage.getItem("canvaspix_user_active")) {
        localStorage.setItem("canvaspix_user_active", "true");
    }

    // Sayaçlar
    let gonderimSayisi = 0;
    let baslangicZamani = null;
    let sureInterval = null;

    // UI paneli
    const panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.top = "10px";
    panel.style.right = "10px";
    panel.style.background = "#ffffffee";
    panel.style.border = "1px solid #aaa";
    panel.style.padding = "10px";
    panel.style.zIndex = 999999;
    panel.style.fontFamily = "monospace";
    panel.style.borderRadius = "6px";
    panel.style.boxShadow = "0 0 8px rgba(0,0,0,0.3)";
    panel.style.width = "280px";
    panel.style.backdropFilter = "blur(4px)";
    panel.style.color = "#000";

    // CSS animasyon
    const style = document.createElement("style");
    style.innerHTML = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }`;
    document.head.appendChild(style);

    const keyHint = document.createElement("div");
    keyHint.innerHTML = "<b>🎹 F9 ile başlat / durdur</b>";
    keyHint.style.marginBottom = "6px";
    keyHint.style.color = "#333";

    const status = document.createElement("div");
    status.innerHTML = `⏳ <span style="font-weight:bold;">bekleniyor</span>`;
    status.style.marginBottom = "8px";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "mesaj yaz (max 200)";
    input.style.width = "100%";
    input.style.marginBottom = "6px";
    input.maxLength = karakterLimiti;

    const hata = document.createElement("div");
    hata.style.color = "#b30000";
    hata.style.fontSize = "0.9em";
    hata.style.marginBottom = "6px";

    const gonderimSayisiDiv = document.createElement("div");
    gonderimSayisiDiv.textContent = "📤 gönderilen mesaj: 0";
    gonderimSayisiDiv.style.marginBottom = "4px";
    gonderimSayisiDiv.style.fontSize = "0.9em";

    const sureDiv = document.createElement("div");
    sureDiv.textContent = "⏱ süre: 0s";
    sureDiv.style.marginBottom = "6px";
    sureDiv.style.fontSize = "0.9em";

    const sayac = document.createElement("div");
    sayac.textContent = "🧍 kullanıcı sayısı: yükleniyor...";
    sayac.style.fontSize = "0.9em";
    sayac.style.color = "#444";

    // Dark Mode Düğmesi
    const darkModeBtn = document.createElement("button");
    darkModeBtn.textContent = "🌗 Tema Değiştir";
    darkModeBtn.style.width = "100%";
    darkModeBtn.style.padding = "5px 0";
    darkModeBtn.style.marginTop = "6px";
    darkModeBtn.style.cursor = "pointer";
    darkModeBtn.style.border = "1px solid #666";
    darkModeBtn.style.borderRadius = "3px";
    darkModeBtn.style.background = "#eee";

    let darkMode = false;
    darkModeBtn.onclick = () => {
        darkMode = !darkMode;
        if (darkMode) {
            panel.style.background = "#222";
            panel.style.color = "#eee";
            darkModeBtn.style.background = "#444";
            darkModeBtn.style.color = "#eee";
            hata.style.color = "#f88";
            sayac.style.color = "#ccc";
            gonderimSayisiDiv.style.color = "#ccc";
            sureDiv.style.color = "#ccc";
            keyHint.style.color = "#ccc";
            status.style.color = "#eee";
            input.style.background = "#333";
            input.style.color = "#eee";
            input.style.borderColor = "#555";
        } else {
            panel.style.background = "#ffffffee";
            panel.style.color = "#000";
            darkModeBtn.style.background = "#eee";
            darkModeBtn.style.color = "#000";
            hata.style.color = "#b30000";
            sayac.style.color = "#444";
            gonderimSayisiDiv.style.color = "#000";
            sureDiv.style.color = "#000";
            keyHint.style.color = "#333";
            status.style.color = "#000";
            input.style.background = "#fff";
            input.style.color = "#000";
            input.style.borderColor = "#ccc";
        }
    };

    panel.appendChild(keyHint);
    panel.appendChild(status);
    panel.appendChild(input);
    panel.appendChild(hata);
    panel.appendChild(gonderimSayisiDiv);
    panel.appendChild(sureDiv);
    panel.appendChild(sayac);
    panel.appendChild(darkModeBtn);

    document.body.appendChild(panel);

    function rastgeleKod(uzunluk = 4) {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let sonuc = '';
        for (let i = 0; i < uzunluk; i++) {
            sonuc += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return sonuc;
    }

    function baslatSure() {
        baslangicZamani = Date.now();
        sureDiv.textContent = "⏱ süre: 0s";

        sureInterval = setInterval(() => {
            const saniye = Math.floor((Date.now() - baslangicZamani) / 1000);
            sureDiv.textContent = `⏱ süre: ${saniye}s`;
        }, 1000);
    }

    function durdurSure() {
        clearInterval(sureInterval);
        sureInterval = null;
    }

    function spamBaslat() {
        if (spamInterval) return;

        const mesaj = input.value.trim();

        if (!mesaj) {
            hata.textContent = "⚠ mesaj boş olamaz.";
            return;
        }

        if (mesaj.length > karakterLimiti) {
            hata.textContent = `⚠ mesaj ${karakterLimiti} karakteri geçemez.`;
            return;
        }

        hata.textContent = "";
        aktif = true;
        gonderimSayisi = 0;
        baslatSure();
        status.innerHTML = `<span style="display:inline-block; animation:spin 1s linear infinite;">🔄</span> <b>gönderiliyor</b>`;

        spamInterval = setInterval(() => {
            const mesaj = input.value.trim();
            const inputEl = document.querySelector('input[placeholder="Burada sohbet et"]');
            const buttonEl = document.querySelector('#sendbtn');

            if (inputEl && buttonEl) {
                const tamMesaj = mesaj + " " + rastgeleKod();
                inputEl.value = tamMesaj;
                inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                buttonEl.click();
                gonderimSayisi++;
                gonderimSayisiDiv.textContent = `📤 gönderilen mesaj: ${gonderimSayisi}`;
                console.log("gönderildi:", tamMesaj);
            }
        }, intervalMs);
    }

    function spamDurdur() {
        aktif = false;
        durdurSure();
        status.innerHTML = `⛔ <span style="font-weight:bold;">durdu</span>`;
        clearInterval(spamInterval);
        spamInterval = null;
    }

    window.addEventListener("keydown", (e) => {
        if (e.key === "F9") {
            if (aktif) {
                spamDurdur();
            } else {
                spamBaslat();
            }
        }
    });

    // kullanıcı sayacı (basit simülasyon)
    function guncelleSayac() {
        let count = 0;
        for (let key in localStorage) {
            if (key.startsWith("canvaspix_user_active")) {
                count++;
            }
        }
        sayac.textContent = "🧍 kullanıcı sayısı (yerel): " + count;
    }

    guncelleSayac();
})();
