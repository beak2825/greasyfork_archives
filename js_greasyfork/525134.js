// ==UserScript==
// @name         Bilibili高级弹幕增强
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  开启你的B站弹幕职人之路！优化高级弹幕发送面板，增加多种高级弹幕样式
// @author       淡い光
// @license      MIT
// @match        *://*.bilibili.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/525134/Bilibili%E9%AB%98%E7%BA%A7%E5%BC%B9%E5%B9%95%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/525134/Bilibili%E9%AB%98%E7%BA%A7%E5%BC%B9%E5%B9%95%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==


/**
 * 添加新字体选项到弹幕字体选择列表
 */
function addNewFonts() {
    // 监听弹幕面板切换
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.target.classList &&
                mutation.target.classList.contains('bui-dropdown-name') &&
                mutation.target.textContent === '高级弹幕') {
                console.log("切换到高级弹幕面板");
                // 当切换到高级弹幕面板时
                setTimeout(setupFontSelector, 1);

                // setTimeout(setupEnhancedSendButton, 1);

            }
        });
    });

    // 开始观察文档变化，包含文本内容的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        characterDataOldValue: true
    });
}

/**
 * 设置字体选择器的事件监听
 */
function setupFontSelector() {
    const fontSelect = document.querySelector('.bpx-player-adv-danmaku-font-family-select');
    if (fontSelect && !fontSelect.dataset.enhanced) {
        fontSelect.dataset.enhanced = 'true';
        fontSelect.addEventListener('mouseenter', () => {
            insertFonts();
        }, { once: true }); // 只在第一次悬停时执行
    }
}

/**
 * 插入新字体到字体列表
 */
function insertFonts() {
    console.log("插入字体");
    const fontList = document.querySelector('.bpx-player-adv-danmaku-font-family ul.bui-select-list');
    if (!fontList) return;
    // 避免重复添加字体
    if (!document.querySelector('[data-value="KaiTi"]')) {
        const newFonts = [
            { value: 'KaiTi', text: '楷体' },
            { value: 'YouYuan', text: '幼圆' },
            { value: 'STCaiyun', text: '华文彩云' },
        ];

        newFonts.forEach(font => {
            const li = document.createElement('li');
            li.className = 'bui-select-item';
            li.setAttribute('data-value', font.value);
            li.textContent = font.text;

            // 插入到列表的最后
            fontList.appendChild(li);
        });

        // 添加点击事件处理
        fontList.addEventListener('click', (e) => {
            const item = e.target.closest('.bui-select-item');
            if (item) {
                // 更新选中状态
                fontList.querySelectorAll('.bui-select-item').forEach(el => {
                    el.classList.remove('bui-select-item-active');
                });
                item.classList.add('bui-select-item-active');

                // 更新显示的文本和字体选择器的状态
                const fontSelect = document.querySelector('.bpx-player-adv-danmaku-font-family-select');
                if (fontSelect) {
                    // 更新显示文本
                    const resultText = fontSelect.querySelector('.bui-select-result');
                    if (resultText) {
                        resultText.textContent = item.textContent;
                    }

                    // 触发字体选择事件
                    const event = new CustomEvent('fontChange', {
                        detail: {
                            value: item.getAttribute('data-value'),
                            text: item.textContent
                        }
                    });
                    fontSelect.dispatchEvent(event);
                }
            }
        });
    }
}

/**
 * 设置颜色选择器
 */
function setupColorPicker() {
    // 获取原面板的颜色选择器区域
    const colorPickerResult = document.querySelector('.bui-color-picker-result');
    if (!colorPickerResult || colorPickerResult.dataset.enhanced) return;
    colorPickerResult.dataset.enhanced = 'true';

    // 创建新的颜色选择器
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.className = 'enhanced-color-picker';

    // 设置样式 - 完全隐藏但保持可用
    colorInput.style.cssText = `
            width: 0;
            height: 0;
            padding: 0;
            border: none;
            position: absolute;
            visibility: hidden;
        `;

    // 创建容器并添加颜色选择器
    const colorPickerContainer = document.createElement('div');
    colorPickerContainer.style.cssText = `
            position: absolute;
            left: 0;
            top: 105px;
            height: 1px;
            overflow: hidden;
            opacity: 0;
        `;
    colorPickerContainer.appendChild(colorInput);
    colorPickerResult.appendChild(colorPickerContainer);

    // 获取原有的颜色显示区域和输入框
    const originalDisplay = colorPickerResult.querySelector('.bui-color-picker-display');
    const colorTextInput = colorPickerResult.querySelector('.bui-color-picker-input input');

    if (originalDisplay) {
        // 确保鼠标样式显示为可点击
        originalDisplay.style.cursor = 'pointer';
        // 点击原有显示区域时触发颜色选择器
        originalDisplay.addEventListener('click', () => {
            // 在打开颜色选择器前，先同步当前颜色
            const currentColor = colorTextInput.value.toUpperCase();
            colorInput.value = currentColor;
            colorInput.click();
        });
    }

    // 监听颜色变化
    colorInput.addEventListener('input', (e) => {
        const hexColor = e.target.value.toUpperCase();
        if (colorTextInput) {
            colorTextInput.value = hexColor;
            // 触发原面板的颜色更新事件
            colorTextInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        // 更新原有显示区域的背景色
        if (originalDisplay) {
            originalDisplay.style.background = hexColor;
        }
    });
}

/**
 * 设置发送样式弹幕按钮和样式弹幕区域
 */
function setupEnhancedSendButton() {
    console.log("设置发送样式弹幕按钮和样式弹幕区域");
    // 检查是否已存在增强功能
    if (document.querySelector('.enhanced-danmaku-container')) return;

    // 添加隐藏的localDmFile元素
    const localDmFile = document.createElement('div');
    localDmFile.id = 'localDmFile';
    localDmFile.style.display = 'none';
    document.body.appendChild(localDmFile);



    // 添加数字输入框的上下箭头事件处理
    function setupNumberStepper(container) {
        // 获取原面板的按百分比复选框
        const getPercentCheckbox = () => document.querySelector('.bpx-player-adv-danmaku-pos-percent input');

        // 获取是否按百分比
        const getIsPercent = () => {
            const checkbox = getPercentCheckbox();
            return checkbox && checkbox.checked;
        };

        // 更新输入框的默认值
        function updateDefaultValues(isPercent) {
            const inputs = {
                'shadow-offset-x': { percent: '0.003', normal: '3' },
                'shadow-offset-y': { percent: '0.003', normal: '3' },
                'stroke-spacing': { percent: '0.002', normal: '2' }
            };

            Object.entries(inputs).forEach(([className, values]) => {
                const input = container.querySelector(`.${className}`);
                if (input) {
                    const currentValue = parseFloat(input.value);
                    // 只有当值等于另一个模式的默认值时才更新
                    if (currentValue === parseFloat(isPercent ? values.normal : values.percent)) {
                        input.value = isPercent ? values.percent : values.normal;
                    }
                }
            });
        }

        container.querySelectorAll('.bpx-player-adv-danmaku-spinner.bui-input').forEach(spinner => {
            const input = spinner.querySelector('input');
            const upArrow = spinner.querySelector('.bui-input-stepper-up');
            const downArrow = spinner.querySelector('.bui-input-stepper-down');

            // 获取步进值和范围限制
            const defaultStep = parseInt(spinner.dataset.step) || 1;
            const min = parseInt(spinner.dataset.min);
            const max = parseInt(spinner.dataset.max);

            // 点击上箭头
            upArrow.addEventListener('click', () => {
                const step = getIsPercent() ? 0.001 : defaultStep;
                let value = parseFloat(input.value) || 0;
                value = parseFloat((value + step).toFixed(3));
                if (!isNaN(max) && value > max) value = max;
                input.value = value;
                input.dispatchEvent(new Event('input', { bubbles: true }));
            });

            // 点击下箭头
            downArrow.addEventListener('click', () => {
                const step = getIsPercent() ? 0.001 : defaultStep;
                let value = parseFloat(input.value) || 0;
                value = parseFloat((value - step).toFixed(3));
                if (!isNaN(min) && value < min) value = min;
                input.value = value;
                input.dispatchEvent(new Event('input', { bubbles: true }));
            });
        });

        // 监听原面板按百分比复选框的变化
        const percentCheckbox = getPercentCheckbox();
        if (percentCheckbox) {
            // 监听复选框的change事件
            percentCheckbox.addEventListener('change', () => {
                const isPercent = getIsPercent();
                // 更新默认值
                updateDefaultValues(isPercent);
                // 更新所有输入框的值格式
                container.querySelectorAll('.bpx-player-adv-danmaku-spinner.bui-input input').forEach(input => {
                    const value = parseFloat(input.value) || 0;
                    input.value = isPercent ? value.toFixed(3) : Math.round(value);
                });
            });

            // 初始化时检查一次
            updateDefaultValues(getIsPercent());
        }
    }

    // 创建样式弹幕和参数区域的容器
    const enhancedContainer = document.createElement('div');
    enhancedContainer.className = 'bpx-player-adv-danmaku-group enhanced-danmaku-container';

    // 修改阴影参数区域的HTML，添加默认值
    enhancedContainer.innerHTML = `
            <div class="bpx-player-adv-danmaku-group-row">
                <span class="bpx-player-adv-danmaku-title">样式弹幕</span>
                <div class="enhanced-style-buttons">
                    <span class="bpx-player-adv-danmaku-btn bui bui-button active" data-style="shadow">
                        <div class="bui-area bui-button-small">立体阴影</div>
                    </span>
                    <span class="bpx-player-adv-danmaku-btn bui bui-button" data-style="stroke">
                        <div class="bui-area bui-button-small">颜色描边</div>
                    </span>
                    <span class="bpx-player-adv-danmaku-btn bui bui-button" data-style="background">
                        <div class="bui-area bui-button-small">文字背景</div>
                    </span>
                    <span class="bpx-player-adv-danmaku-btn bui bui-button" data-style="normal">
                        <div class="bui-area bui-button-small">无样式</div>
                    </span>
                    <span class="bpx-player-adv-danmaku-btn bui bui-button" data-style="ascii"style=" padding-top: 0px; margin-top: 8px;">
                        <div class="bui-area bui-button-small">字符画</div>
                    </span>
                </div>
            </div>

            <div class="enhanced-params-area">
                <div class="shadow-params" style="display: block;">
                    <div class="bpx-player-adv-danmaku-group-row" style="padding-top: 0px;">
                        <div class="bpx-player-adv-danmaku-group-item shadow-item">
                            <span class="bpx-player-adv-danmaku-title">阴影颜色</span>
                            <div class="bpx-player-adv-danmaku-color-picker bui bui-color-picker">
                                <div class="bui-area">
                                    <div class="bui-color-picker-wrap">
                                        <div class="bui-color-picker-result" style="!important; margin-bottom: 0px;">
                                            <span class="bui-color-picker-input bui bui-input">
                                                <div class="bui-area">
                                                    <div class="bui-input-wrap">
                                                        <input class="shadow-color bui-input-input" type="text" value="#222222">
                                                    </div>
                                                </div>
                                            </span>
                                            <span class="bui-color-picker-display" style="background: #222222"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bpx-player-adv-danmaku-group-item shadow-item">
                            <span class="bpx-player-adv-danmaku-title">偏移X</span>
                            <span class="bpx-player-adv-danmaku-spinner bui bui-input" data-value="3" data-min="0" data-max="9999" data-step="1">
                                <div class="bui-area">
                                    <div class="bui-input-wrap">
                                        <input class="shadow-offset-x bui-input-input" type="number" value="3">
                                        <div class="bui-input-stepper">
                                            <div class="bui-input-stepper-half bui-input-stepper-up">
                                                <span class="bui-input-arrow bui-input-arrow-up"></span>
                                            </div>
                                            <div class="bui-input-stepper-half bui-input-stepper-down">
                                                <span class="bui-input-arrow bui-input-arrow-down"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </span>
                        </div>
                        <div class="bpx-player-adv-danmaku-group-item shadow-item">
                            <span class="bpx-player-adv-danmaku-title">偏移Y</span>
                            <span class="bpx-player-adv-danmaku-spinner bui bui-input" data-value="3" data-min="0" data-max="9999" data-step="1">
                                <div class="bui-area">
                                    <div class="bui-input-wrap">
                                        <input class="shadow-offset-y bui-input-input" type="number" value="3">
                                        <div class="bui-input-stepper">
                                            <div class="bui-input-stepper-half bui-input-stepper-up">
                                                <span class="bui-input-arrow bui-input-arrow-up"></span>
                                            </div>
                                            <div class="bui-input-stepper-half bui-input-stepper-down">
                                                <span class="bui-input-arrow bui-input-arrow-down"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="stroke-params" style="display: none;">
                    <div class="bpx-player-adv-danmaku-group-row" style="padding-top: 0px;">
                        <div class="bpx-player-adv-danmaku-group-item stroke-item">
                            <span class="bpx-player-adv-danmaku-title">描边颜色</span>
                            <div class="bpx-player-adv-danmaku-color-picker bui bui-color-picker">
                                <div class="bui-area">
                                    <div class="bui-color-picker-wrap">
                                        <div class="bui-color-picker-result" style="!important; margin-bottom: 0px;">
                                            <span class="bui-color-picker-input bui bui-input">
                                                <div class="bui-area">
                                                    <div class="bui-input-wrap">
                                                        <input class="stroke-color bui-input-input" type="text" value="#00AEEC">
                                                    </div>
                                                </div>
                                            </span>
                                            <span class="bui-color-picker-display" style="background: #00AEEC"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bpx-player-adv-danmaku-group-item stroke-item">
                            <span class="bpx-player-adv-danmaku-title">间距</span>
                            <span class="bpx-player-adv-danmaku-spinner bui bui-input" data-value="2" data-min="0" data-max="9999" data-step="1">
                                <div class="bui-area">
                                    <div class="bui-input-wrap">
                                        <input class="stroke-spacing bui-input-input" type="number" value="2">
                                        <div class="bui-input-stepper">
                                            <div class="bui-input-stepper-half bui-input-stepper-up">
                                                <span class="bui-input-arrow bui-input-arrow-up"></span>
                                            </div>
                                            <div class="bui-input-stepper-half bui-input-stepper-down">
                                                <span class="bui-input-arrow bui-input-arrow-down"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </span>
                        </div>
                    </div>
                </div>

                <div class="background-params" style="display: none;">
                    <div class="bpx-player-adv-danmaku-group-row" style="padding-top: 0px;">
                        <div class="bpx-player-adv-danmaku-group-item background-item">
                            <span class="bpx-player-adv-danmaku-title">背景颜色</span>
                            <div class="bpx-player-adv-danmaku-color-picker bui bui-color-picker">
                                <div class="bui-area">
                                    <div class="bui-color-picker-wrap">
                                        <div class="bui-color-picker-result" style="!important; margin-bottom: 0px;">
                                            <span class="bui-color-picker-input bui bui-input">
                                                <div class="bui-area">
                                                    <div class="bui-input-wrap">
                                                        <input class="background-color bui-input-input" type="text" value="#222222">
                                                    </div>
                                                </div>
                                            </span>
                                            <span class="bui-color-picker-display" style="background: #222222"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bpx-player-adv-danmaku-group-item background-item">
                            <span class="bpx-player-adv-danmaku-title">背景字符</span>
                            <span class="bpx-player-adv-danmaku-spinner" style="width: 50px !important;">
                                <input type="text" class="background-char bui-input-input"  style="width: 50px !important;" value="█" maxlength="1">
                            </span>
                        </div>
                        <div class="bpx-player-adv-danmaku-group-item background-item">
                            <span class="bpx-player-adv-danmaku-checkbox bui bui-checkbox">
                                <div class="bui-area" style="padding-top: 26px;">
                                    <input class="bui-checkbox-input vertical-text" type="checkbox" aria-label="转竖列">
                                    <label class="bui-checkbox-label">
                                        <span class="bui-checkbox-icon bui-checkbox-icon-default">
                                            <svg xmlns="http://www.w3.org/2000/svg" data-pointer="none" viewBox="0 0 32 32">
                                                <path d="M8 6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H8zm0-2h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V8c0-2.21 1.79-4 4-4z"></path>
                                            </svg>
                                        </span>
                                        <span class="bui-checkbox-icon bui-checkbox-icon-selected">
                                            <svg xmlns="http://www.w3.org/2000/svg" data-pointer="none" viewBox="0 0 32 32">
                                                <path d="m13 18.25-1.8-1.8c-.6-.6-1.65-.6-2.25 0s-.6 1.5 0 2.25l2.85 2.85c.318.318.762.468 1.2.448.438.02.882-.13 1.2-.448l8.85-8.85c.6-.6.6-1.65 0-2.25s-1.65-.6-2.25 0l-7.8 7.8zM8 4h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V8c0-2.21 1.79-4 4-4z"></path>
                                            </svg>
                                        </span>
                                        <span class="bui-checkbox-name">转竖列</span>
                                    </label>
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="normal-params" style="display: none;">
                </div>
                <div class="ascii-params" style="display: none;">
                    <div class="bpx-player-adv-danmaku-group-row" style="padding-top: 0px;">
                        <div class="bpx-player-adv-danmaku-group-item" style="width: 100%; margin-bottom: 10px;">
                            <div class="bpx-player-adv-danmaku-text-input bui bui-input" style="width: calc(100%);">
                                <div class="bui-area">
                                    <div class="bui-input-wrap">
                                        <textarea class="ascii-content bui-input-input" type="text" placeholder="请输入字符画内容" style="min-height: 80px; font-family: '黑体', sans-serif; white-space: pre;!important;">　　　　◥◣　　　　◢◤　　　　\n　　　　　◥◣　　◢◤　　　　　\n　◢████████████◣\n◢██████████████◣\n██　　　　　　　　　　　　██\n██　　◢█　　　　█◣　　██\n██　◢█◤　　　　◥█◣　██\n██　█◤　　　　　　◥█　██\n██　　　　　　　　　　　　██\n██　　　　　　　　　　　　██\n██　　　　　︶︶　　　　　██\n██　　　　　　　　　　　　██\n◥██████████████◤\n　◥████████████◤　\n　　　　◥◤　　　　◥◤　　　　</textarea>
                                        <span class="ascii-char-count" style="position: absolute; right: 18px; bottom: -10px; color: #99a2aa; font-size: 12px;">字数：0</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bpx-player-adv-danmaku-group-row" style="padding-top: 0px;">
                        <div class="bpx-player-adv-danmaku-group-item" style="margin-right: 20px;">
                            <span class="bpx-player-adv-danmaku-title">发送方式</span>
                            <span class="ascii-send-mode-select bui bui-select" data-enhanced="true">
                                <div class="bui-area">
                                    <div class="bui-select-wrap">
                                        <div class="bui-select-border">
                                            <div class="bui-select-header">
                                                <span class="bui-select-result">更换Y坐标每行发送</span>
                                                <span class="bui-select-arrow">
                                                    <span class="bui-select-arrow-down"></span>
                                                </span>
                                            </div>
                                            <div class="bui-select-list-wrap" style="">
                                                <ul class="bui-select-list" style="height: 0px; border: none;">
                                                    <li class="bui-select-item bui-select-item-active" data-value="line">更换Y坐标每行发送</li>
                                                    <li class="bui-select-item" data-value="coord">相同坐标换行发送</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </span>
                        </div>
                        
                        <div class="bpx-player-adv-danmaku-group-item ascii-line-spacing" style="margin-right: 0px;">
                            <span class="bpx-player-adv-danmaku-title">每行间距</span>
                            <span class="bpx-player-adv-danmaku-spinner bui bui-input" data-value="30" data-min="0" data-max="999" data-step="1" style="width: 58px;">
                                <div class="bui-area">
                                    <div class="bui-input-wrap">
                                        <input class="line-spacing bui-input-input" type="number" value="36">
                                        <div class="bui-input-stepper">
                                            <div class="bui-input-stepper-half bui-input-stepper-up">
                                                <span class="bui-input-arrow bui-input-arrow-up"></span>
                                            </div>
                                            <div class="bui-input-stepper-half bui-input-stepper-down">
                                                <span class="bui-input-arrow bui-input-arrow-down"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </span>
                        </div>

                        <div class="bpx-player-adv-danmaku-group-item ascii-sync-font-size" style="margin-top: 24px;">
                            <span class="bpx-player-adv-danmaku-checkbox bui bui-checkbox sync-font-size"style="margin-left: 8px;>
                                <div class="bui-area">
                                    <input class="bui-checkbox-input" type="checkbox" aria-label="同步字号" checked>
                                    <label class="bui-checkbox-label">
                                        <span class="bui-checkbox-icon bui-checkbox-icon-default">
                                            <svg xmlns="http://www.w3.org/2000/svg" data-pointer="none" viewBox="0 0 32 32">
                                                <path d="M8 6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H8zm0-2h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V8c0-2.21 1.79-4 4-4z"></path>
                                            </svg>
                                        </span>
                                        <span class="bui-checkbox-icon bui-checkbox-icon-selected">
                                            <svg xmlns="http://www.w3.org/2000/svg" data-pointer="none" viewBox="0 0 32 32">
                                                <path d="m13 18.25-1.8-1.8c-.6-.6-1.65-.6-2.25 0s-.6 1.5 0 2.25l2.85 2.85c.318.318.762.468 1.2.448.438.02.882-.13 1.2-.448l8.85-8.85c.6-.6.6-1.65 0-2.25s-1.65-.6-2.25 0l-7.8 7.8zM8 4h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V8c0-2.21 1.79-4 4-4z"></path>
                                            </svg>
                                        </span>
                                        <span class="bui-checkbox-name">同步字号</span>
                                    </label>
                                </div>
                            </span>
                        </div>

                    </div>
                </div>
            </div>

            <div class="bpx-player-adv-danmaku-group-row bpx-player-adv-danmaku-send">
                <span class="bpx-player-adv-danmaku-btn bpx-player-adv-danmaku-send-test bui bui-button enhanced-send-btn">
                    <div class="bui-area bui-button-large">发送样式弹幕</div>
                </span>
       
            </div>
            <div class="bpx-player-adv-danmaku-group-row enhanced-send-status-row">
               <span class="enhanced-send-status"></span>
            </div>
        `;

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
            .enhanced-danmaku-container {
                margin-top: 0;
                padding: 20px 0;
                padding-top: 0px;
            }
            .enhanced-style-buttons {
                display: inline-block;
            }
            .enhanced-style-buttons .bpx-player-adv-danmaku-btn {
                margin-right: 8px;
            }
            .enhanced-style-buttons .active {
                background-color: #00a1d6;
                color: #fff;
            }
            .enhanced-params-area {
                margin: 8px 0;
            }
            .enhanced-params-area .bpx-player-adv-danmaku-group-item {
                margin-right: 16px;
            }
            .enhanced-params-area .bpx-player-adv-danmaku-spinner {
                display: inline-block;
                vertical-align: middle;
            }
            .enhanced-params-area input {
                width: 80px;
                height: 24px;
                padding: 0 8px;
                border: 1px solid #e3e5e7;
                border-radius: 2px;
                font-size: 12px;
            }
            .enhanced-send-btn.disabled {
                opacity: 0.5 !important;
                pointer-events: none !important;
                background-color: #e3e5e7 !important;
            }
            .enhanced-send-status {
                display: none;
                vertical-align: middle;
                margin-left: 10px;
                color: #666;
                font-size: 12px;
                line-height: 32px;
            }
            .enhanced-params-area .shadow-item,
            .enhanced-params-area .stroke-item {
                margin-right: 24px !important;
            }
            .enhanced-params-area .shadow-item:last-child,
            .enhanced-params-area .stroke-item:last-child {
                margin-right: 0 !important;
            }
            .enhanced-style-buttons .bpx-player-adv-danmaku-btn.active {
                background-color: #00a1d6 !important;
                color: #fff !important;
            }
            .preview-danmaku-btn {
                margin-top: 10px;
                text-align: center;
            }
            .preview-danmaku-btn .bui-area {
                background-color: #00a1d6;
                color: #fff;
                border-radius: 4px;
                cursor: pointer;
            }
            .preview-danmaku-btn .bui-area:hover {
                background-color: #00b5e5;
            }
        `;
    document.head.appendChild(style);

    // 组装并插入元素
    enhancedContainer.appendChild(style);

    // 监听高级弹幕面板的加载
    const observer = new MutationObserver((mutations, obs) => {
        const groupWrap = document.querySelector('.bpx-player-adv-danmaku-group-wrap');
        if (groupWrap) {
            obs.disconnect();
            // 找到最后一个group
            const lastGroup = groupWrap.querySelector('.bpx-player-adv-danmaku-group:last-child');
            if (lastGroup) {
                // 插入到最后一个group后面
                lastGroup.parentNode.insertBefore(enhancedContainer, lastGroup.nextSibling);

                // 样式弹幕添加事件监听
                setupStyleEventListeners(enhancedContainer);
                // 设置数字输入框的上下箭头事件
                setupNumberStepper(enhancedContainer);
                // 设置颜色选择器
                setupColorPicker();
                // 设置样式弹幕的颜色选择器
                setupStyleColorPickers(enhancedContainer);

                // 设置字符画按钮点击事件
                setupAsciiButton(enhancedContainer);

                // 设置同步字号
                setupSyncFontSize(document,enhancedContainer);
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 创建预览弹幕区域
    const previewArea = document.createElement('div');
    previewArea.className = 'bpx-player-adv-danmaku-group-row bpx-player-adv-danmaku-send';
    previewArea.innerHTML = `
        <span class="bpx-player-adv-danmaku-btn bpx-player-adv-danmaku-send-test bui bui-button upload-danmaku-btn">
            <div class="bui-area bui-button-large">上传弹幕文件</div>
            <input type="file" accept=".json,.xml" style="display: none;">
        </span>
        <span class="bpx-player-adv-danmaku-btn bpx-player-adv-danmaku-send-test bui bui-button preview-danmaku-btn disabled">
            <div class="bui-area bui-button-large">预览本地弹幕</div>
        </span>
        <span class="preview-danmaku-filename"></span>
    `;
    // enhancedContainer.appendChild(previewArea);

    // 添加预览区域样式
    if (!document.querySelector('#enhanced-danmaku-preview-style')) {
        const previewStyle = document.createElement('style');
        previewStyle.id = 'enhanced-danmaku-preview-style';
        previewStyle.textContent = `
            .preview-danmaku-btn,
            .upload-danmaku-btn {
                margin-right: 10px;
            }
            .preview-danmaku-btn .bui-area,
            .upload-danmaku-btn .bui-area {
                background-color: #00a1d6;
                color: #fff;
                border-radius: 4px;
                cursor: pointer;
            }
            .preview-danmaku-btn.disabled .bui-area {
                background-color: #b8b8b8;
                cursor: not-allowed;
            }
            .preview-danmaku-btn .bui-area:hover,
            .upload-danmaku-btn .bui-area:hover {
                background-color: #00b5e5;
            }
            .preview-danmaku-btn.disabled .bui-area:hover {
                background-color: #b8b8b8;
            }
            .preview-danmaku-filename {
                color: #666;
                font-size: 12px;
                line-height: 32px;
                margin-left: 10px;
                max-width: 200px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        `;
        document.head.appendChild(previewStyle);
    }

    // 获取元素
    const fileInput = previewArea.querySelector('input[type="file"]');
    const previewBtn = previewArea.querySelector('.preview-danmaku-btn');
    const uploadBtn = previewArea.querySelector('.upload-danmaku-btn');
    const filenameSpan = previewArea.querySelector('.preview-danmaku-filename');
    let currentDanmakuList = null;

    // 监听文件选择
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const content = await file.text();
            let danmakuList = [];

            if (file.name.endsWith('.xml')) {
                danmakuList = parseXMLDanmaku(content);
            } else if (file.name.endsWith('.json')) {
                danmakuList = parseJSONDanmaku(content);
            }

            if (danmakuList.length > 0) {
                currentDanmakuList = danmakuList;
                filenameSpan.textContent = `${file.name} (${danmakuList.length}条弹幕)`;
                previewBtn.classList.remove('disabled');
            }
        } catch (error) {
            console.error('加载弹幕文件失败:', error);
            alert('加载弹幕文件失败');
        }
    });

    // 上传按钮点击事件
    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // 预览按钮点击事件
    previewBtn.addEventListener('click', () => {
        if (previewBtn.classList.contains('disabled')) return;

        // 预览弹幕
        previewDanmaku(currentDanmakuList);

    });

    // 创建测试样式按钮
    const testStyleBtn = document.createElement('span');
    testStyleBtn.className = 'bpx-player-adv-danmaku-btn bpx-player-adv-danmaku-send-test bui bui-button';
    testStyleBtn.innerHTML = '<div class="bui-area bui-button-large">测试样式效果</div>';

    // 将测试按钮插入到发送样式弹幕按钮前面
    const enhancedButton = enhancedContainer.querySelector('.enhanced-send-btn');
    enhancedButton.parentNode.insertBefore(testStyleBtn, enhancedButton);

    // 测试按钮点击事件
    testStyleBtn.addEventListener('click', async () => {
        // 获取当前选择的弹幕样式参数
        const baseParams = await getBaseDanmakuParams();
        const params = getAdvancedDanmakuParams();
        // 获取当前选中的样式按钮
        const buttonContainer = document.querySelector('.enhanced-style-buttons');
        const activeButton = buttonContainer.querySelector('.active');
        let currentStyle = activeButton.getAttribute('data-style');

        // 获取字符画发送方式
        const sendMode = document.querySelector('.ascii-send-mode-select .bui-select-item-active').getAttribute('data-value');

        if (currentStyle === 'shadow' || currentStyle === 'stroke' || currentStyle === 'background'  || currentStyle === 'normal') {
            if (!params.text) {
                alert('请输入弹幕内容');
                return;
            }
        }
        if (currentStyle === 'ascii') {
            if (sendMode === 'line') {
                currentStyle = 'ascii-line';
            } else if (sendMode === 'coord') {
                currentStyle = 'ascii-coord';
            }
        }
        let istest = true;
        testStyle(baseParams, params, currentStyle, istest, sendMode)

    });



    // 在Y轴翻转后面添加Z轴跟随移动角度复选框
    const zRotateFollowHtml = `
    <span class="bpx-player-adv-danmaku-checkbox bui bui-checkbox z-rotate-follow" style="margin-top: 25px;margin-left: 13px;>
        <div class="bui-area">
            <input class="bui-checkbox-input" type="checkbox" aria-label="Z轴跟随移动角度">
            <label class="bui-checkbox-label">
                <span class="bui-checkbox-icon bui-checkbox-icon-default">
                    <svg xmlns="http://www.w3.org/2000/svg" data-pointer="none" viewBox="0 0 32 32">
                        <path d="M8 6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H8zm0-2h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V8c0-2.21 1.79-4 4-4z"></path>
                    </svg>
                </span>
                <span class="bui-checkbox-icon bui-checkbox-icon-selected">
                    <svg xmlns="http://www.w3.org/2000/svg" data-pointer="none" viewBox="0 0 32 32">
                        <path d="m13 18.25-1.8-1.8c-.6-.6-1.65-.6-2.25 0s-.6 1.5 0 2.25l2.85 2.85c.318.318.762.468 1.2.448.438.02.882-.13 1.2-.448l8.85-8.85c.6-.6.6-1.65 0-2.25s-1.65-.6-2.25 0l-7.8 7.8zM8 4h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V8c0-2.21 1.79-4 4-4z"></path>
                    </svg>
                </span>
                <span class="bui-checkbox-name">Z轴跟随移动角度</span>
            </label>
        </div>
    </span>
    `;

    // 在setupEnhancedSendButton函数中添加以下代码
    setTimeout(() => {
        const rotateYContainer = document.querySelector('.bpx-player-adv-danmaku-rotateY');
        if (rotateYContainer) {
            rotateYContainer.insertAdjacentHTML('afterend', zRotateFollowHtml);

            // 添加坐标变化监听
            const zRotateFollow = document.querySelector('.z-rotate-follow input');
            const zRotateInput = document.querySelector('.bpx-player-adv-danmaku-rotateZ input');

            function updateZRotate() {
                if (!zRotateFollow.checked) return;

                const startX = parseFloat(document.querySelector('.bpx-player-adv-danmaku-spinner[data-key="startX"] input').value) || 0;
                const startY = parseFloat(document.querySelector('.bpx-player-adv-danmaku-spinner[data-key="startY"] input').value) || 0;
                const endX = parseFloat(document.querySelector('.bpx-player-adv-danmaku-spinner[data-key="endX"] input').value) || 0;
                const endY = parseFloat(document.querySelector('.bpx-player-adv-danmaku-spinner[data-key="endY"] input').value) || 0;

                // 计算角度
                let angle;
                if (startX >= 0 && startX <= 1 && startY >= 0 && startY <= 1 && endX >= 0 && endX <= 1 && endY >= 0 && endY <= 1) {
                    // 考虑屏幕比16:9，计算实际坐标
                    const screenWidth = 16;
                    const screenHeight = 9;
                    const actualStartX = startX * screenWidth;
                    const actualStartY = startY * screenHeight;
                    const actualEndX = endX * screenWidth;
                    const actualEndY = endY * screenHeight;

                    const dx = actualEndX - actualStartX;
                    const dy = actualEndY - actualStartY;
                    angle = Math.atan2(dy, dx) * (180 / Math.PI);
                } else {
                    const dx = endX - startX;
                    const dy = endY - startY;
                    angle = Math.atan2(dy, dx) * (180 / Math.PI);
                }

                // 将角度转换为0-360范围
                angle = (angle + 360) % 360;
                // if (angle > 0) {  
                //     angle = 360 - angle;
                // }
                // 更新Z轴翻转输入框并触发原本绑定的事件
                zRotateInput.value = Math.round(angle);
                // 创建并触发input事件以更新UI
                const event = new Event('input', { bubbles: true });
                zRotateInput.dispatchEvent(event);
                // 触发change事件以确保所有绑定的事件都被调用
                zRotateInput.dispatchEvent(new Event('change', { bubbles: true }));
            }

            // 监听坐标输入变化
            const coordInputs = [
                'startX', 'startY', 'endX', 'endY'
            ].forEach(key => {
                const input = document.querySelector(`.bpx-player-adv-danmaku-spinner[data-key="${key}"] input`);
                input.addEventListener('input', updateZRotate);
            });

            // 监听复选框状态变化
            zRotateFollow.addEventListener('change', updateZRotate);
        }
    }, 200);

}

/**
 * 更新字符数
 * @param {Element} enhancedContainer 
 */
function updateCharCount(enhancedContainer) {
    const contentTextarea = enhancedContainer.querySelector('.ascii-content');
    const charCountSpan = enhancedContainer.querySelector('.ascii-char-count');
    const content = contentTextarea.value;

    const charCount = [...content].length; // 使用扩展运算符正确计算Unicode字符
    charCountSpan.innerHTML = `字数：${charCount}`;

    // 更新title属性以显示完整内容
    contentTextarea.title = content;
}

/**
 * 设置同步字号
 * @param {Document} document 
 * @param {Element} enhancedContainer 
 */
function setupSyncFontSize(document,enhancedContainer) {
    // 处理发送方式选择
    const sendModeSelect = enhancedContainer.querySelector('.ascii-send-mode-select');
    const lineSpacingContainer = enhancedContainer.querySelector('.ascii-line-spacing');
    const syncFontSizeCheckbox = enhancedContainer.querySelector('.sync-font-size input');
    const fontSizeInput = document.querySelector('.bpx-player-adv-danmaku-font-size input');
    
    // 处理发送方式选择
    sendModeSelect.addEventListener('click', (e) => {
        const item = e.target.closest('.bui-select-item');
        if (item) {
            // 更新选中状态
            sendModeSelect.querySelectorAll('.bui-select-item').forEach(el => {
                el.classList.remove('bui-select-item-active');
            });
            item.classList.add('bui-select-item-active');
            
            // 更新显示的文本
            const resultText = sendModeSelect.querySelector('.bui-select-result');
            resultText.textContent = item.textContent;
            
            // 根据选择显示/隐藏行间距输入框
            lineSpacingContainer.style.display = 
                item.getAttribute('data-value') === 'line' ? '' : 'none';
        }
    });

    // 处理同步字号勾选框
    syncFontSizeCheckbox.addEventListener('change', () => {
        if (syncFontSizeCheckbox.checked) {
            // 同步字号
            const lineSpacingInput = document.querySelector('.line-spacing');
            lineSpacingInput.value = fontSizeInput.value;
        }
    });

    // 监听字体大小变化
    fontSizeInput.addEventListener('input', () => {
        if (syncFontSizeCheckbox.checked) {
            const lineSpacingInput = document.querySelector('.line-spacing');
            lineSpacingInput.value = fontSizeInput.value;
        }
    });

    // 监听每行间距变化
    const lineSpacingInput = document.querySelector('.line-spacing');
    lineSpacingInput.addEventListener('input', () => {
        if (syncFontSizeCheckbox.checked) {
            fontSizeInput.value = lineSpacingInput.value;
        }
    });
    
}



function setupAsciiButton(enhancedContainer) {
    // 处理发送方式选择
    const sendModeSelect = enhancedContainer.querySelector('.ascii-send-mode-select');
    const lineSpacingContainer = enhancedContainer.querySelector('.ascii-line-spacing');
    const syncFontSizeContainer = enhancedContainer.querySelector('.ascii-sync-font-size');

    // 同步字号勾选框
    const syncFontSizeCheckbox = document.querySelector('.sync-font-size input');

    // 处理下拉框的显示/隐藏
    const selectHeader = sendModeSelect.querySelector('.bui-select-header');
    const selectList = sendModeSelect.querySelector('.bui-select-list-wrap');
    const selectListUl = sendModeSelect.querySelector('.bui-select-list');


    // 处理字符画内容的字数统计和悬浮展示
    const contentTextarea = enhancedContainer.querySelector('.ascii-content');
    const charCountSpan = enhancedContainer.querySelector('.ascii-char-count');

    // const defaultAscii = ``;
    // contentTextarea.value = defaultAscii;

    // 监听输入事件
    contentTextarea.addEventListener('input', () => updateCharCount(enhancedContainer));
    // 初始化字数统计
    updateCharCount(enhancedContainer);


    selectHeader.addEventListener('click', () => {
        // 切换下拉列表的显示状态
        const isVisible = selectList.style.display === 'block';

        if (!isVisible) {
            // 显示下拉列表时设置正确的高度
            selectList.style.display = 'block';
            // 每个选项24px高，2个选项就是48px
            selectListUl.style.height = '48px';
            selectListUl.style.border = '1px solid #e3e5e7';
        } else {
            // 隐藏时重置样式
            selectList.style.display = 'none';
            selectListUl.style.height = '0px';
            selectListUl.style.border = 'none';
        }

        // 添加/移除active类
        sendModeSelect.classList.toggle('active');
    });

    // 处理选项点击
    selectList.addEventListener('click', (e) => {
        const item = e.target.closest('.bui-select-item');
        if (item) {
            // 更新选中状态
            sendModeSelect.querySelectorAll('.bui-select-item').forEach(el => {
                el.classList.remove('bui-select-item-active');
            });
            item.classList.add('bui-select-item-active');

            // 更新显示的文本
            const resultText = sendModeSelect.querySelector('.bui-select-result');
            resultText.textContent = item.textContent;

            // 隐藏下拉列表
            selectList.style.display = 'none';
            selectListUl.style.height = '0px';
            selectListUl.style.border = 'none';
            sendModeSelect.classList.remove('active');

            // 根据选择显示/隐藏行间距输入框
            lineSpacingContainer.style.display = item.getAttribute('data-value') === 'line' ? '' : 'none';

            syncFontSizeContainer.style.display  = item.getAttribute('data-value') === 'line' ? '' : 'none';
        }
    });

    // 点击外部关闭下拉列表
    document.addEventListener('click', (e) => {
        if (!sendModeSelect.contains(e.target)) {
            selectList.style.display = 'none';
            selectListUl.style.height = '0px';
            selectListUl.style.border = 'none';
            sendModeSelect.classList.remove('active');
        }
    });

    // 处理字符画按钮点击时也要重置下拉列表状态
    const asciiBtn = enhancedContainer.querySelector('[data-style="ascii"]');
    const asciiParams = enhancedContainer.querySelector('.ascii-params');

    asciiBtn.addEventListener('click', () => {
        // 隐藏其他参数区域
        enhancedContainer.querySelectorAll('.enhanced-params-area > div').forEach(div => {
            if (div !== asciiParams) {
                div.style.display = 'none';
            }
        });
        // 显示字符画参数区域
        asciiParams.style.display = 'block';

        // 重置下拉列表状态
        selectList.style.display = 'none';
        selectListUl.style.height = '0px';
        selectListUl.style.border = 'none';
        sendModeSelect.classList.remove('active');
    });

}

/**
 * 测试弹幕样式
 * @param {Object} baseParams 基础弹幕参数
 * @param {Object} params 高级弹幕参数
 * @param {string} currentStyle 当前选中的弹幕样式
 * @param {boolean} istest 是否是测试弹幕
 */
function testStyle(baseParams, params, currentStyle, istest) {

    const baseTime = istest ? Math.floor(window.player.getCurrentTime() * 1000) : parseFloat(baseParams.progress);
    // 转换为弹幕对象数组
    let testDanmakus = [];

    // 基础弹幕对象
    const baseDanmaku = {
        stime: baseTime,
        mode: 7,
        size: baseParams.fontSize,
        date: baseTime,
        pool: 0,
        uhash: '',
    };
    // 根据特效类型生成不同的弹幕组合
    switch (currentStyle) {
        case 'shadow':
            // 阴影效果：生成2条弹幕
            const shadowColor = document.querySelector('.shadow-color').value;
            const offsetX = parseFloat(document.querySelector('.shadow-offset-x').value);
            const offsetY = parseFloat(document.querySelector('.shadow-offset-y').value);

            const shadowParams = { ...params };
            shadowParams.startX = trimTrailingZeros((parseFloat(params.startX) + offsetX).toFixed(3));
            shadowParams.startY = trimTrailingZeros((parseFloat(params.startY) + offsetY).toFixed(3));
            shadowParams.endX = trimTrailingZeros((parseFloat(params.endX) + offsetX).toFixed(3));
            shadowParams.endY = trimTrailingZeros((parseFloat(params.endY) + offsetY).toFixed(3));
            shadowParams.color = shadowColor;

            testDanmakus = [
                {
                    ...baseDanmaku,
                    dmid: `test_shadow_bg_${baseTime}`,
                    color: convertColorToDecimal(shadowColor),
                    text: buildAdvancedDanmakuText(shadowParams)
                },
                {
                    ...baseDanmaku,
                    stime: baseDanmaku.stime + 0.001,
                    dmid: `test_shadow_main_${baseTime}`,
                    color: baseParams.color,
                    text: buildAdvancedDanmakuText(params)
                }
            ];
            break;
        case 'stroke':
            testDanmakus = [];

            const strokeColor = document.querySelector('.stroke-color').value;
            const spacing = document.querySelector('.stroke-spacing').value;
            if (!strokeColor || !spacing) {
                alert('请填写描边颜色和间距');
                return;
            }
            // 发送9条弹幕
            for (let i = 0; i < 9; i++) {
                const currentParams = { ...params };
                currentParams.stroke = 0;

                if (i < 8) {
                    // 前8条是描边，支持小数坐标
                    const positions = [
                        { x: -1, y: -1 }, // 左上
                        { x: 0, y: -1 },  // 中上
                        { x: 1, y: -1 },  // 右上
                        { x: -1, y: 0 },  // 左中
                        { x: 1, y: 0 },   // 右中
                        { x: -1, y: 1 },  // 左下
                        { x: 0, y: 1 },   // 中下
                        { x: 1, y: 1 }    // 右下
                    ];
                    const offsetX = parseFloat(spacing) * positions[i].x;
                    const offsetY = parseFloat(spacing) * positions[i].y;
                    currentParams.startX = trimTrailingZeros((parseFloat(params.startX) + offsetX).toFixed(3));
                    currentParams.startY = trimTrailingZeros((parseFloat(params.startY) + offsetY).toFixed(3));
                    currentParams.endX = trimTrailingZeros((parseFloat(params.endX) + offsetX).toFixed(3));
                    currentParams.endY = trimTrailingZeros((parseFloat(params.endY) + offsetY).toFixed(3));
                    testDanmakus.push({
                        ...baseDanmaku,
                        dmid: `test_stroke_${baseTime}_${i}`,
                        color: convertColorToDecimal(strokeColor),
                        text: buildAdvancedDanmakuText(currentParams)
                    });
                } else {
                    // 最后一条是原始弹幕，时间延迟0.001秒
                    testDanmakus.push({
                        ...baseDanmaku,
                        stime: baseDanmaku.stime + 0.001,
                        dmid: `test_stroke_${baseTime}_${i}`,
                        color: baseParams.color,
                        text: buildAdvancedDanmakuText(currentParams)
                    });
                }
            }

            break;
        case 'background':

            const backgroundColor = document.querySelector('.background-color').value;
            const backgroundChar = document.querySelector('.background-char').value;
            const isVertical = document.querySelector('.vertical-text').checked;

            if (!backgroundColor || !backgroundChar) {
                alert('请填写背景颜色和背景字符');
                return;
            }

            // 发送背景弹幕
            const backgroundParams = { ...params };
            let newText = params.text.replace(/\\n/g, ''); // 清除换行符获取文本长度
            let bgText = backgroundChar.repeat(newText.length);
            let originalText = params.text;

            // 如果勾选了转竖列，转换背景字符和原文本
            if (isVertical) {
                if (!bgText.includes('\\n')) {
                    bgText = convertToVertical(bgText);
                }
                console.log("originalText:", originalText);
                debugger;
                if (!originalText.includes('\\n')) {
                    originalText = convertToVertical(originalText);
                }
                params.text = originalText; // 使用可能转换后的文本
            }

            backgroundParams.text = bgText;
            backgroundParams.fontFamily = 'SimHei';
            backgroundParams.stroke = 0;

            // 背景效果：生成2条弹幕，一个文字一个背景
            testDanmakus = [
                {
                    ...baseDanmaku,
                    dmid: `test_bg_back_${baseTime}`,
                    color: convertColorToDecimal(backgroundColor), // 黑色背景
                    text: buildAdvancedDanmakuText(backgroundParams)
                },
                {
                    ...baseDanmaku,
                    stime: baseDanmaku.stime + 0.001,
                    dmid: `test_bg_text_${baseTime}`,
                    color: baseParams.color,
                    text: buildAdvancedDanmakuText(params)
                }
            ];
            break;
        case 'normal':
            testDanmakus = [
                {
                    ...baseDanmaku,
                    dmid: `test_normal_${baseTime}`,
                    color: baseParams.color,
                    text: buildAdvancedDanmakuText(params)
                }
            ];
            break;
        case 'ascii-line':
            testDanmakus = [];
            const asciiContent = document.querySelector('.ascii-content').value;
            // 分行处理
            const lines = asciiContent.split('\n').filter(line => line);
      
            // 更换Y坐标每行发送模式
            const lineSpacing = parseInt(document.querySelector('.line-spacing').value) || 36;
            let currentY = parseFloat(params.startY);
            let currentEndY = parseFloat(params.endY);

            // 逐行发送
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (!line) continue;

                const asciiParams = {
                    ...params,
                    text: line,
                    startY: currentY,
                    endY: currentEndY
                };

                // 更新Y坐标
                currentY += lineSpacing;
                currentEndY += lineSpacing;

                testDanmakus.push({
                    ...baseDanmaku,
                    dmid: `test_ascii_${baseTime}`,
                    color: baseParams.color,
                    text: buildAdvancedDanmakuText(asciiParams)
                });
            }

            break;
        case 'ascii-coord':
            testDanmakus = [];
            const coordAsciiContent = document.querySelector('.ascii-content').value;
            // 分行处理
            const coordLines = coordAsciiContent.split('\n');

            // 逐行发送
            for (let i = 0; i < coordLines.length; i++) {
                let line = coordLines[i];
                if (!line) continue;

                line = '\n'.repeat(i) + line;  // 将每行弹幕之间插入换行符

                const asciiParams = {
                    ...params,
                    text: line
                };

                testDanmakus.push({
                    ...baseDanmaku,
                    dmid: `test_ascii_coord_${baseTime}`,
                    color: baseParams.color,
                    text: buildAdvancedDanmakuText(asciiParams)
                });
            }

            break;
    }
    console.log(testDanmakus);

    // 预览这些测试弹幕
    previewDanmaku(testDanmakus);

    // if (istest) {
    //     console.log("测试弹幕持续时间:", params.duration);
    //     setTimeout(() => {
    //         console.log("删除测试弹幕");
    //         removePreviewDanmaku(testDanmakus);
    //     }, params.duration * 1000);
    // }
}


/**
 * 加载日期选择器
 */
function loadDatePicker() {
    // 用于存储查找元素的任务配置
    let task = {};

    /**
     * 查找指定选择器的元素并执行回调
     * @param {Object} param0 配置对象
     * @param {string} param0.selector CSS选择器
     * @param {Element} param0.context 查找上下文,默认为document
     * @param {Function} param0.callback 找到元素后的回调函数
     */
    function getElement({ selector, context = document, callback }) {
        const elem = context.querySelector(selector);
        if (elem) {
            callback(elem);
        }
    }

    // 创建MutationObserver用于监听DOM变化
    let ob = new MutationObserver(function (recode) {
        getElement(task);
    });

    // Promise链式调用,按顺序查找并操作各个元素
    return new Promise(resolve => {
        console.log("查找弹幕盒子");
        // 1. 查找弹幕盒子
        task.selector = "#danmukuBox";
        task.callback = resolve;
        getElement(task);
    }).then(danmukuBox => new Promise(resolve => {
        // 2. 监听弹幕盒子的变化,查找折叠面板
        ob.disconnect();
        ob.observe(danmukuBox, {
            "childList": true,
            "subtree": true
        });
        task.selector = "div.bui-collapse-wrap";
        task.context = danmukuBox;
        task.callback = resolve;
        getElement(task);
    })).then(collapseWrap => new Promise(resolve => {
        // 3. 如果面板折叠则展开,查找历史按钮
        if (collapseWrap.classList.contains("bui-collapse-wrap-folded")) {
            collapseWrap.querySelector("div.bui-collapse-header").click();
        }
        task.selector = "div.bpx-player-dm-btn-history";
        task.context = collapseWrap;
        task.callback = resolve;
        getElement(task);
    })).then(datePickerBtn => new Promise(resolve => {
        // 4. 监听历史按钮变化,点击显示日期选择器
        ob.disconnect();
        ob.observe(datePickerBtn, {
            "attributes": true,
            "childList": true,
            "subtree": true
        });

        // 修改这里：使用Promise确保点击事件完成后再继续
        return new Promise(clickResolve => {
            datePickerBtn.click();
            // 给一点时间让日期选择器显示出来
            setTimeout(() => {
                task.selector = "div.bpx-player-date-picker.bpx-player-show";
                task.context = datePickerBtn;
                task.callback = (elem) => {
                    clickResolve(elem);
                    resolve(elem);
                };
                getElement(task);
            }, 100);
        });
    })).then(datePicker => {
        console.log("关闭日期选择器", datePicker);
        // 确保日期选择器存在并且是显示状态
        if (datePicker && datePicker.classList.contains('bpx-player-show')) {
            const historyBtn = datePicker.closest("div.bpx-player-dm-btn-history");
            if (historyBtn) {
                historyBtn.click();
                console.log("日期选择器已关闭");
            } else {
                console.error("未找到历史按钮");
            }
        } else {
            console.error("日期选择器未处于显示状态");
        }
    }).finally(() => {
        ob.disconnect();
    });
}

/**
 * 注入弹幕到播放器
 */
function injectDanmaku(danmakuList) {
    // 将弹幕数据保存到隐藏元素中
    const localDmFile = document.getElementById('localDmFile');
    if (!localDmFile) {
        console.error('未找到本地弹幕容器');
        return;
    }
    // 使用原生方法保存数据
    localDmFile.setAttribute('data-decode-msg', JSON.stringify(danmakuList));

    // 先加载日期选择器，然后触发点击事件
    loadDatePicker().then(() => {
        // 模拟点击历史弹幕面板第一天的记录来触发加载
        const datePickerSelector = "#danmukuBox div.bpx-player-dm-btn-history div.bpx-player-date-picker";
        const datePicker = document.querySelector(datePickerSelector);
        if (!datePicker) return;

        const daySpan = datePicker.querySelector("div.bpx-player-date-picker-day-content span.bpx-player-date-picker-day");
        if (!daySpan) return;

        const fakeElement = daySpan.cloneNode(true);
        fakeElement.setAttribute('data-timestamp', String(new Date().setHours(0, 0, 0, 0) / 1e3));
        fakeElement.setAttribute('data-action', 'changeDay');

        const fakeEvent = new MouseEvent("click");
        Object.defineProperty(fakeEvent, "target", { value: fakeElement });
        datePicker.dispatchEvent(fakeEvent);

        // 延迟一下再自动播放，确保弹幕已经注入
        setTimeout(() => {
            autoPlayAfterPreview();
        }, 100);
    }).catch(error => {
        console.error('加载日期选择器失败:', error);
    });

}

/**
 * 劫持B站的弹幕历史记录加载功能
 */
function hookLoadHistory() {
    // 使用Object.defineProperty劫持全局对象的allHistory属性
    Object.defineProperty(Object.prototype, "allHistory", {
        set(v) {
            // 删除原有属性，防止递归调用
            delete Object.prototype.allHistory;
            let that = this;
            this.allHistory = v;
            // 使用Proxy代理allHistory，拦截获取操作
            this.allHistory = new Proxy(this.allHistory, {
                get(target, prop) {
                    // 清空高级弹幕列表
                    that.dmListStore.basList = [];
                    const basDanmaku = that.nodes.basDanmaku.querySelector('div.bas-danmaku');
                    if (basDanmaku) basDanmaku.innerHTML = "";

                    // 如果不是获取第一条历史记录，直接返回原值
                    if (prop !== "0") {
                        return target[prop];
                    } else {
                        // 获取本地弹幕数据
                        const localDmFile = document.getElementById('localDmFile');
                        const localRemoveDmFile = document.getElementById('localRemoveDmFile');
                        let decodeMsg = localDmFile ? localDmFile.getAttribute('data-decode-msg') : null;
                        let decodeRemoveMsg = localRemoveDmFile ? localRemoveDmFile.getAttribute('data-decode-msg') : null;

                        if (decodeMsg) {
                            // 如果是字符串则解析为对象
                            if (typeof decodeMsg === 'string') {
                                decodeMsg = JSON.parse(decodeMsg);
                            }
                            // 删除弹幕不为空则删除
                            // if (decodeRemoveMsg) {
                            //     debugger;
                            //     console.log("decodeRemoveMsg:", JSON.parse(decodeRemoveMsg));
                            //     if (typeof decodeRemoveMsg === 'string') {
                            //         decodeRemoveMsg = JSON.parse(decodeRemoveMsg);
                            //         for (let i = 0; i < decodeMsg.length; i++) {
                            //             for (let j = 0; j < decodeRemoveMsg.length; j++) {
                            //                 if (decodeRemoveMsg[j].dmid == decodeMsg[i].dmid) {
                            //                     let text = decodeMsg[i].text;
                            //                     console.log("decodeMsg[i].text:", text);
                            //                     let newText = text.split(",");
                            //                     // 将第五个参数值置为空字符串
                            //                     if (newText.length >= 5) {
                            //                         newText[4] = "\"\"";
                            //                     }
                            //                     decodeMsg[i].text = newText.join(","); // 更新text字段
                            //                     console.log("更新后的text:", decodeMsg[i].text);
                            //                 }
                            //             }
                            //         }
                            //     }
                            // }

                            // 合并本地弹幕和历史弹幕
                            return target[prop].then(originList => {
                                // 如果原始列表存在，则合并
                                if (Array.isArray(originList)) {
                                    let newList = [...decodeMsg, ...originList].sort((a, b) => a.stime - b.stime);
                                    return newList;
                                }

                                // 否则只返回本地弹幕
                                return decodeMsg;
                            });
                        } else {
                            // 否则返回原始历史记录
                            return target[prop];
                        }
                    }
                },
            });
        },
        get() {
            return this._allHistory;
        },
        configurable: true,
    });
}

/**
 * 注入弹幕到播放器
 */
function removePreviewDanmaku(danmakuList) {
    // 将弹幕数据保存到隐藏元素中
    const localRemoveDmFile = document.getElementById('localRemoveDmFile');
    if (!localRemoveDmFile) {
        console.error('未找到本地弹幕容器');
        return;
    }
    // 使用原生方法保存数据
    localRemoveDmFile.setAttribute('data-decode-msg', JSON.stringify(danmakuList));

    // 先加载日期选择器，然后触发点击事件
    loadDatePicker().then(() => {
        // 模拟点击历史弹幕面板第一天的记录来触发加载
        const datePickerSelector = "#danmukuBox div.bpx-player-dm-btn-history div.bpx-player-date-picker";
        const datePicker = document.querySelector(datePickerSelector);
        if (!datePicker) return;

        const daySpan = datePicker.querySelector("div.bpx-player-date-picker-day-content span.bpx-player-date-picker-day");
        if (!daySpan) return;

        const fakeElement = daySpan.cloneNode(true);
        fakeElement.setAttribute('data-timestamp', String(new Date().setHours(0, 0, 0, 0) / 1e3));
        fakeElement.setAttribute('data-action', 'changeDay');

        const fakeEvent = new MouseEvent("click");
        Object.defineProperty(fakeEvent, "target", { value: fakeElement });
        datePicker.dispatchEvent(fakeEvent);

        // 延迟一下再自动播放，确保弹幕已经注入
        setTimeout(() => {
            autoPlayAfterPreview();
        }, 100);
    }).catch(error => {
        console.error('加载日期选择器失败:', error);
    });

    // 刷新弹幕
    const player = window.player;
    if (player && player.reloadDanmaku) {
        player.reloadDanmaku();
    }

}

/**
 * 样式弹幕添加事件监听
 */
function setupStyleEventListeners(container) {
    // 默认选中阴影效果
    let currentStyle = 'shadow';

    // 样式切换事件
    const styleButtons = container.querySelector('.enhanced-style-buttons');
    styleButtons.addEventListener('click', (e) => {
        const button = e.target.closest('.bpx-player-adv-danmaku-btn');
        if (!button) return;

        // 更新按钮状态
        styleButtons.querySelectorAll('.bpx-player-adv-danmaku-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        currentStyle = button.dataset.style;

        // 显示对应的参数区域
        container.querySelector('.stroke-params').style.display = currentStyle === 'stroke' ? 'block' : 'none';
        container.querySelector('.shadow-params').style.display = currentStyle === 'shadow' ? 'block' : 'none';
        container.querySelector('.background-params').style.display = currentStyle === 'background' ? 'block' : 'none';
        container.querySelector('.normal-params').style.display = currentStyle === 'normal' ? 'block' : 'none';
        container.querySelector('.ascii-params').style.display = currentStyle === 'ascii' ? 'block' : 'none';
    });

    // 发送按钮事件
    const enhancedButton = container.querySelector('.enhanced-send-btn');
    enhancedButton.addEventListener('click', async () => {
        if (!currentStyle) {
            alert('请选择一个样式');
            return;
        }

        if (currentStyle === 'shadow') {
            await sendShadowDanmaku(currentStyle);
        } else if (currentStyle === 'stroke') {
            await sendStrokeDanmaku(currentStyle);
        } else if (currentStyle === 'background') {
            await sendBackgroundDanmaku(currentStyle);
        } else if (currentStyle === 'normal') {
            await sendNormalDanmaku(currentStyle);
        } else if (currentStyle === 'ascii') {
            await sendAsciiDanmaku(currentStyle);
        }

    });

}

/**
 * 发送字符画弹幕
 */
async function sendAsciiDanmaku(currentStyle) {
    // 获取字符画内容
    const container = document.querySelector('.enhanced-danmaku-container');
    const button = container.querySelector('.enhanced-send-btn');
    const status = container.querySelector('.enhanced-send-status');

    const asciiContent = document.querySelector('.ascii-content').value;
    if (!asciiContent.trim()) {
        alert('请输入字符画内容');
        return;
    }

    // 获取发送方式
    const sendMode = document.querySelector('.ascii-send-mode-select .bui-select-item-active').getAttribute('data-value');

    // 获取基础参数
    const baseParams = await getBaseDanmakuParams();
    if (!baseParams) return;
    const params = getAdvancedDanmakuParams();



    if (sendMode === 'line') {
        // 分行处理
        const lines = asciiContent.split('\n');

        // 更换Y坐标每行发送模式
        const lineSpacing = parseInt(document.querySelector('.line-spacing').value) || 36;
        let currentY = parseFloat(params.startY);
        let currentEndY = parseFloat(params.endY);

        let baseTime = 5 * (lines.length - 1); // 基础时间：1个间隔，5秒
        let estimatedTime = baseTime;
        await updateSendStatus(button, status, `共${lines.length}条弹幕，预计发送${estimatedTime}秒。正在发送中`, true);

        let hasFailure = false;
        let failureCount = 0;

        // 逐行发送
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (!line) continue;
            const asciiParams = {
                ...params,
                text: line,
                startY: currentY,
                endY: currentEndY
            };

            // 更新Y坐标
            currentY += lineSpacing;
            currentEndY += lineSpacing;

            try {
                await sendDanmakuWithRetry(asciiParams, baseParams.color, baseParams.fontSize);
            } catch (error) {
                console.error('阴影弹幕发送失败：' + error.message);
                hasFailure = true;
                failureCount++;
                // 只在第一次失败时更新预计时间
                if (failureCount === 1) {
                    estimatedTime = baseTime + 21; // 增加一次重试的时间
                    await updateSendStatus(button, status, `共${lines.length}条弹幕，预计发送${estimatedTime}秒。正在发送中`, true);
                }
            }

            const waitTime = hasFailure ? 21000 : 5000;
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }

        // 发送完成
        await updateSendStatus(button, status, `共${lines.length}条弹幕，已${hasFailure ? '部分' : '全部'}发送完成`);

        // 立即预览弹幕
        let istest = false;
        testStyle(baseParams, asciiParams, 'ascii-line', istest)

        setTimeout(() => {
            updateSendStatus(button, status, '');
        }, 3000);

    } else if (sendMode === 'coord') {
        debugger;
        // 分行处理
        const coordLines = asciiContent.split('\n');

        let baseTime = 5 * (coordLines.length - 1); // 基础时间：1个间隔，5秒
        let estimatedTime = baseTime;
        await updateSendStatus(button, status, `共${coordLines.length}条弹幕，预计发送${estimatedTime}秒。正在发送中`, true);

        let hasFailure = false;
        let failureCount = 0;

        // 逐行发送
        for (let i = 0; i < coordLines.length; i++) {
            let line = coordLines[i];
            if (!line) continue;

            line = '\\n'.repeat(i) + line;  // 将每行弹幕之间插入换行符
            if (!line) continue;
            const asciiParams = {
                ...params,
                text: line
            };

            try {
                await sendDanmakuWithRetry(asciiParams, baseParams.color, baseParams.fontSize);
            } catch (error) {
                console.error('阴影弹幕发送失败：' + error.message);
                hasFailure = true;
                failureCount++;
                // 只在第一次失败时更新预计时间
                if (failureCount === 1) {
                    estimatedTime = baseTime + 21; // 增加一次重试的时间
                    await updateSendStatus(button, status, `共${lines.length}条弹幕，预计发送${estimatedTime}秒。正在发送中`, true);
                }
            }

            const waitTime = hasFailure ? 21000 : 5000;
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }

        // 发送完成
        await updateSendStatus(button, status, `共${coordLines.length}条弹幕，已${hasFailure ? '部分' : '全部'}发送完成`);

        // 立即预览弹幕
        let istest = false;
        testStyle(baseParams, asciiParams, 'ascii-coord', istest)

        setTimeout(() => {
            updateSendStatus(button, status, '');
        }, 3000);
    } else if (sendMode === 'all') {
        // 整体发送模式
        const text = lines.join('');
        const params = {
            ...baseParams,
            text: text
        };

        try {
            await sendDanmaku(params);
            showMessage('字符画弹幕发送完成');
        } catch (error) {
            console.error('发送失败:', error);
            showMessage('发送失败，请重试');
        }
    }
}


// 辅助函数：更新发送进度
function updateSendingProgress(current) {
    const statusEl = document.querySelector('.enhanced-send-status');
    if (statusEl) {
        const total = parseInt(statusEl.textContent.split('/')[1]);
        statusEl.textContent = `发送进度：${current}/${total}`;
    }
}

/**
 * 获取基础弹幕参数
 */
async function getBaseDanmakuParams() {
    // 尝试多种方式获取 aid 和 cid
    let aid = null;
    let cid = null;

    // 方法1: 从 __INITIAL_STATE__ 获取
    if (window.__INITIAL_STATE__) {
        aid = window.__INITIAL_STATE__.aid;
        cid = window.__INITIAL_STATE__.epInfo?.cid || window.__INITIAL_STATE__.cid;
    }

    // 方法2: 从 URL 获取 BV号，然后查询视频信息获取aid和cid
    if (!aid || !cid) {
        try {
            // 从 URL 中提取 bvid
            const bvidMatch = window.location.pathname.match(/\/video\/(BV[\w]+)/);
            if (bvidMatch) {
                const bvid = bvidMatch[1];
                // 获取分P号,默认为1
                const urlParams = new URLSearchParams(window.location.search);
                const p = parseInt(urlParams.get('p')) || 1;

                // 调用API获取视频信息
                const response = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`);
                const data = await response.json();
                if (data.code === 0) {
                    aid = data.data.aid;
                    // 根据分P获取对应的cid
                    if (data.data.pages && data.data.pages.length >= p) {
                        cid = data.data.pages[p - 1].cid;
                    }
                }
            }
        } catch (error) {
            console.error('获取视频信息失败:', error);
        }
    }

    if (!aid || !cid) {
        alert('获取视频信息失败，请刷新页面重试');
        return null;
    }

    const hexColor = document.querySelector('.bui-color-picker-input input').value;
    const color = convertColorToDecimal(hexColor);
    const fontSize = parseInt(document.querySelector('.bpx-player-adv-danmaku-font-size input').value);

    // 优先使用时间输入框的值
    const inputTime = parseTimeInput();
    const progress = inputTime !== null ? inputTime : Math.floor(window.player.getCurrentTime() * 1000);

    // 尝试多种方式获取 csrf token
    let csrf = document.cookie.match(/bili_jct=([^;]+)/)?.[1];
    if (!csrf) {
        // 尝试从页面全局变量获取
        csrf = window.bili_jct || window.CSRF_TOKEN;
    }

    if (!csrf) {
        alert('获取CSRF Token失败，请确保已登录');
        return null;
    }

    return { aid, cid, color, fontSize, progress, csrf };
}

/**
 * 获取高级弹幕参数
 */
function getAdvancedDanmakuParams() {
    // 获取所有参数
    const startX = document.querySelector('.bpx-player-adv-danmaku-spinner[data-key="startX"] input').value;
    const startY = document.querySelector('.bpx-player-adv-danmaku-spinner[data-key="startY"] input').value;
    const sOpacity = document.querySelector('.bpx-player-adv-danmaku-spinner[data-key="sOpacity"] input').value;
    const eOpacity = document.querySelector('.bpx-player-adv-danmaku-spinner[data-key="eOpacity"] input').value;
    const duration = document.querySelector('.bpx-player-adv-danmaku-spinner[data-key="duration"] input').value;
    const text = document.querySelector('.bpx-player-adv-danmaku-text-input textarea').value;
    const zRotate = document.querySelector('.bpx-player-adv-danmaku-spinner[data-key="zRotate"] input').value;
    const yRotate = document.querySelector('.bpx-player-adv-danmaku-spinner[data-key="yRotate"] input').value;
    const endX = document.querySelector('.bpx-player-adv-danmaku-spinner[data-key="endX"] input').value;
    const endY = document.querySelector('.bpx-player-adv-danmaku-spinner[data-key="endY"] input').value;
    const aTime = document.querySelector('.bpx-player-adv-danmaku-spinner[data-key="aTime"] input').value;
    const aDelay = document.querySelector('.bpx-player-adv-danmaku-spinner[data-key="aDelay"] input').value;
    const stroke = document.querySelector('.bpx-player-adv-danmaku-font-stroke input').checked ? 1 : 0;
    const family = document.querySelector('.bpx-player-adv-danmaku-font-family-select .bui-select-result').textContent;
    const linearSpeedUp = document.querySelector('.bpx-player-adv-danmaku-speedup input').checked ? 1 : 0;

    return {
        startX, startY, sOpacity, eOpacity, duration, text,
        zRotate, yRotate, endX, endY, aTime, aDelay,
        stroke, family, linearSpeedUp
    };
}

/**
 * 发送阴影效果弹幕
 */
async function sendShadowDanmaku(currentStyle) {
    const container = document.querySelector('.enhanced-danmaku-container');
    const button = container.querySelector('.enhanced-send-btn');
    const status = container.querySelector('.enhanced-send-status');

    try {
        const params = getAdvancedDanmakuParams();
        if (!params.text) {
            alert('请输入弹幕内容');
            return;
        }

        const shadowColor = document.querySelector('.shadow-color').value;
        const offsetX = parseFloat(document.querySelector('.shadow-offset-x').value);
        const offsetY = parseFloat(document.querySelector('.shadow-offset-y').value);

        if (!shadowColor || isNaN(offsetX) || isNaN(offsetY)) {
            alert('请填写阴影颜色和偏移值');
            return;
        }

        const baseParams = await getBaseDanmakuParams();
        if (!baseParams) return;

        // 更新发送状态，阴影效果共2条弹幕
        let baseTime = 5; // 基础时间：1个间隔，5秒
        let estimatedTime = baseTime;
        await updateSendStatus(button, status, `共2条弹幕，预计发送${estimatedTime}秒。正在发送中`, true);

        let hasFailure = false;
        let failureCount = 0;

        // 发送阴影弹幕，支持小数坐标
        const shadowParams = { ...params };
        shadowParams.startX = trimTrailingZeros((parseFloat(params.startX) + offsetX).toFixed(3));
        shadowParams.startY = trimTrailingZeros((parseFloat(params.startY) + offsetY).toFixed(3));
        shadowParams.endX = trimTrailingZeros((parseFloat(params.endX) + offsetX).toFixed(3));
        shadowParams.endY = trimTrailingZeros((parseFloat(params.endY) + offsetY).toFixed(3));
        try {
            await sendDanmakuWithRetry(shadowParams, convertColorToDecimal(shadowColor), baseParams.fontSize);
        } catch (error) {
            console.error('阴影弹幕发送失败：' + error.message);
            hasFailure = true;
            failureCount++;
            // 只在第一次失败时更新预计时间
            if (failureCount === 1) {
                estimatedTime = baseTime + 21; // 增加一次重试的时间
                await updateSendStatus(button, status, `共2条弹幕，预计发送${estimatedTime}秒。正在发送中`, true);
            }
        }

        const waitTime = hasFailure ? 21000 : 5000;
        await new Promise(resolve => setTimeout(resolve, waitTime));

        // 发送原始弹幕
        const progress = baseParams.progress + 1;
        try {
            await sendDanmakuWithRetry(params, baseParams.color, baseParams.fontSize, progress);
        } catch (error) {
            console.error('原始弹幕发送失败：' + error.message);
            hasFailure = true;
            failureCount++;
        }

        // 发送完成
        await updateSendStatus(button, status, `共2条弹幕，已${hasFailure ? '部分' : '全部'}发送完成`);

        // 立即预览弹幕
        let istest = false;
        testStyle(baseParams, params, currentStyle, istest)

        setTimeout(() => {
            updateSendStatus(button, status, '');
        }, 3000);

    } catch (error) {
        // 发送失败
        await updateSendStatus(button, status, '发送失败：' + error.message);
        setTimeout(() => {
            updateSendStatus(button, status, '');
        }, 3000);
    }
}

/**
 * 发送描边效果弹幕
 */
async function sendStrokeDanmaku(currentStyle) {
    const container = document.querySelector('.enhanced-danmaku-container');
    const button = container.querySelector('.enhanced-send-btn');
    const status = container.querySelector('.enhanced-send-status');

    try {
        const params = getAdvancedDanmakuParams();
        if (!params.text) {
            alert('请输入弹幕内容');
            return;
        }

        const strokeColor = document.querySelector('.stroke-color').value;
        const spacing = document.querySelector('.stroke-spacing').value;
        if (!strokeColor || !spacing) {
            alert('请填写描边颜色和间距');
            return;
        }

        const baseParams = await getBaseDanmakuParams();
        if (!baseParams) return;

        // 更新发送状态，描边效果共9条弹幕
        let baseTime = 8 * 5; // 基础时间：8个间隔，每个5秒
        let estimatedTime = baseTime;
        await updateSendStatus(button, status, `共9条弹幕，预计发送${estimatedTime}秒。正在发送中`, true);

        let hasFailure = false;
        let failureCount = 0;

        // 发送9条弹幕
        for (let i = 0; i < 9; i++) {
            const currentParams = { ...params };
            currentParams.stroke = 0;

            if (i < 8) {
                // 前8条是描边，支持小数坐标
                const positions = [
                    { x: -1, y: -1 }, // 左上
                    { x: 0, y: -1 },  // 中上
                    { x: 1, y: -1 },  // 右上
                    { x: -1, y: 0 },  // 左中
                    { x: 1, y: 0 },   // 右中
                    { x: -1, y: 1 },  // 左下
                    { x: 0, y: 1 },   // 中下
                    { x: 1, y: 1 }    // 右下
                ];
                const offsetX = parseFloat(spacing) * positions[i].x;
                const offsetY = parseFloat(spacing) * positions[i].y;
                currentParams.startX = trimTrailingZeros((parseFloat(params.startX) + offsetX).toFixed(3));
                currentParams.startY = trimTrailingZeros((parseFloat(params.startY) + offsetY).toFixed(3));
                currentParams.endX = trimTrailingZeros((parseFloat(params.endX) + offsetX).toFixed(3));
                currentParams.endY = trimTrailingZeros((parseFloat(params.endY) + offsetY).toFixed(3));
                try {
                    await sendDanmakuWithRetry(currentParams, convertColorToDecimal(strokeColor), baseParams.fontSize);
                } catch (error) {
                    console.error(`第${i + 1}条弹幕发送失败：${error.message}`);
                    hasFailure = true;
                    failureCount++;
                    // 只在第一次失败时更新预计时间
                    if (failureCount === 1) {
                        estimatedTime = baseTime + 21; // 增加一次重试的时间
                        await updateSendStatus(button, status, `共9条弹幕，预计发送${estimatedTime}秒。正在发送中`, true);
                    }
                    continue;
                }
            } else {
                // 最后一条是原始弹幕，时间延迟0.001秒
                const progress = baseParams.progress + 1;
                try {
                    await sendDanmakuWithRetry(currentParams, baseParams.color, baseParams.fontSize, progress);
                } catch (error) {
                    console.error(`最后一条弹幕发送失败：${error.message}`);
                    hasFailure = true;
                    failureCount++;
                }
            }

            if (i < 8) {
                const waitTime = hasFailure ? 21000 : 5000;
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }

        // 发送完成
        await updateSendStatus(button, status, `共9条弹幕，已${hasFailure ? '部分' : '全部'}发送完成`);

        // 立即预览弹幕
        let istest = false;
        testStyle(baseParams, params, currentStyle, istest)

        setTimeout(() => {
            updateSendStatus(button, status, '');
        }, 3000);

    } catch (error) {
        // 发送失败
        await updateSendStatus(button, status, '发送失败：' + error.message);
        setTimeout(() => {
            updateSendStatus(button, status, '');
        }, 3000);
    }
}

/**
 * 发送文字背景弹幕
 */
async function sendBackgroundDanmaku(currentStyle) {
    const container = document.querySelector('.enhanced-danmaku-container');
    const button = container.querySelector('.enhanced-send-btn');
    const status = container.querySelector('.enhanced-send-status');

    try {
        const params = getAdvancedDanmakuParams();
        if (!params.text) {
            alert('请输入弹幕内容');
            return;
        }

        const backgroundColor = document.querySelector('.background-color').value;
        const backgroundChar = document.querySelector('.background-char').value;
        const isVertical = document.querySelector('.vertical-text').checked;

        if (!backgroundColor || !backgroundChar) {
            alert('请填写背景颜色和背景字符');
            return;
        }

        const baseParams = await getBaseDanmakuParams();
        if (!baseParams) return;

        // 更新发送状态，文字背景效果共2条弹幕
        let baseTime = 5; // 基础时间：1个间隔，5秒
        let estimatedTime = baseTime;
        await updateSendStatus(button, status, `共2条弹幕，预计发送${estimatedTime}秒。正在发送中`, true);

        let hasFailure = false;
        let failureCount = 0;

        // 发送背景弹幕
        const backgroundParams = { ...params };
        let bgText = backgroundChar.repeat(params.text.length);
        let originalText = params.text;

        // 如果勾选了转竖列，转换背景字符和原文本
        if (isVertical) {
            bgText = convertToVertical(bgText);
            originalText = convertToVertical(originalText);
        }

        backgroundParams.text = bgText;
        backgroundParams.fontFamily = 'SimHei';
        backgroundParams.stroke = 0;

        try {
            await sendDanmakuWithRetry(backgroundParams, convertColorToDecimal(backgroundColor), baseParams.fontSize);
        } catch (error) {
            console.error('背景弹幕发送失败：' + error.message);
            hasFailure = true;
            failureCount++;
            // 只在第一次失败时更新预计时间
            if (failureCount === 1) {
                estimatedTime = baseTime + 21; // 增加一次重试的时间
                await updateSendStatus(button, status, `共2条弹幕，预计发送${estimatedTime}秒。正在发送中`, true);
            }
        }

        const waitTime = hasFailure ? 21000 : 5000;
        await new Promise(resolve => setTimeout(resolve, waitTime));

        // 发送原始弹幕
        const progress = baseParams.progress + 1;
        params.text = originalText; // 使用可能转换后的文本
        try {
            await sendDanmakuWithRetry(params, baseParams.color, baseParams.fontSize, progress);
        } catch (error) {
            console.error('原始弹幕发送失败：' + error.message);
            hasFailure = true;
            failureCount++;
        }

        // 发送完成
        await updateSendStatus(button, status, `共2条弹幕，已${hasFailure ? '部分' : '全部'}发送完成`);


        // 立即预览弹幕
        let istest = false;
        testStyle(baseParams, params, currentStyle, istest)

        setTimeout(() => {
            updateSendStatus(button, status, '');
        }, 3000);

    } catch (error) {
        // 发送失败
        await updateSendStatus(button, status, '发送失败：' + error.message);
        setTimeout(() => {
            updateSendStatus(button, status, '');
        }, 3000);
    }
}

/**
 * 发送普通弹幕
 */
async function sendNormalDanmaku(currentStyle) {
    const container = document.querySelector('.enhanced-danmaku-container');
    const button = container.querySelector('.enhanced-send-btn');
    const status = container.querySelector('.enhanced-send-status');

    try {
        const params = getAdvancedDanmakuParams();
        if (!params.text) {
            alert('请输入弹幕内容');
            return;
        }

        const baseParams = await getBaseDanmakuParams();
        if (!baseParams) return;

        // 更新发送状态，文字背景效果共2条弹幕
        let baseTime = 5; // 基础时间：1个间隔，5秒
        let estimatedTime = baseTime;
        await updateSendStatus(button, status, `共1条弹幕，预计发送${estimatedTime}秒。正在发送中`, true);
        let hasFailure = false;

        // 发送原始弹幕
        try {
            await sendDanmakuWithRetry(params, baseParams.color, baseParams.fontSize);
        } catch (error) {
            console.error('原始弹幕发送失败：' + error.message);
            hasFailure = true;
        }

        // 发送完成
        await updateSendStatus(button, status, `共1条弹幕，已${hasFailure ? '部分' : '全部'}发送完成`);

        // 立即预览弹幕
        let istest = false;
        testStyle(baseParams, params, currentStyle, istest)

        setTimeout(() => {
            updateSendStatus(button, status, '');
        }, 3000);

    } catch (error) {
        // 发送失败
        await updateSendStatus(button, status, '发送失败：' + error.message);
        setTimeout(() => {
            updateSendStatus(button, status, '');
        }, 3000);
    }

}

/**
 * 发送单条弹幕
 */
async function sendDanmaku(params, color, fontSize, progress = null) {
    const baseParams = await getBaseDanmakuParams();
    if (!baseParams) return;

    const formData = new URLSearchParams({
        type: 1,
        oid: baseParams.cid,
        msg: buildAdvancedDanmakuText(params, fontSize),
        aid: baseParams.aid,
        progress: progress || baseParams.progress,
        color: color,
        fontsize: fontSize,
        pool: 0,
        mode: 7,
        rnd: Math.floor(Date.now() / 1000),
        csrf: baseParams.csrf
    });
    // 打印当前弹幕发送时间
    console.log(`当前弹幕发送时间: ${new Date().toLocaleString()}`);
    const response = await fetch('https://api.bilibili.com/x/v2/dm/post', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    const result = await response.json();
    if (result.code !== 0) {
        throw new Error(result.message);
    }
}


/**
 * 发送单条弹幕（带重试）
 */
async function sendDanmakuWithRetry(params, color, fontSize, progress = null, retryCount = 1) {
    try {
        await sendDanmaku(params, color, fontSize, progress);
        return true;
    } catch (error) {
        if (retryCount > 0) {
            // 失败后等待21秒重试
            await new Promise(resolve => setTimeout(resolve, 21000));
            return sendDanmakuWithRetry(params, color, fontSize, progress, retryCount - 1);
        }
        throw error;
    }
}


/**
 * 更新发送状态显示
 */
async function updateSendStatus(button, status, text, isLoading = false) {
    // 更新按钮状态
    if (isLoading) {
        button.classList.add('disabled');
        button.style.pointerEvents = 'none';
    } else {
        button.classList.remove('disabled');
        button.style.pointerEvents = 'auto';
    }

    // 更新状态文本显示
    if (text) {
        status.style.display = 'inline-block';
        if (isLoading) {
            let dots = 0;
            const interval = setInterval(() => {
                status.textContent = text + '.'.repeat(dots + 1);
                dots = (dots + 1) % 3;
            }, 500);

            // 保存interval ID到status元素
            status.dataset.intervalId = interval;
        } else {
            // 清除现有的interval
            const intervalId = parseInt(status.dataset.intervalId);
            if (intervalId) {
                clearInterval(intervalId);
                delete status.dataset.intervalId;
            }
            status.textContent = text;
        }
    } else {
        status.style.display = 'none';
        status.textContent = '';
        // 清除interval
        const intervalId = parseInt(status.dataset.intervalId);
        if (intervalId) {
            clearInterval(intervalId);
            delete status.dataset.intervalId;
        }
    }
}

/**
 * 解析XML格式的弹幕文件
 */
function parseXMLDanmaku(content) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(content, 'text/xml');
    const danmakuList = [];

    xml.querySelectorAll('d').forEach(d => {
        const p = d.getAttribute('p').split(',');
        danmakuList.push({
            stime: parseFloat(p[0]) * 1000,
            mode: parseInt(p[1]),
            size: parseInt(p[2]),
            color: parseInt(p[3]),
            date: parseInt(p[4]),
            pool: parseInt(p[5]),
            uhash: p[6],
            dmid: p[7],
            text: d.textContent
        });
    });

    return danmakuList;
}

/**
 * 解析JSON格式的弹幕文件
 */
function parseJSONDanmaku(content) {
    const data = JSON.parse(content);
    return data.map(item => ({
        stime: item.progress || item.stime * 1000,
        mode: item.mode,
        size: item.fontsize,
        color: item.color,
        date: item.ctime,
        pool: 0,
        uhash: '',
        dmid: item.dmid || '',
        text: item.text
    }));
}


/**
 * 解析时间输入框的值，转换为毫秒
 */
function parseTimeInput() {
    /*
    * 支持格式：
    * - 秒数（如：5）
    * - 时间格式：
    *   - M:SS（如：6:05）
    *   - H:MM:SS（如：1:00:01）
    *   - MM:SS（如：06:05）
    *   - HH:MM:SS（如：01:00:01）
    * - 带毫秒的时间格式：
    *   - M:SS.SSS
    *   - H:MM:SS.SSS
    *   - MM:SS.SSS
    *   - HH:MM:SS.SSS
    * 
    */
    const timeInput = document.querySelector('.bpx-player-adv-danmaku-showtime-input input');
    if (!timeInput || !timeInput.value.trim()) return null;

    const value = timeInput.value.trim();

    // 尝试解析时间格式
    if (value.includes(':')) {
        // 先处理可能存在的毫秒部分
        let mainPart = value;
        let milliseconds = 0;

        if (value.includes('.')) {
            const [timePart, msPart] = value.split('.');
            mainPart = timePart;
            // 将毫秒部分标准化为3位数
            milliseconds = parseInt((msPart + '000').slice(0, 3));
        }

        const parts = mainPart.split(':').map(Number);
        let totalMilliseconds = milliseconds;

        // 检查每个部分是否为有效数字
        if (parts.some(isNaN)) return null;

        if (parts.length === 2) {
            // M:SS 或 MM:SS 格式
            const [minutes, seconds] = parts;
            if (seconds >= 60) return null; // 秒数不能超过60
            totalMilliseconds += (minutes * 60 + seconds) * 1000;
            return totalMilliseconds;
        } else if (parts.length === 3) {
            // H:MM:SS 或 HH:MM:SS 格式
            const [hours, minutes, seconds] = parts;
            if (minutes >= 60 || seconds >= 60) return null; // 分秒不能超过60
            totalMilliseconds += (hours * 3600 + minutes * 60 + seconds) * 1000;
            return totalMilliseconds;
        }
    }

    // 尝试解析秒数（支持小数）
    const seconds = parseFloat(value);
    if (!isNaN(seconds)) {
        return Math.floor(seconds * 1000);
    }

    return null;
}


/**
 * 组装高级弹幕文本
 */
function buildAdvancedDanmakuText(params, fontSize) {
    const text = `[${params.startX},${params.startY},"${params.sOpacity}-${params.eOpacity}",${params.duration},"${params.text}",${params.zRotate},${params.yRotate},${params.endX},${params.endY},${params.aTime},${params.aDelay},${params.stroke},"${params.family}",${params.linearSpeedUp}]`;
    return text;
}

/**
 * 将文本转换为竖列格式
 * @param {string} text - 原始文本
 * @returns {string} - 转换后的竖列文本
 */
function convertToVertical(text) {
    return text.split('').join('\\n');
}

/**
 * 将16进制颜色代码转换为10进制
 * @param {string} hexColor - 16进制颜色代码，例如 "#FFFFFF"
 * @returns {number} 10进制颜色值
 */
function convertColorToDecimal(hexColor) {
    // 移除#号并转换为10进制
    return parseInt(hexColor.replace('#', ''), 16);
}


/**
 * 去除数字字符串末尾多余的0
 * @param {string} numStr - 数字字符串
 * @returns {string} - 处理后的数字字符串
 */
function trimTrailingZeros(numStr) {
    return numStr.replace(/\.?0+$/, '');
}

/**
 * 监听并修改弹幕发送时间
 */
function setupDanmakuTimeModifier() {
    // 使用 Proxy 拦截 XMLHttpRequest
    const XHRProxy = new Proxy(XMLHttpRequest, {
        construct(target) {
            const xhr = new target();

            // 保存原始的 open 方法
            const originalOpen = xhr.open;
            xhr.open = function (method, url, ...args) {
                // 标记弹幕发送请求
                if (url.includes('/x/v2/dm/post')) {
                    xhr._isDanmakuRequest = true;
                }
                return originalOpen.call(xhr, method, url, ...args);
            };

            // 保存原始的 send 方法
            const originalSend = xhr.send;
            xhr.send = function (body) {
                if (xhr._isDanmakuRequest && body) {
                    const timeInput = document.querySelector('.bpx-player-adv-danmaku-showtime-input input');
                    if (timeInput && timeInput.value && timeInput.value.includes('.')) {
                        console.log('检测到小数点时间:', timeInput.value);
                        const inputTime = parseTimeInput();
                        if (inputTime !== null) {
                            const formData = new URLSearchParams(body);
                            formData.set('progress', inputTime);
                            body = formData.toString();
                            console.log('出现时间修改后的请求参数:', body);
                        }
                    }
                    const durationInput = document.querySelector('.bpx-player-adv-danmaku-duration .bui-input-input');
                    if (durationInput) {
                        const durationValue = parseFloat(durationInput.value);
                        if (durationValue > 10) {
                            const formData = new URLSearchParams(body);
                            const msgArray = JSON.parse(formData.get('msg'));
                            msgArray[3] = durationValue; // 替换第四个值为新的持续时间
                            formData.set('msg', JSON.stringify(msgArray));
                            body = formData.toString();
                            console.log('生存时间修改后的请求参数:', body);
                        }
                    }
                    const animationTimeInput = document.querySelector('.bpx-player-adv-danmaku-animation-time input');
                    if (animationTimeInput) {
                        const animationTimeValue = parseFloat(animationTimeInput.value);
                        if (animationTimeValue > 10000) {
                            const formData = new URLSearchParams(body);
                            const msgArray = JSON.parse(formData.get('msg'));
                            msgArray[9] = animationTimeValue; // 替换第十个值为新的运动耗时
                            formData.set('msg', JSON.stringify(msgArray));
                            body = formData.toString();
                            console.log('运动耗时修改后的请求参数:', body);
                        }
                    }
                    const animationDelayInput = document.querySelector('.bpx-player-adv-danmaku-animation-delay input');
                    if (animationDelayInput) {
                        const animationDelayValue = parseFloat(animationDelayInput.value);
                        if (animationDelayValue > 10000) {
                            const formData = new URLSearchParams(body);
                            const msgArray = JSON.parse(formData.get('msg'));
                            msgArray[10] = animationDelayValue; // 替换第十一个值为新的延迟时间
                            formData.set('msg', JSON.stringify(msgArray));
                            body = formData.toString();
                            console.log('延迟时间修改后的请求参数:', body);
                        }
                    }
                    const startXInput = document.querySelector('.bpx-player-adv-danmaku-pos-start .bpx-player-adv-danmaku-spinner[data-key="startX"] input');
                    if (startXInput) {
                        const startXValue = parseFloat(startXInput.value);
                        if (startXValue < 0) {
                            const formData = new URLSearchParams(body);
                            const msgArray = JSON.parse(formData.get('msg'));
                            msgArray[0] = startXValue; // 替换第十二个值为新的起始X
                            formData.set('msg', JSON.stringify(msgArray));
                            body = formData.toString();
                        }
                    }
                    const startYInput = document.querySelector('.bpx-player-adv-danmaku-pos-start .bpx-player-adv-danmaku-spinner[data-key="startY"] input');
                    if (startYInput) {
                        const startYValue = parseFloat(startYInput.value);
                        if (startYValue < 0) {
                            const formData = new URLSearchParams(body);
                            const msgArray = JSON.parse(formData.get('msg'));
                            msgArray[1] = startYValue; // 替换第十三个值为新的起始Y
                            formData.set('msg', JSON.stringify(msgArray));
                            body = formData.toString();
                        }
                    }
                    const endXInput = document.querySelector('.bpx-player-adv-danmaku-pos-end .bpx-player-adv-danmaku-spinner[data-key="endX"] input');
                    if (endXInput) {
                        const endXValue = parseFloat(endXInput.value);
                        if (endXValue < 0) {
                            const formData = new URLSearchParams(body);
                            const msgArray = JSON.parse(formData.get('msg'));
                            msgArray[7] = endXValue; // 替换第七个值为新的结束X
                            formData.set('msg', JSON.stringify(msgArray));
                            body = formData.toString();
                        }
                    }
                    const endYInput = document.querySelector('.bpx-player-adv-danmaku-pos-end .bpx-player-adv-danmaku-spinner[data-key="endY"] input');
                    if (endYInput) {
                        const endYValue = parseFloat(endYInput.value);
                        if (endYValue < 0) {
                            const formData = new URLSearchParams(body);
                            const msgArray = JSON.parse(formData.get('msg'));
                            msgArray[8] = endYValue; // 替换第八个值为新的结束Y
                            formData.set('msg', JSON.stringify(msgArray));
                            body = formData.toString();
                            body = formData.toString();
                            console.log('结束Y修改后的请求参数:', body);
                            body = formData.toString();                        
                            console.log('结束Y修改后的请求参数:', body);
                        }
                    }

                }
                return originalSend.call(xhr, body);
            };

            return xhr;
        }
    });

    // 替换原始的 XMLHttpRequest
    window.XMLHttpRequest = XHRProxy;

    // 监听发送按钮以便调试
    const observer = new MutationObserver((mutations, obs) => {
        const sendButton = document.querySelector('.bpx-player-adv-danmaku-send-send .bui-area.bui-button-large');
        if (sendButton && !sendButton.dataset.enhanced) {
            sendButton.dataset.enhanced = 'true';
            sendButton.addEventListener('click', () => {
                const timeInput = document.querySelector('.bpx-player-adv-danmaku-showtime-input input');
                if (timeInput && timeInput.value) {
                    const inputTime = parseTimeInput();
                }
            }, true);
        }
    });

    // 开始观察文档变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

/**
 * 设置样式弹幕的颜色选择器
 */
function setupStyleColorPickers(container) {
    const colorPickers = {
        '.shadow-color': '.shadow-params',
        '.stroke-color': '.stroke-params',
        '.background-color': '.background-params',
    };

    // 添加自定义样式
    const style = document.createElement('style');
    style.textContent = `
            .enhanced-danmaku-container .bui-color-picker-input {
                width: 70px !important;
            }
            .enhanced-danmaku-container .bui-color-picker-input input {
                width: 100% !important;
            }
        `;
    document.head.appendChild(style);

    Object.entries(colorPickers).forEach(([inputSelector, paramsSelector]) => {
        const colorInput = container.querySelector(`${paramsSelector} ${inputSelector}`);
        const displayArea = colorInput.closest('.bui-color-picker-result').querySelector('.bui-color-picker-display');

        // 创建隐藏的颜色选择器
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.style.cssText = `
                width: 0;
                height: 0;
                padding: 0;
                border: none;
                position: absolute;
                visibility: hidden;
            `;
        displayArea.parentNode.appendChild(colorPicker);

        // 点击显示区域时触发颜色选择器
        displayArea.style.cursor = 'pointer';
        displayArea.addEventListener('click', () => {
            colorPicker.value = colorInput.value;
            colorPicker.click();
        });

        // 监听颜色变化
        colorPicker.addEventListener('input', (e) => {
            const hexColor = e.target.value.toUpperCase();
            colorInput.value = hexColor;
            displayArea.style.background = hexColor;
            colorInput.dispatchEvent(new Event('input', { bubbles: true }));
        });

        // 监听输入框变化
        colorInput.addEventListener('input', (e) => {
            const hexColor = e.target.value.toUpperCase();
            displayArea.style.background = hexColor;
        });
    });
}

// 在预览弹幕时自动播放
function autoPlayAfterPreview() {
    console.log("自动播放");

    // 获取播放按钮和音量按钮
    const playButton = document.querySelector('.bpx-player-ctrl-play');
    const volumeButton = document.querySelector('.bpx-player-ctrl-volume-icon');
    if (!playButton) {
        return;
    }

    // 检查当前音量状态
    const playerContainer = document.querySelector('.bpx-player-container');
    const isMuted = playerContainer.classList.contains('bpx-player-volume-0');
    let needRestoreVolume = false;

    // 如果当前有声音，则先静音并延迟播放
    if (!isMuted) {
        console.log("1.临时静音");
        volumeButton.click();
        needRestoreVolume = true;
        // 延迟执行后续操作，确保静音生效
        setTimeout(() => {
            playVideo();
        }, 100);
    } else {
        // 已经是静音状态，直接播放
        playVideo();
    }

    function playVideo() {
        // 如果当前是暂停状态，模拟点击播放按钮
        if (playerContainer.classList.contains('bpx-state-paused')) {
            console.log("2.点击播放按钮");
            playButton.click();

            // 确保弹幕容器也取消暂停状态
            const danmakuContainer = document.querySelector('.bpx-player-row-dm-wrap');
            if (danmakuContainer) {
                danmakuContainer.classList.remove('bili-danmaku-x-paused');
            }

            // 短暂延迟后暂停播放
            setTimeout(() => {
                console.log("3.暂停播放");
                playButton.click();

                // 如果之前有声音，恢复声音
                if (needRestoreVolume) {
                    console.log("4.恢复声音");
                    volumeButton.click();
                }

                // 保持弹幕继续显示
                if (danmakuContainer) {
                    danmakuContainer.classList.remove('bili-danmaku-x-paused');
                }
            }, 500);
        }
    }
}

// 修改预览弹幕的处理函数
function previewDanmaku(currentDanmakuList) {
    if (!currentDanmakuList) {
        return;
    }
    injectDanmaku(currentDanmakuList);
}

(function () {
    'use strict';

    // 初始化劫持弹幕历史记录功能
    hookLoadHistory();

    // 等待 DOM 加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // 确保 document.body 存在
        if (!document.body) {
            setTimeout(init, 100);
            return;
        }

        // 添加隐藏的localDmFile元素
        const localDmFile = document.createElement('div');
        localDmFile.id = 'localDmFile';
        localDmFile.style.display = 'none';
        document.body.appendChild(localDmFile);

        const localRemoveDmFile = document.createElement('div');
        localRemoveDmFile.id = 'localRemoveDmFile';
        localRemoveDmFile.style.display = 'none';
        document.body.appendChild(localRemoveDmFile);

        console.log("启用高级弹幕加强功能");


        // 监听弹幕列表加载
        const listObserver = new MutationObserver((mutations, obs) => {
            const collapseWrap = document.querySelector('.bui-collapse-wrap');
            if (collapseWrap) {
                // 如果是折叠状态，点击展开
                if (collapseWrap.classList.contains('bui-collapse-wrap-folded')) {
                    const header = collapseWrap.querySelector('.bui-collapse-header');
                    if (header) {
                        header.click();
                    }
                }
                obs.disconnect();
            }
        });

        // 开始观察文档变化
        listObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        // addNewFonts();
        // 监听视频播放器加载
        const observer = new MutationObserver((mutations, obs) => {
            const dropdownName = document.querySelector('.bui-dropdown-name');
            if (dropdownName && dropdownName.textContent === '高级弹幕') {
                obs.disconnect();
                setupFontSelector();
                setupEnhancedSendButton();
                bypassDurationLimit();
            }
        });
        setupDanmakuTimeModifier();
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();

// 方案1: 移除输入限制
function removeInputLimit() {
    const durationInput = document.querySelector('.bpx-player-adv-danmaku-duration input');
    if (durationInput) {
        // 克隆并替换节点来移除所有事件监听器
        const newInput = durationInput.cloneNode(true);
        durationInput.parentNode.replaceChild(newInput, durationInput);

        // 移除max属性
        newInput.removeAttribute('max');
        // 更新dataset
        newInput.closest('.bpx-player-adv-danmaku-spinner').dataset.max = '99999';
    }
}

// 方案2: 监听并阻止值被重置
function bypassDurationLimit() {
    // 需要解除限制的输入框选择器列表
    const limitedInputs = [
        '.bpx-player-adv-danmaku-duration input',  // 生存时间
        '.bpx-player-adv-danmaku-animation-time input',  // 运动耗时
        '.bpx-player-adv-danmaku-animation-delay input',  // 延迟时间
        '.bpx-player-adv-danmaku-pos-start .bpx-player-adv-danmaku-spinner[data-key="startX"] input',  // 起始X
        '.bpx-player-adv-danmaku-pos-start .bpx-player-adv-danmaku-spinner[data-key="startY"] input',  // 起始Y
        '.bpx-player-adv-danmaku-pos-end .bpx-player-adv-danmaku-spinner[data-key="endX"] input',  // 结束X
        '.bpx-player-adv-danmaku-pos-end .bpx-player-adv-danmaku-spinner[data-key="endY"] input'  // 结束Y
    ];

    limitedInputs.forEach(selector => {
        const input = document.querySelector(selector);
        if (!input) return;

        let userValue = input.value;

        // 使用MutationObserver监听值的变化
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
                    if (input.value !== userValue) {
                        input.value = userValue;
                    }
                }
            });
        });

        // 监听value属性变化
        observer.observe(input, {
            attributes: true,
            attributeFilter: ['value']
        });

        // 监听用户输入
        input.addEventListener('input', (e) => {
            userValue = e.target.value;
        });

        // 监听失焦事件
        input.addEventListener('blur', () => {
            setTimeout(() => {
                if (input.value !== userValue) {
                    input.value = userValue;
                }
            }, 0);
        });
    });
}

