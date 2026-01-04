// ==UserScript==
// @name         边缘下拉刷新
// @version      1.9
// @description  在屏幕左右边缘下拉时刷新网页
// @author       angao
// @run-at       document-end
// @license       MIT
// @match        *://*/*
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/471516/%E8%BE%B9%E7%BC%98%E4%B8%8B%E6%8B%89%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/471516/%E8%BE%B9%E7%BC%98%E4%B8%8B%E6%8B%89%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function EdgeSlideRefresh() {
    'use strict';

    // 设置刷新图标大小和初始位置
    const setRefreshIconSizeAndPosition = () => {
        const icon = document.querySelector('.Refresh_Icon');
        if (!icon) return;
        
        if (window.innerWidth < window.innerHeight) {
            // 竖屏模式：图标宽度为屏幕宽度的1/11，top为负的图标高度
            const iconSize = `calc(100vw / 11)`;
            icon.style.width = iconSize;
            icon.style.height = iconSize;
            icon.style.top = `calc(-100vw / 11)`; // 刚好隐藏图标
        } else {
            // 横屏模式：图标宽度为屏幕高度的1/7，top为负的图标高度
            const iconSize = `calc(100vh / 7)`;
            icon.style.width = iconSize;
            icon.style.height = iconSize;
            icon.style.top = `calc(-100vh / 7)`; // 刚好隐藏图标
        }
    }

    // 设置滑动刷新的距离阈值（根据屏幕方向调整）
    const getSlideRefreshDistance = () => {
        return window.innerHeight * (window.innerWidth < window.innerHeight ? 1 / 4 : 1 / 3);
    }
    
    let startY = null; // 触摸起始Y坐标
    let endY = null;   // 触摸结束Y坐标

    // 创建样式
    var style = document.createElement('style');
    style.innerHTML = `.Refresh_Icon { 
        border-radius: 50%; 
        position: fixed; 
        left: 50%; 
        transform: translate(-50%, 0) translateZ(0); 
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); 
        align-items: center; 
        justify-content: center; 
        z-index: 99999999; 
        background-color: white; 
        transition: transform 0.05s ease-out; 
    } 
    .Refresh_Icon svg { 
        margin: 0; 
    }`;
    document.head.appendChild(style);

    // 创建刷新图标元素
    const Icon = document.createElement('div');
    Icon.className = 'Refresh_Icon';
    // 使用SVG作为刷新图标
    Icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
    </svg>`;

    Icon.style.display = 'none'; // 初始隐藏
    document.body.appendChild(Icon);

    // 初始化图标大小和位置
    setRefreshIconSizeAndPosition();

    // 更新SVG大小
    const updateSvgSize = () => {
        const svg = Icon.querySelector('svg');
        if (window.innerWidth < window.innerHeight) {
            svg.style.width = `calc(70% * 100vw / 11)`;
            svg.style.height = `calc(70% * 100vw / 11)`;
        } else {
            svg.style.width = `calc(70% * 100vh / 7)`;
            svg.style.height = `calc(70% * 100vh / 7)`;
        }
    };
    updateSvgSize();

    // 窗口大小改变时重新设置图标大小和位置
    window.addEventListener('resize', () => {
        setRefreshIconSizeAndPosition();
        updateSvgSize();
    });

    // 触摸开始事件监听
    document.addEventListener('touchstart', function(e) {
        // 检测是否在左右边缘（屏幕宽度的1/18区域内）
        if (e.touches[0].clientX < window.innerWidth / 18 || e.touches[0].clientX > window.innerWidth * 17 / 18) {
            startY = e.touches[0].clientY; // 记录起始Y坐标
            Icon.style.display = 'flex'; // 显示刷新图标
        }
    });

    // 触摸移动事件监听
    document.addEventListener('touchmove', function(e) {
        if (startY !== null && (e.touches[0].clientX < window.innerWidth / 18 || e.touches[0].clientX > window.innerWidth * 17 / 18)) {
            e.preventDefault(); // 阻止默认滚动行为
            
            const Sliderefreshdistance = getSlideRefreshDistance();
            let distance = e.touches[0].clientY - startY; // 计算滑动距离
            let slowDownStart = Sliderefreshdistance * 0.6; // 减速起始点
            let slowDownRate = 0.2; // 减速比例
            
            // 根据滑动距离改变图标颜色
            if (distance < Sliderefreshdistance) {
                Icon.querySelector('svg').style.fill = 'black'; // 未达到刷新阈值
            } else {
                Icon.querySelector('svg').style.fill = 'darkred'; // 达到刷新阈值
            }
            
            // 超过减速点后降低移动速度
            if (distance > slowDownStart) {
                distance = slowDownStart + (distance - slowDownStart) * slowDownRate;
            }
            
            // 限制最大移动距离
            distance = Math.min(distance, Sliderefreshdistance * 0.85);
            
            // 更新图标位置和旋转角度
            Icon.style.transform = `translate(-50%, ${distance / 1.35}px) rotate(${distance * 2}deg)`;
        }
    }, { passive: false });

    // 触摸结束事件监听
    document.addEventListener('touchend', function(e) {
        if (startY !== null && (e.changedTouches[0].clientX < window.innerWidth / 18 || e.changedTouches[0].clientX > window.innerWidth * 17 / 18)) {
            endY = e.changedTouches[0].clientY; // 记录结束Y坐标
            const Sliderefreshdistance = getSlideRefreshDistance();
            
            // 如果滑动距离超过阈值，执行刷新
            if (endY - startY > Sliderefreshdistance) {
                setTimeout(function() {
                    location.reload(); // 刷新页面
                }, 250);
            }
            
            // 获取图标实际高度用于回弹位置
            let iconHeight;
            if (window.innerWidth < window.innerHeight) {
                iconHeight = window.innerWidth / 11;
            } else {
                iconHeight = window.innerHeight / 7;
            }
            
            // 图标回弹动画，回到刚好隐藏的位置
            Icon.style.transition = 'all 0.5s';
            Icon.style.transform = `translate(-50%, -${iconHeight}px)`;
            
            // 动画完成后隐藏图标
            setTimeout(() => {
                Icon.style.transition = '';
                Icon.style.display = 'none';
            }, 500);
            
            // 重置坐标变量
            startY = null;
            endY = null;
        }
    });
})();