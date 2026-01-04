// ==UserScript==
// @name         文字拷贝
// @version      1.0.0
// @author       meng kai
// @description  拷贝文字时去除站点信息
// @match        *://*/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/zh-CN/users/972532-meng33333
// @downloadURL https://update.greasyfork.org/scripts/453335/%E6%96%87%E5%AD%97%E6%8B%B7%E8%B4%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/453335/%E6%96%87%E5%AD%97%E6%8B%B7%E8%B4%9D.meta.js
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