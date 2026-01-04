// ==UserScript==
// @name         浙江水利水电学院校园网自动勾选同意协议
// @namespace    haohao
// @version      1.4
// @description  自动勾选同意用户协议
// @author       WangYouchuan
// @match        https://nxnet.zjweu.edu.cn/a79.htm*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477644/%E6%B5%99%E6%B1%9F%E6%B0%B4%E5%88%A9%E6%B0%B4%E7%94%B5%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%E5%90%8C%E6%84%8F%E5%8D%8F%E8%AE%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/477644/%E6%B5%99%E6%B1%9F%E6%B0%B4%E5%88%A9%E6%B0%B4%E7%94%B5%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%E5%90%8C%E6%84%8F%E5%8D%8F%E8%AE%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 根据校园网登录页面的URL进行匹配修改
    if (window.location.href.startsWith("https://nxnet.zjweu.edu.cn/a79.htm")) {
        // 查找并勾选同意用户协议
        const agreeButton = document.querySelector(".agree");
        if (agreeButton) {
            agreeButton.checked = true;
        }
    }
})();