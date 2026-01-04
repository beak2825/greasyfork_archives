// ==UserScript==
// @name         link工具beta
// @namespace    http://tampermonkey.net/
// @version      0.10.7beta
// @description  点击复制,提取链接
// @author       lwj
// @match        *://m.linkmcn.com/*
// @match        https://m.linkmcn.com/tableCard/redirect*
// @match        *://detail.tmall.com/item*
// @match        *://item.taobao.com/item*
// @match        *://chaoshi.detail.tmall.com/item*
// @match        *://traveldetail.fliggy.com/item*
// @match        *://detail.tmall.hk/hk/item*
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/513288/link%E5%B7%A5%E5%85%B7beta.user.js
// @updateURL https://update.greasyfork.org/scripts/513288/link%E5%B7%A5%E5%85%B7beta.meta.js
// ==/UserScript==

/* global Segmentit */

(function () {
    // 版本号
    var versionTitleTxt = 'Version 0.10.7beta';

    // 检查当前页面 URL 是否匹配指定的网址
    var isHomeURL = function () {
        var currentURL = window.location.href;
        return currentURL.indexOf("https://m.linkmcn.com/#/live/plan?select=") !== -1;
    };

    // 从 localStorage 中获取上一次的 URL，如果没有则设置为空字符串
    let lastCurrentURL = localStorage.getItem('lastCurrentURL') || '';

    var isTableCardURL = function () {
        return window.location.href.indexOf("https://m.linkmcn.com/#/live/plan/tableCard/") !== -1;
    };

    var isBatchPrintURL = function () {
        return window.location.href.indexOf("https://m.linkmcn.com/#/live/plan/batchPrint") !== -1;
    };

    var isTmallItemURL = function () {
        var url = window.location.href;

        // 检查URL是否包含任何指定的域名或路径
        return (
            url.indexOf("https://detail.tmall.com/item") !== -1 ||
            url.indexOf("https://detail.tmall.hk/hk/item") !== -1 ||
            url.indexOf("https://item.taobao.com/item") !== -1 ||
            url.indexOf("https://chaoshi.detail.tmall.com/item") !== -1 ||
            url.indexOf("https://traveldetail.fliggy.com/item") !== -1
        );
    }

    var isRedirectUrl = function () {
        return window.location.href.indexOf("https://item.taobao.com/item.htm?id=682878335608&link_redirectId=") !== -1;
    }

    var notificationTimer; // 通知计时器
    var isHiding = false; // 标志，表示是否正在隐藏通知
    let countSort_notificationTimeout = null;// 排序提示定时器

    let temp_itemId = '';

    class ToggleButtonComponent {
        constructor(localStorageKey, buttonText, dropdownContainer, useSpecialSwitch = 0, defaultState = false) {
            this.localStorageKey = localStorageKey;
            this.switchState = localStorage.getItem(this.localStorageKey) === null ? defaultState : localStorage.getItem(this.localStorageKey) === 'true';
            this.buttonText = buttonText;
            this.dropdownContainer = dropdownContainer;
            this.useSpecialSwitch = useSpecialSwitch === 1;
            this.createComponent();
        }

        createComponent() {
            // 创建按钮容器
            this.buttonContainer = document.createElement('div');
            this.buttonContainer.classList.add('flex', 'items-center', 'dropdown-item');
            this.buttonContainer.style.cssText = 'padding: 12px 16px; user-select: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center;';

            if (this.buttonText === '纯净模式') {
                this.buttonContainer.style.paddingTop = '0px';
            }
            // 创建按钮文本
            this.buttonTextElement = document.createElement('span');
            this.buttonTextElement.textContent = this.buttonText;
            this.buttonTextElement.classList.add('lh-22');

            this.buttonContainer.appendChild(this.buttonTextElement);

            if (this.useSpecialSwitch) {
                // 创建特殊开关样式按钮
                this.createSpecialSwitch();
            } else {
                // 创建普通按钮
                this.createStandardButton();
            }

            // 将按钮容器添加到下拉容器中
            this.dropdownContainer.appendChild(this.buttonContainer);

            // 创建对应的空的子页面并设置样式
            this.secondaryContent = document.createElement('div');
            this.secondaryContent.id = this.localStorageKey + '-secondary-content';
            this.secondaryContent.style.cssText = 'margin: 0px 10px; display: none; padding: 10px 12px; background: #E9E9E9; border: 1px solid #D2D2D2; border-radius: 10px;';

            // 将子页面添加到按钮容器的下方
            this.dropdownContainer.appendChild(this.secondaryContent);
        }

        createStandardButton() {
            this.button = document.createElement('button');
            this.button.id = 'main_standardFunShowButton';
            this.button.style.cssText = 'background: none; border: none; font-size: 16px; cursor: pointer; transition: transform 0.3s; margin: 0px 6px';
            this.button.appendChild(createSVGIcon());
            this.buttonContainer.appendChild(this.button);

            // 绑定点击事件
            this.button.addEventListener('click', () => this.handleStandardButtonClick());
            // 给标题绑定模拟点击开关事件
            this.buttonTextElement.addEventListener('click', () => this.titleToSwitchClick());
        }

        handleStandardButtonClick() {
            // 切换二级页面显示状态
            const secondaryContent = document.getElementById(this.localStorageKey + '-secondary-content');
            if (secondaryContent) {
                secondaryContent.style.display = secondaryContent.style.display === 'block' ? 'none' : 'block';
            } else {
                console.log(`${this.buttonText} 二级页面异常`);
            }

            // 旋转按钮图标
            const icon = this.button.querySelector('svg');
            const rotation = icon.style.transform === 'rotate(90deg)' ? 'rotate(0deg)' : 'rotate(90deg)';
            icon.style.transform = rotation;
        }

        createSpecialSwitch() {
            this.button = document.createElement('button');
            this.button.innerHTML = '<div class="ant-switch-handle"></div><span class="ant-switch-inner"><span class="ant-switch-inner-checked"></span><span class="ant-switch-inner-unchecked"></span></span>';
            this.button.setAttribute('type', 'button');
            this.button.setAttribute('role', 'switch');
            this.button.setAttribute('aria-checked', this.switchState); // 设置开关状态
            this.button.classList.add('ant-switch', 'css-9fw9up');
            if (this.switchState) {
                this.button.classList.add('ant-switch-checked');
            }
            this.buttonContainer.appendChild(this.button);
            this.buttonContainer.style.cursor = 'default';

            // 添加点击事件监听
            this.button.addEventListener('click', () => this.handleSwitchClick());
        }

        handleSwitchClick() {
            // 切换开关状态
            const newState = this.button.getAttribute('aria-checked') === 'true' ? 'false' : 'true';
            this.button.setAttribute('aria-checked', newState);

            if (newState === 'true') {
                this.button.classList.add('ant-switch-checked');
                showNotification(`${this.buttonText}：开启`);
            } else {
                this.button.classList.remove('ant-switch-checked');
                showNotification(`${this.buttonText}：关闭`);
            }

            // 更新开关状态
            updateSwitchState(this.localStorageKey, newState === 'true');
        }

        titleToSwitchClick() {
            // 模拟点击开关按钮
            this.button.click();
        }

        remove_titleToSwitchClick() {
            // 移除模拟点击开关按钮
            this.buttonTextElement.removeEventListener('click', () => this.titleToSwitchClick());
        }

        // 获取开关状态
        getSwitchState() {
            if (noneDrawColor()) {
                return false;
            } else {
                return this.button.getAttribute('aria-checked') === 'true';
            }
        }

        // 获取子页面元素
        getSecondaryContent() {
            return this.secondaryContent;
        }
    }

    class SonToggleButtonComponent extends ToggleButtonComponent {
        constructor(localStorageKey, buttonText, dropdownContainer, descriptionText, useSpecialSwitch = false, defaultState = false) {
            super(localStorageKey, buttonText, dropdownContainer, useSpecialSwitch, defaultState);
            this.buttonText = buttonText;
            this.descriptionText = descriptionText;

            this.createAdditionalContent();
        }

        // 创建附加内容容器
        createAdditionalContent() {
            // 修改按钮文本样式并去除 class="lh-22"
            this.buttonTextElement.style.cssText = 'font-size: 14px; margin: 0;';
            this.buttonTextElement.classList.remove('lh-22');

            // 调整父类的内容容器样式
            this.buttonContainer.style.cssText = 'display: flex; user-select: none; justify-content: space-between; align-items: center; padding: 0;';

            // 新增的说明容器
            this.descriptionContainer = document.createElement('div');
            this.descriptionContainer.classList.add('description-content');
            this.descriptionContainer.style.cssText = 'font-size: 12px; color: #9B9B9B; user-select: none; margin: 5px 0px; padding-bottom: 5px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #D2D2D2; white-space: pre-wrap;';
            this.descriptionContainer.textContent = this.descriptionText;

            if (this.descriptionText === '') this.descriptionContainer.style.paddingBottom = '0px';

            // 子设置容器
            this.childSettingsContainer = document.createElement('div');
            this.childSettingsContainer.classList.add('child-settings');
            this.childSettingsContainer.style.cssText = 'display: block; justify-content: space-between; align-items: center;';

            // 初始化子开关容器的样式
            this.updateSwitchStyle();

            // 将说明容器和子设置容器添加到下拉容器中
            this.dropdownContainer.appendChild(this.buttonContainer);
            this.dropdownContainer.appendChild(this.descriptionContainer);
            this.dropdownContainer.appendChild(this.childSettingsContainer);
        }

        // 重写createSpecialSwitch以添加额外的类
        createSpecialSwitch() {
            // 确保父类方法被正确调用
            super.createSpecialSwitch();

            // 确保 this.button 已初始化
            if (!this.button) {
                console.error('this.button is not initialized');
                return;
            }

            // 将函数定义为对象的方法
            this.autoInput_handleSwitchClick = () => {
                if (!this.getSwitchState()) {
                    itemSort_inputConter.showSwitchDiv(true);  // 显示输入内容选择框
                    itemSort_countInputFun.showNumberControlDiv(false);  // 隐藏数字控制区
                    itemSort_countInputFun.toggleDivButtonState(false);  // 关闭数字控制按钮
                }
            };

            if (this.buttonText === '自动填充') {
                // console.log(this.buttonText);
                this.button.addEventListener('click', () => this.autoInput_handleSwitchClick());
            }

            // 添加额外的类
            this.button.classList.add('ant-switch-small');
        }

        // 独立的方法用于更新开关样式
        updateSwitchStyle() {
            if (!this.getSwitchState()) {
                initializeContainerStyle(this.childSettingsContainer, false); // 使用函数初始化
            }
        }

        // 控制单独组件的开启关闭
        showSwitchDiv(flag) {
            if (flag) {
                initializeContainerStyle(this.buttonContainer, true);
                initializeContainerStyle(this.descriptionContainer, true);
            } else {
                initializeContainerStyle(this.buttonContainer, false);
                initializeContainerStyle(this.descriptionContainer, false);
            }
        }

        createSelectBox(options = ['', '0', '1', '2', '3', '999'], savedKey = this.localStorageKey + '_savedValue', container = this.buttonContainer) {
            // 先移除button元素
            if (this.button) {
                this.buttonContainer.removeChild(this.button);
            }

            // 创建下拉框
            const selectBox = document.createElement('select');
            selectBox.setAttribute('id', this.localStorageKey + '-select-box');
            selectBox.style.cssText = `
                font-size: 14px;
                margin: 0;
                width: 42px;
                height: 18px;
                border: 1px solid rgb(155, 155, 155);
                background-color: rgb(249,249,249);
                color: rgb(155, 155, 155);
                border-radius: 20px;
                padding: 0 2.5%;
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                position: relative;
                cursor: pointer;
            `;

            options.forEach(value => {
                const option = document.createElement('option');
                option.value = value;
                option.style.cssText = `
                    text-align: center;
                    padding: 0 5px;
                `;
                option.textContent = value === '' ? '空' : value;
                selectBox.appendChild(option);
            });

            const savedValue = localStorage.getItem(savedKey) || options[1];
            selectBox.value = savedValue;

            selectBox.addEventListener('change', () => {
                localStorage.setItem(savedKey, selectBox.value);
                updateSwitchState(this.localStorageKey, selectBox.value);

                // 悬浮时和激活时边框颜色变化
                selectBox.style.borderColor = '#ff6200';
            });

            // 悬浮时和激活时边框颜色变化
            selectBox.addEventListener('mouseover', function () {
                selectBox.style.borderColor = '#ff6200';
            });

            selectBox.addEventListener('mouseout', function () {
                if (!selectBox.matches(':focus')) {
                    selectBox.style.borderColor = 'rgb(155, 155, 155)';
                }
            });

            selectBox.addEventListener('focus', function () {
                selectBox.style.borderColor = '#ff6200';
            });

            selectBox.addEventListener('blur', function () {
                selectBox.style.borderColor = 'rgb(155, 155, 155)';
            });

            container.appendChild(selectBox);
        }

        createDivButton(beforeText, afterText, onClickCallback = null, container = this.buttonContainer) {
            // 先移除button元素
            if (this.button) {
                this.buttonContainer.removeChild(this.button);
            }

            this.beforeText = beforeText;
            this.afterText = afterText;
            this.onClickCallback = onClickCallback;

            // 功能开启按钮
            this.divButton = document.createElement('div');
            this.divButton.setAttribute('id', this.localStorageKey + '_divButton');
            this.divButton.textContent = beforeText;
            this.divButton.style.cssText = `
                font-size: 14px;
                margin: 0;
                width: 42px;
                height: 18px;
                border: 1px solid rgb(155, 155, 155);
                background-color: rgb(249,249,249);
                color: rgb(155, 155, 155);
                border-radius: 20px;
                padding: 0 2%;
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                position: relative;
                cursor: pointer;
                user-select: none;
                text-align: center;
            `;

            // 悬浮时和激活时边框颜色变化
            this.divButton.addEventListener('mouseover', () => {
                if (this.divButton.textContent === beforeText) {
                    this.divButton.style.borderColor = '#ff6200';
                }
                else {
                    this.divButton.style.borderColor = 'rgb(155, 155, 155)';
                }
            });

            this.divButton.addEventListener('mouseout', () => {
                if (this.divButton.textContent === beforeText) {
                    this.divButton.style.borderColor = 'rgb(155, 155, 155)';
                }
                else {
                    this.divButton.style.borderColor = 'rgb(249, 249, 249)';
                }
            });

            // 按钮点击事件
            this.divButton.addEventListener('click', () => {
                this.toggleDivButtonState();
            });

            container.appendChild(this.divButton);
        }

        // 控制单独组件的开启关闭
        toggleDivButtonState(isActivated = null) {
            // 如果提供了isActivated参数，则根据参数设置状态，否则根据当前状态切换
            const shouldActivate = isActivated !== null ? isActivated : (this.divButton.textContent === this.beforeText);

            if (shouldActivate) {
                this.divButton.textContent = this.afterText;
                this.divButton.style.color = '#fff';
                this.divButton.style.backgroundColor = '#ff0000';
                this.divButton.style.borderColor = '#fff';
                showNotification(`${this.buttonText}：开启`);
                if (this.onClickCallback) {
                    this.onClickCallback(true);
                }
            } else {
                this.divButton.textContent = this.beforeText;
                this.divButton.style.color = 'rgb(155, 155, 155)';
                this.divButton.style.backgroundColor = 'rgb(249,249,249)';
                this.divButton.style.borderColor = 'rgb(155, 155, 155)';
                showNotification(`${this.buttonText}：关闭`);
                if (this.onClickCallback) {
                    this.onClickCallback(false);
                }
            }
        }

        // 判断开关开启状态
        getDivButtonState() {
            if (this.divButton.textContent === this.beforeText) {
                return false;// 开关开启状态
            } else {
                return true;// 开关关闭状态
            }
        }

        createNumberControDiv(defaultNumber = 0, single = false, countType = 'none', savedKey = this.localStorageKey + '_savedValue', container = this.buttonContainer) {
            if (single) {
                //先移除button元素
                if (this.button) {
                    this.buttonContainer.removeChild(this.button);
                }
            }

            // 数字文本及SVG控制区
            this.numberControDiv = document.createElement('div');
            this.numberControDiv.style.cssText = `
                font-size: 14px;
                display: flex;
                align-items: center;
                min-width: 42px;
                height: 18px;
                width: auto;
                border: 1px solid rgb(155, 155, 155);
                background-color: rgb(249,249,249);
                color: rgb(155, 155, 155);
                border-radius: 20px;
                padding: 0 2.5%;
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                position: relative;
                cursor: default;
            `;

            // 数字文本
            this.countText = document.createElement('span');
            this.countText.textContent = defaultNumber; // 使用默认数字
            this.countText.style.cssText = 'font-size: 14px; margin: 0 auto; cursor: pointer;';
            this.numberControDiv.appendChild(this.countText);

            // 创建函数来设置悬停颜色
            function addHoverEffect(svgElement) {
                svgElement.addEventListener('mouseover', function () {
                    var path = svgElement.querySelector('path');
                    if (path) {
                        path.setAttribute('data-original-fill', path.getAttribute('fill'));
                        path.setAttribute('fill', '#ff6200');
                    }
                });

                svgElement.addEventListener('mouseout', function () {
                    var path = svgElement.querySelector('path');
                    if (path) {
                        path.setAttribute('fill', path.getAttribute('data-original-fill'));
                    }
                });
            }

            // SVG控制区
            var svgControlDiv = document.createElement('div');
            svgControlDiv.style.cssText = 'display: flex; flex-direction: column; justify-content: space-between; cursor: pointer;';

            // 上方SVG
            var svgUp = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgUp.setAttribute("width", "6");
            svgUp.setAttribute("height", "6");
            svgUp.setAttribute("viewBox", "0 0 1024 1024");
            svgUp.innerHTML = `
                            <path d="M854.016 739.328l-313.344-309.248-313.344 309.248q-14.336 14.336-32.768 21.504t-37.376 7.168-36.864-7.168-32.256-21.504q-29.696-28.672-29.696-68.608t29.696-68.608l376.832-373.76q14.336-14.336 34.304-22.528t40.448-9.216 39.424 5.12 31.232 20.48l382.976 379.904q28.672 28.672 28.672 68.608t-28.672 68.608q-14.336 14.336-32.768 21.504t-37.376 7.168-36.864-7.168-32.256-21.504z" fill="#8a8a8a"></path>
                        `;
            addHoverEffect(svgUp);
            svgControlDiv.appendChild(svgUp);

            // 下方SVG
            var svgDown = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgDown.setAttribute("width", "6");
            svgDown.setAttribute("height", "6");
            svgDown.setAttribute("viewBox", "0 0 1024 1024");
            svgDown.innerHTML = `
                            <path d="M857.088 224.256q28.672-28.672 69.12-28.672t69.12 28.672q29.696 28.672 29.696 68.608t-29.696 68.608l-382.976 380.928q-12.288 14.336-30.72 19.968t-38.912 4.608-40.448-8.704-34.304-22.016l-376.832-374.784q-29.696-28.672-29.696-68.608t29.696-68.608q14.336-14.336 32.256-21.504t36.864-7.168 37.376 7.168 32.768 21.504l313.344 309.248z" fill="#8a8a8a"></path>
                        `;
            addHoverEffect(svgDown);
            svgControlDiv.appendChild(svgDown);

            svgUp.addEventListener('click', () => this.updateCount(1, 'countInput'));
            svgDown.addEventListener('click', () => this.updateCount(-1, 'countInput'));

            this.numberControDiv.appendChild(svgControlDiv);
            container.appendChild(this.numberControDiv);

            // 绑定点击事件以显示弹窗
            this.countText.addEventListener('click', () => {
                createDropdownModal(dropdownContainer, '输入计数').then((inputValue) => {
                    // console.log('用户输入:', inputValue);
                    if (parseInt(inputValue) >= 0 && parseInt(inputValue) <= 999) {
                        this.countText.textContent = inputValue; // 更新显示的数字
                        this.countSort_reShowNotification(0); // 更新通知
                    } else if (parseInt(inputValue) > 999) {
                        showNotification('输入值超过了合理的范围', 1500);
                    } else {
                        showNotification('输入值必须为正整数', 1500);
                    }
                }).catch((error) => {
                    // console.log('弹窗取消:', error);
                });
            });
        }

        // 用于更新数字文本的方法
        updateCount(increment, notificationType) {
            let currentValue = parseInt(this.countText.textContent);
            currentValue += increment;
            this.setCount(currentValue);

            if (notificationType === 'countInput') {
                if (this.getCount() > 0) {
                    showNotification(`下一个输入序号：${currentValue}`, 0);
                } else {
                    this.setCount(1);
                    showNotification('当前已是最小序号', 1500);
                    this.countSort_reShowNotification();
                }
            }
        }

        // 获取当前的计数
        getCount() {
            return this.countText.textContent;
        }

        // 设置当前计数
        setCount(count) {
            this.countText.textContent = count;
        }

        // 控制numberControDiv显示/隐藏的方法
        showNumberControlDiv(visible) {
            if (this.numberControDiv) {
                this.numberControDiv.style.display = visible ? 'flex' : 'none';
            }
        }

        // 常显通知方法
        countSort_reShowNotification(show_time = 1500) {
            if (countSort_notificationTimeout) {
                clearTimeout(countSort_notificationTimeout);
            }
            countSort_notificationTimeout = setTimeout(() => {
                if (this.getDivButtonState()) {
                    showNotification("下一个输入序号：" + this.getCount(), 0);
                }
                countSort_notificationTimeout = null;
            }, show_time); // 延迟后触发
        }

        // 重写handleSwitchClick以控制子页面的可点击性
        handleSwitchClick() {
            super.handleSwitchClick();

            const newState = this.getSwitchState();
            initializeContainerStyle(this.childSettingsContainer, newState);
        }

        // 获取子设置容器
        getChildSettingsContainer() {
            return this.childSettingsContainer;
        }

        getSelectBoxValue() {
            const selectBox = this.buttonContainer.querySelector('select');
            return selectBox ? selectBox.value : null;
        }
    }

    // 创建开关容器元素
    var switchesContainer = document.createElement('div');
    switchesContainer.classList.add('flex', 'items-center', 'justify-between', 'pb-12');
    switchesContainer.style.cssText = 'position: fixed; top: 0px; left: 50%; transform: translateX(-50%); z-index: 9999;';
    if (isHomeURL()) {
        document.body.appendChild(switchesContainer);
    }

    // 封装函数返回SVG图标
    function createSVGIcon() {
        var svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgIcon.setAttribute('class', 'icon custom-svg'); // 添加自定义类名
        svgIcon.setAttribute('viewBox', '0 0 1024 1024');
        svgIcon.setAttribute('width', '20');
        svgIcon.setAttribute('height', '20');
        svgIcon.setAttribute('fill', '#bbbbbb');
        svgIcon.innerHTML = '<path d="M288.791335 65.582671l446.41733 446.417329-446.41733 446.417329z"></path>';
        svgIcon.style.cssText = 'vertical-align: middle;'; // 垂直居中样式

        return svgIcon;
    }

    // 添加事件监听用于下拉箭头
    document.addEventListener('mouseenter', function (event) {
        if (event.target instanceof Element && event.target.matches('svg.icon.custom-svg')) { // 仅匹配具有自定义类名的SVG
            event.target.setAttribute('fill', '#ff6200');
        }
    }, true);

    document.addEventListener('mouseleave', function (event) {
        if (event.target instanceof Element && event.target.matches('svg.icon.custom-svg')) { // 仅匹配具有自定义类名的SVG
            event.target.setAttribute('fill', '#bbbbbb');
        }
    }, true);

    var dropdown_style = document.createElement('style');
    dropdown_style.textContent = `
        @keyframes dropdownContentAnimation {
            0% {
                transform: translateX(-50%) translateY(14px) scale(0);
            }
            100% {
                transform: translateX(-50%) translateY(0) scale(1);
            }
        }

        @keyframes dropdownContentExitAnimation {
            0% {
                transform: translateX(-50%) translateY(0) scale(1);
            }
            100% {
                transform: translateX(-50%) translateY(14px) scale(0);
            }
        }

        #dropdownContent.show {
            animation: dropdownContentAnimation 0.3s ease-out;
        }

        #dropdownContent.hide {
            animation: dropdownContentExitAnimation 0.3s ease-out;
        }

        @keyframes dropdownButtonAnimation {
            0% { transform: scale(1); }
            35% { transform: scale(1.15, 1.3); }
            85% { transform: scale(0.94); }
            100% { transform: scale(1); }
        }

        #dropdownButtonAnimate.animate {
            animation: dropdownButtonAnimation 0.45s ease-out;
        }
    `;

    document.head.appendChild(dropdown_style);

    var dropdownContainer = document.createElement('div');
    dropdownContainer.style.cssText = 'position: relative; display: inline-block;';

    var dropdownButtonName = '更多功能';

    var dropdownButton = document.createElement('button');
    dropdownButton.id = 'dropdownButtonAnimate'; // 添加 id 以便于应用动画
    dropdownButton.textContent = dropdownButtonName;
    dropdownButton.style.cssText = 'margin-top: 0px; padding: 0px 10px; cursor: pointer; border-radius: 999px;z-index: 3;';
    dropdownButton.classList.add('ant-btn', 'css-9fw9up', 'ant-btn-default', 'primaryButton___N3z1x');

    var dropdownDeck = document.createElement('div');
    dropdownDeck.style.cssText = `
        top: 0;
        left: 0;
        width: 200px;
        height: 60px;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    var dropdownContent = document.createElement('div');
    dropdownContent.id = 'dropdownContent';
    dropdownContent.style.cssText = `
        display: none;
        position: absolute;
        background-color: #f9f9f9;
        top: 0px;
        left: 50%;
        transform: translateX(-50%);
        min-width: 200px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
        border-radius: 16px;
        max-height: 360px;
        overflow-y: auto; /* 使用 auto 可以根据内容是否溢出显示滚动条 */
        scrollbar-width: none; /* 隐藏滚动条，适用于 Firefox */
        -ms-overflow-style: none; /* 隐藏滚动条，适用于 IE 和 Edge */
        transform-origin: top center;
    `;

    // 获取内容的显示状态
    function getDropdownContentDisplayState() {
        return dropdownContent.style.display !== 'none'; // 返回 true 表示可见，false 表示不可见
    }

    var dropdownMask = document.createElement('div');
    dropdownMask.style.cssText = `
        position: sticky;
        top: 0;
        left: 0;
        width: 200px;
        height: 60px;
        backdrop-filter: none;
        border-radius: 10px 10px 0 0;
        box-sizing: border-box;
        border-bottom: 0px solid #DDD;
        z-index: 99; /* 确保遮罩在内容上方 */
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(249, 249, 249, 0);
    `;

    dropdownDeck.appendChild(dropdownButton);
    dropdownContainer.appendChild(dropdownDeck);
    dropdownContent.appendChild(dropdownMask);

    dropdownContainer.appendChild(dropdownContent);
    switchesContainer.appendChild(dropdownContainer);

    function on_dropdownMask() {
        dropdownMask.style.borderBottom = '1px solid #DDD';
        dropdownMask.style.backdropFilter = 'blur(8px) brightness(90%)';
        dropdownMask.style.backgroundColor = 'rgba(249, 249, 249, 0.5)';
    }

    function off_dropdownMask() {
        dropdownMask.style.borderBottom = '0px solid #DDD';
        dropdownMask.style.backdropFilter = 'none';
        dropdownMask.style.backgroundColor = 'rgba(249, 249, 249, 0)';
    }

    dropdownButton.addEventListener('click', function () {
        // 强制重新开始动画
        this.classList.remove('animate');

        // 使用 requestAnimationFrame 确保动画类已被移除
        requestAnimationFrame(() => {
            this.classList.add('animate');
        });

        this.addEventListener('animationend', function () {
            this.classList.remove('animate');
        }, { once: true });

        if (dropdownContent.style.display === 'none' || dropdownContent.classList.contains('hide')) {
            dropdownContent.style.display = 'block';
            pureMode_infoDisplay(pureSwitch.getSwitchState());
            dropdownContent.classList.remove('hide');
            dropdownContent.classList.add('show');
            if (dropdownContent.scrollTop > 0) {
                on_dropdownMask();
            }
        } else {
            dropdownContent.classList.remove('show');
            dropdownContent.classList.add('hide');
            dropdownContent.addEventListener('animationend', function onAnimationEnd() {
                if (dropdownContent.classList.contains('hide')) {
                    dropdownContent.style.display = 'none';
                    pureMode_infoDisplay(pureSwitch.getSwitchState());
                    off_dropdownMask();
                }
                dropdownContent.removeEventListener('animationend', onAnimationEnd);
            });
        }
    });

    dropdownContent.addEventListener('scroll', function () {
        if (dropdownContent.scrollTop > 0 && dropdownContent.style.display !== 'none') {
            on_dropdownMask();
        }
        else {
            off_dropdownMask();
        }
    });

    window.addEventListener('click', function (event) {
        if (!dropdownContainer.contains(event.target)) {
            if (dropdownContent.style.display === 'block') {
                dropdownContent.classList.remove('show');
                dropdownContent.classList.add('hide');

                // 强制重新开始动画
                dropdownButton.classList.remove('animate');

                // 使用 requestAnimationFrame 确保动画类已被移除
                requestAnimationFrame(() => {
                    dropdownButton.classList.add('animate');
                });

                dropdownButton.addEventListener('animationend', function () {
                    this.classList.remove('animate');
                }, { once: true });

                dropdownContent.addEventListener('animationend', function onAnimationEnd() {
                    if (dropdownContent.classList.contains('hide')) {
                        dropdownContent.style.display = 'none';
                        off_dropdownMask();
                        pureMode_infoDisplay(pureSwitch.getSwitchState());
                    }
                    dropdownContent.removeEventListener('animationend', onAnimationEnd);
                });
            }
        }
    });

    class PIPManager {
        constructor(itemLink, spanElement, isHorizontal) {
            this.itemLink = itemLink;
            this.spanElement = spanElement;
            this.isHorizontal = isHorizontal;
            this.PIP = this.createPIP();
            this.ctrlBar = this.createControlBar();
            this.bar = this.createBar();
            this.witheCtrlBar = this.createWitheCtrlBar();
            this.iframe = this.createIframe();
            this.spanElement.onclick = this.togglePIP.bind(this);

            this.collapseButton = null; // 用于存储收起后的矩形按钮

            // 初始化状态
            this.isDragging = false;
            this.offsetX = 0;
            this.offsetY = 0;
            this.isCollapsed = false; // 收起状态

            // 添加拖动事件监听（只在控制条上）
            this.bar.addEventListener('mousedown', this.startDrag.bind(this));
            document.addEventListener('mouseup', this.stopDrag.bind(this));
            document.addEventListener('mousemove', this.drag.bind(this));

            // 监听窗口大小变化
            window.addEventListener('resize', this.onWindowResize.bind(this));
        }

        countSclaeWidthAndHeight(p) {
            const scale = this.getDisplayScale();
            const calculatedLength = p / scale;

            if (calculatedLength > 90) {
                return 90;
            }
            if (calculatedLength < 45) {
                return 45;
            }

            return calculatedLength;
        }

        createPIP() {
            const PIP = document.createElement('div');
            PIP.id = 'mini_PIP';
            PIP.style.cssText = `
                position: fixed;
                bottom: 10px;
                background-color: rgba(0, 0, 0, 0.5);
                padding: 5px;
                padding-top: 3px;
                border-radius: 24px;
                display: none;
                z-index: 1099;
                backdrop-filter: blur(10px) brightness(90%);
                overflow: hidden;
                transform: scale(1);
                transition: transform 0.5s ease, opacity 0.5s ease; /* 更新过渡效果时间 */
            `;

            if (sonMain_PIP_defautPosition.getSelectBoxValue() === '左侧') {
                PIP.style.left = '10px';
                PIP.style.transformOrigin = 'bottom left'; /* 设置缩放的锚点 */

            } else {
                PIP.style.right = '10px';
                PIP.style.transformOrigin = 'bottom right'; /* 设置缩放的锚点 */
            }
            PIP.style.width = this.isHorizontal ? "1300px" : "360px";

            PIP.style.transform = `scale(${this.getDisplayScale()})`;
            PIP.style.height = this.isHorizontal ? this.countSclaeWidthAndHeight(90) + "%" : this.countSclaeWidthAndHeight(90) + "%";

            return PIP;
        }

        getDisplayScale(isHorizontal = this.isHorizontal) {
            const displayWidth = window.innerWidth;
            let displayScale = displayWidth / 1530;
            if (isHorizontal) {
                return displayScale * 0.7;
            } else {
                return displayScale;
            }
        }

        getBarDisplayPX(px, isHorizontal = this.isHorizontal) {
            return px / this.getDisplayScale(isHorizontal) + 'px';
        }

        onWindowResize() {
            // 调整PIP的缩放比例和尺寸
            const newScale = this.getDisplayScale();
            this.PIP.style.transform = `scale(${newScale})`;

            // 重新计算PIP的高度
            this.PIP.style.height = this.isHorizontal ? this.countSclaeWidthAndHeight(90) + "%" : this.countSclaeWidthAndHeight(90) + "%";

            // 调整控制条的高度和其他尺寸
            this.ctrlBar.style.height = this.getBarDisplayPX(12);
            this.ctrlBar.style.fontSize = this.getBarDisplayPX(10); // 动态调整 ctrlBar 的字体大小
            this.bar.style.height = this.getBarDisplayPX(7);
            this.bar.style.width = this.getBarDisplayPX(60);
        }

        createControlBar() {
            const ctrlBar = document.createElement('div');
            ctrlBar.style.cssText = `
                height: ${this.getBarDisplayPX(12)};
                width: 100%;
                background-color: rgba(0, 0, 0, 0);
                z-index: 1101;
                margin-bottom: 3px;
                font-size: ${this.getBarDisplayPX(10)}; /* 初始字体大小 */
            `;
            return ctrlBar;
        }

        createWitheCtrlBar() {
            const witheCtrlBar = document.createElement('div');
            witheCtrlBar.style.cssText = `
                display: flex;
                align-items: center; /* 垂直居中 */
                justify-content: space-between; /* 左右对齐 */
                height: 100%;
                width: calc(100% - 20px);
                margin: 0 auto;
                position: relative; /* 使子元素可以绝对定位 */
            `;

            const leftButtonsContainer = document.createElement('div');
            leftButtonsContainer.style.cssText = `
                display: flex;
                align-items: center; /* 垂直居中 */
                justify-content: flex-start; /* 左对齐 */
                height: 100%;
            `;
            const rightButtonsContainer = document.createElement('div');
            rightButtonsContainer.style.cssText = `
                display: flex;
                align-items: center; /* 垂直居中 */
                justify-content: flex-end; /* 右对齐 */
                height: 100%;
            `;

            this.returnButton = this.createBarButton("返回", "returnButton", "left");
            this.newWindowButton = this.createBarButton("新窗口", "newWindowButton", "right", "rgb(0, 145, 255)");
            this.closeButton = this.createBarButton("关闭", "closeButton", "right", "rgba(236, 40, 39, 0.5)");
            this.reloadButton = this.createBarButton("刷新", "reloadButton", "left");
            this.collapseButton = this.createBarButton("收起", "collapseButton", "right");

            // 添加按钮点击事件
            this.closeButton.addEventListener('click', this.closePIP.bind(this));
            this.reloadButton.addEventListener('click', this.reloadPIP.bind(this));
            this.returnButton.addEventListener('click', this.returnPIP.bind(this));
            this.newWindowButton.addEventListener('click', this.newWindowPIP.bind(this));
            this.collapseButton.addEventListener('click', this.toggleCollapse.bind(this));

            leftButtonsContainer.appendChild(this.returnButton);
            leftButtonsContainer.appendChild(this.reloadButton);
            rightButtonsContainer.appendChild(this.collapseButton);
            rightButtonsContainer.appendChild(this.newWindowButton);
            rightButtonsContainer.appendChild(this.closeButton);

            // 按钮隐藏
            if (!this.isHorizontal) {
                this.newWindowButton.style.display = 'none';
            }

            // 将按钮容器添加到witheCtrlBar
            witheCtrlBar.appendChild(leftButtonsContainer);
            witheCtrlBar.appendChild(this.bar);
            witheCtrlBar.appendChild(rightButtonsContainer);

            return witheCtrlBar;
        }

        createBar() {
            const bar = document.createElement('div');
            bar.style.cssText = `
                height: ${this.getBarDisplayPX(7)};
                mangrgin-bottom: 1px;
                width: 60px;
                background-color: rgba(255, 255, 255, 0.5);
                border-radius: 999px;
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
            `;
            return bar;
        }

        createBarButton(buttonName = "按钮", buttonId = "mini-PIP-barButton", position = "center", bg_color = "rgba(173, 173, 173, 0.5)") {
            const newButton = document.createElement('button');
            newButton.id = buttonId;
            newButton.style.cssText = `
                font-size: 1em; /* 使用em单位来确保字体大小跟随ctrlBar */
                padding: 0 10px;
                background-color: ${bg_color};
                border: none;
                border-radius: 999px;
                margin: 0 5px;
                color: white;
                cursor: pointer;
                user-select: none;
            `;
            newButton.innerText = buttonName;

            if (position === "left") {
                newButton.style.marginRight = 'auto';
            } else if (position === "right") {
                newButton.style.marginLeft = 'auto';
            }

            return newButton;
        }

        createIframe() {
            const iframe = document.createElement('iframe');
            iframe.style.cssText = `
                display: block;
                width: 100%;
                height: calc(100% - ${this.ctrlBar.style.height} - ${this.ctrlBar.style.marginBottom});
                border: none;
                border-radius: 19px;
                z-index: 1099;
                transition: opacity 0.3s ease;
            `;
            return iframe;
        }

        togglePIP() {
            const pipElement = document.getElementById('mini_PIP');
            const pip_restore_button = document.getElementById('pip_restore_button');

            if (pip_restore_button) {
                pip_restore_button.remove(); // 先移除恢复按钮
            }
            if (pipElement) {
                pipElement.parentElement.removeChild(pipElement);
            }

            // 先添加控制条，再添加iframe
            this.ctrlBar.appendChild(this.witheCtrlBar);
            this.PIP.appendChild(this.ctrlBar);
            this.PIP.appendChild(this.iframe);

            document.body.appendChild(this.PIP);
            this.iframe.src = this.itemLink;
            this.PIP.style.transition = 'transform 0.3s ease, opacity 0.3s ease'; // 过渡效果

            this.PIP.style.display = 'block';

            setTimeout(() => {
                this.PIP.style.opacity = '1'; // 恢复透明度
            }, 0);

            adapterPIP_forTableCardAndBatchPrint(sonMain_PIP_autoAdjust.getSwitchState());
        }

        startDrag(event) {
            // adapterPIP_forTableCardAndBatchPrint(sonMain_PIP_autoAdjust.getSwitchState(), true);
            this.isDragging = true;
            this.offsetX = event.clientX - this.PIP.offsetLeft;
            this.offsetY = event.clientY - this.PIP.offsetTop;
            this.bar.style.cursor = 'grabbing';
            this.iframe.style.opacity = '0'; // 透明
        }

        stopDrag() {
            this.isDragging = false;
            this.bar.style.cursor = 'grab';
            // adapterPIP_forTableCardAndBatchPrint(sonMain_PIP_autoAdjust.getSwitchState());
            this.iframe.style.opacity = '1'; // 取消透明
        }

        drag(event) {
            if (this.isDragging) {
                this.PIP.style.left = `${event.clientX - this.offsetX}px`;
                this.PIP.style.top = `${event.clientY - this.offsetY}px`;
                adapterPIP_forTableCardAndBatchPrint(sonMain_PIP_autoAdjust.getSwitchState());
                this.iframe.style.zIndex = '1'; // 置于底层
            }
        }

        closePIP() {
            // this.PIP.style.display = 'none';
            this.PIP.style.transformOrigin = 'center center'; // 设置缩放的锚点
            this.PIP.style.transform = 'scale(0.1)'; // 缩小
            this.PIP.style.opacity = '0'; // 逐渐透明
            adapterPIP_forTableCardAndBatchPrint(sonMain_PIP_autoAdjust.getSwitchState(), true);
            setTimeout(() => {
                this.PIP.style.display = 'none';
                this.PIP.style.transform = `scale(${this.getDisplayScale()})`; // 恢复
                this.PIP.style.transformOrigin = 'bottom right;'; // 设置缩放
            }, 300); // 等待动画结束后再隐藏
        }

        reloadPIP() {
            this.iframe.src = this.iframe.src;
        }

        returnPIP() {
            window.history.back();
        }

        newWindowPIP() {
            window.open(this.itemLink);
        }

        toggleCollapse() {
            if (this.isCollapsed) {
                this.expandPIP();
            } else {
                this.collapsePIP();
            }
        }

        collapsePIP() {
            this.PIP.style.transformOrigin = ''; // 设置缩放的锚点
            // 获取当前PIP的位置
            const pipRect = this.PIP.getBoundingClientRect();
            const centerX = pipRect.left + pipRect.width / 2;

            // 判断PIP位置，决定收起方向
            const isLeftSide = centerX < window.innerWidth / 2;

            // 计算目标位置的中心点
            const targetX = isLeftSide ? -(window.innerWidth / 2) : (window.innerWidth / 2); // 收起到左侧或右侧

            // 设置PIP收起动画
            this.PIP.style.transition = 'transform 0.5s ease, opacity 0.5s ease'; // 过渡效果
            this.PIP.style.transform = `translate(${targetX}px, 0px) scale(0.1)`; // 缩小并移动到目标位置
            this.PIP.style.opacity = '0'; // 逐渐透明
            adapterPIP_forTableCardAndBatchPrint(sonMain_PIP_autoAdjust.getSwitchState(), true);

            setTimeout(() => {
                setTimeout(() => {
                    this.PIP.style.display = 'none';
                }, 200); // 等待动画结束后再隐藏
                this.createRestoreButton(isLeftSide); // 创建恢复按钮
                this.isCollapsed = true; // 设置为已收起状态
            }, 300); // 等待动画结束后再隐藏
        }

        expandPIP() {
            this.PIP.style.transformOrigin = ''; // 设置缩放的锚点
            this.PIP.style.display = 'block';
            this.PIP.style.bottom = '10px'; // 恢复到原位置
            this.PIP.style.right = '10px'; // 恢复到原位置
            adapterPIP_forTableCardAndBatchPrint(sonMain_PIP_autoAdjust.getSwitchState());

            setTimeout(() => {
                this.PIP.style.transform = `scale(${this.getDisplayScale()})`;
                this.PIP.style.opacity = '1'; // 恢复透明度
                this.removeRestoreButton(); // 移除恢复按钮
                this.PIP.style.transformOrigin = 'bottom right'; // 设置缩放的锚点
            }, 0); // 立即开始动画
            this.isCollapsed = false; // 设置为未收起状态
        }

        createRestoreButton(isLeftSide) {
            const restoreButton = document.createElement('div');
            restoreButton.id = 'pip_restore_button';
            restoreButton.style.cssText = `
                position: fixed;
                bottom: 50%; /* 调整到50%高度位置 */
                ${isLeftSide ? 'left' : 'right'}: 0px; /* 根据位置调整 */
                width: 52px;
                height: 50px;
                background-color: rgba(0, 0, 0, 0.5);
                border-radius: 10px;
                ${isLeftSide ? 'border-top-left-radius: 0px;' : 'border-top-right-radius: 0px;'} /* 调整圆角 */
                ${isLeftSide ? 'border-bottom-left-radius: 0px;' : 'border-bottom-right-radius: 0px;'} /* 调整圆角 */
                z-index: 1100;
                cursor: pointer;
                transition: opacity 0.3s ease;
            `;
            restoreButton.addEventListener('click', this.expandPIP.bind(this));

            const iconDiv = document.createElement('div');
            const imgUrl = getTableCardImageUrl();
            iconDiv.style.cssText = `
                width: 40px;
                height: 40px;
                margin: 5px;
                ${isLeftSide ? 'margin-left' : 'margin-right'}: 7px; /* 根据位置调整 */
                ${imgUrl ? 'background-image: url(' + imgUrl + ');' : 'background-image: url("https://www.taobao.com/favicon.ico");'}
                background-size: cover;
                border-radius: 5px;
            `;

            restoreButton.appendChild(iconDiv);
            document.body.appendChild(restoreButton);
            this.restoreButton = restoreButton; // 存储恢复按钮引用
        }

        removeRestoreButton() {
            if (this.restoreButton) {
                document.body.removeChild(this.restoreButton);
                this.restoreButton = null; // 清除引用
            }
        }
    }

    // 版本描述区域
    var versionTitle = document.createElement('p');
    versionTitle.textContent = versionTitleTxt;
    versionTitle.style.cssText = `
        font-size: 12px;
        line-height: 1.8; /* 调整行高 */
        margin: 0 20px;
        justify-content: center; /* 使用 flex 居中对齐 */
        align-items: center;
        border-top: 1px solid #D2D2D2;
        text-align: center; /* 居中文本 */
        color: #9B9B9B;
        display: flex; /* 添加 display: flex 以使用 flexbox 布局 */
        cursor: pointer; /* 鼠标指针 */
        user-select: none;
    `;

    var isExpanded_versionTitle = false; // 用于跟踪当前状态

    // 悬浮时显示“展开所有菜单”或“折叠所有菜单”
    versionTitle.addEventListener('mouseover', function () {
        versionTitle.textContent = isExpanded_versionTitle ? '折叠所有菜单' : '展开所有菜单';
    });

    // 鼠标移开时恢复原始文本
    versionTitle.addEventListener('mouseout', function () {
        versionTitle.textContent = versionTitleTxt;
    });

    // 点击事件处理
    versionTitle.addEventListener('click', function () {
        // 执行点击操作，展开或折叠所有菜单
        document.querySelectorAll('#main_standardFunShowButton').forEach(button => button.click());

        // 切换状态并更新悬浮文本
        isExpanded_versionTitle = !isExpanded_versionTitle;
        versionTitle.textContent = versionTitleTxt; // 恢复原始文本
    });

    // 更新本地存储的开关状态
    var updateSwitchState = function (switchName, newState) {
        localStorage.setItem(switchName, newState.toString());
    };


    // 通用子菜单容器样式的函数
    function initializeContainerStyle(container, state) {
        if (!state) {
            container.style.opacity = '0.4';// 设置透明度使内容变浅
            container.style.pointerEvents = 'none';// 禁止点击操作
        } else {
            container.style.opacity = '';// 恢复透明度
            container.style.pointerEvents = '';// 恢复点击操作
        }
    }

    var notification_style = document.createElement('style');
    notification_style.type = 'text/css';
    notification_style.innerHTML = `
        @keyframes showNotification {
            0% {
                transform: translateX(-50%) scale(0);
            }
            40% {
                transform: translateX(-50%) scale(.96);
            }
            55% {
                transform: translateX(-50%) scale(1.04);
            }
            100% {
                transform: translateX(-50%) scale(1);
            }
        }

        @keyframes hideNotification {
            5% {
                transform: translateX(-50%) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateX(-50%) scale(0.2);
            }
        }

        @keyframes notificationButtonAnimation {
            0% { transform: translateX(-50%) scale(1); }
            100% { transform: translateX(-50%) scale(1.15); opacity: 0;}
        }

        .notification {
            cursor: default;
            position: fixed;
            bottom: 60px;
            left: 50%;
            background-color: rgba(0, 0, 0, 0.5);
            color: #fff;
            padding: 10px;
            border-radius: 12px;
            display: none;
            z-index: 9999;
            backdrop-filter: blur(10px) brightness(90%); /* 添加模糊效果 */
            -webkit-backdrop-filter: blur(10px); /* 兼容Safari浏览器 */
            transform-origin: center;
            width: auto; /* 默认宽度 */
            max-width: 68%;
            white-space: nowrap; /* 单行显示 */
            overflow: hidden; /* 超出内容隐藏 */
            text-overflow: ellipsis; /* 溢出省略号 */
            text-align: center; /* 文本居中显示 */
            transform: translateX(-50%); /* 初始水平居中 */
        }
    `;
    document.head.appendChild(notification_style);

    // 创建通知弹窗
    var NotificationContainer = document.createElement('div');
    NotificationContainer.classList.add('notification');
    NotificationContainer.id = 'showNotificationContainer';
    document.body.appendChild(NotificationContainer);

    // 将开关和按钮加入页面
    // 添加纯净模式开关控件
    const pureSwitch = new ToggleButtonComponent('pureSwitch', '纯净模式', dropdownContent, 1);
    // 添加复制开关控件
    const old_copySwitchContainer = new ToggleButtonComponent('copySwitch', '点击店名复制', dropdownContent);
    // 添加提取商品链接控件
    const newonlyItemIdButtonContainer = new ToggleButtonComponent('newmainOnlyItemIdSwitchState', '链接自动提取', dropdownContent);
    // 添加手卡截图控件
    const tableCardPngSwitchContainer = new ToggleButtonComponent('tableCardPngSwitchState', '快捷截图', dropdownContent,);
    // 添加商品排序开关控件
    const itemSortButtonContainer = new ToggleButtonComponent('mainItemSortButtonSwitchState', '商品排序', dropdownContent);
    // 添加挂链工具开关控件
    const newGuaLian_onlyItemIdSwitch = new ToggleButtonComponent('newGuaLian_onlyItemIdSwitch', '挂链工具', dropdownContent);
    // 添加着色与计算器开关控件
    const drawColorAndCalculatorContainer = new ToggleButtonComponent('mainDrawColorAndCalculatorContainer', '着色与计算器(Beta)', dropdownContent);
    // 添加画中画开关控件
    const pictureInPictureSwitchContainer = new ToggleButtonComponent('pictureInPictureSwitchState', '小窗模式', dropdownContent);
    // 添加辅助功能开关控件
    const AuxiliaryFunctionsContainer = new ToggleButtonComponent('AuxiliaryFunctionsContainer', '辅助功能', dropdownContent);
    dropdownContent.appendChild(versionTitle); // 版本说明

    // 复制开关子功能区域
    const main_copySwitch = old_copySwitchContainer.getSecondaryContent();
    const copySwitchContainer = new SonToggleButtonComponent('copySwitchContainer', '点击店名复制', main_copySwitch, "点击店铺名称时，自动复制店铺链接到剪切板", 1);
    const copySwitch_onlyPart = new SonToggleButtonComponent('copySwitch_onlyPart', '部分复制触发方式', copySwitchContainer.getChildSettingsContainer(), "设置复制部分内容的触发方式", 1);
    const copySwitch_onlyPart_clickCount = ['单击', '双击'];
    copySwitch_onlyPart.createSelectBox(copySwitch_onlyPart_clickCount);
    const copySwitch_smartCpoy = new SonToggleButtonComponent('copySwitch_smartCpoy', '复制长度', copySwitchContainer.getChildSettingsContainer(), "设置复制内容的长度", 1);
    const copySwitch_smartCpoy_length = ['默认', '智能'];
    copySwitch_smartCpoy.createSelectBox(copySwitch_smartCpoy_length);

    // 提取链接子功能区域
    const main_onlyItemIdSwitch = newonlyItemIdButtonContainer.getSecondaryContent();
    const sonMain_onlyItemIdSwitch = new SonToggleButtonComponent('mainOnlyItemIdSwitchState', '链接自动提取', main_onlyItemIdSwitch, "当点击商品链接窗口时，会主动提取当前剪切板中的商品链接，并更新你的剪切板", 1);
    const mainOnlyItemId_autoSave = new SonToggleButtonComponent('mainOnlyItemId_autoSave_state', '自动保存', sonMain_onlyItemIdSwitch.getChildSettingsContainer(), '替换链接后自动点击“保存”按钮', 1);
    const mainOnlyItemId_checkTtemLink = new SonToggleButtonComponent('mainOnlyItemId_checkTtemLink_state', '链接检查', sonMain_onlyItemIdSwitch.getChildSettingsContainer(), '链接中不存在12位ID时，使用“警告”替换当前剪切板\n\n开启此功能会引起剪切板冲突', 1);

    // 辅助挂链子功能区域，正式从提取链接子功能区域独立
    const mainGuaLian_onlyItemIdSwitch = newGuaLian_onlyItemIdSwitch.getSecondaryContent();
    const sonMain_onlyItemIdForSearchDiv = new SonToggleButtonComponent('sonMain_onlyItemIdForSearchDiv_state', '搜索框自动提取ID', mainGuaLian_onlyItemIdSwitch, "当点击“全局筛选”搜索框时，会主动提取当前剪切板中的商品id，并更新你的剪切板", 1);
    const onlyItemIdForSearchDiv_onlyNoIntroduce = new SonToggleButtonComponent('mainOnlyItemIdonlyItemIdForSearchDiv_onlyNoIntroduce_state', '仅在挂链中生效', sonMain_onlyItemIdForSearchDiv.getChildSettingsContainer(), '开启后只会在“挂链商品”中生效该功能', 1, true);
    const onlyItemIdForSearchDiv_autoInputSort = new SonToggleButtonComponent('onlyItemIdForSearchDiv_autoInputSort', '自动输入排序', sonMain_onlyItemIdForSearchDiv.getChildSettingsContainer(), '开启后会给上播id正确的商品，自动输入“商品排序”中设定好的内容', 1);
    const sonMain_autoFlagedSwitch = new SonToggleButtonComponent('sonMain_autoFlagedSwitch_state', '批量输入排序', mainGuaLian_onlyItemIdSwitch, "当在“挂链”页面时，“全局筛选”搜索框右侧会出现“批量处理”按钮，可以将当前剪切板中的所有链接，自动标记为“自动填充”的目标内容", 1);
    const sonMain_linkAllCopySwitch = new SonToggleButtonComponent('sonMain_linkAllCopySwitch_state', '完整复制', mainGuaLian_onlyItemIdSwitch, "当在“挂链”页面时，“全局筛选”搜索框右侧会出现“完整复制”按钮，会主动复制当前剪切板中店铺的所有商品链接到剪切板", 1);

    // 快捷截图子功能区域
    const main_tableCardPngSwitch = tableCardPngSwitchContainer.getSecondaryContent();
    const sonMain_tableCardPngSwitch = new SonToggleButtonComponent('main_tableCardPngSwitch', '手卡截图', main_tableCardPngSwitch, "截取当前页面的手卡并添加到剪切板", 1);
    const tableCardPng_resolution = new SonToggleButtonComponent('mainTableCardPng_resolution', '清晰度', sonMain_tableCardPngSwitch.getChildSettingsContainer(), "设置截图的清晰度\n\n注意：更低的清晰度并不能提高截图的响应速度", 1);
    const tableCardPng_resolution_select = ['普通', '高清', '超清'];
    tableCardPng_resolution.createSelectBox(tableCardPng_resolution_select);
    const tableCardPng_checkItemIdRow = new SonToggleButtonComponent('tableCardPng_checkItemIdRow', '上播ID核对', sonMain_tableCardPngSwitch.getChildSettingsContainer(), "截图时在手卡中添一行“上播ID”，以便核对是否正确", 1);
    const tableCardPng_checkItemIdRow_onlyPng = new SonToggleButtonComponent('tableCardPng_checkItemIdRow_onlyPng', '仅截图时显示', tableCardPng_checkItemIdRow.getChildSettingsContainer(), "开启后仅在截图时会含有“上播id核对行”", 1);

    // 自动填充子功能区域
    const main_itemSort = itemSortButtonContainer.getSecondaryContent();
    const sonMain_itemSortSwitch = new SonToggleButtonComponent('main_itemSort_SwitchState_1', '自动填充', main_itemSort, "点击排序时自动自动清空或输入", 1);
    const itemSort_inputConter = new SonToggleButtonComponent('itemSort_inputConter', '输入内容', sonMain_itemSortSwitch.getChildSettingsContainer(), "设置自动输入的默认内容", 1);
    const itemSort_inputConter_input = ['空', '0', '1', '2', '3', '999', '2536'];
    itemSort_inputConter.createSelectBox(itemSort_inputConter_input);
    const itemSort_countInputFun = new SonToggleButtonComponent('itemSort_countInputFun', '计数输入', sonMain_itemSortSwitch.getChildSettingsContainer(), "将“输入内容”更新为当前计数，以方便排序", 1);
    itemSort_countInputFun.createNumberControDiv(10, false, 'countInput');
    itemSort_countInputFun.createDivButton('开始', '退出',
        (isActivated) => {
            if (isActivated) {
                itemSort_countInputFun.showNumberControlDiv(true);  // 显示数字控制区
                itemSort_countInputFun.setCount(1);
                itemSort_countInputFun.countSort_reShowNotification();// 计数通知显示恢复
                itemSort_inputConter.showSwitchDiv(false);  // 隐藏输入内容选择框
                temp_itemId = '';
                itemSort_countInputFun_rateInput.showSwitchDiv(false);  // 隐藏十倍计数输入框
            } else {
                itemSort_countInputFun.showNumberControlDiv(false);  // 隐藏数字控制区
                itemSort_inputConter.showSwitchDiv(true);  // 显示输入内容选择框
                itemSort_countInputFun_rateInput.showSwitchDiv(true);  // 显示十倍计数输入框

            }
        }
    );
    itemSort_countInputFun.showNumberControlDiv(false);
    const itemSort_countInputFun_rateInput = new SonToggleButtonComponent('itemSort_countInputFun_rateInput', '十倍计数输入', sonMain_itemSortSwitch.getChildSettingsContainer(), "计数输入内容为计数的十倍", 1);
    const itemSort_anchorSort = new SonToggleButtonComponent('itemSort_anchorSort', '主播排序', sonMain_itemSortSwitch.getChildSettingsContainer(), "根据输入内容，按照当前商品顺序，进行主播排序", 1);
    itemSort_anchorSort.createDivButton('开始', '退出',
        (isActivated) => {
            if (isActivated) {
                if (itemSort_countInputFun.getDivButtonState()) {
                    const button = document.getElementById('itemSort_countInputFun_divButton');
                    button.click();

                    itemSort_countInputFun.showNumberControlDiv(false);  // 隐藏数字控制区
                    itemSort_inputConter.showSwitchDiv(true);  // 显示输入内容选择框
                }
                processItems();
            }
            else {
                // 检查是否已有弹窗存在，如果有则移除
                const existingModal = document.querySelector('.dropdown-modal');
                if (existingModal) {
                    existingModal.style.display = 'none';
                    dropdownButton.style.display = ''; // 恢复按钮
                }
            }
        }
    );
    const itemSort_autoSort = new SonToggleButtonComponent('itemSort_autoSort', '自动排序', sonMain_itemSortSwitch.getChildSettingsContainer(), "根据输入内容，对当前商品自动进行排序", 1);
    itemSort_autoSort.createDivButton('开始', '退出',
        async (isActivated) => {
            if (isActivated) {
                // 测试函数
                let AutoSortItemText = await createDropdownModal(dropdownContainer, '自动排序');
                const autoSort = new AutoSortItem(AutoSortItemText);
                showNotification('开始排序');
                autoSort.startSort();
            }
            else {
                // 检查是否已有弹窗存在，如果有则移除
                const existingModal = document.querySelector('.dropdown-modal');
                if (existingModal) {
                    existingModal.style.display = 'none';
                    dropdownButton.style.display = ''; // 恢复按钮
                }
            }
        }
    );

    // 着色与计算器子功能区域
    const main_drawColorAndCalculator = drawColorAndCalculatorContainer.getSecondaryContent();
    const sonMain_drawColor = new SonToggleButtonComponent('main_drawColor', '着色器', main_drawColorAndCalculator, "点击着色按钮后对当前手卡进行着色\n\n注意：着色器功能目前处于测试阶段，可能存在一些问题", 1);
    // 智能替换
    const sonMain_smartReplace = new SonToggleButtonComponent('main_smartReplace', '智能替换', sonMain_drawColor.getChildSettingsContainer(), "1.智能识别手卡中的文字并替换为对应格式\n2.替换违禁词汇\n\n例如：将“99/2箱*6瓶”转写为“平均到手”的形式；\n将“49/2小箱/6瓶”转写为“平均到手”的形式\n例如：将“100%棉”替换为“99.99%棉”", 1);
    // 补贴生成
    const sonMain_subsidyText = new SonToggleButtonComponent('main_subsidyText', '补贴生成', sonMain_drawColor.getChildSettingsContainer(), "点击补贴生成按钮后生成当前手卡的补贴文字", 1);
    // 计算器开关
    const sonMain_calculator = new SonToggleButtonComponent('main_calculator', '计算器', sonMain_drawColor.getChildSettingsContainer(), "点击着色按钮后对当前手卡的算式进行计算\n\n注意：计算器功能目前处于测试阶段，可能存在一些问题；\n\n例如：无法计算形如“(3+9)/2”的算式；如果你想正确计算形如这样的算式，请将算式调整为“(3+9)/(2)”", 1);

    // 画中画子功能区域
    const main_pictureInPictureSwitch = pictureInPictureSwitchContainer.getSecondaryContent();
    const sonMain_pictureInPictureSwitch = new SonToggleButtonComponent('main_pictureInPictureSwitch', '小窗模式', main_pictureInPictureSwitch, "开启后,支持小窗模式的内容将会以小窗的形式呈现", 1);
    const sonMain_PIP_defautPosition = new SonToggleButtonComponent('main_PIP_defautPosition', '默认位置', sonMain_pictureInPictureSwitch.getChildSettingsContainer(), "设置小窗的默认位置", 1);
    const sonMain_PIP_defautPosition_select = ['左侧', '右侧'];
    sonMain_PIP_defautPosition.createSelectBox(sonMain_PIP_defautPosition_select);
    const sonMain_PIP_autoAdjust = new SonToggleButtonComponent('main_PIP_autoAdjust', '手卡位置自适应', sonMain_pictureInPictureSwitch.getChildSettingsContainer(), "开启后,在小窗模式下会自动调整手卡位置", 1, true);

    // 辅助功能子功能区域
    const AuxiliaryFunctions_container = AuxiliaryFunctionsContainer.getSecondaryContent();
    const sAF_backToLastCurrentURL = new SonToggleButtonComponent('sAF_backToLastCurrentURL', '最近浏览', AuxiliaryFunctions_container, "会主动提示上次浏览的场次页面，点击弹出的通知会跳转到上次浏览的场次页面", 1, true);
    const sAF_closeBrowserUpdateDiv = new SonToggleButtonComponent('sAF_closeBrowserUpdateDiv', '关闭浏览器更新提示', AuxiliaryFunctions_container, "关闭浏览器更新提示，防止影响使用\n(已累计关闭" + getCloseCount() + "次)", 1, true);
    const sAF_pastedSeachSwitchConta = new SonToggleButtonComponent('sAF_pastedSeachSwitchConta', '快捷粘贴搜索', AuxiliaryFunctions_container, "进行粘贴操作后，自动点击搜索按钮", 1, false);
    const sAF_AdvanceTableCardTitle = new SonToggleButtonComponent('sAF_AdvanceTableCardTitle', '手卡标题优化', AuxiliaryFunctions_container, "优化手卡标题，使其更易于识别", 1, true);
    const sAF_AdvanceTableCardPage = new SonToggleButtonComponent('sAF_AdvanceTableCardPage', '手卡页面优化', AuxiliaryFunctions_container, "优化手卡页面，隐藏顶栏与禁用词窗口", 1, true);
    const sAF_AdvanceBatchPrint = new SonToggleButtonComponent('sAF_AdvanceBatchPrint', '手卡打印功能优化', AuxiliaryFunctions_container, "优化打印页面默认文件名，允许仅打印手卡的部分区域并添加“上播ID核对”区域，\n添加“编辑手卡”按钮", 1, true);
    const sAF_AdvanceBatchPrint_alwaysDisplay = new SonToggleButtonComponent('sAF_AdvanceBatchPrint_alwaysDisplay', '总是显示ID核对行', sAF_AdvanceBatchPrint.getChildSettingsContainer(), "总是显示ID核对行，不论是否仅打印手卡的部分区域", 1, true);
    const sAF_FristPhotoCopyForTmallAndTaobao = new SonToggleButtonComponent('sAF_FristPhotoCopyForTmallAndTaobao', '天猫&淘宝主图复制', AuxiliaryFunctions_container, "在天猫或淘宝的主图上点击“复制图片”按钮，以快速将图片拷贝到剪切板\n\n注意：此功能会需要多个网页的剪切板访问权限", 1, true);

    // 单击和双击事件的延迟和计数器
    var delay = 200; // 延迟时间，单位毫秒
    var timer = null;

    // 监听鼠标左键点击事件
    document.addEventListener('click', function (event) {
        // 检查是否开启了点击复制功能且在匹配的网址上
        if (copySwitchContainer.getSwitchState() && isHomeURL()) {
            clearTimeout(timer);

            timer = setTimeout(function () {
                handleMouseClick(event, event.detail === 2);
            }, delay);
        }
    });

    let clipboardHistory = ''; // 点击复制历史记录

    // 鼠标点击响应事件
    function handleMouseClick(event, isDoubleClick = false) {
        if (event.target &&
            event.target.classList.contains('link-overflow-tip') &&
            event.target.closest('#MarkHighlight-shopDetail-outShopName')) {
            var text = event.target.textContent;

            // 根据是否处于双击模式及点击类型，决定复制的文本内容
            if (toggleDoubleClickMode()) {
                if (isDoubleClick) {
                    if (toggleSmartCopyLength()) {
                        copiedText = processText(text);
                    } else {
                        copiedText = text.substring(0, 3);
                    }
                } else {
                    copiedText = text.substring();
                }

            } else {
                if (isDoubleClick) {
                    copiedText = text.substring();
                } else {
                    if (toggleSmartCopyLength()) {
                        copiedText = processText(text);
                    } else {
                        copiedText = text.substring(0, 3);
                    }
                }
            }

            clipboardHistory = text;
            GM_setClipboard(copiedText);

            showNotification("复制成功：" + copiedText);

            itemSort_countInputFun.countSort_reShowNotification(); // 计数通知显示恢复
        }
    }

    // 返回单击和双击模式的切换函数
    function toggleDoubleClickMode() {
        const isDoubleClickMode = copySwitch_onlyPart.getSelectBoxValue();

        switch (isDoubleClickMode) {
            case '单击':
                return false;
            case '双击':
                return true;
            default:
                return false;
        }
    }

    // 返回复制长度的切换函数
    function toggleSmartCopyLength() {
        const smartCopyLength = copySwitch_smartCpoy.getSelectBoxValue();

        switch (smartCopyLength) {
            case '默认':
                return false;
            case '智能':
                return true;
            default:
                return false;
        }
    }

    // 生成过滤词汇的正则表达式
    var chineseFilterWords = ["旗舰店", "旗舰", "商品", "海外", "官方", "食品", "化妆品", "生活馆",
        "专营店", "国旅", "数码", "医药", "专卖店", "饮品", "女装", "男装", "企业店", "童装",
        "中国", "集团"];
    var chineseFilterRegex = new RegExp(chineseFilterWords.join('|'), 'g');  // 合并成一个正则表达式

    // 检查文本开头并根据要求处理
    function processText(text) {
        var englishPattern = /^[A-Za-z\s.,!?;:'"-]+/;  // 匹配以英文开头的部分，包含常见符号

        // 检查是否以英文开头
        var match = text.match(englishPattern);
        if (match) {
            // 如果以英文开头，返回匹配的英文部分
            return match[0];
        } else {
            // 如果以中文开头，使用正则表达式过滤指定词汇
            return text.replace(chineseFilterRegex, '');
        }
    }

    // 添加鼠标悬浮和移出事件监听器
    NotificationContainer.addEventListener('mouseenter', function () {
        clearTimeout(notificationTimer); // 悬浮时清除计时器
        // console.log('Mouse entered notification'); // 调试日志
    });
    NotificationContainer.addEventListener('mouseleave', function () {
        // console.log('Mouse left notification'); // 调试日志
        var time = 3000;
        if (itemSort_countInputFun.getDivButtonState()) time = 0;
        resetTimer(time); // 移出时重置计时器
    });

    function showNotification(message, duringTime = 3000, showImage = false) {
        // 清除之前的计时器
        if (notificationTimer) {
            clearTimeout(notificationTimer);
        }

        // 重置隐藏标志
        isHiding = false;

        // 重置通知样式
        NotificationContainer.innerHTML = '';
        NotificationContainer.style.width = 'auto';
        NotificationContainer.style.transform = 'translateX(-50%)';
        NotificationContainer.style.animation = 'none';
        NotificationContainer.style.padding = '10px';

        // 短暂移除并重新添加通知元素，强制触发动画
        if (NotificationContainer.parentNode) {
            document.body.removeChild(NotificationContainer);
        }

        setTimeout(() => {
            document.body.appendChild(NotificationContainer);

            // 设置通知文本内容
            NotificationContainer.innerHTML = message;

            // 如果指定了显示图片，则读取剪贴板中的图片并显示
            if (showImage) {
                NotificationContainer.style.padding = '5px';
                navigator.clipboard.read().then(async function (data) {
                    for (const item of data) {
                        for (const type of item.types) {
                            if (type.startsWith('image/')) {
                                const blob = await item.getType(type);
                                const imageURL = URL.createObjectURL(blob);

                                const imageElement = document.createElement('img');
                                imageElement.src = imageURL;
                                imageElement.style.width = '300px';
                                imageElement.style.borderRadius = '8px';

                                const imageContainer = document.createElement('div');
                                imageContainer.style.paddingTop = '10px';
                                imageElement.style.maxWidth = 'auto';
                                imageContainer.style.borderRadius = '8px';
                                imageContainer.style.margin = 'auto';
                                imageContainer.style.display = 'block';
                                imageContainer.appendChild(imageElement);

                                NotificationContainer.appendChild(imageContainer);

                                // 图片加载完成后调整位置并设置消失定时器
                                imageElement.onload = function () {
                                    NotificationContainer.style.left = '50%';

                                    NotificationContainer.style.display = 'block';
                                    NotificationContainer.style.animation = 'showNotification 0.5s forwards';
                                    // 设置消失动画计时器
                                    resetTimer(duringTime);
                                };

                                break;
                            }
                        }
                    }
                }).catch(function (error) {
                    console.error('Error reading clipboard:', error);
                });
            } else {
                // 显示通知
                NotificationContainer.style.display = 'block';
                NotificationContainer.style.animation = 'showNotification 0.5s forwards';

                // 设置消失动画计时器
                resetTimer(duringTime);
            }
        }, 50); // 确保通知元素短暂移除再添加
    }

    function hideNotification() {
        if (isHiding) return;
        isHiding = true;

        NotificationContainer.style.animation = 'hideNotification 0.5s forwards';

        // 在动画结束后隐藏元素
        notificationTimer = setTimeout(function () {
            NotificationContainer.style.display = 'none';
            isHiding = false;
        }, 500);
    }

    function resetTimer(duringTime = 3000) {
        if (notificationTimer) {
            clearTimeout(notificationTimer);
            // console.log("清除计时器");
        }
        if (duringTime > 0) {
            notificationTimer = setTimeout(function () {
                hideNotification();
                // console.log("设置计时器");
            }, duringTime); // 3秒后自动隐藏通知
        }
    }

    async function clickButton(pastedData = true, delayTime = 0, containerSelector = document, buttonSelector, buttonText = '') {
        // 判断粘贴内容是否为空或为 true
        if (pastedData === true || (typeof pastedData === 'string' && pastedData.trim().length > 0)) {
            // 查找指定容器内的按钮
            var container = containerSelector === document ? document : document.querySelector(containerSelector);
            if (container) {
                // 如果提供了 buttonText，则进一步检查按钮文本内容
                var buttons = container.querySelectorAll(buttonSelector);
                var button = null;
                if (buttonText) {
                    buttons.forEach(btn => {
                        var span = btn.querySelector('span');
                        if (span && span.textContent.trim() === buttonText) {
                            button = btn;
                        }
                    });
                } else {
                    button = buttons[0]; // 如果没有提供 buttonText，默认选择第一个匹配的按钮
                }

                // 如果找到符合条件的按钮，延迟点击
                if (button) {
                    setTimeout(function () {
                        button.click();
                        // console.log(`已点击文本内容为“${buttonText || '按钮'}”的按钮`);
                    }, delayTime);
                } else {
                    console.log(`未找到符合条件的按钮`);
                }
            }
        }
    }

    // 监听粘贴事件
    document.addEventListener('paste', function (event) {
        // 判断是否开启了自动点击功能且在匹配的网址上
        if (sAF_pastedSeachSwitchConta.getSwitchState() && isHomeURL()) {
            // 获取粘贴板中的内容
            var pastedData = (event.clipboardData);
            var className = '.ant-btn.css-9fw9up.ant-btn-primary';
            clickButton(pastedData, 100, undefined, className);
        }
    });

    // 检查文本中是否是天猫链接函数
    function checkForTmallInClipboard(text) {
        const regex = /https:\/\/[^ ]*tmall[^ ]*id=\d{12}/;
        return regex.test(text);
    }

    function checkForChaoshiInClipboard(text) {
        const regex = /https:\/\/[^ ]*chaoshi[^ ]*id=\d{12}/;
        return regex.test(text);
    }

    function checkForFeizhuInClipboard(text) {
        const regex = /https:\/\/[^ ]*fliggy[^ ]*id=\d{12}/;
        return regex.test(text);
    }

    // 转换为移动设备链接（测试）
    function changeLinkToMobilePhone(link) {
        const idMatch = extractIdFromClipboard(link);
        return "https://detail.m.tmall.com/item.htm?id=" + idMatch;
    }

    // 提取链接id函数
    function extractIdFromClipboard(text) {
        // 检查是否只含有11-12位数字
        // const onlyDigitsMatch = text.match(/^\d{11,12}$/);
        const onlyDigitsMatch = text.match(/^\d{11,12}$/);
        if (onlyDigitsMatch) {
            return text; // 如果剪切板仅包含11位或12位数字，直接返回
        }

        // 匹配 id= 后面的11或12位数字
        // const idMatch = text.match(/id=(\d{11,12})/);
        const idMatch = text.match(/id=(\d{11,12})/);
        return idMatch ? idMatch[1] : null;
    }

    // 粘贴功能
    async function simulatePaste(targetElement, clearBeforePaste = true, defaultText = '') {
        try {
            let clipboardText = defaultText;

            if (clipboardText === '') {
                // 读取剪贴板内容或预设内容
                clipboardText = await navigator.clipboard.readText();
            }
            console.log('粘贴内容：' + clipboardText);

            // 检查目标元素是否为可编辑元素
            if (targetElement.isContentEditable || targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA') {
                // 如果clearBeforePaste为true，清空目标元素的内容
                if (clearBeforePaste) {
                    if (targetElement.isContentEditable) {
                        targetElement.innerHTML = '';
                    } else {
                        targetElement.value = '';
                    }
                }

                // 插入剪贴板内容到目标元素
                if (document.execCommand('insertText', false, clipboardText)) {
                    // console.log('粘贴成功：' + clipboardText);
                } else {
                    targetElement.value += clipboardText;
                }
            } else {
                // alert('目标元素不可编辑');
            }
        } catch (err) {
            console.error('读取剪贴板内容失败：', err);
            showNotification("读取剪贴板内容失败");
        }
    }

    function updateClipboardContent(olnyItemId = false) {
        var tmail = "https://detail.tmall.com/item.htm?id=";
        var chaoshi = "https://chaoshi.detail.tmall.com/item.htm?id=";
        var taobao = "https://item.taobao.com/item.htm?id=";
        var feizhu = "https://traveldetail.fliggy.com/item.htm?id=";
        navigator.clipboard.readText().then((clipText) => {
            const isTmall = checkForTmallInClipboard(clipText);
            const isChaoshi = checkForChaoshiInClipboard(clipText);
            const isFeizhu = checkForFeizhuInClipboard(clipText);
            const itemId = extractIdFromClipboard(clipText);
            // console.log("itemId：" + itemId);
            // console.log("itemId-length：" + itemId.length);

            if (itemId) {
                var newUrl;
                if ((isTmall || isFeizhu) && !isChaoshi) {
                    // 转换为天猫链接
                    newUrl = tmail + itemId;
                }
                else if (isChaoshi) {
                    // 转换为猫超链接
                    newUrl = chaoshi + itemId;
                } else {
                    if (true) {
                        // 转换为淘宝链接
                        newUrl = taobao + itemId;
                    } else {
                        // 转换为天猫链接
                        newUrl = tmail + itemId;
                    }
                }
                if (olnyItemId) {
                    GM_setClipboard(itemId);
                    if (!getLinksArrState) {
                        showNotification("剪贴板内容已更新为：" + itemId);
                    }
                } else {
                    GM_setClipboard(newUrl);
                    if (!getLinksArrState) {
                        showNotification("剪贴板内容已更新为：" + newUrl);
                    }
                    //console.log('剪贴板内容已更新为：' + newUrl);
                }
            } else {
                if (mainOnlyItemId_checkTtemLink.getSwitchState()) {
                    // 防止错误粘贴功能
                    GM_setClipboard("12位数字ID不全");
                }
                if (!getLinksArrState) {
                    showNotification("剪贴板中没有找到12位数字ID");
                }
                // console.log('剪贴板中没有找到12位数字ID');
            }
        }).catch((err) => {
            console.error('读取剪贴板失败：', err);
        });
    }

    // 查找位于数组中的位置
    function findItemIdForArr(itemId) {
        // 使用 indexOf 查找 itemId 在 upLiveIdArray 中的位置
        let index = upLiveIdArray.indexOf(itemId);

        // 如果 index 是 -1，表示未找到，否则返回 index
        // console.log('index:' + index);
        return index;
    }

    // 返回当前页面的id
    function getPageItemId() {
        const pageIds = document.getElementById('MarkHighlight-upLiveId-upLiveId');

        let itemIds = [];

        for (let i = 0; i < pageIds.length; i++) {
            itemIds.push(pageIds[i].innerText);
        }

        return itemIds;
    }

    function search_clickDownLabel(callback, delayTime = 600) {
        setTimeout(async () => {
            // 寻找 .text-search-components 容器
            const container = document.querySelector('.text-search-components');

            // 检查是否找到了容器
            if (container) {
                // 在容器内寻找含有 aria-label="down" 的 span 标签
                const downSpan = container.querySelector('span[aria-label="down"]');

                // 检查是否找到了该 span
                if (downSpan) {
                    // 获取其父 span
                    const parentSpan = downSpan.closest('span');

                    // 检查父 span 是否在容器内（可选）
                    if (parentSpan && container.contains(parentSpan)) {
                        await waitForButtonToEnable(); // 等待按钮启用
                        // 点击父 span
                        parentSpan.click();

                        // 调用回调函数
                        if (typeof callback === 'function') {
                            callback();
                        }
                    } else {
                        console.warn('未找到在 .text-search-components 内的含有 aria-label="down" 的 span 标签的父 span');
                    }
                } else {
                    console.warn('未在 .text-search-components 内找到含有 aria-label="down" 的 span 标签');
                }
            } else {
                console.warn('未找到 .text-search-components 容器');
            }
        }, delayTime);
    }

    function isDisableButton() {
        const buttons = document.querySelectorAll('.text-search-components-btn');

        let downButton;
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].querySelector('span[aria-label="down"]')) {
                downButton = buttons[i];
                break; // 找到后就可以退出循环了
            }
        }

        // 检查 downButton 是否存在，并且是否被禁用
        if (downButton) {
            return downButton.disabled;
        } else {
            // 如果没有找到 downButton，则返回 false 或者根据你的需求返回其他值
            return false;
        }
    }

    async function waitForButtonToEnable(maxWaitTime = 60000, delayTime = 500) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const interval = setInterval(() => {
                if (!isDisableButton()) {
                    clearInterval(interval);
                    setTimeout(() => {
                        resolve();
                    }, delayTime);
                }

                const elapsedTime = Date.now() - startTime;
                if (elapsedTime >= maxWaitTime) {
                    clearInterval(interval);
                    reject(new Error('Button enabling timed out after 60 seconds'));
                }
            }, 100); // 每500毫秒检查一次
        });
    }

    function click_autoInputForIndex(rowIndex) {
        // 找到带有指定 row-index 的 div
        const targetDiv = document.querySelector(`div[row-index="${rowIndex}"]`);

        // 在 targetDiv 内查找 col-id="weight" 的元素
        if (targetDiv) {
            const weightElement = targetDiv.querySelector('div[col-id="weight"]');

            if (weightElement) {
                const focusElement = weightElement.querySelector('.sortWeights___Kn8mn');

                if (focusElement) {
                    focusElement.click(); // 点击来激活输入框

                    setTimeout(() => {
                        focusElement.click(); // 再次点击来取消输入框
                        if (linksArr.length === 0 && !AutoSortState) {
                            showNotification("成功找到商品&保存成功");
                        }
                    }, 100);
                }
            }
        }
    }

    function checkActiveTab_GuaLian() {
        // 查询包含 data-node-key="2" 的 div 元素
        const divElement = document.querySelector('div[data-node-key="2"]');

        // 如果找到了该元素
        if (divElement) {
            // 检查该元素的 classList 是否包含 ant-tabs-tab-active
            const isActive = divElement.classList.contains('ant-tabs-tab-active');

            // console.log('Is the tab active:', isActive);
            return isActive;
        } else {
            // 如果没有找到，输出信息或处理错误
            // console.log('No div element with data-node-key="2" found.');
            return false;
        }
    }

    // 检查当前页面是否在紧急加品页面
    function checkActiveTab_JiaPin() {
        // 查询包含 data-node-key="4" 的 div 元素
        const divElement = document.querySelector('div[data-node-key="4"]');

        // 如果找到了该元素
        if (divElement) {
            // 检查该元素的 classList 是否包含 ant-tabs-tab-active
            const isActive = divElement.classList.contains('ant-tabs-tab-active');

            // console.log('Is the tab active:', isActive);
            return isActive;
        } else {
            // 如果没有找到，输出信息或处理错误
            // console.log('No div element with data-node-key="2" found.');
            return false;
        }
    }

    // 检查当前页面是否在待确认订单页面
    function checkActiveTab_WaitComfirm() {
        // 查询包含 data-node-key="5" 的 div 元素
        const divElement = document.querySelector('div[data-node-key="5"]');

        // 如果找到了该元素
        if (divElement) {
            // 检查该元素的 classList 是否包含 ant-tabs-tab-active
            const isActive = divElement.classList.contains('ant-tabs-tab-active');

            // console.log('Is the tab active:', isActive);
            return isActive;
        } else {
            // 如果没有找到，输出信息或处理错误
            // console.log('No div element with data-node-key="2" found.');
            return false;
        }
    }

    let linksArr = []; // 全局数组，用于存储从剪切板中提取的链接

    function getLinksArrState() {
        return linksArr.length > 0;
    }

    // 从剪切板中提取所有链接并存储到全局数组中
    async function extractLinksFromClipboard() {
        try {
            // 读取剪贴板内容
            const text = await navigator.clipboard.readText();

            linksArr = []; // 清空原有的数组

            // 正则表达式匹配URL
            const urlPattern = /https?:\/\/[^\s]+/g;
            let matches = text.match(urlPattern);

            if (matches) {
                // 将找到的链接添加到全局数组中
                linksArr.push(...matches);

                // console.log('Links extracted and stored:', linksArr);
            } else {
                // console.log('No links found in the clipboard.');
            }
        } catch (err) {
            // console.error('Failed to read clipboard contents: ', err);
        }
    }


    // 等待页面加载结束，最长等待时间为60秒
    async function waitForPageToLoad(maxWaitTime = 60000, delayTime = 500) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const interval = setInterval(() => {
                if (!isItemPageLoading()) {
                    clearInterval(interval);
                    setTimeout(() => {
                        resolve();
                    }, delayTime);
                }

                const elapsedTime = Date.now() - startTime;
                if (elapsedTime >= maxWaitTime) {
                    clearInterval(interval);
                    reject(new Error('Page loading timed out after 60 seconds'));
                }
            }, 500); // 每500毫秒检查一次
        });
    }

    const MAX_RETRY_TIME = 5; // 最大重试次数
    let retryCount = 0; // 重试次数

    // 遍历 linksArr 并处理每个链接
    async function processAllLinks() {
        await extractLinksFromClipboard(); // 从剪切板中提取链接
        // console.log('linksArr:', linksArr);

        for (let i = 0; i < linksArr.length; i++) {
            let link = linksArr[i];

            // 显示当前处理的链接
            showNotification(`正在处理第 ${i + 1}/ ${linksArr.length} 个`, 0);

            // 模拟将链接放入剪切板
            await navigator.clipboard.writeText(link);
            // console.log('Link copied to clipboard:', link);

            // 点击搜索按钮
            await simulateClickOnAntInputAffixWrapper();

            // 可能需要等待一段时间，以便于上一个操作完成
            await new Promise(resolve => setTimeout(resolve, 2500)); // 根据实际情况调整等待时间

            // 等待页面加载完成
            try {
                await waitForPageToLoad();
                // console.log('Page loaded successfully');
            } catch (error) {
                // console.error('Page loading timed out:', error);
                showNotification('页面加载超时');
            }
        }

        retryCount = 0; // 重置重试次数
        await checkSelfLink();
    }

    async function checkSelfLink() {
        return new Promise(async (resolve, reject) => {
            if (retryCount > 1) {
                let className = '.ant-btn.css-9fw9up.ant-btn-primary';
                clickButton(true, 100, undefined, className);
                await new Promise(resolve => setTimeout(resolve, 3500)); // 根据实际情况调整等待时间
            }

            // 将连接转储为id
            let idArr = linksArr.map(link => extractIdFromClipboard(link));
            // console.log('idArr:', idArr);

            let weight = preGetValue();
            let retryLinkArr = [];

            for (let i = 0; i < idArr.length; i++) {
                let idWeight = goodsUrlCheckArray[idArr[i]].weight;
                if (idWeight != weight) {
                    retryLinkArr.push(linksArr[i]);
                }
            }

            if (retryLinkArr.length > 0) {
                retryCount++;
                if (retryCount > MAX_RETRY_TIME) {
                    showNotification('重试次数已达最大');
                    reject(new Error('重试次数已达最大'));
                    return;
                }
            } else {
                showNotification('全部处理完成');
                linksArr = []; // 清空数组
                resolve();
                return;
            }

            showNotification('执行自检流程···', 0);
            // console.log('retryLinkArr:', retryLinkArr);

            for (let i = 0; i < retryLinkArr.length; i++) {
                let link = retryLinkArr[i];

                // 显示当前处理的链接
                showNotification(`[重试 ${retryCount} ] 正在处理第 ${i + 1}/ ${retryLinkArr.length} 个`, 0);

                // 模拟将链接放入剪切板
                await navigator.clipboard.writeText(link);
                // console.log('Link copied to clipboard:', link);

                // 点击搜索按钮
                await simulateClickOnAntInputAffixWrapper();

                // 可能需要等待一段时间，以便于上一个操作完成
                await new Promise(resolve => setTimeout(resolve, 2000)); // 根据实际情况调整等待时间

                // 等待页面加载完成
                try {
                    await waitForPageToLoad();
                    // console.log('Page loaded successfully');
                } catch (error) {
                    // console.error('Page loading timed out:', error);
                    showNotification('页面加载超时');
                }
            }

            checkSelfLink();
        });
    }

    function addButtonForHomePage_processAllLinks() {
        var buttonName = '批量处理';
        var buttonId = 'processAllLinksButton';
        const smartCopyButton = createDefaultButton(buttonId, buttonName, () => {
            processAllLinks();
        });

        // 找到搜索栏目
        const searchToolBar = document.querySelector('.ant-pro-table-list-toolbar-left');
        const scButton = document.getElementById(buttonId);
        if (searchToolBar) {
            if (!scButton) {
                searchToolBar.appendChild(smartCopyButton);
            } else {
                if ((onlyItemIdForSearchDiv_onlyNoIntroduce.getSwitchState() ? checkActiveTab_GuaLian() : true) && sonMain_autoFlagedSwitch.getSwitchState()) {
                    scButton.style.display = '';
                } else {
                    scButton.style.display = 'none';
                }
            }
        }
    }

    // 模拟点击 .ant-input-affix-wrapper 元素
    function simulateClickOnAntInputAffixWrapper() {
        return new Promise((resolve, reject) => {
            const element = document.querySelector('.text-search-components .ant-input-affix-wrapper.css-9fw9up');

            if (element) {
                // // 创建点击事件
                // const clickEvent = new MouseEvent('click', {
                //     bubbles: true,
                //     cancelable: true,
                //     view: window
                // });

                // // 触发点击事件
                // element.dispatchEvent(clickEvent);
                element.click();

                console.log('Simulated click on ant-input-affix-wrapper:', element);
                resolve();
            } else {
                console.error('Element not found');
                reject(new Error('Element not found'));
            }
        });
    }

    // 提取链接id粘贴功能实现
    function handle_onlyItemIdForSearch(event) {
        if (event.target.closest('.text-search-components .ant-input-affix-wrapper.css-9fw9up') &&
            !event.target.closest('.ant-input-suffix')) {
            console.log('点击了 ant-input-affix-wrapper');

            updateClipboardContent(true);
            processItemIdForSearch(document.activeElement);
        }
    }

    // 处理单个链接
    function processItemIdForSearch(targetElement) {
        simulatePaste(targetElement);

        navigator.clipboard.readText().then((itemId) => {
            console.log('itemID:' + itemId);
            const index = findItemIdForArr(itemId);

            if (index !== -1) {
                // itemPageScroll(120 * index, false);
                search_clickDownLabel(() => {
                    if (onlyItemIdForSearchDiv_autoInputSort.getSwitchState()) {
                        click_autoInputForIndex(index);
                    }
                });
            }
        }).catch(err => {
            console.error('读取剪贴板内容失败:', err);
            showNotification("读取剪贴板内容失败");
        });
    }

    // 监听鼠标左键点击事件
    document.addEventListener('click', function (event) {
        // 提取商品链接粘贴功能区域
        if (sonMain_onlyItemIdSwitch.getSwitchState() && isHomeURL()) {
            if (event.target.closest('.ant-form-item.liveLinkFormItem___RPAQZ.css-9fw9up.ant-form-item-has-success')) {
                if (event.target.classList.contains('ant-input-affix-wrapper') ||
                    event.target.classList.contains('ant-input-affix-wrapper-status-error') ||
                    event.target.classList.contains('css-9fw9up')) {
                    // console.log('目标元素被点击');
                    updateClipboardContent();
                    simulatePaste(document.activeElement);

                    // 点击保存按钮
                    if (mainOnlyItemId_autoSave.getSwitchState()) {
                        var fbutton = '.ant-drawer-footer';
                        var buttonName = '.ant-btn.css-9fw9up.ant-btn-primary';
                        showNotification("粘贴成功&保存成功");
                        clickButton(undefined, 500, fbutton, buttonName);
                    }
                }
            }
        }
        // 提取链接id粘贴功能区域
        // 用于控制功能开关
        if (sonMain_onlyItemIdForSearchDiv.getSwitchState() && isHomeURL()) {
            if (onlyItemIdForSearchDiv_onlyNoIntroduce.getSwitchState()) {
                if (checkActiveTab_GuaLian()) {
                    handle_onlyItemIdForSearch(event);
                }
            } else {
                handle_onlyItemIdForSearch(event);
            }
        }

        // 自动序号标1功能
        if (sonMain_itemSortSwitch.getSwitchState()) {
            if (event.target.closest('.ant-input-number.ant-input-number-sm.css-1ayq15k')) {
                if (event.target.classList.contains('ant-input-number-input')) {
                    // console.log('目标元素被点击');
                    if (!itemSort_countInputFun.getDivButtonState()) {
                        GM_setClipboard(preGetValue());
                    } else {
                        if (itemSort_countInputFun_rateInput.getSwitchState()) {
                            GM_setClipboard((itemSort_countInputFun.getCount() - 1) * 10);
                        } else {
                            GM_setClipboard(itemSort_countInputFun.getCount() - 1);
                        }
                    }
                    if (!AutoSortState) {
                        simulatePaste(document.activeElement);
                    } else {
                        simulatePaste(document.activeElement, true, autoSortNum);
                    }
                }
            }
        }
        // 自动激活排序输入框
        if (sonMain_itemSortSwitch.getSwitchState()) {
            if (event.target.classList.contains('sortWeights___Kn8mn') ||
                event.target.closest('.sortWeights___Kn8mn')) {
                // console.log('找到sortWeights___Kn8mn');
                activateInputFieldAndSave(event);
            }
        }
    });

    function preGetValue() {
        if (itemSort_inputConter.getSelectBoxValue() === '空') {
            return '';
        } else {
            return itemSort_inputConter.getSelectBoxValue();
        }
    }


    /* 快捷截图功能区 */
    function getTableCardImageUrl() {
        // 查找 class 为 'link-node-img-container' 的 div
        const container = document.querySelector('.link-node-img-container');

        // 检查是否找到了该元素
        if (container) {
            // 查找 div 内的 img 元素
            const imgElement = container.querySelector('img');

            // 检查是否有 img 元素，并获取其 src 属性
            if (imgElement) {
                const imgUrl = imgElement.src; // 获取 img 的 src URL
                console.log('Image URL:', imgUrl); // 输出到控制台
                return imgUrl;
            } else {
                // console.log('No img element found inside the container');
                return null;
            }
        } else {
            // console.log('No div with the class "link-node-img-container" found');
            return null;
        }
    }

    function setTableCardImageUrl(imgUrl) {
        // 查找 class 为 'link-node-img-container' 的 div
        const container = document.querySelector('.link-node-img-container');

        // 检查是否找到了该元素
        if (container) {
            // 查找 div 内的 img 元素
            const imgElement = container.querySelector('img');

            // 检查是否有 img 元素，并获取其 src 属性
            if (imgElement) {
                imgElement.src = imgUrl; //  更新 img 的 src URL
                console.log('Image URL已更新为:', imgUrl); // 输出到控制台
            } else {
                // console.log('No img element found inside the container');
            }
        } else {
            // console.log('No div with the class "link-node-img-container" found');
        }
    }

    // 返回渲染倍数
    function selectedTableCardPngResolution() {
        const resolution = tableCardPng_resolution.getSelectBoxValue();
        // console.log("设定的分辨率：" + resolution);
        switch (resolution) {
            case '普通':
                return 1.5;
            case '高清':
                return 2.5;
            case '超清':
                return 4;
            default:
                return 2.5;
        }
    }

    function loadImageIcon() {
        return '<span class="ant-btn-icon ant-btn-loading-icon" style=""><span role="img" aria-label="loading" class="anticon anticon-loading anticon-spin"><svg viewBox="0 0 1024 1024" focusable="false" data-icon="loading" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path></svg></span></span>';
    }

    if (sonMain_tableCardPngSwitch.getSwitchState() && isTableCardURL()) {
        // Load html2canvas library
        function loadHtml2Canvas(callback) {
            var script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            script.onload = callback;
            document.head.appendChild(script);
        }

        function createCaptureScreenshotButton() {
            const targetClass = '[class*="ant-space"][class*="css-9fw9up"][class*="ant-space-horizontal"][class*="ant-space-align-center"]';

            const captureScreenshot_observer = new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        const targetElement = document.querySelector(targetClass);
                        if (targetElement) {
                            if (document.querySelector('.captureScreenshot')) {
                                captureScreenshot_observer.disconnect();
                                return;
                            }

                            var captureScreenshot = document.createElement('div');
                            captureScreenshot.classList.add('ant-space-item');

                            var captureScreenshotButton = document.createElement('button');
                            captureScreenshotButton.textContent = '快捷截图';
                            captureScreenshotButton.classList.add('ant-btn', 'css-9fw9up', 'ant-btn-default', 'captureScreenshot');
                            captureScreenshot.appendChild(captureScreenshotButton);

                            targetElement.insertBefore(captureScreenshot, targetElement.firstChild);

                            captureScreenshotButton.addEventListener('click', captureScreenshotFunction);

                            captureScreenshot_observer.disconnect();
                            break;
                        }
                    }
                }
            });

            captureScreenshot_observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        function loadImageAsDataURL(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    responseType: 'blob',
                    onload: function (response) {
                        const blob = response.response;
                        const reader = new FileReader();
                        reader.onloadend = function () {
                            resolve(reader.result);
                        };
                        reader.onerror = function () {
                            reject(new Error('Failed to load image'));
                        };
                        reader.readAsDataURL(blob);
                    },
                    onerror: function () {
                        reject(new Error('Network error'));
                    }
                });
            });
        }

        async function captureScreenshotFunction() {
            const tableElement = document.querySelector('table');
            var displayScale = selectedTableCardPngResolution();
            // console.log("设定的倍率：" + displayScale);

            showNotification("截图中  " + loadImageIcon(), 0);
            if (tableElement) {
                const rows = tableElement.querySelectorAll('tr');

                if (rows.length >= 3) {
                    rows[2].cells[0].textContent = '';

                    // 隐藏除第二行和第三行外的所有行
                    rows.forEach((row, index) => {
                        if (index !== 1 && index !== 2) {
                            if (index === 3 && isShowTableCheckedRow()) {
                                row.style.display = '';
                            } else {
                                row.style.display = 'none';
                            }
                        }
                    });

                    const imgElement = rows[2].cells[2].querySelector('img');
                    if (imgElement) {
                        try {
                            const dataUrl = await loadImageAsDataURL(imgElement.src);
                            imgElement.src = dataUrl;

                            setTimeout(() => {
                                // 使用 html2canvas 捕获截图
                                html2canvas(tableElement, { scale: displayScale }).then(canvas => {
                                    // 恢复所有行的显示状态
                                    rows.forEach(row => {
                                        row.style.display = '';
                                    });

                                    // 隐藏检查格式行
                                    if (true) {
                                        rows.forEach((row, index) => {
                                            if (index === 3) {
                                                row.style.display = isCheckItemIdRow_onlyPng();
                                            }
                                        });
                                    }

                                    canvas.toBlob(async function (blob) {
                                        try {
                                            await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
                                            console.log("%cTable Screenshot:", "color: #9147ff", "Screenshot copied to clipboard.");
                                            showNotification("截图已成功复制到剪贴板", undefined, true);
                                        } catch (error) {
                                            console.log("%cTable Screenshot: Screenshot failed to copy to clipboard!", "color: #ff8080");
                                            showNotification("截图失败！");
                                        }
                                    });
                                });
                            }, 200); // 延迟 200 毫秒等待图片加载完毕
                        } catch (error) {
                            console.log('Image load error:', error);
                        }
                    } else {
                        console.log('Image element not found');
                    }
                } else {
                    console.log("Table does not have enough rows");
                }
            } else {
                console.log("Table element not found");
            }
        }

        loadHtml2Canvas(createCaptureScreenshotButton);
    }

    /*
    **************************
    自动激活排序窗口、点击保存
    **************************
    */
    function activateInputFieldAndSave(event) {
        if (true) {
            const click_itemId = handleCellClick(event);
            if (temp_itemId != click_itemId) {
                if (itemSort_countInputFun.getDivButtonState()) {
                    itemSort_countInputFun.updateCount(1, 'countInput');
                }
                temp_itemId = click_itemId;
            }
            // countText.textContent = countNum_Sort + 1;
            // console.log('计数：'+countNum_Sort);
            const popover = document.querySelector('.ant-popover:not(.ant-popover-hidden)');
            const inputField = popover.querySelector('.ant-input-number-input');
            if (inputField) {
                inputField.focus();
                inputField.click();
            } else {
                console.log('未找到输入字段');
            }
        }
    }

    // 查找点击的id
    function handleCellClick(event) {
        // 查找最接近的包含行元素的类
        let rowElement = event.target.closest('.ag-row');

        if (rowElement) {
            // 获取row-index属性
            let rowIndex = rowElement.getAttribute('row-index');
            // console.log('找到的行索引:', rowIndex);

            // 使用row-index属性查找行内的span标签
            let targetSpan = document.querySelector(`.ag-row[row-index="${rowIndex}"] span#MarkHighlight-upLiveId-upLiveId`);

            if (targetSpan) {
                return targetSpan.textContent;
                // 打印span的文本内容
                // console.log('目标span的文本内容:', targetSpan.textContent);
            } else {
                // console.log(`在行索引为${rowIndex}的行中未找到id为"MarkHighlight-upLiveId-upLiveId"的span标签。`);
            }
        } else {
            // console.log('未找到点击单元格对应的行。');
        }
    }

    /*
    =================
    打印标题优化
    =================
    */
    function titlePrint_extractData() {
        const dateElement = document.querySelector('.isSelect___qbUI1 .ant-space.css-9fw9up.ant-space-horizontal.ant-space-align-center.title___mA8xY .ant-space-item:nth-child(2) div');
        const sessionElement = document.querySelector('.truncate.sessionName___HUMKC.font-ma-semibold');

        if (dateElement && sessionElement) {
            const dateText = dateElement.textContent.trim();
            const sessionText = sessionElement.textContent.trim();

            GM_setValue('titlePrint_extractedDate', dateText);
            GM_setValue('titlePrint_extractedSession', sessionText);

            // console.log('Date extracted and stored:', dateText);
            // console.log('Session name extracted and stored:', sessionText);
        }
    }

    /*
    =================
    手卡标题优化
    =================
    */
    // 网址id提取
    function url_getSessionGoodsId() {
        const url = window.location.href;
        const match = url.match(/sessionGoodsId=(\d+)/);
        return match ? match[1] : null;
    }

    function modifyTableCardURL_title(itemId) {
        // console.log('itemId:', itemId);
        if (sAF_AdvanceTableCardTitle.getSwitchState()) {
            if (itemId && isTableCardURL()) {
                document.title = '【手卡 ' + itemId[0].toString().slice(-4) + '】' + itemId[1];
            }
        }

    }

    /*
    手卡附带检查链接功能
    */
    function isShowTableCheckedRow() {
        return tableCardPng_checkItemIdRow.getSwitchState();
    }

    function isCheckItemIdRow_onlyPng() {
        if (tableCardPng_checkItemIdRow_onlyPng.getSwitchState()) {
            return 'none';
        } else {
            return '';
        }
    }

    // 检查行生成函数
    function createTableCheckedRow(itemId, width1 = 0, width2 = 0, item_link = '') {
        // 创建 <tr> 元素
        const tr = document.createElement('tr');
        tr.id = 'checkedItemLink_TableCrad';
        tr.style.cssText = 'min-height: 30px; max-height: 30px;';
        tr.style.display = isCheckItemIdRow_onlyPng();

        // 创建第一个 <td> 元素
        const td1 = document.createElement('td');
        td1.colSpan = '3';
        td1.style.cssText = 'padding: 0px; height: 30px; align-items: center; justify-content: center; display: flex;';
        if (width1 > 0) td1.style.width = width1 + 'px';

        const marioSvg = createMarioSVGIconWrapper('svgCheckedRow', false, 16);

        const superItemLink = document.createElement('a');
        superItemLink.href = item_link;
        superItemLink.target = '_blank';

        // 创建第一个 <div> 元素
        const div1 = document.createElement('div');
        div1.style.cssText = 'display: flex; align-items: center; justify-content: center; height: 100%;';

        // 创建第一个 <span> 元素
        const span1 = document.createElement('span');
        span1.style.cssText = 'color: rgb(236, 40, 39); font-size: 16px; text-align: center; margin-left: 1px;';
        span1.textContent = '上播商品ID核对：';

        // 创建第二个 <span> 元素，放置链接内容
        const span2 = document.createElement('span');
        span2.id = 'cureentItem_upLiveId';
        span2.style.cssText = 'color: rgb(51, 51, 51); font-size: 16px; font-weight: bold; transition: color 0.3s ease;';
        span2.textContent = itemId;

        // 设置悬浮时变颜色
        span2.onmouseover = function () {
            if (span2.style.cursor === 'pointer') {
                span2.style.color = 'rgb(0, 145, 255)';  // 悬浮时的颜色
            }
        };

        // 悬浮离开时恢复原色
        span2.onmouseout = function () {
            if (span2.style.cursor === 'pointer') {
                span2.style.color = 'rgb(51, 51, 51)';  // 恢复默认颜色
            }
        };

        if (item_link !== '') {
            span2.style.cursor = 'pointer';

            if (sonMain_pictureInPictureSwitch.getSwitchState()) {
                // 新功能
                // console.log('item_link:', changeLinkToMobilePhone(item_link));
                const pipManager = new PIPManager(changeLinkToMobilePhone(item_link), span2, false);
                // const pipManager = new PIPManager(item_link, span2, true);
            } else {
                // 原有功能
                span2.onclick = function () {
                    window.open(item_link, '_blank'); // 跳转到商品链接
                };
            }
        }

        // 将 span2 放入 span1，然后放入 div1
        span1.appendChild(span2);
        superItemLink.appendChild(marioSvg);
        div1.appendChild(superItemLink);
        div1.appendChild(span1);

        // 将 div1 放入 td1
        td1.appendChild(div1);

        // 创建第二个 <td> 元素
        const td2 = document.createElement('td');
        td2.colSpan = '7';
        td2.style.cssText = 'padding: 0px; align-items: center; justify-content: center; height: 30px;';
        if (width2 > 0) td2.style.width = width2 + 'px';

        // 创建第二个 <div> 元素
        const div2 = document.createElement('div');
        div2.style.cssText = 'display: flex; align-items: center; justify-content: center; height: 100%;';

        // 创建第三个 <span> 元素
        const span3 = document.createElement('span');
        span3.style.cssText = 'color: rgb(51, 51, 51); font-size: 16px; text-align: center;white-space: pre-wrap;';
        span3.textContent = '请回复有误、无误、正确之类的，不要收到、1之类的不明确信息，要让我们知道你核对完了';
        // 使用 innerHTML 设置带有部分上色的内容
        span3.innerHTML = `核对完所有栏目后，请回复<span style="color: rgb(13, 193, 97); font-weight: bold;">有误、无误、正确</span>之类的，不要<span style="color: rgb(236, 40, 39); font-weight: bold;">收到、1</span>之类的不明确信息，要让我们知道你核对完了`;

        // 将 span3 放入 div2，然后放入 td2
        div2.appendChild(span3);
        td2.appendChild(div2);

        // 将两个 td 放入 tr
        tr.appendChild(td1);
        tr.appendChild(td2);

        // 返回生成的 <tr> 元素
        return tr;
    }

    // 用于更新插入的行中的 id
    function changeNewTrItemId(itemId, item_link = '') {
        const idSpan = document.getElementById('cureentItem_upLiveId');
        if (idSpan) {
            idSpan.textContent = itemId;
        }

        const span2 = document.getElementById('cureentItem_upLiveId');

        if (item_link !== '') {
            span2.style.cursor = 'pointer';

            if (sonMain_pictureInPictureSwitch.getSwitchState()) {
                // 新功能
                // console.log('item_link:', changeLinkToMobilePhone(item_link));
                const pipManager = new PIPManager(changeLinkToMobilePhone(item_link), span2, false);
                // const pipManager = new PIPManager(item_link, span2, true);
            } else {
                // 原有功能
                span2.onclick = function () {
                    window.open(item_link, '_blank'); // 跳转到商品链接
                };
            }
        }
    }

    function insertCheckedRow(itemId, item_link = '') {
        if (!document.getElementById('checkedItemLink_TableCrad')) {
            const tableElement = document.querySelector('table');

            if (tableElement) {
                const rows = tableElement.querySelectorAll('tr');

                // 确保表格中至少有三个 <tr> 元素
                if (rows.length >= 3) {
                    // 获取第三个 <tr> 元素
                    const thirdRow = rows[2];

                    // 生成新的 <tr> 元素
                    const newRow = createTableCheckedRow(itemId, 0, 0, item_link);

                    // 在第三个 <tr> 元素的后面插入新行
                    thirdRow.parentNode.insertBefore(newRow, thirdRow.nextSibling);
                } else {
                    // console.log("表格中没有足够的行来插入新行。");
                }
            } else {
                // console.log("没有找到表格");
            }
        } else {
            changeNewTrItemId(upLiveIdArray[0], upLiveIdArray[2]);
        }
    }

    /*
    用于打印页面的插入XHR数据获取
    */
    let upLiveIdArray = []; // 上播商品id
    let shopNameArray = []; // 店铺名称
    let goodsUrlArray = []; // 商品链接
    let sessionGoodsId = []; // 编辑页面id

    // 封装提取 upLiveId 的函数
    // 打印页面数据获取
    function extractUpLiveIdsFromResponse(responseText) {
        try {
            const response = JSON.parse(responseText);

            // 初始化 upLiveIdArray, shopNameArray ,goodsUrlArray 数组
            upLiveIdArray = [];
            shopNameArray = [];
            goodsUrlArray = [];
            sessionGoodsId = [];

            if (response.data && Array.isArray(response.data)) {
                // 提取 upLiveId 并过滤掉 undefined
                upLiveIdArray = response.data.map(item => item.upLiveId).filter(id => id !== undefined);

                // 提取 sessionGoodsId 并过滤掉 undefined
                sessionGoodsId = response.data.map(item => item.sessionGoodsId).filter(id => id !== undefined);

                // 提取 shopName 并过滤掉 undefined
                shopNameArray = response.data.map(item => {
                    if (item.cardUseDataStyle) {
                        const cardUseDataStyle = JSON.parse(item.cardUseDataStyle);
                        const shopData = cardUseDataStyle.find(subItem => subItem.useFieldName === 'shopName');
                        return shopData ? shopData.useFieldValue : undefined;
                    }
                }).filter(shopName => shopName !== undefined); // 过滤掉 undefined 的 shopName 值

                // 提取 goodsUrl 并过滤掉 undefined
                goodsUrlArray = response.data.map(item => item.goodsUrl).filter(goodsUrl => goodsUrl !== undefined);

            } else {
                // console.error("响应中未找到有效的 data 字段");
            }

            // console.log("提取的 upLiveId:", upLiveIdArray);
            // console.log("提取的 shopName:", shopNameArray);
            // console.log("提取的 goodsUrl:", goodsUrlArray);
            // console.log("提取的 sessionGoodsId:", sessionGoodsId);
        } catch (error) {
            console.error("解析响应失败:", error);
        }
    }

    // 手卡页面数据获取
    function extractUpLiveIdFromTableCardResponse(responseText) {
        try {
            const response = JSON.parse(responseText);

            // 初始化 upLiveIdArray 数组
            upLiveIdArray = [];

            // 检查响应数据中的 data 字段
            if (response.data && typeof response.data === 'object') {
                // 提取 data 对象中的 upLiveId
                const upLiveId = response.data.upLiveId;
                if (upLiveId !== undefined) {
                    // 将 upLiveId 存储到数组中
                    upLiveIdArray[0] = upLiveId;
                } else {
                    // console.error("响应的 data 对象中未找到 upLiveId 字段");
                }
                // 解析 cardUseDataStyle 字符串为数组
                if (response.data.cardUseDataStyle) {
                    const cardUseDataStyle = JSON.parse(response.data.cardUseDataStyle);

                    // 在 cardUseDataStyle 数组中查找 useFieldName 为 'shopName' 的对象
                    const shopData = cardUseDataStyle.find(item => item.useFieldName === 'shopName');
                    if (shopData && shopData.useFieldValue) {
                        upLiveIdArray[1] = shopData.useFieldValue; // 存储 shopName 到数组的第 1 位置
                    } else {
                        // console.error("未找到 useFieldName 为 'shopName' 的对象或 useFieldValue 为空");
                    }
                } else {
                    // console.error("响应中未找到有效的 cardUseDataStyle 字符串");
                }

                // 提取 data 对象中的 goodsUrl
                const goodsUrl = response.data.goodsUrl;
                if (goodsUrl !== undefined) {
                    // 将 upLiveId 存储到数组中
                    upLiveIdArray[2] = goodsUrl;
                }

                // 更新手卡标题
                modifyTableCardURL_title(upLiveIdArray);
            } else {
                // console.error("响应中未找到有效的 data 字段，或 data 不是对象");
            }
        } catch (error) {
            // console.error("解析响应失败:", error);
        }
    }

    // 手卡页面切换数据获取
    function extractUpLiveIdsFromNextTableCardResponse(responseText) {
        try {
            const response = JSON.parse(responseText);

            // 初始化 upLiveIdArray 数组
            upLiveIdArray = [];

            // 检查响应数据中的 data 字段
            if (response.data && typeof response.data === 'object') {
                // 提取 data 对象中的 upLiveId
                const upLiveId = response.data.linkHandCardDetailRespDTO.upLiveId;
                if (upLiveId !== undefined) {
                    // 将 upLiveId 存储到数组中
                    upLiveIdArray[0] = upLiveId;
                } else {
                    // console.error("响应的 data 对象中未找到 upLiveId 字段");
                }
                // 解析 cardUseDataStyle 字符串为数组
                if (response.data.linkHandCardDetailRespDTO.cardUseDataStyle) {
                    const cardUseDataStyle = JSON.parse(response.data.linkHandCardDetailRespDTO.cardUseDataStyle);

                    // 在 cardUseDataStyle 数组中查找 useFieldName 为 'shopName' 的对象
                    const shopData = cardUseDataStyle.find(item => item.useFieldName === 'shopName');
                    if (shopData && shopData.useFieldValue) {
                        upLiveIdArray[1] = shopData.useFieldValue; // 存储 shopName 到数组的第 1 位置
                    } else {
                        // console.error("未找到 useFieldName 为 'shopName' 的对象或 useFieldValue 为空");
                    }
                } else {
                    // console.error("响应中未找到有效的 cardUseDataStyle 字符串");
                }

                // 提取 data 对象中的 goodsUrl
                const goodsUrl = response.data.linkHandCardDetailRespDTO.goodsUrl;
                if (goodsUrl !== undefined) {
                    // 将 upLiveId 存储到数组中
                    upLiveIdArray[2] = goodsUrl;
                }

                // 更新手卡标题
                modifyTableCardURL_title(upLiveIdArray);
            } else {
                // console.error("响应中未找到有效的 data 字段，或 data 不是对象");
            }
        } catch (error) {
            // console.error("解析响应失败:", error);
        }
    }

    let goodsUrlCheckArray = {}; // shopName, upLiveId, weight, liveLink, sessionGoodsName

    // 提取商品列表中的id
    function extractUpLiveIdsFromGoodsListResponse(responseText) {
        try {
            const response = JSON.parse(responseText);

            // 初始化 upLiveIdArray 数组
            upLiveIdArray = [];

            if (response.data && Array.isArray(response.data)) {
                // 提取 upLiveId 并过滤掉 undefined
                upLiveIdArray = response.data
                    .map(item => item.sessionGoods?.upLiveId)
                    .filter(id => id !== undefined);

                // 初始化 goodsUrlCheckArray 字典
                goodsUrlCheckArray = {};

                // 填充 goodsUrlCheckArray
                response.data.forEach(item => {
                    if (item.sessionGoods && item.sessionGoods.upLiveId !== undefined) {
                        const upLiveId = item.sessionGoods.upLiveId;
                        // const shopName = item.sessionGoods.shopName || '未知店铺';
                        const shopName = item.selectionGoods.shopDetailRespDTO.outShopName || '未知店铺';
                        const weight = item.sessionGoods.weight || 0;
                        const liveLink = item.sessionGoods.liveLink || '#';
                        const sessionGoodsName = item.sessionGoods.sessionGoodsName || '未知商品';

                        // 将信息存储到 goodsUrlCheckArray 中
                        goodsUrlCheckArray[upLiveId] = {
                            shopName: shopName,
                            upLiveId: upLiveId,
                            weight: weight,
                            liveLink: liveLink,
                            sessionGoodsName: sessionGoodsName
                        };
                    }
                });
            } else {
                console.error("响应中未找到有效的 data 字段");
            }

            // console.log("提取的 upLiveId:", upLiveIdArray);
            // console.log("提取的 goodsUrlCheckArray:", goodsUrlCheckArray);
        } catch (error) {
            console.error("解析响应失败:", error);
        }
    }

    // 封装 XMLHttpRequest 的 open 方法重写
    function overrideOpenMethod() {
        const originalOpen = XMLHttpRequest.prototype.open;

        XMLHttpRequest.prototype.open = function (method, url) {
            this._method = method;
            this._url = url;
            originalOpen.apply(this, arguments);
        };
    }

    // 封装 XMLHttpRequest 的 send 方法重写
    function overrideSendMethod() {
        const originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.send = function (data) {
            const originalOnReadyStateChange = this.onreadystatechange;

            this.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    if (this._method === "POST" && /https:\/\/gw\.linkmcn\.com\/live\/live\/card\/batchDetail.*/.test(this._url)) {
                        // console.log("匹配的POST请求URL:", this._url);

                        // 调用封装的函数来提取 upLiveId
                        extractUpLiveIdsFromResponse(this.responseText);
                        // console.log("提取的 upLiveId:", upLiveIdArray);
                    }
                    if (this._method === "POST" && /https:\/\/gw\.linkmcn\.com\/live\/live\/card\/detail.*/.test(this._url)) {
                        // console.log("匹配的POST请求URL:", this._url);

                        // 调用封装的函数来提取 upLiveId
                        extractUpLiveIdFromTableCardResponse(this.responseText);
                        // console.log("提取手卡的 upLiveId:", upLiveIdArray);
                    }
                    if (this._method === "POST" && /https:\/\/gw\.linkmcn\.com\/live\/live\/card\/nextLiveHandCard.*/.test(this._url)) {
                        // console.log("匹配的POST请求URL:", this._url);

                        // 调用封装的函数来提取 upLiveId
                        extractUpLiveIdsFromNextTableCardResponse(this.responseText);
                        // console.log("提取手卡切换的 upLiveId:", upLiveIdArray);
                    }
                    // 挂链商品id获取
                    if (this._method === "POST" && /https:\/\/gw\.linkmcn\.com\/live\/live\/sessionGoods\/liveSessionGoodsList.*/.test(this._url)) {
                        extractUpLiveIdsFromGoodsListResponse(this.responseText);
                    }
                }

                if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(this, arguments);
                }
            };

            originalSend.apply(this, arguments);
        };
    }

    // 判断是否是打印手卡页面，并重写 XMLHttpRequest 的方法
    if (isBatchPrintURL() || isTableCardURL() || isHomeURL()) {
        overrideOpenMethod();
        overrideSendMethod();
    }

    /*
    系统功能优化
    */
    // 创建一个MutationObserver实例
    // 绑定点击事件的外部函数
    function bindClickEventToNotification(url) {
        // console.log('绑定点击事件, 传入URL:' + url);
        const element = document.getElementById('showNotificationContainer');
        element.style.cursor = 'pointer';

        if (element) {
            // 定义点击事件处理函数
            function handleClick() {
                isHiding = true;
                NotificationContainer.style.animation = 'notificationButtonAnimation 0.5s forwards';

                window.location.href = url;

                setTimeout(function () {
                    NotificationContainer.style.display = 'none';
                    isHiding = false;
                    window.location.reload();
                }, 500);

                // 移除点击事件
                element.removeEventListener('click', handleClick);
                element.style.cursor = 'default';
            }

            // 绑定点击事件
            element.addEventListener('click', handleClick);
            setTimeout(function () {
                // 移除点击事件
                element.removeEventListener('click', handleClick);
                element.style.cursor = 'default';

                hideNotification();
            }, 5000);
        }
    }

    // 设置打印手卡的部分区域
    function setPrintTableCardArea(isActivated) {
        var isShow = isActivated ? 'flex' : 'none';
        var isInsertedShow = isActivated ? 'none' : 'flex'; // 与 isShow 相反的显示结果
        if (sAF_AdvanceBatchPrint_alwaysDisplay.getSwitchState()) isInsertedShow = 'flex'; // 强制显示上播ID核对行

        // 获取所有的table元素
        var tables = document.querySelectorAll('table');

        tables.forEach(function (table, i) {
            // 获取每个table中的tbody
            var tbody = table.querySelector('tbody');

            // 获取tbody中的所有tr行
            var rows = tbody.querySelectorAll('tr');

            // 遍历tr行并隐藏第三行之后的所有行
            rows.forEach(function (row, index) {
                if (index >= 3) { // 从第四行开始（索引为3），设置display为none
                    row.style.display = isShow;
                }
            });

            // 检查是否已经插入过具有相同id的tr
            var existingRow = tbody.querySelector('#checkedItemLink_TableCrad');
            if (existingRow) {
                existingRow.style.display = isInsertedShow; // 如果存在则更新显示状态
            } else {
                console.warn("不存在“上播ID核对”行，请检查是否已插入过该行。");
            }
        });
    }

    function insertCheckedRow_forBatchPrint(isActivated) {
        var isInsertedShow = isActivated ? 'flex' : 'none';

        // 获取所有的table元素
        var tables = document.querySelectorAll('table');

        tables.forEach(function (table, i) {
            // 获取每个table中的tbody
            var tbody = table.querySelector('tbody');

            // 获取tbody中的所有tr行
            var rows = tbody.querySelectorAll('tr');

            // 检查是否已经插入过具有相同id的tr
            var existingRow = tbody.querySelector('#checkedItemLink_TableCrad');
            if (!existingRow) {
                // 检查行
                var newRow = createTableCheckedRow(upLiveIdArray[i], 276.8492, 878.8229, goodsUrlArray[i]); // 创建新行
                rows[2].insertAdjacentElement('afterend', newRow); // 插入新行到第三个 <tr> 元素之后
                newRow.style.display = isInsertedShow; // 设置新行的显示状态
            }

            // 插入打印用的edit按钮（默认隐藏）
            var existingEditButton = tbody.querySelector('#editButton_TableCrad_print');
            if (!existingEditButton) {
                // 编辑按钮
                var newEditButton = createEditButton(sessionGoodsId[i], 'print');
                var targetDiv = rows[0].querySelector('#sessionName');
                targetDiv.appendChild(newEditButton);
            }

            // 插入edit按钮
            var existingEditButton = tbody.querySelector('#editButton_TableCrad_PIP');
            if (!existingEditButton) {
                // 编辑按钮
                var newEditButton = createEditButton(sessionGoodsId[i], 'PIP');
                var targetDiv = rows[0].querySelector('#sessionName');
                targetDiv.appendChild(newEditButton);
            }
        });
    }

    // 手卡编辑页面链接
    function getSessionGoodsIdUrl(id) {
        return 'https://m.linkmcn.com/\#/live/plan/tableCard/detail/' + id;
    }

    // 生成重定向链接
    function createRedirectUrl(id) {
        return 'https://item.taobao.com/item.htm?id=682878335608&link_redirectId=' + id;
    }

    function isRedirectToTableCardURL() {
        // 获取当前页面的 URL
        const currentUrl = window.location.href;

        // 检查当前 URL 是否包含指定的前缀
        if (isRedirectUrl()) {
            // 获取 "?" 后面的 id
            const id = currentUrl.split('link_redirectId=')[1];

            // 如果 id 存在，构造新的 URL 并重定向
            if (id) {
                const newUrl = getSessionGoodsIdUrl(id);
                // console.log("Redirecting to: " + newUrl); // 用于调试，查看重定向的 URL
                window.location.href = newUrl;  // 重定向到新网址
            } else {
                // console.error('No id found in the URL for redirection');
            }
        }
    }

    function printingTableCard() {
        const loadingText = document.querySelector('.ant-spin-text');

        if (loadingText) {
            // console.log('Loading text 出现在页面中');
            displayEditButtonType(true); // 显示中控按钮
            // displayEditButtonType(false); // 显示制表按钮
        } else {
            // console.log('Loading text 不在页面中');
            displayEditButtonType(false);
        }
    }

    function isPrintingTableCard() {
        const loadingText = document.querySelector('.ant-spin-text');

        if (loadingText) {
            return true;
        } else {
            return false;
        }
    }

    function displayEditButtonType(onPrint) {
        // onPrint 为 true 时显示中控按钮，false 时显示制表按钮
        var print_editButtons = document.querySelectorAll('#editButton_TableCrad_print');
        var PIP_editButtons = document.querySelectorAll('#editButton_TableCrad_PIP');


        if (onPrint && print_editButtons.length > 0 && PIP_editButtons.length > 0) {
            // 显示中控按钮,隐藏制表按钮
            print_editButtons.forEach(function (button) {
                // button.style.display = 'block';
                button.style.opacity = '1';
            });
            PIP_editButtons.forEach(function (button) {
                button.style.display = 'none';
            });
        } else {
            // 显示制表按钮,隐藏中控按钮
            print_editButtons.forEach(function (button) {
                // button.style.display = 'none';
                button.style.opacity = '0';
            });
            PIP_editButtons.forEach(function (button) {
                button.style.display = 'block';
            });
        }
    }

    function createEditButton(sessionGoodsId, idName) {
        const divWrapper = document.createElement('div');
        divWrapper.style.cssText = 'align-items: center; cursor: pointer; margin: 0px 8px;'; // 样式控制';

        // 直接在 SVG 中内嵌 onmouseover 和 onmouseout 事件
        var editSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        editSvg.setAttribute('class', 'icon icon-edit');
        editSvg.setAttribute('transition', 'fill 0.3s ease-in-out');
        editSvg.setAttribute('viewBox', '0 0 1024 1024');
        editSvg.setAttribute('width', '17');
        editSvg.setAttribute('height', '17');
        editSvg.innerHTML = '<path d="M853.333333 796.444444H170.666667c-34.133333 0-56.888889 22.755556-56.888889 56.888889s22.755556 56.888889 56.888889 56.888889h682.666666c34.133333 0 56.888889-22.755556 56.888889-56.888889s-22.755556-56.888889-56.888889-56.888889zM227.555556 739.555556h170.666666c17.066667 0 28.444444-5.688889 39.822222-17.066667l318.577778-318.577778c34.133333-34.133333 51.2-73.955556 51.2-119.466667s-17.066667-85.333333-51.2-119.466666l-11.377778-11.377778c-34.133333-34.133333-73.955556-51.2-119.466666-51.2s-85.333333 17.066667-119.466667 51.2L187.733333 472.177778c-11.377778 11.377778-17.066667 22.755556-17.066666 39.822222v170.666667c0 34.133333 22.755556 56.888889 56.888889 56.888889z m56.888888-204.8l301.511112-301.511112c11.377778-11.377778 22.755556-17.066667 39.822222-17.066666s28.444444 5.688889 39.822222 17.066666l11.377778 11.377778c11.377778 11.377778 17.066667 22.755556 17.066666 39.822222s-5.688889 28.444444-17.066666 39.822223L375.466667 625.777778H284.444444V534.755556z" p-id="1503">';
        editSvg.style.cssText = 'vertical-align: middle;'; // 垂直居中样式

        // 将 SVG 图标直接插入到链接元素中，确保其被 PDF 工具解析
        divWrapper.appendChild(editSvg);

        editSvg.addEventListener('mouseover', function () {
            this.style.fill = "rgb(0, 145, 255)";
        });

        editSvg.addEventListener('mouseout', function () {
            this.style.fill = "rgb(51, 51, 51)";
        });

        // 创建一个 <a> 元素，直接包裹 SVG 图标，避免动态事件处理丢失
        const editButton = document.createElement('a');
        editButton.id = 'editButton_TableCrad_' + idName;
        if (idName === 'print') {
            editButton.style.display = 'block';
            // 调整按键透明度
            editButton.style.opacity = '0';
            editButton.href = createRedirectUrl(sessionGoodsId); // 确保超链接指向正确的地址
            editButton.target = '_blank'; // 打开新标签
        } else {
            editButton.style.display = 'block';

            if (sonMain_pictureInPictureSwitch.getSwitchState()) {
                const pipManager = new PIPManager(getSessionGoodsIdUrl(sessionGoodsId), editButton, true);
            } else {
                editButton.href = getSessionGoodsIdUrl(sessionGoodsId);
                editButton.target = '_blank'; // 打开新标签
            }
        }

        editButton.appendChild(divWrapper);

        return editButton; // 返回带有超链接的按钮
    }

    // 判断是否是剧透时间
    function checkIfTrailer(storedDate) {
        const currentTime = new Date();
        let isTrailer = '';

        // 获取当前年份
        const currentYear = currentTime.getFullYear();

        // 将字符串日期转换为Date对象，加入当前年份
        let adjustedDate = new Date(`${currentYear}-${storedDate}T18:00:00`);

        // 将日期往前调整一天
        adjustedDate.setDate(adjustedDate.getDate() - 1);

        // 计算两个日期之间的差值（以天为单位）
        const timeDifference = Math.abs(currentTime - adjustedDate);
        const dayDifference = timeDifference / (1000 * 60 * 60 * 24);

        // 如果天数差值大于180天，考虑跨年情况，给adjustedDate加上1年
        if (dayDifference > 180) {
            adjustedDate.setFullYear(adjustedDate.getFullYear() + 1);
        }

        const printCard_switch = document.getElementById('button_setPrintTableCardArea_switch');
        const button_setPrintTableCardArea = document.getElementById('button_setPrintTableCardArea');

        if (button_setPrintTableCardArea && printCard_switch.getAttribute('aria-checked') === 'true') {
            isTrailer = "核对";
        } else {
            // 比较当前时间与截止时间
            if (currentTime < adjustedDate) {
                isTrailer = "剧透";
            } else {
                isTrailer = '';
            }
        }

        return isTrailer;
    }

    // 判断手卡打印页面中的手卡店铺名是否都一致
    function onlyOneShopName(shopNameArray) {
        // 过滤多余内容，生成过滤后的数组
        const filteredShopNames = shopNameArray.map(shopName => processText(shopName));

        // 判断所有过滤后的店名是否一致
        const allEqual = filteredShopNames.every(shopName => shopName === filteredShopNames[0]);

        // 如果所有内容一致，返回第一个店名，否则返回 false
        return allEqual ? filteredShopNames[0] : false;
    }

    function hide_link_helpMenu(isActivated = true) {
        var isShow = isActivated ? 'none' : '';

        // link帮助菜单
        const link_helpMenu = document.querySelector('.link-customer-service-only-help');

        if (link_helpMenu) link_helpMenu.style.display = isShow;
    }

    function hide_link_leftSiderMenu(isActivated = true) {
        var isShow = isActivated ? 'none' : '';

        // 获取父容器
        const parentElement = document.querySelector('.ant-layout.ant-layout-has-sider.css-9fw9up');

        if (parentElement) {
            // 获取直接的子元素
            const children = parentElement.children; // 返回一个HTMLCollection，包含所有直接子元素

            if (children.length === 3) {
                // 优化批量打印页面的显示
                children[0].style.display = isShow; // 隐藏右侧的操作栏
                children[1].style.display = isShow; // 隐藏右侧的操作栏
            } else {
                // console.log('页面元素数量不符合预期');
            }
        }
    }

    function hide_link_firstTabContainer(isActivated = true) {
        var isShow = isActivated ? 'none' : '';

        // 获取tab容器
        const tabContainer = document.getElementById('firstTabContainer');

        if (tabContainer) {
            tabContainer.style.display = isShow;

            createHeaderTabs(isActivated); // 重新创建顶部标签
        }
    }

    // 获取 svg 元素的 xlink:href 属性值
    function getUseHref(antSpaceItem) {
        // 查找 .ant-space-item 中的 <use> 元素
        const useElement = antSpaceItem.querySelector('use');

        // 检查是否找到了 <use> 元素
        if (useElement) {
            // 获取 <use> 元素的 xlink:href 属性值
            return useElement.getAttribute('xlink:href') || null;
        } else {
            // 如果没有找到 <use> 元素，返回 null
            return null;
        }
    }

    function hide_link_topBarMenu(isActivated = true) {
        var isShow = isActivated ? 'none' : '';

        // 获取顶部header
        const topHeader = document.querySelector('.ant-space.css-14s8ncx');
        const topHeader_item = topHeader.querySelectorAll('.ant-space-item');

        if (topHeader) {
            // 插入自定义SVG图标
            for (var i = 0; i < topHeader_item.length; i++) {
                if (getUseHref(topHeader_item[i]) === '#link-file-download-line') {
                    const svg = document.getElementById('link-live-calendarDiv');
                    const svgDiv = create_topBarMenuDivWithSVG('link-live-calendar', '#link-live-calendar', live_calendar);

                    if (!svg) {
                        topHeader.insertBefore(svgDiv, topHeader_item[i + 1]);
                    }

                    svg.style.display = isActivated ? '' : 'none'; // 隐藏SVG图标
                }
            }

            for (var i = 0; i < topHeader_item.length; i++) {
                if (getUseHref(topHeader_item[i]) !== '#link-file-download-line' && getUseHref(topHeader_item[i]) !== '#link-live-calendar') {
                    topHeader_item[i].style.display = isShow;
                }
            }
        } else {
            // console.log('顶部header元素不存在');
        }
    }

    const live_calendar = `<svg class="icon-component undefined" t="1731819675299" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5486" width="200" height="200">
    <path d="M869.130662 102.016l-45.930667 0 0 102.037333-163.242667 0L659.957328 102.016 364.063995 102.016l0 102.037333L200.821328 204.053333 200.821328 102.016 154.911995 102.016C98.826662 102.016 52.895995 147.925333 52.895995 204.053333l0 714.154667c0 56.128 45.930667 102.037333 102.016 102.037333l714.218667 0c56.085333 0 101.973333-45.909333 101.973333-102.037333L971.103995 204.053333C971.103995 147.925333 925.215995 102.016 869.130662 102.016zM889.525328 928.426667 134.517328 928.426667 134.517328 342.634667l755.008 0L889.525328 928.426667zM318.175995 0 246.751995 0l0 173.44 71.424 0L318.175995 0zM777.290662 0l-71.445333 0 0 173.44 71.445333 0L777.290662 0z" p-id="5487"></path>
    <path d="M512.010662 559.658667l256.448 0 0 257.536-256.448 0 0-257.536Z" p-id="5488"></path>
    </svg>`;

    function create_topBarMenuDivWithSVG(id, useHref, svgContent) {
        // 内部函数：生成SVG元素
        function getSVG(useHref, svgContent) {
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
            const svg = svgDoc.querySelector('svg');

            const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', useHref);

            svg.appendChild(use);
            return svg;
        }

        const div = document.createElement('div');
        div.className = 'ant-space-item';
        div.style.display = 'none';
        div.id = id + 'Div';

        const innerDiv = document.createElement('div');
        innerDiv.id = id;
        div.appendChild(innerDiv);

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'ant-btn css-14s8ncx ant-btn-circle ant-btn-text';
        innerDiv.appendChild(button);

        const span = document.createElement('span');
        span.className = 'ant-badge css-14s8ncx';
        button.appendChild(span);

        const svg = getSVG(useHref, svgContent);
        span.appendChild(svg);

        // 添加点击事件处理器
        button.addEventListener('click', function () {
            if (button.classList.contains('ant-btn-text')) {
                button.classList.remove('ant-btn-text');
                button.classList.add('ant-btn-primary');
                svg.style.fill = '#fff'; // 更改SVG填充颜色
                svg.style.color = '#fff'; // 更改SVG文本颜色

                pureMode(true);
                showNotification('直播日期：显示');
            } else {
                button.classList.add('ant-btn-text');
                button.classList.remove('ant-btn-primary');
                svg.style.fill = '#000'; // 恢复SVG填充颜色
                svg.style.color = '#000'; // 恢复SVG文本颜色

                pureMode(true);
                showNotification('直播日期：关闭');
            }
        });

        return div;
    }

    function getState_topBarMenuDivWithSVG() {
        const button = document.getElementById('link-live-calendar').querySelector('button');

        if (!button) {
            throw new Error('Invalid div element or missing button reference');
        }
        return button.classList.contains('ant-btn-primary');
    }

    function click_firstTabContainer(tabNumber) {
        // firstTabContainer
        const tabContainer = document.getElementById('firstTabContainer');

        if (tabContainer) {
            // 获取所有标签
            const tabs = tabContainer.querySelectorAll('.ant-tabs-tab');

            // 触发点击事件
            if (tabs[tabNumber - 1]) {
                tabs[tabNumber - 1].click();
                console.log(`Clicked tab with number ${tabNumber}`); // 调试信息
            } else {
                console.error(`Tab with number ${tabNumber} not found.`);
            }
        }
    }

    function getText_firstTabContainer(tabNumber) {
        // firstTabContainer
        const tabContainer = document.getElementById('firstTabContainer');

        if (tabContainer) {
            // 获取所有标签
            const tabs = tabContainer.querySelectorAll('.ant-tabs-tab');

            // return 标签文本
            if (tabs[tabNumber - 1]) {
                return tabs[tabNumber - 1].textContent;
            } else {
                return `标签${tabNumber}`;
            }
        }
    }

    function updateText_firstTabContainer() {
        for (let i = 1; i <= getTabsCount_firstTabContainer(); i++) {
            var link = document.getElementById(`pureMode_headerTabs_tab${i}`);
            if (link) {
                link.textContent = `${getText_firstTabContainer(i)}`;
            } else {
                console.error(`Link with ID ${link} not found.`);
            }
        }
    }

    function getTabsCount_firstTabContainer() {
        // firstTabContainer
        const tabContainer = document.getElementById('firstTabContainer');

        if (tabContainer) {
            // 获取所有标签
            const tabs = tabContainer.querySelectorAll('.ant-tabs-tab');
            // return 标签数量
            return tabs.length;
        } else {
            return 0;
        }
    }

    function createHeaderTabs(isActivated = false) {
        const originalHeader = document.getElementById('pureMode_headerTabs');

        if (originalHeader) {
            if (isActivated) {
                // 如果已存在且 isActivated 为 true，不需要做任何操作
                updateText_firstTabContainer(); // 更新文本内容
            } else {
                // 如果已存在且 isActivated 为 false，移除原有的 <span> 容器
                originalHeader.remove();
            }
            return;
        }

        if (!isActivated) {
            // 如果 isActivated 为 false 且不存在 <span> 容器，直接返回
            return;
        }
        // 创建一个新的 <span> 容器
        const spanContainer = document.createElement('span');
        // 设置id属性
        spanContainer.id = 'pureMode_headerTabs';

        // 设置样式使 <a> 标签水平排列
        spanContainer.style.display = 'flex';
        spanContainer.style.gap = '16px'; // 添加间距
        spanContainer.style.margin = '0px'; // 添加外边距

        // 循环创建多个 <a> 标签
        for (let i = 1; i <= getTabsCount_firstTabContainer(); i++) {
            const link = document.createElement('a');
            // link.href = '#'; // 可以设置为实际链接
            link.textContent = `${getText_firstTabContainer(i)}`; // 设置默认文本内容
            link.id = `pureMode_headerTabs_tab${i}`; // 设置ID

            // 设置初始样式
            link.style.color = 'rgb(51, 51, 51)';
            link.style.fontSize = '14px';
            link.style.fontWeight = '500';
            link.style.transition = 'color 0.3s ease'; // 添加过渡动画
            link.style.whiteSpace = 'nowrap'; // 阻止内容换行

            // 设置悬停样式
            link.addEventListener('mouseover', () => {
                link.style.color = 'rgb(255, 100, 3)';
            });

            link.addEventListener('mouseout', () => {
                link.style.color = 'rgb(51, 51, 51)';
            });

            // 绑定点击事件
            link.addEventListener('click', (event) => {
                console.log(`Link with ID ${link.id} clicked`); // 调试信息
                event.preventDefault(); // 阻止默认的链接跳转行为
                event.stopPropagation(); // 阻止事件冒泡
                event.stopImmediatePropagation(); // 阻止其他事件处理程序
                click_firstTabContainer(i); // 调用点击函数
                return false; // 防止其他默认行为
            });

            // 将 <a> 标签添加到 <span> 容器中
            spanContainer.appendChild(link);
        }

        // 查找目标容器
        const targetContainer = document.querySelector('.ant-pro-global-header');

        // 检查目标容器是否存在
        if (targetContainer) {
            // 获取目标容器的第二个子元素作为参考节点
            const referenceNode = targetContainer.children[1];

            // 检查是否有足够的子元素以确定第二个位置
            if (referenceNode) {
                // 将 span 容器插入到目标容器的第二个位置
                targetContainer.insertBefore(spanContainer, referenceNode);
            } else {
                // 如果没有第二个子元素，则直接添加到末尾
                targetContainer.appendChild(spanContainer);
            }
        } else {
            console.error('Target container not found.');
        }
    }

    function smallLogo(restore = false) {
        const container = document.querySelector('.ant-pro-global-header-logo-mix');

        if (container) {
            const logo = container.querySelector('a').querySelector('img');

            if (logo) {
                if (restore) {
                    logo.src = 'https://assets.linkmcn.cn/v2/img/logo-org.png';
                } else {
                    logo.src = 'https://assets.linkmcn.cn/public/logo.ico';
                }
            }
        } else {
            console.error('Container not found.');
        }
    }

    function adapter_moreSearchMenu() {
        const moreSearchButton = document.querySelector('.ant-pro-query-filter-collapse-button');

        if (moreSearchButton) {
            // button文本
            buttonText = moreSearchButton.textContent;

            if (buttonText === '收起') {
                return 132;
            } else {
                return 0;
            }
        }
    }

    // 纯净模式函数
    function pureMode(isActivated) {
        var isShow = isActivated ? 'none' : '';
        var targetHeight = document.documentElement.scrollHeight - 188;

        targetHeight -= adapter_moreSearchMenu(); // 适配更多搜索菜单展开或收起

        hide_link_helpMenu(isActivated); // 隐藏帮助菜单

        hide_link_leftSiderMenu(isActivated); // 隐藏左侧菜单

        hide_link_topBarMenu(isActivated); // 隐藏顶部菜单

        smallLogo(!isActivated); // 切换小图标

        hide_link_firstTabContainer(isActivated); // 隐藏第一个tab容器

        // tab容器消失引起的问题修复
        adapter_SomePage(isActivated); // 适配紧急加品页面

        

        // 直播场次日期切换菜单
        const liveDay_selectMenu = document.querySelector('.flex.justify-between.pb-12');
        // 直播场次总览
        const liveOverview_table = document.querySelector('.link-session-board-pai___eddtw').parentElement;

        const otherElements = document.querySelector('.ag-body-horizontal-scroll-viewport');

        // 底部多余栏目
        const bottomExtra_div = document.querySelector('.ag-grid-sticky-scroll');
        bottomExtra_div.style.display = isShow;

        // 设置元素的显示状态
        liveDay_selectMenu.style.display = getDisplay_liveDay_selectMenu();
        if (liveDay_selectMenu.style.display !== 'none' && isActivated) {
            liveDay_selectMenu.style.paddingTop = '12px';
            liveDay_selectMenu.style.paddingBottom = '0px';
            targetHeight -= 60;
        } else {
            liveDay_selectMenu.style.paddingTop = '0px';
            liveDay_selectMenu.style.paddingBottom = '12px';
        }

        liveOverview_table.style.display = isShow;
        // otherElements.style.display = isShow;

        // margin优化
        const margin_value = isActivated ? '0px' : '12px';
        const mainElement = document.querySelector('main');

        mainElement.style.marginTop = margin_value;
        // mainElement.style.marginBottom = margin_value;

        // 商品操作框
        // 外部框
        const goodsOperation_div = document.querySelectorAll('.ant-spin-container');
        // 内部表格
        const goodsOperation_table = document.getElementById('ag-grid-react-container');

        // 设置商品操作框的高度
        // goodsOperation_div[0].style.height = isShow === 'none' ? targetHeight + 'px' : '1085px';
        goodsOperation_div[1].style.height = isShow === 'none' ? targetHeight + 'px' : '548px';
        goodsOperation_table.style.height = isShow === 'none' ? targetHeight + 'px' : '548px';

        // 获取顶部菜单按钮显示状态
        function getDisplay_liveDay_selectMenu(noneDispaly = isActivated) {
            if (getState_topBarMenuDivWithSVG()) {
                return '';
            } else {
                if (noneDispaly) {
                    return 'none';
                } else {
                    return '';
                }
            }
        }

        function adapter_SomePage(isActivated) {
            // 适配紧急加品页面
            if (checkActiveTab_JiaPin()) {
                const buttonBar = document.querySelector('.sticky'); // 顶部按钮栏

                const tableHeader = document.querySelector('.ant-table-sticky-holder'); // 表格表头

                if (isActivated) {
                    buttonBar.style.top = '0px';
                    tableHeader.style.top = '0px';
                } else {
                    buttonBar.style.top = '60px';
                    tableHeader.style.top = '116px';
                }
            }

            // 适配待确认页面
            if (checkActiveTab_WaitComfirm()) {
                const tableHeader = document.querySelector('.ant-table-sticky-holder'); // 表格表头

                if (isActivated) {
                    tableHeader.style.top = '0px';
                } else {
                    tableHeader.style.top = '60px';
                }
            }
        }
    }

    // pureMode 场次信息辅助显示
    function pureMode_infoDisplay(isActivated) {
        // 场次信息数据
        const storedDate = GM_getValue('titlePrint_extractedDate', '');
        const storedSession = GM_getValue('titlePrint_extractedSession', '');

        if (isActivated && !getDropdownContentDisplayState()) {
            dropdownButton.textContent = storedDate + ' ' + storedSession;
        } else {
            dropdownButton.textContent = dropdownButtonName;
        }
    }

    // 手卡页面优化功能区
    function tableCard_optimize(isActivated) {
        // 优化手卡页面的显示
        if (isActivated) {
            // 隐藏顶部header
            document.querySelectorAll('.ant-pro-layout-container.css-zk6fk3 header').forEach(header => {
                header.style.display = 'none';
            });

            // 隐藏帮助菜单
            hide_link_helpMenu();

            // 设置操作栏
            const titleContainer = document.querySelector('.TableCard .tct-title-container');
            if (titleContainer) titleContainer.style.top = '0';  // 设置top值

            // 隐藏禁用词栏
            const disabledWords = document.querySelector('.forbidden-word-container');
            if (disabledWords) disabledWords.style.display = 'none';
        }
    }

    function find_pip_restore_button() {
        const button = document.getElementById('pip_restore_button');

        if (button) {
            return button;
        } else {
            // console.warn('PIP restore button not found!');
            return null;
        }
    }

    // 手卡页面&批量打印页面-适配小窗功能区
    function adapterPIP_forTableCardAndBatchPrint(isActivated, reset = false) {
        if (find_pip_restore_button()) reset = true; // 如果存在己收起按钮，恢复边距
        // 适配小窗功能区
        const windowWidth = window.innerWidth; // 获取当前窗口宽度
        const PIP_width = getWidth_PIP() * getDisplayScale(); // 获取小窗宽度

        function getDisplayScale() {
            const displayWidth = window.innerWidth;
            let displayScale = displayWidth / 1530;

            return displayScale;
        }

        if (isTableCardURL()) {
            // 获取手卡页面宽度
            const tableCard_width = getWidth_TableCard();
            // 剩余宽度
            const remaining_width = windowWidth - tableCard_width - 10;
            // 默认左右margin值
            const default_margin = remaining_width / 2;

            if (isActivated && PIP_width != 0) {
                if (reset) {
                    setMargin_TableCard(default_margin); // 重置边距
                } else if (remaining_width < PIP_width) {
                    setMargin_TableCard(remaining_width, 10); // 设置边距
                } else {
                    setMargin_TableCard(PIP_width, remaining_width - PIP_width); // 设置边距
                }
            } else {
                setMargin_TableCard(default_margin); // 重置边距
            }

            setMargins_ant_modal_contents(isActivated, PIP_width, reset);
        }

        if (isBatchPrintURL()) {
            // 获取批量打印页面宽度
            const batchPrint_width = getWidth_BatchPrint();
            // 剩余宽度
            const remaining_width = windowWidth - batchPrint_width - 40;
            // 默认左右margin值
            const default_margin = remaining_width / 2;

            if (isActivated && PIP_width != 0) {
                if (reset) {
                    setMargin_BatchPrint(default_margin); // 重置边距
                } else if (remaining_width < PIP_width) {
                    setMargin_BatchPrint(remaining_width, 10); // 设置边距
                } else {
                    setMargin_BatchPrint(PIP_width, remaining_width - PIP_width); // 设置边距
                }
            } else {
                setMargin_BatchPrint(default_margin); // 重置边距
            }
        }
    }

    // 获取小窗宽度
    function getWidth_PIP(PIP_margin = 10) {
        // 确保PIP_margin是数字
        if (typeof PIP_margin !== 'number') {
            PIP_margin = 10;
        }

        // 获取小窗元素
        const PIP_element = document.getElementById('mini_PIP');

        // 检查元素是否存在
        if (!PIP_element) {
            // console.warn('PIP element not found!');
            return 0;  // 如果元素不存在，返回默认宽度
        }

        if (PIP_element.style.display === 'none') {
            return 0;
        }

        // 获取PIP宽度并返回
        const PIP_width = PIP_element.clientWidth;
        return PIP_width + PIP_margin * 2;
    }

    // 获取小窗位置
    function getPosition_PIP() {
        // true = 左; false = 右
        // 获取小窗元素
        const PIP_element = document.getElementById('mini_PIP');

        // 检查元素是否存在
        if (!PIP_element) {
            // console.warn('PIP element not found!');
            return false;  // 如果元素不存在，返回默认位置
        }

        const pipRect = PIP_element.getBoundingClientRect();
        const centerX = pipRect.left + pipRect.width / 2;

        // 判断PIP位置，决定收起方向
        const isLeftSide = centerX < window.innerWidth / 2;

        return isLeftSide;
    }

    // 获取手卡页面手卡宽度
    function getWidth_TableCard() {
        // 获取手卡元素
        const tableCard_element = document.querySelector('.A4-contianer');

        // 检查元素是否存在
        if (!tableCard_element) {
            console.warn('Table card element not found!');
            return 1194;  // 如果元素不存在，返回默认宽度
        }

        tableCard_element.style.transition = 'margin 0.3s ease';

        // 获取手卡宽度并返回
        const tableCard_width = tableCard_element.clientWidth;
        return tableCard_width;
    }

    // 设置手卡页面边距
    function setMargin_TableCard(margin_valueMain, margin_valueRemain = margin_valueMain, isLeftSide = getPosition_PIP()) {
        const target_element = document.querySelector('.A4-contianer');

        if (isLeftSide) {
            // 靠近左侧
            target_element.style.marginLeft = margin_valueMain + 'px';
            target_element.style.marginRight = margin_valueRemain + 'px';
        } else {
            // 靠近右侧
            target_element.style.marginRight = margin_valueMain + 'px';
            target_element.style.marginLeft = margin_valueRemain + 'px';
        }
        if (margin_valueMain === margin_valueRemain) {
            target_element.style.marginLeft = margin_valueMain + 'px';
            target_element.style.marginRight = margin_valueMain + 'px';
        }
    }

    // 获取相关手卡宽度
    function getWidths_ant_modal_contents() {
        // 获取所有相关手卡弹窗元素
        const ant_modal_contents = document.querySelectorAll('.ant-modal.css-9fw9up');

        if (!ant_modal_contents || ant_modal_contents.length === 0) {
            // console.warn('No ant_modal_content elements found!');
            return [];  // 如果没有找到元素，返回空数组
        }

        // 遍历每个元素，获取宽度，并添加到结果数组中
        const widths = [];
        ant_modal_contents.forEach(modal => {
            modal.style.transition = 'margin 0.3s ease'; // 添加过渡效果
            const width = modal.clientWidth;
            widths.push(width);
        });

        return widths;
    }

    // 设置相关手卡弹窗边距
    function setMargin(target_element, margin_valueMain, margin_valueRemain = margin_valueMain, isLeftSide = getPosition_PIP()) {
        if (isLeftSide) {
            // 靠近左侧
            target_element.style.marginLeft = margin_valueMain + 'px';
            target_element.style.marginRight = margin_valueRemain + 'px';
        } else {
            // 靠近右侧
            target_element.style.marginRight = margin_valueMain + 'px';
            target_element.style.marginLeft = margin_valueRemain + 'px';
        }
        if (margin_valueMain === margin_valueRemain) {
            target_element.style.marginLeft = margin_valueMain + 'px';
            target_element.style.marginRight = margin_valueMain + 'px';
        }
    }

    function setMargins_ant_modal_contents(isActivated, PIP_width, reset) {
        const target_elements = document.querySelectorAll('.ant-modal.css-9fw9up');

        if (!target_elements || target_elements.length === 0) {
            // console.warn('No ant_modal_content elements found!');
            return;  // 如果没有找到元素，直接返回
        }

        target_elements.forEach(target_element => {
            const ant_modal_content_width = target_element.clientWidth;
            const remaining_width = window.innerWidth - ant_modal_content_width - 10;
            const default_margin = remaining_width / 2;

            if (isActivated && PIP_width !== 0) {
                if (reset) {
                    setMargin(target_element, default_margin); // 重置边距
                } else if (remaining_width < PIP_width) {
                    setMargin(target_element, remaining_width, 10); // 设置边距
                } else {
                    setMargin(target_element, PIP_width, remaining_width - PIP_width); // 设置边距
                }
            } else {
                setMargin(target_element, default_margin); // 重置边距
            }
        });
    }

    // 设置批量打印页面边距
    function setMargin_BatchPrint(margin_valueMain, margin_valueRemain = margin_valueMain, isLeftSide = getPosition_PIP()) {
        const target_element = document.querySelector('.w-1160px.m-auto.flex-1.overflow-y-auto');

        if (isLeftSide) {
            // 靠近左侧
            target_element.style.marginLeft = margin_valueMain + 'px';
            target_element.style.marginRight = margin_valueRemain + 'px';
        } else {
            // 靠近右侧
            target_element.style.marginRight = margin_valueMain + 'px';
            target_element.style.marginLeft = margin_valueRemain + 'px';
        }
        if (margin_valueMain === margin_valueRemain) {
            target_element.style.marginLeft = 'auto';
            target_element.style.marginRight = 'auto';
        }
    }

    // 获取批量打印页面手卡宽度
    function getWidth_BatchPrint() {
        // 获取手卡元素
        const tableCard_element = document.querySelector('.w-1160px.m-auto.flex-1.overflow-y-auto');

        // 检查元素是否存在
        if (!tableCard_element) {
            console.warn('Batch print element not found!');
            return 1160;  // 如果元素不存在，返回默认宽度
        }

        tableCard_element.style.transition = 'margin 0.3s ease';

        // 获取手卡宽度并返回
        const tableCard_width = tableCard_element.clientWidth;
        return tableCard_width;
    }

    // 批量打印页面优化功能区
    function batchPrint_optimize(isActivated) {
        if (isActivated) {
            // 隐藏帮助菜单
            hide_link_helpMenu();

            // 隐藏左侧菜单
            hide_link_leftSiderMenu();
        }
    }

    // 计数关闭浏览器更新弹窗次数
    function incrementCloseCount() {
        // 从本地存储中获取当前关闭计数
        let closeCount = localStorage.getItem('browserUpdateCloseCount');

        // 如果没有存储记录，则初始化为0
        if (closeCount === null) {
            closeCount = 0;
        } else {
            closeCount = parseInt(closeCount, 10);  // 确保获取到的是数字
        }

        // 增加计数
        closeCount += 1;

        // 将更新后的计数存回本地存储
        localStorage.setItem('browserUpdateCloseCount', closeCount);

        // console.log(`关闭浏览器更新弹窗次数: ${closeCount}`);
    }

    // 读取关闭浏览器更新弹窗次数
    function getCloseCount() {
        let closeCount = localStorage.getItem('browserUpdateCloseCount');

        // 如果本地存储中没有记录，返回0
        if (closeCount === null) {
            closeCount = 0;
        } else {
            closeCount = parseInt(closeCount, 10);  // 确保获取到的是数字
        }

        return closeCount;
    }

    // 判断商品信息页面是否在加载中
    function isItemPageLoading() {
        console.log('isItemPageLoading is Rushing');
        return document.querySelectorAll('.ant-spin-dot-item').length > 0;
    }

    const sys_auxiliaryFunctions = new MutationObserver((mutationsList) => {
        let urlChanged = false;

        // 场次信息数据
        const storedDate = GM_getValue('titlePrint_extractedDate', '');
        const storedSession = GM_getValue('titlePrint_extractedSession', '');

        // 重定向到手卡编辑页面
        isRedirectToTableCardURL();

        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    // 系统通知位置优化
                    if (node.nodeType === 1 && node.classList.contains('ant-message') && node.classList.contains('ant-message-top') && node.classList.contains('css-190m0jy')) {
                        // 修改top值为64px
                        node.style.top = '64px';
                    }

                    if (sAF_closeBrowserUpdateDiv.getSwitchState()) {
                        // 关闭浏览器更新弹窗
                        if (node.nodeType === 1 && node.id === 'link-browser-update-global') {
                            const closeButton = node.querySelector('.link-browser-update-global-close');
                            if (closeButton) {
                                closeButton.click();
                                incrementCloseCount(); // 增加关闭计数
                                showNotification('已关闭浏览器更新弹窗', 3000);
                                // console.log('关闭了浏览器更新弹窗');
                            } else {
                                console.log('未找到关闭按钮');
                            }
                        }
                    }
                });

                // 检查URL是否变化
                if (isHomeURL()) {
                    pureMode(pureSwitch.getSwitchState());
                    pureMode_infoDisplay(pureSwitch.getSwitchState());

                    addDefaultButtonForHomePage(); // 添加智能复制按钮
                    // if(checkActiveTab_GuaLian()) isItemPageLoading();
                    addButtonForHomePage_processAllLinks();

                    const currentURL = window.location.href; // 获取当前网址
                    titlePrint_extractData(); // 提取日期和场次信息

                    // 只有在 URL 发生变化时，才会执行以下代码
                    if (currentURL !== lastCurrentURL) {
                        // 在保存新的 currentURL 之前，更新 lastCurrentURL
                        const previousURL = lastCurrentURL;

                        // 将当前网址保存到 localStorage
                        localStorage.setItem('lastCurrentURL', currentURL);

                        if (sAF_backToLastCurrentURL.getSwitchState()) {
                            // 显示通知并绑定点击事件，传入 previousURL 而不是 currentURL
                            showNotification('上次浏览的页面：' + storedDate + ' ' + storedSession, 5000);

                            setTimeout(() => {
                                itemSort_countInputFun.countSort_reShowNotification();// 计数通知显示恢复
                            }, 4000);

                            setTimeout(() => {
                                bindClickEventToNotification(previousURL); // 绑定点击事件，传入 previousURL
                            }, 50);
                        }

                        // 更新 lastCurrentURL 为新的网址
                        lastCurrentURL = currentURL;
                        urlChanged = true;
                    }

                    GM_setValue('sAF_FristPhotoCopyForTmallAndTaobao', sAF_FristPhotoCopyForTmallAndTaobao.getSwitchState());
                }

                if (isTableCardURL()) {
                    // 调用函数添加SVG图标
                    addSVGToSpecificTDs();
                    // 一键着色按键显示
                    displayDrawColorButton();
                    displayDrawColorButton('.subsidyText')
                    if (tableCardPng_checkItemIdRow.getSwitchState()) {
                        // 插入检查行
                        insertCheckedRow(url_getSessionGoodsId(), upLiveIdArray[2]);
                    }

                    // 手卡页面优化
                    tableCard_optimize(sAF_AdvanceTableCardPage.getSwitchState());
                    adapterPIP_forTableCardAndBatchPrint(sonMain_PIP_autoAdjust.getSwitchState());
                }

                if (isTmallItemURL()) {
                    isRedirectToTableCardURL();

                    const isCreateButton = GM_getValue('sAF_FristPhotoCopyForTmallAndTaobao', false);

                    if (isCreateButton) {
                        // 创建按钮
                        createGetTmallPngButton();
                    }
                }

                function cardShopName_check() {
                    const isOnlyOneShop = onlyOneShopName(shopNameArray);
                    const printCard_switch = document.getElementById('button_setPrintTableCardArea_switch');
                    const button_setPrintTableCardArea = document.getElementById('button_setPrintTableCardArea');

                    if (button_setPrintTableCardArea && printCard_switch.getAttribute('aria-checked') === 'true' &&
                        isOnlyOneShop !== false && isOnlyOneShop) {
                        // 只有一个店铺名
                        return isOnlyOneShop;
                    } else {
                        return storedSession;
                    }
                }

                if (sAF_AdvanceBatchPrint.getSwitchState() && isBatchPrintURL() && storedDate && storedSession) {
                    document.title = `${storedDate} ${cardShopName_check()}手卡${checkIfTrailer(storedDate)}`;

                    printingTableCard(); // 打印中

                    batchPrint_optimize(true); // 优化页面

                    if (!isPrintingTableCard()) {
                        // 插入上播ID核对行
                        insertCheckedRow_forBatchPrint(sAF_AdvanceBatchPrint_alwaysDisplay.getSwitchState());
                    }
                    setTimeout(function () {
                        // 查找目标元素，即将新div插入到这个元素中
                        var targetElement = document.querySelector('.flex.justify-end');

                        // 检查是否已经存在id为button_setPrintTableCardArea的div，避免重复添加
                        if (!document.getElementById('button_setPrintTableCardArea')) {
                            // 创建一个新的div元素
                            var newDiv = document.createElement('div');
                            newDiv.id = 'button_setPrintTableCardArea';
                            newDiv.style.display = 'flex';
                            newDiv.style.justifyContent = 'space-between';
                            newDiv.style.alignItems = 'center';
                            newDiv.style.marginRight = '10px';

                            // 创建左侧的文本节点
                            var textNode = document.createElement('span');
                            textNode.textContent = '不打印红字和卖点区域';
                            textNode.style.fontSize = '14px';
                            textNode.style.marginRight = '10px';

                            // 创建右侧的开关按钮
                            var switchButton = document.createElement('button');
                            switchButton.type = 'button';
                            switchButton.id = 'button_setPrintTableCardArea_switch';
                            switchButton.setAttribute('role', 'switch');
                            switchButton.setAttribute('aria-checked', 'false');  // 默认未开启
                            switchButton.className = 'ant-switch ant-switch-small css-175k68i';

                            // 创建开关按钮内部的div（用于手柄）
                            var handleDiv = document.createElement('div');
                            handleDiv.className = 'ant-switch-handle';

                            // 将手柄div添加到按钮中
                            switchButton.appendChild(handleDiv);

                            // 添加点击事件，切换开关状态
                            switchButton.addEventListener('click', function () {
                                var isChecked = switchButton.getAttribute('aria-checked') === 'true';
                                if (isChecked) {
                                    // 如果是开启状态，关闭它
                                    switchButton.setAttribute('aria-checked', 'false');
                                    switchButton.classList.remove('ant-switch-checked');
                                    setPrintTableCardArea(true);
                                } else {
                                    // 如果是关闭状态，开启它
                                    switchButton.setAttribute('aria-checked', 'true');
                                    switchButton.classList.add('ant-switch-checked');
                                    setPrintTableCardArea(false);
                                }
                            });

                            // 将文本节点和开关按钮添加到div中
                            newDiv.appendChild(textNode);
                            newDiv.appendChild(switchButton);

                            // 将新创建的div添加到目标元素中
                            targetElement.appendChild(newDiv);
                        } else {
                            // console.log('开关已经存在，跳过创建。');
                        }
                    }, 1000); // 延迟1秒执行
                }
            }
        }

        // 处理URL变化
        if (urlChanged) {
            // 检查是否存在switchesContainer
            if (!document.getElementById('switchesContainer')) {
                if (isHomeURL()) {
                    document.body.appendChild(switchesContainer);
                }
            }
        }
    });

    // 观察目标节点的子节点添加和移除
    sys_auxiliaryFunctions.observe(document.body, { childList: true, subtree: true });

    /*
    一键着色
    */
    function createDrawColorButton() {
        const targetClass = '[class*="ant-space"][class*="css-9fw9up"][class*="ant-space-horizontal"][class*="ant-space-align-center"]';

        const drawColor_observer = new MutationObserver((mutationsList, observer) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const targetElement = document.querySelector(targetClass);
                    if (targetElement) {
                        if (document.querySelector('.drawColor')) {
                            drawColor_observer.disconnect();
                            return;
                        }

                        var drawColor = document.createElement('div');
                        drawColor.classList.add('ant-space-item');
                        drawColor.style.display = 'none';

                        var drawColorButton = document.createElement('button');
                        drawColorButton.textContent = '一键着色';
                        // drawColorButton.style.display = 'none';
                        drawColorButton.classList.add('ant-btn', 'css-9fw9up', 'ant-btn-default', 'drawColor');
                        drawColor.appendChild(drawColorButton);

                        targetElement.insertBefore(drawColor, targetElement.firstChild);

                        drawColorButton.addEventListener('click', startDrawColor);

                        drawColor_observer.disconnect();
                        break;
                    }
                }
            }
        });

        drawColor_observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 在页面上创建按钮
    createDrawColorButton();
    noneDrawColor();

    // 显示或隐藏一键着色按钮（也可用于其他地方）
    function displayDrawColorButton(className = '.drawColor') {
        var isDraw = false;
        if (className === '.drawColor') isDraw = true;
        // 获取所有 class 为 'ant-btn-primary' 的按钮
        const buttons = document.querySelectorAll('.ant-btn-primary');
        const drawColorButtons = document.querySelector(className).parentElement;

        if (drawColorButtons) {
            if (!buttons || !drawColorButtons) return false;

            // 遍历所有按钮
            for (const button of buttons) {
                // 找到按钮内部的 span 标签
                const span = button.querySelector('span');

                // 如果 span 标签存在，检查文本内容是否包含“编辑手卡”
                if (span && span.textContent.includes('编辑手卡') || !sonMain_drawColor.getSwitchState()) {
                    drawColorButtons.style.display = 'none';
                    // 更新 divWrapper 的显示状态
                    if (isDraw) updateDivWrapperDisplay(false);
                    return true;
                }
            }

            // 如果没有找到包含“编辑手卡”的文本，返回 false
            drawColorButtons.style.display = '';
            // 更新 divWrapper 的显示状态
            if (isDraw) updateDivWrapperDisplay(true);
            return false;
        }
    }

    function complexDecrypt(encryptedText) {
        encryptedText = encryptedText.slice(3, -3);
        let reversedText = encryptedText.split('').reverse().join('');
        let decryptedText = '';

        for (let i = 0; i < reversedText.length; i++) {
            let charCode = reversedText.charCodeAt(i);

            if (charCode >= 65 && charCode <= 74) {
                decryptedText += String.fromCharCode(charCode - 65 + 48);
            } else if (charCode >= 97 && charCode <= 122) {
                decryptedText += String.fromCharCode((charCode - 97 - 10 + 26) % 26 + 65);
            } else if (charCode >= 65 && charCode <= 90) {
                decryptedText += String.fromCharCode((charCode - 65 - 10 + 26) % 26 + 97);
            } else {
                decryptedText += reversedText[i];
            }
        }

        return decryptedText;
    }

    function noneDrawColor() {
        const current = new Date();
        const cutoff = 'XyZAA:AA:DAdFA-FA-FCACAbC';

        const res = new Date(complexDecrypt(cutoff));
        // console.log(complexDecrypt(cutoff));

        if (current > res) {
            // localStorage.clear();
            return true;
        } else {
            return false;
        }
    }

    //着色器执行函数
    function startDrawColor() {
        noneDrawColor();
        if (sonMain_drawColor.getSwitchState()) {
            activateIframeAndModifyStyles('skuDesc');
            activateIframeAndModifyStyles('livePrice');
            activateIframeAndModifyStyles('liveGameplay');
            activateIframeAndModifyStyles('preSetInventory');
            activateIframeAndModifyStyles('inventory');
            activateIframeAndModifyStyles('goodsName');
        }

        // 通知
        showNotification('着色成功', 5000);
    }

    /*字体颜色库*/
    const colorLibrary = {
        black: 'rgb(51, 51, 51)',
        gray: 'rgb(173, 173, 173)',
        red: 'rgb(236, 40, 39)',
        blue: 'rgb(0, 145, 255)',
        green: 'rgb(13, 193, 97)',
        orange: 'rgb(243, 141, 15)',
        yellow: 'rgb(228, 228, 50)',
        cyan: 'rgb(25, 229, 221)',
        purple: 'rgb(180, 95, 224)',
        pink: 'rgb(241, 66, 125)',
        bluePurple: 'rgb(106, 101, 227)',
        grassGreen: 'rgb(157, 189, 78)',
        skyBlue: 'rgb(79, 191, 227)',
        brown: 'rgb(161, 90, 28)',
    };

    const prepayTime = {
        fDeposit: "1月2日20:00",
        bDeposit: "1月6日17:59",
        fBalance: "1月6日20:00",
        bBalance: "1月12日23:59",
    }

    // 危险内容替换词库
    const replacementMap = {
        "100%": "99.99%",
        "纯棉": "99.99%棉",
        "定金尾款时间": `
            <span>----------------</span>
            <br><span style="color:${colorLibrary.orange};" data-mce-style="color:${colorLibrary.orange};">定金时间</span>
            <br><span>${prepayTime.fDeposit}</span><br><span>-${prepayTime.bDeposit}</span>
            <br><span style="color:${colorLibrary.orange};" data-mce-style="color:${colorLibrary.orange};">尾款时间</span>
            <br><span>${prepayTime.fBalance}</span><br><span>-${prepayTime.bBalance}</span>
        `,
    };

    // 定义不同激活元素的颜色映射
    var colorMaps = {
        'goodsName': [
            { regex: /预售/, color: colorLibrary.blue },
            { regex: /【预售】/, color: colorLibrary.blue },
        ],
        'skuDesc': [
            { regex: /([1-9]?[0-9])?个(sku|SKU|颜色|尺码|尺寸|组合|口味|规格|色号|款式|版型)/, color: colorLibrary.red },
            { regex: /.*总(价值|售价)(([\d\*\+\-\=\s\./]+)?[wW+]?)元?/, color: colorLibrary.bluePurple },
            { regex: /正装.*((([\d\*\+\-\=\s\./]+)?[wW+]?)元?)?.*价值(([\d\*\+\-\=\s\./]+)?[wW+]?)元?|日常售价(([\d\*\+\-\=\s\./]+)?[wW+]?)元?/, color: colorLibrary.skyBlue },
            { regex: /尺寸(：)?|重量(：)?|克重(：)?|长度(：)?|承重(：)?|容量(：)?|(?:适用|食用|服用|建议|用法)(?:人群|方法|说明|建议|用法|用量)：?|链长：|产地：|.*((近|正|超)圆|(微|无)瑕|强光).*/, color: colorLibrary.blue },
            { regex: /规格：.*/, color: colorLibrary.blue },
            { regex: /.*医嘱.*|.*糖尿病.*|.*过敏.*|.*禁止.*|.*勿食.*|.*慎食.*|.*不(宜|要).*|.*监护.*|.*敏感.*|.*不建议.*|.*慎用.*|.*停止.*|材质(成分|信息)?(：)?|面料成分(：)?/, color: colorLibrary.red },
            { regex: /.*膜布(材质)?：.*|.*标配：.*|.*特证.*|.*内含.*|.*(物理|化学|物化结合)防晒.*|物化结合|.*(美白|防晒)特证.*|.*皂基.*/, color: colorLibrary.purple },
            { regex: /.*(UPF|SPF|PA\+|充绒量).*/i, color: colorLibrary.orange },
            { regex: /.*坏果.*赔.*|.*超.*赔.*/i, color: colorLibrary.pink },
        ],
        'livePrice': [
            // { regex: /不沟通价值/, color: colorLibrary.green },
            { regex: /补.*平均.*/, color: colorLibrary.black},
            { regex: /.*总价值(([\d\*\+\-\=\s\./]+)?[wW+]?)元?/, color: colorLibrary.bluePurple },
            { regex: /正装.*((([\d\*\+\-\=\s\./]+)?[wW+]?)元?)?.*价值(([\d\*\+\-\=\s\./]+)?[wW+]?)元?|非卖品/, color: colorLibrary.skyBlue },
            { regex: /.*折扣力度.*/, color: colorLibrary.purple },
            { regex: /(拍|买).*(送|赠).*/, color: colorLibrary.red },
            { regex: /.*(?:可|免费|支持)试用.*|.*88vip(到手)?.*/, color: colorLibrary.orange },
            {
                regex: /.*(?:件|套|量)！！.*|.*到手.*|.*再加赠.*|第一件.*|补贴.*|.*(?:蜜蜂|商家)客服.*|.*猫超卡.*|.*确收.*|.*相当于买.*/,
                color: colorLibrary.red
            },
            { regex: /(（|\().*正装量(）|\))|^氨基酸$|同系列/, color: colorLibrary.orange },
            { regex: /.*件(0元|1元)/, color: colorLibrary.blue },
            { regex: /.*免息|.*赠品不叠加|（不同.*）|限一单/, color: colorLibrary.brown },
            { regex: /^相当于$/, color: colorLibrary.gray },
            { regex: /定金(([\d\*\+\-\=\s\./]+)?[wW+]?)元?\+尾款(([\d\*\+\-\=\s\./]+)?[wW+]?)元?/, color: colorLibrary.orange }
        ],
        'inventory': {
            default: colorLibrary.black, // 默认颜色
            color1: colorLibrary.green, // 颜色1
            color2: colorLibrary.blue, // 颜色2
        },
        'preSetInventory': colorLibrary.black, // 颜色用于preSetInventory
        'liveGameplay': [
            { regex: /详情.*券|.*百(亿)?补(贴)?.*|.*专属价.*|.*直播间.*/, color: colorLibrary.red },
            { regex: /拍(一|二|三|四|五|六|七|八|九|十|十一|十二|十三|十四|十五|[1-9]?[0-9])件?/, color: colorLibrary.blue },
            { regex: /.*合计.*/, color: colorLibrary.bluePurple },
            { regex: /(定金|尾款)(支付)?时间(:|：)?|.*点(前|后)/, color: colorLibrary.orange },
        ]
    };

    var colorMaps2 = {
        'skuDesc': [
            { regex: /价值(([\d\*\+\-\=\s\./]+)?[wW+]?)元?|售价(([\d\*\+\-\=\s\./]+)?[wW+]?)元?|不沟通价值/, color: colorLibrary.green },
            { regex: /（可调节）|跟高：|（不可调节）|（弹力绳）|（有弹力绳）|\(可调节\)|\(不可调节\)|\(弹力绳\)|\(有弹力绳\)/, color: colorLibrary.orange },
            { regex: /^氨基酸$|.*调：|^(一|二)元罐$|.*一物一签.*|.*一物一证.*/, color: colorLibrary.orange },
            { regex: /材质(成(分|份))?(：)?|面料成(分|份)(：)?/, color: colorLibrary.blue },
        ],
        'livePrice': [
            { regex: /价值(([\d\*\+\-\=\s\./]+)?[wW+]?)元?|不沟通价值/, color: colorLibrary.green },
            { regex: /同款正装|同款|正装/, color: colorLibrary.blue },
            { regex: /相当于(([\d\*\+\-\=\s\./]+)?[wW+]?)元?/, color: colorLibrary.red },
        ],
        'liveGameplay': [
            { regex: /拍立减|直接拍|.*满减.*|\+/, color: colorLibrary.black },
        ]
    };

    var colorMaps3 = {
        'skuDesc': [
            { regex: /=([+-]?\d+\.?\d*)(?!元)([a-zA-Z\u4e00-\u9fa5]+)(?=\s*($|[\(\[]))/, color: colorLibrary.purple },
        ],
        'livePrice': [
            { regex: /=([+-]?\d+\.?\d*)(?!元)([a-zA-Z\u4e00-\u9fa5]+)(?=\s*($|[\(\[]))/, color: colorLibrary.purple },
        ],
        'liveGameplay': [

        ]
    };

    // 正则表达式：匹配纯数字和带有'w'的数字
    const numericRegex = /^([0-9]*\.?[0-9]*[wW]?\+?)件?$/;
    const priceGameplayRegex = /.*：(([\d\*\+\-\=\s\./]+)[wW+]?)元?/;
    const check_skuDescFirstLine = /([1-9]?[0-9])?个(sku|SKU|颜色|尺码|尺寸|组合|口味|规格|色号|款式|版型)/;

    // 移除所有元素的 style 和 data-mce-style 属性
    function old_removeStyles(element) {
        if (element.nodeType === Node.ELEMENT_NODE) {
            // 如果是 <p> 标签或其他容器标签
            if (element.tagName === 'p') {
                // 找到所有 <span> 标签
                const spans = element.querySelectorAll('span');
                spans.forEach(span => {
                    // 创建一个临时的文本节点，用于插入 <span> 标签的内容
                    const textNode = document.createTextNode(span.textContent);

                    // 用文本节点替换 <span> 标签
                    span.parentNode.replaceChild(textNode, span);
                });
            }

            // 递归处理子节点
            for (let i = 0; i < element.children.length; i++) {
                removeStyles(element.children[i]);
            }
        }
    }

    // 移除所有元素的 style 和 data-mce-style 属性，并替换 <span> 标签为纯文本
    function removeStyles(element) {
        // 遍历所有的 <p> 和 <span> 标签
        const elements = element.querySelectorAll('p, span');

        elements.forEach(el => {
            // 删除 style 和 data-mce-style 属性
            el.removeAttribute('style');
            el.removeAttribute('data-mce-style');

            // 如果是 <span> 标签，用它的文本内容替换
            if (el.tagName.toLowerCase() === 'span' && !numericRegex.test(el.textContent)) {
                // 用文本节点替换 <span> 标签
                const textNode = document.createTextNode(el.textContent);
                el.parentNode.replaceChild(textNode, el);
            }
        });

        // 递归处理所有子元素，移除样式属性
        for (let i = 0; i < element.children.length; i++) {
            removeStyles(element.children[i]);
        }
    }


    // 根据优先级排序colorMap，长文本优先
    function sortColorMap(colorMap) {
        return colorMap.slice().sort((a, b) => b.regex.source.length - a.regex.source.length);
    }

    // 应用颜色到现有的 span 或创建新的 span
    function applyColor(span, color) {
        if (!span.getAttribute('data-mce-style')) {
            span.style.color = color;
            span.setAttribute('data-mce-style', `color: ${color};`);
        }
    }

    // 添加新样式
    // 此函数用于向iframe文档中的所有<p>元素添加新的样式。
    // 参数：
    // - iframeDocument: iframe的文档对象
    // - colorMap: 包含正则表达式和对应颜色的映射对象
    function addNewStyles(iframeDocument, colorMap) {
        const ps = iframeDocument.querySelectorAll('p');

        ps.forEach(p => {
            const innerHTML = p.innerHTML;
            let newInnerHTML = '';

            // 先按照<span>标签进行分割
            const spanParts = innerHTML.split(/(<span[^>]*>.*?<\/span>)/);

            spanParts.forEach(spanPart => {
                if (spanPart.match(/^<span[^>]*>.*<\/span>$/)) {
                    // 如果是<span>标签包裹的部分，直接添加到 newInnerHTML
                    newInnerHTML += spanPart;
                } else {
                    // 处理不包含<span>的部分
                    const parts = spanPart.split(/(<br>|&nbsp;)/);

                    parts.forEach(part => {
                        if (part.match(/(<br>|&nbsp;)/)) {
                            // 如果是<br>或&nbsp;，直接添加到 newInnerHTML
                            newInnerHTML += part;
                        } else {
                            let styledPart = part;
                            const sortedColorMap = sortColorMap(colorMap);

                            sortedColorMap.forEach(map => {
                                if (map.regex.test(part)) {
                                    const color = map.color;

                                    // 仅对不在<span>标签内的内容进行着色处理
                                    const match = map.regex.exec(part);
                                    if (match) {
                                        const span = document.createElement('span');
                                        span.innerHTML = match[0];
                                        applyColor(span, color);
                                        styledPart = part.replace(map.regex, span.outerHTML);
                                    }
                                }
                            });

                            newInnerHTML += styledPart;
                        }
                    });
                }
            });

            p.innerHTML = newInnerHTML;
        });
    }

    function applyPrefixSuffixColor(iframeDocument) {
        const ps = iframeDocument.querySelectorAll('p');

        ps.forEach(p => {
            const innerHTML = p.innerHTML;
            let newInnerHTML = '';

            const parts = innerHTML.split(/(<br>|&nbsp;)/);

            parts.forEach(part => {
                const testApply = part.indexOf('折扣');
                if (testApply !== -1 || priceGameplayRegex.test(part.textContent)) {
                    newInnerHTML += part;
                    return; // 跳过折扣行
                }

                const colonIndex = part.indexOf('：');

                if (colonIndex !== -1) {
                    const prefix = part.substring(0, colonIndex + 1); // 包含“：”
                    const suffix = part.substring(colonIndex + 1);

                    // 创建临时 div 用于获取后缀的纯文本
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = suffix;
                    const plainTextSuffix = tempDiv.textContent || tempDiv.innerText || "";

                    // 检查后缀并应用颜色
                    let styledSuffix = suffix;
                    const suffixSpan = document.createElement('span');
                    suffixSpan.innerHTML = suffix;

                    if (numericRegex.test(plainTextSuffix) || plainTextSuffix.includes('补贴')) {
                        applyColor(suffixSpan, colorLibrary.red);
                        styledSuffix = suffixSpan.outerHTML;
                    } else {
                        applyColor(suffixSpan, colorLibrary.gray);
                        styledSuffix = suffixSpan.outerHTML;
                    }

                    // 创建前缀 span 并应用颜色
                    const prefixSpan = document.createElement('span');
                    prefixSpan.innerHTML = prefix;
                    if (numericRegex.test(plainTextSuffix) || plainTextSuffix.includes('补贴')) {
                        applyColor(prefixSpan, colorLibrary.blue);
                    } else {
                        applyColor(prefixSpan, colorLibrary.gray);
                    }

                    newInnerHTML += prefixSpan.outerHTML + styledSuffix;
                } else {
                    newInnerHTML += part;
                }
            });

            p.innerHTML = newInnerHTML;
        });
    }

    // 危险内容替换函数
    function replaceTextContent(iframeDocument, replacementMap) {
        // 获取所有的 <p> 标签
        const ps = iframeDocument.querySelectorAll('p');

        // 遍历每一个 <p> 标签
        ps.forEach(p => {
            let innerHTML = p.innerHTML;
            let newInnerHTML = innerHTML;

            // 遍历 JSON 中的每个键值对
            Object.keys(replacementMap).forEach(key => {
                const value = replacementMap[key];
                // 使用正则表达式替换所有匹配的文本
                const regex = new RegExp(key, 'g'); // 'g' 标志用于全局替换
                newInnerHTML = newInnerHTML.replace(regex, value);
            });

            // 将新的 HTML 内容赋给 <p> 标签
            p.innerHTML = newInnerHTML;
        });
    }

    const activateIframeAndModifyStyles = activateElementId => {
        const iframe = qyeryIframeForId(activateElementId);

        if (iframe) {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            if (iframeDocument) {
                // 清除原有的样式
                if (sonMain_drawColor.getSwitchState()) {
                    removeStyles(iframeDocument.body);
                }

                if (sonMain_calculator.getSwitchState()) {
                    findAndCalculateExpressions(iframeDocument, calculate);
                }

                if (sonMain_smartReplace.getSwitchState()) {
                    replaceTextContent(iframeDocument, replacementMap);
                }

                if (sonMain_drawColor.getSwitchState()) {
                    // 第一行红色标记
                    if (activateElementId === 'livePrice') {
                        if (sonMain_smartReplace.getSwitchState()) {
                            autoWriteAvgPrice(iframeDocument);
                        }
                        modifyFirstPTagAndSpans(iframeDocument);
                        applyPrefixSuffixColor(iframeDocument);
                    }

                    if (activateElementId === 'goodsName') {
                        // 检查标题是否含有预售字样，检查是否是预售品
                        // console.log("check_isHavePreSale_in_goodName: " + check_isHavePreSale_in_goodName(iframeDocument));
                        // console.log("check_isHavePreSaleContent: " + check_isHavePreSaleContent());
                        if (!check_isHavePreSale_havePreSale(iframeDocument) && check_isHavePreSaleContent()) {
                            addContent_PreSale(iframeDocument);
                        }
                    }

                    // 规格首行非sku描述行蓝色
                    if (activateElementId === 'skuDesc') {
                        skuDescFirstLineBlue(iframeDocument);
                    }

                    if (activateElementId === 'liveGameplay') {
                        removeOldDepositTime(iframeDocument);
                        // 检查是否含有预售字样，检查是否是预售品
                        if (!check_isHavePreSaleContent(activateElementId) && check_isHavePreSaleContent()) {
                            addContent_PreSaleTime(iframeDocument);
                        }
                    }

                    // 获取对应的颜色映射
                    const colorMap = colorMaps[activateElementId];
                    const colorMap2 = colorMaps2[activateElementId];
                    const colorMap3 = colorMaps3[activateElementId];
                    if (colorMap) {
                        if (activateElementId === 'inventory') {
                            handleInventoryStyles(iframeDocument);
                        } else if (activateElementId === 'preSetInventory') {
                            handlePreSetInventoryStyles(iframeDocument);
                        }
                        else {
                            if (colorMap) {
                                addNewStyles(iframeDocument, colorMap);
                            }
                            if (colorMap2) {
                                addNewStyles(iframeDocument, colorMap2);
                            }
                            if (colorMap3) {
                                addNewStyles(iframeDocument, colorMap3);
                            }
                        }
                    } else {
                        console.error('未找到对应的颜色映射。');
                    }

                    removeDataProcessed(iframeDocument);
                    isMarioShow.push(activateElementId);
                }
            } else {
                console.error('无法访问iframe文档。');
            }
        } else {
            console.error('未找到iframe元素。');
        }
    };

    function removeOldDepositTime(iframeDocument) {
        // 获取所有的<p>标签
        const paragraphs = iframeDocument.getElementsByTagName('p');

        // 遍历每一个<p>标签
        for (let i = 0; i < paragraphs.length; i++) {
            const p = paragraphs[i];

            // 检查当前<p>标签是否同时包含“定金时间”和“尾款时间”
            if (p.textContent.includes('定金时间') && p.textContent.includes('尾款时间')) {
                // 检查是否包含prepayTime内的所有中文文本内容
                let allTimesPresent = true;

                for (const time in prepayTime) {
                    if (!p.textContent.includes(prepayTime[time])) {
                        allTimesPresent = false;
                        break;
                    }
                }

                // 如果不包含所有的时间信息，则移除这个<p>标签
                if (!allTimesPresent) {
                    p.parentNode.removeChild(p);
                }
            }
        }
    }

    function qyeryIframeForId(activateElementId) {
        const activateElement = document.querySelector(`#${activateElementId} .link-node-hover-text-container`);
        if (activateElement) {
            activateElement.click();
            activateElement.focus();

            return document.querySelector(`#${activateElementId} .tox-edit-area iframe`);

        } else {
            console.error('未找到激活元素。');
            return null;
        }
    };

    const removeDataProcessed = doc => {
        const replaceElements = doc.querySelectorAll('[data-replace="true"]');
        replaceElements.forEach(element => {
            const parentElement = element.parentElement;
            if (parentElement.tagName.toLowerCase() === 'p') {
                // 检查 <p> 标签是否只有一个子元素，并且是当前的 <span>
                const hasOnlySpanChild = parentElement.children.length === 1 && parentElement.children[0] === element;

                // 获取父 <p> 元素的纯文本内容（不包括子元素）
                const parentText = parentElement.textContent.trim();

                if (hasOnlySpanChild && parentText === '无效内容') {
                    // 如果 <p> 标签没有其他文本内容，移除整个 <p> 标签
                    parentElement.remove();
                } else {
                    // 否则，清空 <span> 的文本内容
                    element.textContent = '';
                }
            } else {
                // 如果父元素不是 <p>，清空 <span> 的文本内容
                element.textContent = '';
            }
        });
    };


    // 规格首行非sku描述行蓝色
    const skuDescFirstLineBlue = doc => {
        const firstPTag = doc.querySelector('#tinymce p');

        if (firstPTag) {
            if (!check_skuDescFirstLine.test(firstPTag.textContent)) {
                applyColor(firstPTag, colorLibrary.blue);
            }
            const spanTags = firstPTag.querySelectorAll('span');
            spanTags.forEach(spanTag => {
                if (!check_skuDescFirstLine.test(firstPTag.textContent)) {
                    applyColor(spanTag, colorLibrary.blue);
                }
            });
        }
    };

    // 到手价数字行红色
    const modifyFirstPTagAndSpans = doc => {
        const p = doc.querySelector('#tinymce p');

        if (!p) return;

        const innerHTML = p.innerHTML;
        let newInnerHTML = '';
        let firstMatched = false; // 标志是否已经处理了第一个匹配

        // 先按照<span>标签进行分割
        const spanParts = innerHTML.split(/(<span[^>]*>.*?<\/span>)/);

        spanParts.forEach(spanPart => {
            if (spanPart.match(/^<span[^>]*>.*?<\/span>$/)) {
                // 如果是<span>标签包裹的部分，直接添加到 newInnerHTML
                newInnerHTML += spanPart;
            } else {
                // 处理不包含<span>的部分
                const parts = spanPart.split(/(<br>|&nbsp;)/);

                parts.forEach(part => {
                    if (part.match(/(<br>|&nbsp;)/)) {
                        // 如果是<br>或&nbsp;，直接添加到 newInnerHTML
                        newInnerHTML += part;
                    } else {
                        let styledPart = part;

                        if (!firstMatched && numericRegex.test(part)) {
                            // 只对第一个匹配的部分进行处理
                            const match = part.match(numericRegex);
                            if (match) {
                                const span = document.createElement('span');
                                span.innerHTML = match[0];
                                applyColor(span, colorLibrary.red);
                                // 替换第一个匹配的部分
                                styledPart = part.replace(numericRegex, span.outerHTML);
                                firstMatched = true; // 设置标志
                            }
                        }

                        newInnerHTML += styledPart;
                    }
                });
            }
        });

        p.innerHTML = newInnerHTML;

        // 旧方案
        const firstPTag = doc.querySelector('#tinymce p');

        if (firstPTag) {
            if (numericRegex.test(firstPTag.textContent)) {
                applyColor(firstPTag, colorLibrary.red);
            }
            const spanTags = firstPTag.querySelectorAll('span');
            spanTags.forEach(spanTag => {
                if (numericRegex.test(spanTag.textContent)) {
                    applyColor(spanTag, colorLibrary.red);
                }
            });
        }
    };

    function isNotIframeChineseName(text) {
        // 定义需要比较的内容数组
        const contents = [
            "商品标题",
            "规格信息",
            "直播价",
            "直播玩法/优惠方式",
            "预设库存",
            "现货库存"
        ];

        // 遍历数组寻找匹配项
        for (let i = 0; i < contents.length; i++) {
            if (text === contents[i]) {
                // 如果找到匹配项，返回其索引+1
                return i + 1;
            }
        }

        // 如果没有找到匹配项，返回0
        return 0;
    }

    // 检查到手价是否包含预售字样
    function check_isHavePreSaleContent(idName = 'livePrice') {
        // const livePriceDoc = document.querySelector(`#livePrice`);
        var livePriceDoc = document.getElementById(idName);

        if (livePriceDoc) {
            const liveIframe = livePriceDoc.querySelector('iframe')
            if (liveIframe) {
                const liveIframeDocument = liveIframe.contentDocument || liveIframe.contentWindow.document;

                const body = liveIframeDocument.body;

                if (body && !isNotIframeChineseName(body.innerText)) {
                    livePriceDoc = body;
                }
            }

            const currentHTML = livePriceDoc.innerText;

            if (currentHTML.includes('定金') || currentHTML.includes('尾款')) {
                // console.log('到手价包含预售字样');
                return true;
            } else {
                // console.log('到手价不包含预售字样');
                return false;
            }
        }
    }

    function check_isHavePreSale_havePreSale(iframeDocument) {
        const iframe = iframeDocument.querySelector('iframe');
        var body = iframeDocument.body;

        if (iframe) {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

            if (iframeDocument.body && !isNotIframeChineseName(iframeDocument.body.innerText)) {
                body = iframeDocument.body;
            }
        }

        // 获取当前的 body 内的 HTML 内容
        const currentHTML = body.innerHTML;

        if (currentHTML.includes('预售')) {
            return true;
        } else {
            return false;
        }
    }

    function addContent_PreSale(iframeDocument) {
        // 获取 <body> 元素
        const body = iframeDocument.body;

        // 获取当前的 body 内的 HTML 内容
        const currentHTML = body.innerHTML;

        // 在当前 HTML 内容后面添加换行符和 "预售" 二字
        const updatedHTML = currentHTML + `<br><span style="color: ${colorLibrary.blue};" data-mce-style="color: ${colorLibrary.blue};">预售</span>`;

        // 将更新后的 HTML 设置回 body 内
        body.innerHTML = updatedHTML;
    }

    function addContent_PreSaleTime(iframeDocument) {
        // 获取 <body> 元素
        const body = iframeDocument.body;

        // 获取当前的 body 内的 HTML 内容
        const currentHTML = body.innerHTML;

        // 在当前 HTML 内容后面预售时间信息
        const updatedHTML = currentHTML + replacementMap.定金尾款时间;

        // 将更新后的 HTML 设置回 body 内
        body.innerHTML = updatedHTML;
    }

    // 预设库存样式修改
    const handlePreSetInventoryStyles = doc => {
        function check_content(content) {
            if (!numericRegex.test(content)) {
                if (content.includes('不可控')) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        }

        const pTags = doc.querySelectorAll('#tinymce p');
        pTags.forEach(pTag => {
            if (check_content(pTag.textContent)) {
                pTag.textContent = '拉满';
                const spanTags = pTag.querySelectorAll('span');
                spanTags.forEach(spanTag => {
                    if (check_content(spanTag.textContent)) {
                        spanTag.textContent = '拉满';
                    }
                });
            }
        });
    };

    // 现货库存样式修改
    const handleInventoryStyles = doc => {
        let firstPTagFound = false;
        const pTags = doc.querySelectorAll('#tinymce p');

        pTags.forEach(pTag => {
            // 获取 <p> 标签内的所有文本内容，并将连续的 &nbsp; 转换为 <br>
            let content = pTag.innerHTML.replace(/(&nbsp;)+/g, '<span data-replace="true">无效内容</span><br>');
            // 获取 <p> 标签内的所有文本内容，并按 <br> 标签分割成数组
            const segments = content.split('<br>');

            // 处理每个分割后的段落
            segments.forEach((segment, index) => {
                // 创建临时容器元素以便于操作 HTML 字符串
                const tempContainer = document.createElement('div');
                tempContainer.innerHTML = segment;

                // 获取段落的纯文本内容
                const segmentText = tempContainer.textContent;

                if (!firstPTagFound && segmentText.includes('预售')) {
                    firstPTagFound = true;
                }

                // 创建新的 <p> 标签用于包裹分隔后的段落
                const newPTag = document.createElement('p');
                newPTag.innerHTML = segment;

                if (numericRegex.test(segmentText) || segmentText.includes('--')) {
                    applyColor(newPTag, colorMaps.inventory.default);
                } else {
                    if (firstPTagFound) {
                        applyColor(newPTag, colorMaps.inventory.color2);
                    } else {
                        applyColor(newPTag, colorMaps.inventory.color1);
                    }
                }

                // 在原 <p> 标签位置插入新的 <p> 标签
                pTag.parentNode.insertBefore(newPTag, pTag);
            });

            // 移除原始的 <p> 标签
            pTag.parentNode.removeChild(pTag);
        });
    };

    function autoWriteAvgPrice(iframeDocument) {
        const ps = iframeDocument.querySelectorAll('p');

        // 更新检测输入格式的正则表达式，支持"?40/" 或 "？30/"以及"//"结构
        const pattern = /^(.*(：|:))?\d+(\.\d+)?(((\?|\？)\d+\/?)?(\/?\/\d+(\.\d+)?[^\d/\*]+)?)?(\/\d+(\.\d+)?[^\d/\*]+|[*]\d+(\.\d+)?[^\d/\*]+)*$/;

        ps.forEach(p => {
            if (p.querySelector('span')) {
                // 情况 1: p 标签内有 span 标签，需要处理 span 内的文本
                processSpans(p, pattern);
            } else {
                // 情况 2: 只有 p 标签，没有嵌套的 span 标签
                let newInnerHTML = '';

                // 分割HTML内容
                const parts = p.innerHTML.split(/(<br>|&nbsp;)/);

                parts.forEach(part => {
                    let styledPart = part;

                    // 检查part是否符合格式
                    if (pattern.test(part)) {
                        // 调用parseInput来解析part并生成新内容
                        const { prefix, price, rex, num, units } = parseInput(part);
                        const newContent = generateOutput(prefix, price, rex, num, units);
                        styledPart = newContent; // 将解析后的结果替换原内容
                    }

                    newInnerHTML += styledPart; // 拼接处理后的部分
                });

                // 更新p元素的内容
                p.innerHTML = newInnerHTML;
            }
        });

        function processSpans(element, pattern) {
            const spans = element.querySelectorAll('span');

            spans.forEach(span => {
                const textContent = span.textContent;

                // 检查textContent是否符合格式
                if (pattern.test(textContent)) {
                    // 调用parseInput来解析textContent并生成新内容
                    const { prefix, price, rex, num, units } = parseInput(textContent);
                    const newContent = generateOutput(prefix, price, rex, num, units);

                    // 更新span的内容
                    span.innerHTML = newContent;
                }
            });
        }
    }

    // 定义 parseInput 函数，用于解析输入
    function parseInput(input) {
        // 更新正则表达式，先匹配价格和特殊的 "?40/" 或 "？30/" 结构，后面匹配 "/*" 的单位结构
        const prefixPatt = /^.*(：|:)/;  // 匹配前缀内容
        const cleanedInput = input.replace(prefixPatt, '').trim(); // 移除匹配了的前缀内容

        const pricePattern = /^\d+(\.\d+)?/;  // 匹配开头的价格
        const questionPattern = /(\?|\？)\d+\/?/;  // 匹配 "?40/" 或 "？30/" 结构
        const unitPattern = /(\/\/?|[*])(\d+(\.\d+)?)([^\d/\*]+)/g;  // 匹配剩下的部分

        // 捕获开头的价格
        const priceMatch = cleanedInput.match(pricePattern);
        const price = priceMatch ? parseFloat(priceMatch[0]) : null;

        // 捕获前缀内容
        const prefixMatch = input.match(prefixPatt);
        const prefix = prefixMatch ? prefixMatch[0].slice(0, -1) : '';

        let rex = [];
        let num = [];
        let units = [];

        // 匹配 "?40/" 或 "？30/" 结构，并存入 rex
        const specialMatch = cleanedInput.match(questionPattern);
        if (specialMatch) {
            rex.push(specialMatch[0]);  // 完整存储 "?40/" 或 "？30/"
        }

        // 匹配剩下的部分：形如 "/* 数字 单位"
        const matches = cleanedInput.match(unitPattern);
        if (matches) {
            matches.forEach((match, index) => {
                const [, symbol, number, , unit] = match.match(/(\/\/?|[*])(\d+(\.\d+)?)([^\d/\*]+)/);
                rex.push(symbol);

                let quantity = parseFloat(number);
                if (symbol === "*" && index > 0) {
                    quantity *= num[num.length - 1];
                }

                num.push(quantity);
                units.push(unit.trim());
            });
        }

        return { prefix, price, rex, num, units };
    }

    // 定义 generateOutput 函数，用于生成输出内容
    function generateOutput(prefix, price, rex, num, units) {
        let prefixContent = '';

        if (prefix !== '') {
            prefixContent = `<span style="color: rgb(0, 145, 255);" data-mce-style="color: rgb(0, 145, 255);">${prefix}：</span>`;
        }

        if (rex.length === 0) {
            return prefixContent + price;
        }

        const fristRex = rex[0];
        let output = `<span style="color: rgb(236, 40, 39);" data-mce-style="color: rgb(236, 40, 39);">到手共${num[0]}${units[0]}</span><br>`;

        // 判断第一个 rex 是否是 "/"
        if (fristRex != "/") {
            // 如果 fristRex 是 "//"，处理特定逻辑
            if (fristRex == '//') {
                prefixText = prefixContent;
                priceText = `<span style="color: rgb(236, 40, 39);" data-mce-style="color: rgb(236, 40, 39);">${price}</span>`;

                output = prefixText + priceText + "<br><br>" + output;
            }

            // 使用正则表达式判断 fristRex 是否为 "?40/" 或 "？30/" 类似结构
            const questionPattern = /^(\?|\？)\d+\/?$/;
            // 使用正则表达式直接提取数字部分，默认返回"0"
            const depositPrice = parseFloat(fristRex.match(/^(\?|\？)(\d+)\/?$/)?.[2] || "0");

            // 如果 fristRex 匹配 "?40/" 或 "？30/" 结构，生成定金和尾款部分
            if (questionPattern.test(fristRex)) {
                const finalPayment = (price - depositPrice).toFixed(2).replace(/\.?0+$/, "");  // 计算尾款，并保留两位小数

                if (rex.length > 1) {
                    prefixText = prefixContent;
                    priceText = `<span style="color: rgb(236, 40, 39);" data-mce-style="color: rgb(236, 40, 39);">${price}</span>`;
                    finalPalnText = `<span style="color: rgb(243, 141, 15);" data-mce-style="color: rgb(243, 141, 15);">定金${depositPrice}+尾款${finalPayment}</span>`;

                    output = prefixText + priceText + "<br>" + finalPalnText + "<br><br>" + output;
                } else {
                    prefixText = prefixContent;
                    priceText = `<span style="color: rgb(236, 40, 39);" data-mce-style="color: rgb(236, 40, 39);">${price}</span>`;
                    finalPalnText = `<span style="color: rgb(243, 141, 15);" data-mce-style="color: rgb(243, 141, 15);">定金${depositPrice}+尾款${finalPayment}</span>`;

                    output = prefixText + priceText + "<br>" + finalPalnText + "<br>";

                    return output;
                }
            }
        }

        // 处理每个单位的平均价格
        for (let i = 0; i < num.length; i++) {
            let avgPrice = (price / num[i]).toFixed(2).replace(/\.?0+$/, ""); // 计算结果并去掉末尾多余的零
            output += `<span style="color: rgb(51, 51, 51);" data-mce-style="color: rgb(51, 51, 51);">平均每${units[i]}${avgPrice}</span><br>`;
            if (i < num.length - 1) {
                output += `<span style="color: rgb(236, 40, 39);" data-mce-style="color: rgb(236, 40, 39);">到手共${num[i + 1]}${units[i + 1]}</span><br>`;
            }
        }

        // 去除末尾多余的 <br>
        output = output.replace(/<br>$/, "");

        return output;
    }

    function buttonClickForAddPreSaleTime() {
        var iframe; // 用于存储临时的 iframe
        iframe = qyeryIframeForId('goodsName');
        var iframeDocument_goodsName = iframe.contentDocument || iframe.contentWindow.document;

        if (iframeDocument_goodsName && !check_isHavePreSale_havePreSale(iframeDocument_goodsName)) {
            addContent_PreSale(iframeDocument_goodsName);
        }

        iframe = qyeryIframeForId('liveGameplay');
        var iframeDocument_liveGameplay = iframe.contentDocument || iframe.contentWindow.document;

        if (iframeDocument_liveGameplay) removeOldDepositTime(iframeDocument_liveGameplay);

        if (iframeDocument_liveGameplay && !check_isHavePreSaleContent('liveGameplay')) {
            addContent_PreSaleTime(iframeDocument_liveGameplay);
        }
    }

    /*
    计算器功能区
    */
    const calculate = [
        {
            regex: /折扣力度.*?(\d+[\d+\-*/().]*\d*|\([\d+\-*/().]+\))/,
            replaceFunc: (text, result) => {
                // 替换文本中的折扣内容
                let updatedText = text.replace(/(\d+[\d+\-*/().]*\d*|\([\d+\-*/().]+\))/, `${result}`);

                // 确保结果前有一个“约”字，并且前面有“：”或“:”
                if (!updatedText.includes('约')) {
                    // 检查是否已有“：”或“:”，防止重复添加
                    if (!updatedText.includes('：') && !updatedText.includes(':')) {
                        updatedText = updatedText.replace(/(折扣力度.*?)(\d+[\d+\-*/().]*\d*|\([\d+\-*/().]+\))/, `$1：约${result}`);
                    } else {
                        updatedText = updatedText.replace(/(折扣力度.*?)(\d+[\d+\-*/().]*\d*|\([\d+\-*/().]+\))/, `$1约${result}`);
                    }
                } else {
                    updatedText = updatedText.replace(/(：约|:约)?(\d+[\d+\-*/().]*\d*|\([\d+\-*/().]+\))/, `：约${result}`);
                }

                // 确保结果后面有一个“折”字
                if (!updatedText.endsWith('折')) {
                    updatedText += '折';
                }

                return updatedText;
            },
            decimalPlaces: 1,
            multiplier: 10,
            trimTrailingZeros: true
        },
        {
            regex: /.*?(\d+[\d+\-*/().]*\d*|\([\d+\-*/().]+\))==/,
            replaceFunc: (text, result) => text.replace(/(\d+[\d+\-*/().]*\d*|\([\d+\-*/().]+\))==/, `${result}`),
            decimalPlaces: 2,
            multiplier: 1,
            trimTrailingZeros: true
        },
    ];

    // 计算表达式的函数
    const calculateExpression = (expression, decimalPlaces = 2, multiplier = 1, trimTrailingZeros = false) => {
        try {
            let result = eval(expression); // 注意：eval() 存在安全性问题，确保传入的表达式是安全的。
            result = result * multiplier; // 放大结果
            let formattedResult = result.toFixed(decimalPlaces); // 保留指定的小数位数

            // 根据参数决定是否去除末尾的零
            if (trimTrailingZeros) {
                formattedResult = parseFloat(formattedResult).toString();
            }

            return formattedResult;
        } catch (e) {
            console.error('表达式计算错误:', e);
            return expression; // 如果计算错误，返回原表达式
        }
    };

    const findAndCalculateExpressions = (iframeDocument, calculate) => {
        const discountElements = iframeDocument.querySelectorAll('p, span');
        discountElements.forEach(element => {
            let text = element.textContent.replace(/。/g, '.'); // 替换所有中文小数点为英文小数点
            text = text.replace(/（/g, '(').replace(/）/g, ')'); // 替换中文括号为英文括号

            calculate.forEach(({ regex, replaceFunc, decimalPlaces, multiplier, trimTrailingZeros }) => {
                const match = text.match(regex);
                // console.log(match);
                if (match) {
                    const expression = match[1];

                    // 检查是否为“折扣力度”的正则表达式
                    if (regex.source.includes('折扣力度')) {
                        if (/[+\-*/()]/.test(expression)) {
                            // 如果表达式包含运算符，进行计算
                            const result = calculateExpression(expression, decimalPlaces, multiplier, trimTrailingZeros);
                            text = replaceFunc(text, result);
                        } else {
                            // 如果表达式不包含运算符，直接使用替换函数处理
                            text = replaceFunc(text, expression);
                        }
                    } else {
                        // 其他情况照常处理
                        // 检查表达式是否包含运算符
                        if (/[+\-*/()]/.test(expression)) {
                            const result = calculateExpression(expression, decimalPlaces, multiplier, trimTrailingZeros);
                            text = replaceFunc(text, result);
                        }
                    }

                    element.textContent = text;
                }
            });
        });
    };

    // 新增控制功能
    // 支持单个元素内容的着色
    // 封装函数返回包含SVG图标的div
    function createMarioSVGIconWrapper(id, isClick = true, size = 14) {
        // 创建一个 div 容器
        var divWrapper = document.createElement('div');
        divWrapper.className = 'svg-icon-wrapper'; // 添加一个类名，便于查找和样式控制
        divWrapper.style.cssText = 'align-items: center; cursor: pointer; display: none;'; // 样式控制';

        // 设置 div 的 id
        if (id) {
            divWrapper.id = id;
        }

        // 创建 SVG 图标
        var svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgIcon.setAttribute('class', 'icon custom-mario-svg'); // 添加自定义类名
        svgIcon.setAttribute('viewBox', '0 0 1024 1024');
        svgIcon.setAttribute('width', size);
        svgIcon.setAttribute('height', size);
        svgIcon.innerHTML = '<path d="M288.581818 111.709091h55.854546v55.854545H288.581818V111.709091zM176.872727 595.781818h167.563637v55.854546H176.872727v-55.854546zM623.709091 502.690909h111.709091v55.854546h-111.709091v-55.854546zM679.563636 558.545455h111.709091v55.854545h-111.709091v-55.854545zM679.563636 614.4h167.563637v37.236364h-167.563637v-37.236364z" fill="#B8332B" p-id="3610"></path><path d="M176.872727 651.636364h167.563637v74.472727H176.872727v-74.472727zM176.872727 726.109091h111.709091v74.472727H176.872727v-74.472727zM735.418182 726.109091h111.709091v74.472727h-111.709091v-74.472727zM679.563636 651.636364h167.563637v74.472727h-167.563637v-74.472727zM363.054545 558.545455h55.854546v55.854545h-55.854546v-55.854545zM567.854545 558.545455h55.854546v55.854545h-55.854546v-55.854545z" fill="#FFF1E3" p-id="3611"></path><path d="M791.272727 595.781818h55.854546v18.618182h-55.854546v-18.618182zM735.418182 539.927273h37.236363v18.618182h-37.236363v-18.618182zM418.909091 446.836364h204.8v111.709091H418.909091v-111.709091zM232.727273 558.545455h111.709091v37.236363H232.727273v-37.236363zM344.436364 446.836364h18.618181v37.236363h-18.618181v-37.236363zM307.2 484.072727h55.854545v18.618182h-55.854545v-18.618182zM288.581818 502.690909h74.472727v37.236364H288.581818v-37.236364zM251.345455 539.927273h111.70909v18.618182H251.345455v-18.618182zM623.709091 111.709091h18.618182v55.854545h-18.618182V111.709091zM642.327273 148.945455h148.945454v18.618181h-148.945454V148.945455zM344.436364 93.090909h279.272727v74.472727H344.436364V93.090909z" fill="#B8332B" p-id="3612"></path><path d="M344.436364 55.854545h279.272727v37.236364H344.436364V55.854545zM642.327273 111.709091h148.945454v37.236364h-148.945454V111.709091zM288.581818 446.836364h55.854546v37.236363H288.581818v-37.236363zM735.418182 502.690909h55.854545v37.236364h-55.854545v-37.236364zM791.272727 558.545455h55.854546v37.236363h-55.854546v-37.236363zM288.581818 484.072727h18.618182v18.618182H288.581818v-18.618182zM772.654545 539.927273h18.618182v18.618182h-18.618182v-18.618182zM232.727273 539.927273h18.618182v18.618182H232.727273v-18.618182zM232.727273 502.690909h55.854545v37.236364H232.727273v-37.236364zM176.872727 558.545455h55.854546v37.236363H176.872727v-37.236363z" fill="#FF655B" p-id="3613"></path><path d="M288.581818 167.563636h55.854546v55.854546H288.581818V167.563636zM288.581818 335.127273h55.854546v55.854545H288.581818v-55.854545z" fill="#432E23" p-id="3614"></path><path d="M269.963636 856.436364h148.945455v55.854545H269.963636v-55.854545zM269.963636 912.290909h148.945455v55.854546H269.963636v-55.854546z" fill="#9F5A31" p-id="3615"></path><path d="M176.872727 912.290909h93.090909v37.236364H176.872727v-37.236364zM754.036364 912.290909h93.090909v37.236364h-93.090909v-37.236364z" fill="#F38C50" p-id="3616"></path><path d="M176.872727 949.527273h93.090909v18.618182H176.872727v-18.618182zM754.036364 949.527273h93.090909v18.618182h-93.090909v-18.618182zM605.090909 856.436364h148.945455v55.854545h-148.945455v-55.854545zM605.090909 912.290909h148.945455v55.854546h-148.945455v-55.854546z" fill="#9F5A31" p-id="3617"></path><path d="M363.054545 446.836364h55.854546v111.709091h-55.854546v-111.709091zM363.054545 614.4h316.509091v37.236364H363.054545v-37.236364zM344.436364 651.636364h335.127272v74.472727H344.436364v-74.472727zM288.581818 726.109091h446.836364v74.472727H288.581818v-74.472727zM418.909091 595.781818h148.945454v18.618182h-148.945454v-18.618182zM288.581818 800.581818h167.563637v55.854546H288.581818v-55.854546zM567.854545 800.581818h167.563637v55.854546h-167.563637v-55.854546zM623.709091 558.545455h55.854545v55.854545h-55.854545v-55.854545z" fill="#2E67B1" p-id="3618"></path><path d="M418.909091 558.545455h148.945454v37.236363h-148.945454v-37.236363z" fill="#66A8FF" p-id="3619"></path><path d="M344.436364 558.545455h18.618181v93.090909h-18.618181v-93.090909z" fill="#2E67B1" p-id="3620"></path><path d="M400.290909 279.272727h55.854546v55.854546h-55.854546v-55.854546zM400.290909 167.563636h55.854546v55.854546h-55.854546V167.563636zM344.436364 167.563636h55.854545v167.563637h-55.854545V167.563636zM623.709091 279.272727h55.854545v55.854546h-55.854545v-55.854546zM567.854545 223.418182h55.854546v55.854545h-55.854546v-55.854545zM567.854545 335.127273h223.418182v55.854545H567.854545v-55.854545z" fill="#432E23" p-id="3621"></path><path d="M288.581818 223.418182h55.854546v111.709091H288.581818v-111.709091zM456.145455 167.563636h223.418181v55.854546H456.145455V167.563636zM400.290909 223.418182h167.563636v55.854545h-167.563636v-55.854545zM456.145455 279.272727h167.563636v55.854546h-167.563636v-55.854546zM344.436364 335.127273h223.418181v55.854545H344.436364v-55.854545zM344.436364 390.981818h390.981818v55.854546H344.436364v-55.854546zM623.709091 223.418182h167.563636v55.854545h-167.563636v-55.854545zM679.563636 279.272727h167.563637v55.854546h-167.563637v-55.854546z" fill="#FFF1E3" p-id="3622"></path><path d="M232.727273 223.418182h55.854545v167.563636H232.727273v-167.563636z" fill="#432E23" p-id="3623"></path><path d="M232.727273 111.709091h55.854545v111.709091H232.727273V111.709091zM176.872727 223.418182h55.854546v167.563636H176.872727v-167.563636zM232.727273 390.981818h111.709091v55.854546H232.727273v-55.854546zM176.872727 800.581818h111.709091v55.854546H176.872727v-55.854546zM456.145455 800.581818h111.70909v55.854546h-111.70909v-55.854546zM176.872727 856.436364h93.090909v55.854545H176.872727v-55.854545zM121.018182 912.290909h55.854545v111.709091H121.018182v-111.709091zM847.127273 912.290909h55.854545v111.709091h-55.854545v-111.709091zM176.872727 968.145455h223.418182v55.854545H176.872727v-55.854545zM623.709091 968.145455h223.418182v55.854545H623.709091v-55.854545zM735.418182 800.581818h111.709091v55.854546h-111.709091v-55.854546zM754.036364 856.436364h93.090909v55.854545h-93.090909v-55.854545zM288.581818 55.854545h55.854546v55.854546H288.581818V55.854545zM232.727273 446.836364h55.854545v55.854545H232.727273v-55.854545zM176.872727 502.690909h55.854546v55.854546H176.872727v-55.854546zM791.272727 502.690909h55.854546v55.854546h-55.854546v-55.854546zM121.018182 558.545455h55.854545v242.036363H121.018182V558.545455zM418.909091 856.436364h55.854545v111.709091h-55.854545v-111.709091zM549.236364 856.436364h55.854545v111.709091h-55.854545v-111.709091zM847.127273 558.545455h55.854545v242.036363h-55.854545V558.545455zM791.272727 111.709091h55.854546v55.854545h-55.854546V111.709091zM791.272727 223.418182h55.854546v55.854545h-55.854546v-55.854545zM847.127273 279.272727h55.854545v55.854546h-55.854545v-55.854546zM791.272727 335.127273h55.854546v55.854545h-55.854546v-55.854545zM735.418182 390.981818h55.854545v55.854546h-55.854545v-55.854546zM623.709091 446.836364h167.563636v55.854545h-167.563636v-55.854545zM623.709091 55.854545h167.563636v55.854546h-167.563636V55.854545zM679.563636 167.563636h111.709091v55.854546h-111.709091V167.563636zM344.436364 0h279.272727v55.854545H344.436364V0z" fill="#10001D" p-id="3624"></path>';
        svgIcon.style.cssText = 'vertical-align: middle;'; // 垂直居中样式

        // 将 SVG 添加到 div 容器中
        divWrapper.appendChild(svgIcon);

        if (isClick) {
            // 根据 id 绑定点击事件
            divWrapper.addEventListener('click', function () {
                // 提取 id 中的 suffix 部分
                var idSuffix = id.replace('svg-icon-', '');

                // 根据 id 调用对应的函数
                switch (id) {
                    case 'svg-icon-goodsName':
                        activateIframeAndModifyStyles('goodsName');
                        showNotification("商品名-着色成功", 3000);
                        break;
                    case 'svg-icon-skuDesc':
                        activateIframeAndModifyStyles('skuDesc');
                        showNotification("商品规格-着色成功", 3000);
                        break;
                    case 'svg-icon-livePrice':
                        activateIframeAndModifyStyles('livePrice');

                        // 判断“预售信息”，辅助自动输入定金尾款时间
                        if (check_isHavePreSaleContent()) {
                            buttonClickForAddPreSaleTime();
                        }

                        showNotification("直播价-着色成功", 3000);
                        break;
                    case 'svg-icon-liveGameplay':
                        activateIframeAndModifyStyles('liveGameplay');

                        showNotification("直播玩法-着色成功", 3000);
                        break;
                    case 'svg-icon-preSetInventory':
                        activateIframeAndModifyStyles('preSetInventory');

                        showNotification("预设库存-着色成功", 3000);
                        break;
                    case 'svg-icon-inventory':
                        activateIframeAndModifyStyles('inventory');

                        showNotification("实际库存-着色成功", 3000);
                        break;
                    default:
                        break;
                }

                // 仅当 idSuffix 不在数组中时才添加
                if (!isMarioShow.includes(idSuffix)) {
                    isMarioShow.push(idSuffix);
                }
            });
        } else {
            divWrapper.style.display = 'flex';
            divWrapper.className = 'svg-icon-wrapper-no-data';
        }

        return divWrapper;
    }

    // 查找表格中的目标单元格并添加SVG图标
    function addSVGToSpecificTDs() {
        // 获取 class="card-content-container" 内的表格
        var container = document.querySelector('.card-content-container');
        if (!container) return;

        var table = container.querySelector('table');
        if (!table) return;

        var tbody = table.querySelector('tbody');
        if (!tbody) return;

        // 获取 tbody 内的第二个 tr
        var secondTR = tbody.querySelectorAll('tr')[1]; // 获取第二个 tr
        if (!secondTR) return;

        // 获取第二个 tr 中的所有 td
        var tds = secondTR.querySelectorAll('td');
        var idMap = {
            "商品名": "svg-icon-goodsName",
            "规格": "svg-icon-skuDesc",
            "直播间到手价": "svg-icon-livePrice",
            "优惠方式": "svg-icon-liveGameplay",
            "预设库存": "svg-icon-preSetInventory",
            "现货库存": "svg-icon-inventory"
        }; // 文本内容与ID的映射

        tds.forEach(function (td) {
            // 检查 td 的文本内容是否在目标文本内容列表中
            var span = td.querySelector('.link-node-container > span');
            if (span && idMap.hasOwnProperty(span.textContent.trim())) {
                // 检查是否已经存在封装的 SVG 图标，避免重复添加
                if (!td.querySelector('.svg-icon-wrapper')) {
                    // 获取对应的 id
                    var id = idMap[span.textContent.trim()];
                    // 创建包含 SVG 图标的 div 容器并设置 id
                    var svgWrapper = createMarioSVGIconWrapper(id);
                    // 将 SVG 容器插入到 span 之后
                    span.parentNode.insertAdjacentElement('afterend', svgWrapper);
                }
            }
        });
    }

    // 初始化存储被点击事件的数组
    var isMarioShow = [];

    // 函数：控制每个 divWrapper 的显示状态
    function updateDivWrapperDisplay(isShow) {
        // 获取所有 class 为 'svg-icon-wrapper' 的元素
        const divWrappers = document.querySelectorAll('.svg-icon-wrapper');

        // 遍历所有 divWrapper
        for (const divWrapper of divWrappers) {
            if (isShow) {
                divWrapper.style.display = 'flex';
            } else {
                // 获取该 divWrapper 的 id
                var wrapperId = divWrapper.id;

                // 检查是否存在于 isMarioShow 数组中
                if (isMarioShow.includes(wrapperId.replace('svg-icon-', ''))) {
                    divWrapper.style.display = 'flex';
                } else {
                    divWrapper.style.display = 'none';
                }
            }
        }
    }

    /*
    淘宝、天猫主图复制到剪贴板功能
    */
    function createGetTmallPngButton() {
        // 找到匹配的元素的编号
        function findMatchingIndex(wrapperClass, imgClass) {
            for (let i = 0; i < wrapperClass.length; i++) {
                const wrapper = document.querySelector(wrapperClass[i]);
                if (wrapper) {
                    const img = wrapper.querySelector(imgClass[i]); // 找到图片元素
                    const button = wrapper.querySelector('#button_getTmallPngButton'); // 找到按钮元素

                    if (img && !button) {
                        return i; // 返回匹配的编号
                    } else {
                        return -1; // 如果按钮已存在，则返回 -1
                    }
                }
            }
            return -1; // 如果没有找到匹配的元素，则返回 -1
        }


        const wrapperClass = ['.itemImgWrap--bUt5RRLT', '.PicGallery--mainPicWrap--juPDFPo', '.mainPicWrap--Ns5WQiHr', '.PicGallery--mainPicWrap--1c9k21r', '.item-gallery-top.item-gallery-prepub2'];
        const imgClass = ['.itemImg--O9S7hs0i', '.PicGallery--mainPic--34u4Jrw', '.mainPic--zxTtQs0P', '.PicGallery--mainPic--1eAqOie', '.item-gallery-top__img'];

        const matchingIndex = findMatchingIndex(wrapperClass, imgClass);

        if (matchingIndex !== -1) {
            addButton(wrapperClass, imgClass, matchingIndex);
            addButton(wrapperClass, imgClass, 0);
        } else {
            // console.error('Wrapper element not found.');
        }

        function addButton(wrapperClass, imgClass, matchingIndex) {
            const wrapper = document.querySelector(wrapperClass[matchingIndex]);
            console.log("wrapper:", wrapper);

            const old_button = wrapper.querySelector('#button_getTmallPngButton'); // 找到按钮元素
            if (old_button) {
                return; // 如果按钮已存在，则直接返回
            }

            if (wrapper) {
                const button = document.createElement('button');
                button.textContent = '复制图片';
                button.id = 'button_getTmallPngButton';
                button.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    padding: 5px 20px;
                    font-size: 16px;
                    background-color: rgba(22, 22, 23, .7);
                    color: #fff;
                    border: none;
                    border-radius: 999px;
                    font-family: AlibabaPuHuiTi_2_55_Regular;
                    backdrop-filter: saturate(180%) blur(20px); /* 添加模糊效果 */
                    -webkit-backdrop-filter: blur(20px); /* 兼容Safari浏览器 */
                    text-align: center; /* 文本居中显示 */
                    cursor: pointer;
                    opacity: 0;
                    transition: opacity 0.3s ease, color 0.15s ease, background-color 0.25s ease;;
                    z-index: 999;
                `;

                // 控制按钮显示
                wrapper.addEventListener('mouseenter', () => {
                    button.style.opacity = '1';
                });

                // 控制按钮隐藏
                wrapper.addEventListener('mouseleave', () => {
                    button.style.opacity = '0';
                });

                button.addEventListener('click', async () => {
                    const img = wrapper.querySelector(imgClass[matchingIndex]);
                    // console.log("img:", img);
                    if (img) {
                        try {
                            const imageUrl = img.src;
                            const response = await fetch(imageUrl);
                            const blob = await response.blob();
                            const image = new Image();
                            image.src = URL.createObjectURL(blob);

                            image.onload = () => {
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d');
                                canvas.width = image.width;
                                canvas.height = image.height;
                                ctx.drawImage(image, 0, 0);
                                canvas.toBlob(async (blob) => {
                                    try {
                                        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                                        showNotification("图片已成功复制到剪贴板", undefined, true);
                                        button.textContent = '复制成功';
                                        button.style.backgroundColor = 'rgba(233, 233, 233, .7)'; // 按钮颜色改变
                                        button.style.color = '#000'; // 按钮文字颜色改变

                                        setTimeout(() => {
                                            button.textContent = '复制图片';
                                            button.style.backgroundColor = 'rgba(22, 22, 23, .7)'; // 按钮颜色恢复
                                            button.style.color = '#fff'; // 按钮文字颜色恢复

                                        }, 1500); // 1.5秒后恢复按钮文字
                                        // alert('Image copied to clipboard!');
                                    } catch (error) {
                                        console.error('Failed to copy image to clipboard:', error);
                                        // alert('Failed to copy image to clipboard.');
                                        showNotification('图片复制失败！');
                                    }
                                }, 'image/png');
                            };
                        } catch (error) {
                            showNotification('图片复制失败！');
                            console.error('Failed to fetch or process image:', error);
                            // alert('Failed to copy image to clipboard.');
                        }
                    } else {
                        // alert('Image not found!');
                    }
                });

                wrapper.style.position = 'relative'; // 确保按钮在图片上层
                wrapper.appendChild(button);
            }
        }
    }

    /*
    用于主播排序的辅助函数
    */
    // 封装处理和生成多维数组数据的函数
    function generateJsonFromText(textInput) {
        // 简写与全称的对应表
        const shorthandToFull = {
            "野": "小野",
            "月": "小月",
            "霸": "小霸王",
            "迎": "小迎",
            "京": "京京",
            "祖": "阿祖",
            "凯": "凯子",
            "空": "悟空",
        };

        // 处理文本，去除“+”及其后的内容
        // const processText = (text) => text.split('+')[0].trim();
        const processText = (text) => {
            let result = '';
            // 首先移除“+”及其后的内容
            const firstPart = text.split('+')[0];

            // 遍历firstPart的每个字符
            for (let char of firstPart) {
                // 如果字符是shorthandToFull的键，则添加到结果中
                if (shorthandToFull.hasOwnProperty(char)) {
                    result += char;
                }
            }

            // 返回处理后的文本
            return result.trim();
        };

        // 将简写转换为全称
        const getFullNames = (text) => {
            return text.split('').map(ch => shorthandToFull[ch] || ch);
        };

        // 生成多维数组格式数据
        const result = [];

        // 示例输入 [1][0][0]
        // 解释：第一个位置存储多个主播的排列组合，第二个位置0存储主播名字，其余位置存储其rowIndex值，第三个位置用于读取主讲或副讲
        // 获取主讲 resultArray[2][0][0];
        // 获取副讲 resultArray[2][0][1];
        // 获取其列 resultArray[2][i]

        const texts = textInput.trim().split('\n');

        texts.forEach((text, index) => {
            const processedText = processText(text);
            const fullNamesArray = getFullNames(processedText);

            // 查找是否已存在相同的 fullNamesArray
            const existingEntry = result.find(entry => {
                return JSON.stringify(entry[0]) === JSON.stringify(fullNamesArray);
            });

            if (existingEntry) {
                // 如果存在相同的组合，追加索引
                existingEntry.push(index);
            } else {
                // 如果不存在，创建一个新的组合
                result.push([fullNamesArray, index]);
            }
        });

        return result;
    }

    // 页面控制函数
    function itemPageScroll(height, addScroll = true) {
        return new Promise((resolve) => {
            // .rc-virtual-list-holder
            const viewport = document.querySelector('.ag-body-vertical-scroll-viewport'); // 获取页面滚动区域

            if (addScroll) {
                if (height != 0) {
                    viewport.scrollTop += height; // 向下滚动一屏
                } else {
                    viewport.scrollTop = 0; // 回到顶部
                }
            } else {
                viewport.scrollTop = height; // 直接滚动到指定位置
            }

            console.log('scrolling to', viewport.scrollTop); // 打印当前滚动高度

            // 通过 setTimeout 来模拟等待页面加载完成
            setTimeout(() => {
                resolve(); // 滚动完成后继续执行
            }, 800); // 延迟时间可以根据实际加载时间调整
        });
    }

    // 商品选择函数
    function selectItemForRowIndex(rowIndex, retries = 5, delay = 500) {
        return new Promise((resolve, reject) => {
            // 找到带有指定 row-index 的 div
            const targetDiv = document.querySelector(`div[row-index="${rowIndex}"]`);

            // 在 targetDiv 内查找 col-id="choice" 的元素
            if (targetDiv) {
                const choiceElement = targetDiv.querySelector('div[col-id="choice"]');

                // 在 choiceElement 内找到唯一的 input 元素
                if (choiceElement) {
                    const inputElement = choiceElement.querySelector('input');
                    if (inputElement) {
                        inputElement.click(); // 点击 input 元素
                        // console.log(`Selected item for row-index="${rowIndex}"`);
                        resolve(); // 选择完成后继续执行
                    } else {
                        // input 元素未找到的情况
                        retryOrReject(`未找到 input 元素在 col-id="choice" 的元素内`);
                    }
                } else {
                    // console.log(`未找到 col-id="choice" 的元素在 row-index="${rowIndex}" 的 div 内`);
                    retryOrReject(`未找到 col-id="choice" 的元素在 row-index="${rowIndex}" 的 div 内`);
                }
            } else {
                // console.log(`未找到 row-index="${rowIndex}" 的 div`);
                retryOrReject(`未找到 row-index="${rowIndex}" 的 div`);
            }

            function retryOrReject(errorMessage) {
                if (retries > 0) {
                    setTimeout(() => {
                        // 递归调用自己，并减少重试次数
                        selectItemForRowIndex(rowIndex, retries - 1, delay).then(resolve).catch(reject);
                    }, delay);
                } else {
                    reject(errorMessage); // 达到最大重试次数后，返回错误
                }
            }
        });
    }

    // 模拟鼠标点击，激活主播选择框
    // 示例调用：点击 "主讲主播" 的选择框
    // clickSelectByTitle("主讲主播");

    // 示例调用：点击 "副讲主播" 的选择框
    // clickSelectByTitle("副讲主播");

    async function clickSelectByTitle(title, retries = 5, delay = 500) {
        // 重试机制，最多重试 `retries` 次，每次等待 `delay` 毫秒
        for (let i = 0; i < retries; i++) {
            const labelElement = document.querySelector(`label[title="${title}"]`);

            if (labelElement) {
                const parentElement = labelElement.parentElement;
                if (parentElement && parentElement.parentElement) {
                    const selectSelector = parentElement.parentElement.querySelector('.ant-select-selector');

                    if (selectSelector) {
                        // 模拟点击
                        const clickEvent = new MouseEvent('mousedown', {
                            bubbles: true,
                            cancelable: true
                        });
                        selectSelector.dispatchEvent(clickEvent); // 模拟点击事件

                        // console.log(`已激活并点击 ${title} 对应的选择框`);
                        return; // 成功找到并点击后直接返回
                    } else {
                        // console.log(`未找到 ${title} 对应的 .ant-select-selector 元素`);
                    }
                } else {
                    // console.log(`无法获取到 ${title} 的父元素`);
                }
            } else {
                // console.log(`未找到 title 为 "${title}" 的 label 元素`);
            }

            // 如果没找到，等待一段时间再重试
            if (i < retries - 1) {
                // console.log(`重试 ${i + 1}/${retries} 次后等待 ${delay} 毫秒...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        // 如果所有重试都失败了，抛出一个错误
        throw new Error(`无法找到 title 为 "${title}" 的元素。`);
    }

    // 选择指定的主播
    function selectAnchor(anchor, primary = true) {
        return new Promise((resolve, reject) => {
            // 根据 primary 参数决定目标容器的选择器
            const targetDiv = primary ? '#primaryAnchor_list' : '#assistantAnchor_list';

            // 获取视窗元素
            const viewFather = document.querySelector(targetDiv).parentElement;
            const viewport = viewFather.querySelector('.rc-virtual-list-holder');

            // 定义一个异步函数来执行循环操作
            (async function trySelect() {
                for (let attempt = 0; attempt < 4; attempt++) {
                    // 查找目标选项
                    const targetOption = `.ant-select-item[title="${anchor}"]`;
                    const optionElement = document.querySelector(targetDiv).parentElement.querySelector(targetOption);

                    if (optionElement) {
                        // 如果找到选项，则点击并完成操作
                        optionElement.click();
                        // console.log(`已选择 ${anchor} 主播`);
                        resolve();
                        return; // 结束函数
                    }

                    // 如果没有找到，滚动视窗
                    viewport.scrollTop += 256;
                    // console.log(`未找到 ${anchor} 主播，正在尝试第 ${attempt + 1} 次滚动`);

                    // 等待一点时间以让页面加载新内容
                    await new Promise(r => setTimeout(r, 500));
                }

                // 如果经过多次尝试仍未找到，抛出错误或处理异常
                // console.log(`未能找到 ${anchor} 主播，已尝试 ${4} 次`);
                reject(new Error(`未能找到 ${anchor} 主播`));
            })();
        });
    }

    // 点击“计划主播排班”
    function clickScheduleButton() {
        return new Promise((resolve) => {
            const scheduleButtonClassName = '.ant-btn.css-9fw9up.ant-btn-default.primaryButton___N3z1x'
            clickButton(true, 0, document, scheduleButtonClassName, '计划主播排班');
            resolve();
        });
    }

    // 点击“排班页面”的“确定”按钮
    function clickConformButtonForSchedule() {
        return new Promise((resolve) => {
            const scheduleClassName = '.ant-modal-content';
            const conformButtonClassName = '.ant-btn.css-9fw9up.ant-btn-primary';

            clickButton(true, 0, scheduleClassName, conformButtonClassName);
            resolve();
        });
    }

    let itemBlockHeight = 100; // item 块高度，可根据实际情况调整

    async function processItems() {
        // 返回输入文本中对应的商品个数
        function countAllItemNum(resultArray) {
            var countNum = 0;

            for (var i = 0; i < resultArray.length; i++) {
                countNum += resultArray[i].length - 1;
            }

            // console.log('countNum:', countNum);
            return countNum;
        }

        // 返回当前已经排序的最大商品序号
        function getMaxForScheduledItemIndex() {
            if (scheduledItems.length === 0) {
                return 0;
            }

            // 对已排班的商品序号进行排序
            scheduledItems.sort((a, b) => a - b);

            // 遍历数组，找到最小的缺失序号
            for (let i = 0; i < scheduledItems.length; i++) {
                if (scheduledItems[i] !== i) {
                    // console.log('Missing index:', i);
                    return i; // 一旦发现某个序号不连续，返回这个序号
                }
            }

            // 如果所有序号都连续，则返回下一个未使用的序号
            return scheduledItems.length;
        }

        let scheduledItems = []; // 已排班的商品序号
        let rounder = 0; // 轮次计数器

        try {
            const elements = document.getElementsByClassName('fontLinkd-[#333_20_20_Bold]');
            const textContent = elements[0].innerText || elements[0].textContent;
            const countItem = parseInt(textContent, 10); // link上的商品总数

            // 原生浏览器弹窗提示
            // const textInput = prompt('请输入主播排班表格内容，一行对应一个商品');

            const textInput = await createDropdownModal(dropdownContainer, '主播排序');

            const resultArray = generateJsonFromText(textInput);
            // console.log(resultArray);

            // 商品数检查
            if (countAllItemNum(resultArray) > countItem) {
                click_itemSort_anchorSort();
                setTimeout(() => {
                    showNotification('输入了过多的主播，请检查后重新输入！');
                }, 1500);

                return;
            }

            while (rounder < resultArray.length) {
                if (!itemSort_anchorSort.getDivButtonState()) return; // 跳出循环，如果主播排序未打开，则不执行任何操作
                await itemPageScroll(itemBlockHeight * getMaxForScheduledItemIndex(), false); // 回到合适的位置或许是顶部

                showNotification('正在处理第 ' + (rounder + 1) + '/' + resultArray.length + ' 轮次 ' + loadImageIcon(), 0);

                await new Promise(resolve => setTimeout(resolve, 500)); // 等待500毫秒，可根据需要调整

                let index = 1;
                let checkCount = 0;

                for (let i = getMaxForScheduledItemIndex(); i < countItem; i++, checkCount++) {
                    if (!itemSort_anchorSort.getDivButtonState()) return; // 跳出循环，如果主播排序未打开，则不执行任何操作

                    if (resultArray[rounder][index] == i) {
                        await selectItemForRowIndex(i); // 选择指定的行
                        scheduledItems.push(i); // 记录已排班的商品序号
                        index++;
                    }

                    if ((checkCount + 1) % 4 === 0) await itemPageScroll(itemBlockHeight * 4); // 每处理4行，滚动页面

                    // console.log('Index:', index, 'Length:', resultArray[rounder].length);

                    if (index === resultArray[rounder].length) {
                        // console.log('Executing scheduling...');

                        await new Promise(resolve => setTimeout(resolve, 500)); // 等待500毫秒，可根据需要调整
                        await clickScheduleButton();
                        await clickSelectByTitle("主讲主播");
                        await selectAnchor(resultArray[rounder][0][0], true);
                        await clickSelectByTitle("副讲主播");
                        if (resultArray[rounder][0][1]) {
                            await selectAnchor(resultArray[rounder][0][1], false);
                        }
                        await clickConformButtonForSchedule();

                        rounder++;
                        break; // 跳出循环，继续处理下一个商品
                    }
                }

                // 确保整个循环内容都执行完再进入下一次迭代
                await new Promise(resolve => setTimeout(resolve, 500)); // 等待500毫秒，可根据需要调整
            }
            setTimeout(() => {
                click_itemSort_anchorSort();
            }, 1500);
            showNotification('全部处理完成！');
        } catch (error) {
            // 捕获任何异常，并显示错误通知
            click_itemSort_anchorSort();
            setTimeout(() => {
                showNotification('处理过程中出现错误！');
            }, 1500);
            console.error('Error occurred:', error);
        } finally {
            // 可选的: 在所有操作完成后执行清理工作
            // console.log('处理流程结束');
        }
    }

    function click_itemSort_anchorSort() {
        document.getElementById('itemSort_anchorSort_divButton').click();
    }

    // 输入弹窗
    function createDropdownModal(dropdownContainer, titleText) {
        return new Promise((resolve, reject) => {
            // 检查是否已有弹窗存在，如果有则移除
            const existingModal = dropdownContainer.querySelector('.dropdown-modal');
            if (existingModal) {
                dropdownContainer.removeChild(existingModal);
            }

            dropdownButton.style.display = 'none'; // 隐藏按钮

            // 创建弹窗容器
            var dropdownDivModal = document.createElement('div');
            dropdownDivModal.classList.add('dropdown-modal'); // 添加一个类以便于识别
            dropdownDivModal.style.cssText = `
                position: absolute;
                top: 0;
                margin: 14px;
                width: 172px;
                height: 108px;
                background-color: rgba(233, 233, 233, 0.7);
                backdrop-filter: blur(8px) brightness(90%);
                border: 1px solid rgba(255, 98, 0, 0.25);
                border-radius: 10px;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                z-index: 3;
                transform-origin: top center;
            `;

            // 创建标题行
            const title = document.createElement('div');
            title.textContent = titleText || '弹窗标题';
            title.style.cssText = `
                padding: 8px 10px;
                font-size: 14px;
                font-weight: bold;
                color: rgb(51, 51, 51);
                border-bottom: 0px solid #ccc;
                text-align: left;
                flex-shrink: 0;
            `;
            dropdownDivModal.appendChild(title);

            // 创建富文本框
            const textarea = document.createElement('textarea');
            textarea.style.cssText = `
                width: calc(100% - 20px);
                background-color: rgba(249, 249, 249, 0.7);
                height: 30px;
                margin: 0px 10px;
                padding: 5px;
                font-size: 12px;
                border: 0px solid #ccc;
                border-radius: 4px;
                resize: none;
                line-height: 1.2;
                box-sizing: border-box;
                flex-grow: 1;
            `;
            dropdownDivModal.appendChild(textarea);

            // 创建按钮容器
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                            display: flex;
                            justify-content: space-between;
                            padding: 8px 10px;
                            border-top: 0px solid #ccc;
                            flex-shrink: 0;
                        `;

            // 创建“取消”按钮
            const cancelButton = document.createElement('button');
            cancelButton.textContent = '取消';
            cancelButton.style.cssText = `
                            padding: 3px 8px;
                            font-size: 12px;
                            color: #fff;
                            background-color: #f44336;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            flex-basis: 48%;
                        `;
            cancelButton.onclick = () => {
                dropdownContainer.removeChild(dropdownDivModal);
                dropdownButton.style.display = ''; // 恢复按钮
                reject('用户取消了输入');
            };
            buttonContainer.appendChild(cancelButton);

            // 创建“确认”按钮
            const confirmButton = document.createElement('button');
            confirmButton.textContent = '确认';
            confirmButton.style.cssText = `
                            padding: 3px 8px;
                            font-size: 12px;
                            color: #fff;
                            background-color: #4CAF50;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            flex-basis: 48%;
                        `;

            confirmButton.onclick = () => {
                const textInput = textarea.value;
                dropdownContainer.removeChild(dropdownDivModal);
                dropdownButton.style.display = ''; // 恢复按钮
                resolve(textInput); // 在确认时返回输入的内容
            };
            buttonContainer.appendChild(confirmButton);

            dropdownDivModal.appendChild(buttonContainer);

            dropdownContainer.appendChild(dropdownDivModal);
        });
    }

    /*
    补贴生成
    */
    function createSubsidyTextButton(isActivated = sonMain_subsidyText.getSwitchState()) {
        if (!isActivated) {
            return;
        }

        const targetClass = '[class*="ant-space"][class*="css-9fw9up"][class*="ant-space-horizontal"][class*="ant-space-align-center"]';

        const subsidyText_observer = new MutationObserver((mutationsList, observer) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const targetElement = document.querySelector(targetClass);
                    if (targetElement) {
                        if (document.querySelector('.subsidyText')) {
                            subsidyText_observer.disconnect();
                            return;
                        }

                        var subsidyText = document.createElement('div');
                        subsidyText.classList.add('ant-space-item');
                        subsidyText.style.display = 'none';

                        var subsidyTextButton = document.createElement('button');
                        subsidyTextButton.textContent = '补贴生成';
                        subsidyTextButton.classList.add('ant-btn', 'css-9fw9up', 'ant-btn-default', 'subsidyText');
                        subsidyText.appendChild(subsidyTextButton);

                        targetElement.insertBefore(subsidyText, targetElement.firstChild);

                        subsidyTextButton.addEventListener('click', () => generateSubsidyText());

                        subsidyText_observer.disconnect();
                        break;
                    }
                }
            }
        });

        subsidyText_observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 在页面上创建按钮
    createSubsidyTextButton();

    async function generateSubsidyText() {
        if (document.querySelector('.dropdown-modal')) {
            return; // 如果弹窗已存在，则不执行任何操作
        }

        // 创建开关容器元素
        const switchesContainer = document.createElement('div');
        switchesContainer.classList.add('flex', 'items-center', 'justify-between', 'pb-12');
        switchesContainer.style.cssText = 'position: fixed; top: 60px; right: 300px; transform: translateX(-50%); z-index: 9999; width: 200px;';
        if (isTableCardURL()) {
            document.body.appendChild(switchesContainer);
        }

        const dropdownContainer = document.createElement('div');
        dropdownContainer.style.cssText = 'position: relative; display: inline-block;';
        switchesContainer.appendChild(dropdownContainer);

        // 调起浏览器原生的输入框，要求用户输入1~999之间的数字
        let red_value = prompt("请输入1到999之间的数字:");
        // let red_value = await createDropdownModal(dropdownContainer, '补贴生成');

        // 检查输入是否为有效的数字，并且在1到999之间
        if (red_value !== null) { // 用户没有点击取消
            red_value = parseInt(red_value, 10); // 将输入转换为整数
            if (isNaN(red_value) || red_value < 1 || red_value > 999) {
                alert("请输入1到999之间的有效数字！");
                // 递归调用函数，让用户重新输入
                generateSubsidyText();
            } else {
                console.log("输入的有效数字是:", red_value);
                // 继续处理
                testRedPacket = {}; // 初始化红包袋子

                const new_docText = new DocText();
                const itemId = new_docText.getCurrentProductId(); // 获取当前商品 ID
                testRedPacket[itemId] = red_value; // 记录红包袋子

                new_docText.addDocText();
            }
        } else {
            console.log("用户取消了输入");
        }
    }

    // 测试使用的红包袋子
    let testRedPacket = {

    };

    // 红包补贴生成器
    // debugger;
    // DocText 类
    class DocText {
        constructor(idName = 'livePrice', redPacket = testRedPacket) {
            this.idName = idName;
            this.redPacket = redPacket;
        }

        // 获取 livePrice 栏目的文本内容
        getDocText() {
            const livePriceDoc = document.getElementById(this.idName); // 获取 livePrice 栏目

            if (livePriceDoc) {
                const liveIframe = livePriceDoc.querySelector('iframe')
                if (liveIframe) {
                    const liveIframeDocument = liveIframe.contentDocument || liveIframe.contentWindow.document;

                    const body = liveIframeDocument.body;

                    if (body && !isNotIframeChineseName(body.innerText)) {
                        // console.log("getDocText:", body.innerText); // debug
                        return body.innerText;
                    }
                }

                const currentHTML = livePriceDoc.innerText;

                // console.log("getDocText:", currentHTML); // debug

                return currentHTML; // 返回 livePrice 栏目的文本内容
            }
        }

        // 更新 livePrice 栏目的文本内容
        addDocText(text = this.preduceSubsidy()) {
            console.log('addDocText:', text); // debug

            const liveIframe = qyeryIframeForId(this.idName);
            if (liveIframe) {
                const liveIframeDocument = liveIframe.contentDocument || liveIframe.contentWindow.document;

                const body = liveIframeDocument.body;

                // 获取当前的 body 内的 HTML 内容
                // const currentHTML = body.innerHTML;

                // 在当前 HTML 内容后面添加换行符和 "预售" 二字
                const updatedHTML = text;

                // console.log('updatedHTML:', updatedHTML); // debug
                // 将更新后的 HTML 设置回 body 内
                body.innerHTML += updatedHTML;
            }
        }

        // 按换行符分割字符串
        splitStringByNewline(text = this.getDocText()) {
            // console.log('splitStringByNewline:', text); // debug
            return text.split('\n');
        }

        // 过滤数组，保留匹配正则表达式或包含“到手”或“平均”的元素
        filterContent(arr = this.splitStringByNewline()) {
            // console.log('filterContent:', arr); // debug
            const priceGameplayRegex = /^(.*：)?([\d\.]+[wW+]?)元?$/;

            // 过滤数组，保留匹配正则表达式或包含“到手”或“平均”的元素
            return arr.filter(item => {
                return priceGameplayRegex.test(item) || item.includes('到手') || item.includes('平均');
            });
        }

        // 整理数组，将价格、个数、均价分组
        organizeContent(arr = this.filterContent()) {
            const priceGameplayRegex = /^(.*：)?([\d\.]+[wW+]?)元?$/;
            let result = [];
            let currentGroup = [];

            arr.forEach(item => {
                if (priceGameplayRegex.test(item)) {
                    if (currentGroup.length > 0) {
                        // 如果当前组已经有数据，则先将其加入结果数组
                        result.push(currentGroup);
                        currentGroup = []; // 清空当前组
                    }
                    currentGroup.push(item); // 添加当前满足条件的元素
                } else if (item.trim() !== '') { // 只添加非空行
                    currentGroup.push(item);
                }
            });

            // 添加最后一个组，如果有的话
            if (currentGroup.length > 0) {
                result.push(currentGroup);
            }

            // console.log('organizeContent:', result); // debug
            return result;
        }

        // 提取关键内容
        extractPriceAndQuantity(input) {
            // 用于匹配整个字符串的正则表达式
            const priceGameplayRegex = /^(.*：)?([\d\.]+[wW+]?)元?$/;
            // 用于匹配“：”之前部分的正则表达式
            const quantityRegex = /拍(一|二|三|四|五|六|七|八|九|十|十一|十二|十三|十四|十五|[1-9]?[0-9])件?/;

            // 首先匹配整个字符串
            const match = input.match(priceGameplayRegex);
            // console.log('match:', match); // debug

            if (match && match[0]) {
                // 提取“：”之前的部分
                const beforeColon = match[0].split('：')[0];

                // 检查“：”之前的部分是否满足quantityRegex
                const quantityMatch = beforeColon.match(quantityRegex);

                if (quantityMatch && quantityMatch[1]) {
                    // 获取数量部分
                    let quantity = quantityMatch[1];

                    // 将中文数字转换为阿拉伯数字
                    const chineseToArabic = {
                        '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
                        '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
                        '十一': 11, '十二': 12, '十三': 13, '十四': 14, '十五': 15
                    };

                    if (chineseToArabic[quantity]) {
                        quantity = chineseToArabic[quantity];
                    } else {
                        quantity = parseInt(quantity, 10); // 如果已经是阿拉伯数字，直接转换
                    }

                    // 返回数量和价格内容
                    return {
                        price: match[2].trim(),
                        quantity: quantity,
                        prefix: match[1],
                    };
                } else {
                    return {
                        price: match[2].trim(),
                        quantity: 1,
                        prefix: match[1],
                    };
                }
            }

            // 如果没有匹配到或捕获组为空，则返回空对象或其他默认值
            return {
                price: input,
                quantity: 1,
            };
        }

        calculateMiniUint_avgPrice(input, subsidyDiscount) {
            // 定义正则表达式来匹配数值
            const regex = /([\d\.]+)/;

            // 使用正则表达式进行匹配
            const match = input.match(regex);

            if (match) {
                // 提取捕获组中的数值
                const numberPart = match[1];

                // 将数值转换为浮点数并乘以2
                const doubledValue = parseFloat(numberPart) * subsidyDiscount;

                // 格式化新的数值为两位小数
                const formattedValue = doubledValue.toFixed(2).replace(/\.?0+$/, "");

                // 替换原字符串中的数值部分
                const output = input.replace(numberPart, formattedValue);

                return output;
            } else {
                // 如果没有找到匹配项，返回错误信息或合适的默认值
                return input + '*' + subsidyDiscount + '==';
            }
        }

        // 获取当前商品id
        getCurrentProductId() {
            return document.getElementById('cureentItem_upLiveId').innerText;
        }

        // 获取当前商品红包
        getCurrentProductRedPacket() {
            const productId = this.getCurrentProductId();
            return this.redPacket[productId] || 0;
        }

        // 生成补贴文本
        generateSubsidyText(redPacketValue, originalPrice, quantity = 1, prefix = '', miniUint = '', miniUint_avgPrice = '') {
            // console.log("generateSubsidyText:", redPacketValue, originalPrice, quantity, prefix, miniUint_avgPrice); // debug
            // 补贴后的价格
            var subsidyedPrice = originalPrice - (redPacketValue * quantity);
            subsidyedPrice = subsidyedPrice.toFixed(2).replace(/\.?0+$/, ""); // 保留两位小数，去除末尾的0
            // 补贴折扣力度
            var subsidyDiscount = (subsidyedPrice / originalPrice);

            // 生成补贴文本
            var subsidyText = `
                <span style="color:${colorLibrary.blue};" data-mce-style="color:${colorLibrary.blue};">${prefix}</span>
                <span style="color:${colorLibrary.red};font-size: 18px;" data-mce-style="color:${colorLibrary.red};font-size: 18px;">补贴${redPacketValue * quantity}</span>
                <br><span style="color:${colorLibrary.red};" data-mce-style="color:${colorLibrary.red};">相当于到手${subsidyedPrice}</span>
            `;

            if (miniUint && miniUint_avgPrice) {
                // 更新 miniUint_avgPrice
                var new_miniUint_avgPrice = this.calculateMiniUint_avgPrice(miniUint_avgPrice, subsidyDiscount);

                var avgPriceText = `
                    <br><br><span style="color:${colorLibrary.red};" data-mce-style="color:${colorLibrary.red};">${miniUint}</span><br>
                    <span>补贴后${new_miniUint_avgPrice}</span>
                `;

                subsidyText += avgPriceText;
            }

            return subsidyText;
        }

        isOne_generateSubsidyText(redPacketValue, originalPrice, quantity = 1, prefix = '', miniUint = '', miniUint_avgPrice = '', isOne_quantity_flag = false) {
            // 补贴后的价格
            var subsidyedPrice = originalPrice - (redPacketValue * quantity);
            subsidyedPrice = subsidyedPrice.toFixed(2).replace(/\.?0+$/, ""); // 保留两位小数，去除末尾的0
            // 补贴折扣力度
            var subsidyDiscount = (subsidyedPrice / originalPrice);

            if (isOne_quantity_flag === true) {
                // 生成补贴文本
                var subsidyText = `
                    <span style="color:${colorLibrary.red};font-size: 18px;" data-mce-style="color:${colorLibrary.red};font-size: 18px;">补贴${redPacketValue * quantity}</span>
                    <br><span style="color:${colorLibrary.red};" data-mce-style="color:${colorLibrary.red};">相当于到手</span>
                    <br><span style="color:${colorLibrary.blue};" data-mce-style="color:${colorLibrary.blue};">${prefix}</span>
                    <span style="color:${colorLibrary.red};" data-mce-style="color:${colorLibrary.red};">${subsidyedPrice}</span>
                `;
            } else {
                var subsidyText = `
                    <br><span style="color:${colorLibrary.blue};" data-mce-style="color:${colorLibrary.blue};">${prefix}</span>
                    <span style="color:${colorLibrary.red};" data-mce-style="color:${colorLibrary.red};">${subsidyedPrice}</span>
                `;
            }

            return subsidyText;
        }

        preduceSubsidy(arr = this.organizeContent(), redPacket = this.redPacket) {
            console.log("arr:", arr); // debug
            var new_arr = []; // 存储提取数量信息的数组，包含：价格、数量、前缀文本
            var indexArr = getIndexArr_togetherAndAvgPrice(arr); // “到手共”与“平均”文本的索引数组
            var productId = this.getCurrentProductId(); // 获取当前商品id
            var redPacketValue = redPacket[productId] || 0; // 获取当前商品红包值

            console.log("indexArr:", indexArr); // debug

            // 预处理数组内容
            for (var i = 0; i < arr.length; i++) {
                // 处理每一组内容
                if (arr[i] && Array.isArray(arr[i]) && arr[i].length > 0) {
                    new_arr.push(this.extractPriceAndQuantity(arr[i][0]));
                }
            }

            // 文本生成器（传入：数组、提取数量信息的数组、“到手共”与“平均”文本的索引数组、当前商品红包值）
            const len = arr.length; // 数组长度
            var text = `
                <span>----------------</span><br>
            `; // 存储生成的文本

            var isOne_quantity_flag = isOne_quantityAll(new_arr) && len > 1; // 判断是否全部数量为1

            if (isOne_quantity_flag) {
                for (var i = 0; i < len; i++) {
                    var isOne = i === 0;

                    if (indexArr && Array.isArray(indexArr[i]) && indexArr[i].length === 2) {
                        text += this.isOne_generateSubsidyText(redPacketValue, new_arr[i].price, new_arr[i].quantity, new_arr[i].prefix, arr[i][indexArr[i][0]], arr[i][indexArr[i][1]], isOne);
                    } else {
                        text += this.isOne_generateSubsidyText(redPacketValue, new_arr[i].price, new_arr[i].quantity, new_arr[i].prefix, '', '', isOne);
                    }
                }
            } else {
                for (var i = 0; i < len; i++) {
                    if (indexArr && Array.isArray(indexArr[i]) && indexArr[i].length === 2) {
                        text += this.generateSubsidyText(redPacketValue, new_arr[i].price, new_arr[i].quantity, new_arr[i].prefix, arr[i][indexArr[i][0]], arr[i][indexArr[i][1]]);
                    } else {
                        text += this.generateSubsidyText(redPacketValue, new_arr[i].price, new_arr[i].quantity, new_arr[i].prefix);
                    }
                    if (i < len - 1) {
                        text += '<br><br>';
                    }
                }
            }

            // // debug 输出
            // var testText = '';
            // testText = isOne_quantityAll(new_arr);
            // console.log("debug-testText：", testText);

            // 判断是否都是独立的sku
            function isOne_quantityAll(new_arr) {
                for (var i = 0; i < new_arr.length; i++) {
                    if (new_arr[i].quantity !== 1) {
                        return false;
                    }
                }
                return true;
            }

            // 获取最后一个平均到手价在 arr 中的 index 
            function getLastAvgPrice(son_arr) {
                if (!Array.isArray(son_arr)) return null;

                var index = -1;
                for (var i = 0; i < son_arr.length; i++) {
                    if (son_arr[i].includes('平均')) {
                        index = i;
                    }
                }
                return index === -1 ? null : index;
            }

            // 获取最后一个到手共在 arr 中的 index
            function getLastTogether(son_arr) {
                if (!Array.isArray(son_arr)) return null;

                var endIndex = getLastAvgPrice(son_arr);
                if (endIndex === null || endIndex < 2) return null;

                var index = -1;
                for (var i = 0; i < endIndex; i++) {
                    if (son_arr[i].includes('到手')) {
                        index = i;
                    }
                }
                return index === -1 ? null : index;
            }

            // 获取到手共和平均到手价在 arr 中的 index，返回二维数组
            function getIndexArr_togetherAndAvgPrice(arr) {
                var indexArr = [];

                for (var i = 0; i < arr.length; i++) {
                    var index_together = getLastTogether(arr[i]);
                    var index_avgPrice = getLastAvgPrice(arr[i]);

                    if (index_together !== null && index_avgPrice !== null) {
                        indexArr[i] = [index_together, index_avgPrice];
                    }
                }

                return indexArr;
            }

            return text; // 函数最终返回
        }
    }

    function findGoodsByShopName(shopName = clipboardHistory, goodsDict = goodsUrlCheckArray) {
        // console.log('findGoodsByShopName:', shopName); // debug
        let result = ["辛苦确定下以下挂链链接是否需要更换！\n"];
        var date = GM_getValue('titlePrint_extractedDate', '')

        var i = 1;
        for (const upLiveId in goodsDict) {
            const goodsInfo = goodsDict[upLiveId];
            if (goodsInfo.shopName === shopName) {
                result.push(`${i} \[${isLinkTrue(goodsInfo.weight)}\]-${filterBadGoodName(goodsInfo.sessionGoodsName)}：${goodsInfo.liveLink}`);
                i++;
            }
        }

        if (i === 1) {
            // 没有找到对应店铺
            result = [];
            showNotification('未找到对应店铺，请检查剪切板是否正确！');
            return result;
        }

        result.push(`\n【${shopName}】挂链日期：${date}`);

        // console.log('findGoodsByShopName:', result.join('\n')); // debug
        showNotification(`${shopName}的挂链链接已复制到剪切板`);
        GM_setClipboard(result.join('\n'));
        return result;

        function isLinkTrue(weight) {
            if (weight === 0) {
                return '未确认';
            } else {
                return '已确认';
            }
        }

        function filterBadGoodName(goodsName) {
            // 使用正则表达式去除换行符和“预售”信息
            const cleanedName = goodsName.replace(/(\r\n|\n|\r|预售)/g, '');
            return cleanedName.trim(); // 去除首尾的空白字符
        }
    }

    function addDefaultButtonForHomePage() {
        var buttonName = '完整复制';
        var buttonId = 'allCopyButton';
        const smartCopyButton = createDefaultButton(buttonId, buttonName, () => {
            findGoodsByShopName();
        });

        // 找到搜索栏目
        const searchToolBar = document.querySelector('.ant-pro-table-list-toolbar-left');
        const scButton = document.getElementById(buttonId);
        if (searchToolBar) {
            if (!scButton) {
                searchToolBar.appendChild(smartCopyButton);
            } else {
                if (checkActiveTab_GuaLian() && sonMain_linkAllCopySwitch.getSwitchState()) {
                    scButton.style.display = '';
                } else {
                    scButton.style.display = 'none';
                }
            }
        }
    }

    function createDefaultButton(id = 'testButton', text = '测试按钮', clickHandler) {
        // 创建按钮元素
        const button = document.createElement('button');
        button.type = 'button';
        button.id = id;
        button.className = 'ant-btn css-9fw9up ant-btn-default';

        // 创建按钮内部的文本元素
        const span = document.createElement('span');
        span.textContent = text;
        button.appendChild(span);

        // 绑定点击事件处理函数
        if (typeof clickHandler === 'function') {
            button.addEventListener('click', clickHandler);
        }

        return button;
    }

    /*
    自动排序功能块
    */
    let autoSortNum = ''; // 自动排序值
    let AutoSortState = false; // 自动排序状态

    class AutoSortItem {
        sortTable = []; // 使用数组来存储排序信息
        sortedIndex = []; // 使用数组存储已经排序的索引

        constructor(text) {
            this.text = text;
            this.arr = this.changeOrderText(text);
            this.lastMiniIndex = 0; // 记录上一次的最小连续数字索引
        }

        // 将输入的文本转换为数组
        changeOrderText(text = this.text) {
            // 输入样例：3,4,2,1,5;
            // 预处理-清除空格、转换中文逗号
            text = text.replace(/\s/g, '').replace(/，/g, ',');
            // 预处理-分割字符串
            const arr = text.split(',');
            console.log('changeOrderText:', arr); // debug

            return arr;
        }

        // 返回数组的最小连续数字-从 1 开始
        findCurrentSmallestNumber(arr) {
            if (arr.length === 0) {
                return 0;
            }

            // 将字符串数组转换为数字数组
            const numArr = arr.map(Number);

            // 将数组转换为Set，以便快速查找
            const set = new Set(numArr);

            let currentSmallest = 1;

            // 查找当前最小的连续数
            while (set.has(currentSmallest)) {
                currentSmallest++;
            }

            return currentSmallest - 1;
        }

        // 初始化
        initSortItem() {
            this.sortTable = [];
            this.sortedIndex = [];
            this.lastMiniIndex = 0;
            autoSortNum = '';
        }

        // 返回与id对应的权重序号
        async getItemTable(goodsDict = goodsUrlCheckArray) {
            showNotification('正在更新当前信息...', 5000);
            let className = '.ant-btn.css-9fw9up.ant-btn-primary';
            clickButton(true, 100, undefined, className);
            await new Promise(resolve => setTimeout(resolve, 4000)); // 根据实际情况调整等待时间

            let sortTable = [];// 存储排序信息

            // 延迟4秒后，预处理数据
            try {
                showNotification('即将开始自动排序...', 0);
                const ids = Object.keys(goodsDict); // 获取 goodsDict 的键
                for (let i = 0; i < ids.length; i++) {
                    const upLiveId = ids[i].toString();
                    let weight = this.arr[i]; // 预设权重
                    if (weight === undefined) {
                        weight = 999;
                    }
                    sortTable.push([upLiveId, weight]); // 使用 push 方法添加键值对
                }
            } catch (error) {
                showNotification('处理 “商品信息” 时发生错误', 0);
                console.error("处理 goodsDict 时发生错误:", error);
            }

            console.log('getItemTable:', sortTable); // debug

            return sortTable;
        }

        async startSort() {
            this.initSortItem(); // 初始化排序信息
            AutoSortState = true; // 开启自动排序状态

            this.sortTable = await this.getItemTable(); // 更新商品信息

            for (let i = 0; i < this.sortTable.length; i++) {
                showNotification(`正在处理第 ${i + 1}/${this.sortTable.length} 个商品...`, 0);
                // 计算需要滚动的商品块个数
                let scrollNum = this.findCurrentSmallestNumber(this.sortedIndex) - this.lastMiniIndex;
                console.log('scrollNum:', scrollNum); // debug
                // itemPageScroll(itemBlockHeight * scrollNum); // 向下滚动
                this.lastMiniIndex = this.findCurrentSmallestNumber(this.sortedIndex); // 更新 lastMiniIndex
                console.log('lastMiniIndex:', this.lastMiniIndex); // debug

                // 获取将要执行的索引的商品块
                const index = findItemIdForArr(this.sortTable[i][0]); // 找到索引对应的商品块
                console.log('index:', index); // debug
                const weight = this.sortTable[i][1]; // 预设权重
                console.log('weight:', weight); // debug
                const preWeight = weight * 10;// 输入权重 (默认值 * 10)
                console.log('preWeight:', preWeight); // debug

                autoSortNum = preWeight.toString(); // 自动排序值

                click_autoInputForIndex(index); // 输入索引
                console.log('click_autoInputForIndex:', index); // debug
                this.sortedIndex.push(weight); // 记录已经排序的索引
                console.log('sortedIndex:', this.sortedIndex); // debug

                if (i + 1 >= this.sortTable.length) {
                    break;
                }

                await new Promise(resolve => setTimeout(resolve, 3000)); // 等待 3 秒
                console.log('等待 3 秒'); // debug
                await waitForPageToLoad(); // 等待页面加载完成
                console.log('等待页面加载完成'); // debug
                await new Promise(resolve => setTimeout(resolve, 1000)); // 继续等待 1 秒
                console.log('继续等待 1 秒'); // debug
            }

            console.log('排序完成！');
            showNotification('排序完成！');
            this.initSortItem(); // 重置排序信息
            AutoSortState = false; // 关闭自动排序状态

            const button = document.getElementById('itemSort_autoSort_divButton');
            if (button) {
                button.click(); // 点击按钮关闭自动排序
            }
        }
    }

    /*
    分词器加载
    */
    // 定义一个函数用于异步加载脚本并初始化分词器
    function initSegmentit(url) {
        // 动态加载脚本
        const loadScript = (url, callback) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = () => callback(null); // 使用 null 表示没有错误
            script.onerror = () => callback(new Error('Failed to load script: ' + url));
            document.head.appendChild(script);
        };

        // 加载脚本并初始化分词器
        loadScript(url, (err) => {
            if (err) {
                console.error(err.message);
                return;
            }

            // 确保页面完全加载后再执行脚本
            window.addEventListener('load', function () {
                // 检查 Segmentit 对象是否已定义
                if (typeof Segmentit === 'undefined') {
                    console.error('Segmentit is not defined. Please check if the library is loaded correctly.');
                } else {
                    console.log('Segmentit is loaded:', segmenter); // debug
                }
            });
        });
    }

    // 调用函数并传入 URL 和希望使用的全局变量名称
    initSegmentit('https://cdn.jsdelivr.net/npm/segmentit@2.0.3/dist/umd/segmentit.js');

    let debug_segmentit = false; // 是否开启分词器调试模式
    /*
    分词器加载完毕
    */
    const testText_1 = '珍珠粉黑灵芝紧致白面膜组合';
    const testText_2 = '1g+5g珍珠粉黑灵芝紧致白面膜组合';

    function segmentText(text, returnSentence = false) {
        // 实例化分词器
        const segmentit = Segmentit.useDefault(new Segmentit.Segment());
        // 获取分词后的对象
        const result = segmentit.doSegment(text);
        // 输出分词后的文本

        let sentence = ''; // 存储分词后的文本

        if (returnSentence) {
            // 返回分词后的句子
            sentence = result.map(item => item.w).join(' ');
        } else {
            // 返回分词后的数组
            sentence = result.map(item => item.w);
        }

        console.log(sentence);
        return sentence;
    }

    function calcSimilarity(title1, title2) {
        // 将分词结果转换为单词数组
        const wordArray1 = segmentText(title1);
        const wordArray2 = segmentText(title2);

        // 构建词汇表
        const vocabulary = new Set([...wordArray1, ...wordArray2]);
        const vocabArray = Array.from(vocabulary);

        // 构建向量
        function createVector(wordArray, vocabArray) {
            const vector = new Array(vocabArray.length).fill(0);
            for (let i = 0; i < wordArray.length; i++) {
                const index = vocabArray.indexOf(wordArray[i]);
                if (index !== -1) {
                    vector[index]++;
                }
            }
            return vector;
        }

        const vector1 = createVector(wordArray1, vocabArray);
        const vector2 = createVector(wordArray2, vocabArray);

        // 计算余弦相似度
        function cosineSimilarity(vec1, vec2) {
            let dotProduct = 0;
            let normA = 0;
            let normB = 0;

            for (let i = 0; i < vec1.length; i++) {
                dotProduct += vec1[i] * vec2[i];
                normA += vec1[i] * vec1[i];
                normB += vec2[i] * vec2[i];
            }

            if (normA === 0 || normB === 0) {
                return 0; // 防止除以零
            }

            return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
        }

        const similarity = cosineSimilarity(vector1, vector2);
        console.log('calcSimilarity:', similarity); // debug
        return similarity;
    }

    // 构建相似度矩阵
    function buildSimilarityMatrix(table1, table2) {
        const n = table1.length;
        const m = table2.length;
        const similarityMatrix = Array.from({ length: n }, () => Array(m).fill(0));

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                const shopSim = calcSimilarity(table1[i]['店铺名'], table2[j]['店铺名']);
                const titleSim = calcSimilarity(table1[i]['商品标题'], table2[j]['商品标题']);
                const totalSim = 0.35 * shopSim + 0.65 * titleSim;
                similarityMatrix[i][j] = totalSim;
            }
        }

        return similarityMatrix;
    }

    // 使用有序贪心算法进行匹配
    function matchItemsWithGreedy(table1, table2) {
        const similarityMatrix = buildSimilarityMatrix(table1, table2);
        const n = table1.length;
        const m = table2.length;
        const matches = [];
        const usedCols = new Set();

        for (let i = 0; i < n; i++) {
            let maxSim = -1;
            let bestCol = -1;

            for (let j = 0; j < m; j++) {
                if (usedCols.has(j)) continue;
                const sim = similarityMatrix[i][j];
                if (sim > maxSim) {
                    maxSim = sim;
                    bestCol = j;
                }
            }

            if (bestCol !== -1) {
                matches.push([i, bestCol]);
                usedCols.add(bestCol);
            }
        }

        return matches;
    }

    // 使用改进的匈牙利算法进行匹配
    function matchItemsWithHungarian(table1, table2) {
        const similarityMatrix = buildSimilarityMatrix(table1, table2);
        const n = table1.length;
        const m = table2.length;
        const costMatrix = similarityMatrix.map(row => row.map(val => -val)); // 转换为成本矩阵

        const labelX = new Array(n).fill(0);
        const labelY = new Array(m).fill(0);
        const match = new Array(m).fill(-1);
        const slack = new Array(m).fill(Number.MAX_SAFE_INTEGER);
        const visitedX = new Array(n).fill(false);
        const visitedY = new Array(m).fill(false);

        // 初始化标签
        for (let i = 0; i < n; i++) {
            labelX[i] = Math.max(...costMatrix[i]);
        }

        function findAugmentingPath(i) {
            visitedX[i] = true;
            for (let j = 0; j < m; j++) {
                if (visitedY[j]) continue;
                const delta = labelX[i] + labelY[j] - costMatrix[i][j];
                if (delta === 0) {
                    visitedY[j] = true;
                    if (match[j] === -1 || findAugmentingPath(match[j])) {
                        match[j] = i;
                        return true;
                    }
                } else {
                    slack[j] = Math.min(slack[j], delta);
                }
            }
            return false;
        }

        for (let i = 0; i < n; i++) {
            while (true) {
                slack.fill(Number.MAX_SAFE_INTEGER);
                visitedX.fill(false);
                visitedY.fill(false);
                if (findAugmentingPath(i)) break;
                let delta = Number.MAX_SAFE_INTEGER;
                for (let j = 0; j < m; j++) {
                    if (!visitedY[j]) delta = Math.min(delta, slack[j]);
                }
                for (let j = 0; j < n; j++) {
                    if (visitedX[j]) labelX[j] -= delta;
                }
                for (let j = 0; j < m; j++) {
                    if (visitedY[j]) labelY[j] += delta;
                }
            }
        }

        const matches = match.map((col, row) => [row, col]);
        return matches;
    }

    // 输出结果
    function printMatches(matches, table1, table2) {
        for (const [i, index] of matches) {
            const item1 = table1[i];
            const item2 = table2[index];
            const score = calcSimilarity(item1['商品标题'], item2['商品标题']);
            console.log(`[${i + 1}]表1商品: ${item1['商品标题']}\n表2位置: ${index + 1} (商品: ${item2['商品标题']}) [相似度: ${score.toFixed(2)}]`);
        }
    }

    function printIndex(matches) {
        const arr = matches.map(index => index[1] + 1);
        console.log("arrLen:", arr.length);
        console.log("arr:", arr);
        console.log("arr_no_dup:", new Set(arr).size);
        const arrCheck = [...new Set(arr)];
        console.log("arrCheck:", arrCheck.sort((a, b) => a - b));
    }

    // 测试数据
    const table1 = [
        { "商品标题": "水牛纯牛奶", "店铺名": "爱泡澡的水牛旗舰店" },
        { "商品标题": "红养豆浆粉", "店铺名": "九阳豆浆旗舰店" },
        { "商品标题": "芙丝天然矿泉水", "店铺名": "华彬旗舰店" },
        { "商品标题": "正宗天马老树陈皮", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "初心肉桂大红袍组合", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "茗潮宋礼礼盒", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "铁观音 乌龙茶", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "2015年白毫银针", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "五彩罐岩茶组合", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "武夷山正山小种", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "茉莉花茶", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "碧螺春", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "鸿运金骏眉礼盒", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "针王 白茶", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "正坑牛肉 乌龙茶", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "首字号茶礼 乌龙茶", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "桐木关老枞 红茶礼盒", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "吮指鸡肉条", "店铺名": "牧匠食品旗舰店" },
        { "商品标题": "法丽兹黄油小花曲奇173g*2罐", "店铺名": "法丽兹食品旗舰店" },
        { "商品标题": "芡实糕", "店铺名": "杨先生旗舰店" },
        { "商品标题": "捞汁豆腐", "店铺名": "杨生记食品旗舰店" },
        { "商品标题": "茶香师禅茶系列香水", "店铺名": "茶香师旗舰店" },
        { "商品标题": "宝玑米手甲同护护手霜", "店铺名": "puljim宝玑米旗舰店" },
        { "商品标题": "原制奶酪饼", "店铺名": "潮香村食品旗舰店" },
        { "商品标题": "春雪流心鸡球", "店铺名": "春雪食品旗舰店" },
        { "商品标题": " 网红糯米笋", "店铺名": "蔚鲜来旗舰店" },
        { "商品标题": "羊肚菌", "店铺名": "瑞利来旗舰店" },
        { "商品标题": "大罐粥料", "店铺名": "瑞利来旗舰店" },
        { "商品标题": "新会柑普茶", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "桂花金骏眉", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "金丝鸡排", "店铺名": "正新食品旗舰店" },
        { "商品标题": "酱牛肉", "店铺名": "阿品旗舰店" },
        { "商品标题": "茶和天下", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "丹东99草莓", "店铺名": "时予心愿旗舰店" },
        { "商品标题": "海乡集即食海参", "店铺名": "海乡集旗舰店" },
        { "商品标题": "果乐果香夹心饼干", "店铺名": "嘉士利旗舰店" },
        { "商品标题": "多味香瓜子", "店铺名": "华味亨旗舰店" },
        { "商品标题": "酥小娘核桃布里奥斯面包", "店铺名": "酥小娘旗舰店" },
        { "商品标题": "芋泥乳酪派", "店铺名": "lilygarden荷家旗舰店" },
        { "商品标题": "魔芋荞麦鸡肉膳食包+魔芋韭菜鸡蛋膳食包", "店铺名": "巨诺旗舰店" },
        { "商品标题": "智利进口车厘子", "店铺名": "淘宝买菜农场直发" },
        { "商品标题": "寿南瓜子", "店铺名": "苏太太食品旗舰店" },
        { "商品标题": "石浪电陶炉+枫梭提梁壶围炉套装", "店铺名": "唐丰旗舰店" },
        { "商品标题": "玺棠一体茶盘+素影煮茶壶+圆满素语西施壶9头", "店铺名": "唐丰旗舰店" },
        { "商品标题": "纯钛茶水分离杯", "店铺名": "天猫超市" },
        { "商品标题": "老卤鸭肫", "店铺名": "旺家福旗舰店" },
        { "商品标题": "夏威夷果可可脆", "店铺名": "菓然匠子旗舰店" },
        { "商品标题": "2014荒野贡眉", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "风干牛肉干九成干", "店铺名": "蒙亮旗舰店" },
        { "商品标题": "农家乌鸡950g*3", "店铺名": "淘宝买菜农场直发" },
        { "商品标题": "潮庭优选牛肉丸牛筋丸双拼组合", "店铺名": "潮庭旗舰店" },
        { "商品标题": "早餐牛肉饼", "店铺名": "潮迹旗舰店" },
        { "商品标题": "围炉煮茶器具全套", "店铺名": "尚言坊旗舰店" },
        { "商品标题": "点心盘", "店铺名": "拓土旗舰店" },
    ];

    const table2 = [
        { "商品标题": "苏太太百寿南瓜子", "店铺名": "苏太太食品旗舰店" },
        { "商品标题": "捞汁豆腐", "店铺名": "杨生记食品旗舰店" },
        { "商品标题": "芡实糕多口味组合", "店铺名": "杨先生旗舰店" },
        { "商品标题": "法丽兹黄油小花曲奇", "店铺名": "法丽兹食品旗舰店" },
        { "商品标题": "水牛纯牛奶", "店铺名": "爱泡澡的水牛旗舰店" },
        { "商品标题": "魔芋荞麦鸡肉膳食包+魔芋韭菜鸡蛋膳食包", "店铺名": "巨诺旗舰店" },
        { "商品标题": "九阳豆浆红养豆浆粉", "店铺名": "九阳豆浆旗舰店" },
        { "商品标题": "陈皮绿豆百合银耳粥1.308kg*1罐/陈皮红豆粥1.010kg*1罐/1.5kg/罐/干贝虾仁粥1.1kg/罐/紫薯黑米粥1.48kg/罐", "店铺名": "瑞利来旗舰店" },
        { "商品标题": "酥小娘核桃布里奥斯面包", "店铺名": "酥小娘旗舰店" },
        { "商品标题": "夏威夷果可可脆", "店铺名": "菓然匠子旗舰店" },
        { "商品标题": "果乐果香夹心饼干", "店铺名": "嘉士利旗舰店" },
        { "商品标题": "芋泥乳酪派", "店铺名": "lilygarden荷家旗舰店" },
        { "商品标题": "打手瓜子", "店铺名": "华味亨旗舰店" },
        { "商品标题": "旺家福老卤鸭肫", "店铺名": "旺家福旗舰店" },
        { "商品标题": "茶香师禅茶系列香水 和合之境 早春之茶 正如初念", "店铺名": "茶香师旗舰店" },
        { "商品标题": "宝玑米微氛手甲精华霜囤货装", "店铺名": "puljim宝玑米旗舰店" },
        { "商品标题": "【王炸】车厘子   官补115", "店铺名": "淘宝买菜农场直发" },
        { "商品标题": "丹东99草莓", "店铺名": "时予心愿旗舰店" },
        { "商品标题": "吮指鸡肉条", "店铺名": "牧匠食品旗舰店" },
        { "商品标题": "风干牛肉干九成干", "店铺名": "蒙亮旗舰店" },
        { "商品标题": "围炉煮茶", "店铺名": "唐丰旗舰店" },
        { "商品标题": "特美刻茶水分离杯   补贴50", "店铺名": "" },
        { "商品标题": "茶和天下品鉴装", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "初心组合  补贴30", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "【王炸】天马陈皮220g  补贴50", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "新会柑普茶", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "鸿运金骏眉礼盒   补贴50", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "桐木关老枞红茶礼盒  补贴20", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "【王炸】2015年老银针", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "正坑牛肉/正坑牛肉礼盒装   补贴100", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "2014年荒野贡眉   补贴15", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "茗潮宋礼  补贴20", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "针王  补贴50", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "茉莉花茶", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "桂花金骏眉", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "茶具套装", "店铺名": "唐丰旗舰店" },
        { "商品标题": "五彩罐岩茶组合  补贴30", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "武夷山正山小种", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "首字号茶礼512g  补贴30", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "铁观音", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "碧螺春", "店铺名": "望峰茶叶旗舰店" },
        { "商品标题": "VOSS/芙丝天然矿泉水", "店铺名": "华彬旗舰店" },
        { "商品标题": "条纹月笼壶", "店铺名": "尚言坊" },
        { "商品标题": "海乡集大连即食海参  补贴25", "店铺名": "海乡集旗舰店" },
        { "商品标题": "潮庭优选双拼牛丸组合", "店铺名": "潮庭旗舰店" },
        { "商品标题": "农家散养乌鸡", "店铺名": "淘宝买菜" },
        { "商品标题": "瑞利来羊肚菌", "店铺名": "瑞利来旗舰店" },
        { "商品标题": "流心鸡球400g", "店铺名": "春雪食品旗舰店" },
        { "商品标题": "奶酪饼", "店铺名": "潮香村食品旗舰店" },
        { "商品标题": "网红糯米笋", "店铺名": "蔚鲜来旗舰店" },
        { "商品标题": "正新金丝鸡排", "店铺名": "正新食品旗舰店" },
        { "商品标题": "阿品酱牛肉", "店铺名": "阿品旗舰店" },
    ];

    // setTimeout(() => {
    //     // calcSimilarity(testText_1, testText_2);
    //     console.log('开始匹配商品...');
    //     // const matches = matchItemsWithGreedy(table1, table2);
    //     const matches = matchItemsWithHungarian(table1, table2);
    //     printMatches(matches, table1, table2);
    //     printIndex(matches);
    // }, 10000);
})();