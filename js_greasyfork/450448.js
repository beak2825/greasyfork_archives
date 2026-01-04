// ==UserScript==
// @name         百度文库全文阅读1.2
// @namespace    baiduwenkuCopyByZhou
// @version      1.2
// @description  四行能实现百度文库全文阅读吗？能！
// @author       zhousu
// @match        https://wenku.baidu.com/view/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450448/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%85%A8%E6%96%87%E9%98%85%E8%AF%BB12.user.js
// @updateURL https://update.greasyfork.org/scripts/450448/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%85%A8%E6%96%87%E9%98%85%E8%AF%BB12.meta.js
// ==/UserScript==

(function () {
    // 定义中间变量
    var data;
    // 给pageData监控起来
    Object.defineProperty(window, 'pageData', {
        // 一旦给pageData赋值就会触发
        set: function (newObj) {
            // newObj就是新赋的值，把它存储给中间变量data
            data = newObj;
        },
        // 一旦获取pageData就会触发
        get: function () {
            // 判断以下，是不是赋值成功了，成功了，我们才能调用data.vipInfo.isVip
            // 然后设置值为1，表示是一个vip用户
            if ('vipInfo' in data) {
                data.vipInfo.global_svip_status = 1;
                data.vipInfo.global_vip_status = 1;
                data.vipInfo.isVip = 1;
                data.vipInfo.isWenkuVip = true;
            }
            // 将原始页面上的pageData对象经过包装后的data对象返回，
            // 此时只要你获取pageData就会触发get方法，然后包装，设置vip为存在
            return data;
        }
    })
})();