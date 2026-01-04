// ==UserScript==
// @name         fucking OO everywhere！
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  OO Style Mouse Click Effects
// @author       Raurant
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483211/fucking%20OO%20everywhere%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/483211/fucking%20OO%20everywhere%EF%BC%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let cssLoaded = false;
    const linkElement = document.createElement('link');
    linkElement.setAttribute('rel', 'stylesheet');
    linkElement.setAttribute('href', 'https://fonts.googleapis.com/icon?family=Material+Icons');
    document.head.appendChild(linkElement);
    linkElement.onerror = function () {
        cssLoaded = false;
    };
    linkElement.onload = function () {
        cssLoaded = true;
    };

const iconContainer = document.createElement('div');
iconContainer.setAttribute('id', 'iconContainer');
document.body.appendChild(iconContainer);

    document.addEventListener('click', function (event) {
      if (!cssLoaded) {
            console.error('CSS not loaded. Aborting click event.');
            return; // Exit the click event if CSS has not loaded
      }
      const iconContainer = document.getElementById('iconContainer');

      // 获取鼠标点击位置
      const posX = event.clientX + window.scrollX;
      const posY = event.clientY + window.scrollY;

      // 创建包含图标的元素
      const icon = document.createElement('i');
      icon.setAttribute('aria-hidden', 'true');
      icon.classList.add('v-icon', 'notranslate', 'material-icons', 'theme--light', 'primary--text');
      icon.style.fontSize = `${getRandomSize()}px`;
      icon.textContent = 'face';
      icon.style.color = '#41289a';

      // 设置初始图标元素的位置
      icon.style.position = 'absolute';
      icon.style.left = posX + 'px';
      icon.style.top = posY + 'px';

      // 将图标元素添加到容器中
      iconContainer.appendChild(icon);

      // 设置图标上升和左右移动效果
      const duration = 1500; // 动画持续时间（毫秒）
      const startTime = Date.now();

      const moveIcon = setInterval(function () {
        const currentTime = Date.now();
        const timeDifference = currentTime - startTime;

        if (timeDifference < duration) {
          // 计算图标的上升速度
          const speed = 1 - timeDifference / duration;
          const yPos = posY - (timeDifference / duration) * 130; // 加快上升速度，200 可根据需求调整

          // 计算图标的左右移动
          const xPos = posX + Math.sin(timeDifference / 80) * 1.5; // 缩小左右移动的范围，10 可根据需求调整

          // 设置图标位置
          icon.style.top = yPos + 'px';
          icon.style.left = xPos + 'px';
          icon.style.zIndex = '9999'; // 保证图标在顶层

          // 淡出效果
          if (timeDifference > 1000) { // 在1秒后开始淡出
            let opacity = 1 - (timeDifference - 1000) / 500; // 在0.5秒内淡出
            icon.style.opacity = opacity < 0 ? 0 : opacity; // 确保不小于0
          }
        } else {
          clearInterval(moveIcon);
          iconContainer.removeChild(icon); // 移除图标元素
        }
      }, 50); // 每50毫秒执行一次移动计算

      function getRandomSize() {
        // 生成30到40之间的随机整数
        return Math.floor(Math.random() * (40 - 30 + 1)) + 30;
      }

    });

})();