// ==UserScript==
// @name         Remove Multiple Selectors Elements
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  简化图寻主页面
// @author       lemures
// @match        https://tuxun.fun/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483638/Remove%20Multiple%20Selectors%20Elements.user.js
// @updateURL https://update.greasyfork.org/scripts/483638/Remove%20Multiple%20Selectors%20Elements.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const removeElements = () => {
        const selectors = [
            '.thx',
            '.normal-info',
            'div.second-info:nth-child(5)',
            'div.second-info:nth-child(3)',
            '.second-info',
            'div.first_session_head:nth-child(10)',
            'div.line:nth-child(10)',
            'div.grid_main:nth-child(11) > div:nth-child(1)',
            'div.grid_main:nth-child(10) > div:nth-child(1)',
            'div.grid_main:nth-child(10) > div:nth-child(2)',
            'div.grid_main:nth-child(10) > div:nth-child(3)',
            'div.grid_main:nth-child(13) > div:nth-child(1)',
            'div.grid_main:nth-child(13) > div:nth-child(2)',
            'div.grid_main:nth-child(13) > div:nth-child(3)',
            'div.grid_main:nth-child(13) > div:nth-child(4)',
            'div.first_session_head:nth-child(11)',
            'div.line:nth-child(12)',
            'div.line:nth-child(11)',
            'div.grid_main:nth-child(12) > div:nth-child(1)',
            'div.grid_main:nth-child(12) > div:nth-child(2)'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => element.remove());
        });
    };

    // 每秒执行一次删除操作
    setInterval(removeElements, 1);
})();
