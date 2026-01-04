// ==UserScript==
// @name         動畫瘋自動化(年齡分級、下一集、廣告)
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  自動同意年齡分級、自動播放下一集、自動關閉廣告(於廣告結束後)、劇院模式的導航欄修復。
// @author       JayHuang
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamer.com.tw
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531479/%E5%8B%95%E7%95%AB%E7%98%8B%E8%87%AA%E5%8B%95%E5%8C%96%28%E5%B9%B4%E9%BD%A1%E5%88%86%E7%B4%9A%E3%80%81%E4%B8%8B%E4%B8%80%E9%9B%86%E3%80%81%E5%BB%A3%E5%91%8A%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531479/%E5%8B%95%E7%95%AB%E7%98%8B%E8%87%AA%E5%8B%95%E5%8C%96%28%E5%B9%B4%E9%BD%A1%E5%88%86%E7%B4%9A%E3%80%81%E4%B8%8B%E4%B8%80%E9%9B%86%E3%80%81%E5%BB%A3%E5%91%8A%29.meta.js
// ==/UserScript==
(async function () {
    "use strict";
    // 如果是有登入的使用者，但未購買動畫瘋服務，請修改成 false 反之改成 true
    // 有登入但未購買者，若無調整設定，將無法準確關閉廣告。
    const I_AM_VIP = true;
    // 已下設定適用非會員(未購買)跳過廣告(等待播放結束後嘗試關閉)
    const ADs_TIME = 30; // 等待廣告結束(秒)，動畫瘋廣告基本為 30 秒，改低了也不會跳過該等的時間。
    const LIMIT_RETEY_TIME = 12; // 重試次數上限
    const DELAY_TIME = 250; // 重試間隔時間(毫秒)
    // -----------以上可手動調整-------------------
    function sleep(millisecond = DELAY_TIME) {
        return new Promise((resolve) => {
            setTimeout(resolve, millisecond);
        });
    }
    async function getElement(selectors, option = {}) {
        var _a, _b;
        let element = null;
        const signal = (_a = option.signal) !== null && _a !== void 0 ? _a : { aborted: false };
        let limitRetry = (_b = option.limitRetry) !== null && _b !== void 0 ? _b : LIMIT_RETEY_TIME;
        const delaytime = option.delaytime;
        while (element === null && limitRetry >= 0) {
            if (signal.aborted) {
                throw new Error(`Search aborted for selector: ${selectors} and Reason: ${signal.reason}`);
            }
            element = document.querySelector(selectors);
            limitRetry -= 1;
            await sleep(delaytime);
        }
        if (element) {
            return element;
        }
        else {
            throw new Error("Not Found Element: " + selectors);
        }
    }
    function theLog(...message) {
        console.log("[baha]::", ...message);
    }
    function auto_allow_age(container) {
        const age_allow_btn = container.querySelector("#adult");
        if (age_allow_btn) {
            age_allow_btn.click();
            theLog("已自動同意年齡政策");
        }
    }
    function auto_next_episode() {
        var _a;
        const next_episode_btn = (_a = document
            .querySelector(".anime-option .season ul li.playing")) === null || _a === void 0 ? void 0 : _a.nextElementSibling.querySelector("a");
        if (next_episode_btn) {
            next_episode_btn.click();
            theLog("自動播放下一集！！");
        }
        else {
            theLog("沒有找到下一集...");
        }
    }
    function getCookieRecord() {
        return document.cookie.split("; ").reduce((prev, cookie) => {
            const [key, value] = cookie.split("=");
            return Object.assign(Object.assign({}, prev), { [key]: value });
        }, {});
    }
    /** 播放完後跳過 */
    async function auto_skip_ADs() {
        theLog("等待廣告中....");
        // 等待廣告結束
        await sleep(ADs_TIME * 1000);
        // 找尋按鈕
        theLog("找尋按鈕關閉廣告按鈕");
        const abortCtrller = new AbortController();
        const config = { signal: abortCtrller.signal };
        await Promise.race([
            getElement("#close_button_icon", config),
            getElement("#adSkipButton.enable", config),
            getElement(".videoAdUiSkipButton", config),
        ])
            .then((btn) => {
            abortCtrller.abort();
            btn.click();
            theLog("已關閉廣告");
        })
            .catch((e) => {
            theLog("沒有找到有效按鈕");
        });
    }
    async function hover_header() {
        const regex = new RegExp(/fullwindow(?!-)/);
        const check = (classname) => {
            return regex.test(classname);
        };
        let targetHeader = null;
        const [header, hoverHeader] = await Promise.all([
            getElement(".top_sky"),
            getElement(".topsky_hoverarea"),
        ]);
        const obs = new MutationObserver((records) => {
            records.forEach((record) => {
                const target = record.target;
                if (check(target.className)) {
                    targetHeader = target;
                }
                else {
                    targetHeader = null;
                }
            });
        });
        if (check(header.className)) {
            targetHeader = header;
        }
        obs.observe(header, { attributes: true });
        hoverHeader.style.zIndex = "1099";
        hoverHeader.onmouseenter = function () {
            if (targetHeader) {
                targetHeader.style.transform = "unset";
            }
        };
        header.onmouseleave = function () {
            if (targetHeader) {
                targetHeader.style.transform = "";
            }
        };
    }
    try {
        const cookie = getCookieRecord();
        theLog(cookie);
        const isLogin = cookie.BAHAID !== undefined;
        const hasADs = isLogin ? !I_AM_VIP : true;
        const videoContainer = await getElement("video-js");
        const video = videoContainer.querySelector("video");
        hover_header();
        auto_allow_age(videoContainer);
        if (hasADs) {
            await auto_skip_ADs();
        }
        video.play();
        const obsVideoContainer = new MutationObserver((records) => {
            records.forEach((record) => {
                record.addedNodes.forEach((el) => {
                    if (el.className.includes("R18")) {
                        auto_allow_age(videoContainer);
                        if (hasADs) {
                            auto_skip_ADs().then(() => {
                                video.play();
                            });
                        }
                        else {
                            video.play();
                        }
                    }
                });
            });
        });
        obsVideoContainer.observe(videoContainer, { childList: true });
        if (video) {
            video.addEventListener("ended", function () {
                auto_next_episode();
            });
        }
    }
    catch (e) {
        theLog("Some Error Occur!!", e);
    }
})();
