// ==UserScript==
// @name         美化Furwall
// @namespace    com.qwq.awa
// @version      1.0
// @description  为绒毛墙添加背景图片
// @author       QwQ
// @match        https://www.furwall.cn/*
// @grant        GM_addStyle
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/486976/%E7%BE%8E%E5%8C%96Furwall.user.js
// @updateURL https://update.greasyfork.org/scripts/486976/%E7%BE%8E%E5%8C%96Furwall.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // 创建菜单
    var menu = document.createElement('div');
    menu.id = 'custom-background-menu';
    menu.style.position = 'fixed';
    menu.style.top = '20px';
    menu.style.right = '20px';
    menu.style.background = 'rgba(255, 255, 255, 0.9)';
    menu.style.border = '1px solid #ccc';
    menu.style.borderRadius = '5px';
    menu.style.padding = '10px';
    menu.style.zIndex = '9999';
    menu.style.display = 'none'; // 默认隐藏

    menu.innerHTML = `
        <h3 style="margin-bottom: 10px; font-size: 16px;">自定义背景菜单</h3>
        <div style="margin-bottom: 10px;">
            <label for="background-image" style="display: block; font-size: 14px;">背景图片链接：</label>
            <input type="text" id="background-image" style="width: calc(100% - 20px); margin-top: 5px; padding: 5px; border: 1px solid #ccc; border-radius: 3px;">
        </div>
        <div style="margin-bottom: 10px;">
            <button id="apply-background" style="padding: 5px 10px; background-color: #007bff; color: #fff; border: none; cursor: pointer;">应用</button>
        </div>
        <div style="margin-bottom: 10px;">
            <label for="opacity-range" style="display: block; font-size: 14px;">透明度：</label>
            <input type="range" id="opacity-range" min="0" max="1" step="0.1" value="0.9" style="width: calc(100% - 20px); margin-top: 5px;">
            <span id="opacity-value" style="display: block; font-size: 12px; margin-top: 5px;">透明度： 0.9</span>
        </div>
    `;

    // 将菜单添加到页面
    document.body.appendChild(menu);

    // 恢复保存的背景图片链接和透明度
    var savedBackgroundImage = localStorage.getItem('custom-background-image');
    var savedOpacity = localStorage.getItem('custom-opacity');
    if (savedBackgroundImage) {
        document.body.style.backgroundImage = 'url(' + savedBackgroundImage + ')';
    }
    if (savedOpacity) {
        document.body.style.opacity = savedOpacity;
        document.getElementById('opacity-range').value = savedOpacity;
        document.getElementById('opacity-value').textContent = '透明度： ' + savedOpacity;
    }

    // 应用背景图片
    document.getElementById('apply-background').addEventListener('click', function () {
        var backgroundImageUrl = document.getElementById('background-image').value;
        document.body.style.backgroundImage = 'url(' + backgroundImageUrl + ')';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundRepeat = 'no-repeat'; // 确保背景图片不重复
        document.body.style.backgroundPosition = 'center'; // 确保背景图片居中显示

        // 保存背景图片链接到 localStorage
        localStorage.setItem('custom-background-image', backgroundImageUrl);
    });

    // 调节透明度
    var opacityRange = document.getElementById('opacity-range');
    var opacityValue = document.getElementById('opacity-value');
    opacityRange.addEventListener('input', function () {
        var opacity = opacityRange.value;
        opacityValue.textContent = '透明度： ' + opacity;
        document.body.style.opacity = opacity;

        // 保存透明度到 localStorage
        localStorage.setItem('custom-opacity', opacity);
    });

    // 按下 Alt+I 显示/隐藏菜单
    document.addEventListener('keydown', function (event) {
        if (event.altKey && event.key === 'i') {
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        }
    });

    // 获取网页页面的大小并设置背景图片大小
    function setBackgroundImageSize() {
        var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        document.body.style.backgroundSize = width + 'px ' + height + 'px';
    }

    // 初始化背景图片大小
    setBackgroundImageSize();

    // 监听窗口大小变化事件，使背景图片自适应当前页面
    window.addEventListener('resize', setBackgroundImageSize);
})();
