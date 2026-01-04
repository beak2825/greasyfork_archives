// ==UserScript==
// @name         YouTube B站弹幕播放器
// @namespace    https://github.com/ZBpine/bilibili-danmaku-download/
// @version      1.6.2
// @description  在 YouTube 视频上显示 B站视频弹幕 [ 油管 | Bilibili | 弹幕]
// @author       ZBpine
// @match        https://www.youtube.com/*
// @match        https://www.bilibili.com/*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      api.bilibili.com
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/536159/YouTube%20B%E7%AB%99%E5%BC%B9%E5%B9%95%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/536159/YouTube%20B%E7%AB%99%E5%BC%B9%E5%B9%95%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

(async () => {
    'use strict';
    if (window.top !== window.self) {
        console.warn('不是顶层窗口，跳过弹幕播放器');
        // console.log(window.top, window.self);
        return;
    }
    class DanmakuControlPanel {
        constructor(dmPlayer, BiliDataManager) {
            this.panelId = 'dmplayer-ctl-panel';
            this.isBilibili = location.hostname.includes('bilibili.com');
            this.dmPlayer = dmPlayer;
            this.BiliDataManager = class extends BiliDataManager {
                constructor() {
                    super();
                    this.alignData = [];
                    this.dmList = [];
                }
                getDanmakuData() {
                    this.applyAlignment();
                    return this.dmList;
                }
                applyAlignment() {
                    const danmakus = this.data.danmakuData;
                    if (!danmakus?.length) return;
                    const alignments = this.alignData.slice().sort((a, b) => (a.source?.start || 0) - (b.source?.start || 0));
                    const newDanmakus = [];

                    let lastSEnd = 0;
                    let lastTEnd = 0;
                    for (let i = 0; i <= alignments.length; i++) {
                        const align = alignments[i];
                        if (!align) continue;
                        const { source, target, mode, comment } = align;

                        const sStart = source.start;
                        const sEnd = source.end;
                        const tStart = target.start;
                        const tEnd = target.end;
                        const sDuration = sEnd - sStart;
                        const tDuration = tEnd - tStart;

                        for (const d of danmakus) {
                            const time = d.progress;
                            if (time >= lastSEnd && time < sStart) {
                                const newTime = time - lastSEnd + lastTEnd;
                                newDanmakus.push({ ...d, progress: Math.round(newTime) });
                            } else if (time >= sStart && time < sEnd) {
                                let newTime = null;
                                if (mode === 'map') {
                                    const ratio = (time - sStart) / sDuration;
                                    newTime = tStart + ratio * tDuration;
                                } else {
                                    newTime = time - sStart + tStart;
                                    if (newTime < tStart || newTime >= tEnd) continue;
                                }
                                newDanmakus.push({ ...d, progress: Math.round(newTime) });
                            }
                        }
                        if (comment) {
                            const commentId = Date.now() * 1000 + i
                            newDanmakus.push({
                                content: `${comment}`,
                                progress: Math.round(tStart),
                                type: 'mark',
                                duration: tEnd - tStart,
                                fontsize: 32,
                                color: 0xffffff,
                                ctime: Math.floor(Date.now() / 1000),
                                pool: 0,
                                midHash: 'system',
                                id: commentId,
                                idStr: String(commentId),
                                weight: 10
                            });
                        }
                        lastSEnd = sEnd;
                        lastTEnd = tEnd;
                    }
                    for (const d of danmakus) {
                        const time = d.progress;
                        if (time >= lastSEnd) {
                            const newTime = time - lastSEnd + lastTEnd;
                            newDanmakus.push({ ...d, progress: Math.round(newTime) });
                        }
                    }
                    this.dmList = newDanmakus;
                }
            };
            this.dmStore = {
                key: 'dm-player',
                GMCache: GM_getValue('cache', {}),
                getConfig() {
                    return JSON.parse(localStorage.getItem(this.key) || '{}');
                },
                setConfig(obj) {
                    localStorage.setItem(this.key, JSON.stringify(obj));
                },
                get(key, def) {
                    const cfg = this.getConfig();
                    return key.split('.').reduce((o, k) => (o || {})[k], cfg) ?? def;
                },
                set(key, value) {
                    const cfg = this.getConfig();
                    const keys = key.split('.');
                    let obj = cfg;
                    for (let i = 0; i < keys.length - 1; i++) {
                        obj[keys[i]] = obj[keys[i]] || {};
                        obj = obj[keys[i]];
                    }
                    obj[keys.at(-1)] = value;
                    this.setConfig(cfg);
                },
                cache: {
                    get: (id) => {
                        return this.dmStore.GMCache?.[id];
                    },
                    set: (id, data) => {
                        this.dmStore.GMCache[id] = data;
                        GM_setValue('cache', this.dmStore.GMCache);
                    },
                    remove: (id) => {
                        if (this.dmStore.GMCache) delete this.dmStore.GMCache[id];
                        GM_setValue('cache', this.dmStore.GMCache);
                    },
                    list: () => {
                        return Object.entries(this.dmStore.GMCache);
                    },
                    clear: () => {
                        this.dmStore.GMCache = {};
                        GM_setValue('cache', this.dmStore.GMCache);
                    }
                },
                binded: {
                    get: (id) => {
                        return this.dmStore.getConfig().binded?.[id];
                    },
                    set: (id, data) => {
                        const cfg = this.dmStore.getConfig();
                        cfg.binded = cfg.binded || {};
                        cfg.binded[id] = data;
                        this.dmStore.setConfig(cfg);
                    },
                    remove: (id) => {
                        const cfg = this.dmStore.getConfig();
                        if (cfg.binded) delete cfg.binded[id];
                        this.dmStore.setConfig(cfg);
                    },
                    list: () => {
                        const binded = this.dmStore.getConfig().binded || {};
                        return Object.entries(binded);
                    },
                    clear: () => {
                        const cfg = this.dmStore.getConfig();
                        delete cfg.binded;
                        this.dmStore.setConfig(cfg);
                    }
                }
            };
            this.dmPlayer.domAdapter.injectStyle('dmplayer-danmaku-mark', `
                @keyframes dmplayer-animate-mark {
                    0%   { opacity: 0; }
                    5%   { opacity: 0.6; }
                    95%  { opacity: 0.4; }
                    100% { opacity: 0; }
                }
                .dmplayer-danmaku-mark {
                    left: 10px;
                    top: 10px;
                    animation-name: dmplayer-animate-mark;
                    animation-timing-function: cubic-bezier(0,1,1,0) !important;
                }`
            );
            this.autoBind = this.dmStore.get('autoBind', true);
            this.videoId = null;
            this.data = {};
        }
        bindHotkey() {
            if (this.hotkeyBound) return;
            this.hotkeyBound = true;

            document.addEventListener('keydown', (e) => {
                const target = e.target;
                const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
                if (isTyping) return;

                const key = e.key.toLowerCase();
                if (key === 'd') {
                    if (this.toggleBtn) {
                        this.toggleBtn.click();
                    }
                } else if (key === 's') {
                    if (this.searchBtn) {
                        this.searchBtn.click();
                    }
                }
            });
        }
        getCurrentInfo() {
            let id, url, title;
            if (this.isBilibili) {
                const idObj = this.BiliDataManager.parseUrl(location.href);
                id = idObj.id;
                if (idObj.url) url = idObj.url;
                else {
                    url = 'https://www.bilibili.com/'
                    if (id.startsWith('BV')) url += 'video/' + id;
                    else if (id.startsWith('ep')) url += 'bangumi/play/' + id;
                }
                title = document.title.replace(/[-_–—|]+.*?(bilibili|哔哩哔哩).*/gi, '').trim();
            } else {
                id = new URLSearchParams(location.search).get('v');
                url = 'https://www.youtube.com/watch?v=' + id;
                title = document.title.replace(' - YouTube', '').trim();
            }
            return { id, url, title };
        }
        observeVideoChange() {
            let href = null;
            const updateVideoId = () => {
                if (location.href === href) return;
                href = location.href;
                const newId = this.getCurrentInfo().id;
                if (newId && newId !== this.videoId) {
                    console.log(`[🎬 检测到视频变化] ${this.videoId} → ${newId}`);
                    this.dmPlayer.clear();
                    setTimeout(() => this.update(newId), 100);
                }
            }
            const observer = new MutationObserver(updateVideoId);
            observer.observe(document.body, { childList: true, subtree: true });
            updateVideoId();
        }
        showTip(message, { duration = 3000 } = {}) {
            const dark = !this.isBilibili;
            const tip = document.createElement('div');
            tip.textContent = message;
            Object.assign(tip.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                padding: '10px 14px',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                fontSize: '14px',
                zIndex: 9999,
                whiteSpace: 'pre-line',
                opacity: '0',
                transition: 'opacity 0.3s ease',
                background: dark ? 'rgba(50, 50, 50, 0.9)' : '#f0f0f0',
                color: dark ? '#fff' : '#000',
                border: dark ? '1px solid #444' : '1px solid #ccc'
            });
            document.body.appendChild(tip);
            requestAnimationFrame(() => {
                tip.style.opacity = '1';
            });
            setTimeout(() => {
                tip.style.opacity = '0';
                tip.addEventListener('transitionend', () => tip.remove());
            }, duration);
            console.log('[💡tip]', message);
        }
        logError(desc, err) {
            this.showTip(desc + '：' + err.message);
            this.dmPlayer.logTagError(desc, err);
        }
        init() {
            if (document.getElementById(this.panelId)) return;
            this.dmPlayer.setOptions(this.dmStore.get('settings', {}));

            const panel = document.createElement('div');
            panel.id = this.panelId;
            Object.assign(panel.style, {
                position: 'fixed',
                left: '0px',
                bottom: '40px',
                transform: 'translateX(calc(-100% + 20px))',
                zIndex: 10000,
                transition: 'transform 0.3s ease-in-out, opacity 0.3s ease',
                opacity: '0.2',
                background: '#333',
                borderRadius: '0px 20px 20px 0px',
                padding: '10px',
                paddingRight: '20px',
                display: 'grid',
                gridAutoFlow: 'column',
                gridAutoColumns: '36px',
                gridTemplateRows: '36px 36px',
                gap: '6px'
            });
            if (this.isBilibili) {
                panel.style.background = '#ccc';
            }
            panel.addEventListener('mouseenter', () => {
                panel.style.transform = 'translateX(0)';
                panel.style.opacity = '1';
            });
            panel.addEventListener('mouseleave', () => {
                panel.style.transform = 'translateX(calc(-100% + 20px))';
                panel.style.opacity = '0.2';
            });

            const createPanelButton = (label, title, onclick) => {
                const btn = document.createElement('button');
                btn.textContent = label;
                btn.title = title;
                Object.assign(btn.style, {
                    padding: '6px',
                    background: this.isBilibili ? '#eee' : '#555',
                    color: this.isBilibili ? 'black' : 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    width: '100%'
                });
                btn.onclick = onclick;
                panel.appendChild(btn);
                return btn;
            }

            this.searchBtn = createPanelButton('🔍', '搜索弹幕', () => this.showSearchPanel());
            this.bindBtn = createPanelButton('🔗', '绑定视频', () => this.bindVideoID());
            this.loadBtn = createPanelButton('📂', '载入文件', () => this.fileInput.click());
            this.saveBtn = createPanelButton('💾', '保存弹幕', () => this.cacheData());
            this.toggleBtn = createPanelButton('✅', '开关弹幕', () => {
                this.dmPlayer.toggle();
                this.toggleBtn.textContent = this.dmPlayer.showing ? '✅' : '🚫';
            });
            this.configBtn = createPanelButton('⚙️', '打开设置', () => this.showConfigPanel());

            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json,.xml';
            fileInput.style.display = 'none';
            fileInput.id = 'dm-input-file';
            fileInput.onchange = (e) => {
                const file = e.target.files[0];
                fileInput.value = '';
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const text = e.target.result;
                        const data = new this.BiliDataManager();
                        let load = {};
                        if (text.startsWith('<')) {
                            // XML 文件
                            load.danmakuData = this.BiliDataManager.parseDanmakuXml(text);
                        } else {
                            const json = JSON.parse(text);
                            if (Array.isArray(json)) {
                                // 纯弹幕数组
                                load.danmakuData = json;
                            } else if (json.danmakuData) {
                                // 完整结构
                                Object.assign(load, json);
                            } else {
                                throw new Error('不支持的 JSON 格式');
                            }
                        }
                        if (!load.danmakuData?.length) throw new Error('弹幕数据为空');
                        const current = this.getCurrentInfo();
                        load.id ??= current.id;
                        load.url ??= current.url;
                        load.title ??= current.title;
                        data.source = 'local';
                        data.setData(load);
                        this.loadDanmakuSuccess(data);
                    } catch (err) {
                        this.logError('❌ 加载失败', err);
                    }
                };
                reader.readAsText(file);
            };
            this.fileInput = fileInput;
            document.body.appendChild(fileInput);

            document.body.appendChild(panel);
            this.bindHotkey();
            this.dmPlayer.init();
        }
        update(videoId) {
            if (!videoId) return;
            this.videoId = videoId;
            this.dmPlayer.update();
            this.dmPlayer.logTag(`当前视频：${videoId}`);

            this.bindVideoID(false);
            const data = this.data[videoId];
            if (data?.dmList?.length) {
                this.dmPlayer.load(data.dmList);
                return;
            }
            const bindInfo = this.dmStore.binded.get(videoId);
            if (bindInfo) this.loadData(bindInfo, true);
        }
        loadDanmakuSuccess(data) {
            this.data[this.videoId] = data;
            this.dmPlayer.load(data.getDanmakuData());

            const info = data.info;
            const title = info?.title || '（未知标题）';
            const time = info?.fetchtime ?
                new Date(info.fetchtime * 1000).toLocaleString('zh-CN', { hour12: false }) : '（未知）';
            this.showTip(`🎉 成功载入${data.source}数据：\n🎬 ${title}\n💬 共 ${data.dmCount} 条弹幕\n🕒 抓取时间：${time}`);
        }
        async loadData({ source, target }, binded = false) {
            try {
                const id = source.id;
                if (!id) return;
                const data = new this.BiliDataManager();
                const excuteBind = () => {
                    if (binded) {
                        data.binded = true;
                        this.bindVideoID(false);
                    } else {
                        if (this.autoBind) this.bindVideoID(true, true);
                    }
                };
                const from = source.from;
                data.source = from;
                if (target) Object.assign(data, target);
                switch (from) {
                    case 'cache':
                        const cache = await this.dmStore.cache.get(id);
                        if (cache?.data) {
                            data.setData(cache.data);
                            this.loadDanmakuSuccess(data);
                            excuteBind();
                        } else {
                            this.showTip('⚠ 缓存数据不存在');
                        }
                        break;
                    case 'server':
                        const server = this.dmStore.get('server');
                        if (server) {
                            const idObj = this.BiliDataManager.parseUrl(id);
                            delete idObj.id;
                            const params = new URLSearchParams(idObj);
                            try {
                                const res = await fetch(`${server}/video?${params.toString()}`);
                                const json = await res.json();
                                data.setData(json);
                                this.loadDanmakuSuccess(data);
                                excuteBind();
                            } catch (err) {
                                this.logError('❌ 请检查服务器', err);
                            }
                        }
                        break;
                    default:
                        await data.getData(id);
                        await data.getDanmakuXml();
                        this.loadDanmakuSuccess(data);
                        excuteBind();
                        const newDm = await data.getDanmakuPb();
                        if (newDm > 0) this.loadDanmakuSuccess(data);
                        break;
                }
            } catch (err) {
                this.logError('❌ 弹幕数据加载失败', err);
            }
        }
        cacheData() {
            const data = this.data[this.videoId];
            if (!data) {
                this.showTip('⚠ 未有弹幕数据');
                return;
            }
            const id = data.info?.id;
            if (!id) {
                this.showTip('⚠ 未知弹幕数据');
                return;
            }
            this.dmStore.cache.set(id, { info: data.info, data: data.data });
            data.source = 'cache';
            this.bindVideoID(true, true);
            this.showTip('✅ 弹幕数据已缓存');
        }
        bindVideoID(toggle = true, force = false) {
            const data = this.data[this.videoId];
            if (toggle) {
                if (!data) {
                    this.showTip('⚠ 未有弹幕数据');
                    return;
                }
                data.binded = !data.binded;
                if (force) data.binded = true;
                if (data.binded) {
                    try {
                        const info = data.info;
                        const current = this.getCurrentInfo();
                        const bindData = {
                            source: {
                                id: info.id,
                                url: info.url,
                                title: info.title + (info.subtitle ? ` ${info.subtitle}` : ''),
                                from: data.source
                            },
                            target: {
                                id: current.id,
                                url: current.url,
                                title: current.title,
                                alignData: data.alignData
                            }
                        };
                        this.dmStore.binded.set(this.videoId, bindData);
                    } catch (err) {
                        this.logError('❌ 绑定视频失败', err);
                    }
                } else {
                    this.dmStore.binded.remove(this.videoId);
                }
            }
            if (data?.binded) {
                this.bindBtn.textContent = '🗑️';
                this.bindBtn.title = '取消绑定';
            } else {
                this.bindBtn.textContent = '🔗';
                this.bindBtn.title = '绑定视频';
            }
        }
        showSearchPanel() {
            const { panel, overlay } = this.showPanel();

            const initialKeyword = this.getCurrentInfo().title;
            const titleEl = document.createElement('div');
            titleEl.textContent = '选择一个视频以载入弹幕：';
            titleEl.style.fontWeight = 'bold';
            titleEl.style.fontSize = '16px';

            const input = document.createElement('input');
            Object.assign(input.style, {
                padding: '6px 10px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                width: '100%',
                boxSizing: 'border-box'
            });
            input.type = 'text';
            input.value = initialKeyword;

            const resultsBox = document.createElement('div');
            resultsBox.style.display = 'flex';
            resultsBox.style.flexDirection = 'column';
            resultsBox.style.gap = '6px';

            const formatCount = (n) => {
                n = parseInt(n || '0');
                if (isNaN(n)) return '0';
                if (n >= 1e8) return (n / 1e8).toFixed(1) + '亿';
                if (n >= 1e4) return (n / 1e4).toFixed(1) + '万';
                return n.toString();
            };
            const normalizeTimeStr = (duration) => {
                if (typeof duration === 'number' && !isNaN(duration)) {
                    // duration 是秒数，直接格式化为 h:mm:ss
                    const totalSeconds = duration;
                    const hours = Math.floor(totalSeconds / 3600);
                    const minutes = Math.floor((totalSeconds % 3600) / 60);
                    const seconds = totalSeconds % 60;
                    if (hours > 0) {
                        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                    }
                    else {
                        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                    }
                }
                if (typeof duration === 'string' && /^\d+:\d{1,2}$/.test(duration)) {
                    const [min, sec] = duration.split(':').map(Number);
                    if (isNaN(min) || isNaN(sec)) return duration; // 原样返回不合法值
                    if (min > 99) {
                        const hours = Math.floor(min / 60);
                        const minutes = min % 60;
                        return `${hours}:${String(minutes).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
                    } else {
                        return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
                    }
                }
                return duration; // 不合法或未知格式，原样返回
            };
            const similar = (a, b) => {
                const m = a.length;
                const n = b.length;
                const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
                for (let i = 1; i <= m; i++) {
                    for (let j = 1; j <= n; j++) {
                        if (a[i - 1] === b[j - 1]) {
                            dp[i][j] = dp[i - 1][j - 1] + 1;
                        } else {
                            dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                        }
                    }
                }
                const lcs = dp[m][n];
                return (2 * lcs) / (m + n);
            };
            const searchingLabel = document.createElement('div');
            searchingLabel.textContent = '🔍 搜索中...';
            const renderResults = (keyword) => {
                if (keyword.startsWith('url=')) {
                    const { id } = this.BiliDataManager.parseUrl(keyword.substring(4));
                    if (id) {
                        this.loadData({ source: { id, from: 'bilibili' } });
                        overlay.remove();
                    }
                    else {
                        resultsBox.textContent = '❌ 无效的链接';
                    }
                    return;
                }
                resultsBox.textContent = '';
                resultsBox.appendChild(searchingLabel);

                const renderGroup = (titleText, groupList, source = 'bilibili') => {
                    if (searchingLabel.isConnected) searchingLabel.remove();
                    if (groupList.length === 0) return;

                    const titleRow = document.createElement('div');
                    titleRow.textContent = titleText;
                    Object.assign(titleRow.style, {
                        fontWeight: 'bold',
                        marginTop: '10px',
                        marginBottom: '4px',
                        borderBottom: '1px solid #ccc',
                        paddingBottom: '4px'
                    });
                    resultsBox.appendChild(titleRow);

                    groupList.forEach(item => {
                        const row = document.createElement('div');
                        Object.assign(row.style, {
                            padding: '8px 10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            background: '#f8f8f8',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px'
                        });
                        row.addEventListener('mouseenter', () => row.style.background = '#e0e0e0');
                        row.addEventListener('mouseleave', () => row.style.background = '#f8f8f8');

                        const titleLine = document.createElement('div');
                        titleLine.textContent = `📺 ${item.title.replace(/<[^>]+>/g, '')}`
                        titleLine.style.fontWeight = '500';

                        const infoLine = document.createElement('div');
                        Object.assign(infoLine.style, {
                            display: 'flex',
                            gap: '12px',
                            fontSize: '12px',
                            color: '#666',
                            flexWrap: 'wrap'
                        });
                        const author = document.createElement('span');
                        author.textContent = `👤 ${item.author || 'UP未知'}`;
                        const play = document.createElement('span');
                        play.textContent = `👁 ${formatCount(item.play)}`;
                        const danmu = document.createElement('span');
                        danmu.textContent = `💬 ${formatCount(item.video_review)}`;
                        const duration = document.createElement('span');
                        if (item.duration) {
                            duration.textContent = `🕒 ${normalizeTimeStr(item.duration)}`;
                        }
                        const link = document.createElement('a');
                        link.href = item.url;
                        link.textContent = '🔗 打开';
                        link.target = '_blank';
                        Object.assign(link.style, {
                            fontSize: '12px',
                            color: '#1a73e8',
                            textDecoration: 'none'
                        });
                        link.addEventListener('click', e => e.stopPropagation());

                        infoLine.append(author, play, danmu, duration, link);

                        row.onclick = () => {
                            overlay.remove();
                            this.loadData({ source: { id: item.id, from: source } });
                        };
                        row.appendChild(titleLine);
                        row.appendChild(infoLine);
                        resultsBox.appendChild(row);
                    });
                };

                try {
                    let asyncFinish = 0;
                    let asyncTotal = 2;

                    // ➤ 缓存
                    const cacheList = [];
                    this.dmStore.cache.list().forEach(([_, data]) => {
                        const info = data?.info;
                        if (!info?.title) return;
                        const title = info.title + (info.subtitle ? ` ${info.subtitle}` : '');
                        const similarity = similar(title, keyword);
                        if (similarity > 0.3) {
                            cacheList.push({
                                similarity,
                                id: info.id,
                                title,
                                author: info.owner?.name,
                                play: info.stat?.view,
                                video_review: info.stat?.danmaku,
                                duration: info.duration,
                                url: info.url
                            });
                        }
                    });
                    cacheList.sort((a, b) => b.similarity - a.similarity);
                    if (cacheList.length) renderGroup('📦 本地缓存', cacheList, 'cache');

                    // ➤ 服务器
                    const server = this.dmStore.get('server');
                    if (server) {
                        try {
                            fetch(`${server}/search?keyword=${encodeURIComponent(keyword)}&type=video`)
                                .then(res => res.json()).then(list => {
                                    list.forEach(item => {
                                        item.id = item.bvid;
                                        item.url = 'https://www.bilibili.com/video/' + item.bvid;
                                    });
                                    asyncFinish++;
                                    if (list.length) renderGroup('🌐 服务器数据：', list, 'server');
                                    else {
                                        if (asyncFinish === asyncTotal) {
                                            resultsBox.textContent = '❌ 没有找到相关视频'
                                        }
                                    }
                                });
                        } catch (e) {
                            this.showTip('⚠ 请检查服务器是否正确');
                            console.warn('❌ 远程搜索失败:', e);
                        }
                    } else {
                        asyncTotal--;
                    }

                    // ➤ B站
                    this.BiliDataManager.api.searchVideo(keyword).then(list => {
                        list.forEach(item => {
                            item.id = item.bvid;
                            item.url = 'https://www.bilibili.com/video/' + item.bvid;
                        });
                        asyncFinish++;
                        if (list.length) renderGroup('📺 B站视频：', list, 'bilibili');
                        else {
                            if (asyncFinish === asyncTotal) {
                                resultsBox.textContent = '❌ 没有找到相关视频'
                            }
                        }
                    });

                } catch (e) {
                    resultsBox.textContent = `❌ 搜索失败：${e.message}`;
                }
            };
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const kw = input.value.trim();
                    if (kw) renderResults(kw);
                }
            });
            panel.append(titleEl, input, resultsBox);
            renderResults(initialKeyword);
        }
        showConfigPanel() {
            const { panel, overlay } = this.showPanel();

            const title = document.createElement('div');
            title.textContent = '⚙️ 设置';
            title.style.fontSize = '18px';
            title.style.fontWeight = 'bold';
            panel.appendChild(title);
            // 标签按钮容器
            const tabButtons = document.createElement('div');
            Object.assign(tabButtons.style, {
                display: 'flex',
                gap: '6px',
                borderBottom: '1px solid #ccc',
                margin: '10px 0'
            });
            panel.appendChild(tabButtons);
            // 页面内容容器
            const tabContent = document.createElement('div');
            tabContent.style.marginBottom = '20px';
            panel.appendChild(tabContent);
            // 标签切换函数
            const tabPages = {};
            const switchTab = (tabName) => {
                for (const [name, page] of Object.entries(tabPages)) {
                    page.style.display = (name === tabName) ? 'flex' : 'none';
                }
                for (const btn of tabButtons.children) {
                    btn.style.fontWeight = (btn.dataset.tab === tabName) ? 'bold' : 'normal';
                    btn.style.borderBottom = (btn.dataset.tab === tabName) ? '2px solid #0077cc' : 'none';
                }
            };
            const createTab = (name, labelText, createContent) => {
                const btn = document.createElement('button');
                btn.textContent = labelText;
                btn.dataset.tab = name;
                Object.assign(btn.style, {
                    background: 'none',
                    border: 'none',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '14px'
                });
                btn.onclick = () => switchTab(name);
                tabButtons.appendChild(btn);

                const page = document.createElement('div');
                page.style.display = 'none';
                page.style.flexDirection = 'column';
                page.style.gap = '6px';
                tabPages[name] = page;
                tabContent.appendChild(page);
                createContent(page);
                return page;
            };

            const createLabeledButtonRow = (labelText, buttonObj) => {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.justifyContent = 'space-between';
                row.style.alignItems = 'center';

                const label = document.createElement('div');
                label.textContent = labelText;
                label.style.fontWeight = 'bold';
                label.style.fontSize = '16px'
                label.style.margin = '10px 0'
                row.appendChild(label);

                if (!buttonObj) return row
                const button = document.createElement('button');
                Object.assign(button, buttonObj);
                Object.assign(button.style, {
                    width: '130px',
                    height: '28px',
                    fontSize: '14px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: '#f0f0f0',
                    cursor: 'pointer',
                    flexShrink: '0'
                });
                row.appendChild(button);
                return row;
            };
            const createSelect = (list, getName = n => n) => {
                const select = document.createElement('select');
                list.forEach(n => {
                    const option = document.createElement('option');
                    option.value = String(n);
                    option.textContent = String(getName(n));
                    select.appendChild(option);
                })
                return select;
            };

            createTab('display', '📺 弹幕显示', (page) => {
                const createContralRow = (labelText, key, options, desc) => {
                    const keyPath = `settings.${key}`;
                    const wrapper = document.createElement('div');
                    Object.assign(wrapper.style, {
                        display: 'flex',
                        height: '36px',
                        alignItems: 'center',
                        flexDirection: 'row',
                        gap: '18px'
                    });
                    const controlRow = document.createElement('div');
                    Object.assign(controlRow.style, {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    });
                    const label = document.createElement('div');
                    label.textContent = labelText;
                    Object.assign(label.style, {
                        fontWeight: 'bold',
                        flexShrink: '0'
                    });
                    wrapper.append(label);
                    const input = document.createElement('input');
                    Object.assign(input, options);
                    if (options.type === 'checkbox') {
                        input.checked = this.dmStore.get(keyPath, this.dmPlayer.options[key].value);
                        Object.assign(input.style, {
                            width: '20px',
                            height: '20px',
                            cursor: 'pointer'
                        });
                        input.onchange = () => {
                            const val = input.checked;
                            this.dmStore.set(keyPath, val);
                            this.dmPlayer.setOptions(val, key);
                            this.showTip(`✅ 已保存 ${labelText}：${val ? '开启' : '关闭'}`);
                        };
                        controlRow.append(input);
                    } else if (options.type === 'number') {
                        input.value = this.dmStore.get(keyPath, this.dmPlayer.options[key].value);
                        Object.assign(input.style, {
                            width: '60px',
                            height: '20px',
                            padding: '0',
                            textAlign: 'center',
                            fontSize: '14px'
                        });
                        const saveBtn = document.createElement('button');
                        saveBtn.textContent = '💾 保存';
                        Object.assign(saveBtn.style, {
                            width: '80px',
                            height: '28px',
                            fontSize: '14px',
                            cursor: 'pointer'
                        });
                        saveBtn.onclick = () => {
                            const val = Number.isInteger(Number(options.step)) ? parseInt(input.value) : parseFloat(input.value);
                            if (!isNaN(val) && val >= options.min && val <= options.max) {
                                this.dmStore.set(keyPath, val);
                                this.dmPlayer.setOptions(val, key);
                                this.showTip(`✅ 已保存 ${labelText}：${val}`);
                            } else {
                                this.showTip('❌ 输入不合法');
                            }
                        };
                        controlRow.append(input, saveBtn);
                    }
                    wrapper.append(controlRow);
                    if (desc) {
                        const descEl = document.createElement('div');
                        descEl.textContent = desc;
                        Object.assign(descEl.style, {
                            fontSize: '12px',
                            color: '#666',
                            marginLeft: 'auto'
                        });
                        wrapper.append(descEl);
                    }
                    return wrapper;
                };
                page.appendChild(createLabeledButtonRow('📺 弹幕显示设置', {
                    textContent: '👁️ 预览',
                    onmousedown: () => overlay.style.opacity = '0',
                    onmouseup: () => overlay.style.opacity = '1',
                    onmouseleave: () => overlay.style.opacity = '1'
                }));
                page.appendChild(createContralRow(
                    '🌫️ 不透明度',
                    'opacity',
                    { type: 'number', min: 0.1, max: 1.0, step: 0.1 },
                    '设置弹幕透明度（0.1 ~ 1.0）越小越透明'
                ));
                page.appendChild(createContralRow(
                    '📐 显示区域',
                    'displayArea',
                    { type: 'number', min: 0.1, max: 1.0, step: 0.1 },
                    '允许弹幕占屏幕高度范围，1.0 全屏'
                ));
                page.appendChild(createContralRow(
                    '🚀 弹幕速度',
                    'speed',
                    { type: 'number', min: 3, max: 9, step: 1 },
                    '影响弹幕持续时间以及滚动弹幕的速度'
                ));
                page.appendChild(createContralRow(
                    '⏩ 同步倍速',
                    'syncRate',
                    { type: 'checkbox' },
                    '弹幕速度同步视频播放倍速'
                ));
                page.appendChild(createContralRow(
                    '🔁 合并重复',
                    'mergeRepeats',
                    { type: 'checkbox' },
                    '是否合并内容相同且时间接近的弹幕'
                ));
                page.appendChild(createContralRow(
                    '🔀 允许重叠',
                    'overlap',
                    { type: 'checkbox' },
                    '开启则允许弹幕重叠，否则丢弃会重叠的弹幕'
                ));

                // --- 弹幕阴影设置模块 ---
                let shadowConfig = this.dmPlayer.options?.shadowEffect?.value ||
                    [{ type: 0, offset: 1, radius: 1, repeat: 1 }];
                const shadowHeader = createLabeledButtonRow('🌑 弹幕阴影设置', {
                    textContent: '💾 保存', onclick: () => {
                        this.dmStore.set('settings.shadowEffect', shadowConfig);
                        this.dmPlayer.setOptions(shadowConfig, 'shadowEffect');
                    }
                });
                page.appendChild(shadowHeader);
                // 预设选择
                const presetSelect = createSelect(['重墨', '描边', '45°投影', '自定义']);
                Object.assign(presetSelect.style, {
                    fontSize: '14px',
                    padding: '4px 8px'
                });
                page.appendChild(presetSelect);
                // 默认配置项
                const presets = {
                    '重墨': [{ type: 0, offset: 1, radius: 1, repeat: 1 }],
                    '描边': [{ type: 1, offset: 0, radius: 1, repeat: 3 }],
                    '45°投影': [
                        { type: 1, offset: 0, radius: 1, repeat: 1 },
                        { type: 2, offset: 1, radius: 2, repeat: 1 }
                    ]
                };
                const formArea = document.createElement('div');
                page.appendChild(formArea);

                const addBtn = document.createElement('button');
                addBtn.textContent = '➕ 添加阴影项';
                Object.assign(addBtn.style, {
                    width: '120px',
                    padding: '4px',
                    cursor: 'pointer'
                });
                page.appendChild(addBtn);

                const label = (text) => {
                    const span = document.createElement('span');
                    span.textContent = text;
                    span.style.fontWeight = 'bold';
                    return span;
                };
                const renderConfigItems = (configList) => {
                    formArea.replaceChildren();
                    configList.forEach((cfg, index) => {
                        const row = document.createElement('div');
                        Object.assign(row.style, {
                            display: 'flex',
                            gap: '6px',
                            alignItems: 'center',
                            marginBottom: '4px',
                            border: '1px solid #ccc'
                        });
                        const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

                        const typeSel = createSelect(range(0, 2), n => ['重墨', '描边', '45°投影'][n]);
                        typeSel.value = String(cfg.type);
                        typeSel.onchange = () => configList[index].type = parseInt(typeSel.value);

                        const offsetSel = createSelect(range(-1, 10), n => n === -1 ? '递增' : `${n}px`);
                        offsetSel.value = String(cfg.offset);
                        offsetSel.onchange = () => configList[index].offset = parseInt(offsetSel.value);

                        const radiusSel = createSelect(range(-1, 10), n => n === -1 ? '递增' : `${n}px`);
                        radiusSel.value = String(cfg.radius);
                        radiusSel.onchange = () => configList[index].radius = parseInt(radiusSel.value);

                        const repeatSel = createSelect(range(1, 10));
                        repeatSel.value = String(cfg.repeat || 1);
                        repeatSel.onchange = () => configList[index].repeat = parseInt(repeatSel.value);

                        const del = document.createElement('button');
                        del.textContent = '删除';
                        del.onclick = () => {
                            configList.splice(index, 1);
                            renderConfigItems(configList);
                        };
                        row.append(
                            label('类型:'), typeSel,
                            label('偏移:'), offsetSel,
                            label('半径:'), radiusSel,
                            label('重复:'), repeatSel,
                            del
                        );
                        formArea.appendChild(row);
                    });
                };
                addBtn.onclick = () => {
                    shadowConfig.push({ type: 0, offset: 1, radius: 1, repeat: 1 });
                    renderConfigItems(shadowConfig);
                };
                presetSelect.onchange = () => {
                    const val = presetSelect.value;
                    if (val === '自定义') {
                        renderConfigItems(shadowConfig);
                        addBtn.style.display = '';
                    } else {
                        shadowConfig = JSON.parse(JSON.stringify(presets[val])); // 深拷贝
                        renderConfigItems([]);
                        addBtn.style.display = 'none';
                    }
                };
                // 自动判断并选中 preset
                let matchedPreset = '自定义'; // 默认自定义
                if (Array.isArray(shadowConfig)) {
                    for (const key of Object.keys(presets)) {
                        const preset = presets[key];
                        const same = preset.length === shadowConfig.length &&
                            preset.every((item, i) =>
                                item.type === shadowConfig[i].type &&
                                item.offset === shadowConfig[i].offset &&
                                item.radius === shadowConfig[i].radius &&
                                item.repeat === shadowConfig[i].repeat
                            );
                        if (same) {
                            matchedPreset = key;
                            break;
                        }
                    }
                }
                presetSelect.value = matchedPreset;
                presetSelect.onchange();
            });

            createTab('cache', '📦 缓存管理', (page) => {
                const autoBindRow = document.createElement('div');
                Object.assign(autoBindRow.style, {
                    display: 'flex',
                    height: '36px',
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: '18px'
                });
                const label = document.createElement('div');
                label.textContent = '自动绑定视频（载入/缓存数据时）';
                label.style.fontWeight = 'bold';
                autoBindRow.append(label);
                const input = document.createElement('input');
                input.type = 'checkbox';
                input.checked = this.dmStore.get('autoBind', true);
                Object.assign(input.style, {
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer'
                });
                input.onchange = () => this.dmStore.set('autoBind', input.checked);
                autoBindRow.append(input);
                page.append(autoBindRow);

                const createLabel = (info, name, width) => {
                    const label = document.createElement('div');
                    if (!info) {
                        label.textContent = '❌ 未知' + name;
                        return label;
                    }
                    label.title = info.title;
                    const idLine = document.createElement('a');
                    idLine.textContent = `${name} [▶️ ${info.id}]`;
                    idLine.href = info.url;
                    idLine.target = '_blank';
                    Object.assign(idLine.style, {
                        fontSize: '13px',
                        color: '#1a73e8',
                        textDecoration: 'none',
                        marginBottom: '2px',
                        whiteSpace: 'nowrap'
                    });
                    const titleLine = document.createElement('div');
                    titleLine.textContent = info.title;
                    Object.assign(titleLine.style, {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width,
                    });
                    label.append(idLine, titleLine);
                    return label;
                };
                const createButton = (text, onclick) => {
                    const btn = document.createElement('button');
                    btn.textContent = text;
                    Object.assign(btn.style, {
                        width: '60px',
                        cursor: 'pointer'
                    });
                    btn.onclick = onclick;
                    return btn;
                };
                const createList = (name, manager, handleRow) => {
                    const listBox = document.createElement('div');
                    Object.assign(listBox.style, {
                        display: 'flex', flexDirection: 'column', gap: '8px'
                    });
                    const header = createLabeledButtonRow(`📦 ${name}`, {
                        textContent: `🧹 清空${name}`, onclick: () => {
                            if (confirm(`确定要清空所有${name}吗？`)) {
                                manager.clear();
                                listBox.textContent = `📭 所有${name}已清除`;
                                this.showTip(`🧹 所有${name}已清空`);
                            }
                        }
                    });
                    page.append(header, listBox);
                    const list = manager.list();
                    if (list.length === 0) {
                        listBox.textContent = `📭 当前没有${name}`;
                        return;
                    }
                    list.forEach(([id, item]) => {
                        try {
                            const row = document.createElement('div');
                            Object.assign(row.style, {
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            });
                            handleRow({ row, item });

                            const delBtn = createButton('🗑 删除', () => {
                                manager.remove(id);
                                row.remove();
                                this.showTip(`🗑 已删除${name}：${id}`);
                            });
                            row.appendChild(delBtn);
                            listBox.appendChild(row);
                        } catch (err) { this.dmPlayer.logTagError(err); }
                    })
                };

                createList('绑定视频', this.dmStore.binded, ({ row, item }) => {
                    const { source, target } = item;
                    const srcLabel = createLabel(source, source.from, '190px');
                    const trgLabel = createLabel(target, '当前', '190px');
                    const bindLabel = document.createElement('div');
                    bindLabel.textContent = '<绑定>';
                    bindLabel.style.color = 'gray';
                    row.append(trgLabel, bindLabel, srcLabel);
                });
                createList('缓存弹幕', this.dmStore.cache, ({ row, item }) => {
                    const info = item.info;
                    const label = createLabel(info, '缓存', '360px');
                    const saveBtn = createButton('下载', () => {
                        const json = JSON.stringify(item.data);
                        const blob = new Blob([json], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = info.id.replace(/[\\/:*?"<>|]/g, '_') + '.json';
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        URL.revokeObjectURL(url);
                    });
                    row.append(label, saveBtn);
                });
            });

            createTab('server', '🌐 服务器设置', (page) => {
                const serverHeader = createLabeledButtonRow('🌐 服务器地址：', {
                    textContent: '💾 保存', onclick: () => {
                        this.dmStore.set('server', serverInput.value.trim());
                        this.showTip('✅ 地址已保存');
                    }
                });

                const serverInput = document.createElement('input');
                Object.assign(serverInput.style, {
                    padding: '6px 10px',
                    fontSize: '14px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    width: '100%',
                    boxSizing: 'border-box'
                });
                serverInput.value = this.dmStore.get('server', '');
                page.appendChild(serverHeader);
                page.appendChild(serverInput);
            });

            createTab('alignment', '🎯 视频对齐', (page) => {
                let alignData = this.data[this.videoId]?.alignData || [];
                const parseTimeToMs = (text) => {
                    if (!text.includes(':')) return 0;
                    const [min, sec] = text.trim().split(':');
                    return Math.round((parseInt(min) * 60 + parseFloat(sec)) * 1000);
                };
                const formatMsToTime = (ms) => {
                    const min = Math.floor(ms / 60000);
                    const sec = (ms % 60000) / 1000;
                    return `${min}:${sec}`;
                };
                const container = document.createElement('div');
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.gap = '8px';
                const render = () => {
                    container.replaceChildren();
                    alignData.forEach((entry, index) => {
                        const row = document.createElement('div');
                        row.style.display = 'flex';
                        row.style.flexDirection = 'column';
                        row.style.border = '1px solid #ccc';
                        row.style.padding = '10px';
                        row.style.gap = '6px';

                        const createRow = (widgets) => {
                            const wrapper = document.createElement('div');
                            wrapper.style.display = 'flex';
                            wrapper.style.alignItems = 'center';
                            wrapper.style.gap = '6px';
                            widgets.forEach(widget => wrapper.appendChild(widget));
                            return wrapper;
                        };
                        const createInput = (placeholder, value, width, onInput) => {
                            const input = document.createElement('input');
                            input.placeholder = placeholder;
                            input.value = value;
                            input.style.width = width + 'px';
                            input.onchange = () => onInput(input.value);
                            return input;
                        };

                        // 源视频输入
                        const sourceStart = createInput('开始时间', formatMsToTime(entry.source?.start || 0), 80, val => {
                            entry.source = entry.source || {};
                            entry.source.start = parseTimeToMs(val);
                        });
                        const sourceEnd = createInput('结束时间', formatMsToTime(entry.source?.end || 0), 80, val => {
                            entry.source = entry.source || {};
                            entry.source.end = parseTimeToMs(val);
                        });

                        // 目标视频输入
                        const targetStart = createInput('开始时间', formatMsToTime(entry.target?.start || 0), 80, val => {
                            entry.target = entry.target || {};
                            entry.target.start = parseTimeToMs(val);
                        });
                        const targetEnd = createInput('结束时间', formatMsToTime(entry.target?.end || 0), 80, val => {
                            entry.target = entry.target || {};
                            entry.target.end = parseTimeToMs(val);
                        });

                        const modeSelect = createSelect(['map', 'shift'], opt => opt === 'map' ? '映射' : '顺移');
                        modeSelect.value = entry.mode || 'shift';
                        modeSelect.onchange = () => {
                            entry.mode = modeSelect.value;
                        };

                        const commentInput = createInput('附言', entry.comment || '', 200, val => {
                            entry.comment = val;
                        });

                        const delBtn = document.createElement('button');
                        delBtn.textContent = '🗑 删除';
                        delBtn.style.cursor = 'pointer';
                        delBtn.onclick = () => {
                            alignData.splice(index, 1);
                            render();
                        };

                        const cLabel = (text) => {
                            const label = document.createElement('div');
                            label.textContent = text;
                            return label;
                        }
                        row.appendChild(createRow([cLabel('原视频：'), sourceStart, cLabel('→'), sourceEnd]));
                        row.appendChild(createRow([cLabel('现视频：'), targetStart, cLabel('→'), targetEnd]));
                        row.appendChild(createRow([modeSelect, commentInput, delBtn]));

                        container.appendChild(row);
                    });
                };

                const createButton = (text, onclick) => {
                    const Btn = document.createElement('button');
                    Btn.textContent = text;
                    Object.assign(Btn.style, {
                        width: '120px',
                        padding: '4px',
                        cursor: 'pointer'
                    });
                    Btn.onclick = onclick;
                    return Btn;
                };
                const buttonRow = document.createElement('div');
                buttonRow.style.display = 'flex';
                buttonRow.style.justifyContent = 'space-between';
                buttonRow.style.alignItems = 'center';
                buttonRow.style.marginTop = '10px';
                buttonRow.appendChild(createButton('➕ 添加对齐片段', () => {
                    alignData.push({
                        source: { start: 0, end: 0 },
                        target: { start: 0, end: 0 },
                        mode: 'shift',
                        comment: ''
                    });
                    render();
                }));
                buttonRow.appendChild(createButton('📋 粘贴设置', async () => {
                    try {
                        const text = await navigator.clipboard.readText();
                        const parsed = JSON.parse(text);

                        if (!Array.isArray(parsed)) throw new Error('剪贴板内容不是有效的数组');
                        const isValid = parsed.every(item =>
                            item.source && item.target && item.mode
                        );
                        if (!isValid) throw new Error('剪贴板内容不是有效的对齐数据');

                        alignData = parsed;
                        render();
                        this.showTip('📋 成功粘贴对齐设置');
                    } catch (err) {
                        this.logError('❌ 粘贴失败', err);
                    }
                }));
                buttonRow.appendChild(createButton('📋 复制设置', () => {
                    const json = JSON.stringify(alignData, null);
                    navigator.clipboard.writeText(json).then(() => {
                        this.showTip('✅ 已复制所有对齐设置');
                    }).catch(() => {
                        this.showTip('❌ 复制失败');
                    });
                }));
                buttonRow.appendChild(createButton('💾 保存', () => {
                    const data = this.data[this.videoId]
                    if (data) {
                        data.alignData = alignData;
                        if (data.binded) this.bindVideoID(true, true);
                        this.dmPlayer.load(data.getDanmakuData());
                        this.showTip('✅ 对齐设置已保存');
                    } else {
                        this.showTip('未有弹幕数据');
                    }
                }));

                render();

                const desc = document.createElement('div');
                Object.assign(desc.style, {
                    fontSize: '13px',
                    lineHeight: '1.6',
                    background: '#f9f9f9',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                    marginBottom: '10px'
                });
                const addLine = (text, isBold = false, isCode = false) => {
                    const line = document.createElement('div');
                    if (isCode) {
                        const code = document.createElement('code');
                        code.textContent = text;
                        line.appendChild(code);
                    } else {
                        line.textContent = isBold ? `• ${text}` : text;
                        if (isBold) line.style.fontWeight = 'bold';
                    }
                    desc.appendChild(line);
                };
                addLine('⚠️ 对齐设置说明：');
                desc.appendChild(document.createElement('hr'));
                addLine('当原视频和新视频的时间段不一致（如删减/增加片段）时，可通过设置对齐项同步弹幕。');
                addLine('映射：将原时间段线性映射到新时间段。', true);
                addLine('顺移：平移时间，超出新时间段的丢弃。', true);
                addLine('附言：可插入一条左上角弹幕提示观众。', true);
                addLine('时间格式为 分:秒 或 分:秒.毫秒', false);

                page.appendChild(desc);
                page.appendChild(container);
                page.appendChild(buttonRow);
            });

            switchTab('display');
        }
        showPanel() {
            const existing = document.getElementById('dmplayer-panel');
            if (existing) existing.remove();

            const overlay = document.createElement('div');
            overlay.id = 'dmplayer-panel';
            Object.assign(overlay.style, {
                position: 'fixed',
                top: '0', left: '0', right: '0', bottom: '0',
                background: 'rgba(0, 0, 0, 0.4)',
                zIndex: 10001,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            });
            overlay.onclick = (e) => {
                if (e.target === overlay) overlay.remove();
            };
            const panel = document.createElement('div');
            Object.assign(panel.style, {
                background: '#fff',
                width: '500px',
                maxHeight: '80vh',
                overflowY: 'auto',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                fontSize: '14px',
                fontFamily: 'sans-serif',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            });
            overlay.appendChild(panel);
            document.body.appendChild(overlay);
            return { panel, overlay };
        }
    }
    let dmPanel;
    try {
        const path = 'https://cdn.jsdelivr.net/gh/ZBpine/bilibili-danmaku-download@1.6.1/tampermonkey/';
        const { BiliDanmakuPlayer } = await import(path + 'BiliDanmakuPlayer.js');
        const { createBiliDataManagerImport } = await import(path + 'BiliDataManager.js');

        const dmPlayer = new BiliDanmakuPlayer();
        const BiliDataManager = await createBiliDataManagerImport(GM_xmlhttpRequest, 'Danmaku Player');
        dmPanel = new DanmakuControlPanel(dmPlayer, BiliDataManager);
        unsafeWindow.dmPlayerCtl = dmPanel;
    } catch (err) {
        console.error('加载失败:', err);
    }

    /*
    * chromium的浏览器会自动关闭AdblockPlus拦截Youtube的广告
    * 于是AdblockPlus推出了实验性广告拦截
    * 方法是隐藏原本的视频，插入一个可以阻拦广告的iframe视频
    * https://developers.google.com/youtube/iframe_api_reference?hl=zh-tw
    * 以下为解决办法
    */
    function wrapYTPlayer(player) {
        const PlayerState = unsafeWindow.YT?.PlayerState;
        return {
            get currentTime() {
                return player.getCurrentTime?.() ?? player.playerInfo?.currentTime ?? 0;
            },
            set currentTime(val) {
                player.seekTo?.(val, true);
            },
            get duration() {
                return player.getDuration?.() ?? player.playerInfo?.duration ?? 0;
            },
            get playbackRate() {
                return player.getPlaybackRate?.() ?? player.playerInfo?.playbackRate ?? 1;
            },
            set playbackRate(val) {
                player.setPlaybackRate?.(val);
            },
            get paused() {
                return (player.getPlayerState?.() ?? player.playerInfo?.playerState) === PlayerState?.PAUSED;
            },
            get ended() {
                return (player.getPlayerState?.() ?? player.playerInfo?.playerState) === PlayerState?.ENDED;
            },
            get volume() {
                return (player.getVolume?.() ?? player.playerInfo?.volume ?? 100) / 100;
            },
            set volume(val) {
                player.setVolume?.(Math.max(0, Math.min(1, val)) * 100);
            },
            get muted() {
                return player.isMuted?.() ?? player.playerInfo?.muted ?? false;
            },
            set muted(val) {
                if (val) player.mute?.();
                else player.unMute?.();
            },
            play() {
                player.playVideo?.();
            },
            pause() {
                player.pauseVideo?.();
            }
        };
    }
    function transformIframeDOMAdapter(domAdapter) {
        if (!domAdapter) return;
        if (unsafeWindow.iframePlayer) {
            domAdapter.backup ??= {
                getVideoWrapper: domAdapter.getVideoWrapper,
                bindVideoEvent: domAdapter.bindVideoEvent,
                videoGetter: Object.getOwnPropertyDescriptor(Object.getPrototypeOf(domAdapter), 'video')
            };
            domAdapter.getVideoWrapper = function () {
                const iframe = document.querySelector('iframe#yt-haven-embed-player');
                return iframe.parentElement;
            }
            domAdapter.bindVideoEvent = function () {
                domAdapter._resizeObserver = new ResizeObserver(() => {
                    domAdapter.player.resize?.();
                });
                const iframe = document.querySelector('iframe#yt-haven-embed-player');
                domAdapter._resizeObserver.observe(iframe);

                if (domAdapter._isIframeBound) return;
                domAdapter._isIframeBound = true;
                unsafeWindow.iframePlayer.addEventListener('onStateChange', (event) => {
                    const state = event.data;
                    const PlayerState = unsafeWindow.YT.PlayerState;
                    console.log('[iframe 播放器] 播放状态改变', Object.keys(PlayerState).find(k => PlayerState[k] === state) || state);
                    if (state === PlayerState.PLAYING) {
                        domAdapter.player.play?.();
                    } else if (state === PlayerState.PAUSED) {
                        domAdapter.player.pause?.();
                    } else if (state === PlayerState.CUED) {
                        domAdapter.player.resize?.();
                    }
                });
            }
            const YTPlayerWrapper = wrapYTPlayer(unsafeWindow.iframePlayer);
            Object.defineProperty(domAdapter, 'video', {
                get() {
                    return YTPlayerWrapper;
                },
                configurable: true
            });
        } else {
            if (domAdapter.backup) {
                Object.assign(domAdapter, domAdapter.backup);
                if (domAdapter.backup.videoGetter) {
                    Object.defineProperty(domAdapter, 'video', domAdapter.backup.videoGetter);
                }
            }
            delete domAdapter._isIframeBound;
        }
    }
    function observeIframePlayer() {
        let player = null;
        const setupPlayer = async (iframe) => {
            if (!iframe || typeof unsafeWindow.YT?.Player !== 'function') return;
            if (iframe.dataset.ytBound) return;
            iframe.dataset.ytBound = '1';
            console.log('[iframe 播放器] 尝试绑定');
            player = new unsafeWindow.YT.Player(iframe, {
                events: {
                    onReady: () => {
                        try {
                            unsafeWindow.iframePlayer = player;
                            if (dmPanel.dmPlayer) {
                                transformIframeDOMAdapter(dmPanel.dmPlayer.domAdapter);
                                dmPanel.dmPlayer.update?.();
                            }
                            console.log('[iframe 播放器] 已绑定');
                        } catch (e) {
                            console.error('[iframe 播放器] 绑定失败', e);
                        }
                    }
                }
            });
        };
        const destroyPlayer = () => {
            if (player && typeof player.destroy === 'function') {
                player.destroy();
            }
            unsafeWindow.iframePlayer = null;
            player = null;
            transformIframeDOMAdapter(dmPanel.dmPlayer?.domAdapter);
            dmPanel.dmPlayer?.update?.();
            console.log('[iframe 播放器] 被移除');
        };
        const observer = new MutationObserver(() => {
            const iframe = document.querySelector('iframe#yt-haven-embed-player');
            if (iframe && iframe !== unsafeWindow.iframePlayer?.getIframe()) {
                setupPlayer(iframe);
            } else if (!iframe && unsafeWindow.iframePlayer) {
                destroyPlayer();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // 初始检查
        const existing = document.querySelector('iframe#yt-haven-embed-player');
        if (existing) setupPlayer(existing);
    }
    function loadYouTubeIframeAPI(callback) {
        if (unsafeWindow.YT && typeof unsafeWindow.YT.Player === 'function') {
            callback?.();
            return;
        }
        unsafeWindow.onYouTubeIframeAPIReady = () => {
            if (unsafeWindow.YT && typeof unsafeWindow.YT.Player === 'function') {
                console.log('[YT] Iframe API loaded');
                callback?.();
            } else {
                console.warn('[YT] Iframe API load failure');
            }
        };
        let scriptUrl = 'https://www.youtube.com/iframe_api';
        try {
            // 创建 Trusted Types 策略
            const policy = window.trustedTypes?.createPolicy?.('youtube-api-policy', {
                createScriptURL: (url) => url
            });
            if (policy) {
                scriptUrl = policy.createScriptURL(scriptUrl);
            }
        } catch (e) {
            console.warn('[YT] Trusted Types policy creation failed:', e);
        }
        const tag = document.createElement('script');
        tag.src = scriptUrl;
        tag.id = 'iframe-api-script';
        tag.async = true;
        // 插入 script 标签
        const firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag) {
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
            document.head.appendChild(tag);
        }
    }
    if (!dmPanel.isBilibili) loadYouTubeIframeAPI(() => { observeIframePlayer() });

    async function waitForVideo(timeout = 10000) {
        const start = Date.now();
        return new Promise((resolve, reject) => {
            const check = () => {
                const video = document.querySelector('video');
                if (video) {
                    console.log('🎥 检测到 <video> 元素');
                    resolve(video);
                } else if (Date.now() - start >= timeout) {
                    reject(new Error('⏰ 超时：未检测到 <video> 元素'));
                } else {
                    requestAnimationFrame(check);
                }
            };
            check();
        });
    }
    try {
        await waitForVideo();
        dmPanel.init();
        dmPanel.observeVideoChange();
    } catch (err) {
        console.warn(err);
    }
})();
