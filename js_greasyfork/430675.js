// ==UserScript==
// @name         Abp 文档 侧边栏目录可隐藏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  添加按钮用于隐藏侧边栏目录
// @author       You
// @match        https://docs.abp.io/*
// @icon         https://www.google.com/s2/favicons?domain=abp.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430675/Abp%20%E6%96%87%E6%A1%A3%20%E4%BE%A7%E8%BE%B9%E6%A0%8F%E7%9B%AE%E5%BD%95%E5%8F%AF%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/430675/Abp%20%E6%96%87%E6%A1%A3%20%E4%BE%A7%E8%BE%B9%E6%A0%8F%E7%9B%AE%E5%BD%95%E5%8F%AF%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var time = setInterval(() => {
        var target = document.getElementsByClassName('docs-sidebar')[0];
        if (target == undefined) {
            return;
        }
        clearInterval(time);
        Run();
    }, 1000);
})();

function GM_addStyle(css) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = css;
    document.head.appendChild(style);
}

function AddStyle() {
    GM_addStyle('.alva-active { transform: translate3d(-250px,0,0); transition: all 0.2s ease-in-out;}');
    GM_addStyle('.alva-float-div::before { content: ""; width: 24px; height: 2px; background-color: #999; display: inline-block; box-shadow: 0 7px 0 #999, 0 -7px 0 #999;}');
}

function AddButton() {
    var node = document.createElement('div');
    var flag = true;
    node.classList.add('alva-float-div');

    node.addEventListener('click', function() {
        var target = document.getElementsByClassName('docs-sidebar')[0];
        var content = document.getElementsByClassName('docs-content')[0];
        if (flag) {
            target.classList.add('alva-active');
            content.classList.add('col-md-10');
            content.classList.remove('col-md-7');
        } else {
            target.classList.remove('alva-active');
            content.classList.remove('col-md-10');
            content.classList.add('col-md-7');
        }
        flag = !flag;
    });
    var nav = document.getElementsByClassName('docs-content')[0]
                      .getElementsByClassName('position-relative')[0]
                      .getElementsByClassName('form-row')[0];
    if (nav == undefined) return;

    node.classList.add('col-1');
    nav.prepend(node);
}

function Run() {
    AddStyle();
    AddButton();
}