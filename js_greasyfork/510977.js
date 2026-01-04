// ==UserScript==
// @name         Youtuber Kinger
// @namespace    https://seu-nome-de-usuario.greasyfork.org/
// @version      2.0
// @description  Melhora a experiência no YouTube removendo anúncios, ocultando comentários e ajustando a qualidade máxima dos vídeos automaticamente.
// @author       Seu nome
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510977/Youtuber%20Kinger.user.js
// @updateURL https://update.greasyfork.org/scripts/510977/Youtuber%20Kinger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para remover anúncios no YouTube
    function removeAds() {
        // Remove vídeos de anúncios
        let adElements = document.querySelectorAll('.video-ads, .ytp-ad-module, .ad-showing, .ytp-ad-player-overlay');
        adElements.forEach(ad => ad.remove());

        // Remove banners e sobreposições de anúncios
        let adBanners = document.querySelectorAll('.ytp-ad-image-overlay, .ytp-ad-overlay-slot');
        adBanners.forEach(banner => banner.remove());

        console.log('Anúncios removidos com sucesso.');
    }

    // Função para ocultar completamente a seção de comentários
    function hideComments() {
        let commentsSection = document.getElementById('comments');
        if (commentsSection) {
            commentsSection.style.display = 'none';
            console.log('Seção de comentários oculta com sucesso.');
        }
    }

    // Função para definir a qualidade máxima do vídeo automaticamente
    function setMaxQuality() {
        const qualitySettingsInterval = setInterval(() => {
            let settingsButton = document.querySelector('.ytp-settings-button');
            if (settingsButton) {
                settingsButton.click();  // Abre o menu de configurações

                setTimeout(() => {
                    let qualityMenuItem = Array.from(document.querySelectorAll('.ytp-menuitem')).find(el => el.textContent.includes('Qualidade'));
                    if (qualityMenuItem) {
                        qualityMenuItem.click();  // Abre o submenu de qualidade

                        setTimeout(() => {
                            let maxQualityItem = Array.from(document.querySelectorAll('.ytp-menuitem')).find(el => el.textContent.includes('2160p') || el.textContent.includes('1440p') || el.textContent.includes('1080p') || el.textContent.includes('720p'));
                            if (maxQualityItem) {
                                maxQualityItem.click();  // Seleciona a qualidade máxima
                                console.log('Qualidade máxima definida com sucesso.');
                                clearInterval(qualitySettingsInterval);  // Para o loop após a definição da qualidade
                            }
                        }, 500);
                    }
                }, 500);
            }
        }, 1000);
    }

    // Função principal que aplica todas as melhorias ao YouTube
    function applyYouTubeImprovements() {
        removeAds();          // Remove todos os anúncios
        hideComments();        // Oculta a seção de comentários
        setMaxQuality();       // Define a qualidade máxima
    }

    // Observa mudanças na página para aplicar as melhorias sempre que um novo vídeo for carregado
    const observer = new MutationObserver(() => {
        if (window.location.href.includes('watch')) {
            setTimeout(applyYouTubeImprovements, 1000);  // Aplica melhorias após o vídeo ser carregado
        }
    });

    // Inicia o observador para detectar mudanças no DOM (mudanças dinâmicas de conteúdo)
    observer.observe(document.body, { childList: true, subtree: true });

})();
