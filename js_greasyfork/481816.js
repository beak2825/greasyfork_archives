// ==UserScript==
// @name         Gartic.io Mesaj Gönderici
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Gartic.io oyununda otomatik olarak mesaj gönderir.
// @author       SabaKira
// @match        https://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481816/Garticio%20Mesaj%20G%C3%B6nderici.user.js
// @updateURL https://update.greasyfork.org/scripts/481816/Garticio%20Mesaj%20G%C3%B6nderici.meta.js
// ==/UserScript==

(function() {
    let originalSend = WebSocket.prototype.send, setTrue = false;
    window.wsObj = {};

    WebSocket.prototype.send = function(data) {
        console.log("Gönderilen Veri: " + data);
        originalSend.apply(this, arguments);
        if (Object.keys(window.wsObj).length == 0) {
            window.wsObj = this;
            window.eventAdd();
        }
    };

    window.eventAdd = () => {
        if (!setTrue) {
            setTrue = 1;
            window.wsObj.addEventListener("message", (msg) => {
                try {
                    let data = JSON.parse(msg.data.slice(2));
                    console.log(data);
                    if (data[0] == 5) {
                        window.wsObj.lengthID = data[1];
                        window.wsObj.id = data[2];
                        window.wsObj.roomCode = data[3];
                    }
                } catch (err) {}
            });
        }
    };

    'use strict';

    // Criar GUI
    const gui = document.createElement('div');
    gui.style.position = 'fixed';
    gui.style.top = '10px';
    gui.style.left = '50%';
    gui.style.transform = 'translateX(-50%)';
    gui.style.backgroundColor = '#f9f9f9';
    gui.style.border = '1px solid #ccc';
    gui.style.padding = '10px';
    gui.style.borderRadius = '5px';
    gui.style.width = '200px';
    document.body.appendChild(gui);

    // Adicionar campos de entrada à GUI
    const messagesTextArea = document.createElement('textarea');
    messagesTextArea.placeholder = 'Digite as mensagens (uma por linha)';
    messagesTextArea.style.height = '100px'; // Ajuste a altura conforme necessário
    messagesTextArea.style.width = '100%';  // Garanta que o texto seja alinhado corretamente
    messagesTextArea.style.boxSizing = 'border-box'; // Inclua padding e border na largura
    gui.appendChild(messagesTextArea);

    const countInput = document.createElement('input');
    countInput.placeholder = 'Quantas mensagens enviar';
    countInput.type = 'number';
    gui.appendChild(countInput);

    const intervalInput = document.createElement('input');
    intervalInput.placeholder = 'Intervalo entre mensagens (ms)';
    intervalInput.type = 'number';
    gui.appendChild(intervalInput);

    const sendAllInput = document.createElement('input');
    sendAllInput.type = 'checkbox';
    gui.appendChild(sendAllInput);
    gui.appendChild(document.createTextNode(' Enviar todas as mensagens de uma vez'));

    // Adicionar botão de início à GUI
    const startButton = document.createElement('button');
    startButton.innerHTML = 'Iniciar';
    startButton.style.display = 'block';
    startButton.style.width = '100%';
    startButton.style.padding = '10px';
    startButton.style.marginTop = '10px';
    startButton.style.backgroundColor = '#4CAF50';
    startButton.style.color = 'white';
    startButton.style.border = 'none';
    gui.appendChild(startButton);

    // Betik başlatma işlevi
    function startScript() {
        let count = 0;
        const messages = messagesTextArea.value.split('\n').map(msg => msg.trim()).filter(msg => msg !== ''); // Extrair mensagens do textarea
        const intervalId = setInterval(function() {
            if (count < countInput.value) {
                const invisibleChar = String.fromCharCode(8203); // Caractere invisível
                const randomInvisibleChars = invisibleChar.repeat(Math.floor(Math.random() * 3) + 1); // 1 a 3 caracteres invisíveis
                const messageToSend = `42[11,${window.wsObj.id},"${messages[count % messages.length]}${randomInvisibleChars}"]`;
                window.wsObj.send(messageToSend);
                if (!sendAllInput.checked) {
                    count++;
                }
            } else {
                clearInterval(intervalId); // İşlem tamamlandığında setInterval'ı durdur
            }
        }, intervalInput.value);

        // Otomatik mesaj gönderme işlemi başladığında bildirim
        console.log('Gartic.io Mesaj Gönderici başlatıldı.');
    }

    startButton.addEventListener('click', () => {
        // Substituir as variáveis globais pelos valores dos inputs
        startScript();
    });
})();
