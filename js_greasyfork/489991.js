// ==UserScript==
// @name         Anime字幕论坛帖子美化
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  帖子分层更加明显
// @license MIT
// @author       ElapseRecall
// @match        https://bbs.acgrip.com/*
// @match        https://bbs.acgrip.com/forum.php?*
// @icon         https://bbs.acgrip.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489991/Anime%E5%AD%97%E5%B9%95%E8%AE%BA%E5%9D%9B%E5%B8%96%E5%AD%90%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/489991/Anime%E5%AD%97%E5%B9%95%E8%AE%BA%E5%9D%9B%E5%B8%96%E5%AD%90%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let postList = document.querySelector('#postlist');
    postList.style.border = '0px';

    let postTitle = postList.firstElementChild;
    postTitle.style.border = '1px solid #E5E5E5';
    postTitle.style.marginBottom = '5px';

    let allPost = document.querySelectorAll('#postlist > div[id^=post_]');
    allPost.forEach((post, index) => {
        post.style.border = '1px solid #E5E5E5';

        if (index == 0) {
            post.style.marginTop = '5px';
        } else {
            post.style.marginTop = '10px';
        }
    });

})();