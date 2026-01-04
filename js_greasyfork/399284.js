// ==UserScript==
// @name         得到PC版工具箱 - 黑夜模式
// @namespace    https://www.dedao.cn
// @version      0.7
// @description  用于实现得到PC版的黑夜模式
// @author       arronkler
// @match        https://www.dedao.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399284/%E5%BE%97%E5%88%B0PC%E7%89%88%E5%B7%A5%E5%85%B7%E7%AE%B1%20-%20%E9%BB%91%E5%A4%9C%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/399284/%E5%BE%97%E5%88%B0PC%E7%89%88%E5%B7%A5%E5%85%B7%E7%AE%B1%20-%20%E9%BB%91%E5%A4%9C%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var doc = document;
    var qa = document.querySelectorAll.bind(doc);
    var q = document.querySelector.bind(doc);

    var bgMain = '#333';
    var colorMain = '#fff';
    var body = doc.body;
    body.style.background = bgMain;
    body.style.color = colorMain;

    function setStyle(queries, callback) {
        queries.forEach(function (elem) {
            callback(elem);
        });
    }

    function injectStyle() {
        var styleFragment = document.createElement('style');
        var content = '';

        // 设置字体颜色白色
        setStyle(
            ['.iget-common-c1',
             '.iget-search-control button',
             '.introduce-tab',
             '.tab-active',
             '.content-tab',
             '.iget-common-button',
             '.intro-content',
             'dd.message-user-post',
             '.iget-home .iget-home-bought .bought-header .super-tab .tab-item.on .item-text',
             '.text-box .txt',
             '.recommend-lit-box .section-title .recommend-title',
             '.knowledge .iget-card .detail .summary',
             '.audio-info .user-info .name-and-tip .name',
             '.iget-common-c2',
             '.recommend-users .ul-team .team-member .nick-name',
             '.iget-drop-down-card .select-box .select-item',
             '.iget-course-detail .course-body .introduce-and-content .filter .airticle-txt',
             '.iget-course-detail .course-body .introduce-and-content .section-info.course .info-value',
             '.detail-header .detail-header-main .detail-header-left .detail-title',
             '.article .article-body h2.titleCenter',
            ], function (item) {
                content += (item + ' {color: ' + colorMain +' !important;}');
            });

        // 设置背景色
        setStyle([
            '.iget-course-header',
            '.iget-common-b9',
            '.pc-main',
            '.iget-common-b7',
            '.course-recommend',
            '.tab-head',
            '.filter',
            '.course-nav',
            '.message-v2',
            '.course-module li',
            '.chapter-mod',
            '.course-info',
            '.course-bookends',
            'figure',
            '.iget-bought-header',
            '.pageControl',
            '.iget-header .iget-header-main',
            '.iget-footer .footer-condition',
            '.recommend-lit-box',
            '.iget-note-detail .left-content-wrapper .left-content .forward-comment-like .list-header',
            '.iget-topic-detail .left-content .left-content-wrap .tab-fixed',
        ], function (item) {
            content += (item + ' {background: ' + bgMain +' !important;}');
        });

        // 设置灰色背景
        setStyle([
            '.recommend-users .ul-team .team-member',
            '.source-card',
            '.note-user-info.user-info-fold',
            '.iget-common-b8',
            '.replay-list',
            '.iget-course-detail .course-body .introduce-and-content .content .sec-true .sec-list .single-sec .drawer-main .content-list, .iget-course-detail .course-body .introduce-and-content .introduce .sec-true .sec-list .single-sec .drawer-main .content-list',
            '.message-v2 .message-list-wrap ul.message-list li.message-item dl.message-user dl.message-author',
        ], function (item) {
            content += (item + ' {background: #666 !important; border-color: #666 !important;}');
        });

        // 设置字体颜色黑色
        setStyle([
           '.user-operating .iget-common-button.iget-common-c1'
        ], function (item) {
            content += (item + ' {background: ' + '#333' +' !important;}');
        });

        styleFragment.innerHTML = content;

        document.body.appendChild(styleFragment);
    }

    injectStyle();
})();