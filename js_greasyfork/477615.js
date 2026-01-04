// ==UserScript==
// @name         JavLibrary Video Fetcher
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  这个脚本在浏览 javlibrary.com 网站时抓取视频链接，并在页面上显示这些链接。每个页面只显示一个视频链接，从而提高页面的可读性和使用体验。
// @author       TT
// @match        www.javlibrary.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/477615/JavLibrary%20Video%20Fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/477615/JavLibrary%20Video%20Fetcher.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    var links = Array.from(document.links);
    var addedLinks = [];

    for (let link of links) {
        var videoAdded = false; // 新增标志，在每个链接的循环开始时重置
        var url = link.href;
        if (url.includes('?v=j')) {
            url = url.replace("/?v=", "/videocomments.php?mode=&v=").concat("&page=");

            // 从localStorage中获取数据
            var cachedVideo = localStorage.getItem(url);
            if (cachedVideo) {
                var video = document.createElement('video');
                video.src = cachedVideo;
                video.width = 320;
                video.height = 240;
                video.controls = true;
                link.parentElement.parentElement.insertBefore(video, link.parentElement);
                addedLinks.push(cachedVideo);
                continue;
            }

            var fetchPage = async function(index) {
                if (index > 5 || videoAdded) return Promise.resolve(); // 检查标志
                try {
                    var response = await fetch(url + index);
                    var html = await response.text();
                    var regex = /(http(s?):)([/|.|\w|\s|-])*\.(?:mp4)/g;
                    var matches = html.match(regex);
                    if (matches) {
                        for (var k = 0; k < matches.length; k++) {
                            if (!addedLinks.includes(matches[k])) {
                                var video = document.createElement('video');
                                video.src = matches[k];
                                video.width = 320;
                                video.height = 240;
                                video.controls = true;
                                link.parentElement.parentElement.insertBefore(video, link.parentElement);
                                addedLinks.push(matches[k]);
                                videoAdded = true; // 设置标志
                                localStorage.setItem(url, matches[k]); // 将视频链接存储在localStorage中
                                return Promise.resolve();
                            }
                        }
                    }
                    return fetchPage(index + 1); // 如果没有找到视频链接，继续获取下一页
                } catch (err) {
                    console.warn('Something went wrong.', err);
                }
            };

            await fetchPage(1); // 开始获取第一页
        }
    }
})();