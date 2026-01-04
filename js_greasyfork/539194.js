// ==UserScript==
// @name         交易视图自定义背景by X:@PPai_Crypto
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  为Tradingview图表添加可自定义的背景图片，并支持透明度、位置、大小和适应模式的调整
// @author       X:@PPai_Crypto
// @match        https://www.tradingview.com/chart/*
// @match        https://cn.tradingview.com/chart/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/539194/%E4%BA%A4%E6%98%93%E8%A7%86%E5%9B%BE%E8%87%AA%E5%AE%9A%E4%B9%89%E8%83%8C%E6%99%AFby%20X%3A%40PPai_Crypto.user.js
// @updateURL https://update.greasyfork.org/scripts/539194/%E4%BA%A4%E6%98%93%E8%A7%86%E5%9B%BE%E8%87%AA%E5%AE%9A%E4%B9%89%E8%83%8C%E6%99%AFby%20X%3A%40PPai_Crypto.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 调试函数
    function log(message) {
        console.log(`[交易视图背景] ${message}`);
    }

    // 添加样式
    GM_addStyle(`
        #custom-background-controls {
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 1000;
            display: none; /* 初始隐藏 */
        }
        #custom-background-controls input,
        #custom-background-controls select,
        #custom-background-controls label {
            margin: 5px 0;
            display: block;
        }
        #custom-background-controls .preview {
            max-width: 100px;
            max-height: 100px;
            margin-top: 5px;
        }
    `);

    // 初始值
    let currentImageUrl = GM_getValue('backgroundImageUrl', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80');
    let currentOpacity = GM_getValue('backgroundOpacity', 30); // 0-100
    let currentTop = GM_getValue('backgroundTop', 0);
    let currentLeft = GM_getValue('backgroundLeft', 0);
    let currentWidth = GM_getValue('backgroundWidth', '100%'); // 恢复为百分比
    let currentHeight = GM_getValue('backgroundHeight', '100%'); // 恢复为百分比
    let currentFitMode = GM_getValue('backgroundFitMode', 'cover'); // 'cover', 'contain', 'repeat'
    let controlsVisible = false;

    // 创建控制面板
    function createControls() {
        const controls = document.createElement('div');
        controls.id = 'custom-background-controls';
        document.body.appendChild(controls);

        // 文件上传输入
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        const fileLabel = document.createElement('label');
        fileLabel.textContent = '上传图片：';
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    currentImageUrl = event.target.result;
                    GM_setValue('backgroundImageUrl', currentImageUrl);
                    updateBackground();
                    controls.querySelector('.preview').src = currentImageUrl;
                    log(`新图片加载: ${currentImageUrl.substring(0, 50)}...`);
                };
                reader.readAsDataURL(file);
            }
        });
        controls.appendChild(fileLabel);
        controls.appendChild(fileInput);

        // 透明度滑块 (0-100)
        const opacityLabel = document.createElement('label');
        opacityLabel.textContent = `透明度：${currentOpacity}%`;
        const opacityInput = document.createElement('input');
        opacityInput.type = 'range';
        opacityInput.min = '0';
        opacityInput.max = '100';
        opacityInput.value = currentOpacity;
        opacityInput.addEventListener('input', function(e) {
            currentOpacity = parseInt(e.target.value);
            opacityLabel.textContent = `透明度：${currentOpacity}%`;
            GM_setValue('backgroundOpacity', currentOpacity);
            updateBackground();
        });
        controls.appendChild(opacityLabel);
        controls.appendChild(opacityInput);

        // 位置调整
        const topLabel = document.createElement('label');
        topLabel.textContent = `顶部位置：${currentTop}px`;
        const topInput = document.createElement('input');
        topInput.type = 'range';
        topInput.min = '-500';
        topInput.max = '500';
        topInput.value = currentTop;
        topInput.addEventListener('input', function(e) {
            currentTop = parseInt(e.target.value);
            topLabel.textContent = `顶部位置：${currentTop}px`;
            GM_setValue('backgroundTop', currentTop);
            updateBackground();
        });
        controls.appendChild(topLabel);
        controls.appendChild(topInput);

        const leftLabel = document.createElement('label');
        leftLabel.textContent = `左侧位置：${currentLeft}px`;
        const leftInput = document.createElement('input');
        leftInput.type = 'range';
        leftInput.min = '-500';
        leftInput.max = '500';
        leftInput.value = currentLeft;
        leftInput.addEventListener('input', function(e) {
            currentLeft = parseInt(e.target.value);
            leftLabel.textContent = `左侧位置：${currentLeft}px`;
            GM_setValue('backgroundLeft', currentLeft);
            updateBackground();
        });
        controls.appendChild(leftLabel);
        controls.appendChild(leftInput);

        // 大小调整 (进度条，转换为像素)
        const widthLabel = document.createElement('label');
        widthLabel.textContent = `宽度：${parseInt(currentWidth) || 1000}px`;
        const widthInput = document.createElement('input');
        widthInput.type = 'range';
        widthInput.min = '0';
        widthInput.max = '2000';
        widthInput.value = parseInt(currentWidth) || 1000;
        widthInput.addEventListener('input', function(e) {
            currentWidth = `${parseInt(e.target.value)}px`;
            widthLabel.textContent = `宽度：${parseInt(e.target.value)}px`;
            GM_setValue('backgroundWidth', currentWidth);
            updateBackground();
        });
        controls.appendChild(widthLabel);
        controls.appendChild(widthInput);

        const heightLabel = document.createElement('label');
        heightLabel.textContent = `高度：${parseInt(currentHeight) || 1000}px`;
        const heightInput = document.createElement('input');
        heightInput.type = 'range';
        heightInput.min = '0';
        heightInput.max = '2000';
        heightInput.value = parseInt(currentHeight) || 1000;
        heightInput.addEventListener('input', function(e) {
            currentHeight = `${parseInt(e.target.value)}px`;
            heightLabel.textContent = `高度：${parseInt(e.target.value)}px`;
            GM_setValue('backgroundHeight', currentHeight);
            updateBackground();
        });
        controls.appendChild(heightLabel);
        controls.appendChild(heightInput);

        // 适应模式选择
        const fitLabel = document.createElement('label');
        fitLabel.textContent = '适应模式：';
        const fitSelect = document.createElement('select');
        const fitOptions = [
            { value: 'cover', text: '拉伸铺满' },
            { value: 'contain', text: '按比例缩放' },
            { value: 'repeat', text: '平铺' }
        ];
        fitOptions.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.text;
            if (option.value === currentFitMode) opt.selected = true;
            fitSelect.appendChild(opt);
        });
        fitSelect.addEventListener('change', function(e) {
            currentFitMode = e.target.value;
            GM_setValue('backgroundFitMode', currentFitMode);
            updateBackground();
        });
        controls.appendChild(fitLabel);
        controls.appendChild(fitSelect);

        // 预览
        const preview = document.createElement('img');
        preview.className = 'preview';
        preview.src = currentImageUrl;
        controls.appendChild(preview);

        // 添加提示
        const tip = document.createElement('p');
        tip.textContent = '注意：使用 TradingView 相机图标保存图片时，自定义背景可能不会包含。请尝试直接粘贴图片到图表，或使用图片编辑软件合并。';
        tip.style.color = '#ffcc00';
        tip.style.fontSize = '12px';
        controls.appendChild(tip);

        log('控件创建完成');
    }

    // 更新背景
    function updateBackground() {
        const chartContainer = document.querySelector('.chart-container');
        if (!chartContainer) {
            log('图表容器未找到');
            return;
        }

        // 移除旧背景
        const oldBackground = chartContainer.querySelector('div[background-added]');
        if (oldBackground) {
            oldBackground.remove();
        }

        // 创建新背景
        const backgroundDiv = document.createElement('div');
        backgroundDiv.setAttribute('background-added', 'true');
        backgroundDiv.style.position = 'absolute';
        backgroundDiv.style.top = `${currentTop}px`;
        backgroundDiv.style.left = `${currentLeft}px`;
        backgroundDiv.style.width = currentWidth;
        backgroundDiv.style.height = currentHeight;
        backgroundDiv.style.backgroundImage = `url('${currentImageUrl}')`;
        backgroundDiv.style.backgroundSize = currentFitMode;
        backgroundDiv.style.backgroundPosition = 'center';
        backgroundDiv.style.backgroundRepeat = currentFitMode === 'repeat' ? 'repeat' : 'no-repeat';
        backgroundDiv.style.opacity = currentOpacity / 100; // 转换为 0-1
        backgroundDiv.style.zIndex = '1'; // 置于底层
        backgroundDiv.style.pointerEvents = 'none'; // 不干扰交互

        // 确保 chart-container 支持子元素层级
        chartContainer.style.position = 'relative';
        chartContainer.style.overflow = 'visible'; // 防止内容被裁剪
        chartContainer.style.minWidth = '100%'; // 确保宽度
        chartContainer.style.minHeight = '100%'; // 确保高度

        chartContainer.insertBefore(backgroundDiv, chartContainer.firstChild);

        // 调试：检查背景样式
        log(`背景样式 - URL: ${currentImageUrl.substring(0, 50)}..., Width: ${currentWidth}, Height: ${currentHeight}`);

        // 确保 canvas 层级
        const canvas = chartContainer.querySelector('canvas');
        if (canvas) {
            canvas.style.position = 'relative';
            canvas.style.zIndex = '2'; // 确保 K 线在背景之上
            log('K 线图 z-index 设置为 2');
        }

        // 确保 chart-page 层级
        const chartPage = document.querySelector('.chart-page');
        if (chartPage) {
            chartPage.style.position = 'relative';
            chartPage.style.zIndex = '2';
            log('图表页面 z-index 设置为 2');
        }

        // 尝试修复价格刻度（左侧 y-axis）
        const yAxis = document.querySelector('.y-axis') || document.querySelector('.y-axis-labels');
        if (yAxis) {
            yAxis.style.position = 'relative';
            yAxis.style.zIndex = '3'; // 确保价格刻度在最上层
            log('价格刻度 z-index 设置为 3');
        }

        log('背景已更新，应用新设置');
    }

    // 切换控制面板显示
    function toggleControls() {
        const controls = document.getElementById('custom-background-controls');
        if (controls) {
            controlsVisible = !controlsVisible;
            controls.style.display = controlsVisible ? 'block' : 'none';
            log(`控件 ${controlsVisible ? '显示' : '隐藏'}`);
        }
    }

    // 初始化
    log('脚本启动');
    createControls();
    updateBackground();

    // 注册菜单命令
    GM_registerMenuCommand('切换背景控件', toggleControls);

    // 监控 DOM 变化
    const observer = new MutationObserver(() => {
        const chartContainer = document.querySelector('.chart-container');
        if (chartContainer && !chartContainer.querySelector('div[background-added]')) {
            log('检测到图表容器，更新背景');
            updateBackground();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 清理
    window.addEventListener('unload', () => observer.disconnect());
})();