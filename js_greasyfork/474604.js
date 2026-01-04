// ==UserScript==
// @name         內容農場阻擋器
// @namespace    https://greasyfork.org/zh-TW/scripts/474604
// @version      0.3.2
// @description  阻擋搜尋引擎顯示農場網站
// @author       Danny H.
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474604/%E5%85%A7%E5%AE%B9%E8%BE%B2%E5%A0%B4%E9%98%BB%E6%93%8B%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/474604/%E5%85%A7%E5%AE%B9%E8%BE%B2%E5%A0%B4%E9%98%BB%E6%93%8B%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let blockList = [];
    let lastScrollHeight = 0;
    const urlSources = [
        'https://gist.githubusercontent.com/HCYT/0f2a0083eff6f084d0f14caca7af3bbc/raw/99e15ee3f9d971914bb762a08964a56d0ecc2372/farm.txt',
        'https://gist.githubusercontent.com/HCYT/440591ac7d9ccb4f48475366ceef3219/raw/c2d3afaacae13b62a4d0f50a3a78bf610535d63b/gistfile1.txt'
    ];

    function fetchBlockList() {
        const promises = urlSources.map(url => {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url,
                    onload: function(response) {
                        const list = response.responseText.split('\n').filter(Boolean);
                        resolve(list);
                    },
                    onerror: function(err) {
                        reject(err);
                    }
                });
            });
        });

        Promise.all(promises)
            .then(lists => {
                blockList = [].concat(...lists);
                initiate();
            })
            .catch(err => {
                console.error("Failed to fetch some block lists: ", err);
            });
    }


    function initiate() {
        if (window.location.host === 'www.google.com' && window.location.pathname === '/search') {
            filterGoogleResults();
            window.addEventListener('scroll', () => {
                filterGoogleResults();
            });
        } else if (window.location.host === 'www.bing.com' && window.location.pathname === '/search') {
            filterBingResults();
            window.addEventListener('scroll', () => {
                filterBingResults();
            });
        } else {
            checkAlertList();
        }
    }

    function filterGoogleResults() {
        let results = document.querySelectorAll('.g');
        results.forEach(result => {
            let link = result.querySelector('a');
            if (link) {
                let href = link.href;
                if (blockList.some(blocked => href.includes(blocked))) {
                    result.remove();
                }
            }
        });
    }

    function filterBingResults() {
        let results = document.querySelectorAll('li.b_algo');
        results.forEach(result => {
            let citeElement = result.querySelector('cite');
            if (citeElement) {
                let realURL = citeElement.textContent;
                if (blockList.some(blocked => realURL.includes(blocked))) {
                    result.remove();
                }
            }
        });
    }

    function checkAlertList() {
    if (blockList.some(blocked => window.location.href.includes(blocked))) {
        alert("警告：您即將訪問一個被標記為危險或是內容農場的網站！");
    }
}

    // 初始化
    fetchBlockList();

})();
