// ==UserScript==
// @name         YouTube Customizable Subtitles / Youtube Subtitulos Inteligentes
// @namespace    https://greasyfork.org/es/scripts/504151-youtube-customizable-subtitles-youtube-subtitulos-personalizables
// @version      3.0
// @description  Customizable YouTube subtitles with automatically generated outline for perfect readability / Subtítulos personalizables con contorno generado automáticamente para mejor legibilidad
// @author       Eterve Nallo - Diam
// @license      MIT
// @match        *://*.youtube.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/504151/YouTube%20Customizable%20Subtitles%20%20Youtube%20Subtitulos%20Inteligentes.user.js
// @updateURL https://update.greasyfork.org/scripts/504151/YouTube%20Customizable%20Subtitles%20%20Youtube%20Subtitulos%20Inteligentes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const fullscreenScale = 1.25;
    let isFullscreen = false;

    const languages = {
        en: { configTitle: 'Subtitle Settings', outlineColor: 'Outline Color:', outlineWidth: 'Outline Width:', textColor: 'Text Color:', saveButton: 'Save', closeButton: 'X', languageButton: 'Language', languageLabel: 'Choose Language', menuCommand: 'Show/Hide Subtitle Settings' },
        es: { configTitle: 'Configuración de Subtítulos', outlineColor: 'Color del Contorno:', outlineWidth: 'Grosor del Contorno:', textColor: 'Color del Texto:', saveButton: 'Guardar', closeButton: 'X', languageButton: 'Idioma', languageLabel: 'Elegir Idioma', menuCommand: 'Mostrar/Ocultar Configuración de Subtítulos' },
        ja: { configTitle: '字幕設定', outlineColor: 'アウトラインカラー:', outlineWidth: 'アウトラインの幅:', textColor: '文字色:', saveButton: '保存', closeButton: 'X', languageButton: '言語', languageLabel: '言語を選択', menuCommand: '字幕設定を表示/非表示' },
        ru: { configTitle: 'Настройки субтитров', outlineColor: 'Цвет контура:', outlineWidth: 'Ширина контура:', textColor: 'Цвет текста:', saveButton: 'Сохранить', closeButton: 'X', languageButton: 'Язык', languageLabel: 'Выберите язык', menuCommand: 'Показать/Скрыть настройки субтитров' },
        ko: { configTitle: '자막 설정', outlineColor: '윤곽선 색상:', outlineWidth: '윤곽선 너비:', textColor: '글자 색상:', saveButton: '저장', closeButton: 'X', languageButton: '언어', languageLabel: '언어 선택', menuCommand: '자막 설정 표시/숨기기' },
        zh: { configTitle: '字幕设置', outlineColor: '轮廓颜色:', outlineWidth: '轮廓宽度:', textColor: '文字颜色:', saveButton: '保存', closeButton: 'X', languageButton: '语言', languageLabel: '选择语言', menuCommand: '显示/隐藏字幕设置' }
    };

    const defaultConfig = { outlineColor: 'black', outlineWidth: 1, textColor: 'white', showPanel: false, language: 'en' };

    function loadConfig() {
        const savedConfig = GM_getValue('ytSubtitleConfig');
        return savedConfig ? JSON.parse(savedConfig) : defaultConfig;
    }

    function saveConfig(config) {
        GM_setValue('ytSubtitleConfig', JSON.stringify(config));
    }

    const config = loadConfig();
    const lang = languages[config.language] || languages.en;

    // Función que genera automáticamente text-shadow
    function generateShadows(outlineWidth, steps, color) {
        const shadows = [];
        for (let x = -steps; x <= steps; x++) {
            for (let y = -steps; y <= steps; y++) {
                if (x !== 0 || y !== 0) { // evitar sombra central
                    shadows.push(`${x * outlineWidth}px ${y * outlineWidth}px 0 ${color}`);
                }
            }
        }
        return shadows.join(',\n');
    }

    function applySubtitleStyles() {
        const effectiveWidth = isFullscreen ? config.outlineWidth * fullscreenScale : config.outlineWidth;
        const steps = isFullscreen ? 3 : 2; // más pasos en fullscreen para contorno más grueso
        const shadows = generateShadows(effectiveWidth, steps, config.outlineColor);

        GM_addStyle(`
            .ytp-caption-segment {
                color: ${config.textColor} !important;
                text-shadow: ${shadows};
                background: transparent !important;
                font-weight: bold;
                font-size: calc(16px + 1vw);
            }

            .caption-window {
                background-color: transparent !important;
            }
        `);
    }

    function checkFullscreen() {
        const newState = !!(document.fullscreenElement || document.webkitFullscreenElement);
        if (newState !== isFullscreen) {
            isFullscreen = newState;
            applySubtitleStyles();
        }
    }

    document.addEventListener('fullscreenchange', checkFullscreen);
    document.addEventListener('webkitfullscreenchange', checkFullscreen);

    function createConfigPanel() {
        const videoPlayer = document.querySelector('.html5-video-player');
        if (!videoPlayer) return;

        const panel = document.createElement('div');
        panel.id = 'subtitleConfigPanel';
        panel.style.position = 'absolute';
        panel.style.top = '10px';
        panel.style.right = '10px';
        panel.style.padding = '10px';
        panel.style.backgroundColor = 'rgba(0,0,0,0.8)';
        panel.style.color = 'white';
        panel.style.borderRadius = '5px';
        panel.style.zIndex = '9999';
        panel.style.display = 'block';

        const title = document.createElement('h4');
        title.textContent = lang.configTitle;
        panel.appendChild(title);

        const outlineLabel = document.createElement('label');
        outlineLabel.textContent = lang.outlineColor + ' ';
        const outlineInput = document.createElement('input');
        outlineInput.type = 'color';
        outlineInput.value = config.outlineColor;
        outlineLabel.appendChild(outlineInput);
        panel.appendChild(outlineLabel);
        panel.appendChild(document.createElement('br'));

        const widthLabel = document.createElement('label');
        widthLabel.textContent = lang.outlineWidth;
        const widthControl = document.createElement('div');
        widthControl.style.display = 'flex';
        widthControl.style.alignItems = 'center';

        const widthSlider = document.createElement('input');
        widthSlider.type = 'range';
        widthSlider.min = '0.5';
        widthSlider.max = '1.5';  // máximo ajustado a tu grosor ideal
        widthSlider.step = '0.1'; // para poder elegir 1.5 exactamente
        widthSlider.value = config.outlineWidth;
        widthSlider.style.width = '150px';

        const widthDisplay = document.createElement('div');
        widthDisplay.style.marginLeft = '10px';
        widthDisplay.style.fontSize = '16px';
        widthDisplay.style.width = '35px';
        widthDisplay.style.textAlign = 'center';
        widthDisplay.textContent = config.outlineWidth;

        widthControl.appendChild(widthSlider);
        widthControl.appendChild(widthDisplay);
        widthLabel.appendChild(widthControl);
        panel.appendChild(widthLabel);
        panel.appendChild(document.createElement('br'));

        const textLabel = document.createElement('label');
        textLabel.textContent = lang.textColor + ' ';
        const textInput = document.createElement('input');
        textInput.type = 'color';
        textInput.value = config.textColor;
        textLabel.appendChild(textInput);
        panel.appendChild(textLabel);
        panel.appendChild(document.createElement('br'));

        const saveBtn = document.createElement('button');
        saveBtn.textContent = lang.saveButton;
        panel.appendChild(saveBtn);

        const closeBtn = document.createElement('button');
        closeBtn.style.marginTop = '10px';
        closeBtn.textContent = lang.closeButton;
        panel.appendChild(closeBtn);

        const langBtn = document.createElement('button');
        langBtn.style.display = 'block';
        langBtn.style.marginTop = '10px';
        langBtn.textContent = lang.languageButton;
        panel.appendChild(langBtn);

        videoPlayer.appendChild(panel);

        widthSlider.addEventListener('input', (e) => {
            const newOutlineWidth = parseFloat(e.target.value);
            widthDisplay.textContent = newOutlineWidth;
            config.outlineWidth = newOutlineWidth;
            applySubtitleStyles();
        });

        saveBtn.addEventListener('click', () => {
            config.outlineColor = outlineInput.value;
            config.textColor = textInput.value;
            applySubtitleStyles();
            saveConfig(config);
        });

        closeBtn.addEventListener('click', () => {
            panel.remove();
            config.showPanel = false;
            saveConfig(config);
        });

        langBtn.addEventListener('click', () => {
            toggleLanguageMenu(panel);
        });
    }

    function toggleLanguageMenu(panel) {
        let languageMenu = panel.querySelector('#languageMenu');
        if (languageMenu) { languageMenu.remove(); return; }

        languageMenu = document.createElement('div');
        languageMenu.id = 'languageMenu';
        languageMenu.style.position = 'absolute';
        languageMenu.style.top = '50px';
        languageMenu.style.left = '10px';
        languageMenu.style.padding = '10px';
        languageMenu.style.backgroundColor = 'rgba(0,0,0,0.8)';
        languageMenu.style.color = 'white';
        languageMenu.style.borderRadius = '5px';
        languageMenu.style.zIndex = '9999';

        const title = document.createElement('h4');
        title.textContent = lang.languageLabel;
        languageMenu.appendChild(title);

        const langs = ['en','es','ja','ru','ko','zh'];
        const labels = { en:'English', es:'Español', ja:'日本語', ru:'Русский', ko:'한국어', zh:'中文' };
        langs.forEach(code => {
            const btn = document.createElement('button');
            btn.textContent = labels[code];
            btn.style.display = 'block';
            btn.style.marginTop = '5px';
            btn.addEventListener('click', () => { changeLanguage(code); });
            languageMenu.appendChild(btn);
        });

        const closeBtn = document.createElement('button');
        closeBtn.textContent = lang.closeButton;
        closeBtn.style.marginTop = '10px';
        closeBtn.addEventListener('click', () => { languageMenu.remove(); });
        languageMenu.appendChild(closeBtn);

        panel.appendChild(languageMenu);
    }

    function changeLanguage(newLanguage) {
        config.language = newLanguage;
        saveConfig(config);
        location.reload();
    }

    function toggleConfigPanel() {
        const videoPlayer = document.querySelector('.html5-video-player');
        if (!videoPlayer) return;

        const panel = document.getElementById('subtitleConfigPanel');
        if (panel) {
            panel.remove();
            config.showPanel = false;
        } else {
            createConfigPanel();
            config.showPanel = true;
        }

        saveConfig(config);
    }

    GM_registerMenuCommand(lang.menuCommand, toggleConfigPanel);

    applySubtitleStyles();
    if (config.showPanel) createConfigPanel();

})();
