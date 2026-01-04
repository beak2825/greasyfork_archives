// ==UserScript==
// @name         copy 91porn m3u8
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  复制网站的下载m3u8命令
// @author       Metaphor
// @match        *://91porn.com/*
// @match        *://hsex.men/*
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535124/copy%2091porn%20m3u8.user.js
// @updateURL https://update.greasyfork.org/scripts/535124/copy%2091porn%20m3u8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.warn('test');
    const hostname = window.location.hostname;

    function getCommand() {
        var m3u8;
        var title;
        var user;
        if (hostname.includes('91porn.com')) {
            var content = document.querySelector("#player_one_html5_api > script:nth-child(1)").text;
            var encoded = content.match(/strencode2\("(.*)"\)/)[1];
            var decoded = decodeURIComponent(encoded.replace(/%(?![0-9a-fA-F]{2})/g, '%25'));
            m3u8 = decoded.match(/src='(.*)' type/)[1];
            title = document.querySelector("div.videodetails-yakov:nth-child(1) > h4:nth-child(1)").text().replace('\n', '').replace('[%E4%BB%98%E8%B4%B9]', '').trim();
            user = document.querySelector("div.videodetails-yakov:nth-child(4) > div:nth-child(3) > div:nth-child(2) > span:nth-child(2) > a:nth-child(1) > span:nth-child(1)").text();
        } else {
            m3u8 = document.querySelector('#video-source')?.src;
            const authorElement = document.querySelector('div.col-md-3:nth-child(1) > a:nth-child(1)');
            user = authorElement?.textContent.trim();
            const titleElement = document.querySelector('.panel-title');
            title = titleElement?.textContent.trim();
        }
        console.log(m3u8);
        console.log(title);
        console.log(user);
        const program = GM_getValue('dl-program', ".\\N_m3u8DL-CLI_v3.0.2.exe");
        const command = `${program} "${m3u8}" --saveName "${user}.${title}" --maxThreads "20" --minThreads "10" --timeOut "20" --enableDelAfterDone --proxyAddress http://127.0.0.1:7890`;
        GM_setClipboard(command);

    }

    // 插入“复制链接”按钮
    GM_registerMenuCommand("复制Command", getCommand);

    GM_registerMenuCommand("设置命令程序名", () => {
        const currentName = GM_getValue('dl-program', ".\\N_m3u8DL-CLI_v3.0.2.exe");
        const newName = prompt("请输入新的程序名：", currentName);
        if (newName !== null) {
            GM_setValue('dl-program', newName);
            alert("名字已保存为：" + newName);
        }
    });
    // 插入“复制链接”按钮
    if (hostname.includes('91porn.com')) {}
    else {
        const targetLi = document.querySelector('.nav > li:nth-child(5)');
        if (targetLi) {
            const newLi = document.createElement('li');
            const newLink = document.createElement('a');
            newLink.href = '#';
            newLink.textContent = '复制链接';
            newLink.style.cursor = 'pointer';

            newLink.addEventListener('click', getCommand);

            newLi.appendChild(newLink);

            targetLi.parentNode.insertBefore(newLi, targetLi.nextSibling);
        } else {
            console.warn('未找到 .nav > li:nth-child(5)');
        }
    }


  })();
