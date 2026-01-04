// ==UserScript==
// @name         V2 Модерация ГА/ЗГА/Куратор VLADIMIR Kостомизация для сайта Black Russia Forum
// @namespace    http://tampermonkey.net/
// @version      12.6
// @description  Настройка стиля BR Forum + Модерация
// @author        Fantom_Stark
// @match        https://forum.blackrussia.online/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @icon         https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @license      MIT
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.8/handlebars.min.js
// @downloadURL https://update.greasyfork.org/scripts/507698/V2%20%D0%9C%D0%BE%D0%B4%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D1%8F%20%D0%93%D0%90%D0%97%D0%93%D0%90%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%20VLADIMIR%20K%D0%BE%D1%81%D1%82%D0%BE%D0%BC%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F%20%D0%B4%D0%BB%D1%8F%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%20Black%20Russia%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/507698/V2%20%D0%9C%D0%BE%D0%B4%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D1%8F%20%D0%93%D0%90%D0%97%D0%93%D0%90%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%20VLADIMIR%20K%D0%BE%D1%81%D1%82%D0%BE%D0%BC%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F%20%D0%B4%D0%BB%D1%8F%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%20Black%20Russia%20Forum.meta.js
// ==/UserScript==


(function() {
    'use strict';

   const STYLE_ID = 'blackrussia-custom-style-v111';
    const WELCOME_SCREEN_ID = 'br-style-welcome-screen-v111';
    const SCRIPT_VERSION = '13.2';
    const PANEL_ID = 'blackrussia-settings-panel-v111';
    const BOTTOM_NAV_ID = 'blackrussia-bottom-nav-bar-v111';
    const CLOCK_ID = 'br-style-clock-v111';
    const STYLE_ICON_ID = 'br-style-toggle-icon-v111';
    const EFFECTS_CONTAINER_ID = 'br-effects-container-v111';
    const BACKGROUND_ELEMENT_ID = 'br-style-background-v111';
    const TOAST_CONTAINER_ID = 'br-style-toast-container-v111';
    const SCROLL_INDICATOR_ID = 'br-style-scroll-indicator-v111';
const UPLOAD_HISTORY_KEY = 'br_style_upload_history';
    const BOTTOM_NAV_HEIGHT = '45px';
    const MAX_IMAGE_SIZE_MB = 5;
    const PETAL_IMAGES = {
        'sakura': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEBSURBVDhPjZPbSoFREEXP/x8lxaKDSy9QdO0LFDq4dO0FlB6DbxAfwLKLK7S4ECGFShLOrUEGZ3Y2c6YzuDMzwxPjzMi3ncyZcy9TShENsULUgQ/p9Xrd+F7jfyTAXqfT+RGcOxQSiUQn7/d7d09PT19C/jmdTn9XV1d3u66/aQCjLEtEcvl8vu9sNns0iYBHhBAiGOLvQAAdxmMdxpPZuQE5HA6/wnkAZZZl4zgcDo9ms9lSxyNjAFNTU28yMzPzGYIgZJlZ1gXQbrf7fD6fX8uyefc5PT09VqvV36qqaq+srPxoNPiBgBEBDBBCBAIGYFtVVY+1Wm31er3ncrnO7u7u3g4jQI2MjPwD5PM8HR4eHlP4hAXkHo6Ojg5+fgBU4hX+767+AlKFyyVgYk0AAAAASUVORK5CYII=',
        'red_rose': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADnSURBVDhPvZLBDcIwDEVt9x90GCcYwCugjqZWZRkYkCjxh4xE1Nq4sYTE0k8+z/cGt7PjwXe+B5QsyzLMZrP5fD6fLMuyLCKRCFmWmU6nx8fHx77v+1VV1XCFYLVal0qlMp1Op9NOpxMPDw9FUUhEItFqtVqv11uWZcuy7LruuwAopVIpzLIsQogQ4jje3d1dLpdrAGL+AAD8siwjmUwGgMvlMk3TaDQaBEGAYrFYLpd7e3v7LMuaEAIAAEiShCRJ+GDAdV1VVQHAzWYzU1NTyuWyIAjAGQBEUURZlhEEAZIkQcuyDAwM/M0IfwByoXlFZpIAAAAASUVORK5CYII=',
        'autumn_maple': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAE8SURBVDhPjZLRisJQFIYjfA/hG+gKOsl1N3VXcAcdx3WPQEeoU6dgNwfcRVxB3Ekf0sAIU5Iy56XkP3Pcl/cnAUEQBEEQfN9nWZaoqhqdpqmdNjc3z+fz+Xq9pt/vz+fz+fn5+TQaDY/Hg99rLpcLx3G6urpKkgR2dnZ0dXWFpmkMwzAM46naAEiS5Pv+5uZmpVIhz/M0TaPdbodhjGEYrus6TdM0TdM0jTETQgghRFFUbG1tJUkCm80GANDv96HrOnmefx/AcdxWqxWLxcg0zTAMu64LwyDsU0qpVLIsK5fLtVqtTqcDogjh+x7AMAz6/T6IoghhGFSSBEIIruk6DEMURfF9/zAMmqYpm81itrYWCoVcLgdsbW0BAKrVKhqNxrZtQRBg2zaWZcViMdjb2wMANG3b9nq9LMtijmNZlrIsSZIQBCRJAtM0/6/8B+gNKuUnPvJ/AAAAAElFTkSuQmCC',
    };

    let settingsPanel = null;
    let settingsIcon = null;
    let bottomNavElement = null;
    let clockElement = null;
    let effectsContainer = null;
    let toastContainer = null;
    let myUsername = null;
    let domObserver = null;
    let scrollObserver = null;
    let scrollIndicatorElement = null;
    let currentSettings = {};
    let lastScrollTop = 0;
    let threadAuthor = null;


        const defaultSettings = {
        bgImageDataUri: '', opacityValue: 0.9, borderRadius: '8px', bgColor: '#2E2E2E',
        enableRounding: true, enableEdge: true, edgeColor: '#FFEB3B', edgeWidth: '1px', edgeOpacity: 0.7,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        transparentElementsOpacity: 1, enableGradient: false, gradientColor1: '#333333', gradientColor2: '#000000',
        gradientColor3: '#555555', gradientColor4: '#222222', gradientDirection: '135deg',
        enableAnimatedGradient: false, animatedGradientSpeed: '5s',
        enableBottomNav: true, bottomNavOpacity: 0.85, bottomNavBorderRadius: '25px', bottomNavPosition: 'bottom-center',
quickLinks: [
            { name: 'Главная', url: 'https://forum.blackrussia.online/', icon: 'fas fa-home' },
            { name: 'Правила', url: 'https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.10/', icon: 'fas fa-gavel' },
            { name: 'Жалобы', url: 'https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.14/', icon: 'fas fa-exclamation-shield' }
        ],        enableTextGlow: false, textGlowColor: '#FFFF00', textGlowIntensity: '5px',
        effectType: 'none', effectIntensity: 50, effectSpeed: 1,
        effectSwayIntensity: 1, effectRainLength: 20,

        customPresets: {},
        enableBlockBlur: false,
        blockBlurAmount: 5,
        enableOwnMessageHighlight: false,
        ownMessageHighlightBgColor: '#2c3e50',
        ownMessageHighlightEdgeColor: '#3498db',
        ownMessageHighlightEdgeWidth: '1px',
        enablePageTransition: false,
        pageTransitionType: 'fade-in',
        pageTransitionDuration: 0.5,

        enableAvatarBorder: true,
        avatarBorderColor1: '#FF00DE',
        avatarBorderColor2: '#00F0FF',
        avatarBorderColor3: '#00FF85',
        avatarBorderSize: '2px',
        avatarBorderSpeed: '3s',
        avatarBorderStyle: 'gradient',
        avatarPulsateColor: '#FFFFFF',
        enablePulsatingNicks: false,
        pulsatingNickColor: '#FFFFFF',
        pulsatingNickIntensity: 1.1,
        pulsatingNickSpeed: '2s',
        enableGradientNicks: false,
        gradientNickColor1: '#FFFFFF',
        gradientNickColor2: '#00F0FF',
        gradientNickColor3: '#FF00DE',
        gradientNickSpeed: '3s',
        enableUiAnimations: true,
        uiAnimationSpeed: '0.2s',
        enableScrollFadeIn: true,
        scrollFadeInType: 'fade-in-up',
        enableParallaxScroll: true,
        enableScrollIndicator: true,
        scrollIndicatorColor: '#00F0FF',
        scrollIndicatorHeight: '3px',
        enableWideMode: false,
        enableOpHighlight: true,
        opHighlightBgColor: '#3a2e4a',
        opHighlightEdgeColor: '#9b59b6',
        opHighlightEdgeWidth: '1px',
        enableSmartNav: true,
        enable3DAvatarHover: true,
        enableLikeAnimations: true,
        enableDynamicWelcome: true,
        enableInteractiveParticles: true,
        enableContextualBackgrounds: false,
        contextualBgUrl: 'zhaloby',
        contextualBgPreset: 'default_dark',
        enableLiveCounters: true,
        enableLiveFeed: true,
        enableAdminOnlineToast: true,
        adminToastNicks: 'Maras_Rofls\nLorenzo_Rofls',
        enableHotTopicPulse: true,
        liveUpdateInterval: 60,
        imgbbApiKey: '',
        uploaderBtnBgUrl: '',
        enableComplaintTracker: true,
        complaintTrackerWarnTime: 12,
                complaintTrackerCritTime: 24,
        complaintTrackerSections: 'жалоб, обжалован, техническ, биографи, заявлен',
panelTheme: 'classic_dark',
enableTopicAnimation: true,
topicAnimationType: 'fade-in',

};

    const availableFonts = [
        { name: "Стандартный (Inter)", value: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' },
        { name: "Roboto", value: 'Roboto, sans-serif' },
        { name: "Open Sans", value: '"Open Sans", sans-serif' },
        { name: "Montserrat", value: 'Montserrat, sans-serif' },
        { name: "Arial / Helvetica", value: 'Arial, Helvetica, sans-serif' },
        { name: "Verdana / Geneva", value: 'Verdana, Geneva, sans-serif' },
        { name: "Tahoma / Geneva", value: 'Tahoma, Geneva, sans-serif' },
        { name: "Segoe UI / Tahoma", value: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' },
        { name: "Times New Roman / Times", value: '"Times New Roman", Times, serif' },
        { name: "Georgia / Serif", value: 'Georgia, serif' },
        { name: "Courier New / Monospace", value: '"Courier New", Courier, monospace' }
    ];
    const builtInPresets = {
        'new_year': {
            enableGradient: true, gradientColor1: '#0a1931', gradientColor2: '#173a6a', gradientColor3: '#ffffff', gradientColor4: '#0a1931', gradientDirection: '135deg',
            enableAnimatedGradient: true, animatedGradientSpeed: '15s',
            bgColor: '#1a2a47', opacityValue: 0.9, enableBlockBlur: true, blockBlurAmount: 3,
            enableRounding: true, borderRadius: '10px',
            enableEdge: true, edgeColor: '#ffffff', edgeWidth: '1px', edgeOpacity: 0.7,
            enableTextGlow: true, textGlowColor: '#cce7ff', textGlowIntensity: '8px',
            effectType: 'snow', effectIntensity: 100, effectSpeed: 1, effectSwayIntensity: 1.2,
            enableAvatarBorder: true, avatarBorderColor1: '#ffffff', avatarBorderColor2: '#cce7ff', avatarBorderColor3: '#89cff0',
            enablePulsatingNicks: false, enableUiAnimations: true, enableTopicAnimation: true, enableScrollIndicator: true, scrollIndicatorColor: '#ffffff'
        },
        'halloween': {
            enableGradient: true, gradientColor1: '#1a0000', gradientColor2: '#ff6600', gradientColor3: '#000000', gradientColor4: '#3d0000', gradientDirection: '45deg',
            enableAnimatedGradient: true, animatedGradientSpeed: '10s',
            bgColor: '#2b0f00', opacityValue: 0.9, enableBlockBlur: false,
            enableRounding: true, borderRadius: '6px',
            enableEdge: true, edgeColor: '#ff6600', edgeWidth: '2px', edgeOpacity: 0.8,
            enableTextGlow: true, textGlowColor: '#ff9900', textGlowIntensity: '10px',
            effectType: 'leaves-autumn_maple', effectIntensity: 60, effectSpeed: 0.8, effectSwayIntensity: 1,
            enableAvatarBorder: true, avatarBorderColor1: '#ff6600', avatarBorderColor2: '#f0ad4e', avatarBorderColor3: '#000000',
            enablePulsatingNicks: true, pulsatingNickColor: '#ff6600', pulsatingNickIntensity: 1.1, pulsatingNickSpeed: '2s',
            enableUiAnimations: true, enableTopicAnimation: true, enableScrollIndicator: true, scrollIndicatorColor: '#ff6600'
        },
        'cyberpunk': {
            enableGradient: true, gradientColor1: '#000000', gradientColor2: '#ff00ff', gradientColor3: '#00ffff', gradientColor4: '#000000', gradientDirection: '45deg',
            enableAnimatedGradient: true, animatedGradientSpeed: '6s',
            bgColor: '#1a001a', opacityValue: 0.9, enableBlockBlur: true, blockBlurAmount: 2,
            enableRounding: true, borderRadius: '2px',
            enableEdge: true, edgeColor: '#00ffff', edgeWidth: '1px', edgeOpacity: 0.8,
            enableTextGlow: true, textGlowColor: '#ff00ff', textGlowIntensity: '10px',
            effectType: 'matrix', effectIntensity: 90, effectSpeed: 1.2, effectRainLength: 18,
            enableAvatarBorder: true, avatarBorderColor1: '#ff00ff', avatarBorderColor2: '#00ffff', avatarBorderColor3: '#F0FF00',
            enablePulsatingNicks: true, pulsatingNickColor: '#00ffff', pulsatingNickIntensity: 1.05, pulsatingNickSpeed: '1.5s',
            enableUiAnimations: true, enableTopicAnimation: true, enableScrollIndicator: true, scrollIndicatorColor: '#00ffff'
        },
        'valentines': {
            ...defaultSettings,
            enableGradient: true, gradientColor1: '#ffc0cb', gradientColor2: '#e63946', gradientColor3: '#ffffff', gradientColor4: '#ffb6c1', gradientDirection: '135deg',
            enableAnimatedGradient: true, animatedGradientSpeed: '12s',
            bgColor: '#3d1a2a', opacityValue: 0.9, enableBlockBlur: true, blockBlurAmount: 3,
            enableRounding: true, borderRadius: '12px',
            enableEdge: true, edgeColor: '#ff8fab', edgeWidth: '1px', edgeOpacity: 0.7,
            enableTextGlow: true, textGlowColor: '#ffc0cb', textGlowIntensity: '8px',
            effectType: 'petals-red_rose', effectIntensity: 60, effectSpeed: 0.8, effectSwayIntensity: 1.5,
            enableAvatarBorder: true, avatarBorderColor1: '#ff0054', avatarBorderColor2: '#ffffff', avatarBorderColor3: '#ff8fab',
            enablePulsatingNicks: true, pulsatingNickColor: '#ff8fab', pulsatingNickIntensity: 1.05,
            enableGradientNicks: false,
            enableScrollIndicator: true, scrollIndicatorColor: '#ff0054'
        },
        'womens_day': {
            ...defaultSettings,
            enableGradient: true, gradientColor1: '#f8c5c8', gradientColor2: '#a4d4ae', gradientColor3: '#ffffff', gradientColor4: '#fffdd0', gradientDirection: '45deg',
            enableAnimatedGradient: true, animatedGradientSpeed: '15s',
            bgColor: '#333333', opacityValue: 0.85, enableBlockBlur: true, blockBlurAmount: 4,
            enableRounding: true, borderRadius: '10px',
            enableEdge: true, edgeColor: '#90ee90', edgeWidth: '1px', edgeOpacity: 0.8,
            enableTextGlow: true, textGlowColor: '#d4ffb8', textGlowIntensity: '6px',
            effectType: 'petals-sakura', effectIntensity: 70, effectSpeed: 1, effectSwayIntensity: 1.3,
            enableAvatarBorder: true, avatarBorderColor1: '#f8c5c8', avatarBorderColor2: '#90ee90', avatarBorderColor3: '#fffdd0',
            enablePulsatingNicks: false,
            enableGradientNicks: true, gradientNickColor1: '#f8c5c8', gradientNickColor2: '#90ee90', gradientNickColor3: '#f8c5c8',
            enableScrollIndicator: true, scrollIndicatorColor: '#f8c5c8'
        },
        'victory_day': {
            ...defaultSettings,
            enableGradient: true, gradientColor1: '#000000', gradientColor2: '#ff6600', gradientColor3: '#d90429', gradientColor4: '#000000', gradientDirection: 'to right',
            enableAnimatedGradient: true, animatedGradientSpeed: '10s',
            bgColor: '#1c1c1c', opacityValue: 0.9, enableBlockBlur: false,
            enableRounding: true, borderRadius: '4px',
            enableEdge: true, edgeColor: '#ff6600', edgeWidth: '2px', edgeOpacity: 0.9,
            enableTextGlow: true, textGlowColor: '#fca311', textGlowIntensity: '10px',
            effectType: 'none',
            enableAvatarBorder: true, avatarBorderStyle: 'pulsate', avatarPulsateColor: '#fca311', avatarBorderSpeed: '2s',
            enablePulsatingNicks: true, pulsatingNickColor: '#ff6600', pulsatingNickIntensity: 1.1,
            enableGradientNicks: false,
            enableScrollIndicator: true, scrollIndicatorColor: '#ff6600'
        },
        'ramadan': {
            ...defaultSettings,
            enableGradient: true, gradientColor1: '#004d40', gradientColor2: '#ffd700', gradientColor3: '#ffffff', gradientColor4: '#00695c', gradientDirection: '135deg',
            enableAnimatedGradient: true, animatedGradientSpeed: '14s',
            bgColor: '#003d33', opacityValue: 0.9, enableBlockBlur: true, blockBlurAmount: 2,
            enableRounding: true, borderRadius: '8px',
            enableEdge: true, edgeColor: '#ffd700', edgeWidth: '1px', edgeOpacity: 0.8,
            enableTextGlow: true, textGlowColor: '#fff59d', textGlowIntensity: '8px',
            effectType: 'fireflies', effectIntensity: 50, effectSpeed: 0.7, effectSwayIntensity: 1,
            enableAvatarBorder: true, avatarBorderColor1: '#ffd700', avatarBorderColor2: '#ffffff', avatarBorderColor3: '#00796b',
            enablePulsatingNicks: false,
            enableGradientNicks: true, gradientNickColor1: '#ffd700', gradientNickColor2: '#ffffff', gradientNickColor3: '#fff59d',
            enableScrollIndicator: true, scrollIndicatorColor: '#ffd700'
        },
        'default_dark': { ...defaultSettings }
    };
    const MATRIX_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';

    function hexToRgb(hex) { if (!hex || typeof hex !== 'string') return null; const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null; }
    function readFileAsDataURL(file) { return new Promise((resolve, reject) => { if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) { reject(new Error(`Файл слишком большой! Макс. размер: ${MAX_IMAGE_SIZE_MB} МБ.`)); return; } const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = (error) => reject(error); reader.readAsDataURL(file); }); }
    function downloadFile(filename, content, contentType) { const blob = new Blob([content], { type: contentType }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); }
    function isValidEffectType(type) { return ['none', 'rain', 'snow', 'petals-sakura', 'petals-red_rose', 'leaves-autumn_maple', 'fireflies', 'matrix', 'bubbles'].includes(type); }
    function debounce(func, wait) { let timeout; return function executedFunction(...args) { const later = () => { clearTimeout(timeout); func(...args); }; clearTimeout(timeout); timeout = setTimeout(later, wait); }; }
    function isValidURL(str) { if (!str || typeof str !== 'string') return false; try { new URL(str); return str.startsWith('http://') || str.startsWith('https://') || str.startsWith('ftp://'); } catch (_) { return str.startsWith('/'); } }
    function getRandomInRange(min, max) { return Math.random() * (max - min) + min; }
    function getRandomIntInRange(min, max) { min = Math.ceil(min); max = Math.floor(max); return Math.floor(Math.random() * (max - min + 1)) + min; }
    function observeDOM(targetNode, callback, options = { childList: true, subtree: true }) { if (!targetNode) return null; const observer = new MutationObserver(callback); observer.observe(targetNode, options); return observer; }
    function injectScript(src) { return new Promise((resolve, reject) => { const script = document.createElement('script'); script.src = src; script.async = true; script.onload = resolve; script.onerror = reject; (document.head || document.documentElement).appendChild(script); }); }
    function injectStyle(href) { return new Promise((resolve, reject) => { const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = href; link.onload = resolve; link.onerror = reject; (document.head || document.documentElement).appendChild(link); }); }

    function createRipple(event) {
        const button = event.currentTarget;
        if (!button) return;

        let rippleContainer = button.querySelector('.br-ripple-container');
        if (!rippleContainer) {
            rippleContainer = document.createElement('div');
            rippleContainer.className = 'br-ripple-container';
            button.appendChild(rippleContainer);
        }

        const ripple = document.createElement('span');
        ripple.className = 'br-ripple-effect';

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;

        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        rippleContainer.appendChild(ripple);

        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    }


    function showToast(message, type = 'info', duration = 3000) {
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = TOAST_CONTAINER_ID;
            document.body.appendChild(toastContainer);
        }
        const toast = document.createElement('div');
        toast.className = `br-toast br-toast-${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => { toast.classList.add('br-toast-show'); }, 10);
        setTimeout(() => {
            toast.classList.remove('br-toast-show');
            setTimeout(() => {
                if (toast.parentNode === toastContainer) {
                    toastContainer.removeChild(toast);
                }
            }, 500);
        }, duration);
    }


function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

   function validateSetting(key, value, defaultValue) {
        const dValue = (defaultValue !== undefined) ? defaultValue : defaultSettings[key];
        const dType = typeof dValue;
        if (dType === 'boolean') {
            return (value === true || value === 'true');
        }
        if (dType === 'number') {
            const parsedValue = parseFloat(value);
            if (isNaN(parsedValue)) {
                return dValue;
            }
            let numValue = parsedValue;
            if (['opacityValue', 'edgeOpacity', 'bottomNavOpacity', 'transparentElementsOpacity'].includes(key)) {
                numValue = Math.max(0, Math.min(1, numValue));
            } else if (key === 'effectIntensity') {
                numValue = Math.max(10, Math.min(200, parseInt(numValue, 10)));
            } else if (key === 'effectSpeed') {
                numValue = Math.max(0.1, Math.min(5, numValue));
            } else if (key === 'effectSwayIntensity') {
                numValue = Math.max(0, Math.min(3, numValue));
            } else if (key === 'effectRainLength') {
                numValue = Math.max(5, Math.min(50, parseInt(numValue, 10)));
            } else if (key === 'blockBlurAmount') {
                numValue = Math.max(0, Math.min(50, parseInt(numValue, 10)));
            } else if (key === 'pageTransitionDuration') {
                numValue = Math.max(0.1, Math.min(2, numValue));
            } else if (key === 'pulsatingNickIntensity') {
                numValue = Math.max(1, Math.min(2, numValue));
            } else if (Number.isInteger(dValue)) {
                numValue = parseInt(numValue, 10);
            }
            return numValue;
        }
       if (dType === 'string') {
            const strValue = (value !== null && value !== undefined) ? String(value).trim() : String(dValue);
            if (strValue === '') return dValue;

            const validateUnitValue = (val, unit, regex) => {
                if (regex.test(val)) {
                    return val;
                }
                if (/^\d+(\.\d+)?$/.test(val)) {
                    return `${val}${unit}`;
                }
                return null;
            };

            if (key === 'effectType' && !isValidEffectType(strValue)) return dValue;
            if (key === 'pageTransitionType' && !['fade-in', 'slide-in-left', 'slide-in-right', 'zoom-in'].includes(strValue)) return dValue;
            if (key === 'topicAnimationType' && !['fade-in', 'fade-in-up', 'slide-in-left'].includes(strValue)) return dValue;

            const pxKeys = ['borderRadius', 'edgeWidth', 'textGlowIntensity', 'ownMessageHighlightEdgeWidth', 'avatarBorderSize', 'scrollIndicatorHeight'];
            const sKeys = ['animatedGradientSpeed', 'avatarBorderSpeed', 'pulsatingNickSpeed', 'uiAnimationSpeed'];

            if (pxKeys.includes(key)) {
                const result = validateUnitValue(strValue, 'px', /^\d+(\.\d+)?px$/);
                return result !== null ? result : dValue;
            }
            if (sKeys.includes(key)) {
                const result = validateUnitValue(strValue, 's', /^\d+(\.\d+)?s$/);
                return result !== null ? result : dValue;
            }

            return strValue;
        }

        if (dType === 'object' && dValue !== null) {
            let parsedObj = value;
            if (typeof parsedObj === 'string') {
                try { parsedObj = JSON.parse(parsedObj); } catch (e) { parsedObj = dValue; }
            }
            if (key === 'quickLinks') {
                if (!Array.isArray(parsedObj)) parsedObj = dValue;
                return parsedObj.filter(link => link && typeof link.name === 'string' && typeof link.url === 'string');
            }
            if (key === 'customPresets') {
                if (typeof parsedObj !== 'object' || parsedObj === null || Array.isArray(parsedObj)) parsedObj = dValue;
                return parsedObj;
            }
        }
        return value;
    }

   function addQuickLinkInput(container, link = { name: '', url: '' }) {
        if (!container) return;
        const linkInputDiv = document.createElement('div');
        linkInputDiv.className = 'quick-link-input-item';
        linkInputDiv.innerHTML = `
            <input type="text" class="quick-link-name" placeholder="Название" value="${link.name || ''}">
            <input type="text" class="quick-link-url" placeholder="URL (https://...)" value="${link.url || ''}">
            <button class="remove-quick-link-btn panel-small-btn panel-btn-danger" title="Удалить ссылку">➖</button>
        `;
        container.appendChild(linkInputDiv);
linkInputDiv.querySelector('.remove-quick-link-btn').addEventListener('click', (e) => {
            createRipple(e);
            linkInputDiv.remove();
        });    }

    async function loadSettings() {
        currentSettings = {};
        const tempDefault = { ...defaultSettings };
        try {
            const settingKeys = Object.keys(tempDefault);
            const loadedValues = await Promise.all(settingKeys.map(key => GM_getValue(key, tempDefault[key])));
            settingKeys.forEach((key, index) => {
                currentSettings[key] = validateSetting(key, loadedValues[index], tempDefault[key]);
            });
            if (!currentSettings.quickLinks || !Array.isArray(currentSettings.quickLinks) || currentSettings.quickLinks.length === 0) {
                currentSettings.quickLinks = tempDefault.quickLinks;
            }
            if (typeof currentSettings.customPresets !== 'object' || currentSettings.customPresets === null || Array.isArray(currentSettings.customPresets)) {
                currentSettings.customPresets = tempDefault.customPresets;
            }
            Object.keys(builtInPresets['default_dark']).forEach(key => {
                if (currentSettings[key] === undefined) {
                    currentSettings[key] = defaultSettings[key];
                }
            });

        } catch (e) {
            console.error('[BR Style] Ошибка загрузки настроек!', e);
            currentSettings = { ...defaultSettings };
            showToast('[BR Style] Ошибка загрузки настроек! Применены стандартные значения.', 'error');
        }
    }

   async function saveSettings(settingsToSave) {
        try {
            const savePromises = [];
            const validatedSettings = {};
            const allKeys = { ...defaultSettings, ...settingsToSave };
            for (const key in allKeys) {
                if (defaultSettings.hasOwnProperty(key)) {
                    let valueToValidate = settingsToSave.hasOwnProperty(key) ? settingsToSave[key] : currentSettings[key];
                    let validatedValue = validateSetting(key, valueToValidate, defaultSettings[key]);
                    let valueToStore = validatedValue;

                    if (key === 'quickLinks' && Array.isArray(valueToStore)) {
                        valueToStore = JSON.stringify(valueToStore);
                    } else if (key === 'customPresets' && typeof valueToStore === 'object' && valueToStore !== null && !Array.isArray(valueToStore)) {
                        valueToStore = JSON.stringify(valueToStore);
                    }
                    savePromises.push(GM_setValue(key, valueToStore));
                    validatedSettings[key] = validatedValue;
                } else if (settingsToSave.hasOwnProperty(key)) {
                     console.warn(`[BR Style] Попытка сохранить неизвестный ключ: ${key}`);
                }
            }
            await Promise.all(savePromises);
            currentSettings = { ...currentSettings, ...validatedSettings };
            return true;
        } catch (e) {
            console.error('[BR Style] Ошибка сохранения настроек!', e);
            showToast('[BR Style] Ошибка сохранения настроек!', 'error');
            return false;
        }
    }

function applyForumStyles(settings) {
        let styleElement = document.getElementById(STYLE_ID);
        if (!styleElement) {
            styleElement = document.createElement('style'); styleElement.id = STYLE_ID; styleElement.type = 'text/css';
            (document.head || document.documentElement).appendChild(styleElement);
        }
        try {
            const cachedRgb = {}; const getRgb = (hex) => { if (!cachedRgb[hex]) cachedRgb[hex] = hexToRgb(hex); return cachedRgb[hex]; };
            const mainBgRgb = getRgb(settings.bgColor);
            const mainElementBgColor = mainBgRgb ? `rgba(${mainBgRgb.r}, ${mainBgRgb.g}, ${mainBgRgb.b}, ${settings.opacityValue})` : defaultSettings.bgColor;
            const edgeRgb = getRgb(settings.edgeColor);
            const edgeColorWithOpacity = edgeRgb ? `rgba(${edgeRgb.r}, ${edgeRgb.g}, ${edgeRgb.b}, ${settings.edgeOpacity})` : 'transparent';
            const edgeWidthValue = (typeof settings.edgeWidth === 'number') ? `${settings.edgeWidth}px` : settings.edgeWidth;
            const finalEdgeBoxShadow = settings.enableEdge ? `0 0 0 ${edgeWidthValue} ${edgeColorWithOpacity}` : 'none';
            const borderRadiusValue = (typeof settings.borderRadius === 'number') ? `${settings.borderRadius}px` : settings.borderRadius;
            const finalBorderRadius = settings.enableRounding ? borderRadiusValue : '0px';
            const fallbackBgColor = settings.bgColor || '#1e1e1e';
            const bottomNavBaseBgRgb = getRgb('#380202');
            const bottomNavFinalBgColor = bottomNavBaseBgRgb ? `rgba(${bottomNavBaseBgRgb.r}, ${bottomNavBaseBgRgb.g}, ${bottomNavBaseBgRgb.b}, ${settings.bottomNavOpacity})` : '#222222';
            let bottomNavPositionStyle = ''; const navBarOffset = '10px';
            switch (settings.bottomNavPosition) {
                case 'bottom-left': bottomNavPositionStyle = `bottom: ${navBarOffset}; top: auto; left: ${navBarOffset}; right: auto; transform: none;`; break;
                case 'bottom-right': bottomNavPositionStyle = `bottom: ${navBarOffset}; top: auto; left: auto; right: ${navBarOffset}; transform: none;`; break;
                case 'top-left': bottomNavPositionStyle = `bottom: auto; top: ${navBarOffset}; left: ${navBarOffset}; right: auto; transform: none;`; break;
                case 'top-center': bottomNavPositionStyle = `bottom: auto; top: ${navBarOffset}; left: 50%; right: auto; transform: translateX(-50%);`; break;
                case 'top-right': bottomNavPositionStyle = `bottom: auto; top: ${navBarOffset}; left: auto; right: ${navBarOffset}; transform: none;`; break;
                case 'middle-left': bottomNavPositionStyle = `bottom: auto; top: 50%; left: ${navBarOffset}; right: auto; transform: translateY(-50%);`; break;
                case 'middle-right': bottomNavPositionStyle = `bottom: auto; top: 50%; left: auto; right: ${navBarOffset}; transform: translateY(-50%);`; break;
                case 'bottom-center': default: bottomNavPositionStyle = `bottom: ${navBarOffset}; top: auto; left: 50%; right: auto; transform: translateX(-50%);`; break;
            }
            const mainElementsSelector = `.block-container, .block-filterBar, .message-inner, .widget-container .widget, .bbCodeBlock-content, .formPopup .menu-content, .tooltip-content, .structItem, .notice-content, .overlay-container .overlay-content, .p-header, .p-nav, .p-navSticky.is-sticky .p-nav, .p-footer`;
            const transparentElementsSelector = `.p-body-inner, .message, .message-cell, .block-body, .bbCodeBlock, .widget-container, .notice, .overlay-container .overlay, .message-responseRow, .buttonGroup, .fr-box.fr-basic.is-focused, .fr-toolbar .fr-more-toolbar, .fr-command.fr-btn+.fr-dropdown-menu, .fr-box.fr-basic, button.button a.button.button--link, .input, .block-minorTabHeader, .blockMessage, .input:focus, .input.is-focused, .js-quickReply.block .message, .block--messages .block-row, .js-quickReply .block-row, .node--depth2:nth-child(even) .node-body, .node-body, .message-cell.message-cell--user, .message-cell.message-cell--action, .block--messages.block .message, .button.button--link`;
            const pageWrapperSelector = '.p-pageWrapper';
            const fontTargetSelector = `body, .p-body, .block-body, .message-content, .structItem-title, .node-title, .p-title-value, input, textarea, select, button:not(.fr-command), .button:not(.fr-command), .input, .username, .tabs-tab, .block-header`;
            const textGlowTargetSelector = `a:not(.button):not(.tabs-tab), .p-title-value, .structItem-title a, .node-title a, .username, .message-name, .block-header, .pairs dt`;
            const parallaxStyle = settings.enableParallaxScroll ? 'background-attachment: fixed !important;' : '';
            let backgroundElementStyle = '';
            const animSpeedValue = (typeof settings.animatedGradientSpeed === 'number') ? `${settings.animatedGradientSpeed}s` : settings.animatedGradientSpeed;
            if (settings.enableAnimatedGradient && settings.enableGradient) {
                backgroundElementStyle = `background-image: linear-gradient(${settings.gradientDirection}, ${settings.gradientColor1}, ${settings.gradientColor2}, ${settings.gradientColor3}, ${settings.gradientColor4}, ${settings.gradientColor1}); background-size: 400% 400%; animation: animatedGradient ${animSpeedValue} ease infinite; ${parallaxStyle}`;
            } else if (settings.enableGradient) {
                backgroundElementStyle = `background-image: linear-gradient(${settings.gradientDirection}, ${settings.gradientColor1}, ${settings.gradientColor2}, ${settings.gradientColor3}, ${settings.gradientColor4}) !important; background-size: cover !important; background-repeat: no-repeat !important; ${parallaxStyle}`;
           } else if (settings.bgImageDataUri) {
                backgroundElementStyle = `background-image: url('${settings.bgImageDataUri}') !important; background-size: cover !important; background-repeat: no-repeat !important; ${parallaxStyle}`;
            } else {
                backgroundElementStyle = `background-color: #0B0C1B !important; ${parallaxStyle}`;
            }
            const animatedGradientKeyframes = (settings.enableAnimatedGradient && settings.enableGradient)
                ? `@keyframes animatedGradient { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }`
                : '';
            const finalBlockBlur = settings.enableBlockBlur ? `blur(${settings.blockBlurAmount}px)` : 'none';
            const glowIntensityValue = (typeof settings.textGlowIntensity === 'number') ? `${settings.textGlowIntensity}px` : settings.textGlowIntensity;
            const ownMsgEdgeWidthValue = (typeof settings.ownMessageHighlightEdgeWidth === 'number') ? `${settings.ownMessageHighlightEdgeWidth}px` : settings.ownMessageHighlightEdgeWidth;
            const ownMessageHighlightStyle = (settings.enableOwnMessageHighlight && myUsername) ? `
                .message[data-author="${myUsername}"] .message-inner {
                    background-color: ${settings.ownMessageHighlightBgColor} !important;
                    border: ${ownMsgEdgeWidthValue} solid ${settings.ownMessageHighlightEdgeColor} !important;
                    ${settings.enableRounding ? `border-radius: ${finalBorderRadius};` : ''}
                }
            ` : '';
            const opMsgEdgeWidthValue = (typeof settings.opHighlightEdgeWidth === 'number') ? `${settings.opHighlightEdgeWidth}px` : settings.opHighlightEdgeWidth;
            const opMessageHighlightStyle = (settings.enableOpHighlight && threadAuthor) ? `
                .message[data-author="${threadAuthor}"] .message-inner {
                    background-color: ${settings.opHighlightBgColor} !important;
                    border: ${opMsgEdgeWidthValue} solid ${settings.opHighlightEdgeColor} !important;
                    ${settings.enableRounding ? `border-radius: ${finalBorderRadius};` : ''}
                }
            ` : '';
            let pageTransitionStyle = '';
            if (settings.enablePageTransition) {
                const duration = (typeof settings.pageTransitionDuration === 'number') ? `${settings.pageTransitionDuration}s` : '0.5s';
                pageTransitionStyle = `
                    .p-pageWrapper {
                        animation-name: br-page-transition-${settings.pageTransitionType};
                        animation-duration: ${duration};
                        animation-timing-function: ease-out;
                        animation-fill-mode: both;
                    }
                `;
            }
            const avatarSizeValue = (typeof settings.avatarBorderSize === 'number') ? `${settings.avatarBorderSize}px` : settings.avatarBorderSize;
            const avatarSpeedValue = (typeof settings.avatarBorderSpeed === 'number') ? `${settings.avatarBorderSpeed}s` : settings.avatarBorderSpeed;
            let avatarBorderStyle = '';
            if (settings.enableAvatarBorder) {
                let animationProps = '';
                if (settings.avatarBorderStyle === 'gradient') {
                    animationProps = `
                        background: linear-gradient(60deg, ${settings.avatarBorderColor1}, ${settings.avatarBorderColor2}, ${settings.avatarBorderColor3}, ${settings.avatarBorderColor2}, ${settings.avatarBorderColor1});
                        background-size: 400% 400%;
                        animation: br-animated-avatar-border ${avatarSpeedValue} ease infinite;
                    `;
                } else if (settings.avatarBorderStyle === 'pulsate') {
                    animationProps = `
                        background-color: ${settings.avatarPulsateColor};
                        animation: br-pulsating-avatar-border ${avatarSpeedValue} ease-in-out infinite;
                        box-shadow: 0 0 10px ${settings.avatarPulsateColor};
                    `;
                }
                avatarBorderStyle = `
                    .avatar {
                        position: relative;
                        padding: ${avatarSizeValue};
                        border-radius: 50%;
                        overflow: hidden;
                        ${animationProps}
                    }
                    .avatar img {
                        border-radius: 50%;
                        display: block;
                        position: relative;
                        z-index: 1;
                        width: 100%;
                        height: 100%;
                    }
                `;
            }
            const nickSpeedValue = (typeof settings.pulsatingNickSpeed === 'number') ? `${settings.pulsatingNickSpeed}s` : settings.pulsatingNickSpeed;
            const pulsatingNickStyle = settings.enablePulsatingNicks ? `
                .username {
                    --br-pulse-color: ${settings.pulsatingNickColor};
                    --br-pulse-scale: ${settings.pulsatingNickIntensity};
                    --br-pulse-speed: ${nickSpeedValue};
                    animation: br-pulsating-nick var(--br-pulse-speed) infinite ease-in-out;
                    display: inline-block;
                }
            ` : '';
            const gradNickSpeedValue = (typeof settings.gradientNickSpeed === 'number') ? `${settings.gradientNickSpeed}s` : settings.gradientNickSpeed;
            const gradientNickStyle = settings.enableGradientNicks ? `
                .username {
                    background: linear-gradient(60deg, ${settings.gradientNickColor1}, ${settings.gradientNickColor2}, ${settings.gradientNickColor3}, ${settings.gradientNickColor2}, ${settings.gradientNickColor1});
                    background-size: 400% 400%;
                    -webkit-background-clip: text;
                    -moz-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    -moz-text-fill-color: transparent;
                    color: transparent;
                    animation: br-animated-gradient-text ${gradNickSpeedValue} ease infinite;
                }
            ` : '';
            const uiAnimSpeedValue = (typeof settings.uiAnimationSpeed === 'number') ? `${settings.uiAnimationSpeed}s` : settings.uiAnimationSpeed;
            const uiAnimationStyle = settings.enableUiAnimations ? `
                .message .message-user, .button, .tabs-tab, .block-filterBar-link, .structItem:not(.br-anim-scroll) {
                    transition: transform ${uiAnimSpeedValue} ease-out, box-shadow ${uiAnimSpeedValue} ease-out, opacity ${uiAnimSpeedValue} ease-out !important;
                }
                .message .message-user:hover, .button:hover, .tabs-tab:hover, .block-filterBar-link:hover, .structItem:not(.br-anim-scroll):hover {
                    transform: scale(1.02);
                    z-index: 10;
                    position: relative;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                }
                .message .message-user:active, .button:active, .tabs-tab:active, .block-filterBar-link:active, .structItem:not(.br-anim-scroll):active {
                    transform: scale(0.98);
                }
            ` : '';
const avatar3dHoverStyle = settings.enable3DAvatarHover ? `
                .message-user {
                    perspective: 1000px;
                }
                .avatar {
                    transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
                    transform-style: preserve-3d;
                }
                .message-user:hover .avatar {
                    transform: rotateY(18deg) rotateX(5deg) scale(1.15);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.3);
                }
            ` : '';
            const scrollIndicatorHeightValue = (typeof settings.scrollIndicatorHeight === 'number') ? `${settings.scrollIndicatorHeight}px` : settings.scrollIndicatorHeight;
            const scrollIndicatorStyle = settings.enableScrollIndicator ? `
                #${SCROLL_INDICATOR_ID} {
                    display: block;
                    height: ${scrollIndicatorHeightValue};
                    background-color: ${settings.scrollIndicatorColor};
                    box-shadow: 0 0 10px ${settings.scrollIndicatorColor}, 0 0 5px ${settings.scrollIndicatorColor};
                }
            ` : `
                #${SCROLL_INDICATOR_ID} { display: none; }
            `;
            const wideModeStyle = settings.enableWideMode ? `
                .p-pageWrapper, .p-body-inner {
                    max-width: none !important;
                }
            ` : '';
            const forumCss = `
                ${fontTargetSelector} {
                    ${settings.fontFamily ? `font-family: ${settings.fontFamily} !important;` : ''}
                }
                #${BACKGROUND_ELEMENT_ID} {
                    ${backgroundElementStyle}
                }
                ${animatedGradientKeyframes}
                ${pageWrapperSelector}, ${mainElementsSelector} {
                    background-color: ${mainElementBgColor} !important;
                    border-radius: ${finalBorderRadius} !important;
                    box-shadow: ${finalEdgeBoxShadow} !important;
                    ${settings.enableRounding ? 'overflow: hidden;' : ''}
                    backdrop-filter: ${finalBlockBlur};
                    -webkit-backdrop-filter: ${finalBlockBlur};
                }
                ${transparentElementsSelector} {
                    background: none !important;
                    border: none !important;
                    box-shadow: none !important;
                    opacity: ${settings.transparentElementsOpacity} !important;
                }
                ${settings.enableTextGlow ? `${textGlowTargetSelector}, .fa, .fab, .fas, .far { text-shadow: 0 0 ${glowIntensityValue} ${settings.textGlowColor}; }` : ''}

                ${ownMessageHighlightStyle}
                ${opMessageHighlightStyle}
                ${wideModeStyle}
               ${pageTransitionStyle}

                                #${BOTTOM_NAV_ID} {
                    ${settings.enableBottomNav ? 'display: block !important;' : 'display: none !important;'}
                    border-radius: ${settings.bottomNavBorderRadius} !important;
                    ${bottomNavPositionStyle}
                    background-image: url('https://i.postimg.cc/SRQshpnf/c263d2184f802a05ef422346a937ed1a.gif') !important;
                    background-size: cover !important;
                    background-position: center !important;
                    background-repeat: no-repeat !important;
                    border: 1px solid rgba(255, 255, 255, 0.2) !important;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3) !important;
                    backdrop-filter: blur(5px) !important;
                    -webkit-backdrop-filter: blur(5px) !important;
                    overflow: hidden !important;
                }

      .br-nav-inner-mask {
                    border-radius: ${settings.bottomNavBorderRadius} !important;
                }


                ${settings.enableBottomNav ? `
                    .br-nav-utilities {
                        display: flex;
                        align-items: center;
                    }
                    #${STYLE_ICON_ID} {
                        position: relative;
                        bottom: auto;
                        left: auto;
                        width: 30px;
                        height: 30px;
                        font-size: 16px;
                        background-color: rgba(255, 255, 255, 0.1);
                        border: none;
                        box-shadow: none;
                        z-index: 10;
                        margin-right: 5px;
                    }
                ` : ''}                #${CLOCK_ID} {
                    color: ${settings.bottomNavClockColor || '#e0e0e0'};
                    display: ${settings.enableBottomNavClock ? 'inline-block' : 'none'} !important;
                }
                #${EFFECTS_CONTAINER_ID} {
                    display: ${settings.effectType !== 'none' ? 'block' : 'none'};
                }
                ${avatarBorderStyle}
                ${pulsatingNickStyle}
                ${gradientNickStyle}
                ${uiAnimationStyle}
                ${avatar3dHoverStyle}
                ${scrollIndicatorStyle}
               .menu, .menu-content, .menu-header, .menu-footer, .menu-tabHeader, .menu-row, .menu-link,
                .offCanvasMenu, .offCanvasMenu-content, .offCanvasMenu-list, .offCanvasMenu-linkHolder,
                .p-drawer, .p-drawer-body, .p-drawer-header, .p-drawer-footer {
                    background-color: ${mainElementBgColor} !important;
                    border-radius: ${finalBorderRadius} !important;
                    box-shadow: ${finalEdgeBoxShadow} !important;
                    backdrop-filter: ${finalBlockBlur} !important;
                    -webkit-backdrop-filter: ${finalBlockBlur} !important;
                }
                .menu-row, .menu-link, .offCanvasMenu-link {
                    background: transparent !important;
                    color: #ccc !important;
                    border: 0 !important;
                }
                .menu-row:hover, .menu-row.is-selected, .menu-link:hover, .offCanvasMenu-link:hover, .offCanvasMenu-link.is-selected {
                    background: linear-gradient(90deg, ${settings.edgeColor}33, transparent) !important;
                    color: #fff !important;
                }
                .menu-row + .menu-row, .offCanvasMenu-list > li + li {
                    border-top: 1px solid rgba(255,255,255,0.06) !important;
                }
                .offCanvasMenu-link .offCanvasMenu-linkIcon {
                    color: ${settings.edgeColor} !important;
                }
                .fr-toolbar [class*="fa-"], .fr-toolbar i, .fr-toolbar span {
                    font-family: "Font Awesome 5 Free", "Font Awesome 5 Pro", "Font Awesome 5 Brands", "Font Awesome" !important;
                    font-weight: inherit !important;
                }
            `;            styleElement.textContent = forumCss;
        } catch (e) {
            console.error('[BR Style] Ошибка применения динамических стилей❌', e);
            if (styleElement) styleElement.textContent = '';
        }
    }

    function populateAllPresetLists() {
        if (!settingsPanel) return;

        const customSelect = settingsPanel.querySelector('#s_customPresetSelect');
        const contextSelect = settingsPanel.querySelector('#s_contextualBgPreset');
        if (!customSelect || !contextSelect) return;

        const customVal = customSelect.value;
        const contextVal = contextSelect.value;

        customSelect.innerHTML = '<option value="">-- Выберите пресет --</option>';
        contextSelect.innerHTML = '<option value="">-- Не применять --</option>';

        const allPresets = [];

        for (const presetName in builtInPresets) {
            const option = {
                value: presetName,
                text: `🎁 (Тема) ${settingsPanel.querySelector(`#s_builtInPresetSelect option[value="${presetName}"]`)?.text || presetName}`
            };
            allPresets.push(option);
        }

        const sortedCustomKeys = Object.keys(currentSettings.customPresets || {}).sort((a, b) => a.localeCompare(b));
        for (const presetName of sortedCustomKeys) {
            customSelect.add(new Option(presetName, presetName));
            allPresets.push({ value: presetName, text: `💾 (Мой) ${presetName}` });
        }

        allPresets.sort((a, b) => a.text.localeCompare(b.text));
        allPresets.forEach(opt => {
            contextSelect.add(new Option(opt.text, opt.value));
        });

        if (Array.from(customSelect.options).some(opt => opt.value === customVal)) {
            customSelect.value = customVal;
        } else {
            customSelect.value = "";
        }

        if (Array.from(contextSelect.options).some(opt => opt.value === contextVal)) {
            contextSelect.value = contextVal;
        } else {
            contextSelect.value = contextVal || "";
        }
    }

     async function handleSaveCustomPreset() {
        if (!settingsPanel) return;
        const nameInput = settingsPanel.querySelector('#s_newPresetName');
        const presetName = nameInput.value.trim();
        if (!presetName) {
            showToast('❌ Введите название пресета!', 'error');
            return;
        }
        if (currentSettings.customPresets.hasOwnProperty(presetName)) {
            if (!confirm(`Пресет "${presetName}" уже существует. Перезаписать?`)) {
                return;
            }
        }
        const saveBtn = settingsPanel.querySelector('#save-preset-btn');
        saveBtn.textContent = 'Сохранение...';
        saveBtn.disabled = true;
        const presetData = {};
        settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
            const key = input.dataset.settingKey;
            if (defaultSettings.hasOwnProperty(key) && key !== 'quickLinks' && key !== 'customPresets' && key !== 'bgImageDataUri') {
                let value;
                if (input.type === 'checkbox') { value = input.checked; }
                else if (input.type === 'number' || input.type === 'range') { const parsedValue = parseFloat(input.value); value = isNaN(parsedValue) ? defaultSettings[key] : parsedValue; }
                else { value = input.value; }
                presetData[key] = value;
            }
        });
        const newPresets = { ...currentSettings.customPresets, [presetName]: presetData };
        const success = await saveSettings({ customPresets: newPresets });
       if (success) {
            showToast(`✅ Пресет "${presetName}" сохранен!`, 'success');
            nameInput.value = '';
            populateAllPresetLists();
        } else {
            showToast('❌ Ошибка сохранения пресета!', 'error');
        }
        saveBtn.textContent = 'Сохранить';
        saveBtn.disabled = false;
    }

   function handleLoadCustomPreset() {
        if (!settingsPanel) return;
        const panelBody = settingsPanel.querySelector('.br-panel-body');
        const currentScrollTop = panelBody ? panelBody.scrollTop : 0;
        const select = settingsPanel.querySelector('#s_customPresetSelect');
        const presetName = select.value;
        if (!presetName) {
            showToast('❌ Пресет не выбран!', 'error');
            return;
        }
        const presetData = currentSettings.customPresets[presetName];
        if (!presetData) {
            showToast('❌ Ошибка: не удалось найти данные пресета!', 'error');
            return;
        }        settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
            const key = input.dataset.settingKey;
            if (presetData.hasOwnProperty(key)) {
                const value = presetData[key];
                if (input.type === 'checkbox') {
                    input.checked = !!value;
                } else if (input.type === 'range') {
                    let numericValue = (typeof value === 'string') ? parseFloat(value) : value;
                    if (isNaN(numericValue)) numericValue = defaultSettings[key];
                    input.value = numericValue ?? defaultSettings[key];
                    updateSliderValue(input);
                } else {
                    input.value = value ?? '';
                }
            }
        });
        const initializeVisibilityFunc = settingsPanel.querySelector('#s_effectType')?.brInitializeVisibility;
        if (initializeVisibilityFunc && typeof initializeVisibilityFunc === 'function') {
             initializeVisibilityFunc();
        }
        const initializeAnimVisibilityFunc = settingsPanel.querySelector('#s_enableAvatarBorder')?.brInitializeVisibility;
        if (initializeAnimVisibilityFunc && typeof initializeAnimVisibilityFunc === 'function') {
             initializeAnimVisibilityFunc();
        }
        if (panelBody) {
             panelBody.scrollTop = currentScrollTop;
        }
        showToast(`✅ Пресет "${presetName}" загружен. Нажмите '💾 Сохранить'.`, 'info', 4000);
    }

    function handleLoadBuiltInPreset() {
        if (!settingsPanel) return;
        const panelBody = settingsPanel.querySelector('.br-panel-body');
        const currentScrollTop = panelBody ? panelBody.scrollTop : 0;
        const select = settingsPanel.querySelector('#s_builtInPresetSelect');
        const presetName = select.value;

        if (!presetName) {
            showToast('❌ Тема не выбрана!', 'error');
            return;
        }

        const presetData = builtInPresets[presetName];
        if (!presetData) {
            showToast('❌ Ошибка: не удалось найти данные темы!', 'error');
            return;
        }
        const fullPresetData = { ...defaultSettings, ...presetData };
        settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
            const key = input.dataset.settingKey;
            if (key === 'quickLinks' || key === 'customPresets' || key === 'bgImageDataUri') return;

            if (fullPresetData.hasOwnProperty(key)) {
                const value = fullPresetData[key];
                if (input.type === 'checkbox') {
                    input.checked = !!value;
                } else if (input.type === 'range') {
                    let numericValue = (typeof value === 'string') ? parseFloat(value) : value;
                    if (isNaN(numericValue)) numericValue = defaultSettings[key];
                    input.value = numericValue ?? defaultSettings[key];
                    updateSliderValue(input);
                } else {
                    input.value = value ?? '';
                }
            }
        });
        const bgFileInput = settingsPanel.querySelector('#s_bgImageFile');
        if (bgFileInput) bgFileInput.value = '';

        settingsPanel.dataset.presetLoaded = 'true';

        const initializeVisibilityFunc = settingsPanel.querySelector('#s_effectType')?.brInitializeVisibility;
        if (initializeVisibilityFunc && typeof initializeVisibilityFunc === 'function') {
            initializeVisibilityFunc();
        }
        const initializeAnimVisibilityFunc = settingsPanel.querySelector('#s_enableAvatarBorder')?.brInitializeVisibility;
        if (initializeAnimVisibilityFunc && typeof initializeAnimVisibilityFunc === 'function') {
             initializeAnimVisibilityFunc();
        }
        if (panelBody) {
             panelBody.scrollTop = currentScrollTop;
        }
        showToast(`✅ Тема "${select.options[select.selectedIndex].text}" загружена. Нажмите '💾 Сохранить'.`, 'info', 4000);
    }
     async function handleDeleteCustomPreset() {
        if (!settingsPanel) return;
        const select = settingsPanel.querySelector('#s_customPresetSelect');
        const presetName = select.value;
        if (!presetName) {
            showToast('❌ Пресет не выбран!', 'error');
            return;
        }
        if (!confirm(`Вы уверены, что хотите удалить пресет "${presetName}"?`)) {
            return;
        }
        const newPresets = { ...currentSettings.customPresets };
        delete newPresets[presetName];
        const success = await saveSettings({ customPresets: newPresets });
       if (success) {
            showToast(`✅ Пресет "${presetName}" удален.`, 'success');
            populateAllPresetLists();
        } else {
            showToast('❌ Ошибка удаления пресета!', 'error');
        }
    }

    function updateSliderValue(slider) {
        if (!settingsPanel) return;
        const valueDisplay = settingsPanel.querySelector(`#val_${slider.name || slider.id.substring(2)}`);
        if (valueDisplay) {
            valueDisplay.textContent = slider.value;
        }
    }


   function createPanelHTML() {
        if (document.getElementById(PANEL_ID)) return document.getElementById(PANEL_ID);
        const panelWrapper = document.createElement('div');
        panelWrapper.id = 'br-panel-wrapper';

        const panelDiv = document.createElement('div');
        panelDiv.id = PANEL_ID;
        panelWrapper.appendChild(panelDiv);
        try {
            const fontOptionsHtml = availableFonts.map(font => `<option value="${font.value}">${font.name}</option>`).join('');
            const createSlider = (id, key, label, min, max, step, unit = '') => `
                <div>
                    <label for="s_${id}">${label}: <span class="slider-value" id="val_${id}"></span><span class="slider-unit">${unit}</span></label>
                    <input type="range" class="br-styled-slider" id="s_${id}" name="${id}" data-setting-key="${key}" min="${min}" max="${max}" step="${step}">
                </div>`;
            const gradientDirectionOptions = [
                { name: 'По диагонали (↘)', value: '135deg' },
                { name: 'По диагонали (↗)', value: '45deg' },
                { name: 'Вниз (↓)', value: 'to bottom' },
                { name: 'Направо (→)', value: 'to right' },
                { name: 'Вверх (↑)', value: 'to top' },
                { name: 'Налево (←)', value: 'to left' },
                { name: 'Круг (из центра)', value: 'circle' }
            ].map(opt => `<option value="${opt.value}">${opt.name}</option>`).join('');

            const createTooltip = (text) => `<span class="br-panel-tooltip" data-tooltip="${text}">?</span>`;

            panelDiv.innerHTML = `
<div class="br-panel-header">
                    <h3><img src="https://i.postimg.cc/28kMdmFG/e65d50f699ab952ca89c8525058c4a0d.gif" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 8px;" /> Центр Настроек</h3>
                    <button id="close-btn" class="br-panel-close-btn" title="Закрыть">❌</button>
                </div>
                <div class="br-panel-body">
                    <a href="${String.fromCharCode(104, 116, 116, 112, 115, 58, 47, 47, 118, 107, 46, 99, 111, 109, 47, 108, 111, 114, 101, 110, 122, 111, 111, 102, 102)}" target="_blank" class="author-credit-link" title="Разработчик скрипта">
    ${String.fromCharCode(1040, 1074, 1090, 1086, 1088, 58, 32, 77, 97, 114, 97, 115, 32, 82, 111, 102, 108, 115, 32)}(v${SCRIPT_VERSION})
</a>                                        <div class="br-hub-grid">
                        <div class="br-hub-card" data-page="tab-main" style="--card-color1: #00F0FF; --card-color2: #00FF85;">
                            <div class="br-hub-card-icon"></div>
                            <span>Главное</span>
                        </div>
                        <div class="br-hub-card" data-page="tab-visuals" style="--card-color1: #FF00DE; --card-color2: #FFEB3B;">
                            <div class="br-hub-card-icon"></div>
                            <span>Визуал</span>
                        </div>
                        <div class="br-hub-card" data-page="tab-animations" style="--card-color1: #00F0FF; --card-color2: #00FF85;">
                            <div class="br-hub-card-icon"></div>
                            <span>Анимации</span>
                        </div>
                        <div class="br-hub-card" data-page="tab-interface" style="--card-color1: #FFEB3B; --card-color2: #FF00DE;">
                            <div class="br-hub-card-icon"></div>
                            <span>Интерфейс</span>
                        </div>
                        <div class="br-hub-card" data-page="tab-live" style="--card-color1: #00F0FF; --card-color2: #00FF85;">
                            <div class="br-hub-card-icon"></div>
                            <span>Живой Форум</span>
                        </div>
                        <div class="br-hub-card" data-page="tab-presets" style="--card-color1: #FF00DE; --card-color2: #FFEB3B;">
                            <div class="br-hub-card-icon"></div>
                            <span>Пресеты</span>
                        </div>
                        <div class="br-hub-card" data-page="tab-integrations" style="--card-color1: #00F0FF; --card-color2: #00FF85;">
                            <div class="br-hub-card-icon"></div>
                            <span>Интеграция</span>
                        </div>
                        <div class="br-hub-card" data-page="tab-help" style="--card-color1: #D59D80; --card-color2: #C6C6D0;">
                            <div class="br-hub-card-icon"></div>
                            <span>Как пользоваться?</span>
                        </div>
                    </div>
                    <div class="br-settings-view">
                        <div class="br-settings-header">
                            <button class="br-settings-back-btn">← Назад</button>
                            <h4 class="br-settings-title"></h4>
                        </div>
                        <div class="panel-tab-content" id="tab-main">


                            <h4>-- Фон & Основные Элементы --</h4>
                            <div class="setting-group">
                                <input type="checkbox" id="s_enableGradient" name="enableGradient" data-setting-key="enableGradient">
                                <label for="s_enableGradient" class="inline-label"><i class="fas fa-palette fa-fw" style="color: #ff8dee;"></i> Градиентный фон</label>${createTooltip('Заменяет фон сайта на анимированный или статичный градиент из 4-х цветов. Отключает фон-изображение.')}
                                <div class="sub-settings" id="gradient-sub-settings">
                                    <div><label for="s_gradientColor1">Цвет 1:</label><input type="color" id="s_gradientColor1" name="gradientColor1" data-setting-key="gradientColor1"></div>
                                    <div style="margin-top: 8px;"><label for="s_gradientColor2">Цвет 2:</label><input type="color" id="s_gradientColor2" name="gradientColor2" data-setting-key="gradientColor2"></div>
                                    <div style="margin-top: 8px;"><label for="s_gradientColor3">Цвет 3:</label><input type="color" id="s_gradientColor3" name="gradientColor3" data-setting-key="gradientColor3"></div>
                                    <div style="margin-top: 8px;"><label for="s_gradientColor4">Цвет 4:</label><input type="color" id="s_gradientColor4" name="gradientColor4" data-setting-key="gradientColor4"></div>
                                    <div style="margin-top: 8px;">
                                        <label for="s_gradientDirection">Направление:</label>
                                        <select id="s_gradientDirection" name="gradientDirection" data-setting-key="gradientDirection">${gradientDirectionOptions}</select>
                                    </div>
                                    <div style="margin-top: 12px;">
                                        <input type="checkbox" id="s_enableAnimatedGradient" name="enableAnimatedGradient" data-setting-key="enableAnimatedGradient">
                                        <label for="s_enableAnimatedGradient" class="inline-label"><i class="fas fa-magic fa-fw" style="color: #00F0FF;"></i> Анимированный градиент</label>${createTooltip('Градиент будет плавно переливаться. Может потреблять больше ресурсов.')}
                                        <div class="sub-settings" id="animated-gradient-sub-settings" style="margin-top: 5px;">
                                            ${createSlider('animatedGradientSpeed', 'animatedGradientSpeed', 'Скорость', 1, 30, 0.5, 's')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="setting-group" id="bg-image-setting-group">
                                <label for="s_bgImageFile"><i class="fas fa-image fa-fw" style="color: #90ee90;"></i> Фон (изображение):</label>${createTooltip('Загрузите свой фон. Он будет отключен, если включен градиент. Макс. размер: 5 МБ.')}
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <input type="file" id="s_bgImageFile" name="bgImageFile" accept="image/*" style="flex-grow: 1; font-size: 11px;">
                                    <button id="clear-bg-btn" title="Удалить фон" class="panel-small-btn panel-btn-danger"><i class="fas fa-times"></i></button>
                                </div>
                                <small id="bg-status" class="panel-status-text">Фон не задан.</small>
                            </div>
                            <hr>
                            <div class="setting-group">
                                <label for="s_bgColor"><i class="fas fa-fill-drip fa-fw" style="color: #aaaaaa;"></i> Цвет Блоков:</label>
                                <input type="color" id="s_bgColor" name="bgColor" data-setting-key="bgColor">
                            </div>
                            <div class="setting-group">
                                ${createSlider('opacityValue', 'opacityValue', '<i class="fas fa-tint fa-fw" style="color: #00F0FF;"></i> Прозрачность Блоков', 0, 1, 0.05)}
                            </div>
                            <div class="setting-group">
                                <input type="checkbox" id="s_enableBlockBlur" name="enableBlockBlur" data-setting-key="enableBlockBlur">
                                <label for="s_enableBlockBlur" class="inline-label"><i class="fas fa-th-large fa-fw" style="color: #a0dfff;"></i> Размытие блоков (Backdrop)</label>${createTooltip('Добавляет "стеклянный" эффект (блюр) позади всех блоков. Выглядит красиво, но может снижать FPS.')}
                                <div class="sub-settings" id="block-blur-sub-settings">
                                    ${createSlider('blockBlurAmount', 'blockBlurAmount', 'Сила размытия', 0, 50, 1, 'px')}
                                </div>
                            </div>
                            <div class="setting-group">
                                <input type="checkbox" id="s_enableRounding" name="enableRounding" data-setting-key="enableRounding">
                                <label for="s_enableRounding" class="inline-label"><i class="fas fa-vector-square fa-fw" style="color: #f0e68c;"></i> Скругление</label>
                                <div class="sub-settings" id="rounding-sub-settings">
                                    ${createSlider('borderRadius', 'borderRadius', 'Радиус', 0, 50, 1, 'px')}
                                </div>
                            </div>
                            <div class="setting-group">
                                <input type="checkbox" id="s_enableEdge" name="enableEdge" data-setting-key="enableEdge">
                                <label for="s_enableEdge" class="inline-label"><i class="fas fa-sparkles fa-fw" style="color: #FFEB3B;"></i> Окантовка</label>${createTooltip('Добавляет цветную рамку/свечение вокруг всех основных блоков (постов, тем, шапки).')}
                                <div class="sub-settings" id="edge-sub-settings">
                                    <div><label for="s_edgeColor">Цвет:</label> <input type="color" id="s_edgeColor" name="edgeColor" data-setting-key="edgeColor"></div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('edgeWidth', 'edgeWidth', 'Толщина', 0, 10, 0.5, 'px')}
                                    </div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('edgeOpacity', 'edgeOpacity', 'Прозрачность', 0, 1, 0.05)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="panel-tab-content" id="tab-visuals">
                            <h4>-- <i class="fas fa-desktop"></i> Компоновка и Вид --</h4>
                            <div class="setting-group">
                                <input type="checkbox" id="s_enableWideMode" name="enableWideMode" data-setting-key="enableWideMode">
                                <label for="s_enableWideMode" class="inline-label"><i class="fas fa-arrows-alt-h fa-fw" style="color: #999;"></i> "Широкий режим"</label>${createTooltip('Убирает пустые поля по бокам форума, растягивая контент на всю ширину экрана.')}
                            </div>

                            <h4>-- <i class="fas fa-highlighter"></i> Выделение Постов --</h4>
                            <div class="setting-group">
                                <input type="checkbox" id="s_enableOpHighlight" name="enableOpHighlight" data-setting-key="enableOpHighlight">
                                <label for="s_enableOpHighlight" class="inline-label"><i class="fas fa-crown fa-fw" style="color: #f1c40f;"></i> Выделять Автора Темы (OP)</label>${createTooltip('Все посты автора текущей темы будут выделены выбранным цветом.')}
                                <div class="sub-settings" id="op-highlight-sub-settings">
                                    <div><label for="s_opHighlightBgColor">Цвет фона:</label> <input type="color" id="s_opHighlightBgColor" name="opHighlightBgColor" data-setting-key="opHighlightBgColor"></div>
                                    <div style="margin-top: 8px;"><label for="s_opHighlightEdgeColor">Цвет окантовки:</label> <input type="color" id="s_opHighlightEdgeColor" name="opHighlightEdgeColor" data-setting-key="opHighlightEdgeColor"></div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('opHighlightEdgeWidth', 'opHighlightEdgeWidth', 'Толщина окантовки', 0, 10, 0.5, 'px')}
                                    </div>
                                </div>
                            </div>

                            <h4>-- <i class="fas fa-font"></i> Шрифт & Текст --</h4>
                            <div class="setting-group">
                                <label for="s_fontFamily"><i class="fas fa-pen-fancy fa-fw" style="color: #ccc;"></i> Шрифт Форума:</label>
                                <select id="s_fontFamily" name="fontFamily" data-setting-key="fontFamily"> ${fontOptionsHtml} </select>
                            </div>
                            <div class="setting-group">
                                <input type="checkbox" id="s_enableTextGlow" name="enableTextGlow" data-setting-key="enableTextGlow">
                                <label for="s_enableTextGlow" class="inline-label"><i class="fas fa-lightbulb fa-fw" style="color: #f1c40f;"></i> Освещение текста</label>${createTooltip('Добавляет легкое свечение (тень) для никнеймов, заголовков тем и другого важного текста.')}
                                <div class="sub-settings" id="text-glow-sub-settings">
                                    <div><label for="s_textGlowColor">Цвет:</label> <input type="color" id="s_textGlowColor" name="textGlowColor" data-setting-key="textGlowColor"></div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('textGlowIntensity', 'textGlowIntensity', 'Интенсивность', 0, 20, 1, 'px')}
                                    </div>
                                </div>
                            </div>
                            <div class="setting-group">
                                ${createSlider('transparentElementsOpacity', 'transparentElementsOpacity', '<i class="fas fa-ghost fa-fw" style="color: #fff;"></i> Прозрачность Фона Элементов', 0, 1, 0.05)}
                            </div>

                            <h4>-- <i class="fas fa-cloud-rain"></i> Визуальные Эффекты V3 --</h4>
                            <div class="setting-group">
                                <label for="s_effectType">Тип Эффекта:</label>${createTooltip('Добавляет "живой" эффект на всю страницу: снег, дождь, листья, матрица и т.д.')}
                                <select id="s_effectType" name="effectType" data-setting-key="effectType">
                                    <option value="none">Отключено</option>
                                    <option value="rain">Дождь (🌧️)</option>
                                    <option value="snow">Снег (❄️)</option>
                                    <option value="petals-sakura">Лепестки Сакуры (🌸)</option>
                                    <option value="petals-red_rose">Лепестки Розы (🌹)</option>
                                    <option value="leaves-autumn_maple">Листья Клена (🍂)</option>
                                    <option value="fireflies">Светлячки (✨)</option>
                                    <option value="matrix">Матрица (💻)</option>
                                    <option value="bubbles">Пузырьки (🫧)</option>
                                </select>
                            </div>
                            <div class="setting-group sub-settings" id="effect-details-settings">
                                ${createSlider('effectIntensity', 'effectIntensity', 'Интенсивность (Кол-во)', 10, 200, 10)}
                                ${createSlider('effectSpeed', 'effectSpeed', 'Скорость (Множитель)', 0.1, 5, 0.1)}
                                <div class="effect-specific-settings rain-settings matrix-settings" style="display:none; margin-top: 8px;">
                                    ${createSlider('effectRainLength', 'effectRainLength', 'Длина (капли/симв.)', 5, 50, 1, 'px')}
                                </div>
                                <div class="effect-specific-settings sway-settings" style="display:none; margin-top: 8px;">
                                    ${createSlider('effectSwayIntensity', 'effectSwayIntensity', 'Покачивание (Множитель)', 0, 3, 0.1)}
                                </div>
                                <div style="margin-top: 10px;">
                                    <input type="checkbox" id="s_enableInteractiveParticles" name="enableInteractiveParticles" data-setting-key="enableInteractiveParticles">
                                    <label for="s_enableInteractiveParticles" class="inline-label"><i class="fas fa-mouse-pointer fa-fw" style="color: #3498db;"></i> Интерактивные частицы</label>${createTooltip('Частицы (снег, листья) будут "разлетаться" от вашего курсора мыши.')}
                                </div>
                            </div>
                        </div>

                        <div class="panel-tab-content" id="tab-animations">
                            <h4>-- <i class="fas fa-user-circle"></i> Анимированные Аватары --</h4>
                            <div class="setting-group">
                                <input type="checkbox" id="s_enableAvatarBorder" name="enableAvatarBorder" data-setting-key="enableAvatarBorder">
                                <label for="s_enableAvatarBorder" class="inline-label"><i class="fas fa-spinner fa-spin fa-fw" style="color: #00F0FF;"></i> Анимированная рамка</label>${createTooltip('Добавляет аватарам анимированную рамку (перелив или пульсация).')}
                                <div class="sub-settings" id="avatar-border-sub-settings">
                                    <div>
                                        <label for="s_avatarBorderStyle">Стиль анимации:</label>
                                        <select id="s_avatarBorderStyle" name="avatarBorderStyle" data-setting-key="avatarBorderStyle">
                                            <option value="gradient">Градиент (перелив)</option>
                                            <option value="pulsate">Пульсация (один цвет)</option>
                                        </select>
                                    </div>
                                    <div id="avatar-gradient-settings" style="margin-top: 8px;">
                                        <div><label for="s_avatarBorderColor1">Цвет 1:</label><input type="color" id="s_avatarBorderColor1" name="avatarBorderColor1" data-setting-key="avatarBorderColor1"></div>
                                        <div style="margin-top: 8px;"><label for="s_avatarBorderColor2">Цвет 2:</label><input type="color" id="s_avatarBorderColor2" name="avatarBorderColor2" data-setting-key="avatarBorderColor2"></div>
                                        <div style="margin-top: 8px;"><label for="s_avatarBorderColor3">Цвет 3:</label><input type="color" id="s_avatarBorderColor3" name="avatarBorderColor3" data-setting-key="avatarBorderColor3"></div>
                                    </div>
                                    <div id="avatar-pulsate-settings" style="margin-top: 8px; display: none;">
                                        <div><label for="s_avatarPulsateColor">Цвет пульсации:</label><input type="color" id="s_avatarPulsateColor" name="avatarPulsateColor" data-setting-key="avatarPulsateColor"></div>
                                    </div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('avatarBorderSize', 'avatarBorderSize', 'Толщина', 1, 5, 0.5, 'px')}
                                    </div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('avatarBorderSpeed', 'avatarBorderSpeed', 'Скорость', 1, 10, 0.5, 's')}
                                    </div>
                                </div>
                            </div>
                            <div class="setting-group">
                                <input type="checkbox" id="s_enable3DAvatarHover" name="enable3DAvatarHover" data-setting-key="enable3DAvatarHover">
                                <label for="s_enable3DAvatarHover" class="inline-label"><i class="fas fa-cube fa-fw" style="color: #fff;"></i> 3D-эффект аватаров</label>${createTooltip('При наведении на аватар, он будет "приподниматься" с 3D-поворотом.')}
                            </div>
                            <h4>-- <i class="fas fa-user-tag"></i> Эффекты Ников --</h4>
                            <div class="setting-group">
                                <input type="checkbox" id="s_enablePulsatingNicks" name="enablePulsatingNicks" data-setting-key="enablePulsatingNicks">
                                <label for="s_enablePulsatingNicks" class="inline-label"><i class="fas fa-satellite-dish fa-fw" style="color: #FFEB3B;"></i> Пульсация (Тень)</label>${createTooltip('Добавляет никнеймам анимированную пульсирующую тень (свечение).')}
                                <div class="sub-settings" id="pulsating-nicks-sub-settings">
                                    <div><label for="s_pulsatingNickColor">Цвет тени (пульса):</label><input type="color" id="s_pulsatingNickColor" name="pulsatingNickColor" data-setting-key="pulsatingNickColor"></div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('pulsatingNickIntensity', 'pulsatingNickIntensity', 'Интенсивность', 1.01, 2, 0.01)}
                                    </div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('pulsatingNickSpeed', 'pulsatingNickSpeed', 'Скорость', 0.5, 5, 0.1, 's')}
                                    </div>
                                </div>
                            </div>
                            <div class="setting-group">
                                <input type="checkbox" id="s_enableGradientNicks" name="enableGradientNicks" data-setting-key="enableGradientNicks">
                                <label for="s_enableGradientNicks" class="inline-label"><i class="fas fa-paint-brush fa-fw" style="color: #ff8dee;"></i> Градиент (Текст)</label>${createTooltip('Делает текст никнеймов анимированным градиентом. Перекрывает "Пульсацию".')}
                                <div class="sub-settings" id="gradient-nicks-sub-settings">
                                    <div><label for="s_gradientNickColor1">Цвет 1:</label><input type="color" id="s_gradientNickColor1" name="gradientNickColor1" data-setting-key="gradientNickColor1"></div>
                                    <div style="margin-top: 8px;"><label for="s_gradientNickColor2">Цвет 2:</label><input type="color" id="s_gradientNickColor2" name="gradientNickColor2" data-setting-key="gradientNickColor2"></div>
                                    <div style="margin-top: 8px;"><label for="s_gradientNickColor3">Цвет 3:</label><input type="color" id="s_gradientNickColor3" name="gradientNickColor3" data-setting-key="gradientNickColor3"></div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('gradientNickSpeed', 'gradientNickSpeed', 'Скорость', 1, 10, 0.5, 's')}
                                    </div>
                                </div>
                            </div>
                            <h4>-- <i class="fas fa-rocket"></i> Плавность Интерфейса (UI) --</h4>
                            <div class="setting-group">
                                <input type="checkbox" id="s_enableUiAnimations" name="enableUiAnimations" data-setting-key="enableUiAnimations">
                                <label for="s_enableUiAnimations" class="inline-label"><i class="fas fa-hand-pointer fa-fw" style="color: #3498db;"></i> Анимации UI</label>${createTooltip('Плавные анимации при наведении и клике на кнопки, темы, аватары и т.д.')}
                                <div class="sub-settings" id="ui-animations-sub-settings">
                                    ${createSlider('uiAnimationSpeed', 'uiAnimationSpeed', 'Скорость', 0.1, 1, 0.05, 's')}
                                </div>
                            </div>
                            <div class="setting-group">
                                <input type="checkbox" id="s_enableLikeAnimations" name="enableLikeAnimations" data-setting-key="enableLikeAnimations">
                                <label for="s_enableLikeAnimations" class="inline-label"><i class="fas fa-heart fa-fw" style="color: #e74c3c;"></i> Анимация "Лайка"</label>${createTooltip('При нажатии на "Нравится" из кнопки будет вылетать сердечко (❤️).')}
                            </div>
                            <div class="setting-group">
                                <input type="checkbox" id="s_enableScrollFadeIn" name="enableScrollFadeIn" data-setting-key="enableScrollFadeIn">
                                <label for="s_enableScrollFadeIn" class="inline-label"><i class="fas fa-sort-amount-down fa-fw" style="color: #9b59b6;"></i> Микро-анимация при Прокрутке</label>${createTooltip('Плавное появление тем и сообщений по мере прокрутки страницы.')}
                                <div class="sub-settings" id="scroll-fade-in-sub-settings">
                                    <label for="s_scrollFadeInType">Тип анимации:</label>
                                    <select id="s_scrollFadeInType" name="scrollFadeInType" data-setting-key="scrollFadeInType">
                                        <option value="fade-in">Появление (Fade In)</option>
                                        <option value="fade-in-up">Появление снизу (Fade In Up)</option>
                                        <option value="slide-in-left">Выезд слева (Slide In Left)</option>
                                    </select>
                                </div>
                            </div>
                            <div class="setting-group">
                                <input type="checkbox" id="s_enableParallaxScroll" name="enableParallaxScroll" data-setting-key="enableParallaxScroll">
                                <label for="s_enableParallaxScroll" class="inline-label"><i class="fas fa-layer-group fa-fw" style="color: #1abc9c;"></i> Parallax-эффект Фона</label>${createTooltip('Фон (градиент или картинка) будет прокручиваться медленнее, чем контент, создавая эффект глубины.')}
                                <div class="sub-settings" id="parallax-scroll-sub-settings">
                                </div>
                            </div>
                            <h4>-- <i class="fas fa-film"></i> Анимации Переходов (Страниц) --</h4>
                            <div class="setting-group">
                                <input type="checkbox" id="s_enablePageTransition" name="enablePageTransition" data-setting-key="enablePageTransition">
                                <label for="s_enablePageTransition" class="inline-label"><i class="fas fa-clone fa-fw" style="color: #7f8c8d;"></i> Включить анимацию</label>${createTooltip('Плавная анимация при переходе между страницами (например, "Fade In").')}
                                <div class="sub-settings" id="page-transition-sub-settings">
                                    <div>
                                        <label for="s_pageTransitionType">Тип анимации:</label>
                                        <select id="s_pageTransitionType" name="pageTransitionType" data-setting-key="pageTransitionType">
                                            <option value="fade-in">Появление (Fade In)</option>
                                            <option value="slide-in-left">Сдвиг слева (Slide In Left)</option>
                                            <option value="slide-in-right">Сдвиг справа (Slide In Right)</option>
                                            <option value="zoom-in">Приближение (Zoom In)</option>
                                        </select>
                                    </div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('pageTransitionDuration', 'pageTransitionDuration', 'Длительность', 0.1, 2, 0.1, 's')}
                                    </div>
                                </div>
                            </div>
                        </div>

                                                <div class="panel-tab-content" id="tab-interface">
                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableComplaintTracker" name="enableComplaintTracker" data-setting-key="enableComplaintTracker"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableComplaintTracker" class="inline-label"><i class="fas fa-stopwatch fa-fw" style="color: #e74c3c;"></i> Отслеживание сроков жалоб</label>${createTooltip('Добавляет цветной таймер к темам. Зеленый (свежее) -> Желтое -> Красное (просрочено). Скрывает закрытые темы.')}
                                <div class="sub-settings" id="complaint-tracker-sub-settings">
                                    <div>
                                        <label for="s_complaintTrackerSections">Отслеживать разделы (URL):</label>
                                        <input type="text" id="s_complaintTrackerSections" name="complaintTrackerSections" data-setting-key="complaintTrackerSections" placeholder="жалобы, обжалование...">
                                    </div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('complaintTrackerWarnTime', 'complaintTrackerWarnTime', 'Внимание (Желтый)', 1, 48, 1, 'ч')}
                                    </div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('complaintTrackerCritTime', 'complaintTrackerCritTime', 'Критично (Красный)', 1, 72, 1, 'ч')}
                                    </div>
                                </div>
                            </div>

                            <h4>-- <i class="fas fa-compass"></i> Навигация --</h4>
                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableDynamicWelcome" name="enableDynamicWelcome" data-setting-key="enableDynamicWelcome"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableDynamicWelcome" class="inline-label"><i class="fas fa-hand-sparkles fa-fw" style="color: #FFEB3B;"></i> Динамическое приветствие</label>${createTooltip('При первой загрузке форума за день будет показывать приветствие (Доброе утро/день/вечер) в углу экрана.')}
                            </div>
                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableSmartNav" name="enableSmartNav" data-setting-key="enableSmartNav"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableSmartNav" class="inline-label"><i class="fas fa-bars fa-fw" style="color: #3498db;"></i> Умная навигация</label>${createTooltip('Верхняя панель навигации (шапка) будет автоматически скрываться, когда вы скроллите вниз, и появляться, когда скроллите вверх.')}
                            </div>
                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableScrollIndicator" name="enableScrollIndicator" data-setting-key="enableScrollIndicator"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableScrollIndicator" class="inline-label"><i class="fas fa-grip-lines fa-fw" style="color: #00F0FF;"></i> Индикатор прокрутки</label>${createTooltip('В самом верху экрана появится тонкая цветная полоса, показывающая, как далеко вы прокрутили страницу.')}
                                <div class="sub-settings" id="scroll-indicator-sub-settings">
                                    <div><label for="s_scrollIndicatorColor">Цвет:</label><input type="color" id="s_scrollIndicatorColor" name="scrollIndicatorColor" data-setting-key="scrollIndicatorColor"></div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('scrollIndicatorHeight', 'scrollIndicatorHeight', 'Высота', 1, 10, 0.5, 'px')}
                                    </div>
                                </div>
                            </div>
                            <h4>-- <i class="fas fa-user-check"></i> Мои Сообщения --</h4>
                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableOwnMessageHighlight" name="enableOwnMessageHighlight" data-setting-key="enableOwnMessageHighlight"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableOwnMessageHighlight" class="inline-label"><i class="fas fa-user fa-fw" style="color: #2ecc71;"></i> Выделять мои сообщения</label>${createTooltip('Все ваши посты на форуме будут выделены выбранным цветом, чтобы их было легче найти.')}
                                <small id="my-username-status" class="panel-status-text">Ваш ник: (не найден)</small>
                                <div class="sub-settings" id="own-message-highlight-sub-settings">
                                    <div><label for="s_ownMessageHighlightBgColor">Цвет фона:</label> <input type="color" id="s_ownMessageHighlightBgColor" name="ownMessageHighlightBgColor" data-setting-key="ownMessageHighlightBgColor"></div>
                                    <div style="margin-top: 8px;"><label for="s_ownMessageHighlightEdgeColor">Цвет окантовки:</label> <input type="color" id="s_ownMessageHighlightEdgeColor" name="ownMessageHighlightEdgeColor" data-setting-key="ownMessageHighlightEdgeColor"></div>
                                    <div style="margin-top: 8px;">
                                        ${createSlider('ownMessageHighlightEdgeWidth', 'ownMessageHighlightEdgeWidth', 'Толщина окантовки', 0, 10, 0.5, 'px')}
                                    </div>
                                </div>
                            </div>
                            <h4>-- <i class="fas fa-ellipsis-h"></i> Нижняя Панель Навигации --</h4>
                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableBottomNav" name="enableBottomNav" data-setting-key="enableBottomNav"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableBottomNav" class="inline-label"><i class="fas fa-check-circle fa-fw" style="color: #2ecc71;"></i> Включить панель</label>${createTooltip('Добавляет внизу экрана удобную панель с быстрыми ссылками и часами.')}
                            </div>
                            <div class="setting-group">
                                <label for="s_bottomNavPosition">Позиция:</label>
                                <select id="s_bottomNavPosition" name="bottomNavPosition" data-setting-key="bottomNavPosition">
                                    <option value="bottom-center">Внизу по центру</option> <option value="bottom-left">Внизу слева</option> <option value="bottom-right">Внизу справа</option>
                                    <option value="top-center">Вверху по центру</option> <option value="top-left">Вверху слева</option> <option value="top-right">Вверху справа</option>
                                    <option value="middle-left">Посередине слева</option> <option value="middle-right">Посередине справа</option>
                                </select>
                            </div>
                            <div class="setting-group">
                                ${createSlider('bottomNavOpacity', 'bottomNavOpacity', 'Прозрачность', 0, 1, 0.05)}
                            </div>
                            <div class="setting-group">
                            <div class="setting-group br-input-group">
                                <input type="text" id="s_bottomNavBorderRadius" name="bottomNavBorderRadius" data-setting-key="bottomNavBorderRadius" placeholder=" ">
                                <label for="s_bottomNavBorderRadius">Скругление (10px, 25px...)</label>
                            </div>
                            </div>
                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableBottomNavClock" name="enableBottomNavClock" data-setting-key="enableBottomNavClock"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableBottomNavClock" class="inline-label"><i class="fas fa-clock fa-fw" style="color: #fff;"></i> Показывать часы</label>
                                <div class="sub-settings" id="clock-sub-settings" style="margin-top: 5px;">
                                    <label for="s_bottomNavClockColor">Цвет часов:</label>
                                    <input type="color" id="s_bottomNavClockColor" name="bottomNavClockColor" data-setting-key="bottomNavClockColor">
                                </div>
                            </div>
                            <div class="setting-group dynamic-links-group">
                                <label><i class="fas fa-link fa-fw" style="color: #3498db;"></i> Быстрые ссылки:</label>${createTooltip('Ссылки, которые будут отображаться в нижней панели навигации.')}
                                <div id="quick-links-container"></div>
                                <button id="add-quick-link-btn" class="panel-btn panel-btn-add" style="margin-top: 10px; width: 100%;"><i class="fas fa-plus"></i> Добавить ссылку</button>
                            </div>
                        </div>


                                                <div class="panel-tab-content" id="tab-live">
                            <h4>-- <i class="fas fa-broadcast-tower"></i> Обновления в Реальном Времени --</h4>
                            <div class="setting-group">
                                <label for="s_liveUpdateInterval"><i class="fas fa-history fa-fw" style="color: #ccc;"></i> Интервал обновлений (в сек.):</label>${createTooltip('Как часто скрипт будет проверять форум на наличие обновлений. Не ставьте слишком низкое значение (меньше 30), чтобы не создавать нагрузку!')}
                                <input type="number" id="s_liveUpdateInterval" name="liveUpdateInterval" data-setting-key="liveUpdateInterval" min="30" max="600" step="10">
                            </div>
                            <div class="setting-group">
                                <label for="s_enableLiveCounters" class="inline-label"><i class="fas fa-bell fa-fw" style="color: #f1c40f;"></i> "Живые" счетчики (Уведомления/ЛС)</label>${createTooltip('Счетчики новых уведомлений и личных сообщений в шапке будут обновляться сами, без перезагрузки страницы.')}
                            </div>
                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableHotTopicPulse" name="enableHotTopicPulse" data-setting-key="enableHotTopicPulse"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableHotTopicPulse" class="inline-label"><i class="fas fa-fire fa-fw" style="color: #e74c3c;"></i> Пульсация "горячих" тем</label>${createTooltip('Если вы находитесь в списке тем, и в какой-то из них появится новый ответ, она на секунду подсветится.')}
                            </div>
                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableLiveFeed" name="enableLiveFeed" data-setting-key="enableLiveFeed"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableLiveFeed" class="inline-label"><i class="fas fa-stream fa-fw" style="color: #3498db;"></i> Лента "Что нового" в нижней панели</label>${createTooltip('В левой части нижней панели будет показывать 2-3 последних сообщения, появившихся на форуме.')}
                            </div>
                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableAdminOnlineToast" name="enableAdminOnlineToast" data-setting-key="enableAdminOnlineToast"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableAdminOnlineToast" class="inline-label"><i class="fas fa-user-shield fa-fw" style="color: #e74c3c;"></i> Уведомление о входе администрации</label>${createTooltip('Скрипт будет проверять список "Сейчас онлайн" и присылать вам уведомление, если в сети появится кто-то из этого списка.')}
                                <div class="sub-settings" id="admin-toast-sub-settings">
                                    <label for="s_adminToastNicks">Никнеймы (каждый с новой строки):</label>
                                    <textarea id="s_adminToastNicks" name="adminToastNicks" data-setting-key="adminToastNicks" rows="4" placeholder="Maras_Rofls"></textarea>
                                </div>
                            </div>
                        </div>


                                                <div class="panel-tab-content" id="tab-presets">
                            <div class="setting-group">
                                <label for="s_panelTheme"><i class="fas fa-paint-roller fa-fw" style="color: #9b59b6;"></i> Тема Панели Настроек</label>
                                <select id="s_panelTheme" name="panelTheme" data-setting-key="panelTheme">
                                    <option value="classic_dark">Вечная Классика (По умолч.)</option>
                                    <option value="graphite_blurple">Современный Графит</option>
                                    <option value="pragmatic_grey">Прагматичный Серый</option>
                                    <option value="clean_monochrome">Чистый Монохром</option>
                                    <option value="warm_sepia">Теплая Сепия</option>
                                    <option value="emerald_forest">Изумрудный Лес</option>
                                    <option value="sunset_rose">Розовый Закат</option>
                                </select>
                            </div>

                            <h4>-- <i class="fas fa-gift"></i> Встроенные Пресеты --</h4>
                            <div class="setting-group preset-manager">
                                <label for="s_builtInPresetSelect" style="font-weight: bold; color: #fff;">Выберите тему:</label>${createTooltip('Готовые темы, меняющие почти все настройки скрипта в 1 клик. Выберите и нажмите "Загрузить".')}
                                <select id="s_builtInPresetSelect" name="builtInPresetSelect" style="margin-bottom: 8px; margin-top: 4px;">
                                    <option value="">-- Выберите тему --</option>
                                    <option value="new_year">Новый Год (🎄)</option>
                                    <option value="halloween">Хэллоуин (🎃)</option>
                                    <option value="valentines">День Св. Валентина (💖)</option>
                                    <option value="womens_day">8 Марта (🌷)</option>
                                    <option value="victory_day">День Победы (🎖️)</option>
                                    <option value="ramadan">Рамадан (🌙)</option>
                                    <option value="cyberpunk">Киберпанк (🌃)</option>
                                    <option value="default_dark">Стандартный Темный (🌑)</option>
                                </select>
                                <button id="load-builtin-preset-btn" class="panel-btn" style="width: 100%; background-color: #17a2b8; color: white; font-size: 13px;"><i class="fas fa-download"></i> Загрузить тему</button>
                            </div>
                            <h4>-- <i class="fas fa-brain"></i> Контекстные Пресеты --</h4>
                            <div class="setting-group">
                                <label class="br-toggle-switch"><input type="checkbox" id="s_enableContextualBackgrounds" name="enableContextualBackgrounds" data-setting-key="enableContextualBackgrounds"><span class="br-toggle-slider"></span></label>
                                <label for="s_enableContextualBackgrounds" class="inline-label"><i class="fas fa-random fa-fw" style="color: #3498db;"></i> Сменить пресет в разделе...</label>${createTooltip('Автоматически применяет выбранный пресет, когда вы заходите в определенный раздел. Полезно, чтобы сделать раздел "Жалобы" более строгим, а "Оффтоп" - веселым.')}
                                <div class="sub-settings" id="contextual-bg-sub-settings">
                                    <div class="br-input-group">
                                        <input type="text" id="s_contextualBgUrl" name="contextualBgUrl" data-setting-key="contextualBgUrl" placeholder=" ">
                                        <label for="s_contextualBgUrl">...если URL содержит (zhaloby)</label>
                                    </div>
                                    <label for="s_contextualBgPreset" style="margin-top: 8px;">...на этот пресет:</label>
                                    <select id="s_contextualBgPreset" name="contextualBgPreset" data-setting-key="contextualBgPreset"></select>
                                </div>
                            </div>

                            <h4>-- <i class="fas fa-save"></i> Мои Пресеты --</h4>
                            <div class="setting-group preset-manager">
                                <label for="s_customPresetSelect" style="font-weight: bold; color: #fff;">Управление пресетами</label>${createTooltip('Здесь хранятся ваши личные пресеты. Настройте форум как вам нравится, введите название в поле ниже и нажмите "Сохранить пресет".')}
                                <select id="s_customPresetSelect" name="customPresetSelect" style="margin-bottom: 8px; margin-top: 4px;"></select>
                                <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                                    <button id="load-preset-btn" class="panel-btn" style="flex: 1; background-color: #2196F3; color: white; font-size: 12px; padding: 5px;"><i class="fas fa-check"></i> Загрузить</button>
                                    <button id="delete-preset-btn" class="panel-btn panel-btn-danger" style="flex: 1; font-size: 12px; padding: 5px;"><i class="fas fa-trash-alt"></i> Удалить</button>
                                </div>
                                <div class="br-input-group" style="margin-bottom: 8px;">
                                    <input type="text" id="s_newPresetName" data-setting-key="newPresetName_IGNORE" placeholder=" " style="margin: 0;">
                                    <label for="s_newPresetName">Название нового пресета</label>
                                </div>
                                <button id="save-preset-btn" class="panel-btn panel-btn-save" style="width: 100%; font-size: 13px;"><i class="fas fa-save"></i> Сохранить пресет</button>
                            </div>
                        </div>


                                                <div class="panel-tab-content" id="tab-integrations">
                            <h4>-- <i class="fas fa-cloud-upload-alt"></i> Интеграция Скриншотов (ImgBB) --</h4>
                            <div class="setting-group">
                                <label for="s_imgbbApiKey"><i class="fas fa-key fa-fw" style="color: #f1c40f;"></i> Ваш API ключ (v1) от ImgBB:</label>
                                ${createTooltip('Скрипт будет использовать этот ключ для быстрой загрузки ваших скриншотов. Это бесплатно.')}
                                <input type="text" id="s_imgbbApiKey" name="imgbbApiKey" data-setting-key="imgbbApiKey" placeholder="Вставьте свой API ключ...">
                                <a href="https://api.imgbb.com/" target="_blank" style="font-size: 11px; color: #00F0FF; display: block; margin-top: 8px;">
                                    <i class="fas fa-external-link-alt"></i> Получить API ключ (1 минута, бесплатно)
                                </a>
                            </div>

                            <div class="setting-group">
                                <label><i class="fas fa-history fa-fw" style="color: #ccc;"></i> История загрузок (ImgBB):</label>
                                ${createTooltip('Последние 20 загруженных вами изображений. Нажмите на код, чтобы скопировать.')}
                                <div id="br-upload-history-container" style="max-height: 200px; overflow-y: auto; background: #0D1D25; padding: 8px; border-radius: 6px; margin-top: 10px;">
                                    <p style="font-size: 12px; color: #888; text-align: center;">История загрузок пуста.</p>
                                </div>
                                <button id="clear-upload-history-btn" class="panel-btn panel-btn-danger" style="margin-top: 10px; width: 100%; font-size: 12px; padding: 5px;"><i class="fas fa-eraser"></i> Очистить историю</button>
                            </div>
                        </div>


                                                <div class="panel-tab-content" id="tab-help">
                            <h4>-- <i class="fas fa-question-circle"></i> Как пользоваться скриптом --</h4>
                            <div class="setting-group br-help-section">
                                <label>Общая информация</label>
                                <p>
                                    Добро пожаловать в "Центр Настроек"! Этот скрипт создан, чтобы полностью изменить ваш опыт использования форума.
                                </p>
                                <p>
                                    Навигация простая: на главном экране выберите раздел (например, "Визуал" или "Анимации"), чтобы увидеть все доступные для него настройки.
                                </p>
                                <p>
                                    После внесения изменений на любой странице, не забудьте нажать кнопку <strong>"<i class="fas fa-save"></i> Сохранить"</strong> внизу панели.
                                </p>
                            </div>

                            <div class="setting-group br-help-section">
                                <label>Основные разделы</label>
                                <ul>
                                    <li><strong>Главное:</strong> Управление фоном (градиент/картинка), прозрачностью и скруглением блоков.</li>
                                    <li><strong>Визуал:</strong> Настройка шрифтов, свечения текста, выделения постов автора и визуальных эффектов (снег, дождь и т.д.).</li>
                                    <li><strong>Анимации:</strong> Все, что движется. Анимации аватарок, никнеймов, плавность интерфейса (UI) и эффекты прокрутки.</li>
                                    <li><strong>Интерфейс:</strong> Настройка "умной" навигации, индикатора прокрутки и нижней быстрой панели.</li>
                                    <li><strong>Живой Форум:</strong> Авто-обновление счетчиков, уведомления об онлайне администрации и "горячие" темы.</li>
                                    <li><strong>Пресеты:</strong> Сохраняйте и загружайте свои собственные конфигурации дизайна или используйте встроенные (например, "Киберпанк").</li>
                                    <li><strong>Интеграция:</strong> Настройки для сторонних сервисов, например, быстрый загрузчик скриншотов ImgBB.</li>
                                </ul>
                            </div>

                            <div class="setting-group br-help-section">
                                <label>Импорт и Экспорт</label>
                                <p>
                                    Вы можете поделиться своим дизайном с другом!
                                    <br>
                                    • <strong>Кнопка <i class="fas fa-file-export"></i> (Экспорт):</strong> Сохраняет все ваши текущие настройки в .json файл на ваш компьютер.
                                    <br>
                                    • <strong>Кнопка <i class="fas fa-file-import"></i> (Импорт):</strong> Загружает настройки из .json файла, который вы выбрали.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="button-group">
                    <button id="export-btn" class="panel-btn panel-btn-export" title="Экспорт"><i class="fas fa-file-export"></i></button>
                    <button id="import-btn" class="panel-btn panel-btn-import" title="Импорт"><i class="fas fa-file-import"></i></button>
                    <input type="file" id="import-settings-file" accept=".json" style="display: none;">
                    <span style="flex-grow: 1;"></span>
                    <button id="reset-btn" class="panel-btn panel-btn-reset" title="Сбросить всё"><i class="fas fa-undo-alt"></i></button>
                    <button id="save-btn" class="panel-btn panel-btn-save"><i class="fas fa-save"></i> Сохранить</button>
                </div>
            `;


            document.body.appendChild(panelWrapper);

            const hubCards = panelDiv.querySelectorAll('.br-hub-card');
            const settingsView = panelDiv.querySelector('.br-settings-view');
            const settingsTitle = panelDiv.querySelector('.br-settings-title');
            const allSettingsPages = panelDiv.querySelectorAll('.panel-tab-content');
            const backBtn = panelDiv.querySelector('.br-settings-back-btn');

            const navigateToPage = (pageId, cardTitle) => {
                allSettingsPages.forEach(p => p.style.display = 'none');

                const pageToShow = panelDiv.querySelector(`#${pageId}`);
                if (pageToShow) {
                    pageToShow.style.display = 'block';
                }

                settingsTitle.textContent = cardTitle;
                panelDiv.dataset.view = 'page';
            };

            const navigateToHub = () => {
                panelDiv.dataset.view = 'hub';
            };

            hubCards.forEach(card => {
                card.addEventListener('click', () => {
                    const pageId = card.dataset.page;
                    const cardTitle = card.querySelector('span').textContent;
                    navigateToPage(pageId, cardTitle);
                });
            });

            backBtn.addEventListener('click', navigateToHub);


                        const saveBtn = panelDiv.querySelector('#save-btn');
            const bgFileInput = panelDiv.querySelector('#s_bgImageFile');
            const clearBgBtn = panelDiv.querySelector('#clear-bg-btn');
            const bgStatus = panelDiv.querySelector('#bg-status');
            const exportBtn = panelDiv.querySelector('#export-btn');
            const importBtn = panelDiv.querySelector('#import-btn');
            const importFileInput = panelDiv.querySelector('#import-settings-file');
            const panelThemeSelect = panelDiv.querySelector('#s_panelTheme');
            const addQuickLinkBtn = panelDiv.querySelector('#add-quick-link-btn');
            const quickLinksContainer = panelDiv.querySelector('#quick-links-container');
            const resetBtn = panelDiv.querySelector('#reset-btn');
            const loadPresetBtn = panelDiv.querySelector('#load-preset-btn');
            const loadBuiltInPresetBtn = panelDiv.querySelector('#load-builtin-preset-btn');
            const savePresetBtn = panelDiv.querySelector('#save-preset-btn');
            const deletePresetBtn = panelDiv.querySelector('#delete-preset-btn');
            const clearHistoryBtn = panelDiv.querySelector('#clear-upload-history-btn');

            const enableGradientCheckbox = panelDiv.querySelector('#s_enableGradient');
            const gradientSubSettings = panelDiv.querySelector('#gradient-sub-settings');
            const enableAnimatedGradientCheckbox = panelDiv.querySelector('#s_enableAnimatedGradient');
            const animatedGradientSubSettings = panelDiv.querySelector('#animated-gradient-sub-settings');
            const bgImageSettingGroup = panelDiv.querySelector('#bg-image-setting-group');
            const enableRoundingCheckbox = panelDiv.querySelector('#s_enableRounding');
            const roundingSubSettings = panelDiv.querySelector('#rounding-sub-settings');
            const enableEdgeCheckbox = panelDiv.querySelector('#s_enableEdge');
            const edgeSubSettings = panelDiv.querySelector('#edge-sub-settings');
            const enableTextGlowCheckbox = panelDiv.querySelector('#s_enableTextGlow');
            const textGlowSubSettings = panelDiv.querySelector('#text-glow-sub-settings');
            const effectTypeSelect = panelDiv.querySelector('#s_effectType');
            const effectDetailsSettings = panelDiv.querySelector('#effect-details-settings');
            const effectRainSettings = panelDiv.querySelector('.rain-settings');
            const effectSwaySettings = panelDiv.querySelector('.sway-settings');
            const effectMatrixSettings = panelDiv.querySelector('.matrix-settings');
            const enableBottomNavClockCheckbox = panelDiv.querySelector('#s_enableBottomNavClock');
            const clockSubSettings = panelDiv.querySelector('#clock-sub-settings');
            const enableBlockBlurCheckbox = panelDiv.querySelector('#s_enableBlockBlur');
            const blockBlurSubSettings = panelDiv.querySelector('#block-blur-sub-settings');
            const enableOwnMessageHighlightCheckbox = panelDiv.querySelector('#s_enableOwnMessageHighlight');
            const ownMessageHighlightSubSettings = panelDiv.querySelector('#own-message-highlight-sub-settings');
            const enablePageTransitionCheckbox = panelDiv.querySelector('#s_enablePageTransition');
            const pageTransitionSubSettings = panelDiv.querySelector('#page-transition-sub-settings');
            const enableAdminOnlineToastCheckbox = panelDiv.querySelector('#s_enableAdminOnlineToast');
            const adminToastSubSettings = panelDiv.querySelector('#admin-toast-sub-settings');
            const enableContextualBackgroundsCheckbox = panelDiv.querySelector('#s_enableContextualBackgrounds');
            const contextualBgSubSettings = panelDiv.querySelector('#contextual-bg-sub-settings');


            const enableAvatarBorderCheckbox = panelDiv.querySelector('#s_enableAvatarBorder');
            const avatarBorderSubSettings = panelDiv.querySelector('#avatar-border-sub-settings');
            const avatarBorderStyleSelect = panelDiv.querySelector('#s_avatarBorderStyle');
            const avatarGradientSettings = panelDiv.querySelector('#avatar-gradient-settings');
            const avatarPulsateSettings = panelDiv.querySelector('#avatar-pulsate-settings');
            const enable3DAvatarHoverCheckbox = panelDiv.querySelector('#s_enable3DAvatarHover');

            const enablePulsatingNicksCheckbox = panelDiv.querySelector('#s_enablePulsatingNicks');
            const pulsatingNicksSubSettings = panelDiv.querySelector('#pulsating-nicks-sub-settings');
            const enableGradientNicksCheckbox = panelDiv.querySelector('#s_enableGradientNicks');
            const gradientNicksSubSettings = panelDiv.querySelector('#gradient-nicks-sub-settings');

            const enableUiAnimationsCheckbox = panelDiv.querySelector('#s_enableUiAnimations');
            const uiAnimationsSubSettings = panelDiv.querySelector('#ui-animations-sub-settings');

            const enableScrollFadeInCheckbox = panelDiv.querySelector('#s_enableScrollFadeIn');
            const scrollFadeInSubSettings = panelDiv.querySelector('#scroll-fade-in-sub-settings');

            const enableParallaxScrollCheckbox = panelDiv.querySelector('#s_enableParallaxScroll');
            const parallaxScrollSubSettings = panelDiv.querySelector('#parallax-scroll-sub-settings');

            const enableSmartNavCheckbox = panelDiv.querySelector('#s_enableSmartNav');

const enableComplaintTrackerCheckbox = panelDiv.querySelector('#s_enableComplaintTracker');
            const complaintTrackerSubSettings = panelDiv.querySelector('#complaint-tracker-sub-settings');

            const enableScrollIndicatorCheckbox = panelDiv.querySelector('#s_enableScrollIndicator');
            const scrollIndicatorSubSettings = panelDiv.querySelector('#scroll-indicator-sub-settings');

            const toggleAvatarSubSettings = () => {
                const style = avatarBorderStyleSelect.value;
                avatarGradientSettings.style.display = (style === 'gradient') ? 'block' : 'none';
                avatarPulsateSettings.style.display = (style === 'pulsate') ? 'block' : 'none';
            };

            const toggleNickSubSettings = () => {
                pulsatingNicksSubSettings.style.display = (enablePulsatingNicksCheckbox.checked && !enableGradientNicksCheckbox.checked) ? 'block' : 'none';
                gradientNicksSubSettings.style.display = (enableGradientNicksCheckbox.checked) ? 'block' : 'none';
                if (enableGradientNicksCheckbox.checked) {
                    pulsatingNicksSubSettings.style.display = 'none';
                }
            };

            const toggleEffectSubSettings = () => {
                const effectType = effectTypeSelect.value; const showDetails = effectType !== 'none'; effectDetailsSettings.style.display = showDetails ? 'block' : 'none'; if (showDetails) { effectRainSettings.style.display = (effectType === 'rain') ? 'block' : 'none'; effectMatrixSettings.style.display = (effectType === 'matrix') ? 'block' : 'none'; effectSwaySettings.style.display = (effectType.startsWith('snow') || effectType.startsWith('petals') || effectType.startsWith('leaves') || effectType === 'fireflies' || effectType === 'bubbles') ? 'block' : 'none'; } else { effectRainSettings.style.display = 'none'; effectSwaySettings.style.display = 'none'; effectMatrixSettings.style.display = 'none'; }
            };

            const toggleGenericSubSettings = (checkbox, subSettingsDiv) => {
                if (checkbox && subSettingsDiv) subSettingsDiv.style.display = checkbox.checked ? 'block' : 'none';
            };

            const initializeSubSettingsVisibility = () => {

                toggleGenericSubSettings(enableComplaintTrackerCheckbox, complaintTrackerSubSettings);

                toggleGenericSubSettings(enableGradientCheckbox, gradientSubSettings);
                toggleGenericSubSettings(enableAnimatedGradientCheckbox, animatedGradientSubSettings);
                toggleGenericSubSettings(enableRoundingCheckbox, roundingSubSettings);
                toggleGenericSubSettings(enableEdgeCheckbox, edgeSubSettings);
                toggleGenericSubSettings(enableTextGlowCheckbox, textGlowSubSettings);
                toggleEffectSubSettings();
                toggleGenericSubSettings(enableBottomNavClockCheckbox, clockSubSettings);
                toggleGenericSubSettings(enableBlockBlurCheckbox, blockBlurSubSettings);
                toggleGenericSubSettings(enableOwnMessageHighlightCheckbox, ownMessageHighlightSubSettings);
                toggleGenericSubSettings(enablePageTransitionCheckbox, pageTransitionSubSettings);
                toggleGenericSubSettings(enableAdminOnlineToastCheckbox, adminToastSubSettings);
                toggleGenericSubSettings(enableContextualBackgroundsCheckbox, contextualBgSubSettings);

                toggleGenericSubSettings(enableAvatarBorderCheckbox, avatarBorderSubSettings);
                toggleAvatarSubSettings();

                toggleGenericSubSettings(enablePulsatingNicksCheckbox, pulsatingNicksSubSettings);
                toggleGenericSubSettings(enableGradientNicksCheckbox, gradientNicksSubSettings);
                toggleNickSubSettings();

                toggleGenericSubSettings(enableUiAnimationsCheckbox, uiAnimationsSubSettings);
                toggleGenericSubSettings(enableScrollFadeInCheckbox, scrollFadeInSubSettings);
                toggleGenericSubSettings(enableParallaxScrollCheckbox, parallaxScrollSubSettings);
                toggleGenericSubSettings(enableScrollIndicatorCheckbox, scrollIndicatorSubSettings);

                if (bgImageSettingGroup) {
                    bgImageSettingGroup.style.display = enableGradientCheckbox.checked ? 'none' : 'block';
                }
                 if (animatedGradientSubSettings) {
                    animatedGradientSubSettings.style.display = (enableGradientCheckbox.checked && enableAnimatedGradientCheckbox.checked) ? 'block' : 'none';
                }
                 panelDiv.querySelectorAll('input[type="range"]').forEach(updateSliderValue);
            };

             if (effectTypeSelect) {
                 effectTypeSelect.brInitializeVisibility = initializeSubSettingsVisibility;
             }
             if (enableAvatarBorderCheckbox) {
                 enableAvatarBorderCheckbox.brInitializeVisibility = initializeSubSettingsVisibility;
             }

            enableGradientCheckbox.addEventListener('change', () => {
                toggleGenericSubSettings(enableGradientCheckbox, gradientSubSettings);
                if (bgImageSettingGroup) bgImageSettingGroup.style.display = enableGradientCheckbox.checked ? 'none' : 'block';
                if (animatedGradientSubSettings) animatedGradientSubSettings.style.display = (enableGradientCheckbox.checked && enableAnimatedGradientCheckbox.checked) ? 'block' : 'none';
            });
            enableAnimatedGradientCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableAnimatedGradientCheckbox, animatedGradientSubSettings));

            enableComplaintTrackerCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableComplaintTrackerCheckbox, complaintTrackerSubSettings));


enableRoundingCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableRoundingCheckbox, roundingSubSettings));
            enableEdgeCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableEdgeCheckbox, edgeSubSettings));
            enableTextGlowCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableTextGlowCheckbox, textGlowSubSettings));
            effectTypeSelect.addEventListener('change', toggleEffectSubSettings);
            enableBottomNavClockCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableBottomNavClockCheckbox, clockSubSettings));
            enableBlockBlurCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableBlockBlurCheckbox, blockBlurSubSettings));
            enableOwnMessageHighlightCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableOwnMessageHighlightCheckbox, ownMessageHighlightSubSettings));
            enablePageTransitionCheckbox.addEventListener('change', () => toggleGenericSubSettings(enablePageTransitionCheckbox, pageTransitionSubSettings));
            enableAdminOnlineToastCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableAdminOnlineToastCheckbox, adminToastSubSettings));
            enableContextualBackgroundsCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableContextualBackgroundsCheckbox, contextualBgSubSettings));

            enableAvatarBorderCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableAvatarBorderCheckbox, avatarBorderSubSettings));
            avatarBorderStyleSelect.addEventListener('change', toggleAvatarSubSettings);

            enablePulsatingNicksCheckbox.addEventListener('change', toggleNickSubSettings);
            enableGradientNicksCheckbox.addEventListener('change', toggleNickSubSettings);

            enableUiAnimationsCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableUiAnimationsCheckbox, uiAnimationsSubSettings));
            enableScrollFadeInCheckbox.addEventListener('change', (e) => {
                toggleGenericSubSettings(enableScrollFadeInCheckbox, scrollFadeInSubSettings);
                setupScrollObserver(currentSettings);
            });
            enableParallaxScrollCheckbox.addEventListener('change', (e) => {
                toggleGenericSubSettings(enableParallaxScrollCheckbox, parallaxScrollSubSettings);
                applyForumStyles(currentSettings);
            });
            enableScrollIndicatorCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableScrollIndicatorCheckbox, scrollIndicatorSubSettings));

            panelDiv.querySelectorAll('input[type="range"]').forEach(slider => {
                slider.addEventListener('input', () => updateSliderValue(slider));
            });
addQuickLinkBtn.addEventListener('click', (e) => { createRipple(e); addQuickLinkInput(quickLinksContainer); });            resetBtn.addEventListener('click', handleReset);
            saveBtn.addEventListener('click', handleSave);
            clearBgBtn.addEventListener('click', handleClearBg);
            panelDiv.querySelector('#close-btn').addEventListener('click', closePanel);
            loadPresetBtn.addEventListener('click', handleLoadCustomPreset);
            loadBuiltInPresetBtn.addEventListener('click', handleLoadBuiltInPreset);
            savePresetBtn.addEventListener('click', handleSaveCustomPreset);
            deletePresetBtn.addEventListener('click', handleDeleteCustomPreset);
            clearHistoryBtn.addEventListener('click', async () => {
                if (!confirm('Вы уверены, что хотите очистить всю историю загрузок?🚨')) return;
                await GM_setValue(UPLOAD_HISTORY_KEY, '[]');
                await loadUploadHistory();
                showToast('История загрузок очищена.', 'info');
            });
            exportBtn.addEventListener('click', handleExport);
            importBtn.addEventListener('click', () => importFileInput.click());
            importFileInput.addEventListener('change', handleImport);
            panelThemeSelect.addEventListener('change', () => {
                const wrapper = document.getElementById('br-panel-wrapper');
            panelDiv.querySelectorAll('.panel-btn, .br-hub-card, .br-settings-back-btn').forEach(btn => {
                btn.addEventListener('click', createRipple);
            });


                if (wrapper) {
                    wrapper.dataset.theme = panelThemeSelect.value;
                }
            });

            initializeSubSettingsVisibility();
            settingsPanel = panelDiv;
            return panelDiv;
        } catch (e) {
            console.error('[BR Style] КРИТИЧЕСКАЯ ОШИБКА создания HTML панели настроек ❌', e);
            if (panelDiv && panelDiv.parentNode) {
                 panelDiv.parentNode.removeChild(panelDiv);
            }
            showToast('[BR Style] Критическая ошибка создания панели настроек ❌', 'error');
            return null;
        }
    }
    async function handleReset() {
        if (!confirm('Вы уверены, что хотите сбросить ВСЕ настройки стиля к значениям по умолчанию? Это действие необратимо.')) return;
        if (!settingsPanel) return;
        const resetBtn = settingsPanel.querySelector('#reset-btn');
        if (!resetBtn) return;
        const originalBtnText = resetBtn.textContent; resetBtn.textContent = 'Сброс...⏳'; resetBtn.disabled = true;
        const settingsToReset = { ...defaultSettings };
        settingsToReset.customPresets = currentSettings.customPresets;
        const success = await saveSettings(settingsToReset);
        if (success) {
            openPanel();
            applyForumStyles(currentSettings);
            updateBottomNavBarContent(currentSettings);
            manageVisualEffects(currentSettings);
            handleScroll();
            const bgStatus = settingsPanel.querySelector('#bg-status'); if(bgStatus) bgStatus.textContent = 'Фон не задан.';
            const bgFileInput = settingsPanel.querySelector('#s_bgImageFile'); if(bgFileInput) bgFileInput.value = '';
                        showToast('Настройки сброшены по умолчанию!', 'success');
            resetBtn.innerHTML = '<i class="fas fa-check"></i> Сброшено!';
            resetBtn.style.backgroundColor = '#ffc107';
            setTimeout(() => {
                resetBtn.innerHTML = '<i class="fas fa-undo-alt"></i>';
                resetBtn.style.backgroundColor = '';
                resetBtn.disabled = false;
            }, 1500);
        } else {
            showToast('Ошибка при сбросе настроек!', 'error');
            resetBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Ошибка!';
            resetBtn.style.backgroundColor = '#dc3545';
            setTimeout(() => {
                resetBtn.innerHTML = '<i class="fas fa-undo-alt"></i>';
                resetBtn.style.backgroundColor = '';
                resetBtn.disabled = false;
            }, 2000);

        }
    }

    async function handleSave() {
        if (!settingsPanel) return;
        const saveBtn = settingsPanel.querySelector('#save-btn');
         if (!saveBtn) return;
        const originalBtnText = saveBtn.textContent; saveBtn.textContent = 'Сохранение...⏳'; saveBtn.disabled = true;
        let errorOccurred = false;
        const settingsToUpdate = {};
        const bgFileInput = settingsPanel.querySelector('#s_bgImageFile');
        settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
            const key = input.dataset.settingKey;
            if (defaultSettings.hasOwnProperty(key) && key !== 'quickLinks' && key !== 'customPresets') {
                let value;
                if (input.type === 'checkbox') { value = input.checked; }
                else if (input.type === 'number' || input.type === 'range') { const parsedValue = parseFloat(input.value); value = isNaN(parsedValue) ? defaultSettings[key] : parsedValue; }
                else { value = input.value; }
                settingsToUpdate[key] = value;
            }
        });
        settingsToUpdate.quickLinks = [];
        settingsPanel.querySelectorAll('#quick-links-container .quick-link-input-item').forEach(item => {
             const name = item.querySelector('.quick-link-name').value.trim();
             const url = item.querySelector('.quick-link-url').value.trim();
             if (name && isValidURL(url)) {
                 settingsToUpdate.quickLinks.push({ name, url });
             } else if (name && url) {
                 showToast(`Неверный URL для ссылки "${name}". Ссылка не сохранена.`, 'error');
                 errorOccurred = true;
             }
        });
        settingsToUpdate.customPresets = currentSettings.customPresets;
        if (settingsToUpdate.enableGradient) {
            settingsToUpdate.bgImageDataUri = '';
        }
        else if (bgFileInput && bgFileInput.files.length > 0) {
            try {
                settingsToUpdate.bgImageDataUri = await readFileAsDataURL(bgFileInput.files[0]);
            } catch (error) {
                showToast(`Ошибка чтения файла: ${error.message}`, 'error'); errorOccurred = true;
            }
        }
        else {
            settingsToUpdate.bgImageDataUri = currentSettings.bgImageDataUri || '';
        }

        settingsPanel.dataset.presetLoaded = 'false';
        if (!errorOccurred) {
            const success = await saveSettings(settingsToUpdate);
            if (success) {
                settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
                    const key = input.dataset.settingKey;
                    if (currentSettings.hasOwnProperty(key) && key !== 'quickLinks' && key !== 'customPresets') {
                        if (input.type === 'checkbox') input.checked = currentSettings[key];
                        else if (input.type === 'range') {
                            let numericValue = (typeof currentSettings[key] === 'string') ? parseFloat(currentSettings[key]) : currentSettings[key];
                            if (isNaN(numericValue)) numericValue = defaultSettings[key];
                            input.value = numericValue;
                        }
                        else input.value = currentSettings[key] ?? '';
                    }
                });
                 settingsPanel.querySelectorAll('input[type="range"]').forEach(updateSliderValue);
                applyForumStyles(currentSettings);
                updateBottomNavBarContent(currentSettings);
                manageVisualEffects(currentSettings);
                handleScroll();
                const bgStatus = settingsPanel.querySelector('#bg-status');
                if(bgStatus) {
                    if (currentSettings.enableGradient) { bgStatus.textContent = currentSettings.enableAnimatedGradient ? 'Фон: 🌈 Анимированный градиент' : 'Фон: 🌈 Градиент'; } else { bgStatus.textContent = currentSettings.bgImageDataUri ? `Фон: 🖼️ Изображение задано` : 'Фон не задан.'; }
                }
                if (bgFileInput && bgFileInput.files.length > 0) bgFileInput.value = '';

                const initializeVisibilityFunc = settingsPanel.querySelector('#s_effectType')?.brInitializeVisibility;
                if (initializeVisibilityFunc && typeof initializeVisibilityFunc === 'function') {
                    initializeVisibilityFunc();
                }
                const initializeAnimVisibilityFunc = settingsPanel.querySelector('#s_enableAvatarBorder')?.brInitializeVisibility;
                if (initializeAnimVisibilityFunc && typeof initializeAnimVisibilityFunc === 'function') {
                    initializeAnimVisibilityFunc();
                }

                                showToast('Настройки успешно сохранены!', 'success');
                saveBtn.innerHTML = '<i class="fas fa-save"></i><i class="fas fa-check"></i> Сохранено!';
                saveBtn.classList.add('br-btn-success');
                saveBtn.style.backgroundColor = '#28a745';

                setTimeout(() => {
                    saveBtn.innerHTML = '<i class="fas fa-save"></i> Сохранить';
                    saveBtn.classList.remove('br-btn-success');
                    saveBtn.style.backgroundColor = '';
                    saveBtn.disabled = false;
                }, 2000);
            } else {
                showToast('Ошибка сохранения настроек!', 'error');
                saveBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Ошибка!';
                saveBtn.style.backgroundColor = '#dc3545';
                setTimeout(() => {
                    saveBtn.innerHTML = '<i class="fas fa-save"></i> Сохранить';
                    saveBtn.style.backgroundColor = '';
                    saveBtn.disabled = false;
                }, 2000);

            }
        } else {
            saveBtn.textContent = '💾 Сохранить'; saveBtn.disabled = false;
        }
    }

     async function handleClearBg() {
         if (!settingsPanel) return;
         const bgFileInput = settingsPanel.querySelector('#s_bgImageFile');
         if (bgFileInput) bgFileInput.value = '';
         const clearBgBtn = settingsPanel.querySelector('#clear-bg-btn');
         const success = await saveSettings({
             ...currentSettings,
             bgImageDataUri: ''
            });
         if (success) {
             applyForumStyles(currentSettings);
             const bgStatus = settingsPanel.querySelector('#bg-status');
             if(bgStatus) bgStatus.textContent = 'Фон не задан.';
             if (clearBgBtn) {
                clearBgBtn.textContent = '✔️';
                setTimeout(() => { clearBgBtn.textContent = '❌'; }, 1000);
             }
             showToast('Фон очищен.', 'info');
         } else {
             showToast('[BR Style] Не удалось удалить фон. Ошибка сохранения.', 'error');
         }
    }

   function handleExport() {
        try {
            const settingsToExport = { ...defaultSettings, ...currentSettings };
            if (!Array.isArray(settingsToExport.quickLinks)) {
                settingsToExport.quickLinks = defaultSettings.quickLinks;
            }
            if (typeof settingsToExport.customPresets !== 'object' || settingsToExport.customPresets === null) {
                settingsToExport.customPresets = defaultSettings.customPresets;
            }
            const settingsJson = JSON.stringify(settingsToExport, null, 2);
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            downloadFile(`br-style-settings-${timestamp}.json`, settingsJson, 'application/json');
            showToast('Настройки экспортированы!', 'success');
        } catch (e) {
            console.error('[BR Style] Ошибка экспорта настроек ❌:', e);
            showToast('[BR Style] Ошибка при экспорте настроек ❌.', 'error');
        }
    }

   function handleImport(event) {
        if (!settingsPanel) return;
        const file = event.target.files[0];
        if (!file) return;
        showToast('Чтение файла...⏳', 'info');
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedSettings = JSON.parse(e.target.result);
                if (typeof importedSettings !== 'object' || importedSettings === null) throw new Error("Файл не содержит корректный JSON объект.");
                let appliedCount = 0;
                settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
                    const key = input.dataset.settingKey;
                    if (key === 'quickLinks' || key === 'customPresets') return;
                    if (importedSettings.hasOwnProperty(key)) {
                        let validatedValue = validateSetting(key, importedSettings[key], defaultSettings[key]);
                        if (input.type === 'checkbox') {
                            input.checked = validatedValue;
                        } else if (input.type === 'range') {
                            let numericValue = (typeof validatedValue === 'string') ? parseFloat(validatedValue) : validatedValue;
                            if (isNaN(numericValue)) numericValue = defaultSettings[key];
                            input.value = numericValue;
                            updateSliderValue(input);
                        } else {
                             input.value = validatedValue;
                        }
                        appliedCount++;
                    }
                });
                const quickLinksContainer = settingsPanel.querySelector('#quick-links-container');
                quickLinksContainer.innerHTML = '';
                const importedLinks = importedSettings.quickLinks;
                if (Array.isArray(importedLinks)) {
                    importedLinks.forEach(link => { if (link && typeof link.name === 'string' && typeof link.url === 'string') addQuickLinkInput(quickLinksContainer, link); });
                } else {
                    (currentSettings.quickLinks || defaultSettings.quickLinks).forEach(link => addQuickLinkInput(quickLinksContainer, link));
                }
                if (importedSettings.hasOwnProperty('customPresets') && typeof importedSettings.customPresets === 'object' && importedSettings.customPresets !== null && !Array.isArray(importedSettings.customPresets)) {
                    const saveBtn = settingsPanel.querySelector('#save-btn');
                   if (saveBtn && !saveBtn.disabled) {
                            currentSettings.customPresets = importedSettings.customPresets;
                            saveSettings({ customPresets: currentSettings.customPresets });
                            populateAllPresetLists();
                        } else {
                            setTimeout(() => {
                                currentSettings.customPresets = importedSettings.customPresets;
                                saveSettings({ customPresets: currentSettings.customPresets });
                                populateAllPresetLists();
                            }, 100);
                        }
                }
                 const bgStatus = settingsPanel.querySelector('#bg-status');
                if (bgStatus) {
                    const importedBgData = importedSettings.bgImageDataUri; const importedGradient = importedSettings.enableGradient; const importedAnimGradient = importedSettings.enableAnimatedGradient; if (importedGradient) { bgStatus.textContent = importedAnimGradient ? 'Фон: (импортирован 🌈 анимированный градиент, нажмите Сохранить)' : 'Фон: (импортирован 🌈 градиент, нажмите Сохранить)'; } else { bgStatus.textContent = importedBgData ? `Фон: (импортирован 🖼️ изображение, нажмите Сохранить)` : 'Фон: (очищен импортом, нажмите Сохранить)'; }
                }
                const bgFileInput = settingsPanel.querySelector('#s_bgImageFile'); if(bgFileInput) bgFileInput.value = '';
                if (appliedCount > 0 || (Array.isArray(importedLinks) && importedLinks.length > 0)) {
                    showToast(`✅ Импортировано ${appliedCount} настроек + ссылки. Нажмите '💾 Сохранить'.`, 'success', 4000);
                    const initializeVisibilityFunc = settingsPanel.querySelector('#s_effectType')?.brInitializeVisibility;
                    if (initializeVisibilityFunc && typeof initializeVisibilityFunc === 'function') {
                         initializeVisibilityFunc();
                    }
                    const initializeAnimVisibilityFunc = settingsPanel.querySelector('#s_enableAvatarBorder')?.brInitializeVisibility;
                    if (initializeAnimVisibilityFunc && typeof initializeAnimVisibilityFunc === 'function') {
                         initializeAnimVisibilityFunc();
                    }
                } else {
                    throw new Error("В файле не найдено совместимых настроек.");
                }
            } catch (error) {
                console.error('[BR Style] Ошибка импорта настроек ❌:', error);
                showToast(`❌ Ошибка: ${error.message}`, 'error', 5000);
            } finally {
                event.target.value = null;
            }
        };
        reader.onerror = (e) => {
             console.error('[BR Style] Ошибка чтения файла для импорта:', e); showToast('❌ Ошибка чтения файла.', 'error'); event.target.value = null;
        };
        reader.readAsText(file);
    }


    function openPanel() {
        if (!settingsPanel) {
             createPanelHTML();
             if (!settingsPanel) {
                 console.error("[BR Style] Не удалось создать или найти панель после попытки создания.");
                 return;
             }
         }

        const wrapper = document.getElementById('br-panel-wrapper');
        if (!wrapper) return;

        try {
            settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
                const key = input.dataset.settingKey;
                if (currentSettings.hasOwnProperty(key) && key !== 'quickLinks' && key !== 'customPresets') {
                    if (input.type === 'checkbox') { input.checked = currentSettings[key]; }
                    else if (input.type === 'range') {
                        let numericValue = (typeof currentSettings[key] === 'string') ? parseFloat(currentSettings[key]) : currentSettings[key];
                        if (isNaN(numericValue)) numericValue = defaultSettings[key];
                        input.value = numericValue;
                        updateSliderValue(input);
                    }
                    else { input.value = currentSettings[key] ?? ''; }
                }
            });
            const quickLinksContainer = settingsPanel.querySelector('#quick-links-container');
            if (quickLinksContainer) {
                quickLinksContainer.innerHTML = '';
               if (Array.isArray(currentSettings.quickLinks)) {
                    currentSettings.quickLinks.forEach(link => addQuickLinkInput(quickLinksContainer, link));
                }
            }
            populateAllPresetLists();
            loadUploadHistory();
            const bgStatus = settingsPanel.querySelector('#bg-status');
            if(bgStatus) {
                if (currentSettings.enableGradient) { bgStatus.textContent = currentSettings.enableAnimatedGradient ? 'Фон: 🌈 Анимированный градиент' : 'Фон: 🌈 Градиент'; } else { bgStatus.textContent = currentSettings.bgImageDataUri ? `Фон: 🖼️ Изображение задано` : 'Фон не задан.'; }
            }
            const bgFileInput = settingsPanel.querySelector('#s_bgImageFile'); if(bgFileInput) bgFileInput.value = '';
            const usernameStatus = settingsPanel.querySelector('#my-username-status');
            if(usernameStatus) {
                usernameStatus.textContent = myUsername ? `Ваш ник: ${myUsername}` : 'Ваш ник: (не найден)';
            }
             const initializeVisibilityFunc = settingsPanel.querySelector('#s_effectType')?.brInitializeVisibility;
             if (initializeVisibilityFunc && typeof initializeVisibilityFunc === 'function') {
                initializeVisibilityFunc();
             }
             const initializeAnimVisibilityFunc = settingsPanel.querySelector('#s_enableAvatarBorder')?.brInitializeVisibility;
             if (initializeAnimVisibilityFunc && typeof initializeAnimVisibilityFunc === 'function') {
                 initializeAnimVisibilityFunc();
             }

            settingsPanel.dataset.view = 'hub';
            if (wrapper) wrapper.dataset.theme = currentSettings.panelTheme;

            wrapper.style.display = 'flex';
            wrapper.style.opacity = '0';
            settingsPanel.style.opacity = '0';
            settingsPanel.style.transform = 'translateY(50px)';

            setTimeout(() => {
                wrapper.style.opacity = '1';
                settingsPanel.style.opacity = '1';
                settingsPanel.style.transform = 'translateY(0)';
            }, 10);

        } catch (e) {
            console.error('[BR Style] Ошибка при открытии или заполнении панели настроек ❌', e);
            if (wrapper) wrapper.style.display = 'none';
        }
    }
    function closePanel() {
        const wrapper = document.getElementById('br-panel-wrapper');
        if (wrapper && settingsPanel) {

            wrapper.style.opacity = '0';
            settingsPanel.style.opacity = '0';
            settingsPanel.style.transform = 'translateY(50px)';

            setTimeout(() => {
                wrapper.style.display = 'none';
            }, 300);
        }
    }
    function togglePanel() {
        const wrapper = document.getElementById('br-panel-wrapper');
        if (!wrapper || wrapper.style.display === 'none') {
            openPanel();
        } else {
            closePanel();
        }
    }

    function createBottomNavBarElement() {
        if (document.getElementById(BOTTOM_NAV_ID)) {
            bottomNavElement = document.getElementById(BOTTOM_NAV_ID);
            return;
        }
        try {
            bottomNavElement = document.createElement('nav');
            bottomNavElement.id = BOTTOM_NAV_ID;
            bottomNavElement.className = 'br-bottom-nav-bar';
            bottomNavElement.innerHTML = `
                <div class="br-nav-inner-mask">
                    <div class="br-nav-group br-nav-utilities">
                    </div>
                    <span id="br-style-nav-links-v110" class="br-nav-group br-nav-links"></span>
                </div>
            `;
            document.body.appendChild(bottomNavElement);
        } catch (e) {
            console.error('[BR BottomNav] Ошибка создания элемента нижней панели ❌', e);
        }
    }

    function updateClock() {
        if (clockElement && currentSettings.enableBottomNavClock) {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            clockElement.textContent = `${hours}:${minutes}:${seconds}`;
            clockElement.style.display = 'inline-block';
        } else if (clockElement) {
            clockElement.style.display = 'none';
        }
    }

   function updateBottomNavBarContent(settings) {
        if (!bottomNavElement) {
            createBottomNavBarElement();
            if (!bottomNavElement) return;
        }
        try {
            const linksContainer = bottomNavElement.querySelector('#br-style-nav-links-v110');
            if (linksContainer) {
                let navHTML = '';
                const currentHref = window.location.href;
                if (Array.isArray(settings.quickLinks)) {
                    settings.quickLinks.forEach(link => {
                         if (link.name?.trim() && link.url?.trim()) {
                             const safeUrl = link.url.trim().replace(/"/g, '&quot;').replace(/'/g, '&#39;');
                             const safeName = link.name.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
                             const isActive = currentHref.startsWith(link.url.trim()) ? 'br-nav-link-active' : '';
                             navHTML += `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="${isActive}" title="${safeName}">
                                            ${safeName}
                                         </a>`;
                         }
                    });
                }
                linksContainer.innerHTML = navHTML;
            }
        } catch (e) {
            console.error('[BR BottomNav] Ошибка обновления содержимого нижней панели ❌', e);
        }
    }

       function createBackgroundElement() {
        if (document.getElementById(BACKGROUND_ELEMENT_ID)) { return; }
        try {
            const bgElement = document.createElement('div');
            bgElement.id = BACKGROUND_ELEMENT_ID;
            document.body.insertBefore(bgElement, document.body.firstChild);
        } catch (e) {
            console.error('[BR Style] Ошибка создания элемента фона ❌', e);
        }
    }

     function addSettingsIconHTML() {
         if (document.getElementById(STYLE_ICON_ID)) { settingsIcon = document.getElementById(STYLE_ICON_ID); }
         else if (document.body) {
             try {
                 settingsIcon = document.createElement('div'); settingsIcon.id = STYLE_ICON_ID; settingsIcon.title = 'Открыть/Закрыть настройки стиля BR Forum (🎨)'; settingsIcon.innerHTML = '<i class="fas fa-palette"></i>';
                 document.body.appendChild(settingsIcon); settingsIcon.addEventListener('click', togglePanel);
             } catch (e) { console.error('[BR Style] Ошибка добавления иконки настроек ❌', e); }
         } else { console.error('[BR Style] Тег body еще не доступен для добавления иконки ❌'); }
     }

     function createScrollIndicatorElement() {
        if (document.getElementById(SCROLL_INDICATOR_ID)) {
            scrollIndicatorElement = document.getElementById(SCROLL_INDICATOR_ID);
            return;
        }
        try {
            scrollIndicatorElement = document.createElement('div');
            scrollIndicatorElement.id = SCROLL_INDICATOR_ID;
            document.body.appendChild(scrollIndicatorElement);
        } catch (e) {
            console.error('[BR Style] Ошибка создания индикатора прокрутки v12!', e);
        }
    }
   function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollHeight > 0) ? (scrollTop / scrollHeight) * 100 : 0;

        if (scrollIndicatorElement && currentSettings.enableScrollIndicator) {
            scrollIndicatorElement.style.width = `${scrollPercent}%`;
            scrollIndicatorElement.style.display = 'block';
        } else if (scrollIndicatorElement) {
            scrollIndicatorElement.style.display = 'none';
        }
        if (currentSettings.enableSmartNav) {
            const nav = document.querySelector('.p-navSticky');
            if (nav) {
                if (scrollTop > lastScrollTop && scrollTop > nav.offsetHeight){
                    nav.style.top = `-${nav.offsetHeight}px`;
                } else {
                    nav.style.top = "0";
                }
                        }

if (bottomNavElement && currentSettings.enableBottomNav) {
                if (scrollTop > lastScrollTop && scrollTop > bottomNavElement.offsetHeight + 100){
                    bottomNavElement.classList.add('br-bottom-nav-hidden');
                } else {
                    bottomNavElement.classList.remove('br-bottom-nav-hidden');
                }
            }

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;        }
    }

function setupScrollObserver(settings) {
        if (scrollObserver) {
            scrollObserver.disconnect();
            scrollObserver = null;
        }
        document.querySelectorAll('.br-anim-scroll').forEach(el => {
            el.classList.remove('br-anim-scroll', 'br-anim-fade-in', 'br-anim-fade-in-up', 'br-anim-slide-in-left', 'br-is-visible');
            el.style.opacity = '';
        });

        if (!settings.enableScrollFadeIn) {
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('br-is-visible');
                    observer.unobserve(entry.target);
                }
            });
        };
        scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
        document.querySelectorAll('.structItem, .message').forEach(el => {
            el.classList.add('br-anim-scroll', `br-anim-${settings.scrollFadeInType}`);
            scrollObserver.observe(el);
        });
    }

    const debouncedRunComplaintTracker = debounce(runComplaintTracker, 300);
    const debouncedFindAndAttachUploader = debounce(findAndAttachUploader, 300);
      function observeNewNodes(mutationsList) {
    let addedNodes = false;
    let relevantUploaderNode = false;

    for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            addedNodes = true;

            if (scrollObserver && currentSettings.enableScrollFadeIn) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        let elementsToObserve = [];
                        if (node.matches('.structItem, .message')) {
                            elementsToObserve.push(node);
                        }
                        elementsToObserve = [
                            ...elementsToObserve,
                            ...node.querySelectorAll('.structItem, .message')
                        ];
                        elementsToObserve.forEach(el => {
                            if (!el.classList.contains('br-is-visible')) {
                                el.classList.add('br-anim-scroll', `br-anim-${currentSettings.scrollFadeInType}`);
                                scrollObserver.observe(el);
                            }
                        });
                    }
                });
            }

            if (!relevantUploaderNode) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.matches('.js-quickReply') || node.querySelector('.js-quickReply') || node.matches('textarea[name="message"]')) {
                            relevantUploaderNode = true;
                        }
                    }
                });
            }
        }
    }

    if (addedNodes) {
        debouncedRunComplaintTracker();
    }

    if (relevantUploaderNode) {
        debouncedFindAndAttachUploader();
    }
}
function showWelcomeScreen() {
        if (document.getElementById(WELCOME_SCREEN_ID)) return;

        const overlay = document.createElement('div');
        overlay.id = WELCOME_SCREEN_ID;
        overlay.innerHTML = `
            <div class="br-welcome-modal">

                <h2><span class="br-welcome-logo-text-red">Black Russia</span> V2 Kастомизация</h2>
                <p class="br-welcome-subtitle">💫 Ваш форум. Ваши правила. 💫</p>
                <p class="br-welcome-version">Версия ${SCRIPT_VERSION}</p>

                <div class="br-welcome-changelog">
                    <h4>Основные возможности скрипта:</h4>
                    <ul>
                        <li>🎨 <b>Пресеты:</b> Полностью меняйте вид форума в 1 клик (Новый Год, Киберпанк и др.).</li>
                        <li>✨ <b>Визуальные Эффекты:</b> Добавляйте "живые" эффекты снега, дождя, матрицы и т.д.</li>
                        <li>🚀 <b>Плавные Анимации:</b> Плавная прокрутка, "живые" аватары, пульсирующие ники и "Parallax" фон.</li>
                        <li>🧭 <b>Панель Навигации:</b> Добавляет удобную нижнюю панель с быстрыми ссылками и часами.</li>
                        <li>⚡ <b>Живой Форум:</b> Авто-обновление счетчиков, онлайна и тем без перезагрузки.</li>
                        <li>🛡️ <b>Удобные Инструменты:</b> "Умная" навигация, выделение своих постов и постов ТС.</li>
                        <li>🔧 <b>Гибкая Настройка:</b> Управляйте каждым элементом: цвета, шрифты, скругления, окантовка.</li>
                    </ul>
                </div>
                <p class="br-welcome-tip"><b>Как начать:</b> Нажмите на иконку <b>🎨</b> в углу экрана, чтобы открыть панель настроек!</p>

                <button id="br-welcome-close-btn">🚀 Начать пользоваться</button>
            </div>
        `;
        document.body.appendChild(overlay);
        const closeBtn = overlay.querySelector('#br-welcome-close-btn');

        closeBtn.addEventListener('click', () => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        });
    }
   function manageVisualEffects(settings) {
         if (!effectsContainer) { effectsContainer = document.getElementById(EFFECTS_CONTAINER_ID); if (!effectsContainer) { if (!document.body) { console.error("[BR Style Effects] Body не найден для создания контейнера!"); return; } effectsContainer = document.createElement('div'); effectsContainer.id = EFFECTS_CONTAINER_ID; document.body.appendChild(effectsContainer); } } effectsContainer.innerHTML = ''; if (!isValidEffectType(settings.effectType) || settings.effectType === 'none') { effectsContainer.style.display = 'none'; return; } effectsContainer.style.display = 'block'; const intensity = Math.max(10, Math.min(200, settings.effectIntensity || 50)); const speedMultiplier = Math.max(0.1, Math.min(5, settings.effectSpeed || 1)); const swayMultiplier = Math.max(0, Math.min(3, settings.effectSwayIntensity || 1)); const rainLength = Math.max(5, Math.min(50, settings.effectRainLength || 20)); const baseDuration = 10; for (let i = 0; i < intensity; i++) { const particle = document.createElement('div'); particle.className = 'br-particle'; let animationDuration = (getRandomInRange(baseDuration - 2, baseDuration + 2)) / speedMultiplier; animationDuration = Math.max(1, animationDuration); const animationDelay = getRandomInRange(0, baseDuration); const initialLeft = getRandomInRange(0, 100); const initialOpacity = getRandomInRange(0.6, 1.0); const swayDirection = Math.random() < 0.5 ? -1 : 1; particle.style.left = `${initialLeft}vw`; particle.style.opacity = initialOpacity; particle.style.setProperty('--sway-dir', swayDirection); particle.style.setProperty('--sway-intensity', swayMultiplier); particle.style.animationDelay = `${animationDelay}s`; particle.style.animationDuration = `${animationDuration}s`; let particleType = settings.effectType; let particleClass = particleType.split('-')[0]; particle.classList.add(particleClass); switch (particleType) { case 'rain': const rainWidth = getRandomInRange(1, 2); particle.style.width = `${rainWidth}px`; particle.style.height = `${rainLength}px`; const rainBaseGray = getRandomIntInRange(163, 183); const rainBaseBlue = getRandomIntInRange(206, 226); const rainBaseAlpha = getRandomInRange(0.4, 0.7); particle.style.backgroundColor = `rgba(${rainBaseGray}, ${rainBaseBlue}, 230, ${rainBaseAlpha})`; particle.style.transform = `rotate(5deg)`; particle.style.animationName = 'fall-straight'; break; case 'snow': const snowSize = getRandomInRange(4, 8); particle.style.width = `${snowSize}px`; particle.style.height = `${snowSize}px`; const tintType = Math.random(); let snowColor = `255, 255, 255`; if (tintType < 0.1) snowColor = `240, 248, 255`; else if (tintType < 0.2) snowColor = `255, 255, 240`; particle.style.backgroundColor = `rgba(${snowColor}, ${initialOpacity})`; particle.style.borderRadius = '50%'; particle.style.boxShadow = `0 0 ${snowSize / 3}px rgba(255, 255, 255, 0.5)`; particle.style.animationName = 'fall-sway'; particle.style.animationDuration = `${animationDuration * 1.5}s`; break; case 'petals-sakura': case 'petals-red_rose': case 'leaves-autumn_maple': const imgKey = particleType.split('-')[1]; const imgUri = PETAL_IMAGES[imgKey]; if (!imgUri) { continue; } const size = getRandomInRange((particleClass === 'leaves' ? 14 : 12), (particleClass === 'leaves' ? 20 : 18)); particle.style.width = `${size}px`; particle.style.height = `${size}px`; particle.style.backgroundImage = `url('${imgUri}')`; particle.style.backgroundSize = 'contain'; particle.style.backgroundRepeat = 'no-repeat'; particle.style.animationName = (particleClass === 'leaves') ? 'fall-leaf' : 'fall-petal'; particle.style.animationDuration = `${animationDuration * (particleClass === 'leaves' ? 1.6 : 1.8)}s`; break; case 'fireflies': const fireflySize = getRandomInRange(3, 6); particle.style.width = `${fireflySize}px`; particle.style.height = `${fireflySize}px`; particle.style.backgroundColor = `rgba(255, 255, 150, ${getRandomInRange(0.5, 0.9)})`; particle.style.borderRadius = '50%'; particle.style.boxShadow = `0 0 ${fireflySize * 1.5}px rgba(255, 255, 100, 0.8), 0 0 ${fireflySize * 3}px rgba(255, 220, 0, 0.5)`; particle.style.top = `${getRandomInRange(5, 95)}vh`; particle.style.left = `${getRandomInRange(5, 95)}vw`; particle.style.animationName = 'wandering-firefly'; particle.style.animationDuration = `${getRandomInRange(8, 15) / speedMultiplier}s`; particle.style.animationTimingFunction = 'ease-in-out'; particle.style.animationDirection = 'alternate'; break; case 'matrix': particle.textContent = MATRIX_CHARS.charAt(getRandomIntInRange(0, MATRIX_CHARS.length - 1)); particle.style.fontFamily = "'Courier New', Courier, monospace"; particle.style.color = `rgba(0, 255, 0, ${initialOpacity})`; particle.style.fontSize = `${rainLength}px`; particle.style.lineHeight = '1'; particle.style.animationName = 'fall-straight'; particle.style.textShadow = `0 0 5px rgba(0, 255, 0, 0.7)`; break;
            case 'bubbles':
                const bubbleSize = getRandomInRange(5, 20);
                particle.style.width = `${bubbleSize}px`;
                particle.style.height = `${bubbleSize}px`;
                particle.style.backgroundColor = `rgba(255, 255, 255, 0.15)`;
                particle.style.border = `2px solid rgba(255, 255, 255, 0.3)`;
                particle.style.borderRadius = '50%';
                particle.style.animationName = 'rise-bubble';
                particle.style.animationDuration = `${animationDuration * 1.5}s`;
                particle.style.top = '105vh';
                break;
            } effectsContainer.appendChild(particle); }

         if (settings.enableInteractiveParticles && ['snow', 'petals-sakura', 'petals-red_rose', 'leaves-autumn_maple', 'fireflies', 'bubbles'].includes(settings.effectType)) {
             const pushRadius = 150;
             const pushForce = 0.5;

             const handleMouseMove = (e) => {
                 if (!effectsContainer) return;
                 const particles = effectsContainer.getElementsByClassName('br-particle');
                 for (let particle of particles) {
                     const rect = particle.getBoundingClientRect();
                     const particleX = rect.left + rect.width / 2;
                     const particleY = rect.top + rect.height / 2;
                     const dx = particleX - e.clientX;
                     const dy = particleY - e.clientY;
                     const distance = Math.sqrt(dx * dx + dy * dy);
                     if (distance < pushRadius) {
                         const force = (1 - (distance / pushRadius)) * pushForce;
                         const moveX = dx * force;
                         const moveY = dy * force;
                         const currentTransform = new DOMMatrix(getComputedStyle(particle).transform);
                         const newX = currentTransform.e + moveX;
                         const newY = currentTransform.f + moveY;
                         particle.style.transform = `translate(${newX}px, ${newY}px)`;
                     }
                 }
             };
             document.addEventListener('mousemove', throttle(handleMouseMove, 50));
         }
    }

   function injectStaticStyles() {
        const staticStyleId = STYLE_ID + '-static';
        if (document.getElementById(staticStyleId)) { return; }
        try {
            const staticCss = `
            @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

@keyframes br-nav-real-flow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }




            #${TOAST_CONTAINER_ID} {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 10002;
                display: flex;
                flex-direction: column-reverse;
                gap: 10px;
                width: 90%;
                max-width: 400px;
            }
            .br-toast {
                padding: 12px 20px;
                background: rgba(30, 30, 30, 0.9);
                color: #FFFFFF;
                border-radius: 50px;
                text-align: center;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                opacity: 0;
                transform: translateY(20px);
                transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1),
                            opacity 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            .br-toast-show {
                opacity: 1;
                transform: translateY(0);
            }
            .br-toast::before {
                font-family: "Font Awesome 5 Free";
                font-weight: 900;
                font-size: 16px;
            }
            .br-toast-info::before {
                content: '\\f05a';
                color: #3498db;
            }
            .br-toast-success::before {
                content: '\\f00c';
                color: #2ecc71;
            }
            .br-toast-error::before {
                content: '\\f071';
                color: #e74c3c;
            }


            #${STYLE_ICON_ID} {
                font-size: 20px;
                line-height: 1;
            }
            #${STYLE_ICON_ID} .fas {
                transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
            }
            #${STYLE_ICON_ID}:hover .fas {
                transform: rotate(20deg);
            }


                .br-live-feed-item-title {
                    color: #fff;
                    font-weight: bold;
                }
                .br-live-feed-item-user {
                    color: #999;
                }
                @keyframes br-marquee {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-100%); }
                }

            .panel-btn {
                position: relative;
            }
            .br-ripple-container {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                overflow: hidden;
                border-radius: inherit;
                z-index: 1;
            }
            .br-ripple-effect {
                position: absolute;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.4);
                transform: scale(0);
                animation: br-ripple-anim 0.6s linear;
                pointer-events: none;
            }
            @keyframes br-ripple-anim {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }

            .br-toggle-switch {
                position: relative;
                display: inline-block;
                width: 44px;
                height: 26px;
                vertical-align: middle;
            }
            .br-toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .br-toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #555;
                transition: .3s;
                border-radius: 34px;
            }
            .br-toggle-slider:before {
                position: absolute;
                content: "";
                height: 20px;
                width: 20px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: .3s cubic-bezier(0.2, 0.8, 0.2, 1);
                border-radius: 50%;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            }
            .br-toggle-switch input:checked + .br-toggle-slider {
                background-color: #28a745;
            }
            .br-toggle-switch input:checked + .br-toggle-slider:before {
                transform: translateX(18px);
            }
            #${PANEL_ID} label.inline-label {
                user-select: none;
                cursor: pointer;
            }

            input[type="range"].br-styled-slider {
                -webkit-appearance: none;
                width: 100%;
                background: transparent;
                margin: 6px 0;
            }
            input[type="range"].br-styled-slider:focus {
                outline: none;
            }

            input[type="range"].br-styled-slider::-webkit-slider-runnable-track {
                width: 100%;
                height: 8px;
                cursor: pointer;
                background: #555;
                border-radius: 50px;
            }
            input[type="range"].br-styled-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                height: 20px;
                width: 20px;
                border-radius: 50%;
                background: #f1f1f1;
                border: 2px solid #ccc;
                cursor: pointer;
                margin-top: -6px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.2s;
            }
            input[type="range"].br-styled-slider:active::-webkit-slider-thumb {
                transform: scale(1.2);
                background: #fff;
            }

            input[type="range"].br-styled-slider::-moz-range-track {
                width: 100%;
                height: 8px;
                cursor: pointer;
                background: #555;
                border-radius: 50px;
            }
            input[type="range"].br-styled-slider::-moz-range-thumb {
                height: 20px;
                width: 20px;
                border-radius: 50%;
                background: #f1f1f1;
                border: 2px solid #ccc;
                cursor: pointer;
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            }


            @keyframes br-critical-pulse {
                0%   { opacity: 1; box-shadow: 0 0 8px rgba(235, 51, 73, 0.3); }
                50%  { opacity: 0.7; box-shadow: 0 0 15px rgba(235, 51, 73, 0.8); }
                100% { opacity: 1; box-shadow: 0 0 8px rgba(235, 51, 73, 0.3); }
            }
            .br-flow-crit {
                animation: brGradientFlow 2s ease infinite,
                           br-critical-pulse 1.8s ease-in-out infinite;
            }

            .br-panel-body::-webkit-scrollbar {
                width: 14px;
            }
            .br-panel-body::-webkit-scrollbar-track {
                background: transparent;
            }
            .br-panel-body::-webkit-scrollbar-thumb {
                background-color: #555;
                border-radius: 10px;
                border: 4px solid transparent;
                background-clip: content-box;
            }
            .br-panel-body::-webkit-scrollbar-thumb:hover {
                background-color: #777;
            }

            .br-input-group {
                position: relative;
                margin-top: 15px;
            }
            .br-input-group input[type="text"] {
                padding-top: 12px;
            }
            .br-input-group label {
                position: absolute;
                top: 10px;
                left: 12px;
                font-size: 13px;
                color: #aaa;
                pointer-events: none;
                transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
            }
            .br-input-group input[type="text"]:focus + label,
            .br-input-group input[type="text"]:not(:placeholder-shown) + label {
                top: 4px;
                font-size: 10px;
                color: #D59D80;
            }
            #${PANEL_ID} .br-input-group label {
                margin-bottom: 0;
            }

            @keyframes br-counter-pop {
                0%   { transform: scale(1); }
                30%  { transform: scale(1.4); background-color: #e74c3c; color: white; }
                100% { transform: scale(1); }
            }
            .br-counter-pop {
                animation: br-counter-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }



            .panel-btn .fas {
                position: relative;
                z-index: 2;
            }
            .panel-btn span, .panel-btn i {
                vertical-align: middle;
            }
            .br-panel-btn-save i {
                transition: opacity 0.3s, transform 0.3s;
            }
            .br-panel-btn-save .fa-check {
                position: absolute;
                opacity: 0;
                transform: scale(0.5);
                transition: opacity 0.3s, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                left: 0;
                right: 0;
                margin-left: auto;
                margin-right: auto;
            }
            .br-panel-btn-save.br-btn-success .fa-save {
                opacity: 0;
                transform: scale(0.5);
            }
            .br-panel-btn-save.br-btn-success .fa-check {
                opacity: 1;
                transform: scale(1);
            }

            .br-panel-btn-reset .fa-undo-alt {
                transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
            }
            .br-panel-btn-reset:active .fa-undo-alt {
                transform: rotate(-180deg);
            }

            .br-skeleton-loader {
                display: block;
                background: linear-gradient(
                    90deg,
                    rgba(198, 198, 208, 0.1) 25%,
                    rgba(198, 198, 208, 0.2) 50%,
                    rgba(198, 198, 208, 0.1) 75%
                );
                background-size: 200% 100%;
                animation: br-skeleton-shine 1.8s linear infinite;
                border-radius: 6px;
            }
            @keyframes br-skeleton-shine {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
            #br-upload-history-container .br-skeleton-loader {
                height: 30px;
                margin-bottom: 8px;
            }
            #br-upload-history-container .br-skeleton-loader:last-child {
                margin-bottom: 0;
            }


.br-neon-badge {
                    float: right;
                    display: inline-flex;
                    align-items: center;
                    padding: 3px 12px;
                    border-radius: 20px;
                    font-family: 'Roboto', sans-serif;
                    font-weight: 700;
                    font-size: 11px;
                    color: #fff;
                    margin-left: 10px;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                    box-shadow: 0 3px 8px rgba(0,0,0,0.3);
                    white-space: nowrap;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                    background-size: 200% 200%;
                    animation: brGradientFlow 4s ease infinite;
                    will-change: background-position;
                    user-select: none;
                }
                .br-neon-badge:active {
                    transform: scale(0.95);
                }
                .br-copy-tooltip {
                    position: fixed;
                    bottom: 20px; left: 50%; transform: translateX(-50%);
                    background: #333; color: #fff; padding: 8px 16px;
                    border-radius: 20px; font-size: 12px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.5);
                    z-index: 9999;
                    animation: br-fade-up 0.3s ease-out;
                }
                @keyframes brGradientFlow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes br-fade-up {
                    from { opacity: 0; transform: translate(-50%, 10px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                .br-flow-fresh { background-image: linear-gradient(45deg, #0ba360, #3cba92, #0ba360); }
                .br-flow-warn { background-image: linear-gradient(45deg, #FF8008, #FFC837, #FF8008); }
                .br-flow-crit { background-image: linear-gradient(45deg, #EB3349, #F45C43, #EB3349); animation: brGradientFlow 2s ease infinite; }
                .br-flow-pinned-ok { background-image: linear-gradient(45deg, #4facfe, #00f2fe, #4facfe); }
                .structItem-title { padding-right: 5px; }
.button, a.button {
                    background: rgba(5, 10, 20, 0.6) !important;
                    border: 1px solid #00F0FF !important;
                    box-shadow: 0 0 8px rgba(0, 240, 255, 0.3), inset 0 0 15px rgba(0, 240, 255, 0.05) !important;
                    color: #00F0FF !important;
                    border-radius: 4px !important;
                    text-transform: uppercase !important;
                    letter-spacing: 1px !important;
                    font-weight: 600 !important;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
                    backdrop-filter: blur(4px) !important;
                }
                .button:hover, a.button:hover {
                    background: rgba(0, 240, 255, 0.15) !important;
                    box-shadow: 0 0 20px rgba(0, 240, 255, 0.6), inset 0 0 20px rgba(0, 240, 255, 0.2) !important;
                    text-shadow: 0 0 8px #00F0FF !important;
                    transform: translateY(-2px) scale(1.02) !important;
                    border-color: #fff !important;
                    color: #fff !important;
                }
                .button:active, a.button:active {
                    transform: translateY(1px) scale(0.98) !important;
                    box-shadow: 0 0 5px rgba(0, 240, 255, 0.8) !important;
                }
                .button.button--cta, a.button.button--cta {
                    border-color: #ff00de !important;
                    color: #ff00de !important;
                    box-shadow: 0 0 8px rgba(255, 0, 222, 0.3) !important;
                }
                .button.button--cta:hover, a.button.button--cta:hover {
                    background: rgba(255, 0, 222, 0.15) !important;
                    box-shadow: 0 0 20px rgba(255, 0, 222, 0.6) !important;
                    text-shadow: 0 0 8px #ff00de !important;
                    border-color: #fff !important;
                }
                .button.button--primary, a.button.button--primary {
                    border-color: #00ff88 !important;
                    color: #00ff88 !important;
                    box-shadow: 0 0 8px rgba(0, 255, 136, 0.3) !important;
                }
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

                #${BACKGROUND_ELEMENT_ID} {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; pointer-events: none;
                    transition: background-image 0.5s ease, background-color 0.5s ease, background-attachment 0.1s linear;
                }
                body { background: transparent !important; }
                .p-pageWrapper { position: relative; z-index: auto; }


               #${BOTTOM_NAV_ID} {
                    width: auto;
                    max-width: 95%;
                    position: fixed;
                    z-index: 9997;
                    left: 50%;
                    transform: translateX(-50%);
                    bottom: 10px;
                    transition: opacity 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
                    overflow: hidden;
                }

                .br-nav-inner-mask {
                    height: ${BOTTOM_NAV_HEIGHT};
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    gap: 8px;
                    padding: 0 10px;
                    position: relative;
                    z-index: 2;
                    background: transparent;
                }
            .br-nav-group {
                    display: flex;
                    align-items: center;
                    height: 100%;
                }
                .br-bottom-nav-hidden {
                    transform: translateX(-50%) translateY(100px) !important;
                    opacity: 0 !important;
                }
@media (max-width: 700px) {
                    #${BOTTOM_NAV_ID} {
                        width: 95%;
                        max-width: 95%;
                        bottom: 10px;
                    }
                    #${BOTTOM_NAV_ID} #br-style-nav-links-v110 a {
                        padding: 0 10px;
                    }
                }#${BOTTOM_NAV_ID} .br-nav-utilities {
                    flex-shrink: 0;
                }
                #${BOTTOM_NAV_ID} .br-nav-links {
                    justify-content: center;
                    flex-grow: 1;
                    min-width: 0;
                    overflow: hidden;
                }
#${BOTTOM_NAV_ID} #br-style-nav-links-v110 a {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: bold;
                    color: #a8d6e3;
                    text-shadow: 0 0 8px #ffffff, 0 0 2px #000000;
                    position: relative;
                    z-index: 2;
                    padding: 0 14px;
                    margin: 0 15px;
                    height: calc(${BOTTOM_NAV_HEIGHT} - 12px);
                    background: none;
                    border: none;
                    border-radius: 10px;
                    box-shadow: none;
                    transition: color 0.2s ease-out, background-color 0.2s ease-out;
                }
                #br-style-nav-links-v110 a:active {
                    transform: scale(0.95);
                }
                #br-style-nav-links-v110 a.br-nav-link-active,
                #${BOTTOM_NAV_ID} #br-style-nav-links-v110 a:hover {
                    color: #ffffff;
                    background: rgba(0, 0, 0, 0.2) !important;
                    transform: translateY(-1px) scale(1.02);
                }

                #${BOTTOM_NAV_ID} a:active {
                    transform: scale(0.95);
                    background: rgba(0, 0, 0, 0.3) !important;
                }                #${CLOCK_ID} {
                    display: none;
                }                #${CLOCK_ID} .br-clock-inner {
                    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
                    transform-style: preserve-3d;
                }
                #${CLOCK_ID}.br-clock-flipped .br-clock-inner {
                    transform: rotateY(180deg);
                }
                #${CLOCK_ID} .br-clock-front, #${CLOCK_ID} .br-clock-back {
                    backface-visibility: hidden;
                }
                #${CLOCK_ID} .br-clock-back {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    line-height: ${BOTTOM_NAV_HEIGHT};
                    padding: 0 10px;
                    transform: rotateY(180deg);
                }
#${STYLE_ICON_ID} { position: fixed; z-index: 9998; width: 40px; height: 40px; background-color: rgba(51, 51, 51, 0.8); border-radius: 50%; cursor: pointer; border: 1px solid rgba(120, 120, 120, 0.7); box-shadow: 0 2px 6px rgba(0,0,0,0.4); transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); display: flex; align-items: center; justify-content: center; font-size: 24px; line-height: 1; color: white; user-select: none; bottom: 55px; left: 10px; }
@keyframes br-icon-flow {
                    0% { background-position: 0% 50%; box-shadow: 0 0 10px rgba(128, 222, 234, 0.6); }
                    50% { background-position: 100% 50%; box-shadow: 0 0 15px rgba(186, 104, 200, 0.7); }
                    100% { background-position: 0% 50%; box-shadow: 0 0 10px rgba(128, 222, 234, 0.6); }
                }
                #${BOTTOM_NAV_ID} #${STYLE_ICON_ID} {
                    position: relative;
                    bottom: auto;
                    left: auto;
                    width: calc(${BOTTOM_NAV_HEIGHT} - 10px);
                    height: calc(${BOTTOM_NAV_HEIGHT} - 10px);
                    font-size: 18px;
                    background: linear-gradient(120deg, #80DEEA, #A7FFEB, #E1BEE7, #BA68C8, #80DEEA);
                    background-size: 300% 300%;
                    animation: br-icon-flow 6s ease infinite;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: #ffffff;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.3);
                    border-radius: 12px;
                    z-index: 10;
                    margin-right: 0;
                    transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                }
                #${BOTTOM_NAV_ID} #${STYLE_ICON_ID}:hover {
                    transform: scale(1.1) rotate(15deg);
                }              #${STYLE_ICON_ID}:hover { background-color: rgba(80, 80, 80, 0.9); transform: scale(1.1); }

                #${SCROLL_INDICATOR_ID} {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 0%;
                    height: 3px;
                    background-color: #00F0FF;
                    z-index: 10000;
                    transition: width 0.1s linear;
                    display: none;
                }

                #${WELCOME_SCREEN_ID} {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background-color: rgba(0, 0, 0, 0.7);
                    z-index: 10001;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(5px);
                    -webkit-backdrop-filter: blur(5px);
                    opacity: 0;
                    animation: br-welcome-fade-in 0.3s ease-out forwards;
                    transition: opacity 0.3s ease;
                }
                .br-welcome-modal {
                    background-image: url('https://i.postimg.cc/8Px0mmnC/49fcb8ea0bdec98729da0ad679e7a954.jpg');
                    background-size: cover;
                    background-position: center center;
                    background-repeat: no-repeat;
                    background-color: rgba(4, 11, 105, 0.7);
                    background-blend-mode: multiply;
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(19px);
                    border-radius: 20px;
                    border: 1px solid rgba(89, 0, 89, 0.5);
                    max-height: 90vh;
                    overflow-y: auto;
                    color: #eee;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    width: 90%;
                    max-width: 500px;
                    padding: 25px;
                    box-sizing: border-box;
                    text-align: center;
                    animation: br-welcome-slide-up 0.4s ease-out forwards;
                }
                .br-welcome-modal h3 {
                    margin: 0;
                    font-size: 22px;
                    color: #fff;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.5);
                }
                .br-welcome-modal .br-welcome-version {
                    font-size: 14px;
                    color: #999;
                    margin: 5px 0 20px 0;
                }
                .br-welcome-changelog {
                    background: rgba(0,0,0,0.2);
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 20px;
                    text-align: left;
                }
                .br-welcome-changelog h4 {
                    margin: 0 0 10px 0;
                    color: #fff;
                    border-bottom: 1px solid #555;
                    padding-bottom: 5px;
                }
                .br-welcome-changelog ul {
                    margin: 0; padding-left: 20px;
                    font-size: 14px;
                    color: #ccc;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.7);
                }
                .br-welcome-changelog li {
                    margin-bottom: 8px;
                }
                .br-welcome-tip {
                    font-size: 13px;
                    color: #aaa;
                    margin-bottom: 25px;
                }
                #br-welcome-close-btn {
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    padding: 12px 25px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background-color 0.2s ease, transform 0.2s ease;
                    margin-top: 10px;
                }
                #br-welcome-close-btn:hover {
                    background-color: #45a049;
                    transform: scale(1.05);
                }
                #br-welcome-close-btn:hover {
                    background-color: #45a049;
                    transform: scale(1.05);
                }
                @keyframes br-welcome-fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes br-welcome-slide-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }


                .br-panel-tooltip {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #555;
                    color: #fff;
                    font-weight: bold;
                    font-size: 11px;
                    font-family: 'Courier New', Courier, monospace;
                    cursor: help;
                    margin-left: 8px;
                    vertical-align: middle;
                    position: relative;
                    user-select: none;
                }
                .br-panel-tooltip:hover::before {
                    content: attr(data-tooltip);
                    position: absolute;
                    bottom: 120%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #111;
                    color: #eee;
                    padding: 8px 12px;
                    border-radius: 5px;
                    font-size: 12px;
                    font-family: Inter, sans-serif;
                    font-weight: 400;
                    width: 300px;
                    max-width: 300px;
                    z-index: 10000;
                    text-align: left;
                    white-space: normal;
                    border: 1px solid #444;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.4);
                }
                .br-panel-tooltip:hover::after {
                    content: '';
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%) translateY(8px);
                    width: 0;
                    height: 0;
                    border-left: 8px solid transparent;
                    border-right: 8px solid transparent;
                    border-top: 8px solid #111;
                    z-index: 9999;
                }
                .br-welcome-modal .br-welcome-subtitle {
                    font-size: 16px;
                    color: #00F0FF;
                    margin: -10px 0 15px 0;
                    font-weight: bold;
                    text-shadow: 0 0 5px rgba(0, 240, 255, 0.7);
                }
                                .br-welcome-modal h2 {
                    font-size: 26px;
                    margin: 0 0 5px 0;
                    color: #fff;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.5);
                }
              .br-welcome-logo-text-red {
                    color: #E74C3C;
                    font-weight: bold;
                    text-shadow: 0 0 8px rgba(231, 76, 60, 0.8);
                }
                #br-style-copy-modal-v1 {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.7);
                    z-index: 10001;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .br-style-modal-content {
                    background: #333;
                    border: 1px solid #555;
                    border-radius: 12px;
                    padding: 20px;
                    width: 90%;
                    max-width: 400px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.5);
                    transform: scale(0.95);
                    opacity: 0;
                    animation: br-modal-pop-in 0.2s ease-out forwards;
                }
                @keyframes br-modal-pop-in {
                    to { transform: scale(1); opacity: 1; }
                }
                .br-style-modal-content h4 {
                    margin: 0 0 15px;
                    color: #fff;
                    text-align: center;
                    border-bottom: 1px solid #555;
                    padding-bottom: 10px;
                    font-size: 16px;
                }
                .br-style-modal-content input[type="text"] {
                    width: 100%;
                    background: #222;
                    border: 1px solid #666;
                    color: #eee;
                    padding: 10px;
                    border-radius: 4px;
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 14px;
                    box-sizing: border-box;
                }
                .br-style-modal-buttons {
                    display: flex;
                    gap: 10px;
                    margin-top: 15px;
                }
                .br-style-modal-buttons button {
                    flex: 1;
                    padding: 9px 12px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.2s ease;
                    font-size: 14px;
                }
                .br-style-modal-copy {
                    background: #007bff;
                    color: white;
                }
                .br-style-modal-copy:hover { background: #0056b3; }
                .br-style-modal-close {
                    background: #aaa;
                    color: #333;
                }
                .br-style-modal-close:hover { background: #999; }
#br-panel-wrapper {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.7);
                    z-index: 9998;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    box-sizing: border-box;
                    transition: opacity 0.4s ease;
                }

#${PANEL_ID} {
                    width: 100%;
                    max-width: 800px;
                    max-height: 90vh;
                    background: #2B124C;
                    border-radius: 16px;
                    border: 1px solid rgba(198, 198, 208, 0.1);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    transition: transform 0.3s ease-out, opacity 0.3s ease-out;
                }
                .br-panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 20px;
                    border-bottom: 1px solid rgba(198, 198, 208, 0.1);
                    flex-shrink: 0;
                }
                .br-panel-header h3 {
                    margin: 0;
                    font-size: 16px;
                    color: #C6C6D0;
                    display: flex;
                    align-items: center;
                }

                .br-panel-close-btn {
                    background: transparent;
                    border: none;
                    color: #C6C6D0;
                    font-size: 16px;
                    cursor: pointer;
                    opacity: 0.7;
                    transition: opacity 0.2s, transform 0.2s;
                }
                .br-panel-close-btn:hover {
                    opacity: 1;
                    transform: scale(1.1);
                }

                .br-panel-body {
                    padding: 20px;
                    overflow-y: auto;
                    overflow-x: hidden;
                    -webkit-overflow-scrolling: touch;
                }

                .br-hub-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                    gap: 15px;
                }

                .br-hub-card {
                    background: #54162B;
                    border-radius: 12px;
                    padding: 15px;
                    text-align: center;
                    cursor: pointer;
                    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
                    border: 1px solid rgba(198, 198, 208, 0.1);
                    position: relative;
                }
                .br-hub-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                    border-color: #D59D80;
                }
                .br-hub-card .br-hub-card-icon {
                    width: 32px;
                    height: 32px;
                    margin: 0 auto 10px auto;
                    background-color: #C6C6D0;
                    -webkit-mask-size: contain;
                    -webkit-mask-position: center;
                    -webkit-mask-repeat: no-repeat;
                    transition: background-color 0.2s ease;
                }
                .br-hub-card:hover .br-hub-card-icon {
                    background-color: #D59D80;
                }
                .br-hub-card span {
                    font-size: 13px;
                    color: #C6C6D0;
                    font-weight: 500;
                }

                .br-hub-card[data-page] .br-hub-card-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    -webkit-mask-image: none;
    mask-image: none;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    -webkit-mask-size: contain;
    mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-position: center;
}

.br-hub-card[data-page="tab-main"] .br-hub-card-icon {
    background: linear-gradient(135deg, #a8ff78, #78ffd6);
    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"/></svg>');
}
.br-hub-card[data-page="tab-visuals"] .br-hub-card-icon {
    background: linear-gradient(135deg, #f794a4, #fdd6bd);
    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>');
}
.br-hub-card[data-page="tab-animations"] .br-hub-card-icon {
    background: linear-gradient(135deg, #8a2387, #e94057, #f27121);
    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-13.5v7c0 .41.47.65.8.4l4.67-3.5c.27-.2.27-.6 0-.8l-4.67-3.5c-.33-.25-.8-.01-.8.4z"/></svg>');
}
.br-hub-card[data-page="tab-interface"] .br-hub-card-icon {
    background: linear-gradient(135deg, #6dd5ed, #2193b0);
    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"/></svg>');
}
.br-hub-card[data-page="tab-live"] .br-hub-card-icon {
    background: linear-gradient(135deg, #56ab2f, #a8e063);
    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1.01-6.01-1.42-1.42L11 14.17l4.01-4.01 1.42 1.42L11 16.99z"/></svg>');
}
.br-hub-card[data-page="tab-presets"] .br-hub-card-icon {
    background: linear-gradient(135deg, #fce043, #fb724b);
    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17v2h6v-2H3zm12-2v2h6v-2h-6zm-4-8v2h-2V7h2V5h2v2h2v2h-2v2h-2v2H9V9h2V7h2zm-4 4v2H3v-2h6zm4-4h2V7h-2v2zm4 0v2h6v-2h-6z"/></svg>');
}
.br-hub-card[data-page="tab-integrations"] .br-hub-card-icon {
    background: linear-gradient(135deg, #da22ff, #9733ee);
    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-2 .9-2 2v3.81c0 .73.4 1.4 1.01 1.76L8 15.61V20c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-4.4c.59-.35 1-.92 1-1.6v-3zm-6-1.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zM10 3.5c0-.28.22-.5.5-.5s.5.22.5.5V5h-1V3.5zM4 7h4v3.62l-3.02 1.77C4.4 12.1 4 11.74 4 11.31V7zm14 11.5c0 .28-.22.5-.5.5h-6c-.28 0-.5-.22-.5-.5v-3.62l3.02-1.77c.58.29 1.18.4 1.79.4s1.21-.11 1.79-.4l2.9 1.71c.08.05.09.14.09.21V18.5zm.1-7.01L15 13.25l-.01.01c-.22.13-.46.23-.71.3-.24.07-.49.11-.74.13-.26.02-.53.02-.8.02s-.54-.01-.8-.02c-.25-.02-.5-.06-.74-.13-.25-.07-.49-.17-.71-.3l-.01-.01-3.1-1.76c.03.02.06.03.09.05L10 13.2V9h8v2.49z"/></svg>');
}
.br-hub-card[data-page="tab-help"] .br-hub-card-icon {
    background: linear-gradient(135deg, #ff5f6d, #ffc371);
    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/></svg>');
}


                .br-settings-view {
                    display: none;
                }
                .br-settings-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .br-settings-back-btn {
                    background: #104C64;
                    border: 1px solid rgba(198, 198, 208, 0.1);
                    color: #C6C6D0;
                    padding: 6px 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: background-color 0.2s, color 0.2s;
                }
                .br-settings-back-btn:hover {
                    background: #D59D80;
                    color: #2B124C;
                    border-color: #D59D80;
                }
                .br-settings-title {
                    margin: 0 0 0 15px;
                    font-size: 18px;
                    font-weight: 600;
                    color: #C6C6D0;
                }

                #${PANEL_ID}[data-view="hub"] .br-settings-view { display: none; }
                #${PANEL_ID}[data-view="hub"] .br-hub-grid { display: grid; }

                #${PANEL_ID}[data-view="page"] .br-settings-view { display: block; }
                #${PANEL_ID}[data-view="page"] .br-hub-grid { display: none; }

                #${PANEL_ID} .panel-tab-content {
                    display: none;
                    animation: br-fade-in 0.3s ease-out;
                }
                @keyframes br-fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                #${PANEL_ID} .panel-tab-content h4 {
                    color: #D59D80;
                    border-top: 1px solid rgba(198, 198, 208, 0.1);
                    border-bottom: 1px solid rgba(198, 198, 208, 0.1);
                    padding: 8px 0;
                    margin: 20px 0 15px 0;
                    font-size: 14px;
                    text-align: center;
                    font-weight: 600;
                }
                #${PANEL_ID} .panel-tab-content h4:first-child {
                    margin-top: 0;
                    border-top: none;
                }

                #${PANEL_ID} .setting-group {
                    margin-bottom: 12px;
                    padding: 14px;
                    border-radius: 8px;
                    background: #104C64;
                    border: 1px solid rgba(198, 198, 208, 0.1);
                }

                #${PANEL_ID} label {
                    display: block;
                    margin-bottom: 6px;
                    font-weight: 500;
                    color: #C6C6D0;
                    font-size: 13px;
                }
                #${PANEL_ID} label.inline-label {
                    display: inline;
                    margin-left: 8px;
                    font-weight: 400;
                    color: #C6C6D0;
                }

                #${PANEL_ID} input[type="text"],
                #${PANEL_ID} input[type="number"],
                #${PANEL_ID} input[type="file"],
                #${PANEL_ID} select,
                #${PANEL_ID} textarea {
                    width: 100%;
                    padding: 8px 12px;
                    background: #0D1D25;
                    border: 1px solid rgba(198, 198, 208, 0.2);
                    color: #C6C6D0;
                    border-radius: 6px;
                    box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);
                    transition: all 0.2s ease;
                    font-size: 13px;
                }
                #${PANEL_ID} input[type="text"]:focus,
                #${PANEL_ID} input[type="number"]:focus,
                #${PANEL_ID} select:focus,
                #${PANEL_ID} textarea:focus {
                    border-color: #D59D80;
                    background: #104C64;
                    box-shadow: 0 0 8px rgba(213, 157, 128, 0.2);
                    outline: none;
                }

                #${PANEL_ID} input[type="color"] {
                    border: 1px solid rgba(198, 198, 208, 0.2);
                    height: 28px;
                    width: 44px;
                    vertical-align: middle;
                    margin-left: 5px;
                    border-radius: 6px;
                    cursor: pointer;
                    background: transparent;
                    transition: border-color 0.2s;
                }
                #${PANEL_ID} input[type="color"]:hover {
                    border-color: #D59D80;
                }

                #${PANEL_ID} input[type="checkbox"] {
                    appearance: none;
                    -webkit-appearance: none;
                    width: 20px;
                    height: 20px;
                    background: #0D1D25;
                    border-radius: 5px;
                    position: relative;
                    vertical-align: middle;
                    border: 1px solid rgba(198, 198, 208, 0.2);
                    cursor: pointer;
                    margin-right: 5px;
                    transition: all 0.2s ease;
                }
                #${PANEL_ID} input[type="checkbox"]::after {
                    content: '✓';
                    font-weight: bold;
                    font-size: 14px;
                    color: #2B124C;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 0;
                    transition: all 0.2s ease;
                }
                #${PANEL_ID} input[type="checkbox"]:checked {
                    background: #D59D80;
                    border-color: #D59D80;
                }
                #${PANEL_ID} input[type="checkbox"]:checked::after {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }

                #${PANEL_ID} input[type="range"] {
                    -webkit-appearance: none;
                    width: 100%;
                    background: transparent;
                    margin-top: 8px;
                    cursor: pointer;
                }
                #${PANEL_ID} input[type="range"]::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 6px;
                    background: #0D1D25;
                    border-radius: 3px;
                    border: 1px solid rgba(0,0,0,0.2);
                }
                #${PANEL_ID} input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 18px;
                    width: 18px;
                    border-radius: 50%;
                    background: #C6C6D0;
                    border: 4px solid #D59D80;
                    margin-top: -7px;
                    box-shadow: 0 0 5px rgba(213, 157, 128, 0.5);
                    transition: transform 0.1s;
                }
                #${PANEL_ID} input[type="range"]:active::-webkit-slider-thumb {
                    transform: scale(1.2);
                }

                #${PANEL_ID} .button-group {
                    margin-top: 20px;
                    padding-top: 15px;
                    border-top: 1px solid rgba(198, 198, 208, 0.1);
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    justify-content: flex-end;
                }
                #${PANEL_ID} button.panel-btn {
                    padding: 9px 16px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 13px;
                    color: #C6C6D0;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    border: 1px solid rgba(198, 198, 208, 0.1);
                    background: #104C64;
                }
                #${PANEL_ID} button.panel-btn:active {
                    transform: scale(0.98);
                }
                #${PANEL_ID} button.panel-btn-save {
                    background: #D59D80;
                    border-color: #D59D80;
                    color: #2B124C;
                }
                #${PANEL_ID} button.panel-btn-save:hover {
                    opacity: 0.9;
                }
                #${PANEL_ID} button.panel-btn-reset:hover,
                #${PANEL_ID} button.panel-btn-export:hover,
                #${PANEL_ID} button.panel-btn-import:hover {
                    background: #104C64;
                    border-color: #D59D80;
                }

                #${PANEL_ID} button.panel-small-btn {
                    padding: 6px 10px !important;
                    font-size: 12px !important;
                    background: #104C64;
                    border-color: rgba(198, 198, 208, 0.1);
                }
                #${PANEL_ID} button.panel-btn-danger {
                    background: #8B0000 !important;
                    border-color: rgba(255,100,100,0.3) !important;
                }
                #${PANEL_ID} button.panel-btn-add {
                    background: rgba(213, 157, 128, 0.1);
                    border: 1px solid rgba(213, 157, 128, 0.3);
                    color: #D59D80;
                    width: 100%;
                }

                #${PANEL_ID} hr {
                    border: none;
                    border-top: 1px solid rgba(198, 198, 208, 0.1);
                    margin: 20px 0;
                }

                #${PANEL_ID} .sub-settings {
                    margin-left: 0;
                    padding: 10px;
                    border-left: 3px solid #D59D80;
                    margin-top: 12px;
                    background: rgba(13, 29, 37, 0.5);
                    border-radius: 0 6px 6px 0;
                }

                #${PANEL_ID} .dynamic-links-group {
                    border-color: rgba(198, 198, 208, 0.1);
                }
                #${PANEL_ID} .quick-link-input-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                }
                #${PANEL_ID} .quick-link-input-item input {
                    font-size: 12px;
                }
                #${PANEL_ID} .quick-link-input-item button.remove-quick-link-btn {
                    flex-shrink: 0;
                    padding: 6px 9px !important;
                    line-height: 1;
                }

                #${PANEL_ID} .author-credit {
                    text-align: center;
                    font-size: 11px;
                    color: #888;
                    margin-top: 15px;
                    padding-top: 15px;
                    border-top: 1px solid rgba(198, 198, 208, 0.1);
                }

                @media (max-width: 700px) {
                    #br-panel-wrapper {
                        padding: 0;
                    }
                    #${PANEL_ID} {
                        max-height: 100vh;
                        height: 100%;
                        border-radius: 0;
                        border: none;
                    }
                    .br-hub-grid {
                        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                        gap: 10px;
                    }
                    .br-panel-body {
                        padding: 15px;
                    }
                }
                .br-help-section p,
                .br-help-section li {
                    color: #C6C6D0;
                    font-size: 13px;
                    line-height: 1.6;
                }
                .br-help-section p {
                    margin-top: 5px;
                    margin-bottom: 10px;
                }
                .br-help-section ul {
                    padding-left: 20px;
                    margin: 10px 0;
                }
                .br-help-section li {
                    margin-bottom: 10px;
                }
                .br-help-section strong {
                    color: #D59D80;
                    font-weight: 600;
                }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} { background: rgba(43, 18, 76, 0.7); }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) .br-hub-card { background: rgba(16, 76, 100, 0.6); border-color: rgba(198, 198, 208, 0.1); }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) .br-hub-card:hover { border-color: #D59D80; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) .br-hub-card .br-hub-card-icon { background-color: #C6C6D0; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) .br-hub-card:hover .br-hub-card-icon { background-color: #D59D80; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) .br-hub-card span { color: #C6C6D0; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) .br-settings-back-btn { background: rgba(16, 76, 100, 0.6); border-color: rgba(198, 198, 208, 0.1); color: #C6C6D0; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) .br-settings-back-btn:hover { background: #D59D80; color: #2B124C; border-color: #D59D80; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) .br-settings-title { color: #C6C6D0; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) .panel-tab-content h4 { color: #D59D80; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} .setting-group { background: rgba(16, 76, 100, 0.6); border-color: rgba(198, 198, 208, 0.1); }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} label { color: #C6C6D0; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} input[type="text"],
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} input[type="number"],
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} input[type="file"],
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} select,
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} textarea { background: rgba(13, 29, 37, 0.6); border-color: rgba(198, 198, 208, 0.2); color: #C6C6D0; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} input[type="text"]:focus,
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} input[type="number"]:focus,
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} select:focus,
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} textarea:focus { border-color: #D59D80; background: rgba(16, 76, 100, 0.6); }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} input[type="color"] { border-color: rgba(198, 198, 208, 0.2); }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} input[type="color"]:hover { border-color: #D59D80; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} input[type="checkbox"] { background: rgba(13, 29, 37, 0.6); border-color: rgba(198, 198, 208, 0.2); }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} input[type="checkbox"]::after { color: #2B124C; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} input[type="checkbox"]:checked { background: #D59D80; border-color: #D59D80; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} input[type="range"]::-webkit-slider-runnable-track { background: rgba(13, 29, 37, 0.6); }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} input[type="range"]::-webkit-slider-thumb { background: #C6C6D0; border-color: #D59D80; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} button.panel-btn { color: #C6C6D0; border-color: rgba(198, 198, 208, 0.1); background: rgba(16, 76, 100, 0.6); }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} button.panel-btn-save { background: #D59D80; border-color: #D59D80; color: #2B124C; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} button.panel-btn-reset:hover,
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} button.panel-btn-export:hover,
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} button.panel-btn-import:hover { border-color: #D59D80; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} button.panel-btn-add { background: rgba(213, 157, 128, 0.1); border-color: rgba(213, 157, 128, 0.3); color: #D59D80; }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) #${PANEL_ID} .sub-settings { border-left-color: #D59D80; background: rgba(13, 29, 37, 0.5); }
                #br-panel-wrapper:not([data-theme="classic_dark"]):not([data-theme="graphite_blurple"]):not([data-theme="pragmatic_grey"]):not([data-theme="clean_monochrome"]):not([data-theme="warm_sepia"]):not([data-theme="emerald_forest"]):not([data-theme="sunset_rose"]) .br-help-section strong { color: #D59D80; }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} {
                    background: linear-gradient(145deg, rgba(32, 34, 37, 0.6), rgba(40, 42, 47, 0.6));
                    border-color: rgba(234, 234, 234, 0.1);
                }
                #br-panel-wrapper[data-theme="classic_dark"] .br-hub-card {
                    background: linear-gradient(rgba(47, 49, 54, 0.5), rgba(50, 53, 59, 0.5));
                    border-color: rgba(234, 234, 234, 0.1);
                }
                #br-panel-wrapper[data-theme="classic_dark"] .br-hub-card:hover { border-color: #007BFF; }
                #br-panel-wrapper[data-theme="classic_dark"] .br-hub-card .br-hub-card-icon { background-color: #EAEAEA; }
                #br-panel-wrapper[data-theme="classic_dark"] .br-hub-card:hover .br-hub-card-icon { background-color: #007BFF; }
                #br-panel-wrapper[data-theme="classic_dark"] .br-hub-card span { color: #EAEAEA; }
                #br-panel-wrapper[data-theme="classic_dark"] .br-settings-back-btn { background: rgba(47, 49, 54, 0.5); border-color: rgba(234, 234, 234, 0.1); color: #EAEAEA; }
                #br-panel-wrapper[data-theme="classic_dark"] .br-settings-back-btn:hover { background: #007BFF; color: #FFFFFF; border-color: #007BFF; }
                #br-panel-wrapper[data-theme="classic_dark"] .br-settings-title { color: #EAEAEA; }
                #br-panel-wrapper[data-theme="classic_dark"] .panel-tab-content h4 { color: #007BFF; }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} .setting-group { background: rgba(47, 49, 54, 0.5); border-color: rgba(234, 234, 234, 0.1); }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} label { color: #EAEAEA; }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} input[type="text"],
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} input[type="number"],
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} input[type="file"],
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} select,
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} textarea { background: rgba(32, 34, 37, 0.5); border-color: rgba(234, 234, 234, 0.2); color: #EAEAEA; }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} input[type="text"]:focus,
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} input[type="number"]:focus,
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} select:focus,
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} textarea:focus { border-color: #007BFF; background: rgba(47, 49, 54, 0.5); }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} input[type="color"] { border-color: rgba(234, 234, 234, 0.2); }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} input[type="color"]:hover { border-color: #007BFF; }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} input[type="checkbox"] { background: rgba(32, 34, 37, 0.5); border-color: rgba(234, 234, 234, 0.2); }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} input[type="checkbox"]::after { color: #202225; }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} input[type="checkbox"]:checked { background: #007BFF; border-color: #007BFF; }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} input[type="range"]::-webkit-slider-runnable-track { background: rgba(32, 34, 37, 0.5); }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} input[type="range"]::-webkit-slider-thumb { background: #EAEAEA; border-color: #007BFF; }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} button.panel-btn { color: #EAEAEA; border-color: rgba(234, 234, 234, 0.1); background: rgba(47, 49, 54, 0.5); }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} button.panel-btn-save { background: #007BFF; border-color: #007BFF; color: #FFFFFF; }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} button.panel-btn-reset:hover,
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} button.panel-btn-export:hover,
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} button.panel-btn-import:hover { border-color: #007BFF; }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} button.panel-btn-add { background: rgba(0, 123, 255, 0.1); border-color: rgba(0, 123, 255, 0.3); color: #007BFF; }
                #br-panel-wrapper[data-theme="classic_dark"] #${PANEL_ID} .sub-settings { border-left-color: #007BFF; background: rgba(32, 34, 37, 0.5); }
                #br-panel-wrapper[data-theme="classic_dark"] .br-help-section strong { color: #007BFF; }

                                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} {
                    background: linear-gradient(145deg, rgba(44, 47, 51, 0.6), rgba(48, 51, 57, 0.6));
                    border-color: rgba(220, 221, 222, 0.1);
                }
                #br-panel-wrapper[data-theme="graphite_blurple"] .br-hub-card {
                    background: linear-gradient(rgba(54, 57, 63, 0.5), rgba(60, 63, 70, 0.5));
                    border-color: rgba(220, 221, 222, 0.1);
                }
                #br-panel-wrapper[data-theme="graphite_blurple"] .br-hub-card:hover { border-color: #7289DA; }
                #br-panel-wrapper[data-theme="graphite_blurple"] .br-hub-card .br-hub-card-icon { background-color: #DCDDDE; }
                #br-panel-wrapper[data-theme="graphite_blurple"] .br-hub-card:hover .br-hub-card-icon { background-color: #7289DA; }
                #br-panel-wrapper[data-theme="graphite_blurple"] .br-hub-card span { color: #DCDDDE; }
                #br-panel-wrapper[data-theme="graphite_blurple"] .br-settings-back-btn { background: rgba(54, 57, 63, 0.5); border-color: rgba(220, 221, 222, 0.1); color: #DCDDDE; }
                #br-panel-wrapper[data-theme="graphite_blurple"] .br-settings-back-btn:hover { background: #7289DA; color: #FFFFFF; border-color: #7289DA; }
                #br-panel-wrapper[data-theme="graphite_blurple"] .br-settings-title { color: #DCDDDE; }
                #br-panel-wrapper[data-theme="graphite_blurple"] .panel-tab-content h4 { color: #7289DA; }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} .setting-group { background: rgba(54, 57, 63, 0.5); border-color: rgba(220, 221, 222, 0.1); }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} label { color: #DCDDDE; }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} input[type="text"],
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} input[type="number"],
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} input[type="file"],
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} select,
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} textarea { background: rgba(44, 47, 51, 0.5); border-color: rgba(220, 221, 222, 0.2); color: #DCDDDE; }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} input[type="text"]:focus,
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} input[type="number"]:focus,
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} select:focus,
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} textarea:focus { border-color: #7289DA; background: rgba(54, 57, 63, 0.5); }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} input[type="color"] { border-color: rgba(220, 221, 222, 0.2); }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} input[type="color"]:hover { border-color: #7289DA; }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} input[type="checkbox"] { background: rgba(44, 47, 51, 0.5); border-color: rgba(220, 221, 222, 0.2); }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} input[type="checkbox"]::after { color: #2C2F33; }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} input[type="checkbox"]:checked { background: #7289DA; border-color: #7289DA; }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} input[type="range"]::-webkit-slider-runnable-track { background: rgba(44, 47, 51, 0.5); }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} input[type="range"]::-webkit-slider-thumb { background: #DCDDDE; border-color: #7289DA; }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} button.panel-btn { color: #DCDDDE; border-color: rgba(220, 221, 222, 0.1); background: rgba(54, 57, 63, 0.5); }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} button.panel-btn-save { background: #7289DA; border-color: #7289DA; color: #FFFFFF; }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} button.panel-btn-reset:hover,
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} button.panel-btn-export:hover,
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} button.panel-btn-import:hover { border-color: #7289DA; }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} button.panel-btn-add { background: rgba(114, 137, 218, 0.1); border-color: rgba(114, 137, 218, 0.3); color: #7289DA; }
                #br-panel-wrapper[data-theme="graphite_blurple"] #${PANEL_ID} .sub-settings { border-left-color: #7289DA; background: rgba(44, 47, 51, 0.5); }
                #br-panel-wrapper[data-theme="graphite_blurple"] .br-help-section strong { color: #7289DA; }

                                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} {
                    background: linear-gradient(145deg, rgba(31, 31, 31, 0.6), rgba(35, 35, 35, 0.6));
                    border-color: rgba(232, 234, 237, 0.1);
                }
                #br-panel-wrapper[data-theme="pragmatic_grey"] .br-hub-card {
                    background: linear-gradient(rgba(40, 42, 44, 0.5), rgba(44, 46, 48, 0.5));
                    border-color: rgba(232, 234, 237, 0.1);
                }
                #br-panel-wrapper[data-theme="pragmatic_grey"] .br-hub-card:hover { border-color: #8AB4F8; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] .br-hub-card .br-hub-card-icon { background-color: #E8EAED; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] .br-hub-card:hover .br-hub-card-icon { background-color: #8AB4F8; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] .br-hub-card span { color: #E8EAED; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] .br-settings-back-btn { background: rgba(40, 42, 44, 0.5); border-color: rgba(232, 234, 237, 0.1); color: #E8EAED; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] .br-settings-back-btn:hover { background: #8AB4F8; color: #1F1F1F; border-color: #8AB4F8; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] .br-settings-title { color: #E8EAED; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] .panel-tab-content h4 { color: #8AB4F8; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} .setting-group { background: rgba(40, 42, 44, 0.5); border-color: rgba(232, 234, 237, 0.1); }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} label { color: #E8EAED; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} input[type="text"],
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} input[type="number"],
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} input[type="file"],
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} select,
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} textarea { background: rgba(31, 31, 31, 0.5); border-color: rgba(232, 234, 237, 0.2); color: #E8EAED; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} input[type="text"]:focus,
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} input[type="number"]:focus,
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} select:focus,
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} textarea:focus { border-color: #8AB4F8; background: rgba(40, 42, 44, 0.5); }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} input[type="color"] { border-color: rgba(232, 234, 237, 0.2); }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} input[type="color"]:hover { border-color: #8AB4F8; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} input[type="checkbox"] { background: rgba(31, 31, 31, 0.5); border-color: rgba(232, 234, 237, 0.2); }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} input[type="checkbox"]::after { color: #1F1F1F; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} input[type="checkbox"]:checked { background: #8AB4F8; border-color: #8AB4F8; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} input[type="range"]::-webkit-slider-runnable-track { background: rgba(31, 31, 31, 0.5); }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} input[type="range"]::-webkit-slider-thumb { background: #E8EAED; border-color: #8AB4F8; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} button.panel-btn { color: #E8EAED; border-color: rgba(232, 234, 237, 0.1); background: rgba(40, 42, 44, 0.5); }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} button.panel-btn-save { background: #8AB4F8; border-color: #8AB4F8; color: #1F1F1F; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} button.panel-btn-reset:hover,
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} button.panel-btn-export:hover,
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} button.panel-btn-import:hover { border-color: #8AB4F8; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} button.panel-btn-add { background: rgba(138, 180, 248, 0.1); border-color: rgba(138, 180, 248, 0.3); color: #8AB4F8; }
                #br-panel-wrapper[data-theme="pragmatic_grey"] #${PANEL_ID} .sub-settings { border-left-color: #8AB4F8; background: rgba(31, 31, 31, 0.5); }
                #br-panel-wrapper[data-theme="pragmatic_grey"] .br-help-section strong { color: #8AB4F8; }

                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} {
                    background: linear-gradient(145deg, rgba(20, 20, 20, 0.6), rgba(26, 26, 26, 0.6));
                    border-color: rgba(255, 255, 255, 0.15);
                }
                #br-panel-wrapper[data-theme="clean_monochrome"] .br-hub-card {
                    background: linear-gradient(rgba(44, 44, 46, 0.5), rgba(50, 50, 52, 0.5));
                    border-color: rgba(255, 255, 255, 0.15);
                }
                #br-panel-wrapper[data-theme="clean_monochrome"] .br-hub-card:hover { border-color: #0A84FF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] .br-hub-card .br-hub-card-icon { background-color: #FFFFFF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] .br-hub-card:hover .br-hub-card-icon { background-color: #0A84FF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] .br-hub-card span { color: #FFFFFF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] .br-settings-back-btn { background: rgba(44, 44, 46, 0.5); border-color: rgba(255, 255, 255, 0.15); color: #FFFFFF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] .br-settings-back-btn:hover { background: #0A84FF; color: #FFFFFF; border-color: #0A84FF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] .br-settings-title { color: #FFFFFF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] .panel-tab-content h4 { color: #0A84FF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} .setting-group { background: rgba(44, 44, 46, 0.5); border-color: rgba(255, 255, 255, 0.15); }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} label { color: #FFFFFF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} input[type="text"],
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} input[type="number"],
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} input[type="file"],
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} select,
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} textarea { background: rgba(26, 26, 26, 0.5); border-color: rgba(255, 255, 255, 0.2); color: #FFFFFF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} input[type="text"]:focus,
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} input[type="number"]:focus,
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} select:focus,
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} textarea:focus { border-color: #0A84FF; background: rgba(44, 44, 46, 0.5); }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} input[type="color"] { border-color: rgba(255, 255, 255, 0.2); }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} input[type="color"]:hover { border-color: #0A84FF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} input[type="checkbox"] { background: rgba(26, 26, 26, 0.5); border-color: rgba(255, 255, 255, 0.2); }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} input[type="checkbox"]::after { color: #1A1A1A; }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} input[type="checkbox"]:checked { background: #0A84FF; border-color: #0A84FF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} input[type="range"]::-webkit-slider-runnable-track { background: rgba(26, 26, 26, 0.5); }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} input[type="range"]::-webkit-slider-thumb { background: #FFFFFF; border-color: #0A84FF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} button.panel-btn { color: #FFFFFF; border-color: rgba(255, 255, 255, 0.15); background: rgba(44, 44, 46, 0.5); }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} button.panel-btn-save { background: #0A84FF; border-color: #0A84FF; color: #FFFFFF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} button.panel-btn-reset:hover,
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} button.panel-btn-export:hover,
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} button.panel-btn-import:hover { border-color: #0A84FF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} button.panel-btn-add { background: rgba(10, 132, 255, 0.1); border-color: rgba(10, 132, 255, 0.3); color: #0A84FF; }
                #br-panel-wrapper[data-theme="clean_monochrome"] #${PANEL_ID} .sub-settings { border-left-color: #0A84FF; background: rgba(26, 26, 26, 0.5); }
                #br-panel-wrapper[data-theme="clean_monochrome"] .br-help-section strong { color: #0A84FF; }

                                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} {
                    background: linear-gradient(145deg, rgba(40, 36, 32, 0.6), rgba(45, 41, 37, 0.6));
                    border-color: rgba(216, 207, 192, 0.1);
                }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] .br-hub-card {
                    background: linear-gradient(rgba(59, 55, 51, 0.5), rgba(65, 61, 57, 0.5));
                    border-color: rgba(216, 207, 192, 0.1);
                }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] .br-hub-card:hover { border-color: #D9A066; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] .br-hub-card .br-hub-card-icon { background-color: #D8CFC0; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] .br-hub-card:hover .br-hub-card-icon { background-color: #D9A066; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] .br-hub-card span { color: #D8CFC0; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] .br-settings-back-btn { background: rgba(59, 55, 51, 0.5); border-color: rgba(216, 207, 192, 0.1); color: #D8CFC0; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] .br-settings-back-btn:hover { background: #D9A066; color: #282420; border-color: #D9A066; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] .br-settings-title { color: #D8CFC0; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] .panel-tab-content h4 { color: #D9A066; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} .setting-group { background: rgba(59, 55, 51, 0.5); border-color: rgba(216, 207, 192, 0.1); }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} label { color: #D8CFC0; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} input[type="text"],
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} input[type="number"],
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} input[type="file"],
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} select,
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} textarea { background: rgba(40, 36, 32, 0.5); border-color: rgba(216, 207, 192, 0.2); color: #D8CFC0; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} input[type="text"]:focus,
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} input[type="number"]:focus,
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} select:focus,
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} textarea:focus { border-color: #D9A066; background: rgba(59, 55, 51, 0.5); }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} input[type="color"] { border-color: rgba(216, 207, 192, 0.2); }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} input[type="color"]:hover { border-color: #D9A066; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} input[type="checkbox"] { background: rgba(40, 36, 32, 0.5); border-color: rgba(216, 207, 192, 0.2); }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} input[type="checkbox"]::after { color: #282420; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} input[type="checkbox"]:checked { background: #D9A066; border-color: #D9A066; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} input[type="range"]::-webkit-slider-runnable-track { background: rgba(40, 36, 32, 0.5); }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} input[type="range"]::-webkit-slider-thumb { background: #D8CFC0; border-color: #D9A066; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} button.panel-btn { color: #D8CFC0; border-color: rgba(216, 207, 192, 0.1); background: rgba(59, 55, 51, 0.5); }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} button.panel-btn-save { background: #D9A066; border-color: #D9A066; color: #282420; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} button.panel-btn-reset:hover,
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} button.panel-btn-export:hover,
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} button.panel-btn-import:hover { border-color: #D9A066; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} button.panel-btn-add { background: rgba(217, 160, 102, 0.1); border-color: rgba(217, 160, 102, 0.3); color: #D9A066; }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] #${PANEL_ID} .sub-settings { border-left-color: #D9A066; background: rgba(40, 36, 32, 0.5); }
                #br-panel-wrapper[data-theme="theme_warm_sepia"] .br-help-section strong { color: #D9A066; }

                                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} {
                    background: linear-gradient(145deg, rgba(34, 39, 37, 0.6), rgba(38, 44, 42, 0.6));
                    border-color: rgba(224, 224, 224, 0.1);
                }
                #br-panel-wrapper[data-theme="emerald_forest"] .br-hub-card {
                    background: linear-gradient(rgba(48, 54, 51, 0.5), rgba(52, 59, 55, 0.5));
                    border-color: rgba(224, 224, 224, 0.1);
                }
                #br-panel-wrapper[data-theme="emerald_forest"] .br-hub-card:hover { border-color: #2ECC71; }
                #br-panel-wrapper[data-theme="emerald_forest"] .br-hub-card .br-hub-card-icon { background-color: #E0E0E0; }
                #br-panel-wrapper[data-theme="emerald_forest"] .br-hub-card:hover .br-hub-card-icon { background-color: #2ECC71; }
                #br-panel-wrapper[data-theme="emerald_forest"] .br-hub-card span { color: #E0E0E0; }
                #br-panel-wrapper[data-theme="emerald_forest"] .br-settings-back-btn { background: rgba(48, 54, 51, 0.5); border-color: rgba(224, 224, 224, 0.1); color: #E0E0E0; }
                #br-panel-wrapper[data-theme="emerald_forest"] .br-settings-back-btn:hover { background: #2ECC71; color: #222725; border-color: #2ECC71; }
                #br-panel-wrapper[data-theme="emerald_forest"] .br-settings-title { color: #E0E0E0; }
                #br-panel-wrapper[data-theme="emerald_forest"] .panel-tab-content h4 { color: #2ECC71; }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} .setting-group { background: rgba(48, 54, 51, 0.5); border-color: rgba(224, 224, 224, 0.1); }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} label { color: #E0E0E0; }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} input[type="text"],
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} input[type="number"],
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} input[type="file"],
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} select,
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} textarea { background: rgba(34, 39, 37, 0.5); border-color: rgba(224, 224, 224, 0.2); color: #E0E0E0; }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} input[type="text"]:focus,
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} input[type="number"]:focus,
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} select:focus,
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} textarea:focus { border-color: #2ECC71; background: rgba(48, 54, 51, 0.5); }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} input[type="color"] { border-color: rgba(224, 224, 224, 0.2); }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} input[type="color"]:hover { border-color: #2ECC71; }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} input[type="checkbox"] { background: rgba(34, 39, 37, 0.5); border-color: rgba(224, 224, 224, 0.2); }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} input[type="checkbox"]::after { color: #222725; }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} input[type="checkbox"]:checked { background: #2ECC71; border-color: #2ECC71; }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} input[type="range"]::-webkit-slider-runnable-track { background: rgba(34, 39, 37, 0.5); }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} input[type="range"]::-webkit-slider-thumb { background: #E0E0E0; border-color: #2ECC71; }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} button.panel-btn { color: #E0E0E0; border-color: rgba(224, 224, 224, 0.1); background: rgba(48, 54, 51, 0.5); }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} button.panel-btn-save { background: #2ECC71; border-color: #2ECC71; color: #222725; }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} button.panel-btn-reset:hover,
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} button.panel-btn-export:hover,
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} button.panel-btn-import:hover { border-color: #2ECC71; }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} button.panel-btn-add { background: rgba(46, 204, 113, 0.1); border-color: rgba(46, 204, 113, 0.3); color: #2ECC71; }
                #br-panel-wrapper[data-theme="emerald_forest"] #${PANEL_ID} .sub-settings { border-left-color: #2ECC71; background: rgba(34, 39, 37, 0.5); }
                #br-panel-wrapper[data-theme="emerald_forest"] .br-help-section strong { color: #2ECC71; }


                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} {
                    background: linear-gradient(145deg, rgba(44, 25, 43, 0.6), rgba(50, 30, 48, 0.6));
                    border-color: rgba(233, 64, 87, 0.1);
                }
                #br-panel-wrapper[data-theme="sunset_rose"] .br-hub-card {
                    background: linear-gradient(rgba(66, 40, 64, 0.5), rgba(72, 45, 70, 0.5));
                    border-color: rgba(233, 64, 87, 0.15);
                }
                #br-panel-wrapper[data-theme="sunset_rose"] .br-hub-card:hover { border-color: #E94057; }
                #br-panel-wrapper[data-theme="sunset_rose"] .br-hub-card .br-hub-card-icon { background-color: #E0E0E0; }
                #br-panel-wrapper[data-theme="sunset_rose"] .br-hub-card:hover .br-hub-card-icon { background-color: #E94057; }
                #br-panel-wrapper[data-theme="sunset_rose"] .br-hub-card span { color: #E0E0E0; }
                #br-panel-wrapper[data-theme="sunset_rose"] .br-settings-back-btn { background: rgba(66, 40, 64, 0.5); border-color: rgba(233, 64, 87, 0.15); color: #E0E0E0; }
                #br-panel-wrapper[data-theme="sunset_rose"] .br-settings-back-btn:hover { background: #E94057; color: #FFFFFF; border-color: #E94057; }
                #br-panel-wrapper[data-theme="sunset_rose"] .br-settings-title { color: #E0E0E0; }
                #br-panel-wrapper[data-theme="sunset_rose"] .panel-tab-content h4 { color: #E94057; }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} .setting-group { background: rgba(66, 40, 64, 0.5); border-color: rgba(233, 64, 87, 0.15); }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} label { color: #E0E0E0; }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} input[type="text"],
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} input[type="number"],
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} input[type="file"],
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} select,
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} textarea { background: rgba(44, 25, 43, 0.5); border-color: rgba(233, 64, 87, 0.2); color: #E0E0E0; }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} input[type="text"]:focus,
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} input[type="number"]:focus,
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} select:focus,
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} textarea:focus { border-color: #E94057; background: rgba(66, 40, 64, 0.5); }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} input[type="color"] { border-color: rgba(233, 64, 87, 0.2); }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} input[type="color"]:hover { border-color: #E94057; }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} input[type="checkbox"] { background: rgba(44, 25, 43, 0.5); border-color: rgba(233, 64, 87, 0.2); }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} input[type="checkbox"]::after { color: #2C192B; }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} input[type="checkbox"]:checked { background: #E94057; border-color: #E94057; }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} input[type="range"]::-webkit-slider-runnable-track { background: rgba(44, 25, 43, 0.5); }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} input[type="range"]::-webkit-slider-thumb { background: #E0E0E0; border-color: #E94057; }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} button.panel-btn { color: #E0E0E0; border-color: rgba(233, 64, 87, 0.15); background: rgba(66, 40, 64, 0.5); }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} button.panel-btn-save { background: #E94057; border-color: #E94057; color: #FFFFFF; }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} button.panel-btn-reset:hover,
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} button.panel-btn-export:hover,
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} button.panel-btn-import:hover { border-color: #E94057; }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} button.panel-btn-add { background: rgba(233, 64, 87, 0.1); border-color: rgba(233, 64, 87, 0.3); color: #E94057; }
                #br-panel-wrapper[data-theme="sunset_rose"] #${PANEL_ID} .sub-settings { border-left-color: #E94057; background: rgba(44, 25, 43, 0.5); }
                #br-panel-wrapper[data-theme="sunset_rose"] .br-help-section strong { color: #E94057; }
.author-credit-link {

    display: block;
    width: 100%;
    text-align: center;
    padding: 10px 0;
    margin-bottom: 15px;
    border-bottom: 1px solid rgba(168, 214, 227, 0.1);

    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
    color: #a8d6e3;
    transition: all 0.2s ease-in-out;
    text-shadow: 0 0 5px rgba(168, 214, 227, 0.4);
}
.author-credit-link:hover {
    color: #ffffff;
    text-shadow: 0 0 10px #ffffff, 0 0 2px #000000;
    transform: translateY(-1px);
}
                          `;
            const styleElement = document.createElement('style');
            styleElement.id = staticStyleId;
            styleElement.type = 'text/css';
            styleElement.textContent = staticCss;
            (document.head || document.documentElement).appendChild(styleElement);
        } catch (e) {
            console.error('[BR Style] Ошибка внедрения статичных CSS ❌', e);
        }
    }

   function findMyUsername(retryCount = 0) {
        if (myUsername) return true;
        const userEl = document.querySelector('.p-nav-link--username');
        if (userEl) {
            myUsername = userEl.textContent.trim();
            if (myUsername) {
                console.log(`[BR Style] Никнейм пользователя определен: ${myUsername}`);
                if (settingsPanel) {
                    const usernameStatus = settingsPanel.querySelector('#my-username-status');
                    if (usernameStatus) usernameStatus.textContent = `Ваш ник: ${myUsername}`;
                }
                applyForumStyles(currentSettings);
                handleDynamicWelcome();
                return true;
            }
        }

        if (retryCount < 5) {
            setTimeout(() => findMyUsername(retryCount + 1), 500 + (retryCount * 500));
        }
        return false;
    }

        function findThreadAuthor() {
        if (threadAuthor) return;
        const firstPost = document.querySelector('.message[data-content-key="0"]');
        if (firstPost) {
            threadAuthor = firstPost.dataset.author;
            console.log(`[BR Style] Автор темы определен: ${threadAuthor}`);
            applyForumStyles(currentSettings);
            return;
        }
        const profileUsername = document.querySelector('.p-title-value');
        if (profileUsername && document.body.classList.contains('page--member-view')) {
             threadAuthor = profileUsername.textContent.trim();
             console.log(`[BR Style] Автор темы (на странице профиля): ${threadAuthor}`);
             applyForumStyles(currentSettings);
             return;
        }
    }
let liveForumPollInterval = null;
    let notifiedAdmins = new Set();
    let topicLastPostTimes = new Map();


   function fetchForumData(url, parserFunc) {
        return new Promise((resolve, reject) => {
            try {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            const parser = new DOMParser();
                            const htmlDoc = parser.parseFromString(response.responseText, "text/html");
                            parserFunc(htmlDoc);
                            resolve(true);
                        } else {
                            reject(new Error(`Status ${response.status}`));
                        }
                    },
                    onerror: function(response) {
                        reject(new Error(`Network error: ${response.statusText}`));
                    },
                    ontimeout: function() {
                        reject(new Error('Request timed out'));
                    }
                });
            } catch (e) {
                console.error('[BR Style Live] GM_xmlhttpRequest error:', e);
                reject(e);
            }
        });
    }


     function parseLiveCounters(htmlDoc) {
        if (!currentSettings.enableLiveCounters) return;

        const updateCounter = (selector, type) => {
            const el = document.querySelector(selector);
            if (!el) return;
            const newCountText = htmlDoc.querySelector(selector)?.textContent.trim() || '0';
            const newCount = parseInt(newCountText, 10) || 0;
            const currentCount = parseInt(el.textContent.trim(), 10) || 0;
            if (newCount > currentCount) {
                el.textContent = newCountText;
                el.classList.add('br-counter-pop');
                setTimeout(() => { el.classList.remove('br-counter-pop'); }, 700);
            } else if (newCount < currentCount) {
                 el.textContent = newCountText;
            }
            if (newCount === 0) {
                el.style.display = 'none';
            } else {
                 el.style.display = '';
            }
        };
        updateCounter('.p-nav-link--alerts .badge', 'alerts');
        updateCounter('.p-nav-link--conversations .badge', 'conversations');
    }
    function parseOnlineAdmins(htmlDoc) {
        if (!currentSettings.enableAdminOnlineToast || !currentSettings.adminToastNicks) return;
        const nicksToTrack = currentSettings.adminToastNicks
            .split('\n')
            .map(n => n.trim().toLowerCase())
            .filter(n => n.length > 0);

        if (nicksToTrack.length === 0) return;
        const onlineUsers = Array.from(htmlDoc.querySelectorAll('.memberListItem-name .username'))
            .map(el => el.textContent.trim().toLowerCase());
        for (const nick of onlineUsers) {
            if (nicksToTrack.includes(nick) && !notifiedAdmins.has(nick)) {
                const originalNick = htmlDoc.querySelector(`.memberListItem-name .username[data-xf-init="member-tooltip"][data-user-id][href*="${nick}"]`)?.textContent.trim() || nick;
                showToast(`⚡ ${originalNick} вошел на форум!`, 'info', 5000);
                notifiedAdmins.add(nick);
            }
        }
        notifiedAdmins.forEach(nick => {
            if (!onlineUsers.includes(nick)) {
                notifiedAdmins.delete(nick);
            }
        });
    }
   
  function parseHotTopics(htmlDoc) {
        if (!currentSettings.enableHotTopicPulse) return;
        const isTopicList = document.body.classList.contains('page--forum-view') || document.body.classList.contains('page--whats-new');
        if (!isTopicList) {
            topicLastPostTimes.clear();
            return;
        }
        const newTopicTimes = new Map();       htmlDoc.querySelectorAll('.structItem[data-thread-id]').forEach(newStructItem => {
            const threadId = newStructItem.dataset.threadId;
            if (!threadId) return;
            const lastPostTimeEl = newStructItem.querySelector('.structItem-cell--lastPost .structItem-startDate');
            const lastPostTime = lastPostTimeEl ? (lastPostTimeEl.dataset.time || lastPostTimeEl.textContent.trim()) : '0';
            newTopicTimes.set(threadId, lastPostTime);
            const oldTime = topicLastPostTimes.get(threadId);

            if (oldTime === undefined) {
                 topicLastPostTimes.set(threadId, lastPostTime);
            } else if (oldTime !== lastPostTime) {
                const localStructItem = document.querySelector(`.structItem[data-thread-id="${threadId}"]`);
                if (localStructItem) {                   localStructItem.classList.add('br-hot-topic-pulse');
                    setTimeout(() => {                        localStructItem.classList.remove('br-hot-topic-pulse');
                    }, 1000);
                }
                topicLastPostTimes.set(threadId, lastPostTime);
            }
        });
        topicLastPostTimes.forEach((time, threadId) => {
            if (!newTopicTimes.has(threadId)) {
                topicLastPostTimes.delete(threadId);
            }
        });
    }

   function parseLiveFeed(htmlDoc) {
        if (!currentSettings.enableLiveFeed) return;
        const feedContainer = document.getElementById('br-live-feed-container');
        if (!feedContainer) return;
        const tickerContainer = feedContainer.querySelector('.br-live-feed-ticker');
        if (!tickerContainer) return;
        tickerContainer.innerHTML = '';
        const items = htmlDoc.querySelectorAll('.structItem.js-activityStream-item');
        let count = 0;
        for (const item of items) {
            if (count >= 2) break;
            const titleEl = item.querySelector('.structItem-title a[data-tp-primary="on"]');
            const userEl = item.querySelector('.structItem-minor .username');
            if (titleEl && userEl) {
                const title = titleEl.textContent.trim();
                const user = userEl.textContent.trim();
                const feedItem = document.createElement('div');
                feedItem.className = 'br-live-feed-item';
                feedItem.innerHTML = `<span class="br-live-feed-item-title" title="${title}">${title}</span> <span class="br-live-feed-item-user">by ${user}</span>`;
                tickerContainer.appendChild(feedItem);
                        count++;
                    }
                }
                if (count > 0) {
                    const itemsClone = Array.from(tickerContainer.children).map(child => child.cloneNode(true));
                    itemsClone.forEach(clone => tickerContainer.appendChild(clone));
                }
            }


    function startLiveForumPollers() {
        if (liveForumPollInterval) {
            clearTimeout(liveForumPollInterval);
            liveForumPollInterval = null;
        }

        const poll = async () => {
            const tasks = [];
            if (currentSettings.enableLiveCounters) {
                tasks.push(fetchForumData(window.location.href, parseLiveCounters).catch(e => console.error("[BR Style] Ошибка live counters:", e)));
            }
            if (currentSettings.enableAdminOnlineToast) {
                tasks.push(fetchForumData('https://forum.blackrussia.online/index.php?online/list', parseOnlineAdmins).catch(e => console.error("[BR Style] Ошибка admin online:", e)));
            }
            if (currentSettings.enableHotTopicPulse && (document.body.classList.contains('page--forum-view') || document.body.classList.contains('page--whats-new'))) {
                tasks.push(fetchForumData(window.location.href, parseHotTopics).catch(e => console.error("[BR Style] Ошибка hot topics:", e)));
            }
            if (currentSettings.enableLiveFeed) {
                tasks.push(fetchForumData('https://forum.blackrussia.online/index.php?whats-new/latest-activity', parseLiveFeed).catch(e => console.error("[BR Style] Ошибка live feed:", e)));
            }

            await Promise.all(tasks);

            const interval = Math.max(30, currentSettings.liveUpdateInterval || 60) * 1000;
            if (liveForumPollInterval !== null) {
                liveForumPollInterval = setTimeout(poll, interval);
            }
        };

        liveForumPollInterval = 0;
        poll();
    }
     function setupLikeAnimations() {
        if (!currentSettings.enableLikeAnimations) return;

        document.body.addEventListener('click', (e) => {
            const likeButton = e.target.closest('a.reaction');
            if (likeButton && likeButton.dataset.reactionId === '1') {
                const rect = likeButton.getBoundingClientRect();
                const popEl = document.createElement('div');
                popEl.className = 'br-like-pop';
                popEl.textContent = '❤️';
                popEl.style.left = `${rect.left + rect.width / 2 - 15}px`;
                popEl.style.top = `${rect.top - 20}px`;
                document.body.appendChild(popEl);
                setTimeout(() => {
                    popEl.remove();
                }, 600);
            }
        });
    }


     function handleDynamicWelcome() {
        if (!currentSettings.enableDynamicWelcome || !myUsername) return;
        const seenWelcomeKey = 'br_style_seen_welcome_today';
        const today = new Date().toLocaleDateString();
        const lastSeen = GM_getValue(seenWelcomeKey, '');
        if (lastSeen === today) return;
        const hour = new Date().getHours();
        let greeting = 'Привет';
        if (hour >= 5 && hour < 12) {
            greeting = 'Доброе утро';
        } else if (hour >= 12 && hour < 18) {
            greeting = 'Добрый день';
        } else if (hour >= 18 && hour < 23) {
            greeting = 'Добрый вечер';
        } else {
            greeting = 'Доброй ночи';
        }
        showToast(`👋 ${greeting}, ${myUsername}!`, 'info', 4000);
        GM_setValue(seenWelcomeKey, today);
    }
const MODAL_OVERLAY_ID = 'br-style-copy-modal-v1';

     function showCopyModal(bbCode) {
        if (document.getElementById(MODAL_OVERLAY_ID)) return;

        const modalOverlay = document.createElement('div');
        modalOverlay.id = MODAL_OVERLAY_ID;
        modalOverlay.className = 'br-style-modal-overlay';

        modalOverlay.innerHTML = `
            <div class="br-style-modal-content">
                <h4>✅ Скриншот загружен!</h4>
                <input type="text" id="br-style-modal-input" readonly>
                <div class="br-style-modal-buttons">
                    <button id="br-style-modal-copy-btn" class="br-style-modal-copy">Скопировать</button>
                    <button id="br-style-modal-close-btn" class="br-style-modal-close">Закрыть</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalOverlay);
        const input = modalOverlay.querySelector('#br-style-modal-input');
        const copyBtn = modalOverlay.querySelector('#br-style-modal-copy-btn');
        const closeBtn = modalOverlay.querySelector('#br-style-modal-close-btn');
        input.value = bbCode;
        input.select();

        const closeModal = () => {
            if (modalOverlay.parentNode) {
                modalOverlay.parentNode.removeChild(modalOverlay);
            }
        };
        copyBtn.addEventListener('click', () => {
            input.select();
            try {
                navigator.clipboard.writeText(bbCode).then(() => {
                    copyBtn.textContent = 'Скопировано!';
                    copyBtn.style.backgroundColor = '#4CAF50';
                    setTimeout(closeModal, 700);
                }, () => {
                    document.execCommand('copy');
                    copyBtn.textContent = 'Скопировано!';
                    copyBtn.style.backgroundColor = '#4CAF50';
                    setTimeout(closeModal, 700);
                });
            } catch (err) {
                prompt('Ошибка. Скопируйте вручную:', bbCode);
                closeModal();
            }
        });
        closeBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }
        const MAX_HISTORY_SIZE = 20;

     async function addUploadToHistory(bbCode) {
        if (!bbCode) return;
        try {
            const entry = {
                bbcode: bbCode,
                date: new Date().toISOString()
            };
            let history = [];
            try {
                history = JSON.parse(await GM_getValue(UPLOAD_HISTORY_KEY, '[]'));
                if (!Array.isArray(history)) history = [];
            } catch (e) {
                history = [];
            }
            history.unshift(entry);
            history = history.slice(0, MAX_HISTORY_SIZE);
            await GM_setValue(UPLOAD_HISTORY_KEY, JSON.stringify(history));
        } catch (e) {
            console.error('[BR Style] Ошибка сохранения истории загрузок:', e);
        }
    }

     async function loadUploadHistory() {
    if (!settingsPanel) return;
    const container = settingsPanel.querySelector('#br-upload-history-container');
    if (!container) return;

    container.innerHTML = `
        <div class="br-skeleton-loader"></div>
        <div class="br-skeleton-loader" style="width: 80%;"></div>
        <div class="br-skeleton-loader" style="width: 90%;"></div>
    `;

    let history = [];
        try {
            history = JSON.parse(await GM_getValue(UPLOAD_HISTORY_KEY, '[]'));
            if (!Array.isArray(history)) history = [];
        } catch (e) {
            history = [];
        }

        if (history.length === 0) {
            container.innerHTML = '<p style="font-size: 12px; color: #888; text-align: center;">История загрузок пуста.</p>';
            return;
        }

        container.innerHTML = '';
        history.forEach(entry => {
            const date = new Date(entry.date);
            const dateString = date.toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric' });
            const item = document.createElement('div');
            item.className = 'br-history-item';
            item.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 6px; border-bottom: 1px solid rgba(198, 198, 208, 0.1); font-size: 12px; gap: 8px;';
            item.innerHTML = `
                <code style="background: #104C64; padding: 3px 6px; border-radius: 4px; color: #D59D80; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;" title="${entry.bbcode}">${entry.bbcode}</code>
                <span style="color: #888; white-space: nowrap; margin-left: auto;">${dateString}</span>
                <button class="br-history-copy-btn" title="Скопировать BB-код" style="background: #104C64; border: 1px solid rgba(198, 198, 208, 0.1); color: #C6C6D0; font-size: 11px; padding: 3px 7px; border-radius: 4px; cursor: pointer; flex-shrink: 0;">📋</button>
            `;
            item.querySelector('.br-history-copy-btn').addEventListener('click', (e) => {
                e.preventDefault();
                navigator.clipboard.writeText(entry.bbcode);
                showToast('BB-код скопирован!', 'success');
            });
            container.appendChild(item);
        });
    }

       function setupScreenshotUploader(textEditor) {
        if (!textEditor || textEditor.dataset.brUploaderAttached) {
            return;
        }
        textEditor.dataset.brUploaderAttached = 'true';

        const apiKey = currentSettings.imgbbApiKey;
        if (!apiKey) {
            return;
        }
        const ICON_URL = 'https://i.postimg.cc/c1m7TjfC/517c8ce85483ff710c49936c45fdc1a1.gif';
        const LOADING_GIF_URL = 'https://i.postimg.cc/cJydvFkx/fc5dd7e93fd1f4037fb311e79ccb740e.gif';
const BUTTON_BG_URL = currentSettings.uploaderBtnBgUrl;

        const uploadButton = document.createElement('button');
        const originalButtonHTML = `<img src="${ICON_URL}" style="width:16px; height:16px; vertical-align:middle; margin-right:8px; filter: brightness(0.9);"> Загрузить (ImgBB)`;

        uploadButton.innerHTML = originalButtonHTML;
        uploadButton.className = 'button br-upload-button';
        uploadButton.style.color = 'white';
        uploadButton.style.fontWeight = 'bold';
        uploadButton.style.border = '1px solid #C0392B';
        uploadButton.style.padding = '6px 12px';
        uploadButton.style.borderRadius = '5px';
        uploadButton.style.cursor = 'pointer';
        uploadButton.style.fontSize = '14px';
        uploadButton.style.transition = 'background-color 0.2s';
        uploadButton.style.textAlign = 'center';
        uploadButton.style.display = 'block';
        uploadButton.style.margin = '5px auto 0 auto';

     if (BUTTON_BG_URL && isValidURL(BUTTON_BG_URL)) {
    uploadButton.style.backgroundImage = `url('${BUTTON_BG_URL}')`;
    uploadButton.style.backgroundSize = 'cover';
    uploadButton.style.backgroundPosition = 'center';
} else {
    uploadButton.style.backgroundColor = '#E74C3C';
}
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        const uploadImage = (file) => {

            uploadButton.innerHTML = `
                <img src="${LOADING_GIF_URL}" style="width: 24px; height: 24px; display: block; margin: 0 auto 5px;">
                <span style="font-size: 12px; color: #eee;">Загрузка...</span>
            `;
            uploadButton.disabled = true;
            uploadButton.style.backgroundColor = '#5a5a5a';
            uploadButton.style.backgroundImage = 'none';

            const formData = new FormData();
            formData.append('image', file);

            GM_xmlhttpRequest({
                method: 'POST',
                url: `https://api.imgbb.com/1/upload?key=${apiKey}`,
                data: formData,
                headers: { "Accept": "application/json" },
                onload: function(response) {
                    uploadButton.innerHTML = originalButtonHTML;
                    uploadButton.disabled = false;
                   if (BUTTON_BG_URL && isValidURL(BUTTON_BG_URL)) {
    uploadButton.style.backgroundImage = `url('${BUTTON_BG_URL}')`;
} else {
    uploadButton.style.backgroundColor = '#8B0000';
}
                    try {
                        const json = JSON.parse(response.responseText);
                        if (json.success) {
                            const imageUrl = json.data.url;
                            const bbCode = `[IMG]${imageUrl}[/IMG]`;

                            addUploadToHistory(bbCode);
                            showCopyModal(bbCode);

                        } else {
                            throw new Error(json.error.message);
                        }
                    } catch (e) {
                        console.error('[BR Style Uploader] Ошибка❌:', e);
                        showToast(`Ошибка загрузки: ${e.message}`, 'error');
                    }
                },
                onerror: function(response) {
                    uploadButton.innerHTML = originalButtonHTML;
                    uploadButton.disabled = false;

                    if (BUTTON_BG_URL && isValidURL(BUTTON_BG_URL)) {
    uploadButton.style.backgroundImage = `url('${BUTTON_BG_URL}')`;
} else {
    uploadButton.style.backgroundColor = '#8B0000';
}

                    showToast('Ошибка сети при загрузке (ImgBB)', 'error');
                }
            });
        };
        textEditor.addEventListener('paste', (e) => {
            if (e.clipboardData && e.clipboardData.files.length > 0) {
                const file = e.clipboardData.files[0];
                if (file.type.startsWith('image/')) {
                    e.preventDefault();
                    uploadImage(file);
                }
            }
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                uploadImage(fileInput.files[0]);
                fileInput.value = '';
            }
        });

        uploadButton.onclick = (e) => {
            e.preventDefault();
            fileInput.click();
        };

        textEditor.parentNode.insertBefore(uploadButton, textEditor.nextSibling);
        textEditor.parentNode.insertBefore(fileInput, uploadButton.nextSibling);
    }

    function findAndAttachUploader() {
        if (!currentSettings.imgbbApiKey) return;

        const quickReplyEditor = document.querySelector('.js-quickReply .js-editor');
        if (quickReplyEditor) {
            setupScreenshotUploader(quickReplyEditor);
        }       document.querySelectorAll('textarea[name="message"]').forEach(setupScreenshotUploader);
    }
   function runComplaintTracker() {
        if (!currentSettings.enableComplaintTracker) return;

        const targetUrlParts = (currentSettings.complaintTrackerSections || '').split(',').map(s => s.trim().toLowerCase()).filter(s => s);
const currentUrl = decodeURIComponent(window.location.href).toLowerCase();
const pathname = window.location.pathname;

const isMainForumPage = (pathname === '/forum/' || pathname === '/forum/index.php' || pathname === '/');
const isTargetSection = targetUrlParts.some(part => currentUrl.includes(part));

if (!isMainForumPage && !isTargetSection) return;

        const CLOSED_PREFIXES = ['закрыто', 'одобрено', 'отказано', 'решено', 'рассмотрено', 'тестирование'];
        const TIME_WARN = currentSettings.complaintTrackerWarnTime || 12;
        const TIME_CRIT = currentSettings.complaintTrackerCritTime || 24;

        function showCopyToast(text) {
            const toast = document.createElement('div');
            toast.className = 'br-copy-tooltip';
            toast.innerHTML = `📋 ${text}`;
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }, 1500);
        }
        function getBadgeConfig(item, hours) {
            const isPinned = item.querySelector('.structItem-status--sticky');
            const label = item.querySelector('.label');
            const labelText = label ? label.textContent.toLowerCase() : '';
            const isLocked = item.querySelector('.structItem-status--locked');
            const isClosedPrefix = CLOSED_PREFIXES.some(p => labelText.includes(p));
            const isClosed = isLocked || isClosedPrefix;

            if (!isPinned && isClosed) {
                return null;
            }
            if (isPinned && hours < TIME_WARN) return { class: 'br-flow-pinned-ok', icon: '📌' };

            if (hours < TIME_WARN) return { class: 'br-flow-fresh', icon: '⏱' };
            if (hours < TIME_CRIT) return { class: 'br-flow-warn', icon: '⏳' };
            return { class: 'br-flow-crit', icon: '🔥' };
        }
        const threads = document.querySelectorAll('.structItem');

        threads.forEach(thread => {
            if (thread.querySelector('.br-neon-badge')) return;
            const times = Array.from(thread.querySelectorAll('time'));
            if (times.length === 0) return;
            let maxTime = 0;
            times.forEach(t => {
                const val = parseInt(t.getAttribute('data-time'));
                if (val > maxTime) maxTime = val;
            });
            const diff = Date.now() - (maxTime * 1000);
            const hoursTotal = diff / (1000 * 60 * 60);

            let timeStr;
            if (hoursTotal >= 24) {
                const d = Math.floor(hoursTotal / 24);
                const h = Math.floor(hoursTotal % 24);
                timeStr = `${d}д ${h}ч`;
            } else {
                const h = Math.floor(hoursTotal);
                const m = Math.floor((hoursTotal - h) * 60);
                timeStr = `${h}ч ${m}м`;
            }
            const config = getBadgeConfig(thread, hoursTotal);
            if (!config) return;
            const badge = document.createElement('span');
            badge.className = 'br-neon-badge ' + config.class;
            badge.title = 'Нажми, чтобы скопировать ссылку';
            badge.innerText = `${config.icon} ${timeStr}`;

            badge.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const link = thread.querySelector('.structItem-title a[data-tp-primary]');
                if (link) {
                    const fullUrl = link.href;
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(fullUrl);
                    } else {
                        GM_setClipboard(fullUrl);
                    }
                    showCopyToast('Ссылка скопирована!');
                }
            };
            const titleContainer = thread.querySelector('.structItem-title');
            const link = titleContainer.querySelector('a[data-tp-primary]');

            if (link) {
                titleContainer.insertBefore(badge, link);
            }
        });
    }




 const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
    const RESHENO_PREFIX = 6; // Префикс "Решено"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const GA_PREFIX = 12; // Префикс "Главному Администратору"
    const COMMAND_PREFIX = 10; // Префикс "Команде Проекта"
    const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const SPECIAL_PREFIX = 11; // Префикс "Специальному Администратору"

const buttons = [
        {
      title: `----------------------------------------------------> АДМИН РАЗДЕЛ <---------------------------------------------------------`,
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',

},
     {
	  title: `Неактивы`,
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5)',
	  content:
		`[CENTER][COLOR=rgb(0, 255, 127)][FONT=Trebuchet MS] Уважаемая Администрация! Сообщаю вам, что ваши заявления на неактив были успешно проверены![/COLOR]<br><br>`+
        `[COLOR=rgb(255, 0, 0)] С уважением, Руководство Сервера.[/FONT][/COLOR][/CENTER]`,
          prefix: 123,
	  status: false,
     },
     {
	  title: `Доп. Баллы`,
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5)',
	  content:
		`[CENTER][COLOR=rgb(0, 255, 127)][FONT=Trebuchet MS] Уважаемая Администрация! Сообщаю вам, что ваши доп. баллы были успешно проверены![/COLOR]<br><br>`+
        `[COLOR=rgb(255, 0, 0)]С уважением, Руководство Сервера.[/FONT][/COLOR][/CENTER]`,
          prefix: 123,
	  status: false,
     },
     {
	  title: `Имущество`,
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5)',
	  content:
		`[CENTER][COLOR=rgb(0, 255, 127)][FONT=Trebuchet MS] Уважаемая Администрация! Сообщаю вам, что ваши заявления покупку/продажу/обмен имущества были успешно проверены и одобрены![/COLOR]<br><br>`+
        `Отказанные заявки перечислил выше. Все взаимодействия с имуществом после 22:00, при репорте меньше 10.<br><br>`+
        `[COLOR=rgb(255, 0, 0)]С уважением, Руководство Сервера.[/FONT][/COLOR][/CENTER]`,
          prefix: 123,
	  status: false,
     },
     {
	  title: `Снятие наказаний`,
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5)',
	  content:
		`[CENTER][COLOR=rgb(0, 255, 127)][FONT=Trebuchet MS] Уважаемая Администрация! Сообщаю вам, что ваши заявления на снятие наказаний были проверены и одобрены! Отказанные заявки отметил выше.[/COLOR]<br><br>`+
        `[COLOR=rgb(255, 0, 0)]С уважением, Руководство Сервера.[/FONT][/COLOR][/CENTER]`,
          prefix: 123,
	  status: false,
     },

{
      title: `-------------------------------------------> ПЕРЕАДРЕСАЦИИ <----------------------------------------------------------------`,
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',

},
    {
      title: `Жалобу в адм раздел`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Вам нужно обратиться в раздел жалоб на Администрацию → [/ICODE] [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.3482/']*Кликабельно*[/URL][/SIZE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `В раздел ОБЖ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Вам нужно обратиться в раздел Обжалование → [/ICODE] [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.3485/']*Кликабельно*[/URL][/SIZE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
	  title: `В раздел жалоб на игроков`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
                 "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Вам нужно обратиться в раздел жалоб на игроков  → [/ICODE] [URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.3484/']*Кликабельно*[/URL][/SIZE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `В раздел жалоб на лидеров`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
          "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Вам нужно обратиться в раздел жалоб на лидеров  → [/ICODE] [URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.3483/']*Кликабельно*[/URL][/SIZE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
        prefix: CLOSE_PREFIX,
        status: false,
	},
    {
      title: `Жалобу на теха`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Вам нужно обратиться в раздел жалоб на технических специалистов → [/ICODE] [URL='https://forum.blackrussia.online/forums/Сервер-№78-vladimir.3463/']*Кликабельно*[/URL][/SIZE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
      title: `В Технический раздел`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Вам нужно обратиться в Технический раздел → [/ICODE] [URL='https://forum.blackrussia.online/forums/Технический-раздел-vladimir.3464/']*Кликабельно*[/URL][/SIZE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
        prefix: CLOSE_PREFIX,
        status: false,
    },
         {
     title: '--------------------------------------------->Передам(жб) <----------------------------------------------------------------',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',

    },
        {
      title: 'для сакаро',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Ваша жалоба была передана на рассмотрение [/ICODE][COLOR=#00FFFF][ICODE]Руководителю Модерации Дискорда.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: PIN_PREFIX,
	  status: true,
    },
    {
	  title: `Передать ЗГА ГОСС & ОПГ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
                 "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Передаю вашу жалобу [/ICODE][COLOR=#FF0000][ICODE]Заместителю Главного Администратора по направлению ГОСС & ОПГ. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: `Передать  ОЗГА`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
                         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Передаю вашу жалобу[/ICODE][COLOR=#FF0000][ICODE] Основному Заместителю Главного Администратора. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: `Передать ГА`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
           "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Передаю вашу жалобу[/ICODE][COLOR=#FF0000][ICODE] Главному Администратору. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: `Спец. Админ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Ваша жалоба передана[/ICODE][COLOR=#FF0000][ICODE] Специальной Администрации. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: SPECIAL_PREFIX,
      status: true,
    },
        {
     title: '----------------------------------------> Передам(ОБЖ) <----------------------------------------------------------------',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',

    },
         {
      title: 'для сакаро',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Ваша жалоба была передана на рассмотрение [/ICODE][COLOR=#00FFFF][ICODE]Руководителю Модерации Дискорда.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: PIN_PREFIX,
	  status: true,
    },
        {
	  title: `Передать ГА`,
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
           "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Передаю вашу жалобу[/ICODE][COLOR=#FF0000][ICODE] Главному Администратору. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: GA_PREFIX,
	  status: true,
    },
           {
      title: `Спец. Админ`,
               dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Ваша жалоба передана[/ICODE][COLOR=#FF0000][ICODE] Специальной Администрации. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: SPECIAL_PREFIX,
      status: true,
    },
         {
     title: '--------------------------------------->на рассмотрении <----------------------------------------------------------------',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',

    },
        {
        title: `На рассмотрении(обжалование)`,
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Ваше обжалование взято  [/ICODE][COLOR=#FFFF00][ICODE]на рассмотрение. [/ICODE][/COLOR]<br>[ICODE] Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFF00[ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
         prefix: PIN_PREFIX,
      status: true,
        },
             {
      title: `На рассмотрении(жб)`,
                 dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
               "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Ваша жалоба взята [/ICODE][COLOR=#FFFF00][ICODE]на рассмотрение. [/ICODE][/COLOR]<br>[ICODE] Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFF00][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
              prefix: PIN_PREFIX,
      status: true,
    },
          {
      title: `ссылку на жб`,
              dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
                "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Прикрепите ссылку на данную жалобу в течении 24 часов.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFF00][ICODE]На рассмотрении.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
       prefix: PIN_PREFIX,
      status: 123,
    },

        {
      title: `ссылку на вк`,
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
        "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Прикрепите ссылку на вашу страницу в ВК.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFF00][ICODE]На рассмотрении.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
              prefix: PIN_PREFIX,
      status: 123,
    },
        {
     title: '---------------------------------------------------------> ДОКИ <----------------------------------------------------------------',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',

    },
         {
       title: `запрошу доки`,
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
        "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Запрошу доказательства у администратора.[/ICODE][COLOR=#FFFF00][ICODE]Ожидайте. [/ICODE][/COLOR]<br>[ICODE] пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
        prefix: PIN_PREFIX,
	  status: true,
        },
        {
      title: 'выдано верно',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
                 "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Проверив доказательства администратора, было принято решение, что наказание было выдано верно.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
              prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'выдано не верно',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
                            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В следствие беседы с администратором, было выяснено, что наказание было выдано по ошибке. <br> Ваше наказание будет снято.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
             prefix: ACCEPT_PREFIX,
	  status: false,
    },

{
	   title: `---------------------------------> Раздел Жалоб на администрацию <--------------------------------------`,
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',

},
        {
      title: 'будет проинструктирован',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Дублирование темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
	  status: false,
    },
        {
      title: 'проведу беседу',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша жалоба была одобрена и будет проведена беседа с администратором. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
	  status: false,
    },
        {
      title: 'проведу строгую беседу',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
               "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша жалоба была одобрена и будет проведена строгая беседа с администратором. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
             prefix: ACCEPT_PREFIX,
	  status: false,
    },
        {
      title: 'Адм будет наказан',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]]Ваша жалоба была одобрена и администратор получит наказание. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
             prefix: ACCEPT_PREFIX,
	  status: false,
    },

        {
      title: 'не по форме',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию -[/ICODE] [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']*Тык*[/URL] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
               prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'Нет /time',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
               "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В предоставленных доказательствах отсутствует /time.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
              prefix: CLOSE_PREFIX,
	  status: false,
    },
         {
      title: 'Нет /myreports',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
              "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В предоставленных доказательствах отсутствует /myreports.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
             prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'От 3 лица',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Жалобы написанные от 3-его лица не подлежат рассмотрению.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
              prefix: CLOSE_PREFIX,
	  status: false,
    },
         {
      title: 'Нужен фрапс',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
              "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
              prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'Фрапс обрывается',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
               "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
             prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'Дока-во отредактированы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Представленные доказательства были отредактированны, пожалуйста прикрепите оригинал.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'Прошло более 48 часов',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]С момента выдачи наказания прошло более 48-ми часов, жалоба не подлежит рассмотрению.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
             prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'нет строки выдачи наказания',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]На ваших доказательствах отсутствует строка с выдачей наказания.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'нет окна бана',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]На ваших доказательствах отсутствует окно блокировки аккаунта. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
             prefix: CLOSE_PREFIX,
	  status: false,
    },
         {
      title: 'нет докв',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
              "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В вашей жалобе отсутствуют доказательства. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
              prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'не работают доки',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Предоставленные доказательства не рабочие. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'дубликат',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
              "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Дублирование темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },

        {
      title: 'нет нарушений',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Исходя из выше приложенных доказательств, нарушения со стороны администратора - не имеется! [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'адм снят/псж',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Администратор был снят/ушел с поста администратора.  [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
	  title: 'ошиблись сервером',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Вы ошиблись сервером. <br>Обратитесь в раздел жалоб на администрацию вашего сервера.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
	  title: 'нет ссылки на жб',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Нет ссылки на данную жалобу.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
	  title: 'не написал ник',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игровой ник автора жалобы, ник администратора, на которого подается жалоба, дата выдачи наказания должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
	  title: 'перезагрузи роутер',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Перезагрузите роутер.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },

{
            title: `---------------------------------> ОБЖАЛОВАНИЯ <------------------------------------------------------------------`,
           dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',
},
    {
      title: `Сократить наказание`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
        "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваше обжалование одобрено. Наказание будет снижено[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Снять наказание`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
          "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваше обжалование одобрено, наказание будет полностью снято.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Обжалование на рассмотрении`,
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша тема взята на рассмотрение. Пожалуйста, не создавайте её копии.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ffffff][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: PIN_PREFIX,
      status: true,
    },
    {
	  title: `Смена ника`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
          "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваш аккаунт будет разблокирован на 24 часа. За это время вы должны успеть поменять свой игровой nickname через /mm -> Смена имени или через /donate. После чего пришлите в данную тему скриншот с доказательтвом того, что вы изменили его. Если он не будет изменён, то аккаунт будет обратно заблокирован.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFF00][ICODE]На рассмотрении.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: `NonRP обман (разбан на 24 часа)`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
          "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Аккаунт разблокирован на 24 часа. За это время ущерб должен быть возмещен обманутой стороне в полном объёме.<br>Прикрепите фрапс обмена с /time в данную тему. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ffffff][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: PIN_PREFIX,
	  status: true,
    },
  
    {
      title: `ОБЖ не подлежит`,
           dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
                 "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Данное наказание не подлежит обжалованию.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `NonRP обман (не тот написал)`,
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
        "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Если вы готовы возместить ущерб обманутой стороне, то самостоятельно свяжитесь с игроком в любым способом.<br>Для возврата имущества он должен оформить обжалование.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Обж не по форме`,
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Обжалование составлено не по форме, ознакомьтесь с правилами подачи обжалований →.[/ICODE][URL='https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Кликабельно*[/URL]. <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Нет док-в в ОБЖ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В вашем обжаловании отсутствуют доказательства для дальнейшего расмотрения.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Нерабочие док-ва в ОБЖ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
        "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В вашем обжаловании не работают доказательства.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Дублирование ОБЖ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
                "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ответ был дан в прошлой теме. Напоминаю, что за дублирование тем ваш форумный аккаунт будет заблокирован.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `ОБЖ уже на рассмотрении`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
                     "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Уже одно подобное обжалование от вашего лица находится на рассмотрении у Руководства сервера.<br>Пожалуйста, прекратите создавать повторяющиеся темы.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Неадекват ОБЖ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
          "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Обжалование составлено в неадекватном формате. Рассмотрению не подлежит.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Нет ссылки на VK`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В вашем обжаловании отсутствует ссылка на вашу страницу VK. Прикрепите ее в следующем обращении для дальнейшего рассмотрения.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
        {
      title: `вам надо  связаться в соц сетях`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]«Если вы хотите обжаловать данную блокировку вам необходимо связаться в соц сетях с игроком которого вы обманули и договориться о возврате имущества»[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
	  title: `Обж для ГА`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
        "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Передаю ваше обжалование Главному Администратору[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: `ОБЖ для Спец. Админ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваше обжалование передано Специальной Администрации на рассмотрение[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: SPECIAL_PREFIX,
      status: true,
    },
     {
      title: `нету окна бана ОБЖ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]На ваших доказательствах отсутствует окно блокировки аккаунта.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
      {
      title: `Отказать ОБЖ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В обжаловании отказано.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
            title: `------------------------------------------------------------------------------------------------------------------------------`,
           dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',
},
    ];

    $(document).ready(() => {

        addButton('Меню', 'selectAnswer', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255,  20, 147, 0.5);');
        addButton('Одобрить', 'accepted', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);');
        addButton('Рассмотрено', 'watched', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);');
        addButton('На рассмотрение', 'pin', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5);');
        addButton('Отказать', 'unaccept', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(235, 21, 21, 0.5);');
        addButton('Закрыть', 'closed', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(235, 21, 21, 0.5);');
        addButton ('Спецу', 'specialAdmin', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(235, 21, 21, 0.5);');
        addButton ('ГА', 'mainAdmin', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(235, 21, 21, 0.5);');
        addButton('КП', 'teamProject', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5);');



        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#closed`).click(() => editThreadData(COMMAND_PREFIX, false));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));
        $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));
        $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#selectAnswer`).click(() => {
            const alertHtml = buttonsMarkup(buttons);
            const $alert = XF.alert(alertHtml, null, 'Выберите ответ:');

            $alert.on('click', 'button[id^="answers-"]', function() {
                const buttonId = this.id;
                const id = parseInt(buttonId.split('-')[1], 10);

                if (isNaN(id) || !buttons[id]) {
                    return;
                }

                const shouldSend = id > 1;

                pasteContent(id, threadData, shouldSend);
            });
        });

                const bgButtons = document.querySelector(".pageContent");
        if (bgButtons) { //
            const buttonConfig = (text, href) => {
              const button = document.createElement("button");
              button.textContent = text;
              button.classList.add("bgButton");
              button.addEventListener("click", () => {
                window.location.href = href;
              });
              return button;
            };

        }

    });

     function addAnswers() {
		$('.button--icon--reply').before(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectComplaintAnswer" style="oswald: 3px; margin-bottom: 5px; border-radius: 13px;">Меню</button>`,
	);
	}

      function addButton(name, id, style) {
         $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
	);
    }

   function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
	`<button id="answers-${i}" class="button--primary button ` +
	`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
	)
	.join('')}</div>`;
	}

  function tasksMarkup(buttons) {
  return `<div class="select_answer">${buttons
    .map(
      (btn, i) =>
        `<button id="answers-${i}" class="button--primary button ` +
        `rippleButton" style="margin:6px; width:300px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
	)
	.join('')}</div>`;
	}

        function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        const htmlToInsert = template(data);

        const $editor = $('div.fr-element.fr-view p');
        if ($editor.length === 0) {
             $('div.fr-element.fr-view').append(htmlToInsert);
        } else if ($editor.text() === '') {
            $editor.empty().append(htmlToInsert);
        } else {
             $editor.append('<br>' + htmlToInsert);
        }
        $('span.fr-placeholder').empty();

        $('a.overlay-titleCloser').trigger('click');

        if (send == true) {
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');

            setTimeout(() => {
                const $editorInstance = $('textarea.js-quickReply');
                if ($editorInstance.length && $editorInstance.data('froala.editor')) {
                    $editorInstance.froalaEditor('html.set', '');
                } else {
                    $('div.fr-element.fr-view').html('');
                    $('span.fr-placeholder').show();
                }
            }, 100);

            editThreadData(buttons[id].prefix, buttons[id].status);
        }
    }

    function getThreadData() {
        const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
        const authorName = $('a.username').html();
        const hours = new Date().getHours();
        return {
            user: {
                id: authorID,
                name: authorName,
                mention: `[USER=${authorID}]${authorName}[/USER]`,
            },
            greeting: () =>
            4 < hours && hours <= 11
            ? 'Доброе утро'
            : 11 < hours && hours <= 15
            ? 'Добрый день'
            : 15 < hours && hours <= 21
            ? 'Добрый вечер'
            : 'Доброй ночи',
        };
    }

    function editThreadData(prefix, pin = false) {

        const threadTitle = $('.p-title-value')[0].lastChild.textContent;

        if(pin == false){
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        }
        if(pin == true){
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        }
    }


    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }

          async function initialize() {
        try {
            injectStaticStyles();
            await loadSettings();
            if (currentSettings.enableContextualBackgrounds && currentSettings.contextualBgUrl && window.location.href.toLowerCase().includes(currentSettings.contextualBgUrl.toLowerCase())) {
                const contextPresetName = currentSettings.contextualBgPreset;
                let contextPresetData = builtInPresets[contextPresetName] || currentSettings.customPresets[contextPresetName];
                if (contextPresetData) {
                    currentSettings = { ...contextPresetData, ...currentSettings };
                    console.log(`[BR Style] Контекстный пресет "${contextPresetName}" применен как БАЗА.`);
                }
            }

            applyForumStyles(currentSettings);
            const onDomReady = async () => {
                 try {
                     createBackgroundElement();
                     createPanelHTML();
                     createBottomNavBarElement();
                     createScrollIndicatorElement();
                     findMyUsername();
                     findThreadAuthor();
                     updateBottomNavBarContent(currentSettings);
                     manageVisualEffects(currentSettings);
addSettingsIconHTML();

                     if (settingsIcon && bottomNavElement && currentSettings.enableBottomNav) {
                         const utilsContainer = bottomNavElement.querySelector('.br-nav-utilities');
                         if (utilsContainer) {
                             utilsContainer.prepend(settingsIcon);
                         }
                     }

                     handleScroll();
                     setupScrollObserver(currentSettings);
                     setupLikeAnimations();
                     runComplaintTracker();
                     startLiveForumPollers();

                     findAndAttachUploader();

                     document.addEventListener('scroll', throttle(handleScroll, 100), { passive: true });

                     domObserver = observeDOM(document.body, observeNewNodes);

                     const seenVersion = await GM_getValue('br_style_seen_version', '0.0.0');
                     if (seenVersion !== SCRIPT_VERSION) {
                         showWelcomeScreen();
                         await GM_setValue('br_style_seen_version', SCRIPT_VERSION);
                     }

                 } catch (uiError) {
                     console.error('[BR Style] Ошибка при создании UI элементов в onDomReady (❌):', uiError);
                     showToast('[BR Style] Ошибка создания интерфейса скрипта! (❌)', 'error');
                 }
             };
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', onDomReady);
            } else {
                onDomReady();
            }
            GM_registerMenuCommand('🎨 Открыть настройки стиля Black Russia', togglePanel, 's');
        } catch (e) {
            console.error('[BR Style] КРИТИЧЕСКАЯ ОШИБКА ИНИЦИАЛИЗАЦИИ ❌', e);
            showToast('[BR Style] Критическая ошибка инициализации скрипта ❌', 'error', 10000);
        }
    }

    initialize();
})();