// ==UserScript==
// @name         Bilibili - 未登录无限试用最高画质
// @description  未登录下恢复评论区并持续试用最高画质
// @namespace    https://bilibili.com/
// @version      2025.12.10
// @license      GPL-3.0
// @author       会飞的蛋蛋面
// @match        https://www.bilibili.com/video/*
// @match        https://space.bilibili.com/*/dynamic*
// @match        https://www.bilibili.com/festival/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://t.bilibili.com/*
// @match        https://www.bilibili.com/opus/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        unsafeWindow
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.aicu.cc
// @connect      apibackup2.aicu.cc
// @require      https://cdn.jsdelivr.net/npm/blueimp-md5@2.19.0/js/md5.min.js
// @require      https://cdn.jsdelivr.net/npm/viewerjs@1.11.7/dist/viewer.min.js
// @resource     viewerCss https://cdn.jsdelivr.net/npm/viewerjs@1.11.7/dist/viewer.min.css
// @require      https://update.greasyfork.org/scripts/512574/1464548/inject-bilibili-comment-style.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/470714/Bilibili%20-%20%E6%9C%AA%E7%99%BB%E5%BD%95%E6%97%A0%E9%99%90%E8%AF%95%E7%94%A8%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/470714/Bilibili%20-%20%E6%9C%AA%E7%99%BB%E5%BD%95%E6%97%A0%E9%99%90%E8%AF%95%E7%94%A8%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.meta.js
// ==/UserScript==

(() => {
    "use strict";

    const global = typeof unsafeWindow === "undefined" ? window : unsafeWindow;

    if (!isUserLoggedIn()) {
        initQualityTrialBypass();
        initHostGuards();
        initHistoryLookup();
        initCommentEnhancer();
    }

    function waitFor(condition, interval = 200) {
        return new Promise(resolve => {
            let running = false;
            const timer = setInterval(async () => {
                if (running) return;
                running = true;
                try {
                    const result = await condition();
                    if (!result) return;
                    clearInterval(timer);
                    resolve(result);
                } finally {
                    running = false;
                }
            }, interval);
        });
    }

    function isUserLoggedIn() {
        return document.cookie.includes("DedeUserID");
    }

    function initQualityTrialBypass() {
        const {setTimeout: nativeSetTimeout} = global;
        global.setTimeout = (fn, delay) => nativeSetTimeout(fn, delay === 3e4 ? 3e8 : delay);
        const nativeDefineProperty = Object.defineProperty;
        Object.defineProperty = function(obj, prop, descriptor) {
            if (prop === "isViewToday" || prop === "isVideoAble") descriptor = {
                get: () => true,
                enumerable: false,
                configurable: true
            };
            return nativeDefineProperty.call(this, obj, prop, descriptor);
        };
        const tryClickTrialBtn = () => {
            const btn = document.querySelector(".bpx-player-toast-confirm-login");
            if (btn) setTimeout(() => btn.click(), 1e3);
        };
        setInterval(tryClickTrialBtn, 1e3);
    }

    function initHostGuards() {
        const host = location.hostname;
        if (host === "space.bilibili.com") {
            const styleElement = document.createElement("style");
            styleElement.textContent = ".bili-mini-mask, .login-panel-popover, .login-tip { display: none !important; }";
            document.head.appendChild(styleElement);
            setInterval(() => {
                const maskElement = document.querySelector(".bili-mini-mask");
                if (maskElement) window.location.reload();
            }, 1e3);
            let last = 0;
            const nativeFetch = global.fetch;
            global.fetch = (...args) => {
                const url = args[0];
                if (typeof url === "string" && url.includes("space/wbi/arc/search")) {
                    if (Date.now() - last < 200) return Promise.reject(new Error("重复请求"));
                    last = Date.now();
                }
                return nativeFetch(...args);
            };
            return;
        }
        if (host === "www.bilibili.com") {
            const nativeAppend = Node.prototype.appendChild;
            const scriptBlockList = [ "miniLogin" ];
            Node.prototype.appendChild = function appendPatched(el) {
                if (el.tagName === "SCRIPT") {
                    const src = el.src || "";
                    if (scriptBlockList.some(keyword => src.includes(keyword))) return el;
                }
                return nativeAppend.call(this, el);
            };
            waitFor(() => global.player?.getMediaInfo ? global.player : null, 1e3).then(player => {
                if (!player) return;
                const originalGetMediaInfo = player.getMediaInfo;
                player.getMediaInfo = function patchedGetMediaInfo(...args) {
                    const info = originalGetMediaInfo.apply(this, args);
                    info.absolutePlayTime = 0;
                    return info;
                };
                let clicked = false;
                document.body.addEventListener("click", () => {
                    clicked = true;
                    setTimeout(() => clicked = false, 500);
                });
                const originalPause = player.pause;
                player.pause = function patchedPause(...args) {
                    if (clicked) return originalPause.apply(this, args);
                };
            });
        }
    }

    function initHistoryLookup() {
        if (document.documentElement.dataset.historyLookupInited === "1") return;
        document.documentElement.dataset.historyLookupInited = "1";
        const historyPanelId = "history-reply-panel";
        const biliVideoLinkPrefix = "https://www.bilibili.com/video";
        const biliLiveLinkPrefix = "https://live.bilibili.com";
        const historyApiBase = [ "https://api.aicu.cc/api/v3/search", "https://apibackup2.aicu.cc:88/api/v3/search" ];
        const historyApiEndpoints = {
            reply: "/getreply",
            danmu: "/getvideodm",
            live: "/getlivedm"
        };
        const historyTabs = [ {
            key: "reply",
            name: "评论"
        }, {
            key: "danmu",
            name: "视频弹幕"
        }, {
            key: "live",
            name: "直播弹幕"
        } ];
        const historyCache = new Map;
        let historyIsLoading = false;
        let historyCurrentUid = null;
        let historyCurrentPage = 1;
        let historyCurrentTab = "reply";
        let historyIsEnd = false;
        let historyTotal = 0;
        addHistoryStyle();
        document.addEventListener("click", event => {
            const target = event.target?.closest?.(".history-lookup-btn");
            if (!target || historyIsLoading) return;
            const uid = target.dataset.uid;
            if (!uid) return;
            const nickname = target.dataset.nickname || `UID${uid}`;
            openHistoryPanel(event, uid, nickname);
        });
        function addHistoryStyle() {
            GM_addStyle(`\n        #${historyPanelId} {\n          position: absolute;\n          width: 380px;\n          max-height: 70vh;\n          overflow: auto;\n          background: #fff;\n          color: #333;\n          border: 1px solid #ddd;\n          border-radius: 8px;\n          box-shadow: 0 6px 24px rgba(0,0,0,.18);\n          z-index: 99999;\n          padding: 12px;\n          display: none;\n          font-family: inherit;\n        }\n        body.dark #${historyPanelId} { background: #1f1f1f; color: #e9eaec; border-color: #333; }\n        #${historyPanelId} .history-header { display: flex; justify-content: space-between; align-items: center; font-weight: 700; margin-bottom: 8px; }\n        #${historyPanelId} .history-close { padding: 4px 8px; border: 0; background: #bbb; color: #fff; border-radius: 4px; cursor: pointer; }\n        body.dark #${historyPanelId} .history-close { background: #444; color: #e9eaec; }\n        #${historyPanelId} .history-tabs { display: flex; gap: 6px; margin-bottom: 8px; }\n        #${historyPanelId} .history-tabs button { flex: 1; padding: 6px; border: 1px solid #ddd; background: #f5f5f5; border-radius: 4px; cursor: pointer; font-size: 12px; }\n        #${historyPanelId} .history-tabs button.active { background: #00a1d6; color: #fff; border-color: #00a1d6; }\n        body.dark #${historyPanelId} .history-tabs button { background: #333; border-color: #444; color: #e9eaec; }\n        body.dark #${historyPanelId} .history-tabs button.active { background: #00a1d6; border-color: #00a1d6; }\n        #${historyPanelId} .history-item { margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #f2f2f2; }\n        body.dark #${historyPanelId} .history-item { border-color: #2c2c2c; }\n        #${historyPanelId} .history-meta { font-size: 12px; color: #666; margin-bottom: 4px; }\n        #${historyPanelId} .history-meta a { color: #00a1d6; text-decoration: none; }\n        body.dark #${historyPanelId} .history-meta { color: #9ca3af; }\n        #${historyPanelId} .history-text { font-size: 14px; white-space: pre-wrap; word-break: break-all; }\n        #${historyPanelId} .history-room { font-size: 12px; color: #00a1d6; margin-bottom: 2px; }\n        #${historyPanelId} .history-info { font-size: 12px; color: #999; margin-bottom: 8px; }\n        #${historyPanelId} .history-pager { display: flex; justify-content: space-between; margin-top: 8px; }\n        #${historyPanelId} .history-pager button { padding: 4px 12px; border: 1px solid #ddd; background: #f5f5f5; border-radius: 4px; cursor: pointer; }\n        #${historyPanelId} .history-pager button:disabled { opacity: 0.5; cursor: not-allowed; }\n        body.dark #${historyPanelId} .history-pager button { background: #333; border-color: #444; color: #e9eaec; }\n        .history-lookup-btn { margin-left: 12px; color: #9499A0; cursor: pointer; font-size: 13px; }\n        .history-lookup-btn:hover { color: #00a1d6; }\n        html[data-history-lookup-loading="1"] .history-lookup-btn {\n          pointer-events: none;\n          cursor: not-allowed;\n          color: #C9CCD0;\n        }\n        html[data-history-lookup-loading="1"] .history-lookup-btn:hover { color: #C9CCD0; }\n      `);
        }
        async function openHistoryPanel(event, uid, nickname) {
            if (historyIsLoading) return;
            let panel = document.getElementById(historyPanelId);
            if (!panel) {
                panel = document.createElement("div");
                panel.id = historyPanelId;
                document.body.appendChild(panel);
            }
            const trigger = event.target.closest(".history-lookup-btn") || event.target;
            const rect = trigger.getBoundingClientRect();
            panel.style.left = `${rect.left + window.scrollX}px`;
            panel.style.top = `${rect.bottom + window.scrollY + 5}px`;
            const tabsHtml = historyTabs.map(t => `<button class="history-tab-${t.key} ${t.key === "reply" ? "active" : ""}">${t.name}</button>`).join("");
            panel.innerHTML = `\n        <div class="history-header">${nickname}<button class="history-close">关闭</button></div>\n        <div class="history-tabs">${tabsHtml}</div>\n        <div class="history-body">加载中...</div>\n      `;
            panel.style.display = "block";
            panel.querySelector(".history-close").onclick = () => panel.style.display = "none";
            historyTabs.forEach(t => {
                const btn = panel.querySelector(`.history-tab-${t.key}`);
                btn.onclick = () => switchHistoryTab(panel, t.key);
            });
            historyCurrentUid = uid;
            historyCurrentPage = 1;
            historyCurrentTab = "reply";
            historyIsEnd = false;
            historyTotal = 0;
            await loadHistoryPage(panel);
        }
        function switchHistoryTab(panel, tabKey) {
            if (historyIsLoading || historyCurrentTab === tabKey) return;
            historyCurrentTab = tabKey;
            historyCurrentPage = 1;
            historyIsEnd = false;
            historyTotal = 0;
            historyTabs.forEach(t => {
                const btn = panel.querySelector(`.history-tab-${t.key}`);
                if (btn) btn.classList.toggle("active", t.key === tabKey);
            });
            loadHistoryPage(panel);
        }
        function getHistoryCacheKey(uid, type, page) {
            return `${uid}_${type}_${page}`;
        }
        function setHistoryTabsDisabled(panel, disabled) {
            panel.querySelectorAll(".history-tabs button").forEach(btn => {
                btn.disabled = disabled;
                btn.style.opacity = disabled ? "0.5" : "";
                btn.style.pointerEvents = disabled ? "none" : "";
            });
        }
        function setHistoryLoading(panel, loading) {
            historyIsLoading = loading;
            if (loading) document.documentElement.dataset.historyLookupLoading = "1"; else delete document.documentElement.dataset.historyLookupLoading;
            setHistoryTabsDisabled(panel, loading);
        }
        async function loadHistoryPage(panel) {
            const uid = historyCurrentUid;
            const tab = historyCurrentTab;
            const page = historyCurrentPage;
            const cacheKey = getHistoryCacheKey(uid, tab, page);
            if (historyCache.has(cacheKey)) {
                const cached = historyCache.get(cacheKey);
                historyTotal = cached.total;
                historyIsEnd = cached.isEnd;
                renderHistoryList(panel, cached.list);
                return;
            }
            if (historyIsLoading) return;
            setHistoryLoading(panel, true);
            panel.querySelector(".history-body").textContent = "加载中...";
            try {
                const response = await historyRequest(uid, page, tab);
                if (!response.success) throw new Error(response.message || `接口异常: code=${response.code}`);
                const list = parseHistoryResponse(response, tab);
                historyTotal = response.data?.cursor?.all_count || historyTotal;
                historyIsEnd = response.data?.cursor?.is_end || !list.length;
                historyCache.set(cacheKey, {
                    list: list,
                    total: historyTotal,
                    isEnd: historyIsEnd
                });
                renderHistoryList(panel, list);
            } catch (err) {
                panel.querySelector(".history-body").textContent = `获取失败：${err.message}`;
            } finally {
                setHistoryLoading(panel, false);
            }
        }
        function parseHistoryResponse(response, type) {
            const data = response.data;
            if (type === "reply") return (data?.replies || []).map(d => ({
                time: d.time || 0,
                message: d.message || "",
                oid: d.dyn?.oid || "",
                rpid: d.rpid || ""
            }));
            if (type === "danmu") return (data?.videodmlist || []).map(d => ({
                ctime: d.ctime || 0,
                content: d.content || "",
                oid: d.oid || ""
            }));
            if (type === "live") {
                const result = [];
                const rooms = data?.list || [];
                for (const room of rooms) {
                    const danmuList = room.danmu || [];
                    for (const dm of danmuList) result.push({
                        roomId: room.roominfo?.roomid || "",
                        roomName: room.roominfo?.roomname || "",
                        upName: room.roominfo?.upname || "",
                        text: dm.text || "",
                        ts: dm.ts || 0
                    });
                }
                return result;
            }
            return [];
        }
        function historyRequestOnce(baseUrl, uid, pn) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `${baseUrl}?uid=${uid}&pn=${pn}&ps=100&mode=0&keyword=`,
                    headers: {
                        Origin: "https://www.aicu.cc",
                        Referer: "https://www.aicu.cc/"
                    },
                    responseType: "json",
                    onload: res => resolve(new HistoryApiResponse(res.response)),
                    onerror: () => reject(new Error("网络错误"))
                });
            });
        }
        async function historyRequest(uid, pn, type) {
            let lastResponse = null;
            for (let i = 0; i < historyApiBase.length; i++) {
                const baseUrl = historyApiBase[i] + historyApiEndpoints[type];
                try {
                    const response = await historyRequestOnce(baseUrl, uid, pn);
                    if (response.success) return response;
                    lastResponse = response;
                } catch (err) {
                    if (i === historyApiBase.length - 1) throw err;
                }
            }
            return lastResponse;
        }
        function renderHistoryList(panel, list) {
            const body = panel.querySelector(".history-body");
            if (!list.length && historyCurrentPage === 1) {
                body.textContent = "暂无记录";
                return;
            }
            const tabName = historyTabs.find(t => t.key === historyCurrentTab)?.name || "";
            const infoHtml = `<div class="history-info">共 ${historyTotal} 条${tabName} · 第 ${historyCurrentPage} 页</div>`;
            const itemsHtml = list.map(item => renderHistoryItem(item)).join("");
            const pagerHtml = `\n        <div class="history-pager">\n          <button class="history-prev" ${historyCurrentPage <= 1 ? "disabled" : ""}>上一页</button>\n          <button class="history-next" ${historyIsEnd ? "disabled" : ""}>下一页</button>\n        </div>\n      `;
            body.innerHTML = infoHtml + itemsHtml + pagerHtml;
            body.querySelector(".history-prev").onclick = () => {
                if (historyIsLoading) return;
                if (historyCurrentPage > 1) {
                    historyCurrentPage -= 1;
                    loadHistoryPage(panel);
                }
            };
            body.querySelector(".history-next").onclick = () => {
                if (historyIsLoading) return;
                if (!historyIsEnd) {
                    historyCurrentPage += 1;
                    loadHistoryPage(panel);
                }
            };
        }
        function renderHistoryItem(item) {
            if ("message" in item) {
                const date = item.time ? new Date(item.time * 1e3).toLocaleString() : "";
                const link = item.oid ? `${biliVideoLinkPrefix}/av${item.oid}/#reply${item.rpid}` : "";
                const linkHtml = link ? `<a href="${link}" target="_blank">跳转</a>` : "";
                return `<div class="history-item"><div class="history-meta">${date} ${linkHtml}</div><div class="history-text">${escapeHistoryHtml(item.message)}</div></div>`;
            }
            if ("content" in item) {
                const date = item.ctime ? new Date(item.ctime * 1e3).toLocaleString() : "";
                const link = item.oid ? `${biliVideoLinkPrefix}/av${item.oid}` : "";
                const linkHtml = link ? `<a href="${link}" target="_blank">跳转</a>` : "";
                return `<div class="history-item"><div class="history-meta">${date} ${linkHtml}</div><div class="history-text">${escapeHistoryHtml(item.content)}</div></div>`;
            }
            if ("roomId" in item) {
                const date = item.ts ? new Date(item.ts * 1e3).toLocaleString() : "";
                const link = item.roomId ? `${biliLiveLinkPrefix}/${item.roomId}` : "";
                const linkHtml = link ? `<a href="${link}" target="_blank">${escapeHistoryHtml(item.roomName)}</a>` : escapeHistoryHtml(item.roomName);
                return `<div class="history-item"><div class="history-room">${linkHtml} (${escapeHistoryHtml(item.upName)})</div><div class="history-meta">${date}</div><div class="history-text">${escapeHistoryHtml(item.text)}</div></div>`;
            }
            return "";
        }
        function escapeHistoryHtml(text) {
            return String(text ?? "").replace(/[&<>"']/g, c => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[c]));
        }
        class HistoryApiResponse {
            constructor(data) {
                this.code = data?.code ?? -1;
                this.message = data?.message || "";
                this.ttl = data?.ttl || 1;
                this.data = data?.data || null;
            }
            get success() {
                return this.code === 0;
            }
        }
    }

    function initCommentEnhancer() {
        GM_addStyle(GM_getResourceText("viewerCss"));
        async function getWbiQueryString(params) {
            const {img_url: img_url, sub_url: sub_url} = await fetch("https://api.bilibili.com/x/web-interface/nav").then(res => res.json()).then(json => json.data.wbi_img);
            const imgKey = img_url.slice(img_url.lastIndexOf("/") + 1, img_url.lastIndexOf("."));
            const subKey = sub_url.slice(sub_url.lastIndexOf("/") + 1, sub_url.lastIndexOf("."));
            const originKey = imgKey + subKey;
            const mixinKeyEncryptTable = [ 46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34, 44, 52 ];
            const mixinKey = mixinKeyEncryptTable.map(n => originKey[n]).join("").slice(0, 32);
            const query = Object.keys(params).sort().map(key => {
                const value = params[key].toString().replace(/[!'()*]/g, "");
                return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            }).join("&");
            const md5Fn = typeof md5 === "function" ? md5 : typeof global.md5 === "function" ? global.md5 : null;
            if (!md5Fn) throw new Error("md5 未加载");
            const wbiSign = md5Fn(query + mixinKey);
            return `${query}&w_rid=${wbiSign}`;
        }
        function b2a(bvid) {
            const XOR_CODE = 23442827791579n;
            const MASK_CODE = 2251799813685247n;
            const BASE = 58n;
            const BYTES = [ "B", "V", 1, "", "", "", "", "", "", "", "", "" ];
            const BV_LEN = BYTES.length;
            const ALPHABET = "FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf".split("");
            const DIGIT_MAP = [ 0, 1, 2, 9, 7, 5, 6, 4, 8, 3, 10, 11 ];
            let r = 0n;
            for (let i = 3; i < BV_LEN; i++) r = r * BASE + BigInt(ALPHABET.indexOf(bvid[DIGIT_MAP[i]]));
            return `${r & MASK_CODE ^ XOR_CODE}`;
        }
        const videoRE = /https:\/\/www\.bilibili\.com\/video\/.*/;
        const bangumiRE = /https:\/\/www.bilibili.com\/bangumi\/play\/.*/;
        const dynamicRE = /https:\/\/t.bilibili.com\/\d+/;
        const opusRE = /https:\/\/www.bilibili.com\/opus\/\d+/;
        const spaceRE = /https:\/\/space.bilibili.com\/\d+/;
        const festivalRE = /https:\/\/www.bilibili.com\/festival\/.*/;
        const sortTypeConstant = {
            LATEST: 0,
            HOT: 2
        };
        const defaultPaginationOffsetStr = `{"offset":""}`;
        const state = {
            oid: void 0,
            creatorId: void 0,
            commentType: void 0,
            replyList: void 0,
            currentSortType: sortTypeConstant.HOT,
            paginationOffsets: createPaginationOffsetState()
        };
        let replyAutoLoadObserver = null;
        let startIsRunning = false;
        let startHasPending = false;
        function createPaginationOffsetState() {
            return {
                [sortTypeConstant.HOT]: {
                    1: defaultPaginationOffsetStr
                },
                [sortTypeConstant.LATEST]: {
                    1: defaultPaginationOffsetStr
                }
            };
        }
        if (spaceRE.test(global.location.href)) {
            setupCommentBtnModifier();
            return;
        }
        addStyle();
        setupVideoChangeHandler();
        start();
        async function start() {
            if (startIsRunning) {
                startHasPending = true;
                return;
            }
            startIsRunning = true;
            try {
                state.oid = state.creatorId = state.commentType = state.replyList = void 0;
                state.currentSortType = sortTypeConstant.HOT;
                state.paginationOffsets = createPaginationOffsetState();
                const {href: href, pathname: pathname} = global.location;
                let bangumiSeasonPromise = null;
                let dynamicDetailPromise = null;
                await setupStandardCommentContainer();
                await waitFor(async () => {
                    const initialState = global?.__INITIAL_STATE__;
                    if (videoRE.test(href)) {
                        const videoID = pathname.replace("/video/", "").replace("/", "");
                        if (videoID.startsWith("av")) state.oid = videoID.slice(2);
                        if (videoID.startsWith("BV")) state.oid = b2a(videoID);
                        state.creatorId = initialState?.upData?.mid;
                        state.commentType = 1;
                    } else if (bangumiRE.test(href)) {
                        const bangumiPathMatch = pathname.match(/\/bangumi\/play\/(ep|ss)(\d+)/);
                        if (bangumiPathMatch?.[1] && bangumiPathMatch?.[2]) {
                            const key = bangumiPathMatch[1] === "ep" ? "ep_id" : "season_id";
                            bangumiSeasonPromise = bangumiSeasonPromise || fetch(`https://api.bilibili.com/pgc/view/web/season?${key}=${bangumiPathMatch[2]}`).then(res => res.json());
                            const season = await bangumiSeasonPromise;
                            if (season?.code === 0) if (bangumiPathMatch[1] === "ep") {
                                const epId = parseInt(bangumiPathMatch[2], 10);
                                const episode = season?.result?.episodes?.find(item => item?.id === epId);
                                if (episode?.aid) state.oid = `${episode.aid}`;
                            } else {
                                const aid = season?.result?.episodes?.[0]?.aid;
                                if (aid) state.oid = `${aid}`;
                            }
                        }
                        const upHref = document.querySelector("a[class*=upinfo_upLink]")?.href;
                        state.creatorId = upHref ? upHref.split("/").filter(item => !!item).pop() : -1;
                        state.commentType = 1;
                    } else if (dynamicRE.test(href)) {
                        const dynamicID = pathname.replace("/", "");
                        dynamicDetailPromise = dynamicDetailPromise || fetch(`https://api.bilibili.com/x/polymer/web-dynamic/v1/detail?id=${dynamicID}`).then(res => res.json()).then(json => {
                            if (json?.code !== 0) console.error("[bili-comment-enhancer] dynamic detail 接口返回异常", json);
                            return json;
                        });
                        const dynamicDetail = await dynamicDetailPromise;
                        const {code: code, data: data} = dynamicDetail;
                        if (code !== 0) return;
                        const basic = data?.item?.basic;
                        const author = data?.item?.modules?.module_author;
                        state.oid = basic?.comment_id_str;
                        state.commentType = basic?.comment_type;
                        state.creatorId = author?.mid;
                    } else if (opusRE.test(href)) {
                        const basic = initialState?.detail?.basic;
                        state.oid = basic?.comment_id_str;
                        state.creatorId = basic?.uid;
                        state.commentType = basic?.comment_type;
                    } else if (festivalRE.test(href)) {
                        const videoInfo = initialState?.videoInfo;
                        state.oid = videoInfo?.aid;
                        state.creatorId = videoInfo?.upMid;
                        state.commentType = 1;
                    }
                    state.replyList = document.querySelector(".reply-list");
                    if (state.oid && state.creatorId && state.commentType && state.replyList) {
                        state.creatorId = parseInt(state.creatorId, 10);
                        return true;
                    }
                });
                await enableSwitchingSortType();
                await loadFirstPagination();
            } finally {
                startIsRunning = false;
                if (startHasPending) {
                    startHasPending = false;
                    start();
                }
            }
        }
        async function setupStandardCommentContainer() {
            const container = await waitFor(() => {
                const standardContainer = document.querySelector(".comment-container");
                const outdatedContainer = document.querySelector(".comment-wrapper .common");
                const shadowRootContainer = document.querySelector("bili-comments");
                return standardContainer || outdatedContainer || shadowRootContainer || null;
            });
            if (!container.classList.contains("comment-container")) container.parentElement.innerHTML = `\n            <div class="comment-container">\n              <div class="reply-header">\n                <div class="reply-navigation">\n                  <ul class="nav-bar">\n                    <li class="nav-title">\n                      <span class="nav-title-text">评论</span>\n                      <span class="total-reply">-</span>\n                    </li>\n                    <li class="nav-sort hot">\n                      <div class="hot-sort">最热</div>\n                      <div class="part-symbol"></div>\n                      <div class="time-sort">最新</div>\n                    </li>\n                  </ul>\n                </div>\n              </div>\n              <div class="reply-warp">\n                <div class="main-reply-box">\n                  <div class="reply-box disabled">\n                    <div class="box-normal">\n                      <div class="reply-box-avatar">\n                        <div class="bili-avatar" style="width: 48px; height: 48px; background-color: #F1F1F1;"></div>\n                      </div>\n                      <div class="reply-box-warp" style="transition: none;">\n                        <div class="textarea-wrap">\n                          <textarea class="reply-box-textarea" placeholder="请先登录后发表评论"></textarea>\n                        </div>\n                        <div class="disable-mask">\n                          <div class="no-login-mask">\n                            <span>请先</span>\n                            <span class="login-btn">登录</span>\n                            <span>后发表评论（＾ω＾）</span>\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n                <div class="reply-list"></div>\n              </div>\n            </div>\n          `;
        }
        async function enableSwitchingSortType() {
            const elements = await waitFor(() => {
                const selectedReplyElement = document.querySelector(".comment-container .reply-header .nav-select-reply");
                const hotSortElement = document.querySelector(".comment-container .reply-header .hot-sort");
                const timeSortElement = document.querySelector(".comment-container .reply-header .time-sort");
                if (selectedReplyElement || hotSortElement && timeSortElement) return {
                    selectedReplyElement: selectedReplyElement,
                    hotSortElement: hotSortElement,
                    timeSortElement: timeSortElement
                };
            });
            const {selectedReplyElement: selectedReplyElement, hotSortElement: hotSortElement, timeSortElement: timeSortElement} = elements;
            if (selectedReplyElement) return;
            hotSortElement.style.color = "#18191C";
            timeSortElement.style.color = "#9499A0";
            hotSortElement.addEventListener("click", () => {
                if (state.currentSortType === sortTypeConstant.HOT) return;
                state.currentSortType = sortTypeConstant.HOT;
                hotSortElement.style.color = "#18191C";
                timeSortElement.style.color = "#9499A0";
                loadFirstPagination();
            });
            timeSortElement.addEventListener("click", () => {
                if (state.currentSortType === sortTypeConstant.LATEST) return;
                state.currentSortType = sortTypeConstant.LATEST;
                hotSortElement.style.color = "#9499A0";
                timeSortElement.style.color = "#18191C";
                loadFirstPagination();
            });
        }
        async function loadFirstPagination() {
            state.paginationOffsets[state.currentSortType] = {
                1: defaultPaginationOffsetStr
            };
            const {data: firstPaginationData, code: resultCode} = await getPaginationData(1);
            await waitFor(() => {
                if (document.body.contains(state.replyList)) return true;
                state.replyList = document.querySelector(".reply-list");
                return document.body.contains(state.replyList);
            });
            state.replyList.innerHTML = "";
            if (resultCode !== 0) {
                state.replyList.innerHTML = '<p style="padding: 100px 0; text-align: center; color: #999;">无法从 API 获取评论数据</p>';
                addAnchor(true);
                return;
            }
            const totalReplyElement = document.querySelector(".comment-container .reply-header .total-reply");
            const totalReplyCount = parseInt(firstPaginationData?.cursor?.all_count) || 0;
            totalReplyElement.textContent = totalReplyCount;
            if (totalReplyCount === 0) {
                state.replyList.innerHTML = '<p style="padding: 100px 0; text-align: center; color: #999;">没有更多评论</p>';
                addAnchor(true);
                return;
            }
            if (firstPaginationData.top_replies && firstPaginationData.top_replies.length !== 0) {
                const topReplyData = firstPaginationData.top_replies[0];
                appendReplyItem(topReplyData, true);
            }
            for (const replyData of firstPaginationData.replies) appendReplyItem(replyData);
            addAnchor();
        }
        async function getPaginationData(paginationNumber) {
            if (!state.paginationOffsets[state.currentSortType]) state.paginationOffsets[state.currentSortType] = {
                1: defaultPaginationOffsetStr
            };
            const offsetCache = state.paginationOffsets[state.currentSortType];
            if (!offsetCache[1]) offsetCache[1] = defaultPaginationOffsetStr;
            if (!offsetCache[paginationNumber]) {
                if (paginationNumber !== 1) return {
                    code: -1,
                    data: {
                        replies: []
                    }
                };
                offsetCache[paginationNumber] = defaultPaginationOffsetStr;
            }
            const params = {
                oid: state.oid,
                type: state.commentType,
                wts: parseInt(Date.now() / 1e3, 10),
                mode: state.currentSortType === sortTypeConstant.HOT ? 3 : 2,
                pagination_str: offsetCache[paginationNumber]
            };
            const url = `https://api.bilibili.com/x/v2/reply/wbi/main?${await getWbiQueryString(params)}`;
            const result = await fetch(url).then(res => res.json());
            const nextOffset = extractNextOffset(result);
            if (nextOffset) offsetCache[paginationNumber + 1] = `{"offset":"${nextOffset}"}`;
            return result;
        }
        function extractNextOffset(result) {
            const cursor = result?.data?.cursor;
            let paginationReply = cursor?.pagination_reply;
            if (!paginationReply) return cursor?.next_offset || cursor?.next;
            if (typeof paginationReply === "string") try {
                paginationReply = JSON.parse(paginationReply);
            } catch (err) {
                return paginationReply;
            }
            if (typeof paginationReply === "object") return paginationReply.next_offset || paginationReply.offset || paginationReply.next;
            return;
        }
        function appendReplyItem(replyData, isTopReply) {
            const replyItemElement = document.createElement("div");
            replyItemElement.classList.add("reply-item");
            replyItemElement.innerHTML = `\n          <div class="root-reply-container">\n            <a class="root-reply-avatar" href="https://space.bilibili.com/${replyData.mid}" target="_blank" data-user-id="${replyData.mid}" data-root-reply-id="${replyData.rpid}">\n              <div class="avatar">\n                <div class="bili-avatar">\n                  <img class="bili-avatar-img bili-avatar-face bili-avatar-img-radius" data-src="${replyData.member.avatar}" alt="" src="${replyData.member.avatar}">\n                  ${replyData.member.pendant.image ? `\n                    <div class="bili-avatar-pendent-dom" style="transform: scale(0.85);">\n                      <img class="bili-avatar-img" data-src="${replyData.member.pendant.image}" alt="" src="${replyData.member.pendant.image}">\n                    </div>\n                    ` : ""}\n                  <span class="bili-avatar-icon bili-avatar-right-icon  bili-avatar-size-40"></span>\n                </div>\n              </div>\n            </a>\n            <div class="content-warp">\n              <div class="reply-decorate">\n                <div class="user-sailing">\n                  ${replyData.member.user_sailing?.cardbg ? `\n                    <img class="user-sailing-img" src="${replyData.member.user_sailing.cardbg.image}@576w.webp">\n                    <div class="user-sailing-text" style="color: ${replyData.member.user_sailing.cardbg.fan.color}">\n                      <span class="sailing-text">NO.</span>\n                      <br>\n                      <span class="sailing-text">${replyData.member.user_sailing.cardbg.fan.number.toString().padStart(6, "0")}</span>\n                    </div>\n                    ` : ""}\n                </div>\n              </div>\n              <div class="user-info">\n                <a class="user-name" href="https://space.bilibili.com/${replyData.mid}" target="_blank" data-user-id="${replyData.mid}" data-root-reply-id="${replyData.rpid}" style="color: ${replyData.member.vip.nickname_color ? replyData.member.vip.nickname_color : "#61666d"}">${replyData.member.uname}</a>\n                <span style="height: 16px; padding: 0 2px; margin-right: 4px; display: flex; align-items: center; font-size: 12px; color: white; border-radius: 2px; background-color: ${getMemberLevelColor(replyData.member.level_info.current_level)};">LV${replyData.member.level_info.current_level}</span>\n                ${state.creatorId === replyData.mid ? '<i class="svg-icon up-web up-icon" style="width: 24px; height: 24px;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="4" width="24" height="16" rx="2" fill="#FF6699"></rect><path d="M5.7 8.36V12.79C5.7 13.72 5.96 14.43 6.49 14.93C6.99 15.4 7.72 15.64 8.67 15.64C9.61 15.64 10.34 15.4 10.86 14.92C11.38 14.43 11.64 13.72 11.64 12.79V8.36H10.47V12.81C10.47 13.43 10.32 13.88 10.04 14.18C9.75 14.47 9.29 14.62 8.67 14.62C8.04 14.62 7.58 14.47 7.3 14.18C7.01 13.88 6.87 13.43 6.87 12.81V8.36H5.7ZM13.0438 8.36V15.5H14.2138V12.76H15.9838C17.7238 12.76 18.5938 12.02 18.5938 10.55C18.5938 9.09 17.7238 8.36 16.0038 8.36H13.0438ZM14.2138 9.36H15.9138C16.4238 9.36 16.8038 9.45 17.0438 9.64C17.2838 9.82 17.4138 10.12 17.4138 10.55C17.4138 10.98 17.2938 11.29 17.0538 11.48C16.8138 11.66 16.4338 11.76 15.9138 11.76H14.2138V9.36Z" fill="white"></path></svg></i>' : ""}\n              </div>\n              <div class="root-reply">\n                <span class="reply-content-container root-reply" style="padding-bottom: 8px;">\n                  <span class="reply-content">${isTopReply ? '<span class="top-icon">置顶</span>' : ""}${replyData.content.pictures ? `<div class="note-prefix" style="transform: translateY(-2px);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="#BBBBBB"><path d="M0 3.75C0 2.784.784 2 1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25Zm1.75-.25a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25ZM3.5 6.25a.75.75 0 0 1 .75-.75h7a.75.75 0 0 1 0 1.5h-7a.75.75 0 0 1-.75-.75Zm.75 2.25h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1 0-1.5Z"></path></svg><div style="margin-left: 3px;">笔记</div></div>` : ""}${getConvertedMessage(replyData.content)}</span>\n                </span>\n                ${replyData.content.pictures ? `\n                  <div class="image-exhibition" style="margin: 8px 0; user-select: none;">\n                    <div class="preview-image-container" style="display: flex;">\n                      ${getImageItems(replyData.content.pictures)}\n                    </div>\n                  </div>\n                  ` : ""}\n                <div class="reply-info">\n                  <span class="reply-time" style="margin-right: 20px;">${getFormattedTime(replyData.ctime)}</span>\n                  <span class="reply-like">\n                    <i class="svg-icon like use-color like-icon" style="width: 16px; height: 16px;"><svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3323" width="200" height="200"><path d="M594.176 151.168a34.048 34.048 0 0 0-29.184 10.816c-11.264 13.184-15.872 24.064-21.504 40.064l-1.92 5.632c-5.632 16.128-12.8 36.864-27.648 63.232-25.408 44.928-50.304 74.432-86.208 97.024-23.04 14.528-43.648 26.368-65.024 32.576v419.648a4569.408 4569.408 0 0 0 339.072-4.672c38.72-2.048 72-21.12 88.96-52.032 21.504-39.36 47.168-95.744 63.552-163.008a782.72 782.72 0 0 0 22.528-163.008c0.448-16.832-13.44-32.256-35.328-32.256h-197.312a32 32 0 0 1-28.608-46.336l0.192-0.32 0.64-1.344 2.56-5.504c2.112-4.8 5.12-11.776 8.32-20.16 6.592-17.088 13.568-39.04 16.768-60.416 4.992-33.344 3.776-60.16-9.344-84.992-14.08-26.688-30.016-33.728-40.512-34.944zM691.84 341.12h149.568c52.736 0 100.864 40.192 99.328 98.048a845.888 845.888 0 0 1-24.32 176.384 742.336 742.336 0 0 1-69.632 178.56c-29.184 53.44-84.48 82.304-141.76 85.248-55.68 2.88-138.304 5.952-235.712 5.952-96 0-183.552-3.008-244.672-5.76-66.432-3.136-123.392-51.392-131.008-119.872a1380.672 1380.672 0 0 1-0.768-296.704c7.68-72.768 70.4-121.792 140.032-121.792h97.728c13.76 0 28.16-5.504 62.976-27.456 24.064-15.104 42.432-35.2 64.512-74.24 11.904-21.184 17.408-36.928 22.912-52.8l2.048-5.888c6.656-18.88 14.4-38.4 33.28-60.416a97.984 97.984 0 0 1 85.12-32.768c35.264 4.096 67.776 26.88 89.792 68.608 22.208 42.176 21.888 84.864 16 124.352a342.464 342.464 0 0 1-15.424 60.544z m-393.216 477.248V405.184H232.96c-40.448 0-72.448 27.712-76.352 64.512a1318.912 1318.912 0 0 0 0.64 282.88c3.904 34.752 32.96 61.248 70.4 62.976 20.8 0.96 44.8 1.92 71.04 2.816z" p-id="3324" fill="#9499a0"></path></svg></i>\n                    <span>${replyData.like}</span>\n                  </span>\n                  <span class="reply-dislike">\n                    <i class="svg-icon dislike use-color dislike-icon" style="width: 16px; height: 16px;"><svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3933" width="200" height="200"><path d="M594.112 872.768a34.048 34.048 0 0 1-29.12-10.816c-11.264-13.248-15.872-24.064-21.504-40.064l-1.92-5.632c-5.632-16.128-12.8-36.864-27.712-63.232-25.344-44.928-50.24-74.432-86.144-97.024-23.104-14.528-43.648-26.432-65.024-32.64V203.84a4570.24 4570.24 0 0 1 339.072 4.672c38.656 2.048 72 21.12 88.896 52.032 21.504 39.36 47.232 95.744 63.552 163.008 16.448 67.52 21.568 123.776 22.592 163.008 0.448 16.832-13.44 32.256-35.392 32.256h-197.248a32 32 0 0 0-28.608 46.336l0.128 0.32 0.64 1.28 2.56 5.568c2.176 4.8 5.12 11.776 8.384 20.16 6.528 17.088 13.568 39.04 16.768 60.416 4.928 33.344 3.712 60.16-9.344 84.992-14.08 26.688-30.016 33.728-40.576 34.944z m97.728-190.016h149.568c52.8 0 100.864-40.128 99.392-97.92a846.336 846.336 0 0 0-24.32-176.448 742.016 742.016 0 0 0-69.632-178.56c-29.248-53.44-84.48-82.304-141.824-85.248-55.68-2.88-138.24-5.952-235.712-5.952-96 0-183.488 3.008-244.672 5.76-66.368 3.136-123.328 51.392-130.944 119.872a1380.608 1380.608 0 0 0-0.768 296.704c7.68 72.768 70.4 121.792 140.032 121.792h97.728c13.76 0 28.16 5.504 62.976 27.392 24.064 15.168 42.432 35.264 64.448 74.368 11.968 21.12 17.472 36.864 22.976 52.736l2.048 5.888c6.656 18.88 14.336 38.4 33.216 60.416 19.456 22.72 51.456 36.736 85.184 32.768 35.2-4.096 67.776-26.88 89.792-68.672 22.208-42.112 21.888-84.8 16-124.288a343.04 343.04 0 0 0-15.488-60.608zM298.688 205.568v413.184H232.96c-40.512 0-72.448-27.712-76.352-64.512a1318.912 1318.912 0 0 1 0.64-282.88c3.904-34.816 32.896-61.248 70.4-62.976 20.8-0.96 44.736-1.92 71.04-2.816z" p-id="3934" fill="#9499a0"></path></svg></i>\n                  </span>\n                  <span class="reply-btn">回复</span>\n                  <span class="history-lookup-btn" data-uid="${replyData.mid}" data-nickname="${escapeAttr(replyData.member.uname)}">查看成分</span>\n                </div>\n                <div class="reply-tag-list">\n                  ${replyData.card_label ? replyData.card_label.reduce((acc, cur) => acc + `<span class="reply-tag-item ${cur.text_content === "热评" ? "reply-tag-hot" : ""} ${cur.text_content === "UP主觉得很赞" ? "reply-tag-liked" : ""}" style="font-size: 12px; background-color: ${cur.label_color_day}; color: ${cur.text_color_day};">${cur.text_content}</span>`, "") : ""}\n                </div>\n              </div>\n            </div>\n          </div>\n          <div class="sub-reply-container">\n            <div class="sub-reply-list">\n              ${getSubReplyItems(replyData.replies) || ""}\n              ${replyData.rcount > (replyData.replies?.length ?? 0) ? `\n                <div class="view-more" style="padding-left: 8px; font-size: 13px; color: #9499A0;">\n                  <div class="view-more-default">\n                    <span>共${replyData.rcount}条回复</span>\n                    <span class="view-more-btn" style="cursor: pointer;">点击查看</span>\n                  </div>\n                </div>\n                ` : ""}\n            </div>\n          </div>\n          <div class="bottom-line"></div>\n        `;
            state.replyList.appendChild(replyItemElement);
            const previewImageContainer = replyItemElement.querySelector(".preview-image-container");
            if (previewImageContainer) new Viewer(previewImageContainer, {
                title: false,
                toolbar: false,
                tooltip: false,
                keyboard: false
            });
            const subReplyList = replyItemElement.querySelector(".sub-reply-list");
            const viewMoreBtn = replyItemElement.querySelector(".view-more-btn");
            viewMoreBtn && viewMoreBtn.addEventListener("click", () => {
                loadPaginatedSubReplies(replyData.rpid, subReplyList, replyData.rcount, 1);
            });
        }
        function getFormattedTime(ms) {
            const time = new Date(ms * 1e3);
            const year = time.getFullYear();
            const month = (time.getMonth() + 1).toString().padStart(2, "0");
            const day = time.getDate().toString().padStart(2, "0");
            const hour = time.getHours().toString().padStart(2, "0");
            const minute = time.getMinutes().toString().padStart(2, "0");
            return `${year}-${month}-${day} ${hour}:${minute}`;
        }
        function getMemberLevelColor(level) {
            return {
                0: "#C0C0C0",
                1: "#BBBBBB",
                2: "#8BD29B",
                3: "#7BCDEF",
                4: "#FEBB8B",
                5: "#EE672A",
                6: "#F04C49"
            }[level];
        }
        function getConvertedMessage(content) {
            let result = content.message;
            const keywordBlacklist = [ "https://www.bilibili.com/video/av", "https://b23.tv/mall-" ];
            if (content.vote && content.vote.deleted === false) {
                const linkElementHTML = `<a class="jump-link normal" href="${content.vote.url}" target="_blank" noopener noreferrer>${content.vote.title}</a>`;
                keywordBlacklist.push(linkElementHTML);
                result = result.replace(`{vote:${content.vote.id}}`, linkElementHTML);
            }
            if (content.emote) for (const [key, value] of Object.entries(content.emote)) {
                const imageElementHTML = `<img class="emoji-${[ "", "small", "large" ][value.meta.size]}" src="${value.url}" alt="${key}">`;
                keywordBlacklist.push(imageElementHTML);
                result = result.replaceAll(key, imageElementHTML);
            }
            result = result.replaceAll(/(\d{1,2}[:：]){1,2}\d{1,2}/g, timestamp => {
                timestamp = timestamp.replaceAll("：", ":");
                if (!(videoRE.test(global.location.href) || bangumiRE.test(global.location.href) || festivalRE.test(global.location.href))) return timestamp;
                const parts = timestamp.split(":");
                if (parts.some(part => parseInt(part) >= 60)) return timestamp;
                let totalSecond;
                if (parts.length === 2) totalSecond = parseInt(parts[0]) * 60 + parseInt(parts[1]); else if (parts.length === 3) totalSecond = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
                if (Number.isNaN(totalSecond)) return timestamp;
                const linkElementHTML = `<a class="jump-link video-time" onclick="window.player.mediaElement().currentTime = ${totalSecond}; window.scrollTo(0, 0); window.player.play();">${timestamp}</a>`;
                keywordBlacklist.push(linkElementHTML);
                return linkElementHTML;
            });
            if (content.at_name_to_mid) for (const [key, value] of Object.entries(content.at_name_to_mid)) {
                const linkElementHTML = `<a class="jump-link user" data-user-id="${value}" href="https://space.bilibili.com/${value}" target="_blank" noopener noreferrer>@${key}</a>`;
                keywordBlacklist.push(linkElementHTML);
                result = result.replaceAll(`@${key}`, linkElementHTML);
            }
            if (Object.keys(content.jump_url).length) {
                const entries = [].concat(Object.entries(content.jump_url).filter(entry => entry[0].startsWith("https://")), Object.entries(content.jump_url).filter(entry => !entry[0].startsWith("https://")));
                for (const [key, value] of entries) {
                    const href = key.startsWith("BV") || /^av\d+$/.test(key) ? `https://www.bilibili.com/video/${key}` : value.pc_url || key;
                    if (href.includes("search.bilibili.com") && keywordBlacklist.join("").includes(key)) continue;
                    const linkElementHTML = `<img class="icon normal" src="${value.prefix_icon}" style="${value.extra && value.extra.is_word_search && "width: 12px;"}"><a class="jump-link normal" href="${href}" target="_blank" noopener noreferrer>${value.title}</a>`;
                    keywordBlacklist.push(linkElementHTML);
                    result = result.replaceAll(key, linkElementHTML);
                }
            }
            return result;
        }
        function escapeAttr(text) {
            return String(text ?? "").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        }
        function getImageItems(images) {
            images = images.slice(0, 3);
            const imageSizeConfig = {
                1: "max-width: 280px; max-height: 180px;",
                2: "width: 128px; height: 128px;",
                3: "width: 96px; height: 96px;"
            }[images.length];
            let result = "";
            for (const image of images) result += `<div class="image-item-wrap" style="margin-right: 4px; cursor: zoom-in;"><img src="${image.img_src}" style="border-radius: 4px; ${imageSizeConfig}"></div>`;
            return result;
        }
        function getSubReplyItems(subReplies) {
            if (!subReplies || subReplies.length === 0) return;
            let result = "";
            for (const replyData of subReplies) result += `\n            <div class="sub-reply-item">\n              <div class="sub-user-info">\n                <a class="sub-reply-avatar" href="https://space.bilibili.com/${replyData.mid}" target="_blank" data-user-id="${replyData.mid}" data-root-reply-id="${replyData.rpid}">\n                  <div class="avatar">\n                    <div class="bili-avatar">\n                      <img class="bili-avatar-img bili-avatar-face bili-avatar-img-radius" data-src="${replyData.member.avatar}" alt="" src="${replyData.member.avatar}">\n                      <span class="bili-avatar-icon bili-avatar-right-icon  bili-avatar-size-24"></span>\n                    </div>\n                  </div>\n                </a>\n                <a class="sub-user-name" href="https://space.bilibili.com/${replyData.mid}" target="_blank" data-user-id="${replyData.mid}" data-root-reply-id="${replyData.rpid}" style="color: ${replyData.member.vip.nickname_color ? replyData.member.vip.nickname_color : "#61666d"}">${replyData.member.uname}</a>\n                <span style="height: 16px; padding: 0 2px; margin-right: 4px; display: flex; align-items: center; font-size: 12px; color: white; border-radius: 2px; background-color: ${getMemberLevelColor(replyData.member.level_info.current_level)};">LV${replyData.member.level_info.current_level}</span>\n                ${state.creatorId === replyData.mid ? `<i class="svg-icon up-web up-icon" style="width: 24px; height: 24px;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="4" width="24" height="16" rx="2" fill="#FF6699"></rect><path d="M5.7 8.36V12.79C5.7 13.72 5.96 14.43 6.49 14.93C6.99 15.4 7.72 15.64 8.67 15.64C9.61 15.64 10.34 15.4 10.86 14.92C11.38 14.43 11.64 13.72 11.64 12.79V8.36H10.47V12.81C10.47 13.43 10.32 13.88 10.04 14.18C9.75 14.47 9.29 14.62 8.67 14.62C8.04 14.62 7.58 14.47 7.3 14.18C7.01 13.88 6.87 13.43 6.87 12.81V8.36H5.7ZM13.0438 8.36V15.5H14.2138V12.76H15.9838C17.7238 12.76 18.5938 12.02 18.5938 10.55C18.5938 9.09 17.7238 8.36 16.0038 8.36H13.0438ZM14.2138 9.36H15.9138C16.4238 9.36 16.8038 9.45 17.0438 9.64C17.2838 9.82 17.4138 10.12 17.4138 10.55C17.4138 10.98 17.2938 11.29 17.0538 11.48C16.8138 11.66 16.4338 11.76 15.9138 11.76H14.2138V9.36Z" fill="white"></path></svg></i>` : ""}\n              </div>\n              <span class="reply-content-container sub-reply-content">\n                <span class="reply-content">${getConvertedMessage(replyData.content)}</span>\n              </span>\n              <div class="sub-reply-info" style="margin: 4px 0;">\n                <span class="sub-reply-time" style="margin-right: 20px;">${getFormattedTime(replyData.ctime)}</span>\n                <span class="sub-reply-like">\n                  <i class="svg-icon like use-color sub-like-icon" style="width: 16px; height: 16px;"><svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3323" width="200" height="200"><path d="M594.176 151.168a34.048 34.048 0 0 0-29.184 10.816c-11.264 13.184-15.872 24.064-21.504 40.064l-1.92 5.632c-5.632 16.128-12.8 36.864-27.648 63.232-25.408 44.928-50.304 74.432-86.208 97.024-23.04 14.528-43.648 26.368-65.024 32.576v419.648a4569.408 4569.408 0 0 0 339.072-4.672c38.72-2.048 72-21.12 88.96-52.032 21.504-39.36 47.168-95.744 63.552-163.008a782.72 782.72 0 0 0 22.528-163.008c0.448-16.832-13.44-32.256-35.328-32.256h-197.312a32 32 0 0 1-28.608-46.336l0.192-0.32 0.64-1.344 2.56-5.504c2.112-4.8 5.12-11.776 8.32-20.16 6.592-17.088 13.568-39.04 16.768-60.416 4.992-33.344 3.776-60.16-9.344-84.992-14.08-26.688-30.016-33.728-40.512-34.944zM691.84 341.12h149.568c52.736 0 100.864 40.192 99.328 98.048a845.888 845.888 0 0 1-24.32 176.384 742.336 742.336 0 0 1-69.632 178.56c-29.184 53.44-84.48 82.304-141.76 85.248-55.68 2.88-138.304 5.952-235.712 5.952-96 0-183.552-3.008-244.672-5.76-66.432-3.136-123.392-51.392-131.008-119.872a1380.672 1380.672 0 0 1-0.768-296.704c7.68-72.768 70.4-121.792 140.032-121.792h97.728c13.76 0 28.16-5.504 62.976-27.456 24.064-15.104 42.432-35.2 64.512-74.24 11.904-21.184 17.408-36.928 22.912-52.8l2.048-5.888c6.656-18.88 14.4-38.4 33.28-60.416a97.984 97.984 0 0 1 85.12-32.768c35.264 4.096 67.776 26.88 89.792 68.608 22.208 42.176 21.888 84.864 16 124.352a342.464 342.464 0 0 1-15.424 60.544z m-393.216 477.248V405.184H232.96c-40.448 0-72.448 27.712-76.352 64.512a1318.912 1318.912 0 0 0 0.64 282.88c3.904 34.752 32.96 61.248 70.4 62.976 20.8 0.96 44.8 1.92 71.04 2.816z" p-id="3324" fill="#9499a0"></path></svg></i>\n                  <span>${replyData.like}</span>\n                </span>\n                <span class="sub-reply-dislike">\n                  <i class="svg-icon dislike use-color sub-dislike-icon" style="width: 16px; height: 16px;"><svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3933" width="200" height="200"><path d="M594.112 872.768a34.048 34.048 0 0 1-29.12-10.816c-11.264-13.248-15.872-24.064-21.504-40.064l-1.92-5.632c-5.632-16.128-12.8-36.864-27.712-63.232-25.344-44.928-50.24-74.432-86.144-97.024-23.104-14.528-43.648-26.432-65.024-32.64V203.84a4570.24 4570.24 0 0 1 339.072 4.672c38.656 2.048 72 21.12 88.896 52.032 21.504 39.36 47.232 95.744 63.552 163.008 16.448 67.52 21.568 123.776 22.592 163.008 0.448 16.832-13.44 32.256-35.392 32.256h-197.248a32 32 0 0 0-28.608 46.336l0.128 0.32 0.64 1.28 2.56 5.568c2.176 4.8 5.12 11.776 8.384 20.16 6.528 17.088 13.568 39.04 16.768 60.416 4.928 33.344 3.712 60.16-9.344 84.992-14.08 26.688-30.016 33.728-40.576 34.944z m97.728-190.016h149.568c52.8 0 100.864-40.128 99.392-97.92a846.336 846.336 0 0 0-24.32-176.448 742.016 742.016 0 0 0-69.632-178.56c-29.248-53.44-84.48-82.304-141.824-85.248-55.68-2.88-138.24-5.952-235.712-5.952-96 0-183.488 3.008-244.672 5.76-66.368 3.136-123.328 51.392-130.944 119.872a1380.608 1380.608 0 0 0-0.768 296.704c7.68 72.768 70.4 121.792 140.032 121.792h97.728c13.76 0 28.16 5.504 62.976 27.392 24.064 15.168 42.432 35.264 64.448 74.368 11.968 21.12 17.472 36.864 22.976 52.736l2.048 5.888c6.656 18.88 14.336 38.4 33.216 60.416 19.456 22.72 51.456 36.736 85.184 32.768 35.2-4.096 67.776-26.88 89.792-68.672 22.208-42.112 21.888-84.8 16-124.288a343.04 343.04 0 0 0-15.488-60.608zM298.688 205.568v413.184H232.96c-40.512 0-72.448-27.712-76.352-64.512a1318.912 1318.912 0 0 1 0.64-282.88c3.904-34.816 32.896-61.248 70.4-62.976 20.8-0.96 44.736-1.92 71.04-2.816z" p-id="3934" fill="#9499a0"></path></svg></i>\n                </span>\n              <span class="sub-reply-btn">回复</span>\n              <span class="history-lookup-btn" data-uid="${replyData.mid}" data-nickname="${escapeAttr(replyData.member.uname)}">查看成分</span>\n              </div>\n            </div>\n          `;
            return result;
        }
        async function loadPaginatedSubReplies(rootReplyID, subReplyList, subReplyAmount, paginationNumber) {
            const subReplyData = await fetch(`https://api.bilibili.com/x/v2/reply/reply?oid=${state.oid}&pn=${paginationNumber}&ps=10&root=${rootReplyID}&type=${state.commentType}`).then(res => res.json()).then(json => json.data);
            if (subReplyData.replies) subReplyList.innerHTML = getSubReplyItems(subReplyData.replies);
            addSubReplyPageSwitcher(rootReplyID, subReplyList, subReplyAmount, paginationNumber);
        }
        function addSubReplyPageSwitcher(rootReplyID, subReplyList, subReplyAmount, currentPageNumber) {
            if (subReplyAmount <= 10) return;
            const pageAmount = Math.ceil(subReplyAmount / 10);
            const pageSwitcher = document.createElement("div");
            pageSwitcher.classList.add("view-more");
            pageSwitcher.innerHTML = `\n          <div class="view-more-pagination">\n            <span class="pagination-page-count">共${pageAmount}页</span>\n            ${currentPageNumber !== 1 ? '<span class="pagination-btn pagination-to-prev-btn">上一页</span>' : ""}\n            ${(() => {
                const left = [ currentPageNumber - 4, currentPageNumber - 3, currentPageNumber - 2, currentPageNumber - 1 ].filter(num => num >= 1);
                const right = [ currentPageNumber + 1, currentPageNumber + 2, currentPageNumber + 3, currentPageNumber + 4 ].filter(num => num <= pageAmount);
                const merge = [].concat(left, currentPageNumber, right);
                let chosen;
                if (currentPageNumber <= 3) chosen = merge.slice(0, 5); else if (currentPageNumber >= pageAmount - 3) chosen = merge.reverse().slice(0, 5).reverse(); else chosen = merge.slice(merge.indexOf(currentPageNumber) - 2, merge.indexOf(currentPageNumber) + 3);
                let final = JSON.parse(JSON.stringify(chosen));
                if (!final.includes(1)) {
                    let front = [ 1 ];
                    if (final.at(0) !== 2) front = [ 1, "..." ];
                    final = [].concat(front, final);
                }
                if (!final.includes(pageAmount)) {
                    let back = [ pageAmount ];
                    if (final.at(-1) !== pageAmount - 1) back = [ "...", pageAmount ];
                    final = [].concat(final, back);
                }
                return final.reduce((acc, cur) => {
                    if (cur === "...") return acc + '<span class="pagination-page-dot">...</span>';
                    if (cur === currentPageNumber) return acc + `<span class="pagination-page-number current-page">${cur}</span>`;
                    return acc + `<span class="pagination-page-number">${cur}</span>`;
                }, "");
            })()}\n            ${currentPageNumber !== pageAmount ? '<span class="pagination-btn pagination-to-next-btn">下一页</span>' : ""}\n          </div>\n        `;
            pageSwitcher.querySelector(".pagination-to-prev-btn")?.addEventListener("click", () => loadPaginatedSubReplies(rootReplyID, subReplyList, subReplyAmount, currentPageNumber - 1));
            pageSwitcher.querySelector(".pagination-to-next-btn")?.addEventListener("click", () => loadPaginatedSubReplies(rootReplyID, subReplyList, subReplyAmount, currentPageNumber + 1));
            pageSwitcher.querySelectorAll(".pagination-page-number:not(.current-page)")?.forEach(pageNumberElement => {
                const number = parseInt(pageNumberElement.textContent);
                pageNumberElement.addEventListener("click", () => loadPaginatedSubReplies(rootReplyID, subReplyList, subReplyAmount, number));
            });
            subReplyList.appendChild(pageSwitcher);
        }
        function addAnchor(cleanOnly) {
            const oldPageSwitcher = document.querySelector(".comment-container .reply-warp .page-switcher");
            oldPageSwitcher && oldPageSwitcher.remove();
            const oldAnchor = document.querySelector(".comment-container .reply-warp .anchor-for-loading");
            oldAnchor && oldAnchor.remove();
            replyAutoLoadObserver && replyAutoLoadObserver.disconnect();
            replyAutoLoadObserver = null;
            if (cleanOnly) return;
            const anchorElement = document.createElement("div");
            anchorElement.classList.add("anchor-for-loading");
            anchorElement.textContent = "正在加载...";
            anchorElement.style = `\n          width: calc(100% - 22px);\n          height: 40px;\n          margin-left: 22px;\n          display: flex;\n          justify-content: center;\n          align-items: center;\n          transform: translateY(-60px);\n          color: #61666d;\n        `;
            document.querySelector(".comment-container .reply-warp").appendChild(anchorElement);
            let paginationCounter = 1;
            let isLoading = false;
            replyAutoLoadObserver = new IntersectionObserver(async entries => {
                if (!entries[0].isIntersecting) return;
                if (isLoading) return;
                isLoading = true;
                const nextPage = ++paginationCounter;
                const {data: newPaginationData, code: resultCode} = await getPaginationData(nextPage);
                const replyLength = newPaginationData?.replies?.length || 0;
                if (!newPaginationData?.replies || replyLength === 0) {
                    anchorElement.textContent = "所有评论已加载完毕";
                    replyAutoLoadObserver.disconnect();
                    replyAutoLoadObserver = null;
                    return;
                }
                if (resultCode !== 0) {
                    anchorElement.textContent = "评论加载失败";
                    replyAutoLoadObserver.disconnect();
                    replyAutoLoadObserver = null;
                    return;
                }
                for (const replyData of newPaginationData.replies) appendReplyItem(replyData);
                anchorElement.textContent = "正在加载...";
                isLoading = false;
            });
            replyAutoLoadObserver.observe(anchorElement);
        }
        function setupCommentBtnModifier() {
            if (document.documentElement.dataset.commentBtnModifierBound === "1") return;
            document.documentElement.dataset.commentBtnModifierBound = "1";
            const findDetailUrl = dynItem => {
                const links = dynItem.querySelectorAll("a[href]");
                for (const link of links) {
                    const href = link.href || link.getAttribute("href");
                    if (!href) continue;
                    if (/^https?:\/\/t\.bilibili\.com\/\d+/.test(href)) return href;
                }
                for (const link of links) {
                    const href = link.href || link.getAttribute("href");
                    if (!href) continue;
                    if (/^https?:\/\/www\.bilibili\.com\/opus\/\d+/.test(href)) return href;
                }
                return null;
            };
            document.addEventListener("click", event => {
                const commentEl = event.target?.closest?.(".bili-dyn-action.comment");
                if (!commentEl) return;
                const dynItem = commentEl.closest(".bili-dyn-item");
                if (!dynItem) return;
                const url = findDetailUrl(dynItem);
                if (!url) return;
                event.preventDefault();
                event.stopImmediatePropagation();
                global.location.href = url;
            }, true);
        }
        function addStyle() {
            const avatarCSS = document.createElement("style");
            avatarCSS.textContent = `\n          .reply-item .root-reply-avatar .avatar .bili-avatar {\n            width: 48px;\n            height: 48px;\n          }\n\n          .sub-reply-item .sub-reply-avatar .avatar .bili-avatar {\n            width: 30px;\n            height: 30px;\n          }\n\n          @media screen and (max-width: 1620px) {\n            .reply-item .root-reply-avatar .avatar .bili-avatar {\n              width: 40px;\n              height: 40px;\n            }\n\n            .sub-reply-item .sub-reply-avatar .avatar .bili-avatar {\n              width: 24px;\n              height: 24px;\n            }\n          }\n        `;
            document.head.appendChild(avatarCSS);
            const viewMoreCSS = document.createElement("style");
            viewMoreCSS.textContent = `\n          .sub-reply-container .view-more-btn:hover {\n            color: #00AEEC;\n          }\n\n          .view-more {\n            padding-left: 8px;\n            color: #222;\n            font-size: 13px;\n            user-select: none;\n          }\n\n          .pagination-page-count {\n            margin-right: 10px;\n          }\n\n          .pagination-page-dot,\n          .pagination-page-number {\n            margin: 0 4px;\n          }\n\n          .pagination-btn,\n          .pagination-page-number {\n            cursor: pointer;\n          }\n\n          .current-page,\n          .pagination-btn:hover,\n          .pagination-page-number:hover {\n            color: #00AEEC;\n          }\n        `;
            document.head.appendChild(viewMoreCSS);
            const pageSwitcherCSS = document.createElement("style");
            pageSwitcherCSS.textContent = `\n          .page-switcher-wrapper {\n            display: flex;\n            font-size: 14px;\n            color: #666;\n            user-select: none;\n          }\n\n          .page-switcher-wrapper span {\n            margin-right: 6px;\n          }\n\n          .page-switcher-wrapper span:not(.page-switcher-dot){\n            display: flex;\n            padding: 0 14px;\n            height: 38px;\n            align-items: center;\n            border: 1px solid #D7DDE4;\n            border-radius: 4px;\n            cursor: pointer;\n            transition: border-color 0.2s;\n          }\n\n          .page-switcher-prev-btn:hover,\n          .page-switcher-next-btn:hover,\n          .page-switcher-number:hover {\n            border-color: #00A1D6 !important;\n          }\n\n          .page-switcher-current-page {\n            color: white;\n            background-color: #00A1D6;\n            border-color: #00A1D6 !important;\n          }\n\n          .page-switcher-dot {\n            padding: 0 5px;\n            display: flex;\n            align-items: center;\n            color: #CCC;\n          }\n\n          .page-switcher-prev-btn__disabled,\n          .page-switcher-next-btn__disabled {\n            color: #D7DDE4 !important;\n            cursor: not-allowed !important;\n          }\n        `;
            document.head.appendChild(pageSwitcherCSS);
            const otherCSS = document.createElement("style");
            otherCSS.textContent = `\n          .jump-link {\n            color: #008DDA;\n          }\n\n          .login-tip,\n          .fixed-reply-box,\n          .v-popover:has(.login-panel-popover) {\n            display: none;\n          }\n        `;
            document.head.appendChild(otherCSS);
            if (dynamicRE.test(global.location.href) || opusRE.test(global.location.href)) {
                const dynPageCSS = document.createElement("style");
                dynPageCSS.textContent = `\n            #app .opus-detail {\n              min-width: 960px;\n            }\n\n            #app .opus-detail .right-sidebar-wrap {\n              margin-left: 980px !important;\n              transition: none;\n            }\n\n            #app > .content {\n              min-width: 960px;\n            }\n\n            .v-popover:has(.login-panel-popover),\n            .fixed-reply-box,\n            .login-tip {\n              display: none;\n            }\n\n            .note-prefix {\n              fill: #BBBBBB;\n            }\n\n            .bili-comment-container svg {\n              fill: inherit !important;\n            }\n          `;
                document.head.appendChild(dynPageCSS);
            }
            if (festivalRE.test(global.location.href)) {
                const miscCSS = document.createElement("style");
                miscCSS.textContent = `\n            :root {\n              --text1: #18191C;\n              --text3: #9499A0;\n              --brand_pink: #FF6699;\n              --graph_bg_thick: #e3e5e7;\n            }\n\n            .page-switcher {\n              margin-top: 40px;\n            }\n\n            .van-popover:has(.unlogin-popover) {\n              display: none !important;\n            }\n          `;
                document.head.appendChild(miscCSS);
            }
        }
        function setupVideoChangeHandler() {
            if (festivalRE.test(global.location.href)) {
                let record;
                const getBVID = () => global?.__INITIAL_STATE__?.videoInfo?.bvid;
                setInterval(() => {
                    if (!record) record = getBVID(); else if (record !== getBVID()) global.location.href = `${global.location.origin}${global.location.pathname}?bvid=${getBVID()}`;
                }, 1e3);
            }
            if (videoRE.test(global.location.href) || bangumiRE.test(global.location.href)) {
                const getPageKey = () => {
                    const url = new URL(global.location.href);
                    const p = url.searchParams.get("p");
                    const oid = url.searchParams.get("oid");
                    const params = new URLSearchParams;
                    if (p) params.set("p", p);
                    if (oid) params.set("oid", oid);
                    const qs = params.toString();
                    return url.origin + url.pathname + (qs ? `?${qs}` : "");
                };
                let oldHref = getPageKey();
                setInterval(() => {
                    const newHref = getPageKey();
                    if (oldHref !== newHref) {
                        oldHref = newHref;
                        start();
                    }
                }, 1e3);
            }
        }
    }
})();
