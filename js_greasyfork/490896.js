// ==UserScript==
// @name         Amazon Reviews Exporter
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Export Amazon reviews for multiple ASINs, sorted by star rating, with automatic pagination
// @author       You
// @match        https://www.amazon.com/*
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490896/Amazon%20Reviews%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/490896/Amazon%20Reviews%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let asins = []; // 存储用户输入的ASIN编号数组
    let currentASINIndex = 0; // 当前正在处理的ASIN索引
    let stars = ['one', 'two', 'three', 'four', 'five']; // 星级数组
    let currentStarIndex = 0; // 当前星级索引
    let allReviews = []; // 存储所有评论的数组
    let recordedReviewIds = new Set(); // 存储已经记录过的评论ID，防止重复记录

    function addStartButton() {
        const button = document.createElement('button');
        button.textContent = 'Start Reviews Export';
        button.style = 'position: fixed; top: 50%; left: 20px; transform: translateY(-50%); background-color: orange; color: white; padding: 10px; font-size: 16px; border: none; cursor: pointer; border-radius: 5px;';
        button.onclick = startReviewsExport;
        document.body.appendChild(button);
    }

    function startReviewsExport() {
        const userInput = prompt("请输入Asin,多个Asin用英文逗号隔开.多变体请输入父Asin,否则评论重复!");
        if (userInput) {
            asins = userInput.split(',').map(asin => asin.trim());
            currentASINIndex = 0;
            allReviews = [];
            recordedReviewIds.clear();
            processNextASIN();
        }
    }

    function processNextASIN() {
        if (currentASINIndex < asins.length) {
            currentStarIndex = 0; // 从第一个星级开始
            processStarRating(asins[currentASINIndex]);
        } else {
            exportToExcel(allReviews);
        }
    }

    function processStarRating(asin) {
        if (currentStarIndex < stars.length) {
            let pageNumber = 1; // 从第一页开始
            fetchAndProcessReviews(asin, pageNumber);
        } else {
            currentASINIndex++;
            processNextASIN();
        }
    }

    function fetchAndProcessReviews(asin, pageNumber) {
        if (pageNumber > 10) { // 限制到10页
            console.log(`Completed ${stars[currentStarIndex]} star reviews for ASIN ${asin}.`);
            currentStarIndex++;
            processStarRating(asin);
            return;
        }

        let star = stars[currentStarIndex]; // 当前处理的星级（'one', 'two', etc.）
        const reviewPageUrl = `https://www.amazon.com/product-reviews/${asin}/ref=cm_cr_getr_d_paging_btm_next_${pageNumber}?ie=UTF8&reviewerType=all_reviews&pageNumber=${pageNumber}&filterByStar=${star}_star&sortBy=recent`;
        console.log(`Fetching page ${pageNumber} for ${star} stars...`); // 日志输出当前抓取的页数和星级
        setTimeout(() => { // 使用setTimeout延迟5秒执行请求
            GM_xmlhttpRequest({
                method: "GET",
                url: reviewPageUrl,
                onload: function(response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    const reviews = doc.querySelectorAll('.review');
                    if (reviews.length > 0) {
                        reviews.forEach(review => {
                            const reviewId = review.id;
                            if (!recordedReviewIds.has(reviewId)) {
                                const reviewText = review.querySelector('.review-text').textContent.trim();
                                allReviews.push({ ASIN: asin, star: `${star} star`, text: reviewText });
                                recordedReviewIds.add(reviewId);
                            }
                        });
                        fetchAndProcessReviews(asin, ++pageNumber); // 继续下一页
                    } else {
                        console.log(`No more reviews found at page ${pageNumber} for ${star} stars.`);
                        currentStarIndex++; // 切换到下一个星级
                        processStarRating(asin); // 继续处理当前ASIN的下一个星级
                    }
                },
                onerror: function() {
                    console.error(`Error fetching page ${pageNumber} for ${star} stars.`);
                    fetchAndProcessReviews(asin, pageNumber); // 尝试重新加载当前页
                }
            });
        }, 3000); // 设置延时为5000毫秒（5秒）
    }

    function exportToExcel(reviews) {
        const worksheet = XLSX.utils.json_to_sheet(reviews);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reviews");
        XLSX.writeFile(workbook, 'Amazon_Reviews.xlsx');
        console.log('Export completed.');
    }

    addStartButton();
})();
