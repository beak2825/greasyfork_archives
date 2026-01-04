// ==UserScript==
// @name         洛谷调背景删广告插件
// @namespace    洛谷调背景删广告插件
// @version      1.0
// @description  洛谷替换背景、删除广告插件
// @author       TheSoundOfWA
// @match        https://www.luogu.com.cn/*
// @grant        none
// @license      GPL-v3.0
// @downloadURL https://update.greasyfork.org/scripts/500589/%E6%B4%9B%E8%B0%B7%E8%B0%83%E8%83%8C%E6%99%AF%E5%88%A0%E5%B9%BF%E5%91%8A%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/500589/%E6%B4%9B%E8%B0%B7%E8%B0%83%E8%83%8C%E6%99%AF%E5%88%A0%E5%B9%BF%E5%91%8A%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

function changeBackGround() {
    window.back = "https://cdn.luogu.com.cn/upload/image_hosting/gvid4kki.png";
    setInterval(function(){
        document.querySelector('body').style=`background: url(${window.back}) fixed center;background-size: cover;`;
        if(document.querySelector('main[style="background-color: rgb(239, 239, 239);"]') != null) document.querySelector('main[style="background-color: rgb(239, 239, 239);"]').style="opacity: 0.9;";
        if(document.querySelector('div[style="background: linear-gradient(90deg, rgb(35, 37, 38), rgb(65, 67, 69)); filter: blur(0px) brightness(100%);"]') != null) document.querySelector('div[style="background: linear-gradient(90deg, rgb(35, 37, 38), rgb(65, 67, 69)); filter: blur(0px) brightness(100%);"]').style="opacity: 0.9;";
        if(document.querySelector('div[style="background: rgb(51, 51, 51); filter: blur(0px) brightness(100%);"]') != null) document.querySelector('div[style="background: rgb(51, 51, 51); filter: blur(0px) brightness(100%);"]').style="opacity: 0.9;";
        if(document.querySelector('div[class="mdui-panel mdui-panel-gapless"]') != null) document.querySelector('div[class="mdui-panel mdui-panel-gapless"]').style="opacity: 0.9;";
        if(document.querySelector("div[data-v-0a593618]") != null) document.querySelector("div[data-v-0a593618]").remove();
    },0);
}

window.addEventListener('load', function() {
    if (localStorage.getItem("change-background") == "true") changeBackGround();
    else if (localStorage.getItem("change-background") == "false") {
    } else {
        if (confirm("确认更改背景？\n选择后若要更改设置，请重启浏览器并重新访问此页面\nlink: " + location.href)) {
            localStorage.setItem("change-background", "true");
            changeBackGround();
        } else localStorage.setItem("change-background", "false");
    }
    // localStorage.setItem("change-background", "");
});