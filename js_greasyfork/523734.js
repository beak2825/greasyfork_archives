// ==UserScript==
// @name         _Butter_Tools
// @namespace    http://tampermonkey.net/
// @version      2025-07-17
// @description  try to take over the world!
// @author       Steryn
// @include      http://localhost:8080/app/system/logs/email-log
// @include      https://**-butter.bipocloud.com/*
// @include      https://wise-*.bipocloud.com/*
// @include      https://axis-*.bipocloud.com/*
// @include      https://docs-*.bipocloud.com/*
// @include      https://*.bipocloud.com/email-task/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/523734/_Butter_Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/523734/_Butter_Tools.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const theme_color = 'rgb(114, 124, 245)';
    const theme_color_hover = 'rgb(114, 124, 245,0.7)';
    const theme_color_feedback = 'rgb(114, 124, 245)';

    // 等待页面加载完成
    window.addEventListener('load', function () {
        console.log(
            '%c 🐒 页面加载完成，开始执行自定义逻辑。',
            'background: #ffe066; color: #222; font-size: 14px; padding: 4px 12px; border-radius: 6px; font-weight: bold;'
        );

        // 监听页面变化
        const el_circle = createCircle();

        document.body.appendChild(el_circle);

        setTimeout(() => {
            console.log('%c 🐒 弹窗a链接自动处理脚本已启动', 'background: #ffe066; color: #222; font-size: 14px; padding: 2px 8px; border-radius: 4px;');
            doMutation(() => {
                changeLinkHref()
                copyEmailUrl()
            });
            el_circle.innerHTML = '🐒';
        }, 8000)
    });

    // 拷贝当前的email url
    function copyEmailUrl() {
        const emailNodeText = document.querySelector('div[aria-label="Email Log"] table tbody tr:nth-child(3) td:nth-child(2)').innerText

        console.log('当前的email url:', emailNodeText);

        navigator.clipboard.writeText(emailNodeText)
            .then(() => {
                showFeedback(`已复制到剪贴板:${emailNodeText}`);
            })
            .catch(err => {
                showFeedback(`复制失败：${err}`);
            });
    }

    // 替换处理链接
    function changeLinkHref() {
        const nodes = document.querySelectorAll('tr>td>a');
        if (nodes.length === 0) {
            showFeedback(`暂无数据`);
            return;
        }
        Array.from(nodes).reduce((acc, item) => {
            item.href = item.dataset.href
            item.target = "_blank"
            item.classList.add('item_link');
            return acc;
        }, []);


        GM_addStyle(`
            .item_link {
                color: #fff !important;
                font-weight: bolder !important;
                font-style: italic !important;
            }
        `);
    }

    // 发起执行监控
    function doMutation(fn) {
        // 选择需要观察变动的目标节点
        const targetNodes = document.querySelectorAll('body > div.ep-overlay');

        // 观察器的配置（监听子节点和属性变化）
        const config = {
            childList: false,       // 监听子节点的添加或移除
            subtree: false,         // 监听后代节点
            attributes: true,      // 监听属性变化
            attributeFilter: ['style'] // 只监听 style 属性
        };

        // 检查 Dialog 是否打开的函数
        function checkDialogOpen(target) {
            // 验证target元素的display属性是否为none
            if (target?.style.display === 'none') {
                return false
            }
            return true
        }

        // 统一处理 Dialog 状态变化
        function handleDialogChange(target) {
            const isOpen = checkDialogOpen(target);
            console.log(isOpen ? 'Dialog 已打开' : 'Dialog 已关闭');
            // 这里可以触发自定义事件或执行其他操作
            isOpen && fn?.()
        }

        // 使用防抖包装 handleDialogChange 函数
        const debouncedHandleDialogChange = debounce(handleDialogChange, 300); // 300 毫秒的延迟

        // 创建一个观察器实例并传入回调函数
        const observer = new MutationObserver(mutationsList => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes') {
                    // style 属性变化时检查
                    if (mutation.target.classList.contains('ep-overlay')) {
                        debouncedHandleDialogChange(mutation.target)
                    }
                }
            }
        });

        // 开始观察所有目标节点
        targetNodes.forEach(node => {
            observer.observe(node, config);
        });
    }

    // 创建圆形按钮
    function createCircle() {
        const circle = document.createElement('div');
        circle.classList.add('extract_email_url_circle_');
        circle.style.position = 'fixed';
        circle.style.width = '40px';
        circle.style.height = '40px';
        circle.style.borderRadius = '50%';
        circle.style.backgroundColor = theme_color;
        circle.style.cursor = 'pointer';
        circle.style.display = 'none';
        circle.style.zIndex = '9999';
        circle.style.boxShadow = '0 2px 12px rgba(0,0,0,0.1)';
        circle.style.transition = 'transform 0.3s ease';
        circle.innerHTML = '⚙️';
        circle.style.display = 'flex';
        circle.style.alignItems = 'center';
        circle.style.justifyContent = 'center';
        circle.style.left = '10px';
        circle.style.bottom = '10px';
        // 鼠标悬浮移除minimize状态
        GM_addStyle(`
            .extract_email_url_circle:hover {
                transform: translateX(0);
                opacity: 1;
            }
            .extract_email_url_circle {
                transform: translateX(-70%);
                opacity: 0.5;
            }
        `);

        return circle
    }

    // 创建容器
    // function createContainer() {
    //     const container = document.createElement('div');
    //     container.classList.add('extract_email_url_container');
    //     container.style.position = 'fixed';
    //     container.style.left = '10px';
    //     container.style.bottom = '10px';
    //     container.style.width = 'fit-content';
    //     container.style.maxWidth = '99vw';
    //     //container.style.height = '62px';
    //     container.style.backgroundColor = 'white';
    //     container.style.border = '1px solid #dcdfe6';
    //     container.style.borderRadius = '6px';
    //     container.style.boxShadow = '0 2px 12px rgba(0,0,0,0.1)';
    //     container.style.padding = '10px';
    //     container.style.zIndex = '9999';
    //     container.style.display = 'flex';
    //     container.style.alignItems = 'center';
    //     container.style.flexDirection = 'column'

    //     return container
    // }

    // 显示反馈信息
    function showFeedback(message) {
        // 创建反馈元素
        const feedbackElement = document.createElement('div');
        feedbackElement.textContent = message;
        feedbackElement.style.position = 'fixed';
        feedbackElement.style.bottom = '40px';
        feedbackElement.style.left = '50%';
        feedbackElement.style.padding = '10px 20px';
        feedbackElement.style.border = `1px solid ${theme_color}`;
        feedbackElement.style.backgroundColor = theme_color_feedback; // 绿色背景
        feedbackElement.style.color = 'white';
        feedbackElement.style.fontWeight = "bold";
        feedbackElement.style.borderRadius = '5px';
        feedbackElement.style.zIndex = '9999';
        feedbackElement.style.transition = 'opacity 0.5s';
        feedbackElement.style.opacity = '1';
        feedbackElement.style.transform = 'translateX(-50%)';

        document.body.appendChild(feedbackElement);

        // 设定延迟隐藏反馈
        setTimeout(() => {
            feedbackElement.style.opacity = '0'; // Fade out
            setTimeout(() => {
                document.body.removeChild(feedbackElement); // Remove after fade out
            }, 500);
        }, 2000); // 2000毫秒后淡出
    }

    // 防抖函数
    function debounce(fn, delay) {
        var timer;
        return function () {
            var context = this;
            var args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    }

    // 节流函数
    function throttle(fn, delay) {
        var last = 0;
        return function () {
            var now = Date.now();
            if (now - last > delay) {
                last = now;
                fn.apply(this, arguments);
            }
        };
    }
})();
