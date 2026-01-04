// ==UserScript==
// @name         网页像素小蜘蛛
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在网页顶部添加一个像素小蜘蛛，点击会上下移动
// @author       Doubao
// @match        *://*/*
// @grant        GM_addStyle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/539516/%E7%BD%91%E9%A1%B5%E5%83%8F%E7%B4%A0%E5%B0%8F%E8%9C%98%E8%9B%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/539516/%E7%BD%91%E9%A1%B5%E5%83%8F%E7%B4%A0%E5%B0%8F%E8%9C%98%E8%9B%9B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 添加样式
    GM_addStyle(`
        #pixel-spider-container {
            position: fixed;
            top: 20px;
            right: 50px;
            z-index: 9999999999;
            width: 40px;
            height: 40px;
        }
        
        #spider-thread {
            position: absolute;
            top: 0;
            left: 20px;
            width: 1px;
            height: 0;
            background-color: #666;
            z-index: -1;
        }
        
        #pixel-spider {
            position: absolute;
            top: 0;
            left: 0;
            width: 40px;
            height: 40px;
            background-color: #333;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 0 2px #000;
        }
        
        #pixel-spider:before, #pixel-spider:after {
            content: '';
            position: absolute;
            width: 20px;
            height: 2px;
            background-color: #000;
        }
        
        #pixel-spider:before {
            top: 10px;
            left: 20px;
        }
        
        #pixel-spider:after {
            top: 30px;
            left: 20px;
        }
        
        #pixel-spider leg {
            position: absolute;
            width: 12px;
            height: 2px;
            background-color: #000;
        }
        
        #pixel-spider leg:nth-child(1) {
            top: 15px;
            left: 20px;
            transform: rotate(30deg);
        }
        
        #pixel-spider leg:nth-child(2) {
            top: 18px;
            left: 20px;
            transform: rotate(60deg);
        }
        
        #pixel-spider leg:nth-child(3) {
            top: 22px;
            left: 20px;
            transform: rotate(120deg);
        }
        
        #pixel-spider leg:nth-child(4) {
            top: 25px;
            left: 20px;
            transform: rotate(150deg);
        }
        
        #pixel-spider leg:nth-child(5) {
            top: 15px;
            left: 20px;
            transform: rotate(-30deg);
        }
        
        #pixel-spider leg:nth-child(6) {
            top: 18px;
            left: 20px;
            transform: rotate(-60deg);
        }
        
        #pixel-spider leg:nth-child(7) {
            top: 22px;
            left: 20px;
            transform: rotate(-120deg);
        }
        
        #pixel-spider leg:nth-child(8) {
            top: 25px;
            left: 20px;
            transform: rotate(-150deg);
        }
        
        .spider-dropping {
            animation: drop 0.5s ease-out;
        }
        
        .spider-climbing {
            animation: climb 1s ease-in;
        }
        
        @keyframes drop {
            from { top: 0; }
            to { top: 200px; }
        }
        
        @keyframes climb {
            from { top: 200px; }
            to { top: 0; }
        }
    `);
    
    // 创建蜘蛛容器
    const container = document.createElement('div');
    container.id = 'pixel-spider-container';
    
    // 创建蜘蛛丝线
    const thread = document.createElement('div');
    thread.id = 'spider-thread';
    container.appendChild(thread);
    
    // 创建像素蜘蛛
    const spider = document.createElement('div');
    spider.id = 'pixel-spider';
    
    // 添加蜘蛛腿
    for (let i = 0; i < 8; i++) {
        const leg = document.createElement('leg');
        spider.appendChild(leg);
    }
    
    container.appendChild(spider);
    document.body.appendChild(container);
    
    // 初始化丝线高度
    updateThreadHeight();
    
    // 窗口大小改变时更新丝线高度
    window.addEventListener('resize', updateThreadHeight);
    
    function updateThreadHeight() {
        thread.style.height = spider.offsetTop + 'px';
    }
    
    // 点击蜘蛛时的动画
    spider.addEventListener('click', function() {
        // 添加下降动画
        spider.classList.add('spider-dropping');
        
        // 下降完成后添加上升动画
        setTimeout(function() {
            spider.classList.remove('spider-dropping');
            spider.classList.add('spider-climbing');
            
            // 上升完成后移除动画类
            setTimeout(function() {
                spider.classList.remove('spider-climbing');
            }, 1000);
        }, 500);
    });
})();