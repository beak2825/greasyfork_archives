// ==UserScript==
// @name         Google Search Sidebar
// @name:zh-CN   Google 搜索側邊欄
// @name:zh-TW   Google 搜尋側邊欄
// @name:ja      Google 検索補助サイドバー
// @namespace    http://tampermonkey.net/
// @version      2.3.1
// @description  A foldable sidebar with scrolling function, helps users to quickly retrieve search results in different languages and time ranges.
// @description:zh-CN  一個帶有滾動頁面功能的可折疊的進階搜索側邊欄，讓使用者可以快速獲得不同語種與時間的搜索結果。
// @description:zh-TW  一個帶有滾動頁面功能的可折疊的進階搜尋側邊欄，讓使用者可以快速獲得不同語種與時間的搜尋結果。
// @description:ja     ページスクロール機能付きの折りたたみ可能な高度な検索サイドバー。ユーザーはさまざまな言語や時間範囲の検索結果を素早く取得できます。
// @author       Kamiya Minoru
// @icon         https://www.google.com/favicon.ico
// @match        https://www.google.com/*
// @match        https://www.google.com.tw/*
// @match        https://www.google.co.jp/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526662/Google%20Search%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/526662/Google%20Search%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const userLang = navigator.language || navigator.userLanguage;

    const i18n = {
        'zh-TW': {
            languageSection: '語言過濾 …', timeSection: '時間過濾 …', advancedSearch: '進階搜尋',
            languages: { any: '不限語言搜尋', zhTW: '以繁體中文搜尋', zh: '以中文搜尋', ja: '以日文搜尋', en: '以英文搜尋' },
            times: { any: '不限時間', hour: '過去1小時', day: '過去1天', week: '過去1週', month: '過去1個月', months3: '過去3個月', year: '過去1年', years3: '過去3年' }
        },
        'ja': {
            languageSection: ' 言語フィルター …', timeSection: ' 期間フィルター', advancedSearch: '検索オプション',
            languages: { any: '言語指定なし', zhTW: '繁体中国語で検索', zh: '中国語で検索', ja: '日本語で検索', en: '英語で検索' },
            times: { any: '期間指定なし', hour: '1時間以内', day: '24時間以内', week: '1週間以内', month: '1か月以内', months3: '3か月以内', year: '1年以内', years3: '3年以内' }
        },
        'en': {
            languageSection: 'Language Filter …', timeSection: 'Time Filter', advancedSearch: 'Advanced Search',
            languages: { any: 'Any Language', zhTW: 'Traditional Chinese', zh: 'All Chinese', ja: 'Japanese', en: 'English' },
            times: { any: 'Any Time', hour: 'Past Hour', day: 'Past 24 Hours', week: 'Past Week', month: 'Past Month', months3: 'Past 3 Months', year: 'Past Year', years3: 'Past 3 Years' }
        }
    };

    function getLocale() {
        if (i18n[userLang]) { return i18n[userLang]; }
        const primaryLang = userLang.split('-')[0];
        if (i18n[primaryLang]) { return i18n[primaryLang]; }
        return i18n['en'];
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

    function createAdvancedSearchLink() {
        const link = document.createElement('a');
        link.textContent = locale.advancedSearch;
        link.href = getAdvancedSearchUrl();
        link.style.cssText = `display: block; color: #1a73e8; text-decoration: none; font-size: 14px; padding: 4px; margin-top: 0px; background: #ecedef; border-radius: 8px; text-align: center; transition: background-color 0.2s;`;
        link.addEventListener('mouseover', () => { link.style.backgroundColor = '#1a73e8'; link.style.color = '#FFFFFF'; });
        link.addEventListener('mouseout', () => { link.style.backgroundColor = '#ecedef'; link.style.color = '#1a73e8'; });
        return link;
    }

    function createFilterSection(title, filters, collapsible = false, defaultExpanded = false) {
        const section = document.createElement('div');
        section.style.cssText = `margin: 3px 0; padding: 3px; background: #ecedef; border-radius: 8px;`;

        const titleElement = document.createElement('h3');
        titleElement.textContent = title;
        titleElement.style.cssText = `margin: 0 0 2px 0; padding-top: 5px; font-size: 14px; color: #202124; font-weight: 500; cursor: ${collapsible ? 'pointer' : 'default'}; text-align: center;`;
        section.appendChild(titleElement);

        const linkContainer = document.createElement('div');
        linkContainer.style.cssText = `display: flex; flex-direction: column; gap: 3px; ${collapsible && !defaultExpanded ? 'display: none;' : ''}`;

        filters.forEach(filter => {
            const link = document.createElement('a');
            link.textContent = filter.text;
            link.href = getCurrentUrlWithParam(filter.param);
            link.style.cssText = `color: #888888; text-decoration: none; font-size: 12px; padding: 2px 2px; border-radius: 8px; transition: none;`;

            const urlParams = new URL(window.location.href).searchParams;
            if (urlParams.get('lr') === filter.param.replace('&lr=', '') || urlParams.get('tbs') === filter.param.replace('&tbs=', '')) {
                link.style.color = '#1a73e8';
                link.style.fontWeight = 'bold';
            }

            link.addEventListener('mouseover', () => {
                link.style.backgroundColor = '#1a73e8';
                link.style.color = '#FFFFFF';
            });
            link.addEventListener('mouseout', () => {
                if (urlParams.get('lr') !== filter.param.replace('&lr=', '') && urlParams.get('tbs') !== filter.param.replace('&tbs=', '')) {
                    link.style.color = '#888888';
                    link.style.backgroundColor = 'transparent';
                }
            });
            linkContainer.appendChild(link);
        });
        section.appendChild(linkContainer);

        if (collapsible) {
            titleElement.addEventListener('click', () => {
                linkContainer.style.display = linkContainer.style.display === 'none' ? 'flex' : 'none';
            });
        }

        return section;
    }

    function getCurrentUrlWithParam(param) {
        const url = new URL(window.location.href);
        const existingParams = new URLSearchParams(url.search);

        if (param.includes('lr=')) {
            existingParams.delete('lr');
        }
        if (param.includes('tbs=')) {
            existingParams.delete('tbs');
        }
        if (param) {
            const cleanParam = param.startsWith('&') ? param.substring(1) : param;
            const [key, value] = cleanParam.split('=');
            if (value) {
                existingParams.set(key, value);
            } else {
                // 不要添加空白的參數
                existingParams.delete(key);
            }
        }

        url.search = existingParams.toString();
        return url.toString();
    }

    function getAdvancedSearchUrl() {
        const currentParams = new URLSearchParams(window.location.search);
        const q = currentParams.get('q') || '';
        const lr = currentParams.get('lr') || '';
        const tbs = currentParams.get('tbs') || '';
        const udm = currentParams.get('udm');

        let url;
        if (udm === '2' || udm === '6') {
            url = new URL('https://www.google.com/advanced_image_search');
        } else if (udm === '7') {
            url = new URL('https://www.google.com/advanced_video_search');
        } else {
            url = new URL('https://www.google.com/advanced_search');
        }

        url.searchParams.set('q', q);
        url.searchParams.set('lr', lr);
        url.searchParams.set('tbs', tbs);

        return url.toString();
    }

    function createScrollButton(innerHTML, onClick, title) {
        var button = document.createElement('div');
        button.innerHTML = innerHTML;
        button.title = title;
        button.style.width = '30px';
        button.style.height = '30px';
        button.style.cursor = 'pointer';
        button.style.backgroundColor = 'transparent';
        button.style.textAlign = 'center';
        button.style.userSelect = 'none';
        button.style.margin = '1.5px 0';
        button.style.opacity = '0.5';
        button.style.transition = 'opacity 0.2s';
        button.addEventListener('click', onClick);
        button.addEventListener('mouseover', function() {
            button.style.opacity = '1';
        });
        button.addEventListener('mouseout', function() {
            button.style.opacity = '0.5';
        });
        return button;
    }

    function addScrollButtonsToSidebar() {
        const sidebar = document.querySelector('div[style*="position: fixed"]');
        if (!sidebar) return;
        const scrollContainer = document.createElement('div');
        scrollContainer.style.cssText = `position: absolute; top: 3px; left: 125px; display: flex; flex-direction: column; align-items: center; margin-top: 0px;`;

        scrollContainer.appendChild(createScrollButton(
            '<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 13L12 10L9 13" stroke="#3276c3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',
            function() { window.scrollTo({ top: 0, behavior: 'instant' }); },
            "Scroll to Top"
        ));
        scrollContainer.appendChild(createScrollButton(
            '<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 16L12 8M12 8L15 11M12 8L9 11" stroke="#3276c3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',
            function() { window.scrollBy({ top: -window.innerHeight, behavior: 'instant' }); },
            "Page Up"
        ));
        scrollContainer.appendChild(createScrollButton(
            '<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(180)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 16L12 8M12 8L15 11M12 8L9 11" stroke="#3276c3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',
            function() { window.scrollBy({ top: window.innerHeight, behavior: 'instant' }); },
            "Page Down"
        ));
//        scrollContainer.appendChild(createScrollButton(
//            '<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(180)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 13L12 10L9 13" stroke="#3276c3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',
//            function() { window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }); },
//            "Scroll to Bottom"
//        ));
        sidebar.appendChild(scrollContainer);
    }

    function observeUrlChanges() {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                setupSidebar();
            }
        }).observe(document, { subtree: true, childList: true });
    }

    function setupSidebar() {
        const existingSidebar = document.querySelector('div[style*="position: fixed"]');
        if (existingSidebar) {
            existingSidebar.remove();
        }

        const searchResults = document.getElementById('search');
        if (searchResults) {
            const sidebar = document.createElement('div');
            sidebar.style.cssText = `position: fixed; top: 3px; left: 7px; width: 153px; z-index: 1000;`;
            sidebar.appendChild(createFilterSection(locale.languageSection, languageFilters, true, window.location.href.includes('&lr=')));
            sidebar.appendChild(createFilterSection(locale.timeSection, timeFilters, true, window.location.href.includes('&tbs=')));
            sidebar.appendChild(createAdvancedSearchLink());
            document.body.appendChild(sidebar);

            addScrollButtonsToSidebar();
        }
    }

    observeUrlChanges();
    setupSidebar();
})();