// ==UserScript==
// @name         Jav Trailers
// @namespace    http://tampermonkey.net/
// @version      2025-06-24
// @description  JabBus/JavDB观看预告片和全片（无需日本ip）
// @author       You
// @match        https://javdb.com/v/*
// @match        https://www.javbus.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javdb.com
// @grant        GM_xmlhttpRequest
// @connect      javtrailers.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522498/Jav%20Trailers.user.js
// @updateURL https://update.greasyfork.org/scripts/522498/Jav%20Trailers.meta.js
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

    //javbus
    const busElement = document.querySelector('.col-md-3.info p span[style="color:#CC0000;"]');
    console.log(busElement);
    if (busElement != null) {
        // 获取完整的文本内容
        const javId = busElement.textContent.trim();
        toPreview(javId, javbus);
    } else {
        console.log("no javbus");
    }

    function toPreview(javId, funToDo) {
        console.log(javId); // 输出: IPBZ-010
        var url = `https://search.javtrailers.com/indexes/videos/search?q=${javId}&page=1&sort=releaseDate:desc&hitsPerPage=1`
        doGet(url).then(data => {
            console.log(data);
            const contendId = JSON.parse(data)['hits'][0]['contentId']
            funToDo(javId, contendId);
            //getTrailer(javId)
        });
    }

    function javdb(javId, contendId) {
        // 输出结果
        console.log(javId); // 输出: IPBZ-010
        const searchUrl = `https://javtrailers.com/search/${javId}`;
        const newUrl = `https://javtrailers.com/video/${contendId}`;

        const existingDiv = document.querySelector('.panel-block.first-block');
        // 生成新的div
        const jableHTML = `
        <div class="panel-block">
            <strong>全片:</strong>
            &nbsp;&nbsp;
            <span class="value">
            <a href="https://jable.tv/videos/${javId}/" target="_blank">Jable</a>
            &nbsp;
            <a href="https://missav01.com/${javId}/" target="_blank">MissAV</a>
            </span>
        </div>
        `;
        // 插入新的div到现有div的后边
        existingDiv.insertAdjacentHTML('afterend', jableHTML);
        const toTrailerHTML = `
        <div class="panel-block">
            <strong>预览:</strong>
            &nbsp;<span class="value"><a href="${newUrl}" target="_blank">${javId}</a></span>
            &nbsp;
            <a class="button is-white copy-to-clipboard" title="search" href="${searchUrl}" target="_blank"">
                <span class="icon is-small">
                <i class="icon-search"></i>
                </span>
            </a>
        </div>
        `;
        existingDiv.insertAdjacentHTML('afterend', toTrailerHTML);
    }

    function javbus(javId, contendId) {
        const searchUrl = `https://javtrailers.com/search/${javId}`;
        const newUrl = `https://javtrailers.com/video/${contendId}`;
        // 获取目标div元素中的第一个p标签
        const firstPElement = document.querySelector('.col-md-3.info p');

        const jableHTML = `
            <p>
            <a class="header" >全片:</a>
            <span class="genre">
            <a style="color:#CC0000;" href="https://jable.tv/videos/${javId}/" target="_blank">Jable</a>
            </span>
            <span class="genre">
            <a style="color:#CC0000;" href="https://missav01.com/${javId}/" target="_blank">MissAV</a>
            </span>
            </p>
            `;
        firstPElement.insertAdjacentHTML('afterend', jableHTML);
        // 定义要插入的p标签HTML
        const newPHTML = `
            <p>
                <a class="header" href="${searchUrl}" target="_blank">预览:</a>
                <a style="color:#CC0000;" href="${newUrl}" target="_blank">${javId}</a>
            </p>
            `;

        // 在第一个p标签后插入新的p标签
        firstPElement.insertAdjacentHTML('afterend', newPHTML);
    }

    function getTrailer(contendId) {
        const url = `https://javtrailers.com/api/video/${contendId}`
        GM_xmlhttpRequest({
            method: "get",
            url: url,
            headers: { "authorization": "AELAbPQCh_fifd93wMvf_kxMD_fqkUAVf@BVgb2!md@TNW8bUEopFExyGCoKRcZX" },
            onload: function (r) {
                console.log(r.responseText);
                const trailerUrl = JSON.parse(r.responseText)['video']['trailerG']
                console.log(trailerUrl);
                if (trailerUrl.indexOf("m3u8") != -1) {
                    GM_xmlhttpRequest({
                        method: "get",
                        url: trailerUrl,
                        headers: { "authorization": "AELAbPQCh_fifd93wMvf_kxMD_fqkUAVf@BVgb2!md@TNW8bUEopFExyGCoKRcZX" },
                        onload: function (rr) {
                            console.log(rr.responseText);

                        }
                    });
                } else {
                    insertPreview(trailerUrl)
                }
            }
        });
    }

    function insertPreview(videoUrl) {
        console.log(videoUrl);
    }

    async function doGet(url) {
        return new Promise(resolve => {
            GM.xmlHttpRequest({
                method: "GET",
                headers: { "authorization": "Bearer e8f7f0a9891342bcde8aeee404526aa3c94ba743b914d1211456201d64318788" },
                url,
                onload: response => resolve(response.responseText),
            });
        })
    }
})();