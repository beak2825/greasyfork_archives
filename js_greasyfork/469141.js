// ==UserScript==
// @name         抖音
// @description  抖音Web端辅助工具
// @namespace    https://gitee.com/strategytechnology/tappermonkey
// @license      MIT
// @version      1.0.0
// @author       Andy Zhou
// @match        https://www.douyin.com/*
// @icon         https://www.douyin.com/favicon.ico
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/xlsx/0.18.2/xlsx.mini.min.js
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/469141/%E6%8A%96%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/469141/%E6%8A%96%E9%9F%B3.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const baseUrl = 'https://www.douyin.com';

    const loadingId = 'yz_loading';

    let searchWord;

    let timerId;

    let awemeList = [];

    const nativeSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
        this.addEventListener('load', function () {
            if (this.responseURL.startsWith(`${baseUrl}/aweme/v1/web/search/item/`)) {
                const result = JSON.parse(this.responseText);
                if (result.status_code !== 0) {
                    return;
                }
                const url = new URL(this.responseURL);
                const param = Object.fromEntries(url.searchParams.entries());
                if (param.offset == 0) {
                    //重置缓存数据
                    searchWord = param.keyword;
                    awemeList = result.data
                    addExportButton();
                } else {
                    for (const item of result.data) {
                        awemeList.push(item);
                    }
                }
                if (result.has_more == 0 && document.getElementById(loadingId)) {
                    endRequest();
                }
            }
        });
        nativeSend.apply(this, arguments);
    };

    //添加导出按钮
    function addExportButton() {
        const id = 'yz_video_download_button';
        if (document.getElementById(id)) {
            return;
        }
        const parentElement = document.querySelector('span[data-key="video"]').parentElement;
        const newElement = document.createElement("div");
        newElement.id = id;
        newElement.style = "margin-left: 22px; cursor: pointer;";
        newElement.innerHTML = `<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 24.0083V42H42V24" stroke="#b50ed3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M33 23L24 32L15 23" stroke="#b50ed3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M23.9917 6V32" stroke="#b50ed3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>`;
        parentElement.appendChild(newElement);
        newElement.addEventListener("click", startRequest);
    }

    function startRequest() {
        //loading
        const loading = document.createElement('div');
        loading.id = loadingId;
        loading.style = "top: 0%;width: 100%;height: 100%;position: fixed;text-align: center;z-index: 99999;background: hsla(0,0%,100%,.7);";
        const loadingIcon = document.createElement("div");
        loadingIcon.style = "background-image: url(https://p3-pc-weboff.byteimg.com/tos-cn-i-9r5gewecjs/a795fb49bcbcf8cb1c762a69d57aee48.png);background-size: 48px;display: inline-block;font-size: 0px;top: 50%;position: fixed;height: 48px;transform: scale(0.7);width: 48px;animation: 1s steps(60, start) 0s infinite normal none running Sr905S5u;";
        loading.appendChild(loadingIcon);
        document.body.appendChild(loading);
        timerId = setInterval(function () {
            window.scrollBy(0, 1000);
        }, 1000);
        //3s后判断一下列表数据是否有变化，没变化可能已经拉过全部数据了。
        let awemeSize = awemeList.length;
        setTimeout(function () {
            if (awemeList.length == awemeSize) {
                endRequest();
            }
        }, 3000);
    }

    function endRequest() {
        timerId && clearInterval(timerId);
        document.getElementById(loadingId).remove();
        exportData();
    }

    //导出数据
    function exportData() {
        const wb = XLSX.utils.book_new();
        let datas = [];
        datas.push(["视频ID", "达人ID", "达人名称", "抖音号", "粉丝数", "达人主页", "视频标题", "视频链接", "发布时间", "时长(秒)", "点赞数", "评论数", "分享数", "收藏数"]);
        for (const row of awemeList) {
            const awemeInfo = row.aweme_info;
            const author = awemeInfo.author;
            datas.push([awemeInfo.aweme_id, author.uid, author.nickname,
            author.unique_id, author.follower_count, "https://www.douyin.com/user/" + author.sec_uid,
            awemeInfo.desc, awemeInfo.share_info.share_url, formatDate(awemeInfo.create_time),
            awemeInfo.video.duration && Math.ceil(awemeInfo.video.duration / 1000),
            awemeInfo.statistics.digg_count,
            awemeInfo.statistics.comment_count,
            awemeInfo.statistics.share_count,
            awemeInfo.statistics.collect_count
            ]);
        }
        const ws = XLSX.utils.aoa_to_sheet(datas);
        XLSX.utils.book_append_sheet(wb, ws, searchWord);
        XLSX.writeFile(wb, `${searchWord}.xlsx`);
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
})();