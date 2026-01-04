// ==UserScript==
// @name         RRP屏蔽通知声音
// @namespace    http://tampermonkey.net/
// @version      1.1_20240517
// @description  及时禁止系统的通知声音
// @author       iSwfe
// @match        https://rrp.gzroadrescue.com/*
// @match        http://test.gzroadrescue.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rrp.gzroadrescue.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/495159/RRP%E5%B1%8F%E8%94%BD%E9%80%9A%E7%9F%A5%E5%A3%B0%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/495159/RRP%E5%B1%8F%E8%94%BD%E9%80%9A%E7%9F%A5%E5%A3%B0%E9%9F%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // Log Title
    const logTitle = 'RRP屏蔽通知声音';
    // 声音播放多久后停止（单位：秒）
    const stopDuration = 0.2;
    // 触发器运行间隔时长（单位：秒）
    const triggerInterval = 0.2;
    // 触发器检测超时（单位：秒）
    const triggerTimeout = 0;
    // 触发器是否常驻
    const triggerPermenant = false;


    var handler = () => {
        console.log("【%s】登录进入系统，开始注入...", logTitle);

        var audioEle = document.querySelector("audio");
        audioEle.onplay = () => {
            var contentDiv = document.querySelector(".pop_cont");
            console.log('[%s] start playing... content:【%s】', new Date().toLocaleTimeString(), contentDiv && contentDiv.textContent);
            setTimeout(() => {
                audioEle.load();
                console.log("[%s] stop playing.", new Date().toLocaleTimeString());
            }, stopDuration * 1000)
        }

        console.log("【%s】功能已注入。", logTitle);
    };

    var trigger = () => {
        return !! document.querySelector("audio");
    };


    var triggerExecute = (handler, trigger, triggerInterval, triggerTimeout, triggerPermenant) => {
        var timeoutId;
        var intervalId = setInterval(() => {
            if(trigger()){
                if (!triggerPermenant) {
                    clearInterval(intervalId);
                    clearTimeout(timeoutId);
                }
                handler();
                return;
            }
        }, triggerInterval * 1000);
        if (triggerTimeout > 0) {
            timeoutId = setTimeout(() => {
                clearInterval(intervalId);
                console.log("【%s】触发条件匹配超时，已取消。", logTitle);
            }, triggerTimeout * 1000);
        }
    };

    var router = document.querySelector('#app').__vue__.$router;
    router.afterHooks.push(newRouter => {
        if (/^\/login/.test(newRouter.path)) {
            console.log('【%s】登录页，取消注入.', logTitle);
            return;
        }
        triggerExecute(handler, trigger, triggerInterval, triggerTimeout, triggerPermenant);
    });

})();