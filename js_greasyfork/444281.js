// ==UserScript==
// @name         黄家会所TV-VIP视频解锁 hjhs.tv（弃坑，不处理错误反馈）
// @namespace    http://tampermonkey.net/
// @version      1.7.4.4
// @description  黄家会所TV-VIP视频解锁
// @author        PwnInt
// @match         https://www.hjhs101.com/videos/*
// @match       http://www.hjhs101.com/*
// @match       https://www.hjhs101.com/*
// @match       http://www.hjhs101.com/
// @match       https://www.hjhs101.com/
// @match       https://www.hjhs103.com/videos/*
// @match       http://www.hjhs103.com/*
// @match       https://www.hjhs103.com/*
// @match       http://www.hjhs103.com/
// @match       https://www.hjhs103.com/
// @match       https://www.hjhs104.com/videos/*
// @match       http://www.hjhs104.com/*
// @match       https://www.hjhs104.com/*
// @match       http://www.hjhs104.com/
// @match       https://www.hjhs104.com/
// @match       https://www.hjhs102.com/
// @match       https://www.hjhs102.com/videos/*
// @match       http://www.hjhs102.com/videos/*
// @match       https://www.hjhs105.com/
// @match       https://www.hjhs105.com/videos/*
// @match       http://www.hjhs105.com/videos/*
// @match       https://www.hjhs106.com/
// @match       https://www.hjhs106.com/videos/*
// @match       http://www.hjhs106.com/videos/*
// @match       https://www.hjhs107.com/
// @match       https://www.hjhs107.com/videos/*
// @match       http://www.hjhs107.com/videos/*
// @match       https://www.hjhs108.com/
// @match       https://www.hjhs108.com/videos/*
// @match       http://www.hjhs108.com/videos/*
// @match       https://www.hjhs109.com/
// @match       https://www.hjhs109.com/videos/*
// @match       http://www.hjhs109.com/videos/*
// @match       https://www.hjhs101.xyz
// @match       https://www.hjhs101.xyz/videos/*
// @require       http://cdn.bootcss.com/jquery/3.1.0/jquery.min.js
// @require       https://unpkg.com/ajax-hook/dist/ajaxhook.min.js
// @run-at        document-start
// @grant         none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/444281/%E9%BB%84%E5%AE%B6%E4%BC%9A%E6%89%80TV-VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E9%94%81%20hjhstv%EF%BC%88%E5%BC%83%E5%9D%91%EF%BC%8C%E4%B8%8D%E5%A4%84%E7%90%86%E9%94%99%E8%AF%AF%E5%8F%8D%E9%A6%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/444281/%E9%BB%84%E5%AE%B6%E4%BC%9A%E6%89%80TV-VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E9%94%81%20hjhstv%EF%BC%88%E5%BC%83%E5%9D%91%EF%BC%8C%E4%B8%8D%E5%A4%84%E7%90%86%E9%94%99%E8%AF%AF%E5%8F%8D%E9%A6%88%EF%BC%89.meta.js
// ==/UserScript==
"use strict";
//感谢大佬wendux的AJAX-Hook脚本库，地址：https://github.com/wendux/Ajax-hook
console.warn("黄家会所TV-VIP视频解锁：感谢大佬wendux的AJAX-Hook脚本库，地址：https://github.com/wendux/Ajax-hook");
console.warn("黄家会所TV-VIP视频解锁：感谢大佬luckly-mjw的M3U8下载解析站，地址：http://blog.luckly-mjw.cn/");
console.warn("黄家会所TV-VIP视频解锁：感谢m3u8player第三方解析站，地址：http://www.m3u8player.top/");
var Status=0;//解析成功标志位
var LoadFlag;
var Test;
var DownloadM3u8Url;
var Issues;
var Ios_Flag;
function HookInfo()
{
    ah.hook(
        {
            onreadystatechange:function(xhr,event)
            {
                console.log("黄家会所TV-VIP视频解锁：onreadystatechange事件发生：网站正在请求URL:"+xhr.responseURL);
            },
            onload:function(xhr)
            {
                console.log("黄家会所TV-VIP视频解锁：onload事件发生：网站正在请求URL:"+xhr.responseURL);
            },
            open:function(args)//修改m3u8
            {
                if(args[1].indexOf("suo")!=-1)
                {
                    args[1] = args[1].replace("_suo","").replace(".b","").replace(".a","");//修复
                    Status=1;//解析成功
                    DownloadM3u8Url = args[1];
                    console.warn("黄家会所TV-VIP视频解锁：解析成功");
                }
                if(Status!=1)//如果没有更新成功则刷新页面，直到更新完成
                {
                    console.error("黄家会所TV-VIP视频解锁：没有拦截成功，正在重试...");
                    location.reload();
                }
            }
        }
    )
};

function ChangeIssues(){
    if(Status==1)//解析成功
    {
        Issues =document.evaluate('/html/body/div[3]/div[2]/div[3]/div[2]/div[3]/div/div[1]/div[3]/ul/li[2]/a',document).iterateNext();
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
        Issues.text = "黄家会所TV-VIP视频解锁：VIP解析成功，请直接观看";
        ScrollElement.onclick=function(){window.open(OpenUrl)};
        ScrollElement.firstElementChild.setAttribute("style","color:green;font-size:1.01em;text-decoration;underline;cursor:pointer;user-select:text");
        ScrollElement.firstElementChild.textContent = "点击下载视频【非本页面直接下载】"+DownloadM3u8Url;
        var VideoDoc = $(".fp-ui")["context"];//获取整块播放器
        var VideoProcessbar = $("video")[0];//获取视频对象
        VideoDoc.onkeyup = function(event)
        {
            console.log("黄家会所TV-VIP视频解锁::当前输入的键代码为:"+event.keyCode);
            if(event.keyCode==39)
            {
                VideoProcessbar.currentTime+=10;//增加的秒数
            }
            if(event.keyCode==37)
            {
                VideoProcessbar.currentTime-=10;//减少的秒数
            }
            /*在上方代码中修改注释地方可以控制增加减少的秒数，不是特别大就好。*/
            if(event.keyCode==38)
            {
                try
                {
                  document.body.parentNode.style.overflow = "hidden";
                  VideoProcessbar.volume+=0.1;//增大音量
                }
                catch
                {
                    VideoProcessbar.volume=1;
                }
            }
            if(event.keyCode==40)
            {
                try
                {
                  document.body.parentNode.style.overflow = "hidden";
                  VideoProcessbar.volume-=0.1;//减小音量
                }
                catch
                {
                    VideoProcessbar.volume=0;
                }
            }
        }
    }
}
function HeightLightDur()
{
    var DurClass = $(".duration");
    if(DurClass!=null)
    {
        var DurClass_Len = DurClass.length;
        for(var index=0;index<DurClass_Len;index++)
        {
            DurClass[index].textContent = "完整版时长:"+DurClass[index].textContent;
            DurClass[index].setAttribute("style","font-size:18px;color:red");//修改
        }
        clearInterval(LoadFlag);//加载完毕清除定时器
    }
}
function RemoveAd()
{
    try
    {
        var BackGround_M = $("#layui-layer-shade1");//去除蒙版
        var Dialog_M = $("#layui-layer1");//去除弹框
        var Adversion_Head = $(".wrap-head-spots");//去除广告
        if(BackGround_M!=null&&Dialog_M!=null)
        {
            BackGround_M[0].setAttribute("class","layui-layer-move");//移除蒙版
            Dialog_M[0].setAttribute("class","layui-layer-move");//移除弹窗
        }
        if(Adversion_Head!=undefined)
        {
            Adversion_Head[0].remove();//移除上方广告
        }
    }
    catch
    {

        console.warn("黄家会所TV-VIP视频解锁：没有找到广告");
        clearInterval(Test);//寻找广告结束
    }
}
function IosHelper()
{
        var RegVideoPath = /(?<=videos_screenshots\/)\d.+(?=\/p)/g;
        var VideoPreivewStyle;
        var PlayerElement = document.getElementById("player_container");

        if(PlayerElement!=undefined)
        {
        VideoPreivewStyle = PlayerElement.getAttribute("style");
        var RegeStrPath = RegVideoPath.exec(VideoPreivewStyle )[0];
        var CdnUrl = "https://cdn.hjhs.m3u8.xiaoxiaodl.com/m3u8/";
        var Cdn_End = "/index.m3u8";
        var Online_M3u8_url = "http://www.m3u8player.top/?play=";
        var IoSTips = document.evaluate('/html/body/div[3]/div[2]/div[3]/div[2]/div[3]/div/div[1]/div[3]/ul/li[2]/a',document).iterateNext();
        var PlayUrl = Online_M3u8_url+CdnUrl+RegeStrPath+Cdn_End;
        IoSTips.setAttribute("href",PlayUrl);
        IoSTips.setAttribute("style","font-size:15px;color:green");
        IoSTips.text = "IOS用户请点击这里跳转到第三方播放";
        clearInterval(Ios_Flag);
        }
}

if(location.href.indexOf("videos")!=-1 && location.href.indexOf("#videos")==-1)//处理分类视频的video关键字
{

    if(navigator.appVersion.indexOf("iPhone")==-1)
    {
        HookInfo();//拦截修改m3u8文件
       setInterval(ChangeIssues,500);
    }
    else
    {
        Ios_Flag = setInterval(IosHelper,1000);
    }
}
else
{
ShowDisabledInfo();//提示过期
   LoadFlag = setInterval(HeightLightDur,1000);//设置定时器
   Test = setInterval(RemoveAd,1000);//开始去广告
}
