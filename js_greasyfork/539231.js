// ==UserScript==
// @name         DCInside Auto Dark Mode (Desktop)
// @namespace    https://dcinside.com/
// @version      1.2
// @description  DCInside 다크 모드를 브라우저 설정에 맞춰 자동으로 전환
// @author       iwj9
// @match        https://dcinside.com/*
// @match        https://*.dcinside.com/*
// @exclude      https://m.dcinside.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539231/DCInside%20Auto%20Dark%20Mode%20%28Desktop%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539231/DCInside%20Auto%20Dark%20Mode%20%28Desktop%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    let currentUrl = location.href;

    function isDarkActive() {
        return !!document.getElementById('css-darkmode');
    }

    function applyBuiltIn() {
        try {
            if (typeof window.darkmode === 'function') {
                window.darkmode();
                return true;
            }
        } catch (e) {}
        return false;
    }

    function setCookies(val) {
        const expire = "expires=Thu, 01 Jan 9999 00:00:00 GMT";
        document.cookie = `used_darkmode=${val}; path=/; domain=.dcinside.com; ${expire}`;
        document.cookie = `darkmode=${val}; path=/; domain=.dcinside.com; ${expire}`;
    }

    function injectCSS() {
        if (isDarkActive()) return;
        setCookies(1);
        const link = document.createElement('link');
        link.id = 'css-darkmode';
        link.rel = 'stylesheet';
        link.href = 'https://nstatic.dcinside.com/dc/w/css/dark.css?v=8';
        document.head.appendChild(link);
    }

    function removeCSS() {
        if (!isDarkActive()) return;
        setCookies(0);
        const link = document.getElementById('css-darkmode');
        link && link.remove();
    }

    function swapImages(dark) {
        // 로고 및 안내 이미지
        requestIdleCallback(() => {
            const img = selector => document.querySelector(selector);
            const logo = img('.logo_img');
            const logo2 = img('.logo_img2');
            const guide = img('.minor_make_guide img');

            if (logo) logo.src = dark
                ? 'https://nstatic.dcinside.com/dc/w/images/dark/dcin_logo_dark.png'
                : (window.logo_img || logo.src);

            if (logo2 && typeof window.logo_prefix !== 'undefined') {
                logo2.src = dark
                    ? `https://nstatic.dcinside.com/dc/w/images/dark/tit_${logo_prefix}gallery_dark.png`
                    : `https://nstatic.dcinside.com/dc/w/images/tit_${logo_prefix}gallery.png`;
            }

            if (guide) guide.src = dark
                ? 'https://nstatic.dcinside.com/dc/w/images/dark/minor_infoimg2_dark.png'
                : 'https://nstatic.dcinside.com/dc/w/images/minor_infoimg2.png';
        });
    }

    function enableDark() {
        if (applyBuiltIn()) return;
        injectCSS();
        swapImages(true);
    }

    function disableDark() {
        if (applyBuiltIn()) return;
        removeCSS();
        swapImages(false);
    }

    function syncMode() {
        const wantDark = darkQuery.matches;
        const isNowDark = isDarkActive();
        if (wantDark && !isNowDark) enableDark();
        else if (!wantDark && isNowDark) disableDark();
    }

    // 초기, 로드 이후, 설정 변경 감지
    syncMode();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', syncMode);
    }
    // 더 이상 실시간으로 다크모드를 갱신하지 않음.  
    // darkQuery.addEventListener('change', syncMode);

})();
