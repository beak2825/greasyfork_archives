// ==UserScript==
// @name         51taoshiwan智能答题助手-随机答案+弹窗处理+自动跳转
// @namespace    https://staybrowser.com/
// @version      0.3.2
// @description  广水一中2023级出品
// @author       xiaocanln & deepseek
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536859/51taoshiwan%E6%99%BA%E8%83%BD%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B-%E9%9A%8F%E6%9C%BA%E7%AD%94%E6%A1%88%2B%E5%BC%B9%E7%AA%97%E5%A4%84%E7%90%86%2B%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/536859/51taoshiwan%E6%99%BA%E8%83%BD%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B-%E9%9A%8F%E6%9C%BA%E7%AD%94%E6%A1%88%2B%E5%BC%B9%E7%AA%97%E5%A4%84%E7%90%86%2B%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // ==UserScript==
// @name         智能答题助手-随机答案+弹窗处理+自动跳转
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  完全随机答案选择+强化弹窗处理+自动跳转
// @author       xiaocanln & deepseek
// @match        http://infotech.51taoshi.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const TARGET_URL = 'https://infotech.51taoshi.com/hw/stu/myHomework.do';
    const REDIRECT_DELAY = 1500; // 跳转延迟时间

    // 强化随机数生成
    const getRandomOption = () => ['A', 'B', 'C', 'D'][Math.floor(Math.random()*4)];

    // 动态题量识别
    const getQuestionGroups = () => {
        const groups = new Map();
        document.querySelectorAll("input[type='radio']").forEach(radio => {
            const groupName = radio.name.replace(/_\d+$/, '');
            if (!groups.has(groupName)) {
                groups.set(groupName, []);
            }
            groups.get(groupName).push(radio);
        });
        return Array.from(groups.values());
    };

    // 精准答案选择
    const selectRandomAnswers = () => {
        const questionGroups = getQuestionGroups();
        questionGroups.forEach(group => {
            const options = group.filter(radio => radio.value.match(/^[A-D]$/));
            if (options.length > 0) {
                const selected = options[Math.floor(Math.random() * options.length)];
                selected.checked = true;
                selected.dispatchEvent(new Event('change'));
            }
        });
    };

    // 强化弹窗处理
    const handleConfirmDialog = () => {
        const confirmHandler = () => {
            const confirmBtn = [...document.querySelectorAll('.layui-layer-btn0')]
                .find(btn => btn.textContent.includes('确定'));
            if (confirmBtn) {
                confirmBtn.click();
                console.log('已确认提交');
                return true;
            }
            return false;
        };

        // 多重尝试机制
        let attempts = 0;
        const tryConfirm = () => {
            if (attempts++ < 5) {
                if (!confirmHandler()) {
                    setTimeout(tryConfirm, 300);
                }
            }
        };
        tryConfirm();
    };

    // 执行跳转
    const performRedirect = () => {
        console.log('即将跳转到作业列表页面');
        setTimeout(() => {
            window.location.href = TARGET_URL;
        }, REDIRECT_DELAY);
    };

    // 主执行流程
    setTimeout(() => {
        // 第一阶段：随机选择答案
        selectRandomAnswers();

        // 第二阶段：提交处理
        setTimeout(() => {
            const submitBtn = document.getElementById('postExamAnswer');
            if (submitBtn) {
                submitBtn.click();
                handleConfirmDialog();
                
                // 最终检查并跳转
                setTimeout(() => {
                    if (!document.querySelector('.layui-layer-btn0')) {
                        performRedirect();
                    } else {
                        location.reload(); // 弹窗仍存在则重新执行
                    }
                }, 2000);
            } else {
                performRedirect(); // 如果找不到提交按钮也跳转
            }
        }, 1000);
    }, 1500);

    // 防重复提交锁
    let isSubmitting = false;
    document.addEventListener('click', (e) => {
        if (e.target.id === 'postExamAnswer' && !isSubmitting) {
            isSubmitting = true;
            handleConfirmDialog();
        }
    });

})();

})();
