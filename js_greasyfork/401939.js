// ==UserScript==
// @name         SearchEngineSwitcher
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  一键切换国内外各种搜索引擎

// @match        *://www.baidu.com/s*
// @match        *://www.sogou.com/web*
// @match        *://www.so.com/s*
// @match        *://www.google.com/search*
// @match        *://cn.bing.com/search*
// @match        *://search.yahoo.com/search*
// @match        *://yandex.com/search*
// @match        *://duckduckgo.com/*
// @match        *://search.naver.com/search.naver*
// @downloadURL https://update.greasyfork.org/scripts/401939/SearchEngineSwitcher.user.js
// @updateURL https://update.greasyfork.org/scripts/401939/SearchEngineSwitcher.meta.js
// ==/UserScript==

const urlMapping = [
    {
        name: '百度',
        searchUrl: 'https://www.baidu.com/s?wd=',
        keyName: 'wd',
        testUrl: /https:\/\/www\.baidu\.com\/s.*/,
    },
    {
        name: '搜狗',
        searchUrl: 'https://www.sogou.com/web?query=',
        keyName: 'query',
        testUrl: /https:\/\/www\.sogou\.com\/web.*/,
    },
    {
        name: '360搜索',
        searchUrl: 'https://www.so.com/s?q=',
        keyName: 'q',
        testUrl: /https:\/\/www\.so\.com\/s.*/,
    },
    {
        name: 'Google',
        searchUrl: 'https://www.google.com/search?q=',
        keyName: 'q',
        testUrl: /https:\/\/www.google.com\/search.*/,
    },
    {
        name: 'Bing',
        searchUrl: 'https://cn.bing.com/search?q=',
        keyName: 'q',
        testUrl: /https:\/\/cn\.bing\.com\/search.*/,
    },
    {
        name: 'Yahoo',
        searchUrl: 'https://search.yahoo.com/search?p=',
        keyName: 'p',
        testUrl: /https:\/\/search\.yahoo\.com\/search.*/,
    },
    {
        name: 'Yandex',
        searchUrl: 'https://yandex.com/search/?text=',
        keyName: 'text',
        testUrl: /https:\/\/yandex\.com\/search.*/,
    },
    {
        name: 'DuckDuckGo',
        searchUrl: 'https://duckduckgo.com/?q=',
        keyName: 'q',
        testUrl: /https:\/\/duckduckgo\.com\/.*/,
    },
    {
        name: 'Naver',
        searchUrl: 'https://search.naver.com/search.naver?query=',
        keyName: 'query',
        testUrl: /https:\/\/search\.naver\.com\/search\.naver.*/,
    }
];

function getQueryVariable(variable) {
    let query = window.location.search.substring(1);
    let pairs = query.split("&");
    for (let pair of pairs) {
        let [key, value] = pair.split("=");
        if (key == variable) {
            return decodeURIComponent(value);
        }
    }
    return null;
};

function getKeywords() {
    let keywords = '';

    for (let item of urlMapping) {
        if (item.testUrl.test(window.location.href)) {
            keywords = getQueryVariable(item.keyName);
            break
        }
    }

    return keywords;
};

function FloatingWindow() {
    var div = document.createElement('div')
    div.id = 'engines'
    div.style = "position: fixed;top: 150px;left: 5px;width: 90px;font-size: 12px;z-index: 100;"
    document.body.insertAdjacentElement("afterBegin", div);

    let title = document.createElement('span')
    title.innerText = "搜索引擎"
    title.style = "display: block;padding: 0 0 0 14px;margin-top: 10px;font-size: 15px;font-weight: bold;"
    div.appendChild(title)

    for (let index in urlMapping) {
        let item = urlMapping[index];

        let Style = "display: block; padding: 5px 5px 5px 14px; text-decoration: none;color: #000000;";
        let ChangedStyle = Style + "color: #757575;";

        let a = document.createElement('a')
        a.href = 'javascript:;'
        a.innerText = item.name
        a.style = Style
        a.id = index

        a.onmouseenter = function () {
            this.style = ChangedStyle
        }
        a.onmouseleave = function () {
            this.style = Style
        }
        a.onclick = function () {
            window.location.href = item.searchUrl + getKeywords();
        }

        div.appendChild(a)
    }
};

(function () {
    'use strict';
    window.onload = FloatingWindow;
}
)();
