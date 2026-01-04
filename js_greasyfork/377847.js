// ==UserScript==
// @name         起点中文网去除推荐;百度去除搜索热点列表;B站去除推荐、评论；网易云去除推荐、评论;知乎去除右侧推荐;HiFiNi签到后自动跳转主页;去除必应新闻热点推荐
// @namespace    https://greasyfork.org/zh-CN/scripts/377847
// @version      0.8.1
// @description  这个脚本的功能有：起点中文网去除推荐;百度去除搜索热点列表;B站去除推荐、评论；网易云去除推荐、评论;知乎去除右侧推荐;HiFiNi签到后自动跳转主页;去除必应新闻热点推荐
// @author       lsovaber
// @match        https://book.qidian.com/*/*
// @match        https://www.qidian.com/*
// @match        https://*.baidu.com/*
// @match        https://music.163.com/*
// @match        https://www.bilibili.com/*
// @match        https://www.zhihu.com/*
// @match        https://www.hifini.com/*
// @match        https://cn.bing.com/*
// @grant        GM_addStyle
// @run-at       document_start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/377847/%E8%B5%B7%E7%82%B9%E4%B8%AD%E6%96%87%E7%BD%91%E5%8E%BB%E9%99%A4%E6%8E%A8%E8%8D%90%3B%E7%99%BE%E5%BA%A6%E5%8E%BB%E9%99%A4%E6%90%9C%E7%B4%A2%E7%83%AD%E7%82%B9%E5%88%97%E8%A1%A8%3BB%E7%AB%99%E5%8E%BB%E9%99%A4%E6%8E%A8%E8%8D%90%E3%80%81%E8%AF%84%E8%AE%BA%EF%BC%9B%E7%BD%91%E6%98%93%E4%BA%91%E5%8E%BB%E9%99%A4%E6%8E%A8%E8%8D%90%E3%80%81%E8%AF%84%E8%AE%BA%3B%E7%9F%A5%E4%B9%8E%E5%8E%BB%E9%99%A4%E5%8F%B3%E4%BE%A7%E6%8E%A8%E8%8D%90%3BHiFiNi%E7%AD%BE%E5%88%B0%E5%90%8E%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E4%B8%BB%E9%A1%B5%3B%E5%8E%BB%E9%99%A4%E5%BF%85%E5%BA%94%E6%96%B0%E9%97%BB%E7%83%AD%E7%82%B9%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/377847/%E8%B5%B7%E7%82%B9%E4%B8%AD%E6%96%87%E7%BD%91%E5%8E%BB%E9%99%A4%E6%8E%A8%E8%8D%90%3B%E7%99%BE%E5%BA%A6%E5%8E%BB%E9%99%A4%E6%90%9C%E7%B4%A2%E7%83%AD%E7%82%B9%E5%88%97%E8%A1%A8%3BB%E7%AB%99%E5%8E%BB%E9%99%A4%E6%8E%A8%E8%8D%90%E3%80%81%E8%AF%84%E8%AE%BA%EF%BC%9B%E7%BD%91%E6%98%93%E4%BA%91%E5%8E%BB%E9%99%A4%E6%8E%A8%E8%8D%90%E3%80%81%E8%AF%84%E8%AE%BA%3B%E7%9F%A5%E4%B9%8E%E5%8E%BB%E9%99%A4%E5%8F%B3%E4%BE%A7%E6%8E%A8%E8%8D%90%3BHiFiNi%E7%AD%BE%E5%88%B0%E5%90%8E%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E4%B8%BB%E9%A1%B5%3B%E5%8E%BB%E9%99%A4%E5%BF%85%E5%BA%94%E6%96%B0%E9%97%BB%E7%83%AD%E7%82%B9%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建函数
    let changeElement = function (element, status) {
        if (document.getElementsByClassName(element)) {
            [...document.getElementsByClassName(element)].map(n => {
                n.style.visibility = status
            });
        }
        if (document.getElementById(element)) {
            document.getElementById(element).style.visibility = status;
        }
    };

    // 要隐藏的元素的class或id
    let elements = ["content_right", "rs_new", "s-hotsearch-wrapper","_2v051",//百度,
        "m-rctlist f-cb", "g-wrap7", "m-sglist f-cb", "right-wrap fr",
        "book-weekly-hot-rec weekly-hot-rec", "right-items-detail", "book-album-ddl jsAutoReport",//起点
        "recommend-list report-wrap-module report-scroll-module", "pop-live report-wrap-module report-scroll-module",
        "list-item reply-wrap is-top", "comment", "reco_list", "live_recommand_report",
        "cmmts j-flag", "g-sd4",//网易云,
        "TopSearch-items", "Card css-oyqdpg",//知乎
        "bottom_row widget msnpeek nomvs", "peregrine-widgets", "below_sbox", "b_context", "wd-pn" // 必应
    ];


    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes') {
                elements.forEach(function (i) {
                    changeElement(i, "hidden");
                });
            }
        });
    });

    // 监听页面变化，并隐藏元素
    observer.observe(document, {
        childList: true,
        attributes: true,
        subtree: true,
        characterData: true
    });

    let url = window.location.href
    // HiFiNi签到后自动跳转主页
    if (url === "https://www.hifini.com/sg_sign.htm" &&
        document.getElementById('sign').innerText === '已签') {
        window.location.href = 'https://www.hifini.com';
        // 知乎隐藏搜索框的placeholder
    } else if (url.includes('zhihu.com')) {
        GM_addStyle("input::placeholder{opacity: 0;}");
    }
})();

