// ==UserScript==
// @name         更新情報にサムネ追加（クリックで02.jpg、新タブ対応）
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  更新情報にリンクのサムネイルを追加し、クリックで02.jpg。元リンクも新タブで開きます！
// @author       adsamalu4kia
// @license      adsamalu4kia
// @match        https://www.megahit.co.jp/category_product.php?search_category_id=1*
// @match        https://www.megahit.co.jp/category_product.php?search_category_id=2*
// @match        https://www.megahit.co.jp/category_product.php?search_category_id=3*
// @grant        GM_xmlhttpRequest
// @connect      www.megahit.co.jp
// @downloadURL https://update.greasyfork.org/scripts/515592/%E6%9B%B4%E6%96%B0%E6%83%85%E5%A0%B1%E3%81%AB%E3%82%B5%E3%83%A0%E3%83%8D%E8%BF%BD%E5%8A%A0%EF%BC%88%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E3%81%A702jpg%E3%80%81%E6%96%B0%E3%82%BF%E3%83%96%E5%AF%BE%E5%BF%9C%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/515592/%E6%9B%B4%E6%96%B0%E6%83%85%E5%A0%B1%E3%81%AB%E3%82%B5%E3%83%A0%E3%83%8D%E8%BF%BD%E5%8A%A0%EF%BC%88%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E3%81%A702jpg%E3%80%81%E6%96%B0%E3%82%BF%E3%83%96%E5%AF%BE%E5%BF%9C%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const updateInfoArea = document.getElementById('updateinfo_area');
    const cache = {};
    const MAX_CONCURRENT_REQUESTS = 5;
    let currentRequests = 0;
    let processedLinks = 0;

    const indicatorContainer = document.createElement('div');
    const indicator = document.createElement('div');
    const statusText = document.createElement('span');

    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .loading-indicator {
            display: none;
            border: 8px solid #f3f3f3;
            border-top: 8px solid #3498db;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin-right: 10px;
        }
    `;
    document.head.appendChild(style);

    indicator.className = 'loading-indicator';
    indicatorContainer.appendChild(indicator);
    indicatorContainer.appendChild(statusText);
    updateInfoArea.insertBefore(indicatorContainer, updateInfoArea.firstChild);

    if (updateInfoArea) {
        const links = updateInfoArea.querySelectorAll('a');
        const totalLinks = links.length;

        function processLink(link) {
            const url = link.href;
            link.target = '_blank'; // ←★ 元のリンクを新しいタブで開くように指定

            indicator.style.display = 'block';
            statusText.innerText = 'サムネ取得中';
            statusText.style.display = 'inline';

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    currentRequests--;
                    if (response.status === 200) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        const productCodeElement = doc.getElementById('product_code_default');

                        if (productCodeElement) {
                            const productCode = productCodeElement.textContent.trim();
                            const thumbnailUrl = `https://www.megahit.co.jp/upload/save_image/${productCode}_01.jpg`;
                            cache[productCode] = thumbnailUrl;

                            GM_xmlhttpRequest({
                                method: "HEAD",
                                url: thumbnailUrl,
                                onload: function (headResponse) {
                                    if (headResponse.status === 200) {
                                        const img = document.createElement('img');
                                        img.src = thumbnailUrl;
                                        img.alt = 'Thumbnail';
                                        img.style.width = '100px';
                                        img.style.marginRight = '10px';

                                        const linkWrapper = document.createElement('a');
                                        const img02Url = thumbnailUrl.replace('_01.jpg', '_02.jpg');
                                        linkWrapper.href = img02Url;
                                        linkWrapper.target = '_blank';
                                        linkWrapper.appendChild(img);

                                        link.parentNode.insertBefore(linkWrapper, link);
                                    }
                                    checkCompletion();
                                    processNextLink();
                                },
                                onerror: function (error) {
                                    console.error('サムネイル確認リクエストエラー:', error);
                                    checkCompletion();
                                    processNextLink();
                                }
                            });
                        } else {
                            console.log('商品コードが見つかりませんでした。');
                            checkCompletion();
                            processNextLink();
                        }
                    } else {
                        console.error('GETリクエスト失敗:', response.status);
                        checkCompletion();
                        processNextLink();
                    }
                },
                onerror: function (error) {
                    console.error('GETリクエストエラー:', error);
                    currentRequests--;
                    checkCompletion();
                    processNextLink();
                }
            });
        }

        function processNextLink() {
            while (currentRequests < MAX_CONCURRENT_REQUESTS && processedLinks < totalLinks) {
                const index = processedLinks++;
                const nextLink = links[index];
                if (nextLink) {
                    currentRequests++;
                    processLink(nextLink);
                }
            }
        }

        function checkCompletion() {
            if (processedLinks === totalLinks && currentRequests === 0) {
                console.log('すべてのリンクが処理されました。');
                indicator.style.display = 'none';
                statusText.style.display = 'none';
            }
        }

        processNextLink();
    }
})();
