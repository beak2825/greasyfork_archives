// ==UserScript==
// @name         AI生成画像の埋め込み情報を表示するやつ
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  AI生成画像の埋め込み情報を表示する。コンテキストメニューから実行して下さい。
// @author       としあき
// @match        https://*.2chan.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2chan.net
// @grant        none
// @homepage     https://wikiwiki.jp/sd_toshiaki/%E5%88%9D%E3%82%81%E3%81%A6%E3%81%AE%E6%96%B9%E3%81%AF%E3%81%93%E3%81%A1%E3%82%89#w79c1be7
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/472734/AI%E7%94%9F%E6%88%90%E7%94%BB%E5%83%8F%E3%81%AE%E5%9F%8B%E3%82%81%E8%BE%BC%E3%81%BF%E6%83%85%E5%A0%B1%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/472734/AI%E7%94%9F%E6%88%90%E7%94%BB%E5%83%8F%E3%81%AE%E5%9F%8B%E3%82%81%E8%BE%BC%E3%81%BF%E6%83%85%E5%A0%B1%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.meta.js
// ==/UserScript==
(function () {
    let exif = (str) => {
        let res = "";
        for (let i = 0; i < str.length; i = i + 2) {
            res = res + str[i]
        }
        return res;
    };
    const exifinfo = () => [...document.querySelectorAll('a[href$=".jpg"]:last-of-type, a[href$=".webp"]:last-of-type')].forEach(async e => {
        if (!e.dataset.fetched) {
            e.dataset.fetched = true;
            const m = (await (await fetch(e.href)).text()).match(/UNICODE*([^]*)/u);
            m && (e.parentElement.innerHTML +=
                  `<details open><summary>Info</summary><pre style="white-space:pre-wrap">${
                      exif(m[1])
                          .replace(/&/g,'&amp;')
                          .replace(/</g, '&lt;')
                          .replace(/>/g,'&gt;')
                          .replace(/"/g,'&quot;')
                          .replace(/'/g,'&#39;')
                          .replace(/([A-Z][^:,]+: )/g, '<b>$1</b>')
                  }</pre></details>`)
        }
    });
    const pnginfo = () => [...document.querySelectorAll('a[href$=".png"]:last-of-type')].forEach(async e => {
        if (!e.dataset.fetched) {
            e.dataset.fetched = true;
            const m = (await (await fetch(e.href)).text()).match(/(?<=Xt(?:parameters|Description|Comment)\0*)([^\0]+)/ug);
            m && (e.parentElement.innerHTML +=
                  `<details open><summary>Info</summary><pre style="white-space:pre-wrap">${
                      m.join('')
                          .replace(/&/g,'&amp;')
                          .replace(/</g, '&lt;')
                          .replace(/>/g,'&gt;')
                          .replace(/"/g,'&quot;')
                          .replace(/'/g,'&#39;')
                          .replace(/([A-Z][^:,]+: )/g, '<b>$1</b>')
                  }</pre></details>`)
        }
    });
    exifinfo();
    pnginfo();
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (!mutation.addedNodes.length) return;
            const rtd = mutation.addedNodes[0].querySelector(".rtd");
            if (rtd) {
                exifinfo();
                pnginfo();
            }
        });
    });
    const target = document.querySelector(".thre");
    if (target) {
        observer.observe(target, {
            childList: true
        });
    }
})();