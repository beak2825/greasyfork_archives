// ==UserScript==
// @name         快捷调试小工具
// @version      1.0.0
// @description  快捷调试工具，按下Ctrl+F1显示网页中所有被隐藏的内容（仅限HTML,JavaScript），按下Ctrl+F2，解除网页编辑限制，按下ctrl+F3，恢复网页编辑限制!
// @name:en      Shortcut key debugging gadgets
// @name:zh      快捷调试小工具
// @name:zh-CN   快捷调试小工具
// @name:zh-TW   快捷調試小工具
// @description:en    Quick debugging tool, press Ctrl + F1 to display all hidden contents in the web page (HTML, JavaScript only), press Ctrl + F2 to remove the web page editing restriction, and press Ctrl + F3 to restore the web page editing restriction!
// @description:zh    快捷调试工具，按下Ctrl+F1显示网页中所有被隐藏的内容，按下Ctrl+F2，解除网页编辑限制，按下Ctrl+F3，恢复网页编辑限制!
// @description:zh-CN 快捷调试工具，按下Ctrl+F1显示网页中所有被隐藏的内容，按下Ctrl+F2，解除网页编辑限制，按下Ctrl+F3，恢复网页编辑限制!
// @description:zh-TW 快捷調試工具，按下Ctrl+F1顯示網頁中所有被隱藏的內容，按下Ctrl+F2，解除網頁編輯限制，按下Ctrl+F3，恢復網頁編輯限制！
// @author       mgmzdbh25365
// @match        *://*/*
// @include      http://*/*
// @include      https://*
// @include      ftp://*
// @encoding     utf-8
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @namespace    https://greasyfork.org/zh-CN/users/868987-mgmzdbh25365
// @downloadURL https://update.greasyfork.org/scripts/439096/%E5%BF%AB%E6%8D%B7%E8%B0%83%E8%AF%95%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/439096/%E5%BF%AB%E6%8D%B7%E8%B0%83%E8%AF%95%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==


function addEvent(obj, event, fn) {
    return obj.addEventListener ? obj.addEventListener(event, fn, false) : obj.attachEventListener("on" + event, fn);
};
addEvent(window, 'keydown', function(event) {
    event = event || window.event;
    if (event.ctrlKey) {//是否按下ctrl
        if(event.keyCode == 112) { //ctrl+F1，显示网页中所有被隐藏的内容
            var paragraphs = document.getElementsByTagName("*");
            for(var i = 0; i < paragraphs.length; i++) {
                if(paragraphs[i].style.display==="none") paragraphs[i].style.display="";
                if(paragraphs[i].type==="hidden") paragraphs[i].type="";
                if(paragraphs[i].visibility==="hidden") paragraphs[i].visibility="visible";
            }
        }
        else if(event.keyCode == 113){//ctrl+F2，解除网页编辑限制
            document.body.contentEditable='true';
            document.designMode='on';
            var paragraphs2 = document.getElementsByTagName("*");
            for(var i2 = 0; i2 < paragraphs2.length; i2++) {
                paragraphs2[i2].readOnly=false;
            }
        }
        else if(event.keyCode == 114){//ctrl+F3，恢复网页编辑限制
            document.body.contentEditable='false';
            document.designMode='off';
        }
    }
}) //监听keydown，快捷键