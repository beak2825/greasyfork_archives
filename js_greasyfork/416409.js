// ==UserScript==
// @name         bde4，哔嘀影视防ADP检测脚本
// @namespace    none
// @version      0.9.2
// @description  bde4，哔嘀影视防ADP检测脚本，修改match规则可适配该网站新域名
// @author       Rainbow
// @match        *://bde4.cc/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/416409/bde4%EF%BC%8C%E5%93%94%E5%98%80%E5%BD%B1%E8%A7%86%E9%98%B2ADP%E6%A3%80%E6%B5%8B%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/416409/bde4%EF%BC%8C%E5%93%94%E5%98%80%E5%BD%B1%E8%A7%86%E9%98%B2ADP%E6%A3%80%E6%B5%8B%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    console.log('Rainbow script')
    windowLoad();
    var blur = function () {
        return true;
    };
    window.onblur = function () {
        console.log(window)
        return true;
    };
    Object.defineProperty(window, '_0xb483', {
        value: window.onblur,
        writable: false,
        enumerable: false,
        configurable: false
    });

    Object.defineProperty(window, '__Ox9f9cc', {
        value: [],
        writable: false,
        enumerable: false,
        configurable: false
    });
    /*暂时关闭此变量注入
    Object.defineProperty(window, 'UN$nXBso1', {
        value: [],
        writable: false,
        enumerable: false,
        configurable: false
    });
    */
})();

function windowLoad() {
    const eventQueue = [];
    // 防止覆盖之前的 window.onload
    window.onload instanceof Function && eventQueue.push(window.onload);
    window.onload = e => {
        const errQueue = [];
        // 逐个处理回调事件
        while (!!eventQueue.length) {
            try {
                //eventQueue.shift()(e);
                console.log(e);
            } catch (err) {
                errQueue.push(err);
            }
        }
        if (!!errQueue.length) {
            setTimeout(() => {
                throw errQueue.shift();
            }, 0);
        };
    };
    // 每次赋值时，将回调函数添加到队列
    Object.defineProperty(window, 'onload', {
        set: eventQueue.push
    });
    return window.onload
}