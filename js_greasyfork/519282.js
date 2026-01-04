// ==UserScript==
// @name         B站直播间小玩具
// @namespace    https://greasyfork.org/zh-CN/scripts/
// @version      1.6
// @description  一些小功能
// @author       someone
// @license      MIT
// @iconURL      https://www.bilibili.com/favicon.ico
// @icon64URL    https://www.bilibili.com/favicon.ico
// @match        *://live.bilibili.com/1*
// @match        *://live.bilibili.com/2*
// @match        *://live.bilibili.com/3*
// @match        *://live.bilibili.com/4*
// @match        *://live.bilibili.com/5*
// @match        *://live.bilibili.com/6*
// @match        *://live.bilibili.com/7*
// @match        *://live.bilibili.com/8*
// @match        *://live.bilibili.com/9*
// @match        *://live.bilibili.com/blanc/1*
// @match        *://live.bilibili.com/blanc/2*
// @match        *://live.bilibili.com/blanc/3*
// @match        *://live.bilibili.com/blanc/4*
// @match        *://live.bilibili.com/blanc/5*
// @match        *://live.bilibili.com/blanc/6*
// @match        *://live.bilibili.com/blanc/7*
// @match        *://live.bilibili.com/blanc/8*
// @match        *://live.bilibili.com/blanc/9*
// @match        *://live.bilibili.com/blackboard/era/*
// @connect      bilibili.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.js
// @require      https://unpkg.com/ajax-hook@2.1.3/dist/ajaxhook.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.4.3/hls.min.js
// @grant        unsafeWindow
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/519282/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E5%B0%8F%E7%8E%A9%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/519282/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E5%B0%8F%E7%8E%A9%E5%85%B7.meta.js
// ==/UserScript==


//部分修改自https://greasyfork.org/zh-CN/scripts/435942  https://greasyfork.org/zh-CN/scripts/477746

(async function () {
    var roomId
    async function fetcher(url) {
        const res = await fetch(url)
        if (!res.ok) {
            throw new Error(res.statusText)
        }

        const data = await res.json()
        console.debug(data)
        if (data.code != 0) {
            throw new Error(`B站API请求错误: ${data.message}`)
        }
        return data
    }
    const newWindow = {
        init: () => {
            return newWindow.Toast.init();
        },
        Toast: {
            init: () => {
                try {
                    const list = [];
                    window.toast = (msg, type = 'success', timeout = 5e3) => {
                        switch (type){
                            case 'success':
                            case 'info':
                            case 'error':
                                break;
                            default:
                                type = 'info';
                        }
                        const a = $(`<div class="link-toast ${type} fixed" style="z-index:2001;text-align: left;"><span class="toast-text">${msg}</span></div>`)[0];
                        document.body.appendChild(a);
                        a.style.top = (document.body.scrollTop + list.length * 40 + 10) + 'px';
                        a.style.left = (document.body.offsetWidth + document.body.scrollLeft - a.offsetWidth - 5) + 'px';
                        list.push(a);
                        setTimeout(() => {
                            a.className += ' out';
                            setTimeout(() => {
                                list.shift();
                                list.forEach((v) => {
                                    v.style.top = (parseInt(v.style.top, 10) - 40) + 'px';
                                });
                                $(a).remove();
                            }, 200);
                        }, timeout);
                    };
                    return $.Deferred().resolve();
                } catch (err){
                    return $.Deferred().reject();
                }
            }
        }
    }
    newWindow.init()

    const seconds = 5
    const roomReg = /^\/(blanc\/)?(?<id>\d+)/
    roomId = parseInt(roomReg.exec(location.pathname)?.groups?.id)
    const res = await fetcher('https://api.live.bilibili.com/room/v1/Room/room_init?id=' + roomId)
    roomId = res.data.room_id
    const uid = res.data.uid
    var oldURL = window.top.location.href;
    var title = document.getElementsByTagName("title");
    if(oldURL.includes('lottery'))return
    if(oldURL.includes('treasurebox'))return
    if(!oldURL.includes('blanc') && !title[0].innerHTML.includes('哔哩哔哩直播')){
        let newURL = 'https://live.bilibili.com/blanc/' + roomId
        window.top.location = newURL
    }
    if(oldURL.includes('blackboard/era')){
        let newURL = 'https://live.bilibili.com/blanc/' + roomId
        window.top.location = newURL
    }
    setTimeout(() => {
        $('.web-player-icon-roomStatus').remove()
        $('.z-shop-popover-vm').remove()
        $('.web-player-module-area-mask').remove()
        try{
            window.toast('点赞拦截代码加载成功');
            window.toast('点赞后几秒内自动生效...');
            const originalFetch = unsafeWindow.fetch;
            unsafeWindow.fetch = async function(...args) {
                const [resource, config] = args;
                // 检查是否是点赞请求
                if (typeof resource === 'string' && resource.includes('/xlive/app-ucenter/v1/like_info_v3/like/likeReportV3')) {
                    const newResource = resource.replace(/click_time=[0-9]+/,'click_time=1000');
                    window.toast('点赞次数修改为1000次')
                    args[0] = newResource
                }
                return originalFetch.apply(this, args);
            };
        } catch (err) {
            console.error(err);
        }
        // 拦截API请求
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (url.includes('GetWebList')) {
                this.addEventListener('load', function() {
                    if (this.responseText) {
                        try {
                            const response = JSON.parse(this.responseText);
                            if (response.code === 0 && response.data && response.data.rooms) {
                                processRoomData(response.data.rooms);
                            }
                        } catch (e) {
                            console.error('Error processing response:', e);
                        }
                    }
                });
            }
            originalOpen.apply(this, arguments);
        };



        GM_addStyle(`
    .live-preview-container {
        position: absolute;
        width: 640px;
        background-color: #000;
        border: 2px solid #00a1d6;
        border-radius: 8px;
        z-index: 10000;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        aspect-ratio: 16/9; /* 添加宽高比，16:9是常见直播比例 */

    }

    .live-preview-container:hover {
        transform: scale(1.02);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
    }

    .live-preview-loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        color: white;
        font-size: 14px;
        background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
    }

    .live-preview-video {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .live-preview-header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(90deg, rgba(0,161,214,0.8) 0%, rgba(0,121,214,0.8) 100%);
        color: white;
        padding: 6px 10px;
        font-size: 13px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 2;
    }

    .live-preview-close {
        cursor: pointer;
        font-weight: bold;
        font-size: 16px;
        padding: 0 4px;
    }

    .live-preview-error {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        color: #ff4d4f;
        padding: 15px;
        text-align: center;
        background: #1a1a1a;
        font-size: 14px;
    }

    .retry-btn {
        margin-top: 10px;
        padding: 6px 12px;
        background: #00a1d6;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        transition: background 0.2s;
    }

    .retry-btn:hover {
        background: #0088b7;
    }
    .loading-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 20px;
        text-align: center;
    }

    .loading-title {
        font-size: 32px;
        font-weight: bold;
        color: #fff;
        margin-bottom: 15px;
        text-shadow: 0 1px 3px rgba(0,0,0,0.5);
    }

    .loading-progress {
        width: 80%;
        height: 4px;
        background: rgba(255,255,255,0.2);
        border-radius: 2px;
        margin-bottom: 15px;
        overflow: hidden;
    }

    .loading-bar {
        width: 0%;
        height: 100%;
        background: linear-gradient(90deg, #00a1d6, #00c1d6);
        border-radius: 2px;
        animation: loading 3s ease-in-out forwards;
    }

    .loading-hint {
        font-size: 13px;
        color: rgba(255,255,255,0.8);
    }

    @keyframes loading {
        0% { width: 0%; }
        100% { width: 100%; }
    }
`);

        function processRoomData(rooms) {
            // 等待DOM加载完成
            const checkDomReady = setInterval(() => {
                const anchorElements = document.querySelectorAll('a[href^="/"][target="_blank"].one-anchor');
                if (anchorElements.length > 0) {
                    clearInterval(checkDomReady);

                    rooms.forEach(room => {
                        const roomId = room.room_id;
                        const title = room.title;

                        // 找到对应的a元素
                        const anchor = Array.from(anchorElements).find(el => {
                            const href = el.getAttribute('href');
                            return href && href.startsWith(`/${roomId}`);
                        });

                        if (anchor) {
                            // 创建预览容器
                            const previewContainer = document.createElement('div');
                            previewContainer.className = 'live-preview-container';
                            previewContainer.style.display = 'none';

                            // 预览窗口头部（包含标题）
                            const previewHeader = document.createElement('div');
                            previewHeader.className = 'live-preview-header';
                            previewHeader.innerHTML = `
                        <span>${title}</span>
                        <span class="live-preview-close">×</span>
                    `;

                            const loadingText = document.createElement('div');
                            loadingText.className = 'live-preview-loading';
                            loadingText.innerHTML = `
    <div class="loading-content">
        <div class="loading-title">${title}</div>
        <div class="loading-progress">
            <div class="loading-bar"></div>
        </div>
        <div class="loading-hint">准备加载直播内容...可能需要数秒...</div>
    </div>
`;

                            previewContainer.appendChild(previewHeader);
                            previewContainer.appendChild(loadingText);

                            // 添加到DOM中
                            document.body.appendChild(previewContainer);

                            // 获取头像元素
                            const avatar = anchor.querySelector('.avatar img.real-avatar');
                            if (!avatar) return;

                            // 使用变量记录状态
                            let isMouseOver = false;
                            let hideTimeout = null;
                            let previewTimeout = null;
                            let previewLoaded = false;
                            let mousePosition = { x: 0, y: 0 };
                            let lastMouseMoveTime = 0;
                            let mouseMoveTimer = null;

                            // 跟踪鼠标位置和移动
                            document.addEventListener('mousemove', (e) => {
                                mousePosition = { x: e.clientX, y: e.clientY };
                                lastMouseMoveTime = Date.now();

                                // 清除之前的定时器
                                clearTimeout(mouseMoveTimer);

                                // 如果鼠标在预览窗口内移动，重置计时器
                                if (isMouseOver) {
                                    mouseMoveTimer = setTimeout(() => {
                                        if (!previewLoaded && isMouseOver) {
                                            showPreview(roomId, previewContainer, mousePosition);
                                            previewLoaded = true;
                                        }
                                    }, 3000 - (Date.now() - lastMouseMoveTime));
                                }
                            });

                            // 关闭按钮事件
                            previewHeader.querySelector('.live-preview-close').addEventListener('click', () => {
                                previewContainer.style.display = 'none';
                                previewLoaded = false;
                            });

                            // 鼠标移入事件
                            anchor.addEventListener('mouseenter', (e) => {
                                isMouseOver = true;
                                clearTimeout(hideTimeout);
                                clearTimeout(previewTimeout);

                                // 立即显示预览容器（带标题）
                                positionPreviewContainer(previewContainer, mousePosition);
                                previewContainer.style.display = 'block';

                                // 记录鼠标进入时间
                                lastMouseMoveTime = Date.now();

                                // 设置3秒后加载预览（如果鼠标静止）
                                mouseMoveTimer = setTimeout(() => {
                                    if (isMouseOver && !previewLoaded) {
                                        showPreview(roomId, previewContainer, mousePosition);
                                        previewLoaded = true;
                                    }
                                }, 3000);
                            });

                            // 鼠标移出事件
                            anchor.addEventListener('mouseleave', () => {
                                isMouseOver = false;
                                clearTimeout(mouseMoveTimer);
                                clearTimeout(previewTimeout);

                                // 添加延迟隐藏，防止快速移动时闪烁
                                hideTimeout = setTimeout(() => {
                                    if (!isMouseOver) {
                                        previewContainer.style.display = 'none';
                                        previewLoaded = false;
                                    }
                                }, 100);
                            });

                            // 预览容器鼠标事件
                            previewContainer.addEventListener('mouseenter', () => {
                                clearTimeout(hideTimeout);
                                isMouseOver = true;
                            });

                            previewContainer.addEventListener('mouseleave', () => {
                                isMouseOver = false;
                                previewContainer.style.display = 'none';
                                previewLoaded = false;
                            });
                        }
                    });
                }
            }, 100);

            // 定位预览容器
            function positionPreviewContainer(container, mousePos) {
                const previewWidth = 640;
                const previewHeight = 400;
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                let left = mousePos.x - previewWidth - 50;
                let top = mousePos.y - previewHeight - 50;

                // 如果左边空间不足，向右移动
                if (left < 10) {
                    left = mousePos.x + 20;
                }

                // 如果顶部空间不足，向下移动
                if (top < 10) {
                    top = mousePos.y + 20;
                }

                // 确保不会超出右边和下边
                left = Math.min(left, windowWidth - previewWidth - 10);
                top = Math.min(top, windowHeight - previewHeight - 10);

                // 设置预览容器位置
                container.style.left = `${left}px`;
                container.style.top = `${top}px`;
            }

            // 显示预览的函数
            function showPreview(roomId, container, mousePos) {
                // 更新加载文本
                const loadingElement = container.querySelector('.live-preview-loading');
                if (loadingElement) {
                    loadingElement.textContent = '加载预览中...';
                }

                // 获取直播流信息
                const apiUrl = `https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?room_id=${roomId}&protocol=0,1&format=0,1,2&codec=0,1&qn=0&platform=web&ptype=8`;

                GM_xmlhttpRequest({
                    method: "GET",
                    url: apiUrl,
                    headers: {
                        "Referer": "https://live.bilibili.com/"
                    },
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            console.log('API响应:', data);

                            if (data.code === 0 && data.data.playurl_info && data.data.playurl_info.playurl) {
                                const streams = data.data.playurl_info.playurl.stream;
                                const hlsStream = streams.find(s => s.protocol_name === "http_hls");

                                if (hlsStream && hlsStream.format[0] && hlsStream.format[0].codec[0]) {
                                    const urlInfo = hlsStream.format[0].codec[0].url_info[0];
                                    const baseUrl = hlsStream.format[0].codec[0].base_url;
                                    const host = urlInfo.host;
                                    const extra = urlInfo.extra;

                                    const streamUrl = host + baseUrl + extra;
                                    createPreviewPlayer(streamUrl, container, mousePos);
                                    return;
                                }
                            }
                            throw new Error('无法获取直播流信息');
                        } catch (e) {
                            console.error('解析错误:', e);
                            const errorDiv = document.createElement('div');
                            errorDiv.className = 'live-preview-error';
                            errorDiv.textContent = '加载预览失败';
                            container.querySelector('.live-preview-loading').replaceWith(errorDiv);
                        }
                    },
                    onerror: function(error) {
                        console.error('请求错误:', error);
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'live-preview-error';
                        errorDiv.textContent = '请求直播流失败';
                        container.querySelector('.live-preview-loading').replaceWith(errorDiv);
                    }
                });
            }

            // 创建预览播放器
            function createPreviewPlayer(streamUrl, container, mousePos) {
                // 移除加载文本
                const loadingElement = container.querySelector('.live-preview-loading');
                if (loadingElement) {
                    container.removeChild(loadingElement);
                }

                // 创建视频元素
                const video = document.createElement('video');
                video.className = 'live-preview-video';
                video.autoplay = true;
                video.muted = true;
                video.playsInline = true;
                container.appendChild(video);

                // 使用HLS.js播放
                if (typeof Hls !== 'undefined' && Hls.isSupported()) {
                    const hls = new Hls({
                        enableWorker: true,
                        lowLatencyMode: true,
                        maxBufferLength: 30,
                        maxMaxBufferLength: 60,
                        maxBufferSize: 60 * 1000 * 1000,
                        maxBufferHole: 0.5,
                        highBufferWatchdogPeriod: 2,
                        nudgeOffset: 0.1,
                        nudgeMaxRetry: 3,
                        maxFragLookUpTolerance: 0.25,
                        liveSyncDurationCount: 3,
                        liveMaxLatencyDurationCount: 10
                    });

                    hls.on(Hls.Events.ERROR, function(event, data) {
                        console.error('HLS错误:', data);
                        if (data.fatal) {
                            switch(data.type) {
                                case Hls.ErrorTypes.NETWORK_ERROR:
                                    if (data.details === Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
                                        console.warn('缓冲停滞错误，尝试恢复...');
                                        hls.destroy();

                                        setTimeout(() => {
                                            const errorDiv = container.querySelector('.live-preview-error');
                                            if (errorDiv) {
                                                errorDiv.textContent = '正在尝试重新连接...';
                                            }
                                            initHlsPlayer();
                                        }, 2000);
                                    } else {
                                        showHlsError('网络错误: ' + (data.details || '未知错误'));
                                    }
                                    break;
                                case Hls.ErrorTypes.MEDIA_ERROR:
                                    console.warn('媒体错误，尝试恢复...');
                                    hls.recoverMediaError();
                                    break;
                                default:
                                    showHlsError('播放错误: ' + (data.details || '未知错误'));
                                    break;
                            }
                        } else if (data.details === Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
                            console.warn('缓冲停滞，尝试调整...');
                            const currentTime = video.currentTime;
                            video.currentTime = currentTime + 0.1;
                        }
                    });

                    // 初始化HLS播放器
                    function initHlsPlayer() {
                        hls.loadSource(streamUrl);
                        hls.attachMedia(video);
                        hls.on(Hls.Events.MANIFEST_PARSED, function() {
                            video.play().catch(e => {
                                console.error('自动播放失败:', e);
                                showHlsError("自动播放被阻止，请点击预览窗口");
                            });
                        });
                    }

                    // 显示错误信息
                    function showHlsError(message) {
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'live-preview-error';
                        errorDiv.innerHTML = `
                    <div>${message}</div>
                    <button class="retry-btn">重试</button>
                `;
                        container.replaceChild(errorDiv, video);

                        // 添加重试按钮事件
                        errorDiv.querySelector('.retry-btn').addEventListener('click', function() {
                            errorDiv.textContent = '正在重新连接...';
                            setTimeout(() => {
                                container.removeChild(errorDiv);
                                container.appendChild(video);
                                initHlsPlayer();
                            }, 500);
                        });
                    }

                    // 初始加载
                    initHlsPlayer();
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    // 原生HLS支持
                    video.src = streamUrl;
                    video.addEventListener('loadedmetadata', function() {
                        video.play().catch(e => console.error('自动播放失败:', e));
                    });
                } else {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'live-preview-error';
                    errorDiv.textContent = '浏览器不支持播放此直播流';
                    container.replaceChild(errorDiv, video);
                }
            }
        }


        // 添加CSS样式
        const style = document.createElement('style');
        style.textContent = `
        .live-title-tooltip {
            position: absolute;
            display: none;
            background-color: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            max-width: 200px;
            text-align: center;
            z-index: 9999;
            pointer-events: none;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            animation: fadeIn 0.2s ease-out;
            line-height: 1.4;
            word-break: break-word;
            white-space: normal;
        }

        .live-title-tooltip::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 50%;
            transform: translateX(-50%);
            border-width: 5px 5px 0;
            border-style: solid;
            border-color: rgba(0, 0, 0, 0.8) transparent transparent;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
        document.head.appendChild(style);
    },2000)

    if (res.data.live_status != 1) {
        console.warn(`不在直播，已略过`)
        return
    }

    let rankGold = undefined
    let guardTab = undefined

    while ($('.tab-list.dp-flex').children().length == 0) {
        console.warn(`找不到Tab元素，等待3秒。`)
        await new Promise((res,) => setTimeout(res, 3000)) // wait 3 seconds
    }

    const keywords = ['高能榜', '房间观众', '应援日榜']
    let keyword;
    for (const element of $('.tab-list.dp-flex').children()) {
        console.log(element.innerText)
        if(element.innerText.indexOf("大航海") > -1)guardTab = element
        const kw = keywords.find(s => element.innerText.startsWith(s))
        console.log(kw)
        if (kw) {
            rankGold = element
            keyword = kw
        }
    }

    if (!rankGold || !keyword) {
        console.warn(`找不到高能榜元素。`)
        return
    }

    setInterval(async () => {
        let online = 0
        let online2 = 0
        let guard = 0
        try {
            const data = await fetcher(`https://api.live.bilibili.com/xlive/general-interface/v1/rank/getOnlineGoldRank?ruid=${uid}&roomId=${roomId}&page=1&pageSize=1`)
            online = data.data.onlineNum
        } catch (err) {
            console.warn(`查询高能榜时出现错误: ${err}`)
            console.warn(err)
        }
        try {
            const data2 = await fetcher(`https://api.live.bilibili.com/xlive/general-interface/v1/rank/queryContributionRank?ruid=${uid}&room_id=${roomId}&page=1&page_size=1&type=online_rank&switch=contribution_rank`)
            online2 = data2.data.count
        } catch (err) {
            console.warn(`查询贡献榜时出现错误: ${err}`)
            console.warn(err)
        }
        rankGold.innerHTML = `<span title="贡献用戶(左): ${online}\n在线用户(右): ${online2}">${keyword}(${online}/${online2})</span>`
        try {
            const data3 = await fetcher(`https://api.live.bilibili.com/xlive/app-room/v2/guardTab/topListNew?roomid=${roomId}&page=1&ruid=${uid}&page_size=20&typ=5&platform=web`)
            guard = data3.data.info.num
        } catch (err) {
            console.warn(`查询大航海时出现错误: ${err}`)
            console.warn(err)
        }
        guardTab.innerHTML = `<span >大航海(${guard})</span>`
    }, seconds * 1000)



})().catch(console.warn);