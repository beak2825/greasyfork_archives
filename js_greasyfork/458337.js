// ==UserScript==
// @name         91视频下载与链接修复
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  支持91porn视频自动下载与加密链接修复
// @author       efeire
// @match        http*://*.91porn.com/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.min.js
// @downloadURL https://update.greasyfork.org/scripts/458337/91%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E4%B8%8E%E9%93%BE%E6%8E%A5%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/458337/91%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E4%B8%8E%E9%93%BE%E6%8E%A5%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const updateDocumentTitle = (text) => {
        document.title = text;
    };
    if (location.href.includes("view_video.php")) {
        const autoDownload = async () => {
            const button = document.querySelector(".video-container button[id]");
            if (button) {
                console.log("按钮找到,点击");
                button.click();
            } else {
                console.log("按钮未找到");
            }

            const video = document.querySelector("#player_one_html5_api");
            if (!video) return console.log("视频元素未找到");
            
            // 等待视频元素加载完成
            const waitForVideo = () => {
                return new Promise((resolve) => {
                    if (video.readyState >= 2) {
                        resolve();
                    } else {
                        video.addEventListener('loadeddata', () => resolve());
                    }
                });
            };

            // 初始化视频状态
            const initVideo = async () => {
                await waitForVideo();
                video.muted = true;
                video.pause();
                video.currentTime = 0;
            };

            initVideo().catch(console.error);

            // 直接获取视频链接
            const src = video.currentSrc;
            if (!src) return console.log("未找到视频链接");

            console.log("视频链接:", src);

            const tips = document.querySelector(".navbar-collapse.collapse.navbar-inverse-collapse");
            if (tips) {
                tips.style.cssText = "font-size:22px;color:#FF3399";
                tips.textContent = "点击此处暂停/继续下载";
                updateDocumentTitle(tips.textContent);
            }

            const title = document.querySelector('h4.login_register_header[align="left"]').textContent.trim();

            let isPaused = false; // 标志位：控制暂停/继续
            let retryCount = 0;  // 重试次数
            const maxRetries = 3; // 最大重试次数

            // 添加点击暂停/继续功能
            if (tips) {
                tips.addEventListener("click", () => {
                    isPaused = !isPaused;
                    tips.textContent = isPaused ? "下载已暂停" : "继续下载中";
                    updateDocumentTitle(tips.textContent);
                });
            }

            const downloadVideo = () => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: src,
                    responseType: "blob",
                    onloadstart: () => {
                        if (tips) {
                            tips.textContent = "下载开始";
                            updateDocumentTitle(tips.textContent);
                        }
                    },
                    onprogress: (e) => {
                        if (isPaused) return; // 暂停时停止更新进度
                        if (tips) {
                            tips.textContent = `下载中：${(e.loaded / e.total * 100).toFixed(2)}%`;
                            updateDocumentTitle(tips.textContent);
                        }
                    },
                    onload: (r) => {
                        if (isPaused) return; // 暂停时不处理成功逻辑
                        const blob = r.response;
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = `${title}.mp4`;
                        link.click();
                        URL.revokeObjectURL(link.href);

                        // 下载完成后的倒计时关闭
                        const downloadComplete = () => {
                            if (tips) {
                                tips.textContent = "下载完成";
                                updateDocumentTitle(tips.textContent);
                            }

                            let countdown = 3; // 倒计时3秒
                            const interval = setInterval(() => {
                                if (tips) {
                                    tips.textContent = `下载完成，窗口将在 ${countdown} 秒后关闭...`;
                                    updateDocumentTitle(tips.textContent);
                                }
                                countdown--;
                                if (countdown < 0) {
                                    clearInterval(interval);
                                    window.close();
                                }
                            }, 1000);
                        };

                        downloadComplete();
                    },
                    onerror: () => {
                        if (retryCount < maxRetries) {
                            retryCount++;
                            console.log(`下载错误，尝试重试第 ${retryCount} 次`);
                            if (tips) {
                                tips.textContent = `下载错误，重试第 ${retryCount} 次`;
                                updateDocumentTitle(tips.textContent);
                            }
                            downloadVideo();
                        } else {
                            if (tips) {
                                tips.textContent = "下载失败，请刷新页面重试";
                                updateDocumentTitle(tips.textContent);
                            }
                        }
                    },
                    ontimeout: () => {
                        if (retryCount < maxRetries) {
                            retryCount++;
                            console.log(`下载超时，尝试重试第 ${retryCount} 次`);
                            if (tips) {
                                tips.textContent = `下载超时，重试第 ${retryCount} 次`;
                                updateDocumentTitle(tips.textContent);
                            }
                            downloadVideo();
                        } else {
                            if (tips) {
                                tips.textContent = "下载失败，请刷新页面重试";
                                updateDocumentTitle(tips.textContent);
                            }
                        }
                    },
                });
            };

            // 开始下载
            downloadVideo();
        };

        autoDownload().catch(e => console.log("获取视频链接失败:", e));
    }





    if (location.href.includes("index.php") || location.href.includes("v.php")) {
        const decryptAndNavigate = async (encryptedUrl) => {
            try {
                console.log("加密URL:", encryptedUrl);
                const res = await fetch('decrypt-url.php', {
                    method: 'POST',
                    body: JSON.stringify({ encryptedUrl }),
                    headers: { 'Content-Type': 'application/json' }
                });
                const { token, error } = await res.json();
                if (error) return console.error("错误:", error);
                console.log("临时url:", `https://91porn.com/play_video.php?token=${token}`);
                const finalRes = await fetch(`play_video.php?token=${token}`);
                console.log("解密后应答:", finalRes);
                if (finalRes.url) {
                    console.log("解密后URL:", finalRes.url);
                    return finalRes.url;
                }
                console.error("错误: 未找到最终链接");
            } catch (e) {
                console.error("请求错误:", e);
            }
        };

        window.addEventListener('load', async () => {
            const elements = document.querySelectorAll('.well.well-sm.videos-text-align');
            const promises = Array.from(elements).map(async (el) => {
                const id = el.querySelector('a').id;
                //console.log("id:", `${id}`);
                const scriptElement = el.querySelector('script');
                if (scriptElement) {
                    const script = scriptElement.textContent;
                    console.log("script:", script);
                    const encryptedUrl = script.match(/decrypt_g.\('([^']+)'\)/)?.[1];
                    console.log("encryptedUrl:", encryptedUrl);
                    if (!encryptedUrl) return console.error("未找到加密入参");

                    const decryptedUrl = await decryptAndNavigate(encryptedUrl);
                    if (decryptedUrl) {
                        const link = el.querySelector('a');
                        if (link) {
                            link.href = decryptedUrl;
                            link.setAttribute('target', '_blank');
                        } else {
                            console.error("未找到链接元素");
                        }
                    }
                }
            });

            await Promise.all(promises);
            updateDocumentTitle("完成解析");
        });
    }
})();
