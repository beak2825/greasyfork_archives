// ==UserScript==
// @name         商品识别码自动化--TEMU合规中心
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动点击下一页并检查表格
// @match        https://agentseller.temu.com/govern/information-supplementation
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524257/%E5%95%86%E5%93%81%E8%AF%86%E5%88%AB%E7%A0%81%E8%87%AA%E5%8A%A8%E5%8C%96--TEMU%E5%90%88%E8%A7%84%E4%B8%AD%E5%BF%83.user.js
// @updateURL https://update.greasyfork.org/scripts/524257/%E5%95%86%E5%93%81%E8%AF%86%E5%88%AB%E7%A0%81%E8%87%AA%E5%8A%A8%E5%8C%96--TEMU%E5%90%88%E8%A7%84%E4%B8%AD%E5%BF%83.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // 定义遍历和统计符合要求的组数的函数
    async function checkTableRows() {
        try {
            while (true) {
                // 更新 tbody 的子元素，以获取可能的动态变化
                const trElements = Array.from(document.querySelector('tbody.rocket-table-tbody').querySelectorAll('tr'));

                // 标记是否找到未完成的 SPU
                let foundNewSPU = false;

                // 遍历每个 tr
                for (let i = 0; i < trElements.length; i++) {
                    const tr = trElements[i];
                    const firstTd = tr.querySelector('td');

                    let rowspan = 1;
                    if (firstTd && firstTd.hasAttribute('rowspan')) {
                        rowspan = parseInt(firstTd.getAttribute('rowspan'), 10);
                    }

                    const trGroup = trElements.slice(i, i + rowspan);
                    const spuSpan = Array.from(firstTd.querySelectorAll('span')).find(span => span.textContent.includes('SPU'));
                    const spuValueText = spuSpan.nextSibling ? spuSpan.nextSibling.textContent.trim() : null;
                    currentSPU = spuValueText ? spuValueText : null;

                    // 如果 SPU 在 finishedSPU 中，跳过
                    if (finishedSPU.has(currentSPU)) {
                        i += rowspan - 1;
                        continue;
                    }

                    // 从特定SPU开始处理
                    if (startSPU && !startProcessing) {
                        if (currentSPU === startSPU) {
                            startProcessing = true;
                        }else {
                            finishedSPU.add(currentSPU);
                            i += rowspan - 1;
                            continue; // 若未找到 startSPU，继续循环
                        }
                    } else {
                        // startSPU为空，直接处理每个组
                        startProcessing = true;
                    }

                    if (startProcessing) {
                        console.log(`正在处理第${currentPageTitle}页，当前SPU: ${currentSPU}`);
                        validGroupCount++;
                        foundNewSPU = true;

                        // 找到并点击 "编辑" 按钮
                        const editButton = document.evaluate(
                            './/button[span[text()="编辑"]]',
                            tr,
                            null,
                            XPathResult.FIRST_ORDERED_NODE_TYPE,
                            null
                        ).singleNodeValue;
                        if (editButton) {
                            editButton.click();
                            await waitForInputAndSubmit();
                        }
                    }

                    // 记录当前 SPU 为已完成
                    finishedSPU.add(currentSPU);

                    // 跳过该组的其余行
                    i += rowspan - 1;
                    break; // 处理完一个 SPU 后重新检查 tbody
                }

                // 若找不到新的 SPU，停止循环
                if (!foundNewSPU) {
                    console.log('本页所有 SPU 均已处理完成');
                    break;
                }
            }
        } catch (error) {
            console.log('错误，重新开始');
            await checkTableRows();
        }
}

    //---------------------------------单次操作内容，主函数waitForInputAndSubmit（点开编辑后）-------------------------------

    // 模拟输入函数
    async function simulateInput(inputElement, value) {
        inputElement.focus();
        inputElement.select(); // 选中输入框内容以便清空

        // 清空输入框
        document.execCommand('delete');
        await new Promise(resolve => setTimeout(resolve, 100)); // 等待一段时间

        // 创建一个退格键事件
        const backspaceEvent = new KeyboardEvent('keydown', {
            key: 'Backspace',
            code: 'Backspace',
            keyCode: 8,
            which: 8,
            bubbles: true,
        });
        // 触发退格键事件
        inputElement.dispatchEvent(backspaceEvent);

        // 等待一段时间
        await new Promise(resolve => setTimeout(resolve, 100)); // 可适当增加延迟

        // 使用 setTimeout 和 execCommand 插入文本
        document.execCommand('insertText', false, value);
        await new Promise(resolve => setTimeout(resolve, 100)); // 等待一段时间

        // 创建并触发回车键事件
        const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true // 确保事件可以冒泡
        });
        // 触发回车键事件
        inputElement.dispatchEvent(enterEvent);
        await new Promise(resolve => setTimeout(resolve, 100)); // 等待一段时间
    }

    // 等待输入框出现并处理编辑输入的函数
    async function waitForInputAndSubmit() {
        const startTime = Date.now();
        const timeout = 5000; // 设置超时时间为5秒
        
        const checkForInput = async () => {
            const inputElement = document.evaluate(
                '//div[@class="rocket-drawer rocket-drawer-right rocket-drawer-open"]//div[preceding-sibling::div[.//div[contains(text(), "商品识别码")]]]//input',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            if (inputElement) {
                // 如果找到输入框，输入商品识别码
                await simulateInput(inputElement, recognitionCode); // 输入值

                // 警示类型 - 无需警示
                const spanWarningType = document.evaluate(
                    "//div[@class='rocket-drawer rocket-drawer-right rocket-drawer-open']//div[preceding-sibling::div[./label/div[text()='警示类型']]]//span[@class='rocket-select-selection-placeholder']",
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                if (spanWarningType) {
                    const inputWarningType = document.evaluate(
                        "//div[@class='rocket-drawer rocket-drawer-right rocket-drawer-open']//div[preceding-sibling::div[./label/div[text()='警示类型']]]//input",
                        document,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                        null
                    ).singleNodeValue;
                    await simulateInput(inputWarningType, 'no warning'); // 输入回车
                    await waitForElement("//div[@class='rocket-drawer rocket-drawer-right rocket-drawer-open']//div[preceding-sibling::div[./label/div[text()='警示类型']]]//span[@class='rocket-select-selection-item' and @title='No Warning Applicable/无需警示']")
                    console.log('已选择 警示类型 - 无需警示');
                }
                
                // 欧盟负责人
                const spanEUPerson = document.evaluate(
                    "//div[@class='rocket-drawer rocket-drawer-right rocket-drawer-open']//div[preceding-sibling::div[./label[text()='欧盟负责人']]]//span[@class='rocket-select-selection-placeholder']",
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                if (spanEUPerson) {
                    const inputEUPerson = document.evaluate(
                        "//div[@class='rocket-drawer rocket-drawer-right rocket-drawer-open']//div[preceding-sibling::div[./label[text()='欧盟负责人']]]//input",
                        document,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                        null
                    ).singleNodeValue;
                    await simulateInput(inputEUPerson, ' '); // 输入，回车
                    await waitForElement("//div[@class='rocket-drawer rocket-drawer-right rocket-drawer-open']//div[preceding-sibling::div[./label[text()='欧盟负责人']]]//div[@class='rocket-select-selection-overflow-item']")
                    console.log('已选择 欧盟负责人');
                }

                // 制造商信息
                const spanProducer = document.evaluate(
                    "//div[@class='rocket-drawer rocket-drawer-right rocket-drawer-open']//div[preceding-sibling::div[./label[text()='制造商信息']]]//span[@class='rocket-select-selection-placeholder']",
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                if (spanProducer) {
                    const inputProducer = document.evaluate(
                        "//div[@class='rocket-drawer rocket-drawer-right rocket-drawer-open']//div[preceding-sibling::div[./label[text()='制造商信息']]]//input",
                        document,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                        null
                    ).singleNodeValue;
                    await simulateInput(inputProducer, ' '); // 输入空格，回车
                    await waitForElement("//div[@class='rocket-drawer rocket-drawer-right rocket-drawer-open']//div[preceding-sibling::div[./label[text()='制造商信息']]]//div[@class='rocket-select-selection-overflow-item']")
                    //await new Promise(resolve => setTimeout(resolve, 500)); // 等待一段时间
                    console.log('已选择 制造商信息');
                }

                // 货物进欧盟的时间
                const spanTimeToEU = document.evaluate(
                    "//div[@class='rocket-drawer rocket-drawer-right rocket-drawer-open']//div[preceding-sibling::div[./label/div[text()='该商品id下是否有货物是GPSR法规适用（2024年12月13日及以后）之后投放到欧盟(或北爱尔兰)市场的？']]]//span[@class='rocket-select-selection-placeholder']",
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                if (spanTimeToEU) {
                    const inputTimeToEU = document.evaluate(
                        "//div[@class='rocket-drawer rocket-drawer-right rocket-drawer-open']//div[preceding-sibling::div[./label/div[text()='该商品id下是否有货物是GPSR法规适用（2024年12月13日及以后）之后投放到欧盟(或北爱尔兰)市场的？']]]//input",
                        document,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                        null
                    ).singleNodeValue;
                    await simulateInput(inputTimeToEU, '否'); // 输入，回车
                    await waitForElement("//div[@class='rocket-drawer rocket-drawer-right rocket-drawer-open']//div[preceding-sibling::div[./label/div[text()='该商品id下是否有货物是GPSR法规适用（2024年12月13日及以后）之后投放到欧盟(或北爱尔兰)市场的？']]]//div[@class='rocket-select-selection-overflow-item']")
                    //await new Promise(resolve => setTimeout(resolve, 500)); // 等待一段时间
                    console.log('已选择 货物进欧盟的时间 为 否');
                }

                // 警告或安全信息（补充）
                const spanWarningInfoADD = document.evaluate(
                    "//div[@class='rocket-drawer rocket-drawer-right rocket-drawer-open']//div[preceding-sibling::div[./label/div[text()='警告或安全信息（补充）']]]//span[@class='rocket-select-selection-placeholder']",
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                if (spanWarningInfoADD) {
                    const inputWarningInfoADD = document.evaluate(
                        "//div[@class='rocket-drawer rocket-drawer-right rocket-drawer-open']//div[preceding-sibling::div[./label/div[text()='警告或安全信息（补充）']]]//input",
                        document,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                        null
                    ).singleNodeValue;
                    await simulateInput(inputWarningInfoADD, '不适用'); // 输入，回车
                    await simulateInput(inputWarningInfoADD, '不适用'); //需要两次
                    await waitForElement("//div[@class='rocket-drawer rocket-drawer-right rocket-drawer-open']//div[preceding-sibling::div[./label/div[text()='警告或安全信息（补充）']]]//div[@class='rocket-select-selector']//span[contains(text(),'不适用')]")
                    //await new Promise(resolve => setTimeout(resolve, 500)); // 等待一段时间
                    console.log('已选择 警告或安全信息（补充） 为 不适用');
                }

                // 查找并点击“不含电池”的选项
                const labelBattery = document.evaluate(
                    "//label[@class='rocket-radio-wrapper rocket-radio-small'][.//span[text()='不含电池']]",
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;

                if (labelBattery) {
                    labelBattery.click(); // 点击label，使其被选中
                    console.log('已选择“不含电池”选项');
                }

                // 查找废旧电子电器回收标识并点击“适用”的选项
                const inputForEERecycle = document.evaluate(
                    "//div[@class='rocket-drawer rocket-drawer-right rocket-drawer-open']//div[preceding-sibling::div[.//div[text()='废旧电子电器回收标识']]]//div[@class='rocket-form-field-item-control-input']//input",
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                if (inputForEERecycle) {
                    await simulateInput(inputForEERecycle, '适用'); // 输入值
                    await waitForElement("//div[@class='rocket-drawer rocket-drawer-right rocket-drawer-open']//div[preceding-sibling::div[.//div[text()='废旧电子电器回收标识']]]//span[@class='rocket-select-selection-item' and @title='适用电子电器回收标识']"); //等适用出现
                    console.log('已选择“适用”选项');
                }

                await new Promise(resolve => setTimeout(resolve, 500)); // 等待一段时间
                
                // 查找确认按钮并点击
                const confirmButton = document.evaluate(
                    '//div[@class="rocket-drawer rocket-drawer-right rocket-drawer-open"]//button[span[text()="确 认"]]',
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;

                if (confirmButton) {
                    confirmButton.click(); // 点击确认按钮
                    await waitForButtonToDisappear(confirmButton); // 等待按钮消失
                }
                await new Promise(resolve => setTimeout(resolve, 500)); // 等待一段时间
            } else {
                // 如果未找到输入框，检查是否超时
                if (Date.now() - startTime < timeout) {
                    await new Promise(resolve => setTimeout(resolve, 100)); // 每0.1秒查询一次
                    await checkForInput(); // 递归调用
                } else {
                    // 超过5秒未找到输入框，点击取消按钮
                    const cancelButton = document.evaluate(
                        '//div[@class="rocket-drawer rocket-drawer-right rocket-drawer-open"]//button[span[text()="取 消"]]',
                        document,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                        null
                    ).singleNodeValue;
                    
                    if (cancelButton) {
                        cancelButton.click(); // 点击取消按钮
                    }
                    await new Promise(resolve => setTimeout(resolve, 100)); // 等待一段时间
                }
            }
        };
        
        await checkForInput(); // 初次调用处理编辑输入
    }

    // 等待元素出现的函数
    async function waitForElement(xpath) {
        const startTime = Date.now();
        const timeout = 2000; // 超时设置为 3 秒

        const checkElement = async () => {
            const element = document.evaluate(
                xpath,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            if (element) {
                return element; // 找到元素，返回
            }

            // 检查是否超时
            if (Date.now() - startTime < timeout) {
                await new Promise(resolve => setTimeout(resolve, 200)); // 每 200 毫秒检查一次
                return checkElement(); // 递归调用
            } else {
                return; // 超过 3 秒未找到元素，退出等待
            }
        };

        return await checkElement(); // 初次调用
    }

    // 等待按钮消失的函数
    async function waitForButtonToDisappear(button) {
        const startTime = Date.now();
        
        const checkButtonVisibility = async () => {
            if (!button.parentNode || button.offsetParent === null) {
                // 按钮已消失
                return;
            }

            // 检查是否有错误信息
            const errorMessage = document.evaluate(
                '//div[@class="rocket-message"]//span[text()="参数错误"]',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            // 检查是否超过3秒或发现错误信息
            if (Date.now() - startTime > 3000 || errorMessage) {
                // 执行鼠标点击操作
                const element = document.elementFromPoint(1, 1);
                if (element) {
                    element.click();
                    console.log('已点击页面左上角，因为检测到错误或等待时间超过3秒');
                }
                return; // 结束函数
            }
            
            await new Promise(resolve => setTimeout(resolve, 100)); // 每0.1秒检查一次
            await checkButtonVisibility(); // 递归调用
        };
        
        await checkButtonVisibility(); // 初次调用检查
    }
    
    //---------------------------------页码函数-------------------------------
    
    // 获取当前页面的页码的函数
    function getCurrentPageTitle() {
        const xpathExpression = "//ul[@class='rocket-pagination']//li[contains(@class, 'rocket-pagination-item-active')]";
        const currentPageItem = document.evaluate(
            xpathExpression,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        const currentPageTitle = currentPageItem.getAttribute('title'); // 当前页码
        return currentPageTitle;
    }

    // 等待页码变化的函数
    async function waitForPageChange(currentPageTitle) {
        const startTime = Date.now();
        const timeout = 5000; // 设置超时时间为5秒

        const checkPageChange = async () => {
            const newPageTitle = getCurrentPageTitle();
            if (newPageTitle === currentPageTitle) {
                if (Date.now() - startTime < timeout) {
                    await new Promise(resolve => setTimeout(resolve, 100)); // 每0.1秒查询一次
                    await checkPageChange(); // 递归调用
                } else {
                    console.log("newPageTitle等待超时");
                    startSPU = 0; // 重置 startSPU 或其他全局变量
                    validGroupCount = 0; // 重置有效组数
                }
            }
        };

        await checkPageChange(); // 初次调用检查
    }

    //------------------------------运行----------------------------------

    // 创建“开始”按钮及输入框并添加到页面
    const startButton = document.createElement('button');
    startButton.textContent = '开始';
    startButton.style.position = 'fixed';
    startButton.style.top = '10px';
    startButton.style.left = '10px';
    startButton.style.zIndex = '9999';
    document.body.appendChild(startButton);

    // 创建设置按钮并添加到页面
    const settingButton = document.createElement('button');
    settingButton.textContent = '设置';
    settingButton.style.position = 'fixed';
    settingButton.style.top = '40px';
    settingButton.style.left = '10px';
    settingButton.style.zIndex = '9999';
    document.body.appendChild(settingButton);

    // 全局变量
    let currentSPU = null;
    let validGroupCount = 0;
    let startProcessing = false;
    let finishedSPU = new Set();
    let currentPageTitle = 0;
    let recognitionCode = ''; // 初始识别码
    let startSPU = ''; // 获取用户输入的startSPU

    // 设置按钮点击事件
    settingButton.addEventListener('click', () => {
        // 弹出一次输入框，用户输入两个值，用逗号分隔
        const input = prompt('请输入商品识别码和起始SPU，用逗号分隔（例如：ABC123, SPU001）', `${recognitionCode}, ${startSPU}`);
        
        if (input !== null) {
            // 使用逗号分隔输入的值
            const [newCode_1, newCode_2] = input.split(',').map(item => item.trim());
            
            // 更新 recognitionCode 和 startSPU
            if (newCode_1) {
                recognitionCode = newCode_1;
                console.log('商品识别码已更新为：', recognitionCode);
            }
            if (newCode_2) {
                startSPU = newCode_2;
                console.log('起始SPU已更新为：', startSPU);
            }
        }
    });

    // 按钮点击事件：初始化变量并启动自动点击和检查
    startButton.addEventListener('click', async function() {
        validGroupCount = 0; // 初始化有效组数
        currentSPU = null;
        validGroupCount = 0;
        startProcessing = false;
        finishedSPU.clear();
        currentPageTitle = 0;

        // 提示用户输入商品识别码
        if (!recognitionCode) {
            alert("请输入商品识别码");
            return;
        }

        // 循环点击函数
        const clickNextPage = async () => {
            const nextButton = document.evaluate(
                '//li[@title="下一页"]',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            //获取当前页码
            currentPageTitle = getCurrentPageTitle();
            console.log(`当前处理第${currentPageTitle}页`);

            //运行 checkTableRows
            await checkTableRows();
            await new Promise(resolve => setTimeout(resolve, 2000)); // 固定等待2秒，确保提交，防止未提交完成翻页后回到上一页

            if (nextButton && nextButton.getAttribute('aria-disabled') === 'false') {
                nextButton.click(); // 点击按钮
                await waitForPageChange(currentPageTitle); // 等待页码变化后继续执行clickNextPage继续循环
                await new Promise(resolve => setTimeout(resolve, 500)); // 固定等待0.5秒
                await clickNextPage(); // 继续点击下一页
            } else {
                // 当到达最后一页时，弹出符合要求的组数
                alert(`已完成检查。符合要求的组数: ${validGroupCount}`);
            }
        };

        // 启动点击循环
        await clickNextPage();
    });
})();
