// ==UserScript==
// @name         获取表格数据并输出到控制台
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  用户点击指定元素后等待3秒获取表格数据并输出到控制台，检查 operat 下下载链接，并在新页面打开链接后，等待当前标签页加载完成，等待 3 秒后关闭符合条件的标签页。并且在每次循环后模拟点击“下一页”按钮。
// @author       Your Name
// @match        http://175.27.157.42:5656/kns8s/defaultresult/index
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516331/%E8%8E%B7%E5%8F%96%E8%A1%A8%E6%A0%BC%E6%95%B0%E6%8D%AE%E5%B9%B6%E8%BE%93%E5%87%BA%E5%88%B0%E6%8E%A7%E5%88%B6%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/516331/%E8%8E%B7%E5%8F%96%E8%A1%A8%E6%A0%BC%E6%95%B0%E6%8D%AE%E5%B9%B6%E8%BE%93%E5%87%BA%E5%88%B0%E6%8E%A7%E5%88%B6%E5%8F%B0.meta.js
// ==/UserScript==
// @license MIT

(function() {
    'use strict';

    // 获取点击按钮元素（通过 xpath）
    const buttonXpath = '/html/body/div[2]/div[1]/div[1]/div/div/div[2]/div/input[2]';
    const button = document.evaluate(buttonXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (button) {
        // 监听点击事件
        button.addEventListener('click', async function() {
            while (true) {
                console.log('等待3秒...');
                // 等待 3 秒（模拟请求数据并等待服务器响应）
                await new Promise(resolve => setTimeout(resolve, 3000));

                console.log('3秒等待结束，开始获取表格数据...');

                // 获取目标表格
                const rows = document.querySelectorAll('table.result-table-list tbody tr');
                if (rows.length > 0) {
                    for (let row of rows) {
                        // 获取每个td的值
                        const seq = row.querySelector('td.seq');
                        const name = row.querySelector('td.name');
                        const author = row.querySelector('td.author');
                        const source = row.querySelector('td.source');
                        const date = row.querySelector('td.date');
                        const data = row.querySelector('td.data');
                        const quote = row.querySelector('td.quote');
                        const download = row.querySelector('td.download');
                        const operat = row.querySelector('td.operat');

                        // 合并所有td的名称和值成一个JSON对象
                        const tableData = {
                            seq: seq ? seq.textContent.trim() : '',
                            name: name ? name.textContent.trim() : '',
                            author: author ? author.textContent.trim() : '',
                            source: source ? source.textContent.trim() : '',
                            date: date ? date.textContent.trim() : '',
                            data: data ? data.textContent.trim() : '',
                            quote: quote ? quote.textContent.trim() : '',
                            download: download ? download.textContent.trim() : ''
                        };

                        console.log('表格数据:', tableData);

                        // 下载为以name为名称的txt文本文件
                        if (name) {
                            const filename = `${name.textContent.trim()}.txt`; // 以name为文件名
                            const jsonContent = JSON.stringify(tableData, null, 2); // 格式化为JSON字符串

                            // 创建一个 Blob 对象，并触发文件下载
                            const blob = new Blob([jsonContent], { type: 'application/json' });
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = filename;
                            link.click(); // 自动点击下载链接
                        }

                        console.log('-----------------------------------');

                        // 新增功能：检查 operat 下的第一个 a 标签内容是否为 "下载"
                        if (operat) {
                            const downloadLink = operat.querySelector('a');
                            if (downloadLink && downloadLink.textContent.trim() === "下载") {
                                // 输出 a 标签的链接地址
                                console.log('下载链接地址:', downloadLink.href);

                                // 强制暂停 4 秒
                                console.log('强制暂停 4 秒...');
                                await new Promise(resolve => setTimeout(resolve, 4000)); // 强制暂停 4 秒

                                // 打开新窗口并加载链接
                                const newTab = window.open(downloadLink.href, '_blank'); // 打开新窗口

                                // 如果成功打开新标签页，开始检查标签页加载状态
                                if (newTab) {
                                    let interval = setInterval(() => {
                                        // 检查新标签页的文档加载状态
                                        if (newTab.document.readyState === 'complete') {
                                            console.log('新标签页加载完成，等待 3 秒后关闭...');
                                            // 延迟 3 秒后关闭新标签页
                                            setTimeout(() => {
                                                newTab.close();  // 关闭新标签页
                                            }, 4000);  // 延迟 3 秒后执行关闭操作

                                            // 停止定时器
                                            clearInterval(interval);
                                        }
                                    }, 500);  // 每 500 毫秒检查一次
                                } else {
                                    console.log('无法打开新标签页');
                                }
                            }
                        }
                    }
                } else {
                    console.log('未找到目标表格行，退出循环');
                    break; // 如果没有找到任何行，退出循环
                }

                // 查找页面上的“下一页”按钮并模拟点击
                const nextPageButton = document.querySelector('#PageNext'); // 使用 ID 选择器
                if (nextPageButton) {
                    console.log('找到“下一页”按钮，准备点击...');
                    nextPageButton.click(); // 直接模拟点击“下一页”按钮
                } else {
                    console.log('没有找到“下一页”按钮，停止脚本');
                    break; // 如果找不到“下一页”按钮，退出循环
                }

                // 等待 5 秒加载下一页
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        });
    } else {
        console.log('未找到指定的按钮元素');
    }
})();
