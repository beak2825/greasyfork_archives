// ==UserScript==
// @name         BiliBili直播间解除字数限制
// @namespace    mscststs
// @version      0.41
// @description  直播间解除字数限制，自动分条发送
// @author       mscststs
// @include        /https?:\/\/live\.bilibili\.com\/\d/
// @match        https://live.bilibili.com/*
// @require https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=1026406
// @license      ISC
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37976/BiliBili%E7%9B%B4%E6%92%AD%E9%97%B4%E8%A7%A3%E9%99%A4%E5%AD%97%E6%95%B0%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/37976/BiliBili%E7%9B%B4%E6%92%AD%E9%97%B4%E8%A7%A3%E9%99%A4%E5%AD%97%E6%95%B0%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==


(async function() {
    'use strict';

    const chatControlPanel = (await mscststs.wait("#control-panel-ctnr-box")).__vue__;
    const fullscreenControlPanel = (await mscststs.wait(".fullscreen-danmaku")).__vue__;

    while(!chatControlPanel.isLogin){
        await mscststs.sleep(1000);
    }

    await mscststs.sleep(1000);
    const userLimit = chatControlPanel.inputLengthLimit; // 用户的弹幕长度


    hackDanmakuControl(chatControlPanel)
    hackDanmakuControl(fullscreenControlPanel)


    async function hackDanmakuControl(inputControlPanel){

        // 等待完成登录流程
        while(!inputControlPanel.isLogin){
            await mscststs.sleep(1000);
        }

        inputControlPanel.baseInfoUser.danmakuLengthLimit = 10000; // 直接设置上限长度，你总不可能有两万字的小作文要发吧
        const rawSendFunc = inputControlPanel.sendDanmaku.bind(inputControlPanel);
        async function curSendDanmaku(a,b,c,d,e){
            let text = this.chatInput;
            while(text){
                this.chatInput = text.slice(0, userLimit);
                console.log("分段发送: ",this.chatInput);
                text = text.slice(userLimit);
                rawSendFunc(a,b,c,d,e);
                await mscststs.sleep(1400);
            }
        };
        const curSendFunc = curSendDanmaku.bind(inputControlPanel)

        inputControlPanel.sendDanmaku = curSendFunc;
    }

})();