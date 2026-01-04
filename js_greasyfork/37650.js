// ==UserScript==
// @name         第一弹diyidan.com cos图片下载辅助
// @namespace    https://saber.love/?p=4003
// @version      0.2
// @description  在第一弹（diyidan.com）的cos页面上，显示大图网址以便批量下载。同时解除右键菜单的限制、不能点击打开大图的限制。
// @author       雪见仙尊 xuejianxianzun
// @match        *://www.diyidan.com/main/post/*
// @icon 		https://www-static.diyidan.net/static/image/favicon.ico
// @run-at		document-end
// @downloadURL https://update.greasyfork.org/scripts/37650/%E7%AC%AC%E4%B8%80%E5%BC%B9diyidancom%20cos%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/37650/%E7%AC%AC%E4%B8%80%E5%BC%B9diyidancom%20cos%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

// 移除右键屏蔽
if (typeof doNothing === 'function') {
    doNothing = null;
}

// 解除右键菜单屏蔽
let xzStyle = document.createElement('style');
xzStyle.innerHTML = '.user_post_content.no_event div, .user_post_content.no_event p, .user_post_content.no_event img, .user_post_content.no_event a{pointer-events:all;-webkit-user-select:all;user-select:all;-moz-user-select:all;-ms-user-select:all;-o-user-select:all;}';
document.body.appendChild(xzStyle);

// 输出cos图片网址
let xzDiv = document.createElement('div');
xzDiv.setAttribute('style', 'padding-left:35px;color:#999;');
// 1楼的图片
let pic_1L = document.querySelectorAll('.user_post_content a');
if (pic_1L.length > 0) {
    for (let index = 0; index < pic_1L.length; index++) {
        xzDiv.innerHTML += pic_1L[index].href + '<br>';
    }
}
// 楼主在底下发的图
let louzhu = document.querySelectorAll('.louzhu'); //第一个.louzhu就是1楼，所以跳过
if (louzhu.length > 1) {
    for (let index = 1; index < louzhu.length; index++) {
        const pic_else_lou = louzhu[index].parentNode.parentNode.querySelectorAll('.post_content_img a');
        for (let index2 = 0; index2 < pic_else_lou.length; index2++) {
            xzDiv.innerHTML += pic_else_lou[index2].href + '<br>';
        }
    }
}
// 插入文档
let user_post_title = document.querySelector('.user_post_title');
user_post_title.parentNode.insertBefore(xzDiv, user_post_title);