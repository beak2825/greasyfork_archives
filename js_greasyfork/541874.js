// ==UserScript==
// @name         密码可见性切换
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在密码输入框旁添加可见性切换按钮
// @author       dangwa
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541874/%E5%AF%86%E7%A0%81%E5%8F%AF%E8%A7%81%E6%80%A7%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/541874/%E5%AF%86%E7%A0%81%E5%8F%AF%E8%A7%81%E6%80%A7%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        .tampermonkey-password-toggle {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            color: #6B7280;
            z-index: 100;
            border: none;
            background: none;
        }
        .tampermonkey-password-toggle:hover {
            color: #4F46E5;
        }
        .password-input-wrapper {
            position: relative;
        }
    `;
    document.head.appendChild(style);

    // 为主密码输入框添加切换按钮
    function addToggleToPasswordInputs() {
        // 查找所有密码输入框
        const passwordInputs = document.querySelectorAll('input[type="password"]');

        passwordInputs.forEach(input => {
            // 检查是否已经添加了切换按钮
            if (input.parentElement.classList.contains('password-input-wrapper')) {
                return;
            }

            // 创建父容器
            const wrapper = document.createElement('div');
            wrapper.className = 'password-input-wrapper';

            // 将输入框放入容器
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);

            // 创建切换按钮
            const toggleBtn = document.createElement('button');
            toggleBtn.type = 'button';
            toggleBtn.className = 'tampermonkey-password-toggle';
            toggleBtn.innerHTML = '<i class="fa fa-eye-slash"></i>';
            toggleBtn.setAttribute('aria-label', '切换密码可见性');

            // 添加 Font Awesome
            if (!document.querySelector('link[href*="font-awesome"]')) {
                const faLink = document.createElement('link');
                faLink.href = 'https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css';
                faLink.rel = 'stylesheet';
                document.head.appendChild(faLink);
            }

            // 添加按钮到容器
            wrapper.appendChild(toggleBtn);

            // 添加点击事件
            toggleBtn.addEventListener('click', function() {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);

                // 切换图标
                const icon = toggleBtn.querySelector('i');
                if (type === 'text') {
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                } else {
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                }
            });
        });
    }

    // 初始添加切换按钮
    addToggleToPasswordInputs();

    // 监听DOM变化，处理动态加载的密码输入框
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // 检查新增节点中是否有密码输入框
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if (node.nodeType === 1) { // 元素节点
                        if (node.tagName === 'INPUT' && node.type === 'password') {
                            addToggleToPasswordInputs();
                            break;
                        } else {
                            // 检查子节点
                            const passwordInputs = node.querySelectorAll('input[type="password"]');
                            if (passwordInputs.length > 0) {
                                addToggleToPasswordInputs();
                                break;
                            }
                        }
                    }
                }
            }
        });
    });

    // 开始观察DOM变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 添加键盘快捷键支持（Ctrl+Shift+P 切换焦点密码框可见性）
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p') {
            e.preventDefault();
            const activeElement = document.activeElement;
            if (activeElement && activeElement.tagName === 'INPUT' && activeElement.type === 'password') {
                // 找到对应的切换按钮并点击
                const wrapper = activeElement.parentElement;
                if (wrapper.classList.contains('password-input-wrapper')) {
                    const toggleBtn = wrapper.querySelector('.tampermonkey-password-toggle');
                    if (toggleBtn) {
                        toggleBtn.click();
                    }
                }
            }
        }
    });
})();
