// ==UserScript==
// @name        抖音来客后台 title显示nav (2025-10-30 确认版)
// @namespace   Violentmonkey Scripts
// @match       https://life.douyin.com/p/*
// @grant       ShowLe_e
// @version     2.2.1
// @author      - (Mod by Gemini)
// @description 2025年10月30日 (使用通配符 class 选择器)
// @license     MIT
// @require     https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/457194/%E6%8A%96%E9%9F%B3%E6%9D%A5%E5%AE%A2%E5%90%8E%E5%8F%B0%20title%E6%98%BE%E7%A4%BAnav%20%282025-10-30%20%E7%A1%AE%E8%AE%A4%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/457194/%E6%8A%96%E9%9F%B3%E6%9D%A5%E5%AE%A2%E5%90%8E%E5%8F%B0%20title%E6%98%BE%E7%A4%BAnav%20%282025-10-30%20%E7%A1%AE%E8%AE%A4%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 核心函数：设置标题
    function setShopTitle() {
        console.log("抖音来客脚本：开始执行...");

        // 1. --- 使用通配符匹配 class *包含* 'AccountInfo-module__name' 的 span ---
        // 这是基于你提供的HTML，能用的最"稳定"的选择器了
        var merchantNameSelector = "span[class*='AccountInfo-module__name']";

        // 2. --- 菜单项选择器 ---
        var activeMenuSelector = ".life-core-menu-item-active:first";

        // ------------------------------------

        // 尝试移除水印
        $("#staff-mark").remove();

        var $merchantElement = $(merchantNameSelector);

        if ($merchantElement.length === 0) {
            console.error("抖音来客脚本：无法找到商家名称！选择器已失效: " + merchantNameSelector + "。5秒后重试...");
            setTimeout(setShopTitle, 5000); // 5秒后重试
            return;
        }

        var nTit = $merchantElement.text();
        console.log("抖音来客脚本：找到原始商家名: " + nTit);

        // 你的清理逻辑
        var nTit2 = nTit.replace("北海市", "");
        var nTit3 = nTit2.replace("海城区", "");
        var nTit4 = nTit3.replace("银海区", "");
        let nTitle133 = nTit4.replace("有限公司", "");
        var nTitle1 = nTitle133.split('(')[0].trim();

        console.log("抖音来客脚本：清理后商家名: " + nTitle1);

        if (document.title !== nTitle1) {
            document.title = nTitle1;
        }

        // 追加菜单名逻辑
        setInterval(function() {
            let nTitle2 = $(activeMenuSelector).text().trim();
            let nTitle = nTitle1;

            if (nTitle2) {
                nTitle = nTitle1 + " " + nTitle2;
            }

            if (document.title !== nTitle) {
                document.title = nTitle;
            }
        }, 4000);

    } // setShopTitle 函数结束

    // 初始等待6秒
    setTimeout(setShopTitle, 6000);

})();