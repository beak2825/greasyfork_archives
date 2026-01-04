// ==UserScript==
// @name         小狐狸VIP视频免费看
// @namespace    small_fox_vip_video_free_see_2
// @version      2.8
// @description  来不及解释了，快上车！！！
// @author       w2f
// @match        https://xhlld24244.cyou/*
// @match        https://xhlld1000.xyz/*
// @match        https://dfsd454.xyz/*
// @match        https://dfrd1009.cyou/*
// @match        https://asf4fss265.shop/*
// @match        https://asf4fss430.shop/*
// @match        https://*.xhlld077.shop/*
// @include      /^http(s)?:\/\/ld01.xhlld\d+\.(cyou|xyz)/
// @include      /^http(s)?:\/\/ld.xhlld\d+\.(cyou|xyz)/
// @include      /^http(s)?:\/\/xhlld\d+\.(cyou|xyz)/
// @include      /^http(s)?:\/\/df\S+\.(cyou|xyz)/
// @include      /^http(s)?:\/\/\S+\.(cyou|xyz|shop)/
// @icon         https://06.xhlld080.shop/favicon.ico
// @license      MIT
// @run-at       document-start
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.1.5/hls.min.js
// @require https://scriptcat.org/lib/637/1.4.4/ajaxHooker.js#sha256=Z7PdIQgpK714/oDPnY2r8pcK60MLuSZYewpVtBFEJAc=
// @downloadURL https://update.greasyfork.org/scripts/481765/%E5%B0%8F%E7%8B%90%E7%8B%B8VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/481765/%E5%B0%8F%E7%8B%90%E7%8B%B8VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //2025年9月18日
    //最新地址发布页： https://xhlyj702.shop/#/index?tag=yjdi
    //最新跳转地址: https://xhlld044.shop/#/index?tag=yjdi
    //2025年12月10日 https://06.xhlld080.shop/#/index?tag=yjdi

    // 1.创建播放器容器
    const player = document.createElement('div');
    player.id = 'hlsPlayer';
    player.innerHTML = `<video id="videoElement" controls></video>
        <div class="player-footer">
            <text id="showTips">⌛️破解中...</text>
            <span id="changeSrc"></span>
            <div><text id="showTips2"></text>
            <span id="changeSrc2"></span></div>
        </div>`;

    // HLS播放器初始化
    const video = player.querySelector('#videoElement');
    const videosrcEl = player.querySelector('#changeSrc');
    const videosrcEl2 = player.querySelector('#changeSrc2');
    const showTipsEl = player.querySelector('#showTips');
    const showTipsEl2 = player.querySelector('#showTips2');
    let hls = null;

    // 1.1样式设置
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
            max-width: 50vw;
            max-height: 50vh;
            border-radius: 0 0 8px 8px;
        }
    `);

    // 函数:加载HLS视频
    function loadHlsStream(url) {
        if (Hls.isSupported()) {
            if(hls) hls.destroy();
            hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play();
                showTipsEl.innerText = `✅破解成功:`;
                showTipsEl2.innerText = `⏬一键下载:`;
            });
            hls.on(Hls.Events.ERROR, (event, data) => {
                console.error('HLS Error:', data);
                //showTipsEl.innerText = `❌破解成功但加载失败:(${data.type},${data.details})`;
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
            video.addEventListener('loadedmetadata', () => video.play());
        }
    }

    // 2.获取视频地址
    ajaxHooker.protect();
    ajaxHooker.filter([
        {type: 'xhr', url: '/view/getVideoInfo/', method: 'POST', async: true},//小狐狸
        {type: 'xhr', url: '/view/getLikeVideoList/', method: 'POST', async: true},//小狐狸
    ]);
    ajaxHooker.hook(request => {
        if (request.url.indexOf('/view/getVideoInfo/') > -1 ) {
            request.response = async res => {
                let jsonobj = JSON.parse(res.responseText);
                //console.log("hooked!!! getVideoInfo ====>",jsonobj);
                let tmp = jsonobj.data.coverUrl.split('/');
                window.m3u8_id = tmp[3] + '/' + tmp[4]; //"20240504/59kS6tea"
                console.log("hooked1!!! window.m3u8_id ====>",jsonobj, window.m3u8_id);
            };
        }else if (request.url.indexOf('/view/getLikeVideoList/') > -1 ) {
            request.response = async res => {
                let jsonobj = JSON.parse(res.responseText);
                //console.log("hooked!!! getLikeVideoList ====>",jsonobj);

                let m3u8_prefix = jsonobj.data.map(item=>{
                    let tmp = item.playUrl.split('/')[2];
                    return tmp;
                });
                //console.log("hooked!!! m3u8_prefix ====>",m3u8_prefix);

                window.m3u8_prefix = Array.from(new Set(m3u8_prefix));
                console.log("hooked2!!! window.m3u8_prefix ====>",jsonobj, window.m3u8_prefix);
                //ajaxHooker.unhook();
            };
        }
    });

    function show_videoUrl() {
        for(var i =0; i <window.m3u8_prefix.length ;i++ ){
            if(window.m3u8_prefix[i] == undefined) continue;

            // 创建按钮时添加事件监听器
            const button = document.createElement('button');
            const cururl = `https://${window.m3u8_prefix[i]}/${window.m3u8_id}/index.m3u8`; // 立即固化当前值
            button.textContent = `源${i+1}`;
            button.addEventListener('click', () => {
                loadHlsStream(cururl);
            });
            if(i == 0){
                // 3.加载HLS视频
                loadHlsStream(cururl);//https://002.xhlsc001.top/20220509/QCujjnRP/index.m3u8
            }
            videosrcEl.appendChild(button);

            const button2 = document.createElement('button');
            const titleEl = document.querySelector("#app > div > div.subjectBox > div > div:nth-child(3) > div:nth-child(3) > div:nth-child(1)") || document.querySelector("#app > div > div:nth-child(1) > div:nth-child(3)");
            const title= titleEl?.innerText || document.title;
            const downurl = `https://tools.thatwind.com/tool/m3u8downloader#m3u8=${cururl}&referer=${window.location.href}&filename=${title}`;//cururl;
            button2.textContent = `源${i+1}`;
            button2.addEventListener('click', () => {
                window.open(downurl,"_blank");
            });
            videosrcEl2.appendChild(button2);
        }
        clearInterval(my_timer);
        // 3.加载HLS视频
        //loadHlsStream(`https://tp.tttdf147.shop/${window.m3u8_id}/index.m3u8`);
    }

    function check_circle(){
        if(!document.body){
            console.log("⌛️加载DOM中...");
            return ;
        }
        // 1.2加载播放器容器
        document.body.appendChild(player);

        if(window.m3u8_prefix?.length && window.m3u8_id){
            show_videoUrl();
        }else{
            console.log("⌛️视频破解中...若长时间没有破解，手动刷新一下页面，或者换一个视频");
        }
    }

    let my_timer = setInterval(check_circle, 2000);
})();