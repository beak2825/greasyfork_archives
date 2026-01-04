// ==UserScript==
// @name         以 Metube 下載 5278.com iframe video
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  取得帖子內的 iframe 影片網址，並推送下載至 Metube
// @license MIT
// @author       scbmark
// @icon         https://5278.cc/favicon.ico?v=2
// @match        https://5278.cc/forum.php?mod=viewthread&*
// @match        https://player.hboav.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/546063/%E4%BB%A5%20Metube%20%E4%B8%8B%E8%BC%89%205278com%20iframe%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/546063/%E4%BB%A5%20Metube%20%E4%B8%8B%E8%BC%89%205278com%20iframe%20video.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const configCss = `
        #gm_config {
            background: #fff;
            color: #000;
        }
        .config_header {
            background: #444;
            color: #fff;
            padding: 6px;
        }
    `;

    const iconCss = `
        #downloader-icon {
            position: fixed;
            top: 50px;
            right: 20px;
            width: 40px;
            height: 40px;
            cursor: pointer;
            z-index: 9999;
            transition: transform 0.3s ease;
        }
        #downloader-icon:hover {
            transform: scale(1.1);
        }
        #downloader-icon:active {
            transform: scale(0.9);
        }
    `;

    GM_addStyle(configCss);
    GM_addStyle(iconCss);

    const GM_config = {
        fields: {
            downloader_host: {
                label: "Downloader 位置 (例: http://192.168.1.100:8000)",
                type: "text",
                default: "http://192.168.1.100:8000"
            }
        },
        open: function () {
            const html = `
                <div id="gm_config">
                    <div class="config_header">設定 Downloader 位置</div>
                    <label>${this.fields.downloader_host.label}<br>
                        <input id="gm_host" type="text" value="${GM_getValue('downloader_host', this.fields.downloader_host.default)}">
                    </label>
                    <button id="gm_save">儲存</button>
                    <button id="gm_cancel">取消</button>
                </div>
            `;
            const wrapper = document.createElement('div');
            wrapper.innerHTML = html;
            Object.assign(wrapper.style, {
                position: 'fixed',
                top: '20%',
                left: '30%',
                padding: '20px',
                border: '2px solid #333',
                zIndex: 9999,
                background: '#fff'
            });
            document.body.appendChild(wrapper);

            wrapper.querySelector('#gm_save').onclick = () => {
                GM_setValue('downloader_host', document.getElementById('gm_host').value);
                document.body.removeChild(wrapper);
                alert('已儲存設定');
                window.location.reload();
            };

            wrapper.querySelector('#gm_cancel').onclick = () => {
                document.body.removeChild(wrapper);
            };
        }
    };

    GM_registerMenuCommand("⚙ 設定 downloader", () => GM_config.open());

    const DOWNLOADER_HOST = GM_getValue('downloader_host', 'http://192.168.1.100:8000');
    function extractVideoUrl(text) {
        const match = text.match(/player\.src\(['"]([^'"]+)['"]\)/);
        return match ? match[1] : null;
    }

    function extractVideoKey(iframeSrc) {
        const key = new URL(iframeSrc).searchParams.get('key');
        return key
    }

    function extractVideoID(videoUrl) {
        const match = videoUrl.match(/\/([^/]+)\.mp4\//);
        return match ? match[1] : null;
    }

    function sendToDownloader(videoUrl) {
        let title = GM_getValue("title");
        let videoID = extractVideoID(videoUrl);
        if (videoID) {
            let index = GM_getValue(videoID);
            console.log("得到 video_id_index:", index);
            GM_xmlhttpRequest({
                method: "POST",
                url: `${DOWNLOADER_HOST}/add`,
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({ "url": videoUrl, "quality": "best", "custom_name_prefix": `${title}-${index}` }),
                onload: function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        console.log("URL sent successfully!");
                        alert("URL sent successfully!\n\n" + `${title}-${index}`);
                    } else {
                        console.error("Error sending URL.");
                        alert("Error sending URL.");
                    }
                },
                onerror: function (error) {
                    console.error("Error:", error);
                    alert("Error: " + error);
                }
            });
        }

    }

    if (document.location.host.includes("5278.cc")) {
        let titleTag = document.querySelector("#thread_subject");
        if (titleTag) {
            let titleText = titleTag.textContent.trim();
            GM_setValue("title", titleText);
            console.log("已存入 title:", titleText);
        }

        let iframeTags = document.querySelectorAll('a[href="https://www.5278.cc/forum.php?mod=viewthread&tid=984118&page=1&ordertype=1#pid23291629"]');

        iframeTags.forEach((iframeTag, index) => {
            let target = iframeTag.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling;
            let iframeSrc = target.firstElementChild.getAttribute('src')
            console.log(`iframe src: ${iframeSrc}`);
            let videoID = extractVideoKey(iframeSrc);
            if (videoID) {
                GM_setValue(videoID, index);
            }
        });
    }
    if (document.location.host.includes('player.hboav')) {
        let videoTag = document.getElementsByTagName('video')[0];
        if (videoTag) {
            let scriptTag = videoTag.getElementsByTagName('script')[0];
            let videoUrl = extractVideoUrl(scriptTag.innerText.trim())
            if (videoUrl) {
                console.log(`iframe video url: ${videoUrl}`);
            }

            let btn = document.createElement("button");
            btn.innerText = "下載";
            btn.style.position = "fixed";
            btn.style.top = "10px";
            btn.style.right = "10px";
            btn.style.zIndex = "9999";
            btn.style.padding = "10px";
            btn.style.background = "red";
            btn.style.color = "white";
            btn.style.border = "none";
            btn.style.cursor = "pointer";
            btn.style.borderRadius = "5px";
            btn.style.boxShadow = "2px 2px 10px rgba(0,0,0,0.3)";
            btn.value = videoUrl;
            btn.onclick = () => sendToDownloader(videoUrl);
            document.body.appendChild(btn);
        }
    }
}

)();
