// ==UserScript==
// @name         Gota.io Center-to-Mouse Line YASXI💋💋
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Draws a line from the center to the mouse in Gota.io with the option to change the line color.
// @match        *://gota.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526377/Gotaio%20Center-to-Mouse%20Line%20YASXI%F0%9F%92%8B%F0%9F%92%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/526377/Gotaio%20Center-to-Mouse%20Line%20YASXI%F0%9F%92%8B%F0%9F%92%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Criando um elemento canvas para desenhar a linha
    const lineCanvas = document.createElement('canvas');
    lineCanvas.style.position = 'fixed';
    lineCanvas.style.top = '0';
    lineCanvas.style.left = '0';
    lineCanvas.style.pointerEvents = 'none';  // Não interfere com os cliques do jogo
    lineCanvas.width = window.innerWidth;
    lineCanvas.height = window.innerHeight;
    document.body.appendChild(lineCanvas);

    const ctx = lineCanvas.getContext('2d');

    let mouseX = 0;
    let mouseY = 0;
    let lineColor = 'rgba(128, 0, 128, 0.5)';  // Cor padrão: roxo com 50% de opacidade

    // Atualiza a posição do mouse
    window.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Função para desenhar a linha
    function drawLine() {
        // Limpa o canvas a cada frame
        ctx.clearRect(0, 0, lineCanvas.width, lineCanvas.height);

        // Define o estilo da linha
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 2;

        // Calcula o centro da tela
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // Desenha a linha do centro até o mouse
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();

        // Solicita o próximo frame de animação
        requestAnimationFrame(drawLine);
    }

    // Começa o loop de desenho da linha
    drawLine();

    // Atualiza o tamanho do canvas se a janela for redimensionada
    window.addEventListener('resize', () => {
        lineCanvas.width = window.innerWidth;
        lineCanvas.height = window.innerHeight;
    });

    // Cria o botão para alterar a cor da linha
    const optionsContainer = document.querySelector('.options-container');
    if (optionsContainer) {
        const colorButton = document.createElement('button');
        colorButton.innerHTML = 'Alterar Cor da Linha';
        colorButton.style.backgroundColor = '#444';
        colorButton.style.borderColor = '#fff';
        colorButton.style.color = '#fff';
        colorButton.style.padding = '10px';
        colorButton.style.margin = '10px';
        colorButton.style.cursor = 'pointer';

        colorButton.addEventListener('click', () => {
            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.value = '#800080';  // Valor inicial (roxo)
            colorInput.addEventListener('input', (e) => {
                lineColor = e.target.value;  // Atualiza a cor da linha
            });

            // Adiciona o input de cor ao botão de opções
            colorButton.parentElement.appendChild(colorInput);
        });

        optionsContainer.appendChild(colorButton);
    }

})();
