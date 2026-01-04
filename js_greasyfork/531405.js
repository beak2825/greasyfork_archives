// ==UserScript==
// @name         将你讨厌的洛谷用户头像换成奶龙动图
// @namespace    https://www.luogu.com.cn/user/365751
// @version      0.1.2
// @description  将你讨厌的洛谷用户头像换成奶龙喷火动图
// @author       cooluo
// @match        https://www.luogu.com.cn/*
// @match        https://www.luogu.com.cn/*/*
// @match        https://www.luogu.com.cn/*/*/*
// @icon         https://cdn.luogu.com.cn/upload/usericon/3.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531405/%E5%B0%86%E4%BD%A0%E8%AE%A8%E5%8E%8C%E7%9A%84%E6%B4%9B%E8%B0%B7%E7%94%A8%E6%88%B7%E5%A4%B4%E5%83%8F%E6%8D%A2%E6%88%90%E5%A5%B6%E9%BE%99%E5%8A%A8%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/531405/%E5%B0%86%E4%BD%A0%E8%AE%A8%E5%8E%8C%E7%9A%84%E6%B4%9B%E8%B0%B7%E7%94%A8%E6%88%B7%E5%A4%B4%E5%83%8F%E6%8D%A2%E6%88%90%E5%A5%B6%E9%BE%99%E5%8A%A8%E5%9B%BE.meta.js
// ==/UserScript==

var uid = '/1.';

function replaceAvatar(className) {
    var avatar = document.getElementsByClassName(className);
    var len = avatar.length;
    for (var i = 0; i < len; i++) {
        if (!avatar[i].src) {
            if (avatar[i].innerHTML.includes(uid)) {
                var p = avatar[i].innerHTML.indexOf('src');
                var q = avatar[i].innerHTML.indexOf('png');
                var s = avatar[i].innerHTML.substring(0, p - 1);
                var t = avatar[i].innerHTML.substring(q + 3);
                avatar[i].innerHTML = s + 'src=\"https://jsdelivrcn.netlify.app/gh/chenyuxuan2009/luogu_submission_better/Judging.gif' + t;
            }
        }
        else if (avatar[i].src.includes(uid)) {
            avatar[i].src = 'https://jsdelivrcn.netlify.app/gh/chenyuxuan2009/luogu_submission_better/Judging.gif';
        }
    }
}

(function() {
    'use strict';

    // Your code here...
    setInterval(function () {
        replaceAvatar('am-comment-avatar');
        replaceAvatar('avatar-small');
        replaceAvatar('avatar');
    }, 10);
})();
