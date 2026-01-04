// ==UserScript==
// @name         工序合同价计算及汇总
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a button inside a specific div in a Vue app and logs when clicked
// @author       You
// @match        *://sth.scm.xinwuyun.com/*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/491231/%E5%B7%A5%E5%BA%8F%E5%90%88%E5%90%8C%E4%BB%B7%E8%AE%A1%E7%AE%97%E5%8F%8A%E6%B1%87%E6%80%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/491231/%E5%B7%A5%E5%BA%8F%E5%90%88%E5%90%8C%E4%BB%B7%E8%AE%A1%E7%AE%97%E5%8F%8A%E6%B1%87%E6%80%BB.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getElementsByXpath(path) {
        var elements = [];
        var xpathResult = document.evaluate(path, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        for (var i = 0; i < xpathResult.snapshotLength; i++) {
            elements.push(xpathResult.snapshotItem(i));
        }

        return elements;
    }

    // 计算合同价
    const addButton = () => {
        const targetDiv = getElementsByXpath("//div[@id='pane-process']//span[text()='工序明细']/parent::div")[0];
        if (targetDiv) {
            // Create the button
            const button = document.createElement('button');
            button.className='el-button el-button--success el-button--mini';
            button.textContent = '计算合同价';

            // Set the style to position it at the right
            button.style.position = 'relative';
            button.style.float = 'right';

            // Bind the click event
            button.addEventListener('click', function () {
                console.log('开始计算合同价');
                // 定义一个延迟函数
                function delay(ms) {
                    return new Promise(resolve => setTimeout(resolve, ms));
                }
                //定位工序文字描述
                const gongxu_ele = getElementsByXpath("//div[@id='pane-process']//div[@col-id='craft_type.label' and text()='生产工艺']/ancestor::div[contains(@class,'ag-row-level')]//div[@col-id='enable_multiplying']/div[text()='有效']/ancestor::div[contains(@class,'ag-row-level')]//span[@class='ag-group-value']");
                //定位合同金额输入框
                const editEle_list = getElementsByXpath("//div[@id='pane-process']//div[@col-id='craft_type.label' and text()='生产工艺']/ancestor::div[contains(@class,'ag-row-level')]//div[@col-id='enable_multiplying']/div[text()='有效']/ancestor::div[contains(@class,'ag-row-level')]//div[@col-id='out_price']");
                //定位基准价格框
                const jzprice_list = getElementsByXpath("//div[@id='pane-process']//div[@col-id='craft_type.label' and text()='生产工艺']/ancestor::div[contains(@class,'ag-row-level')]//div[@col-id='enable_multiplying']/div[text()='有效']/ancestor::div[contains(@class,'ag-row-level')]//div[@col-id='price']");


                console.log("工序数量", gongxu_ele.length);
                console.log("基准价格数量", gongxu_ele.length);
                //循环修改
                for (let index = 0; index < jzprice_list.length; index++) {
                    if (gongxu_ele[index].textContent.includes("车缝")) {

                        console.log("合同价");
                        //计算合同价
                        const hetongPrice = parseFloat(editEle_list[index].textContent) * 3
                        // 输入
                        editEle_list[index].click();
                        const inpue_ele = editEle_list[index].getElementsByTagName("input")[0]
                        inpue_ele.setAttribute('autofocus', true)
                        inpue_ele.value = hetongPrice
                        var event = new Event('input', { bubbles: true });
                        inpue_ele.dispatchEvent(event);


                    } else {
                        const hetongPrice = parseFloat(editEle_list[index].textContent)
                        console.log("合同价原样");
                    }
                }

                const 排序ele = getElementsByXpath("//div[@id='pane-process']//span[text()='工艺类型']")[0]
                排序ele.click()
            });

            // Append the button to the target div
            targetDiv.appendChild(button);
        } else {
            // 可以选择定期检查目标元素是否存在，如果需要的话
            setTimeout(addButton, 500); // 每隔半秒检查一次，可按需调整时间间隔
        }
    };


    const calculateTotalButton = () => {
        // 计算总和的操作
        const 生产工艺合同价ele_list = getElementsByXpath("//div[@id='pane-process']//div[@col-id='craft_type.label' and text()='生产工艺']/ancestor::div[contains(@class,'ag-row-level')]//div[@col-id='out_price']");
        let 生产工艺合同价汇总 = 0;
        for (let index = 0; index < 生产工艺合同价ele_list.length; index++) {
            生产工艺合同价汇总 += parseFloat(生产工艺合同价ele_list[index].textContent);
        }
        console.log("生产工艺合同价汇总", 生产工艺合同价汇总);

        const 合同价汇总ele = getElementsByXpath("//div[@id='pane-process']//span[contains(text(),'合同价')]")[0];
        合同价汇总ele.textContent = "合同价\n生产工艺合同价汇总：" + 生产工艺合同价汇总.toString();
    };

    const addCalculateTotalButton = () => {
        const targetDiv = getElementsByXpath("//div[@id='pane-process']//span[text()='工序明细']/parent::div")[0];
        if (targetDiv) {
            const button = document.createElement('button');
            button.className='el-button el-button--success el-button--mini';
            button.textContent = '计算总和';
            button.style.position = 'relative';
            button.style.float = 'right';
            button.addEventListener('click', calculateTotalButton);
            targetDiv.appendChild(button);
        } else {
            setTimeout(addCalculateTotalButton, 500);
        }
    };

    // 添加计算总和按钮
    addCalculateTotalButton();

    // 添加计算合同价按钮
    addButton();


    // 如果目标元素不是页面加载一开始就存在的，您可能需要配合MutationObserver来实时监测DOM变化
})();


