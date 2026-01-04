// ==UserScript==
// @name         淘宝详情页显示
// @namespace    https://github.com/microleft/sellerdescription
// @icon         https://www.taobao.com/favicon.ico
// @version      0.3
// @description  禁止淘宝详情页跳转
// @author       mic
// @match        https://rate.taobao.com/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/385169/%E6%B7%98%E5%AE%9D%E8%AF%A6%E6%83%85%E9%A1%B5%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/385169/%E6%B7%98%E5%AE%9D%E8%AF%A6%E6%83%85%E9%A1%B5%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    var config = { childList: true, subtree: true };
    var callback = function (mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.type == 'childList') {
                if (mutation.target.tagName == 'SCRIPT' && mutation.target.innerHTML.indexOf("window.location.href") >= 0) {
                    mutation.target.innerHTML = '';
                }

                if (mutation.target.tagName == 'SCRIPT' && mutation.target.innerHTML.indexOf("addEventListener") >= 0) {
                    mutation.target.innerHTML = '';
                    observer.disconnect();
                }
            }
        }
    };
    var observer = new MutationObserver(callback);
    observer.observe(document.body, config);
})();