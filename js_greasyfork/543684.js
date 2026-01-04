// ==UserScript==
// @name         报时掉线提醒-商品
// @namespace    http://tampermonkey.net/
// @version      3.0
// @author       刚学会做蛋饼
// @license      MIT
// @description  每30分钟刷新页面并检测是否掉线，若掉线则通过企业微信发送报警（含掉线时长与具体位置）
// @match        https://wanx.myapp.com/omp/data-manage/quick-look*
// @match        https://wanx.myapp.com/login
// @grant        GM_xmlhttpRequest
// @connect      qyapi.weixin.qq.com
// @downloadURL https://update.greasyfork.org/scripts/543684/%E6%8A%A5%E6%97%B6%E6%8E%89%E7%BA%BF%E6%8F%90%E9%86%92-%E5%95%86%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/543684/%E6%8A%A5%E6%97%B6%E6%8E%89%E7%BA%BF%E6%8F%90%E9%86%92-%E5%95%86%E5%93%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ✅ 检测频率：30分钟刷新一次页面
    const checkInterval = 30 * 60 * 1000;

    // ✅ Webhook 地址（请替换为你自己的）
    const webhookUrl = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=7c58ba30-c6c5-4ca1-95de-535c7a69695c';

    let offlineStartTime = null; // ⏱️ 掉线起始时间

    function log(msg) {
        const time = new Date().toLocaleString();
        console.log(`[掉线检测][${time}] ${msg}`);
    }

    // ✅ 检查是否存在“数据管理”菜单项
    function hasDataMenu() {
        const elements = document.querySelectorAll('.el-submenu__title');
        for (let el of elements) {
            if (el.textContent.includes('数据管理')) {
                return true;
            }
        }
        return false;
    }

    // ✅ 检查“板块快看”是否出现在指定 XPath 位置
    function hasBlockTitle() {
        const node = document.evaluate(
            '/html/body/div[2]/div[2]/div[1]/main/div/div/h4/div[1]/span[1]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        return node && node.textContent.includes('板块快看');
    }

    // ✅ 发送企业微信报警
    function sendAlert(reason, durationText = '') {
        const now = new Date();
        const payload = {
            msgtype: 'text',
            text: {
                content: `⚠️ 掉线检测异常：${reason}\n${durationText}时间：${now.toLocaleString()}`
            }
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: webhookUrl,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(payload),
            onload: function (response) {
                log(`📤 报警发送成功，响应状态：${response.status}`);
            },
            onerror: function (error) {
                log(`❌ 报警发送失败：${JSON.stringify(error)}`);
            }
        });
    }

    // ✅ 掉线检测主函数
    async function checkElementAndNotify() {
        log('🔍 开始执行掉线检测...');

        const inLoginPage = location.href.includes('/login');
        const dataMenuPresent = hasDataMenu();
        const blockTitlePresent = hasBlockTitle();

        if (dataMenuPresent && blockTitlePresent && !inLoginPage) {
            log('✅ 页面状态正常（数据管理 + 板块快看）');

            // 如果之前掉线，现在恢复了，清空状态
            if (offlineStartTime !== null) {
                log(`✅ 页面已恢复，清除掉线状态`);
                offlineStartTime = null;
            }
            return;
        }

        // 记录掉线开始时间
        if (!offlineStartTime) {
            offlineStartTime = new Date();
        }
        const now = new Date();
        const durationMin = Math.floor((now - offlineStartTime) / 60000);
        const durationText = `已掉线：${durationMin} 分钟\n`;

        // 逐个判断掉线原因
        if (inLoginPage) {
            log('❌ 当前页面为登录页，已掉线');
            sendAlert('页面跳转至登录页，已掉线', durationText);
        } else if (!dataMenuPresent) {
            log('❌ 页面缺失“数据管理”元素，可能掉线或权限异常');
            sendAlert('页面缺失“数据管理”关键元素', durationText);
        } else if (!blockTitlePresent) {
            log('❌ 页面缺失“板块快看”文字，页面结构异常');
            sendAlert('不在数据监控看板，已掉线', durationText);
        }
    }

    // ✅ 页面加载完成后，延迟检测（避免部分元素未加载）
    window.addEventListener('load', () => {
        setTimeout(checkElementAndNotify, 1500);
    });

    // ✅ 定时刷新（含最多60秒的随机延迟）
    const randomOffset = Math.floor(Math.random() * 60000);
    setTimeout(() => {
        setInterval(() => {
            log('⏱️ 到点刷新页面...');
            location.reload(); // 刷新后自动触发检测逻辑
        }, checkInterval);
    }, randomOffset);
})();
