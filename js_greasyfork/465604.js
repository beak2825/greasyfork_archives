// ==UserScript==
// @name         长按加速
// @namespace    mscststs.com
// @version      0.3
// @description  看视频长按加速
// @author       mscststs
// @license      ISC
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @require      https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=1026406
// @require      https://greasyfork.org/scripts/374462-%E9%BC%A0%E6%A0%87%E9%95%BF%E6%8C%89-longpress/code/%E9%BC%A0%E6%A0%87%E9%95%BF%E6%8C%89-LongPress.js?version=645860
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465604/%E9%95%BF%E6%8C%89%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/465604/%E9%95%BF%E6%8C%89%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const video = await mscststs.wait("#bilibili-player video");
    onLongPress(video,()=>{
        // 获取当前倍速
        const prevPlayBackRate = window.player.getPlaybackRate();

        // 设置视频倍速
        window.player.setPlaybackRate(4);

        // 显示加速提示
        const toastId = window.player.toast.create({text:"  加速中 >>   ",duration: Infinity});

        // 监听抬起鼠标事件
        document.addEventListener("mouseup",()=>{
            window.player.toast.remove(toastId); // 移除提示
            window.player.setPlaybackRate(prevPlayBackRate); // 恢复原有倍速
        },{
            once:true,
        })
    },500)

})();