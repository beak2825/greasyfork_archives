// ==UserScript==
// @name         👍视频网站自动点赞
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  视频网站自动点赞，在浏览bilibili视频页面和专栏页面时自动帮您点赞
// @author       Rubmle
// @match        *://*.bilibili.com/video/av*
// @match        *://*.bilibili.com/video/BV*
// @match        *://*.bilibili.com/read/cv*
// @match        *://*.youtube.com/watch?v=*
// @homepageURL    https://github.com/rubmle/AutoVideoLikes
// @supportURL     https://github.com/rubmle/AutoVideoLikes/issues
// @grant        none
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAYAAAA4TnrqAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA2LTA5VDE5OjI3OjM2KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNi0wOVQxOTozMToxOSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNi0wOVQxOTozMToxOSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphMThjMmZiYS1mMzQ1LTM5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
// @license      GPL License
// @copyright    2023, Rubmle (https://github.com/rubmle)
// @downloadURL https://update.greasyfork.org/scripts/405008/%F0%9F%91%8D%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/405008/%F0%9F%91%8D%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

// 等待指定时间，返回 Promise 对象
function wait(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

// 判断元素中的class属性中是否包含指定的值
function hasClass(element, className) {
    return element.classList.contains(className);
}

function biliVideoLikes(){
    // 获取 toolbar-left-item-wrap 元素下第一个 div 元素并模拟点击
    const videoDiv = document.querySelector('.toolbar-left-item-wrap > div');
    wait(5000).then(() => {
        if (!hasClass(videoDiv, 'on')) {
            videoDiv.click();
            document.title = '👍' + document.title;
        } else {
            document.title = '[已赞]' + document.title;
        }
    });
}

function biliReadLikes(){
    // 获取 toolbar-left-item-wrap 元素下第一个 div 元素并模拟点击
    const readDiv = document.querySelector('.side-toolbar > div');
    wait(5000).then(() => {
        if (!hasClass(readDiv, 'toolbar-on')) {
            readDiv.click();
            document.title = '👍' + document.title;
        } else {
            document.title = '[已赞]' + document.title;
        }
    });
}


(function() {
    'use strict';
    document.onreadystatechange = () => {
        if (document.readyState === 'complete') {
            console.log('网页已经加载完毕！');
            // 获取当前页面的URL
            const url = location.href;
            switch (true) {
                case url.includes('www.bilibili.com/video'):
                    console.log("这是B站的视频页面");
                    biliVideoLikes();
                    console.log("点赞完毕");
                    break;
                case url.includes('www.bilibili.com/read'):
                    console.log("这是B站的专栏页面");
                    biliReadLikes();
                    console.log("点赞完毕");
                    break;
            }
        }
    }
})();
