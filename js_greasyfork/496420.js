// ==UserScript==
// @name         Convert MP4 Text Links to Video
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Convert all MP4 text links in the page to video elements.
// @author       Eddie
// @match        https://sehuatang.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496420/Convert%20MP4%20Text%20Links%20to%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/496420/Convert%20MP4%20Text%20Links%20to%20Video.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义正则表达式以匹配以.mp4结尾的URL
    const mp4Regex = /https?:\/\/[^\s]+?\.mp4/g;

    function replaceTextWithVideo(element) {
        element.childNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const matches = [];
                let match;

                while (match = mp4Regex.exec(node.nodeValue)) {
                    matches.push(match);
                }

                if (matches.length > 0) {
                    const fragment = document.createDocumentFragment();
                    let lastIndex = 0;

                    matches.forEach((match) => {
                        const index = match.index;
                        const matchText = match[0];

                        // 添加前置文本（如果有）
                        if (index > lastIndex) {
                            fragment.appendChild(document.createTextNode(node.nodeValue.slice(lastIndex, index)));
                        }

                        // 创建并配置一个新的video元素
                        const videoElement = document.createElement('video');
                        videoElement.src = matchText;
                        videoElement.controls = true;
                        videoElement.style.maxWidth = '100%';
                        videoElement.style.height = 'auto';
                        fragment.appendChild(videoElement);

                        lastIndex = index + matchText.length;
                    });

                    // 添加剩余文本（如果有）
                    if (lastIndex < node.nodeValue.length) {
                        fragment.appendChild(document.createTextNode(node.nodeValue.slice(lastIndex)));
                    }

                    // 替换原始节点
                    node.parentNode.replaceChild(fragment, node);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // 递归处理子元素
                replaceTextWithVideo(node);
            }
        });
    }

    // 从文档根节点开始替换文本链接
    replaceTextWithVideo(document.body);
})();