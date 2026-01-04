// ==UserScript==
// @name         ClearDivs
// @namespace    http://freeoc.net/
// @version      0.5.0
// @description  试图删除网页中那些烦人的 div 元素（无意义/烦人的弹窗、提示框等）
// @author       Free
// @match        https://www.bilibili.com/
// @match        https://www.douyu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476063/ClearDivs.user.js
// @updateURL https://update.greasyfork.org/scripts/476063/ClearDivs.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 正则
    const patternForBili = /^(http|https):\/\/www\.bilibili\.com/;
    const patternForDy = /^(http|https):\/\/www\.douyu\.com\/.*/;

    // 当前访问的网站地址
    const currentURL = window.location.href;

    // Bilibili
    if (patternForBili.test(currentURL)) {
        const ret = ClearByClassName("adblock-tips");
        if (ret.code === 0) {
            console.log(ret.msg);
        }
    }

    // 斗鱼直播间弹窗，充值优惠提醒
    // 从命名来看可能是类似于 七月充值返厂 之类的，后续可能会失效
    if (patternForDy.test(currentURL)) {
        // 斗鱼直播间的垃圾太多，不一定能第一时间加载出来，所以可以等待3秒
        sleep(3000).then(() => {
            const ret = ClearByClassName("RechangeJulyPopups");
            if (ret.code === 0) {
                console.log(ret.msg);
            }
            // 新增屏蔽弹窗 2024.5.31
            const ret2 = ClearByClassName("RechangeJulyPopups-content");
            if (ret2.code === 0) {
                console.log(ret2.msg);
            }
        });
    }

    function ClearByClassName(className) {
        const div = document.getElementsByClassName(className);
        if (div != null && div != undefined && div.length > 0) {
            for (let i = div.length - 1; i >= 0; i--) {
                if (div[i] != null && div != undefined) {
                    div[i].parentNode.removeChild(div[i]);
                }
            }
            return { code: 1, msg: 'success' };
        } else {
            return { code: 0, msg: '该弹窗未检出，或失效' };
        }
    }

    // 睡眠函数
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();