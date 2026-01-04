// ==UserScript==
// @name         Replace SOON and Update Views
// @namespace    http://tampermonkey.net/
// @version      0.81
// @description  Replaces the text "SOON" with the video duration and updates the view count in the metadata.
// @match        *://www.youtube.com/*
// @grant        none
// @license      none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/523074/Replace%20SOON%20and%20Update%20Views.user.js
// @updateURL https://update.greasyfork.org/scripts/523074/Replace%20SOON%20and%20Update%20Views.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updateVideoInfo() {
        // Substituir "EM BREVE" pelo tempo do vídeo
        document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer').forEach(overlay => {
            const textElement = overlay.querySelector('.badge-shape-wiz__text');
            const spanTextElement = overlay.querySelector('#text');

            if (textElement && textElement.textContent.trim() === 'EM BREVE') {
                const lengthElement = overlay.closest('ytd-rich-grid-media').querySelector('yt-formatted-string#length');

                if (lengthElement) {
                    const videoTime = lengthElement.textContent.trim();
                    textElement.textContent = videoTime;
                    if (spanTextElement) {
                        spanTextElement.textContent = videoTime;
                    }
                }
            }
        });

        // Atualizar visualizações no metadado do vídeo
        document.querySelectorAll('ytd-video-meta-block').forEach(metaBlock => {
            const ariaLabel = metaBlock.querySelector('yt-formatted-string[aria-label]');
            const viewCountElement = metaBlock.querySelector('span.inline-metadata-item.style-scope.ytd-video-meta-block');

            if (ariaLabel && viewCountElement) {
                // Extrai visualizações do aria-label
                const ariaText = ariaLabel.getAttribute('aria-label');
                const viewCountMatch = ariaText.match(/(\d+ visualizações)/);

                if (viewCountMatch) {
                    const viewCount = viewCountMatch[0];
                    // Substitui o texto do metadado com a contagem de visualizações extraída
                    viewCountElement.textContent = viewCount;
                }
            }
        });
    }

    // Execute a função quando o DOM estiver totalmente carregado
    document.addEventListener('DOMContentLoaded', updateVideoInfo);

    // Execute a função também em intervalos regulares para cobrir alterações dinâmicas
    setInterval(updateVideoInfo, 3000); // Executa a cada 3 segundos
})();