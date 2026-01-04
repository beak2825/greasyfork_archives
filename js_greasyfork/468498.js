// ==UserScript==
// @name         ddrkhelper低端影视助手
// @namespace    https://greasyfork.org/zh-CN/users/547075-limkim
// @version      1.3.0
// @license      MIT
// @description  去除低端影视广告, 一键获取视频直链和字幕直链
// @author       limkim
// @match        https://ddrk.me/*
// @match        https://ddys.tv/*
// @match        https://ddys.pro/*
// @match        https://ddys2.me/*
// @match        https://ddys.art/*

// @icon         https://greasyfork.org/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MTQyMzM2LCJwdXIiOiJibG9iX2lkIn19--d46c889cb90bcdda22c3de1e78dd1e4b71e9a8bf/Untitled2.png?locale=zh-CN
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/498346/ddrkhelper%E4%BD%8E%E7%AB%AF%E5%BD%B1%E8%A7%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/498346/ddrkhelper%E4%BD%8E%E7%AB%AF%E5%BD%B1%E8%A7%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 间隔200ms去广告
    let retryCount = 0;
    let ad_id = null;
    const timer = setInterval(() => {
        if (retryCount === 5) {
            clearInterval(timer);
        }
        retryCount++;
        if (document.querySelector("#notification-1501")) {
            document.querySelector("#notification-1501").remove();
            document.body.style.paddingTop = 0;
        }
        const main = document.querySelector("#main");
        if (main.querySelector("div").nextElementSibling.nodeName === "BR") {
            main.querySelector("div").remove();
        }
        const entry = document.querySelector(".entry");
        if (entry && entry.querySelector("div").nextElementSibling.nodeName === "BR") {
            entry.querySelector("div").innerHTML = "";
            ad_id = entry.querySelector("div").id;
        }
        if (document.querySelector(".cfa_popup")) {
            document.querySelector(".cfa_popup").remove();
        }
    }, 200);

    // 字幕与视频部分
    const container = document.getElementsByClassName("wp-playlist wp-video-playlist")[0];
    if (!container) { return; }
    // 视频信息列表
    const list = JSON.parse(document.querySelector(".wp-playlist-script").innerText);
    console.clear();
    console.log('playlist: ', list);

    const origin = window.location.origin;
    // 视频链接请求主体
    const fetchVideoUrl = (track) => new Promise(async (resolve, reject) => {
        // 拼凑字幕链接
        const ddrUrl = `${origin}/subddr${track.subsrc}`;
        let videoUrl = '';
        if (!track.src1) {
            videoUrl = `https://v.ddys.pro${track.src0}`;
        } else {
            const res = await fetch(`${origin}/getvddr3/video?id=${track.src1}&type=json`);
            const json = await res.json();
            videoUrl = json.url || `https://v.ddys.pro${track.src0}`;
            console.log('fetch succeed: ', json);
        }
        // 生成下载控件
        const html = `${track.caption} <a target='_blank' href='${ddrUrl}'>字幕下载</a>
            <span style="cursor: pointer;" onclick="navigator.clipboard.writeText('${ddrUrl}')">复制字幕链接</span>
            <span style="cursor: pointer;" onclick="navigator.clipboard.writeText('${videoUrl}')">复制视频链接</span> <br>`;
        const result = {
            html,
            video: videoUrl,
            sub: ddrUrl
        };
        console.log('finished: ', result);
        resolve(result);
    });


    const currentButton = document.createElement("button");
    currentButton.innerText = "查看当前视频和字幕原址";
    container.style.position = "relative";
    currentButton.style.position = "absolute";
    currentButton.style.top = "50px";
    currentButton.style.right = "-190px";
    container.appendChild(currentButton);
    currentButton.addEventListener("click", async () => {
        // 获取当前集数
        const search = window.location.search || '?ep=1';
        const index = parseInt(search.split('?ep=')[1].split('&')[0]) - 1;
        const track = list.tracks[index];
        const { html } = await fetchVideoUrl(track);
        document.querySelector("#" + ad_id).innerHTML = html;
    });

    const allButton = document.createElement("button");
    allButton.innerText = "查看所有";
    allButton.style.position = "absolute";
    allButton.style.top = "80px";
    allButton.style.right = "-92px";
    container.appendChild(allButton);
    allButton.addEventListener("click", () => {
        let htmlToRender = "";
        // 循环请求每一集
        list.tracks.forEach(async track => {
            const { html } = await fetchVideoUrl(track);
            htmlToRender += html;
            document.querySelector("#" + ad_id).innerHTML = htmlToRender;
        });
    });
})();