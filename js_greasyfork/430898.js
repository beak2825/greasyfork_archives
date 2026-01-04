// ==UserScript==
// @name         蜻蜓FM-当前页电台网络地址下载【最转换为欧卡电台格式】
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  蜻蜓FM-当前页电台网络地址下载
// @author       PwnInt
// @match        https://www.qingting.fm/radiopage/*
// @include      https://www.qingting.fm/
// @icon         https://www.google.com/s2/favicons?domain=qingting.fm
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/430898/%E8%9C%BB%E8%9C%93FM-%E5%BD%93%E5%89%8D%E9%A1%B5%E7%94%B5%E5%8F%B0%E7%BD%91%E7%BB%9C%E5%9C%B0%E5%9D%80%E4%B8%8B%E8%BD%BD%E3%80%90%E6%9C%80%E8%BD%AC%E6%8D%A2%E4%B8%BA%E6%AC%A7%E5%8D%A1%E7%94%B5%E5%8F%B0%E6%A0%BC%E5%BC%8F%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/430898/%E8%9C%BB%E8%9C%93FM-%E5%BD%93%E5%89%8D%E9%A1%B5%E7%94%B5%E5%8F%B0%E7%BD%91%E7%BB%9C%E5%9C%B0%E5%9D%80%E4%B8%8B%E8%BD%BD%E3%80%90%E6%9C%80%E8%BD%AC%E6%8D%A2%E4%B8%BA%E6%AC%A7%E5%8D%A1%E7%94%B5%E5%8F%B0%E6%A0%BC%E5%BC%8F%E3%80%91.meta.js
// ==/UserScript==
(function() {
    'use strict';
    /*
       脚本实际属于自用脚本，用不了的希望见谅，蜻蜓FM地址：https://www.qingting.fm
       第一次进入到电台页面是可以显示下载按钮的，如果在电台页面切换到其他页面再切换回来，需要刷新一下才会显示按钮【定时器的原因导致需要这步操作，否则太浪费资源】
    */
//var LocalNum_QT = 0;//记录本地id
unsafeWindow.LocalNum_QT = 0;
function AddDownload_Button()//移除二维码下载的文字，改为自己的下载描述
{
    var QR_OneDesc = document.getElementsByClassName("text-view")[0];
    for(var o=0;o<QR_OneDesc.childElementCount;o++)
    {
        QR_OneDesc.children[o].remove();//移除
    }
    var DownloadFileButton=document.createElement("a");
    DownloadFileButton.className = "title";
    DownloadFileButton.text = "点击下载当前页面电台文本【欧卡】";
    DownloadFileButton.style.fontSize="16px";
    DownloadFileButton.style.cursor = "pointer";
    DownloadFileButton.onclick = function()
    {
        var Date_ = new Date();
        var NowDetailDate = Date_.getFullYear()+"-"+(Date_.getMonth()+1)+"-"+Date_.getDate()+"-"+Date_.getHours()+"-"+Date_.getMinutes()+"-"+Date_.getSeconds();
        DownloadFileButton.download = `电台列表[欧卡]-${NowDetailDate}.txt`;
        DownloadFileButton.href = GetDownloadUrl().DownloadUrl;
    };
    QR_OneDesc.appendChild(DownloadFileButton);
}
function GetDownloadUrl()//获取下载链接
{
    var Radio_CoverImg = document.getElementsByClassName("coverImg");
    var TextContent = "";//最后汇总的文本名称
    var LivePlay_url_start = "https://lhttp.qingting.fm/live/";
    var LivePlay_url_end = "/64k.mp3";
    var NowPageRadioCount = Radio_CoverImg.length;
    var RegxMatchRadio = /(?<=radios\/)\d.+/;//正则表达式
    var BlobStream;var DownloadUrl;
    for (var i=0;i<NowPageRadioCount;i++)
    {
        unsafeWindow.LocalNum_QT++;
        var Radio_Name = Radio_CoverImg[i].children[0].alt.trim();//电台名称
        var Radio_Num = RegxMatchRadio.exec(Radio_CoverImg[i].href)[0];//电台ID
        var EuroStreamText = `stream_data[${unsafeWindow.LocalNum_QT-1}]:`;//使用增长ID
        var Radio_liveUrl = LivePlay_url_start+Radio_Num+LivePlay_url_end;
        var Radio_Name_Utf8 = encodeURIComponent(Radio_Name).replaceAll("%","\\x").toLocaleLowerCase();//转为UTF8编码，目的是为了让中文在欧卡电台中正常显示
        TextContent+=EuroStreamText+`\"${Radio_liveUrl}\|${Radio_Name_Utf8}\"\n`;//拼接为欧卡支持的格式
    }
    BlobStream = new Blob([TextContent]);//返回一个Blob对象
    DownloadUrl = URL.createObjectURL(BlobStream);
    var ReturnInfo = {"DownloadUrl":DownloadUrl};
    return ReturnInfo;//返回下载的URL
}
var TimeEndFlag = setInterval(() => {
    if(window.location.href.indexOf("radiopage")!=-1)
    {
        AddDownload_Button();
        clearInterval(TimeEndFlag);
    }
}, 100);//寻找到raidopage页面就停止
})();