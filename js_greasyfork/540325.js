// ==UserScript==
// @name          懂车帝看图体验优化 - 图片秒切，告别滑动动画
// @version       1.1
// @description   【最终彻底无动画】确保在 Swiper 初始化后立即去除动画，并完全兼容首图无Prev、末图无Next按钮情况。
// @author        NIA
// @license       GPL-3.0-only
// @match         https://www.dongchedi.com/*
// @grant         none
// @run-at        document-idle
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/540325/%E6%87%82%E8%BD%A6%E5%B8%9D%E7%9C%8B%E5%9B%BE%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96%20-%20%E5%9B%BE%E7%89%87%E7%A7%92%E5%88%87%EF%BC%8C%E5%91%8A%E5%88%AB%E6%BB%91%E5%8A%A8%E5%8A%A8%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/540325/%E6%87%82%E8%BD%A6%E5%B8%9D%E7%9C%8B%E5%9B%BE%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96%20-%20%E5%9B%BE%E7%89%87%E7%A7%92%E5%88%87%EF%BC%8C%E5%91%8A%E5%88%AB%E6%BB%91%E5%8A%A8%E5%8A%A8%E7%94%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('【懂车帝秒切脚本】: V1.0 已启动，正在监听页面变化...');

    // ------------------- 配置区 -------------------
    const NEXT_BUTTON_SELECTOR = 'a[class*="head-image_right__"]';
    const PREV_BUTTON_SELECTOR = 'a[class*="head-image_left__"]';
    const SWIPER_WRAPPER_SELECTOR = '.swiper-wrapper';
    const SWIPER_CONTAINER_SELECTOR = '.swiper-container.head-image_swiper__P7S3Z';
    // ----------------------------------------------------------------

    let swiperInitializationObserver = null;
    let swiperAnimationFixObserver = null;

    // 核心逻辑：确保 Swiper 动画始终为0ms
    const disableSwiperAnimation = (wrapperElement) => {
        if (wrapperElement) {
            wrapperElement.style.transitionDuration = '0ms';
            wrapperElement.style.transitionProperty = 'none';
            // console.log('Swiper动画已强制设置为0ms。'); // 调试用，如果不需要可以注释掉
        }
    };

    function setupInstantSwitcher() {
        const swiperWrapper = document.querySelector(SWIPER_WRAPPER_SELECTOR);
        const nextButton = document.querySelector(NEXT_BUTTON_SELECTOR);
        const prevButton = document.querySelector(PREV_BUTTON_SELECTOR);

        console.log('--- 尝试捕获关键元素 (V1.0) ---');
        console.log('Swiper Wrapper:', swiperWrapper);
        console.log('Next Button:', nextButton); // 可能为 null
        console.log('Prev Button:', prevButton); // 可能为 null

        // 核心检查：只有 swiperWrapper 必须存在
        // 如果 Swiper Wrapper 都不存在，则说明页面结构不匹配或Swiper未加载
        if (!swiperWrapper) {
            console.error('【秒切脚本V1.0错误】: 未能捕获到 Swiper Wrapper。脚本终止。');
            return;
        }

        // 立即尝试去除动画，以防Swiper在我们之前初始化
        disableSwiperAnimation(swiperWrapper);

        // 创建持久的观察者，监听 swiper-wrapper 的 style 属性变化
        // 这是为了捕获 Swiper 在切换图片时可能再次设置动画持续时间的情况
        if (!swiperAnimationFixObserver) { // 确保只创建一次观察者
            swiperAnimationFixObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        // 检查是否是 Swiper 尝试添加过渡效果 (即设置了一个非零的动画时间)
                        if (swiperWrapper.style.transitionDuration !== '0s' && swiperWrapper.style.transitionDuration !== '0ms' && swiperWrapper.style.transitionDuration !== '') {
                             // 如果 Swiper 设置了一个非零的动画时间，立即覆盖它
                            disableSwiperAnimation(swiperWrapper);
                             // console.log('Swiper动画被重新覆盖为0ms！'); // 调试用，如果不需要可以注释掉
                        }
                    }
                });
            });
            // 监听 swiperWrapper 的属性变化，尤其是 style 属性
            swiperAnimationFixObserver.observe(swiperWrapper, { attributes: true, attributeFilter: ['style'] });
            console.log('【懂车帝秒切脚本】: 已启动 Swiper Wrapper 动画修复监听。');
        }

        // 监听按钮点击事件
        const setupButtonClick = (button) => {
            // 只有当按钮元素存在时才添加事件监听器
            if (button) {
                button.addEventListener('click', (e) => {
                    console.log('--- 按钮点击事件被捕获 (V1.0) ---');
                    // 在点击时，再次确保动画关闭，以防万一
                    disableSwiperAnimation(swiperWrapper);
                    // 不再阻止默认行为 (e.preventDefault()) 和事件冒泡 (e.stopPropagation())
                    // 这是为了让 Swiper 的原生点击事件完全执行，确保其内部状态的正确更新。
                    // 我们只通过修改样式来去除动画，而不是替代其切换逻辑。
                }, true); // 使用捕获模式确保我们的监听器最先执行
            }
        };

        // 对两个按钮都调用 setupButtonClick，它内部会判断按钮是否存在并决定是否绑定监听器
        setupButtonClick(nextButton);
        setupButtonClick(prevButton);

        console.log('【懂车帝秒切脚本】: V1.0 已成功接管翻页链接（完全兼容无Prev/Next按钮）！');
    }

    // 主观察者：监听 Swiper 容器是否初始化完成
    // 注意：将 @run-at 改为 document-idle 可以让脚本更晚执行，可能会有帮助
    const mainObserver = new MutationObserver((mutationsList) => {
        const swiperContainer = document.querySelector(SWIPER_CONTAINER_SELECTOR);
        // 检查 Swiper 容器是否存在且包含 'swiper-container-initialized' 类
        if (swiperContainer && swiperContainer.classList.contains('swiper-container-initialized')) {
            console.log('【懂车帝秒切脚本】: 检测到 Swiper 容器已初始化完成！');
            setupInstantSwitcher(); // Swiper 初始化完成后，才执行秒切逻辑
            mainObserver.disconnect(); // 一旦 Swiper 初始化完成并设置了秒切，就停止监听容器，避免重复执行
        }
    });

    // 开始监视整个页面的子节点和子树变化，以捕获 Swiper 容器的出现和类名变化
    // attributes: true, attributeFilter: ['class'] 是为了监听 swiper-container 上的 class 属性变化，
    // 以便捕获 'swiper-container-initialized' 类的添加。
    mainObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

})();