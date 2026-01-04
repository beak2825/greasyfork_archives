// ==UserScript==
// @name                    Fuck Baidu
// @name:zh-CN              去你妈的百度
// @name:en-US              Fuck Baidu
// @namespace               http://tampermonkey.net/
// @version                 1.7.4
// @description             屏蔽搜索引擎中所有来自百度的搜索结果. 支持的搜索引擎: Google / Bing / Yahoo / Yandex / DuckDuckGo
// @description:zh-CN       屏蔽搜索引擎中所有来自百度的搜索结果. 支持的搜索引擎: Google / Bing / Yahoo / Yandex / DuckDuckGo
// @description:en-US       Block search results from Baidu in search engines. Supported search engines: Google / Bing / Yahoo / Yandex / DuckDuckGo
// @author                  Hijack_Nick & Spectrollay
// @match                   *://*.google.com/*
// @match                   *://*.google.com.hk/*
// @match                   *://*.google.com.tw/*
// @match                   *://*.bing.com/*
// @match                   *://*.yahoo.com/*
// @match                   *://*.yandex.com/*
// @match                   *://*.duckduckgo.com/*
// @grant                   none
// @license                 MIT
// @downloadURL https://update.greasyfork.org/scripts/495931/Fuck%20Baidu.user.js
// @updateURL https://update.greasyfork.org/scripts/495931/Fuck%20Baidu.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const filterKeywords = ['baidu.', '220.181.38.149'];

    function filterResults() {
        let results = [];

        if (location.hostname.includes('google.com')) {
            results = document.querySelectorAll('.g');
        } else if (location.hostname.includes('bing.com')) {
            results = document.querySelectorAll('.b_algo');
        } else if (location.hostname.includes('yahoo.com')) {
            results = document.querySelectorAll('.dd.algo');
        } else if (location.hostname.includes('yandex.com')) {
            results = document.querySelectorAll('.k_5ay1tJkv0OU_card');
        } else if (location.hostname.includes('duckduckgo.com')) {
            results = document.querySelectorAll('li[data-layout="organic"]');
        }

        results.forEach(result => {
            const resultText = result.innerText.toLowerCase();

            filterKeywords.forEach(keyword => {
                if (resultText.includes(keyword)) {
                    result.style.display = 'none';
                }
            });
        });
    }

    filterResults();

    const searchInput = document.querySelector('input[name="q"], input[name="p"], input[name="text"], #sb_form_q');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const results = document.querySelectorAll('.g, .b_algo, .dd.algo, .k_5ay1tJkv0OU_card, li[data-layout="organic"]');
            results.forEach(result => {
                result.style.display = '';
            });
            filterResults();
        });

        const searchForm = searchInput.closest('form');
        if (searchForm) {
            searchForm.addEventListener('submit', (event) => {
                event.preventDefault();
                filterResults();
            });
        }
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length || mutation.removedNodes.length) {
                filterResults();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
