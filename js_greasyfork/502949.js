// ==UserScript==

// @name         Eye Protection Overlay Controller

// @name:zh-CN  夜间网页遮罩保护

// @namespace    http://tampermonkey.net/

// @version      1.2

// @description  Add a floating button to control the overlay opacity

// @description:zh-cn 夜间模式网页遮罩

// @author       ation_ciger

// @match        *://*/*

// @grant        none

// @run-at       document-end



// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/502949/Eye%20Protection%20Overlay%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/502949/Eye%20Protection%20Overlay%20Controller.meta.js
// ==/UserScript==

(function() {

    'use strict';
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // 如果是深色主题，显示遮罩
        // 创建遮罩层

        var overlay = createOverlay();

        // 创建悬浮球

        var controlButton = createControlButton(overlay);

        // 创建滑块容器

        var sliderContainer = createSliderContainer(overlay);

        var savedOpacity = localStorage.getItem('overlayOpacity');

        if (savedOpacity) {
            overlay.style.backgroundColor = 'rgba(0, 0, 0,' + savedOpacity + ')';
        } else {
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // 初始透明度
        }

    }


    // 将元素添加到页面

    document.body.appendChild(overlay);

    document.body.appendChild(controlButton);

    document.body.appendChild(sliderContainer);



    // 控制按钮点击事件

    controlButton.addEventListener('click', function() {

        sliderContainer.style.display = sliderContainer.style.display === 'block' ? 'none' : 'block';

    });

    // 滑块值改变事件

    var slider = sliderContainer.querySelector('input[type="range"]');

    slider.value = savedOpacity ? parseFloat(savedOpacity) : 0.5;

    slider.addEventListener('input', function() {

        overlay.style.backgroundColor = 'rgba(0, 0, 0, ' + slider.value + ')';

        localStorage.setItem('overlayOpacity', slider.value);

    });

    // 辅助函数：创建遮罩层

    function createOverlay() {

        var div = document.createElement('div');

        div.id = 'eye-protection-overlay';

        div.style.position = 'fixed';

        div.style.top = '0';

        div.style.left = '0';

        div.style.width = '100%';

        div.style.height = '100%';

        div.style.zIndex = '9999';

        div.style.display = 'block';

        div.style.pointerEvents = 'none';

        return div;

    }

    // 辅助函数：创建控制按钮

    function createControlButton(overlay) {

        var button = document.createElement('button');

        button.innerHTML = '灰度';

        button.style.position = 'fixed';

        button.style.bottom = '20px';

        button.style.right = '20px';

        button.style.zIndex = '10000';

        button.style.padding = '7px';

        button.style.borderRadius = '100px';

        button.style.backgroundColor = 'gray';

        // 可以添加更多样式

        return button;

    }

    // 辅助函数：创建滑块容器

    function createSliderContainer(overlay) {

        var container = document.createElement('div');

        container.id = 'opacity-slider-container';

        container.style.position = 'fixed';

        container.style.bottom = '60px';

        container.style.right = '20px';

        container.style.zIndex = '10000';

        container.style.padding = '1px';

        container.style.backgroundColor = 'gray';

        container.style.borderRadius = '10px';

        container.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';

        container.style.display = 'none'; // 默认隐藏

        container.innerHTML = `

            <div style="padding: 10px; background: gray; border-radius: 5px;">

                <label for="opacity-slider">Overlay Opacity:</label>

                <input type="range" id="opacity-slider" min="0" max="1" step="0.01">

            </div>
            <style>#opacity-slider-container{user-select:none;}#opacity-slider{-webkit-appearance:none;width:200px;height:10px;background:#d3d3d3;outline:none;opacity:0.7;transition:opacity .2s;}#opacity-slider:hover{opacity:1;}#opacity-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:20px;height:20px;background:#4caf50;cursor:pointer;border-radius:50%;}</style>
        `;

        return container;

    }


})();
