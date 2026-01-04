// ==UserScript==
// @name        B站和油管html视频截图
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @match       https://www.bilibili.com/video/*
// @match       https://www.bilibili.com/bangumi/play/*
// @match       https://www.bilibili.com/list/watchlater*
// @grant       none
// @version     1.1
// @author      weixia
// @description 2024/7/21 20:52:22
// @downloadURL https://update.greasyfork.org/scripts/501383/B%E7%AB%99%E5%92%8C%E6%B2%B9%E7%AE%A1html%E8%A7%86%E9%A2%91%E6%88%AA%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/501383/B%E7%AB%99%E5%92%8C%E6%B2%B9%E7%AE%A1html%E8%A7%86%E9%A2%91%E6%88%AA%E5%9B%BE.meta.js
// ==/UserScript==

(function () {
    function localElement() {
        let domain = window.location.host;
        if (domain === 'www.youtube.com') {
            return {
                host: 'youtube',
                video: document.querySelector('#container .html5-video-container video'),
                control: document.querySelector('#container .ytp-right-controls')
            };
        } else if (domain === 'www.bilibili.com') {
            return {
                host: 'bilibili',
                video: document.querySelector('#bilibili-player .bpx-player-video-wrap video'),
                control: document.querySelector('#bilibili-player .bpx-player-control-bottom-right')
            };
        }
    }

    // 复制当前帧到剪贴板
    function captureImage(video) {
        let canvas = document.createElement('canvas');
        // 设置画布与当前帧宽高一致
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        // 返回base64编码url
        //let baseUrl = canvas.toDataURL('image/png');
        // 转为Blob对象，写入剪贴板
        canvas.toBlob(async (blob) => {
            let data = new ClipboardItem({ "image/png": blob });
            await navigator.clipboard.write([data]);
        }, 'image/png');

        canvas.remove();
    }

    // 截图流程：播放状态先暂停再截图和继续播放
    function capture(video) {
        if (!video.paused) {
            video.pause();
            captureImage(video);
            video.play();
        } else {
            captureImage(video);
        }
    }

    // 创建Trusted Types API策略，解决youtube无法注入问题
    let policy;
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        policy = window.trustedTypes.createPolicy('user-script', {
            createHTML: (string, sink) => string
        });
    }

    // 创建截图按钮
    let button;
    let content;
    if (localElement().host === 'youtube') {
        button = document.createElement('button');
        content = `<svg t="1721465122238" class="icon" height="100%" width="100%" viewBox="-320 -320 1600 1600" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12138" width="200" height="200"><path d="M815.296 902.336h-179.2c-19.2 0-32-12.8-32-32s12.8-32 32-32h179.2c19.2 0 32-12.8 32-32v-140.8c0-19.2 12.8-32 32-32s32 12.8 32 32v147.2c-6.4 51.2-51.2 89.6-96 89.6z m-454.4 0h-147.2c-51.2 0-89.6-38.4-89.6-89.6v-153.6c0-19.2 12.8-32 32-32s32 12.8 32 32v147.2c0 19.2 12.8 32 32 32h153.6c19.2 0 32 12.8 32 32-12.8 19.2-25.6 32-44.8 32z m-211.2-512c-19.2 0-32-12.8-32-32v-147.2c0-51.2 38.4-89.6 89.6-89.6h153.6c19.2 0 32 12.8 32 32s-12.8 32-32 32h-147.2c-19.2 0-32 12.8-32 32v147.2c0 12.8-12.8 25.6-32 25.6z m723.2 0c-19.2 0-32-12.8-32-32v-147.2c0-19.2-12.8-32-32-32h-172.8c-12.8 0-32-12.8-32-32s12.8-32 25.6-32h185.6c51.2 0 89.6 38.4 89.6 89.6v147.2c0 25.6-12.8 38.4-32 38.4z m-588.8-64h70.4v-32h-70.4v32z" p-id="12139" fill="#ffffff"></path><path d="M764.096 345.536c19.2 0 32 12.8 32 32v281.6c0 19.2-12.8 38.4-32 38.4h-473.6c-19.2 0-32-12.8-32-32v-281.6c0-19.2 12.8-38.4 32-38.4h108.8c12.8-6.4 19.2-19.2 25.6-32 12.8-19.2 25.6-19.2 25.6-19.2h128s38.4 0 51.2 19.2c6.4 12.8 12.8 25.6 25.6 32h108.8z m-236.8 89.6c-25.6 0-51.2 12.8-70.4 38.4-12.8 25.6-12.8 51.2 0 76.8 12.8 25.6 38.4 38.4 70.4 38.4 44.8 0 76.8-32 76.8-76.8 0-19.2-6.4-38.4-25.6-57.6-6.4-6.4-25.6-19.2-51.2-19.2z m179.2 38.4c12.8 0 25.6-6.4 32-19.2 6.4-12.8 6.4-25.6 0-32-6.4-6.4-19.2-12.8-32-12.8-19.2 0-32 12.8-32 32s12.8 32 32 32z" p-id="12140" fill="#ffffff"></path></svg>`;
        button.classList.add('ytp-button');

    } else if (localElement().host === 'bilibili') {
        button = document.createElement('div');
        content = `<div class="bpx-player-ctrl-btn bpx-player-ctrl-playbackrate-result" style="font-size: 14px;margin-right: 20px;">截屏</div>`;
    }

    button.innerHTML = policy.createHTML(content) || content;

    // 点击事件监听
    button.addEventListener('click', function () {
        let video = localElement().video;
        capture(video);

    });

    // 按键P进行截图
    document.querySelector('body').addEventListener('keydown', function(event) {
        if (event.key === 'P') {
            let video = localElement().video;
            capture(video);
        }
    });


    // 若播放器控制条出现，添加截图按钮，并取消元素监听
    observer = new MutationObserver((mutationList, observer) => {
        let = control = localElement().control;
        if (control && control.childElementCount > 0) {
            control.insertBefore(button, control.firstChild);
            observer.disconnect();
        }
    });


    observer.observe(document.querySelector('body'), {
        childList: true, // 观察目标子节点的变化，是否有添加或者删除
        attributes: true, // 观察属性变动
        subtree: true, // 观察后代节点，默认为 false
    });


})();