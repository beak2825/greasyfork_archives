// ==UserScript==
// @name         VIP视频解锁android
// @namespace    http://tampermonkey.net/
// @version      2.0.5
// @description  VIP视频解锁
// @author        PwnInt
// @match         https://www.hjhs101.com/videos/*
// @include       http://www.hjhs101.com/*
// @include       https://www.hjhs101.com/*
// @include       http://www.hjhs101.com/
// @include       https://www.hjhs101.com/
// @match         https://www.hjhs103.com/videos/*
// @include       http://www.hjhs103.com/*
// @include       https://www.hjhs103.com/*
// @include       http://www.hjhs103.com/
// @include       https://www.hjhs103.com/
// @match         https://www.hjhs104.com/videos/*
// @include       http://www.hjhs104.com/*
// @include       https://www.hjhs104.com/*
// @include       http://www.hjhs104.com/
// @include       https://www.hjhs104.com/
// @include       https://www.hjhs102.com/
// @include       https://www.hjhs102.com/videos/*
// @include       http://www.hjhs102.com/videos/*
// @require       http://cdn.bootcss.com/jquery/3.6.0/jquery.min.js
// @require       https://unpkg.com/ajax-hook/dist/ajaxhook.min.js
// @run-at        document-start
// @grant         none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/431957/VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E9%94%81android.user.js
// @updateURL https://update.greasyfork.org/scripts/431957/VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E9%94%81android.meta.js
// ==/UserScript==
"use strict";
//感谢大佬wendux的AJAX-Hook脚本库，地址：https://github.com/wendux/Ajax-hook
console.warn("VIP视频解锁：感谢大佬wendux的AJAX-Hook脚本库，地址：https://github.com/wendux/Ajax-hook");
console.warn("VIP视频解锁：感谢大佬luckly-mjw的M3U8下载解析站，地址：http://blog.luckly-mjw.cn/");
console.warn("VIP视频解锁：感谢m3u8player第三方解析站，地址：http://www.m3u8player.top/");
var DownloadM3u8Url;
function HookInfo()
{//拦截修改m3u8文件
    ah.proxy({
        //请求发起前进入
        onRequest: (config, handler) => {
            console.log(config.url)
            if(config.url.indexOf("suo")!=-1)
            {
                DownloadM3u8Url = config.url.replace(".suo","").replace("_suo","");
                config.url = DownloadM3u8Url;
                ChangeIssues();
            }
            handler.next(config);
        },
        //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
        onError: (err, handler) => {
            console.log(err.type)
            handler.next(err)
        },
        //请求成功后进入
        onResponse: (response, handler) => {
            handler.next(response)
        }
    })
};
 
function ChangeIssues(){
    var Issues =document.evaluate('/html/body/div[3]/div[2]/div[3]/div[2]/div[3]/div/div[1]/div[3]/ul/li[2]/a',document).iterateNext();
    var Video_Detail_Dur = document.evaluate('/html/body/div[3]/div[2]/div[3]/div[2]/div[3]/div/div[2]/div/div[2]/div[1]/span[1]',document).iterateNext();
    var Line_1 = $("#quality_opt_4");
    var Line_2 = $("#quality_opt_2");
    var ScrollElement = $(".sponsor")[0];
    var OpenUrl = `http://blog.luckly-mjw.cn/tool-show/m3u8-downloader/index.html?source=${DownloadM3u8Url}`
    Line_1.remove();//移除
    Line_2.remove();//移除
    Video_Detail_Dur.setAttribute("style","font-size:22px;color:red");//修改
    Video_Detail_Dur.children[0].setAttribute("style","font-size:22px;color:red");//修改
    Issues.setAttribute("style","font-size:18px;color:red");//修改
    Issues.text = "VIP视频解锁成功";
    ScrollElement.onclick=function(){window.open(OpenUrl)};
    ScrollElement.firstElementChild.setAttribute("style","color:green;font-size:1.01em;text-decoration;underline;cursor:pointer;user-select:text");
    ScrollElement.firstElementChild.textContent = "视频VIP地址"+DownloadM3u8Url;
}

if(location.href.indexOf("videos")!=-1 && location.href.indexOf("#videos")==-1)//处理分类视频的video关键字
{
    if(navigator.appVersion.indexOf("iPhone")==-1)
    {
        HookInfo();
    }
}
