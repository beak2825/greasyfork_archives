// ==UserScript==
// @name         Family remove watermark
// @namespace    http://tampermonkey.net/
// @version      1.3.4
// @description  去除内网文章水印（部分水印直接在图片里，去不掉）
// @author       热心群众
// @match        *://chanpin.family.baidu.com/article/*
// @match        *://family.baidu.com/*/article/*
// @match        *://news.family.baidu.com/*
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375238/Family%20remove%20watermark.user.js
// @updateURL https://update.greasyfork.org/scripts/375238/Family%20remove%20watermark.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.wrapper .container').wrapInner('<div class="familyremovewatermark" style="background: #fff; height: auto;"></div>');
    $('.portal .article-wrap .article-inner .article-content').wrapInner('<div class="familyremovewatermark" style="background: #fff; height: auto;"></div>');
    $('.portal .article-wrap .article-inner .article-content').css('background-clip', 'content-box');
    if (/news.family.baidu.com/i.test(window.location.href)) {
        $('.wrapper .container .main .article').wrapInner('<div class="familyremovewatermark" style="background: #fff; height: auto;"></div>');
        $('.wrapper .container .sidebar').wrapInner('<div class="familyremovewatermark" style="background: #fff; height: auto;"></div>');
    }
    $('.familyremovewatermark').append('<div style="clear: both;"></div>');
    $('.main.area-detail').css('background', '#FFF')
    // 不显示右上角姓名和头像
    $('.avatar .avatar-slim .avatar-head img').attr('src', 'http://static.family.baidu.com/img/family_people.jpg');
    $('.avatar .avatar-slim .avatar-user-name').html('<span>hello world</span>');
    $('.portal .article-wrap .article-inner .article-content .article-comment .person-comment-pic').attr('src', 'http://static.family.baidu.com/img/family_people.jpg');
    setTimeout(function () {
        // 可能不生效，再试一次
        $('.main.area-detail').css('background', '#FFF');
        $('.avatar .avatar-slim .avatar-head img').attr('src', 'http://static.family.baidu.com/img/family_people.jpg');
        $('.portal .article-wrap .article-inner .article-content .article-comment .person-comment-pic').attr('src', 'http://static.family.baidu.com/img/family_people.jpg');
        $('.portal .article-wrap .article-inner .article-content').css('background-clip', 'content-box');
    }, 500);
    setTimeout(function () {
        // 可能不生效，再试一次
        $('.main.area-detail').css('background', '#FFF');
        $('.avatar .avatar-slim .avatar-head img').attr('src', 'http://static.family.baidu.com/img/family_people.jpg');
        $('.portal .article-wrap .article-inner .article-content .article-comment .person-comment-pic').attr('src', 'http://static.family.baidu.com/img/family_people.jpg');
        $('.portal .article-wrap .article-inner .article-content').css('background-clip', 'content-box');
    }, 2000);
})();