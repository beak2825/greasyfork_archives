// ==UserScript==
// @name         P05 定时刷新
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @author       for419
// @license      MIT
// @description  根据变量tm的值决定是定时刷新还是随机时间刷新网页，并显示提醒
// @icon         https://www.cbirc.gov.cn/cn/static/favicon.ico

// @match        *://1111*/*  // 匹配所有网页
// @match        *://10.2.10.25:7005/lms/app/lms/student/Learn/*
// @match        *://piccelearning.zhixueyun.com/*
// @match        *://piccelearning.zhixueyun.com/*/study/*44

// @exclude      *://piccelearning.zhixueyun.com/#/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522702/P05%20%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/522702/P05%20%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置部分
    const timedRefreshInterval = 1500; // 定时刷新间隔，单位为秒
    const randomRefreshMin = 30; // 随机刷新最小间隔，单位为秒
    const randomRefreshMax = 620; // 随机刷新最大间隔，单位为秒

    // 声明变量tm，并初始化为1（定时刷新）或0（随机刷新）
    // 在实际使用中，你可能需要通过某种方式动态地设置这个值
    let tm = 1; // 设置为1表示定时刷新，设置为0表示随机时间刷新

    // 刷新页面
    function refreshPage() {
        window.location.reload();
    }

    // 显示提醒
    function showAlert(message) {
     //  alert(message);
    }

    // 定时刷新
    function timedRefresh() {
      //  showAlert(`定时刷新：每 ${timedRefreshInterval} 秒刷新一次`);
        setInterval(refreshPage, timedRefreshInterval * 1000);
    }

    // 随机时间刷新
    function randomRefresh() {
        function getRandomInterval() {
            return Math.floor(Math.random() * (randomRefreshMax - randomRefreshMin + 1)) + randomRefreshMin;
        }

        let randomInterval = getRandomInterval();
   //     showAlert(`随机刷新：下一次刷新在 ${randomInterval} 秒后`);

        setTimeout(function randomRefreshTimeout() {
            refreshPage();
            // 递归调用以继续随机刷新
            randomRefresh();
        }, randomInterval * 1000);
    }

    // 初始化脚本
    function init() {
        if (tm === 1) {
            timedRefresh();
        } else if (tm === 0) {
            randomRefresh();
        } else {
            // 如果tm不是0或1，可以选择显示一个警告或者不做任何操作
            showAlert('未知的刷新模式，请检查变量tm的值');
        }
    }

    // 调用初始化函数
    init();
})();
