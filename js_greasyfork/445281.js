// ==UserScript==
// @name         防豆瓣跳转首页
// @version      0.1
// @description  解决pc网页版豆瓣很多帖子点开直接跳转网站首页
// @author       云在天(Harry)
// @match        https://*.douban.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douban.com
// @license      GPL-3.0 License
// @run-at       document-start
// @namespace https://greasyfork.org/users/662979
// @downloadURL https://update.greasyfork.org/scripts/445281/%E9%98%B2%E8%B1%86%E7%93%A3%E8%B7%B3%E8%BD%AC%E9%A6%96%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/445281/%E9%98%B2%E8%B1%86%E7%93%A3%E8%B7%B3%E8%BD%AC%E9%A6%96%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
    console.log('加载拦截脚本');
    /**
     * 重写open方法
     * https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/open
     */
    XMLHttpRequest.prototype.myOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        // 用对象便于修改参数
        if(url.indexOf('check')>-1)
        {
            if(url.indexOf('clean')>-1)
            {
                if(url.indexOf('content')>-1)
                {
                    console.log('拦截'+url+'成功!');
                    return;
                }
            }

        }
        var options = {
            method: method,
            url: url,
            async: async,
            user: user,
            password: password
        };
        if ('function' === typeof window.beforeXMLHttpRequestOpen) {
            window.beforeXMLHttpRequestOpen(this, options);
        }
        this.myOpen(options.method, options.url, options.async);
    };

})();