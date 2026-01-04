// ==UserScript==
// @name         PixivフォローユーザーURL抽出＆次ページ
// @namespace    https://greasyfork.org/ja/users/1126644-s-k-script
// @version      0.1.4
// @description  Pixivのフォローページから各ユーザーのURLを抽出しクリップボードへコピーし、次のページに進む
// @author       S.K.Script
// @homepage     https://greasyfork.org/ja/users/1126644-s-k-script
// @license      GPL-3.0-only
// @match        https://www.pixiv.net/users/*/following*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @run-at       context-menu
// @grant        GM.setClipboard

// @downloadURL https://update.greasyfork.org/scripts/470826/Pixiv%E3%83%95%E3%82%A9%E3%83%AD%E3%83%BC%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BCURL%E6%8A%BD%E5%87%BA%EF%BC%86%E6%AC%A1%E3%83%9A%E3%83%BC%E3%82%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/470826/Pixiv%E3%83%95%E3%82%A9%E3%83%AD%E3%83%BC%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BCURL%E6%8A%BD%E5%87%BA%EF%BC%86%E6%AC%A1%E3%83%9A%E3%83%BC%E3%82%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function extractUrls() {
        let urls = new Set();
        const elements = document.querySelectorAll("section div:nth-child(2) > div a[href^='/users/']");
        elements.forEach(element => {
            const href = element.href;
            if (!href.endsWith("/request")) {
                urls.add(href);
            }
        });
        return urls;
    }

    const urls = extractUrls();
    console.log("urls", urls);
    if(urls.size < 24) {
        window.alert("[警告] 抽出されたURLは" + urls.size + "個であり、24個よりも少ないです。これは抽出ミスの可能性があります。その場合は本UserScriptの改修が必要です。");
    }

    function getNextButton() {
        const svg = document.querySelector("nav > a:last-child > svg");
        if (!svg) {
            return undefined;
        }
        return svg.parentElement;
    }

    let str = "";
    for (const url of urls) {
        str += url;
        str += "\n";
    }

    GM.setClipboard(str);

    const nextBtn = getNextButton();
    if (!nextBtn) {
        window.alert("抽出は終わりましたが、次ページボタンを見つけることができませんでした。そのため、次のページに移動することなくここで処理を終了します。");
        return;
    }
    nextBtn.click();

})();