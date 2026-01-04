// ==UserScript==
// @name         Aylink Bypass
// @name:tr      Aylink Bypass
// @name:en      Aylink Bypass
// @namespace    https://memoryhackers.org/members/durmuk.1871708/
// @version      1.0
// @description  Aylink sitesinde bekleme süresini atlayarak direkt link erişimi sağlar
// @description:tr  Aylink sitesinde bekleme süresini atlayarak direkt link erişimi sağlar
// @description:en  Bypasses the countdown timer on Aylink to provide direct link access
// @author       Durmuş Karaca
// @license      MIT
// @match        *://*.aylink.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528664/Aylink%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/528664/Aylink%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    async function skipCountdown() {
        try {
            // Countdown elementini bekle
            const countdownElement = await waitForElement('.countdown');
            
            if (countdownElement) {
                // Bypass butonunu oluştur
                const bypassButton = document.createElement('div');
                bypassButton.className = 'text-center p-2';
                bypassButton.innerHTML = `
                    <button class="btn btn-warning btn-lg fs-6 text-decoration-none col-12">
                        <strong>Bypassed Link</strong> 
                        <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>
                    </button>
                `;
                
                // Bypass butonunu countdown'dan önce ekle
                countdownElement.parentNode.insertBefore(bypassButton, countdownElement);
                
                // Gerekli class'ları ekle ve AJAX isteğini tetikle
                setTimeout(() => {
                    // Countdown'u gizle
                    const timeElement = countdownElement.querySelector('.time');
                    if (timeElement) {
                        timeElement.style.display = 'none';
                    }

                    // Complete elementini göster
                    const completeElement = countdownElement.querySelector('.complete');
                    if (completeElement) {
                        completeElement.style.display = 'block';
                    }

                    // Gerekli class'ları ekle
                    const goButton = completeElement.querySelector('.btn');
                    if (goButton) {
                        goButton.classList.add('btn-go');
                    }

                    const goLink = document.querySelector('#go-link');
                    if (goLink) {
                        goLink.classList.add('go-link');
                    }

                    // Otomatik olarak butona tıkla
                    setTimeout(() => {
                        const btnGo = document.querySelector('.btn-go');
                        if (btnGo) {
                            btnGo.click();
                        }
                    }, 100);

                    // Bypass butonunu güncelle
                    bypassButton.innerHTML = `
                        <button class="btn btn-success btn-lg fs-6 text-decoration-none col-12">
                            <strong>Link Hazırlanıyor</strong> 
                            <i class="fa fa-check" aria-hidden="true"></i>
                        </button>
                    `;
                }, 500);
            }
        } catch (error) {
            console.log('Element bulunamadı veya bir hata oluştu:', error);
        }
    }

    // Sayfa yüklendiğinde çalıştır
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', skipCountdown);
    } else {
        skipCountdown();
    }
})(); 