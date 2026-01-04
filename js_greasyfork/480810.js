// ==UserScript==
// @name         OKX withdrawal Address Filler
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automate withdrawal address entry on OKX withdrawal page.
// @author       You
// @match        https://www.okx.com/*/balance/withdrawal-address/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480810/OKX%20withdrawal%20Address%20Filler.user.js
// @updateURL https://update.greasyfork.org/scripts/480810/OKX%20withdrawal%20Address%20Filler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let container;
    let textarea, prefixInput;

    // 创建用户界面
    const createUserInterface = () => {
        container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '100px';
        container.style.transform = 'translateY(-50%)';
        container.style.zIndex = '99999';
        container.style.backgroundColor = '#FFF';
        container.style.padding = '10px';
        container.style.border = '1px solid #CCC';
        container.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        container.style.borderRadius = '8px';
        container.style.display = 'none'; // 初始设置为隐藏

        textarea = document.createElement('textarea');
        textarea.placeholder = '粘贴地址列表，每行一个';
        textarea.style.width = '300px';
        textarea.style.height = '150px';
        textarea.style.resize = 'none';

        prefixInput = document.createElement('input');
        prefixInput.placeholder = '备注前缀（如 a1, 那么备注会是 a1 到 aN）';
        prefixInput.style.display = 'block';
        prefixInput.style.marginTop = '5px';
        prefixInput.style.width = '290px';


        const fillButton = document.createElement('button');
        fillButton.textContent = '填充地址';
        fillButton.style.backgroundColor = 'black'; // 按钮背景色
        fillButton.style.color = 'white'; // 文字颜色
        fillButton.style.padding = '5px 10px'; // 内边距
        fillButton.style.border = 'none'; // 无边框
        fillButton.style.borderRadius = '15px'; // 边框圆角
        fillButton.style.cursor = 'pointer'; // 鼠标样式
        fillButton.style.marginTop = '10px'; // 顶部外边距
        fillButton.style.float = 'right'; // 右浮动
        fillButton.onclick = () => handleFillButton(textarea.value, prefixInput.value);


        container.appendChild(textarea);
        container.appendChild(prefixInput);
        container.appendChild(fillButton);
        document.body.appendChild(container);
    };

   const resetFormData = () => {
        textarea.value = '';
        prefixInput.value = '';
    };

   const adjustPosition = () => {
        const popup = document.querySelector('.okui-dialog-window');
        if (popup) {
            const rect = popup.getBoundingClientRect();
            container.style.top = `${rect.top + (rect.height / 2) - (container.offsetHeight / 2)}px`; // 纵向居中
            container.style.left = `${rect.left - container.offsetWidth - 10}px`; // 横向放在弹出窗口左侧
        }
    };

    const handleFillButton = async (rawData, prefix) => {
        const data = parseAddresses(rawData, prefix);
        await addAddresses(data.length-1);
        fillForm(0, data);
    };

    // 监听DOM变化
    const observeDOM = (element, callback) => {
        const observer = new MutationObserver(mutations => {
            if (mutations.length) {
                callback();
                adjustPosition(); // 每次DOM变化后调整位置

            }
        });

        observer.observe(element, { childList: true, subtree: true });
    };

    // 检查“新增提现地址”框是否显示
    const checkForPopup = () => {
        const popup = document.querySelector('.balance_okui-dialog-window');
        if (popup && getComputedStyle(popup).display !== 'none') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
            resetFormData(); // 当弹出窗口关闭时重置数据
        }
    };

    // 连续点击添加按钮
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const addAddresses = async (count) => {
        for (let i = 0; i < count; i++) {
            document.querySelector('.add-address-form-btn').click();
            await delay(20);
        }
    };

    // 解析地址和前缀
    const parseAddresses = (rawData, prefix) => {
        const lines = rawData.split('\n');
        const baseIndex = parseInt(prefix.substring(1)) || 0;
        return lines.map((line, index) => {
            const address = line.trim();
            const note = `${prefix.substring(0, 1)}${baseIndex + index}`;
            return { address, note };
        });
    };

    // 填充地址
    const fillAddresses = (rawData, prefix) => {
        const data = parseAddresses(rawData, prefix);
        fillForm(0, data);
    };

    function simulateReactInputChange(input, value) {
        const lastValue = input.value;
        input.value = value;

        const event = new Event('input', { bubbles: true });
        event.simulated = true;

        const tracker = input._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }

        input.dispatchEvent(event);
    }

    function fillForm(index, data) {
        if (index >= data.length) {
            console.log('所有表单已填充完毕。');
            return;
        }

        setTimeout(() => {
            const addressInputs = document.querySelectorAll(
                'input[placeholder*="地址 / .crypto domain"]'
            );
            const noteInputs = document.querySelectorAll(
                'input[placeholder="如：“我的钱包”"]'
            );

            if (addressInputs.length === 0 || noteInputs.length === 0) {
                console.error('找不到输入框，请检查选择器。');
                return;
            }

            if (index >= addressInputs.length || index >= noteInputs.length) {
                console.error('数据超过了输入框的数量。');
                return;
            }

            simulateReactInputChange(addressInputs[index], data[index].address);
            simulateReactInputChange(noteInputs[index], data[index].note);

            console.log(`已填充表单 ${index + 1}。`);

            fillForm(index + 1, data);
        }, 0);
    }

    // 初始化
    window.addEventListener('load', () => {
        createUserInterface();
        observeDOM(document.body, checkForPopup); // 监听body的变化
    });
})();
