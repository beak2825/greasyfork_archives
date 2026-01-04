// ==UserScript==
// @name        [E/Ex]Switch
// @name:JP     [E/Ex]切替
// @name:zh-TW  E網 表/裏站切換
// @name:zh-CN  E网 表/里站切换
// @namespace   https://github.com/awdrrawd
// @version     1.0
// @description E/Ex-Hentai switch
// @description:zh-tw E網表/裏站切換
// @description:zh-cn E网表/里站切换
// @match       https://e-hentai.org/*
// @match       https://exhentai.org/*
// @icon        https://e-hentai.org/favicon.ico
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/514418/%5BEEx%5DSwitch.user.js
// @updateURL https://update.greasyfork.org/scripts/514418/%5BEEx%5DSwitch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const $el = (tag, attrs) => {
        const element = document.createElement(tag);
        for (let key in attrs) {
            if (key === 'textContent') {
                element.textContent = attrs[key];
            } else {
                element.setAttribute(key, attrs[key]);
            }
        }
        return element;
    };

    //語言偵測
    const getButtonText = () => {
        const lang = navigator.language || navigator.userLanguage;
        const isTraditionalChinese = /^(zh-TW|zh-HK|zh-Hant)/.test(lang);
        const isSimplifiedChinese = /^(zh-CN|zh-Hans)/.test(lang);
        const isJapanese = /^ja/.test(lang);
        if (isTraditionalChinese) {
            return '[E/Ex]切換'; // 繁体中文
        } else if (isSimplifiedChinese) {
            return '[E/Ex]切换'; // 简体中文
        } else if (isJapanese) {
            return '[E/Ex]切替';
        }
        return '[E/Ex]Switch'; // 英文
};

    // 檢查是否找到導航欄元素
    const nb = document.getElementById('nb');
    if (!nb) {
        console.error('導航欄未找到，無法添加切換按鈕');
        return; // 退出腳本
    }

    const navdiv = $el('div', { class: 'nav-buttons' });

    const switchButton = $el('a', {
        id: 'switch-btn',
        textContent: getButtonText(),
        class: 'nav-button',
    });

    switchButton.addEventListener('click', () => {
        const currentUrl = window.location.href;
        const newUrl = currentUrl.startsWith('https://exhentai.org')
            ? currentUrl.replace('https://exhentai.org', 'https://e-hentai.org')
            : currentUrl.replace('https://e-hentai.org', 'https://exhentai.org');
        window.location.href = newUrl;
    });

    nb.appendChild(navdiv);
    navdiv.appendChild(switchButton);

    const style = document.createElement('style');
    style.textContent = `
        .nav-button {
            cursor: pointer !important; /* 鼠標懸停時顯示為箭頭 */
            margin: 0 5px; /* 按鈕之間的間距 */
        }
    `;
    document.head.appendChild(style);
})();