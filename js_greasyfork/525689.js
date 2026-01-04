// ==UserScript==
// @name         Copia transcrição do Youtube
// @namespace    https://t.me/virumaniaa
// @version      1.0
// @license MIT
// @description  Copia a transcrição de vídeos do YouTube para a área de transferência com botão posicionado acima do vídeo.
// @author       VIRUMANIA: participe do nosso canal https://t.me/virumaniaa
// @match        https://www.youtube.com/watch*
// @icon         https://www.youtube.com/favicon.ico
// @grant        GM_setClipboard
// @grant        GM_notification
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/525689/Copia%20transcri%C3%A7%C3%A3o%20do%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/525689/Copia%20transcri%C3%A7%C3%A3o%20do%20Youtube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let transcriptAvailable = false;
    let videoContainer = null;
    let btnDownload = null;

    function createDownloadButton() {
        const btn = document.createElement('button');
        btn.innerHTML = '📥 Transcrição';
        btn.style.position = 'absolute';
        btn.style.zIndex = '10000';
        btn.style.padding = '5px 8px';
        btn.style.background = '#ff0000';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '12px';
        btn.style.fontWeight = 'bold';
        btn.addEventListener('click', copyTranscript);
        return btn;
    }

    function posicionaBotao() {
        if (!videoContainer || !btnDownload) return;

        // Obtém a posição do vídeo na página
        const rect = videoContainer.getBoundingClientRect();
        // Calcula a posição absoluta considerando o scroll
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        // Define o botão acima do vídeo, com uma margem de 10px
        // Para garantir que o offsetHeight esteja disponível, forçamos a exibição do botão
        btnDownload.style.display = 'block';
        const btnAltura = btnDownload.offsetHeight;
        btnDownload.style.left = (rect.left + scrollX + 10) + 'px';
        btnDownload.style.top = (rect.top + scrollY - btnAltura - 10) + 'px';
    }

    function showOverlayConfirmation(titulo, mensagem) {
        if (!videoContainer) return;

        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = '10%';
        overlay.style.left = '50%';
        overlay.style.transform = 'translateX(-50%)';
        overlay.style.zIndex = '10000';
        overlay.style.background = 'rgba(0, 0, 0, 0.8)';
        overlay.style.color = '#fff';
        overlay.style.padding = '20px';
        overlay.style.borderRadius = '4px';
        overlay.style.fontSize = '14px';
        overlay.style.fontFamily = 'Arial, sans-serif';
        overlay.style.minWidth = '300px';
        overlay.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';

        const h3 = document.createElement('h3');
        h3.style.marginTop = '0';
        h3.style.marginBottom = '10px';
        h3.innerText = titulo;
        overlay.appendChild(h3);

        const p = document.createElement('p');
        p.style.margin = '0 0 10px 0';
        p.innerText = mensagem;
        overlay.appendChild(p);

        const btnFechar = document.createElement('button');
        btnFechar.innerText = 'Fechar';
        btnFechar.style.background = '#ff0000';
        btnFechar.style.border = 'none';
        btnFechar.style.color = '#fff';
        btnFechar.style.padding = '5px 10px';
        btnFechar.style.cursor = 'pointer';
        btnFechar.style.borderRadius = '3px';
        btnFechar.addEventListener('click', () => {
            overlay.remove();
        });
        overlay.appendChild(btnFechar);

        videoContainer.appendChild(overlay);
    }

    async function copyTranscript() {
        try {
            const transcript = await getTranscript();
            if (transcript) {
                GM_setClipboard(transcript, 'text');
                showOverlayConfirmation(
                    'Transcrição Copiada!',
                    'O texto completo foi copiado para a área de transferência.'
                );
            }
        } catch (error) {
            showOverlayConfirmation(
                'Erro na Transcrição',
                error.message
            );
        }
    }

    async function getTranscript() {
        return new Promise(async (resolve, reject) => {
            try {
                const transcriptButton = document.querySelector('button[aria-label*="transcrição"]');
                if (transcriptButton && !transcriptButton.getAttribute('aria-pressed')) {
                    transcriptButton.click();
                    await new Promise(r => setTimeout(r, 1000));
                }

                const checkInterval = setInterval(() => {
                    const segments = document.querySelectorAll('ytd-transcript-segment-renderer');
                    if (segments.length > 0) {
                        clearInterval(checkInterval);

                        const transcriptText = Array.from(segments).map(segment => {
                            const time = segment.querySelector('.segment-timestamp')?.textContent?.trim() || '[00:00]';
                            const text = segment.querySelector('.segment-text')?.textContent?.trim() || '';
                            return `${time} ${text}`;
                        }).join('\n');

                        if (transcriptButton) transcriptButton.click();

                        resolve(transcriptText);
                    }
                }, 500);

                setTimeout(() => {
                    clearInterval(checkInterval);
                    reject(new Error('Tempo limite excedido ao carregar a transcrição'));
                }, 5000);

            } catch (error) {
                reject(new Error(`Erro ao processar transcrição: ${error.message}`));
            }
        });
    }

    function init() {
        videoContainer = document.querySelector('.html5-video-container');
        if (!videoContainer) return;

        // Se o botão ainda não foi criado, cria e posiciona
        if (!btnDownload) {
            btnDownload = createDownloadButton();
            document.body.appendChild(btnDownload);
            posicionaBotao();
            // Reposiciona o botão quando a janela for redimensionada ou o scroll ocorrer
            window.addEventListener('resize', posicionaBotao);
            window.addEventListener('scroll', posicionaBotao);
        }

        const checkTranscript = setInterval(() => {
            const hasTranscript = !!document.querySelector('button[aria-label*="transcrição"]');
            if (hasTranscript) {
                transcriptAvailable = true;
                clearInterval(checkTranscript);
            }
        }, 1000);
    }

    new MutationObserver(init).observe(document.body, {
        childList: true,
        subtree: true
    });
})();
