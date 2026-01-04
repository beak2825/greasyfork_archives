// ==UserScript==
// @name         短视频下载器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在抖音和快手网页上添加下载按钮，点击复制视频链接到剪贴板
// @author       You
// @match        *://www.douyin.com/*
// @match        *://www.kuaishou.com/*
// @grant        GM_setClipboard
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544065/%E7%9F%AD%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/544065/%E7%9F%AD%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 通用功能对象
    const commonFunctionObject = {
        // 复制到剪贴板并显示提示
        copyToClipboard: function(text) {
            // 使用GM_setClipboard如果可用
            if (typeof GM_setClipboard !== 'undefined') {
                GM_setClipboard(text);
                this.showTip('已复制视频链接到剪贴板');
                return;
            }

            // 回退方法：创建临时textarea
            try {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                this.showTip('已复制视频链接到剪贴板');
            } catch (err) {
                console.error('复制失败:', err);
                this.showTip('复制失败，请检查控制台');
            }
        },

        // 显示提示消息
        showTip: function(message) {
            const tip = document.createElement('div');
            tip.textContent = message;
            tip.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 10px 20px;
                border-radius: 4px;
                z-index: 10000;
                font-size: 16px;
            `;
            document.body.appendChild(tip);

            // 3秒后移除提示
            setTimeout(() => {
                document.body.removeChild(tip);
            }, 3000);
        },

        // 获取元素对象（带重试机制）
        getElementObject: function(selector) {
            return new Promise((resolve, reject) => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                    return;
                }

                let retryCount = 0;
                const interval = setInterval(() => {
                    const element = document.querySelector(selector);
                    if (element) {
                        clearInterval(interval);
                        resolve(element);
                        return;
                    }

                    retryCount++;
                    if (retryCount > 50) { // 最多尝试50次
                        clearInterval(interval);
                        reject('找不到元素: ' + selector);
                    }
                }, 200);
            });
        }
    };

    // 短视频下载器
    function shortVideoDownloader() {
        this.douyinVideoDownloader = function() {
            if(window.location.host !== "www.douyin.com") {
                return;
            }
            window.addEventListener('load', function() {
                //这是搜索界面
                if(window.location.href.match(/https:\/\/www\.douyin\.com\/search\/.*?/)) {
                    function downloader() {
                        const videoContainers = document.querySelectorAll(".player-info");
                        videoContainers.forEach((element) => {
                            if(element.getAttribute("dealwith")) {
                                return;
                            }
                            let bottomMenu = element.querySelector('xg-right-grid');
                            if(!bottomMenu) {
                                return;
                            }
                            let playbackSetting = bottomMenu.querySelector('.xgplayer-playback-setting');
                            if(!playbackSetting) {
                                return;
                            }
                            let download = playbackSetting.cloneNode(true); // 拷贝一个节点
                            let downloadText = download.querySelector('div:first-child');
                            let video = element.querySelector("video");
                            downloadText.innerText='下载';
                            downloadText.style = 'font-size:13px';
                            playbackSetting.after(download);
                            element.setAttribute("dealwith","true");
                            download.addEventListener("click", (e) => {
                                let playerUrl = video.children[0].src;
                                // 修改为复制到剪贴板
                                commonFunctionObject.copyToClipboard(playerUrl);
                            });
                        });
                    }
                    downloader();
                    setInterval(function() {
                        downloader();
                    }, 500);
                } else {
                    async function downloader() {
                        try {
                            //延迟加载等到是否完成
                            let videoContainer = await commonFunctionObject.getElementObject(".xg-video-container");
                            if(!videoContainer) {
                                return false;
                            }
                            let bottomMenus = document.querySelectorAll('.xg-right-grid');
                            let bottomMenuLength = bottomMenus.length;
                            let bottomMenu = bottomMenus.length>1 ? bottomMenus[bottomMenuLength - 2] : bottomMenus[bottomMenuLength - 1];
                            let douyinVideoDownloaderDom = document.querySelector('#douyin-video-downloder');
                            if(douyinVideoDownloaderDom) {
                                douyinVideoDownloaderDom.parentNode.parentNode.removeChild(douyinVideoDownloaderDom.parentNode);
                            }

                            // 拷贝一个节点
                            let playbackSetting = bottomMenu.querySelector('.xgplayer-playback-setting');
                            if(!playbackSetting) {
                                return false;
                            }
                            let download = playbackSetting.cloneNode(true);
                            let downloadText = download.querySelector('div:first-child');
                            downloadText.innerText='下载';
                            downloadText.style = 'font-size:14px';
                            downloadText.setAttribute('id','douyin-video-downloder');

                            let autoplaySetting = document.querySelector('.xgplayer-autoplay-setting');
                            if(!autoplaySetting) {
                                return false;
                            }
                            autoplaySetting.after(download);
                            let videoPlayers = document.querySelectorAll('video');
                            let videoPlayDom = videoPlayers[videoPlayers.length>1 ? videoPlayers.length-2 : videoPlayers.length-1];
                            document.querySelector("#douyin-video-downloder").addEventListener("click", (e) => {
                                let playerUrl = videoPlayDom.children[0].src;
                                // 修改为复制到剪贴板
                                commonFunctionObject.copyToClipboard(playerUrl);
                            });
                        } catch(e) {
                            console.error("抖音下载器错误:", e);
                        }
                    }
                    //监听鼠标
                    window.addEventListener("wheel", downloader);
                    window.addEventListener('keydown', function(e) {
                        if(e.code == 'ArrowDown' || e.code == 'ArrowUp') {
                            downloader();
                        }
                    });
                    //视频改变后触发
                    async function domNodeInserted() {
                        let findVideoInterval = setInterval(function() {
                            let videoElement = document.querySelector("video");
                            if(videoElement) {
                                videoElement.addEventListener('DOMNodeInserted', (e) => {
                                    downloader();
                                });
                                clearInterval(findVideoInterval);
                            }
                        }, 200);
                    }
                    domNodeInserted();
                    downloader();
                    window.addEventListener("click", downloader);
                }
            });
        };

        this.kuaishouVideoDownloader = function() {
            if(window.location.host !== "www.kuaishou.com") {
                return;
            }
            window.addEventListener('load', function() {
                async function downloader() {
                    let kuaishouVideoDownloder = document.querySelector("#kuaishou-video-downloder");
                    if(!kuaishouVideoDownloder) {
                        let downloadDIV = document.createElement("div");
                        downloadDIV.style = "cursor:pointer;width:50px;height:40px;line-height:40px;text-align:center;background-color:#FFF;color:#000;position:fixed;top:200px;left:0px;z-index:999;";
                        downloadDIV.innerText = "下载";
                        downloadDIV.setAttribute('id','kuaishou-video-downloder');
                        document.body.appendChild(downloadDIV);

                        downloadDIV.addEventListener("click", function(e) {
                            let videoDom = document.querySelector('.player-video');
                            if(!videoDom) {
                                commonFunctionObject.showTip('没有找到视频元素');
                                return;
                            }
                            let videoSrc = videoDom.getAttribute('src');
                            if(videoSrc.match(/^blob/)) {
                                commonFunctionObject.showTip('blob视频无法下载');
                                return;
                            }
                            // 修改为复制到剪贴板
                            commonFunctionObject.copyToClipboard(videoSrc);
                        });
                    }
                }
                document.querySelectorAll(".switch-item").forEach(function(value) {
                    value.addEventListener("click", function() {
                        downloader();
                    });
                })
                downloader();
                setInterval(function() {
                    let kuaishouVideoDownloder = document.querySelector("#kuaishou-video-downloder");
                    if(kuaishouVideoDownloder) {
                        if(window.location.href.match(/https:\/\/www\.kuaishou\.com\/short-video\/.*?/)) {
                            kuaishouVideoDownloder.style.display = "block";
                        } else {
                            kuaishouVideoDownloder.style.display = "none";
                        }
                    }
                }, 800);
            });
        };

        this.start = function() {
            this.douyinVideoDownloader();
            this.kuaishouVideoDownloader();
        };
    }

    // 启动下载器
    const downloader = new shortVideoDownloader();
    downloader.start();
})();