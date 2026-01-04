// ==UserScript==
// @name         滑动验证
// @namespace    https://www.yuban.ltd/
// @version      0.0.1
// @description  阿里云滑块自动滑动
// @author       RenJie
// @include      /[a-zA-z]+://[^\s]*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428967/%E6%BB%91%E5%8A%A8%E9%AA%8C%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/428967/%E6%BB%91%E5%8A%A8%E9%AA%8C%E8%AF%81.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /**
     * 休眠
     * @param time    休眠时间，单位秒
     * @param desc
     * @returns {Promise<unknown>}
     */
    function sleep(time, desc = 'sleep') {
        return new Promise(resolve => {
            //sleep
            setTimeout(() => {
                console.log(desc, time, 's')
                resolve(time)
            }, Math.floor(time * 1000))
        })
    }
    /**
     * 监测节点是否存在
     * @param selector    CSS选择器
     * @param desc
     * @returns {Promise<unknown>}
     */
    function obsHas(selector, desc = 'has') {
        return new Promise(resolve => {
            //obs node
            let timer = setInterval(() => {
                let target = document.querySelector(selector)
                if (!!target) {
                    clearInterval(timer)
                    console.log(desc, selector)
                    resolve(selector)
                } else {
                    return
                }
            }, 1000)
        })
    }
    function slide(id) {
        var slider = document.getElementById(id),
            container = slider.parentNode;

        var rect = slider.getBoundingClientRect(),
            x0 = rect.x || rect.left,
            y0 = rect.y || rect.top,
            w = container.getBoundingClientRect().width,
            x1 = x0 + w,
            y1 = y0;

        var mousedown = document.createEvent("MouseEvents");
        mousedown.initMouseEvent("mousedown", true, true, window, 0,
            x0, y0, x0, y0, false, false, false, false, 0, null);
        slider.dispatchEvent(mousedown);

        var mousemove = document.createEvent("MouseEvents");
        mousemove.initMouseEvent("mousemove", true, true, window, 0,
            x1, y1, x1, y1, false, false, false, false, 0, null);
        slider.dispatchEvent(mousemove);
    }
    sleep(1)
        .then(() => obsHas('.nc_wrapper'))
        .then(() => slide('nc_1_n1z'))
})();