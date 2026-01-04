// ==UserScript==
// @name         hook_log v0.2
// @namespace    https://github.com/0xsdeo/Hook_JS
// @version      2024-12-17
// @description  通过toString方法判断console.log方法是否被重写，以此来防止js重写log方法
// @author       0xsdeo
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536970/hook_log%20v02.user.js
// @updateURL https://update.greasyfork.org/scripts/536970/hook_log%20v02.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // let temp_freeze = Object.freeze;
    // Object.freeze = function () {
    //     if (typeof arguments[0] === 'object' && arguments[0] === console) {
    //         return console;
    //     }
    //     else {
    //         return temp_freeze(...arguments);
    //     }
    // }

    let waiting_time = 3; // 等待时间，单位为秒
    let temp_log = console.log;
    let flag = 0;

    function judge_overwrite() {
        if (console.log.toString() !== 'function log() { [native code] }') {
            console.log = temp_log;
        }
    }

    window.addEventListener("load", () => {
        judge_overwrite();
        flag = 1;
    });

    setTimeout(() => {
        if (flag === 0) {
            judge_overwrite();
        }
    }, waiting_time * 1000);
})();