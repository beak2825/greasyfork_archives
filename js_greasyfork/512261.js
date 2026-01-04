// ==UserScript==
// @name         【岐大病院】管理画面内の内部URLを、PCMS環境へ変更
// @namespace    http://tampermonkey.net/
// @version      2024-10-11
// @description  HTMLソースに含まれる内部URLを、PCMS環境のURLに上書きします。
// @author       若松一樹
// @match        https://www.hosp.gifu-u.ac.jp/pcms/cgi-bin/hospgifu_cgi/*__mode=view*
// @match        https://www.hosp.gifu-u.ac.jp/pcms/cgi-bin/hospgifu_cgi/*__mode=list*
// @icon         https://www.hosp.gifu-u.ac.jp/img/favicon-32x32.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512261/%E3%80%90%E5%B2%90%E5%A4%A7%E7%97%85%E9%99%A2%E3%80%91%E7%AE%A1%E7%90%86%E7%94%BB%E9%9D%A2%E5%86%85%E3%81%AE%E5%86%85%E9%83%A8URL%E3%82%92%E3%80%81PCMS%E7%92%B0%E5%A2%83%E3%81%B8%E5%A4%89%E6%9B%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/512261/%E3%80%90%E5%B2%90%E5%A4%A7%E7%97%85%E9%99%A2%E3%80%91%E7%AE%A1%E7%90%86%E7%94%BB%E9%9D%A2%E5%86%85%E3%81%AE%E5%86%85%E9%83%A8URL%E3%82%92%E3%80%81PCMS%E7%92%B0%E5%A2%83%E3%81%B8%E5%A4%89%E6%9B%B4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    // URLを置換する関数
    const replaceUrl = (url) => {
        // 置換対象外のURL
        const EXCLUDE_URLS = [
            'origin/1naika',
            'origin/2geka',
            'origin/bumon',
            'origin/cct',
            'origin/icc',
            'origin/intractable_disease_workshop',
            'origin/masui',
            'origin/naishikyou',
            'origin/nurse',
            'origin/radiology',
            'origin/seikei',
        ];
        if (EXCLUDE_URLS.some((excludeUrl) => url.includes(excludeUrl))) {
            return url;
        }

        // 絶対パスの場合
        if (url.includes('www.hosp.gifu-u.ac.jp') && !url.includes('pcms')) {
            return url.replace('www.hosp.gifu-u.ac.jp', 'www.hosp.gifu-u.ac.jp/pcms-test');
        }
        // 相対パスの場合
        if (url.startsWith('/') && !url.startsWith('//') && !url.includes('pcms')) {
            return '/pcms-test' + url;
        }
        return url;
    };

    // 内部URLかどうかを判定する関数
    const isInternalUrl = (url) => {
        const currentHost = window.location.host;
        const urlHost = new URL(url, window.location.href).host;
        return currentHost === urlHost;
    };

    // ページ内のすべてのリンクやスクリプト、画像、フォームのアクションを置換する関数
    const replaceInternalUrls = () => {
        const selectors = ['a[href]', 'script[src]', 'source[srcset]', 'link[href]', 'img[src]', 'img[data-src]'];

        selectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach((element) => {
                let urlAttribute;

                if (element.hasAttribute('href')) {
                    urlAttribute = 'href';
                } else if (element.hasAttribute('src')) {
                    urlAttribute = 'src';
                } else if (element.hasAttribute('action')) {
                    urlAttribute = 'action';
                } else if (element.hasAttribute('data-src')) {
                    urlAttribute = 'data-src';
                }

                if (urlAttribute) {
                    const originalUrl = element.getAttribute(urlAttribute);

                    // URLが内部URLであれば置換
                    if (isInternalUrl(originalUrl) || true) {
                        const newUrl = replaceUrl(originalUrl);
                        element.setAttribute(urlAttribute, newUrl);
                    }
                }
            });
        });
        console.log('内部URLをPCMS環境のURLに変更しました。');
    };

    // ページが読み込まれた後に実行
    document.addEventListener('DOMContentLoaded', replaceInternalUrls);
    replaceInternalUrls();

    // 登録・編集画面の場合
    if (window.location.href.includes('__mode=view')) {
        // フォームの変更を監視
        const target = document.getElementById('entry_form');
        if (target === null) return;
        const observer = new MutationObserver(function (mutationsList, observer) {
            mutationsList.forEach((mutation) => {
                // エディタの内容が変更された場合は無視
                if (mutation.target.classList && mutation.target.classList.contains('editor-content')) return;
            });
            replaceInternalUrls();
            console.log('mutation observed');
        });
        observer.observe(target, { childList: true, subtree: true });
    }
    // 一覧画面の場合
    if (window.location.href.includes('__mode=list')) {
        // 一覧表の更新を監視
        const target = document.querySelector('#asset-listing-form, #page-listing-form, #entry-listing-form');
        if (target === null) return;
        const observer = new MutationObserver(function () {
            replaceInternalUrls();
            console.log('mutation observed');
        });
        observer.observe(target, { childList: true, subtree: true });
    }
})();