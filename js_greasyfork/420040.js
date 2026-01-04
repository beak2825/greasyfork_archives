// ==UserScript==
// @name         douban手机网页站可用
// @namespace    https://github.com/nameldk/user-script
// @match        https://m.douban.com/home_guide*
// @match        https://m.douban.com/group/*
// @match        https://m.douban.com/group/topic/*
// @match        https://m.douban.com/movie/subject/*
// @match        https://m.douban.com/movie/review/*
// @match        https://m.douban.com/book/subject/*
// @match        https://m.douban.com/book/review/*
// @match        https://m.douban.com/music/subject/*
// @grant        none
// @version      0.1.2
// @author       nameldk
// @description  douban手机网页站跳过部分打开App查看
// @note         2021.01.20  v0.1.2 修复影评下查看全部回复，添加处理书评。
// @note         2021.01.11  v0.1.1 基本能用了

// @downloadURL https://update.greasyfork.org/scripts/420040/douban%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E7%AB%99%E5%8F%AF%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/420040/douban%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E7%AB%99%E5%8F%AF%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function $(selector, context) {
        if (!context)
            context = document;
        return context.querySelector(selector);
    }

    function $$(selector, context) {
        if (!context)
            context = document;
        return context.querySelectorAll(selector);
    }

    function removeBySelector(selector, context) {
        $$(selector, context).forEach(el => el.remove());
    }

    function matchUrl(url) {
        if (typeof url === 'string') {
            return location.href.indexOf(url) > -1
        } else if (url instanceof RegExp) {
            return url.test(location.href);
        }  else {
            return null;
        }
    }

    function delay(second, cb) {
        setTimeout(cb, second * 1000);
    }

    function isFunction(f) {
        return typeof f === 'function';
    }

    // douban 查看所有
    function biz_douban_common_read_all() {
        $$('.read-all>a').forEach(el => {
            let elClosest = el.closest('.note-content');
            if (!elClosest) {
                return;
            }
            let newNode = document.createElement('a');
            newNode.className = 'openapp block-btn';
            newNode.href = 'javascript:;';
            newNode.innerText = '点击展开';
            newNode.setAttribute('data-new', "1");
            el.parentNode.replaceChild(newNode, el);
            newNode.addEventListener('click', e => {
                e.stopPropagation();
                elClosest.style.maxHeight = null;
                elClosest.style.minHeight = null;
                elClosest.style.overflow = null;
                newNode.remove();

                removeBySelector('.oia-readall', elClosest);
                removeBySelector('.oia-prompt-box', elClosest);
            });
        });
    }

    // 打开App链接
    function biz_douban_common_a_to_app(context, urlCb) {
        $$('a[href^="/to_app"]', context).forEach(el => {
            let href = '';
            if (urlCb) {
                href = urlCb(el.href);
            } else {
                let match = el.href.match(/url=(.+?)&|url=(.+)/);
                href = match && (match[1] || match[2] )|| '';
            }
            if (href) {
                el.href = href;
                el.addEventListener('click', e => e.stopPropagation());
            }
            el.innerHTML = el.innerHTML.replace(/\·?\s*打开App，?/, '');
        });
    }

    // ioa remove
    function biz_douban_common_a_oia() {
        $$('span.oia').forEach(el => el.remove());
    }

    // douban 首页
    function biz_douban_home_guide() {
        biz_douban_common_a_to_app();

        $$('.app-items>a').forEach(el => el.removeAttribute('target'));
    }

    // douban小组详情
    function biz_douban_group_detail() {
        biz_douban_common_a_to_app();
        biz_douban_common_a_oia();
    }

    // douban小组
    function biz_douban_group_topic() {
        let subjectId = (location.href.match(/\/group\/topic\/(\d+)\//)||[])[1] || 0;
        let elBtn = $('body > div.page > div.card > section.note-comments > div.show-all > a');

        biz_douban_btn_set_url(elBtn, '查看全部回复', `https://m.douban.com/group/topic/${subjectId}/comments`);
        biz_douban_common_read_all();
        biz_douban_common_a_to_app();
        biz_douban_common_a_oia();
    }

    // doban 按钮设置
    function biz_douban_btn_set_url(elBtn, textOrFunc, url, params) {
        if (elBtn) {
            elBtn.setAttribute('href', url || elBtn.href || '');
            if (params && params.is_html) {
                elBtn.innerHTML = isFunction(textOrFunc) ? textOrFunc(elBtn.innerText) : textOrFunc;
            } else {
                elBtn.innerText = isFunction(textOrFunc) ? textOrFunc(elBtn.innerText) : textOrFunc;
            }
            elBtn.addEventListener('click', e => e.stopPropagation());
        }
    }

    // douban 电影
    function biz_bouban_movie_subject() {
        let subjectId = (location.href.match(/\/movie\/subject\/(\d+)\//)||[])[1] || 0;
        if (!subjectId)
            return;
        // 打开App查看全部预告片
        let elBtn = $('body > div.page > div.card > section.subject-pics > h2 > a');
        biz_douban_btn_set_url(elBtn, '<span class="app-link">查看全部剧照</span>', location.pathname + 'all_photos', {"is_html": 1});

        // 打开App，看更多热门短评
        elBtn = $('#comment-list > div > a');
        biz_douban_btn_set_url(elBtn, '查看全部短评', `https://m.douban.com/movie/subject/${subjectId}/comments`);

        // 打开App，看更多热门影评
        elBtn = $('body > div.page > div.card > section.subject-reviews > div > p > a');
        biz_douban_btn_set_url(elBtn, '查看全部影评', `https://m.douban.com/movie/subject/${subjectId}/reviews`);
    }

    // douban 影评
    function biz_bouban_movie_review() {
        let reviewId = (location.href.match(/\/movie\/review\/(\d+)/)||[])[1] || 0;
        let elBtn = $('body > div.page > div.card > section.note-comments > a');
        biz_douban_btn_set_url(elBtn, '查看全部回复', `https://m.douban.com/movie/review/${reviewId}/comments`);

        biz_douban_common_read_all();
    }

    // douban 读书
    function biz_douban_book_subject() {
        let subjectId = (location.href.match(/\/book\/subject\/(\d+)\//)||[])[1] || 0;
        let elBtn = $('#comment-list > div > a');
        biz_douban_btn_set_url(elBtn, '查看短评', `https://m.douban.com/book/subject/${subjectId}/comments`);

        elBtn = $('body > div.page > div > section.subject-annotations > p > a');
        biz_douban_btn_set_url(elBtn, '查看笔记', `https://m.douban.com/book/subject/${subjectId}/annotation`);

        elBtn = $('body > div.page > div > section.subject-section_reviews > p > a');
        biz_douban_btn_set_url(elBtn, '查看书评', `https://m.douban.com/book/subject/${subjectId}/reviews`);

        elBtn = $('#discussions-root > div > a');
        biz_douban_btn_set_url(elBtn, '查看讨论', `https://m.douban.com/book/subject/${subjectId}/discussions`);
    }

    // douban 书评
    function biz_douban_book_review() {
        let reviewId = (location.href.match(/\/book\/review\/(\d+)/)||[])[1] || 0;
        let elBtn = $('body > div.page > div.card > section.note-comments > a');
        biz_douban_btn_set_url(elBtn, '查看全部回复', `https://m.douban.com/book/review/${reviewId}/comments`);

        biz_douban_common_read_all();
    }

    // douban music
    function biz_douban_music_subject() {
        let subjectId = (location.href.match(/\/music\/subject\/(\d+)\//)||[])[1] || 0;
        let elBtn = $('#comment-list > div > a');
        biz_douban_btn_set_url(elBtn, '查看短评', `https://m.douban.com/music/subject/${subjectId}/comments`);

        elBtn = $('#discussions-root > div > a');
        biz_douban_btn_set_url(elBtn, '查看讨论', `https://m.douban.com/music/subject/${subjectId}/discussions`);

        biz_douban_common_a_to_app();
    }

    // init
    if (matchUrl('https://m.douban.com/home_guide')) {
        delay(1, biz_douban_home_guide);
    }

    if (matchUrl(/https:\/\/m.douban.com\/group\/\d+/)) {
        delay(1, biz_douban_group_detail);
    }

    if (matchUrl('https://m.douban.com/group/topic/')) {
        delay(1, biz_douban_group_topic);
    }

    if (matchUrl('https://m.douban.com/movie/subject/')) {
        delay(1, biz_bouban_movie_subject);
    }

    if (matchUrl('https://m.douban.com/movie/review/')) {
        delay(1, biz_bouban_movie_review);
    }

    if (matchUrl('https://m.douban.com/book/subject/')) {
        delay(1, biz_douban_book_subject);
    }

    if (matchUrl('https://m.douban.com/book/review/')) {
        delay(1, biz_douban_book_review);
    }

    if (matchUrl('https://m.douban.com/music/subject/')) {
        delay(1, biz_douban_music_subject);
    }

})();