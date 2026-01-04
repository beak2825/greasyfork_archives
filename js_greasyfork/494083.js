// ==UserScript==
// @name         B站动态评论批量点赞
// @namespace    https://github.com/ssoda01
// @version      1.0
// @description  Bilibili dynamic comments batch likes
// @author       sodakoo
// @match        https://www.bilibili.com/opus/*
// @match        https://t.bilibili.com/*
// @license      GPL-3.0-only
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494083/B%E7%AB%99%E5%8A%A8%E6%80%81%E8%AF%84%E8%AE%BA%E6%89%B9%E9%87%8F%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/494083/B%E7%AB%99%E5%8A%A8%E6%80%81%E8%AF%84%E8%AE%BA%E6%89%B9%E9%87%8F%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.location.href.match(/^https:\/\/t\.bilibili\.com\/\d+\??.*$/) || window.location.href.match(/^https:\/\/www\.bilibili\.com\/opus\/\d+\??.*$/)) {
        const styleBatchLikes = `
    .btn-common {
        position: fixed;

        z-index: 9999;
        border-radius: 20px;
        background: #fff;
        box-shadow: 5px 5px #e3a2a233;
        width: 220px;
        padding: 0 8px;
        border: 2px solid;
        transition: .3s;
        cursor: pointer;
    }
    .btn-common-1 {
        top: 80px;
        right: 120px;
    }
    .btn-common-2 {
        top: 120px;
        right: 120px;
    }
    .btn-common-3 {
        top: 160px;
        right: 120px;
    }
    .btn-active{
        border-color:#777;
        color: #777;
    }
    .🐈 {
    background:#e3a2a233
    }
`
        var style = document.createElement('style');
        style.innerHTML = styleBatchLikes;
        document.head.appendChild(style);

        let button = document.createElement('button');
        button.classList.add('btn-common');
        button.classList.add('btn-common-1');
        button.classList.add('btn-active');
        button.textContent = "预览点赞";
        document.body.appendChild(button);

        button.addEventListener('click', function () {
            //batchLike()
            highlightListItems(getBatchList('get_all_unliked'))
        });

        let button2 = document.createElement('button');
        button2.classList.add('btn-common');
        button2.classList.add('btn-common-2');
        button2.classList.add('btn-active');
        button2.textContent = "批量点赞";
        document.body.appendChild(button2);

        button2.addEventListener('click', function () {
            //batchLike()
            likeListItems(getBatchList('get_all_unliked'))
        });

        let button3 = document.createElement('button');
        button3.classList.add('btn-common');
        button3.classList.add('btn-common-3');
        button3.classList.add('btn-active');
        button3.textContent = "批量取消赞";
        document.body.appendChild(button3);

        button3.addEventListener('click', function () {
            //batchLike()
            likeListItems(getBatchList('get_all_liked'))
        });

    }

    function getBatchList(type) {
        let itemList = []
        // 获取点赞按钮
        let list = document.querySelectorAll('span.reply-like>i')
        let counter = 0
        for (let item of list) {
            let className = item.getAttribute("class")
            if (type === 'get_all_liked') {
                if (className.includes("liked")) {
                    // 获取没有赞过的按钮
                    console.log(item)
                    counter++
                    itemList.push(item)
                }
            } else if (type = 'get_all_unliked') {
                if (!className.includes("liked")) {
                    // 获取没有赞过的按钮
                    console.log(item)
                    counter++
                    itemList.push(item)
                }
            }

        }
        return itemList
    }
    function highlightListItems(list) {
        let counter = 0

        for (let item of list) {
            // 获取没有赞过的按钮
            console.log(item)
            counter++
            console.log('赞一下')
            let ele = item.parentElement.parentElement.parentElement.parentElement.parentElement;
            ele.classList.add('🐈')
        }
        setTimeout(() => {
            alert(`预览点赞完成，预计会赞${counter}条动态。当前未赞评论已标红。`)
        }, 100)

    }

    function likeListItems(list) {
        let counter = 0
        let TIME_STEP = 1000

        for (let item of list) {
            let className = item.getAttribute("class")
            // 获取没有赞过的按钮
            console.log(item)
            counter++
            setTimeout(() => {
                item.scrollIntoView({ block: "center", inline: "nearest" });
                console.log('赞一下')
                item.click()
            }, TIME_STEP * counter)
        }
        setTimeout(() => {
            alert(`批量操作完成，本次赞/取消了${counter}条动态，请刷新页面。`)
        }, TIME_STEP * counter + TIME_STEP)
    }
})();