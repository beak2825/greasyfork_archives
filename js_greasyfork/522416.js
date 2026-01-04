// ==UserScript==
// @name         Made by ARES Adam Asmaca
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Sohbet üzerinden çeşitli oyunlar oynayın (örneğin, Adam Asmaca).
// @author       ARES
// @match        https://gartic.io/*
// @icon         https://r.resimlink.com/i8LC3wl.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522416/Made%20by%20ARES%20Adam%20Asmaca.user.js
// @updateURL https://update.greasyfork.org/scripts/522416/Made%20by%20ARES%20Adam%20Asmaca.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // WebSocket işlemleri için temel yapı
    let originalSend = WebSocket.prototype.send;
    let wsObj = null;
    let processedMessages = new Set();

    // Adam Asmaca için kelime listesi
    const words = ["javascript", "internet", "programlama", "oyun", "bilgisayar"];
    let currentWord = "";
    let guessedLetters = [];
    let remainingAttempts = 0;

    WebSocket.prototype.send = function(data) {
        originalSend.apply(this, arguments);
        if (!wsObj) {
            wsObj = this;
            console.log("WebSocket bağlantısı kuruldu.");
            wsObj.addEventListener("message", (msg) => {
                try {
                    let data = JSON.parse(msg.data.slice(2));
                    console.log("WebSocket mesaj alındı:", data);
                    if (data[0] === 5) {
                        wsObj.lengthID = data[1];
                        wsObj.id = data[2];
                        wsObj.roomCode = data[3];
                        console.log("WebSocket oturum bilgileri ayarlandı:", wsObj);
                    }
                } catch (err) {
                    console.error("WebSocket mesaj işleme hatası:", err);
                }
            });
        }
    };

    // Mesaj gönderme fonksiyonu
    const sendMessage = (message) => {
        if (wsObj && wsObj.id) {
            try {
                const formattedMessage = `42[11,${wsObj.id},"${message}"]`;
                wsObj.send(formattedMessage);
                console.log("Mesaj gönderildi:", formattedMessage);
            } catch (err) {
                console.error("Mesaj gönderme hatası:", err);
            }
        } else {
            console.warn("WebSocket bağlantısı veya ID eksik. Yeniden bağlanmayı deneyin.");
        }
    };

    // Oyunu başlat
    const startHangmanGame = () => {
        if (!wsObj || !wsObj.id) {
            console.warn("Oyun başlatılamadı. WebSocket bağlantısı eksik.");
            sendMessage("Bağlantı hatası: Lütfen WebSocket bağlantısını kontrol edin.");
            return;
        }

        currentWord = words[Math.floor(Math.random() * words.length)];
        guessedLetters = Array(currentWord.length).fill("_");
        remainingAttempts = 6;
        sendMessage(`Adam Asmaca başladı! Kelime: ${guessedLetters.join(" ")}`);
    };

    // Harf tahmin işlemi
    const guessLetter = (letter) => {
        if (!wsObj || !wsObj.id) {
            console.warn("Tahmin yapılamadı. WebSocket bağlantısı eksik.");
            sendMessage("Bağlantı hatası: Lütfen WebSocket bağlantısını kontrol edin.");
            return;
        }

        if (currentWord.includes(letter)) {
            for (let i = 0; i < currentWord.length; i++) {
                if (currentWord[i] === letter) {
                    guessedLetters[i] = letter;
                }
            }
            sendMessage(`Doğru tahmin! Kelime: ${guessedLetters.join(" ")}`);
        } else {
            remainingAttempts--;
            sendMessage(`Yanlış tahmin! Kalan hakkınız: ${remainingAttempts}`);
        }

        if (!guessedLetters.includes("_")) {
            sendMessage(`Tebrikler! Kelimeyi doğru tahmin ettiniz: ${currentWord}`);
            resetGame();
        } else if (remainingAttempts === 0) {
            sendMessage(`Kaybettiniz! Doğru kelime: ${currentWord}`);
            resetGame();
        }
    };

    // Oyunu sıfırla
    const resetGame = () => {
        currentWord = "";
        guessedLetters = [];
        remainingAttempts = 0;
    };

    // Gelen mesajları kontrol et
    const checkMessages = () => {
        document.querySelectorAll('.msg').forEach(msg => {
            const text = msg.innerText;
            if (text.startsWith('/adam asmaca') && !processedMessages.has(text)) {
                processedMessages.add(text);
                console.log("Adam Asmaca başlatılıyor:", text);
                startHangmanGame();
            } else if (text.startsWith('/tahmin') && !processedMessages.has(text)) {
                processedMessages.add(text);
                const parts = text.split('/tahmin');
                const letter = parts[1]?.trim();
                if (letter && letter.length === 1) {
                    console.log("Tahmin edilen harf:", letter);
                    guessLetter(letter);
                } else {
                    sendMessage("Geçerli bir harf girin: /tahmin [harf]");
                }
            }
        });
    };

    // Mesajları her saniye kontrol et
    setInterval(checkMessages, 1000);
})();
