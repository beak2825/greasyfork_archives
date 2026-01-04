// ==UserScript==
// @name         YouTube 字型修正（繁體簡體兼容＋可選字型）
// @namespace    https://greasyfork.org/users/806708-angus1220
// @version      1.2
// @description  在 YouTube 強制使用系統內建字型，自由切換正黑體、雅黑體、蘋方、思源黑體，並即時顯示目前使用字型！
// @author       anlo1220
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534156/YouTube%20%E5%AD%97%E5%9E%8B%E4%BF%AE%E6%AD%A3%EF%BC%88%E7%B9%81%E9%AB%94%E7%B0%A1%E9%AB%94%E5%85%BC%E5%AE%B9%EF%BC%8B%E5%8F%AF%E9%81%B8%E5%AD%97%E5%9E%8B%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/534156/YouTube%20%E5%AD%97%E5%9E%8B%E4%BF%AE%E6%AD%A3%EF%BC%88%E7%B9%81%E9%AB%94%E7%B0%A1%E9%AB%94%E5%85%BC%E5%AE%B9%EF%BC%8B%E5%8F%AF%E9%81%B8%E5%AD%97%E5%9E%8B%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const fontFamilies = {
        jhenghei: `"Microsoft JhengHei", "PingFang TC", "PingFang SC", "Microsoft YaHei", "Source Han Sans TC", "Source Han Sans SC", Arial, sans-serif`,
        yahei: `"Microsoft YaHei", "PingFang SC", "PingFang TC", "Microsoft JhengHei", "Source Han Sans SC", "Source Han Sans TC", Arial, sans-serif`,
        pingfang: `"PingFang TC", "PingFang SC", "Microsoft JhengHei", "Microsoft YaHei", "Source Han Sans TC", "Source Han Sans SC", Arial, sans-serif`,
        sourcehan: `"Source Han Sans TC", "Source Han Sans SC", "Microsoft JhengHei", "Microsoft YaHei", "PingFang TC", "PingFang SC", Arial, sans-serif`,
        default: `Arial, sans-serif`
    };

    const fontLabels = {
        jhenghei: "微軟正黑體風格 (jhenghei)",
        yahei: "微軟雅黑體風格 (yahei)",
        pingfang: "蘋方 PingFang 風格 (pingfang)",
        sourcehan: "思源黑體風格 (sourcehan)",
        default: "系統預設 Arial (default)"
    };

    let userChoice = GM_getValue('youtubeFontChoice', 'jhenghei');

    function applyFont(choice) {
        GM_addStyle(`
            body, html, * {
                font-family: ${fontFamilies[choice]} !important;
            }
        `);
    }

    applyFont(userChoice);

    GM_registerMenuCommand(`【目前字型】→ ${fontLabels[userChoice]}`, () => {
        alert(`目前使用的字型是：${fontLabels[userChoice]}`);
    });

    for (const choice in fontFamilies) {
        GM_registerMenuCommand(`切換字型為: ${fontLabels[choice]}`, () => {
            GM_setValue('youtubeFontChoice', choice);
            alert(`字型已設定為：${fontLabels[choice]} 
請重新整理頁面以套用！`);
        });
    }
})();
