// ==UserScript==
// @name              Mobile search engineer switcher
// @name:zh-CN        移动端搜索引擎切换
// @namespace         http://tampermonkey.net/
// @version           2023.10.28
// @description       mobile search engineer switcher, bing google baidu
// @description:zh-CN 移动端搜索引擎切换，必应、谷歌、百度
// @author            Andy Yuen

// @include           https://*.bing.*/search*
// @include           https://*.google.*/search*
// @include           https://*.baidu.*/*wd*
// @include           https://*.baidu.*/*word*
// @icon              https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @license           MIT
// @grant             none
// @downloadURL https://update.greasyfork.org/scripts/478355/Mobile%20search%20engineer%20switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/478355/Mobile%20search%20engineer%20switcher.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('mobile search engineer switcher')

    if (!/Mobi|Android|iPhone/i.test(navigator.userAgent)) return;

    // Disable the scroll to top functionality
    if (location.host.includes('bing.com')) {
        window.addEventListener('focus', function () {
            window.scrollTo = function (x, y) {
                if (y !== 0) {
                    window.scrollTo.originalFunc(x, y);
                }
            };
            window.scrollTo.originalFunc = window.scrollTo;
        });
    }

    // search engineer
    let selector, mapCallback;
    if (location.host.includes('bing.com')) {
        selector = '[role="navigation"] ul';
        mapCallback = ([name, nameCn, url]) => {
            let element = document.createElement('li');
            element.className = 'injection-mses';
            element.innerHTML = `<a>${nameCn}</a>`;
            element.onclick = () => {
                location.href = 'https://' + url + new URLSearchParams(location.search).get('q');
            };
            return element;
        };
    } else if (location.host.includes('google.com')) {
        selector = '#hdtb-msb';
        mapCallback = ([name, nameCn, url]) => {
            let element = document.createElement('li');
            element.className = 'injection-mses hdtb-mitem';
            element.innerHTML = `<a>${nameCn}</a>`;
            element.onclick = () => {
                location.href = 'https://' + url + new URLSearchParams(location.search).get('q');
            };
            return element;
        };
    } else if (location.host.includes('baidu.com')) {
        selector = '.se-tab-lists';
        mapCallback = ([name, nameCn, url]) => {
            let element = document.createElement('a');
            element.className = 'injection-mses se-tabitem';
            element.innerHTML = `<span>${nameCn}</span>`;
            element.onclick = () => {
                const params = new URLSearchParams(location.search);
                location.href = 'https://' + url + (params.get('wd') || params.get('word'));
            };
            return element;
        };
    }

    function inject() {
        if (document.querySelector(selector) && !document.querySelector('.injection-mses')) {
            document.querySelector(selector).prepend(...[
                ['google', '谷歌', 'google.com/search?q='],
                ['bing', '必应', 'bing.com/search?q='],
                ['baidu', '百度', 'baidu.com/s?wd=']
            ].filter(([name]) => !location.host.includes(name)).map(mapCallback));
        } else {
            setTimeout(inject, 10);
        }
    }

    inject();
})();