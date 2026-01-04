// ==UserScript==
// @name         stackem simulate space key
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  .....
// @author       You
// @match        https://stackem.xyz/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529383/stackem%20simulate%20space%20key.user.js
// @updateURL https://update.greasyfork.org/scripts/529383/stackem%20simulate%20space%20key.meta.js
// ==/UserScript==

// a && a.threejs.position[a.direction] < t * -6 && debouncedSimulateSpaceKey();
(function() {
    'use strict';
    const spaceKeyEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        key: ' ',
        code: 'Space',
        keyCode: 32
    });

    // 最简洁的防抖函数
    function debounce(fn, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    // 应用防抖，100ms
    window.debouncedSimulateSpaceKey = debounce(() => window.cancelSimulate ? null : window.dispatchEvent(spaceKeyEvent), 100);
    // Your code here...
})();