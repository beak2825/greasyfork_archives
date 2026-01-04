// ==UserScript==
// @name         凤凰易教视频下载
// @version      1.0.0
// @description  解析下载凤凰易教网站的视频
// @namespace    fhebook_download
// @author       小木
// @match        https://www.fhebook.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514906/%E5%87%A4%E5%87%B0%E6%98%93%E6%95%99%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/514906/%E5%87%A4%E5%87%B0%E6%98%93%E6%95%99%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function download(src, filename) {
        const link = document.createElement('a');
        const url = src.startsWith("//") ? src.substring(2) : src;
        link.href = url;
        link.download = 'video.mp4';
        link.download = filename;
        link.target = '_blank';
        link.rel = "nofollow noreferrer"
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
    }
    const targetSelector = '.modal-player.video';

    function addButton(element) {
        let filename = 'video.mp4'
        const titlenode = element.querySelector('.modal-title');
        if (titlenode) {
            titlenode.style.marginLeft = '40px';
            filename = titlenode.textContent
        }
        const button = document.createElement('button');
        button.textContent = '下载';
        button.style = "z-index: 9999999; position: absolute; top: 15px; left: 5px; padding: 4px 8px; border-radius: 4px; border: none; background: #409EFF; color: #fff;";
        button.addEventListener('click', function() {
            const videoElement = element.querySelector('video');
            if (videoElement && videoElement.src) {
                download(videoElement.src, filename)
            }
        });
        element.insertBefore(button, element.firstChild)
    }
    const config = {
        childList: true,
        subtree: true
    };
    const callback = function(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.querySelector(targetSelector)) {
                        const target = node.querySelector(targetSelector);
                        addButton(target)
                    }
                })
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(document, config)
})();