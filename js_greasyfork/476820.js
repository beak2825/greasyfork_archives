// ==UserScript==
// @name         浴古难度屏蔽插件（题单）
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  狠狠滴屏蔽！
// @author       I_got_yuyu
// @match        https://www.luogu.com.cn/training/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476820/%E6%B5%B4%E5%8F%A4%E9%9A%BE%E5%BA%A6%E5%B1%8F%E8%94%BD%E6%8F%92%E4%BB%B6%EF%BC%88%E9%A2%98%E5%8D%95%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/476820/%E6%B5%B4%E5%8F%A4%E9%9A%BE%E5%BA%A6%E5%B1%8F%E8%94%BD%E6%8F%92%E4%BB%B6%EF%BC%88%E9%A2%98%E5%8D%95%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let len = window._feInjection.currentData.training.problems.length;
    for(let i = 0; i < len; i++) {
        if(window._feInjection.currentData.training.userScore == null) {
            window._feInjection.currentData.training.problems[i].problem.difficulty = 1;
            continue;
        }
        let id = window._feInjection.currentData.training.problems[i].problem.pid;
        let ac = window._feInjection.currentData.training.userScore.score[id];
        if(ac == window._feInjection.currentData.training.problems[i].problem.fullScore) continue;
        else window._feInjection.currentData.training.problems[i].problem.difficulty = 1;
    }
})();