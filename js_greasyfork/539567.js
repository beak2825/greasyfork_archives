// ==UserScript==
// @name         Google Search Topbar filter for mobile phone
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add a easy-access top-bar on Google Search for parameters filtering on mobile.
// @author       Kamiya Minoru
// @icon         https://www.google.com/favicon.ico
// @match        https://www.google.com/search*
// @match        https://www.google.com.tw/search*
// @match        https://www.google.co.jp/search*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539567/Google%20Search%20Topbar%20filter%20for%20mobile%20phone.user.js
// @updateURL https://update.greasyfork.org/scripts/539567/Google%20Search%20Topbar%20filter%20for%20mobile%20phone.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const userLang = navigator.language || navigator.userLanguage;
    const i18n = {
        'zh-TW': {
            languageSection: '語言過濾 …', timeSection: '時間過濾 …',
            languages: { any: '不限語言搜尋', zhTW: '以繁體中文搜尋', zh: '以中文搜尋', ja: '以日文搜尋', en: '以英文搜尋' },
            times: { any: '不限時間', hour: '過去1小時', day: '過去1天', week: '過去1週', month: '過去1個月', months3: '過去3個月', year: '過去1年', years3: '過去3年' }
        },
        'ja': {
            languageSection: ' 言語フィルター …', timeSection: ' 期間フィルター',
            languages: { any: '言語指定なし', zhTW: '繁体中国語で検索', zh: '中国語で検索', ja: '日本語で検索', en: '英語で検索' },
            times: { any: '期間指定なし', hour: '1時間以内', day: '24時間以内', week: '1週間以内', month: '1か月以内', months3: '3か月以内', year: '1年以内', years3: '3年以内' }
        },
        'en': {
            languageSection: 'Language Filter …', timeSection: 'Time Filter',
            languages: { any: 'Any Language', zhTW: 'Traditional Chinese', zh: 'All Chinese', ja: 'Japanese', en: 'English' },
            times: { any: 'Any Time', hour: 'Past Hour', day: 'Past 24 Hours', week: 'Past Week', month: 'Past Month', months3: 'Past 3 Months', year: 'Past Year', years3: 'Past 3 Years' }
        }
    };

    function getLocale() {
        if (i18n[userLang]) return i18n[userLang];
        const primaryLang = userLang.split('-')[0];
        return i18n[primaryLang] || i18n['en'];
    }

    const locale = getLocale();
    const languageFilters = [
        { text: locale.languages.any, param: '&lr=' },
        { text: locale.languages.zhTW, param: '&lr=lang_zh-TW' },
        { text: locale.languages.zh, param: '&lr=lang_zh' },
        { text: locale.languages.ja, param: '&lr=lang_ja' },
        { text: locale.languages.en, param: '&lr=lang_en' }
    ];
    const timeFilters = [
        { text: locale.times.any, param: '&tbs=' },
        { text: locale.times.hour, param: '&tbs=qdr:h' },
        { text: locale.times.day, param: '&tbs=qdr:d' },
        { text: locale.times.week, param: '&tbs=qdr:w' },
        { text: locale.times.month, param: '&tbs=qdr:m' },
        { text: locale.times.months3, param: '&tbs=qdr:m3' },
        { text: locale.times.year, param: '&tbs=qdr:y' },
        { text: locale.times.years3, param: '&tbs=qdr:y3' }
    ];

    function createDropdownButton(text, filters, currentParam) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = `flex:1;padding:10px;font-size:16px;background-color:${isDarkMode()?'#333':'#f1f1f1'};border:none;cursor:pointer;color:${isDarkMode()?'#fff':'#000'};width:85%;`;
        const dropdown = document.createElement('div');
        dropdown.style.cssText = `display:none;position:absolute;background-color:${isDarkMode()?'#444':'#f9f9f9'};min-width:75px;box-shadow:0 8px 16px rgba(0,0,0,0.2);z-index:1;`;
        filters.forEach(filter => {
            const link = document.createElement('a');
            link.textContent = filter.text;
            link.href = getCurrentUrlWithParam(filter.param);
            link.style.cssText = `color:${isDarkMode()?'#fff':'#000'};padding:12px 16px;text-decoration:none;display:block;`;
            link.addEventListener('click', () => window.location.href = link.href);
            dropdown.appendChild(link);
            if (currentParam === filter.param) button.textContent = filter.text;
        });
        button.addEventListener('click', () => dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none');
        document.addEventListener('click', e => { if (!button.contains(e.target)) dropdown.style.display = 'none'; });
        const container = document.createElement('div');
        container.style.cssText = 'position:relative;flex:1;display:flex;justify-content:center;width:85%;';
        container.appendChild(button);
        container.appendChild(dropdown);
        return container;
    }

    function setupTopBar() {
        const topBar = document.createElement('div');
        topBar.style.cssText = `position:fixed;top:0;width:85%;height:50px;display:flex;background-color:${isDarkMode()?'#222':'#fff'};z-index:1000;border-bottom:1px solid ${isDarkMode()?'#555':'#ccc'};align-items:center;justify-content:space-around;`;
        const urlParams = new URLSearchParams(window.location.search);
        topBar.appendChild(createDropdownButton(locale.timeSection, timeFilters, urlParams.get('tbs') ? `&tbs=${urlParams.get('tbs')}` : '&tbs='));
        topBar.appendChild(createDropdownButton(locale.languageSection, languageFilters, urlParams.get('lr') ? `&lr=${urlParams.get('lr')}` : '&lr='));
        document.body.appendChild(topBar);

        const searchInput = document.querySelector('textarea, input[type="text"]');
        if (searchInput) {
            searchInput.addEventListener('focus', () => topBar.style.display = 'none');
            searchInput.addEventListener('blur', () => topBar.style.display = 'flex');
        }
    }

    function getCurrentUrlWithParam(param) {
        const url = new URL(window.location.href);
        const existingParams = new URLSearchParams(url.search);
        if (param.includes('lr=')) existingParams.delete('lr');
        if (param.includes('tbs=')) existingParams.delete('tbs');
        if (param) {
            const [key, value] = param.startsWith('&') ? param.substring(1).split('=') : param.split('=');
            if (value) existingParams.set(key, value);
            else existingParams.delete(key);
        }
        url.search = existingParams.toString();
        return url.toString();
    }

    function isDarkMode() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    setupTopBar();
})();