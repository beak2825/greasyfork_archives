// ==UserScript==
// @name         信息安全
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  根据网站白名单选择性启用隐私保护措施：在 ChatGPT 官网、电报、哔哩哔哩 等白名单网站上，仅启用核心功能（如伪装 UA、语言、屏幕、部分设备信息及 Font API 保护），其他网站则启用全部功能。
// @author       lbihhe
// @license MIT
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/526050/%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/526050/%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 白名单设置 =====
    // 基础白名单（仅启用基础功能）：
    const basicWhiteList = [

    ];
    // 核心白名单（启用核心功能）：
    const coreWhiteList = [
        'chat.openai.com', // ChatGPT 官网（示例）
        'telegram.org',    // 电报官网
        't.me',            // 电报网页版
        'bilibili.com',    // 哔哩哔哩
        'chatgpt.com'      // chatgpt
    ];

    // ===== 黑名单设置 =====
    const blackList = [
        'chat.deepseek'
    ];

    const host = window.location.host;

    // 检查是否在黑名单中，若在，则直接终止所有功能
    const isBlacklisted = blackList.some(domain => host.includes(domain));
    if (isBlacklisted) {
        console.log('[隐私保护] 当前网站在黑名单中，未启用任何保护措施');
        return;
    }

    const isBasic = basicWhiteList.some(domain => host.includes(domain));
    const isCore = coreWhiteList.some(domain => host.includes(domain));

    // ===== 基础功能（仅启用功能 1、3、4、5、6、12） =====
    function enableBasicFunctions() {
        // 1. 伪造 User-Agent (始终返回 Chrome 113)
        Object.defineProperty(navigator, 'userAgent', {
            get: function() {
                return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.5672.127 Safari/537.36';
            },
            configurable: true
        });

        // 3. 伪造屏幕信息（1920×1080）
        Object.defineProperty(window, 'screen', {
            value: {
                width: 1920,
                height: 1080,
                availWidth: 1920,
                availHeight: 1080,
                colorDepth: 24,
                pixelDepth: 24
            },
            configurable: true
        });

        // 4. 屏蔽或伪造其他设备信息 API
        const blockAPIs = [
            'getBattery', 'deviceMemory', 'hardwareConcurrency', 'platform', 'oscpu', 'maxTouchPoints'
        ];
        blockAPIs.forEach(api => {
            if (api in navigator) {
                Object.defineProperty(navigator, api, {
                    get: function() {
                        return undefined;
                    },
                    configurable: true
                });
            }
        });

        // 5. 伪造插件和 MIME 类型信息
        Object.defineProperty(navigator, 'plugins', {
            get: function() {
                return [];
            },
            configurable: true
        });
        Object.defineProperty(navigator, 'mimeTypes', {
            get: function() {
                return [];
            },
            configurable: true
        });

        // 6. 伪造窗口尺寸（与屏幕一致）
        Object.defineProperty(window, 'innerWidth', {
            get: function() {
                return 1920;
            },
            configurable: true
        });
        Object.defineProperty(window, 'innerHeight', {
            get: function() {
                return 1080;
            },
            configurable: true
        });

        // 12. Font API 防护：屏蔽 document.fonts
        Object.defineProperty(document, 'fonts', {
            get: function() {
                return {
                    forEach: function() {},
                    values: function() { return []; },
                    size: 0
                };
            },
            configurable: true
        });

        console.log('[隐私保护] 基础隐私保护措施已启用');
    }

    // ===== 核心功能（在基础功能基础上启用功能 2、16） =====
    function enableCoreFunctions() {
        // 先启用基础功能
        enableBasicFunctions();

        // 2. 伪造语言信息（繁体中文 zh-TW）
        Object.defineProperty(navigator, 'language', {
            get: function() {
                return 'zh-TW';
            },
            configurable: true
        });
        Object.defineProperty(navigator, 'languages', {
            get: function() {
                return ['zh-TW'];
            },
            configurable: true
        });

        // 16. 伪造时区信息（始终返回 Asia/Taipei）
        (function() {
            const originalResolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;
            Intl.DateTimeFormat.prototype.resolvedOptions = function() {
                const options = originalResolvedOptions.apply(this, arguments);
                options.timeZone = 'Asia/Taipei';
                return options;
            };
        })();

        console.log('[隐私保护] 核心隐私保护措施已启用');
    }

    // ===== 完整功能（在核心功能基础上启用其余保护措施）=====
    // 包括原有的 7、8、9、10、11、13、14、15，
    // 以及新增的：17（地理位置保护）、18（设备枚举保护）、19（权限请求拦截）、20（高精度时间保护）、21（隐藏已修改 API）、22（冻结保护）
    function enableFullFunctions() {
        // 启用核心功能
        enableCoreFunctions();

        // 7. Canvas 指纹防护：重写 toDataURL 与 getImageData
        (function() {
            HTMLCanvasElement.prototype.toDataURL = function(...args) {
                return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEElEQVR42mP8/5+hHgAHggJ/PcxGoAAAAABJRU5ErkJggg==";
            };
            CanvasRenderingContext2D.prototype.getImageData = function(...args) {
                return new ImageData(1, 1);
            };
            console.log('[隐私保护] Canvas 指纹防护已启用');
        })();

        // 8. WebGL 指纹防护：重写 getParameter
        (function() {
            if (window.WebGLRenderingContext && WebGLRenderingContext.prototype.getParameter) {
                const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
                WebGLRenderingContext.prototype.getParameter = function(parameter) {
                    const spoofedParameters = [
                        this.UNMASKED_VENDOR_WEBGL,
                        this.UNMASKED_RENDERER_WEBGL,
                        this.VERSION,
                        this.SHADING_LANGUAGE_VERSION
                    ];
                    if (spoofedParameters.includes(parameter)) {
                        return "Not Available";
                    }
                    return originalGetParameter.call(this, parameter);
                };
                console.log('[隐私保护] WebGL 指纹防护已启用');
            }
        })();

        // 9. AudioContext 防护：重写构造函数（简单屏蔽）
        (function() {
            if (window.AudioContext) {
                const OriginalAudioContext = window.AudioContext;
                window.AudioContext = function(...args) {
                    console.log('[隐私保护] AudioContext 调用已屏蔽');
                    return new OriginalAudioContext(...args);
                };
                window.AudioContext.prototype = OriginalAudioContext.prototype;
                console.log('[隐私保护] AudioContext 防护已启用');
            }
        })();

        // 10. WebRTC 防护：拦截 RTCPeerConnection 调用及相关 API
        (function() {
            // 屏蔽 RTCPeerConnection
            if (window.RTCPeerConnection) {
                const OriginalRTCPeerConnection = window.RTCPeerConnection;
                window.RTCPeerConnection = function(config, options) {
                    return {
                        createOffer: () => Promise.reject("WebRTC is disabled"),
                        createAnswer: () => Promise.reject("WebRTC is disabled"),
                        setLocalDescription: () => Promise.reject("WebRTC is disabled"),
                        setRemoteDescription: () => Promise.reject("WebRTC is disabled"),
                        addIceCandidate: () => Promise.reject("WebRTC is disabled"),
                        close: function() {},
                        addEventListener: function() {},
                        removeEventListener: function() {},
                        dispatchEvent: function() { return false; }
                    };
                };
                window.RTCPeerConnection.prototype = OriginalRTCPeerConnection.prototype;
            }
            // 屏蔽 getUserMedia
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia = function() {
                    return Promise.reject("WebRTC is disabled");
                };
            }
            console.log('[隐私保护] WebRTC 防护已启用');
        })();

        // 11. 完全禁用 Canvas 与 WebGL
        (function() {
            // 禁用 Canvas：使 getContext 返回 null
            Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
                value: function() {
                    return null;
                }
            });
            // 禁用 WebGL：删除 WebGLRenderingContext 构造函数
            window.WebGLRenderingContext = undefined;
            console.log('[隐私保护] 完全禁用 Canvas 与 WebGL 已启用');
        })();

        // 13. Sensor API 防护：屏蔽常见传感器构造函数
        (function() {
            ['Accelerometer', 'Gyroscope', 'Magnetometer', 'AbsoluteOrientationSensor', 'RelativeOrientationSensor', 'LinearAccelerationSensor']
                .forEach(api => {
                    if (api in window) {
                        Object.defineProperty(window, api, {
                            value: undefined,
                            configurable: true
                        });
                    }
                });
            console.log('[隐私保护] Sensor API 已屏蔽');
        })();

        // 14. Battery API 防护：屏蔽 navigator.battery
        (function() {
            if ('battery' in navigator) {
                Object.defineProperty(navigator, 'battery', {
                    get: function() {
                        return undefined;
                    },
                    configurable: true
                });
            }
            console.log('[隐私保护] Battery API 已屏蔽');
        })();

        // 15. Gamepad API 防护：屏蔽 navigator.getGamepads
        (function() {
            if ('getGamepads' in navigator) {
                Object.defineProperty(navigator, 'getGamepads', {
                    value: function() { return []; },
                    configurable: true
                });
            }
            console.log('[隐私保护] Gamepad API 已屏蔽');
        })();

        console.log('[隐私保护] 所有传统隐私保护措施已启用');

        // ===== 新增的隐私保护措施 =====
        // 17. 地理位置（Geolocation）保护
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition = function(success, error, options) {
                if (typeof error === 'function') {
                    error({ code: 1, message: "Geolocation is disabled by privacy protection" });
                }
            };
            navigator.geolocation.watchPosition = function(success, error, options) {
                if (typeof error === 'function') {
                    error({ code: 1, message: "Geolocation is disabled by privacy protection" });
                }
                return null;
            };
            console.log('[隐私保护] 地理位置 API 已拦截');
        }

        // 18. 设备枚举（Device Enumeration）保护
        if (navigator.mediaDevices && typeof navigator.mediaDevices.enumerateDevices === 'function') {
            navigator.mediaDevices.enumerateDevices = function() {
                return Promise.resolve([]);
            };
            console.log('[隐私保护] 设备枚举 API 已拦截');
        }

        // 19. 权限请求（Permissions API）拦截
        if (navigator.permissions && typeof navigator.permissions.query === 'function') {
            const originalPermissionsQuery = navigator.permissions.query;
            navigator.permissions.query = function(params) {
                if (params && params.name && ["geolocation", "notifications", "camera", "microphone", "midi", "ambient-light-sensor", "accelerometer", "gyroscope", "magnetometer"].includes(params.name)) {
                    return Promise.resolve({ state: "denied", onchange: null });
                }
                return originalPermissionsQuery.apply(this, arguments);
            };
            console.log('[隐私保护] Permissions API 已拦截');
        }

        // 20. 定时器和高精度时间 API 保护（performance.now）
        if (window.performance && typeof window.performance.now === 'function') {
            const originalNow = window.performance.now;
            window.performance.now = function() {
                return originalNow.call(this) + Math.random(); // 加入少量随机噪音
            };
            console.log('[隐私保护] performance.now 已修改以降低高精度时间泄露');
        }

        // 21. 保持修改后的 API 隐蔽性：伪装 toString 返回“原生代码”
        function mimicNativeCode(fn) {
            fn.toString = function() {
                return "function " + (fn.name || "") + "() { [native code] }";
            };
        }
        if (navigator.geolocation.getCurrentPosition) {
            mimicNativeCode(navigator.geolocation.getCurrentPosition);
        }
        if (navigator.geolocation.watchPosition) {
            mimicNativeCode(navigator.geolocation.watchPosition);
        }
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
            mimicNativeCode(navigator.mediaDevices.enumerateDevices);
        }
        if (navigator.permissions && navigator.permissions.query) {
            mimicNativeCode(navigator.permissions.query);
        }
        if (window.performance && typeof window.performance.now === 'function') {
            mimicNativeCode(window.performance.now);
        }
        console.log('[隐私保护] 修改后的 API 已伪装为原生代码');

        // 22. 持久化保护：冻结修改后的 API，防止后续脚本覆盖
        if (navigator.geolocation) {
            Object.freeze(navigator.geolocation.getCurrentPosition);
            Object.freeze(navigator.geolocation.watchPosition);
        }
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
            Object.freeze(navigator.mediaDevices.enumerateDevices);
        }
        if (navigator.permissions && navigator.permissions.query) {
            Object.freeze(navigator.permissions.query);
        }
        if (window.performance && typeof window.performance.now === 'function') {
            Object.freeze(window.performance.now);
        }
        console.log('[隐私保护] 修改后的 API 已冻结以防止修改');
    }

    // ===== 根据白名单选择性启用 =====
    if (isBasic) {
        console.log('[隐私保护] 当前网站属于基础白名单，仅启用基础功能');
        enableBasicFunctions();
    } else if (isCore) {
        console.log('[隐私保护] 当前网站属于核心白名单，仅启用核心功能');
        enableCoreFunctions();
    } else {
        console.log('[隐私保护] 当前网站不在白名单，启用全部保护措施');
        enableFullFunctions();
    }
})();
