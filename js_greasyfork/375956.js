// ==UserScript==
// @name         阻止拷贝文档添加版权信息
// @version      0.2
// @author       jiang
// @description  原理就是覆盖剪切板,理论上大部分网站都支持
// @match        *://*.cnblogs.com/*
// @match        *://*.csdn.net/*
// @match        *://*.jianshu.com/*
// @match        *://*.zhihu.com/*
// @match        *://*.imooc.com/*
// @grant        none
// @namespace https://greasyfork.org/users/59721
// @downloadURL https://update.greasyfork.org/scripts/375956/%E9%98%BB%E6%AD%A2%E6%8B%B7%E8%B4%9D%E6%96%87%E6%A1%A3%E6%B7%BB%E5%8A%A0%E7%89%88%E6%9D%83%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/375956/%E9%98%BB%E6%AD%A2%E6%8B%B7%E8%B4%9D%E6%96%87%E6%A1%A3%E6%B7%BB%E5%8A%A0%E7%89%88%E6%9D%83%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function setClipboardText(event){
        event.preventDefault();
        var node = document.createElement('div');
        node.appendChild(window.getSelection().getRangeAt(0).cloneContents());
        var htmlData = node.innerHTML ;
        var textData = window.getSelection().getRangeAt(0);
        if(event.clipboardData){
            event.clipboardData.setData("text/html", htmlData);
            event.clipboardData.setData("text/plain",textData);
        }
        else if(window.clipboardData){
            return window.clipboardData.setData("text", textData);
        }
    };
    document.addEventListener('copy',function(e){
        setClipboardText(e);
    });

})();