// ==UserScript==
// @name         有道云笔记网页剪报
// @namespace    https://greasyfork.org/users/49622
// @icon         https://note.youdao.com/favicon.ico
// @version      1.0.6
// @description  自动提取网页正文,免受广告干扰 网页剪报自动提取出网页中的正文内容,去除页面周边的多余 信息,使您在有道云笔记中可以直接阅读到清爽的正文效果
// @author       过去终究是个回忆
// @include      *
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// @resource     YNoteClipper https://note.youdao.com/yws/YNoteClipper.js?_=1596113955041
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/412098/%E6%9C%89%E9%81%93%E4%BA%91%E7%AC%94%E8%AE%B0%E7%BD%91%E9%A1%B5%E5%89%AA%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/412098/%E6%9C%89%E9%81%93%E4%BA%91%E7%AC%94%E8%AE%B0%E7%BD%91%E9%A1%B5%E5%89%AA%E6%8A%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //注册油猴菜单
    GM_registerMenuCommand('一键收藏', function () {
        var ydNoteWebClipperElem = document.getElementById('ydNoteWebClipper');
        if(document.getElementById('ydNoteWebClipper')) {
            document.body.removeChild(ydNoteWebClipperElem);
        }
        try {
            var YNoteClipper = GM_getResourceText('YNoteClipper');
            if(YNoteClipper) {
                new Function(YNoteClipper)();
            } else {
                var a = document.createElement('div');
                a.style.cssText = 'position: absolute;top: 10px;right: 30px;padding: 5px;border-radius: 5px;box-shadow: rgb(92, 184, 229) 0px 0px 2px; -webkit-box-shadow: rgb(92, 184, 229) 0px 0px 2px;background-color: rgba(92, 184, 229, 0.498039) !important;z-index: 999999;';
                a.innerHTML = 'Load script error!';
                document.body.appendChild(a);
                a.onclick = function() {
                    a.style.display = 'none';
                };
                setTimeout(function() {
                    a.click();
                }, 8e3);
            }
        } catch(b) {
            alert('该扩展暂不支持当前的浏览器或不支持收藏该类型https类网站');
            console.error(b);
        }
    });
})();