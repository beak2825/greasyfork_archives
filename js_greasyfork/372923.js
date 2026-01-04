// ==UserScript==
// @name         隐藏煎蛋上的OOXX数
// @namespace    http://jandan.net/
// @version      0.2
// @description  在点击段子、妹子图、无聊图的OOXX之前，隐藏OOXX数
// @author       水西瓜
// @match        http://jandan.net/duan
// @match        http://jandan.net/ooxx
// @match        http://jandan.net/pic
// @match        https://jandan.net/duan
// @match        https://jandan.net/ooxx
// @match        https://jandan.net/pic
// @match        http://jandan.net/duan/*
// @match        http://jandan.net/ooxx/*
// @match        http://jandan.net/pic/*
// @match        https://jandan.net/duan/*
// @match        https://jandan.net/ooxx/*
// @match        https://jandan.net/pic/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372923/%E9%9A%90%E8%97%8F%E7%85%8E%E8%9B%8B%E4%B8%8A%E7%9A%84OOXX%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/372923/%E9%9A%90%E8%97%8F%E7%85%8E%E8%9B%8B%E4%B8%8A%E7%9A%84OOXX%E6%95%B0.meta.js
// ==/UserScript==

(function() {
    $('.comment-like, .comment-unlike').next('span').attr('style','display:none');
    $(".comment-like, .comment-unlike").click(function() {
        $(this).closest('.jandan-vote').find('span').attr('style','display:');
    });
})();