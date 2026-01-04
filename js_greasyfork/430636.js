// ==UserScript==
// @name         CSDN快捷键保存文章内容
// @namespace    https://blog.csdn.net/qq_42951560
// @version      1.1
// @description  使用Ctrl+S快捷键保存在CSDN博客使用MarkDown编辑器编辑的文章内容
// @author       XavierJiezou
// @match        https://editor.csdn.net/md/?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430636/CSDN%E5%BF%AB%E6%8D%B7%E9%94%AE%E4%BF%9D%E5%AD%98%E6%96%87%E7%AB%A0%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/430636/CSDN%E5%BF%AB%E6%8D%B7%E9%94%AE%E4%BF%9D%E5%AD%98%E6%96%87%E7%AB%A0%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // JS监听键盘Ctrl+S快捷键并自动点击保存按钮
    document.addEventListener('keydown', function (e) {
        if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
            document.getElementsByClassName('button-save')[0].click();
        }
    });
})();