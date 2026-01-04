// ==UserScript==
// @name         B站专栏合集定位
// @namespace    indefined
// @version      1.1
// @description  为B站专栏合集中的文章添加目录定位和翻页功能，在合集页面上添加了跳到底部（最新文章）的功能
// @author       sling_013579
// @match        https://www.bilibili.com/opus/*
// @match        https://www.bilibili.com/read/readlist/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546117/B%E7%AB%99%E4%B8%93%E6%A0%8F%E5%90%88%E9%9B%86%E5%AE%9A%E4%BD%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/546117/B%E7%AB%99%E4%B8%93%E6%A0%8F%E5%90%88%E9%9B%86%E5%AE%9A%E4%BD%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let locateCurrent = document.createElement("button");

    locateCurrent.id = 'locate';
    locateCurrent.className = 'opus-collection__action';
    locateCurrent.innerHTML = "<span>跳转当前</span>";

    // 前后翻页功能
    let prevArticle = document.createElement("div");
    let nextArticle = document.createElement("div");

    prevArticle.className = "side-toolbar__btn";
    nextArticle.className = "side-toolbar__btn";

    prevArticle.innerHTML = '<span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="10" viewBox="-5 0 20 20"><path fill="#000000" d="m9 2l1.3 1.3L3.7 10l6.6 6.7L9 18l-8-8zm8.5 0L19 3.3L12.2 10l6.7 6.7l-1.4 1.3l-8-8z"/></svg>上篇</span>';
    nextArticle.innerHTML = '<span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="10" viewBox="-5 0 20 20"><path fill="#000000" d="M11 2L9.7 3.3l6.6 6.7l-6.6 6.7L11 18l8-8zM2.5 2L1 3.3L7.8 10l-6.7 6.7L2.5 18l8-8z"/></svg>下篇</span>';

    // 跳到底部功能
    let toEnd = document.createElement("button");
    toEnd.className = "side-toolbar__btn";
    toEnd.style = "cursor: pointer;position: fixed;bottom: 20.88px; right: 39.7px;width: 58px;height: 58px;background-color: #dce9fa;color: #000000;text-align: center;border-radius: 15px;border: none;box-shadow: 2px 2px 2px #888888;"
    toEnd.innerHTML = "<span>底部</span>";

    if(document.querySelector('.opus-collection')){
        let ops = document.querySelector(".opus-collection__header");
        ops.appendChild(locateCurrent);
        document.querySelector(".side-toolbar__bottom").appendChild(prevArticle);
        document.querySelector(".side-toolbar__bottom").appendChild(nextArticle);
    }


    locateCurrent.onclick = function(){
        let currentReading = document.querySelector('.active');
        currentReading.scrollIntoView({
            behavior: "smooth"
        })
    }

    if(document.URL.includes("readlist")){
        document.querySelector(".list").appendChild(toEnd);
    }

    prevArticle.onclick = function(){
        if(document.querySelector(".opus-collection__content").innerHTML == ''){
            alert("请打开目录一次以获取目录信息")
        } else {
            // 获取上一篇文章，但需注意目录是正序还是倒序排列
            let articleList = document.querySelectorAll(".opus-collection__item");
            let loc = 0;
            for (let index = 0; index < articleList.length; index++) {
                if(articleList[index]._prevClass == "opus-collection__item active"){
                    loc = index;
                    break;
                }
            }
            // 还需检查当前文章是否为列表的第一篇或最后一篇，以决定后续翻页能否起效
            if(document.querySelector(".opus-collection__action").innerText.includes("正序") & loc != 0){
                articleList[loc - 1].click();
            } else if(document.querySelector(".opus-collection__action").innerText.includes("倒序") & loc != articleList.length - 1) {
                articleList[loc + 1].click();
            } else {
                alert("已到达文集开头！");
            }
        }
    }

    nextArticle.onclick = function(){
        if(document.querySelector(".opus-collection__content").innerHTML == ''){
            alert("请打开目录一次以获取目录信息")
        } else {
            // 获取下一篇文章，但需注意目录是正序还是倒序排列
            let articleList = document.querySelectorAll(".opus-collection__item");
            let loc = 0;
            for (let index = 0; index < articleList.length; index++) {
                if(articleList[index]._prevClass == "opus-collection__item active"){
                    loc = index;
                    break;
                }
            }
            if(document.querySelector(".opus-collection__action").innerText.includes("正序") & loc != articleList.length - 1){
                articleList[loc + 1].click();
            } else if(document.querySelector(".opus-collection__action").innerText.includes("倒序") & loc != 0) {
                articleList[loc - 1].click();
            } else {
                alert("已到达文集末尾！");
            }
        }
    }

    // 跳底功能实现
    toEnd.onclick = function(){
        let articleList = document.querySelectorAll('.list-content-item');
        let currentReading = articleList[articleList.length - 1];
        currentReading.scrollIntoView({
            behavior: "smooth"
        })
    }


    window.onload = function(){
        const collectionElement = document.querySelector(".side-toolbar__action.collection");

        if (collectionElement) {
            // 第一次点击
            collectionElement.click();
            setTimeout(() => {
                collectionElement.click();
            }, 100);
        } else {
            console.error("未找到对应class的元素！");
        }
    };

})();