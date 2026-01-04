// ==UserScript==
// @name         飞书妙记-下载字幕和txt
// @namespace    http://tampermonkey.net/
// @version      2024-02-22
// @description  让你更加便捷地下载飞书妙记生成的字幕文件和txt文件.
// @author       You
// @match        https://*.feishu.cn/minutes/*
// @icon         http://feishu.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488062/%E9%A3%9E%E4%B9%A6%E5%A6%99%E8%AE%B0-%E4%B8%8B%E8%BD%BD%E5%AD%97%E5%B9%95%E5%92%8Ctxt.user.js
// @updateURL https://update.greasyfork.org/scripts/488062/%E9%A3%9E%E4%B9%A6%E5%A6%99%E8%AE%B0-%E4%B8%8B%E8%BD%BD%E5%AD%97%E5%B9%95%E5%92%8Ctxt.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var forceDownload = function (blob, filename) {
        var a = document.createElement('a');
        a.download = filename;
        a.href = blob;
        a.click();
    }

    let format_map = {
        '2': '.txt',
        '3': '.srt'
    };

    var downloadRes = function (sid, filename, format) {
        fetch(`https://${location.host}/minutes/api/export?_t=${new Date().getTime()}`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "bv-csrf-token": "850d44eb-1a84-432b-9de1-b34f715f9d25",
                "cache-control": "no-cache",
                "content-type": "application/x-www-form-urlencoded",
                "device-id": "7338560823671504898",
                "platform": "web",
                "pragma": "no-cache",
                "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Microsoft Edge\";v=\"120\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "utc-bias": "480",
                "x-lgw-os-type": "1",
                "x-lgw-terminal-type": "2",
                "cookie": `${document.cookie}`,
                "Referer": `${location.href}`,
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": `add_speaker=false&add_timestamp=false&format=${format}&is_fluent=false&language=zh_cn&object_token=${sid}&translate_lang=default`,
            "method": "POST"
        })
        .then(response => response.blob())
        .then(blob => {
            let blobUrl = window.URL.createObjectURL(blob);
            let download_name = filename + format_map[format];
            forceDownload(blobUrl, download_name);
        })
        .catch(e => console.error(e));

        // .then(response => response.text())
        //  .then(data => console.log(data));
    };

    if (location.href.includes('/me')) {
        window.onload = function () {
            // 你的代码放在这里，会在页面加载完成后执行
            console.log("页面已完全加载");
            let videos = document.querySelectorAll("#app > div > div.mm-layout > div.mm-content-outside > div.mm-content > div.list-table > div > div > a > div");

            for (var i = 0; i < videos.length; i++) {

                let parentDiv = videos[i];
                var children = parentDiv.children;
                var newDiv = document.createElement('div');

                let sid = parentDiv.parentElement.href.split('minutes/')[1];
                let filename = parentDiv.children[0].children[1].querySelector('.content').innerText;

                var button_txt = document.createElement('button');
                button_txt.style.backgroundColor = 'blue';
                button_txt.style.color = 'white'; // 设置字体颜色为白色
                button_txt.style.fontSize = '14px';
                button_txt.textContent = '下载文本';
                button_txt.onclick = function (e) {
                    e.stopPropagation();
                    e.preventDefault(); // 阻止默认行为
                    downloadRes(sid, filename, '2');
                }

                var button_srt = document.createElement('button');
                button_srt.style.backgroundColor = 'red';
                button_srt.style.color = 'white'; // 设置字体颜色为白色
                button_srt.style.fontSize = '14px';
                button_srt.textContent = '下载字幕';
                button_srt.onclick = function (e) {
                    e.stopPropagation();
                    e.preventDefault(); // 阻止默认行为
                    downloadRes(sid, filename, '3');
                }

                newDiv.appendChild(button_txt);
                newDiv.appendChild(button_srt);

                var penultimateChild = children[children.length - 2];
                // 在倒数第二个子元素之前插入新div
                parentDiv.insertBefore(newDiv, penultimateChild.nextSibling);
            }
        };

        return;
    }

    let sid = location.href.split('minutes/')[1];
    console.log(`sid:${sid}`);

    // Create a floating button
    var button_txt = document.createElement('button');
    button_txt.style.position = 'fixed';
    button_txt.style.top = '78px';
    button_txt.style.right = '20px';
    button_txt.style.backgroundColor = 'blue';
    button_txt.style.color = 'white'; // 设置字体颜色为白色
    button_txt.style.fontSize = '14px';
    button_txt.textContent = '下载文本';
    document.body.appendChild(button_txt);

    // Add click event listener to the button
    button_txt.addEventListener('click', function () {
        let filename = document.querySelector("div.larkw-web-header-caption-head-title-edit-text.larkw-web-header-caption-head-title-edit-text-allow-edit > span").innerText;
        downloadRes(sid, filename, '2');
    });

    var button_srt = document.createElement('button');
    button_srt.style.position = 'fixed';
    button_srt.style.top = '100px';
    button_srt.style.right = '20px';
    button_srt.style.backgroundColor = 'red';
    button_srt.style.color = 'white'; // 设置字体颜色为白色
    button_srt.style.fontSize = '14px';
    button_srt.textContent = '下载字幕';
    document.body.appendChild(button_srt);

    // Add click event listener to the button
    button_srt.addEventListener('click', function () {
        let filename = document.querySelector("div.larkw-web-header-caption-head-title-edit-text.larkw-web-header-caption-head-title-edit-text-allow-edit > span").innerText;
        downloadRes(sid, filename, '3');
    });

})();
