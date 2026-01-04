// ==UserScript==
// @name         抖店批量同意仅退款售后单
// @namespace    http://tampermonkey.net/
// @version      1.21
// @description  自动执行操作，并可以手动控制开始/停止，每分钟执行一次，操作之间有2秒延迟，每执行5次循环后刷新一次页面
// @author       Kevin Liu
// @license      MIT
// @match        https://fxg.jinritemai.com/ffa/maftersale/aftersale/list*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521949/%E6%8A%96%E5%BA%97%E6%89%B9%E9%87%8F%E5%90%8C%E6%84%8F%E4%BB%85%E9%80%80%E6%AC%BE%E5%94%AE%E5%90%8E%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/521949/%E6%8A%96%E5%BA%97%E6%89%B9%E9%87%8F%E5%90%8C%E6%84%8F%E4%BB%85%E9%80%80%E6%AC%BE%E5%94%AE%E5%90%8E%E5%8D%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isRunning = true; // 控制定时执行的标志
    let intervalId = null; // 定时器 ID
    let cycleCount = 0; // 循环计数器

    // 创建控制按钮
    const controlButton = document.createElement('button');
    controlButton.innerText = '暂停';
    controlButton.style.position = 'fixed';
    controlButton.style.top = '20px';
    controlButton.style.left = '20px';
    controlButton.style.zIndex = 9999;
    controlButton.style.padding = '10px 20px';
    controlButton.style.backgroundColor = '#FF6347'; // 红色，表示暂停
    controlButton.style.color = 'white';
    controlButton.style.fontSize = '16px';
    controlButton.style.border = 'none';
    controlButton.style.borderRadius = '5px';
    controlButton.style.cursor = 'pointer';
    document.body.appendChild(controlButton);

    // 按钮点击事件
    controlButton.addEventListener('click', function () {
        if (isRunning) {
            clearInterval(intervalId); // 停止操作
            isRunning = false;
            controlButton.innerText = '开始';
            controlButton.style.backgroundColor = '#4CAF50'; // 绿色，表示开始
            console.log('操作已停止');
        } else {
            isRunning = true;
            controlButton.innerText = '暂停';
            controlButton.style.backgroundColor = '#FF6347'; // 红色，表示暂停
            console.log('操作已开始');
            startOperation(); // 执行一次操作
            intervalId = setInterval(startOperation, 60000); // 每分钟执行一次
        }
    });

    // 延迟5秒后开始执行操作
    setTimeout(() => {
        startOperation(); // 执行一次操作
        intervalId = setInterval(startOperation, 60000); // 每分钟执行一次
    }, 5000);

    // 执行自动化操作
    function startOperation() {
        try {
            console.log('正在执行操作...');

            // Step 1: 判断“已发货退款待处理”按钮是否选中，没选中就点击
            const shippedRefundButton = document.evaluate(
                '//*[@id="orderAppContainer"]/div/div[3]/div[1]/div[1]/div/div[1]/div/div/div/div/div/div[1]/div/div[3]',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            if (shippedRefundButton) {
                console.log('已找到“已发货退款待处理”按钮');
                const buttonData = shippedRefundButton.getAttribute('data-kora-json');
                const parsedData = JSON.parse(buttonData.replace(/&quot;/g, '"'));
                const buttonStatus = parsedData.button_status;

                if (buttonStatus === 0) {
                    shippedRefundButton.click();
                    console.log('点击“已发货退款待处理”按钮');
                } else {
                    console.log('“已发货退款待处理”按钮已选中');
                }
            }

            // Step 2: 点击查询按钮
            setTimeout(() => {
                const queryButton = document.evaluate(
                    '//*[@id="orderAppContainer"]/div/div[3]/div[2]/button[1]/span',
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;

                if (queryButton) {
                    queryButton.click();
                    console.log('点击“查询”按钮');
                } else {
                    console.log('未找到“查询”按钮');
                }
            }, 2000);

            // Step 3: 判断全选按钮是否可点击，若可点击则点击
            setTimeout(() => {
                const selectAllButton = document.evaluate(
                    '//*[@id="orderAppContainer"]/div/div[5]/div/div/div/div/div/div/div/div/table/thead/tr/th[1]/div/label/span/input',
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;

                if (selectAllButton) {
                    const isDisabled = selectAllButton.hasAttribute('disabled');
                    if (!isDisabled) {
                        selectAllButton.click();
                        console.log('点击“全选”按钮');

                        // Step 4: 点击批量同意退款按钮
                        setTimeout(() => {
                            const bulkAgreeRefundButton = document.evaluate(
                                '//*[@id="orderAppContainer"]/div/div[4]/div/div[3]/button/span',
                                document,
                                null,
                                XPathResult.FIRST_ORDERED_NODE_TYPE,
                                null
                            ).singleNodeValue;

                            if (bulkAgreeRefundButton) {
                                bulkAgreeRefundButton.click();
                                console.log('点击“批量同意退款”按钮');

                                // Step 5: 循环检查并点击弹窗的“确定”按钮
                                setTimeout(() => {
                                    let confirmButton;
                                    const interval = setInterval(() => {
                                        confirmButton = document.evaluate(
                                            '//button[contains(@class, "auxo-btn-primary") and span[text()="确定"]]',
                                            document,
                                            null,
                                            XPathResult.FIRST_ORDERED_NODE_TYPE,
                                            null
                                        ).singleNodeValue;

                                        if (confirmButton) {
                                            confirmButton.click();
                                            console.log('点击弹窗的“确定”按钮');
                                        } else {
                                            clearInterval(interval);
                                            console.log('没有弹窗“确定”按钮，退出循环');
                                        }
                                    }, 1000); // 每秒检查一次
                                }, 2000);
                            } else {
                                console.log('未找到“批量同意退款”按钮');
                            }
                        }, 2000);
                    } else {
                        console.log('“全选”按钮不可点击');
                    }
                } else {
                    console.log('未找到“全选”按钮');
                }
            }, 4000);

            // 累计循环计数器
            cycleCount++;
            if (cycleCount >= 5) {
                console.log('已执行5次循环，刷新页面');
                cycleCount = 0; // 重置计数器
                location.reload(); // 刷新页面
            }
        } catch (error) {
            console.error('执行操作时出错：', error);
        }
    }
})();
