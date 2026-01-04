// ==UserScript==
// @name         B站视频进度记录员（多P视频进度自动跳转）
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @icon         https://cdn.jsdelivr.net/gh/Anjude/pubsrc@img/1.png
// @description  自动跳转多P视频上次观看进度
// @author       豆小匠Coding
// @match        https://*.bilibili.com/video/*
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_xmlhttpRequest
// @original-script   https://github.com/Anjude/tampermonkey
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require     https://greasyfork.org/scripts/412159-mydrag/code/MyDrag.js?version=858320
// @downloadURL https://update.greasyfork.org/scripts/503307/B%E7%AB%99%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6%E8%AE%B0%E5%BD%95%E5%91%98%EF%BC%88%E5%A4%9AP%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/503307/B%E7%AB%99%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6%E8%AE%B0%E5%BD%95%E5%91%98%EF%BC%88%E5%A4%9AP%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const BILI_RECORDER = "BILI_RECORDER";
    let recorder = GM_getValue(BILI_RECORDER) || {};

    let getUrlInfo = (url) => {
        // 正则表达式解析 BV 号
        const bvRegex = /\/video\/(BV\w+)/;
        const bvMatch = url.match(bvRegex);

        // 正则表达式解析集数 p
        const pRegex = /p=(\d+)/;
        const pMatch = url.match(pRegex);

        const bv = bvMatch ? bvMatch[1] : null;
        const p = pMatch ? pMatch[1] : null;

        return {
            bv: bv,
            episode: p
        };
    };


    const urlChangeHandler = (url) => {
        // console.log("URL changed to: " + url);
        // 当前href的video信息
        let currentUrlInfo = getUrlInfo(window.location.href);
        if (!currentUrlInfo.bv || !currentUrlInfo.episode || currentUrlInfo.episode === "1") {
            return;
        }
        // 保存记录
        recorder[currentUrlInfo.bv] = {
            bv: currentUrlInfo.bv,
            episode: currentUrlInfo.episode
        };
        GM_setValue(BILI_RECORDER, recorder);
    };

    //////////////////////// 正式逻辑 ///////////////////////////////
    // 当前href的video信息
    let currentHrefInfo = getUrlInfo(window.location.href);
    // console.log("RECORDER", currentHrefInfo,window.location.href);
    if (!currentHrefInfo.bv) {
        return;
    }

    // 获取recorder中当前视频的进度
    let recordProgress = recorder[currentHrefInfo.bv] || {};
    if (recordProgress.episode && recordProgress.episode !== currentHrefInfo.episode) {
        // 跳转对应p
        console.log("RECORDER JUMP: ", recordProgress.episode, currentHrefInfo.episode);
        window.location.href = window.location.href.replace(/\/video\/.*/, `/video/${recordProgress.bv}?p=${recordProgress.episode}`);
    } else if (!recordProgress.episode) {
        urlChangeHandler(window.location.href);
    }

    let start = () => {
        console.log("RECORDER: ",GM_getValue(BILI_RECORDER));
        // 先保存原始的 pushState 和 replaceState 方法
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function (state, title, url) {
            originalPushState.apply(this, arguments);
            urlChangeHandler(url);
        };

        history.replaceState = function (state, title, url) {
            originalReplaceState.apply(this, arguments);
            urlChangeHandler(url);
        };

        GM_registerMenuCommand("重置脚本", () => {
            if (confirm("重置后观看记录等数据将清空!")) {
                GM_deleteValue(BILI_RECORDER);
            }
        });
    };
    start();
})();
