// ==UserScript==
// @name         有料助手
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  有料答题助手
// @author       You
// @match        https://zhidao.baidu.com/youliao/qslist
// @match        https://zhidao.baidu.com/question/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389915/%E6%9C%89%E6%96%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/389915/%E6%9C%89%E6%96%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    setTimeout(() => {
            if (document.querySelector(".nav-link")) {
            function addSearch() {
                var titleList = document.querySelectorAll(".qslist-item");
                var titleSearch = document.createRange();
                var titleParse = titleSearch.createContextualFragment.bind(titleSearch);
                for (let index = 0; index < titleList.length; index++) {
                    const element = titleList[index].querySelector(".content-title");
                    const key = encodeURI(element.innerText);
                    const bwmelonSearchTitle = titleParse(` <br>
                    <a class="bwSearch" target="_blank" href="https://www.baidu.com/s?ie=UTF-8&wd=${key}">搜百度</a>
                    <a class="bwSearch" target="_blank" href="https://zhidao.baidu.com/search?lm=0&rn=10&pn=0&fr=search&ie=uft8&word=${key}">搜知道</a>
                    <a class="bwSearch" target="_blank" href="https://zhihu.com/search?type=content&q=${key}">搜知乎</a>
                    <a class="bwSearch" target="_blank" href="https://weixin.sogou.com/weixin?type=2&query=${key}">搜微信</a>
                    <a class="bwSearch" target="_blank" href="https://www.toutiao.com/search/?keyword=${key}">搜头条</a>
                    <a class="bwSearch" target="_blank" href="https://s.weibo.com/weibo?Refer=index&q=${key}">搜微博</a>
                    <a class="bwSearch" target="_blank" href="https://www.google.com/search?&q=${key}">搜谷歌</a>
                    `);
                    element.appendChild(bwmelonSearchTitle);
                }
                if (document.querySelector(".qslist-refresh") != null) {
                    document.querySelector(".qslist-refresh").addEventListener("click", function () {
                        setTimeout(() => {
                            addSearch()
                        }, 500);
                    })
                }
            }
            addSearch();
            document.querySelector(".qslist-nav").onclick = function () {
                setTimeout(() => {
                    addSearch();
                }, 500);
            }
            
        }
        }, 500);

        
        if (document.querySelector(".search-cont")) {
            // 答题界面
            var titleList = document.querySelector(".wgt-ask").querySelector("h1");
            var titleSearch = document.createRange();
            var titleParse = titleSearch.createContextualFragment.bind(titleSearch);
            const element = titleList.querySelector(".ask-title");
            const key = encodeURI(element.innerText);
            const bwmelonSearchTitle = titleParse(` <br>
            <a class="bwSearch" target="_blank" href="https://www.baidu.com/s?ie=UTF-8&wd=${key}">搜百度</a>
            <a class="bwSearch" target="_blank"
                href="https://zhidao.baidu.com/search?lm=0&rn=10&pn=0&fr=search&ie=uft8&word=${key}">搜知道</a>
            <a class="bwSearch" target="_blank" href="https://zhihu.com/search?type=content&q=${key}">搜知乎</a>
            <a class="bwSearch" target="_blank" href="https://weixin.sogou.com/weixin?type=2&query=${key}">搜微信</a>
            <a class="bwSearch" target="_blank" href="https://www.toutiao.com/search/?keyword=${key}">搜头条</a>
            <a class="bwSearch" target="_blank" href="https://s.weibo.com/weibo?Refer=index&q=${key}">搜微博</a>
            <a class="bwSearch" target="_blank" href="https://www.google.com/search?&q=${key}">搜谷歌</a>
            `);
            titleList.appendChild(bwmelonSearchTitle);

            // 图片搜索
            var imgsPositon = document.querySelector("#wgt-ask h1");
            var imgsSearch = document.createRange();
            var imgsParse = imgsSearch.createContextualFragment.bind(imgsSearch);
            var bwmelonSearchImgs = imgsParse(`
                <style>
                    .searchImgsBtn {
                    width: 96px;
                    height: 34px;
                    margin-left: 10px;
                    line-height: 34px;
                    text-align: center;
                    color: #fff;
                    background: #4DC86F;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-top: 5px;
                    display: inline-block;
                    border: 0;
                    }
                    .searchImgsIpt {
                    appearance: none;
                    background-color: #fff;
                    background-image: none;
                    border-radius: 3px;
                    border: 1px solid #d7d7d7;
                    box-sizing: border-box;
                    color: #1f2d3d;
                    display: inline-block;
                    font-size: inherit;
                    height: 36px;
                    line-height: 1;
                    outline: 0;
                    padding: 3px 10px;
                    transition: border-color .2s cubic-bezier(0.645,.045,.355,1);
                    width: 250px;
                    }
                </style>
                <br>
                <input type="text" placeholder="请输入需要搜索的图片关键词" id="searchImgs" class="searchImgsIpt" autocomplete="off">
                <button id="searchImgsBtn" class="searchImgsBtn">搜索(回车)</button>
            `);
            imgsPositon.appendChild(bwmelonSearchImgs);

            document.getElementById("searchImgs").addEventListener("keydown", function (e) {
                if (e.keyCode == "13") {
                    searchImgs();
                }
            })
            document.getElementById("searchImgsBtn").addEventListener("click", searchImgs);

            // 搜索图片
            function searchImgs() {
                var searchImgs = document.getElementById("searchImgs").value;
                var bwmelonImgsKey = encodeURI(searchImgs);
                window.open(
                    "http://stock.tuchong.com/search?source=tc_pc_home_search&term=" + bwmelonImgsKey, "_blank");
            }

            
        }
})();