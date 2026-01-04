// ==UserScript==
// @name         浏览器网页已保存密码查看工具
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @description  浏览器网页已保存密码查看工具，简称“密码查看器”：针对于浏览器中已经保存的密码进行快速查看，使用方法：1、鼠标指针放入密码输入框三秒 2、点击油猴插件图标：密码-开启 - 密码-关闭 3、单手快捷键：'o' 'p'
// @author       wll
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @icon         https://img-blog.csdnimg.cn/20181221195058594.gif
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @license      End-User License Agreement
// @note         授权联系：	leiwang2010@163.com
// @note         版本更新	20-12-22 0.0.1	针对于浏览器已经保存的密码进行查看，使用方法：点击油猴插件图标：密码-开启 - 密码-关闭
// @note         版本更新	20-12-23 0.0.2	增加密码框自动识别，用于解密使用
// @note         版本更新	20-12-24 0.0.3	优化代码性能,增加单手快捷键：“o”“p”
// @note         版本更新	23-09-21 0.0.4	增加鼠标悬停3秒后自动显示密码功能
// @note         版本更新	24-08-23 0.0.5	增加功能描述，增加description


// @downloadURL https://update.greasyfork.org/scripts/437463/%E6%B5%8F%E8%A7%88%E5%99%A8%E7%BD%91%E9%A1%B5%E5%B7%B2%E4%BF%9D%E5%AD%98%E5%AF%86%E7%A0%81%E6%9F%A5%E7%9C%8B%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/437463/%E6%B5%8F%E8%A7%88%E5%99%A8%E7%BD%91%E9%A1%B5%E5%B7%B2%E4%BF%9D%E5%AD%98%E5%AF%86%E7%A0%81%E6%9F%A5%E7%9C%8B%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("keypress", function(e) {
        console.log("--->e.key:"+e.key);
        switch (e.key.toLowerCase()) {
            case "o":
                $('input[type=password]').attr("type", "1");
                break;
            case "p":
                $('input[type=1]').attr("type", "password");
                break;
        }
    });

    function initMenu(){
        if($('input[type=password]').length>0){
            GM_registerMenuCommand('密码-开启', () => {
                $('input[type=password]').attr("type", "1");
            });
            GM_registerMenuCommand('密码-关闭', () => {
                $('input[type=1]').attr("type", "password");
            });
        }

    }

    var passwordField = document.querySelector('input[type="password"]');

    passwordField.addEventListener('mouseover', function() {
        var timeout = setTimeout(function() {
            passwordField.type = 'text';
        }, 3000);

        passwordField.addEventListener('mouseout', function() {
            clearTimeout(timeout);
            passwordField.type = 'password';
        });
    });

    initMenu();

})();