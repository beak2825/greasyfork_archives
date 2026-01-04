// ==UserScript==
// @name         B站搜索栏 - 鼠标悬停提示
// @namespace    mscststs
// @version      2.2
// @license      ISC
// @description  搜索栏鼠标悬停提示
// @author       mscststs
// @match        https://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @require      https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=713767
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485259/B%E7%AB%99%E6%90%9C%E7%B4%A2%E6%A0%8F%20-%20%E9%BC%A0%E6%A0%87%E6%82%AC%E5%81%9C%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/485259/B%E7%AB%99%E6%90%9C%E7%B4%A2%E6%A0%8F%20-%20%E9%BC%A0%E6%A0%87%E6%82%AC%E5%81%9C%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    StartObserveTitle();
    async function StartObserveTitle(){

        function trendingTitles(trendingElements) {
            for (var i = 0; i < trendingElements.length; i++) {
                var trendingContent = trendingElements[i];
                var trendingText = trendingContent.querySelector(".trending-text");
                trendingContent.setAttribute("title", trendingText.innerHTML);
            }
            //alert(trendingElements[0].title);
        }

        // 设置悬停信息
        function titleTexts(historyElements, trendingElements) {
            let historyLength = 0,
                historyTitle = "",
                trendingTitle = "";

            if(historyElements[0]) {
                historyLength = historyElements.length;
                historyTitle = historyElements[0].title;
                if(trendingElements[0]) {
                    trendingTitle = trendingElements[0].title;
                }
            }

            if(historyTitle == "") {
                var index = historyLength > trendingElements.length ? historyLength : trendingElements.length;
                for (var i = 0; i < index; i++) {
                    if(i < historyLength) {
                        var historyContent = historyElements[i];
                        var historyText = historyContent.querySelector(".history-text");
                        historyContent.setAttribute("title", historyText.innerHTML);
                    }

                    if(i < trendingElements.length) {
                        var trendingContent = trendingElements[i];
                        var trendingText = trendingContent.querySelector(".trending-text");
                        trendingContent.setAttribute("title", trendingText.innerHTML);
                    }
                }
            } else if(trendingTitle == "") {
                if(trendingElements[0]) trendingTitles(trendingElements);
            }
        }

        async function onTitle() {
            //alert(456);
            //await mscststs.wait(".histories .history-item");
            await mscststs.wait(".trending-item .trending-text");
            var historyElements = document.querySelectorAll(".histories .history-item");
            //var historyText = document.querySelectorAll(".histories .history-item .history-text");

            var trendingElements = document.querySelectorAll(".trending-item");
            //var trendingText = document.querySelectorAll(".trending-item .trending-text");

            titleTexts(historyElements, trendingElements);
        }

        // 设置搜索框点击事件
        function onTitleText(searchContent) {
            /*searchContent.addEventListener('focus', function() {
                onTitle();
            });*/
            searchContent.addEventListener('click', function() {
                onTitle();
            });
        }

        // 设置清除搜索框内容点击事件
        function onSearchClean(searchClean, searchContent) {
            searchClean.addEventListener('click', function() {
                // 获得焦点
                searchContent.focus();
                setTimeout(function() {
                    onTitle();
                }, 500);
            });
        }

        var url = document.URL;

        if(url.startsWith("https://search.bilibili.com/")) {
            await mscststs.wait(".search-header .search-input .search-input-wrap .search-input-el");
            var searchContent = document.querySelector(".search-header .search-input .search-input-wrap .search-input-el");
            onTitleText(searchContent);

        } else if(url.startsWith("https://space.bilibili.com/") || url.startsWith("https://www.bilibili.com/v/") || url.startsWith("https://www.bilibili.com/video/") || url.startsWith("https://www.bilibili.com/bangumi/play/") || url.startsWith("https://live.bilibili.com/") || url.startsWith("https://www.bilibili.com/c/") || url.startsWith("https://www.bilibili.com/bangumi/media/") || url.startsWith("https://www.bilibili.com/watchlater/")) {
            await mscststs.wait(".bili-header .center-search-container .center-search__bar .nav-search-content .nav-search-input");
            var searchContent = document.querySelector(".bili-header .center-search-container .center-search__bar .nav-search-content .nav-search-input");
            onTitleText(searchContent);

            await mscststs.wait(".bili-header .center-search-container .center-search__bar .nav-search-content .nav-search-clean");
            var searchClean = document.querySelector(".bili-header .center-search-container .center-search__bar .nav-search-content .nav-search-clean");
            onSearchClean(searchClean, searchContent);

        } else {
            await mscststs.wait(".international-header .nav-search .nav-search-keyword");
            var searchContent = document.querySelector(".international-header .nav-search .nav-search-keyword");
            onTitleText(searchContent);
        }

        /*await mscststs.wait(".bili-header .center-search-container .center-search__bar .nav-search-content .nav-search-input");
        var searchContent = document.querySelector(".bili-header .center-search-container .center-search__bar .nav-search-content .nav-search-input");
        searchContent.onfocus = async function() {
            await mscststs.wait(".histories .history-item");
            var historyElements = document.querySelectorAll(".histories .history-item");
            var historyText = document.querySelectorAll(".histories .history-item .history-text");
            titleText(historyElements, historyText);

            await mscststs.wait(".trending-item .trending-text");
            var trendingElements = document.querySelectorAll(".trending-item");
            var trendingText = document.querySelectorAll(".trending-item .trending-text");
            titleText(trendingElements, trendingText);
        }*/

    }
})();