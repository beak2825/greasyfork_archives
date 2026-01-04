// ==UserScript==
// @name         页面小鸭子随机移动
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在网页上生成一只小鸭子，它会在页面上随机走动
// @author       豆包
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539471/%E9%A1%B5%E9%9D%A2%E5%B0%8F%E9%B8%AD%E5%AD%90%E9%9A%8F%E6%9C%BA%E7%A7%BB%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/539471/%E9%A1%B5%E9%9D%A2%E5%B0%8F%E9%B8%AD%E5%AD%90%E9%9A%8F%E6%9C%BA%E7%A7%BB%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 小鸭子配置
    const duckConfig = {
        width: 80,             // 宽度
        height: 80,            // 高度
        moveInterval: 1000,    // 移动间隔(毫秒)
        maxSpeed: 10,          // 最大移动速度
        imageUrl: 'https://p3 - flow - imagex - sign.byteimg.com/ocean - cloud - tos/90477bf9be164dc48262e5cf9e2b19ce.jpeg~tplv - a9rns2rl98 - image_dld_watermark_1_5.png?rk3s=49177a0b&x - expires=2065329457&x - signature=Y0GhemuwQB8lyT6bhWBe8zZMgxA%3D'  // 小鸭子图片地址（示例图，可替换为自定义图片）
    };
    
    // 创建小鸭子元素
    function createDuck() {
        const duck = document.createElement('div');
        duck.id = 'random-duck';
        duck.style.position = 'fixed';
        duck.style.width = `${duckConfig.width}px`;
        duck.style.height = `${duckConfig.height}px`;
        duck.style.zIndex = '9999';
        duck.style.backgroundImage = `url('${duckConfig.imageUrl}')`;
        duck.style.backgroundSize = '100% 100%';
        duck.style.backgroundRepeat = 'no-repeat';
        duck.style.left = '50px';
        duck.style.top = '50px';
        duck.style.cursor = 'pointer';
        
        document.body.appendChild(duck);
        return duck;
    }
    
    // 让小鸭子随机移动
    function moveDuck(duck) {
        setInterval(() => {
            // 获取页面可用尺寸
            const pageWidth = document.body.clientWidth - duckConfig.width;
            const pageHeight = document.body.clientHeight - duckConfig.height;
            
            // 生成随机移动距离
            const moveX = Math.floor(Math.random() * duckConfig.maxSpeed * 2) - duckConfig.maxSpeed;
            const moveY = Math.floor(Math.random() * duckConfig.maxSpeed * 2) - duckConfig.maxSpeed;
            
            // 计算新位置
            let newLeft = parseInt(duck.style.left) + moveX;
            let newTop = parseInt(duck.style.top) + moveY;
            
            // 确保不超出页面范围
            newLeft = Math.max(0, Math.min(newLeft, pageWidth));
            newTop = Math.max(0, Math.min(newTop, pageHeight));
            
            // 移动小鸭子
            duck.style.transition = 'left 0.3s, top 0.3s';
            duck.style.left = `${newLeft}px`;
            duck.style.top = `${newTop}px`;
        }, duckConfig.moveInterval);
        
        // 点击小鸭子让它快速移动
        duck.addEventListener('click', () => {
            duck.style.transition = 'left 0.1s, top 0.1s';
            const newLeft = Math.floor(Math.random() * pageWidth);
            const newTop = Math.floor(Math.random() * pageHeight);
            duck.style.left = `${newLeft}px`;
            duck.style.top = `${newTop}px`;
        });
    }
    
    // 页面加载完成后创建小鸭子
    document.addEventListener('DOMContentLoaded', () => {
        const duck = createDuck();
        moveDuck(duck);
    });
})();