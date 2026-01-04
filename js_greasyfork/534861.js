// ==UserScript==
// @name         Nova Castelijns Otomatik Arama Scripti
// @namespace    popmundo
// @author       Nova Castelijns (2641094)
// @version      1.0
// @description  Popmundo çok fonksiyonlu arama scripti
// @match        *://*.popmundo.com/World/Popmundo.aspx/Character/Relations/*
// @license      MIT
// @icon         https://www.pngmart.com/files/22/Star-Emojis-PNG-HD.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534861/Nova%20Castelijns%20Otomatik%20Arama%20Scripti.user.js
// @updateURL https://update.greasyfork.org/scripts/534861/Nova%20Castelijns%20Otomatik%20Arama%20Scripti.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Rastgele gecikme süresi oluştur (min ve max saniye arasında)
    function getRandomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min) * 1000;
    }

    // Müsaitlik kontrolü
    async function checkAvailability(characterId) {
        try {
            const profileUrl = `${window.location.origin}/World/Popmundo.aspx/Character/${characterId}`;
            const response = await fetch(profileUrl);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            const statusText = doc.querySelector('.status')?.textContent || '';
            const unavailableStates = ['Sahnede', 'Uçuyor', 'Sakinleştirilmiş', 'Keşifte'];
            return !unavailableStates.some(state => statusText.includes(state));
        } catch (error) {
            console.error(`Durum kontrolü hatası: ${error.message}`);
            return false;
        }
    }

    // Ana fonksiyon
    async function onSubmitClick() {
        console.log("Arama işlemi başlatıldı");

        // Status elementini sayfanın altına sabitle
        let statusDiv = document.createElement('div');
        statusDiv.id = 'call-status';
        statusDiv.style.position = 'fixed';
        statusDiv.style.bottom = '0';
        statusDiv.style.left = '0';
        statusDiv.style.width = '100%';
        statusDiv.style.padding = '5px 10px';
        statusDiv.style.backgroundColor = 'rgba(240, 240, 240, 0.9)';
        statusDiv.style.borderTop = '1px solid #ccc';
        statusDiv.style.fontSize = '0.9em';
        statusDiv.style.zIndex = '9999';
        document.body.appendChild(statusDiv);

        // İlişki satırlarını seç
        const rows = Array.from(document.querySelectorAll('tr')).filter(row =>
            row.querySelector('a[href*="/Character/"]')
        );

        let friendsInfo = [];

        // Her satırdan bilgileri topla
        for (const row of rows) {
            const idLink = row.querySelector('a[href*="/Character/"]');
            const href = idLink.getAttribute('href');
            const idMatch = href.match(/Character\/(\d+)/);

            if (!idMatch) continue;

            const bars = row.querySelectorAll('.progressBar');
            const friendship = parseInt(bars[0]?.title?.replace('%', '') || '0');
            const romance = parseInt(bars[1]?.title?.replace('%', '') || '0');

            friendsInfo.push({
                id: parseInt(idMatch[1]),
                name: idLink.textContent.trim(),
                friendship: friendship,
                romance: romance
            });
        }

        console.log(`${friendsInfo.length} kişi bulundu`);

        // Her arkadaş için işlem yap
        for (let i = 0; i < friendsInfo.length; i++) {
            const friend = friendsInfo[i];
            statusDiv.textContent = `Kontrol ediliyor: ${friend.name} (${i+1}/${friendsInfo.length})`;

            // Rastgele bekle (2-5 saniye)
            await new Promise(resolve => setTimeout(resolve, getRandomDelay(2, 5)));

            // Müsaitlik kontrolü
            const isAvailable = await checkAvailability(friend.id);
            if (!isAvailable) {
                statusDiv.textContent = `${friend.name} şu anda müsait değil, atlanıyor...`;
                await new Promise(resolve => setTimeout(resolve, 1000));
                continue;
            }

            try {
                // Etkileşim sayfasını ziyaret et
                const interactUrl = `${window.location.origin}/World/Popmundo.aspx/Interact/Phone/${friend.id}`;
                const response = await fetch(interactUrl);
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");

                const form = doc.getElementById('aspnetForm');
                if (!form) {
                    console.log(`${friend.name} için form bulunamadı`);
                    continue;
                }

                const formData = new FormData(form);

     // Etkileşim tipini belirle
let interactionType = '171'; // Varsayılan: Teşekkür et
if (friend.romance > 50) {
    interactionType = '165'; // Aşkmeşk
} else if (friend.romance > 1 && friend.romance < 50) {
    const telefondaYazOption = doc.querySelector('option[value="73"]');
    if (telefondaYazOption) {
        interactionType = '73'; // Telefonda Yaz
    }
} else if (friend.friendship > 0) {
    const naberOption = doc.querySelector('option[value="24"]');
    if (naberOption) {
        interactionType = '24'; // Naber
    }
}

                formData.set('__EVENTTARGET', '');
                formData.set('__EVENTARGUMENT', '');
                formData.set('ctl00$cphTopColumn$ctl00$btnInteract', 'Interact');
                formData.set('ctl00$cphTopColumn$ctl00$ddlInteractionTypes', interactionType);

                statusDiv.textContent = `${friend.name} aranıyor...`;

                // Aramayı yap
                await fetch(interactUrl, {
                    method: 'POST',
                    body: formData
                });

                // Rastgele bekle (3-7 saniye)
                await new Promise(resolve => setTimeout(resolve, getRandomDelay(3, 7)));

            } catch (error) {
                console.error(`Hata: ${friend.name} aranamadı`, error);
                statusDiv.textContent = `Hata: ${friend.name} aranamadı - ${error.message}`;
            }
        }

        statusDiv.textContent = 'Tüm aramalar tamamlandı!';
        await new Promise(resolve => setTimeout(resolve, 2000));
        location.reload();
    }

    // Sayfa yüklendiğinde çalışacak fonksiyon
    function initialize() {
        console.log("Sayfa yüklendi, ikon ekleniyor");

        const h1Elements = Array.from(document.getElementsByTagName('h1'));
        const titleElement = h1Elements.find(el => el.textContent.includes('İlişkiler'));

        if (!titleElement) {
            console.error("İlişkiler başlığı (h1) bulunamadı");
            return;
        }

        const iconContainer = document.createElement('span');
        iconContainer.style.marginLeft = '5px';
        iconContainer.style.cursor = 'pointer';
        iconContainer.style.display = 'inline-block';
        iconContainer.style.verticalAlign = 'middle';

        const icon = document.createElement('img');
        icon.src = 'https://i.ibb.co/YB4s4zyx/mobile-phone.png';
        icon.style.height = '20px';
        icon.style.width = '20px';
        icon.title = 'Herkesi Ara';
        icon.alt = '📞';

        icon.onerror = () => {
            iconContainer.textContent = '📞';
            iconContainer.style.fontSize = '10px';
            console.log("İkon yüklenemedi, emoji kullanılıyor");
        };

        iconContainer.onclick = (e) => {
            e.preventDefault();
            console.log("İkona tıklandı");
            onSubmitClick();
            return false;
        };

        iconContainer.appendChild(icon);
        titleElement.appendChild(iconContainer);
        console.log("İkon başarıyla eklendi");
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
