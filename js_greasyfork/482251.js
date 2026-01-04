// ==UserScript==
// @name         拦截非当前域名请求
// @namespace    https://github.com/guoshiqiufeng
// @version      1.0.1
// @description  拦截请求，过滤非当前域名请求。同域名不同端口号不会过滤。
// @author       yanghq
// @license MIT
// @match        http://*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482251/%E6%8B%A6%E6%88%AA%E9%9D%9E%E5%BD%93%E5%89%8D%E5%9F%9F%E5%90%8D%E8%AF%B7%E6%B1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/482251/%E6%8B%A6%E6%88%AA%E9%9D%9E%E5%BD%93%E5%89%8D%E5%9F%9F%E5%90%8D%E8%AF%B7%E6%B1%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 保存当前域名
    var currentDomain = window.location.hostname;

    // 重写XMLHttpRequest的open方法
    var originalOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        // 检查请求的目标域名
        var targetDomain = (new URL(url)).hostname;

        // 如果目标域名与当前域名不匹配，则拦截请求
        if (targetDomain !== currentDomain) {
            console.log('拦截请求:', url);
            return;
        }

        // 调用原始的open方法
        originalOpen.apply(this, arguments);
    };

    var originalCreateElement = document.createElement;

    document.createElement = function(tagName) {
         var element = originalCreateElement.apply(this, arguments);

        // 拦截创建 script 元素的情况
        if (tagName.toLowerCase() === 'script') {
            interceptScriptElement(element);
        }

        return element;
    };

    function interceptScriptElement(scriptElement) {
        // 监听 src 属性的设置
        var originalSetAttribute = scriptElement.setAttribute;
        scriptElement.setAttribute = function(name, value) {
            // 拦截设置 src 属性的情况
            if (name.toLowerCase() === 'src') {
                interceptScriptSrc(value);
            }

            // 调用原始的 setAttribute 方法
            originalSetAttribute.apply(this, arguments);
        };
    }

    function interceptScriptSrc(srcValue) {
        // 检查目标域名，可以根据需要修改条件
        var targetDomain = (new URL(srcValue)).hostname;

        // 如果目标域名不是当前域名，拦截请求
        if (targetDomain !== window.location.hostname) {
            console.log('拦截外链脚本请求:', srcValue);
            // 可以根据需要执行其他操作，比如取消加载
        }
    }
})();