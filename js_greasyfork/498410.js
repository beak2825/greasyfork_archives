// ==UserScript==
// @name         ESP para kirka.io
// @namespace    http://your.site.namespace
// @version      0.2
// @description  Mostra inimigos com linhas conectadas visíveis a todo instante
// @author       Your Name
// @match        https://kirka.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498410/ESP%20para%20kirkaio.user.js
// @updateURL https://update.greasyfork.org/scripts/498410/ESP%20para%20kirkaio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let espAtivado = false;
    const corLinha = '#ff0000'; // Cor da linha vermelho forte (pode ser alterada)
    let tabelaMostrada = false;
    let ultimoQuadro = 0;

    // Função para mostrar a tabela de teclas de ativação/desativação
    function mostrarTabelaTeclas() {
        if (tabelaMostrada) return;

        const divTabela = document.createElement('div');
        divTabela.className = 'esp-teclas';
        divTabela.style.position = 'fixed';
        divTabela.style.top = '10px';
        divTabela.style.right = '10px';
        divTabela.style.background = 'rgba(0, 0, 0, 0.7)';
        divTabela.style.color = '#fff';
        divTabela.style.padding = '10px';
        divTabela.style.borderRadius = '5px';
        divTabela.innerHTML = `
            <h3>Teclas de Ativação/Desativação do Script</h3>
            <table>
                <tr><td>Pressione "M"</td><td>Ativar/Desativar ESP</td></tr>
            </table>
        `;
        document.body.appendChild(divTabela);
        tabelaMostrada = true;
    }

    // Função para desenhar uma linha entre dois pontos no canvas
    function desenharLinha(ctx, x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = corLinha;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Função para mostrar inimigos e desenhar as linhas
    function mostrarInimigos() {
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        // Simulação de API para obter posição dos jogadores e inimigos (fictício)
        const jogadores = [
            { id: 'meuJogador', x: 100, y: 100 },
            { id: 'jogador1', x: 200, y: 200 },
            // Adicione mais jogadores conforme necessário
        ];

        const inimigos = [
            { id: 'inimigo1', x: 150, y: 150 },
            { id: 'inimigo2', x: 250, y: 250 },
            // Adicione mais inimigos conforme necessário
        ];

        jogadores.forEach(jogador => {
            const jogadorX = jogador.x;
            const jogadorY = jogador.y;

            inimigos.forEach(inimigo => {
                const inimigoX = inimigo.x;
                const inimigoY = inimigo.y;
                desenharLinha(ctx, jogadorX, jogadorY, inimigoX, inimigoY);
            });
        });
    }

    // Função para limpar o canvas
    function limparCanvas(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // Função para alternar o estado do ESP
    function alternarESP() {
        espAtivado = !espAtivado;
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        if (espAtivado) {
            mostrarTabelaTeclas();
            requestAnimationFrame(atualizarESP.bind(null, ctx));
        } else {
            limparCanvas(ctx);
            tabelaMostrada = false;
            removerTabelaTeclas();
        }
    }

    // Função para remover a tabela de teclas
    function removerTabelaTeclas() {
        const divTabela = document.querySelector('div.esp-teclas');
        if (divTabela) {
            divTabela.remove();
            tabelaMostrada = false;
        }
    }

    // Função para atualizar o ESP continuamente
    function atualizarESP(ctx, timestamp) {
        const deltaTime = timestamp - ultimoQuadro;
        if (deltaTime >= 1000 / 30) { // Atualiza a cada 30 quadros por segundo (opcional)
            limparCanvas(ctx);
            mostrarInimigos();
            ultimoQuadro = timestamp;
        }
        if (espAtivado) {
            requestAnimationFrame(atualizarESP.bind(null, ctx));
        }
    }

    // Função para lidar com a tecla pressionada
    function teclaPressionada(event) {
        if (event.key === 'm' || event.key === 'M') {
            alternarESP();
        }
    }

    document.addEventListener('keydown', teclaPressionada);

})();
