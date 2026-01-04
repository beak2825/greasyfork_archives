// ==UserScript==
// @name        Youtube Player Simplifier
// @namespace   LeKAKiD
// @match       https://*.youtube.com/*
// @exclude     https://*.youtube.com/live_chat
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addValueChangeListener
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @version     1.7
// @author      LeKAKiD
// @description Remove buttons
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/443757/Youtube%20Player%20Simplifier.user.js
// @updateURL https://update.greasyfork.org/scripts/443757/Youtube%20Player%20Simplifier.meta.js
// ==/UserScript==

const ytButtons = {
    progress: {
        label: '탐색 불가 진행바',
        style: `
            div.ytp-progress-bar-container[aria-disabled] {
                display: none !important;
            }
        `,
    },
    next: {
        label: '다음 재생 버튼',
        style: `
            a.ytp-next-button {
                display: none !important;
            }
        `,
    },
    autonav: {
        label: '자동 재생 버튼',
        style: `
            [data-tooltip-target-id="ytp-autonav-toggle-button"] {
                display: none !important;
            }
        `,
    },
    subtitle: {
        label: '사용 불가 자막 버튼',
        style: `
            .ytp-subtitles-button:not([title$="(c)"]):not(:hover) {
                display: none !important;
            }
        `,
    },
    youtube: {
        label: '유튜브에서 보기 버튼',
        style: `
            .ytp-youtube-button {
                display: none !important;
            }
        `,
    },
    miniplayer: {
        label: '미니 플레이어 버튼',
        style: `
            .ytp-miniplayer-button {
                display: none !important;
            }
        `,
    },
    theater: {
        label: '극장 모드 버튼',
        style: `
            .ytp-size-button {
                display: none !important;
            }
      `,
    },
    remote: {
        label: 'TV에서 보기 버튼',
        style: `
            .ytp-remote-button {
                display: none !important;
            }
      `,
    },
    fullscreen: {
        label: '전체화면 버튼',
        style: `
            .ytp-fullscreen-button {
                display: none !important;
            }
      `,
    },
}

const defaultConfig = {
    progress: false,
    next: true,
    autonav: true,
    subtitle: false,
    youtube: false,
    miniplayer: true,
    theater: true,
    remote: true,
    fullscreen: true,
}

const menuID = {
    progress: undefined,
    next: undefined,
    autonav: undefined,
    subtitle: undefined,
    youtube: undefined,
    miniplayer: undefined,
    theater: undefined,
    remote: undefined,
    fullscreen: undefined,
}

let currentConfig = {
    ...defaultConfig,
    ...GM_getValue('config', undefined),
}

const styleElement = document.createElement('style');
document.head.append(styleElement);

function setStyle(config) {
    const configEntries = Object.entries(currentConfig);
    const styleList = configEntries
    .filter(([key, value]) => !value)
    .map(([key, value]) => ytButtons[key].style);

    styleElement.textContent = styleList.join('\n');
}

function commandGenerator(key) {
    return () => {
        currentConfig[key] = !currentConfig[key];
        GM_setValue('config', currentConfig);
    }
}

function renderMenu() {
    Object.entries(currentConfig).forEach(([key, value]) => {
        const { label } = ytButtons[key];

        menuID[key] = GM_registerMenuCommand(`${label}: ${value ? '표시됨': '숨겨짐'}`, commandGenerator(key));
        // console.log(`registered ${menuID[key]} (${key} - ${value})`);
    });
}

function clearMenu() {
    Object.entries(menuID).forEach(([key, value]) => {
        // console.log(`unregistered ${value} (${key})`);
        GM_unregisterMenuCommand(value);
    });
}

GM_addValueChangeListener('config', (_key, _prev, next) => {
    currentConfig = next;
    setStyle();

    clearMenu();
    renderMenu();
});

setStyle();
renderMenu();