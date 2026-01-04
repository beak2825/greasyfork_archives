// ==UserScript==
// @name         哔哩哔哩 (b 站 / bilibili): 优雅地用横屏看竖屏视频里的横屏 (为视频提供缩放 / 平移功能)
// @namespace    /DBI/bilibili-fxxk-horizontal-video-in-vertical-videos
// @version      0.1.1
// @description  为 b 站视频提供缩放 / 平移功能
// @author       You
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476572/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20%28b%20%E7%AB%99%20%20bilibili%29%3A%20%E4%BC%98%E9%9B%85%E5%9C%B0%E7%94%A8%E6%A8%AA%E5%B1%8F%E7%9C%8B%E7%AB%96%E5%B1%8F%E8%A7%86%E9%A2%91%E9%87%8C%E7%9A%84%E6%A8%AA%E5%B1%8F%20%28%E4%B8%BA%E8%A7%86%E9%A2%91%E6%8F%90%E4%BE%9B%E7%BC%A9%E6%94%BE%20%20%E5%B9%B3%E7%A7%BB%E5%8A%9F%E8%83%BD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/476572/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20%28b%20%E7%AB%99%20%20bilibili%29%3A%20%E4%BC%98%E9%9B%85%E5%9C%B0%E7%94%A8%E6%A8%AA%E5%B1%8F%E7%9C%8B%E7%AB%96%E5%B1%8F%E8%A7%86%E9%A2%91%E9%87%8C%E7%9A%84%E6%A8%AA%E5%B1%8F%20%28%E4%B8%BA%E8%A7%86%E9%A2%91%E6%8F%90%E4%BE%9B%E7%BC%A9%E6%94%BE%20%20%E5%B9%B3%E7%A7%BB%E5%8A%9F%E8%83%BD%29.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 脚本名称
    const SCRIPT_NAME = '[优雅地用横屏看竖屏视频里的横屏]';

    /**
     * 等待直到某些元素被加载出来
     * @param elementPaths string[] 包含元素路径的数组
     * @param callback 元素都加载出来后调用的函数
     * @example
     * waitUntil(['body > #app', 'body > div.some-element'], () => {
     *  // do some things...
     * });
     */
    const waitUntil = (elementPaths, callback) =>{
        console.log(SCRIPT_NAME, '正在等待播放器加载');
        const wait = () => setTimeout(() => {
            let exists = 0;
            elementPaths.forEach((elementPath) => {
                if (document.querySelectorAll(elementPath).length != 0) exists++;
            });
            if (exists != elementPaths.length) return wait();
            console.log(SCRIPT_NAME, '脚本正在初始化');
            callback();
            console.log(SCRIPT_NAME, '脚本初始化结束');
        }, 500);
        wait();
    }
    // bwp-video 元素 (相当于播放器的 video 元素) 的路径
    const videoElementSelector = '#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-video-perch > div > video';
    // 点击播放器的齿轮 (设置) 图标里的 "更多播放设置" 链接后弹出的页面的路径. 脚本的设置页面会在这里
    const configDivElementSelector = '#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-setting > div.bpx-player-ctrl-setting-box > div > div > div > div > div:nth-child(2) > div.bpx-player-ctrl-setting-menu-right';
    // 等待上面两个元素被加载出来
    waitUntil([videoElementSelector, configDivElementSelector], () => {
      // bwp-video 元素
      const videoElement = document.querySelector(videoElementSelector);
      // "更多播放设置" 元素
      const configDivElement = document.querySelector(configDivElementSelector);
      // 缩放倍数 (css: transform: scale(XXX))
      let scale = 1.0;
      // 距顶部距离 (css: top: XXXpx)
      let top = 0;
      // 距左边距离 (css: left: XXXpx)
      let left = 0;
      
      // 创建一个 div, 用于渲染此脚本的设置页面
      const rootDiv = document.createElement('div');
      rootDiv.classList.add('bpx-player-ctrl-setting-scale');
      // 此脚本设置页面的标题
      const titleDiv = document.createElement('div');
      titleDiv.classList.add('bpx-player-ctrl-setting-scale-title');
      titleDiv.style.height = '16px';
      titleDiv.style.lineHeight = '16px';
      titleDiv.style.marginTop = '4px';
      titleDiv.style.marginBottom = '4px';
      titleDiv.innerText = '缩放 ' + SCRIPT_NAME;
      rootDiv.appendChild(titleDiv);
      // 放置各种选项的 div
      const contentDiv = document.createElement('div');
      contentDiv.classList.add('bpx-player-ctrl-setting-scale-content');
      contentDiv.style.marginBottom = '12px';
      contentDiv.style.width = '100%';
      rootDiv.appendChild(contentDiv);

      // 缩放
      // 缩放的各种设置
      const scaleDiv = document.createElement('div');
      scaleDiv.style.marginBottom = '4px';
      // 缩放输入
      const scaleInputLabel = document.createElement('label');
      scaleInputLabel.innerText = '缩放倍数: ';
      const scaleInput = document.createElement('input');
      scaleInput.style.width = '4rem';
      scaleInput.style.backgroundColor = 'transparent';
      scaleInput.style.height = '';
      scaleInput.style.padding = '3px';
      scaleInput.style.border = '1px solid gray';
      scaleInput.style.borderRadius = '2px';
      const changeScale = (newScale) => {
        scale = newScale;
        console.log(SCRIPT_NAME, '已将缩放倍数修改为', newScale);
        videoElement.style.transform =`scale(${scale})`;
        scaleInput.value = scale;
      }
      const addScale = (num) => {
        changeScale(((num * 10 + scale * 10) / 10).toFixed(1) * 1);
      }
      scaleInput.addEventListener('keyup', () => {
        const newScale = scaleInput.value * 1;
        if (isNaN(newScale)) return scaleInput.style.borderColor = 'red';
        scaleInput.style.borderColor = 'gray';
        changeScale(newScale);
      });
      scaleInput.value = scale;
      scaleDiv.appendChild(scaleInputLabel);
      scaleDiv.appendChild(scaleInput);
      // 缩放快捷操作按钮
      const scaleAddButton = document.createElement('button');
      const scaleReduceButton = document.createElement('button');
      const scaleDefaultButton = document.createElement('button');
      scaleAddButton.innerText = '+';
      scaleReduceButton.innerText = ' - ';
      scaleDefaultButton.innerText = '恢复';
      [scaleAddButton, scaleReduceButton, scaleDefaultButton].forEach((button) => {
        button.style.backgroundColor = '#00AEEC';
        button.style.marginLeft = '5px';
        button.style.height = 'calc(14px + 4px * 2)';
        button.style.padding = '0 0.5rem';
        button.style.border = 'none';
        button.style.borderRadius = '2px';
      });
      scaleAddButton.addEventListener('click', () => addScale(0.1));
      scaleReduceButton.addEventListener('click', () => addScale(-0.1));
      scaleDefaultButton.addEventListener('click', () => changeScale(1));
      scaleDiv.appendChild(scaleAddButton);
      scaleDiv.appendChild(scaleReduceButton);
      scaleDiv.appendChild(scaleDefaultButton);
      // 添加关于缩放的各种设置到页面
      contentDiv.appendChild(scaleDiv);

      // 平移
      // 为 videoElement 新增 position 样式, 用于实现平移
      videoElement.style.position = 'absolute';
      // 关于平移的各种设置
      const translateDiv = document.createElement('div');
      // 上下输入
      const topInputLabel = document.createElement('label');
      topInputLabel.innerText = '上下平移 (单位: px): ';
      const topInput = document.createElement('input');
      topInput.style.width = '4rem';
      topInput.style.backgroundColor = 'transparent';
      topInput.style.height = '';
      topInput.style.padding = '3px';
      topInput.style.border = '1px solid gray';
      topInput.style.borderRadius = '2px';
      const changeTop = (newTop) => {
        top = newTop;
        console.log(SCRIPT_NAME, '已将距顶端距离修改为', newTop);
        videoElement.style.top =`${top}px`;
        topInput.value = top;
      }
      topInput.addEventListener('keyup', () => {
        const newTop = topInput.value * 1;
        if (isNaN(newTop)) return topInput.style.borderColor = 'red';
        topInput.style.borderColor = 'gray';
        changeTop(newTop);
      });
      topInput.value = top;
      translateDiv.appendChild(topInputLabel);
      translateDiv.appendChild(topInput);
      // 换行
      translateDiv.appendChild(document.createElement('br'));
      // 左右输入
      const leftInputLabel = document.createElement('label');
      leftInputLabel.innerText = '左右平移 (单位: px): ';
      const leftInput = document.createElement('input');
      leftInput.style.width = '4rem';
      leftInput.style.backgroundColor = 'transparent';
      leftInput.style.height = '';
      leftInput.style.padding = '3px';
      leftInput.style.border = '1px solid gray';
      leftInput.style.borderRadius = '2px';
      const changeLeft = (newLeft) => {
        left = newLeft;
        console.log(SCRIPT_NAME, '已将距左端距离修改为', newLeft);
        videoElement.style.left =`${left}px`;
        leftInput.value = left;
      }
      leftInput.addEventListener('keyup', () => {
        const newLeft = leftInput.value * 1;
        if (isNaN(newLeft)) return leftInput.style.borderColor = 'red';
        leftInput.style.borderColor = 'gray';
        changeLeft(newLeft);
      });
      leftInput.value = left;
      translateDiv.appendChild(leftInputLabel);
      translateDiv.appendChild(leftInput);
      // 将关于平移的设置的 div 添加到页面
      contentDiv.appendChild(translateDiv);
      // 将此脚本的设置页面添加到 "更多播放设置" 里
      configDivElement.appendChild(rootDiv);
    });
})();