// ==UserScript==
// @name         ManagerZone Event Zaman Sıfırlayıcı
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  ManagerZone etkinlik sayfasındaki "Talep et" butonunu süre 0m 0s olduğunda otomatik tıklar ve süreyi sıfırlar. Konsolda sayaç takibini gösterir ve döngüyü sürdürür. Ek olarak, oturumun kapanmaması için sayfayı her 2 dakikada bir otomatik yeniler.
// @author       ChatGPT
// @match        https://www.managerzone.com/?p=event*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/538292/ManagerZone%20Event%20Zaman%20S%C4%B1f%C4%B1rlay%C4%B1c%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/538292/ManagerZone%20Event%20Zaman%20S%C4%B1f%C4%B1rlay%C4%B1c%C4%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let timerCheckInterval; // setInterval'ı global scope'ta tutacağız ki durdurup yeniden başlatabilelim
    let pageRefreshInterval; // Sayfa yenileme setInterval'ı için yeni değişken

    function initAutoClaim() {
        console.log("MZ Auto Claim: Script başlatılıyor/yeniden başlatılıyor...");

        // Sayacın bulunduğu span elementi
        const nextResetClockSpan = document.getElementById('next-reset-clock');
        // Talep et butonunun bulunduğu a elementi
        const claimButton = document.getElementById('claim');

        // Elementlerin sayfada mevcut olup olmadığını kontrol et
        if (!nextResetClockSpan || !claimButton) {
            console.log("MZ Auto Claim: Gerekli elementler (sayaç veya talep butonu) bulunamadı. Script çalışmayacak.");
            // Belki bir süre sonra tekrar denemek isteyebiliriz, ancak şimdilik durabilir.
            return;
        }

        console.log("MZ Auto Claim: Sayaç ve Talep et butonu izleniyor.");

        // Sayaç durumunu düzenli olarak kontrol edecek fonksiyon
        function checkTimerAndClaim() {
            // Sayaç metnini al
            // 'b' tag'inin içeriğini almak daha güvenli, çünkü zaman değeri onun içinde.
            const timerBElement = nextResetClockSpan.querySelector('b');
            let timerText = timerBElement ? timerBElement.textContent.trim() : '';

            // DEBUG: Konsola mevcut sayaç metnini *her kontrol edildiğinde* yazdır
            console.log("MZ Auto Claim (Sayaç Takibi): Mevcut sayaç metni:", timerText);

            // Talep et butonu disabled sınıfına sahip değilse (yani etkinse) ve sayaç 0m 0s ise
            // veya sadece "0s" ise (gelecekteki olası formatlar için)
            if ((timerText === '0m 0s' || timerText === '0s') && !claimButton.classList.contains('buttondiv_disabled')) {
                console.log("MZ Auto Claim: Sayaç 0m 0s'e ulaştı ve 'Talep et' butonu etkin. Tıklanıyor...");
                claimButton.click(); // Butona tıkla

                // Butona tıklandıktan sonra mevcut interval'ı durdur
                clearInterval(timerCheckInterval);
                console.log("MZ Auto Claim: İşlem tamamlandı. Interval durduruldu. Yeni döngü için 3 saniye bekleniyor...");

                // UI'nin güncellenmesi için kısa bir süre bekle ve script'i yeniden başlat
                // Bu süre, sayacın yeni değerinin DOM'a yazılması için yeterli olmalıdır.
                setTimeout(initAutoClaim, 3000); // 3 saniye = 3000 milisaniye
            } else if (timerText === '0m 0s' && claimButton.classList.contains('buttondiv_disabled')) {
                // Bu durum, sayaç 0'a ulaştığında ancak butonun etkinleşmesi için henüz kısa bir gecikme olduğunda görülebilir.
                console.log("MZ Auto Claim: Sayaç 0m 0s'e ulaştı, ancak 'Talep et' butonu henüz etkin değil. Bekleniyor...");
            }
        }

        // Mevcut bir interval varsa temizle (yeniden başlatma durumları için)
        if (timerCheckInterval) {
            clearInterval(timerCheckInterval);
        }

        // Sayaç durumunu her 5 saniyede bir kontrol et
        timerCheckInterval = setInterval(checkTimerAndClaim, 5000);
    }

    // --- Yeni Eklenen: Sayfa Yenileme Fonksiyonu ---
    function startPageRefresh() {
        console.log("MZ Auto Claim: Otomatik sayfa yenileme başlatılıyor (her 2 dakikada bir).");
        // Mevcut bir sayfa yenileme intervali varsa temizle (ikincil başlangıçları önlemek için)
        if (pageRefreshInterval) {
            clearInterval(pageRefreshInterval);
        }
        // Her 2 dakikada bir sayfayı yenile (2 dakika = 120000 milisaniye)
        pageRefreshInterval = setInterval(() => {
            console.log("MZ Auto Claim: 2 dakika geçti, sayfa yenileniyor...");
            location.reload(); // Sayfayı yeniden yükle
        }, 120000); // 120000 milisaniye = 2 dakika
    }

    // Script yüklendiğinde hem otomatik talep etme hem de sayfa yenilemeyi başlat
    initAutoClaim();
    startPageRefresh(); // Yeni eklenen fonksiyonu çağır

})();