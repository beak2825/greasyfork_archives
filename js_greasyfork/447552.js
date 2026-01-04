// ==UserScript==
// @name         知乎网页版免登录
// @description  简单实现了知乎网页版免登录功能, 原理是用js自动关闭弹窗.
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @author       bode135
// @match        *://*.zhihu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @note         v1.0.2: 加快检测速度, 基本做到无缝关闭. 
// @note         v1.0.3: 完善提示信息. 
// @downloadURL https://update.greasyfork.org/scripts/447552/%E7%9F%A5%E4%B9%8E%E7%BD%91%E9%A1%B5%E7%89%88%E5%85%8D%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/447552/%E7%9F%A5%E4%B9%8E%E7%BD%91%E9%A1%B5%E7%89%88%E5%85%8D%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log("--- start: 知乎网页版免登录脚本");


    // 运行间隔
    var RUNNING_INTERVAL = 0.1 * 1000;

    // 最大运行时间
    var MAX_RUNNING_TIME = 60 * 60 * 1000;


    function x1(xpath) {
        // 用xpath定位一个元素
        var result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
        return result.iterateNext();
    }

    // 运行次数记录
    var ts = 1;

    // 是否还在检索弹窗1(大屏登录弹窗)和弹窗2(右下登录弹窗), 只有两个都检索到了, 或者超过了最大运行时间, 本脚本才会停止运行
    var search_toast_1 = true;
    var search_toast_2 = true;

    var startTime = new Date().getTime();

    function close_login_toasts()
    {
        var searching_end_flag = (!search_toast_1 && !search_toast_2);
        if(new Date().getTime() - startTime > MAX_RUNNING_TIME || searching_end_flag)
        {
            clearInterval(interval_1);
            console.log("=========== 脚本已结束 ==============");
            if (searching_end_flag)
            {
                console.log("*** 所有登录弹窗均已关闭, 成功结束运行!");
            }
            else
           {
               console.log("*** 达到最大运行时间, 但没有检测完全部登录弹窗, 免登录脚本退出.");
            }
            return;
        }

        if (search_toast_1)
        {
            var xpath_1 = "//button[@aria-label='关闭']";
            var elem = x1(xpath_1);
            if(elem)
            {
                elem.click();
                search_toast_1 = false;
                console.log("~~~ 检测到[屏幕正中间登录提示]弹窗!");
            }
        }

        if (search_toast_2)
        {
            xpath_1 = '//span[contains(text(), "登录即可查看")]';
            elem = x1(xpath_1);
            if(elem)
            {
                elem.parentNode.remove();
                search_toast_2 = false;
                console.log("~~~ 检测到[右下角登录提示]弹窗!");
            }
        }

        //if (++ts % 10 == 0)
        //{
        //    console.log("---~~~~~~ 免登录脚本运行次数:", ts);
        //}
    }

    var interval_1 = setInterval(close_login_toasts, RUNNING_INTERVAL);

    // --- 检索右上角的登录弹窗
    var timesRun = 0;
    var search_toast_1_next = true;

    function _close_toast_1_next()
    {
        timesRun++;
        if (timesRun > 100 || (!search_toast_1_next))
        {
            clearInterval(interval_2);
            if (!search_toast_1_next)
            {
                console.log("~~~ 检测到[右上角登录权益提示]弹窗!");
            }
        }
        else
        {
            // console.log("--------- searchint toast_1_next ! timesRun: ", timesRun);
        }

        var xpath_1 = '//div[contains(text(), "登录知乎，您可以享受以下权益")]';
        var elem = x1(xpath_1);
        if(elem)
        {

            elem.parentNode.remove();
            search_toast_1_next = false;
        }
    }

    var interval_2 = setInterval(_close_toast_1_next, 500);
})();