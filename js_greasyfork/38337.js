// ==UserScript==
// @name         自定义百度网盘密码
// @version      1
// @description  欢迎加微信公众号：小鸡娃的家，各种分享.使用说明：点击“创建私密链接”的时候弹出对话框，此时可以输入自定义密码。自定义密码的字符和必须为4，一个字母或数字的字符数是1，一个汉字的字符数是3，因此密码可以是1234、56ok、牛X。本代码参考了reg.me.cn@gmail.com的代码。
// @author       Johnson
// @match        *://pan.baidu.com/*
// @match        *://yun.baidu.com/*
// @match        *://wangpan.baidu.com/*
// @match        *://eyun.baidu.com/*
// @grant        none
// @namespace https://greasyfork.org/users/170181
// @downloadURL https://update.greasyfork.org/scripts/38337/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/38337/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

document.addEventListener('click', function(event) {
    if(event.target.title == "分享"){
        window.setTimeout(function() {
            require(["function-widget-1:share/util/shareFriend/createLinkShare.js"]).prototype.makePrivatePassword=function(){return prompt("请输入自定义的密码","6666")};
        }, 500);
    }
}, true);