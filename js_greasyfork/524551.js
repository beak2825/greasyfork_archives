// ==UserScript==
// @name         asmrone-download-aria2
// @name:zh-CN   asmrone-download-aria2
// @name:en      asmrone-download-aria2
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @license      MIT
// @description  asmrone添加aria2下载
// @description:zh-CN  asmrone添加aria2下载
// @description:en   asmrone添加aria2下载
// @author       crudBoy
// @match        https://asmr-200.com/work/*
// @match        https://asmr-100.com/work/*
// @match        https://asmr-300.com/work/*
// @match        https://asmr.one/work/*
// @icon         https://www.dlsite.com/images/web/common/logo/pc/logo-dlsite.png
// @grant        GM_xmlhttpRequest
// @connect      asmr-100.com
// @connect      asmr-200.com
// @connect      asmr-300.com
// @connect      asmr.one
// @connect      nas
// @downloadURL https://update.greasyfork.org/scripts/524551/asmrone-download-aria2.user.js
// @updateURL https://update.greasyfork.org/scripts/524551/asmrone-download-aria2.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 配置信息
    // Aria2 的访问密钥，如果未设置留空
    let secret = "";

    // Aria2 服务的主机地址
    const host = "nas";

    // Aria2 服务的端口号
    const port = 16800;

    // Aria2 的 JSON-RPC 接口地址
    const aria2Url = `http://${host}:${port}/jsonrpc`;

    // 请求超时时间，单位为毫秒
    const timeout = 30000;

    // 文件保存路径
    const path = "F:\\新建文件夹";

    // 是否只下载带SE文件
    const onlySE = false;

    window.addEventListener('load', function () {
        // 延时 300 毫秒执行 addButton
        setTimeout(addButton, 300);
    }, false);

    function addButton() {
        let button = document.createElement("button");
        button.setAttribute("tabindex", "0");
        button.setAttribute("type", "button");
        button.className = "q-btn q-btn-item non-selectable no-outline q-mt-sm shadow-4 q-mx-xs q-px-sm q-btn--standard q-btn--rectangle bg-green text-white q-btn--actionable q-focusable q-hoverable q-btn--wrap q-btn--dense";
        button.innerHTML = `
        <span class="q-focus-helper"></span>
        <span class="q-btn__wrapper col row q-anchor--skip">
            <span class="q-btn__content text-center col items-center q-anchor--skip justify-center row">
                <i aria-hidden="true" role="img" class="q-icon on-left notranslate material-icons">download</i>
                <span class="block">aria2下载</span>
            </span>
        </span>
    `;

        // 添加点击事件
        button.addEventListener("click", function () {
            console.log("aria2下载按钮被点击了！");
            // 在这里添加你的逻辑
            download()
        });

        let qpasm = document.getElementsByClassName("q-pa-sm");

        if (qpasm.length > 0) {
            // 在子元素的最后一个位置添加按钮
            qpasm[qpasm.length - 1].appendChild(button);
        } else {
            console.error("未找到类名为 'q-pa-sm' 的元素！");
        }
    }

    function download() {
        fetchTrack()
    }

    function fetchTrack() {
        const urlWithoutParams = window.location.href.split(/[?#]/)[0];
        const id = urlWithoutParams.split('/').pop().substring(2);
        let url = "https://api." + window.location.host + "/api/tracks/" + id
        // 获取音轨数据
        fetchData(url)
            .then((response) => {
                const trackData = JSON.parse(response.responseText); // 假设返回的数据是 JSON 格式
                downloadTracksByAria2(path + "\\" + urlWithoutParams.split('/').pop(), trackData)
            })
            .catch((error) => console.error("获取音轨数据时发生错误：", error));
    }

    // 遍历并下载音轨
    async function downloadTracksByAria2(path, tracks) {
        for (const track of tracks) {
            if (track.type === "folder") { // 判断是否是文件夹
                if (onlySE) {
                    if (isNoSE(track.title)) continue; // 跳过包含无效关键字的文件夹
                }
                const folderPath = `${path}/${track.title}`;
                await downloadTracksByAria2(folderPath, track.children);
            } else {
                const downParam = {
                    dir: path,
                    out: track.title || "unknown_file",
                };
                await addUri([track.mediaDownloadUrl], downParam);
            }
        }
    }

    function fetchData(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: (response) => resolve(response),
                onerror: (error) => reject(error),
            });
        });
    }

    // 发送请求到 Aria2
    function addUri(uris, options) {
        const id = generateUUID(); // 生成唯一 ID
        const body = {
            jsonrpc: "2.0",
            id: id,
            method: "aria2.addUri",
            params: [uris, options],
        };

        GM_xmlhttpRequest({
            method: "POST",
            url: aria2Url,
            data: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
            timeout: timeout,
            onload: function (response) {
                if (response.status >= 200 && response.status < 300) {
                    const result = JSON.parse(response.responseText);
                    console.log("下载成功：", result);
                } else {
                    console.error("下载失败，状态码：", response.status);
                }
            },
            onerror: function (error) {
                console.error("请求错误：", error);
            },
            ontimeout: function () {
                console.error("请求超时！");
            },
        });
    }


    // 判断是否没有包含特定的音效
    function isNoSE(title) {
        const noSEKeywords = [
            "SEなし", "左右反転", "音なし", "noSE", "声なし", "无SE",
            "SE無", "音無し", "無SE", "無し", "无音效"
        ];
        return noSEKeywords.some(keyword => title?.toLowerCase().includes(keyword.toLowerCase()));
    }

    // 生成 UUID
    function generateUUID() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
})();
