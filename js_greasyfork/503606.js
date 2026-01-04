// ==UserScript==
// @name         禅道-视频预览
// @version      0.0.3
// @author       Mirrorhye
// @description  Make Zendao Great Again!
// @author       You
// @match        http://bug.ad.com/zentao/*
// @grant        none
// @namespace https://greasyfork.org/users/923888
// @downloadURL https://update.greasyfork.org/scripts/503606/%E7%A6%85%E9%81%93-%E8%A7%86%E9%A2%91%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/503606/%E7%A6%85%E9%81%93-%E8%A7%86%E9%A2%91%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

/*
    v0.0.3: 播放窗口高度自适应
    v0.0.2: 新增播放缓存
*/

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        /* 模态框背景样式 */
        .mir-modal {
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            width: 100%;
            height: 100%;
            overflow: hidden; /* 禁止滚动 */
            background-color: rgb(0,0,0);
            background-color: rgba(0,0,0,0.4);
        }

        /* 模态框内容样式 */
        .mir-modal-content {
            position: absolute; /* 使用 absolute 来居中模态框 */
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%); /* 中心对齐 */
            background-color: #fefefe;
            padding: 20px;
            border: 1px solid #888;
            border-radius: 10px;
        }

        /* 关闭按钮样式 */
        .mir-close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
        }

        .mir-close:hover,
        .mir-close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
        }

        /* 视频样式 */
        video {
            width: 100%;
            height: auto;
        }
    `;
    document.head.appendChild(style);

    let blobURLs = {}

    function mir_preview(url, downloadFirst) {
        new Promise(function(resolve, reject) {
            const cacheURL = blobURLs[url];
            if (cacheURL) {
                console.log('use cache', cacheURL, blobURLs)
                resolve(cacheURL);
                return;
            }
            if (downloadFirst) {
                const promise = fetch(url)
                .then(response => response.blob())
                .then(blob => {
                    const blobURL = window.URL.createObjectURL(blob);
                    blobURLs[url] = blobURL;
                    console.log('download', blobURL, blobURLs)
                    return blobURL;
                });
                resolve(promise);
            } else {
                resolve(url);
            }
        })
        .then(url => {
            const modal = document.createElement('div');
            modal.id = 'mir-videoModal';
            modal.className = 'mir-modal';
            modal.display = 'none';

            const modalContent = document.createElement('div');
            modalContent.className = 'mir-modal-content';

            const closeButton = document.createElement('span');
            closeButton.className = 'mir-close';
            closeButton.innerHTML = '&times;';

            const videoElement = document.createElement('video');
            videoElement.id = 'mir-videoPreview';
            videoElement.controls = true;
            videoElement.autoplay = true;
            videoElement.loop = true;

            const sourceElement = document.createElement('source');
            sourceElement.id = 'mir-videoPreview-source';
            sourceElement.src = url;
            sourceElement.type = 'video/mp4';

            videoElement.appendChild(sourceElement);
            videoElement.innerHTML += '您的浏览器不支持视频播放。';

            videoElement.addEventListener("loadedmetadata", function(e) {
                const width = this.videoWidth, height = this.videoHeight;
                const availableWidth = window.innerWidth * 0.95 - 30, availableHeight = window.innerHeight * 0.90 - 40 - 30;
                const r1 = width / height, r2 = availableWidth / availableHeight;
                let w = 0, h = 0;
                if (r1 > r2) {
                    w = availableWidth;
                    h = availableWidth / r1;
                } else {
                    w = availableHeight * r1;
                    h = availableHeight;
                }
                modalContent.style.width = `${w + 30}px`;
                modalContent.style.height = `${h + 30 + 40}px`;
            }, false );

            modalContent.appendChild(closeButton);
            modalContent.appendChild(videoElement);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);

            closeButton.onclick = function() {
                $('#mir-videoModal').remove()
            }

            modal.onclick = function(event) {
                $('#mir-videoModal').remove()
            }
        });
    }

    // ---
    $('.detail-content .files-list li').each(function(index, element) {
        const hrefv = $(this).find('a');
        let href = '';
        if (hrefv.length > 0) {
            href = hrefv[0].href;
        }

        $(this).append(`<span class="right-icon">&nbsp; <a data-width="400" class="edit iframe text-primary mir-preview-btn" title="直接流式播放, 速度快但可能拖不了进度条"')">预览</a></span>`)
        $(this).find('.mir-preview-btn').click(() => {
            mir_preview(href, false)
        })
        $(this).append(`<span class="right-icon">&nbsp; <a data-width="400" class="edit iframe text-primary mir-preview-btn-download-first" title="先下载后播放, 可能需要等待"')">缓存后预览</a></span>`)
        $(this).find('.mir-preview-btn-download-first').click(() => {
            mir_preview(href, true)
        })
    });
})();