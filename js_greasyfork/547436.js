// ==UserScript==
// @name         Jump to location - 9db pokemongo map
// @name:ja      みんポケ共有マップ 座標移動
// @namespace    http://tampermonkey.net/
// @version      2025-08-27
// @description  Enable coordinate-based navigation on the 9db shared map
// @description:ja みんポケ共有マップで座標指定して移動できるようにする
// @author       Wiinuk
// @match        https://9db.jp/pokemongo/map
// @icon         https://www.google.com/s2/favicons?sz=64&domain=9db.jp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547436/Jump%20to%20location%20-%209db%20pokemongo%20map.user.js
// @updateURL https://update.greasyfork.org/scripts/547436/Jump%20to%20location%20-%209db%20pokemongo%20map.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    function waitForElement(selector) {
        return new Promise((resolve, reject) => {
            try { document.querySelector(selector); }
            catch (e) { reject(e); return; }

            const findAndResolve = () => {
                const existing = document.querySelector(selector);
                if (existing) {
                    resolve(existing);
                    return true;
                }
                return false;
            };

            if (findAndResolve()) return;

            const startObserving = () => {
                if (findAndResolve()) return;

                const observer = new MutationObserver(() => {
                    if (findAndResolve()) observer.disconnect();
                });

                observer.observe(document.documentElement, {
                    childList: true,
                    subtree: true,
                });
            };

            if (document.readyState === "complete" || document.readyState === "interactive") {
                startObserving();
            } else {
                document.addEventListener("DOMContentLoaded", startObserving, { once: true });
            }
        });
    }

    const parent = await waitForElement("#search_area > div.iziModal-wrap > div.iziModal-content");

    // UI コンテナ
    const content = document.createElement("div");
    content.style.marginTop = "8px";
    content.style.display = "flex";
    content.style.gap = "4px";

    // 入力欄
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "lat,lng";
    input.style.flex = "1";
    input.style.padding = "4px";

    // ボタン
    const button = document.createElement("button");
    button.textContent = "移動";
    button.style.padding = "4px 8px";

    content.append(input, button);
    parent.prepend(content);

    function jump() {
        const value = input.value.trim();
        if (!value) return;

        const match = value.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
        if (!match) {
            alert("正しい経緯度を入力してください");
            return;
        }
        const lat = match[1];
        const lng = match[2];

        // 既存の zoom 値を維持する（デフォルト 17）
        const currentHash = location.hash || "";
        const zoomMatch = currentHash.match(/#-?\d+(?:\.\d+)?,\s*-?\d+(?:\.\d+)?,(\d+)/);
        const zoom = zoomMatch ? zoomMatch[1] : "17";

        location.hash = `#${lat},${lng},${zoom}`;
        window.location.reload();
    }

    button.addEventListener("click", jump);
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            jump();
        }
    });

})().catch(e => console.error(e));
