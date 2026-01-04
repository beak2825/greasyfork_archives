// ==UserScript==
// @name         xvideos推送下载
// @namespace    xvideos_PushDownload
// @version      1.7
// @description  1)自动播放 2)自动宽屏 3)高画质播放 4)点击推送下片 5)下载缩略图
// @author       cocang
// @match        *://*.xvideos.com/video*
// @icon         https://www.xvideos.com/favicon-32x32.png
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
// @downloadURL https://update.greasyfork.org/scripts/438212/xvideos%E6%8E%A8%E9%80%81%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/438212/xvideos%E6%8E%A8%E9%80%81%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const download = (url) => {
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://127.0.0.1:8787/",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify({
                data: url,
                type: "2",
            }),
            responseType: "json",
            onload: res => {
                res.response.stat && (showToast("推送下载成功  ٩(๑❛ᴗ❛๑)۶"));
                res.response.stat || (showToast("推送下载失败  (‘⊙д-)"));
            },
            onerror: () => { showToast("推送失败，请打开M3U8批量下载器或检查8787端口占用 ( ×ω× )") },
        });
    }

    const showToast = (msg) => {
        let m = document.createElement("div");
        m.innerHTML = msg;
        m.style.cssText =
            "max-width:60%;min-width: 180px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 18px;";
        document.body.appendChild(m);
        setTimeout(() => {
            let d = 0.5;
            m.style.transition =
                "-webkit-transform " + d + "s ease-in, opacity " + d + "s ease-in";
            m.style.opacity = "0";
            setTimeout(() => {
                document.body.removeChild(m);
            }, d * 1000);
        }, 2000);
    }

    html5player.player_init && (html5player.toggleExpand());
    const download_btn = document.querySelector("button.dl.tab-button");
    download_btn.insertAdjacentHTML('afterend', '<button class="dl" id="thumbbig"><span class="icon-f icf-image"></span><span>缩略图</span></button>');
    document.getElementById('thumbbig').onclick = () => {
        if (!!html5player.thumb_slide_big) {
            let thumb_url = html5player.thumb_slide_big;
            let video_tittle = document.querySelector("p.video-title").innerText;
            GM_download(thumb_url, video_tittle + '.jpg');
            showToast("缩略图正在下载  (❛◡❛✿)");
        } else {
            showToast("未发现缩略图  (๑•́ ₃ •̀๑)");
        }
    }
    download_btn.addEventListener('click', e => {
        e.stopImmediatePropagation();
        if (!!html5player.hlsobj.levels) {
            let m3u8 = html5player.hlsobj.levels.slice(-1)[0].url[0];
            let video_tittle = document.querySelector("p.video-title").innerText;
            download(video_tittle + "," + m3u8);
        } else {
            showToast("解析中，请稍后下载  (๑•́ ₃ •̀๑)");
        }
    }, true);

    Object.defineProperties(html5player.hlsobj, {
        autoLevelEnabled: { value: false, writable: false },
        firstLevel: { value: 4, writable: false },
    })

    let play_val = false;
    Object.defineProperty(html5player, 'canPlay', {
        get: () => play_val,
        set: (val) => {
            val && (html5player.playClicked = true);
            val && (html5player.play());
            play_val = val;
        }
    });
})();