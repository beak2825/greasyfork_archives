// ==UserScript==
// @name         问卷星选项填空检测
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  选项检测，定位选项，返回顶部
// @author       QY
// @match        https://www.wjx.cn/vm/*
// @match        https://www.wjx.cn/vj/*
// @match        https://ks.wjx.top/*
// @match        https://ww.wjx.top/*
// @match        http://sugarblack.top/
// @icon         https://is4-ssl.mzstatic.com/image/thumb/Purple125/v4/f8/fd/df/f8fddf98-a5b0-559a-181b-1b4a50b94b71/source/512x512bb.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526173/%E9%97%AE%E5%8D%B7%E6%98%9F%E9%80%89%E9%A1%B9%E5%A1%AB%E7%A9%BA%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/526173/%E9%97%AE%E5%8D%B7%E6%98%9F%E9%80%89%E9%A1%B9%E5%A1%AB%E7%A9%BA%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==


(function () {
    'use strict';

    window.addEventListener('load', function () {
        // 工具函数：滚动到目标位置并高亮
        function scrollToElement(element) {
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.style.border = '2px solid red'; // 短暂高亮
                setTimeout(() => {
                    element.style.border = ''; // 恢复原样
                }, 2000);
            }
        }

        // 获取包含填空框的单选题和多选题
        const singleSelectFields = Array.from(document.querySelectorAll('.ui-radio'))
            .filter(option => option.querySelector('.OtherRadioText') && option.querySelector('input[type=radio]'));

        const multiSelectFields = Array.from(document.querySelectorAll('.ui-checkbox'))
            .filter(option => option.querySelector('.OtherText') && option.querySelector('input[type=checkbox]'));

        // 合并单选题和多选题的填空选项，按顺序处理
        const fillableQuestions = [
            ...singleSelectFields,
            ...multiSelectFields
        ];

        let currentQuestionIndex = 0;

        // 创建按钮：定位到填空选项的单选题和多选题
        const goToFillableButton = document.createElement('button');
        goToFillableButton.textContent = '定位填空选项 (必填/选填)';
        goToFillableButton.style.position = 'fixed';
        goToFillableButton.style.top = '50%';
        goToFillableButton.style.right = '10px';
        goToFillableButton.style.transform = 'translateY(-50%)';
        goToFillableButton.style.backgroundColor = 'yellow';
        goToFillableButton.style.zIndex = 1000;
        goToFillableButton.style.padding = '10px 20px';
        goToFillableButton.style.border = 'none';
        goToFillableButton.style.cursor = 'pointer';

        goToFillableButton.addEventListener('click', function () {
            if (fillableQuestions.length > 0) {
                const field = fillableQuestions[currentQuestionIndex];
                scrollToElement(field);
                const textBox = field.querySelector('.OtherRadioText') || field.querySelector('.OtherText');
                if (textBox) {
                    textBox.focus(); // 聚焦到文本框
                    // 如果是“其他”选项且没有输入，设置默认值为“无”
                    if (textBox.value === '') {
                        textBox.value = '无';
                    }
                }
                currentQuestionIndex = (currentQuestionIndex + 1) % fillableQuestions.length; // 循环定位
            } else {
                alert('未找到包含填空框的选项！');
            }
        });

        // 创建返回顶部按钮
        const backToTopButton = document.createElement('button');
        backToTopButton.textContent = '返回顶部';
        backToTopButton.style.position = 'fixed';
        backToTopButton.style.bottom = '10px';
        backToTopButton.style.right = '10px';
        backToTopButton.style.backgroundColor = '#4CAF50';
        backToTopButton.style.color = 'white';
        backToTopButton.style.zIndex = 1000;
        backToTopButton.style.padding = '10px 20px';
        backToTopButton.style.border = 'none';
        backToTopButton.style.cursor = 'pointer';

        backToTopButton.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // 添加提示信息到单选题和多选题标签
        const addTipToLabel = (label, isSingleSelect, isRequired) => {
            let tipText = '';
            if (isSingleSelect) {
                tipText = isRequired ? '（选项填空，必填! 注意甄别，问好客户，别被坑了）' : '（选项填空，选填）';
            } else {
                tipText = isRequired ? '（选项填空，必填，注意甄别，问好客户，别被坑了）' : '（选项填空，选填）';
            }
            label.innerHTML = `${label.textContent} <span style="color: red; font-size: 0.8em; margin-left: 5px;">${tipText}</span>`;
        };

        // 识别必填和选填
        const allLabels = document.querySelectorAll('.label');
        allLabels.forEach(label => {
            const field = singleSelectFields.concat(multiSelectFields).find(field => field.querySelector('.label') === label);
            if (!field) return;

            const isSingleSelect = singleSelectFields.includes(field);
            const isRequired = field.querySelector('input[type=text]').getAttribute('required') === 'true';
            addTipToLabel(label, isSingleSelect, isRequired);
        });

        // 测试用：控制台输出找到的元素（方便调试）
        console.log('找到的单选题填空选项:', singleSelectFields);
        console.log('找到的多选题填空选项:', multiSelectFields);

        // 隐藏特定元素、添加提示信息、自动填充登录表单以及调整按钮样式
        function hideElementsAndModifyLoginButton() {
            // 隐藏“关于”链接
            var aboutLink = document.querySelector('a[data-v-8d995f12][href="#/home/about"]');
            if (aboutLink) {
                aboutLink.style.display = 'none';
            }

            // 隐藏横幅广告
            var bannerDiv = document.getElementById('banner');
            if (bannerDiv) {
                bannerDiv.style.display = 'none';
            }

            // 隐藏包含特定属性的 span 元素
            var specificSpan = document.querySelector('span[data-v-684263c3]');
            if (specificSpan) {
                specificSpan.style.display = 'none';
            }

            // 隐藏由 blacksugar 提供的 bilibili 视频链接
            var bilibiliLink = document.querySelector('a[href="https://www.bilibili.com/video/BV1tJ4m1T7xn&#34;][target=&#34;_blank&#34;]  span[data-v-5073cdbe]');
            if (bilibiliLink) {
                bilibiliLink.closest('a').style.display = 'none'; // 使用 closest 方法找到最近的祖先 <a> 元素并隐藏它
            }

            // 自动填充登录表单
            var emailInput = document.querySelector('input[id="el-id-5340-539"]');
            var passwordInput = document.querySelector('input[id="el-id-5340-540"]');

            if (emailInput && passwordInput) {
                emailInput.value = "986968597@qq.com";
                passwordInput.value = "123456";

                // 添加样式以遮罩显示的密码
                var style = document.createElement('style');
                style.innerHTML = `
                    input[type="password"] {
                        -webkit-text-security: disc;
                    }
                `;
                document.head.appendChild(style);
            }

            // 隐藏指定的 h3, span 和 注册按钮
            var h3Element = document.querySelector('h3.el-tooltip__trigger');
            var explanationSpan = document.querySelector('span[style*="font-size: 10px"][style*="color: rgb(144, 147, 153)"]');
            var registerButtons = Array.from(document.querySelectorAll('button')).filter(button => button.textContent.trim() === '注册');
            var loginButtons = Array.from(document.querySelectorAll('button')).filter(button => button.textContent.trim() === '登录');

            if (h3Element) {
                h3Element.style.display = 'none';
            }
            if (explanationSpan) {
                explanationSpan.style.display = 'none';
            }
            registerButtons.forEach(button => {
                if (button) {
                    button.style.display = 'none';
                }
            });

            // 修改登录按钮样式
            loginButtons.forEach((loginButton, index) => {
                if (index === 0) { // 只修改第一个登录按钮
                    loginButton.style.width = '200%'; // 设置宽度为双倍
                    loginButton.style.flexGrow = '2'; // 确保在弹性布局中占据更多空间
                } else {
                    loginButton.style.width = '100%'; // 其他登录按钮设置为默认宽度
                    loginButton.style.flexGrow = '1';
                }
            });

            // 获取 user-info 容器内的所有 user-item 元素
            var userInfoContainer = document.querySelector('div[data-v-684263c3].user-info');
            if (userInfoContainer) {
                // 在特定的 div 元素内容后添加提示信息（如果还未添加）
                var userItemDiv = userInfoContainer.querySelector('.tooltip-added');
                if (!userItemDiv) {
                    userItemDiv = document.createElement('div');
                    userItemDiv.className = 'user-item tooltip-added';
                    userItemDiv.innerHTML = '<br>余额耗尽前联系管理员充值';
                    userInfoContainer.insertBefore(userItemDiv, userInfoContainer.firstChild);
                }

                // 确保提示信息总是可见
                userItemDiv.style.display = '';

                // 只保留 "余额耗尽前联系管理员充值" 和 "当前额度: 6010"
                var userItems = userInfoContainer.querySelectorAll('.user-item:not(.tooltip-added)');
                userItems.forEach(item => {
                    if (!item.textContent.includes('当前额度:') &&
                        !item.textContent.includes('余额耗尽前联系管理员充值') &&
                        !item.textContent.includes('如无结果请查看问卷是否设置了智能验证')) {
                        item.style.display = 'none';
                    } else if (item.textContent.includes('如无结果请查看问卷是否设置了智能验证')) {
                        item.style.display = 'none'; // 特别隐藏这一段文本
                    }
                });
            }
        }

        // 初始检查
        hideElementsAndModifyLoginButton();

        // 使用 MutationObserver 监听 DOM 变化
        var observer = new MutationObserver((mutationsList, observer) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    hideElementsAndModifyLoginButton();
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // 根据是否有填空选项决定是否显示定位按钮
        if (fillableQuestions.length > 0) {
            document.body.appendChild(goToFillableButton);
        }

        // 始终显示返回顶部按钮
        document.body.appendChild(backToTopButton);
    });
})();
