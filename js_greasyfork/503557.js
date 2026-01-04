// ==UserScript==
// @name        順暢巴哈動畫瘋
// @description 我宣示我同意並滿足分級製度的年齡並已誠實的觀看廣告。
// @namespace   https://github.com/Max46656
// @version     1.1.2
// @author      Max
// @match       https://ani.gamer.com.tw/animeVideo.php*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=gamer.com.tw
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_info
// @license     MPL2.0
// @require     https://update.greasyfork.org/scripts/540647/1613495/%E8%87%AA%E5%8B%95%E9%BB%9E%E9%81%B8%E5%85%83%E7%B4%A0%E5%87%BD%E5%BC%8F%E5%BA%AB.js
// @downloadURL https://update.greasyfork.org/scripts/503557/%E9%A0%86%E6%9A%A2%E5%B7%B4%E5%93%88%E5%8B%95%E7%95%AB%E7%98%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/503557/%E9%A0%86%E6%9A%A2%E5%B7%B4%E5%93%88%E5%8B%95%E7%95%AB%E7%98%8B.meta.js
// ==/UserScript==

class AutoClickManager {
    constructor() {
        this.clickLib = new ClickItForYou();
        this.episode = new URL(window.location.href).searchParams.get('sn');
        this.scriptName = GM_info.script.name;
        this.rules = [
            {
                ruleName: "我已滿18歲",
                urlPattern: "https://ani.gamer.com.tw/animeVideo.php\\?sn=.*",
                selectorType: "css",
                selector: "button.choose-btn-agree",
                nthElement: 1,
                clickDelay: 500,
                keepClicking: false,
                ifLinkOpen: false
            },
            {
                ruleName: "已觀看廣告",
                urlPattern: "https://ani.gamer.com.tw/animeVideo.php\\?sn=.*",
                selectorType: "css",
                selector: "video-js div.enable,button.videoAdUiSkipButton,button[aria-label='Skip Ad'],button[aria-label='關閉廣告']",
                nthElement: 1,
                clickDelay: 500,
                keepClicking: true,
                ifLinkOpen: false
            }
        ];
    }

    init() {
        this.initializeRules();
        this.runInitialTasks();
        this.setupHistoryListeners();
    }

    initializeRules() {
        this.rules.forEach((rule, index) => {
            const existingRules = this.clickLib.getRules().data;
            const result = this.clickLib.addRule(rule);
            if (result.success) {
                console.log(`[${this.scriptName}] 規則 "${rule.ruleName}" 添加成功 (索引: ${existingRules.length + index})`);
            } else {
                console.error(`[${this.scriptName}] 規則 "${rule.ruleName}" 添加失敗: ${result.error}`);
            }
        });
    }

    runInitialTasks() {
        const runResult = this.clickLib.runTasks();
        console.log(`[${this.scriptName}] 初始任務執行: ${runResult.success ? '成功' : `失敗 (${runResult.error})`} (規則數: ${this.clickLib.getRules().data.length})`);
        return runResult;
    }

    setupHistoryListeners() {
        const oldPushState = history.pushState;
        history.pushState = (...args) => {
            const result = oldPushState.apply(history, args);
            window.dispatchEvent(new Event('pushstate'));
            window.dispatchEvent(new Event('locationchange'));
            return result;
        };

        const oldReplaceState = history.replaceState;
        history.replaceState = (...args) => {
            const result = oldReplaceState.apply(history, args);
            window.dispatchEvent(new Event('replacestate'));
            window.dispatchEvent(new Event('locationchange'));
            return result;
        };

        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('locationchange'));
        });

        window.addEventListener('locationchange', this.handleLocationChange.bind(this));
    }

    handleLocationChange() {
        const currentEP = new URL(window.location.href).searchParams.get('sn');
        if (currentEP !== this.episode) {
            console.log(`[${this.scriptName}] 檢測到 sn 變化: ${this.episode} -> ${currentEP}`);
            this.episode = currentEP;

            const clearResult = this.clickLib.clearTasks();
            console.log(`[${this.scriptName}] 清除任務: ${clearResult.success ? '成功' : `失敗 (${clearResult.error})`}`);

            const runResult = this.clickLib.runTasks();
            console.log(`[${this.scriptName}] 重新執行任務: ${runResult.success ? '成功' : `失敗 (${runResult.error})`}`);
        }
    }
}

const johnTheWeeb = new AutoClickManager();
johnTheWeeb.init();
