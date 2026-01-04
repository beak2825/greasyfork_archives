// ==UserScript==
// @name         替换zi.tools的Logo为2024新年Logo
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Replace the zi.tools logo with the 2024 New Year logo
// @author       SkyEye_FAST
// @match        *://zi.tools/*
// @license      Apache-2.0
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/525111/%E6%9B%BF%E6%8D%A2zitools%E7%9A%84Logo%E4%B8%BA2024%E6%96%B0%E5%B9%B4Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/525111/%E6%9B%BF%E6%8D%A2zitools%E7%9A%84Logo%E4%B8%BA2024%E6%96%B0%E5%B9%B4Logo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LOGO_URLS = [
        'https://ziphoenicia-1300189285.cos.ap-shanghai.myqcloud.com/home_svg/zi2025.svg',
        'https://ziphoenicia-1300189285.cos.ap-shanghai.myqcloud.com/home_svg/zi-tools.svg'
    ];
    const NEW_LOGO_URL = 'https://ziphoenicia-1300189285.cos.ap-shanghai.myqcloud.com/home_svg/zi-tools-spring.svg';

    function getRotateState() {
        return GM_getValue('rotateEnabled', true);
    }

    function setRotateState(state) {
        GM_setValue('rotateEnabled', state);
    }

    function updateAllLogos() {
        document.querySelectorAll('img').forEach(img => {
            if (LOGO_URLS.includes(img.src)) {
                img.style.transform = getRotateState() ? 'rotate(180deg)' : 'none';
            }
        });
    }

    function replaceLogo(img) {
        if (LOGO_URLS.includes(img.src)) {
            img.src = NEW_LOGO_URL;
            img.style.transform = getRotateState() ? 'rotate(180deg)' : 'none';
            if (img.classList.contains('top-bars')) {
                img.style.width = '130px';
                img.style.height = '';
            }
        }
    }

    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const images = node.querySelectorAll('img');
                        images.forEach(replaceLogo);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function init() {
        GM_registerMenuCommand(`新年Logo倒置：${getRotateState() ? '开启' : '关闭'}`, () => {
            const newState = !getRotateState();
            setRotateState(newState);
            updateAllLogos();
        });

        const images = document.querySelectorAll('img');
        images.forEach(replaceLogo);
        observeDOMChanges();
    }

    window.addEventListener('load', init);
})();