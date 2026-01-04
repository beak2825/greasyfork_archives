// ==UserScript==
// @name         观察网自动跳转全文
// @namespace    https://userscript.snomiao.com/
// @version      0.1
// @description  rt
// @author       snomiao@gmail.com
// @match        *://www.guancha.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400618/%E8%A7%82%E5%AF%9F%E7%BD%91%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/400618/%E8%A7%82%E5%AF%9F%E7%BD%91%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (location.pathname.match(/(.*?\/\d+_\d+_\d+_\d+)(_\d)?(\.shtml)/)) {
        location.pathname = location.pathname.replace(
            /(.*?\/\d+_\d+_\d+_\d+)(_\d)?(\.shtml)/,
            '$1_s$3'
        );
    }
    window.addEventListener(
        'load',
        () => {
            [...document.querySelectorAll('a')].forEach((e) => {
                e.href = e.href.replace(
                    /(.*?\/\d+_\d+_\d+_\d+)(_\d)?(\.shtml)/,
                    '$1_s$3'
                );
            });
        },
        false
    );
})();
