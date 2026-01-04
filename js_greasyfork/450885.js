// ==UserScript==
// @name         百度文库全文阅读极简版
// @namespace    baiduwenkuCopyByZhou
// @version      2.0
// @description  四行能实现百度文库全文阅读吗？能！
// @author       王子周棋洛
// @match        https://wenku.baidu.com/view/*
// @icon         https://img.fy6b.com/2022/08/18/cde66df74a791.png
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/450885/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%85%A8%E6%96%87%E9%98%85%E8%AF%BB%E6%9E%81%E7%AE%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/450885/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%85%A8%E6%96%87%E9%98%85%E8%AF%BB%E6%9E%81%E7%AE%80%E7%89%88.meta.js
// ==/UserScript==

(function () {
    // 定义中间变量
    let data;
    // 给pageData监控起来
    Object.defineProperty(window, 'pageData', {
        // 一旦给pageData赋值就会触发
        set(newObj) {
            // newObj就是新赋的值，把它存储给中间变量data
            data = newObj;
        },
        // 一旦获取pageData就会触发
        get() {
            // 判断以下，是不是赋值成功了，成功了，我们才能调用data.vipInfo.isVip
            // 然后设置值为1，表示是一个vip用户
            if ('vipInfo' in data) {
                data.vipInfo.isVip = 1;
            }
            // 将原始页面上的pageData对象经过包装后的data对象返回，
            // 此时只要你获取pageData就会触发get方法，然后包装，设置vip为存在
            return data;
        }
    })
})();