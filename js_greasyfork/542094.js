// ==UserScript==
// @name         超级单词表会员状态验证
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  在最后的结果页面，如果表格状态不是已取消会员或20年，里面的文字要用红色加粗显示。自动登录后执行验证。
// @author       KevinLiu
// @match        https://cms.superwords.cn/pages/login.html
// @match        https://cms.superwords.cn/pages/index.html
// @grant        GM_setClipboard
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542094/%E8%B6%85%E7%BA%A7%E5%8D%95%E8%AF%8D%E8%A1%A8%E4%BC%9A%E5%91%98%E7%8A%B6%E6%80%81%E9%AA%8C%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/542094/%E8%B6%85%E7%BA%A7%E5%8D%95%E8%AF%8D%E8%A1%A8%E4%BC%9A%E5%91%98%E7%8A%B6%E6%80%81%E9%AA%8C%E8%AF%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查当前页面URL
    const currentUrl = window.location.href;

    // 如果在首页，添加验证按钮并执行验证
    if (currentUrl.includes('index.html')) {
        // 添加按钮后自动执行验证
        addButtonAndAutoRun();
    }



    // 在首页添加按钮并自动运行验证
    function addButtonAndAutoRun() {
        console.log('检测到首页，添加验证按钮...');

        // 先添加按钮
        addButton();

        // 检查是否需要自动运行
        setTimeout(() => {
            if (sessionStorage.getItem('autoRunVerification') === 'true') {
                console.log('检测到自动运行标记，开始验证...');
                sessionStorage.removeItem('autoRunVerification'); // 清除标记

                // 延迟一下确保按钮完全加载
                setTimeout(() => {
                    const verifyButton = document.getElementById('verifyMemberStatusButton');
                    if (verifyButton) {
                        console.log('点击验证按钮...');
                        verifyButton.click();
                    } else {
                        console.error('找不到验证按钮');
                    }
                }, 500);
            }
        }, 1000);
    }

    // 添加按钮到页面
    function addButton() {
        const existingButton = document.getElementById('verifyMemberStatusButton');
        if (existingButton) existingButton.remove();

        const button = document.createElement('button');
        button.id = 'verifyMemberStatusButton';
        button.textContent = '验证会员状态';
        button.style.position = 'fixed';
        button.style.right = '20px';
        button.style.top = '100px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#FFA500';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        button.style.fontWeight = 'bold';

        button.addEventListener('click', main);
        document.body.appendChild(button);

        console.log('验证按钮已添加到页面');
    }

    // 主函数
    async function main() {
        try {
            // 获取剪切板内容
            let clipboardText = '';
            try {
                clipboardText = await navigator.clipboard.readText();
            } catch (error) {
                clipboardText = prompt('请粘贴要验证的手机号列表（每行一个手机号，或手机号+制表符+状态）', '');
                if (!clipboardText) return;
            }

            if (!clipboardText) {
                alert('剪切板内容为空！');
                return;
            }

            // 解析剪切板内容（兼容单手机号和带状态内容）
            const lines = clipboardText.split('\n').filter(line => line.trim());
            const phoneData = lines.map(line => {
                const parts = line.split('\t');
                return {
                    phone: parts[0].trim(),
                    status: parts[1] ? parts[1].trim() : null // 无状态时为null
                };
            }).filter(item => item.phone && /^\d{11}$/.test(item.phone));

            if (phoneData.length === 0) {
                alert('剪切板中没有有效的手机号！');
                return;
            }

            // 验证每个手机号
            const results = [];
            for (const data of phoneData) {
                const result = await verifyPhoneStatus(data.phone, data.status);
                const statusDisplay = data.status || "无状态信息";
                results.push(`${data.phone}\t${statusDisplay}\t${result.statusInTable}\t${result.verification}`);
            }

            // 显示结果
            showResults(results.join('\n'));
        } catch (error) {
            console.error('发生错误:', error);
            alert('发生错误: ' + error.message);
        }
    }

    // 验证手机号状态
    async function verifyPhoneStatus(phone, expectedStatus) {
        console.log(`开始验证手机号: ${phone}`);
        return new Promise(async (resolve) => {
            const result = {
                statusInTable: '未获取到状态',
                verification: '验证失败'
            };

            try {
                // 1. 安全获取文档上下文
                console.log('正在获取文档上下文...');
                const currentDoc = document.querySelector('#app') ? document :
                window.frames[0]?.document || document;
                console.log('文档上下文获取成功');

                // 2. 定位输入框并输入手机号
                console.log('正在定位手机号输入框...');
                const input = document.evaluate(
                    '//input[contains(@placeholder,"手机号")]',
                    currentDoc,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;

                if (!input) {
                    console.error('错误：找不到手机号输入框');
                    throw new Error('找不到手机号输入框');
                }
                console.log('已找到输入框，正在输入手机号...');
                input.value = phone;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                console.log('手机号输入完成');

                // 3. 点击查询按钮
                console.log('正在查找查询按钮...');
                const buttons = Array.from(currentDoc.querySelectorAll('button'));
                console.log(`找到 ${buttons.length} 个按钮`);

                const queryButton = buttons.find(btn => {
                    const text = btn.textContent || '';
                    return text.includes('查询');
                });

                if (!queryButton) {
                    console.error('错误：找不到查询按钮');
                    throw new Error('找不到查询按钮');
                }
                console.log('已找到查询按钮，正在点击...');
                queryButton.click();
                console.log('查询按钮点击完成');

                // 4. 等待并检查表格数据
                const startTime = Date.now();
                const maxWaitTime = 10000; // 最多等待10秒
                const checkInterval = 200; // 每200ms检查一次
                let checkCount = 0;

                console.log('开始等待数据加载...');
                while (Date.now() - startTime < maxWaitTime) {
                    checkCount++;
                    await new Promise(r => setTimeout(r, checkInterval));
                    console.log(`第 ${checkCount} 次检查（已等待 ${Date.now() - startTime}ms）`);

                    // 检查第一列手机号是否匹配
                    const phoneCell = document.evaluate(
                        '//*[@id="app"]/div/div[4]/div/div/div[4]/div[1]/div[3]/div/div[1]/div/table/tbody/tr/td[1]/div',
                        currentDoc,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                        null
                    ).singleNodeValue;

                    const currentPhone = phoneCell?.textContent?.trim();
                    console.log(`表格中的手机号: ${currentPhone || '空'}, 目标手机号: ${phone}`);

                    if (currentPhone === phone) {
                        console.log('手机号匹配成功，开始读取状态数据...');

                        // 读取第三列判断是否取消
                        const statusCell3 = document.evaluate(
                            '//*[@id="app"]/div/div[4]/div/div/div[4]/div[1]/div[3]/div/div[1]/div/table/tbody/tr/td[3]/div',
                            currentDoc,
                            null,
                            XPathResult.FIRST_ORDERED_NODE_TYPE,
                            null
                        ).singleNodeValue;

                        const statusText3 = statusCell3?.textContent?.trim() || '';
                        console.log(`第三列内容: ${statusText3}`);

                        const isCancelled = statusText3.includes('取消');
                        console.log(`是否取消状态: ${isCancelled}`);

                        const targetCol = isCancelled ? 3 : 2;
                        console.log(`将读取第 ${targetCol} 列数据`);

                        // 读取目标列数据
                        const targetCell = document.evaluate(
                            `//*[@id="app"]/div/div[4]/div/div/div[4]/div[1]/div[3]/div/div[1]/div/table/tbody/tr/td[${targetCol}]/div`,
                            currentDoc,
                            null,
                            XPathResult.FIRST_ORDERED_NODE_TYPE,
                            null
                        ).singleNodeValue;

                        const statusText = targetCell?.textContent?.trim() || '无状态信息';
                        console.log(`获取到的状态: ${statusText}`);

                        result.statusInTable = statusText;
                        result.verification = expectedStatus ?
                            (isCancelled === expectedStatus.includes('取消') ? '验证通过' : '验证未通过')
                        : '无需验证';

                        console.log('验证完成:', result);
                        resolve(result);
                        return;
                    }
                }

                const errorMsg = '查询超时，未找到匹配数据';
                console.error(errorMsg);
                throw new Error(errorMsg);

            } catch (error) {
                console.error('验证过程中发生错误:', error);
                result.statusInTable = `查询失败: ${error.message}`;
                console.log('将返回错误结果:', result);
                resolve(result);
            }
        });
    }

    // 显示结果
    function showResults(resultText) {
        const resultWindow = window.open('', '_blank', 'width=900,height=600');
        resultWindow.document.write(`
            <html>
                <head>
                    <title>会员状态验证结果</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                        th { background-color: #f2f2f2; position: sticky; top: 0; }
                        .pass { color: green; }
                        .fail { color: red; }
                        .no-verify { color: #666; }
                        .container { max-width: 100%; overflow-x: auto; }
                    </style>
                </head>
                <body>
                    <h1>会员状态验证结果</h1>
                    <div class="container">
                        <table>
                            <tr>
                                <th>手机号</th>
                                <th>原始状态</th>
                                <th>表格状态</th>
                                <th>验证结果</th>
                            </tr>
                            ${resultText.split('\n').map(line => {
                                const [phone, originalStatus, tableStatus, verification] = line.split('\t');
                                const rowClass = verification === '验证通过' ? 'pass' :
                                                verification === '验证未通过' ? 'fail' : 'no-verify';
                                const statusStyle = (!tableStatus.includes('取消') && !tableStatus.includes('20年'))
                                    ? 'color: red; font-weight: bold;'
                                    : '';
                                return `<tr class="${rowClass}">
                                    <td>${phone}</td>
                                    <td>${originalStatus}</td>
                                    <td style="${statusStyle}">${tableStatus}</td>
                                    <td>${verification}</td>
                                </tr>`;
                            }).join('')}
                        </table>
                    </div>
                    <button onclick="window.close()" style="margin-top: 20px; padding: 10px 20px;
                        background-color: #409EFF; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        关闭
                    </button>
                </body>
            </html>
        `);
    }

    // 页面加载完成后添加按钮（备用逻辑）
    if (currentUrl.includes('index.html') && (document.readyState === 'complete' || document.readyState === 'interactive')) {
        setTimeout(addButton, 1000);
    } else if (currentUrl.includes('index.html')) {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                addButton();
                // 如果是从登录页面跳转过来的，自动运行
                if (sessionStorage.getItem('autoRunVerification') === 'true') {
                    setTimeout(() => {
                        const verifyButton = document.getElementById('verifyMemberStatusButton');
                        if (verifyButton) {
                            verifyButton.click();
                        }
                    }, 1000);
                }
            }, 500);
        });
    }
})();