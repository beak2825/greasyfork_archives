// ==UserScript==
// @name         反应力测试
// @namespace    https://github.com/YFTree
// @version      1
// @description  自动点击反应力测试中的绿色圆形
// @author       YFTree
// @match        *://www.arealme.com/reaction-test/*
// @grant        none
// @license      MIT
// @compatible    firefox
// @compatible    chrome
// @compatible    opera safari edge
// @compatible    safari
// @compatible    edge
// @downloadURL https://update.greasyfork.org/scripts/527386/%E5%8F%8D%E5%BA%94%E5%8A%9B%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/527386/%E5%8F%8D%E5%BA%94%E5%8A%9B%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        const greenCircle = document.querySelector(".tfny-circleGreen");
        if (greenCircle) {
            greenCircle.dispatchEvent(new Event("mousedown"));
        }
    }, 1); // 每1毫秒检查一次，可以根据需要调整
})();
