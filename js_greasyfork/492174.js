// ==UserScript==
// @name        [J]Douyin Video Downloader
// @namespace    http://tampermonkey.net/
// @version         2024120821
// @description  Download videos from Douyin website
// @author       jeffc
// @match        *.douyin.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492174/%5BJ%5DDouyin%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/492174/%5BJ%5DDouyin%20Video%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function Video(authorName, desc, id) {
        this.authorName = authorName || "";
        this.videoDesc = desc || "";
        this.videoId = id || "";
        this.videoUrl = "";
    }

    Video.prototype = {
        constructor: Video,
        download: function() {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', `https://www.douyin.com/aweme/v1/web/aweme/detail/?device_platform=webapp&aweme_id=${this.videoId}&screen_width=1920&screen_height=1080`, true);
            xhr.responseType = 'json';
            xhr.onload = () => {
                if (xhr.status === 200) {
                    var responseData = xhr.response;
                    this.videoUrl = responseData.aweme_detail.video.bit_rate[0].play_addr.url_list[0];
                    this.save();
                } else {
                    console.error('request error:', xhr.statusText);
                }
            };
            xhr.onerror = function() {
                console.error('request error:', xhr.statusText);
            };
            xhr.send();
        },
        clear: function() {
            this.authorName = "";
            this.videoDesc = "";
            this.videoId = "";
            this.videoUrl = "";
        },
        save: function() {
            if (this.videoUrl.length > 0) {
                let downloadDom = document.createElement('a');
                downloadDom.href = this.videoUrl;
                downloadDom.target = "_blank";
               // downloadDom.download = `${this.authorName}_${this.videoDesc}.mp4`;
               document.body.appendChild(downloadDom);
                downloadDom.setAttribute("download",((new Date()).getTime())+".mp4")
                downloadDom.click();
               document.body.removeChild(downloadDom);
                this.clear();
            } else {
                alert("无法解析视频");
            }
        }
    };

    const _historyWrap = function(type) {
        const orig = history[type];
        const e = new Event(type);
        return function() {
            const rv = orig.apply(this, arguments);
            e.arguments = arguments;
            window.dispatchEvent(e);
            return rv;
        };
    }
    history.pushState = _historyWrap('pushState');
    history.replaceState = _historyWrap('replaceState');

    window.addEventListener('pushState', function(e) {
        console.log('page change ');
        dynamicMonitoring();
    });
    window.addEventListener('replaceState', function(e) {
        console.log('page change ');
        dynamicMonitoring();
    });


    const PageType = {
        Detail: 'Detail', // 详情页
        Normal: 'Normal', // 作者主页
        Live: 'Live', // 直播
    };

    let currentPageType = PageType.Normal;

    let liveExecuStatus = false;

    // 动态监测函数
    function dynamicMonitoring() {
        if (/www.douyin.com\/video\/[0-9]{9,}/.test(window.location.href)) {
            currentPageType = PageType.Detail;
            var initialTargetNode = document.querySelector('xg-video-container');
            var mobserver = new MutationObserver(function(mutationsList, observer) {
                mutationsList.forEach(function(mutation) {
                    refreshDownloadDom(initialTargetNode);
                });
            });
            var mconfig = {
                childList:true,
                subtree:true
            };
            let listener = setInterval(function() {
                if (!initialTargetNode ) {
                     initialTargetNode = document.querySelector('xg-video-container');
                }else{
                    mobserver.observe(initialTargetNode, mconfig);
                    refreshDownloadDom(initialTargetNode);
                    clearInterval(listener);
                }
            }, 500);

        } else if(!liveExecuStatus && ( /live.douyin.com\/[0-9]{9,}/.test(window.location.href) || /www.douyin.com\/follow\/live\/[0-9]{9,}/.test(window.location.href))){
            liveExecuStatus = true;
             var targetUrl="";
             const originalFetch = window.fetch;
             window.fetch = function(url, options) {
                     if (url.includes('.mp4') || url.includes('.m3u8') || url.includes('.ts') || url.includes('.flv')) {
                            targetUrl = url;
                     }
                     return originalFetch.apply(this, [url, options]);
              };

            var findlive = setInterval(function(){
                if(targetUrl != "" && document.querySelector(".__leftContainer"))
                {
                    console.log("=============");
                    addcss();
                    var savebtn = document.createElement("button");
                    savebtn.textContent="直播录制";
                    savebtn.className="jbtn";
                    savebtn.addEventListener("click",function(){
                        var ddd = document.createElement('a');
                        ddd.href = targetUrl;
                        ddd.target = "_blank";
                        ddd.setAttribute("download","");
                        document.body.appendChild(ddd);
                        ddd.click();
                        document.body.removeChild(ddd);
                    });
                    document.querySelector(".__leftContainer").appendChild(savebtn);
                    clearInterval(findlive);
                    savebtn.previousSibling.style="margin-right:10px";
                }
            },200);
        } else {

            // 通用页
            currentPageType = PageType.Normal;


            monitoringSilder();

            var observeTargetNode;
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    switchObserverTarget();
                });
            });
            var config = {
                attributes: true,
                attributeFilter: ['data-e2e']
            };

            let listener = setInterval(function() {
                if (!observeTargetNode ) {
                     observeTargetNode = document.querySelector('div[data-e2e="feed-active-video"]');
                }else{
                    observer.observe(observeTargetNode, config);
                    refreshDownloadDom(observeTargetNode);
                    clearInterval(listener);
                }
            }, 500);



            // 切换观察目标节点的函数
            function switchObserverTarget() {
                // 重新获取目标节点
                var newTargetNode = document.querySelector('div[data-e2e="feed-active-video"]');

                let listener = setInterval(function() {
                    if (!newTargetNode ) {
                         newTargetNode = document.querySelector('div[data-e2e="feed-active-video"]');
                    }else{
                        if (newTargetNode && newTargetNode !== observeTargetNode) {
                            observer.unobserve(observeTargetNode);
                            observer.observe(newTargetNode, config);
                            observeTargetNode = newTargetNode;
                            refreshDownloadDom(newTargetNode);
                        }
                        clearInterval(listener);
                    }
                }, 500);

            }
        }
    }

    // 更新通用页的下载按钮
    function refreshDownloadDom(activeVideoDom) {
        var downloadBtn = activeVideoDom.querySelector('#douyin_download_by_jeffc');
        if (!downloadBtn) {
            downloadBtn = document.createElement('div');
            downloadBtn.setAttribute("data-index", "10");
            downloadBtn.id = "douyin_download_by_jeffc";
            downloadBtn.innerHTML = "DOWNLOAD";
            downloadBtn.style = 'cursor:pointer;width: 60px;text-align: center;font-size: 14px;color: rgba(255, 255, 255,0.75);line-height:20px;margin-right: 30px;';
            downloadBtn.addEventListener('click', function() {
                downloadVideo(activeVideoDom);
            });
             let listenerActiveVideo = setInterval(function() {
                let targetNode = currentPageType == currentPageType.Normal ? activeVideoDom.querySelector("xg-right-grid") : activeVideoDom.parentNode.querySelector("xg-right-grid") ;
                if (targetNode ) {
                    if(!targetNode.querySelector("#douyin_download_by_jeffc"))
                    {
                        targetNode.appendChild(downloadBtn);
                    }
                    clearInterval(listenerActiveVideo);
                }
            }, 500);
        }
    }


    // 下载视频的函数
    function downloadVideo(activeVideoDom) {
        var authorName = activeVideoDom.querySelector('[data-e2e="feed-video-nickname"]')?.innerText.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, '');
        var videoDesc = activeVideoDom.querySelector('[data-e2e="video-desc"]')?.innerText.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, '');
        var videoDom = activeVideoDom.querySelector("video");
        var sourceUrl;
        if (videoDom) {
            if (videoDom.childNodes.length > 0) {
                sourceUrl = videoDom.querySelector("source")?.src;
            }
        } else {
            sourceUrl = activeVideoDom.querySelector("xg-video")?.src;
        }
        if (sourceUrl) {
            // 直接下载
            var downloadDom = document.createElement('a');
            downloadDom.href = sourceUrl;
            downloadDom.target = "_blank";
            downloadDom.setAttribute("download","");
            document.body.appendChild(downloadDom);
            downloadDom.click();
            document.body.removeChild(downloadDom);
        } else {
            // 解析视频并下载
            var vid = activeVideoDom.getAttribute("data-e2e-vid");
            (new Video(authorName, videoDesc, vid)).download();
        }
    }

    function addcss()
    {
               const style = document.createElement('style');
    style.innerHTML = `
            .jbtn {
            magin-left:20px;
             padding: 5px 25px;
             font-size: 14px;
              border: none;
              outline: none;
              color: rgb(255, 255, 255);
              background: #111;
              cursor: pointer;
              position: relative;
              z-index: 0;
              border-radius: 10px;
              user-select: none;
              -webkit-user-select: none;
              touch-action: manipulation;
            }

            .jbtn:before {
              content: "";
              background: linear-gradient(
                45deg,
                #ff0000,
                #ff7300,
                #fffb00,
                #48ff00,
                #00ffd5,
                #002bff,
                #7a00ff,
                #ff00c8,
                #ff0000
              );
              position: absolute;
              top: -2px;
              left: -2px;
              background-size: 400%;
              z-index: -1;
              filter: blur(5px);
              -webkit-filter: blur(5px);
              width: calc(100% + 4px);
              height: calc(100% + 4px);
              animation: glowing-jbtn 20s linear infinite;
              transition: opacity 0.3s ease-in-out;
              border-radius: 10px;
            }

            @keyframes glowing-jbtn {
              0% {
                background-position: 0 0;
              }
              50% {
                background-position: 400% 0;
              }
              100% {
                background-position: 0 0;
              }
            }

            .jbtn:after {
              z-index: -1;
              content: "";
              position: absolute;
              width: 100%;
              height: 100%;
              background: #222;
              left: 0;
              top: 0;
              border-radius: 10px;
            }
    `;
    document.head.appendChild(style);
    }

    function monitoringSilder()
    {
            const mutationObserver = new MutationObserver(mutationsList => {
                mutationsList.forEach(mutation => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'data-e2e-vid') {
                      const targetNode = mutation.target;
                      console.log(targetNode);
                       dealwith(targetNode);
                    }

                });
            });
            let listener = setInterval(function() {
                if (document.querySelector('#slidelist')) {
                     mutationObserver.observe(document.querySelector('#slidelist'), { childList: true, subtree: true,attributes:true});
                     clearInterval(listener);
                }
            }, 500);

            function dealwith(activeVideoDom){
                var downloadBtn = activeVideoDom.querySelector('#douyin_download_by_jeffc');
                if (!downloadBtn) {
                    downloadBtn = document.createElement('div');
                    downloadBtn.setAttribute("data-index", "10");
                    downloadBtn.id = "douyin_download_by_jeffc";
                    downloadBtn.innerHTML = "DOWNLOAD";
                    downloadBtn.style = 'cursor:pointer;width: 60px;text-align: center;font-size: 14px;color: rgba(255, 255, 255,0.75);line-height:20px;margin-right: 30px;';
                    downloadBtn.addEventListener('click', function() {
                        downloadVideo(activeVideoDom);
                    });
                     let listenerActiveVideo = setInterval(function() {
                        let targetNode = currentPageType == currentPageType.Normal ? activeVideoDom.querySelector("xg-right-grid") : activeVideoDom.parentNode.querySelector("xg-right-grid") ;
                        if (targetNode ) {
                            if(!targetNode.querySelector("#douyin_download_by_jeffc"))
                            {
                                targetNode.appendChild(downloadBtn);
                            }
                            clearInterval(listenerActiveVideo);
                        }
                    }, 500);
                }
            }
    }

    // 页面加载完成后开始动态监测
    window.onload = function() {
        dynamicMonitoring();
    };

    // 监听键盘按下事件
document.addEventListener("keydown", function(event) {
    // 获取按下的键的键码
    var keyCode = event.keyCode;

    if(keyCode == 90)
    {
        var target_dom = document.querySelectorAll("#douyin_download_by_jeffc");
        if(target_dom)
        {
               target_dom[target_dom.length-1].click();
        }
    }
});

})();