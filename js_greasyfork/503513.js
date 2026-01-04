// ==UserScript==
// @name         油猴2-IMMS循环减少无用列
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  IMMS循环减少无用列
// @author       You
// @match        http://192.168.100.113/pcis/a/index*
// @icon
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503513/%E6%B2%B9%E7%8C%B42-IMMS%E5%BE%AA%E7%8E%AF%E5%87%8F%E5%B0%91%E6%97%A0%E7%94%A8%E5%88%97.user.js
// @updateURL https://update.greasyfork.org/scripts/503513/%E6%B2%B9%E7%8C%B42-IMMS%E5%BE%AA%E7%8E%AF%E5%87%8F%E5%B0%91%E6%97%A0%E7%94%A8%E5%88%97.meta.js
// ==/UserScript==

// 此网页套多层iframe,油猴默认每层都执行一次，如代码中能指定某一层，则可设置仅顶层框架执行
(function () {
    'use strict'
    window.onload = setInterval(function () {
        重复()
    }, 5000);
    // Your code here...
})();

function 重复() {
    //点请验单加号后弹出的表的数组
    let 组件 = window.frames[1].document.getElementsByClassName('tablediv')
    let 数量 = 组件.length
    console.log('展开表数:', 数量)
    // i 是同时展开的表数
    for (let i = 0; i < 数量; i++) {
        let 项目数量 = 组件[i].children[1].children[1].children[2].children[0].children[0].children.length - 1
        console.log('执行第', i + 1, '个表,共', 项目数量, '项')
        for (let b = 1; b <= 项目数量; b++) {
            组件[i].children[1].children[1].children[2].children[0].children[0].children[b].children[5].style.display = 'none'
            组件[i].children[1].children[1].children[2].children[0].children[0].children[b].children[6].style.display = 'none'
            组件[i].children[1].children[1].children[2].children[0].children[0].children[b].children[7].style.display = 'none'
            组件[i].children[1].children[1].children[2].children[0].children[0].children[b].children[8].style.display = 'none'
            组件[i].children[1].children[1].children[2].children[0].children[0].children[b].children[9].style.display = 'none'
        }
    }
}
