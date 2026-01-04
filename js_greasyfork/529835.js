// ==UserScript==
// @name         pixiv タグ検索結果にR-18率を表示
// @namespace    http://tampermonkey.net/
// @version      2025-05-31
// @description  pixivのタグ検索結果にR-18率を表示します。
// @author       p__hone
// @match        https://www.pixiv.net/tags/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529835/pixiv%20%E3%82%BF%E3%82%B0%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E3%81%ABR-18%E7%8E%87%E3%82%92%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/529835/pixiv%20%E3%82%BF%E3%82%B0%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E3%81%ABR-18%E7%8E%87%E3%82%92%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalFetch = window.fetch;
    window.fetch = async function(resource, options) {
        if (typeof resource === "string" && resource.includes("/ajax/search/artworks")) {
            const url = new URL(resource, window.location.origin);
            const response = await originalFetch(resource, options);
            const clone = response.clone();
            const currentMode = (new URLSearchParams(url.search)).get("mode");
            const currentCount = (await clone.json()).body.illustManga.total;

            let allCount = 0;
            let r18Count = 0;
            switch (currentMode)
            {
                case "all":
                    allCount = currentCount;
                    r18Count = await fetchCount(url, "r18", originalFetch, options);
                    break;
                case "safe":
                    allCount = await fetchCount(url, "all", originalFetch, options);
                    r18Count = allCount - currentCount;
                    break;
                case "r18":
                    allCount = await fetchCount(url, "all", originalFetch, options);
                    r18Count = currentCount;
                    break;
            }
            const r18Ratio = allCount > 0 ? (r18Count / allCount) : 0;
            console.log("R-18 ratio: ", r18Ratio);
            const target = [...document.querySelectorAll('span')].find(el => el.textContent.trim() == "作品").parentElement;
            if (target) {
                let elem = document.getElementById('r18ratio');
                let append = false;
                if (!elem) {
                    append = true;
                    elem = document.createElement('span');
                }
                elem.id = "r18ratio";
                elem.textContent = `R-18: ${(r18Ratio * 100).toFixed(2)}% (${r18Count}/${allCount})`;
                elem.style.backgroundColor = "rgb(255, 64, 96)";
                elem.style.padding = "0px 6px";
                elem.style.margin = "0px 6px";
                elem.style.color = "white";
                elem.style.borderRadius = "4px";
                elem.style.fontWeight = "bold";
                elem.style.fontSize = "small";
                if (append) {
                    target.appendChild(elem);
                }
            }
            return response;
        }

        return originalFetch(resource, options);
    };
})();

async function fetchCount(baseUrl, mode, originalFetch, fetchOptions) {
    const params = new URLSearchParams(baseUrl.search);
    params.set("mode", mode);
    const url = baseUrl.origin + baseUrl.pathname + "?" + params.toString();
    const resp = await (await originalFetch(url, fetchOptions)).json();
    return resp.body.illustManga.total;
}
