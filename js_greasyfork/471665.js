// ==UserScript==
// @name         统一身份认证bugfix
// @version      0.0.1
// @description  解决统一身份认证受浏览器扩展影响自动跳转到钉钉扫码登录的问题
// @author       ml98
// @namespace    http://tampermonkey.net/
// @license      MIT
// @match        https://zjuam.zju.edu.cn/cas/login*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471665/%E7%BB%9F%E4%B8%80%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81bugfix.user.js
// @updateURL https://update.greasyfork.org/scripts/471665/%E7%BB%9F%E4%B8%80%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81bugfix.meta.js
// ==/UserScript==

/* global handleMessage */

let __addEventListener = window.addEventListener;
window.addEventListener = function(type, listener, options) {
    if(listener.name == 'handleMessage' || listener.toString().includes(`loginTmpCode`)) {
        listener = function(event) {
            if(typeof event.data == 'string' && /^[0-9a-z]{32}$/.test(event.data)) {
                handleMessage(event);
            }
        }
        window.addEventListener = __addEventListener;
    }
    __addEventListener(type, listener, options);
}
