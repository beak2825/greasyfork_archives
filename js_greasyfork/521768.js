// ==UserScript==
// @name         北理工教评
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自定义一键评价
// @match        https://pj.bit.edu.cn/pjxt2.0/stpj/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/521768/%E5%8C%97%E7%90%86%E5%B7%A5%E6%95%99%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/521768/%E5%8C%97%E7%90%86%E5%B7%A5%E6%95%99%E8%AF%84.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建配置面板
    function createConfigPanel() {
        // 创建配置面板容器
        const panel = document.createElement('div');

        // 获取保存的位置，如果没有则使用默认位置
        const savedPosition = GM_getValue('panelPosition', { top: '50px', left: 'auto', right: '10px' });

        panel.style.position = 'fixed';
        panel.style.top = savedPosition.top;
        panel.style.left = savedPosition.left;
        panel.style.right = savedPosition.right;
        panel.style.width = '250px';
        panel.style.backgroundColor = '#f0f0f0';
        panel.style.border = '1px solid #ccc';
        panel.style.padding = '15px';
        panel.style.zIndex = '10000';
        panel.style.borderRadius = '5px';
        panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';

        // 标题
        const title = document.createElement('h3');
        title.textContent = '教师评价配置';
        title.style.textAlign = 'center';
        title.style.marginBottom = '15px';
        panel.appendChild(title);

        // 选项单选组
        const options = [
            { text: '神中神', value: 1 },
            { text: '挺好', value: 2 },
            { text: '一般', value: 3 },
            { text: '半唐', value: 4 },
            { text: '全唐', value: 5 }
        ];

        // 创建单选按钮
        const radioContainer = document.createElement('div');
        radioContainer.style.marginBottom = '15px';
        options.forEach((option, index) => {
            const radioDiv = document.createElement('div');
            radioDiv.style.marginBottom = '5px';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'evaluationOption';
            radio.id = `option${index}`;
            radio.value = option.value;

            // 读取之前保存的选项
            const savedOption = GM_getValue('selectedOption', 1);
            radio.checked = parseInt(savedOption) === option.value;

            const label = document.createElement('label');
            label.htmlFor = `option${index}`;
            label.textContent = option.text;
            label.style.marginLeft = '5px';
            // 设置选中项的样式
            if (radio.checked) {
                label.style.fontWeight = 'bold';
                label.style.color = '#4CAF50';
            }

            // 添加点击事件
            radio.addEventListener('change', () => {
                // 更新所有label的样式
                radioContainer.querySelectorAll('label').forEach(l => {
                    l.style.fontWeight = 'normal';
                    l.style.color = 'black';
                });
                // 设置当前选中项的样式
                label.style.fontWeight = 'bold';
                label.style.color = '#4CAF50';
                // 自动保存选项
                GM_setValue('selectedOption', option.value);
            });

            radioDiv.appendChild(radio);
            radioDiv.appendChild(label);
            radioContainer.appendChild(radioDiv);
        });

        panel.appendChild(radioContainer);

        // 意见输入框
        const commentLabel = document.createElement('label');
        commentLabel.textContent = '意见内容：';
        const commentInput = document.createElement('input');
        commentInput.type = 'text';
        commentInput.id = 'commentInput';
        commentInput.style.width = '100%';
        commentInput.style.marginBottom = '10px';
        commentInput.value = GM_getValue('defaultComment', '好');

        // 自动保存意见内容
        commentInput.addEventListener('input', () => {
            GM_setValue('defaultComment', commentInput.value);
        });

        panel.appendChild(commentLabel);
        panel.appendChild(commentInput);

        // 添加自动提交复选框
        const autoSubmitContainer = document.createElement('div');
        autoSubmitContainer.style.marginBottom = '10px';
        autoSubmitContainer.style.display = 'flex';
        autoSubmitContainer.style.alignItems = 'center';
        autoSubmitContainer.style.padding = '8px';
        autoSubmitContainer.style.backgroundColor = '#fff';
        autoSubmitContainer.style.borderRadius = '3px';
        autoSubmitContainer.style.border = '1px solid #ddd';
        autoSubmitContainer.style.cursor = 'pointer';

        const autoSubmitWrapper = document.createElement('div');
        autoSubmitWrapper.style.display = 'flex';
        autoSubmitWrapper.style.alignItems = 'center';
        autoSubmitWrapper.style.width = '100%';
        autoSubmitWrapper.style.cursor = 'pointer';

        const autoSubmitCheckbox = document.createElement('input');
        autoSubmitCheckbox.type = 'checkbox';
        autoSubmitCheckbox.id = 'autoSubmitCheckbox';
        autoSubmitCheckbox.checked = GM_getValue('autoSubmit', false);
        autoSubmitCheckbox.style.width = '16px';
        autoSubmitCheckbox.style.height = '16px';
        autoSubmitCheckbox.style.cursor = 'pointer';
        autoSubmitCheckbox.style.margin = '0 8px 0 0';

        const autoSubmitLabel = document.createElement('label');
        autoSubmitLabel.htmlFor = 'autoSubmitCheckbox';
        autoSubmitLabel.textContent = '自动提交评价';
        autoSubmitLabel.style.cursor = 'pointer';
        autoSubmitLabel.style.userSelect = 'none';
        autoSubmitLabel.style.display = 'block';
        autoSubmitLabel.style.width = '100%';
        autoSubmitLabel.style.height = '100%';

        // 更新状态显示
        function updateAutoSubmitStyle() {
            if (autoSubmitCheckbox.checked) {
                autoSubmitContainer.style.backgroundColor = '#e8f5e9';
                autoSubmitContainer.style.borderColor = '#4CAF50';
                autoSubmitLabel.style.color = '#4CAF50';
                autoSubmitLabel.style.fontWeight = 'bold';
            } else {
                autoSubmitContainer.style.backgroundColor = '#fff';
                autoSubmitContainer.style.borderColor = '#ddd';
                autoSubmitLabel.style.color = '#666';
                autoSubmitLabel.style.fontWeight = 'normal';
            }
        }

        // 初始更新状态
        updateAutoSubmitStyle();

        // 点击事件处理
        const toggleCheckbox = (e) => {
            if (e.target !== autoSubmitCheckbox) {
                autoSubmitCheckbox.checked = !autoSubmitCheckbox.checked;
                GM_setValue('autoSubmit', autoSubmitCheckbox.checked);
                updateAutoSubmitStyle();
            }
        };

        // 给容器和包装器都添加点击事件
        autoSubmitContainer.addEventListener('click', toggleCheckbox);
        autoSubmitWrapper.addEventListener('click', toggleCheckbox);

        // 复选框变化事件
        autoSubmitCheckbox.addEventListener('change', () => {
            GM_setValue('autoSubmit', autoSubmitCheckbox.checked);
            updateAutoSubmitStyle();
        });

        autoSubmitWrapper.appendChild(autoSubmitCheckbox);
        autoSubmitWrapper.appendChild(autoSubmitLabel);
        autoSubmitContainer.appendChild(autoSubmitWrapper);
        panel.appendChild(autoSubmitContainer);

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.marginTop = '10px';

        // 一键评价按钮
        const evaluateButton = document.createElement('button');
        evaluateButton.textContent = '一键评价';
        evaluateButton.style.width = '50%';
        evaluateButton.style.backgroundColor = '#4CAF50';
        evaluateButton.style.color = 'white';
        evaluateButton.style.padding = '8px';
        evaluateButton.style.border = 'none';
        evaluateButton.style.borderRadius = '3px';
        evaluateButton.style.cursor = 'pointer';
        evaluateButton.addEventListener('click', autoEvaluate);

        // 提交按钮
        const submitButton = document.createElement('button');
        submitButton.textContent = '提交评价';
        submitButton.style.width = '50%';
        submitButton.style.backgroundColor = '#ffa500';
        submitButton.style.color = 'white';
        submitButton.style.padding = '8px';
        submitButton.style.border = 'none';
        submitButton.style.borderRadius = '3px';
        submitButton.style.cursor = 'pointer';
        submitButton.addEventListener('click', () => {
            if (typeof savePjxx === 'function') {
                savePjxx('1');
                setTimeout(() => {
                    const okButton = document.querySelector('.bootbox.modal.fade.in .btn-primary');
                    if (okButton) {
                        okButton.click();
                    }
                }, 1000);
            } else {
                alert('未找到提交函数，请手动点击页面的提交按钮');
            }
        });

        // 筛选未评按钮
        const filterButton = document.createElement('button');
        filterButton.textContent = '筛选未评';
        filterButton.style.width = '100%';
        filterButton.style.backgroundColor = '#2196F3';
        filterButton.style.color = 'white';
        filterButton.style.padding = '8px';
        filterButton.style.border = 'none';
        filterButton.style.borderRadius = '3px';
        filterButton.style.cursor = 'pointer';
        filterButton.style.marginTop = '10px';
        filterButton.addEventListener('click', () => {
            const select = document.querySelector('#ztTab');
            if (select) {
                select.value = "3";
                select.dispatchEvent(new Event('change'));

                if (window.jQuery) {
                    try {
                        jQuery('#ztTab').trigger('chosen:updated');
                        jQuery('#ztTab').trigger('change');
                    } catch (e) {
                        console.log('Chosen plugin update failed:', e);
                    }
                }
                queryLike();
            } else {
                alert('未找到状态选择框');
            }
        });

        // 将按钮添加到容器中
        buttonContainer.appendChild(evaluateButton);
        buttonContainer.appendChild(submitButton);
        panel.appendChild(buttonContainer);
        panel.appendChild(filterButton);

        // 添加拖动功能
        panel.style.cursor = 'move';
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        panel.addEventListener('mousedown', e => {
            if (e.target === panel || e.target === title) {
                isDragging = true;
                initialX = e.clientX - panel.offsetLeft;
                initialY = e.clientY - panel.offsetTop;
            }
        });

        document.addEventListener('mousemove', e => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                panel.style.left = currentX + 'px';
                panel.style.top = currentY + 'px';
                panel.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                GM_setValue('panelPosition', {
                    top: panel.style.top,
                    left: panel.style.left,
                    right: 'auto'
                });
            }
            isDragging = false;
        });

        document.body.appendChild(panel);
    }

    // 自动评价函数
    function autoEvaluate() {
        const selectedOption = GM_getValue('selectedOption', 1);
        const comment = GM_getValue('defaultComment', '好');
        const autoSubmit = GM_getValue('autoSubmit', false);

        // 选择所有对应序号的单选按钮并点击
        document.querySelectorAll(`.wjgl_input[id$="_${selectedOption}"]`).forEach(radio => {
            if (!radio.checked) {
                radio.click();
            }
        });

        // 填写所有文本框
        document.querySelectorAll('textarea').forEach(textarea => {
            textarea.value = comment;
            const event = new Event('change', { bubbles: true });
            textarea.dispatchEvent(event);
        });

        // 如果启用了自动提交，则自动提交评价
        if (autoSubmit) {
            if (typeof savePjxx === 'function') {
                savePjxx('1');
                setTimeout(() => {
                    const okButton = document.querySelector('.bootbox.modal.fade.in .btn-primary');
                    if (okButton) {
                        okButton.click();
                    }
                }, 1000);
            }
        }
    }

    // 页面加载完成后添加配置面板
    function init() {
        window.addEventListener('load', () => {
            setTimeout(createConfigPanel, 0);
        });
    }

    // 启动脚本
    init();
})();
