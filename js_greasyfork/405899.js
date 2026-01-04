// ==UserScript==
// @name         全角杀手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  复制时, 将剪切板中的全角标点转换为半角标点
// @author       cycle
// @match        *://*.cnblogs.com/*
// @match        *://*.csdn.net/*
// @match        *://*.jianshu.com/*
// @match        *://*.zhihu.com/*
// @match        *://*.imooc.com/*
// @grant        none
// @namespace https://greasyfork.org/users/632215
// @downloadURL https://update.greasyfork.org/scripts/405899/%E5%85%A8%E8%A7%92%E6%9D%80%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/405899/%E5%85%A8%E8%A7%92%E6%9D%80%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function fullWidthKiller(event){
        event.preventDefault();

        var node = document.createElement('div');
        node.appendChild(window.getSelection().getRangeAt(0).cloneContents());
        var htmlData = node.innerHTML ;
        var textData = window.getSelection().getRangeAt(0);
        var result = textData.toString().replace(/，/g,', ');
        result = result.toString().replace(/。/g,'. ');
        result = result.toString().replace(/：/g,': ');
        result = result.toString().replace(/；/g,'; ');
        result = result.toString().replace(/？/g,'? ');
        result = result.toString().replace(/！/g,'! ');
        result = result.toString().replace(/、/g,', ');
        result = result.toString().replace(/（/g,'\(');
        result = result.toString().replace(/）/g,'\)');
        result = result.toString().replace(/“/g,'"');
        result = result.toString().replace(/”/g,'"');
        if(event.clipboardData){
            event.clipboardData.setData("text/html", htmlData);
            event.clipboardData.setData("text/plain",result);
        }
        else if(window.clipboardData){
            return window.clipboardData.setData("text", result);
        }

    };
    document.addEventListener('copy',function(e){
        fullWidthKiller(e);
    });
})();