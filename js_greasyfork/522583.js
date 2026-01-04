// ==UserScript==
// @name         豆瓣书评影评同步到Flomo
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  自动将豆瓣书评、影评和剧集同步到Flomo日志
// @author       Your Name
// @match        https://movie.douban.com/*
// @match        https://book.douban.com/*
// @grant        GM_xmlhttpRequest
// @connect      flomoapp.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522583/%E8%B1%86%E7%93%A3%E4%B9%A6%E8%AF%84%E5%BD%B1%E8%AF%84%E5%90%8C%E6%AD%A5%E5%88%B0Flomo.user.js
// @updateURL https://update.greasyfork.org/scripts/522583/%E8%B1%86%E7%93%A3%E4%B9%A6%E8%AF%84%E5%BD%B1%E8%AF%84%E5%90%8C%E6%AD%A5%E5%88%B0Flomo.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Flomo API endpoint
    const flomoAPI = "填入你自己的FlomoAPI";

    // Function to send a log to Flomo
    function sendToFlomo(content) {
        GM_xmlhttpRequest({
            method: "POST",
            url: flomoAPI,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({ content }),
            onload: function (response) {
                if (response.status === 200) {
                    console.log("同步到Flomo成功");
                } else {
                    console.error("同步到Flomo失败", response);
                }
            },
            onerror: function (error) {
                console.error("同步到Flomo出错", error);
            }
        });
    }

    // Map ratings to stars
    function getStarRating(rateText) {
        const ratingsMap = {
            "很差": "★☆☆☆☆",
            "较差": "★★☆☆☆",
            "还行": "★★★☆☆",
            "推荐": "★★★★☆",
            "力荐": "★★★★★"
        };
        return ratingsMap[rateText] || "无评分";
    }

    // Function to extract relevant data and send to Flomo
    function handleSaveButtonClick(event) {
        const form = event.target.closest("form");
        if (form) {
            const commentElement = form.querySelector("#comment");
            const ratewordElement = form.querySelector("#rateword");
            const infoElement = document.querySelector("#info"); // 查找 div#info 元素

            // 从 head 的 title 获取标题
            let pageTitle = document.querySelector("head > title").innerText || "未知标题";
            pageTitle = pageTitle.replace("(豆瓣)", "").trim(); // 去掉 “(豆瓣)”

            // 判断类型是电影、剧集还是书籍
            const isMovie = window.location.href.includes("movie.douban.com");
            const isBook = window.location.href.includes("book.douban.com");
            let type = "未知";

            if (isBook) {
                type = "读书";
            } else if (isMovie) {
                if (infoElement) {
                    const seriesInfo = Array.from(infoElement.querySelectorAll("span.pl"))
                        .find(el => el.innerText.includes("集数"));
                    type = seriesInfo ? "剧集" : "电影";
                } else {
                    type = "电影";
                }
            }

            // 获取评分
            let rating = "无评分";
            if (ratewordElement) {
                rating = getStarRating(ratewordElement.innerText.trim());
            }

            // 获取评论
            const comment = commentElement ? commentElement.value.trim() : "无评论";

            // Prepare content for Flomo
            const tag = `#${type}/${pageTitle}\n`;
            const content = `${tag}${comment}\n评分: ${rating}`;
            console.log("发送到Flomo的内容：", content);
            sendToFlomo(content);
        }
    }

    // Attach listener to the "保存" button
    function attachSaveListener() {
        document.addEventListener("click", function (event) {
            if (event.target && event.target.matches('input[type="submit"][name="save"]')) {
                setTimeout(() => handleSaveButtonClick(event), 1000); // Add delay to ensure data capture
            }
        });
    }

    // Initialize the script
    attachSaveListener();
})();