// ==UserScript==
// @name         Text Checkboxcs测试测试测试
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  css
// @author       刚学会做蛋饼
// @license      MIT
// @match        https://ilabel.weixin.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479312/Text%20Checkboxcs%E6%B5%8B%E8%AF%95%E6%B5%8B%E8%AF%95%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/479312/Text%20Checkboxcs%E6%B5%8B%E8%AF%95%E6%B5%8B%E8%AF%95%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    function initScript() {
        console.log('脚本已启动');

        if (document.querySelector('.checkbox-container')) {
            console.log('脚本已经初始化，避免重复执行');
            return;
        }

        // 获取类目的XPath
        const categoryXPath = 'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/ARTICLE[1]/SECTION[2]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/TABLE[1]/TBODY[2]/TR[1]/TD[1]';

        // 使用XPath来查找类目元素
        const categoryElement = document.evaluate(categoryXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (!categoryElement) {
            console.log('未找到类目元素，脚本无法运行');
            return;
        }

        // 检查类目是否为"服饰内衣"
        if (categoryElement.innerText.trim() !== "教育培训") {
            console.log('当前类目不是"教育培训"，脚本无法运行');
            return;
        }

        // 以下是你的源代码
        const options = {
            "医疗": "你好，该提审商品涉及“医疗课程、诊断及咨询服务”为教育培训类禁售商品，请查看教育培训类目管理规则中4.1.2条款。",
            "股票": "你好，该提审商品涉及“房产、基金、股票、证券等服务”为教育培训类禁售商品，请查看教育培训类目管理规则中4.1.2条款。",
            // ...其他选项...
        };

        const selectedOptions = [];
        const textArea = document.querySelector('textarea.el-textarea__inner');

        function createCheckbox(option, textArea, selectedOptions) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = option;
            checkbox.addEventListener('change', function () {
                if (this.checked) {
                    selectedOptions.push(option);
                } else {
                    const index = selectedOptions.indexOf(option);
                    if (index > -1) {
                        selectedOptions.splice(index, 1);
                    }
                }
                updateSelectedText(textArea, selectedOptions);
            });

            const label = document.createElement('label');
            label.htmlFor = option;
            label.innerText = option;

            label.style.padding = '5px';
            label.style.fontSize = '16px';
            label.style.fontWeight = 'normal';
            label.style.color = '#999';

            checkbox.addEventListener('change', function () {
                if (this.checked) {
                    label.style.fontWeight = 'bold';
                    label.style.color = 'red';
                } else {
                    label.style.fontWeight = 'normal';
                    label.style.color = '#999';
                }
            });

            return { checkbox, label };
        }

        function updateSelectedText(textArea, selectedOptions) {
            let selectedText = '';
            selectedOptions.forEach((option, index) => {
                if (selectedOptions.length > 1) {
                    selectedText += `${index + 1}、${options[option]}`;
                } else {
                    selectedText += `${options[option]}`;
                }

                if (index < selectedOptions.length - 1) {
                    selectedText += '\n';
                }
            });

    textArea.value = selectedText;
    simulateInputEvent(textArea); // 模拟触发input事件
}


        function simulateInputEvent(element) {
            const event = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
            element.dispatchEvent(event);
        }

        function toggleSelectAll() {
            const checkboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');
            const selectAll = document.getElementById('selectAll');
            const selectAllText = selectAll.innerText;

            if (selectAllText === '全选') {
                checkboxes.forEach((checkbox) => {
                    checkbox.checked = true;
                    selectedOptions.push(checkbox.id);
                    const label = checkbox.nextElementSibling;
                    label.style.fontWeight = 'bold';
                    label.style.color = 'red';
                });
                updateSelectedText(textArea, selectedOptions);
                selectAll.innerText = '取消全选';
            } else {
                checkboxes.forEach((checkbox) => (checkbox.checked = false));
                selectedOptions.length = 0;
                textArea.value = '';
                selectAll.innerText = '全选';
                checkboxes.forEach((checkbox) => {
                    const label = checkbox.nextElementSibling;
                    label.style.fontWeight = 'normal';
                    label.style.color = '#999';
                });
            }
        }

        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'checkbox-container';
        checkboxContainer.style.display = 'flex';
        checkboxContainer.style.flexWrap = 'wrap';
        checkboxContainer.style.alignItems = 'center';

        const allOptions = Object.keys(options);

        allOptions.forEach(option => {
            const { checkbox, label } = createCheckbox(option, textArea, selectedOptions);
            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);
        });

        const targetElement = document.querySelector('.info-card > .info-card');
        if (targetElement && textArea) {
            targetElement.appendChild(checkboxContainer);
            textArea.addEventListener('input', function () {
                selectedOptions.length = 0;
            });

            const selectAll = document.createElement('button');
            selectAll.id = 'selectAll';
            selectAll.innerText = '全选';
            selectAll.addEventListener('click', toggleSelectAll);
            checkboxContainer.appendChild(selectAll);
        }
    }

    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList' && mutation.target === document.body) {
                initScript();
            }
        });
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
})();
