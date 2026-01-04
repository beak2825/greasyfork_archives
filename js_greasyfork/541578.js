// ==UserScript==
// @name         spankbang去除年龄验证
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  去除年龄验证-去除顶层遮挡，解除滚动条禁用限制，移除网页因添加fixed/h-full/w-full类导致的滚动条禁用
// @author       lzx
// @match        https://spankbang.com/*
// @match        https://*.spankbang.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541578/spankbang%E5%8E%BB%E9%99%A4%E5%B9%B4%E9%BE%84%E9%AA%8C%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/541578/spankbang%E5%8E%BB%E9%99%A4%E5%B9%B4%E9%BE%84%E9%AA%8C%E8%AF%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 标志位，防止重复操作
    let scrollRestored = false;
    let classRestored = false;
    let avWrapperHidden = false;

    // 监听DOM变化，检测并移除禁用滚动的类和遮挡层
    const observer = new MutationObserver(function(mutations) {
        let bodyClassModified = false;

        mutations.forEach(function(mutation) {
            // 检查body类变化
            if (mutation.attributeName === 'class' && mutation.target === document.body) {
                bodyClassModified = true;
            }

            // 检查av-wrapper元素是否被添加或修改
            if (mutation.type === 'childList') {
                checkAvWrapper();
            }
        });

        if (bodyClassModified && !classRestored) {
            const body = document.body;
            if (body.classList.contains('fixed')) {
                body.classList.remove('fixed', 'h-full', 'w-full');
                classRestored = true;
                console.log('已移除滚动限制类');

                // 3秒后重置标志，允许再次检测
                setTimeout(() => classRestored = false, 3000);
            }
        }
    });

    // 配置观察选项
    const config = {
        attributes: true,
        attributeFilter: ['class'],
        childList: true,      // 监听子节点变化
        subtree: true         // 监听所有后代节点
    };

    // 开始观察document.body
    observer.observe(document.body, config);

    // 处理内联样式修改
    function checkInlineStyles() {
        if (!scrollRestored && document.body.style.overflow === 'hidden') {
            document.body.style.overflow = '';
            scrollRestored = true;
            console.log('已恢复滚动条样式');
        }
    }

    // 检查并隐藏av-wrapper
    function checkAvWrapper() {
        if (avWrapperHidden) return;

        const avWrapper = document.getElementById('av-wrapper');
        const safetyblur = document.getElementById('safety-blur');
        if (avWrapper) {
            // 方法1：完全隐藏元素
            avWrapper.style.display = 'none';
            safetyblur.style.display = 'none';
            // 方法2：仅调整z-index使其不遮挡内容（保留元素可见性）
            // avWrapper.style.zIndex = '-1';

            avWrapperHidden = true;
            safetyblurHidden = true;
            console.log('已隐藏av-wrapper遮挡层');

            // 触发重排，确保滚动恢复
            setTimeout(() => {
                document.body.style.overflow = '';
            }, 100);
        }
    }

    // 初始执行检查
    checkInlineStyles();
    checkAvWrapper();

    // 使用requestAnimationFrame执行周期性检查，降低频率
    let lastCheckTime = 0;
    const CHECK_INTERVAL = 1000; // 每1秒检查一次

    function animationLoop(timestamp) {
        if (timestamp - lastCheckTime > CHECK_INTERVAL) {
            checkInlineStyles();
            checkAvWrapper();
            lastCheckTime = timestamp;
        }
        requestAnimationFrame(animationLoop);
    }

    // 延迟启动动画循环，避免页面加载时过度消耗资源
    setTimeout(() => {
        requestAnimationFrame(animationLoop);
    }, 1000);

    // 页面加载完成后再次检查
    window.addEventListener('load', () => {
        checkInlineStyles();
        checkAvWrapper();

        const body = document.body;
        if (body.classList.contains('fixed')) {
            body.classList.remove('fixed', 'h-full', 'w-full');
            console.log('页面加载后移除滚动限制类');
        }
    });






  // 方法1：使用样式覆盖（更高优先级）
    const overrideStyle = document.createElement('style');
    overrideStyle.id = 'blur-remover-style';
    overrideStyle.textContent = `
        .strong-blur {
            filter: blur(0) !important;
            -webkit-filter: blur(0) !important;
            -moz-filter: blur(0) !important;
            -ms-filter: blur(0) !important;
            -o-filter: blur(0) !important;
        }
    `;
    document.documentElement.appendChild(overrideStyle);

    // 方法2：直接操作元素样式
    function removeBlur() {
        // 查找所有带有strong-blur类的元素
        const blurredElements = document.querySelectorAll('.strong-blur');

        blurredElements.forEach(element => {
            // 移除filter样式
            element.style.filter = 'none !important';
            element.style.webkitFilter = 'none !important';

            // 检查是否有内联样式设置了模糊
            if (element.hasAttribute('style')) {
                let style = element.getAttribute('style');
                style = style.replace(/filter:\s*blur\([^;]+\);?/gi, '');
                style = style.replace(/webkitFilter:\s*blur\([^;]+\);?/gi, '');
                element.setAttribute('style', style);
            }
        });
    }

    // 页面加载完成后执行一次
    window.addEventListener('load', removeBlur);

    // 定时检查并移除模糊（应对动态加载的内容）
    setInterval(removeBlur, 500);

    // 监控DOM变化
    const observer2 = new MutationObserver(removeBlur);
    observer2.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
    });



})();