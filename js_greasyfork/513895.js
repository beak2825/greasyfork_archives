// ==UserScript==
// @name         Gartic.io Bot with Menu in Top Left Corner
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Sol üst köşeye menü ve bot ekler, odaya otomatik giriş yapar
// @author       Your Name
// @match        https://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513895/Garticio%20Bot%20with%20Menu%20in%20Top%20Left%20Corner.user.js
// @updateURL https://update.greasyfork.org/scripts/513895/Garticio%20Bot%20with%20Menu%20in%20Top%20Left%20Corner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Botun odaya girmesi için gerekli URL'yi manuel olarak buraya ekleyebilirsin
    const roomURL = "https://gartic.io/room-name"; // Burayı girmek istediğiniz oda URL'si ile değiştirin.

    // Menü oluşturma (Sol üst köşeye)
    function createMenu() {
        const menu = document.createElement('div');
        menu.id = 'customMenu';
        menu.style.position = 'fixed';
        menu.style.top = '10px';
        menu.style.left = '10px';  // Sol üst köşe
        menu.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        menu.style.color = '#fff';
        menu.style.padding = '10px';
        menu.style.borderRadius = '5px';
        menu.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
        menu.style.zIndex = '1000';
        
        const title = document.createElement('h4');
        title.textContent = 'Gartic.io Bot Menü';
        title.style.margin = '0 0 10px 0';
        menu.appendChild(title);

        // Odaya otomatik giriş butonu
        const enterRoomButton = document.createElement('button');
        enterRoomButton.textContent = 'Odaya Gir';
        enterRoomButton.style.display = 'block';
        enterRoomButton.style.marginBottom = '5px';
        enterRoomButton.onclick = enterRoom;
        menu.appendChild(enterRoomButton);

        // Bot başlat/durdur butonu
        const toggleBotButton = document.createElement('button');
        toggleBotButton.textContent = 'Botu Başlat';
        toggleBotButton.style.display = 'block';
        toggleBotButton.style.marginBottom = '5px';
        menu.appendChild(toggleBotButton);

        // Bot durumu
        let botActive = false;

        // Bot başlatma/durdurma işlevi
        toggleBotButton.onclick = () => {
            botActive = !botActive;
            toggleBotButton.textContent = botActive ? 'Botu Durdur' : 'Botu Başlat';
            if (botActive) {
                startBot();
            } else {
                stopBot();
            }
        };

        document.body.appendChild(menu);
    }

    // Odaya giriş yapma (botun buraya gitmesini sağla)
    function enterRoom() {
        console.log(`Odaya giriş yapılıyor: ${roomURL}`);
        window.location.href = roomURL;  // Odaya yönlendirme
    }

    // Botun ana işlevi: Kelimeleri tahmin etme
    function startBot() {
        console.log("Bot çalışmaya başladı!");
        const chatInput = document.querySelector('input[type="text"]'); // Sohbet kutusunu seç
        if (!chatInput) {
            console.log("Sohbet kutusu bulunamadı.");
            return;
        }

        // Tahmin kelimeleri
        const guessWords = ["elma", "araba", "ev", "bilgisayar", "çiçek"];
        let guessIndex = 0;

        // Kelimeleri sırayla tahmin et
        const botInterval = setInterval(() => {
            if (guessIndex >= guessWords.length) {
                clearInterval(botInterval);
                console.log("Tahminler bitti.");
                return;
            }
            chatInput.value = guessWords[guessIndex];
            const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
            chatInput.dispatchEvent(event);
            console.log(`Tahmin gönderildi: ${guessWords[guessIndex]}`);
            guessIndex++;
        }, 2000); // 2 saniyede bir tahmin gönder
    }

    // Botu durdurma işlevi
    function stopBot() {
        console.log("Bot durduruldu!");
        clearInterval(window.botInterval); // Döngüyü durdur
    }

    // Sayfa yüklendiğinde menüyü oluştur
    window.addEventListener('load', createMenu);
})();