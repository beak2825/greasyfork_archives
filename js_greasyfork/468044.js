// ==UserScript==
// @name         Gartic Auto Draw com Leitor de Links
// @namespace    gartic-auto-draw
// @description  Desenha imagens a partir de URLs diretos no Gartic.io
// @version      1.8
// @license      MIT
// @author       EmersonxD
// @match        https://gartic.io/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/468044/Gartic%20Auto%20Draw%20com%20Leitor%20de%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/468044/Gartic%20Auto%20Draw%20com%20Leitor%20de%20Links.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
(function () {
    'use strict';

    // Configurações
    const SETTINGS = {
        maxRetries: 3,
        validExtensions: /\.(png|jpe?g|webp)$/i
    };

    // Elementos da UI
    let urlInput, confirmButton;

    // Função para validar URLs de imagem
    function isValidImageUrl(url) {
        return SETTINGS.validExtensions.test(url);
    }

    // Função para baixar imagem da URL
    async function fetchImage(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                onload: (response) => {
                    if (response.status === 200) {
                        const blob = response.response;
                        const file = new File([blob], 'image.png', { type: blob.type });
                        resolve(file);
                    } else {
                        reject(new Error('Erro ao baixar imagem'));
                    }
                },
                onerror: reject
            });
        });
    }

    // Interface do usuário
    function createUrlInputUI() {
        GM_addStyle(`
            .gartic-url-container {
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 9999;
                background: rgba(255, 255, 255, 0.9);
                padding: 10px;
                border-radius: 8px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                width: 300px;
            }
            .gartic-url-input {
                width: 100%;
                padding: 8px;
                margin-bottom: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
            .gartic-confirm-btn {
                width: 100%;
                padding: 8px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
        `);

        const container = document.createElement('div');
        container.className = 'gartic-url-container';

        urlInput = document.createElement('input');
        urlInput.className = 'gartic-url-input';
        urlInput.placeholder = 'Cole o link da imagem aqui';

        confirmButton = document.createElement('button');
        confirmButton.className = 'gartic-confirm-btn';
        confirmButton.textContent = 'Desenhar';

        // Evento de confirmação
        confirmButton.addEventListener('click', async () => {
            if (!isValidImageUrl(urlInput.value)) {
                alert('Link inválido! Use links diretos para imagens (.png, .jpg, .webp)');
                return;
            }

            confirmButton.disabled = true;
            confirmButton.textContent = 'Processando...';

            try {
                const imageFile = await fetchImage(urlInput.value);
                await processImage(imageFile);
                alert('Desenho concluído!');
            } catch (error) {
                alert('Erro ao processar imagem: ' + error.message);
            } finally {
                confirmButton.disabled = false;
                confirmButton.textContent = 'Desenhar';
            }
        });

        container.append(urlInput, confirmButton);
        document.body.appendChild(container);
    }

    // Função principal de processamento (mantida do código anterior)
    async function processImage(image) {
        const canvas = document.querySelector('.game.canvas');
        if (!canvas) {
            alert('Canvas não encontrado!');
            return;
        }

        const ctx = canvas.getContext('2d');
        const img = await createImageBitmap(image);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    // Inicialização
    (function init() {
        createUrlInputUI();
    })();
})();