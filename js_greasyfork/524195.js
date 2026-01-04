// ==UserScript==
// @name         JavDB Trailer
// @namespace    http://tampermonkey.net/
// @version      2025-01-03
// @description  JavDB观看预告片
// @author       haoyinhaoyin
// @match        https://javdb.com/v/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javdb.com
// @grant        GM_xmlhttpRequest
// @connect      javtrailers.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524195/JavDB%20Trailer.user.js
// @updateURL https://update.greasyfork.org/scripts/524195/JavDB%20Trailer.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // javdb获取包含IPBZ-010的span元素
    const spanElement = document.querySelector('.panel-block.first-block .value a');
    if (spanElement != null) {
        // 获取完整的文本内容
        const javId = spanElement.parentElement.textContent.trim();
        toPreview(javId, javdb);
    } else {
        console.log("no javdb");
    }

    function toPreview(javId, funToDo) {
        console.log(javId); // 输出: IPBZ-010
        var url = `https://search.javtrailers.com/indexes/videos/search?q=${javId}&page=1&sort=releaseDate:desc&hitsPerPage=1`
        doGet(url).then(data => {
            console.log(data);
            const contendId = JSON.parse(data)['hits'][0]['contentId']
            funToDo(javId, contendId);
        });
    }

    function javdb(javId, contendId) {
        // 输出结果
        console.log(javId); // 输出: IPBZ-010
        const searchUrl = `https://javtrailers.com/search/${javId}`;
        const newUrl = `https://javtrailers.com/video/${contendId}`;

        const existingDiv = document.querySelector('.panel-block.first-block');
        // 生成新的div
        const toTrailerHTML = `
        <div class="panel-block">
            <strong>预览:</strong>
            &nbsp;<span class="value"><a href="${newUrl}" target="_blank">${javId}</a></span>
            &nbsp;
            <a class="button is-white copy-to-clipboard" title="search" href="${searchUrl}" target="_blank">
                <span class="icon is-small">
                <i class="icon-search"></i>
                </span>
            </a>
        </div>
        `;
        // 插入新的div到现有div的后边
        if (existingDiv) {
            existingDiv.insertAdjacentHTML('afterend', toTrailerHTML);
        } else {
            console.warn("Existing div not found.");
        }
    }

    async function doGet(url) {
        return new Promise(resolve => {
            GM.xmlHttpRequest({
                method: "GET",
                headers: { "authorization": "Bearer 6b4bd3e560e994a5b009023e1d21f51e95dbb86ca3f47cb03f34f8a2cb9a93f2" },
                url,
                onload: response => resolve(response.responseText),
            });
        })
    }
})();
