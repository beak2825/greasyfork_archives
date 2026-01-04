// ==UserScript==
// @name         音乐口味分析
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  针对网易云音乐所有时间收听排行歌曲列表的前100首歌的信息进行抓取并复制到剪贴板，方便发送到DeepSeek进行分析。
// @author       Wander，我的email是aivery@foxmail.com
// @match        *://music.163.com/user/songs/rank*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529358/%E9%9F%B3%E4%B9%90%E5%8F%A3%E5%91%B3%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/529358/%E9%9F%B3%E4%B9%90%E5%8F%A3%E5%91%B3%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractSongs() {
        let songs = [];
        let items = document.querySelectorAll("ul li"); // 直接在 document 里抓取

        items.forEach((item, index) => {
            if (index >= 100) return; // 只抓取前100首

            let titleElement = item.querySelector(".txt b"); // 歌曲标题
            let artistElement = item.querySelector(".ar span[title]"); // 歌手名
            let playCountElement = item.querySelector(".times.f-ff2"); // 播放次数

            if (titleElement && artistElement) {
                let songTitle = titleElement.getAttribute("title") || titleElement.innerText; // 歌曲名
                let artistName = artistElement.getAttribute("title") || artistElement.innerText; // 歌手名
                let playCount = playCountElement.innerText.trim();
                songs.push(`${songTitle} - ${artistName} (${playCount})`);
            }
        });

        if (songs.length === 0) {
            alert("未找到歌曲，请确保你在正确的页面！");
            return;
        }

        // 生成 DeepSeek 提示词
        let prompt = `以下是我在网易云音乐所有时间收听歌曲次数的排行榜，请根据歌曲的名称与演唱艺人信息以及对应的收听次数，专业、深刻且幽默风趣地锐评下我的听歌品味，并解析下我的内心世界。\n\n${songs.join("\n")}`;

        // 构造 DeepSeek AI URL（假设 DeepSeek 提供的接口）
        //let deepseekUrl = `https://deepseek.com/analyze?query=${encodeURIComponent(prompt)}`;

        // 跳转到 DeepSeek 进行分析
        //window.open(deepseekUrl, "_blank");
        // 复制到剪贴板
        GM_setClipboard(prompt);
        alert("✅ 已复制到剪贴板！请打开 DeepSeek 手动粘贴提问：\n\nhttps://chat.deepseek.com/");
    }

    function addButton() {
        let button = document.createElement("button");
        button.innerText = "抓取歌曲排行信息";
        button.style.position = "fixed";
        button.style.bottom = "20px";
        button.style.right = "20px";
        button.style.padding = "10px 15px";
        button.style.backgroundColor = "red";
        button.style.color = "white";
        button.style.border = "none";
        button.style.cursor = "pointer";
        button.style.fontSize = "14px";
        button.style.zIndex = "10000";

        button.onclick = extractSongs;
        document.body.appendChild(button);
    }

    setTimeout(addButton, 2000);
})();

