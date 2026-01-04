// ==UserScript==
// @name         Formulario Helper
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Formulario Helper para chamados.
// @author       ils94
// @match        https://atendimento-sao.tre-rn.jus.br/front/tracking.injector.php
// @grant        GM_setClipboard
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536227/Formulario%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/536227/Formulario%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function criarModal() {
        const estilo = `
        #formModal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border: 2px solid #007bff;
            border-radius: 10px;
            z-index: 10000;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            width: 300px;
            font-family: sans-serif;
        }
        #formModal input, #formModal select, #formModal textarea {
            width: 100%;
            margin-bottom: 10px;
            padding: 5px;
            font-size: 14px;
            box-sizing: border-box;
        }
        #formModal textarea {
            resize: vertical;
            min-height: 60px;
            max-height: 120px;
        }
        #formModal .linha-flex {
            display: flex;
            gap: 5px;
            align-items: stretch;
        }
        #formModal button {
            margin-top: 5px;
            padding: 8px;
            width: 100%;
            font-weight: bold;
            cursor: pointer;
        }
        #fecharModal {
            position: absolute;
            top: 5px;
            right: 10px;
            cursor: pointer;
            font-weight: bold;
            color: red;
        }
    `;

        const styleTag = document.createElement('style');
        styleTag.textContent = estilo;
        document.head.appendChild(styleTag);

        const modal = document.createElement('div');
        modal.id = 'formModal';
        modal.style.display = 'none';

        const {
            data,
            hora
        } = obterDataHoraAtual();

        modal.innerHTML = `
        <span id="fecharModal">X</span>
        <label>Data:</label><input id="data" value="${data}">
        <label>Hora:</label><input id="hora" value="${hora}">
        <label>Origem:</label>
        <select id="origem">
            <option value="COJE">COJE</option>
            <option value="SEDE">SEDE</option>
        </select>
        <label>Destino:</label>
        <select id="destino">
            <option value="SEDE">SEDE</option>
            <option value="COJE">COJE</option>
        </select>
        <label>Passageiros:</label><input id="passageiros" placeholder="NOME1, NOME2">
        <label>Prioridade:</label>
        <select id="prioridade">
            <option value="NORMAL">NORMAL</option>
            <option value="URGENTE">URGENTE</option>
        </select>
        <label>Necessidade Especial:</label><input id="especial" placeholder="NENHUMA">
        <label>Justificativa do Chamado:</label><textarea id="justificativa" placeholder="Digite a justificativa aqui..."></textarea>
        <button id="copiarTexto">Inserir</button>
    `;

        document.body.appendChild(modal);

        document.getElementById('fecharModal').onclick = () => modal.style.display = 'none';

        // Sincronizar selects de origem e destino
        const origemSelect = modal.querySelector('#origem');
        const destinoSelect = modal.querySelector('#destino');

        origemSelect.addEventListener('change', () => {
            destinoSelect.value = origemSelect.value === 'COJE' ? 'SEDE' : 'COJE';
        });

        destinoSelect.addEventListener('change', () => {
            origemSelect.value = destinoSelect.value === 'COJE' ? 'SEDE' : 'COJE';
        });

        document.getElementById('copiarTexto').onclick = () => {
            const especialInput = document.getElementById('especial').value.trim();
            const especialTexto = especialInput === '' ? 'NENHUMA' : especialInput;
            const justificativaInput = document.getElementById('justificativa').value.trim();
            const passageirosInput = document.getElementById('passageiros').value.trim();
            const passageirosTexto = passageirosInput === '' ? 'NENHUM' : passageirosInput;

            // Verifica se a justificativa está vazia
            if (justificativaInput === '') {
                alert('Por favor, preencha a Justificativa do Chamado.');
                return;
            }

            const texto = `
DATA: ${document.getElementById('data').value}
HORA: ${document.getElementById('hora').value}
ORIGEM: ${document.getElementById('origem').value}
DESTINO: ${document.getElementById('destino').value}
NOME DOS PASSAGEIROS: ${passageirosTexto}
PRIORIDADE: ${document.getElementById('prioridade').value}
NECESSIDADE ESPECIAL: ${especialTexto}
JUSTIFICATIVA DO CHAMADO: ${justificativaInput}
        `.trim().toUpperCase();

            // Função para tentar injetar o texto no editor TinyMCE
            function injectText() {
                let editorBody = null;
                const iframes = document.getElementsByTagName('iframe');
                for (let iframe of iframes) {
                    try {
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                        // Tenta encontrar o body com id="tinymce" e opcionalmente data-id="content793588473"
                        const body = iframeDoc.querySelector('body#tinymce');
                        if (body) {
                            editorBody = body;
                            break;
                        }
                    } catch (e) {
                        console.error('Erro ao acessar iframe:', e);
                    }
                }

                if (editorBody) {
                    try {
                        const formattedText = texto.replace(/\n/g, '<br>');
                        editorBody.innerHTML = `<p>${formattedText}</p>`;
                        return true;
                    } catch (e) {
                        console.error('Erro ao injetar texto no editor:', e);
                        alert('Erro ao injetar texto no editor TinyMCE. O texto foi copiado para a área de transferência.');
                        return false;
                    }
                }
                return false;
            }

            // Tenta injetar o texto com tentativas a cada 100ms, até 5 segundos
            let attempts = 0;
            const maxAttempts = 50; // 5 segundos (50 * 100ms)
            const interval = setInterval(() => {
                if (injectText()) {
                    clearInterval(interval);
                    // Copiar para a área de transferência
                    if (typeof GM_setClipboard !== 'undefined') {
                        GM_setClipboard(texto);
                    } else {
                        navigator.clipboard.writeText(texto).then(() => alert('Copiado e injetado no editor!'));
                    }
                    document.getElementById('formModal').style.display = 'none';
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    alert('Não foi possível encontrar o editor TinyMCE com id="tinymce". O texto foi copiado para a área de transferência.');
                    // Copiar para a área de transferência mesmo se a injeção falhar
                    if (typeof GM_setClipboard !== 'undefined') {
                        GM_setClipboard(texto);
                    } else {
                        navigator.clipboard.writeText(texto).then(() => alert('Copiado para a área de transferência!'));
                    }
                    document.getElementById('formModal').style.display = 'none';
                }
                attempts++;
            }, 100);
        };
    }

    function criarBotao() {
        const doc = window.top.document; // documento da janela principal, não do iframe
        // Remove o botão se já existir
        const botaoExistente = doc.getElementById('botaoGerarSolicitacao');
        if (botaoExistente) botaoExistente.remove();

        const botao = doc.createElement('button');
        botao.id = 'botaoGerarSolicitacao';
        botao.textContent = 'Gerar Solicitação';
        botao.style.position = 'fixed';
        botao.style.bottom = '20px';
        botao.style.right = '20px';
        botao.style.padding = '10px 15px';
        botao.style.backgroundColor = '#007bff';
        botao.style.color = '#fff';
        botao.style.border = 'none';
        botao.style.borderRadius = '5px';
        botao.style.cursor = 'pointer';
        botao.style.zIndex = '9999';
        botao.onclick = () => doc.getElementById('formModal').style.display = 'block';

        doc.body.appendChild(botao);
    }

    function obterDataHoraAtual() {
        const agora = new Date();
        const data = agora.toLocaleDateString('pt-BR');
        const hora = agora.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        return {
            data,
            hora
        };
    }

    window.addEventListener('load', () => {
        criarModal();
        criarBotao();
    });
})();