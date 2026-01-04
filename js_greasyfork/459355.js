// ==UserScript==
// @name         洛谷调背景插件
// @namespace    洛谷调背景插件
// @version      1.0
// @description  作者用来替代stylish的自适应洛谷替换背景插件
// @author       LiuTianyou
// @match        https://www.luogu.com.cn/*
// @grant        none
// @license      GPL-v3.0
// @downloadURL https://update.greasyfork.org/scripts/459355/%E6%B4%9B%E8%B0%B7%E8%B0%83%E8%83%8C%E6%99%AF%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/459355/%E6%B4%9B%E8%B0%B7%E8%B0%83%E8%83%8C%E6%99%AF%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

window.back = "https://cdn.luogu.com.cn/upload/image_hosting/b9ifd7ye.png";
setInterval(function(){ //修复：背景图片缺失问题
    //修复：div不存在而错误终止脚本的情况
    document.querySelector('body').style=`background: url(${window.back}) fixed center;background-size: cover;`;
    if(document.querySelector('main[style="background-color: rgb(239, 239, 239);"]') != null)
        document.querySelector('main[style="background-color: rgb(239, 239, 239);"]').style="opacity: 0.9;";
    if(document.querySelector('div[style="background: linear-gradient(90deg, rgb(35, 37, 38), rgb(65, 67, 69)); filter: blur(0px) brightness(100%);"]') != null)
        document.querySelector('div[style="background: linear-gradient(90deg, rgb(35, 37, 38), rgb(65, 67, 69)); filter: blur(0px) brightness(100%);"]').style="opacity: 0.9;";
    if(document.querySelector('div[style="background: rgb(51, 51, 51); filter: blur(0px) brightness(100%);"]') != null)
        document.querySelector('div[style="background: rgb(51, 51, 51); filter: blur(0px) brightness(100%);"]').style="opacity: 0.9;";
    if(document.querySelector('div[class="mdui-panel mdui-panel-gapless"]') != null)
        document.querySelector('div[class="mdui-panel mdui-panel-gapless"]').style="opacity: 0.9;";
    if(document.querySelector("div[data-v-0a593618]") != null){
        document.querySelector("div[data-v-0a593618]").remove();
    }
},100);