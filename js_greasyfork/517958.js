// ==UserScript==
// @name         Tiktok视频下载
// @namespace    tiktok_video_download
// @version      1.0
// @description  解析和下载Tiktok视频（无水印）
// @AuThor       You
// @match         *://*.tiktok.com/*
// @Icon         https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico
// @grant        noneGM_openInTab
// @grant             GM_xmlhttpRequest
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_addStyle
// @run-at            document-idle
// @downloadURL https://update.greasyfork.org/scripts/517958/Tiktok%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/517958/Tiktok%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 通用方法定义
    const commonFunctionObject = {
        GMopenInTab: function (url, options = { active: true, insert: true, setParent: true }) {
            if (typeof GM_openInTab === "function") {
                GM_openInTab(url, options);
            }
        },
        GMaddStyle: function (css) {
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        },
        webToast: function (params) {
            const { message, background } = params;
            const toast = document.createElement('div');
            toast.style.position = 'fixed';
            toast.style.bottom = '20px';
            toast.style.left = '50%';
            toast.style.transform = 'translateX(-50%)';
            toast.style.background = background || 'rgba(0, 0, 0, 0.7)';
            toast.style.color = '#fff';
            toast.style.padding = '10px';
            toast.style.borderRadius = '5px';
            toast.style.zIndex = '99999';
            toast.innerText = message;
            document.body.appendChild(toast);
            setTimeout(() => document.body.removeChild(toast), 1500);
        },
        request: function (method, url, data, headers = { "Content-Type": "application/json;charset=UTF-8" }) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    url: url,
                    method: method,
                    data: data,
                    headers: headers,
                    onload: function (response) {
                        if (response.status === 200) {
                            resolve({ result: 'success', data: response.responseText });
                        } else {
                            reject({ result: 'error', data: null });
                        }
                    }
                });
            });
        }
    };

    function Tiktok() {
        this.extractHref = function (html) {
            const regex = /<a\s+(?:[^>]*?\s+)?href=(['"])(.*?)\1/gi;
            const hrefs = [];
            let match;
            while ((match = regex.exec(html)) !== null) {
                hrefs.push(match[2]);
            }
            return hrefs.filter((href) => href.indexOf("snapcdn.app") != -1);
        };

        this.extractAllVideoLinks = function () {
            const videoLinks = [];
            const anchorTags = document.querySelectorAll('a');
            anchorTags.forEach(anchor => {
                const href = anchor.getAttribute('href');
                if (href && /^https:\/\/www\.tiktok\.com\/@[^/]+\/video\/\d+/.test(href)) {
                    videoLinks.push(href);
                }
            });
            return videoLinks;
        };

        this.scrollToBottom = async function () {
            return new Promise((resolve) => {
                let previousHeight = 0;
                const scrollInterval = setInterval(() => {
                    window.scrollTo(0, document.body.scrollHeight);
                    if (document.body.scrollHeight !== previousHeight) {
                        previousHeight = document.body.scrollHeight;
                    } else {
                        clearInterval(scrollInterval);
                        resolve();
                    }
                }, 1000);
            });
        };

        this.downloadSingleVideo = async function (url, element) {
            commonFunctionObject.webToast({ "message": "正在下载中.", "background": "#000" });
            element.classList.add("download-loadding");

            const data = await commonFunctionObject.request("POST", "https://tikdownloader.io/api/ajaxSearch",
                                                            "q=" + url + "&lang=en", { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" });
            if (data.result === "success") {
                const result = JSON.parse(data.data);
                if (result.status == "ok" && result.hasOwnProperty("data")) {
                    const data = result.data;
                    const downloadUrls = this.extractHref(data);
                    if (downloadUrls.length >= 2) {
                        commonFunctionObject.GMopenInTab(downloadUrls.at(-2));
                    }
                }
            }

            element.classList.remove("download-loadding");
        };

        this.downloadAllVideos = async function (element) {
            commonFunctionObject.webToast({ "message": "正在加载所有视频，请稍候...", "background": "#000" });
            element.classList.add("download-loadding");

            await this.scrollToBottom();  // 先滚动到页面底部，加载所有视频

            const videoLinks = this.extractAllVideoLinks();
            if (videoLinks.length === 0) {
                commonFunctionObject.webToast({ "message": "未找到任何视频链接", "background": "#000" });
                element.classList.remove("download-loadding");
                return;
            }

            commonFunctionObject.webToast({ "message": "开始下载所有视频中...", "background": "#000" });
            for (const videoLink of videoLinks) {
                const data = await commonFunctionObject.request("POST", "https://tikdownloader.io/api/ajaxSearch",
                                                                "q=" + videoLink + "&lang=en", { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" });
                if (data.result === "success") {
                    const result = JSON.parse(data.data);
                    if (result.status == "ok" && result.hasOwnProperty("data")) {
                        const data = result.data;
                        const downloadUrls = this.extractHref(data);
                        if (downloadUrls.length >= 2) {
                            commonFunctionObject.GMopenInTab(downloadUrls.at(-2));
                        }
                    }
                }
            }

            element.classList.remove("download-loadding");
        };

        this.start = async function () {
            this.removeButtons();
            const currentUrl = window.location.href;
            if (/www\.tiktok\.com\/@[^/]+$/.test(currentUrl)) {
                this.addBatchDownloadButton();
            } else if (/www\.tiktok\.com\/@[^/]+\/video\/\d+/.test(currentUrl)) {
                this.addSingleDownloadButton();
            }
        };

        this.addBatchDownloadButton = function () {
            commonFunctionObject.GMaddStyle(`
                @keyframes scriptspin {0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);}}
                .download-loadding{
                    animation: scriptspin 1s linear infinite;
                }
                #tiktok-download-990i {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: #ff2d55;
                    border-radius: 50%;
                    padding: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    cursor: pointer;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                #tiktok-download-990i svg {
                    fill: #ffffff;
                }
            `);

                     if (!document.querySelector("#tiktok-download-990i")) {
                         const container = document.querySelector('body');
                         if (!container) {
                             return;
                         }

                         let downloadButton = document.createElement('div');
                         downloadButton.id = "tiktok-download-990i";
                         downloadButton.innerHTML = `<svg t="1724300009050" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5307" width="35" height="35"><path d="M298.666667 554.666667v85.333333H256v128h512v-128h-42.666667v-85.333333h128v213.333333a85.333333 85.333333 0 0 1-78.933333 85.077333L768 853.333333H256a85.333333 85.333333 0 0 1-85.12-78.933333L170.666667 768v-213.333333h128z" fill="#ffffff" p-id="5308"></path><path d="M512 627.498667l219.477333-219.477334h-120.704L512 506.88 413.141333 408.021333H292.522667L512 627.498667z" fill="#ffffff" p-id="5309"></path><path d="M554.666667 528V167.978667h-85.333334v360.021333h85.333334z" fill="#ffffff" p-id="5310"></path></svg>`;
                         downloadButton.title = "点击下载所有视频（高清无水印）";
                         downloadButton.addEventListener("click", () => {
                             this.downloadAllVideos(downloadButton);
                         });

                         container.appendChild(downloadButton);
                     }
                 };

                 this.addSingleDownloadButton = function () {
                     commonFunctionObject.GMaddStyle(`
                @keyframes scriptspin {0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);}}
                .download-loadding{
                    animation: scriptspin 1s linear infinite;
                }
            `);

                     if (!document.querySelector("#tiktok-download-single-990i")) {
                         const container = document.querySelector('#main-content-video_detail') || document.body;
                         if (!container) {
                             return;
                         }

                         const divs = container.querySelectorAll("div");
                         const regex = /-DivRightControlsWrapper|-DivMiniPlayerContainer/;
                         const matchedDiv = Array.from(divs).find(div => {
                             return div.classList.value.split(' ').some(className => {
                                 return regex.test(className);
                             });
                         });

                         if (matchedDiv) {
                             let cloneNode = null;
                             let isDetail = matchedDiv.children.length != 1;
                             if (isDetail) {
                                 cloneNode = matchedDiv.children[0].cloneNode(true);
                             } else {
                                 cloneNode = matchedDiv.cloneNode(true);
                             }
                             cloneNode.id = "tiktok-download-single-990i";
                             cloneNode.querySelector("div").innerHTML = `<svg t="1724300009050" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5307" width="35" height="35"><path d="M298.666667 554.666667v85.333333H256v128h512v-128h-42.666667v-85.333333h128v213.333333a85.333333 85.333333 0 0 1-78.933333 85.077333L768 853.333333H256a85.333333 85.333333 0 0 1-85.12-78.933333L170.666667 768v-213.333333h128z" fill="#ffffff" p-id="5308"></path><path d="M512 627.498667l219.477333-219.477334h-120.704L512 506.88 413.141333 408.021333H292.522667L512 627.498667z" fill="#ffffff" p-id="5309"></path><path d="M554.666667 528V167.978667h-85.333334v360.021333h85.333334z" fill="#ffffff" p-id="5310"></path></svg>`;
                             if (isDetail) {
                                 matchedDiv.insertBefore(cloneNode, matchedDiv.children[0]);
                             } else {
                                 cloneNode.style.right = (166) + "px";
                                 matchedDiv.parentNode.insertBefore(cloneNode, matchedDiv);
                             }
                             cloneNode.title = "点击下载视频（高清无水印）";
                             cloneNode.addEventListener("click", () => {
                                 this.downloadSingleVideo(window.location.href, cloneNode);
                             });
                         }
                     }
                 };

                 this.removeButtons = function () {
                     const batchButton = document.querySelector("#tiktok-download-990i");
                     if (batchButton) {
                         batchButton.remove();
                     }

                     const singleButton = document.querySelector("#tiktok-download-single-990i");
                     if (singleButton) {
                         singleButton.remove();
                     }
                 };

                 this.observeUrlChange = function () {
                     let previousUrl = window.location.href;
                     const observer = new MutationObserver(() => {
                         if (previousUrl !== window.location.href) {
                             previousUrl = window.location.href;
                             this.start();
                         }
                     });
                     const config = { subtree: true, childList: true };
                     observer.observe(document, config);
                 };
             }

    try {
        const tiktok = new Tiktok();
        tiktok.start();
        tiktok.observeUrlChange();
    } catch (e) {
        console.log("Tiktok视频下载脚本出错：" + e);
    }
})();