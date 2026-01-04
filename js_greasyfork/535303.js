// ==UserScript==
// @name         南信大-南京信息工程大学-同学互评一键填充
// @namespace    stu.nuist.edu.cn
// @version      0.2
// @description  南信大-同学互评-南京信息工程大学
// @author       BaLa
// @match        http://stu.nuist.edu.cn/txxm/**
// @match        https://stu.nuist.edu.cn/txxm/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535303/%E5%8D%97%E4%BF%A1%E5%A4%A7-%E5%8D%97%E4%BA%AC%E4%BF%A1%E6%81%AF%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6-%E5%90%8C%E5%AD%A6%E4%BA%92%E8%AF%84%E4%B8%80%E9%94%AE%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/535303/%E5%8D%97%E4%BF%A1%E5%A4%A7-%E5%8D%97%E4%BA%AC%E4%BF%A1%E6%81%AF%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6-%E5%90%8C%E5%AD%A6%E4%BA%92%E8%AF%84%E4%B8%80%E9%94%AE%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 确保脚本只在主页面上运行一次
    if (window !== window.top) {
        console.warn("脚本已在主页面运行，不会在嵌套页面重复运行。");
        return;
    }

    // 创建一个蓝色背景的div容器
    function createControlPanel() {
        // 检查是否已经创建了控制面板
        if (document.getElementById('GUI_DATA_INPUT')) {
            console.warn("控制面板已存在，不会重复创建。");
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'GUI_DATA_INPUT'; // 设置唯一ID
        panel.style.position = 'fixed';
        panel.style.bottom = '20px';
        panel.style.right = '20px';
        panel.style.backgroundColor = 'blue';
        panel.style.borderRadius = '10px';
        panel.style.padding = '20px';
        panel.style.color = 'white';
        panel.style.display = 'flex';
        panel.style.flexDirection = 'column';
        panel.style.alignItems = 'center';
        panel.style.zIndex = '9999';

        const inputs = [
            { label: '第1-5列的最小值', name: 'min1_5', value: '0' },
            { label: '第1-5列的最大值', name: 'max1_5', value: '6' },
            { label: '第6列的最小值', name: 'min6', value: '0' },
            { label: '第6列的最大值', name: 'max6', value: '5' }
        ];

        inputs.forEach(input => {
            const inputDiv = document.createElement('div');
            inputDiv.style.display = 'flex';
            inputDiv.style.alignItems = 'center';
            inputDiv.style.marginBottom = '10px';

            const label = document.createElement('label');
            label.textContent = input.label + ': ';
            label.style.marginRight = '10px';

            const inputElement = document.createElement('input');
            inputElement.type = 'number';
            inputElement.name = input.name;
            inputElement.value = input.value;
            inputElement.style.width = '100px';
            inputElement.style.height = '25px';
            inputElement.style.marginRight = '10px';

            inputDiv.appendChild(label);
            inputDiv.appendChild(inputElement);
            panel.appendChild(inputDiv);
        });

        const button = document.createElement('button');
        button.textContent = '确认填写';
        button.style.width = '100px';
        button.style.height = '30px';
        button.style.backgroundColor = 'red';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.marginTop = '20px';

        button.addEventListener('click', () => {
            const min1_5 = parseInt(panel.querySelector('input[name="min1_5"]').value, 10);
            const max1_5 = parseInt(panel.querySelector('input[name="max1_5"]').value, 10);
            const min6 = parseInt(panel.querySelector('input[name="min6"]').value, 10);
            const max6 = parseInt(panel.querySelector('input[name="max6"]').value, 10);

            fillInputValues(min1_5, max1_5, min6, max6);
        });

        panel.appendChild(button);
        document.body.appendChild(panel);
    }

    // 填充表格输入框的值
    function fillInputValues(min1_5 = 0, max1_5 = 6, min6 = 0, max6 = 5) {
        // 验证参数是否有效
        if (min1_5 > max1_5 || min6 > max6) {
            alert("参数错误：最小值不能大于最大值");
            return;
        }

        // 获取所有iframe
        const iframes = document.getElementsByTagName('iframe');
        let targetDocument = null;

        // 遍历所有iframe，找到包含目标元素的iframe
        for (let i = 0; i < iframes.length; i++) {
            const iframe = iframes[i];
            if (iframe.contentDocument.getElementById("MyDataGrid")) {
                targetDocument = iframe.contentDocument;
                break;
            }
        }

        // 如果没有找到目标元素，返回错误
        if (!targetDocument) {
            alert("未找到包含目标元素的iframe,请进入到有表格的界面");
            return;
        }

        // 获取表格元素
        const table = targetDocument.getElementById("MyDataGrid");
        if (!table) {
            alert("未找到表格元素,请进入到有表格的界面");
            return;
        }

        // 获取表格的行数（减去表头行）
        const rowCount = table.rows.length - 1;
        // 定义列数
        const columnCount = 6;

        // 定义一个函数，用于生成指定范围内的随机整数
        function getRandomValue(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        // 遍历所有行（从2到rowCount+1，因为ID从ctl2开始）
        for (let i = 2; i <= rowCount + 1; i++) {
            // 遍历前5列
            for (let j = 1; j <= 5; j++) {
                // 构造ID并获取对应的input元素
                let inputElement = targetDocument.getElementById(`MyDataGrid__ctl${i}_cp${j}_2`);
                // 如果元素存在，设置其值为指定范围内的随机整数
                if (inputElement) {
                    inputElement.value = getRandomValue(min1_5, max1_5);
                }
            }
            // 第6列
            let sixthColumnElement = targetDocument.getElementById(`MyDataGrid__ctl${i}_cp6_2`);
            // 如果元素存在，设置其值为指定范围内的随机整数
            if (sixthColumnElement) {
                sixthColumnElement.value = getRandomValue(min6, max6);
            }
        }
    }

    // 确保在页面加载完成后创建控制面板
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', createControlPanel);
    } else {
        createControlPanel();
    }

    // 监听页面内容变化，确保控制面板只创建一次
    const observer = new MutationObserver(createControlPanel);
    observer.observe(document.body, { childList: true, subtree: true });
})();