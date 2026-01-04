// ==UserScript==
// @name         白马阻止剪贴板
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  白马阻止剪贴板、去除代码块的lang标记
// @author       Owwk
// @match        *://*.itbaima.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=itbaima.cn
// @grant        none
// @license MIT
// @
// @downloadURL https://update.greasyfork.org/scripts/515005/%E7%99%BD%E9%A9%AC%E9%98%BB%E6%AD%A2%E5%89%AA%E8%B4%B4%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/515005/%E7%99%BD%E9%A9%AC%E9%98%BB%E6%AD%A2%E5%89%AA%E8%B4%B4%E6%9D%BF.meta.js
// ==/UserScript==
(function() {
    document.addEventListener('copy', (e) => {
        e.stopImmediatePropagation();
 
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const div = document.createElement('div');
            div.appendChild(range.cloneContents());
 
            div.innerHTML = div.innerHTML.replace(/<span class="md-editor-code-lang"[^>]*>.*?<\/span>/g, "");
            div.innerHTML = div.innerHTML.replace(/<span class="md-editor-copy-button"[^>]*>.*?<\/span>/g, "");
 
            let plainText = selection.toString().replace(/\n.*?(复制代码)\n/gm, "\n");
 
            e.clipboardData.clearData();
            e.clipboardData.setData("text/html", div.innerHTML);  
            e.clipboardData.setData("text/plain", plainText);      
            e.preventDefault();
            console.log('剪贴板内容更改已拦截，已去除“复制代码”及语言标记');
        }
    }, true);
})();