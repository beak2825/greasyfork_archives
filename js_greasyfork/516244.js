// ==UserScript==
// @name         媒体下载器
// @version      1.1.8
// @description  简化操作步骤
// @author       金辉
// @match        *://*/*
// @license         MIT
// @require      https://cdn.jsdelivr.net/npm/m3u8-parser@4.7.1/dist/m3u8-parser.min.js
// @connect      *
// @grant        unsafeWindow
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @run-at       document-start
// @namespace https://greasyfork.org/users/1357115
// @downloadURL https://update.greasyfork.org/scripts/516244/%E5%AA%92%E4%BD%93%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/516244/%E5%AA%92%E4%BD%93%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const mgmapi = {
        addStyle(s) {
            let style = document.createElement("style");
            style.innerHTML = s;
            document.documentElement.appendChild(style);
        },
        copyText(text) {
            copyTextToClipboard(text);
            function copyTextToClipboard(text) {
                // 复制文本
                var copyFrom = document.createElement("textarea");
                copyFrom.textContent = text;
                document.body.appendChild(copyFrom);
                copyFrom.select();
                document.execCommand('copy');
                copyFrom.blur();
                document.body.removeChild(copyFrom);
            }
        },
        message(text, disappearTime = 5000) {
            const id = "f8243rd238-gm-message-panel";
            let p = document.querySelector(`#${id}`);
            if (!p) {
                p = document.createElement("div");
                p.id = id;
                p.style = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: end;
                    z-index: 999999999999999;
                `;
                (document.body || document.documentElement).appendChild(p);
            }
            let mdiv = document.createElement("div");
            mdiv.innerText = text;
            mdiv.style = `
                padding: 3px 8px;
                border-radius: 5px;
                background: black;
                box-shadow: #000 1px 2px 5px;
                margin-top: 10px;
                font-size: small;
                color: #fff;
                text-align: right;
            `;
            p.appendChild(mdiv);
            setTimeout(() => {
                p.removeChild(mdiv);
            }, disappearTime);
        }
    };

    // 目前只用于获取顶部标题
    window.addEventListener("message", async (e) => {
        if (e.data === "3j4t9uj349-gm-get-title") {
            let name = `top-title-${Date.now()}`;
            GM_setValue(name, document.title||"");
            e.source.postMessage(`3j4t9uj349-gm-top-title-name:${name}`, "*");
        }
    });

    async function getTopTitle() {
        return new Promise(resolve => {
            window.addEventListener("message", async function l(e) {
                if (typeof e.data === "string") {
                    if (e.data.startsWith("3j4t9uj349-gm-top-title-name:")) {
                        let name = e.data.slice("3j4t9uj349-gm-top-title-name:".length);
                        await new Promise(r => setTimeout(r, 5)); // 等5毫秒 确定上面 GM_setValue 已经写入
                        resolve(GM_getValue(name));
                        GM_deleteValue(name);
                        window.removeEventListener("message", l);
                    }
                }
            });
            window.top.postMessage("3j4t9uj349-gm-get-title", "*");
        });
    }


    {
        // 请求检测
        const _fetch = unsafeWindow.fetch;
        unsafeWindow.fetch = function (...args) {
            if (checkUrl(args[0]))  GM_openInTab(args[0]);
            return _fetch(...args);
        }
        const _r_text = unsafeWindow.Response.prototype.text;
        unsafeWindow.Response.prototype.text = function () {
            return new Promise((resolve, reject) => {
                _r_text.call(this).then((text) => {
                    resolve(text);                    
                    if (checkContent(text)) doM3U({ url: this.url, content: text });
                }).catch(reject);
            });
        }

        const _open = unsafeWindow.XMLHttpRequest.prototype.open;
        unsafeWindow.XMLHttpRequest.prototype.open = function (...args) {
            this.addEventListener("load", () => {
                try {
                    let content = this.responseText;                    
                    if (checkContent(content)) doM3U({ url: args[1], content });
                } catch { }
            });
            if(this&&this.resource&&this.resource.url&&checkUrl(this.resource.url)){GM_openInTab(this.resource.url)}
            return _open.apply(this, args);
        }
        function checkUrl(url) {
            url = new URL(url, location.href);
            if (url.pathname.endsWith(".mp4") || url.pathname.endsWith(".mp3")) {
                // 发现
               if(GM_getValue(url.pathname)){
                    return false;
                }
                GM_setValue(url.pathname,1);
                return true;
            }
        }
        function checkContent(content) {
            if (content.trim().startsWith("#EXTM3U")) {
                return true;
            }
        }


        // 检查纯视频
        setInterval(doVideos, 1000);

    }

    const rootDiv = document.createElement("div");
    rootDiv.style = `
        position: fixed;
        z-index: 9999999999999999;
        left:50px;
        top:50px;
        opacity: 0.9;
    `;
    rootDiv.style.display = "none";
    document.documentElement.appendChild(rootDiv);

    const shadowDOM = rootDiv.attachShadow({ mode: 'open' });
    const wrapper = document.createElement("div");
    shadowDOM.appendChild(wrapper);


    // 指示器
    const bar = document.createElement("div");
    bar.style = `
        text-align: right;
    `;
    bar.innerHTML = `
        <span
            class="number-indicator"
            data-number="0"
            style="
                display: inline-flex;
                width: 25px;
                height: 25px;
                background: black;
                padding: 10px;
                border-radius: 100px;
                margin-bottom: 5px;
                cursor: pointer;
                border: 3px solid #83838382;
            "
        >
            <svg
            style="
                filter: invert(1);
            "
            version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 585.913 585.913" style="enable-background:new 0 0 585.913 585.913;" xml:space="preserve">
                <g>
                    <path d="M11.173,46.2v492.311l346.22,47.402V535.33c0.776,0.058,1.542,0.109,2.329,0.109h177.39
                    c20.75,0,37.627-16.883,37.627-37.627V86.597c0-20.743-16.877-37.628-37.627-37.628h-177.39c-0.781,0-1.553,0.077-2.329,0.124V0
                    L11.173,46.2z M110.382,345.888l-1.37-38.273c-0.416-11.998-0.822-26.514-0.822-41.023l-0.415,0.01
                    c-2.867,12.767-6.678,26.956-10.187,38.567l-10.961,38.211l-15.567-0.582l-9.239-37.598c-2.801-11.269-5.709-24.905-7.725-37.361
                    l-0.25,0.005c-0.503,12.914-0.879,27.657-1.503,39.552L50.84,343.6l-17.385-0.672l5.252-94.208l25.415-0.996l8.499,32.064
                    c2.724,11.224,5.467,23.364,7.428,34.819h0.389c2.503-11.291,5.535-24.221,8.454-35.168l9.643-33.042l27.436-1.071l5.237,101.377
                    L110.382,345.888z M172.479,349.999c-12.569-0.504-23.013-4.272-28.539-8.142l4.504-17.249c3.939,2.226,13.1,6.445,22.373,6.687
                    c12.009,0.32,18.174-5.497,18.174-13.218c0-10.068-9.838-14.683-19.979-14.74l-9.253-0.052v-16.777l8.801-0.066
                    c7.708-0.208,17.646-3.262,17.646-11.905c0-6.121-4.914-10.562-14.635-10.331c-7.95,0.189-16.245,3.914-20.213,6.446l-4.52-16.693
                    c5.693-4.008,17.224-8.11,29.883-8.588c21.457-0.795,33.643,10.407,33.643,24.625c0,11.029-6.197,19.691-18.738,24.161v0.314
                    c12.229,2.216,22.266,11.663,22.266,25.281C213.89,338.188,197.866,351.001,172.479,349.999z M331.104,302.986
                    c0,36.126-19.55,52.541-51.193,51.286c-29.318-1.166-46.019-17.103-46.019-52.044v-61.104l25.711-1.006v64.201
                    c0,19.191,7.562,29.146,21.179,29.502c14.234,0.368,22.189-8.976,22.189-29.26v-66.125l28.122-1.097v65.647H331.104z
                    M359.723,70.476h177.39c8.893,0,16.125,7.236,16.125,16.126v411.22c0,8.888-7.232,16.127-16.125,16.127h-177.39
                    c-0.792,0-1.563-0.116-2.329-0.232V380.782c17.685,14.961,40.504,24.032,65.434,24.032c56.037,0,101.607-45.576,101.607-101.599
                    c0-56.029-45.581-101.603-101.607-101.603c-24.93,0-47.749,9.069-65.434,24.035V70.728
                    C358.159,70.599,358.926,70.476,359.723,70.476z M390.873,364.519V245.241c0-1.07,0.615-2.071,1.586-2.521
                    c0.981-0.483,2.13-0.365,2.981,0.307l93.393,59.623c0.666,0.556,1.065,1.376,1.065,2.215c0,0.841-0.399,1.67-1.065,2.215
                    l-93.397,59.628c-0.509,0.4-1.114,0.61-1.743,0.61l-1.233-0.289C391.488,366.588,390.873,365.585,390.873,364.519z" />
                </g>
            </svg>
        </span>
    `;

    wrapper.appendChild(bar);

    // 样式
    const style = document.createElement("style");

    style.innerHTML = `
        .number-indicator{
            position:relative;
        }

        .number-indicator::after{
            content: attr(data-number);
            position: absolute;
            bottom: 0;
            right: 0;
            color: #40a9ff;
            font-size: 14px;
            font-weight: bold;
            background: #000;
            border-radius: 10px;
            padding: 3px 5px;
        }

        .copy-link:active{
            color: #ccc;
        }

        .download-btn:hover{
            text-decoration: underline;
        }
        .download-btn:active{
            opacity: 0.9;
        }

        .m3u8-item{
            color: white;
            margin-bottom: 5px;
            display: flex;
            flex-direction: row;
            background: black;
            padding: 3px 10px;
            border-radius: 3px;
            font-size: 14px;
            user-select: none;
        }

        [data-shown="false"] {
            opacity: 0.8;
            zoom: 0.8;
        }

        [data-shown="false"]:hover{
            opacity: 1;
        }

        [data-shown="false"] .m3u8-item{
            display: none;
        }

    `;

    wrapper.appendChild(style);

    let count = 0;
    let shownUrls = [];


    function doVideos() {
        for (let v of Array.from(document.querySelectorAll("video"))) {
            if (v.duration && v.src && v.src.startsWith("http") && (!shownUrls.includes(v.src))) {
                const src = v.src;

                shownUrls.push(src);
                showVideo({
                    type: "video",
                    url: new URL(src),
                    duration: `${Math.ceil(v.duration * 10 / 60) / 10} mins`,
                    download() {
                        const details = {
                            url: src,
                            name: (() => {
                                let name = new URL(src).pathname.split("/").slice(-1)[0];
                                if (!/\.\w+$/.test(name)) {
                                    if (name.match(/^\s*$/)) name = Date.now();
                                    name = name + ".mp4";
                                }
                                return name;
                            })(),
                            headers: {
                                // referer: location.origin, // 不允许该头
                                origin: location.origin
                            },
                            onerror(e) {
                                GM_openInTab(src);
                            }
                        };
                        GM_download(details);
                    }
                })
            }
        }
    }

    async function doM3U({ url, content }) {
        url = new URL(url);
        if (shownUrls.includes(url.href)) return;

        // 解析 m3u
        content = content || await (await fetch(url)).text();

        const parser = new m3u8Parser.Parser();
        parser.push(content);
        parser.end();
        const manifest = parser.manifest;

        if (manifest.segments) {
            let duration = 0;
            manifest.segments.forEach((segment) => {
                duration += segment.duration;
            });
            manifest.duration = duration;
        }

        showVideo({
            type: "m3u8",
            url,
            duration: manifest.duration ? `${Math.ceil(manifest.duration * 10 / 60) / 10} mins` : manifest.playlists ? `多(Multi)(${manifest.playlists.length})` : "未知(unknown)",
            async download() {
                let filename=await getTopTitle();
                let postdata={"url":url.href,"name":filename};
                GM_xmlhttpRequest({
                    method: "post",
                    url: 'http://127.0.0.1:7000/downm3u',
                    data: JSON.stringify(postdata),
                    headers: { "Content-Type": "application/json" },
                    onload: function (res) {
                        console.log(res);
                    },
                    onerror: function (err) {
                        console.log(err);
                    },
                });
            }
        })
    }

    async function showVideo({
        type,
        url,
        duration,
        download
    }) {
        let div = document.createElement("div");
        div.className = "m3u8-item";
        div.innerHTML = `
            <span>${type}</span>
            <span
                class="copy-link"
                title="${url}"
                style="
                    max-width: 200px;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    margin-left: 10px;
                "
            >${url.pathname}</span>
            <span
                style="
                    margin-left: 10px;
                    flex-grow: 1;
                "
            >${duration}</span>
            <span
                class="download-btn"
                style="
                    margin-left: 10px;
                    cursor: pointer;
            ">下载(Download)</span>
        `;

        div.querySelector(".copy-link").addEventListener("click", () => {
            // 复制链接
            mgmapi.copyText(url.href);
            mgmapi.message("已复制链接 (link copied)", 2000);
        });

        div.querySelector(".download-btn").addEventListener("click", download);
        rootDiv.style.display = "block";
        count++;
        shownUrls.push(url.href);
        bar.querySelector(".number-indicator").setAttribute("data-number", count);
        wrapper.appendChild(div);
    }
})();
