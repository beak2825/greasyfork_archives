// ==UserScript==
// @name         Web视觉效果快速切换
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Toggle and configure visual effects on websites, with saved settings 灰度 反转颜色 亮度 对比度 棕褐色复古 模糊
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512315/Web%E8%A7%86%E8%A7%89%E6%95%88%E6%9E%9C%E5%BF%AB%E9%80%9F%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/512315/Web%E8%A7%86%E8%A7%89%E6%95%88%E6%9E%9C%E5%BF%AB%E9%80%9F%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 保存用户设置的函数
    const saveSettings = (effect, intensity) => {
        localStorage.setItem('visualEffect', effect);
        localStorage.setItem('effectIntensity', intensity);
    };

    // 加载保存的设置
    const loadSettings = () => {
        return {
            effect: localStorage.getItem('visualEffect') || 'grayscale',
            intensity: localStorage.getItem('effectIntensity') || '100'
        };
    };

    // 应用效果的函数
    const applyEffect = (effect, intensity) => {
        switch (effect) {
            case 'grayscale':
                document.body.style.filter = `grayscale(${intensity}%)`;
                break;
            case 'invert':
                document.body.style.filter = `invert(${intensity}%)`;
                break;
            case 'brightness':
                document.body.style.filter = `brightness(${intensity}%)`;
                break;
            case 'contrast':
                document.body.style.filter = `contrast(${intensity}%)`;
                break;
            case 'sepia':
                document.body.style.filter = `sepia(${intensity}%)`;
                break;
            case 'blur':
                document.body.style.filter = `blur(${intensity / 10}px)`;  // 模糊用 px 单位
                break;
            default:
                document.body.style.filter = 'none';
        }
    };

    // 加载保存的设置并应用
    let { effect, intensity } = loadSettings();
    let isEffectActive = false;  // 默认效果是关闭的

    // 创建主界面容器
    let container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '10px';
    container.style.right = '10px';
    container.style.zIndex = '9999';
    container.style.padding = '10px';
    container.style.backgroundColor = '#333';
    container.style.color = '#fff';
    container.style.borderRadius = '5px';
    container.style.boxShadow = '0px 0px 5px rgba(0, 0, 0, 0.5)';
    container.style.width = '150px';
    container.style.cursor = 'move'; // 鼠标移上去显示为移动图标
    document.body.appendChild(container);

    // 创建开关按钮
    let toggleButton = document.createElement('button');
    toggleButton.innerHTML = '效果：关';
    toggleButton.style.display = 'block';
    toggleButton.style.marginBottom = '10px';
    toggleButton.style.padding = '10px';
    toggleButton.style.backgroundColor = '#4CAF50';
    toggleButton.style.color = '#fff';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.width = '100%';
    container.appendChild(toggleButton);

    // 创建设置按钮
    let settingsButton = document.createElement('button');
    settingsButton.innerHTML = '设置';
    settingsButton.style.display = 'block';
    settingsButton.style.padding = '10px';
    settingsButton.style.backgroundColor = '#555';
    settingsButton.style.color = '#fff';
    settingsButton.style.border = 'none';
    settingsButton.style.borderRadius = '5px';
    settingsButton.style.cursor = 'pointer';
    settingsButton.style.width = '100%';
    container.appendChild(settingsButton);

    // 创建设置界面
    let settingsContainer = document.createElement('div');
    settingsContainer.style.position = 'fixed';
    settingsContainer.style.bottom = '10px';
    settingsContainer.style.right = '170px';  // 设置界面稍微偏右显示
    settingsContainer.style.zIndex = '9999';
    settingsContainer.style.padding = '10px';
    settingsContainer.style.backgroundColor = '#333';
    settingsContainer.style.color = '#fff';
    settingsContainer.style.borderRadius = '5px';
    settingsContainer.style.boxShadow = '0px 0px 5px rgba(0, 0, 0, 0.5)';
    settingsContainer.style.width = '200px';
    settingsContainer.style.display = 'none';  // 默认隐藏
    document.body.appendChild(settingsContainer);

    // 创建下拉菜单
    let select = document.createElement('select');
    select.style.width = '100%';
    select.style.padding = '8px';
    select.style.marginBottom = '10px';
    select.style.backgroundColor = '#555';
    select.style.color = '#fff';
    select.style.border = 'none';
    select.style.borderRadius = '3px';

    let effects = [
        { value: 'grayscale', text: '灰度' },
        { value: 'invert', text: '反转颜色' },
        { value: 'brightness', text: '亮度' },
        { value: 'contrast', text: '对比度' },
        { value: 'sepia', text: '棕褐色复古' },
        { value: 'blur', text: '模糊' }
    ];

    effects.forEach(effect => {
        let option = document.createElement('option');
        option.value = effect.value;
        option.text = effect.text;
        select.appendChild(option);
    });

    select.value = effect;  // 加载保存的效果
    settingsContainer.appendChild(select);

    // 创建滑动条
    let range = document.createElement('input');
    range.type = 'range';
    range.min = '0';
    range.max = '100';
    range.value = intensity;  // 加载保存的强度
    range.style.width = '100%';
    settingsContainer.appendChild(range);

    // 创建确认按钮
    let confirmButton = document.createElement('button');
    confirmButton.innerHTML = '保存设置';
    confirmButton.style.display = 'block';
    confirmButton.style.marginTop = '10px';
    confirmButton.style.padding = '8px';
    confirmButton.style.backgroundColor = '#4CAF50';
    confirmButton.style.color = '#fff';
    confirmButton.style.border = 'none';
    confirmButton.style.borderRadius = '3px';
    confirmButton.style.cursor = 'pointer';
    confirmButton.style.width = '100%';
    settingsContainer.appendChild(confirmButton);

    // 开关效果
    toggleButton.addEventListener('click', () => {
        if (isEffectActive) {
            document.body.style.filter = 'none';
            toggleButton.innerHTML = '效果：关';
            toggleButton.style.backgroundColor = '#4CAF50';
        } else {
            applyEffect(effect, intensity);
            toggleButton.innerHTML = '效果：开';
            toggleButton.style.backgroundColor = '#f44336';
        }
        isEffectActive = !isEffectActive;  // 切换状态
    });

    // 显示/隐藏设置界面
    settingsButton.addEventListener('click', () => {
        settingsContainer.style.display = settingsContainer.style.display === 'none' ? 'block' : 'none';
    });

    // 保存设置并关闭设置界面
    confirmButton.addEventListener('click', () => {
        effect = select.value;
        intensity = range.value;
        saveSettings(effect, intensity);  // 保存设置
        settingsContainer.style.display = 'none';  // 关闭设置界面
    });

    // 拖拽功能实现
    let isDragging = false;
    let offsetX, offsetY;

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - container.getBoundingClientRect().left;
        offsetY = e.clientY - container.getBoundingClientRect().top;
        container.style.cursor = 'grabbing';  // 鼠标按下时更改样式
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            container.style.left = `${e.clientX - offsetX}px`;
            container.style.top = `${e.clientY - offsetY}px`;
            container.style.bottom = 'auto';  // 清除固定底部的约束
            container.style.right = 'auto';  // 清除固定右边的约束
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            container.style.cursor = 'move';  // 鼠标松开时恢复样式
        }
    });
})();
