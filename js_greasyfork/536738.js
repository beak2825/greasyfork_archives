// ==UserScript==
// @name         Google OAuth Continue Clicker (No Account Select)
// @namespace    ekstra26
// @version      3.2
// @description  Waits for manual account selection, then automatically clicks the 'Continue/Allow' button on the Google OAuth permission screen.
// @match        https://accounts.google.com/*
// @run-at       document-end
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536738/Google%20OAuth%20Continue%20Clicker%20%28No%20Account%20Select%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536738/Google%20OAuth%20Continue%20Clicker%20%28No%20Account%20Select%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Sadece OAuth izin ekranını hedefleyen URL deseni
    const OAUTH_URL_REGEX = /^https:\/\/accounts\.google\.com\/o\/oauth2\//i;

    // Tekrarlayan tıklamaları önlemek için durum bayrağı
    let clickAttemptedOnPermissionScreen = false;

    // Detaylı loglama için yardımcı fonksiyon
    function log(message, ...args) {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[OAuth Script ${timestamp}] ${message}`, ...args);
    }

    // Güvenilir tıklama fonksiyonu
    function robustClick(element) {
        if (!element) {
            log("Hata: Tıklanacak bir element bulunamadı.");
            return;
        }
        log("ROBUST CLICK denemesi başlatıldı:", element);

        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        const clickSequence = [
            () => { log("Adım 1: focus"); if (typeof element.focus === 'function') element.focus(); },
            () => { log("Adım 2: mousedown"); element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window, buttons: 1 })); },
            () => { log("Adım 3: mouseup"); element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window, buttons: 1 })); },
            () => { log("Adım 4: click (MouseEvent)"); element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window, buttons: 1 })); },
            () => { log("Adım 5: .click() metodu"); if (typeof element.click === 'function') element.click(); },
            () => { log("Tıklama sekansı tamamlandı."); }
        ];

        let delay = 200; // Başlangıç gecikmesi
        for (const action of clickSequence) {
            setTimeout(action, delay);
            delay += 150; // Her adım arası gecikme
        }
    }

    // Devam Et / İzin Ver butonunu bulup tıklayan fonksiyon
    function findAndClickContinueButton() {
        if (clickAttemptedOnPermissionScreen) {
            // Bu ekranda zaten tıklama denendi, tekrar deneme.
            return;
        }

        const targetTexts = ['continue', 'allow', 'ok', 'tamam', 'devam et', 'izin ver', 'onayla', 'ileri'];
        const targetButtonClass = 'VfPpkd-RLmnJb'; // Google'ın standart buton class'ı

        log(`"${targetButtonClass}" class'ına sahip butonlar aranıyor...`);
        const candidateButtons = Array.from(document.querySelectorAll(`button.${targetButtonClass}`));

        if (candidateButtons.length === 0) {
            log("Potansiyel buton bulunamadı.");
            return;
        }

        let buttonToClick = null;
        for (const button of candidateButtons) {
            const textContent = (button.textContent || "").trim().toLowerCase();
            if (targetTexts.some(target => textContent.includes(target))) {
                const style = getComputedStyle(button);
                if (!button.disabled && style.visibility !== 'hidden' && style.display !== 'none') {
                    log(`Uygun buton bulundu: "${textContent}"`);
                    buttonToClick = button;
                    break;
                }
            }
        }

        if (buttonToClick) {
            log("Tıklanacak final buton seçildi. Tıklama işlemi başlatılıyor.");
            clickAttemptedOnPermissionScreen = true; // Tekrar denenmesini engelle
            robustClick(buttonToClick);

            // Tıklama yapıldığı için gözlemciyi durdurabiliriz.
            if (pageObserver) {
                setTimeout(() => {
                    log("İşlem tamamlandı, gözlemci durduruluyor.");
                    pageObserver.disconnect();
                }, 2000); // Tıklamanın etkisini göstermesi için 2 sn bekle
            }

        } else {
            log("Hedef metinleri içeren, tıklanabilir bir buton bulunamadı.");
        }
    }

    // Ek: <span jsname="V67aGc" class="VfPpkd-vQzf8d">Continue</span> butonunu da tıklayan fonksiyon
    function findAndClickSpanContinueButton() {
        if (clickAttemptedOnPermissionScreen) {
            return;
        }
        // Sadece ilgili span'ı seç
        const spanBtn = document.querySelector('span[jsname="V67aGc"].VfPpkd-vQzf8d');
        if (spanBtn) {
            log("Span Continue butonu bulundu, tıklanıyor...");
            clickAttemptedOnPermissionScreen = true;
            robustClick(spanBtn);
            if (pageObserver) {
                setTimeout(() => {
                    log("Span buton için işlem tamamlandı, gözlemci durduruluyor.");
                    pageObserver.disconnect();
                }, 2000);
            }
        } else {
            log("Span Continue butonu bulunamadı.");
        }
    }

    // Ana mantık: URL'yi kontrol et ve doğru eylemi yap
    function mainLogic() {
        const currentUrl = window.location.href;

        if (OAUTH_URL_REGEX.test(currentUrl)) {
            // 2. AŞAMA: İzin/Onay Ekranındayız
            log("OAuth izin ekranı tespit edildi. Buton aranacak.");
            findAndClickContinueButton();
            findAndClickSpanContinueButton(); // <span> Continue butonunu da dene
        } else {
            // 1. AŞAMA: Hesap Seçim Ekranı veya başka bir sayfa
            log("Hesap seçim ekranı veya alakasız bir sayfa. Bekleniyor.");
            // Bir sonraki olası OAuth ekranı için durumu sıfırla
            clickAttemptedOnPermissionScreen = false;
        }
    }

    // DOM değişikliklerini izle (örn: kullanıcı hesap seçtiğinde sayfa içeriği değişir)
    const pageObserver = new MutationObserver((mutations, observer) => {
        log("DOM değişikliği tespit edildi, durum yeniden kontrol ediliyor...");
        mainLogic();
    });

    // Ana script başlangıcı
    function start() {
        log("Script başlatıldı. İlk kontrol yapılıyor.");
        mainLogic(); // İlk yükleme anında kontrol

        // Gözlemciyi başlat
        pageObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Gözlemcinin kaçırma ihtimaline karşı zamanlayıcılar
        setTimeout(mainLogic, 2000);
        setTimeout(mainLogic, 4000);
    }

    // Sayfa tamamen yüklendiğinde veya interaktif olduğunda başla
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        start();
    } else {
        document.addEventListener('DOMContentLoaded', start);
    }

})();