// ==UserScript==
// @name         bilibili竖屏
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  测试页面https://space.bilibili.com/1168024907/channel/seriesdetail?sid=754766
// @author       moonwizard
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/medialist/*
// @match        https://www.bilibili.com/list/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457988/bilibili%E7%AB%96%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/457988/bilibili%E7%AB%96%E5%B1%8F.meta.js
// ==/UserScript==

(function() {

    // 创建button
    var button = document.createElement("button");
    button.id = "shuping";
    button.textContent = "竖屏";

    //创建button位置的元素位置数组
    var toolbarSite = new Array("ops","video-toolbar-left","toolbar-left");
    var toolbar;

    //匹配正确位置
    for (var i = 0; i < toolbarSite.length; i++ ) {
        if (document.getElementsByClassName(toolbarSite[i]).length == 1) {
            toolbar = document.getElementsByClassName(toolbarSite[i])[0];
        }
    }

    //等toolbar的DOM内容加载后再修改样式，否则会被覆盖
    toolbar.addEventListener("DOMNodeInserted", function(event) {
        toolbar.appendChild(button);

        //创建视频位置数组
        var videoBoxSite = new Array("bpx-player-video-wrap","bilibili-player-video-wrap");
        var videoBox;

        //匹配正确位置
        for (var i = 0; i < videoBoxSite.length; i++) {
            if (document.getElementsByClassName(videoBoxSite[i]).length == 1) {
                videoBox = document.getElementsByClassName(videoBoxSite[i])[0];
            }
        }

        button.onclick = function (){
            if (button.getAttribute("id") == "shuping") {
                videoBox.setAttribute("style","transform: rotate(90deg);scale: 0.55;");
                button.id = "hengping";
                button.textContent = "横屏";
            } else {
                videoBox.setAttribute("style","none");
                button.id = "shuping";
                button.textContent = "竖屏";
            }
        };
    });

})();