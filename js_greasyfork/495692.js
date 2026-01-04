// ==UserScript==
// @name         CNKI-TRANSLATE-SECRET-EXPORT
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  导出知网翻译的会话凭据 (Authorization, Token, Cookie)，通过按下 Ctrl + / 键，即可导出会话凭据。
// @author       JoyofFire
// @match        https://dict.cnki.net/index*
// @icon         https://dict.cnki.net/favicon.ico
// @grant        none
// @run-at       document-start
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/495692/CNKI-TRANSLATE-SECRET-EXPORT.user.js
// @updateURL https://update.greasyfork.org/scripts/495692/CNKI-TRANSLATE-SECRET-EXPORT.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const TRANS_PATH = "/fyzs-front-api/translate/literaltranslation";
    const TRIGGER_KEY = "Slash";
    const CAPTURE_LIST = [
        { "header": "authorization", "optional": true } ,
        { "header": "token", "optional": false } ,
    ];

    /**
     * @param {Map<string, string>} headers
     * @returns {string}
     */
    function headersToString(headers) {
        return Array
            .from(headers.entries())
            .map(([k, v]) => `${k}: ${v}`)
            .join("\n");
    }

    /**
     * @param {Map<string, string>} headers
     * @param {string} cookie
     * @returns {Map<string, string>}
     */
    function addCookie(headers, cookie) {
        return new Map([...headers, ["cookie", cookie]]);
    }

    /**
     * @param {string} header
     * @param {Array<{ header: string, optional: boolean }>} captureList
     * @returns {boolean}
     */
    function shouldCaptureHeader(header, captureList) {
        return captureList
            .map(item => item.header)
            .includes(header.toLowerCase());
    }

    /**
     * @param {string} message
     */
    function displayMessage(message) {
        setTimeout(() => {
            console.info(message);
            alert(message);
        }, 500);
    }

    /**
     * @param {string} text
     * @returns {Promise<void>}
     */
    function copyToClipboard(text) {
        return navigator.clipboard.writeText(text)
            .then(() => displayMessage("成功复制会话凭据到剪贴板！"))
            .catch(err => displayMessage("凭据复制到剪贴板失败！", err));
    }

    /**
     * @param {(...args) => void} open
     * @param {(header: string, value: string) => void} setRequestHeader
     * @param {string} translatePath
     * @param {(header: string, value: string) => void} onRequestHeaderCaptured
     */
    function hookXHR(open, setRequestHeader, translatePath, onRequestHeaderCaptured) {
        XMLHttpRequest.prototype.open = function(...args) {
            if (args[1].trim() === translatePath) {
                console.info(...args);

                this.setRequestHeader = function(...args2) {
                    console.info(...args2);
                    onRequestHeaderCaptured(...args2);
                    return setRequestHeader.apply(this, args2);
                };
            }
            return open.apply(this, args);
        };
    }

    /**
     * @param {string} translatePath
     * @param {(header: string, value: string) => void} onRequestHeaderCaptured
     */
    function hookTranslateAPI(translatePath, onRequestHeaderCaptured) {
        const xhrOpen = XMLHttpRequest.prototype.open;
        const xhrSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

        hookXHR(xhrOpen, xhrSetRequestHeader, translatePath, onRequestHeaderCaptured);

        displayMessage("已经 hook 了翻译请求，请翻译任意内容以导出会话凭据！");
    }

    /**
     * @param {Map<string, string>} headers
     * @param {Array<{ header: string, optional: boolean }>} captureList
     * @returns {boolean}
     */
    function isReadyToExport(headers, captureList) {
        return captureList
            .every((item) =>
                headers.has(item.header.toLowerCase())  // 要么捕获了
                || item.optional  // 要么是可选的
            );
    }

    /**
     * @param {{ headers: Map<string, string>, captureList: Array<{ header: string, optional: boolean }> }} capture
     * @param {(secret: string) => void} onComplete
     * @param {{ xhrOpen: (...args) => void, xhrSetRequestHeader: (header: string, value: string) => void }} originXhr
     * @returns {(header: string, value: string) => void}
     */
    function createHeaderCapturer(capture, onComplete, originXhr) {
        const { headers, captureList } = capture;
        const { xhrOpen, xhrSetRequestHeader } = originXhr;

        /**
         * @param {string} header
         * @param {string} value
         */
        return function(header, value) {
            if (shouldCaptureHeader(header, captureList)) {
                headers.set(header.toLowerCase(), value);
            }

            if (isReadyToExport(headers, captureList)) {
                const cookie = document.cookie;
                const updatedHeaders = addCookie(headers, cookie);
                const secret = headersToString(updatedHeaders);
                console.info("会话凭据：", secret);
                onComplete(secret);

                // 恢复 xhr 原型方法
                XMLHttpRequest.prototype.open = xhrOpen;
                XMLHttpRequest.prototype.setRequestHeader = xhrSetRequestHeader;
            }
        };
    }

    /**
     * @param {(header: string, value: string) => void} onRequestHeaderCaptured
     * @param {string} translatePath
     * @returns {(ctrlKey: boolean, code: string) => void}
     */
    function createKeydownListener(onRequestHeaderCaptured, translatePath) {
        return function(ctrlKey, code) {
            const controller = new AbortController();
            const signal = controller.signal;

            addEventListener("keydown", (event) => {
                if ((event.ctrlKey === ctrlKey) && event.code === code) {
                    event.stopPropagation();
                    hookTranslateAPI(translatePath, onRequestHeaderCaptured);
                    console.info("开始监听翻译请求");
                    controller.abort(); // 移除事件监听器
                }
            }, { passive: true, capture: true, signal: signal });
        }
    }

    function main() {
        console.info("CNKI-TRANSLATE-SECRET-EXPORT 已加载！");

        const headers = new Map();
        const capture = { headers, captureList: CAPTURE_LIST };
        const originXhr = {
            xhrOpen: XMLHttpRequest.prototype.open,
            xhrSetRequestHeader: XMLHttpRequest.prototype.setRequestHeader
        };

        const captureHeader = createHeaderCapturer(capture, copyToClipboard, originXhr);
        createKeydownListener(captureHeader, TRANS_PATH)(true, TRIGGER_KEY);
    }

    document.addEventListener("DOMContentLoaded", main);
})();