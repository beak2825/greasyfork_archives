// ==UserScript==
// @name         浴古难度屏蔽插件（题目）
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  狠狠滴屏蔽！
// @author       I_got_yuyu
// @match        https://www.luogu.com.cn/problem/P*
// @match        https://www.luogu.com.cn/problem/CF*
// @match        https://www.luogu.com.cn/problem/AT*
// @match        https://www.luogu.com.cn/problem/SP*
// @match        https://www.luogu.com.cn/problem/UVA*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476821/%E6%B5%B4%E5%8F%A4%E9%9A%BE%E5%BA%A6%E5%B1%8F%E8%94%BD%E6%8F%92%E4%BB%B6%EF%BC%88%E9%A2%98%E7%9B%AE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/476821/%E6%B5%B4%E5%8F%A4%E9%9A%BE%E5%BA%A6%E5%B1%8F%E8%94%BD%E6%8F%92%E4%BB%B6%EF%BC%88%E9%A2%98%E7%9B%AE%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(!window._feInjection.currentData.problem.accepted) window._feInjection.currentData.problem.difficulty = 1;
})();