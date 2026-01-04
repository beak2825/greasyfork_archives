// ==UserScript==
// @name         PCOL-ASSIST-test
// @author       葉月Hikaru
// @match        http://www.heyzxz.me/pcol/*
// @version 10.4
// @namespace https://greasyfork.org/users/your-id
// @description 为该在线台球游戏增加虚拟按键（含shift、command、alt、鼠标左键）
// @downloadURL https://update.greasyfork.org/scripts/543120/PCOL-ASSIST-test.user.js
// @updateURL https://update.greasyfork.org/scripts/543120/PCOL-ASSIST-test.meta.js
// ==/UserScript==

// 放在原有代码最顶部，确保优先执行
(function() {
    'use strict';

    // Windows系统标识（关键配置）
    const winIdentifiers = {
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        platform: "Win32",
        oscpu: "Windows NT 10.0; Win64; x64",
        appVersion: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    };

    // 重写navigator属性的方法（适配Safari限制）
    function forceSystemIdentifier(prop, value) {
        // 解除原有属性的保护
        const desc = Object.getOwnPropertyDescriptor(navigator, prop);
        if (desc) {
            Object.defineProperty(navigator, prop, { ...desc, configurable: true });
        }
        // 强制设置为Windows标识
        Object.defineProperty(navigator, prop, {
            get: () => value,
            configurable: true
        });
    }

    // 覆盖所有关键系统检测点
    forceSystemIdentifier('userAgent', winIdentifiers.userAgent);
    forceSystemIdentifier('platform', winIdentifiers.platform);
    forceSystemIdentifier('oscpu', winIdentifiers.oscpu);
    forceSystemIdentifier('appVersion', winIdentifiers.appVersion);

    console.log('已强制模拟为Windows系统，应显示Alt键操作提示');
})();

(function() {
    'use strict';
    // 原有按键+新增按键配置（新增按键放在210px高度，避免重叠）
    const keysConfig = [
        { key: '+', text: '-', top: 30, left: 40 },
        { key: 'w', text: 'W', top: 30, left: 50 },
        { key: '-', text: '+', top: 30, left: 60 },
        { key: 'space', text: 'SPACE', top: 30, left: 70 },
        { key: 'x', text: 'X', top: 30, left: 80 },
        { key: 'c', text: 'C', top: 30, left: 90 },
        { key: 'p', text: 'P', top: 120, left: 90 },
        { key: 'a', text: 'A', top: 120, left: 30 },
        { key: 's', text: 'S', top: 120, left: 50 },
        { key: 'd', text: 'D', top: 120, left: 70 },
        // 新增按键
        { key: 'shift', text: 'Shift', top: 210, left: 30 },
        { key: 'meta', text: 'Cmd', top: 210, left: 50 }, // command键对应meta
        { key: 'alt', text: 'Alt', top: 210, left: 70 },
        { key: 'm1', text: 'M1', top: 210, left: 90 } // 鼠标左键
    ];
    const originalButtons = [];
    let areButtonsVisible = true;

    // 创建虚拟按键（保留原有逻辑，扩展新增按键处理）
    function createVirtualKey(keyConfig) {
        const btn = document.createElement('button');
        btn.id = `pcol-assist-${keyConfig.key}-btn`;
        btn.textContent = keyConfig.text;
        btn.style.cssText = `
            position: fixed;
            top: ${keyConfig.top}px;
            left: ${keyConfig.left}%;
            transform: ${keyConfig.left === 50 ? 'translateX(-50%)' : 'translateX(0)'};
            width: 60px;
            height: 60px;
            font-size: ${keyConfig.text === 'SPACE' ? '16px' : '28px'};
            background-color: rgba(255, 165, 0, 0.9);
            color: white;
            border: 2px solid white;
            border-radius: 50%;
            cursor: pointer;
            z-index: 9999;
        `;

        // 按下状态样式切换
        function setPressedStyle(isPressed) {
            btn.style.backgroundColor = isPressed ? 'rgba(255, 140, 0, 0.7)' : 'rgba(255, 165, 0, 0.9)';
            btn.style.transform = isPressed 
                ? `${keyConfig.left === 50 ? 'translateX(-50%)' : 'translateX(0)'} scale(0.95)`
                : `${keyConfig.left === 50 ? 'translateX(-50%)' : 'translateX(0)'}`;
        }

        // 事件触发逻辑
        function triggerEvent(type) {
            // 滚轮键处理（原有逻辑）
            if (keyConfig.key === '+' || keyConfig.key === '-') {
                const wheelEvent = new WheelEvent('wheel', {
                    deltaY: keyConfig.key === '+' ? -300 : 300,
                    bubbles: true,
                    cancelable: true
                });
                document.querySelector('canvas')?.dispatchEvent(wheelEvent) || document.dispatchEvent(wheelEvent);
                return;
            }

            // 鼠标左键处理（新增）
            if (keyConfig.key === 'm1') {
                const target = document.querySelector('canvas') || document.body;
                const event = new MouseEvent(type, {
                    bubbles: true,
                    cancelable: true,
                    button: 0 // 左键标识
                });
                target.dispatchEvent(event);
                return;
            }

            // 键盘按键处理（扩展新增按键）
            const keyMap = {
                'shift': { key: 'Shift', code: 'ShiftLeft', keyCode: 16 },
                'meta': { key: 'Meta', code: 'MetaLeft', keyCode: 91 },
                'alt': { key: 'Alt', code: 'AltLeft', keyCode: 18 },
                'space': { key: ' ', code: 'Space', keyCode: 32 },
                'w': { key: 'w', code: 'KeyW', keyCode: 87 },
                'a': { key: 'a', code: 'KeyA', keyCode: 65 },
                's': { key: 's', code: 'KeyS', keyCode: 83 },
                'd': { key: 'd', code: 'KeyD', keyCode: 68 },
                'x': { key: 'x', code: 'KeyX', keyCode: 88 },
                'c': { key: 'c', code: 'KeyC', keyCode: 67 },
                'p': { key: 'p', code: 'KeyP', keyCode: 80 }
            };

            const info = keyMap[keyConfig.key];
            if (info) {
                const event = new KeyboardEvent(type, {
                    key: info.key,
                    code: info.code,
                    keyCode: info.keyCode,
                    shiftKey: keyConfig.key === 'shift' && type === 'keydown',
                    metaKey: keyConfig.key === 'meta' && type === 'keydown',
                    altKey: keyConfig.key === 'alt' && type === 'keydown',
                    bubbles: true,
                    cancelable: true
                });
                document.querySelector('canvas')?.dispatchEvent(event) || document.dispatchEvent(event);
            }
        }

        // 按下事件（触摸和鼠标）
        ['touchstart', 'mousedown'].forEach(eType => {
            btn.addEventListener(eType, (e) => {
                e.preventDefault();
                setPressedStyle(true);
                triggerEvent(eType === 'touchstart' ? 'keydown' : 'mousedown');
            });
        });

        // 松开事件（触摸和鼠标）
        ['touchend', 'mouseup'].forEach(eType => {
            btn.addEventListener(eType, (e) => {
                e.preventDefault();
                setPressedStyle(false);
                triggerEvent(eType === 'touchend' ? 'keyup' : 'mouseup');
            });
        });

        // 鼠标离开时恢复样式
        btn.addEventListener('mouseleave', () => {
            setPressedStyle(false);
        });

        document.body.appendChild(btn);
        originalButtons.push(btn);
    }

    // 按键显示/隐藏切换
    function createVisibilityToggle() {
        const toggle = document.createElement('button');
        toggle.id = 'pcol-assist-visibility-toggle';
        toggle.textContent = '按钮: 显示';
        toggle.style.cssText = `
            position: fixed;
            top: 60px;
            left: 20px;
            width: 100px;
            height: 40px;
            font-size: 16px;
            background-color: rgba(0, 128, 0, 0.9);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
        `;
        toggle.addEventListener('click', () => {
            areButtonsVisible = !areButtonsVisible;
            originalButtons.forEach(btn => {
                btn.style.display = areButtonsVisible ? 'block' : 'none';
            });
            toggle.textContent = areButtonsVisible ? '按钮: 显示' : '按钮: 隐藏';
            toggle.style.backgroundColor = areButtonsVisible ? 'rgba(0, 128, 0, 0.9)' : 'rgba(128, 128, 128, 0.9)';
        });
        document.body.appendChild(toggle);
    }

    // 全屏切换
    function createFullscreenToggle() {
        const toggle = document.createElement('button');
        toggle.id = 'pcol-assist-fullscreen-toggle';
        toggle.textContent = '全屏';
        toggle.style.cssText = `
            position: fixed;
            top: 60px;
            left: 140px;
            width: 80px;
            height: 40px;
            font-size: 16px;
            background-color: rgba(70, 130, 180, 0.9);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
        `;
        toggle.addEventListener('click', () => {
            const docEl = document.documentElement;
            const isFullscreen = document.webkitIsFullScreen || document.fullscreenElement;
            
            if (!isFullscreen) {
                if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen();
                else if (docEl.requestFullscreen) docEl.requestFullscreen();
                toggle.textContent = '退出全屏';
            } else {
                if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                else if (document.exitFullscreen) document.exitFullscreen();
                toggle.textContent = '全屏';
            }
        });
        document.body.appendChild(toggle);
    }

    // 初始化
    keysConfig.forEach(createVirtualKey);
    createVisibilityToggle();
    createFullscreenToggle();
})();