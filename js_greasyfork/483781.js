// ==UserScript==
// @name        测试 Text Checkbox
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  css
// @author       刚学会做蛋饼
// @license      MIT
// @match        https://ilabel.weixin.qq.com/*
// @grant        none
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/483781/%E6%B5%8B%E8%AF%95%20Text%20Checkbox.user.js
// @updateURL https://update.greasyfork.org/scripts/483781/%E6%B5%8B%E8%AF%95%20Text%20Checkbox.meta.js
// ==/UserScript==

(function () {
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

        // 获取类目文本
        const categoryText = categoryElement.innerText.trim();

        // 定义类目和对应的话术
        const categories = {
            '教育培训': {
                options: {
                    "医疗": "你好，该提审商品涉及“医疗课程、诊断及咨询服务”为教育培训类禁售商品，请查看教育培训类目管理规则中4.1.2条款。",
                    "股票": "你好，该提审商品涉及“房产、基金、股票、证券等服务”为教育培训类禁售商品，请查看教育培训类目管理规则中4.1.2条款。",
                    "股票3": "你好，该提审商品涉及“房产、基金、股票、证券等服务”为教育培训类禁售商品，请查看教育培训类目管理规则中4.1.2条款。"
                    // 添加更多选项
                },
                message: '这是教育培训类目的提示话术'
            },
            '厨具': {
                options: {
                    "类目A选项1": "内容A1",
                    "类目A选项2": "内容A2"
                    // 添加更多选项
                },
                message: '这是类目A的提示话术'
            },
            // 添加更多类目和对应话术
        };



        // 输出对应类目的提示话术
        console.log(categories[categoryText].message);

        // 以下是你的源代码
        const options = categories[categoryText].options;

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
                selectedText += `${index + 1}、${options[option]}\n`;
            });

            // 复制文本到剪贴板
            navigator.clipboard.writeText(selectedText).then(function () {
                console.log('已复制到剪贴板');
            }).catch(function (err) {
                console.error('复制到剪贴板失败:', err);
            });
        }

        function toggleSelectAll() {
            const checkboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');
            const selectAll = document.getElementById('selectAll');

            if (!selectAll) {
                // 如果不存在全选按钮，动态生成
                const checkboxContainer = document.querySelector('.checkbox-container');
                selectAll = document.createElement('button');
                selectAll.id = 'selectAll';
                selectAll.innerText = '全选';
                selectAll.addEventListener('click', toggleSelectAll);
                checkboxContainer.appendChild(selectAll);
            }

            const selectAllText = selectAll.innerText;

            if (selectAllText === '全选') {
                checkboxes.forEach((checkbox, index) => {
                    if (!checkbox.checked) {
                        checkbox.checked = true;
                        selectedOptions.push(checkbox.id);
                        const label = checkbox.nextElementSibling;
                        label.style.fontWeight = 'bold';
                        label.style.color = 'red';
                    }
                });
                updateSelectedText(textArea, selectedOptions);
                selectAll.innerText = '取消全选';
            } else {
                checkboxes.forEach((checkbox, index) => {
                    if (checkbox.checked) {
                        const index = selectedOptions.indexOf(checkbox.id);
                        if (index > -1) {
                            selectedOptions.splice(index, 1);
                        }
                        checkbox.checked = false;
                        const label = checkbox.nextElementSibling;
                        label.style.fontWeight = 'normal';
                        label.style.color = '#999';
                    }
                });
                textArea.value = '';
                selectAll.innerText = '全选';
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
