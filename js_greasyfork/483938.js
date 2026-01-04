// ==UserScript==
// @name         京东下图优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  右键点击京东小图自动打开大图并去掉.avif后缀
// @author       You
// @match        https://img13.360buyimg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=360buyimg.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483938/%E4%BA%AC%E4%B8%9C%E4%B8%8B%E5%9B%BE%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/483938/%E4%BA%AC%E4%B8%9C%E4%B8%8B%E5%9B%BE%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function modifyURL(url, newPart, extensionToRemove)
    {
        // 创建URL对象
        let urlObj = new URL(url);
        // 更改协议、主机、端口、路径等部分，根据你的需要进行修改
        urlObj.pathname = urlObj.pathname.replace(/n5|n1/g, newPart);
        // 去掉.avif后缀
        urlObj.pathname = urlObj.pathname.replace(new RegExp("\\." + extensionToRemove + "$"), "");
        // 将修改后的URL对象转换为字符串
        return urlObj.toString();
    }
    if (!localStorage.getItem('Optimized')||document.location.href.indexOf('avif')>0)
    {
        var Optimized = false;
        var d = document;
        var newUrl = modifyURL(d.location.href,"n12","avif");
        d.location.href = newUrl;
        localStorage.setItem('Optimized',true);
    }
})();