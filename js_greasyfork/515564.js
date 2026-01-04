// ==UserScript==
// @name         link工具Lite
// @namespace    http://tampermonkey.net/
// @version      1.2.1
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
// @downloadURL https://update.greasyfork.org/scripts/515564/link%E5%B7%A5%E5%85%B7Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/515564/link%E5%B7%A5%E5%85%B7Lite.meta.js
// ==/UserScript==

(function () {
    // 版本号
    var versionTitleTxt = 'Lite Version 1.2.1';

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
    // 添加手卡截图开关控件
    const tableCardPngSwitchContainer = new ToggleButtonComponent('tableCardPngSwitchState', '快捷截图', dropdownContent,);
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

    // 快捷截图子功能区域
    const main_tableCardPngSwitch = tableCardPngSwitchContainer.getSecondaryContent();
    const sonMain_tableCardPngSwitch = new SonToggleButtonComponent('main_tableCardPngSwitch', '手卡截图', main_tableCardPngSwitch, "截取当前页面的手卡并添加到剪切板", 1);
    const tableCardPng_resolution = new SonToggleButtonComponent('mainTableCardPng_resolution', '清晰度', sonMain_tableCardPngSwitch.getChildSettingsContainer(), "设置截图的清晰度\n\n注意：更低的清晰度并不能提高截图的响应速度", 1);
    const tableCardPng_resolution_select = ['普通', '高清', '超清'];
    tableCardPng_resolution.createSelectBox(tableCardPng_resolution_select);
    const tableCardPng_checkItemIdRow = new SonToggleButtonComponent('tableCardPng_checkItemIdRow', '上播ID核对', sonMain_tableCardPngSwitch.getChildSettingsContainer(), "截图时在手卡中添一行“上播ID”，以便核对是否正确", 1);
    const tableCardPng_checkItemIdRow_onlyPng = new SonToggleButtonComponent('tableCardPng_checkItemIdRow_onlyPng', '仅截图时显示', tableCardPng_checkItemIdRow.getChildSettingsContainer(), "开启后仅在截图时会含有“上播id核对行”", 1);

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
        document.body.removeChild(NotificationContainer);
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

        function captureMode_forRow(index, mode = 'session', isShowTableCheckedRow = true){
            var sessionRow = [1, 2]; // 只显示行号
            var selectRow = [1, 2, 3, 4, 5]; // 只显示行号

            if (isShowTableCheckedRow) {
                selectRow = selectRow.map(row => row > 2 ? row + 1 : row);
            }

            if (mode ==='session') {
                return !sessionRow.includes(index);
            }

            if (mode ==='select') {
                return !selectRow.includes(index);
            }
        }

        function toggleAfterPseudoElement(show) {
            // 创建一个新的样式标签
            const style = document.createElement('style');
        
            // 根据传入的参数定义样式规则
            if (show) {
                style.innerHTML = `
                    tr.link-mce-break-page::after {
                        display: block !important; /* 或者其他默认显示的样式 */
                    }
                `;
            } else {
                style.innerHTML = `
                    tr.link-mce-break-page::after {
                        display: none !important;
                    }
                `;
            }
        
            // 将样式标签添加到文档的 head 中
            document.head.appendChild(style);
        
            // 清除之前的样式规则
            const existingStyles = document.querySelectorAll('style[data-toggle-after]');
            existingStyles.forEach(el => el.remove());
        
            // 给新添加的样式标签打上标记，以便后续清除
            style.setAttribute('data-toggle-after', '');
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
                    toggleAfterPseudoElement(false);

                    // 隐藏除第二行和第三行外的所有行
                    rows.forEach((row, index) => {
                        if (captureMode_forRow(index, 'select')) {
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

                                    toggleAfterPseudoElement(true);

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

    noneDrawColor();

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
                        showNotification("着色成功", 5000);
                        break;
                    case 'svg-icon-skuDesc':
                        activateIframeAndModifyStyles('skuDesc');
                        showNotification("着色成功", 5000);
                        break;
                    case 'svg-icon-livePrice':
                        activateIframeAndModifyStyles('livePrice');

                        // 判断“预售信息”，辅助自动输入定金尾款时间
                        if (check_isHavePreSaleContent()) {
                            buttonClickForAddPreSaleTime();
                        }

                        showNotification("着色成功", 5000);
                        break;
                    case 'svg-icon-liveGameplay':
                        activateIframeAndModifyStyles('liveGameplay');

                        showNotification("着色成功", 5000);
                        break;
                    case 'svg-icon-preSetInventory':
                        activateIframeAndModifyStyles('preSetInventory');

                        showNotification("着色成功", 5000);
                        break;
                    case 'svg-icon-inventory':
                        activateIframeAndModifyStyles('inventory');

                        showNotification("着色成功", 5000);
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

        if(topHeader){
            for (var i = 0; i < topHeader_item.length; i++) {
                if (getUseHref(topHeader_item[i]) !== '#link-file-download-line') {
                    topHeader_item[i].style.display = isShow;
                }
            }
        } else {
            // console.log('顶部header元素不存在');
        }
    }

    // 纯净模式函数
    function pureMode(isActivated) {
        var isShow = isActivated ? 'none' : '';
        var targetHeight = document.documentElement.scrollHeight - 238;

        hide_link_helpMenu(isActivated); // 隐藏帮助菜单

        hide_link_leftSiderMenu(isActivated); // 隐藏左侧菜单

        hide_link_topBarMenu(isActivated); // 隐藏顶部菜单

        // 直播场次日期切换菜单
        const liveDay_selectMenu = document.querySelector('.flex.justify-between.pb-12');
        // 直播场次总览
        const liveOverview_table = document.querySelector('.link-session-board-pai___eddtw').parentElement;

        const otherElements = document.querySelector('.ag-body-horizontal-scroll-viewport');

        // 底部多余栏目
        const bottomExtra_div = document.querySelector('.ag-grid-sticky-scroll');
        bottomExtra_div.style.display = isShow;

        // 设置元素的显示状态
        liveDay_selectMenu.style.display = isShow;
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
})();