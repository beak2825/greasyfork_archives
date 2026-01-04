// ==UserScript==
// @name        VIP视频全解析
// @namespace    https://www.love599.net/
// @version      3.5
// @description    解析并破解各大视频站的VIP权限 纯净无广告
// @author       love599
// @match        *://*.iqiyi.com/*
// @match        *://*.youku.com/*
// @match        *://*.le.com/*
// @match        *://*.letv.com/*
// @match        *://v.qq.com/*
// @match        *://*.tudou.com/*
// @match        *://*.mgtv.com/*
// @match        *://film.sohu.com/*
// @match        *://tv.sohu.com/*
// @match        *://*.acfun.cn/v/*
// @match        *://*.bilibili.com/*
// @match        *://vip.1905.com/play/*
// @match        *://*.pptv.com/*
// @match        *://v.yinyuetai.com/video/*
// @match        *://v.yinyuetai.com/playlist/*
// @match        *://*.fun.tv/vplay/*
// @match        *://*.wasu.cn/Play/show/*
// @exclude      *://*.bilibili.com/blackboard/*
// @downloadURL https://update.greasyfork.org/scripts/371543/VIP%E8%A7%86%E9%A2%91%E5%85%A8%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/371543/VIP%E8%A7%86%E9%A2%91%E5%85%A8%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    try{
        document.querySelector('#widget-dramaseries').addEventListener('click', function getLink (e){
            var target=e.target.parentNode.tagName=="LI"?e.target.parentNode:(e.target.parentNode.parentNode.tagName=="LI"?e.target.parentNode.parentNode:e.target.parentNode.parentNode.parentNode);
            if(target.tagName!="LI")return;
            location.href=target.childNodes[1].href;
        });
    }
    catch(exception){

    }



    var div=document.createElement("div");
    div.innerHTML='<div id="analysis"><a style="color:#008000;font-size:28px" href="javascript:window.open(\'http://api.love599.net/?url=\'+location.href)">▷</a></div>';
    document.body.appendChild(div);
    document.getElementById('analysis').style.cssText='z-index:99999;position: fixed;top:200px;left:0';
})();