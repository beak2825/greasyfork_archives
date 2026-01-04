// ==UserScript==
// @name         嘗試修復 Discord 圖片連結
// @namespace    -
// @version      1.0.5
// @description  若原始圖片連結失效，則嘗試用第三方網站修復（但仍有可能無法存取，因為 Discord 刪掉了該檔案或連結錯誤）
// @author       LianSheng
// @license      MIT
// @include      https://*
// @require      https://unpkg.com/gmxhr-fetch
// @compatible   chrome
// @compatible   firefox
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @connect      discordapp.uwspro.com
// @connect      cdn.discordapp.com
// @connect      media.discordapp.net
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/495696/%E5%98%97%E8%A9%A6%E4%BF%AE%E5%BE%A9%20Discord%20%E5%9C%96%E7%89%87%E9%80%A3%E7%B5%90.user.js
// @updateURL https://update.greasyfork.org/scripts/495696/%E5%98%97%E8%A9%A6%E4%BF%AE%E5%BE%A9%20Discord%20%E5%9C%96%E7%89%87%E9%80%A3%E7%B5%90.meta.js
// ==/UserScript==

(async () => {
    if (gmfetch === undefined) {
        console.error("[Error] 錯誤！ gmfetch 未正確讀入，腳本已終止");
        return;
    }

    let alreadySet = false;
    const FIXED_ID = "discord-cdn-fixed";
    const RETRY_ATTR = "discord-cdn-retry";

    const RECOVERY_HOST = "https://discordapp.uwspro.com";
    const HOST_DATA = `${RECOVERY_HOST}/data`;
    const HOST_API = `${RECOVERY_HOST}/api/link`;

    const isAlive = await gmfetch(HOST_DATA).then(r => r.json()).then(r => true).catch(e => false);
    if (isAlive) {
        console.log(`[DiscordLink] 測試完成. ${RECOVERY_HOST} 在線。`);
    } else {
        console.error(`[DiscordLink] 測試完成. ${RECOVERY_HOST} 不在線上，腳本已終止。`)
        return;
    }

    unsafeWindow.addEventListener("load", setup);
    document.addEventListener("DOMContentLoaded", setup);

    function setup() {
        if (alreadySet === true) {
            return;
        }

        alreadySet = true;

        setInterval(_ => {
            /** @type {NodeListOf<HTMLImageElement>} */
            const elImgs = document.querySelectorAll(`img:not(.${FIXED_ID})`);
            elImgs.forEach(async elImg => {

                /** @type {string} */
                const url = elImg.src;

                // 檢查基本格式
                if (url.startsWith(RECOVERY_HOST) || !url.startsWith("https://") || !url.includes("/attachments/")) {
                    return;
                }

                // 檢查基本格式 part 2
                const id = url.replace(/^https:\/\/[^\/]+?\/attachments\//, "").replace(/\?.+$/, "");
                if (!id.match(/^\d+\/\d+\/.+$/)) {
                    console.log(`[DiscordLink] 錯誤的連結格式 ${url} (id => '${id}')`);
                    return;
                }

                // 僅在死圖時才接著做
                const test404 = await gmfetch(url, { method: "HEAD" }).then(r => r.status === 404);
                if (!test404) {
                    return;
                }

                // 優先使用本機預存的資料（若時間在 1 小時內則不再請求）
                const stored = GM_getValue(id);
                if (stored !== undefined) {
                    const data = JSON.parse(stored);

                    if (Date.now() - data.time < 3600 * 1000) {
                        replaceImgSrc(elImg, data.url);
                    }
                }

                // 取得最新連結
                const newUrl = await gmfetch(HOST_API, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        "url": encodeURI(url)
                    })
                }).then(r => r.text());

                // 保存
                GM_setValue(id, JSON.stringify({
                    time: Date.now(),
                    url: newUrl
                }));

                // 嘗試更新網頁上的圖片
                replaceImgSrc(elImg, newUrl);

                /**
                 * @param {HTMLImageElement} elImg 
                 * @param {string} url
                 */
                function replaceImgSrc(elImg, url) {
                    if (!elImg.hasAttribute(RETRY_ATTR)) {
                        elImg.setAttribute(RETRY_ATTR, 0);
                    }

                    const attrCounter = elImg.getAttribute(RETRY_ATTR);

                    if (attrCounter >= 3) {
                        elImg.classList.add(FIXED_ID);
                        return;
                    }

                    elImg.setAttribute(RETRY_ATTR, Number(attrCounter) + 1);
                    r();

                    function r() {
                        elImg.src = url;

                        if (elImg.hasAttribute("srcset")) {
                            elImg.srcset = url;
                        }

                        if (elImg.hasAttribute("data-src")) {
                            elImg.setAttribute("data-src", url);
                        }

                        if (elImg.hasAttribute("data-srcset")) {
                            elImg.setAttribute("data-srcset", url);
                        }
                    }
                }
            });
        }, 1000);
    }
})();