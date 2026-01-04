// ==UserScript==
// @name         Javtrailers_HD
// @namespace    http://tampermonkey.net/
// @version      2024-12-31
// @description  javtrailers.com 加载高清预告片
// @author       You
// @match        https://javtrailers.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javtrailers.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://fastly.jsdelivr.net/npm/video.js@7.10.2/dist/video.min.js
// @require      https://fastly.jsdelivr.net/npm/videojs-vr@1.10.1/dist/videojs-vr.min.js
// @resource     video-js-css https://fastly.jsdelivr.net/npm/video.js@7.10.2/dist/video-js.min.css
// @resource     video-vr-js-css https://fastly.jsdelivr.net/npm/videojs-vr@1.10.1/dist/videojs-vr.css
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523761/Javtrailers_HD.user.js
// @updateURL https://update.greasyfork.org/scripts/523761/Javtrailers_HD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 观察目标节点
    const targetNode = document.body;

    // 观察配置
    const config = { childList: true, subtree: true };

    // 当观察到变动时执行的回调函数
    const callback = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const div = document.getElementById('videoPlayerContainer');
                if (div) {
                    const parent=div.parentNode;
                    parent.removeChild(div);
                    // 获取目标元素
                    var elements = document.getElementsByClassName('col-md-8');
                    // 修改 CSS 属性
                    elements[0].style.width = '100%';
                    console.log('remove videoPlayerContainer');
                    findURL().then(videoURL => {
                        addArt(parent, videoURL)
                    });
                }
            }
        }
    };

    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(callback);

    // 以上述配置开始观察目标节点
    observer.observe(targetNode, config);
    const artStyle = `
            #preview-video-player {
           width: 100%;
            height: 630px;
        }
    `
    GM_addStyle(artStyle);

    async function findURL() {
        const nuxt = document.getElementById('__NUXT_DATA__');
        const text = nuxt.innerText;
        const regex = /https:\/\/media\.javtrailers\.com.*?\.(m3u8|mp4)/g;
        const matches = text.match(regex);
        var videoURL = null;
        const contentId = findContentId();
        if (matches && matches[0].includes(contentId)) {
            videoURL = matches[0];
        } else {
            const data = await doGet(`https://javtrailers.com/api/video/${contentId}`)
            videoURL = JSON.parse(data)['video']['trailerG']
        }
        console.log(videoURL);
        if (videoURL.indexOf('playlist') != -1) {
            const data = await doGet(videoURL)
            const playlist = data.split('\n')
            const hd = playlist[playlist.length - 1]
            videoURL = videoURL.replace('playlist.m3u8', hd);
        }
        return videoURL;
    }

    async function doGet(url) {
        return new Promise(resolve => {
            GM.xmlHttpRequest({
                method: "GET",
                headers: { "authorization": "AELAbPQCh_fifd93wMvf_kxMD_fqkUAVf@BVgb2!md@TNW8bUEopFExyGCoKRcZX" },
                url,
                onload: response => resolve(response.responseText),
            });
        })
    }

        function addArt(parent, videoURL) {
            const poster = findPoster();
            const artHTML = `
            <video id="preview-video-player" class="video-js" playsinline controls preload="none"
                poster="${poster}" >
            </video>
            `;
            // 插入新的div到现有div的后边
            parent.insertAdjacentHTML('afterend', artHTML);

            const srcData = {
                type: "video/mp4",
                src: videoURL,
            };
            if (videoURL.includes('m3u8')) {
                srcData.type = "application/x-mpegURL";
            }
            const player = videojs(document.querySelector('#preview-video-player'), {
                playbackRates: [0.5, 1, 1.5, 2],
            });
            player.src(srcData);
        }

        function findPoster() {
            // 使用类名获取 img 标签
            const imgElement = document.querySelector('.img-fluid.mt-4');
            // 获取 src 属性
            if (imgElement) {
                const src = imgElement.getAttribute('data-src');
                return src;
            } else {
                console.log('Image element not found');
            }
        }

        function findContentId() {
            // 获取当前 URL
            const currentURL = window.location.href;
            // 分割 URL 并获取最后一项
            const urlParts = currentURL.split('/');
            return urlParts[urlParts.length - 1];
        }
})();