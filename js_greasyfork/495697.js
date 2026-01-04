// ==UserScript==
// @name         miningblocks-faucet 
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  miningblocks.club Faucet 
// @author       ibomen
// @match        https://miningblocks.club/Faucet/Claim
// @match        https://miningblocks.club/Auth/LogIn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495697/miningblocks-faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/495697/miningblocks-faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Sayfa URL'sine göre farklı işlemler gerçekleştirme
    if (window.location.href.includes('/Faucet/Claim')) {
        console.log('Faucet sayfası yüklendi, betik çalıştırılıyor...');

        // Sayaç ve yapımcı bilgisi için bir div oluşturma
        var counterDiv = document.createElement('div');
        counterDiv.id = 'counterDiv';
        counterDiv.style.position = 'fixed';
        counterDiv.style.top = '10px';
        counterDiv.style.right = '10px';
        counterDiv.style.padding = '10px';
        counterDiv.style.backgroundColor = 'black';
        counterDiv.style.color = 'white';
        counterDiv.style.fontSize = '20px';
        counterDiv.style.zIndex = '1000';
        document.body.appendChild(counterDiv);

        var countdown = 60;  // 1 dakikadan geriye doğru say
        var countdownInterval = setInterval(function() {
            counterDiv.innerHTML = 'Time remaining: ' + countdown + 's<br>Made by Ibomen';
            countdown--;
            if (countdown < 0) {
                clearInterval(countdownInterval);
                location.reload();  // Sayfa yenileme
            }
        }, 1000);

        // Hcaptcha'nın görünür olmadığını kontrol et ve bekle
        var hcaptchaInterval = setInterval(function() {
            var hcaptcha = document.getElementById('Hcaptcha');
            if (!hcaptcha || hcaptcha.style.display === 'none' || hcaptcha.offsetParent === null) {
                clearInterval(hcaptchaInterval);
                console.log('Hcaptcha görünmüyor, butona tıklama işlemi başlıyor...');

                // Butonun varlığını ve kontrol edilmediğini doğrula
                var btnClaim = document.getElementById('btnClaim');
                if (btnClaim) {
                    btnClaim.click();  // Butona tıkla
                    console.log('Butona tıklandı.');

                    // Tıkladıktan sonra 2 saniye bekle
                    setTimeout(function() {
                        console.log('2 saniye bekleme süresi tamamlandı.');
                    }, 2000);
                } else {
                    console.log('Buton bulunamadı!');
                }
            } else {
                console.log('Hcaptcha hala görünür, bekleniyor...');
            }
        }, 1000);  // Her 1 saniyede bir kontrol et
    } else if (window.location.href.includes('/Auth/LogIn')) {
        console.log('Login sayfası yüklendi, betik çalıştırılıyor...');

        // Ekranın ortasında bir div oluşturma
        var referralDiv = document.createElement('div');
        referralDiv.id = 'referralDiv';
        referralDiv.style.position = 'fixed';
        referralDiv.style.top = '20%';
        referralDiv.style.left = '50%';
        referralDiv.style.transform = 'translate(-50%, -50%)';
        referralDiv.style.padding = '20px';
        referralDiv.style.backgroundColor = 'black';
        referralDiv.style.color = 'white';
        referralDiv.style.fontSize = '20px';
        referralDiv.style.textAlign = 'center';
        referralDiv.style.zIndex = '1000';
        referralDiv.innerHTML = 'ref pls <br><a href="https://miningblocks.club/?Referral=16856" style="color: white;">https://miningblocks.club/?Referral=16856</a>';
        document.body.appendChild(referralDiv);
    }
})();
