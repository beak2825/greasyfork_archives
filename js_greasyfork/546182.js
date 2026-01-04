// ==UserScript==
// @name         艾薇社区破解VIP视频免费看
// @namespace    aiwei_vip_video_free_see
// @version      1.2
// @description  来不及解释了，快上车！！！
// @author       w2f
// @match        https://avjb.com/*
// @match        https://avjb.cc/*
// @grant        GM_addStyle
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.1.5/hls.min.js
// @downloadURL https://update.greasyfork.org/scripts/529208/%E8%89%BE%E8%96%87%E7%A4%BE%E5%8C%BA%E7%A0%B4%E8%A7%A3VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/529208/%E8%89%BE%E8%96%87%E7%A4%BE%E5%8C%BA%E7%A0%B4%E8%A7%A3VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1.创建播放器容器
    const player = document.createElement('div');
    player.id = 'hlsPlayer';
    player.innerHTML = `<video id="videoElement" controls></video>
        <div class="player-footer">
            <text id="showTips">⌛️破解中...</text>
            <a id="download" href="" target="_blank" style="color:red;"></a>
        </div>`;
    // HLS播放器初始化
    const video = player.querySelector('#videoElement');
    const downloadEl = player.querySelector('#download');
    const showTipsEl = player.querySelector('#showTips');
    let hls = null;

    // 样式设置
    GM_addStyle(`
        #hlsPlayer {
            position: fixed;
            top: 0px;
            right: 0px;
            max-width: 100vw;
            mex-height:100vh;
            background: #1a1a1a;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 2147483647;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            color:red;font-size:14px;word-wrap: break-word;word-break: break-all;
        }
        #videoElement {
            max-width: 70vw;
            max-height: 70vh;
            border-radius: 0 0 8px 8px;
        }
    `);
    // 函数:加载HLS视频
    function loadHlsStream(url) {
        downloadEl.href=`https://tools.thatwind.com/tool/m3u8downloader#m3u8=${url}&referer=${window.location.href}&filename=${document.title}`; //url;
        downloadEl.innerText = "⏬一键下载";
        if (Hls.isSupported()) {
            if(hls) hls.destroy();
            hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play();
                showTipsEl.innerText = `✅破解成功:`;
            });
            hls.on(Hls.Events.ERROR, (event, data) => {
                console.error('HLS Error:', data);
                //showTipsEl.innerText = `❌加载失败(${data.type},${data.details}),请切换其他源...`;
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
            video.addEventListener('loadedmetadata', () => video.play());
        }
    }

    // 2.获取视频地址 // 3.加载HLS视频
    //const url = "https://r22.jb-aiwei.cc/contents/videos/76000/76444/index.m3u8";
    //loadHlsStream(url);
    function check_circle(){
        if(!document.body){
            console.log("⌛️加载DOM中...");
            return ;
        }
        // 1.2加载播放器容器
        document.body.appendChild(player);
        const prefix = document.querySelector(".player-holder img")?.src;//window.location.href.split('video')[1];
        const tmp = prefix?.split('/');
        if(prefix){
            //https://avjb.com/video/106169/fc2-ppv-4729813%20(11)/
            //https://stat.avstatic.com/cdn1/contents/videos_screenshots/106000/106169/385x233/4.jpg
            //https://avjb.com/get_file/4/8c34ef9daea4c5ac97a3b68c4188a8fc603ecdc5b2/106000/106169/106169_preview.mp4/  //302重定向到下方
            //https://r22.jb-aiwei.cc/videos/106000/106169/106169_preview.mp4 //去掉_preview 404
            //https://line6.jb-aiwei.cc/13TTX3VMB7D3U-tdduJwieACYYFp9AIZ-dqZmdTvnCr-I3C_zjDXJnglWuYRAAjCflKlYxcl9Q9wvO0M9jSwZpowkdsJk0BNhV-TrzQbJMd_clu1-9x_uPuHo0ID-SD0/videos/106000/106169/index.m3u8 //线路4
            //https://r22.jb-aiwei.cc/13TTX3VMB7D3U-tdduJwieACYYFp9AIZ-dqZmdTvnCr-I3C_zjDXJnglWuYRAAjCflKlYxcl9Q9wvO0M9jSwZpowkdsJk0BNhV-TrzQbJMd_clu1-9x_uPuHo0ID-SD0/videos/106000/106169/index.m3u8  //线路1
            //https://88newline.jb-aiwei.cc/videos/106000/106169/index.m3u8  //线路3 ok
            //this.currentVideoURL = "function/0/https://avjb.com/get_file/4/a9eaf539d565b797783c1246d8cd1a97d15cbe838f/106000/106169/106169_2160p.mp4/"; //404
/*
result.basePath = "/13TTX3VMB7D3U-tdduJwieACYYFp9AIZ-dqZmdTvnCr-I3C_zjDXJnglWuYRAAjCflKlYxcl9Q9wvO0M9jSwZpowkdsJk0BNhV-TrzQbJMd_clu1-9x_uPuHo0ID-SD0/videos/106000/" + this.videoID + "/index.m3u8";
result.basePath = "/13TTX3VMB7D3U-tdduJwifMcHh7_6sjFRQmVF0zuV_C63gsUThwJR56-vaTOFvX56vxSFLG_NZhjJRp7gA-7kmWyfHI7LCucDV_3KB4LBCDVUO3ySR0JbGME69zEA04s/videos/99000/" + this.videoID + "/index.m3u8";
                result.line1BaseURL = 'https://r22.jb-aiwei.cc';

                // 线路3配置
                if (this.videoID > 18400 && this.videoID < 92803) {
                    result.line3BaseURL = 'https://99newline.jb-aiwei.cc';
                }
                else if (this.videoID >= 92803) {
                    result.line3BaseURL = 'https://88newline.jb-aiwei.cc';
                }

                if (this.videoID > 80000) {
                    result.line4BaseURL = 'https://line6.jb-aiwei.cc';
                }
*/
            //const url = `https://r22.jb-aiwei.cc/contents/videos/${tmp[6]}/${tmp[7]}/index.m3u8`;

            let line3BaseURL = 'https://99newline.jb-aiwei.cc';
            if (tmp[7] >= 92803) {
                line3BaseURL = 'https://88newline.jb-aiwei.cc';
            }
            const url = `${line3BaseURL}/videos/${tmp[6]}/${tmp[7]}/index.m3u8`;

            loadHlsStream(url);
            clearInterval(my_timer);
        }
    }

    let my_timer = setInterval(check_circle, 2000);

})();