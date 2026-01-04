// ==UserScript==
// @name               Web Skipper for Plex
// @namespace          https://github.com/x1ao4/web-skipper-for-plex
// @version            1.2
// @description        Automatically skip intros, credits, and auto-play the next item on Plex Web.
// @description:zh-CN  在 Plex Web 上实现自动跳过片头、片尾和自动播放下一个项目功能。
// @description:zh-HK  在 Plex Web 上實現自動跳過片頭、片尾和自動播放下一個項目功能。
// @description:zh-TW  在 Plex Web 上實現自動跳過介紹、名單和自動播放下一個項目功能。
// @author             x1ao4
// @match              https://app.plex.tv/*
// @match              http://localhost:32400/*
// @match              http://127.0.0.1:32400/*
// @license            MIT
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_registerMenuCommand
// @grant              GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/474505/Web%20Skipper%20for%20Plex.user.js
// @updateURL https://update.greasyfork.org/scripts/474505/Web%20Skipper%20for%20Plex.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 设置检查按钮和 “开启自动播放” 元素的间隔
    const interval = 1000;

    // 设置按钮的选择器
    const buttonSelector = 'button.AudioVideoFullPlayer-overlayButton-D2xSex';

    // 保存菜单命令的 ID
    let skipIntroCmd, skipCreditsCmd, autoPlayNextCmd;

    // 获取用户语言
    const userLang = navigator.language || navigator.userLanguage;

    // 根据用户语言设置按钮文本
    const buttonTexts = {
        'skipIntro': {
            'af-ZA': 'Slaan inleiding oor',
            'bg-BG': 'Прескачане на интродукцията',
            'ca-ES': 'Salteu la Introducció',
            'cs-CZ': 'Přeskočit úvod',
            'da-DK': 'Spring over intro',
            'de-DE': 'Überspringe Intro',
            'el-GR': 'Παράλειψη Προλόγου',
            'en-US': 'Skip Intro',
            'es-419': 'Omitir Opening',
            'es-ES': 'Saltar intro',
            'et-EE': 'Jäta intro vahele',
            'fi-FI': 'Ohita intro',
            'fr-CA': 'Passer l\'intro',
            'fr-FR': 'Passer l\'intro',
            'he-IL': 'דלג על הפתיח',
            'hr-HR': 'Preskakanje uvoda',
            'hu-HU': 'Intro átugrása',
            'is-IS': 'Sleppa inngangi',
            'it-IT': 'Salta Intro',
            'ja-JP': 'イントロをスキップ',
            'ko-KR': '인트로 건너뛰기',
            'lt-LT': 'Praleisti intro',
            'nl-NL': 'Intro overslaan',
            'nb-NO': 'Hopp over intro',
            'pl-PL': 'Pomiń wstęp',
            'pt-BR': 'Pular Intro',
            'pt-PT': 'Saltar introdução',
            'ro-RO': 'Sari peste introducere',
            'ru-RU': 'Пропустить интро',
            'sk-SK': 'Preskočiť intro',
            'sl-SI': 'Preskoči predstavitev',
            'sv-SE': 'Hoppa över intro',
            'th-TH': 'ข้ามตอนต้น',
            'tr-TR': 'Jeneriği Atla',
            'uk-UA': 'Пропустити вступ',
            'zh-TW': '略過介紹',
            'zh-CN': '跳过片头',
        },
        'skipCredits': {
            'af-ZA': 'Slaan eindkrediete oor',
            'cs-CZ': 'Přeskočit titulky',
            'da-DK': 'Spring rulletekster over',
            'de-DE': 'Abspann überspringen',
            'el-GR': 'Παράλειψη των τίτλων τέλους',
            'en-US': 'Skip Credits',
            'es-ES': 'Saltar créditos',
            'fi-FI': 'Ohita lopputekstit',
            'fr-CA': 'Sauter le générique',
            'fr-FR': 'Passer le générique',
            'he-IL': 'דלג על כותרות סיום',
            'hr-HR': 'Preskoči odjavnu špicu',
            'hu-HU': 'Stáblista Átugrása',
            'it-IT': 'Salta Crediti',
            'ja-JP': 'クレジットをスキップ',
            'ko-KR': '크레딧 건너뛰기',
            'lt-LT': 'Praleisti subtitrus',
            'nl-NL': 'Credits overslaan',
            'nb-NO': 'Hopp over rulleteksten',
            'pl-PL': 'Pomiń napisy końcowe',
            'pt-BR': 'Pular créditos',
            'pt-PT': 'Saltar créditos',
            'ro-RO': 'Sari peste credite',
            'ru-RU': 'Пропустить титры',
            'sk-SK': 'Preskočiť titulky',
            'sl-SI': 'Preskoči napise',
            'sv-SE': 'Hoppa över eftertexter',
            'tr-TR': 'Kredileri Atla',
            'uk-UA': 'Пропустити титри',
            'zh-TW': '跳過名單',
            'zh-CN': '跳过片尾',
        },
        'autoSkipIntro': {
            'en-US': 'Auto Skip Intro',
            'zh-TW': '自動跳過介紹',
            'zh-CN': '自动跳过片头',
        },
        'autoSkipCredits': {
            'en-US': 'Auto Skip Credits',
            'zh-TW': '自動跳過名單',
            'zh-CN': '自动跳过片尾',
        },
        'autoPlayNext': {
            'en-US': 'Auto Play Next',
            'zh-TW': '自動播放下一個',
            'zh-CN': '自动播放下一个',
        },
        'enabled': {
            'en-US': 'On',
            'zh-TW': '開',
            'zh-CN': '开',
        },
        'disabled': {
            'en-US': 'Off',
            'zh-TW': '關',
            'zh-CN': '关',
        }
    };

    // 获取对应语言的文本，如果没有找到，则使用英语作为默认语言
    function getText(textType) {
        return buttonTexts[textType][userLang] || buttonTexts[textType]['en-US'];
    }

    // 获取按钮类型
    function getButtonType(buttonText) {
        for (let lang in buttonTexts['skipIntro']) {
            if (buttonTexts['skipIntro'][lang] === buttonText) {
                return 'skipIntro';
            }
        }
        for (let lang in buttonTexts['skipCredits']) {
            if (buttonTexts['skipCredits'][lang] === buttonText) {
                return 'skipCredits';
            }
        }
        return null;
    }

    // 更新菜单命令
    function updateMenuCommands() {
        // 移除旧的菜单命令
        GM_unregisterMenuCommand(skipIntroCmd);
        GM_unregisterMenuCommand(skipCreditsCmd);
        GM_unregisterMenuCommand(autoPlayNextCmd);

        // 为每个功能注册新的菜单命令
        skipIntroCmd = GM_registerMenuCommand(getText('autoSkipIntro') + ' · ' + (GM_getValue('skipIntro', true) ? getText('enabled') : getText('disabled')), function() {
            GM_setValue('skipIntro', !GM_getValue('skipIntro', true));
            updateMenuCommands();
        });

        skipCreditsCmd = GM_registerMenuCommand(getText('autoSkipCredits') + ' · ' + (GM_getValue('skipCredits', true) ? getText('enabled') : getText('disabled')), function() {
            GM_setValue('skipCredits', !GM_getValue('skipCredits', true));
            updateMenuCommands();
        });

        autoPlayNextCmd = GM_registerMenuCommand(getText('autoPlayNext') + ' · ' + (GM_getValue('autoPlayNext', true) ? getText('enabled') : getText('disabled')), function() {
            GM_setValue('autoPlayNext', !GM_getValue('autoPlayNext', true));
            updateMenuCommands();
        });
    }

    // 初始化菜单命令
    updateMenuCommands();

    // 如果存在按钮，则点击按钮
    function clickButton(selector, isEnabled) {
        if (isEnabled) {
            const buttons = document.querySelectorAll(selector);
            for (const button of buttons) {
                let buttonType = getButtonType(button.innerText);
                if (buttonType && GM_getValue(buttonType, true)) {
                    button.click();
                    break;
                }
            }
        }
    }

    // 检查元素是否存在
    function elementExists(selector) {
        return document.querySelector(selector) !== null;
    }

    // 设置一个间隔来检查按钮和 “开启自动播放” 元素，如果它们存在，则点击它们或按空格键
    setInterval(() => {
        clickButton(buttonSelector, true);
        if (GM_getValue('autoPlayNext', true) && elementExists('label.AudioVideoUpNext-autoPlayOn-FMTHL1')) {
            window.dispatchEvent(new KeyboardEvent('keydown', {
                key: ' ',
                code: 'Space',
                keyCode: 32,
                which: 32,
                charCode: 32
            }));
        }
    }, interval);
})();
