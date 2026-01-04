// ==UserScript==
// @name         bilibili live danmaku type filter
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  bilibili直播弹幕类型过滤
// @author       Greesea
// @include      /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @require      https://cdn.jsdelivr.net/gh/xfgryujk/bliveproxy@46b965bd14b60487bf0bbbf8902179b8e55f92ba/bliveproxy.user.js
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/430779/bilibili%20live%20danmaku%20type%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/430779/bilibili%20live%20danmaku%20type%20filter.meta.js
// ==/UserScript==

(async function () {
    const types = {
        text: 0,//文本
        emoji: 1,//表情包
        voice: 2,//语音
    };
    const blockedTypes = [types.emoji, types.voice];

    if (blockedTypes.includes(types.emoji))
        window?.document?.head?.insertAdjacentHTML?.("beforeend", `<style>.emoticons-panel{display: none;}</style>`);

    while (true) {
        if (window?.bliveproxy)
            break;
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log("waiting bliveproxy");
    }

    window.bliveproxy.addCommandHandler?.("DANMU_MSG", command => {
        //info[0][12]=DmType
        if (blockedTypes.includes(command.info[0][12])) {
            console.log("blocked");
            command.cmd = "NULL";
        }
    });
    console.log("filter hooked");
})().catch(console.error);
