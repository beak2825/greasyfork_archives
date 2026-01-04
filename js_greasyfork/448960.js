// ==UserScript==
// @name         清除知乎图片和视频，懂得都懂
// @namespace    https://github.com/zjjjjjjjjjjd
// @description  干掉图片，干掉网页图片，禁用图片，禁用视频，知乎
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://www.zhihu.com/*
// @match        https://*.zhihu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license           AGPL License
// @downloadURL https://update.greasyfork.org/scripts/448960/%E6%B8%85%E9%99%A4%E7%9F%A5%E4%B9%8E%E5%9B%BE%E7%89%87%E5%92%8C%E8%A7%86%E9%A2%91%EF%BC%8C%E6%87%82%E5%BE%97%E9%83%BD%E6%87%82.user.js
// @updateURL https://update.greasyfork.org/scripts/448960/%E6%B8%85%E9%99%A4%E7%9F%A5%E4%B9%8E%E5%9B%BE%E7%89%87%E5%92%8C%E8%A7%86%E9%A2%91%EF%BC%8C%E6%87%82%E5%BE%97%E9%83%BD%E6%87%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function code() {
        console.log("清空图片和视频");
        const imgs = document.querySelectorAll('img')
        for (let i = 0;i<imgs.length;i++) {
            let item = imgs[i]
            let parent = item.parentNode
            let newC = document.createElement('div')
            newC.innerHTML = '[图片]'
            if(parent.replaceChild) {
                parent.replaceChild(newC,item)
            }
        }
        const videos = document.querySelectorAll('.RichText-video')
        for (let i = 0;i<videos.length;i++) {
            let item = videos[i]
            let parent = item.parentNode
            let newC = document.createElement('div')
            newC.innerHTML = '[视频]'
            if(parent.replaceChild) {
                parent.replaceChild(newC,item)
            }
        }
    }

    code()

    let start = Date.now()
    document.addEventListener("DOMNodeInserted", function(e){
        let cur = Date.now()
        if(cur - start < 1000) {
            return
        }
        start = cur
        setTimeout(code,100)
    });
})();