// ==UserScript==
// @name         腾讯元宝自动切换为deepseek-r1
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自动点击指定模型切换按钮,删除电脑版广告
// @author       leonecho
// @match        https://yuanbao.tencent.com/chat/*
// @license      GPL-3.0 License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527964/%E8%85%BE%E8%AE%AF%E5%85%83%E5%AE%9D%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E4%B8%BAdeepseek-r1.user.js
// @updateURL https://update.greasyfork.org/scripts/527964/%E8%85%BE%E8%AE%AF%E5%85%83%E5%AE%9D%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E4%B8%BAdeepseek-r1.meta.js
// ==/UserScript==

var buttonCount = 0;
var divCount = 0;
var qrCount = 0;

(function() {
    'use strict';
    function clickTargetButton() {
        // 使用更精确的组合选择器
        const button = document.querySelector('button[dt-button-id="model_switch"][dt-model-id="hunyuan_t1"]');
        if (button) {
            console.log('找到目标按钮，正在点击...');
            button.click();
        } else {
            if (buttonCount < 10) {
                buttonCount = buttonCount + 1;
                console.log('未找到目标按钮');
                // 如果按钮是动态加载的，可以设置重试机制
                setTimeout(clickTargetButton, 500);
            }
        }
    }

    function clickTargetDiv() {
        const divSelector = document.querySelector("#hunyuan-bot > div.t-portal-wrapper.enter-done > div > div > div > div:nth-child(2) > li > span > div");
        if (divSelector) {
            console.log('找到div，正在点击...');
            divSelector.click();
        } else {
            if (divCount < 10) {
                divCount = divCount + 1;
                console.log('未找到div');
                setTimeout(clickTargetDiv, 500);
            }
        }
    }

    function removeqrcode() {
        // const qrcode = document.querySelector("div.agent-dialogue__content-qrcode");
        const qrcode = document.querySelector("div.index_downloadPCAdsWrapperNew__Xv41k");
        if (qrcode) {
            console.log('找到二维码，准备删除');
            qrcode.remove();
        } else {
            if (qrCount < 50) {
                qrCount = qrCount + 1;
                console.log('未找到二维码');
                setTimeout(removeqrcode, 100);
            }
        }
    }

    // 常规页面加载触发
    window.addEventListener('load', function() {
        removeqrcode();
        clickTargetButton();
        // 添加延迟确保所有元素加载完成
        setTimeout(clickTargetDiv, 500);
    });

})();