// ==UserScript==
// @name         报时掉线提醒-商品
// @namespace    http://tampermonkey.net/
// @version      3.1
// @author       刚学会做蛋饼
// @license      MIT
// @description  检测是否掉线，若掉线则通过企业微信发送报警（无自动刷新、无掉线分钟提示）
// @match        https://wanx.myapp.com/omp/data-manage/quick-look
// @match        https://wanx.myapp.com/login
// @grant        GM_xmlhttpRequest
// @connect      qyapi.weixin.qq.com
// @downloadURL https://update.greasyfork.org/scripts/540096/%E6%8A%A5%E6%97%B6%E6%8E%89%E7%BA%BF%E6%8F%90%E9%86%92-%E5%95%86%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/540096/%E6%8A%A5%E6%97%B6%E6%8E%89%E7%BA%BF%E6%8F%90%E9%86%92-%E5%95%86%E5%93%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const webhookUrl = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=7c58ba30-c6c5-4ca1-95de-535c7a69695c';

    let offlineStartTime = null;

    function log(msg) {
        const time = new Date().toLocaleString();
        console.log(`[掉线检测][${time}] ${msg}`);
    }

    function hasDataMenu() {
        const elements = document.querySelectorAll('.el-submenu__title');
        for (let el of elements) {
            if (el.textContent.includes('数据管理')) {
                return true;
            }
        }
        return false;
    }

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

    function sendAlert(reason) {
        const now = new Date();
        const payload = {
            msgtype: 'text',
            text: {
                content: `⚠️ 掉线检测异常：${reason}\n时间：${now.toLocaleString()}`
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

    async function checkElementAndNotify() {
        log('🔍 开始执行掉线检测...');

        const inLoginPage = location.href.includes('/login');
        const dataMenuPresent = hasDataMenu();
        const blockTitlePresent = hasBlockTitle();

        if (dataMenuPresent && blockTitlePresent && !inLoginPage) {
            log('✅ 页面状态正常（数据管理 + 板块快看）');

            if (offlineStartTime !== null) {
                log(`✅ 页面已恢复，清除掉线状态`);
                offlineStartTime = null;
            }
            return;
        }

        if (!offlineStartTime) {
            offlineStartTime = new Date();
        }

        if (inLoginPage) {
            log('❌ 当前页面为登录页，已掉线');
            sendAlert('页面跳转至登录页，已掉线');
        } else if (!dataMenuPresent) {
            log('❌ 页面缺失“数据管理”元素，可能掉线或权限异常');
            sendAlert('页面缺失“数据管理”关键元素');
        } else if (!blockTitlePresent) {
            log('❌ 页面缺失“板块快看”文字，页面结构异常');
            sendAlert('不在数据监控看板，已掉线');
        }
    }

    window.addEventListener('load', () => {
        setTimeout(checkElementAndNotify, 1500);
    });

    // ❌ 自动刷新逻辑已移除
})();
