// ==UserScript==
// @name         BetterAnime: Controles + Autoplay + Skip Opening + Recusar + Avançar Episódio
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Adiciona painel para ativar/desativar pular abertura, recusar retomar e avançar episódio no BetterAnime
// @match        https://betteranime.net/anime/*/episodio-*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536684/BetterAnime%3A%20Controles%20%2B%20Autoplay%20%2B%20Skip%20Opening%20%2B%20Recusar%20%2B%20Avan%C3%A7ar%20Epis%C3%B3dio.user.js
// @updateURL https://update.greasyfork.org/scripts/536684/BetterAnime%3A%20Controles%20%2B%20Autoplay%20%2B%20Skip%20Opening%20%2B%20Recusar%20%2B%20Avan%C3%A7ar%20Epis%C3%B3dio.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const settingsKey = 'betteranime_user_settings';
    const defaultSettings = {
        skipOpening: true,
        refuseResume: true,
        autoNext: true,
    };

    function loadSettings() {
        try {
            return JSON.parse(localStorage.getItem(settingsKey)) || { ...defaultSettings };
        } catch {
            return { ...defaultSettings };
        }
    }

    function saveSettings(settings) {
        localStorage.setItem(settingsKey, JSON.stringify(settings));
    }

    function createSettingsPanel(settings) {
        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.left = '10px';
        panel.style.background = '#111';
        panel.style.color = '#fff';
        panel.style.padding = '10px';
        panel.style.borderRadius = '8px';
        panel.style.zIndex = '9999';
        panel.style.fontSize = '14px';
        panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        panel.style.maxWidth = '200px';

        panel.innerHTML = `
            <strong style="display:block;margin-bottom:5px;">BetterAnime Controles</strong>
            <label><input type="checkbox" id="ba-skipOpening"> Pular Abertura</label><br>
            <label><input type="checkbox" id="ba-refuseResume"> Recusar Retomar</label><br>
            <label><input type="checkbox" id="ba-autoNext"> Avançar Episódio</label>
        `;

        document.body.appendChild(panel);

        const checkboxes = {
            skipOpening: panel.querySelector('#ba-skipOpening'),
            refuseResume: panel.querySelector('#ba-refuseResume'),
            autoNext: panel.querySelector('#ba-autoNext'),
        };

        // aplicar configurações atuais
        checkboxes.skipOpening.checked = settings.skipOpening;
        checkboxes.refuseResume.checked = settings.refuseResume;
        checkboxes.autoNext.checked = settings.autoNext;

        // atualizar localStorage ao mudar
        for (const key in checkboxes) {
            checkboxes[key].addEventListener('change', () => {
                settings[key] = checkboxes[key].checked;
                saveSettings(settings);
                console.log(`🔧 Configuração atualizada: ${key} = ${settings[key]}`);
            });
        }
    }

    function waitAndClickSkipOpening(doc, settings) {
        if (!settings.skipOpening) return;

        const maxAttempts = 90;
        let attempts = 0;

        const interval = setInterval(() => {
            const skipBtn = doc.querySelector('.ba-skipIntro');
            const isVisible = skipBtn && skipBtn.offsetParent !== null;

            if (isVisible) {
                skipBtn.click();
                console.log('⏩ Pulou a abertura (botão apareceu).');
                clearInterval(interval);
            }

            attempts++;
            if (attempts > maxAttempts) {
                console.log('⚠️ Botão de pular abertura não apareceu dentro do tempo.');
                clearInterval(interval);
            }
        }, 1000);
    }

    function clickContinueNoButton(doc, settings) {
        if (!settings.refuseResume) return;

        const btn = Array.from(doc.querySelectorAll('bt')).find(el => el.textContent.trim().toLowerCase() === 'não');
        if (btn) {
            btn.click();
            console.log('🛑 Clicou em "Não".');
        }
    }

    function getNextEpisodeUrl() {
        const match = window.location.href.match(/episodio-(\d+)/);
        if (!match) return null;
        const currentEpStr = match[1];
        const currentEp = parseInt(currentEpStr, 10);
        const nextEpStr = (currentEp + 1).toString().padStart(currentEpStr.length, '0');
        return window.location.href.replace(/episodio-\d+/, `episodio-${nextEpStr}`);
    }

    // === PRINCIPAL ===
    const settings = loadSettings();
    createSettingsPanel(settings);

    const waitForIframe = setInterval(() => {
        const iframe = document.getElementById('playerFrame');
        if (!iframe || !iframe.contentWindow) return;

        let doc;
        try {
            doc = iframe.contentDocument || iframe.contentWindow.document;
        } catch (e) {
            console.warn("⚠️ Iframe inacessível.");
            clearInterval(waitForIframe);
            return;
        }

        const videoCheck = setInterval(() => {
            const video = doc.querySelector('video');
            if (video) {
                clearInterval(videoCheck);

                // Clique no player para autoplay
                video.focus();
                video.click();
                console.log('🖱️ Clique no player.');

                // Recusar continuar
                const noInterval = setInterval(() => {
                    clickContinueNoButton(doc, settings);
                }, 1000);
                setTimeout(() => clearInterval(noInterval), 10000);

                // Esperar e clicar em "Pular abertura"
                waitAndClickSkipOpening(doc, settings);

                // Avançar episódio
                if (settings.autoNext) {
                    video.addEventListener('ended', () => {
                        const nextUrl = getNextEpisodeUrl();
                        if (nextUrl) {
                            window.location.href = nextUrl;
                        }
                    });
                }
            }
        }, 1000);

        clearInterval(waitForIframe);
    }, 1000);
})();
