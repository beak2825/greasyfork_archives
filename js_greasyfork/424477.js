// ==UserScript==
// @name         Add nice rounded corners and shadows👏
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  百度文库的卡片增加阴影和圆角👏 + 隐藏下载app蒙版
// @author       hongbin
// @match        https://tiku.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424477/Add%20nice%20rounded%20corners%20and%20shadows%F0%9F%91%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/424477/Add%20nice%20rounded%20corners%20and%20shadows%F0%9F%91%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const question= document.getElementsByClassName('question')[0];
    question.style['border-radius'] = '1rem';
    question.style['box-shadow'] = '2px 2px 10px #ccc';

    const answer= document.getElementsByClassName('answer')[0];
    answer.style['box-shadow'] = '2px 2px 10px #ccc';
    answer.style['border-radius'] = '1rem';

    const sidebar= document.getElementsByClassName('sidebar')[0];
    sidebar.style['border-radius'] = '1rem';
    sidebar.style['box-shadow'] = '2px 2px 10px #ccc';
    sidebar.style.overflow = 'hidden';
   //隐藏下载app蒙版
    $('.guid-to-app-mask').animate({'opacity':0},0);
    $('.guid-to-app-container').remove();

})();