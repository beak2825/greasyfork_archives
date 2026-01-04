// ==UserScript==
// @name         国内主流视频网站去Logo
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  腾讯、优酷、爱奇艺、B站直播
// @author       初七
// @match        http*://v.youku.com/*
// @match        http*://www.iqiyi.com/*
// @match        http*://v.qq.com/*
// @match        http*://www.nfmovies.com/*
// @match        http*://*.bilibili.com/*
// @match        http*://*.yanetflix.com/*
// @resource     https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391168/%E5%9B%BD%E5%86%85%E4%B8%BB%E6%B5%81%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%E5%8E%BBLogo.user.js
// @updateURL https://update.greasyfork.org/scripts/391168/%E5%9B%BD%E5%86%85%E4%B8%BB%E6%B5%81%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%E5%8E%BBLogo.meta.js
// ==/UserScript==
window.addEventListener('load',function(){
    //页面的全部资源加载完才会执行，包括图片，视频

    var arr = [".iqp-logo-top",
               ".iqp-logo-bottom",
               ".txp_waterMark_pic",
               ".spv-logo",
               ".dplayer-logo",
               ".logo-new",
               ".web-player-icon-roomStatus",
               ".leleplayer-logo",
               ".logo-new"
              ];
    for(var i=0;i<arr.length;i++){
        document.querySelectorAll(arr[i]).forEach(function(item,index,arr){item.style.display='none';});
        console.log("页面加载执行成功");
    }
})





