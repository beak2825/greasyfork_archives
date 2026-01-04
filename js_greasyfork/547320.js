// ==UserScript==
// @name         神秘脚本
// @description  用于华为云认证考试，提供模拟摄像头、防止切屏检测和自动复制题目等功能。
// @version      1.0
// @license      MIT
// @match        https://connect.huaweicloud.com/courses/exam/*
// @match        https://edu.huaweicloud.com/certifications/*
// @match        https://edu.huaweicloud.com/signup/*
// @match        https://www.huaweicloud.com
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-start
// @namespace https://greasyfork.org/users/1508900
// @downloadURL https://update.greasyfork.org/scripts/547320/%E7%A5%9E%E7%A7%98%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/547320/%E7%A5%9E%E7%A7%98%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

/*
活动地址 https://edu.huaweicloud.com/signup/8a8472ec5f054f1596747afbe3e219f5?medium=share_kfzlb&invitation=7d8494bbcff6485d973f56736667c6b2
*/

(function() {
    'use strict';
    
    // ==================== 配置区====================
 
    const DEFAULT_BASE64_IMAGE=''
    let interceptedQuestions = [];
    
    // ==================== 工具类 ====================
    class Utils {
        static generateRandomBase64(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            let result = '';
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }

        static async getBase64Image() {
            return DEFAULT_BASE64_IMAGE;
        }
    }
    
    class CopyQuestionsUI {
        constructor() {
            this.createUI();
        }
        
        createUI() {
            const container = document.createElement('div');
            container.style.all = 'initial';
            document.documentElement.appendChild(container);
            
            const shadow = container.attachShadow({ mode: 'closed' });
            
            const styles = `
                :host { all: initial; }
                #copy-container { position: fixed; bottom: 10px; right: 10px; z-index: 2147483647; background-color: rgba(0, 0, 0, 0.1); padding: 10px; border-radius: 7px; transition: opacity 0.3s ease-in-out, background-color 0.3s ease-in-out; font-family: Arial, sans-serif; font-size: 12px; box-sizing: border-box; width: auto; max-width: 200px; opacity: 0.8; }
                #copy-container:hover { background-color: rgba(0, 0, 220, 0.25); opacity: 1; }
                #copy-button { background-color: rgba(0, 0, 0, 0.2); border: none; padding: 5px; border-radius: 5px; cursor: pointer; font-size: inherit; width: 100%; text-align: center; color: white; transition: background-color 0.25s ease-in-out; }
                #copy-button:hover { background-color: rgba(25, 25, 25, 0.6); }
                #copy-button.success { background-color: rgba(0, 220, 0, 0.6); }
                #copy-title { color: white; margin-bottom: 5px; font-weight: bold; text-align: center; }
            `;
            
            const template = document.createElement('template');
            template.innerHTML = `
                <style>${styles}</style>
                <div id="copy-container">
                    <div id="copy-title">题目操作</div>
                    <button id="copy-button">手动复制题目</button>
                </div>
            `;
            
            shadow.appendChild(template.content.cloneNode(true));
            
            const copyButton = shadow.getElementById('copy-button');
            
            copyButton.onclick = function() {
                if (interceptedQuestions.length === 0) {
                    alert('⚠️ 尚未拦截到题目！');
                    return;
                }
                
                const textToCopy = interceptedQuestions.map(q => `${q[0]}\n${q[1]}\n`).join('\n');
                
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        copyButton.textContent = '复制成功 ✓';
                        copyButton.classList.add('success');
                        console.log('✅ 手动复制题目成功');
                        
                        setTimeout(() => {
                            copyButton.textContent = '手动复制题目';
                            copyButton.classList.remove('success');
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('❌ 复制失败:', err);
                        alert('❌ 题目复制失败');
                    });
            };
        }
    }

    class VirtualStream {
        constructor(width = 1280, height = 720, fps = 30) {
            this.width = width;
            this.height = height;
            this.fps = fps;
        }

        async createNoiseLayer(opacity = 0.05) {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            const ctx = canvas.getContext('2d');
            const imageData = ctx.createImageData(this.width, this.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const noise = Math.random() * 255;
                data[i] = data[i + 1] = data[i + 2] = noise;
                data[i + 3] = opacity * 255;
            }

            ctx.putImageData(imageData, 0, 0);
            return canvas;
        }

        drawImageCovered(ctx, img, x, y, w, h) {
            const imgRatio = img.width / img.height;
            const canvasRatio = w / h;
            let sx, sy, sWidth, sHeight;

            if (imgRatio > canvasRatio) {
                sHeight = img.height;
                sWidth = sHeight * canvasRatio;
                sx = (img.width - sWidth) / 2;
                sy = 0;
            } else {
                sWidth = img.width;
                sHeight = sWidth / canvasRatio;
                sx = 0;
                sy = (img.height - sHeight) / 2;
            }

            ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);
        }

        async createVirtualStream() {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            const ctx = canvas.getContext('2d');

            const img = new Image();
            // 使用硬编码的图片
            img.src = DEFAULT_BASE64_IMAGE;

            const offscreenCanvas = document.createElement('canvas');
            offscreenCanvas.width = this.width;
            offscreenCanvas.height = this.height;
            const offscreenCtx = offscreenCanvas.getContext('2d');

            img.onload = () => {
                this.drawImageCovered(offscreenCtx, img, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
            };

            let noiseLayer = await this.createNoiseLayer();

            let hue = 0;
            let saturate = 100;
            let brightness = 100;

            function generateFrame() {
                hue = (hue + 0.05) % 1;
                saturate = 99.5 + Math.sin(Date.now() / 2000) * 0.5;
                brightness = 99.5 + Math.random() * 0.5;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(offscreenCanvas, 0, 0);
                ctx.filter = `hue-rotate(${hue}deg) saturate(${saturate}%) brightness(${brightness}%)`;
                ctx.drawImage(canvas, 0, 0);
                ctx.filter = 'none';
                ctx.globalCompositeOperation = 'overlay';
                ctx.drawImage(noiseLayer, 0, 0);
                ctx.globalCompositeOperation = 'source-over';
            }

            const stream = canvas.captureStream(this.fps);

            setInterval(generateFrame, 1000 / this.fps);

            setInterval(() => {
                noiseLayer = this.createNoiseLayer();
            }, 500 + Math.sin(Date.now() / 1000) * 100);

            return stream;
        }
    }

    // -------- API劫持 --------
    class CameraHook {
        constructor() {
            this.methodsLookupTable = new WeakMap();
            this.virtualDeviceId = Utils.generateRandomBase64(43) + '=';
            this.virtualGroupId = Utils.generateRandomBase64(43) + '=';
            this.hookMediaDevices();
            this.preventDetection();
        }

        preventDetection() {
            const originalToString = Function.prototype.toString;
            const map = this.methodsLookupTable;

            // 防止检测被劫持的函数
            Function.prototype.toString = new Proxy(originalToString, {
                apply(target, thisArg, argumentsList) {
                    if (typeof thisArg?.call !== 'function') {
                        return Reflect.apply(target, thisArg, argumentsList);
                    }

                    if (map.has(thisArg)) {
                        return Reflect.apply(target, map.get(thisArg), argumentsList);
                    }

                    return Reflect.apply(target, thisArg, argumentsList);
                }
            });
        }

        replaceMethod(obj, methodName, newMethod) {
            const oldMethod = obj[methodName];
            obj[methodName] = newMethod;
            this.methodsLookupTable.set(newMethod, oldMethod);
        }

        hookMediaDevices() {
            this.replaceMethod(navigator.mediaDevices, 'enumerateDevices', async () => {
                const originalMethod = this.methodsLookupTable.get(navigator.mediaDevices.enumerateDevices);
                const devices = await originalMethod.call(navigator.mediaDevices);
                const hasVirtualDevice = devices.some(device => 
                    device.deviceId === this.virtualDeviceId && device.kind === 'videoinput'
                );
                
                if (!hasVirtualDevice) {
                    // 创建虚拟设备
                    const virtualDevice = {
                        deviceId: this.virtualDeviceId,
                        groupId: this.virtualGroupId,
                        kind: 'videoinput',
                        label: '华为认证专用摄像头',
                        toJSON: function() {
                            return {
                                deviceId: this.deviceId,
                                groupId: this.groupId,
                                kind: this.kind,
                                label: this.label
                            };
                        }
                    };
                    
                    return [virtualDevice, ...devices];
                }
                
                return devices;
            });

            // 替换摄像头流
            this.replaceMethod(navigator.mediaDevices, 'getUserMedia', async (constraints) => {
                const originalMethod = this.methodsLookupTable.get(navigator.mediaDevices.getUserMedia);
                
                if (constraints && constraints.video) {
                    console.log('检测到摄像头请求，返回虚拟摄像头流');
                    return await new VirtualStream().createVirtualStream();
                }
                
                return originalMethod.call(navigator.mediaDevices, constraints);
            });
        }
    }

    function initBlockingFeatures() {
        const stepEvent = (e) => {
            e.stopImmediatePropagation()
            e.stopPropagation()
            e.preventDefault()
            return false
        }
        Object.defineProperty(unsafeWindow.document, 'visibilityState', {
            configurable: true,
            get: function () {
                return 'visible'
            },
        })

        Object.defineProperty(unsafeWindow.document, 'hidden', {
            configurable: true,
            get: function () {
                return false
            },
        })

        ;[
            'blur', 
            'focus',
            'focusin',
            'focusout', 
            'pageshow',
            'pagehide',
            'visibilitychange',
        ].forEach((k) => {
            unsafeWindow.addEventListener(k, stepEvent, true)
        })

        unsafeWindow.document.addEventListener('visibilitychange', stepEvent, true)

        if (unsafeWindow.screen.orientation) {
            unsafeWindow.screen.orientation.addEventListener('change', stepEvent, true)
        }


        Object.defineProperty(unsafeWindow.document, 'fullscreenElement', {
            configurable: true,
            get: function () {
                return unsafeWindow.document.documentElement
            },
        })

        Object.defineProperty(unsafeWindow.document, 'fullscreenEnabled', {
            configurable: true,
            get: function () {
                return true
            },
        })

        unsafeWindow.Element.prototype.requestFullscreen = function () {
            return new Promise((resolve, reject) => {
                resolve()
            })
        }

        unsafeWindow.document.exitFullscreen = function () {
            return new Promise((resolve, reject) => {
                resolve()
            })
        }

        unsafeWindow.document.addEventListener('fullscreenchange', stepEvent, true)

        console.log('切屏检测阻止功能已启用')
    }

    function createReactiveObject(initialState) {
        let state = { ...initialState }
        return new Proxy(state, {
            get(target, key) {
                return target[key]
            },
            set(target, key, value) {
                target[key] = value
                return true
            },
        })
    }

    function createToggleMenu(config) {
        const { menuName, onStart, onStop, defaultEnabled = true } = config
        const storageKey = `toggle_${menuName}`
        const initialEnabled = GM_getValue(storageKey, defaultEnabled)

        const state = createReactiveObject({
            isEnabled: initialEnabled,
            menuCommandId: null,
        })

        function updateMenuCommand() {
            if (state.menuCommandId) {
                GM_unregisterMenuCommand(state.menuCommandId)
            }

            GM_setValue(storageKey, state.isEnabled)

            if (state.isEnabled) {
                state.menuCommandId = GM_registerMenuCommand(`${menuName}(已启用)`, () => {
                    state.isEnabled = false
                    onStop(state)
                    updateMenuCommand()
                },{
                    autoClose: false
                })
            } else {
                state.menuCommandId = GM_registerMenuCommand(`${menuName}(未启用)`, () => {
                    state.isEnabled = true
                    onStart(state)
                    updateMenuCommand()
                },{
                    autoClose: false
                })
            }
        }

        if (initialEnabled) {
            onStart(state)
        }

        updateMenuCommand()
        return state
    }

    // 初始化脚本
    function initScript() {
        console.log("脚本启动...");
        

        initBlockingFeatures();
        

        new CameraHook();

        new CopyQuestionsUI();

        createToggleMenu({
            menuName: '题目劫持',
            defaultEnabled: true,
            onStart: (state) => {
                console.log('题目劫持已启动', state)

                state.autoCopy = createToggleMenu({
                    menuName: '题目自动复制',
                    defaultEnabled: true,
                    onStart: (state) => {
                        console.log('题目自动复制已启动', state)
                        GM_setValue('autoCopy', true)
                    },
                    onStop: (state) => {
                        console.log('题目自动复制已停止', state)
                        GM_setValue('autoCopy', false)
                    },
                })

                state.originalOpen = unsafeWindow.XMLHttpRequest.prototype.open
                state.originalSend = unsafeWindow.XMLHttpRequest.prototype.send

                const url = '/svc/innovation/userapi/exam2d/so/servlet/getExamPaper'

                unsafeWindow.XMLHttpRequest.prototype.open = function (m, u) {
                    this._t = m === 'POST' && u.includes(url)
                    return state.originalOpen.apply(this, arguments)
                }
                unsafeWindow.XMLHttpRequest.prototype.send = function () {
                    if (this._t) {
                        this.addEventListener('load', async function () {
                            try {
                                const response = JSON.parse(this.responseText)
                                const questions = response.result.questions.map((x, i) => [
                                    `${i + 1}/${x.type == 2 ? '判断' : x.type == 0 ? '单选' : '多选'}: ${x.content}`,
                                    x.options
                                        .map((opt, oi) => `${opt.optionOrder ?? String.fromCharCode(65 + oi)}: ${opt.optionContent}`)
                                        .join('\n'),
                                ])
                                console.log('考试题目：', questions)
                                
                                interceptedQuestions = questions;
                                
                                if (GM_getValue('autoCopy', true)) {
                                    navigator.clipboard
                                        .writeText(questions.map((x) => `${x[0]}\n${x[1]}\n`).join('\n'))
                                        .then(() => {
                                            console.log('✅ 成功复制到剪贴板')
                                            alert('✅ 成功复制题目')
                                        })
                                        .catch((err) => {
                                            console.error('❌ 复制题目失败:', err)
                                            alert('❌ 题目复制失败')
                                        })
                                }
                            } catch (e) {
                                console.error('解析考试数据失败：', e)
                            }
                        })
                    }
                    return state.originalSend.apply(this, arguments)
                }

                state.interceptor = { active: true }
            },
            onStop: (state) => {
                console.log('题目劫持已停止', state)
                GM_setValue('autoCopy', false)

                if (state.autoCopy?.menuCommandId) GM_unregisterMenuCommand(state.autoCopy.menuCommandId)

                if (state.originalOpen) {
                    unsafeWindow.XMLHttpRequest.prototype.open = state.originalOpen
                    state.originalOpen = null
                }

                if (state.originalSend) {
                    unsafeWindow.XMLHttpRequest.prototype.send = state.originalSend
                    state.originalSend = null
                }

                if (state.interceptor) {
                    state.interceptor.active = false
                    state.interceptor = null
                }
            },
        });
        
        console.log("神秘脚本已启动");
    }

    initScript();
    
})();