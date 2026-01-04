// ==UserScript==
// @name         B站视频下载助手
// @namespace    Violentmonkey Scripts
// @version      1.0.1
// @description  为B站视频添加下载按钮(原生风格)
// @author       exdragon
// @match        https://www.bilibili.com/video/BV*
// @icon         https://www.bilibili.com/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/streamsaver@2.0.6/StreamSaver.min.js#md5=3f2328335da65654996076bf4f4117c0
// @require      https://cdn.jsdelivr.net/npm/blueimp-md5@2.19.0/js/md5.min.js#md5=2f577924085ebbe12e29f3ff706397d0
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_addElement
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @connect      api.snapany.com
// @connect      bilibili.com
// @supportURL   https://github.com/dyingChinese/tampermonkey-bilibili/blob/main/dist/dist.js
// @downloadURL https://update.greasyfork.org/scripts/533917/B%E7%AB%99%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/533917/B%E7%AB%99%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const GLOBAL_CONFIG = {
        API_ENDPOINT: "https://api.snapany.com/extract",
        BIBI_HOST: "https://www.bilibili.com/video",
        ICON_STYLE: "bili",
        // 可选：bili | modern
        PLAN: 1,
        BUTTON_ID: "btn_download_fZ9oV5xN5pK",
        DEBUG: false
    };

    function addNodeLocation(domRef) {
        const children = domRef.children;
        if (!children || children.length === 0) throw new Error("节点不存在");
        if (children.length < 3) {
            return children[-1];
        }
        return children[3];
    }

    function createDownloadButton(clickEvent) {
        const btn = document.createElement("div");
        btn.className = "toolbar-item download-btn toolbar-left-item-wrap";
        btn.id = GLOBAL_CONFIG.BUTTON_ID;
        btn.innerHTML = `
                <div class="video-toolbar-download video-download-wrap video-toolbar-left-item" title="下载">
                    <svg class="download-icon" width="28" height="28" viewBox="0 0 28 28" fill="currentColor" class="video-download-icon video-toolbar-item-icon">
                        <path d="M14 2.5a1.5 1.5 0 0 1 1.5 1.5v11.379l2.44-2.439a1.5 1.5 0 1 1 2.122 2.122l-5 5a1.5 1.5 0 0 1-2.122 0l-5-5a1.5 1.5 0 1 1 2.122-2.122L12.5 15.38V4a1.5 1.5 0 0 1 1.5-1.5Z"></path>
                        <path d="M4.5 18.5a1.5 1.5 0 0 1 1.5 1.5v3.5h16.5V20a1.5 1.5 0 0 1 3 0v4a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 24v-4a1.5 1.5 0 0 1 1.5-1.5Z"></path>
                    </svg>
                    <span class="btn-text">下载</span>
                </div>
            `;
        if (clickEvent) {
            btn.onclick = clickEvent;
        }
        return btn;
    }
    function getHexHash(hashContext, cfg) {
        console.log(cfg);
        return md5(hashContext);
    }
    function isValidUrl(url) {
        try {
            const uri = new URL(url);
            return !!uri;
        } catch (error) {
            return false;
        }
    }
    function getBVNumber(uri) {
        if (!isValidUrl(uri)) throw new Error("不是合法的链接");
        const reg = /BV[\w]+/
        const url = new URL(uri);
        const BV = url.pathname.split('/').find((val) => reg.exec(val))
        return BV;
    }
    const handleError = (message, details) => {
        const fullMessage = details ? `${message}: ${details}` : message;
        GM_log(fullMessage);
        console.error(fullMessage);
    };
    const download = (url, filename) => {
        const streamSaver = window.streamSaver;
        return new Promise((resolve, reject) => {
            const defaultName = `B站视频_${Date.now()}.mp4`;

            // 创建可写流
            const fileStream = streamSaver.createWriteStream(filename || defaultName);
            const writer = fileStream.getWriter();

            // 发起请求获取视频流
            fetch(url).then(response => {
                if (!response.ok) {
                    handleError("error", "Network response was not ok");
                    reject(new Error("Network response was not ok"));
                }
                const reader = response.body.getReader();
                const contentLength = +response.headers.get('Content-Length');

                let receivedLength = 0; // 已接收的字节数

                // 逐块读取并写入文件
                function read() {
                    reader.read().then(({ done, value }) => {
                        if (done) {
                            writer.close();
                            resolve("下载完成");
                            return;
                        }
                        writer.write(value).then(() => {
                            receivedLength += value.length;
                            // 更新进度条
                            const percentage = (receivedLength / contentLength) * 100;
                            const date = new Date().getTime()
                            if (date % 5000) {
                                console.log(`下载进度：${percentage.toFixed(2)}%`);
                            }
                            // 继续读取下一块
                            read();
                        }).catch(error => {
                            reject(new Error("浏览器不支持下载功能"));
                        });
                    }).catch(error => {
                        reject(new Error("没有下载权限"));
                    });
                }
                read()
            }).catch(error => {
                reject(new Error("下载启动失败"))
            });
        })
    }
    const showUserFeedback = (type, message) => {
        const style = type === "error" ? "color: red;" : "color: green;";
        console.log(`%c${message}`, style);
    };
    const getDownloadUrl = async (bvNumber) => {
        return new Promise((resolve, reject) => {
            const now = Date.now();
            const url = GLOBAL_CONFIG.BIBI_HOST + `/${bvNumber}/?share_source=copy_web`;
            const hashContext = url + "zh" + now + "6HTugjCXxR";
            const headers = {
                "Accept": "*/*",
                "Content-Type": "application/json",
                "G-Footer": getHexHash(hashContext),
                "G-Timestamp": now.toString(),
                "Origin": "https://snapany.com",
                "Dnt": "1",
                "Pragma": "no-cache",
                "Priority": "u=1, i",
                "Sec-Gpc": "1",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                "Accept-Language": "zh",
                "Referer": "https://snapany.com/",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Sec-Ch-Ua-Platform": '"Windows"',
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            };
            try {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: GLOBAL_CONFIG.API_ENDPOINT,
                    headers,
                    data: JSON.stringify({ link: url }),
                    responseType: "json",
                    onload: (res) => {
                        if (res.status === 200) {
                            const data = res.response;
                            if (data.medias && data.medias.length > 0) {
                                const ret = data.medias.map((val) => val.resourceUrl);
                                const previewImg = data.medias[0].previewUrl;
                                resolve([ret, previewImg]);
                            } else {
                                reject(new Error("未找到下载链接"));
                            }
                        } else if (res.status = 400) {
                            const data = res.response;
                            if (data.message) {
                                reject(new Error(data.message));
                            }
                            reject(new Error("API请求失败" + typeof data === 'string' ? data : JSON.stringify(data)));
                        } else {
                            reject(new Error(`API请求失败: ${res.status}`));
                        }
                    },
                    onerror: () => reject(new Error("请求错误")),
                    ontimeout: () => reject(new Error("请求超时"))
                });
            } catch (error) {
                const message = error instanceof Error ? error.message : "API请求失败";
                reject(new Error(`获取下载地址失败: ${message}`));
            }
        });
    };
    const handleDownload = async () => {
        try {
            const bvNumber = getBVNumber(window.location.href);
            if (!bvNumber) {
                throw new Error("无法获取视频BV号");
            }
            const [downloadUrls, previewImg] = await getDownloadUrl(bvNumber);
            if (!(downloadUrls == null ? void 0 : downloadUrls.length)) {
                throw new Error("未找到可下载资源");
            }
            showUserFeedback('success', downloadUrls.map((url) => url));
            const downloadPromises = downloadUrls.map(
                (url, index) => download(url, `B站视频_${bvNumber}_${index + 1}.mp4`)
            );
            const results = await Promise.allSettled(downloadPromises);

            const failedCount = results.filter((r) => r.status === "rejected").length;
            const succeedCount = results.filter((r) => r.status === "fulfilled").length;
            if (failedCount > 0) {
                throw new Error(`${failedCount}/${downloadUrls.length} 个文件下载失败`);
            }
            GM_notification({
                title: `视频下载完成: ${succeedCount}个成功, ${failedCount}个失败, 共计${results.length}个项目`,
                image: previewImg,
                silent: false,
                timeout: 20000,
            })
            showUserFeedback("success", "所有视频下载完成！");
        } catch (error) {
            const message = error instanceof Error ? error.message : "未知错误";
            showUserFeedback("error", `下载失败: ${message}`);
        }
    };

    function waitForElement(selector) {
        return new Promise((resolve) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
    const Bilibili_Video_Tools = "#arc_toolbar_report";
    async function main() {
        const dom = await waitForElement(Bilibili_Video_Tools);
        if (!dom) return;
        const bilibili_toolbar_dom = await waitForElement("#arc_toolbar_report > .video-toolbar-left > .video-toolbar-left-main");
        if (!bilibili_toolbar_dom) return;
        if (document.querySelector(`#${GLOBAL_CONFIG.BUTTON_ID}`)) return;
        try {
            const insertLocation = addNodeLocation(bilibili_toolbar_dom);
            const downloadBtn = createDownloadButton(handleDownload);
            bilibili_toolbar_dom.insertBefore(downloadBtn, insertLocation);
        } catch (error) {
            console.log();
        }
    }
    // 延迟1秒执行确保页面加载完成
    setTimeout(main, 3000);
})();