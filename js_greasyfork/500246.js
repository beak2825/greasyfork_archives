// ==UserScript==
// @name         REMOVE THE FUCK DEBUGGER
// @namespace    https://zosah.gitee.io/
// @version      1.0.4
// @description  干掉他丫的调试
// @author       Zosah
// @match        *://*.h5.xiaoeknow.com/*/course/alive/*
// @match        *://*.xet.xiaoetong.com/*/course/alive/*
// @grant        none
// @run-at       document-start
// @icon         https://commonresource-1252524126.cdn.xiaoeknow.com/image/lhyaurs50zil.ico

// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/500246/REMOVE%20THE%20FUCK%20DEBUGGER.user.js
// @updateURL https://update.greasyfork.org/scripts/500246/REMOVE%20THE%20FUCK%20DEBUGGER.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const eval_back = window.eval
    window.eval = function(a){
        // 没有debuger
        if (a.indexOf("debugger") === -1) {
            return eval_back(a);
        }
    }
})();