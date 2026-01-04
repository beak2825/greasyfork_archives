// ==UserScript==
// @name         Unoffcial twrp 反广告拦截窗口杀手
// @name:zh-CN   Unoffcial twrp 反广告拦截窗口杀手
// @name:zh-TW   Unoffcial twrp 反廣告攔截彈窗殺手
// @name:zh-HK   Unoffcial twrp 反廣告攔截冚家富貴
// @name:ja-JP   Unoffcial twrp アンチ広告ブロッカー 削除機
// @description  去除 Unoffcial twrp 的反广告拦截弹窗，使用 ChatGPT4 编写
// @description:zh-CN 去除 Unoffcial twrp 的反广告拦截弹窗，使用 ChatGPT4 编写
// @description:zh-TW 刪除 Unoffcial twrp 的反廣告攔截彈窗，使用 ChatGPT4 編寫
// @description:zh-HK 讓 Unoffcial twrp 嘅反廣告攔截冚家富貴，用 ChatGPT4 寫
// @description:ja-JP Unoffcial twrp アンチ広告ブロッカーを削除する。ChatGPT4で生成
// @author       TC999
// @version      1.0.1
// @license      GPL-3.0
// @icon         https://unofficialtwrp.com/wp-content/uploads/2022/04/favi.png
// @match        https://unofficialtwrp.com/*
// @run-at       document-end
// @namespace https://greasyfork.org/users/1091752
// @downloadURL https://update.greasyfork.org/scripts/498683/Unoffcial%20twrp%20%E5%8F%8D%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E7%AA%97%E5%8F%A3%E6%9D%80%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/498683/Unoffcial%20twrp%20%E5%8F%8D%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E7%AA%97%E5%8F%A3%E6%9D%80%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    setTimeout(() => {
        const elements = ['div.mdpDeblocker-wrapper','div.mdpDeblocker-blackout.active','mdp-deblocker-ads','style[id="mdpDeblocker-css"]'];// 元素查找
        elements.forEach(element => {
            const nodes = document.querySelectorAll(element);
            nodes.forEach(node => node.remove()); // 删除元素
        });
    }, 500);// 操作延时，单位毫秒
})();