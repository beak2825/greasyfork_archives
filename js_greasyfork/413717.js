// ==UserScript==
// @name         微博手机替换成pc链接
// @namespace    http://cyd.space/
// @version      0.1
// @description  微博手机替换成pc链接，并添加按钮点击
// @author       CYD
// @match        https://m.weibo.cn/detail/*
// @match        https://m.weibo.cn/status/*
// @run-at document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/413717/%E5%BE%AE%E5%8D%9A%E6%89%8B%E6%9C%BA%E6%9B%BF%E6%8D%A2%E6%88%90pc%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/413717/%E5%BE%AE%E5%8D%9A%E6%89%8B%E6%9C%BA%E6%9B%BF%E6%8D%A2%E6%88%90pc%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==


(function() {
    try {
        var uid = $render_data.status.user.id;
        var id = $render_data.status.bid;
        //以下代码嫖的。
        const href = `https://weibo.com/${uid}/${id}`;
        const div = document.createElement('div');
        div.innerHTML = `<a style="z-index:999;border-radius:25px;font-size:14px;position:fixed;top:15px;right:25px;padding:15px 25px;background-color:#222;color:#fff;text-align:center;" href="${href}">跳转 PC 版本</a>`;
        document.body.appendChild(div);
    } catch (error) {
        console.log("获取userId和bid失败");
    }
})();