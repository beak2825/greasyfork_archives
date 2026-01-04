// ==UserScript==
// @name         贵族学院链接获取者
// @namespace    http://tampermonkey.net/
// @version      0.38
// @description  自动获取百度云链接
// @author       鱼丸粗面666
// @match        *://adb123.com/*
// @match        *://asina.me/*
// @match        *://asina.us/*
// @match        *://asina.vip/*
// @match        *://gzxy.me/*
// @grant        none
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/374535/%E8%B4%B5%E6%97%8F%E5%AD%A6%E9%99%A2%E9%93%BE%E6%8E%A5%E8%8E%B7%E5%8F%96%E8%80%85.user.js
// @updateURL https://update.greasyfork.org/scripts/374535/%E8%B4%B5%E6%97%8F%E5%AD%A6%E9%99%A2%E9%93%BE%E6%8E%A5%E8%8E%B7%E5%8F%96%E8%80%85.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var content = $("meta[content*='链接']")[0].getAttribute('content');

    var bdLinkReg = new RegExp('(https|http)[\\S]+');
    var passwordReg = new RegExp(" [\\w]{4} ");

    var bdLink = content.match(bdLinkReg)[0];
    var password = content.match(passwordReg)[0];
    var link_word = "链接: " + bdLink + " 提取码: " + password;

    // 创建新节点
    var passwordText        = createText('password', password,    '130px', '95px');
    var copyPasswordButton  = createButton('复制密码', '', 1,     '130px', '14px');
    var _selfLink           = createButton('本页', bdLink, 3,     '85px', '95px');
    var _blankLink          = createButton('新标签页', bdLink, 4, '85px', '14px');
    var copyLinkButton      = createButton('复制链接', '', 2,     '40px', '95px');
    var linkText            = createText('bdlink', link_word,     '40px', '14px');


    $('body')[0].appendChild(passwordText);
    $('body')[0].appendChild(copyPasswordButton);
    $('body')[0].appendChild(_selfLink);
    $('body')[0].appendChild(_blankLink);
    $('body')[0].appendChild(copyLinkButton);
    $('body')[0].appendChild(linkText);


    /**
     * 创建 input-text 节点
     * @param id        节点的id
     * @param value     文本框的值
     * @param bottom    底部距离
     * @param right     右侧距离
     * @returns {HTMLInputElement}
     */
    function createText(id, value, bottom, right) {
        var text = document.createElement('input');

        text.id = id;
        text.type = "text";
        text.value = value;

        text.style.width = "77px";  // 文本框默认宽高
        text.style.height = "34px";
        text.style.fontSize = "18px";
        text.style.color = "#82E0AA";
        text.style.position = "fixed";
        text.style.bottom = bottom;
        text.style.right = right;

        return text;
    }

    /**
     * 创建 input-button 节点
     * @param value     按钮的值
     * @param link      百度云链接
     * @param target    执行的动作: 1、复制密码；2、复制链接及密码；3、本页打开；默认: 新标签页打开
     * @param bottom    底部距离
     * @param right     右侧距离
     * @returns {HTMLInputElement}
     */
    function createButton(value, link, target, bottom, right) {
        var btn = document.createElement('input');

        btn.type = "button";
        btn.value = value;

        btn.addEventListener('click', function () {

            switch (target) {
                case 1:
                    // 复制密码
                    var passwordText = document.querySelector('#password');
                    passwordText.select();
                    if (document.execCommand('copy')) {
                        document.execCommand('copy');
                        console.log("复制密码成功");
                    }
                    break;
                case 2:
                    // 复制链接密码
                    var linkText = document.querySelector('#bdlink');
                    linkText.select();
                    if (document.execCommand('copy')) {
                        document.execCommand('copy');
                        console.log("复制链接成功");
                    }
                    // window.clipboardData.setData("Text", clipboardContent);
                    break;
                case 3:
                    // 本页打开链接
                    window.open(link, '_self');
                    break;
                default:
                    // 默认新标签页打开
                    window.open(link, '_blank');
            }
        });

        btn.style.width = '80px';  // 按钮默认宽高
        btn.style.height = "40px";
        btn.style.color = "#F5F5F5";
        btn.style.background = "#82E0AA";
        btn.style.border = "0";
        btn.style.position = "fixed";
        btn.style.bottom = bottom;
        btn.style.right = right;

        return btn;
    }
})();
