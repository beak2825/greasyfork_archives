// ==UserScript==
// @name         AutoDL 实例列表排序
// @namespace    http://tampermonkey.net/
// @version      2025-05-19
// @description  Hook XMLHttpRequest 容器按时间倒序排列，并将运行中容器排在前面。
// @author       Ganlv
// @match        https://www.autodl.com/*
// @icon         https://www.autodl.com/favicon.png
// @require      https://unpkg.com/natural-compare-lite@1.4.0/index.js
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531223/AutoDL%20%E5%AE%9E%E4%BE%8B%E5%88%97%E8%A1%A8%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/531223/AutoDL%20%E5%AE%9E%E4%BE%8B%E5%88%97%E8%A1%A8%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalXHR = unsafeWindow.XMLHttpRequest;
    unsafeWindow.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        const originalSend = xhr.send;
        xhr.open = function() {
            this.url = arguments[1];
            return originalOpen.apply(this, arguments);
        };
        xhr.send = function() {
            const originalOnReadyStateChange = xhr.onreadystatechange;
            xhr.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    if (this.url && (this.url.includes('/api/v1/sub_user/instance') || this.url.includes('/api/v1/instance'))) {
                        try {
                            const response = JSON.parse(this.responseText);
                            if (response.data && Array.isArray(response.data.list)) {
                                response.data.list.sort((a, b) => {
                                    if (a.status === 'shutdown' && b.status !== 'shutdown') {
                                        return 1;
                                    }
                                    if (a.status !== 'shutdown' && b.status === 'shutdown') {
                                        return -1;
                                    }
                                    return b.started_at.Time.localeCompare(a.started_at.Time);
                                });
                                Object.defineProperty(this, 'responseText', {
                                    get: function() {
                                        return JSON.stringify(response);
                                    }
                                });
                            }
                        } catch (e) {
                            console.error('Error processing response:', e);
                        }
                    }
                    if (this.url && (this.url.includes('/api/v1/sub_user/deployment/list') || this.url.includes('/api/v1/deployment/list'))) {
                        try {
                            const response = JSON.parse(this.responseText);
                            if (response.data && Array.isArray(response.data.list)) {
                                response.data.list.sort((a, b) => {
                                    if (a.replica_num == 0 && b.replica_num == 0) {
                                        return naturalCompare(a.name, b.name);
                                    } else if (a.replica_num == 0) {
                                        return 1
                                    } else if (b.replica_num == 0) {
                                        return -1
                                    }
                                    return naturalCompare(a.name, b.name);
                                });
                                Object.defineProperty(this, 'responseText', {
                                    get: function() {
                                        return JSON.stringify(response);
                                    }
                                });
                            }
                        } catch (e) {
                            console.error('Error processing response:', e);
                        }
                    }
                }
                if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(this, arguments);
                }
            };
            return originalSend.apply(this, arguments);
        };
        return xhr;
    };
})();
