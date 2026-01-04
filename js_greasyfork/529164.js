// ==UserScript==
// @name         YouTube 双语字幕下载 / YouTube Biligual Subtitles Downloader
// @namespace    https://github.com/Nehemiab/YouTube-Biligual-Subtitles-Downloader
// @version      1.0.1
// @description  在 YouTube 页面添加双语字幕，支持双语字幕下载
// @author       NEHEMIAB
// @match        *://www.youtube.com/watch?v=*
// @match        *://www.youtube.com
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-end
// @copyright    2025,NEHEMIAB(https://github.com/Nehemiab/YouTube-Biligual-Subtitles-Downloader)
// @license      MIT
// @thanks       Coink,Claude
// @downloadURL https://update.greasyfork.org/scripts/529164/YouTube%20%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95%E4%B8%8B%E8%BD%BD%20%20YouTube%20Biligual%20Subtitles%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/529164/YouTube%20%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95%E4%B8%8B%E8%BD%BD%20%20YouTube%20Biligual%20Subtitles%20Downloader.meta.js
// ==/UserScript==

(function() {
    // 全局变量储存处理后的字幕数据
    let ytSubtitleData = null;

    function hookit(){
        (function(global, factory) {
            // 将工厂函数的所有导出赋给全局对象
            for (var key in factory) {
            global[key] = factory[key];
            }
        })(window, (function() {
            'use strict';

            // 支持的XHR事件类型
            var events = ['load', 'loadend', 'timeout', 'error', 'readystatechange', 'abort'];
            var XHR_PROXY_KEY = '__xhr';

            /**
             * 配置事件对象
             * @param {Event} event - 原始事件对象
             * @param {Object} target - 事件的目标对象
             * @return {Event} 配置好的事件对象
             */
            function configEvent(event, target) {
            var eventCopy = {};
            for (var key in event) {
                eventCopy[key] = event[key];
            }
            eventCopy.target = eventCopy.currentTarget = target;
            return eventCopy;
            }

            /**
             * 钩住XMLHttpRequest
             * @param {Object} hooks - 包含各种钩子的对象
             * @param {Window} win - window对象，默认为全局window
             * @return {Function} 修改后的XMLHttpRequest构造函数
             */
            function hook(hooks, win) {
            win = win || window;

            // 保存原始的XMLHttpRequest
            win[XHR_PROXY_KEY] = win[XHR_PROXY_KEY] || win.XMLHttpRequest;

            // 创建新的XMLHttpRequest构造函数
            win.XMLHttpRequest = function() {
                var xhr = new win[XHR_PROXY_KEY]();

                // 确保所有事件处理程序属性存在
                for (var i = 0; i < events.length; ++i) {
                var eventName = 'on' + events[i];
                if (xhr[eventName] === undefined) {
                    xhr[eventName] = null;
                }
                }

                // 为每个属性和方法创建代理
                for (var prop in xhr) {
                var type = '';
                try {
                    type = typeof xhr[prop];
                } catch(e) { }

                if (type === 'function') {
                    // 代理方法
                    this[prop] = createMethodProxy(prop);
                } else {
                    // 代理属性
                    Object.defineProperty(this, prop, {
                    get: createGetter(prop),
                    set: createSetter(prop),
                    enumerable: true
                    });
                }
                }

                var self = this;
                xhr.getProxy = function() { return self; };
                this.xhr = xhr;
            };

            // 复制XMLHttpRequest的静态属性
            Object.assign(win.XMLHttpRequest, {
                UNSENT: 0,
                OPENED: 1,
                HEADERS_RECEIVED: 2,
                LOADING: 3,
                DONE: 4
            });

            /**
             * 创建属性getter代理
             */
            function createGetter(prop) {
                return function() {
                var value = this.hasOwnProperty(prop + '_') ?
                    this[prop + '_'] : this.xhr[prop];
                var getter = (hooks[prop] || {}).getter;
                return getter && getter(value, this) || value;
                };
            }

            /**
             * 创建属性setter代理
             */
            function createSetter(prop) {
                return function(value) {
                var xhr = this.xhr;
                var self = this;
                var hook = hooks[prop];

                if (prop.substring(0, 2) === 'on') {
                    // 事件处理程序
                    self[prop + '_'] = value;
                    xhr[prop] = function(e) {
                    e = configEvent(e, self);
                    if (hook && hook.call(self, xhr, e)) {
                        return;
                    }
                    value.call(self, e);
                    };
                } else {
                    // 常规属性
                    var setter = (hook || {}).setter;
                    value = setter && setter(value, self) || value;
                    this[prop + '_'] = value;
                    try {
                    xhr[prop] = value;
                    } catch(e) { }
                }
                };
            }

            /**
             * 创建方法代理
             */
            function createMethodProxy(method) {
                return function() {
                var args = [].slice.call(arguments);
                var hook = hooks[method];

                if (hook) {
                    var result = hook.call(this, args, this.xhr);
                    if (result) {
                    return result;
                    }
                }

                return this.xhr[method].apply(this.xhr, args);
                };
            }

            return win.XMLHttpRequest;
            }

            /**
             * 解除钩子
             * @param {Window} win - window对象，默认为全局window
             */
            function unHook(win) {
            win = win || window;
            if (win[XHR_PROXY_KEY]) {
                win.XMLHttpRequest = win[XHR_PROXY_KEY];
            }
            win[XHR_PROXY_KEY] = undefined;
            }

            /**
             * 代理XHR请求
             */
            function proxy(options, win) {
            if (win = win || window, win.__xhr) {
                throw "Ajax is already hooked.";
            }
            return proxyXhr(options, win);
            }

            /**
             * 解除代理
             */
            function unProxy(win) {
            unHook(win);
            }

            /**
             * 创建XHR代理
             */
            function proxyXhr(options, win) {
            var onRequest = options.onRequest;
            var onResponse = options.onResponse;
            var onError = options.onError;

            return hook({
                // 处理事件
                onload: returnTrue,
                onloadend: returnTrue,
                onerror: createErrorHandler('error'),
                ontimeout: createErrorHandler('timeout'),
                onabort: createErrorHandler('abort'),

                onreadystatechange: function(xhr) {
                if (xhr.readyState === 4 && xhr.status !== 0) {
                    handleResponse(xhr, this);
                } else if (xhr.readyState !== 4) {
                    triggerEvent(xhr, 'readystatechange');
                }
                return true;
                },

                // 处理方法
                open: function(args, xhr) {
                var self = this;
                var config = xhr.config = { headers: {} };

                config.method = args[0];
                config.url = args[1];
                config.async = args[2];
                config.user = args[3];
                config.password = args[4];
                config.xhr = xhr;

                var eventName = 'onreadystatechange';
                if (!xhr[eventName]) {
                    xhr[eventName] = function() {
                    return handleReadyStateChange(xhr, self);
                    };
                }

                if (onRequest) return true;
                },

                send: function(args, xhr) {
                var config = xhr.config;
                config.withCredentials = xhr.withCredentials;
                config.body = args[0];

                if (onRequest) {
                    var callback = function() {
                    onRequest(config, new RequestHandler(xhr));
                    };

                    if (config.async === false) {
                    callback();
                    } else {
                    setTimeout(callback);
                    }
                    return true;
                }
                },

                setRequestHeader: function(args, xhr) {
                xhr.config.headers[args[0].toLowerCase()] = args[1];
                if (onRequest) return true;
                },

                addEventListener: function(args, xhr) {
                var self = this;
                if (events.indexOf(args[0]) !== -1) {
                    var listener = args[1];

                    getWatcher(xhr).addEventListener(args[0], function(e) {
                    var event = configEvent(e, self);
                    event.type = args[0];
                    event.isTrusted = true;
                    listener.call(self, event);
                    });

                    return true;
                }
                },

                getAllResponseHeaders: function(args, xhr) {
                var headers = xhr.resHeader;
                if (headers) {
                    var result = '';
                    for (var key in headers) {
                    result += key + ': ' + headers[key] + '\r\n';
                    }
                    return result;
                }
                },

                getResponseHeader: function(args, xhr) {
                var headers = xhr.resHeader;
                if (headers) {
                    return headers[(args[0] || '').toLowerCase()];
                }
                }
            }, win);

            /**
             * 处理响应
             */
            function handleResponse(xhr, xhrProxy) {
                var response = {
                response: xhrProxy.response || xhrProxy.responseText,
                status: xhrProxy.status,
                statusText: xhrProxy.statusText,
                config: xhr.config,
                headers: xhr.resHeader || parseHeaders(xhrProxy.getAllResponseHeaders())
                };

                if (!onResponse) {
                new ResponseHandler(xhr).resolve(response);
                return;
                }

                onResponse(response, new ResponseHandler(xhr));
            }

            /**
             * 处理错误
             */
            function createErrorHandler(type) {
                return function(xhr, e) {
                handleError(xhr, this, e, type);
                return true;
                };
            }

            function handleError(xhr, xhrProxy, error, type) {
                var errorObject = {
                config: xhr.config,
                error: error,
                type: type
                };

                var handler = new ErrorHandler(xhr);

                if (onError) {
                onError(errorObject, handler);
                } else {
                handler.next(errorObject);
                }
            }

            function handleReadyStateChange(xhr, xhrProxy) {
                return xhr.readyState === 4 && xhr.status !== 0 ?
                handleResponse(xhr, xhrProxy) :
                xhr.readyState !== 4 && triggerEvent(xhr, 'readystatechange');
            }

            function returnTrue() {
                return true;
            }
            }

            // 辅助函数
            function trim(str) {
            return str.replace(/^\s+|\s+$/g, '');
            }

            function getWatcher(xhr) {
            return xhr.watcher || (xhr.watcher = document.createElement('a'));
            }

            function triggerEvent(xhr, type) {
            var xhrProxy = xhr.getProxy();
            var eventKey = 'on' + type + '_';
            var event = configEvent({ type: type }, xhrProxy);

            if (xhrProxy[eventKey]) {
                xhrProxy[eventKey](event);
            }

            var customEvent;
            if (typeof Event === 'function') {
                customEvent = new Event(type, { bubbles: false });
            } else {
                customEvent = document.createEvent('Event');
                customEvent.initEvent(type, false, true);
            }

            getWatcher(xhr).dispatchEvent(customEvent);
            }

            function parseHeaders(headerString) {
            return headerString.split('\r\n').reduce(function(headers, line) {
                if (line === '') return headers;

                var parts = line.split(':');
                var key = parts.shift();
                var value = trim(parts.join(':'));
                headers[key] = value;
                return headers;
            }, {});
            }

            // Handler类实现
            var PROTO = 'prototype';

            // 基础Handler
            function Handler(xhr) {
            this.xhr = xhr;
            this.xhrProxy = xhr.getProxy();
            }

            Handler[PROTO] = Object.create({
            resolve: function(response) {
                var xhrProxy = this.xhrProxy;
                var xhr = this.xhr;

                xhrProxy.readyState = 4;
                xhr.resHeader = response.headers;
                xhrProxy.response = xhrProxy.responseText = response.response;
                xhrProxy.statusText = response.statusText;
                xhrProxy.status = response.status;

                triggerEvent(xhr, 'readystatechange');
                triggerEvent(xhr, 'load');
                triggerEvent(xhr, 'loadend');
            },
            reject: function(error) {
                this.xhrProxy.status = 0;
                triggerEvent(this.xhr, error.type);
                triggerEvent(this.xhr, 'loadend');
            }
            });

            // 创建链式Handler工厂
            function createHandler(nextHandler) {
            function ChainedHandler(xhr) {
                Handler.call(this, xhr);
            }

            ChainedHandler[PROTO] = Object.create(Handler[PROTO]);
            ChainedHandler[PROTO].next = nextHandler;

            return ChainedHandler;
            }

            // 具体的Handler实现
            var RequestHandler = createHandler(function(config) {
            var xhr = this.xhr;
            config = config || xhr.config;

            xhr.withCredentials = config.withCredentials;
            xhr.open(config.method, config.url, config.async !== false, config.user, config.password);

            for (var key in config.headers) {
                xhr.setRequestHeader(key, config.headers[key]);
            }

            xhr.send(config.body);
            });

            var ResponseHandler = createHandler(function(response) {
            this.resolve(response);
            });

            var ErrorHandler = createHandler(function(error) {
            this.reject(error);
            });

            // 导出API
            return {
            ah: {
                proxy: proxy,
                unProxy: unProxy,
                hook: hook,
                unHook: unHook
            }
            };
        })());
            let localeLang = document.documentElement.lang || navigator.language || 'en' // follow the language used in YouTube Page
                // localeLang = 'zh'  // uncomment this line to define the language you wish here
            ah.proxy({
                onRequest: (config, handler) => {
                    handler.next(config);
                },
                onResponse: (response, handler) => {
                    if (response.config.url.includes('/api/timedtext') && !response.config.url.includes('&translate_h00ked')) {
                        let xhr = new XMLHttpRequest();
                        // Use RegExp to clean '&tlang=...' in our xhr request params while using Y2B auto translate.
                        let url = response.config.url
                        url = url.replace(/(^|[&?])tlang=[^&]*/g, '')
                        url = `${url}&tlang=${localeLang}&translate_h00ked`
                        xhr.open('GET', url, false);
                        xhr.send();
                        let defaultJson = null
                        if (response.response) {
                            const jsonResponse = JSON.parse(response.response)
                            if (jsonResponse.events) defaultJson = jsonResponse
                        }
                        const localeJson = JSON.parse(xhr.response)
                        let isOfficialSub = true;
                        for (const defaultJsonEvent of defaultJson.events) {
                            if (defaultJsonEvent.segs && defaultJsonEvent.segs.length > 1) {
                                isOfficialSub = false;
                                break;
                            }
                        }
                        // Merge default subs with locale language subs
                        if (isOfficialSub) {
                            // when length of segments are the same
                            for (let i = 0, len = defaultJson.events.length; i < len; i++) {
                                const defaultJsonEvent = defaultJson.events[i]
                                if (!defaultJsonEvent.segs) continue
                                const localeJsonEvent = localeJson.events[i]
                                if (`${defaultJsonEvent.segs[0].utf8}`.trim() !== `${localeJsonEvent.segs[0].utf8}`.trim()) {
                                    // avoid merge subs while the are the same
                                    defaultJsonEvent.segs[0].utf8 += ('\n' + localeJsonEvent.segs[0].utf8)
                                }
                            }

                        } else {
                            // when length of segments are not the same (e.g. automatic generated english subs)
                            let pureLocalEvents = localeJson.events.filter(event => event.aAppend !== 1 && event.segs)
                            for (const defaultJsonEvent of defaultJson.events) {
                                if (!defaultJsonEvent.segs) continue
                                let currentStart = defaultJsonEvent.tStartMs,
                                    currentEnd = currentStart + defaultJsonEvent.dDurationMs
                                let currentLocalEvents = pureLocalEvents.filter(pe => currentStart <= pe.tStartMs && pe.tStartMs < currentEnd)
                                let localLine = ''
                                for (const ev of currentLocalEvents) {
                                    for (const seg of ev.segs) {
                                        localLine += seg.utf8
                                    }
                                    localLine += '﻿'; // add ZWSP to avoid words stick together
                                }
                                let defaultLine = ''
                                for (const seg of defaultJsonEvent.segs) {
                                    defaultLine += seg.utf8
                                }
                                defaultJsonEvent.segs[0].utf8 = defaultLine + '\n' + localLine
                                defaultJsonEvent.segs = [defaultJsonEvent.segs[0]]
                            }

                        }
                        ytSubtitleData = defaultJson;
                        response.response = JSON.stringify(defaultJson);
                    }
                    handler.resolve(response)
                }
            })
    }
    window.addEventListener('yt-navigate-finish', hookit)
    window.addEventListener('load',function(){
        if(this.window.location.href.includes('watch?v=')){
            this.setTimeout(addDownloadButton, 1000)
        }
    }
    )
    function addDownloadButton() {
        // 检查按钮是否已存在
        if (document.getElementById('download-subtitle-btn')) return;

        // 创建按钮元素
        const downloadBtn = document.createElement('button');
        downloadBtn.id = 'download-subtitle-btn';
        downloadBtn.innerText = '下载字幕';
        downloadBtn.style.cssText = `
            background-color: orange;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 5px 10px;
            margin: 5px;
            cursor: pointer;
            font-weight: bold;
        `;

        downloadBtn.addEventListener('click', menu);

        // 将按钮添加到up主信息旁边
        const ownerElement = document.querySelector('#owner');
        if (ownerElement) {
            const customBtn = document.createElement('div');
            customBtn.style.cssText = 'display: inline-block; margin-right: 10px;';
            customBtn.appendChild(downloadBtn);
            ownerElement.appendChild(customBtn, ownerElement.firstChild);
        }
        else {
            // 备选方案，添加到视频上方
            const videoContainer = document.querySelector('.html5-video-container');
            if (videoContainer) {
                const btnContainer = document.createElement('div');
                btnContainer.style.cssText = 'position: absolute; top: 10px; left: 10px; z-index: 1000;';
                btnContainer.appendChild(downloadBtn);
                videoContainer.parentNode.insertBefore(btnContainer, videoContainer);
            }
        }
    }

    function menu() {
        // 获取当前视频标题
        const videoTitle = document.querySelector('h1.ytd-watch-metadata')?.textContent?.trim() || 'youtube_subtitle';

        if (ytSubtitleData && ytSubtitleData.events) {
            // 转换为SRT格式
            const srtContent = convertToSRT(ytSubtitleData.events);

            // 创建下载链接
            downloadSubtitle(srtContent, `${videoTitle}.srt`);
        } else {
            alert('请重启视频字幕，然后再尝试下载');
        }
    }

    // 将YouTube字幕数据转换为SRT格式
    function convertToSRT(events) {
        let srtContent = '';
        let index = 1;

        for (const event of events) {
            // 只处理有文字内容的事件
            if (!event.segs || event.segs.length === 0) continue;

            // 获取开始和结束时间
            const startMs = event.tStartMs;
            const endMs = startMs + event.dDurationMs;

            // 获取文本内容
            let text = '';
            for (const seg of event.segs) {
                if (seg.utf8) text += seg.utf8;
            }

            // 跳过空白字幕
            if (!text.trim()) continue;

            // 添加到SRT内容
            srtContent += `${index}\n`;
            srtContent += `${formatTime(startMs)} --> ${formatTime(endMs)}\n`;
            srtContent += `${text}\n\n`;

            index++;
        }

        return srtContent;
    }

    // 格式化毫秒时间为SRT时间格式 (00:00:00,000)
    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor(ms % 1000);

        return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)},${padZero(milliseconds, 3)}`;
    }

    // 数字前补零
    function padZero(num, length = 2) {
        return num.toString().padStart(length, '0');
    }

    // 下载字幕文件
    function downloadSubtitle(content, filename) {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';

        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }
})();
