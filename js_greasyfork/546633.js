// ==UserScript==
// @name         missav 收藏夹分析
// @namespace    https://github.com/zerobiubiu
// @version      1.0
// @description  收藏夹分析
// @author       zerobiubiu
// @match        https://missav.ws/cn/saved*
// @grant        none
// @license      MIT
// @icon         https://missav.ws/img/favicon.png
// @downloadURL https://update.greasyfork.org/scripts/546633/missav%20%E6%94%B6%E8%97%8F%E5%A4%B9%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/546633/missav%20%E6%94%B6%E8%97%8F%E5%A4%B9%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==


(function () {

    // 获取最大页码
    function getPageNumbers() {
        for (let i = 13; i > 1; i--) {
            let endPageNum = document.querySelector(`body > div:nth-child(2) > div.sm\\:container.mx-auto.px-4.content-without-search.pb-12 > nav > div.hidden.md\\:flex-1.md\\:flex.md\\:items-center.md\\:justify-center > span > a:nth-child(${i})`)
            let nextPageNum = document.querySelector(`body > div:nth-child(2) > div.sm\\:container.mx-auto.px-4.content-without-search.pb-12 > nav > div.hidden.md\\:flex-1.md\\:flex.md\\:items-center.md\\:justify-center > span > a:nth-child(${i - 1})`)

            if (i != 13 && endPageNum) {
                return parseInt(nextPageNum.textContent.trim());
            } else if (i == 13 && endPageNum) {
                if (parseInt(endPageNum.textContent.trim()) >= 13) {
                    return parseInt(endPageNum.textContent.trim());
                } else {
                    return parseInt(nextPageNum.textContent.trim());
                }
            }
        }

        return 1;
    }

    //
    async function inspect(pageNum) {
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
            "Accept": "*/*",
            "Host": "missav.com",
            "Connection": "keep-alive"
        };

        const requestOptions = {
            method: 'GET',
            headers: headers,
            redirect: 'follow'
        };

        for (let i = 1; i <= pageNum; i++) {
            try {
                const response = await fetch(window.location.pathname + `?page=` + i, requestOptions)
                    .then(response => response.text())
                    .catch(error => console.log('error', error));
                const parser = new DOMParser();
                const doc = parser.parseFromString(response, 'text/html');

                let abnormal = []

                doc.querySelectorAll('.my-2.text-sm.text-nord4.truncate').forEach((element) => {
                    const firstLink = element.querySelector('a');
                    const src = firstLink.href;
                    if (src.includes("-english-subtitle") || src.includes("-uncensored-leak")) {
                        // console.log(src);
                        abnormal.push(src);
                    } else {
                        // console.log('非英文字幕或无码:', src);
                    }
                })

                if (abnormal.length > 0) {
                    console.log(`第 ${i} 页异常链接:`);
                    abnormal.forEach(link => console.log(link));
                } else {
                    console.log(`第 ${i} 页无异常链接`);
                }
            } catch (error) {
                console.log('error fetching page:', error);
            }
        }

        console.log('分析完成');
    }


    const analyse = document.createElement("a");
    analyse.textContent = "开始分析";
    analyse.href = "javascript:void(0);";
    analyse.className = "text-nord0 block px-4 py-2 text-sm leading-5 hover:bg-nord4";
    analyse.addEventListener("click", function () {
        inspect(getPageNumbers());
    });

    document.querySelector("body > div:nth-child(2) > div.sm\\:container.mx-auto.px-4.content-without-search.pb-12 > div.flex.justify-between.mb-6 > div > div > div > div.py-1").prepend(analyse);

})();