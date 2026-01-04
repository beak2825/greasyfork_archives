// ==UserScript==
// @name         流量统计脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在页面上创建一个悬浮窗，用于执行流量统计命令
// @author       You
// @match        https://pfgo.hperformence.top/forward_rules
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/483830/%E6%B5%81%E9%87%8F%E7%BB%9F%E8%AE%A1%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/483830/%E6%B5%81%E9%87%8F%E7%BB%9F%E8%AE%A1%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建悬浮窗
    const floatingWindow = document.createElement('div');
    floatingWindow.innerHTML = `
        <div id="floating-window" style="position: fixed; top: 50px; right: 50px; padding: 10px; background-color: #fff; border: 1px solid #ccc; z-index: 9999;">
            <button id="calculate-button">统计流量</button>
            <button id="actual-traffic-button">实际流量</button>
            <span id="result">总流量：0 GB</span>
            <span id="actual-result">实际流量：0 GB</span>
            <div id="debug-output" style="margin-top: 10px;"></div>
        </div>
    `;
    document.body.appendChild(floatingWindow);

    // 注册菜单命令
    GM_registerMenuCommand('统计流量', () => {
        calculateTraffic(true); // 调试模式
    });

    GM_registerMenuCommand('实际流量', () => {
        calculateActualTraffic();
    });

    // 点击按钮执行流量统计
    document.getElementById('calculate-button').addEventListener('click', () => calculateTraffic(false));

    // 点击按钮计算实际流量
    document.getElementById('actual-traffic-button').addEventListener('click', calculateActualTraffic);

    // 流量统计函数
    function calculateTraffic(debugMode) {
        const allElements = document.querySelectorAll('*'); // 获取所有元素
        let totalTraffic = 0;
        let matchedElements = [];
        let debugOutput = '';

        console.log('开始统计流量');

        // 遍历所有元素，找到包含指定文本的元素
        allElements.forEach(element => {
            const text = element.textContent || element.innerText;

            // 修改正则表达式，匹配数字 + 已用流量 + 数字 + GB
            const matches = text.match(/(\d+(\.\d+)?)\s*已用流量\s*(\d+(\.\d+)?)\s*GB/g);
            if (matches) {
                matches.forEach(match => {
                    if (!matchedElements.includes(match)) {
                        const usedTraffic = parseFloat(match.split('已用流量')[1]);
                        totalTraffic += usedTraffic;

                        matchedElements.push(match);

                        if (debugMode) {
                            if (debugOutput !== '') {
                                debugOutput += ' + ';
                            }
                            debugOutput += usedTraffic;
                        }
                    }
                });
            }
        });

        console.log('统计完成，总流量：', totalTraffic);

        if (debugMode) {
            document.getElementById('debug-output').innerText = `运算过程：${debugOutput} = ${totalTraffic.toFixed(2)} GB`;
        }

        document.getElementById('result').innerText = `总流量：${totalTraffic.toFixed(2)} GB`;
    }

    // 计算实际流量
    function calculateActualTraffic() {
        const totalTrafficElement = document.getElementById('result');
        const totalTraffic = parseFloat(totalTrafficElement.innerText.split('总流量：')[1]);

        const actualTraffic = totalTraffic / 0.3;

        document.getElementById('actual-result').innerText = `实际流量：${actualTraffic.toFixed(2)} GB`;
    }
})();
