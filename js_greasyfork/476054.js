// ==UserScript==
// @name         B站通过黑名单屏蔽UP主视频和评论
// @namespace    https://greasyfork.org/zh-CN/users/810690-twinsdestiny
// @version      0.5
// @description  获取B站黑名单，过滤对应UP主的视频及评论（视频：首页、搜索页、视频右侧推荐栏）
// @author       TwinsDestiny
// @match        *://*.bilibili.com/*
// @require      https://cdn.jsdelivr.net/npm/arrive@2.4.1/minified/arrive.min.js
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476054/B%E7%AB%99%E9%80%9A%E8%BF%87%E9%BB%91%E5%90%8D%E5%8D%95%E5%B1%8F%E8%94%BDUP%E4%B8%BB%E8%A7%86%E9%A2%91%E5%92%8C%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/476054/B%E7%AB%99%E9%80%9A%E8%BF%87%E9%BB%91%E5%90%8D%E5%8D%95%E5%B1%8F%E8%94%BDUP%E4%B8%BB%E8%A7%86%E9%A2%91%E5%92%8C%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    let blockList = new Array();

    // 获取当前页面的 Cookie
    const cookies = document.cookie;

    // 隐藏
    await document.arrive('body', { fireOnAttributesModification: false, onceOnly: false, existing: true }, async function () {

        var myHeaders = new Headers();
        myHeaders.append("Cookie", cookies);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
            credentials: "include"
        };

        fetch("https://api.bilibili.com/x/relation/blacks?jsonp=jsonp&pn=1&ps=20&re_version=0", requestOptions)
            .then(response => response.json())
            .then((result) => {
                let total = result.data.total;
                let pages = Math.floor(total/20)+1;
                for(let i = 1;i<=pages;i++){
                    fetch("https://api.bilibili.com/x/relation/blacks?jsonp=jsonp&pn="+i+"&ps=20&re_version=0", requestOptions)
                    .then(response => response.json())
                    .then((result) => {
                        result.data.list.forEach((data) => {
                            blockList.push(data.uname);
                        });
                    })
                    .catch(error => console.log('error', error));
                }
            })
            .catch(error => console.log('error', error));


        setInterval(function () {
            $(".bili-video-card").each(function () {
                var authorSpan = $(this).find(".bili-video-card__info--author");
                if (authorSpan.length > 0) {
                    var authorName = authorSpan.text().trim();
                    if ($.inArray(authorName, blockList) !== -1) {
                        //$(this).parent().remove();
                        $(this).remove();
                    }
                }
            });

            $(".video-page-card-small").each(function () {
                var authorSpan = $(this).find(".name");
                if (authorSpan.length > 0) {
                    var authorName = authorSpan.text().trim();
                    if ($.inArray(authorName, blockList) !== -1) {
                        //$(this).parent().remove();
                        $(this).remove();
                    }
                }
            });

            $(".user-list").each(function () {
                var authorSpan = $(this).find(".user-name");
                if (authorSpan.length > 0) {
                    var authorName = authorSpan.text().trim();
                    if ($.inArray(authorName, blockList) !== -1) {
                        //$(this).parent().remove();
                        $(this).remove();
                    }
                }
            });

            $(".sub-reply-item").each(function () {
                var authorSpan = $(this).find(".sub-user-name");
                if (authorSpan.length > 0) {
                    var authorName = authorSpan.text().trim();
                    if ($.inArray(authorName, blockList) !== -1) {
                        //$(this).parent().remove();
                        $(this).remove();
                    }
                }
            });

            $(".root-reply-container").each(function () {
                var authorSpan = $(this).find(".user-name");
                if (authorSpan.length > 0) {
                    var authorName = authorSpan.text().trim();
                    if ($.inArray(authorName, blockList) !== -1) {
                        //$(this).parent().remove();
                        $(this).remove();
                    }
                }
            });

        }, 500);

    });

})();
