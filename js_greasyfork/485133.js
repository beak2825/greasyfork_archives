// ==UserScript==
// @name              自动关闭Minecraft官网中国版弹窗
// @name:zh-CN        自动关闭Minecraft官网中国版弹窗
// @name:zh-TW        自動關閉Minecraft官網中國版彈窗
// @name:en           Automatically close the Minecraft Netease Edition pop-up window of the Minecraft official website
// @namespace         http://github.com/lingbopro/auto-close-netease-popup/
// @supportURL        http://github.com/lingbopro/auto-close-netease-popup/
// @version           1.0
// @description       [已失效] 自动关闭Minecraft官网的“前往中国版”弹窗
// @description:zh-CN [已失效] 自动关闭Minecraft官网的“前往中国版”弹窗
// @description:zh-TW [已失效] 自動關閉Minecraft官網的「前往中國版」彈窗
// @description:en    [EXPIRED] Automatically close the "Go to China Edition" pop-up window on the official Minecraft website
// @author            lingbopro
// @license           MIT
// @match             *://www.minecraft.net/*
// @connect           minecraft.net
// @icon              https://www.minecraft.net/etc.clientlibs/minecraft/clientlibs/main/resources/favicon.ico
// @grant             none
// @run-at            document-body
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/485133/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%ADMinecraft%E5%AE%98%E7%BD%91%E4%B8%AD%E5%9B%BD%E7%89%88%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/485133/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%ADMinecraft%E5%AE%98%E7%BD%91%E4%B8%AD%E5%9B%BD%E7%89%88%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("欢迎使用脚本「自动关闭Minecraft官网中国版弹窗」！");
    let runtimeCounter = 0; //防止运行次数过多所以设定变量记录运行次数

    setTimeout(function(){ //由于弹窗可能不在页面加载第一时间显示，所以尝试多次
        runtimeCounter += 1;
        console.debug(`第 ${runtimeCounter} 次尝试`);

        if(document.body.classList.contains("modal-open")) {
            document.body.classList.remove("modal-open"); //修改body的类名使页面可滚动
        }

        let popup = document.getElementById("netease-promotion-modal"); //获取弹窗元素
        if(!(typeof(popup) == "undefined" || popup == null)) { //判断元素是否存在
            popup.remove(); //如果存在就去除
            console.log("成功去除网易弹窗~");
            return; //结束执行
        }
        else {
            if(runtimeCounter >= 10) { //如果运行多次还是不行也停止
                console.error("尝试多次依然不能去除弹窗啊...");
                return;
            }
            setTimeout(this,100); //如果去除不成功就重试
        }
    },20);

})();