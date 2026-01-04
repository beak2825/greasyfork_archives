// ==UserScript==
// @name               琉璃神社_伪大佬
// @name:zh-CN         琉璃神社_伪大佬
// @name:en-US         HACG_Fake ace
// @description        替换神社等级图标。
// @version            1.0.5
// @author             LiuliPack
// @license            WTFPL
// @namespace          https://gitlab.com/LiuliPack/UserScript
// @match              https://www.hacg.me/wp/bbs/*
// @match              https://www.hacg.mom/wp/bbs/*
// @grant              GM_addStyle
// @run-at             document-body
// @downloadURL https://update.greasyfork.org/scripts/458624/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE_%E4%BC%AA%E5%A4%A7%E4%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/458624/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE_%E4%BC%AA%E5%A4%A7%E4%BD%AC.meta.js
// ==/UserScript==

'use strict';

// 定义昵称(nickname)变量，元素快捷选择($(元素定位符))函数
let $ = ele => document.querySelectorAll(ele),
    nickname = $('.wpforo-profile a')[0] && $('.wpforo-profile a')[0].href.split('/')[5];

// 替换等级图标和图标颜色
$(`div[data-mention="${nickname}"] .author-rating-full, .wpf-prof-rating .author-rating-full`).forEach(ele => {
    ele.innerHTML = '<i class="fas fa-trophy"></i>';
    ele.style.color = '#00bbfa';
});