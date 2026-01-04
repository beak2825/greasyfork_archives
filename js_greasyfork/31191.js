// ==UserScript==
// @name         VIP Video Cracker（VIP视频解析）
// @name:en      VIP Video Cracker
// @namespace    http://unbelievable.3vkj.net/
// @version      2.5.4.2
// @description  主要解析爱奇艺、优酷、腾讯、乐视、搜狐、土豆、芒果、PPTV、1905、A站、B站、音悦Tai、华视TV等VIP在线视频，在浏览器左上角添加“@史婷露”按钮,当鼠标放在左上角才会显示，既美观又实用。
// @author       @史婷露
// @match        *://*.iqiyi.com/a_*
// @match        *://*.iqiyi.com/v_*
// @match        *://*.iqiyi.com/kszt/*
// @match        *://*.iqiyi.com/dianying/*
// @match        *://v.youku.com/v_show/*
// @match        *://v.qq.com/x/cover/*
// @match        *://v.qq.com/x/page/*
// @match        *://*.le.com/ptv/vplay/*
// @match        *://tv.sohu.com/20*
// @match        *://film.sohu.com/album/*
// @match        *://*.tudou.com/listplay/*
// @match        *://*.tudou.com/albumplay/*
// @match        *://*.tudou.com/programs/view/*
// @match        *://*.mgtv.com/b/*
// @match        *://v.pptv.com/show/*
// @match        *://vip.pptv.com/show/*
// @match        *://ddp.vip.pptv.com/vod_detail/*
// @match        *://vip.1905.com/play/*
// @match        *://*.acfun.cn/v/*
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/anime/*
// @match        *://v.yinyuetai.com/video/*
// @match        *://v.yinyuetai.com/playlist/*
// @match        *://*.wasu.cn/Play/show/*
// @exclude      *?url=*
// @exclude      *?qt=*
// @exclude      *?v=*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/31191/VIP%20Video%20Cracker%EF%BC%88VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/31191/VIP%20Video%20Cracker%EF%BC%88VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%EF%BC%89.meta.js
// ==/UserScript==
(function(){
    'use strict';
    function addDiv(){
        var div = document.createElement("div");
        div.innerHTML = "@史婷露";
        var css = "position:fixed;top:-7px;left:-64px;z-index:999999999;width:60px;height:32px;line-height:32px;text-align:center;font-size:12px;font-family:Verdana, Arial, '宋体';color:#999;background:#333;opacity:0.05;transition:0.3s;user-select:none;white-space:nowrap;padding:0 16px;border:2px solid #333; border-width:2px 2px 2px 0;border-radius:0 0 5px 0;box-sizing: content-box; cursor: pointer; ";
        div.style.cssText = css;
        if(window.self === window.top){ document.body.appendChild(div);}
        div.addEventListener("mouseover",function(){div.style.top = "5px";div.style.left = "0"; div.style.opacity = "0.9"; div.style.height = "32px"; div.style.lineHeight = "32px";div.style.border = "2px solid #ccc";div.style.borderWidth = "2px 2px 2px 0";div.style.borderRadius = "0 5px 5px 0";});
        div.addEventListener("mouseleave",function(){div.style.top = "-7px";div.style.left = "-64px";div.style.opacity = "0.05";div.style.height = "32px";div.style.lineHeight = "32px";div.style.border = "2px solid #333";div.style.borderWidth = "2px 2px 2px 0";div.style.borderRadius = "0 0 5px 0";});
        div.addEventListener("click",function(){var url = window.location.href;var link;if(url.indexOf('iqiyi.com/a_')>=0){link="https://www.yymeier.com/api.php?url="+url;}else if(url.indexOf('iqiyi.com/v_')>=0 || url.indexOf('iqiyi.com/kszt')>=0 || url.indexOf('iqiyi.com/dianying')>=0){link="https://www.yymeier.com/api.php?url="+url;}else if(url.indexOf('v.qq.com/x')>=0){link="http://api.baiyug.cn/vip/index.php?url="+url;}else if(url.indexOf('vip.1905.com/play')>=0){link="http://aikan-tv.com/?url="+url;}else{link="https://api.47ks.com/webcloud/?v="+url;}window.open(link,'_self'); });
   }
   addDiv();
})();