// ==UserScript==
// @name         抖音仿idm快速下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  获取正在播放的video标签的视频地址，并在video元素的绝对右上角显示下载悬浮按钮
// @author       hunmer
// @match        https://www.douyin.com/search/*
// @match        https://www.douyin.com/video/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524634/%E6%8A%96%E9%9F%B3%E4%BB%BFidm%E5%BF%AB%E9%80%9F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/524634/%E6%8A%96%E9%9F%B3%E4%BB%BFidm%E5%BF%AB%E9%80%9F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    var INITED = false

    const loadRes = (files, callback) => new Promise(reslove => {
        files = [...files]
        var next = () => {
            let url = files.shift()
            if (url == undefined) {
                callback && callback()
                return reslove()
            }
            let fileref, ext = url.split('.').at(-1)
            if (ext == 'js') {
                fileref = GM_addElement('script', {
                    src: url,
                    type: ext == 'js' ? "text/javascript" : 'module'
                })
            } else if (ext == "css") {
                fileref = GM_addElement('link', {
                    href: url,
                    rel: "stylesheet",
                    type: "text/css"
                })
            }
            if (fileref != undefined) {
                let el = document.getElementsByTagName("head")[0].appendChild(fileref)
                el.onload = next, el.onerror = next
            } else {
                next()
            }
        }
        next()
    })

    const getParent = (el, callback) => {
        let par = el
        while(par && !callback(par)){
            par = par.parentElement
        }
        return par
    }

    const getHeaders = url => {
        return {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            // 'Referer': url,
            'Range': 'bytes=0-',
            'Referer': location.protocol+'//'+ location.host
        }
    }

    function addDownloadButtonToVideo(videoElement) {
        const card = getParent(videoElement, el => el.className == 'search-result-card') ?? document.body
        const downloadButton = document.createElement('button');
        downloadButton.textContent = '下载';
        downloadButton.style.position = 'absolute';
        downloadButton.style.top = '0';
        downloadButton.style.right = '0';
        downloadButton.style.zIndex = '2000';
        downloadButton.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        downloadButton.style.color = 'white';
        downloadButton.style.border = 'none';
        downloadButton.style.padding = '5px 10px';
        downloadButton.style.borderRadius = '5px';
        downloadButton.style.cursor = 'pointer';
        const videoSrc = videoElement.querySelectorAll('source')[0].src
        if (!videoSrc) {
            return console.error('无法获取视频地址');
        }
        downloadButton.addEventListener('click', ev => {
             ev.stopPropagation(true) & ev.preventDefault()
            let name = (card.querySelector('.pQBVl0z4')?.outerText || card.querySelector('.BjLsdJMi')?.outerText || 'video')+'.mp4'
            let url = videoSrc, headers = getHeaders(url)
            console.log({name, url})
            GM_xmlhttpRequest({
              url, headers,
              redirect: 'follow', responseType: 'blob', method: "GET",
              onload: ({response, status}) => {
                  const callback = () => unsafeWindow.saveAs(response, name)
                  if(!INITED){
                      loadRes(['https://cdn.jsdelivr.net/npm/web-streams-polyfill@2.0.2/dist/ponyfill.min.js', 'https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js'], () => {
                          INITED = true
                          callback()
                      })
                  }else{
                      callback()
                  }
              }
          })
        });
        videoElement.parentNode.insertBefore(downloadButton, videoElement.nextSibling);
    }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === 'VIDEO') {
                        addDownloadButtonToVideo(node);
                    }
                });
            });
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

    // 初始化页面中已有的video元素
     document.querySelectorAll('video').forEach((videoElement) => {
         addDownloadButtonToVideo(videoElement);
     });
})();