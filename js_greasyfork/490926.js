// ==UserScript==
// @name         替换 iwara 播放器
// @namespace    https://github.com/s0urcelab/userscripts
// @version      1.1
// @description  修复iwara播放器加载源错误问题
// @match        https://www.iwara.tv/video/*
// @require      https://fastly.jsdelivr.net/npm/xgplayer@2.31.2/browser/index.min.js
// @icon         https://www.iwara.tv/logo.png
// @author       s0urce
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490926/%E6%9B%BF%E6%8D%A2%20iwara%20%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/490926/%E6%9B%BF%E6%8D%A2%20iwara%20%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

; (function () {
    'use strict';

    // const css=`
    //   .videoPlayer {
    //     display: none !important;
    //   }
    // `
    // GM_addStyle(css)
    // Save the original fetch function
    const originalFetch = window.fetch;
    // Create a new fetch function that wraps the original one
    function newFetch(...args) {
        const [url] = args
        return originalFetch(...args).then(response => {
            if (url.includes('files.iwara.tv/file')) {
                response.clone().json().then(json => {
                    const { src: { view: videoSrc } } = json.find(v => v.name === 'Source')
                    console.warn(`当前播放资源url：${videoSrc}`)
                    window.videoSrc = videoSrc
                })
            }
            return response;
        });
    }
    // Replace the original fetch function with our new one
    window.fetch = newFetch;



    const targetNode = document.getElementById('app');
    const observerOptions = {
        childList: true,
        subtree: true,
    };
    function callback(mutationList, observer) {
        mutationList.forEach((mutation) => {
            switch (mutation.type) {
                case 'childList':
                    for (let node of mutation.addedNodes) {
                        if (node.className === 'videoPlayer') {
                            node.style.display = 'none'
                            document.querySelector(".page-video__player").style.maxHeight = 'none'
                            // append container for xgplayer
                            const playCon = document.createElement("div")
                            playCon.id = 'xgplayer'
                            node.parentNode.appendChild(playCon)
                            window.xg = new window.Player({
                                id: 'xgplayer',
                                url: window.videoSrc,
                                volume: 1,
                                fluid: true,
                                videoInit: true,
                            })

                            observer.disconnect()
                        }
                    }
                    break;
            }
        });
    }
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, observerOptions);

    // function checkAndReplace() {
    //     const originContainer = document.querySelector(".videoPlayer");
    //     if (originContainer) {
    //         originContainer.style.display = 'none'
    //         document.querySelector(".page-video__player").style.maxHeight = 'none'
    //         // append container for xgplayer
    //         const playCon = document.createElement("div")
    //         playCon.id = 'xgplayer'
    //         originContainer.parentNode.appendChild(playCon)
    //         window.xg = new window.Player({
    //             id: 'xgplayer',
    //             url: window.videoSrc,
    //             volume: 1,
    //             fluid: true,
    //             videoInit: true,
    //         })
    //     } else {
    //         // If the element doesn't exist yet, try again in 500ms
    //         setTimeout(checkAndReplace, 500);
    //     }
    // }
    // Start checking for the element
    // checkAndReplace();


})();