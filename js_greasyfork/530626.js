// ==UserScript==
// @name         Bing首页净化
// @name:en      Bing homepage cleanner
// @namespace    Bing首页净化
// @version      0.1
// @description  去除bing首页的每日一图、底部的版权信息和广告链接等信息
// @description:en  Remove images of the day from the bing homepage, copyright information and AD links at the bottom
// @author       ErSan
// @include      *://*.bing.com/
// @include      *://*.bing.com/?FORM*
// @include      *://*.bing.com/?ensearch*
// @exclude      *://*.bing.com/search*
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAAAIAClAQAAFgAAAIlQTkcNChoKAAAADUlIRFIAAAAQAAAAEAgGAAAAH/P/YQAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAEjSURBVDiNxZO/joJAEIe/VSIhVhTUBIi1lQ9g4YPwNPIkhIRSHoVITYh/6q2ETNgrvCN6Kt7livsl28zMfjP5za4SEcOI2rbFtu2X+cnY5e12S5IkdF33ssYaAwRBwHw+p2kaoij6/QQ/0Z8B6tbE0+lEURQYcw2VZclsNsPzPFzXBWCxWLBerx8BIsJmsyFNU5RSwHUDAJZlMZ1OAYjjmN1uh2Vd7RtMVEqxXC7Jsmwo/q6+71mtVkMDPjubr6O1Nnmem9uYiJjL5WJExOR5brTWd7nRNWqtAaiqijAMn9Y8BYgIx+ORw+EAwGTyelkPgLZtOZ/P1HVN3/cDoOs6mqYZBziOg+/7FEWBiAxOiwj7/R7f93Ec5w6g3n2md/r/p/wBsAiiTgxsFfIAAAAASUVORK5CYII=
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/530626/Bing%E9%A6%96%E9%A1%B5%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/530626/Bing%E9%A6%96%E9%A1%B5%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

   // 配置参数：需要隐藏的元素选择器数组
    const SELECTORS = [
        '#scroll_cont',
        '[class~="msnpeek"]',
        '[class~="msnpeek_notob"]',
        '[class~="below_sbox"]',
        '[class~="sa_rpane"]',
    ];

    let checkInterval = setInterval(() => {
        let hasVisibleElement = false;

        SELECTORS.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                if (element.style.display !== 'none') {
                    element.style.display = 'none';
                    hasVisibleElement = true; // 标记存在需要处理的元素
                }
            });
        });

        // 当本轮未发现可见元素时停止检测
        // if (!hasVisibleElement) {
        //     clearInterval(checkInterval);
        //     console.log('所有目标元素已隐藏，停止检测');
        // }
    }, 1000);
    setInterval(() => {
        document.querySelectorAll('#sa_ul').forEach(el => {
            if (el.style.width !== '100%'){
                el.style.width = '100%';
            }
        });
    }, 1000);

})();