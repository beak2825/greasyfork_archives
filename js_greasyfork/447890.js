// ==UserScript==
// @name         干掉b站评论区的指定表情包
// @namespace    /DBI/kill-emoji-in-bilibili/
// @version      0.4.1
// @description  干掉b站评论区的指定表情包 (我也不知道为啥会有这种奇怪的需求, 但确实有人问我做)
// @author       DuckBurnIncense
// @match        *://www.bilibili.com/video/*
// @match        *://t.bilibili.com/*
// @match        *://www.bilibili.com/medialist/play/watchlater/*
// @match        *://www.bilibili.com/bangumi/play/*
// @match        *://www.bilibili.com/read/*
// @icon         https://www.bilibili.com/favicon.ico
// @homepage     //duckburnincense.ml/
// @supportURL   https://greasyfork.org/zh-CN/scripts/447890-%E5%B9%B2%E6%8E%89b%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%E7%9A%84%E6%8C%87%E5%AE%9A%E8%A1%A8%E6%83%85%E5%8C%85
// @license      MIT
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/447890/%E5%B9%B2%E6%8E%89b%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%E7%9A%84%E6%8C%87%E5%AE%9A%E8%A1%A8%E6%83%85%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/447890/%E5%B9%B2%E6%8E%89b%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%E7%9A%84%E6%8C%87%E5%AE%9A%E8%A1%A8%E6%83%85%E5%8C%85.meta.js
// ==/UserScript==

(function() {
    const killArr = GM_getValue('killArr', []);
    const replaceToText = GM_getValue('replaceToText', 0);
    GM_registerMenuCommand("编辑屏蔽表情列表", function() {
        const newKillArr =
            prompt('编辑屏蔽表情列表\n（不同表情之间使用 "|" 分隔，例如：doge|妙啊|星星眼, 允许带中括号, 如: [doge]|[妙啊]|[星星眼]', killArr.join('|'))
                .split('|')
                .map(v =>
                     v.replace(/\[(.*?)\]/gim, '$1'));
        GM_setValue('killArr', newKillArr);
        alert('修改成功, 刷新页面后生效');
    });
    GM_registerMenuCommand((replaceToText ? '✅' : '❌') + " 将表情包替换为对应的文字", function() {
        GM_setValue('replaceToText', !replaceToText);
        console.error(replaceToText);
        alert('修改成功, 刷新页面后生效');
    });
    // 因为评论区是异步加载的, 所以要定时重复执行.
    setInterval(() => {
        killArr.forEach(killEmojiAlt => {
            let emojis = document.querySelectorAll(`img[alt="[${killEmojiAlt}]"]`);
            emojis.forEach(item => {
                if (replaceToText) {
                    item.outerHTML = item.outerHTML = `[${killEmojiAlt}]`;
                } else {
                    item.remove();
                }
            });
        });
    }, 500);
})();