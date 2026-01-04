// ==UserScript==
// @name        pinia 文档代码字体修改
// @namespace   kjgl
// @match       https://pinia.vuejs.org/*
// @grant       none
// @version     1.0
// @author      kjgl
// @description 修改 pinia 文档默认代码字体
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448832/pinia%20%E6%96%87%E6%A1%A3%E4%BB%A3%E7%A0%81%E5%AD%97%E4%BD%93%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/448832/pinia%20%E6%96%87%E6%A1%A3%E4%BB%A3%E7%A0%81%E5%AD%97%E4%BD%93%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==
function changeFontStyle() {
    // 获取根元素
    var r = document.querySelector(':root');
    // 把变量 --code-font-family 的值设置为另一个值（在这里是 "Microsoft YaHei"）
    r.style.setProperty('--code-font-family', 'Microsoft YaHei');
}

changeFontStyle();