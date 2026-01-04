// ==UserScript==
// @name         二审-时效推送
// @namespace    http://tampermonkey.net/
// @version      2.8
// @author       刚学会做蛋饼
// @license      MIT
// @description  支持小时级数据监控、时效阈值报警、总群推送（含待审量与平均时效）
// @match        https://ilabel.weixin.qq.com/data-statistic?members=oUCl2wABmBOxA0PxXwpHzuAyG3zc&missionIds=6102
// @grant        GM_xmlhttpRequest
// @connect      qyapi.weixin.qq.com
// @downloadURL https://update.greasyfork.org/scripts/542994/%E4%BA%8C%E5%AE%A1-%E6%97%B6%E6%95%88%E6%8E%A8%E9%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/542994/%E4%BA%8C%E5%AE%A1-%E6%97%B6%E6%95%88%E6%8E%A8%E9%80%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /** ==========【配置区】=========== **/

    const summaryWebhook = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=425e61b4-14d5-405a-bc88-bc696d8a6745'; // 群通知地址
    const summaryWebhook2 = ''; // 第二个群可选，留空忽略

    const 启用时效阈值检测 = false; // 👉 是否只在超过阈值才发送通知（true = 开启，false = 全部推送）
    const 报警阈值分钟 = 60; // 👉 设置报警阈值：小时平均时效 ≥ 多少分钟才推送

    /** ==========【小时XPaths定义】=========== **/
    const hourXPaths = [
        { hour: "5小时前1小时", pendingXPath: '/html/body/div[1]/div/div[2]/section/div[1]/div[3]/div/div[2]/div[2]/div[2]/div/div/div/div[2]/div[1]/div/div[1]/div[3]/table/tbody/tr[5]/td[3]/div', timeXPath: '/html/body/div[1]/div/div[2]/section/div[1]/div[3]/div/div[2]/div[2]/div[2]/div/div/div/div[2]/div[1]/div/div[1]/div[4]/div[2]/table/tbody/tr[5]/td[1]/div/span', avgTimeXPath: '/html/body/div[1]/div/div[2]/section/div[1]/div[3]/div/div[2]/div[2]/div[2]/div/div/div/div[2]/div[1]/div/div[1]/div[3]/table/tbody/tr[5]/td[5]/div' },
        { hour: "5小时前2小时", pendingXPath: '/html/body/div[1]/div/div[2]/section/div[1]/div[3]/div/div[2]/div[2]/div[2]/div/div/div/div[2]/div[1]/div/div[1]/div[3]/table/tbody/tr[4]/td[3]/div', timeXPath: '/html/body/div[1]/div/div[2]/section/div[1]/div[3]/div/div[2]/div[2]/div[2]/div/div/div/div[2]/div[1]/div/div[1]/div[4]/div[2]/table/tbody/tr[4]/td[1]/div/span', avgTimeXPath: '/html/body/div[1]/div/div[2]/section/div[1]/div[3]/div/div[2]/div[2]/div[2]/div/div/div/div[2]/div[1]/div/div[1]/div[3]/table/tbody/tr[4]/td[5]/div' },
        { hour: "5小时前3小时", pendingXPath: '/html/body/div[1]/div/div[2]/section/div[1]/div[3]/div/div[2]/div[2]/div[2]/div/div/div/div[2]/div[1]/div/div[1]/div[3]/table/tbody/tr[3]/td[3]/div', timeXPath: '/html/body/div[1]/div/div[2]/section/div[1]/div[3]/div/div[2]/div[2]/div[2]/div/div/div/div[2]/div[1]/div/div[1]/div[4]/div[2]/table/tbody/tr[3]/td[1]/div/span', avgTimeXPath: '/html/body/div[1]/div/div[2]/section/div[1]/div[3]/div/div[2]/div[2]/div[2]/div/div/div/div[2]/div[1]/div/div[1]/div[3]/table/tbody/tr[3]/td[5]/div' },
        { hour: "5小时前4小时", pendingXPath: '/html/body/div[1]/div/div[2]/section/div[1]/div[3]/div/div[2]/div[2]/div[2]/div/div/div/div[2]/div[1]/div/div[1]/div[3]/table/tbody/tr[2]/td[3]/div', timeXPath: '/html/body/div[1]/div/div[2]/section/div[1]/div[3]/div/div[2]/div[2]/div[2]/div/div/div/div[2]/div[1]/div/div[1]/div[4]/div[2]/table/tbody/tr[2]/td[1]/div/span', avgTimeXPath: '/html/body/div[1]/div/div[2]/section/div[1]/div[3]/div/div[2]/div[2]/div[2]/div/div/div/div[2]/div[1]/div/div[1]/div[3]/table/tbody/tr[2]/td[5]/div' },
        { hour: "5小时前5小时", pendingXPath: '/html/body/div[1]/div/div[2]/section/div[1]/div[3]/div/div[2]/div[2]/div[2]/div/div/div/div[2]/div[1]/div/div[1]/div[3]/table/tbody/tr[1]/td[3]/div', timeXPath: '/html/body/div[1]/div/div[2]/section/div[1]/div[3]/div/div[2]/div[2]/div[2]/div/div/div/div[2]/div[1]/div/div[1]/div[4]/div[2]/table/tbody/tr[1]/td[1]/div/span', avgTimeXPath: '/html/body/div[1]/div/div[2]/section/div[1]/div[3]/div/div[2]/div[2]/div[2]/div/div/div/div[2]/div[1]/div/div[1]/div[3]/table/tbody/tr[1]/td[5]/div' }
    ];

    const totalPendingXPath = '/html/body/div[1]/div/div[2]/section/div[1]/div[3]/div/div[2]/div[2]/div[2]/div/div/div/div[2]/div[1]/div/div[1]/div[3]/table/tbody/tr[6]/td[3]/div';
    const overallAvgTimeXPath = '/html/body/div[1]/div/div[2]/section/div[1]/div[3]/div/div[2]/div[2]/div[2]/div/div/div/div[2]/div[1]/div/div[1]/div[3]/table/tbody/tr[7]/td[5]/div';

    function getXPathText(xpath) {
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue ? result.singleNodeValue.textContent.trim() : '';
    }

    function secondsToMinutesInt(secText) {
        const sec = parseFloat(secText);
        if (isNaN(sec)) return '未知';
        return Math.round(sec / 60);
    }

    function sendToWebhooks(content, urls) {
        const targets = Array.isArray(urls) ? urls : [urls];
        targets.forEach(url => {
            if (!url) return;
            GM_xmlhttpRequest({
                method: 'POST',
                url,
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({
                    msgtype: "markdown",
                    markdown: { content }
                }),
                onload: () => console.log(`[✅发送成功]`, url),
                onerror: err => console.error(`[❌发送失败]`, url, err)
            });
        });
    }

    function detectHourlyPending() {
        console.log('⌛ 正在按小时检测是否有堆积...');

        const totalPending = getXPathText(totalPendingXPath);
        const overallAvgTime = getXPathText(overallAvgTimeXPath);
        const overallAvgTimeMin = secondsToMinutesInt(overallAvgTime);

        for (let i = 0; i < hourXPaths.length; i++) {
            const hour = hourXPaths[i];
            const pendingText = getXPathText(hour.pendingXPath);
            const pending = parseInt(pendingText) || 0;

            console.log(`[调试] ${hour.hour} 待审量: ${pending}，待审量文本: '${pendingText}'`);

            if (pending === 0) {
                console.log(`ℹ️ [${hour.hour}] 待审量为0，跳过，继续检测下一小时`);
                continue;
            }

            const timeText = getXPathText(hour.timeXPath);
            const avgTime = getXPathText(hour.avgTimeXPath);
            const avgTimeMin = secondsToMinutesInt(avgTime);

            console.log(`[调试] ${hour.hour} 平均时效(秒): '${avgTime}', 转分钟: ${avgTimeMin}`);

            if (启用时效阈值检测 && avgTimeMin < 报警阈值分钟) {
                console.log(`📉 [${hour.hour}] 平均时效 ${avgTimeMin} 分钟，未超过阈值(${报警阈值分钟})，跳过推送`);
                continue;
            }

            const hourOnly = timeText.match(/\d{2}(?=:|$)/)?.[0] || hour.hour.replace("点", "");
            const hourLabel = `${hourOnly}:00`;

            const content = `【二审】最长超时：${avgTimeMin} 分钟\n` +
                `> 堆积小时：${hourLabel}\n` +
                `> ${hourLabel}待审量：${pendingText}\n` +
                `> 总待审量：${totalPending || '未知'}\n` +
                `> 今日平均时效：${overallAvgTimeMin} 分钟\n` +
                `🕒 时间：${new Date().toLocaleString()}`;

            sendToWebhooks(content, summaryWebhook2 || summaryWebhook);

            console.log(`[推送完成] 内容已发送，停止本轮检测`);
            return; // 推送一次停止检测
        }

        console.log('✅ 各小时无堆积，无需推送');
    }

    function waitForElement(xpath, callback, timeout = 15000) {
        let elapsed = 0;
        const timer = setInterval(() => {
            const el = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (el) {
                clearInterval(timer);
                callback();
                setInterval(callback, 5 * 60 * 2000); // 每5分钟执行一次
            } else {
                elapsed += 500;
                if (elapsed >= timeout) {
                    clearInterval(timer);
                    console.warn('⏰ 超时未找到元素：', xpath);
                }
            }
        }, 500);
    }

    window.addEventListener('load', () => {
        waitForElement(hourXPaths[0].pendingXPath, detectHourlyPending);
    });

})();
