// ==UserScript==
// @name         BilibiliCover - 获取并显示B站视频封面图片
// @version      3.9.0
// @description  获取并显示B站视频封面
// @author       AnnAngela
// @namespace    https://greasyfork.org/users/129402
// @mainpage     https://greasyfork.org/zh-CN/scripts/33411-bilibilicover
// @supportURL   https://greasyfork.org/zh-CN/scripts/33411-bilibilicover/feedback
// @license      GNU General Public License v3.0 or later
// @compatible   chrome 80
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @match        https://www.bilibili.com/watchlater/#/*
// @match        https://www.bilibili.com/video/av*
// @match        https://www.bilibili.com/video/bv*
// @match        https://www.bilibili.com/video/BV*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.bilibili.com/medialist/play/watchlater/*
// @match        https://live.bilibili.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @noframes
// @icon         https://public.annangela.cn/script/Bilibili.png
// @icon64       https://public.annangela.cn/script/Bilibili.png
// @downloadURL https://update.greasyfork.org/scripts/33411/BilibiliCover%20-%20%E8%8E%B7%E5%8F%96%E5%B9%B6%E6%98%BE%E7%A4%BAB%E7%AB%99%E8%A7%86%E9%A2%91%E5%B0%81%E9%9D%A2%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/33411/BilibiliCover%20-%20%E8%8E%B7%E5%8F%96%E5%B9%B6%E6%98%BE%E7%A4%BAB%E7%AB%99%E8%A7%86%E9%A2%91%E5%B0%81%E9%9D%A2%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==
"use strict";
/**
 * @type {Window & typeof globalThis}
 */
const win = unsafeWindow;
const doc = win.document;
win.addEventListener("load", () => {
    let response;
    const helper = {
        Uri: class Uri {
            constructor(href = location.href) {
                this._url = new URL(href);
                this.query = Object.fromEntries(Array.from(this._url.searchParams.entries()));
                this.protocol = this._url.protocol.replace(/:$/, "");
                this.user = this._url.username;
                this.password = this._url.password;
                this.host = this._url.hostname;
                this.port = this._url.port;
                this.path = this._url.pathname;
                this.fragment = this._url.hash.length > 0 ? `#${decodeURIComponent(this._url.hash).substring(1)}` : "";
            }
            _updateUrl() {
                this._url.protocol = `${(this.protocol || "").replace(/:$/, "")}:`;
                this._url.username = this.user;
                this._url.password = this.password;
                this._url.hostname = this.host;
                this._url.port = this.port;
                this._url.pathname = this.path;
                this._url.hash = `#${this.fragment.replace(/^#/, "")}`.replace(/^#$/, "");
                this._url.search = "";
                Object.entries(this.query).forEach(([k, v]) => {
                    this._url.searchParams.set(k, v);
                });
            }
            getUserInfo() {
                this._updateUrl();
                return this.user.length > 0 ? `${this.user}:${this.password}` : "";
            }
            getHostPort() {
                this._updateUrl();
                return this._url.host;
            }
            getAuthority() {
                this._updateUrl();
                const userInfo = this.getUserInfo();
                const hostPort = this.getHostPort();
                return userInfo.length > 0 ? `${userInfo}@${hostPort}` : hostPort;
            }
            getQueryString() {
                this._updateUrl();
                return this._url.search.substring(1);
            }
            getRelativePath() {
                this._updateUrl();
                return this.path + this._url.search + this.fragment;
            }
            toString() {
                this._updateUrl();
                return this._url.href;
            }
        },
        hsts: function (link) {
            try {
                let url = link?.toString?.();
                if (url.startsWith("//")) {
                    url = `https:${url}`;
                }
                else if (url.startsWith("http:")) {
                    url = url.replace(/^http:/, "https:");
                }
                return url;
            } catch {
                return link;
            }
        },
        coverImage: function (url) {
            /* 本函数来自 https://greasyfork.org/zh-CN/scripts/30714-获取哔哩哔哩视频的封面图片-get-bilibili-cover-image/code?version=202372 特此感谢*/
            let coverImageBigUrl = url;
            // 去除url中的裁剪标识
            if (url.indexOf("@") > -1) {
                //处理以@做裁剪标识的url
                coverImageBigUrl = url.split("@")[0];
            }
            if (url.indexOf("jpg_") > -1) {
                //处理以_做裁剪标识的url
                coverImageBigUrl = `${url.split("jpg_")[0]}jpg`;
            }
            if (url.indexOf("png_") > -1) {
                //处理以_做裁剪标识的url
                coverImageBigUrl = `${url.split("png_")[0]}png`;
            }
            if (url.indexOf("/320_200/") > -1) {
                //有时裁剪标识是在后缀名之前的 目前主要发现的是“番剧”板块的列表里有，但尚不清楚其他地方的情况
                coverImageBigUrl = url.replace("/320_200", "");
            }
            return coverImageBigUrl;
        },
        /**
         * @type {Window | undefined}
         */
        window: undefined,
        openWin: function (wind, src) {
            if (this.window) {
                this.setImg(src);
            } else {
                const doc = wind.document;
                const w = wind.outerWidth || doc.docElement.clientWidth || doc.body.clientWidth,
                    h = wind.outerHeight || doc.docElement.clientHeight || doc.body.clientHeight;
                this.window = window.open("about:blank", "bilibiliCover", `location=1,scrollbars=1,channelmode=1,width=${w * 0.8},height=${h * 0.8},left=${w * 0.1},top=${h * 0.1}`);
                setTimeout(() => {
                    this.window.document.title = "BilibiliCover - 封面获取窗口";
                    this.window.document.body.innerHTML = `<div style="text-align: start;">视频封面地址：</div><textarea readonly="readonly" style="width: 100%; height: 1.1em; font-size: 24px; box-sizing: content-box; overflow: hidden; background-color: white; color: initial;"></textarea><hr><img src="${src}" style="max-width: 100%; height: auto; min-height: 300px;"><p id="realsize" style="text-align: center;"></p>`;
                    this.window.document.body.innerHTML += "<style> a { cursor: pointer; background-position: center right;background-repeat: no-repeat;background-image: -webkit-linear-gradient(transparent, transparent), url(data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%2210%22%3E%3Cg%20transform%3D%22translate%28-826.429%20-698.791%29%22%3E%3Crect%20width%3D%225.982%22%20height%3D%225.982%22%20x%3D%22826.929%22%20y%3D%22702.309%22%20fill%3D%22%23fff%22%20stroke%3D%22%2306c%22%2F%3E%3Cg%3E%3Cpath%20d%3D%22M831.194%20698.791h5.234v5.391l-1.571%201.545-1.31-1.31-2.725%202.725-2.689-2.689%202.808-2.808-1.311-1.311z%22%20fill%3D%22%2306f%22%2F%3E%3Cpath%20d%3D%22M835.424%20699.795l.022%204.885-1.817-1.817-2.881%202.881-1.228-1.228%202.881-2.881-1.851-1.851z%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E); background-image: linear-gradient(transparent, transparent), url(data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%2210%22%3E%3Cg%20transform%3D%22translate%28-826.429%20-698.791%29%22%3E%3Crect%20width%3D%225.982%22%20height%3D%225.982%22%20x%3D%22826.929%22%20y%3D%22702.309%22%20fill%3D%22%23fff%22%20stroke%3D%22%2306c%22%2F%3E%3Cg%3E%3Cpath%20d%3D%22M831.194%20698.791h5.234v5.391l-1.571%201.545-1.31-1.31-2.725%202.725-2.689-2.689%202.808-2.808-1.311-1.311z%22%20fill%3D%22%2306f%22%2F%3E%3Cpath%20d%3D%22M835.424%20699.795l.022%204.885-1.817-1.817-2.881%202.881-1.228-1.228%202.881-2.881-1.851-1.851z%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E); padding-right: 13px; } </style>";
                    this.window.document.body.innerHTML += '<p style="display: flex; flex-wrap: nowrap; justify-content: space-around;"><a target="_blank" id="baidu">Baidu识图搜索</a><a target="_blank" id="google">Google识图搜索</a></p>';
                    this.window.document.body.style.textAlign = "center";
                    this.setImg(src);
                    const t = this.window.document.querySelector("textarea");
                    t.addEventListener("mouseup", (e) => {
                        if (e.which !== 1) { return; }
                        const selection = this.window.getSelection();
                        if (selection.toString() !== "") { return; }
                        this.focus();
                        this.select();
                    });
                    const gLink = this.window.document.querySelector("#google");
                    gLink.addEventListener("mousedown", () => {
                        gLink.href = `https://www.google.com/searchbyimage?encoded_image=&image_content=&filename=&hl=zh-CN&image_url=${encodeURIComponent(t.value)}`;
                    }, {
                        capture: true,
                    });
                    const bLink = this.window.document.querySelector("#baidu");
                    bLink.addEventListener("click", (e) => {
                        const s = getComputedStyle(bLink);
                        if (s.fontWeight === "700") {
                            return;
                        }
                        if (s.cursor === "not-allowed") {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            e.stopPropagation();
                            return;
                        }
                        bLink.style.cursor = "not-allowed";
                        bLink.style.fontStyle = "italic";
                        bLink.innerText = "正在预搜索中，不要离开，请稍候……";
                        GM_xmlhttpRequest({
                            url: `https://graph.baidu.com/upload?tn=pc&from=pc&image_source=PC_UPLOAD_IMAGE_ICONURL&image=${encodeURIComponent(t.value)}`,
                            method: "POST",
                            headers: {
                                referer: "https://image.baidu.com/",
                                origin: "https://image.baidu.com",
                            },
                            onerror: (detail) => {
                                this.window.alert(`百度识图搜索失败：网络故障\n${detail}`);
                                bLink.innerText = "Baidu识图搜索";
                            },
                            onload: (res) => {
                                if (getComputedStyle(bLink).cursor !== "not-allowed") {
                                    return;
                                }
                                let response;
                                try {
                                    response = JSON.parse(res.responseText);
                                    console.info("BilibiliCover", "BaiduNetworkResponse", res, JSON.parse(res.response));
                                } catch (e) {
                                    response = false;
                                    console.error("BilibiliCover", "BaiduNetworkResponse", res, e);
                                }
                                if (!response) {
                                    this.window.alert(`百度识图搜索失败：返回数据无法识别\n${res.responseText}`);
                                    bLink.innerText = "Baidu识图搜索";
                                    return;
                                }
                                if (!response.data || !response.data.url) {
                                    this.window.alert(`百度识图搜索失败：返回数据格式错误\n${res.responseText}`);
                                    bLink.innerText = "Baidu识图搜索";
                                    return;
                                }
                                bLink.href = response.data.url;
                                bLink.style.cursor = "pointer";
                                bLink.style.fontStyle = "normal";
                                bLink.style.fontWeight = "700";
                                bLink.innerText = "预搜索完成，请再次点击此处以使用Baidu识图搜索！";
                            },
                        });
                    }, {
                        capture: true,
                    });
                    this.window.addEventListener("beforeunload", () => {
                        this.window = undefined;
                    });
                    this.window.focus();
                    this.window.addEventListener("load", () => {
                        this.resize();
                    });
                    this.window.document.querySelector("img").addEventListener("load", () => {
                        this.resize();
                    });
                    this.window.addEventListener("resize", () => {
                        this.resize();
                    });
                    this.window.setInterval(() => {
                        this.resize();
                    }, 500);
                    this.resize();
                }, 0);
            }
        },
        resize: function () {
            if (!this.window) { return; }
            const collection = this.window.document.querySelectorAll("body > *:not(img):not(style)");
            let totalHeight = 0;
            Array.from(collection).forEach((t) => {
                totalHeight += this.getRealHeight(t);
            });
            this.window.document.querySelector("body > img").style.maxHeight = `calc(100vh - ${totalHeight}px)`;
        },
        getRealHeight: function (ele) {
            const style = (this.window || window).getComputedStyle(ele);
            let realHeight = 0;
            ["marginTop", "paddingTop", "height", "paddingBottom", "marginBottom", "borderTopWith", "borderBottomWith"].forEach((p) => {
                const v = style[p];
                if (/^\d/.test(v)) { realHeight += parseFloat(v); }
            });
            return realHeight;
        },
        setImg: function (src) {
            if (!this.window) { return; }
            const img = this.window.document.querySelector("img");
            this.window.document.querySelector("img").src = src;
            this.window.document.querySelector("textarea").value = src;
            const bLink = this.window.document.querySelector("#baidu");
            bLink.style.cursor = "pointer";
            bLink.style.fontStyle = "normal";
            bLink.style.fontWeight = "400";
            bLink.innerText = "Baidu识图搜索";
            this.setNaturalSize(img, this.window.document.querySelector("#realsize"));
            this.window.focus();
        },
        setNaturalSize: function (img, node) {
            if (img.naturalWidth > 0 && img.naturalHeight > 0) { node.innerText = `(${img.naturalWidth}×${img.naturalHeight})`; }
            else {
                setTimeout(() => {
                    this.setNaturalSize(img, node);
                }, 100);
            }
        },
        closeWin: function () {
            if (this.window) {
                this.window.close();
            }
        },
    };
    const url = new helper.Uri();
    const match = (str) => (str.match(/(?:\/video\/|\/watchlater\/(?:#\/)?)(av\d+|[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9})/) || [0, -1])[1];
    if (win.location.host.includes("www.bilibili.com")) {
        const wait = () => {
            if (!doc.querySelector(".bilibili-player-video-btn-quality > .bilibili-player-video-quality-menu.bui-select-quality-menu, .bpx-player-ctrl-quality > .bpx-player-ctrl-quality-menu")) {
                return true;
            }
            const v = doc.getElementsByTagName("video");
            if (v.length === 0) {
                return true;
            }
            const vb = doc.getElementsByTagName("video")[0].buffered;
            if (!(vb instanceof TimeRanges)) {
                return true;
            }
            try {
                const vbe = vb.end(vb.length - 1);
                if (typeof vbe !== "number" || vbe < 2) {
                    return true;
                }
            } catch {
                return true;
            }
            return false;
        };
        const c = setInterval(() => {
            if (wait()) {
                return;
            }
            const plw = doc.querySelector("#arc_toolbar_report > .ops, #toolbar_module, .video-toolbar-module, .play-options-ul, #arc_toolbar_report > .toolbar-left");
            if (!plw) {
                return;
            }
            const coin = plw.querySelector(".coin, .coin-info span, .coin-box .num, :scope > li:nth-child(2) > span");
            if (!/\d+/.test(coin?.innerText?.trim?.() ?? "--")) {
                return;
            }
            clearInterval(c);
            let IS_ORIGIN_VIDEO = true;
            let IS_NEW_BANGUMI = false;
            const IS_WATCHLATER = url.toString().includes("/watchlater/#/");
            const IS_NEW_WATCHLATER = url.toString().includes("/watchlater/");
            const svgFromNewPanel = coin.querySelector("svg");
            let aid_bvid = match(url.toString());
            if (aid_bvid === -1) {
                if (!IS_WATCHLATER && !IS_NEW_WATCHLATER && (url.path.match(/\/bangumi\/play\/(?:ep|ss)(\d+)/) || [0, -1])[1] !== -1) {
                    IS_NEW_BANGUMI = true;
                }
                IS_ORIGIN_VIDEO = false;
            }
            const style = doc.querySelector("#bilibiliCoverStyle") || doc.createElement("style");
            style.innerText = '.bilibiliCoverButtonInWatcherLater { background: rgba(0, 0, 0, 0) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'22\' height=\'22\' style=\'\'%3E%3Crect id=\'backgroundrect\' width=\'100%25\' height=\'100%25\' x=\'0\' y=\'0\' fill=\'none\' stroke=\'none\'/%3E%3Cg class=\'currentLayer\' style=\'\'%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cpath d=\'M17.982 9.275L8.06 3.27A2.013 2.013 0 005 4.994v12.011a2.017 2.017 0 003.06 1.725l9.922-6.005a2.017 2.017 0 000-3.45z\' id=\'svg_1\' class=\'selected\' fill=\'%23757575\' fill-opacity=\'1\'/%3E%3C/g%3E%3C/svg%3E") no-repeat scroll 50% 50% / 100% padding-box border-box };';
            style.id = "bilibiliCoverStyle";
            if (style.parentElement !== doc.body) { doc.body.appendChild(style); }
            const img = doc.createElement("img");
            img.addEventListener("error", (...args) => {
                args.unshift("BilibiliCover");
                args.unshift("NetworkError");
                console.error(...args);
                const s = new helper.Uri(img.src);
                s.query.t = new Date().getTime();
                img.src = s;
            });
            try {
                const meta = doc.querySelector('meta[property="og:image"], meta[itemprop="image"], meta[itemprop="thumbnailUrl"]');
                const metacontent = meta.getAttribute("content");
                const metacontentUri = new helper.Uri(metacontent);
                if (metacontentUri.host.endsWith("hdslb.com") && metacontentUri.path.startsWith("/bfs/")) {
                    img.src = helper.hsts(metacontent);
                }
            } catch { }
            /**
             * 
             * @param {string} ifIsOriginVideo 
             * @param {string} ifIsNewBangumi 
             * @param {string} ifIsWatchLater 
             * @param {string} ifIsNewWatchLater 
             * @returns {string}
             */
            const detectType = (ifIsOriginVideo, ifIsNewBangumi, ifIsWatchLater, ifIsNewWatchLater) => {
                switch (true) {
                    case IS_WATCHLATER: return ifIsWatchLater;
                    case IS_NEW_WATCHLATER: return ifIsNewWatchLater;
                    case IS_ORIGIN_VIDEO: return ifIsOriginVideo;
                    case IS_NEW_BANGUMI: return ifIsNewBangumi;
                }
            };
            setInterval(() => {
                if (doc.querySelector("#BilibiliCoverButton")) {
                    return;
                }
                if (wait()) {
                    return;
                }
                const button = doc.createElement(detectType("span", "div", "div", "span"));
                button.id = "BilibiliCoverButton";
                button.title = "获取封面";
                button.innerHTML = detectType("<i class=\"van-icon-info_playnumber\"></i>获取封面", "<i class=\"iconfont icon-views\" style=\"display: inline-block; vertical-align: top; width: 28px; height: 28px; line-height: 28px; font-size: 28px; color: #757575; margin-right: 4px; text-align: center;\"></i><span style=\"display: inline-block; vertical-align: top; width: 62px; height: 28px; line-height: 28px; font-size: 14px; color: #505050;\">获取封面</span>", "<div class=\"btn-item\"><i class=\"icon-move s-icon-moved bilibiliCoverButtonInWatcherLater\" style=\"background-size: 50px;\"></i><span class=\"t\">获取封面</span><span class=\"num\">鼠标悬浮查看</span></div>", '<i class="bilibiliCoverButtonInWatcherLater" style="width: 28px; height: 28px; display: inline-block;"></i> <span>获取封面</span></li>');
                if (IS_NEW_BANGUMI) {
                    button.setAttribute("style", "display: block; float: left; height: 36px; margin-left: 12px; cursor: pointer;");
                }
                if (IS_WATCHLATER) {
                    button.setAttribute("style", "position: relative; float: left;");
                }
                if (svgFromNewPanel) {
                    const svgFromNewPanelStyle = getComputedStyle(svgFromNewPanel);
                    const i = button.querySelector("i");
                    i.style.height = svgFromNewPanelStyle.height;
                    i.style.width = svgFromNewPanelStyle.width;
                    i.style.lineHeight = svgFromNewPanelStyle.height;
                    i.style.fontSize = svgFromNewPanelStyle.width;
                }
                if (IS_NEW_WATCHLATER) {
                    button.setAttribute(coin.getAttributeNames().filter((n) => n.startsWith("data-v-"))[0], "");
                    button.querySelectorAll("*").forEach((ele) => {
                        ele.setAttribute(coin.getAttributeNames().filter((n) => n.startsWith("data-v-"))[0], "");
                    });
                }
                let code = null;
                button.addEventListener("click", () => {
                    const src = img.src;
                    if (src) {
                        helper.openWin(window, src, 1);
                    }
                });
                button.addEventListener("mouseover", () => {
                    if (code) {
                        code = null;
                        clearTimeout(code);
                    }
                    img.style.display = "block";
                    let X = 0,
                        Y = 0,
                        W = 0;
                    let p = button;
                    do {
                        X += p.offsetTop;
                        Y += p.offsetLeft;
                        p = p.offsetParent;
                    } while (p !== doc.body);
                    const style = win.getComputedStyle(button);
                    X += parseInt(style.marginTop) + parseInt(style.height) + parseInt(style.marginBottom) + 10;
                    Y += parseInt(style.marginLeft) + parseInt(style.width) + parseInt(style.marginRight) + 10;
                    W = win.innerWidth - Y - 150;
                    if (W > img.naturalWidth) { W = img.naturalWidth; }
                    img.style.top = `${X - W * img.naturalHeight / img.naturalWidth - 10}px`;
                    img.style.left = `${Y}px`;
                    img.style.width = `${W}px`;
                    img.style.opacity = "1";
                });
                button.addEventListener("mouseleave", () => {
                    if (code) {
                        code = null;
                        clearTimeout(code);
                    }
                    img.style.opacity = "0";
                    code = setTimeout(() => {
                        img.style.top = "-99999px";
                        code = null;
                    }, 130);
                });
                if (plw.querySelector(".more")) {
                    plw.insertBefore(button, plw.querySelector(".more"));
                }
                else {
                    plw.appendChild(button);
                }
            }, 500);
            style.innerText += ".video-toolbar .ops .app { margin-right: 12px; }";
            img.id = "cover_img";
            doc.body.appendChild(img);
            img.style.position = "absolute";
            img.style.top = "-99999px";
            img.style.left = "0";
            img.style.zIndex = "99999";
            img.style.border = "1px black solid";
            img.style.opacity = "0";
            img.style.transition = "opacity .13s linear";
            img.style.display = "none";
            let running = false;
            const err = (...args) => {
                args.unshift("BilibiliCover");
                args.unshift("NetworkError:");
                console.error(...args);
                img.alt = args.map((e) => { return JSON.stringify(e); }).join("\n");
                running = false;
            };
            setInterval(() => {
                if (!running && IS_ORIGIN_VIDEO || IS_WATCHLATER) {
                    const aidDetected = match(new helper.Uri().toString());
                    if (aidDetected !== -1 && aidDetected !== aid_bvid || !img.src) {
                        aid_bvid = aidDetected;
                        running = true;
                        GM_xmlhttpRequest({
                            url: `https://api.bilibili.com/x/web-interface/search/type?search_type=video&keyword=${aid_bvid}`,
                            method: "GET",
                            onerror: err,
                            onload: (res) => {
                                try {
                                    response = JSON.parse(res.responseText);
                                } catch (e) {
                                    response = false;
                                }
                                console.info("BilibiliCover", "NetworkResponse:", res, ", parse result:", response);
                                if (!response) {
                                    err("Unable to parse response");
                                    return;
                                }
                                const data = response.data.result;
                                if (!Array.isArray(data)) {
                                    err(`Backend returns incompatible data(${typeof data})`);
                                    return;
                                }
                                let cover;
                                data.forEach((info) => {
                                    if ((`av${info.aid}` === aid_bvid || info.bvid === aid_bvid) && info.pic) {
                                        cover = helper.hsts(helper.coverImage(info.pic));
                                    }
                                });
                                if (cover) {
                                    img.src = helper.hsts(cover);
                                } else {
                                    err("Unable to get the cover picture url");
                                }
                                running = false;
                            },
                        });
                    }
                } else {
                    try {
                        img.src = helper.hsts(helper.coverImage(doc.querySelector("#bofqi .bilibili-player-watchlater-item[data-state-play=true] .bilibili-player-watchlater-cover-cell img, .bangumi-info-wrapper .info-cover img, #media_module > a > img, .player-auxiliary-playlist-item-active .player-auxiliary-playlist-item-img-self").src));
                        // clearInterval(loop_code);
                        img.removeAttribute("alt");
                    } catch (_) {
                        console.info("bilibiliCover:", "no img");
                        img.alt = "bilibiliCover: no img";
                    }
                }
            }, 100);
        }, 500);
    } else if (win.location.host.includes("live.bilibili.com")) {
        const link = win.document.createElement("div");
        const error = (...args) => {
            const detail = args[0];
            link.innerHTML = `<span style="color: red">封面获取失败=。=（${detail}）</span>`;
            args.unshift("BilibiliCover");
            args.unshift("NetworkError");
            console.error(...args);
        };
        (function loop() {
            const roomid = win.location.pathname.match(/^\/(?:blanc\/)?(\d+)/)[1];
            // const userName = (((unsafeWindow.document.querySelector(".room-owner-username") || {}).href || "").match(/\d+/) || [])[0];
            if (roomid) {
                const container = win.document.querySelector(".seeds-wrap");
                if (!container) { return setTimeout(loop, 100); }
                GM_xmlhttpRequest({
                    url: `https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom?room_id=${roomid}`,
                    method: "GET",
                    onerror: error,
                    onload: (res) => {
                        link.style.display = "inline-block";
                        link.style.marginLeft = link.style.marginRight = "1em";
                        link.style.verticalAlign = "bottom";
                        link.innerHTML = '<a href="javascript:void(0);" style="color: #23ade5;">查看封面</a>';
                        container.insertBefore(link, container.firstChild);
                        console.info("BilibiliCover", "NetworkResponse", res, JSON.parse(res.response));
                        try {
                            response = JSON.parse(res.responseText);
                        } catch (e) {
                            response = false;
                        }
                        if (!response) { error("无法解析后端返回数据", res); }
                        const cover = response.data?.room_info?.cover;
                        if (!cover) {
                            error("解析出现错误", response);
                        } else {
                            link.querySelector("a").addEventListener("click", () => {
                                helper.openWin(win, cover);
                            });
                        }
                    },
                });
            }
        })();
    }
    window.addEventListener("beforeunload", () => {
        helper.closeWin();
    });
});