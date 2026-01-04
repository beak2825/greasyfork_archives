// ==UserScript==
// @name        Seer Helper
// @namespace   www.61.com
// @version     1.2.2
// @description 赛尔号启航助手，只为重新启航，寻找我们最初的回忆与感动……
// @author      songbaicheng
// @match       https://s.61.com/*
// @icon        https://gitee.com/songbaicheng/tampermonkey-script/raw/master/www.61.com/seer/seerHelper-logo.jpg
// @grant       none
// @run-at      document-end
// @homepageURL https://gitee.com/songbaicheng/tampermonkey-script
// @supportURL  https://gitee.com/songbaicheng/tampermonkey-script/issues
// @require     https://update.greasyfork.org/scripts/491235/1351491/Seer%20Timer%20Helper.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/484976/Seer%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/484976/Seer%20Helper.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // Your code here...
    console.log('Seer Helper started...');
    // 全局常量
    /**
     * 面板打开宽度
     */
    var PANEL_WIDTH = '100px';
    /**
     * 面板关闭宽度
     */
    var PANEL_SHRINK_WIDTH = '50px';
    // 全局变量
    /**
     *  是否是面板缩小状态
     */
    var isPanelShrink = false;
    // 1 创建样式
    // 1.1 创建面板 div 容器
    var containerDiv = document.createElement("div");
    containerDiv.style.position = "fixed";
    containerDiv.style.zIndex = '999990';
    // 1.2 创建面板样式
    var panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.top = '18%';
    panel.style.left = '9%';
    panel.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; // 半透明背景色
    panel.style.padding = '0px';
    panel.style.borderRadius = '10px'; // 圆角
    panel.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)'; // 阴影效果
    panel.style.transition = 'all 0.3s';
    panel.style.width = PANEL_SHRINK_WIDTH; // 初始宽度
    panel.style.overflow = 'hidden';
    // 1.3 创建面板切换按钮
    var togglePanelButton = document.createElement('button');
    togglePanelButton.innerHTML = '展开';
    togglePanelButton.style.width = '100%';
    togglePanelButton.style.padding = '8px';
    togglePanelButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // 半透明背景色
    togglePanelButton.style.color = '#fff';
    togglePanelButton.style.cursor = 'pointer';
    togglePanelButton.style.border = 'none';
    togglePanelButton.style.borderRadius = '5px'; // 圆角
    togglePanelButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)'; // 阴影效果
    // 1.4 创建全屏按钮
    var fullscreenButton = document.createElement('button');
    fullscreenButton.innerHTML = '全屏';
    fullscreenButton.style.width = '100%';
    fullscreenButton.style.padding = '8px';
    fullscreenButton.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'; // 半透明背景色
    fullscreenButton.style.color = '#fff';
    fullscreenButton.style.cursor = 'pointer';
    fullscreenButton.style.border = 'none';
    fullscreenButton.style.borderRadius = '5px'; // 圆角
    fullscreenButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)'; // 阴影效果
    fullscreenButton.style.display = 'none';
    // 2 按钮事件
    // 2.1 全局事件
    // 2.1.1 提示文本方法
    function showText(txtMsg) {
        var _a;
        try {
            ((_a = document.querySelector("iframe")) === null || _a === void 0 ? void 0 : _a.contentWindow).MFC.bubbleAlert.showAlert(txtMsg);
        }
        catch (e) {
            window.MFC.bubbleAlert.showAlert(txtMsg);
        }
    }
    // 2.2 面板切换事件
    // 2.2.1 切换面板展开/收缩状态
    function togglePanelSize() {
        if (isPanelShrink) {
            // 收缩面板
            panel.style.width = PANEL_SHRINK_WIDTH;
            togglePanelButton.innerHTML = '展开';
            // 隐藏全屏按钮
            fullscreenButton.style.display = 'none';
            isPanelShrink = false;
            showText("面板已缩放");
        }
        else {
            // 展开面板
            panel.style.width = PANEL_WIDTH;
            togglePanelButton.innerHTML = '收缩';
            // 显示全屏按钮
            fullscreenButton.style.display = 'block';
            isPanelShrink = true;
            showText("面板已展开");
        }
    }
    // 2.3 网页全屏事件
    // 2.3.1 切换全屏状态
    function toggleFullscreen() {
        if (document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement) {
            exitFullscreen();
            fullscreenButton.innerHTML = '全屏'; // 全屏状态下修改按钮文本为 "全屏"
            showText("全屏已退出");
        }
        else {
            enterFullscreen();
            fullscreenButton.innerHTML = '退出全屏'; // 非全屏状态下修改按钮文本为 "收缩"
            showText("全屏已进入");
        }
    }
    // 2.3.2 进入全屏模式
    function enterFullscreen() {
        var documentElement = document.documentElement;
        if (documentElement.requestFullscreen) {
            documentElement.requestFullscreen();
        }
        else if (documentElement.webkitRequestFullscreen) {
            documentElement.webkitRequestFullscreen();
        }
        else if (documentElement.mozRequestFullScreen) {
            documentElement.mozRequestFullScreen();
        }
        else if (documentElement.msRequestFullscreen) {
            documentElement.msRequestFullscreen();
        }
        console.log('进入全屏模式');
    }
    // 2.3.3 退出全屏模式
    function exitFullscreen() {
        var documentElement = document;
        if (documentElement.exitFullscreen) {
            documentElement.exitFullscreen();
        }
        else if (documentElement.webkitExitFullscreen) {
            documentElement.webkitExitFullscreen();
        }
        else if (documentElement.mozCancelFullScreen) {
            documentElement.mozCancelFullScreen();
        }
        else if (documentElement.msExitFullscreen) {
            documentElement.msExitFullscreen();
        }
        console.log('退出全屏模式');
    }
    // 3 最终组织面板
    // 3.1 为按钮依次添加添加点击事件
    // 3.1.1 添加面板大小切换按钮点击事件
    togglePanelButton.addEventListener('click', togglePanelSize);
    panel.appendChild(togglePanelButton);
    // 3.1.2 添加退出全屏按钮点击事件
    fullscreenButton.addEventListener('click', toggleFullscreen);
    panel.appendChild(fullscreenButton);
    // 3.2 将面板添加到页面中
    containerDiv.appendChild(panel);
    var frontPage = document.getElementsByTagName("html")[0];
    frontPage.appendChild(containerDiv);
})();
