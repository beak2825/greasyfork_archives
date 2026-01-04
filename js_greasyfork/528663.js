// ==UserScript==
// @name         TrendLinkler Bypass Enhanced
// @name:tr      TrendLinkler Bypass Enhanced
// @name:en      TrendLinkler Bypass Enhanced
// @namespace    https://memoryhackers.org/members/durmuk.1871708/
// @version      1.6
// @description  TrendLinkler sitesinde bekleme süresini atlayarak direkt link erişimi sağlar
// @description:tr  TrendLinkler sitesinde bekleme süresini atlayarak direkt link erişimi sağlar
// @description:en  Bypasses the countdown timer on TrendLinkler to provide direct link access
// @author       Durmuş Karaca
// @license      MIT
// @match        *://*.trendlinkler.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528663/TrendLinkler%20Bypass%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/528663/TrendLinkler%20Bypass%20Enhanced.meta.js
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
                // Sayfadaki linki bul
                const linkElement = document.querySelector('a.btn-primary[href^="https://"]');
                
                if (linkElement) {
                    // Önce bypass butonunu oluştur
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
                    
                    // 1 saniye sonra countdown'u kaldır ve gerçek linki göster
                    setTimeout(() => {
                        // Countdown'u kaldır
                        countdownElement.style.display = 'none';
                        
                        // Bypass butonunu güncelle
                        bypassButton.innerHTML = `
                            <a href="${linkElement.href}" 
                               class="btn btn-success btn-lg fs-6 text-decoration-none col-12" 
                               target="_blank" 
                               rel="nofollow">
                                <strong>Linke Git</strong> 
                                <i class="fa fa-external-link" aria-hidden="true"></i>
                            </a>
                        `;
                        
                        // Complete class'ına sahip elementi göster
                        const completeElement = document.querySelector('.complete');
                        if (completeElement) {
                            completeElement.style.display = 'block';
                        }
                    }, 1000);
                }
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