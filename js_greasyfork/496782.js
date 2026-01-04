// ==UserScript==
// @name         B站旧版搜索栏 - 添加清除搜索框内容按钮
// @namespace    mscststs
// @version      1.6
// @license      ISC
// @description  添加旧版搜索栏清除搜索框内容按钮
// @author       mscststs
// @match        https://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @require      https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=713767
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496782/B%E7%AB%99%E6%97%A7%E7%89%88%E6%90%9C%E7%B4%A2%E6%A0%8F%20-%20%E6%B7%BB%E5%8A%A0%E6%B8%85%E9%99%A4%E6%90%9C%E7%B4%A2%E6%A1%86%E5%86%85%E5%AE%B9%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/496782/B%E7%AB%99%E6%97%A7%E7%89%88%E6%90%9C%E7%B4%A2%E6%A0%8F%20-%20%E6%B7%BB%E5%8A%A0%E6%B8%85%E9%99%A4%E6%90%9C%E7%B4%A2%E6%A1%86%E5%86%85%E5%AE%B9%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = document.URL;

    function SearchCleanButton() {
        var searchCleanHtml = "<div class='nav-search-clean has-keyword'><svg viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' clip-rule='evenodd' d='M8 14.75C11.7279 14.75 14.75 11.7279 14.75 8C14.75 4.27208 11.7279 1.25 8 1.25C4.27208 1.25 1.25 4.27208 1.25 8C1.25 11.7279 4.27208 14.75 8 14.75ZM9.64999 5.64303C9.84525 5.44777 10.1618 5.44777 10.3571 5.64303C10.5524 5.83829 10.5524 6.15487 10.3571 6.35014L8.70718 8.00005L10.3571 9.64997C10.5524 9.84523 10.5524 10.1618 10.3571 10.3571C10.1618 10.5523 9.84525 10.5523 9.64999 10.3571L8.00007 8.70716L6.35016 10.3571C6.15489 10.5523 5.83831 10.5523 5.64305 10.3571C5.44779 10.1618 5.44779 9.84523 5.64305 9.64997L7.29296 8.00005L5.64305 6.35014C5.44779 6.15487 5.44779 5.83829 5.64305 5.64303C5.83831 5.44777 6.15489 5.44777 6.35016 5.64303L8.00007 7.29294L9.64999 5.64303Z' fill='#ced0d4'></path></svg></div>";
        return searchCleanHtml;
    }

    function SearchCleanCSS(size) {
        var searchClean = document.querySelector(".nav-search-clean.has-keyword");
        searchClean.style.cssText += "display:flex; justify-content:center; align-items:center; width:"+size+"px; height:"+size+"px; cursor:pointer; visibility:hidden;";//visibility:(inherit|hidden);
        return searchClean;
    }

    function SearchCleanRealize(searchKeyword, searchClean) {

        searchKeyword.oninput = function() {
            //alert(searchKeyword.value);
            if(searchKeyword.value != "") {
                searchClean.style.visibility = "inherit";

            } else if(searchKeyword.value == "") {
                searchClean.style.visibility = "hidden";
            }
        }

        var searchPath = document.querySelector(".nav-search-clean.has-keyword path");
        searchClean.onmouseover = function() {
            searchPath.setAttribute("fill", "#61666d");
        }
        searchClean.onmouseout = function() {
            searchPath.setAttribute("fill", "#ced0d4");
        }

        searchClean.onclick = function() {
            // 设置input的值
            searchKeyword.value = "";
            // 模拟input事件
            searchKeyword.dispatchEvent(new Event('input', { bubbles: true }));
            // 获得焦点
            searchKeyword.focus();
            // 模拟回退键
            searchKeyword.dispatchEvent(new KeyboardEvent('keydown', {'keyCode': 8, 'which': 8}));
        }
    }

    if(!(url.startsWith("https://space.bilibili.com/") || url.startsWith("https://www.bilibili.com/v/") || url.startsWith("https://www.bilibili.com/video/") || url.startsWith("https://search.bilibili.com/") || url.startsWith("https://www.bilibili.com/bangumi/play/") || url.startsWith("https://live.bilibili.com/") || url.startsWith("https://www.bilibili.com/c/") || url.startsWith("https://www.bilibili.com/bangumi/media/") || url.startsWith("https://www.bilibili.com/watchlater/"))) {
        StartSearchKeyword();
        async function StartSearchKeyword(){
            await mscststs.wait(".international-header .nav-search .nav-search-keyword");

            var searchKeyword = document.querySelector(".international-header .nav-search .nav-search-keyword");
            searchKeyword.style.cssText += "width:93.3%;";
            var searchCleanHtml = SearchCleanButton();
            searchKeyword.insertAdjacentHTML("afterend", searchCleanHtml);

            var searchClean = SearchCleanCSS(16);

            var navSearchform = document.querySelector(".international-header .nav-search #nav_searchform");
            navSearchform.style.cssText += "display:flex; height:36px!important; align-items:center;";

            searchKeyword.addEventListener('focus', function() {
                if(searchKeyword.value != "") {
                    searchClean.style.visibility = "inherit";
                }
            });
            SearchCleanRealize(searchKeyword, searchClean);
        }

    }/* else if(url.startsWith("https://search.bilibili.com/")) {
        StartSearchKeyword();
        async function StartSearchKeyword(){
            await mscststs.wait(".search-wrap .search-block .input-wrap input");

            var searchKeyword = document.querySelector(".search-wrap .search-block .input-wrap input");
            var searchCleanHtml = SearchCleanButton();
            searchKeyword.insertAdjacentHTML("beforeBegin", searchCleanHtml);

            var searchClean = SearchCleanCSS(17);
            searchClean.style.cssText += "position:absolute; top:30%; right:8px;";

            var searchBlock = document.querySelector(".search-wrap .search-block .input-wrap");

            searchBlock.onmouseover = function() {
                if(searchKeyword.value != "") {
                    searchClean.style.visibility = "inherit";
                }
            }
            searchBlock.onmouseout = function() {
                // 搜索框没有获得焦点时
                if(searchKeyword != document.activeElement) {
                    searchClean.style.visibility = "hidden";
                }
            }
            document.querySelector("body").addEventListener('click', function(event) {
                // 鼠标不在搜索框区域时
                if(!searchBlock.contains(event.target)) {
                    searchClean.style.visibility = "hidden";
                }
            });
            SearchCleanRealize(searchKeyword, searchClean);
        }
    }*/
})();