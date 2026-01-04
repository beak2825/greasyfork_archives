// ==UserScript==
// @name         B站（bilibili）自动续播因未登录而暂停的视频 (Bilibili: Continue playing without logging-in)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  解决B站（bilibili）因未登录而自动暂停视频并弹出登录窗口的问题，需要配合ublock origin屏蔽弹窗 / Solve the problem of Bilibili automatically pausing video and popping up a login window because it is not logged in, need ublock origin rules to block popup window
// @author       TheBeacon, FelineFinder
// @match        https://www.bilibili.com/video/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467541/B%E7%AB%99%EF%BC%88bilibili%EF%BC%89%E8%87%AA%E5%8A%A8%E7%BB%AD%E6%92%AD%E5%9B%A0%E6%9C%AA%E7%99%BB%E5%BD%95%E8%80%8C%E6%9A%82%E5%81%9C%E7%9A%84%E8%A7%86%E9%A2%91%20%28Bilibili%3A%20Continue%20playing%20without%20logging-in%29.user.js
// @updateURL https://update.greasyfork.org/scripts/467541/B%E7%AB%99%EF%BC%88bilibili%EF%BC%89%E8%87%AA%E5%8A%A8%E7%BB%AD%E6%92%AD%E5%9B%A0%E6%9C%AA%E7%99%BB%E5%BD%95%E8%80%8C%E6%9A%82%E5%81%9C%E7%9A%84%E8%A7%86%E9%A2%91%20%28Bilibili%3A%20Continue%20playing%20without%20logging-in%29.meta.js
// ==/UserScript==

// ⚠️注意：不支持鼠标点击暂停，因为作者懒了
// 随时可能失效，不过原作者这种思路很有用
// 需要配合 ||s1.hdslb.com/bfs/seed/jinkela/short/mini-login-v2/miniLogin* 这条ublock origin规则食用，直接屏蔽弹窗。不屏蔽的话自己加上点击叉叉的代码也可以（参考原作者的0.3版本）

(function() {
    'use strict';
    let isUserPause = false; // 标记是否用户按空格产生的暂停
    let target = document.getElementsByClassName("bpx-player-row-dm-wrap")[0];
    let config = {attributes: true, attributeFilter: ["class"]};
    let observer = new MutationObserver(function(motationList, observer) {
        // setTimeout 等元素加载后再添加 observer 方法
        setTimeout(function(){
            // 不是用户按的暂停，那就是屑站做的手脚
            if (document.getElementsByClassName("bili-paused").length > 0 && !isUserPause) {
                document.getElementsByClassName("bpx-player-ctrl-btn bpx-player-ctrl-play")[0].click();
            }
        }, 1000);
    });
    observer.observe(target, config);
  
    window.__onKey__ = (event) => {
        if (event.code !== "Space") return;
        // 没有暂停时按空格，说明进入暂停，故标记为用户暂停；继续播放时清理掉标记
        isUserPause = (document.getElementsByClassName("bili-paused").length === 0);
    };
    document.addEventListener('keydown', window.__onKey__, true);
  
})();
