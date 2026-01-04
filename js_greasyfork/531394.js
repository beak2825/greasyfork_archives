// ==UserScript==
// @name               Bilibili 浏览助手
// @name:en            Bilibili Assistant
// @name:zh-CN         Bilibili 浏览助手
// @description        可在当前页面查看B站的字幕和封面，支持字幕下载
// @description:en     To view subtitle and thumbnail of Bilibili Video
// @description:zh-CN  可在当前页面查看B站的字幕和封面，支持字幕下载
// @namespace          https://www.runningcheese.com/userscripts
// @author             RunningCheese
// @version            1.7
// @match              http*://www.bilibili.com/video/*
// @icon               https://t1.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=32&url=https://www.bilibili.com
// @license            MIT
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/531394/Bilibili%20%E6%B5%8F%E8%A7%88%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/531394/Bilibili%20%E6%B5%8F%E8%A7%88%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 简化的元素创建工具
    const elements = {
        createAs(nodeType, config, appendTo) {
            const element = document.createElement(nodeType);
            if (config) {
                Object.entries(config).forEach(([key, value]) => {
                    element[key] = value;
                });
            }
            if (appendTo) appendTo.appendChild(element);
            return element;
        },
        getAs(selector) {
            return document.body.querySelector(selector);
        }
    };

    // 简化的fetch函数
    function fetch(url, option = {}) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            req.onreadystatechange = () => {
                if (req.readyState === 4) {
                    resolve({
                        ok: req.status >= 200 && req.status <= 299,
                        status: req.status,
                        statusText: req.statusText,
                        json: () => Promise.resolve(JSON.parse(req.responseText)),
                        text: () => Promise.resolve(req.responseText)
                    });
                }
            };
            if (option.credentials == 'include') req.withCredentials = true;
            req.onerror = reject;
            req.open('GET', url);
            req.send();
        });
    }

    // 创建预览图片元素
    const preview = elements.createAs("img", {
        id: "preview",
        style: `
            position: absolute;
            z-index: 2000;
            max-width: 60vw;
            max-height: 60vh;
            border: 1px solid #fff;
            border-radius: 4px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            display: none;
        `
    }, document.body);

        // 创建字幕显示面板
    const subtitlePanel = elements.createAs("div", {
        id: "subtitle-panel",
        style: `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 360px;
            max-width: 800px;
            max-height: 80vh;
            background-color: white;
            border-radius: 8px;
            box-shadow:0 4px 12px rgba(0,0,0,0.25);
            z-index: 10000;
            display: none;
            flex-direction: column;
            overflow: hidden;
        `
    }, document.body);

// 添加点击事件监听器
preview.addEventListener('click', function() {
    this.style.display = 'none';
});


    // 创建字幕面板标题栏
    const subtitleHeader = elements.createAs("div", {
        style: `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 10px;
            background-color: #F07C99;
            color: white;
            font-weight: bold;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            cursor: move; /* 添加移动光标样式 */
        `
    }, subtitlePanel);

    // 添加拖动功能
    let isDragging = false;
    let offsetX, offsetY;

    // 鼠标按下事件
    subtitleHeader.onmousedown = function(e) {
        isDragging = true;

        // 计算鼠标在面板内的相对位置
        const rect = subtitlePanel.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        // 移除transform属性，使定位更直接
        subtitlePanel.style.transform = 'none';

        // 更新面板位置为当前位置
        subtitlePanel.style.left = rect.left + 'px';
        subtitlePanel.style.top = rect.top + 'px';

        // 防止选中文本
        e.preventDefault();
    };

    // 鼠标移动事件
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;

        // 计算新位置
        let newLeft = e.clientX - offsetX;
        let newTop = e.clientY - offsetY;

        // 获取面板尺寸
        const rect = subtitlePanel.getBoundingClientRect();

        // 防止面板移出视口
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - rect.width));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - rect.height));

        // 更新位置
        subtitlePanel.style.left = newLeft + 'px';
        subtitlePanel.style.top = newTop + 'px';
    });

    // 鼠标释放事件
    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    // 鼠标离开窗口事件
    document.addEventListener('mouseleave', function() {
        isDragging = false;
    });

    // 创建字幕标题
    elements.createAs("div", {
        id: "subtitle-title",
        textContent: "视频字幕",
        style: `
            font-size: 14px;
        `
    }, subtitleHeader);

    // ... 其余代码保持不变 ...

    // 创建按钮容器
    const buttonContainer = elements.createAs("div", {
        style: `
            display: flex;
            gap: 10px;
        `
    }, subtitleHeader);

    // 创建下载按钮
    const downloadBtn = elements.createAs("button", {
        textContent: "下载",
        style: `
            background-color: #fb7299;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 14px;
        `,
        onclick: function() {
            const subtitleContent = document.getElementById('subtitle-content').textContent;
            const blob = new Blob([subtitleContent], {type: 'text/plain;charset=utf-8'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${document.title}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }, buttonContainer);

    // 创建关闭按钮
    const closeBtn = elements.createAs("button", {
        textContent: "关闭",
        style: `
            background-color: #fb7299;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 14px;
        `,
        onclick: function() {
            subtitlePanel.style.display = 'none';
        }
    }, buttonContainer);

    // 创建字幕内容区域
    const subtitleContent = elements.createAs("div", {
        id: "subtitle-content",
        style: `
            padding: 15px;
            overflow-y: auto;
            max-height: calc(80vh - 50px);
            line-height: 1.6;
            white-space: pre-wrap;
            font-size: 14px;
        `
    }, subtitlePanel);

    // 添加CSS样式
    const style = elements.createAs('style', {
        textContent: `
            .bili-icon-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 18px;
                height: 18px;
                border-radius: 4px;
                cursor: pointer;
                margin-left: 10px;
                transition: background-color 0.3s;
            }

            .bili-icon-btn svg {
                width: 14px;
                height: 14px;
                fill: currentColor;
            }

            .bili-subtitle-btn {
                color: white;
                background-color: #00a1d6;
            }

            .bili-subtitle-btn:hover {
                background-color: #00b5e5;
                color: white;
            }

            .bili-cover-btn {
                color: white;
                background-color: #fb7299;
            }

            .bili-cover-btn:hover {
                background-color: #fc8bab;
                color: white;
            }

            #subtitle-panel button:hover {
                opacity: 0.9;
            }

           .video-info-title-inner  {
           overflow: visible !important;
           display: inline-block !important;
            }
        `
    }, document.head);

    // B站字幕和封面查看器主体
    const bilibiliViewer = {
        window: "undefined" == typeof(unsafeWindow) ? window : unsafeWindow,
        cid: undefined,
        subtitle: undefined,
        pcid: undefined,
        buttonAdded: false,
        buttonCheckInterval: null,

        toast(msg, error) {
            if (error) console.error(msg, error);
            if (!this.toastDiv) {
                this.toastDiv = document.createElement('div');
                this.toastDiv.className = 'bilibili-player-video-toast-item';
            }
            const panel = elements.getAs('.bilibili-player-video-toast-top');
            if (!panel) return;
            clearTimeout(this.removeTimmer);
            this.toastDiv.innerText = msg + (error ? `:${error}` : '');
            panel.appendChild(this.toastDiv);
            this.removeTimmer = setTimeout(() => {
                panel.contains(this.toastDiv) && panel.removeChild(this.toastDiv);
            }, 3000);
        },

        getSubtitle(lan, name) {
            const item = this.getSubtitleInfo(lan, name);
            if (!item) throw('找不到所选语言字幕' + lan);

            return fetch(item.subtitle_url)
                .then(res => res.json());
        },

        getSubtitleInfo(lan, name) {
            return this.subtitle.subtitles.find(item => item.lan == lan || item.lan_doc == name);
        },

        getInfo(name) {
            return this.window[name]
            || this.window.__INITIAL_STATE__ && this.window.__INITIAL_STATE__[name]
            || this.window.__INITIAL_STATE__ && this.window.__INITIAL_STATE__.epInfo && this.window.__INITIAL_STATE__.epInfo[name]
            || this.window.__INITIAL_STATE__ && this.window.__INITIAL_STATE__.videoData && this.window.__INITIAL_STATE__.videoData[name];
        },

        getEpid() {
            return this.getInfo('id')
            || /ep(\d+)/.test(location.pathname) && +RegExp.$1
            || /ss\d+/.test(location.pathname);
        },

        getEpInfo() {
            const bvid = this.getInfo('bvid'),
                  epid = this.getEpid(),
                  cidMap = this.getInfo('cidMap'),
                  page = this?.window?.__INITIAL_STATE__?.p;
            let ep = cidMap?.[bvid];
            if (ep) {
                this.aid = ep.aid;
                this.bvid = ep.bvid;
                this.cid = ep.cids[page];
                return this.cid;
            }
            ep = this.window.__NEXT_DATA__?.props?.pageProps?.dehydratedState?.queries
            ?.find(query => query?.queryKey?.[0] == "pgc/view/web/season")
            ?.state?.data;
            ep = (ep?.seasonInfo ?? ep)?.mediaInfo?.episodes
            ?.find(ep => epid == true || ep.ep_id == epid);
            if (ep) {
                this.epid = ep.ep_id;
                this.cid = ep.cid;
                this.aid = ep.aid;
                this.bvid = ep.bvid;
                return this.cid;
            }
            ep = this.window.__INITIAL_STATE__?.epInfo;
            if (ep) {
                this.epid = ep.id;
                this.cid = ep.cid;
                this.aid = ep.aid;
                this.bvid = ep.bvid;
                return this.cid;
            }
            ep = this.window.playerRaw?.getManifest();
            if (ep) {
                this.epid = ep.episodeId;
                this.cid = ep.cid;
                this.aid = ep.aid;
                this.bvid = ep.bvid;
                return this.cid;
            }
        },

        async setupData() {
            if (this.subtitle && (this.pcid == this.getEpInfo())) return this.subtitle;

            if (location.pathname == '/blackboard/html5player.html') {
                let match = location.search.match(/cid=(\d+)/i);
                if (!match) return;
                this.window.cid = match[1];
                match = location.search.match(/aid=(\d+)/i);
                if (match) this.window.aid = match[1];
                match = location.search.match(/bvid=(\d+)/i);
                if (match) this.window.bvid = match[1];
            }

            this.pcid = this.getEpInfo();
            if ((!this.cid && !this.epid) || (!this.aid && !this.bvid)) return;

            this.player = this.window.player;
            this.subtitle = {count: 0, subtitles: []};

            return fetch(`https://api.bilibili.com/x/player${this.cid ? '/wbi' : ''}/v2?${this.cid ? `cid=${this.cid}` : `&ep_id=${this.epid}`}${this.aid ? `&aid=${this.aid}` : `&bvid=${this.bvid}`}`, {credentials: 'include'}).then(res => {
                if (res.status == 200) {
                    return res.json().then(ret => {
                        if (ret.code == -404) {
                            return fetch(`//api.bilibili.com/x/v2/dm/view?${this.aid ? `aid=${this.aid}` : `bvid=${this.bvid}`}&oid=${this.cid}&type=1`, {credentials: 'include'}).then(res => {
                                return res.json();
                            }).then(ret => {
                                if (ret.code != 0) throw('无法读取本视频APP字幕配置' + ret.message);
                                this.subtitle = ret.data && ret.data.subtitle || {subtitles: []};
                                this.subtitle.count = this.subtitle.subtitles.length;
                                this.subtitle.subtitles.forEach(item => (item.subtitle_url = item.subtitle_url.replace(/https?:\/\//, '//')));
                                return this.subtitle;
                            });
                        }
                        if (ret.code != 0 || !ret.data || !ret.data.subtitle) throw('读取视频字幕配置错误:' + ret.code + ret.message);
                        this.subtitle = ret.data.subtitle;
                        this.subtitle.count = this.subtitle.subtitles.length;
                        return this.subtitle;
                    });
                } else {
                    throw('请求字幕配置失败:' + res.statusText);
                }
            });
        },

        // 获取B站视频封面URL
        getBiliCoverUrl() {
            try {
                // 尝试从meta标签获取封面
                const metaImage = document.querySelector('meta[itemprop=image]');
                if (metaImage) {
                    return metaImage.content.replace(/@100w_100h_1c.png/g, '');
                }

                // 尝试其他方法获取封面
                const ogImage = document.querySelector('meta[property="og:image"]');
                if (ogImage) {
                    return ogImage.content.replace(/@100w_100h_1c.png/g, '');
                }

                // 尝试从视频页面获取封面
                const videoInfo = this.window.__INITIAL_STATE__?.videoData;
                if (videoInfo && videoInfo.pic) {
                    return videoInfo.pic;
                }

                return null;
            } catch (error) {
                console.error('获取B站封面出错:', error);
                return null;
            }
        },

        // 添加字幕和封面按钮到视频标题后面
        addButtons() {
            // 如果按钮已添加，则不重复添加
            if (elements.getAs('#subtitle-viewer-btn') && elements.getAs('#cover-viewer-btn')) {
                return;
            }

            // 查找视频标题元素
            const titleElement = elements.getAs('.video-title') || // 普通视频页面
                               elements.getAs('.media-title') || // 番剧页面
                               elements.getAs('.tit') || // 其他可能的标题类
                               elements.getAs('.bpx-player-video-title'); // 新版播放器标题

            if (!titleElement) {
                console.log('找不到视频标题元素');
                return;
            }

            // 创建封面按钮（放在前面）
            if (!elements.getAs('#cover-viewer-btn')) {
                const coverBtn = elements.createAs('a', {
                    id: 'cover-viewer-btn',
                    className: 'bili-icon-btn bili-cover-btn',
                    title: '查看视频封面',
                    innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/><path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/></svg>',
                    onmouseenter: (e) => this.showCoverPreview(e),
                    onmouseleave: () => this.hideCoverPreview(),
                    onclick: () => this.openCoverInNewTab()
                }, titleElement);
            }

            // 创建字幕按钮（放在后面）
            if (!elements.getAs('#subtitle-viewer-btn')) {
                const subtitleBtn = elements.createAs('a', {
                    id: 'subtitle-viewer-btn',
                    className: 'bili-icon-btn bili-subtitle-btn',
                    title: '获取视频字幕',
                    innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 12.4a1 1 0 0 0-.8-.4H2a2 2 0 0 1-2-2V2zm7.194 2.766a1.688 1.688 0 0 0-.227-.272 1.467 1.467 0 0 0-.469-.324l-.008-.004A1.785 1.785 0 0 0 5.734 4C4.776 4 4 4.746 4 5.667c0 .92.776 1.666 1.734 1.666.343 0 .662-.095.931-.26-.137.389-.39.804-.81 1.22a.405.405 0 0 0 .011.59c.173.16.447.155.614-.01 1.334-1.329 1.37-2.758.941-3.706a2.461 2.461 0 0 0-.227-.4zM11 7.073c-.136.389-.39.804-.81 1.22a.405.405 0 0 0 .012.59c.172.16.446.155.613-.01 1.334-1.329 1.37-2.758.942-3.706a2.466 2.466 0 0 0-.228-.4 1.686 1.686 0 0 0-.227-.273 1.466 1.466 0 0 0-.469-.324l-.008-.004A1.785 1.785 0 0 0 10.07 4c-.957 0-1.734.746-1.734 1.667 0 .92.777 1.666 1.734 1.666.343 0 .662-.095.931-.26z"/></svg>',
                    onclick: () => this.showSubtitleInPanel()
                }, titleElement);
            }

            this.buttonAdded = true;
            console.log('B站字幕和封面查看按钮已添加到标题后面');
        },

           // 在面板中显示字幕
         showSubtitleInPanel() {
    if (!this.subtitle || this.subtitle.count === 0) {
        this.toast('当前视频没有可用字幕');
        // 创建一个临时提示面板
        const tempPanel = elements.createAs("div", {
            style: `
                position: fixed;
                top: 12%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #3F7FEA;
                color: white;
                padding: 15px 20px;
                border-radius: 4px;
                font-size: 14px;
                z-index: 10000;
            `,
            textContent: '当前视频没有可用字幕'
        }, document.body);

        // 1秒后自动消失
        setTimeout(() => {
            if (document.body.contains(tempPanel)) {
                document.body.removeChild(tempPanel);
            }
        }, 1000);
        return;
    }

    // 优先选择中文字幕
    let selectedSubtitle = null;

    // 优先级：简体中文 > 繁体中文 > 其他中文 > 第一个可用字幕
    const chineseSimplified = this.subtitle.subtitles.find(sub =>
        sub.lan === 'zh-CN' ||
        sub.lan === 'zh-Hans' ||
        sub.lan_doc?.includes('中文（简体）') ||
        sub.lan_doc?.includes('中文(简体)') ||
        sub.lan_doc === '中文'
    );

    const chineseTraditional = this.subtitle.subtitles.find(sub =>
        sub.lan === 'zh-TW' ||
        sub.lan === 'zh-Hant' ||
        sub.lan_doc?.includes('中文（繁體）') ||
        sub.lan_doc?.includes('中文(繁體)') ||
        sub.lan_doc?.includes('中文（繁体）') ||
        sub.lan_doc?.includes('中文(繁体)')
    );

    const anyChinese = this.subtitle.subtitles.find(sub =>
        sub.lan?.toLowerCase().startsWith('zh') ||
        sub.lan_doc?.includes('中文')
    );

    selectedSubtitle = chineseSimplified || chineseTraditional || anyChinese || this.subtitle.subtitles[0];

    if (!selectedSubtitle) {
        this.toast('无法获取字幕信息');
        // 创建一个临时提示面板
        const tempPanel = elements.createAs("div", {
            style: `
                position: fixed;
                top: 12%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #3F7FEA;
                color: white;
                padding: 15px 20px;
                border-radius: 4px;
                font-size: 14px;
                z-index: 10000;
            `,
            textContent: '无法获取字幕信息'
        }, document.body);

        // 3秒后自动消失
        setTimeout(() => {
            if (document.body.contains(tempPanel)) {
                document.body.removeChild(tempPanel);
            }
        }, 3000);
        return;
    }

    // 更新标题显示字幕语言
    document.getElementById('subtitle-title').textContent = `视频字幕 (${selectedSubtitle.lan_doc || selectedSubtitle.lan})`;

    // 显示加载中
    subtitleContent.textContent = '正在加载字幕...';
    subtitlePanel.style.display = 'flex';

    this.getSubtitle(selectedSubtitle.lan)
        .then(data => {
            if (!data || !(data.body instanceof Array)) {
                throw '数据错误';
            }

            // 只提取字幕内容，不包含时间戳
            const formattedSubtitle = data.body.map(item => item.content).join('\r\n');

            // 显示字幕内容
            subtitleContent.textContent = formattedSubtitle;
        })
        .catch(e => {
            subtitleContent.textContent = `获取字幕失败: ${e}`;
            this.toast('获取字幕失败', e);

            // 3秒后自动关闭面板
            setTimeout(() => {
                subtitlePanel.style.display = 'none';
            }, 2000);
        });
      },

        // 格式化时间为 mm:ss.ms 格式
        formatTime(seconds) {
            const min = Math.floor(seconds / 60);
            const sec = Math.floor(seconds % 60);
            const ms = Math.floor((seconds % 1) * 100);
            return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
        },

        // 显示封面预览
        showCoverPreview(event) {
            const coverUrl = this.getBiliCoverUrl();
            if (coverUrl) {
                preview.src = coverUrl;

                // 获取按钮位置
                const rect = event.currentTarget.getBoundingClientRect();

                // 设置预览图片位置在按钮右下角
                preview.style.left = (rect.right + 10) + 'px';
                preview.style.top = rect.top + 'px';

                // 重置任何可能的宽高限制，让图片先以原始大小加载
                preview.style.width = 'auto';
                preview.style.height = 'auto';

                // 图片加载完成后检查大小
                preview.onload = () => {
                    const screenWidth = window.innerWidth * 0.6;
                    const screenHeight = window.innerHeight * 0.6;

                    // 如果图片尺寸超过屏幕60%，则按比例缩小
                    if (preview.naturalWidth > screenWidth || preview.naturalHeight > screenHeight) {
                        const widthRatio = screenWidth / preview.naturalWidth;
                        const heightRatio = screenHeight / preview.naturalHeight;
                        const ratio = Math.min(widthRatio, heightRatio);

                        preview.style.width = (preview.naturalWidth * ratio) + 'px';
                        preview.style.height = (preview.naturalHeight * ratio) + 'px';
                    } else {
                        // 使用原始大小
                        preview.style.width = preview.naturalWidth + 'px';
                        preview.style.height = preview.naturalHeight + 'px';
                    }

                    // 确保预览图片不超出视口
                    const previewRect = preview.getBoundingClientRect();

                    // 检查右边界
                    if (previewRect.right > window.innerWidth) {
                        preview.style.left = (rect.left - previewRect.width - 10) + 'px';
                    }

                    // 检查下边界
                    if (previewRect.bottom > window.innerHeight) {
                        preview.style.top = (window.innerHeight - previewRect.height - 10) + 'px';
                    }

                    preview.style.display = 'block';
                };
            } else {
                console.log('未找到封面图片');
            }
        },

        // 隐藏封面预览
        hideCoverPreview() {
            preview.style.display = 'none';
        },

        // 在新标签页打开封面
        openCoverInNewTab() {
            const coverUrl = this.getBiliCoverUrl();
            if (coverUrl) {
                window.open(coverUrl, '_blank');
            } else {
                this.toast('无法获取视频封面');
            }
        },

        // 重置状态，用于页面切换时
        reset() {
            this.buttonAdded = false;
            this.subtitle = null;
            this.pcid = null;

            // 清除定时检查
            if (this.buttonCheckInterval) {
                clearInterval(this.buttonCheckInterval);
                this.buttonCheckInterval = null;
            }
        },

        // 启动定时检查按钮是否存在
        startButtonCheck() {
            // 清除可能存在的旧定时器
            if (this.buttonCheckInterval) {
                clearInterval(this.buttonCheckInterval);
            }

            // 每2秒检查一次按钮是否存在
            this.buttonCheckInterval = setInterval(() => {
                if (!elements.getAs('#subtitle-viewer-btn') || !elements.getAs('#cover-viewer-btn')) {
                    console.log('按钮已消失，重新添加');
                    this.buttonAdded = false;
                    this.addButtons();
                }
            }, 2000);
        },

        init() {
            this.setupData().then(subtitle => {
                if (!subtitle) return;
                this.addButtons();
                this.startButtonCheck(); // 启动按钮检查
                console.log('B站字幕和封面查看器初始化成功');
            }).catch(e => {
                console.error('B站字幕和封面查看器初始化失败', e);
            });

            // 监听页面变化，处理SPA页面跳转
            let lastUrl = location.href;
            new MutationObserver((mutations, observer) => {
                // 检测URL变化，如果变化则重置状态
                if (lastUrl !== location.href) {
                    lastUrl = location.href;
                    this.reset();

                    // 在URL变化后重新初始化
                    setTimeout(() => {
                        this.setupData().then(subtitle => {
                            if (!subtitle) return;
                            this.addButtons();
                            this.startButtonCheck();
                        }).catch(e => {
                            console.error('B站字幕和封面查看器重新初始化失败', e);
                        });
                    }, 1000); // 延迟1秒，等待页面加载
                }

                // 监听DOM变化，在关键元素变化时重新添加按钮
                for (const mutation of mutations) {
                    if (!mutation.target) continue;
                    if (mutation.target.getAttribute('stage') == 1 ||
                        mutation.target.classList.contains('bpx-player-subtitle-wrap') ||
                        mutation.target.classList.contains('tit') ||
                        mutation.target.classList.contains('bpx-player-ctrl-subtitle-bilingual') ||
                        mutation.target.classList.contains('squirtle-quality-wrap') ||
                        mutation.target.classList.contains('video-title') ||
                        mutation.target.classList.contains('media-title')) {

                        // 如果按钮已添加，则不重复初始化
                        if (!elements.getAs('#subtitle-viewer-btn') || !elements.getAs('#cover-viewer-btn')) {
                            this.setupData().then(subtitle => {
                                if (!subtitle) return;
                                this.addButtons();
                            });
                        }
                        break;
                    }
                }
            }).observe(document.body, {
                childList: true,
                subtree: true,
            });
        }
    };

    // 初始化
    bilibiliViewer.init();
})();