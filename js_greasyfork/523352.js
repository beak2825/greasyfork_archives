// ==UserScript==
// @name         优动漫素材商城增强插件
// @namespace    https://www.udongman.cn/homepage/455694/home
// @version      0.11
// @description  在优动漫商城的素材页面显示收藏量和评论量，高亮官方素材
// @author       波尼
// @match        https://www.udongman.cn/resource/*
// @match        https://www.udongman.cn/search/resource/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udongman.cn
// @grant        GM_xmlhttpRequest
// @license      CC BY-NC
// @downloadURL https://update.greasyfork.org/scripts/523352/%E4%BC%98%E5%8A%A8%E6%BC%AB%E7%B4%A0%E6%9D%90%E5%95%86%E5%9F%8E%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/523352/%E4%BC%98%E5%8A%A8%E6%BC%AB%E7%B4%A0%E6%9D%90%E5%95%86%E5%9F%8E%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let assets = new Set();

    // Intercept XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...args) {
        if (method.toUpperCase() === 'GET' &&
            (url.includes("core-api.udongman.cn/services/core/search/search") ||
             url.includes("core-api.udongman.cn/services/core/material") ||
             url.includes("core-api.udongman.cn/services/core/rank/material")) ) {

            this.addEventListener('load', function () {
                try {
                    const response = JSON.parse(this.responseText);

                    let res = response.data?.data || response.data;

                    if(!res) return

                    res.forEach((element) => {
                        if (!assets.has(element)) {
                            assets.add(element); // Add the element to the Set if it doesn't exist
                        }
                    });

                    const assetsArray = [...assets];

                    if(url.includes("rank")) {

                        // Usage
                        waitForElement('.g-resource-rank-list', (element) => {
                            addField(assetsArray)
                        });

                    } else {
                        waitForElement('.g-resource-card-list', (element) => {
                            addField(assetsArray)
                        });

                    }

                } catch (e) {
                    console.error('Error parsing XHR response:', e);
                }
            });
        }
        return originalOpen.apply(this, [method, url, ...args]);
    };


    const waitForElement = (selector, callback) => {
        // Select the parent element to observe (e.g., document.body)
        const observerTarget = document.body;

        // Create a MutationObserver instance
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                // Check if the desired element exists
                const targetElement = document.querySelector(selector);
                if (targetElement) {
                    // Stop observing once the element is found
                    observer.disconnect();
                    callback(targetElement);
                    break;
                }
            }
        });

        // Start observing changes to child nodes in the document
        observer.observe(observerTarget, {
            childList: true, // Observe addition/removal of child elements
            subtree: true,  // Observe changes within all descendants
        });
    };


    // Function to observe DOM changes
    const observeDOM = (targetNode, callback) => {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    console.log('New elements added to the card list');
                    observer.disconnect(); // Stop observing to avoid repeated calls
                    callback();
                }
            }
        });

        observer.observe(targetNode, { childList: true, subtree: true });
    };

    const addField = (apiData) => {
        const cardList = document.querySelector('.g-resource-card-list'); // Find the container

        if (cardList) {
            const cards = cardList.querySelectorAll('.component-resource-card'); // Get all cards

            const targetAuthors = ["优动漫","今天更新吗"];

            apiData.forEach(item => {
                cards.forEach(card => {
                    // Find the title of the card
                    const titleElement = card.querySelector('.title-name');
                    if (titleElement && titleElement.textContent.includes(item.title)) {

                        // Avoid duplicate buy count elements
                        if (card.querySelector('.buy-count')) return;


                        // Create and add buy count
                        const buyCountElement = document.createElement('div');
                        buyCountElement.setAttribute('class', 'count muted');

                        // Create and add buy count icon
                        const buyIconElement = document.createElement('i');
                        // buyIconElement.setAttribute('class', 'icon-buy buy-count');
                        buyIconElement.setAttribute('class', 'el-icon-s-comment buy-count');
                        buyIconElement.setAttribute('style', 'margin-right:4px');
                        buyCountElement.appendChild(buyIconElement);

                        // Add buy count text
                        const buySpanElement = document.createElement('span');
                        // buySpanElement.textContent = item.buy_count;
                        buySpanElement.textContent = item.comment_count;

                        buyCountElement.appendChild(buySpanElement);

                        // Create and add download count
                        const downloadCountElement = document.createElement('div');
                        downloadCountElement.setAttribute('class', 'count muted');

                        // Create and add download count icon
                        const downloadIconElement = document.createElement('i');
                        // downloadIconElement.setAttribute('class', 'icon-download download-count');
                        downloadIconElement.setAttribute('class', 'el-icon-collection download-count');
                        downloadIconElement.setAttribute('style', 'margin-right:4px');
                        downloadCountElement.appendChild(downloadIconElement);

                        // Add download count text
                        const downloadSpanElement = document.createElement('span');
                        // downloadSpanElement.textContent = item.download_count;
                        downloadSpanElement.textContent = item.favorite_count;

                        downloadCountElement.appendChild(downloadSpanElement);

                        // Find the existing view count element
                        const viewCountElement = card.querySelector('.count.muted');

                        // Insert the buy count element after the view count element
                        viewCountElement.parentNode.insertBefore(buyCountElement, viewCountElement.nextSibling);

                        // Insert the download count element after the buy count element
                        buyCountElement.parentNode.insertBefore(downloadCountElement, buyCountElement.nextSibling);

                    }


                    const authorElement = card.querySelector('.author-name');
                    if (authorElement && targetAuthors.includes(authorElement.textContent.trim())) {
                        const infoSection = card.querySelector('.info');
                        if (infoSection) {
                            infoSection.style.backgroundColor = 'palegreen';
                        }
                    }

                });
            });



        }
        const rankCardList = document.querySelector('.g-resource-rank-list'); // Find the container

        if(rankCardList) {

            const ranks = rankCardList.querySelectorAll('.component-resource-rank-card'); // Get all rank cards

            apiData.forEach(item => {
                ranks.forEach(rank => {

                    const titleEle = rank.querySelector('.title.ellipsis');


                    if (titleEle && titleEle.textContent.includes(item.title)) {


                        if (rank.querySelector('.buy-count')) return;

                        if (!rank.querySelector('.price-info')) {

                            // Create the price element
                            const priceElement = document.createElement('strong');
                            priceElement.classList.add('price-info');
                            priceElement.textContent = `${item.price_info.pay_coin || item.price_info.pay_point}${item.price_info.pay_coin ? '金币': '积分'}`;
                            priceElement.setAttribute('style', 'margin:0 10px; color:#33d87d');

                            // Insert the price element after the title

                            titleEle.parentNode.insertBefore(priceElement, titleEle.nextElementSibling);
                        }


                        // Find the container with class `.info-count .muted`
                        const infoCountElement = rank.querySelector('.info-count.muted');
                        if (infoCountElement) {



                            // Create and add the buy count element
                            const buyCountElement = document.createElement('div');
                            buyCountElement.setAttribute('class', 'count muted');

                            const buyIconElement = document.createElement('i');
                            // buyIconElement.setAttribute('class', 'icon-buy buy-count');
                            buyIconElement.setAttribute('class', 'el-icon-s-comment buy-count');
                            buyIconElement.setAttribute('style', 'margin:0 4px');
                            buyCountElement.appendChild(buyIconElement);

                            const buySpanElement = document.createElement('span');
                            // buySpanElement.textContent = item.buy_count;
                            buySpanElement.textContent = item.comment_count;
                            buyCountElement.appendChild(buySpanElement);
                            buyCountElement.setAttribute('style', 'margin-right:4px');

                            // Create and add the download count element
                            const downloadCountElement = document.createElement('div');
                            downloadCountElement.setAttribute('class', 'count muted');

                            const downloadIconElement = document.createElement('i');
                            // downloadIconElement.setAttribute('class', 'icon-download download-count');
                            downloadIconElement.setAttribute('class', 'el-icon-collection download-count');
                            downloadIconElement.setAttribute('style', 'margin-right:4px');
                            downloadCountElement.appendChild(downloadIconElement);

                            const downloadSpanElement = document.createElement('span');
                            // downloadSpanElement.textContent = item.download_count;
                            downloadSpanElement.textContent = item.favorite_count;
                            downloadCountElement.appendChild(downloadSpanElement);
                            downloadCountElement.setAttribute('style', 'margin-right:4px');

                            // Append the new elements after the existing `.info-count .muted`
                            infoCountElement.appendChild(buyCountElement);
                            infoCountElement.appendChild(downloadCountElement);
                        }

                    }
                });
            });
        }

    };
})();
