// ==UserScript==
// @name         -百度文库阅读全文复制小工具-  by:明明
// @namespace    BaiduCopy
// @version      0.1
// @description  个人学习及测试百度文库复制及全文阅读功能产物，仅供本人测试使用，如不慎外泄，请立即删除！勿用作其他用途！！
// @author       明明
// @match        https://wenku.baidu.com/view/*
// @icon         https://img.fy6b.com/2022/08/24/1689321c4fe4a.png
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450057/-%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87%E5%A4%8D%E5%88%B6%E5%B0%8F%E5%B7%A5%E5%85%B7-%20%20by%3A%E6%98%8E%E6%98%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/450057/-%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87%E5%A4%8D%E5%88%B6%E5%B0%8F%E5%B7%A5%E5%85%B7-%20%20by%3A%E6%98%8E%E6%98%8E.meta.js
// ==/UserScript==

(function () {
    var data;
    Object.defineProperty(window, 'pageData', {
        set: function (newObj) {
            data = newObj;
        },
        get: function () {
            if ('vipInfo' in data) {
                data.vipInfo.global_svip_status = 1;
                data.vipInfo.global_vip_status = 1;
                data.vipInfo.isVip = 1;
                data.vipInfo.isWenkuVip = true;
            }
            return data;
        }
    })
})();