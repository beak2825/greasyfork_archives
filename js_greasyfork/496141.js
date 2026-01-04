// ==UserScript==
// @name         万宝楼外观搜索框优化
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @description  优化万宝楼外观搜索框，不用再拼手速输入了
// @author       方仟仟
// @license      MIT
// @run-at document-start
// @match        https://jx3.seasunwbl.com/buyer*
// @icon         https://jx3.seasunwbl.com/favicon.ico
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/496141/%E4%B8%87%E5%AE%9D%E6%A5%BC%E5%A4%96%E8%A7%82%E6%90%9C%E7%B4%A2%E6%A1%86%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/496141/%E4%B8%87%E5%AE%9D%E6%A5%BC%E5%A4%96%E8%A7%82%E6%90%9C%E7%B4%A2%E6%A1%86%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('DOMNodeInserted', function(e) {
        if (e.target.nodeName === 'SCRIPT') {
            const script = e.target;
            if (script.src.includes(`/api/passport/follow/message_list`)) {
                const callbackNameMatch = script.src.match(/callback=(__xfe\d+)/);
                if (callbackNameMatch) {
                    const callbackName = callbackNameMatch[1];
                    unsafeWindow[callbackName] = function() {}
                }
            }
        }
    });
    const originalSetTimeout = unsafeWindow.setTimeout
    unsafeWindow.setTimeout = function(callback, timeout) {
        const funcStr = callback.toString()
        const loadingRegex = /function\(\)\{[A-z]\.viewStore\.setLoading.*clearTimeout\([A-z]\.\w.+\)\}/g
        if (funcStr.match(loadingRegex) && timeout === 1500)
            return callback()
        if(funcStr.includes('fetchKeyword') && timeout === 500){
            const inputEl = document.getElementById('#appearance_input_role')
            const input = inputEl.value
            if (input && input.match(/[a-zA-Z0-9]/)){
                return
            }
            else if(input && (input.includes('[') || input.includes(']'))){
                const result = input.replace(/[\[\]]/g, '');
                const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                valueSetter.call(inputEl, result);
                inputEl.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
        return originalSetTimeout(callback, timeout)
    }
}
)();
