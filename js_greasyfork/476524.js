// ==UserScript==
// @name         移除谷歌搜索中头条、抖音的搜索结果
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动删除掉谷歌搜索结果中某条、某音的结果
// @author       zturn
// @match        https://www.google.com/search*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476524/%E7%A7%BB%E9%99%A4%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E4%B8%AD%E5%A4%B4%E6%9D%A1%E3%80%81%E6%8A%96%E9%9F%B3%E7%9A%84%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/476524/%E7%A7%BB%E9%99%A4%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E4%B8%AD%E5%A4%B4%E6%9D%A1%E3%80%81%E6%8A%96%E9%9F%B3%E7%9A%84%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("begin");

    const observer = new MutationObserver(removeCertainResults);
    observer.observe(document, {childList: true, subtree: true});

    function removeCertainResults() {
        const results = document.querySelectorAll('.main .g');
        const regexes = [
            new RegExp('https:\/\/www\.toutiao\.com\/keyword\/.*'),
            new RegExp('https:\/\/www\.douyin\.com\/zhuanti\/.*'),
            new RegExp('https:\/\/page\.iesdouyin\.com\/traffic-aggregation\/.*'),
            new RegExp('https:\/\/www\.douyin\.com\/search\/.*')
        ];
        console.log(`Found ${results.length} elements`); // Log the number of elements found

        for (const result of results) {
            let linkElement = result.querySelector('a');
            console.log(`${linkElement}`);
            if (linkElement && regexes.some(regex => regex.test(linkElement.href))) {
                console.log(`Removing element: ${linkElement.href}`);
                result.parentElement.removeChild(result);
            }
        }
    }
})();
