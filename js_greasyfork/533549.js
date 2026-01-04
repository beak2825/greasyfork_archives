// ==UserScript==
// @name:zh-TW   EZTABLE - 批次儲值美食金禮物卡
// @name         EZTABLE - Redeem gift cards in batches
// @namespace    https://greasyfork.org/zh-TW/scripts/533549
// @version      1.0
// @description:zh-TW 批次驗證與儲值 EZTABLE 美食金禮物卡序號。只要把多組序號貼到對話框，按下送出，即可查看驗證與儲值結果。
// @description       Batch check and redeem EZTABLE gift card codes easily. Just paste your codes into a floating window, click the button, and see the results right away.
// @author       GianInTW
// @match        https://tw.eztable.com/member/ezcashRedeem
// @grant        GM_xmlhttpRequest
// @connect      api-evo.eztable.com
// @run-at       document-end
// @license      BSD-3-Clause
// @downloadURL https://update.greasyfork.org/scripts/533549/EZTABLE%20-%20Redeem%20gift%20cards%20in%20batches.user.js
// @updateURL https://update.greasyfork.org/scripts/533549/EZTABLE%20-%20Redeem%20gift%20cards%20in%20batches.meta.js
// ==/UserScript==

/**
 * EZTABLE - Redeem gift cards in batches
 *
 * A script for batch redeeming EZTABLE gift card codes via the website interface.
 *
 * Features:
 * - Reads the user's access token from cookies.
 * - Provides a floating UI for inputting multiple gift card codes (comma, space, or newline separated).
 * - Validates each code via the EZTABLE API before attempting redemption.
 * - Displays real-time logs of validation and redemption results.
 * - Handles API errors and displays user-friendly messages.
 */

(async function () {
    "use strict";

    /* ========= 1. 讀取 access_token ========= */
    const COOKIE_NAME = "ckiftk";

    function getCookie(name) {
        const m = document.cookie.match(
            new RegExp("(?:^|;\\s*)" + name + "=([^;]*)")
        );
        return m ? decodeURIComponent(m[1]) : null;
    }

    const ACCESS_TOKEN = getCookie(COOKIE_NAME);

    /* ========= 2. 共用常數與工具 ========= */
    const HEADERS_BASE = {
        accept: "application/json, text/plain, */*",
        "content-type": "application/json",
        locale: "zh_TW",
        new_format: "new_format",
        origin: "https://tw.eztable.com",
        referer: "https://tw.eztable.com/",
        "x-source-client": "Web",
        "x-source-clientversion": "1.0.0",
        "x-source-platform": "Web",
        "user-agent": navigator.userAgent,
    };
    const CHECK_URL = "https://api-evo.eztable.com/giftcard/checkGiftCard";
    const REDEEM_URL = "https://api-evo.eztable.com/giftcard/redeemGiftCard";

    /** 以 Promise 形式包裝 GM_xmlhttpRequest */
    function gmPost(url, body) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url,
                headers: { ...HEADERS_BASE, access_token: ACCESS_TOKEN },
                data: JSON.stringify(body),
                onload: (r) => resolve(JSON.parse(r.responseText)),
                onerror: reject,
            });
        });
    }

    /** 將使用者輸入字串切成序號陣列，允許逗號 / 空白 / 換行分隔 */
    function parseCodes(txt) {
        return [
            ...new Set(
                txt
                    .trim()
                    .split(/[ \t\r\n,]+/)
                    .filter(Boolean)
            ),
        ];
    }

    /* ========= 3. 介面：對話框 ========= */
    const box = document.createElement("div");
    Object.assign(box.style, {
        position: "fixed",
        top: "75px",
        left: "20px",
        zIndex: 9999,
        width: "250px",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        padding: "12px",
        background: "rgba(255,255,255,.9)",
        boxShadow: "0 2px 10px rgba(0,0,0,.3)",
        borderRadius: "8px",
        fontFamily: "sans-serif",
    });

    const title = document.createElement("h3");
    title.textContent = "批次儲值美食金禮物卡";
    title.style.margin = "0 0 8px";
    box.appendChild(title);

    const textarea = document.createElement("textarea");
    textarea.placeholder = "請貼上序號\n\n每行一組序號\n或用空格、逗號分隔序號";
    Object.assign(textarea.style, {
        width: "100%",
        height: "120px", // 固定高度
        flex: "none", // 不被壓縮
        fontSize: "16px",
        padding: "6px",
        boxSizing: "border-box",
        resize: "vertical",
        maxWidth: "100%",
        minHeight: "80px", // 設定最小高度以適應小螢幕
        maxHeight: `calc(100vh - 150px)`, // 調整計算以更靈活適應小螢幕
    });
    box.appendChild(textarea);

    const btn = document.createElement("button");
    btn.textContent = "送出驗證並兌換序號";
    Object.assign(btn.style, {
        margin: "8px 0 0",
        padding: "6px 12px",
        fontSize: "14px",
        cursor: "pointer",
    });
    box.appendChild(btn);

    let logArea = null;

    /** 將訊息加入 log 區塊（第一次有 log 時才建立 logArea） */
    function log(msg, ok = true) {
        if (!logArea) {
            logArea = document.createElement("div");
            Object.assign(logArea.style, {
                flex: "1 1 auto", // 填滿剩餘空間，隨內容增高
                overflowY: "auto",
                fontSize: "13px",
                whiteSpace: "pre-wrap",
                paddingTop: "6px",
                minHeight: "40px",
                maxHeight: "100%", // 不超過 box
                margin: "8px 0 0",
            });
            box.appendChild(logArea);
        }
        const line = document.createElement("div");
        line.textContent = msg;
        line.style.color = ok ? "#065f46" : "#b91c1c";
        logArea.appendChild(line);
        logArea.scrollTop = logArea.scrollHeight;
    }
    document.body.appendChild(box);

    /* ========= 4. 主流程 ========= */

    /** 格式化錯誤訊息 */
    function formatErrorMessage(code, error) {
        return `✖ 驗證失敗 ${code}\n  ↳ ${error}`;
    }
    btn.addEventListener("click", async () => {
        if (!ACCESS_TOKEN) {
            log("請先登入 EZTABLE 再進行操作！", false);
            return;
        }
        const codes = parseCodes(textarea.value);
        if (!codes.length) {
            log("請輸入至少一組序號！", false);
            return;
        }
        btn.disabled = true;
        log(`開始處理 ${codes.length} 筆序號……`);

        for (const code of codes) {
            try {
                const check = await gmPost(CHECK_URL, { giftCode: code });
                if (check.data?.status === "ok") {
                    log(`✔ 驗證通過 ${code} (${check.data.amount})`);
                    const redeem = await gmPost(REDEEM_URL, { giftCode: code });
                    if (redeem.data?.status === "ok") {
                        log(`  ↳ 儲值成功，會員點數：${redeem.data.balance}`);
                    } else {
                        log(`  ↳ 儲值失敗：${redeem.data.error}`, false);
                    }
                } else {
                    log(
                        formatErrorMessage(
                            code,
                            check.data?.error || check.message || "未知錯誤"
                        ),
                        false
                    );
                }
            } catch (e) {
                console.error(e);
                log(`✖ 呼叫 API 失敗 (${code})`, false);
            }
        }

        log("全部處理完畢！");
        btn.disabled = false;
    });
})();
