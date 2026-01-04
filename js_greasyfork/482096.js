// ==UserScript==
// @name         Bilibili Onebox interceptor for shuiyuan
// @name:zh-CN   水源社区哔哩哔哩嵌入播放器拦截器
// @namespace    https://greasyfork.org/scripts/482096
// @version      1.1.1
// @description  将水源社区用户发送的嵌入式Bilibili视频控件拦截并显示为黑框，并提供去跟踪参数的原链接方便用户直接前往原视频
// @description:zh-CN  将水源社区用户发送的嵌入式Bilibili视频控件拦截并显示为黑框，并提供去跟踪参数的原链接方便用户直接前往原视频
// @author       benderbd42
// @match        https://shuiyuan.sjtu.edu.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482096/Bilibili%20Onebox%20interceptor%20for%20shuiyuan.user.js
// @updateURL https://update.greasyfork.org/scripts/482096/Bilibili%20Onebox%20interceptor%20for%20shuiyuan.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var displayTextHead = "这是一个嵌入式 bilibili 视频，已被本脚本拦截，";

    // 设置变量控制打开网页的方式
    var openInNewTab = true;

    function removeTrackingParams(url) {
        const regex = /^(https?:\/\/[^?]+)/;
        const match = url.match(regex);
        if (match) {
            return match[1];
        }
        return url;
    }

    function handleLinkClick(event) {
        event.preventDefault();
        const link = event.target;
        link.innerHTML = '再点击一次前往原视频。\n\n'+link.href;
        link.removeEventListener('click', handleLinkClick);
        link.addEventListener('click', function (event) {
            event.preventDefault();
            if (openInNewTab) {
                window.open(link.href, '_blank'); // 在新标签页中打开链接
            } else {
                window.location.href = link.href; // 在当前标签页中打开链接
            }
        });
    }

    setInterval(function() {
        var elements = document.querySelectorAll('.onebox.onebox-bilibili');
        elements.forEach(function (element) {
            var src = element.getAttribute('data-onebox-src');
            var text4link = document.createElement('a');
            var link = document.createElement('a');
            //const videoId = src.match(/(BV[^\?\/]+)/);
            const videoId = src.match(/(BV[^\?&\/]+)/);
            if (videoId) {
                link.href = `https://www.bilibili.com/video/${videoId[0]}`;
                text4link.innerHTML = displayTextHead+'点击下面链接以前往原视频。<br><br>';
                link.innerHTML = link.href;
                text4link.style.color = 'white';
                text4link.style.textDecoration = 'none';
                link.style.color = 'white';
                link.style.textDecoration = 'none';
                //link.addEventListener('click', handleLinkClick);
                link.addEventListener('click', function (event) {
                    event.preventDefault();
                    if (openInNewTab) {
                        window.open(link.href, '_blank'); // 在新标签页中打开链接
                    } else {
                        window.location.href = link.href; // 在当前标签页中打开链接
                    }
                });
            } else {
                link.href = src;
                text4link.innerHTML = displayTextHead+'点击下面链接以展开完整内容。<br><br>';
                const displayText = `${src.slice(0, 30)}${src.length > 30 ? '...' : ''}`;
                link.innerHTML = displayText;
                text4link.style.color = 'white';
                text4link.style.textDecoration = 'none';
                link.style.color = 'white';
                link.style.textDecoration = 'none';
                link.addEventListener('click', function(event) {
                    event.preventDefault();
                    link.innerHTML = removeTrackingParams(link.href);
                    link.removeEventListener('click', handleLinkClick);
                    link.addEventListener('click', function(event) {
                        event.preventDefault();
                        if (openInNewTab) {
                            window.open(link.href, '_blank'); // 在新标签页中打开链接
                        } else {
                            window.location.href = link.href; // 在当前标签页中打开链接
                        }
                    });
                });
            }

            var container = document.createElement('div');
            container.style.backgroundColor = 'black';
            container.style.display = 'inline-block';
            container.style.padding = '10px';
            container.style.marginBottom = '10px';
            container.appendChild(text4link);
            container.appendChild(link);

            element.replaceWith(container);
        });
    }, 1000);
})();