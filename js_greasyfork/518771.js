// ==UserScript==
// @name         仿安卓拉伸回弹 + 页面抗锯齿
// @namespace    hqt
// @version      1.0
// @description  仿安卓拉伸回弹
// @author       hqt
// @match        *://*/*
// @grant        none
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/518771/%E4%BB%BF%E5%AE%89%E5%8D%93%E6%8B%89%E4%BC%B8%E5%9B%9E%E5%BC%B9%20%2B%20%E9%A1%B5%E9%9D%A2%E6%8A%97%E9%94%AF%E9%BD%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/518771/%E4%BB%BF%E5%AE%89%E5%8D%93%E6%8B%89%E4%BC%B8%E5%9B%9E%E5%BC%B9%20%2B%20%E9%A1%B5%E9%9D%A2%E6%8A%97%E9%94%AF%E9%BD%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //配置
    const zoomRateMax = 0.2;//最大拉伸大小
    const zoomSpeed = 10;//减小以加大拉伸速度

    {// 抗锯齿样式
        const userAgent = navigator.userAgent.toLowerCase();
        const isFirefox = userAgent.includes('firefox');
        const isChrome = userAgent.includes('chrome') && !userAgent.includes('edg');
        const isSafari = userAgent.includes('safari') && !userAgent.includes('chrome');
        
        const style = document.createElement('style');
        style.textContent = `
        * { text-rendering: optimizeLegibility; shape-rendering: geometricPrecision; image-rendering: auto; }
        svg { shape-rendering: geometricPrecision; }
        ${isFirefox ? '* { -moz-osx-font-smoothing: grayscale; font-smooth: always; } img { image-rendering: -moz-crisp-edges; }' : ''}
        ${(isChrome || userAgent.includes('edg')) ? '* { -webkit-font-smoothing: antialiased; }' : ''}
        ${isSafari ? '* { -webkit-font-smoothing: antialiased; }' : ''}
        `;
        document.head.appendChild(style);
    }

    let zoomRate = 0;
    let transformOrigin = 'top';

    //执行拉伸
    function zoom(zoomRate){
        //确定对齐方式
        transformOrigin = (scrollPositionCheck() > 0 ? 'top':
                           scrollPositionCheck() < 0 ? 'bottom':
                           transformOrigin);

        const target = document.documentElement || document.body;
        target.style.transformOrigin = `${transformOrigin} center`;//对齐
        target.style.transform = `scaleY(${zoomRate + 1})`;
        target.style.transition = 'transform 0.1s ease-out';//动画过渡
    }

    //计算页面位置（是否到边缘）
    function scrollPositionCheck() {
        const scrollTop = window.scrollY; // 当前滚动位置
        const scrollHeight = document.documentElement.scrollHeight; // 页面总高度
        const clientHeight = document.documentElement.clientHeight; // 可视区域高度
        
        let scrollPosition = (scrollTop < 1 ? 1:
                              scrollTop + clientHeight > scrollHeight - 1 ? -1:
                              0);
        
        //排除过短页面
        scrollPosition = scrollHeight / clientHeight > 1 + zoomRateMax ? scrollPosition : 0;

        return scrollPosition;
    }

    //获取鼠标滚动方向
    function scrollDirectionCheck() {
        const scrollSpeed = event.deltaY;
        const scrollDirection = (scrollSpeed > 0 ? -1:
                                 scrollSpeed < 0 ? 1:
                                 0);
        
        return scrollDirection;
    }

    //计算拉伸倍率
    function zoomCompute(scrollPosition , scrollDirection){
        //只在到达边缘且鼠标朝相应方向滚动时增加拉伸
        const ifzoom = (scrollPosition * scrollDirection > 0 ? true:
                        false);
        
        if (ifzoom){
            //增加拉伸
            zoomRate += (zoomRateMax - zoomRate) / (zoomSpeed * 5);
        }else {
            //减少拉伸
            zoomRate -= zoomRate / zoomSpeed;
        }

        return zoomRate;
    }

    //在鼠标滚动时执行拉伸
    window.addEventListener('wheel', (event) => {
        zoom(zoomCompute(scrollPositionCheck() , scrollDirectionCheck()));
    });
})();
