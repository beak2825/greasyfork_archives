// ==UserScript==
// @name         Leia-me basic cheat
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  cheat leia-me basic
// @author       iUnknown
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512181/Leia-me%20basic%20cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/512181/Leia-me%20basic%20cheat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var count = 0;
    var maxTimes = 300;
    var intervalId;
    var isRunning = false;

    // Criar tela de instruÃ§Ãµes
    function createInstructionsOverlay() {
        if (localStorage.getItem('hideInstructions') === 'true') {
            return; 
        }

        var overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.color = 'white';
        overlay.style.fontSize = '20px';
        overlay.style.padding = '20px';
        overlay.style.zIndex = '9999';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.innerHTML = `
            <h1>InstruÃ§Ãµes de Uso do Script</h1>
            <p>1. Clique no botÃ£o "Iniciar" para comeÃ§ar a passar pÃ¡ginas automaticamente.</p>
            <p>2. O script vai passar pelas pÃ¡ginas usando a tecla 'Arrow Right' (seta para a direita).</p>
            <p>3. VocÃª pode parar o script a qualquer momento clicando no botÃ£o "Parar".</p>
            <p>4. Para abrir a IA, clique no botÃ£o "IA" e copie o link para abrir em uma guia anÃ´nima.</p>
            <p><strong>Pressione 'ESC' para fechar esta tela.</strong></p>
            <label>
                <input type="checkbox" id="rememberChoice" />
                Lembrar minha decisÃ£o
            </label>
        `;

        document.body.appendChild(overlay);
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                const rememberChoice = document.getElementById('rememberChoice').checked;
                if (rememberChoice) {
                    localStorage.setItem('hideInstructions', 'true');
                }
                document.body.removeChild(overlay);
                document.removeEventListener('keydown', arguments.callee);
            }
        });
    }

    function createButton(text, onClick, top) {
        var button = document.createElement('button');
        button.textContent = text;
        button.style.position = 'fixed';
        button.style.top = top + 'px';
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.style.padding = '10px';
        button.style.backgroundColor = text === 'Iniciar' ? '#4CAF50' : (text === 'Parar' ? '#F44336' : '#FFC107');
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        document.body.appendChild(button);
        button.addEventListener('click', onClick);
    }

    function openIAInNewTab() {
        alert("Por favor, copie o seguinte link e cole em uma guia anÃ´nima:\n\nhttps://www.gauthmath.com/");
        window.open('https://www.gauthmath.com/', '_blank');
    }

    function startInterval() {
        isRunning = true;
        var intervalMillis = prompt("Em quantos milissegundos vocÃª quer passar de pÃ¡gina? (Digite o valor em milissegundos)");
        intervalMillis = parseInt(intervalMillis, 10);
        if (isNaN(intervalMillis) || intervalMillis <= 0) {
            alert("Valor invÃ¡lido. O intervalo serÃ¡ definido como 1000 ms por padrÃ£o.");
            intervalMillis = 1000;
        }
        var event = new KeyboardEvent('keydown', { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39, which: 39, bubbles: true });

        intervalId = setInterval(function() {
            document.dispatchEvent(event);
            count++;
            console.log("PÃ¡ginas passadas: " + count); 
            if (count >= maxTimes) {
                clearInterval(intervalId);
                alert("Terminou de passar as pÃ¡ginas!");
                isRunning = false;
            }
        }, intervalMillis);
    }

    function stopInterval() {
        clearInterval(intervalId);
        isRunning = false;
        alert("Script parado!");

        var event = new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true });
        for (var i = 0; i < 50; i++) {
            setTimeout(function() {
                document.dispatchEvent(event);
            }, 10 * i);
        }
    }

    createInstructionsOverlay(); 
    createButton('Iniciar', function() {
        if (!isRunning) {
            count = 0; 
            startInterval();
        } else {
            alert("O script jÃ¡ estÃ¡ em execuÃ§Ã£o!");
        }
    }, 10);

    createButton('Parar', stopInterval, 50);
    createButton('IA', openIAInNewTab, 90);
})();