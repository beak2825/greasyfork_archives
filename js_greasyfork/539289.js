// ==UserScript==
// @name         移动设备伪装器 - Mobile Device Spoofer
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  全面伪装移动设备，绕过PC端访问限制
// @author       acgwzl
// @match        *://*/*
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539289/%E7%A7%BB%E5%8A%A8%E8%AE%BE%E5%A4%87%E4%BC%AA%E8%A3%85%E5%99%A8%20-%20Mobile%20Device%20Spoofer.user.js
// @updateURL https://update.greasyfork.org/scripts/539289/%E7%A7%BB%E5%8A%A8%E8%AE%BE%E5%A4%87%E4%BC%AA%E8%A3%85%E5%99%A8%20-%20Mobile%20Device%20Spoofer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEVICE_PRESETS = {
        'iPhone13': {
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
            appVersion: '5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
            width: 390,
            height: 844,
            devicePixelRatio: 3,
            platform: 'iPhone',
            vendor: 'Apple Computer, Inc.',
            maxTouchPoints: 5,
            hardwareConcurrency: 6,
            deviceMemory: 4,
            orientation: 'portrait-primary'
        },
        'iPhone12': {
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
            appVersion: '5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
            width: 375,
            height: 812,
            devicePixelRatio: 3,
            platform: 'iPhone',
            vendor: 'Apple Computer, Inc.',
            maxTouchPoints: 5,
            hardwareConcurrency: 6,
            deviceMemory: 4,
            orientation: 'portrait-primary'
        },
        'Android': {
            userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
            appVersion: '5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
            width: 360,
            height: 800,
            devicePixelRatio: 3,
            platform: 'Linux armv8l',
            vendor: 'Google Inc.',
            maxTouchPoints: 5,
            hardwareConcurrency: 8,
            deviceMemory: 6,
            orientation: 'portrait-primary'
        },
        'iPad': {
            userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
            appVersion: '5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
            width: 768,
            height: 1024,
            devicePixelRatio: 2,
            platform: 'MacIntel',
            vendor: 'Apple Computer, Inc.',
            maxTouchPoints: 5,
            hardwareConcurrency: 8,
            deviceMemory: 8,
            orientation: 'portrait-primary'
        }
    };

    let isEnabled = GM_getValue('spoofEnabled', false);
    let currentDevice = GM_getValue('currentDevice', 'iPhone13');

    function forceApplySpoofing() {
        if (!isEnabled) return;

        const device = DEVICE_PRESETS[currentDevice];
        if (!device) return;

        const originalDefineProperty = Object.defineProperty;

        try {
            ['userAgent', 'appVersion', 'platform', 'vendor'].forEach(prop => {
                try {
                    delete navigator[prop];
                } catch(e) {}

                originalDefineProperty.call(Object, navigator, prop, {
                    get: () => prop === 'userAgent' ? device.userAgent :
                              prop === 'appVersion' ? device.appVersion :
                              prop === 'platform' ? device.platform :
                              device.vendor,
                    configurable: false,
                    enumerable: true
                });
            });

            originalDefineProperty.call(Object, navigator, 'maxTouchPoints', {
                get: () => device.maxTouchPoints,
                configurable: false,
                enumerable: true
            });

            ['width', 'height', 'availWidth', 'availHeight'].forEach(prop => {
                try {
                    delete screen[prop];
                } catch(e) {}

                originalDefineProperty.call(Object, screen, prop, {
                    get: () => prop.includes('width') ? device.width : device.height,
                    configurable: false,
                    enumerable: true
                });
            });

            ['innerWidth', 'innerHeight', 'outerWidth', 'outerHeight'].forEach(prop => {
                try {
                    delete window[prop];
                } catch(e) {}

                originalDefineProperty.call(Object, window, prop, {
                    get: () => prop.includes('Width') ? device.width : device.height,
                    configurable: false,
                    enumerable: true
                });
            });

            originalDefineProperty.call(Object, window, 'devicePixelRatio', {
                get: () => device.devicePixelRatio,
                configurable: false,
                enumerable: true
            });

        } catch (error) {
        }
    }

    function applySpoofing() {
        if (!isEnabled) return;

        const device = DEVICE_PRESETS[currentDevice];
        if (!device) return;

        try {
            Object.defineProperty(navigator, 'userAgent', {
                get: () => device.userAgent,
                configurable: false,
                enumerable: true
            });


            Object.defineProperty(navigator, 'appVersion', {
                get: () => device.appVersion,
                configurable: false,
                enumerable: true
            });


            Object.defineProperty(navigator, 'platform', {
                get: () => device.platform,
                configurable: false,
                enumerable: true
            });

            Object.defineProperty(navigator, 'vendor', {
                get: () => device.vendor,
                configurable: false,
                enumerable: true
            });

            Object.defineProperty(navigator, 'maxTouchPoints', {
                get: () => device.maxTouchPoints,
                configurable: false,
                enumerable: true
            });


            if ('hardwareConcurrency' in navigator) {
                Object.defineProperty(navigator, 'hardwareConcurrency', {
                    get: () => device.hardwareConcurrency,
                    configurable: false,
                    enumerable: true
                });
            }

            if ('deviceMemory' in navigator) {
                Object.defineProperty(navigator, 'deviceMemory', {
                    get: () => device.deviceMemory,
                    configurable: false,
                    enumerable: true
                });
            }


            if ('userAgentData' in navigator) {
                Object.defineProperty(navigator, 'userAgentData', {
                    get: () => ({
                        mobile: true,
                        platform: device.platform,
                        brands: device.platform.includes('iPhone') ?
                            [{ brand: 'Safari', version: '15' }] :
                            [{ brand: 'Chrome', version: '91' }]
                    }),
                    configurable: false,
                    enumerable: true
                });
            }


            Object.defineProperty(screen, 'width', {
                get: () => device.width,
                configurable: false,
                enumerable: true
            });

            Object.defineProperty(screen, 'height', {
                get: () => device.height,
                configurable: false,
                enumerable: true
            });

            Object.defineProperty(screen, 'availWidth', {
                get: () => device.width,
                configurable: false,
                enumerable: true
            });

            Object.defineProperty(screen, 'availHeight', {
                get: () => device.height,
                configurable: false,
                enumerable: true
            });


            if ('orientation' in screen) {
                Object.defineProperty(screen.orientation, 'type', {
                    get: () => device.orientation,
                    configurable: false,
                    enumerable: true
                });
            }


            Object.defineProperty(window, 'devicePixelRatio', {
                get: () => device.devicePixelRatio,
                configurable: false,
                enumerable: true
            });


            const touchEvents = ['ontouchstart', 'ontouchmove', 'ontouchend', 'ontouchcancel'];
            touchEvents.forEach(event => {
                if (!(event in window)) {
                    Object.defineProperty(window, event, {
                        value: null,
                        configurable: false,
                        enumerable: true,
                        writable: true
                    });
                }
            });


            if (!window.TouchEvent) {
                window.TouchEvent = function TouchEvent() {};
            }


            Object.defineProperty(window, 'innerWidth', {
                get: () => device.width,
                configurable: false,
                enumerable: true
            });

            Object.defineProperty(window, 'innerHeight', {
                get: () => device.height,
                configurable: false,
                enumerable: true
            });

            Object.defineProperty(window, 'outerWidth', {
                get: () => device.width,
                configurable: false,
                enumerable: true
            });

            Object.defineProperty(window, 'outerHeight', {
                get: () => device.height,
                configurable: false,
                enumerable: true
            });


            const originalMatchMedia = window.matchMedia;
            window.matchMedia = function(query) {
                if (query.includes('max-width') && query.includes('768px')) {
                    return { matches: true, media: query };
                }
                if (query.includes('pointer: coarse')) {
                    return { matches: true, media: query };
                }
                if (query.includes('hover: none')) {
                    return { matches: true, media: query };
                }
                return originalMatchMedia.call(this, query);
            };


            Object.defineProperty(navigator, 'standalone', {
                get: () => false,
                configurable: false,
                enumerable: true
            });
            const protectedProps = ['userAgent', 'platform', 'vendor', 'maxTouchPoints'];
            protectedProps.forEach(prop => {
                const descriptor = Object.getOwnPropertyDescriptor(navigator, prop);
                if (descriptor && descriptor.configurable) {
                    Object.defineProperty(navigator, prop, {
                        ...descriptor,
                        configurable: false
                    });
                }
            });

        } catch (error) {
        }
    }


    function applyEarlySpoofing() {
        if (!isEnabled) return;

        const device = DEVICE_PRESETS[currentDevice];
        if (!device) return;

        try {
            const userAgentDescriptor = Object.getOwnPropertyDescriptor(Navigator.prototype, 'userAgent') ||
                                      Object.getOwnPropertyDescriptor(navigator, 'userAgent');

            if (userAgentDescriptor) {
                Object.defineProperty(navigator, 'userAgent', {
                    get: () => device.userAgent,
                    configurable: false,
                    enumerable: true
                });
            }

        } catch (error) {
        }
    }

    applyEarlySpoofing();
    applySpoofing();
    forceApplySpoofing();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createControlPanel);
    } else {
        createControlPanel();
    }


    function createControlPanel() {

        GM_addStyle(`
            #mobile-spoof-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 999999;
                background: #fff;
                border: 2px solid #007bff;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                font-family: Arial, sans-serif;
                font-size: 14px;
                min-width: 200px;
                display: none;
            }

            #mobile-spoof-toggle {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 999999;
                background: ${isEnabled ? '#28a745' : '#6c757d'};
                color: white;
                border: none;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                font-size: 12px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
            }

            #mobile-spoof-toggle:hover {
                transform: scale(1.1);
            }

            .spoof-device-option {
                display: block;
                width: 100%;
                padding: 8px;
                margin: 5px 0;
                border: 1px solid #ddd;
                border-radius: 4px;
                background: ${currentDevice === 'iPhone13' ? '#007bff' : '#fff'};
                color: ${currentDevice === 'iPhone13' ? '#fff' : '#333'};
                cursor: pointer;
                text-align: center;
            }

            .spoof-device-option:hover {
                background: #007bff;
                color: white;
            }

            .spoof-status {
                text-align: center;
                margin-bottom: 10px;
                font-weight: bold;
                color: ${isEnabled ? '#28a745' : '#dc3545'};
            }
        `);


        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'mobile-spoof-toggle';
        toggleBtn.innerHTML = isEnabled ? '📱<br>ON' : '💻<br>OFF';
        toggleBtn.title = isEnabled ? '点击关闭移动设备伪装' : '点击开启移动设备伪装';
        document.body.appendChild(toggleBtn);


        const panel = document.createElement('div');
        panel.id = 'mobile-spoof-panel';
        panel.innerHTML = `
            <div class="spoof-status">
                伪装状态: ${isEnabled ? '已启用' : '已禁用'}
            </div>
            <div style="margin-bottom: 10px;">
                <strong>当前设备: ${currentDevice}</strong>
            </div>
            <div style="margin-bottom: 10px;">选择设备类型:</div>
            ${Object.keys(DEVICE_PRESETS).map(device =>
                `<button class="spoof-device-option" data-device="${device}"
                 style="background: ${currentDevice === device ? '#007bff' : '#fff'};
                        color: ${currentDevice === device ? '#fff' : '#333'};">
                    ${device}
                </button>`
            ).join('')}
            <div style="margin-top: 15px; text-align: center;">
                <button id="spoof-close-panel" style="padding: 5px 15px; border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa; cursor: pointer;">
                    关闭面板
                </button>
            </div>
        `;
        document.body.appendChild(panel);


        toggleBtn.addEventListener('click', function() {
            if (panel.style.display === 'none' || !panel.style.display) {
                panel.style.display = 'block';
            } else {
                toggleSpoof();
            }
        });


        toggleBtn.addEventListener('dblclick', function() {
            toggleSpoof();
        });


        panel.addEventListener('click', function(e) {
            if (e.target.classList.contains('spoof-device-option')) {
                const device = e.target.getAttribute('data-device');
                selectDevice(device);
            } else if (e.target.id === 'spoof-close-panel') {
                panel.style.display = 'none';
            }
        });


        document.addEventListener('click', function(e) {
            if (!panel.contains(e.target) && e.target !== toggleBtn) {
                panel.style.display = 'none';
            }
        });
    }


    function toggleSpoof() {
        isEnabled = !isEnabled;
        GM_setValue('spoofEnabled', isEnabled);


        const toggleBtn = document.getElementById('mobile-spoof-toggle');
        if (toggleBtn) {
            toggleBtn.innerHTML = isEnabled ? '📱<br>ON' : '💻<br>OFF';
            toggleBtn.title = isEnabled ? '点击关闭移动设备伪装' : '点击开启移动设备伪装';
            toggleBtn.style.background = isEnabled ? '#28a745' : '#6c757d';
        }


        updatePanelStatus();


        if (isEnabled) {
            forceApplySpoofing();
            applySpoofing();
            showNotification('移动设备伪装已启用，刷新页面或重新输入网址均可生效', 'success');
        } else {
            showNotification('移动设备伪装已禁用，建议刷新页面以恢复正常', 'info');
        }
    }


    function selectDevice(device) {
        if (DEVICE_PRESETS[device]) {
            currentDevice = device;
            GM_setValue('currentDevice', device);


            updatePanelStatus();


            if (isEnabled) {
                forceApplySpoofing();
                applySpoofing();
                showNotification(`已切换到 ${device}，刷新页面或重新输入网址均可生效`, 'success');
            }
        }
    }


    function updatePanelStatus() {
        const panel = document.getElementById('mobile-spoof-panel');
        if (panel) {
            panel.innerHTML = `
                <div class="spoof-status">
                    伪装状态: ${isEnabled ? '已启用' : '已禁用'}
                </div>
                <div style="margin-bottom: 10px;">
                    <strong>当前设备: ${currentDevice}</strong>
                </div>
                <div style="margin-bottom: 10px;">选择设备类型:</div>
                ${Object.keys(DEVICE_PRESETS).map(device =>
                    `<button class="spoof-device-option" data-device="${device}"
                     style="background: ${currentDevice === device ? '#007bff' : '#fff'};
                            color: ${currentDevice === device ? '#fff' : '#333'};">
                        ${device}
                    </button>`
                ).join('')}
                <div style="margin-top: 15px; text-align: center;">
                    <button id="spoof-close-panel" style="padding: 5px 15px; border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa; cursor: pointer;">
                        关闭面板
                    </button>
                </div>
            `;
        }
    }


    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999999;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
            max-width: 300px;
            text-align: center;
            animation: fadeInOut 3s ease-in-out;
        `;

        notification.textContent = message;
        document.body.appendChild(notification);


        if (!document.getElementById('notification-style')) {
            const style = document.createElement('style');
            style.id = 'notification-style';
            style.textContent = `
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    15% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                }
            `;
            document.head.appendChild(style);
        }


        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }


    document.addEventListener('keydown', function(e) {

        if (e.ctrlKey && e.shiftKey && e.key === 'M') {
            e.preventDefault();
            toggleSpoof();
        }

        if (e.ctrlKey && e.shiftKey && e.key === 'P') {
            e.preventDefault();
            const panel = document.getElementById('mobile-spoof-panel');
            if (panel) {
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            }
        }
    });


    function checkSpoofingStatus() {
        if (!isEnabled) return;

        const device = DEVICE_PRESETS[currentDevice];
        if (!device) return;

        const checks = {
            userAgent: navigator.userAgent === device.userAgent,
            platform: navigator.platform === device.platform,
            screenWidth: screen.width === device.width,
            screenHeight: screen.height === device.height,
            touchSupport: 'ontouchstart' in window,
            windowWidth: window.innerWidth === device.width,
            windowHeight: window.innerHeight === device.height
        };

        const failedChecks = Object.entries(checks).filter(([, passed]) => !passed);

        if (failedChecks.length > 0) {
            setTimeout(() => {
                forceApplySpoofing();
                applySpoofing();
            }, 100);
        }
    }


    window.addEventListener('load', function() {
        if (isEnabled) {
            setTimeout(() => {
                forceApplySpoofing();
                applySpoofing();
            }, 100);
            setTimeout(applySpoofing, 500);
            setTimeout(checkSpoofingStatus, 1000);
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
                window.dispatchEvent(new Event('orientationchange'));
            }, 1500);
        }
    });

    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && isEnabled) {
            setTimeout(() => {
                forceApplySpoofing();
                applySpoofing();
            }, 50);
        }
    });

    window.addEventListener('pageshow', function() {
        if (isEnabled) {
            setTimeout(() => {
                forceApplySpoofing();
                applySpoofing();
            }, 50);
        }
    });

    if (isEnabled) {
        setInterval(checkSpoofingStatus, 10000);
    }

})();
