// ==UserScript==
// @name    页面下拉刷新 1.30
// @namespace    https://example.com
// @version    1.30
// @description 页面顶部下拉展示动画，包含刷新功能。改进自原代码作者：路灯下的豆子不结籽
// @match    *://*/*
// @exclude https://greasyfork.org/*
// @grant    none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527821/%E9%A1%B5%E9%9D%A2%E4%B8%8B%E6%8B%89%E5%88%B7%E6%96%B0%20130.user.js
// @updateURL https://update.greasyfork.org/scripts/527821/%E9%A1%B5%E9%9D%A2%E4%B8%8B%E6%8B%89%E5%88%B7%E6%96%B0%20130.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // 设置下拉的比例，这里设为 10%
    const pullDownRatio = 0.1; 
    // 用于记录触摸开始时手指在 Y 轴上的坐标
    let startY = 0; 
    // 标记是否处于触摸拖动状态，初始为 false
    let isDragging = false; 
    // 设置下挪和回弹动画的持续时间，单位为秒，固定为 0.3 秒
    const animationDuration = 0.3; 
    // 设置动画的缓动函数，这里使用 'ease' 使动画更自然平滑
    const easeFunction = 'ease'; 
    // 用于记录当前下拉的距离
    let currentDistance = 0;

    // 获取页面的 body 元素，后续用于操作页面的位移来实现动画效果
    const body = document.querySelector('body'); 

    // 计算下拉的阈值（基于页面高度的比例）
    const threshold = window.innerHeight * pullDownRatio; 

    // 开始下拉动画的函数
    function startPullDownAnimation() {
        // 明确设置 transform 的初始值为 translateY(0)，确保动画起始状态正确
        body.style.transform = 'translateY(0)';
        // 设置页面 body 的过渡动画属性，包括持续时间和缓动函数
        body.style.transition = `transform ${animationDuration}s ${easeFunction}`; 
        // 将页面 body 向下平移计算出的阈值距离，实现下拉动画效果
        body.style.transform = `translateY(${threshold}px)`; 
    }

    // 开始回弹动画的函数
    function startReboundAnimation() {
        // 明确设置 transform 的目标值为 translateY(0)，确保动画结束状态正确
        body.style.transform = `translateY(${threshold}px)`;
        // 设置页面 body 的过渡动画属性，包括持续时间和缓动函数
        body.style.transition = `transform ${animationDuration}s ${easeFunction}`; 
        // 将页面 body 移回初始位置（Y 轴位移为 0），实现回弹动画效果
        body.style.transform = 'translateY(0)'; 
    }

    // 监听触摸开始事件
    document.addEventListener('touchstart', function (e) {
        // 判断页面是否在最顶部（滚动条 Y 轴位置为 0）
        if (window.scrollY === 0) {
            // 记录触摸开始时手指的 Y 坐标
            startY = e.touches[0].clientY; 
            // 标记进入触摸拖动状态
            isDragging = true; 
            // 开始拖动时取消过渡动画，使拖动操作更流畅
            body.style.transition = 'none'; 
            // 在控制台打印日志，显示触摸开始时记录的 Y 坐标
            console.log('touchstart: startY set to', startY); 
        }
    });

    // 监听触摸移动事件
    document.addEventListener('touchmove', function (e) {
        // 判断页面是否在最顶部（滚动条 Y 轴位置为 0）
        if (window.scrollY === 0 && isDragging) {
            // 获取当前触摸点的 Y 坐标
            const currentY = e.touches[0].clientY; 
            // 计算触摸点移动的距离
            currentDistance = currentY - startY; 

            // 如果移动距离大于 0，则直接控制页面的位移
            if (currentDistance > 0) {
                // 直接设置页面的位移
                body.style.transform = `translateY(${currentDistance}px)`;
            }

            // 当移动距离超过阈值时，直接触发回弹动画
            if (currentDistance > threshold) {
                startReboundAnimation();
                // 监听回弹动画结束事件，在动画结束后刷新页面
                body.addEventListener('transitionend', function onTransitionEnd() {
                    // 移除事件监听器，避免重复执行
                    body.removeEventListener('transitionend', onTransitionEnd);
                    // 执行页面刷新
                    console.log('Reloading page...');
                    location.reload();
                }, { once: true });
                // 重置拖动状态
                isDragging = false;
                // 重置当前下拉距离
                currentDistance = 0;
            }
        }
    });

    // 监听触摸结束事件
    document.addEventListener('touchend', function () {
        if (isDragging) {
            // 如果下拉距离超过阈值，触发回弹动画
            if (currentDistance > threshold) {
                startReboundAnimation();
                // 监听回弹动画结束事件，在动画结束后刷新页面
                body.addEventListener('transitionend', function onTransitionEnd() {
                    // 移除事件监听器，避免重复执行
                    body.removeEventListener('transitionend', onTransitionEnd);
                    // 执行页面刷新
                    console.log('Reloading page...');
                    location.reload();
                }, { once: true });
            } else {
                // 如果下拉距离未超过阈值，也执行回弹动画使页面回到初始位置
                startReboundAnimation();
            }
        }
        // 重置触摸开始时记录的 Y 坐标为 0
        startY = 0; 
        // 重置拖动状态
        isDragging = false;
        // 重置当前下拉距离
        currentDistance = 0;
    });

    // 监听触摸取消事件
    document.addEventListener('touchcancel', function () {
        if (isDragging) {
            // 执行回弹动画函数，使页面回到初始位置
            startReboundAnimation();
            // 监听回弹动画结束事件，在动画结束后刷新页面
            body.addEventListener('transitionend', function onTransitionEnd() {
                // 移除事件监听器，避免重复执行
                body.removeEventListener('transitionend', onTransitionEnd);
                // 执行页面刷新
                console.log('Reloading page...');
                location.reload();
            }, { once: true });
            // 重置触摸开始时记录的 Y 坐标为 0
            startY = 0; 
            // 重置拖动状态
            isDragging = false;
            // 重置当前下拉距离
            currentDistance = 0;
        }
    });
})();
