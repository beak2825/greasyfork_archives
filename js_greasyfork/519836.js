// ==UserScript==
// @name         点击屏幕生成爱心特效
// @namespace    http://tampermonkey.net/
// @version      3.69
// @description  点击屏幕时显示爱心特效
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519836/%E7%82%B9%E5%87%BB%E5%B1%8F%E5%B9%95%E7%94%9F%E6%88%90%E7%88%B1%E5%BF%83%E7%89%B9%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/519836/%E7%82%B9%E5%87%BB%E5%B1%8F%E5%B9%95%E7%94%9F%E6%88%90%E7%88%B1%E5%BF%83%E7%89%B9%E6%95%88.meta.js
// ==/UserScript==

(function () {
    'use strict';
 // 在腾讯文档中禁用脚本
    if (window.location.hostname === 'docs.qq.com') {
        return;  // 如果在腾讯文档网站上，脚本直接停止执行
    }
    // 添加爱心动画的样式
    GM_addStyle(`
      .heart {
        position: absolute;
        width: 20px;
        height: 20px;
        background-color: #FF7F7F;
        transform: rotate(45deg);
        animation: heartbeat 1s ease-out forwards;
        z-index: 999;
      }

      .heart::before,
      .heart::after {
        content: "";
        position: absolute;
        width: 20px;
        height: 20px;
        background-color: #FF7F7F;
        border-radius: 50%;
      }

      .heart::before {
        top: -10px;
        left: 0px;
      }

      .heart::after {
        top: 0px;
        left: -10px;
      }

      @keyframes heartbeat {
        0% {
          transform: scale(0) rotate(45deg);
          opacity: 1;
        }
        50% {
          transform: scale(1.1) rotate(45deg);
          opacity: 0.8;
        }
        100% {
          transform: scale(1) rotate(45deg);
          opacity: 0;
        }
      }
    `);

    // 确保页面完全加载
    window.addEventListener('load', function () {
        console.log('页面已加载');

        // 监听鼠标点击事件
        document.addEventListener('click', function (event) {
             // 如果点击的目标是爱心元素，则不处理
             if (event.target.classList.contains('heart')) {
                  return;
             }
            // 使用 pageX 和 pageY 获取页面坐标
            const x = event.pageX;
            const y = event.pageY;

            // 创建爱心元素
            const heart = document.createElement('div');
            heart.classList.add('heart');

            // 设置爱心的位置为点击位置
            heart.style.left = `${x - 10}px`; // 调整位置使爱心的中心对准点击点
            heart.style.top = `${y - 10}px`;

            // 将爱心元素添加到页面中
            document.body.appendChild(heart);

            // 设置定时器，0.8秒后删除爱心元素
            setTimeout(() => {
                heart.remove();
            }, 800);
        });
    });
})();
