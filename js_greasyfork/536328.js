// ==UserScript==
// @name         虚拟地理位置
// @namespace    https://github.com/LaLa-HaHa-Hei/
// @version      1.2.2
// @description  自定义浏览器中的地理位置
// @author       代码见三
// @license      GPL-3.0-or-later
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/536328/%E8%99%9A%E6%8B%9F%E5%9C%B0%E7%90%86%E4%BD%8D%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/536328/%E8%99%9A%E6%8B%9F%E5%9C%B0%E7%90%86%E4%BD%8D%E7%BD%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('运行了 Virtual Geographic Location');

    class FloatingButton {
        // HTML 元素
        menu = null;
        button = null;
        menuVisible = false;
        // 拖动相关
        isDragging = false;
        isClick = false;
        offsetY = 0;
        // 数据
        autoVirtual = false;
        getSetValueFunction = null;
        originalGetCurrentPosition = window.navigator.geolocation.getCurrentPosition
        accuracy = 20000
        latitude = 39.906217 // 纬度
        longitude = 116.3912757 // 经度

        constructor(accuracy, latitude, longitude, autoVirtual = false, enableJsIframeInjection = false, getSetValueFunction = null) {
            if (document.body && document.body.getAttribute("vgl-injected-main")) {
                console.log("vgl已经在此frame运行过");
                return;
            }
            if (document.body) {
                document.body.setAttribute("vgl-injected-main", "true");
            }

            this.accuracy = accuracy
            this.latitude = latitude
            this.longitude = longitude
            this.autoVirtual = autoVirtual
            this.getSetValueFunction = getSetValueFunction

            const containerElement = this.injectHTML()
            this.injectCSS()

            this.button = containerElement.querySelector('#vgl-floating-button')
            this.menu = containerElement.querySelector('#vgl-menu')

            this.injectToJsframes = this.injectJsframes.bind(this)
            this.startVirtual = this.startVirtual.bind(this);
            this.stopVirtual = this.stopVirtual.bind(this);

            this.showMenu = this.showMenu.bind(this);
            this.hideMenu = this.hideMenu.bind(this);
            this.handleClickOutside = this.handleClickOutside.bind(this);
            this.handleDragStart = this.handleDragStart.bind(this);
            this.handleDragMove = this.handleDragMove.bind(this);
            this.handleDragEnd = this.handleDragEnd.bind(this);

            this.bindDragEvents()
            this.bindListeners()

            if (autoVirtual)
                this.startVirtual()

            // 防止被覆盖，重新注入，每2秒检测一次，
            const preventCoveredInterval = setInterval(() => {
                if (!document.querySelector('#vgl-html')) {
                    console.log('检测到UI被移除，重新注入...');
                    const containerElement = this.injectHTML()
                    this.button = containerElement.querySelector('#vgl-floating-button')
                    this.menu = containerElement.querySelector('#vgl-menu')
                    if (autoVirtual)
                        this.startVirtual()
                }
                if (!document.querySelector('style#vgl-style')) {
                    console.log('选择样式被移除，重新注入...');
                    this.injectCSS();
                }
            }, 2 * 1000)
            setTimeout(() => clearInterval(preventCoveredInterval), 10 * 1000); // 监听10秒后不再防止覆盖

            // 注入所有js写入的iframe，带有src的ifrmae用match匹配
            if (enableJsIframeInjection) {
                this.injectJsframes()
                setInterval(this.injectJsframes, 2 * 1000)
            }
        }

        getValue(key, defaultValue) {
            if (this.getSetValueFunction && this.getSetValueFunction.getValue) {
                return this.getSetValueFunction.getValue(key, defaultValue)
            }
        }

        setValue(key, value) {
            if (this.getSetValueFunction && this.getSetValueFunction.setValue) {
                this.getSetValueFunction.setValue(key, value)
            }
        }

        injectJsframes() {
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                try {
                    const doc = iframe.contentDocument || iframe.contentWindow.document;
                    if (!doc)
                        return;

                    // 避免重复注入
                    if (doc.body && doc.body.getAttribute("vgl-injected"))
                        return;

                    // 注入 vgl()
                    const script = doc.createElement('script');
                    script.type = 'text/javascript';
                    // 只深入一层iframe，因为一般只有一层
                    script.textContent = `
                            (function(){
                                var FloatingButton = ${FloatingButton.toString()};
                                new FloatingButton( ${this.accuracy}, ${this.latitude}, ${this.longitude}, ${this.autoVirtual}, false, null);
                            })()
                        `
                    doc.head.appendChild(script);
                    doc.body.setAttribute("vgl-injected", "true");
                    // console.log("已注入 iframe：", iframe);
                    console.log("已注入 iframe");
                } catch (e) {
                    console.warn("无法注入 iframe（可能是跨域）：", e);
                }
            })
        }

        startVirtual() {
            this.accuracy = parseFloat(this.menu.querySelector('#vgl-accuracy-input').value)
            this.latitude = parseFloat(this.menu.querySelector('#vgl-latitude-input').value)
            this.longitude = parseFloat(this.menu.querySelector('#vgl-longitude-input').value)
            this.setValue("vgl-accuracy", this.accuracy)
            this.setValue("vgl-latitude", this.latitude)
            this.setValue("vgl-longitude", this.longitude)
            window.navigator.geolocation.getCurrentPosition = (successCallback, errorCallback, options) => {
                const fakePosition = {
                    coords: {
                        accuracy: parseFloat(this.accuracy),
                        altitude: null,
                        altitudeAccuracy: null,
                        latitude: parseFloat(this.latitude),
                        longitude: parseFloat(this.longitude),
                        heading: null,
                        speed: null,
                    },
                    timestamp: Date.now(),
                }
                if (successCallback) {
                    successCallback(fakePosition);
                }
            }
        }

        stopVirtual() {
            window.navigator.geolocation.getCurrentPosition = this.originalGetCurrentPosition
        }

        bindListeners() {
            this.menu.querySelector('#vgl-confirm-button').addEventListener('click', () => {
                this.hideMenu()
                this.startVirtual()
            })
            this.menu.querySelector('#vgl-restore-button').addEventListener('click', () => {
                this.hideMenu()
                this.stopVirtual()
            })
        }

        bindDragEvents() {
            // 电脑端
            document.addEventListener('mousedown', this.handleClickOutside);
            this.button.addEventListener('mousedown', this.handleDragStart);
            document.addEventListener('mousemove', this.handleDragMove);
            document.addEventListener('mouseup', this.handleDragEnd);
            // 手机端
            document.addEventListener('touchstart', this.handleClickOutside, { passive: true });
            this.button.addEventListener("touchstart", this.handleDragStart);
            document.addEventListener("touchmove", this.handleDragMove);
            document.addEventListener("touchend", this.handleDragEnd);
        }

        // 注入按钮和菜单
        injectHTML() {
            const injectedHTML = `
                <button id="vgl-floating-button">虚拟位置</button>
                <div id="vgl-menu">
                    <div class="vgl-menu-line">
                        <label for="vgl-accuracy-input">精度：</label>
                        <input type="number" id="vgl-accuracy-input" step="0.1" value="${this.accuracy}" />
                    </div>
                    <div class="vgl-menu-line">
                        <label for="vgl-latitude-input">纬度：</label>
                        <input type="number" id="vgl-latitude-input" step="0.1" value="${this.latitude}" />
                    </div>
                    <div class="vgl-menu-line">
                        <label for="vgl-longitude-input">经度：</label>
                        <input type="number" id="vgl-longitude-input" step="0.1" value="${this.longitude}" />
                    </div>
                    <div class="vgl-menu-line">
                        <button id="vgl-confirm-button">确定修改</button>
                        <button id="vgl-restore-button">取消虚拟</button>
                    </div>
                </div>
            `
            const divElement = document.createElement('div')
            divElement.innerHTML = injectedHTML
            divElement.id = 'vgl-html'
            document.body.appendChild(divElement)
            return divElement
        }

        // 注入css
        injectCSS() {
            const injectedCSS = `
                #vgl-floating-button {
                    position: fixed;
                    left: 0;
                    top: 42%;
                    z-index: 9999;
                    background: #007bff;
                    color: #fff;
                    border: none;
                    border-radius: 0 20px 20px 0;
                    padding: 6px 14px;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                    user-select: none;
                    transition: background 0.2s;
                }

                #vgl-floating-button:active {
                    background: #0056b3;
                }

                #vgl-menu {
                    display: none;
                    position: fixed;
                    left: 60px;
                    top: 40%;
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                    padding: 8px 0;
                    z-index: 10000;
                }

                .vgl-menu-line {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 8px 16px;
                }

                .vgl-menu-line button {
                    margin: 0 5px;
                }

                .vgl-menu-line input {
                    max-width: 180px;
                    box-sizing: border-box;
                }
            `
            const styleElement = document.createElement('style')
            styleElement.textContent = injectedCSS
            styleElement.id = 'vgl-style'
            document.head.appendChild(styleElement)
        }

        showMenu() {
            const rect = this.button.getBoundingClientRect();
            this.menu.style.top = rect.top + 'px';
            this.menu.style.display = 'block';
            this.menuVisible = true;
        }
        hideMenu() {
            this.menu.style.display = 'none';
            this.menuVisible = false;
        }
        handleClickOutside(event) {
            if (!this.button.contains(event.target) && !this.menu.contains(event.target) && this.menuVisible)
                this.hideMenu()
        }
        handleDragStart(event) {
            this.isDragging = true;
            this.isClick = true;
            this.offsetY = (event.clientY || event.touches[0].clientY) - this.button.getBoundingClientRect().top;
            if (this.menuVisible)
                this.hideMenu();
            event.preventDefault();
        }
        handleDragMove(event) {
            if (this.isDragging) {
                this.isClick = false;
                let newTop = (event.clientY || event.touches[0].clientY) - this.offsetY;
                this.button.style.top = newTop + 'px';
                event.preventDefault();
            }
        }
        handleDragEnd(event) {
            this.isDragging = false;
            if (this.isClick)
                this.showMenu();
            this.isClick = false;
        }
    }


    let autoVirtual = GM_getValue("vgl-autoVirtual", false) // 打开页面后自动开启虚拟位置
    let enableJsIframeInjection = GM_getValue("vgl-enableJsIframeInjection", false) // 打开页面后自动开启虚拟位置

    let id1 = GM_registerMenuCommand(
        "自动开始虚拟：" + (autoVirtual === true ? "已开" : "未开"),
        menu1Click,
        "a");
    function menu1Click() {
        GM_unregisterMenuCommand(id1)
        autoVirtual = !autoVirtual
        GM_setValue("vgl-autoVirtual", autoVirtual)

        id1 = GM_registerMenuCommand(
            "自动开始虚拟：" + (autoVirtual === true ? "已开" : "未开"),
            menu1Click,
            "a");
    }

    let id2 = GM_registerMenuCommand(
        "包括js写入的iframe：" + (enableJsIframeInjection === true ? "已开" : "未开"),
        menu2Click,
        "i");
    function menu2Click() {
        GM_unregisterMenuCommand(id2)
        enableJsIframeInjection = !enableJsIframeInjection
        GM_setValue("vgl-enableJsIframeInjection", enableJsIframeInjection)

        id2 = GM_registerMenuCommand(
            "包括js写入的iframe：" + (enableJsIframeInjection === true ? "已开" : "未开"),
            menu2Click,
            "i");
    }

    new FloatingButton(
        GM_getValue("vgl-accuracy", 20000),
        GM_getValue("vgl-latitude", 39.906217),
        GM_getValue("vgl-longitude", 116.3912757),
        autoVirtual,
        enableJsIframeInjection,
        {
            getValue: GM_getValue,
            setValue: GM_setValue,
        })
})();