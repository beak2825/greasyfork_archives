// ==UserScript==
// @name         Haberler
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  ppf news
// @author       pixel berg
// @match        https://pixelplanet.fun/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512447/Haberler.user.js
// @updateURL https://update.greasyfork.org/scripts/512447/Haberler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Stil sınıflarıyla yeni bir buton ekle ve Yardım butonunun altına yerleştir
    const addCustomButton = () => {
        const helpButton = document.querySelector('[title="Yardım"]'); // Yardım butonunu bul

        if (helpButton) {
            const newButton = document.createElement('div');
            newButton.id = 'userAreaButton';
            newButton.className = 'actionbuttons'; // Diğer butonlarla aynı stil
            newButton.setAttribute('role', 'button');
            newButton.setAttribute('tabindex', '-1');
            newButton.setAttribute('title', 'Kullanıcı Alanı');
            newButton.innerHTML = `
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;">
                    <circle cx="12" cy="12" r="10" style="fill: #4CAF50;" />
                    <text x="12" y="16" text-anchor="middle" fill="white" font-size="10">U</text>
                </svg>`;

            // Yardım butonunun hemen altına ekle
            helpButton.parentNode.insertBefore(newButton, helpButton.nextSibling);

            // Tıklayınca modal penceresini aç
            newButton.addEventListener('click', showModal);

            // Butonu en sağa kaydır
            newButton.style.position = 'absolute';
            newButton.style.left = '16px';
            newButton.style.top = '37%';
            newButton.style.transform = 'translateY(-50%)';
        }
    };

    // JSON dosyasından haberleri çek
    const fetchNewsFromJson = async () => {
        const JSON_URL = 'http://ppfnews.rf.gd/ahmet.json'; // JSON dosyanızın URL'si

        try {
            const response = await fetch(JSON_URL); // JSON dosyasını çek
            if (!response.ok) throw new Error('Haberler alınamadı.');
            const newsData = await response.json(); // Haber verilerini JSON formatında al

            // Haberi modal içine yerleştir
            const newsContent = document.querySelector('#news-content');
            newsContent.innerHTML = ''; // Mevcut içeriği temizle
            newsData.forEach(article => {
                const articleHTML = `
                    <div class="news-item">
                        <h3>${article.title}</h3>
                        <p>${article.description}</p>
                        <a href="${article.url}" target="_blank">Habere Git</a>
                    </div>
                    <hr>
                `;
                newsContent.innerHTML += articleHTML;
            });
        } catch (error) {
            document.querySelector('#news-content').innerHTML = '<p>Haberler yüklenirken hata oluştu.</p>';
            console.error('Haber çekme hatası:', error);
        }
    };

    // Modal HTML yapısı ve haber verisini göstereceğimiz yer
    const createModal = () => {
        const modalHTML = `
        <div class="modal TEMPLATES show" style="z-index: 9; width: 72%;">
            <h2 class="titleModal"><img src="/PixelyaLOGO.png" alt="" style="width: 1.8rem; padding-right: 5px;">Haberler</h2>
            <div class="modal-topbtn close" role="button" label="close" title="Close" tabindex="-1">✕</div>
            <div class="modal-content">
                <div id="news-content" class="content" style="padding-top: 10px;">
                    <p>Yükleniyor...</p>
                </div>
            </div>
        </div>`;
        return modalHTML;
    };

    // Modalı göster ve haberleri yükle
    const showModal = () => {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = createModal();
        document.body.appendChild(modalContainer);

        // Kapatma düğmesine tıklandığında modalı kaldır
        modalContainer.querySelector('.close').addEventListener('click', () => {
            document.body.removeChild(modalContainer);
        });

        // Haberleri JSON dosyasından çek ve göster
        fetchNewsFromJson();
    };

    // Butonu ve modalı ekle
    const init = () => {
        addCustomButton();
    };

    // Sayfa yüklendiğinde başlat
    window.onload = init;

})();