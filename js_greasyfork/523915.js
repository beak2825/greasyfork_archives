// ==UserScript==
// @name         differ助手
// @namespace    http://tampermonkey.net/
// @version      2025-01-02
// @description  一键！
// @author       guanzi
// @match        http://10.10.224.72:10001/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523915/differ%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/523915/differ%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮容器
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '100px'; // 调整位置向下移动
    container.style.right = '20px';
    container.style.zIndex = 9999;
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';
    document.body.appendChild(container);

    // 按钮文本数组
    const languages = ['en', 'ja-JP', 'zh-Hant', 'ko', 'de', 'fr', 'es', 'pt', 'it', 'th', 'id'];

    // 按钮点击逻辑
    function handleClick(language) {
        const input = document.querySelector('#app > div > div:nth-child(2) > div > div.flex.justify-center > div > div > div > div > input');
        if (input) {
            // 模拟输入框输入值
            const value = `${language}/Game.archive`;
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true })); // 触发输入事件
            input.click();

            // 等待下拉框选项加载后选择第一项
            setTimeout(() => {
                const dropdownItem = document.querySelector('.el-autocomplete-suggestion__list li');
                if (dropdownItem) {
                    dropdownItem.click(); // 点击选项

                    // 再次等待后点击确认按钮
                    setTimeout(() => {
                        const targetButton = document.querySelector('#app > div > div:nth-child(2) > div > div.flex.justify-center > div > div > div > div > div.el-input-group__append > button > i');
                        if (targetButton) {
                            targetButton.click(); // 点击目标按钮
                        }
                    }, 500);
                }
            }, 500);
        }
    }

    // 创建按钮
    languages.forEach(language => {
        const button = document.createElement('button');
        button.innerHTML = language;
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        button.style.cursor = 'pointer';
        button.style.border = '1px solid #ccc';
        button.style.backgroundColor = '#f0f0f0';
        button.style.borderRadius = '5px';
        button.style.textAlign = 'center';

        button.addEventListener('click', () => handleClick(language));
        container.appendChild(button);
    });

    // 创建"全部删除"按钮
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '全部删除';
    deleteButton.style.padding = '10px 20px';
    deleteButton.style.fontSize = '16px';
    deleteButton.style.cursor = 'pointer';
    deleteButton.style.border = '1px solid #ccc';
    deleteButton.style.backgroundColor = '#f0f0f0';
    deleteButton.style.borderRadius = '5px';
    deleteButton.style.textAlign = 'center';
    container.appendChild(deleteButton);

    // "全部删除"按钮点击逻辑
    deleteButton.addEventListener('click', function() {
        let deletedCount = 0;

        // 删除第一个附件
        const attachment1 = document.querySelector('#app > div > div:nth-child(2) > div > div.el-dialog__wrapper.text-left > div > div.el-dialog__body > div > ul > li:nth-child(1)');
        if (attachment1) {
            attachment1.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })); // 模拟鼠标悬停
            setTimeout(() => {
                const deleteButton1 = attachment1.querySelector('i.el-icon-close');
                if (deleteButton1) {
                    deleteButton1.click(); // 删除第一个附件
                    deletedCount++;
                }
            }, 500);
        } else {
            alert('未找到第一个附件');
        }

        // 删除第二个附件
        const attachment2 = document.querySelector('#app > div > div:nth-child(2) > div > div.el-dialog__wrapper.text-left > div > div.el-dialog__body > div > ul > li:nth-child(2)');
        if (attachment2) {
            attachment2.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })); // 模拟鼠标悬停
            setTimeout(() => {
                const deleteButton2 = attachment2.querySelector('i.el-icon-close');
                if (deleteButton2) {
                    deleteButton2.click(); // 删除第二个附件
                    deletedCount++;
                }
            }, 500);
        } else {
            alert('未找到第二个附件');
        }

        // 提示删除完成
        if (deletedCount === 2) {
            alert('两个附件已成功删除');
        }
    });

})();
