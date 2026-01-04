// ==UserScript==
// @name         Kirka.io ESP Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ESP script for kirka.io to highlight enemies with a line above them. Press F4 to toggle.
// @author       ChatGPT
// @match        https://kirka.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498406/Kirkaio%20ESP%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/498406/Kirkaio%20ESP%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let scriptEnabled = true; // Variável para controlar se o script está ativado ou não
    let intervalId; // Variável para armazenar o ID do intervalo

    // CSS para estilizar a linha sobre os inimigos
    let style = document.createElement('style');
    style.innerHTML = `
        .enemy-line {
            position: absolute;
            width: 100%;
            height: 1px;
            background-color: red; /* Cor da linha */
            pointer-events: none; /* Garante que a linha não interfere com os cliques */
            z-index: 999; /* Coloca a linha acima de outros elementos */
        }
    `;
    document.head.appendChild(style);

    // Função para adicionar a linha sobre os inimigos
    function addEnemyLines() {
        let enemies = document.querySelectorAll('.enemy'); // Classe que representa os inimigos

        enemies.forEach(enemy => {
            let enemyRect = enemy.getBoundingClientRect();
            let line = document.createElement('div');
            line.className = 'enemy-line';
            line.style.top = `${enemyRect.top}px`; // Posiciona a linha acima do inimigo
            document.body.appendChild(line);
        });
    }

    // Função para iniciar o intervalo de atualização das linhas
    function startScript() {
        intervalId = setInterval(() => {
            if (scriptEnabled) {
                // Remove linhas antigas antes de adicionar novas
                let existingLines = document.querySelectorAll('.enemy-line');
                existingLines.forEach(line => line.remove());

                // Adiciona novas linhas
                addEnemyLines();
            }
        }, 1000); // Atualiza a cada segundo (1000 milissegundos)
    }

    // Função para parar o intervalo de atualização das linhas
    function stopScript() {
        clearInterval(intervalId);
        let existingLines = document.querySelectorAll('.enemy-line');
        existingLines.forEach(line => line.remove());
    }

    // Função para alternar entre ligar e desligar o script
    function toggleScript() {
        scriptEnabled = !scriptEnabled;
        if (scriptEnabled) {
            startScript();
        } else {
            stopScript();
        }
    }

    // Evento para capturar a tecla F4
    document.addEventListener('keydown', function(event) {
        if (event.key === 'F4') {
            toggleScript();
        }
    });

    // Inicia o script quando a página carregar
    startScript();

    // Cria uma tabela no canto superior esquerdo para mostrar as instruções
    let table = document.createElement('table');
    table.style.position = 'fixed';
    table.style.top = '10px';
    table.style.left = '10px';
    table.style.background = 'rgba(255, 255, 255, 0.5)';
    table.style.padding = '10px';
    table.style.borderRadius = '5px';
    table.innerHTML = `
        <tr>
            <td colspan="2" style="text-align: center; font-weight: bold;">Controles do Script</td>
        </tr>
        <tr>
            <td>Ativar/Desativar Script</td>
            <td>F4</td>
        </tr>
    `;
    document.body.appendChild(table);

})();
