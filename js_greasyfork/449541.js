// ==UserScript==
// @name         格式化windows-path
// @version      1.0
// @description  格式化 windons path 为linux path
// @author       xuxin
// @match        https://*.feishu.cn/*
// @match        *://*.juejin.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        
// @namespace https://greasyfork.org/users/820113
// @downloadURL https://update.greasyfork.org/scripts/449541/%E6%A0%BC%E5%BC%8F%E5%8C%96windows-path.user.js
// @updateURL https://update.greasyfork.org/scripts/449541/%E6%A0%BC%E5%BC%8F%E5%8C%96windows-path.meta.js
// ==/UserScript==

(function() {
    const target = document.querySelector('html');
    document.onpaste = function(){ return false; };
    document.addEventListener("click",async (e) => {
        console.log("点击了");
        const paste = await navigator.clipboard.readText();
        var pre = paste.split("\\");
        var ans = pre.join("/");
        console.log(ans);
        navigator.clipboard.writeText(ans);
    });
    document.addEventListener('paste', (event) => {
        let paste = (event.clipboardData || window.clipboardData).getData('text');
        var pre = paste.split("\\");

        var ans = pre.join("/");
        const selection = window.getSelection();
        if (!selection.rangeCount) return false;
        selection.deleteFromDocument();

        navigator.clipboard.writeText(ans);
        // document.execCommand('insertText', false, ans)
        event.preventDefault();
    });
})();