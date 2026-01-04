// ==UserScript==
// @name         91app短视频VIP免费看
// @namespace    91app_vip_video_free_see
// @version      1.0
// @description  来不及解释了，快上车！！！
// @author       w2f
// @match        https://webo1.dsp01a.net/*
// @match        https://webo2.dsp01a.net/*
// @match        https://webo3.dsp01a.net/*
// @match        https://webo4.dsp01a.net/*
// @match        https://webo5.dsp01a.net/*
// @include      /^http(s)?:\/\/webo\w+\.\w+\.(com|net)/

// @match        https://p1.ykzmxuq.cc/*
// @match        https://p2.ykzmxuq.cc/*
// @match        https://p3.ykzmxuq.cc/*
// @match        https://p4.ykzmxuq.cc/*
// @match        https://p5.ykzmxuq.cc/*
// @include      /^http(s)?:\/\/p\w+\.\w+\.cc/

// @91视频 todo:去ad
// @match        https://yypwa1.xtrltgwm.xyz/*
// @match        https://yypwa2.xtrltgwm.xyz/*
// @match        https://yypwa3.xtrltgwm.xyz/*
// @match        https://yypwa4.xtrltgwm.xyz/*
// @match        https://yypwa5.xtrltgwm.xyz/*

// @汤头条 todo:err
// @match        https://p4.zacdqpi.com/*

// @50度灰 todo:err
// @match        https://p5.hmmcxkd.xyz/*

// @TikTok成人版 抖阴 优质 todo:err
// @match        https://p3.cugleqmo.xyz/*

// @园区淫乱 todo:err
// @match        https://w1.zhecxbm.cc/*
// @icon         https://p4.ykzmxuq.cc/favicon.ico
// @license      MIT
// @grant none
// @require      https://scriptcat.org/lib/637/1.4.5/ajaxHooker.js#sha256=EGhGTDeet8zLCPnx8+72H15QYRfpTX4MbhyJ4lJZmyg=
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/520756/91app%E7%9F%AD%E8%A7%86%E9%A2%91VIP%E5%85%8D%E8%B4%B9%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/520756/91app%E7%9F%AD%E8%A7%86%E9%A2%91VIP%E5%85%8D%E8%B4%B9%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const checkInterval = 1000;
    // 定时执行主函数
    setInterval(mainFunction, checkInterval);

    function mainFunction() {
        // 获取视频元素
        const video = document.querySelector('video');
        // 检查video是否消失，若消失则卸载playerContainer组件
        let playerContainer = document.getElementById('custom-video-controls');
        if (!video && playerContainer) {
            console.log('video 消失，卸载 playerContainer');
            playerContainer.remove();
            return;
        }
        // 检查video是否存在，若存在则加载playerContainer组件
        if (video && !playerContainer) {
            console.log('video 存在，加载 playerContainer');
            // 创建播放器容器
            playerContainer = document.createElement('div');
            playerContainer.id = 'custom-video-controls';
            playerContainer.style.position = 'fixed';
            playerContainer.style.bottom = '50px';
            playerContainer.style.left = '50%';
            playerContainer.style.transform = 'translateX(-50%)';
            playerContainer.style.width = '100%';
            playerContainer.style.background = '#222';
            playerContainer.style.borderRadius = '5px';
            playerContainer.style.display = 'flex';
            playerContainer.style.flexDirection = 'column';
            playerContainer.style.alignItems = 'center';
            playerContainer.style.padding = '10px';
            playerContainer.style.color = '#fff';
            playerContainer.style.zIndex = '9999';
            playerContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';

            // 创建按钮组（播放、时间在左，其他图标在右）
            const controlsRow = document.createElement('div');
            controlsRow.style.display = 'flex';
            controlsRow.style.justifyContent = 'space-between';
            controlsRow.style.width = '100%';
            controlsRow.style.marginBottom = '8px';
            controlsRow.style.alignItems = 'center';

            // 左侧：播放/暂停 + 时间显示
            const leftControls = document.createElement('div');
            leftControls.style.display = 'flex';
            leftControls.style.alignItems = 'center';
            leftControls.style.gap = '10px';

            // 右侧：音量、倍速、全屏、新标签页打开、收藏、下载
            const rightControls = document.createElement('div');
            rightControls.style.display = 'flex';
            rightControls.style.alignItems = 'center';
            rightControls.style.gap = '15px';

            // 播放/暂停按钮
            const playPauseButton = document.createElement('button');
            playPauseButton.innerHTML = '⏸️';
            playPauseButton.style.border = 'none';
            playPauseButton.style.background = 'transparent';
            playPauseButton.style.color = '#fff';
            playPauseButton.style.cursor = 'pointer';
            playPauseButton.style.fontSize = '18px'; // 统一按钮大小

            playPauseButton.onclick = () => {
                if (video.paused) {
                    video.play();
                    playPauseButton.innerHTML = '⏸️';
                } else {
                    video.pause();
                    playPauseButton.innerHTML = '▶️';
                }
            }

            // 时间显示
            const timeDisplay = document.createElement('span');
            timeDisplay.textContent = '00:00 / 00:00';
            timeDisplay.style.fontSize = '12px';

            // 音量图标
            const volumeButton = document.createElement('button');
            volumeButton.innerHTML = '🔊';
            volumeButton.style.border = 'none';
            volumeButton.style.background = 'transparent';
            volumeButton.style.color = '#fff';
            volumeButton.style.cursor = 'pointer';
            volumeButton.style.fontSize = '18px'; // 统一按钮大小

            volumeButton.onclick = () => {
                video.muted = !video.muted;
                volumeButton.innerHTML = video.muted ? '🔇' : '🔊';
            }

            // **优化倍速播放：点击后切换**
            const speedLevels = [1, 1.5, 2, 4]; // 预设倍速
            let currentSpeedIndex = 0; // 默认为1倍速

            const speedButton = document.createElement('button');
            speedButton.innerHTML = `${speedLevels[currentSpeedIndex]}x`;
            speedButton.style.border = 'none';
            speedButton.style.background = 'transparent';
            speedButton.style.color = '#fff';
            speedButton.style.cursor = 'pointer';
            speedButton.style.fontSize = '18px'; // 统一按钮大小

            speedButton.onclick = () => {
                currentSpeedIndex = (currentSpeedIndex + 1) % speedLevels.length;
                video.playbackRate = speedLevels[currentSpeedIndex];
                speedButton.innerHTML = `${speedLevels[currentSpeedIndex]}x`;
            }

            // 画中画按钮
            const pipButton = document.createElement('button');
            pipButton.innerHTML = '📺';
            pipButton.style.border = 'none';
            pipButton.style.background = 'transparent';
            pipButton.style.color = '#fff';
            pipButton.style.cursor = 'pointer';
            pipButton.style.fontSize = '18px'; // 统一按钮大小

            pipButton.onclick = async () => {
                if (video !== document.pictureInPictureElement) {
                    try {
                        await video.requestPictureInPicture();
                    } catch (error) {
                        console.error('画中画模式请求失败:', error);
                    }
                } else {
                    try {
                        await document.exitPictureInPicture();
                    } catch (error) {
                        console.error('退出画中画模式失败:', error);
                    }
                }
            };

            // 全屏按钮
            const fullScreenButton = document.createElement('button');
            fullScreenButton.innerHTML = '⛶';
            fullScreenButton.style.border = 'none';
            fullScreenButton.style.background = 'transparent';
            fullScreenButton.style.color = '#fff';
            fullScreenButton.style.cursor = 'pointer';
            fullScreenButton.style.fontSize = '18px'; // 统一按钮大小

            fullScreenButton.onclick = () => {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    video.requestFullscreen();
                }
            }


            // 新标签页打开按钮
            const newTabButton = document.createElement('button');
            newTabButton.innerHTML = '🌐';
            newTabButton.style.border = 'none';
            newTabButton.style.background = 'transparent';
            newTabButton.style.color = '#fff';
            newTabButton.style.cursor = 'pointer';
            newTabButton.style.fontSize = '18px'; // 统一按钮大小
            newTabButton.onclick = () => window.open(video.dataset.videosrc || video.src, '_blank');

            // 喜欢按钮
            const likeButton = document.createElement('button');
            likeButton.innerHTML = '🤍';
            likeButton.style.border = 'none';
            likeButton.style.background = 'transparent';
            likeButton.style.color = '#fff';
            likeButton.style.cursor = 'pointer';
            likeButton.style.fontSize = '18px'; // 统一按钮大小
            // 初始化喜欢状态
            let isLiked = false;
            // 点击事件逻辑
            likeButton.onclick = () => {
                isLiked = !isLiked;
                if (isLiked) {
                    likeButton.innerHTML = '💖';
                    const videoInfo = {
                        // 生成唯一ID，使用当前时间戳
                        "id": Date.now().toString(),
                        // 默认获取网页标题
                        "title": getVideoTitle(video),
                        "videosrc": video.dataset.videosrc || video.src,
                        "author": "示例作者", // 需替换为实际视频作者
                        "referer": window.location.href,
                        // 调用函数获取封面图
                        "imgsrc": getVideoThumbnail(video),
                    };
                    localStorage.setItem('likedVideos', JSON.stringify([...JSON.parse(localStorage.getItem('likedVideos') || '[]'), videoInfo]));
                } else {
                    likeButton.innerHTML = '💔';
                    const likedVideos = JSON.parse(localStorage.getItem('likedVideos') || '[]');
                    const newLikedVideos = likedVideos.filter(v => v.videosrc !== (video.dataset.videosrc || video.src));
                    localStorage.setItem('likedVideos', JSON.stringify(newLikedVideos));
                }
            }
            // 监听 video 的 src 变化
            const observer = new MutationObserver((mutationsList) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                        // 监听 src 变化时，根据 localStorage 中 videosrc 的值修改喜欢状态
                        if (likeButton) {
                            const likedVideos = JSON.parse(localStorage.getItem('likedVideos')) || [];
                            const videoSrc = video.dataset.videosrc || video.src;
                            const isLiked = likedVideos.some(v => v.videosrc === videoSrc);
                            likeButton.innerHTML = isLiked ? '💖' : '💔';
                        }
                    }
                }
            });
            if (video) {
                observer.observe(video, { attributes: true, attributeFilter: ['src'] });
            }

            // 定义获取视频标题的函数
            function getVideoTitle(video) {
                if (video.title) {
                    return video.title;
                }
                let currentElement = video.parentElement;
                while (currentElement) {
                    if (currentElement.textContent.trim()) {
                        let title = currentElement.textContent.trim();
                        if (title.length > 50) {
                            return title.substring(0, 50) + '...';
                        }
                        return title;
                    }
                    currentElement = currentElement.parentElement;
                }
                return document.title;
            }

            // 定义获取视频封面图的函数
            function getVideoThumbnail(video) {
                // 优先获取视频的预览图
                if (video.poster) {
                    return video.poster;
                }

                let currentElement = video.parentElement;
                while (currentElement) {
                    const img = currentElement.querySelector('img');
                    if (img) {
                        return img.src;
                    }
                    currentElement = currentElement.parentElement;
                }

                return '';
            }

            // 下载逻辑
            const downloadButton = document.createElement('button');
            downloadButton.innerHTML = '⬇️';
            downloadButton.style.border = 'none';
            downloadButton.style.background = 'transparent';
            downloadButton.style.color = '#fff';
            downloadButton.style.cursor = 'pointer';
            downloadButton.style.fontSize = '18px'; // 统一按钮大小
            downloadButton.onclick = () => {
                const downurl = `https://tools.thatwind.com/tool/m3u8downloader#m3u8=${video.dataset.videosrc}&referer=${window.location.href}&filename=${video.dataset.filename}`;
                window.open(downurl, '_blank');
            }

            // 设置按钮
            const settingsButton = document.createElement('button');
            settingsButton.innerHTML = '⚙️';
            settingsButton.style.border = 'none';
            settingsButton.style.background = 'transparent';
            settingsButton.style.color = '#fff';
            settingsButton.style.cursor = 'pointer';
            settingsButton.style.fontSize = '18px'; // 统一按钮大小
            // 可添加点击事件逻辑
            settingsButton.onclick = () => {
                console.log('点击了设置按钮');
            }

            // 创建进度条容器
            const progressContainer = document.createElement('div');
            progressContainer.style.width = '100%';
            progressContainer.style.height = '10px';
            progressContainer.style.background = '#444';
            progressContainer.style.borderRadius = '3px';
            progressContainer.style.cursor = 'pointer';

            // 创建进度条
            const progressBar = document.createElement('div');
            progressBar.style.width = '0%';
            progressBar.style.height = '100%';
            progressBar.style.background = '#4CAF50';
            progressBar.style.borderRadius = '3px';
            progressContainer.appendChild(progressBar);

            // 监听视频播放进度
            video.addEventListener('timeupdate', () => {
                const percentage = (video.currentTime / video.duration) * 100;
                progressBar.style.width = percentage + '%';
                timeDisplay.textContent = formatTime(video.currentTime) + ' / ' + formatTime(video.duration);
            });
            // 格式化时间函数
            function formatTime(seconds) {
                const minutes = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return minutes.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
            }

            // 点击进度条跳转
            progressContainer.addEventListener('click', (event) => {
                const offsetX = event.offsetX;
                const newTime = (offsetX / progressContainer.offsetWidth) * video.duration;
                video.currentTime = newTime;
            });

            // 快退按钮
            const rewindButton = document.createElement('button');
            rewindButton.innerHTML = '⏪';
            rewindButton.style.border = 'none';
            rewindButton.style.background = 'transparent';
            rewindButton.style.color = '#fff';
            rewindButton.style.cursor = 'pointer';
            rewindButton.style.fontSize = '18px'; // 增大按钮大小
            rewindButton.title = '快退10秒';
            rewindButton.onclick = () => {
                video.currentTime = Math.max(0, video.currentTime - 10);
            };

            // 快进按钮
            const forwardButton = document.createElement('button');
            forwardButton.innerHTML = '⏩';
            forwardButton.style.border = 'none';
            forwardButton.style.background = 'transparent';
            forwardButton.style.color = '#fff';
            forwardButton.style.cursor = 'pointer';
            forwardButton.style.fontSize = '18px'; // 增大按钮大小
            forwardButton.title = '快进10秒';
            forwardButton.onclick = () => {
                video.currentTime = Math.min(video.duration, video.currentTime + 10);
            };

            // 组装控制面板
            leftControls.appendChild(playPauseButton);
            leftControls.appendChild(timeDisplay);

            //rightControls.appendChild(volumeButton);
            //rightControls.appendChild(rewindButton);
            rightControls.appendChild(forwardButton);
            rightControls.appendChild(speedButton);
            //rightControls.appendChild(fullScreenButton);
            //rightControls.appendChild(pipButton);
            //rightControls.appendChild(likeButton);
            rightControls.appendChild(newTabButton);
            rightControls.appendChild(downloadButton);
            //rightControls.appendChild(settingsButton);

            controlsRow.appendChild(leftControls);
            controlsRow.appendChild(rightControls);

            playerContainer.appendChild(controlsRow);
            playerContainer.appendChild(progressContainer); // **进度条独立放在底部**

            // 添加到页面
            document.body.appendChild(playerContainer);
        }
    }


    ajaxHooker.protect();
    ajaxHooker.filter([
        {type: 'xhr', url: '.m3u8?auth_key=', method: 'GET', async: true},
        //{type: 'xhr', url: /^https:\/\/\w+play\.\w+\.(com|cn)/, method: 'GET', async: true},
    ]);
    ajaxHooker.hook(request => {
        if (1) {
            //https://10play.nndez.cn/AAA/BBB/BBB.m3u8?auth_key=CCC&via_m=nineone/wmq
            //https://long.nndez.cn/watch4/7f396f270663012c66b02d848632f3f6/7f396f270663012c66b02d848632f3f6.m3u8?auth_key=1748844858-0-0-5f6fb62aa519049abce398ec08c3380b&via_m=wmq
            //https://120play.igalaz.cn/videos5/8cd86dad5328b21221c9be59888080b1/8cd86dad5328b21221c9be59888080b1.m3u8?auth_key=1765368758-0-0-e90812901eeb946de5ab894103d2a7a5&via_m=tbr&seconds=10

            console.log("hooked!!! request ====>",request);
            let url = new URL(request.url);
            let seg = url.host.split('.');
            seg[0] = 'long';
            url.host = seg.join('.');
            request.url = url.href;
            console.log("url fixed ====>",request.url);
            show_tips(url.href);//显示优化
        }
    });

    function show_tips(m3u8url){
        let nodes = document.querySelectorAll("div.swiper-slide") || document.querySelectorAll("div.swiper-slide-active");
        for(var i = 0 ; i < nodes.length ; i++){
            let cur = nodes[i];
            window.now_node= cur;
            //console.log("now node:",cur);
            cur.querySelector("div.collect-topics-container")?.remove();//去除热点推荐
            cur.querySelector("div.index_item_bottom")?.remove();
            let tmp = cur.querySelectorAll("div.club");
            if(tmp.length == 0){
                ;//do nothing
            }else if(tmp.length== 1){
                tmp[0].querySelector("span").innerText = `✅已破解`;//破解提示
            }else{
                tmp[0].remove();//去除位置
                tmp[1].querySelector("span").innerText = `✅已破解`;//破解提示
            }
            let vip = cur.querySelector("div.index_info_bottom_vip_tips span"); 
            if(vip) vip.innerText = `✅已破解`;//破解提示
        }
        // 获取 video 元素
        const video = document.querySelector('video')
        // 添加自定义属性
        if (video) {
            video.dataset.filename = document.querySelector("div.video-caption > div.title")?.innerText || 
            document.querySelector("div.swiper-slide.swiper-slide-active > div > div.index_item_info > p")?.innerText || document.title;
            video.dataset.videosrc = m3u8url;
            //<video data-videosrc="https://example.com/video.m3u8"></video>
        }
    }

    function remove_ad(){
        document.querySelector("body > div.van-overlay")?.remove();//去首次加载时的遮层
        document.querySelector("body > div.van-dialog.notice")?.remove();//去首次加载时的广告弹窗
        document.querySelector("div.preview-tip-container")?.remove();//去试看弹窗

        //微密圈去广告
        document.querySelector("welcome-ad")?.remove();//去除 开屏广告 5s倒计时
        document.querySelector("div.notice-header-02")?.click();//去除 4次 广告 弹窗
        document.querySelector("div.notice-header-02")?.click();
        document.querySelector("div.notice-header-02")?.click();
        document.querySelector("div.notice-header-02")?.click();
        let ad = document.querySelector("div.notice_scaleLayer"); if(ad) ad.style.display = 'none';//去除 应用中心 弹窗
        ad = document.querySelector("div.home-screen-pwa-container"); if(ad) ad.style.display = 'none';//去除 添加到主屏幕 弹窗
        document.querySelector("div.alertvip-in")?.remove(); //去除 开通VIP 弹窗
        document.querySelector("div.index_item_bottom")?.remove();//去除 热点推荐
        document.querySelector("div.flex.items-center")?.remove();
    }
    let my_timer = setInterval(remove_ad, 1000);
})();