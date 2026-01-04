// ==UserScript==
// @name                  Copy Tab Title+URL
// @name:zh-CN            拷贝标签页标题+链接
// @namespace             http://tampermonkey.net/
// @version               0.1
// @author                Zhou Yucheng
// @description           press ctrl(cmd)-shift-c to copy the tab tile with url in clipboard, e.g., "Stack Overflow - Where Developers Learn, Share, & Build Careers: https://stackoverflow.com/"
// @description:zh-CN     按下 ctrl(cmd)-shift-c 拷贝当前标签页标题+链接至剪贴板，例如在百度首页拷贝为“百度一下，你就知道: www.baidu.com”
// @license               MIT
// @include               *
// @grant                 GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/450200/Copy%20Tab%20Title%2BURL.user.js
// @updateURL https://update.greasyfork.org/scripts/450200/Copy%20Tab%20Title%2BURL.meta.js
// ==/UserScript==

// TODO: replace @include with @match *://*/*
(function () {
    'use strict';
    document.addEventListener("keydown", function (e) {
        if ((e.key === 'c' || e.keyCode === 67) && (e.ctrlKey || e.metaKey) && e.shiftKey ) {
            let str = document.title + ": " + location.href;
            GM_setClipboard(str);
            //console.log(str);
        }
    });
})();
