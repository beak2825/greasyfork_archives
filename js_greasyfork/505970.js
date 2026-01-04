// ==UserScript==
// @name         Hello-PE
// @namespace    https://lmao.lol
// @version      1.0.0
// @description  你好, 口袋刷题
// @author       Libws
// @match        *://cdn.jbea.cn/*
// @icon         https://cdn.jbea.cn/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @resource     https://npm.onmicrosoft.cn/@sweetalert2/themes@latest/material-ui/material-ui.scss
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @license      AGPL-3.0 License
// @run-at       document-start
// @supportURL   https://github.com/Hello-PE/TampermonkeyScript
// @downloadURL https://update.greasyfork.org/scripts/505970/Hello-PE.user.js
// @updateURL https://update.greasyfork.org/scripts/505970/Hello-PE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /**
     * 版权信息
     * @type {{author: string, name: string, version: string}}
     */
    const copyRight = {
        name: 'Hello-PE',
        version: '1.0.0',
        author: 'Libws',
    };

    /**
     * 定义bws对象
     * @type {{uw: *, sv: *, nb: Window, nt: *, rmc: *, umc: *, oit: *, gv: *}}
     */
    const bws = {
        nb: window,
        uw: unsafeWindow,
        rmc: GM_registerMenuCommand,
        umc: GM_unregisterMenuCommand,
        oit: GM_openInTab,
        gv: GM_getValue,
        sv: GM_setValue,
        na: GM_notification,
    };

    /**
     * 骚话xd
     */
    bws.nb.console.log(`%c“人们常常仰视英雄的光芒与伟业，却鲜有人探寻他们背后的痛楚与泪痕”\r\n%c  _   _          _   _                   ____    _____ \r\n | | | |   ___  | | | |   ___           |  _ \\  | ____|\r\n | |_| |  / _ \\ | | | |  / _ \\   _____  | |_) | |  _|  \r\n |  _  | |  __/ | | | | | (_) | |_____| |  __/  | |___ \r\n |_| |_|  \\___| |_| |_|  \\___/          |_|     |_____|\r\n                                                       \r\n%c欢迎使用: ${copyRight.name}\r\n当前版本: ${copyRight.version}\r\n程序作者: ${copyRight.author}`, 'font-size: 20px;font-weight: bold;color: #14539a;', 'color: rgb(' + getRandomNumber(0, 255) + ',' + getRandomNumber(0, 255) + ',' + getRandomNumber(0, 255) + ');', 'color: #568de5;');

    /**
     * 消息框
     */
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        'didOpen': (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        },
    });

    /**
     * 随机数
     * @param min - 最小值
     * @param max - 最大值
     * @returns {number} - 返回随机数
     */
    function getRandomNumber (min, max) {
        // 如果没有提供参数，则默认生成0到一个非常大的数之间的随机数
        if (min === undefined && max === undefined) {
            return bws.nb.Math.random() * Number.MAX_SAFE_INTEGER;
        }
        // 如果只提供一个参数，则认为是最大值，最小值默认为0
        if (max === undefined) {
            max = min;
            min = 0;
        }
        // 生成min到max之间的随机数
        return bws.nb.Math.random() * (max - min) + min;
    }

    /**
     * 等待函数
     * @param ms - 以毫秒为单位
     * @returns {Promise<unknown>}
     */
    function sleep (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 消息前缀
     * @param msg - 要承载的信息
     */
    const log = function (msg) {
        bws.nb.console.log('%c[Hello-PE] %c' + msg, 'color: rgb(0,103,184)', '');
    };

    /**
     * 计算HMAC SHA512签名
     * @param secret - 密钥
     * @param message - 数据
     * @returns {Promise<string>} - 十六进制哈希
     */
    async function generateHMAC (secret, message) {
        const encoder = new TextEncoder();
        const keyData = encoder.encode(secret);
        const messageData = encoder.encode(message);

        const cryptoKey = await bws.nb.crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-512' },
            false,
            ['sign'],
        );

        const signature = await bws.nb.crypto.subtle.sign('HMAC', cryptoKey, messageData);
        return bws.nb.Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * 根据参数计算答案
     */
    function calculationOptions (answer, i) {
        const option = answer.split(',')[i];
        let index;
        switch (option) {
            case 'A':
                index = 0;
                break;
            case 'B':
                index = 1;
                break;
            case 'C':
                index = 2;
                break;
            case 'D':
                index = 3;
                break;
            default:
                index = null;
        }
        return index;
    }

    /**
     * 连接器
     * @param mod - 功能
     * @param data - 载荷
     * @returns {Promise<any>} - 一般是Json格式
     */
    async function connections (mod, data) {
        // 初始化
        const websocket = new bws.nb.WebSocket('ws://localhost:54188/' + mod);
        let answer = null,
            waitAnswer = true,
            waitNum = 0;
        websocket.onopen = function () {
            websocket.send(data);
            log('已连接到WebSocket服务器, 并发送消息');
        };
        websocket.onmessage = function (event) {
            answer = bws.nb.atob(event.data);
            log('接收到消息: ' + event.data);
        };
        websocket.onclose = function () {
            log('WebSocket连接已关闭');
        };
        websocket.onerror = function (error) {
            waitNum = -1;
            if (!getMenuValue('menu_trueSecret')) {
                Toast.fire({
                    icon: 'warning',
                    title: 'WebSocket连接/交互时出错⚠️',
                });
            }
            bws.nb.console.warn('WebSocket连接/交互时出错\r\n' + error);
        };
        while (waitAnswer) {
            if (answer) {
                waitAnswer = false;
                websocket.send('stop');
                return answer;
            } else if (waitNum > 5 || waitNum === -1) {
                log('WebSocket处理超时, 已强制关闭连接');
                websocket.close();
                return 'error';
            }
            await sleep(1000);
            waitNum++;
        }
    }

    /**
     * 油猴菜单列表
     */
    const menuAll = [
        ['menu_fixAll', '修复所有修改', '可以正常选中文本和使用按键功能等', true],
        ['menu_noAutomaticFullScreen', '移除自动全屏', '做题时不会自动全屏', true],
        ['menu_noClearSelect', '移除清空选中', '做题时可以选中文本', true],
        ['menu_noMouseCheck', '移除鼠标检查', '做题时可以随意移动鼠标', true],
        ['menu_noAutocommit', '移除自动提交', '无操作240秒后不再自动提交', true],
        ['menu_noDebugger', '移除控制台无限调试', '打开调试工具不会卡无限调试', true],
        ['menu_noWindowCheck', '移除窗口检查', '可以随意改变窗口大小', true],
        ['menu_no163ico', '移除网易图标加载', '丢失断网检测', false],
        ['menu_autoCaptureExamInform', '自动捕获题目信息', '拿到题目信息并复制到剪切板', false],
        ['menu_shortcutKey', '快捷键', '字面意思', false],
        ['menu_trueSecret', '真·隐秘模式', '懂得都懂', false],
        ['menu_experimentalFeatures', '实验性功能', '字面意思', false],
    ], menuID = [];
    // 初始化菜单状态
    menuAll.forEach(menu => {
        if (bws.gv(menu[0]) == null) {
            bws.sv(menu[0], menu[3]);
        }
    });
    registerMenu();

    function registerMenu () {
        // 卸载所有菜单
        if (menuID.length > menuAll.length) {
            menuID.forEach(id => {
                bws.umc(id);
            });
        }
        // 重新注册菜单
        menuAll.forEach((menu, i) => {
            menu[3] = bws.gv(menu[0]);
            menuID[i] = bws.rmc(`${menu[3] ? '✅' : '🔲'} ${menu[1]}`, function () {
                menuSwitch(menu[3], menu[0], menu[2]);
            });
        });
        menuID.push(bws.rmc('🤗 MyGayhubPage', function () {
            bws.oit('https://github.com/Hello-PE/TampermonkeyScript', {
                active: true,
                insert: true,
                setParent: true,
            });
        }));
    }

    function menuSwitch (menuStatus, name, tips) {
        bws.sv(name, !menuStatus);
        // 对部分功能进行重载页面提示
        const names = [
            'menu_fixAll',
            'menu_noMouseCheck',
            'menu_noAutocommit',
            'menu_noWindowCheck',
            'menu_no163ico',
            'menu_experimentalFeatures',
        ];
        if (names.includes(name)) {
            Toast.fire({
                icon: 'warning',
                title: `已修改:\r\n${name}[${tips}]\r\n(需要点击刷新网页后生效)`,
            });
            bws.na({
                text: `已修改:\r\n${name}[${tips}]\r\n(需要点击刷新网页后生效)`,
                title: 'Hello-PE',
                timeout: 6000,
                'onclick': () => {
                    location.reload();
                },
            });
        }
        log(`已修改: ${name}[${tips}]`);
        registerMenu();
    }

    function getMenuValue (menuName) {
        const menu = menuAll.find(menu => menu[0] === menuName);
        return menu ? menu[3] : undefined;
    }

    try {
        // 开始耗时计时
        let startTime = bws.nb.performance.now();

        /**
         * 初始化部分变量
         */
        let isOnload = false,
            examEncData = '';

        /**
         * 反钩子检测
         */
        (() => {
            const $toString = bws.uw.Function.toString;
            const myFunction_toString_symbol = bws.uw.Symbol('('.concat('', ')_', (bws.nb.Math.random()) + '').toString());
            const myToString = function () {
                // 如果是函数并且具有自定义toString属性，则返回该属性值，否则返回原生toString()结果
                return typeof this === 'function' && this[myFunction_toString_symbol] || $toString.call(this);
            };

            // 封装设置对象属性的函数
            function set_native (func, key, value) {
                Object.defineProperty(func, key, {
                    enumerable: false,
                    configurable: true,
                    writable: true,
                    value: value,
                });
            }

            delete bws.uw.Function.prototype.toString;
            set_native(bws.uw.Function.prototype, 'toString', myToString);
            set_native(bws.uw.Function.prototype.toString, myFunction_toString_symbol, 'function toString() { [native code] }');
            globalThis.hookFix = (func, functionName) => {
                // 设置指定函数的自定义toString属性
                set_native(func, myFunction_toString_symbol, `function ${functionName || ''}() { [native code] }`);
            };
        }).call(this);

        /**
         * 阻止构造器debugger执行
         * @type {(function(*): (null|*))|*}
         */
        const originalConstructor = bws.uw.Function.prototype.constructor;
        // 发现构造器内为debugger则不执行
        bws.uw.Function.prototype.constructor = function (firstArg) {
            if (firstArg === 'debugger' && getMenuValue('menu_noDebugger')) {
                return null;
            }
            return originalConstructor.apply(this, arguments);
        };
        hookFix(bws.uw.Function.prototype.constructor, 'Function');

        /**
         * 阻止特定图像加载
         * @type {function(): *}
         */
        const originalImage = bws.uw.Image;
        // 获取原始 image 实例的 src 属性的设置器并重新定义
        bws.uw.Image = function () {
            const img = new originalImage();
            const { set: originalSrcSetter } = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(img), 'src');
            Object.defineProperty(img, 'src', {
                set (value) {
                    const url = new URL(value);
                    if (url.origin === 'https://www.163.com'
                        && url.pathname === '/favicon.ico'
                        && getMenuValue('menu_no163ico')) {
                        return null;
                    }
                    originalSrcSetter.call(this, value);
                },
            });
            return img;
        };
        hookFix(bws.uw.Image, 'Image');

        /**
         * 防止鼠标离开监听
         * @type {function(*, *, ...[*]): any}
         */
        const originalAddEventListener = bws.uw.EventTarget.prototype.addEventListener;
        const filteredMouseEvents = ['mouseleave', 'mouseenter', 'mouseout'];
        // 如果事件类型在过滤列表中，并且用户已启用相应的设置，那么替换监听函数为一个空函数
        bws.uw.EventTarget.prototype.addEventListener = function (eventType, eventListener, ...options) {
            if (filteredMouseEvents.includes(eventType) && getMenuValue('menu_noMouseCheck')) {
                eventListener = function () { };
            }
            return originalAddEventListener.call(this, eventType, eventListener, ...options);
        };
        hookFix(bws.uw.EventTarget.prototype.addEventListener, 'addEventListener');

        /**
         * 阻止自动全屏和退出全屏
         */
        const documentElement = document.documentElement;

        function handleNoFullScreenRequest (fullScreenFunction, ...args) {
            return shouldDisableAutoScreen() ? null : fullScreenFunction.call(documentElement, ...args);
        }

        function handleNoExitFullScreenRequest (exitFullScreenFunction, ...args) {
            return shouldDisableAutoScreen() ? null : exitFullScreenFunction.call(document, ...args);
        }

        const fullScreenAPIs = [
            { request: 'requestFullscreen', exit: 'exitFullscreen' }, { request: 'webkitRequestFullScreen', exit: 'webkitExitFullscreen' }, { request: 'mozRequestFullScreen', exit: 'mozCancelFullScreen' }, { request: 'msRequestFullscreen', exit: 'msExitFullscreen' }];

        function shouldDisableAutoScreen () {
            return getMenuValue('menu_noAutomaticFullScreen');
        }

        fullScreenAPIs.forEach(api => {
            const fullScreenRequest = documentElement[api.request];
            const exitFullScreenRequest = document[api.exit];
            // 检查全屏请求和退出的方法是否存在, 并重写
            if (fullScreenRequest && exitFullScreenRequest) {
                documentElement[api.request] = function (...args) {
                    handleNoFullScreenRequest(fullScreenRequest, ...args);
                };
                hookFix(document.documentElement[api.request], api.request);
                document[api.exit] = function (...args) {
                    handleNoExitFullScreenRequest(exitFullScreenRequest, ...args);
                };
                hookFix(document[api.exit], api.exit);
            }
        });

        /**
         * 阻止检测到窗口大小改变时关闭窗口
         * @type {(function(*, *, ...[*]): (null|*))|*}
         */
        const originalWindowOpen = bws.uw.open;
        const originalWindowClose = bws.uw.close;
        const targetValues = ['_top', '_self'];
        bws.uw.open = function (url, target, ...options) {
            // 检测是否调用时用空参数作为第一个参数且 target 为 _top 或 _self 的情况
            if (url === '' && targetValues.includes(target) && getMenuValue('menu_noWindowCheck')) {
                return null;
            }
            return originalWindowOpen.call(this, url, target, ...options);
        };
        hookFix(bws.uw.open, 'open');
        bws.uw.close = function (...args) {
            if (getMenuValue('menu_noWindowCheck')) {
                return null;
            }
            return originalWindowClose.call(this, ...args);
        };
        hookFix(bws.uw.close, 'close');

        /**
         * 阻止清空用户在做题时选中的内容
         */
        function shouldPreventClearSelection () {
            return getMenuValue('menu_noClearSelect');
        }

        if (bws.uw.getSelection) {// 根据浏览器自适应方法
            const selection = bws.uw.getSelection();
            if (selection.empty) {
                const originalClear = selection.empty;
                selection.empty = function () {
                    if (shouldPreventClearSelection()) {
                        return null;
                    }
                    return originalClear.call(this);
                };
                hookFix(bws.uw.getSelection().empty, 'empty');
            } else if (selection.removeAllRanges) {
                const originalClear = selection.removeAllRanges;
                selection.removeAllRanges = function () {
                    if (shouldPreventClearSelection()) {
                        return null;
                    }
                    return originalClear.call(this);
                };
                hookFix(bws.uw.getSelection().removeAllRanges, 'removeAllRanges');
            }
        } else if (document.selection) {
            const originalClear = document.selection.empty;
            document.selection.empty = function (...args) {
                if (shouldPreventClearSelection()) {
                    return null;
                }
                return originalClear.call(this, ...args);
            };
            hookFix(originalClear, 'empty');
        }

        /**
         * 阻止超时自动提交
         * @type {(function(*, *, ...[*]): (null|*))|*}
         */
        const originalSetInterval = bws.uw.setInterval;
        const callbackConditions = ['()=>{', '.value==0&&', '.value-1}'];
        // 发现有定时器里的函数命中规则就取消设定
        bws.uw.setInterval = function (callback, delay, ...args) {
            if (typeof callback === 'function') {
                const callbackString = callback.toString();
                const isAutoCommitCallback = callbackConditions.every(condition => callbackString.includes(condition));
                if (isAutoCommitCallback && delay === 1000 && getMenuValue('menu_noAutocommit')) {
                    return null;
                }
            }
            return originalSetInterval.call(this, callback, delay, ...args);
        };
        hookFix(bws.uw.setInterval, 'setInterval');

        /**
         * 还原所有修改
         */
        bws.uw.onload = function () {
            function fixChanges () {
                let tipsElement = document.getElementById('tips');
                let tipsContentElement = document.getElementById('tips_content');
                if (!tipsElement && !tipsContentElement) {
                    if (getMenuValue('menu_fixAll')) {
                        // 修复选中限制
                        const styleTag = document.createElement('style');
                        styleTag.innerHTML = '*, #app {margin: 0;padding: 0;user-select: auto !important;}';
                        document.head.appendChild(styleTag);
                        // 修复按键限制
                        ['onkeyup', 'onkeydown', 'onkeypress', 'onmousedown', 'onselectstart', 'oncontextmenu'].forEach(event => {
                            bws.uw[event] = null;
                            document[event] = null;
                        });
                    }
                    // 去除小程序提示页面
                    if (getMenuValue('menu_experimentalFeatures')) {
                        noAppletsTips();
                    }
                    // 清空计时器并提示
                    bws.nb.clearInterval(fixChangesInterval);
                    if (!getMenuValue('menu_trueSecret')) {
                        Toast.fire({
                            icon: 'success',
                            title: `器灵${copyRight.name}已成功载入😎`,
                        });
                    }
                    log(`器灵${copyRight.name}已成功载入😎`);
                } else if (tipsElement && tipsContentElement) {
                    if (tipsElement.innerText.includes('页面渲染超时') && tipsContentElement.innerText.includes('页面渲染超时')) {
                        bws.nb.clearInterval(fixChangesInterval);
                        Toast.fire({
                            icon: 'warning',
                            title: `器灵${copyRight.name}未完全载入⚠️\r\n因网页问题, 现已启用安全模式\r\n刷新页面即可重新加载`,
                        });
                        bws.nb.console.warn(`器灵${copyRight.name}未完全载入⚠️\r\n因网页问题, 现已启用安全模式\r\n刷新页面即可重新加载`);
                    }
                }
                isOnload = true;
                log(`加载耗时: ${(bws.nb.performance.now() - startTime).toFixed(3)} ms`);
            }

            const fixChangesInterval = bws.nb.setInterval(fixChanges, getRandomNumber(0, 100));
        };

        /**
         * 杂项功能
         */
        // 是否在做题
        function isQuestion () {
            // 获取页面上所有的span元素, 并历遍查找指定内容
            let spans = document.getElementsByTagName('span');
            for (let i = 0; i < spans.length; i++) {
                if (spans[i].classList.contains('btn__text') &&
                    spans[i].getAttribute('data-wait') === '请稍后…' &&
                    spans[i].getAttribute('data-after') === '交卷成功' &&
                    spans[i].textContent.includes('立即交卷')) {
                    return true;
                }
            }
            return false;
        }

        // 获取题目信息
        const originalXhrOpen = bws.uw.XMLHttpRequest.prototype.open;
        const apiExamInfoPath = '/api/ExamInfo/';
        const targetUrls = [
            'StartExamBySub',
            'RestoreExamPage',
            'StartExamByUni',
            'StartExamByMock',
        ].map(path => apiExamInfoPath + path);
        // 发现符合规则的xhr就将返回内容复制到剪切板
        bws.uw.XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
            this.addEventListener('readystatechange', function () {
                if (this.readyState === 4) {
                    const urls = new URL(url);
                    if (urls.origin === 'https://beta_api.jbea.cn' && targetUrls.includes(urls.pathname)) {
                        if (this.status >= 200 && this.status < 300) {
                            examEncData = this.responseText;
                            log('已获取到题目密文: \r\n' + examEncData);
                            if (getMenuValue('menu_autoCaptureExamInform')) {
                                shortcuts.i().then();
                            }
                        } else {
                            Toast.fire({
                                icon: 'warning',
                                title: '题目获取失败, 请检查网络⚠️',
                            });
                            bws.nb.console.warn('获取题目密文时请求出现问题: \r\n' + this.status + this.statusText);
                        }
                    }
                    if (getMenuValue('menu_experimentalFeatures')) {
                        restoreMenuButton();
                    }
                }
            });
            return originalXhrOpen.apply(this, arguments);
        };
        hookFix(bws.uw.XMLHttpRequest.prototype.open, 'open');
        const shortcuts = {
            // 隐秘模式
            't': async function () {
                if (!isQuestion()) {
                    Toast.fire({
                        icon: 'warning',
                        title: '您现在没有在做题, 无法使用⚠️',
                    });
                    return;
                }
                if (getMenuValue('menu_experimentalFeatures')) {
                    let dlElement = document.querySelector('dl'),
                        firstLabelElement, secondLabelElement, thirdLabelElement;
                    if (dlElement) {
                        // 在 <dl> 内查找所有 <dd> 元素
                        let ddElements = dlElement.querySelectorAll('dd');
                        if (ddElements.length >= 3) {
                            // 获取1~3的 <dd> 元素, 并在第三个 <dd> 内查找第一个 <label> 元素
                            firstLabelElement = ddElements[0].querySelector('label');
                            secondLabelElement = ddElements[1].querySelector('label');
                            thirdLabelElement = ddElements[2].querySelector('label');
                            if (!firstLabelElement || !secondLabelElement || !thirdLabelElement) {
                                log('初始化隐秘模式出现问题⚠️');
                            }
                        }
                    }
                    try {
                        this.answerDataEIsFinish = false;
                        this.answerDataE = await connections('test', bws.nb.btoa(examEncData));
                        log(this.answerDataE);
                        if (this.answerDataE === 'error') {
                            thirdLabelElement.click();
                        } else {
                            for (const [qsid, answer] of bws.nb.JSON.parse(this.answerDataE).map(item => [item.qsid, item.answer])) {
                                // 统计逗号数量并根据逗号数量执行循环, 再根据选项转为指定索引值
                                const commaCount = (answer.match(/,/g) || []).length;
                                for (let i = 0; i < commaCount; i++) {
                                    let index = calculationOptions(answer, i);
                                    if (index != null) {
                                        // 查找具有for属性值为"特定值的<label>标签
                                        let label = document.querySelector(`label[for="${qsid}_${index}"]`);
                                        if (label) {
                                            let span = label.querySelector('span');
                                            if (span) {
                                                let innerSpan = span.querySelector('span');
                                                if (innerSpan) {
                                                    let currentStyle = innerSpan.getAttribute('style');
                                                    // 检查style属性是否存在且包含'box-shadow: none'
                                                    if (!currentStyle || !currentStyle.includes('box-shadow: none')) {
                                                        innerSpan.style.boxShadow = 'none';
                                                    }
                                                }
                                            }
                                        }
                                        await sleep(getRandomNumber(0, 10)); // 随机等待时间
                                    }
                                }
                            }
                            this.answerDataEIsFinish = true;
                        }
                    } catch (error) {
                        if (getMenuValue('menu_trueSecret')) {
                            secondLabelElement.click();
                        } else {
                            Toast.fire({
                                icon: 'warning',
                                title: '加载时出错, 请检查后重试⚠️',
                            });
                        }
                        bws.nb.console.warn('将解析后的内容用于做题时出现问题: \r\n' + error.stack);
                    } finally {
                        if (this.answerDataEIsFinish) {
                            if (getMenuValue('menu_trueSecret')) {
                                firstLabelElement.click();
                            } else {
                                Toast.fire({
                                    icon: 'success',
                                    title: '隐秘模式已载入✔️',
                                });
                            }
                        }
                    }
                }
            },
            // 更换用户
            'y': async function () {
                if (isQuestion()) {
                    Toast.fire({
                        icon: 'warning',
                        title: '请不要作死😅',
                    });
                    return;
                }

                const { value: userToken, isConfirmed } = await Swal.fire({
                    icon: 'question',
                    title: '请输入你要更换的账号信息',
                    input: 'text',
                    inputAttributes: {
                        autocapitalize: 'off',
                    },
                    showCancelButton: true,
                    confirmButtonText: '更换',
                    showLoaderOnConfirm: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonText: '取消',
                    preConfirm: async (_userToken) => {
                        try {
                            return _userToken;
                        } catch (error) {
                            Swal.showValidationMessage(`非法的用户令牌, 原因: ${error}`);
                        }
                    },
                    allowOutsideClick: () => !Swal.isLoading(),
                });

                if (isConfirmed) {
                    try {
                        // 清空cookie
                        document.cookie.split(';').forEach(function (cookie) {
                            var parts = cookie.split('=');
                            var name = parts[0].trim();
                            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
                        });
                        // 设置用户信息, 如果不存在就不执行
                        if (!(userToken.trim() === '')) {
                            bws.nb.localStorage.clear();
                            bws.nb.localStorage.setItem('userToken', userToken);
                        }
                    } catch (error) {
                        Toast.fire({
                            icon: 'warning',
                            title: '更换用户失败, 请检查后重试⚠️',
                        });
                        bws.nb.console.warn('将用户进行更换时出现问题: \r\n' + error.stack);
                    }
                    Toast.fire({
                        icon: 'success',
                        title: '更换完成, 请刷新页面✔️',
                    });
                }
            },
            // 全自动答题
            'u': async function () {
                if (!isQuestion()) {
                    Toast.fire({
                        icon: 'warning',
                        title: '您现在没有在做题, 无法使用⚠️',
                    });
                    return;
                }
                const { value: answerDataA, isConfirmed } = await Swal.fire({
                    icon: 'question',
                    title: '请输入神必代码🤩',
                    input: 'text',
                    inputAttributes: {
                        autocapitalize: 'off',
                    },
                    showCancelButton: true,
                    confirmButtonText: '继续',
                    confirmButtonColor: '#3085d6',
                    cancelButtonText: '取消',
                    showLoaderOnConfirm: true,
                    preConfirm: async (_answerDataA) => {
                        try {
                            if (_answerDataA.trim() === '') {
                                (function () {
                                    throw '不能为空!';
                                })();// 简单暴力xd
                            }
                            return bws.nb.JSON.parse(bws.nb.atob(_answerDataA)).map(item => [item.qsid, item.answer]);
                        } catch (error) {
                            Swal.showValidationMessage(`非法的代码, 原因: ${error}`);
                        }
                    },
                    allowOutsideClick: () => !Swal.isLoading(),
                });
                if (isConfirmed) {
                    try {
                        for (const [qsid, answer] of answerDataA) {
                            // 统计逗号数量并根据逗号数量执行循环, 再根据选项转为指定索引值
                            const commaCount = (answer.match(/,/g) || []).length;
                            for (let i = 0; i < commaCount; i++) {
                                let index = calculationOptions(answer, i);
                                if (index != null) {// 根据索引值模拟点击事件
                                    document.getElementById(
                                        document.querySelector(`label[for="${qsid}_${index}"]`).getAttribute('for'),
                                    ).click();
                                    await sleep(getRandomNumber(0, 100));
                                }
                            }
                        }
                    } catch (error) {
                        Toast.fire({
                            icon: 'warning',
                            title: '做题时出错, 请检查后重试⚠️',
                        });
                        bws.nb.console.warn('将解析后的内容用于做题时出现问题: \r\n' + error.stack);
                    } finally {
                        Toast.fire({
                            icon: 'success',
                            title: '题目已做完✔️',
                        });
                    }
                }
            },
            // 复制题目密文到剪切板
            'i': async function () {
                if (!isQuestion()) {
                    Toast.fire({
                        icon: 'warning',
                        title: '您现在没有在做题, 无法获取⚠️',
                    });
                } else if (typeof examEncData !== 'undefined' && examEncData !== null) {
                    try {
                        await bws.nb.navigator.clipboard.writeText(examEncData);// 复制返回内容到剪切板
                        Toast.fire({
                            icon: 'success',
                            title: '题目已复制到剪切板✔️',
                        });
                    } catch (error) {
                        Toast.fire({
                            icon: 'warning',
                            title: '题目获取失败, 请重试⚠️',
                        });
                        bws.nb.console.warn('将响应内容复制到剪贴板时出现问题: \r\n' + error.stack);
                    }
                } else {
                    Toast.fire({
                        icon: 'warning',
                        title: '题目复制失败, 请刷新⚠️',
                    });
                }
            },
            // 清空控制台信息
            'o': function () {
                bws.nb.console.clear();
                Toast.fire({
                    icon: 'success',
                    title: '控制台已清空✔️',
                });
                log('控制台已清空✔️');
            },
            // 清空做题数据
            'p': function () {
                if (isQuestion()) {
                    Toast.fire({
                        icon: 'warning',
                        title: '请不要作死😅',
                    });
                    return;
                }
                ['exam_model', 'exam_model_time', 'mouseCheck_count'].forEach(name => {
                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                });
                examEncData = null;// 清空题目密文变量
                Toast.fire({
                    icon: 'success',
                    title: '指定Cookie已清空✔️',
                });
                log('指定Cookie已清空✔️');
            },
        };
        // 监听键盘按键
        document.addEventListener('keydown', function (event) {
            const keyPressed = event.key;
            if (getMenuValue('menu_shortcutKey') && shortcuts[keyPressed]) {
                shortcuts[keyPressed]();
            }
        });

        /**
         * 实验性功能
         */
        function noAppletsTips () {
            // 获取所有<template>标签
            let templates = document.querySelectorAll('template');
            // 遍历每个<template>标签
            templates.forEach(function (template) {
                // 获取<template>标签的class值
                let classValue = template.getAttribute('class');
                // 检查是否有class值为 "isOnMobile"
                if (classValue && classValue.includes('isOnMobile')) {
                    // 删除具有 "isOnMobile" class值的<template>标签
                    template.parentNode.removeChild(template);
                }
            });
        }

        function restoreMenuButton () {
            // 获取所有class为"gb_6b"的div元素
            let divs = document.querySelectorAll('div.gb_6b');
            // 遍历所有获取到的div元素
            divs.forEach(div => {
                // 获取元素的style属性
                let style = div.style;
                // 判断style是否含有display为none的属性
                if (style.display === 'none') {
                    // 如果含有display为none的属性，删除该属性
                    style.display = '';
                }
            });

        }
    } catch (error) {
        // 捕获一些意外的错误
        Toast.fire({
            icon: 'error',
            title: `器灵${copyRight.name}加载失败/出错❌\r\n为防止意外情况, 现已停止运行\r\n请联系作者(${copyRight.author})反馈情况`,
        });
        throw (`器灵${copyRight.name}加载失败/出错❌\r\n\r\n原因和堆栈:\r\n${error.stack}\r\n请将上述内容反馈给作者(${copyRight.author}), 谢谢`);
    }
})();