// ==UserScript==
// @name         江苏开放大学刷课脚本-解决有些课程无法点击问题
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  江苏开放大学刷课脚本- 解决有些课程无法点击问题
// @author       Pwn
// @match        http://xuexi.jsou.cn/jxpt-web/student/courseuser/courseContent?courseVersionId=*
// @match        http://xuexi.jsou.cn/jxpt-web/student/activity/display?courseVersionId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jsou.cn
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461738/%E6%B1%9F%E8%8B%8F%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC-%E8%A7%A3%E5%86%B3%E6%9C%89%E4%BA%9B%E8%AF%BE%E7%A8%8B%E6%97%A0%E6%B3%95%E7%82%B9%E5%87%BB%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/461738/%E6%B1%9F%E8%8B%8F%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC-%E8%A7%A3%E5%86%B3%E6%9C%89%E4%BA%9B%E8%AF%BE%E7%A8%8B%E6%97%A0%E6%B3%95%E7%82%B9%E5%87%BB%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==
function StartRunCourse()
{
    for(var i=0;i<300;i++)
    {
        sendHeartBeatAjax();//调用原生方法
    }
}

function InjectClickButton()//修改按钮
{
    var StartTree = document.evaluate('//*[@id="courseContent_1_switch"]',document).iterateNext();
    var ShowText =document.evaluate('//*[@id="courseContent_1_a"]',document).iterateNext();
    ShowText.textContent = "点击一键完成本课";
    ShowText.style.color="red";
    StartTree.removeAttribute("treenode_switch");
    StartTree.onclick=()=>{StartRunCourse()}
    ShowText.onclick=()=>{StartRunCourse()}
}

function GetDocId()
{
    var DocActivy = document.getElementsByClassName('activity doc');
    var DocIds = []
    for(var i=0;i<DocActivy.length;i++)
    {
        var IdValue = DocActivy[i].getAttribute("id");//ID值
        DocIds.push(IdValue);//添加到值列表中
    }
    return DocIds;
}
function GetVideoId()
{
    var VideoActivy = document.getElementsByClassName('activity video');
    var VideoIds = []
    for(var i=0;i<VideoActivy.length;i++)
    {
        var IdValue = VideoActivy[i].getAttribute("id");//ID值
        VideoIds.push(IdValue);//添加到值列表中
    }
    return VideoIds;//返回视频ID
}
function GetAudioId()
{
    var AudioActivy = document.getElementsByClassName('activity audio');
    var AudioIds = []
    for(var i=0;i<AudioActivy.length;i++)
    {
        var IdValue = AudioActivy[i].getAttribute("id");//ID值
        AudioIds.push(IdValue);//添加到值列表中
    }
    return AudioIds;//返回音频ID
}
function DocHeart_Send()//文档类
{
    var Id_Doc = GetDocId();
    dataHeart.isStuLearningRecord=2;
    dataHeart.type=1;
    for(var i=0;i<Id_Doc.length;i++)
    {
        dataHeart.activityId = Id_Doc[i];
        console.log("正在努力发送文档心跳包中，当前正在执行的课程ID为："+Id_Doc[i]);
        for(var k=0;k<10;k++)
        {
            sendHeartBeatAjax();
        }
    }
}
function VideoHeart_Send()//视频类
{
    var Id_Video = GetVideoId();
    dataHeart.isStuLearningRecord=2;
    dataHeart.type=2;
    dataHeart.playStatus=true;
    dataHeart.isResourcePage=true;
    for(var i=0;i<Id_Video.length;i++)
    {
        dataHeart.activityId = Id_Video[i];
        console.log("正在努力发送视频心跳包中，当前正在执行的课程ID为："+Id_Video[i]);
        for(var k=0;k<20;k++)
        {
            sendHeartBeatAjax();
        }
    }
}
function AudioHeart_Send()//音频类
{
    var Id_Audio = GetAudioId();
    dataHeart.isStuLearningRecord=2;
    dataHeart.type=6;
    for(var i=0;i<Id_Audio.length;i++)
    {
        dataHeart.activityId = Id_Audio[i];
        console.log("正在努力发送音频心跳包中，当前正在执行的课程ID为："+Id_Audio[i]);
        for(var k=0;k<10;k++)
        {
            sendHeartBeatAjax();
        }
    }
}

function MainRun()
{
    if(location.href.includes("display"))
    {
        InjectClickButton();//观看页面保留手动模式
    }
    else
    {
        unsafeWindow.DocHeart_Send = DocHeart_Send;
        unsafeWindow.VideoHeart_Send = VideoHeart_Send;
        unsafeWindow.AudioHeart_Send = AudioHeart_Send;
        console.info(`%c+`,`background-image:url(https://s3.bmp.ovh/imgs/2022/03/5e6d432c16060d22.jpg);background-size: contain;
  background-repeat: no-repeat;
  color: transparent;padding: 122px 217px;`)
        console.info("%c当你打开控制台的时候，请记住以下几个规则：\n1.DocHeart_Send函数可以帮你刷全部的文档课程\n2.VideoHeart_Send函数可以帮你刷全部的视频课程\n3.AudioHeart_Send函数可以帮你刷全部的音频课程\n按需使用，不要一次性全部输入，不然程序会混乱，使用过程中感觉浏览器有点卡顿是正常现象，程序在无延迟的发送网络请求，所以会发生卡顿\n当你发现一排红报错的时候，请不要犹豫，立马刷新页面，重新开始刷课。","color:red;margin-top:10px");
    }
}
MainRun();

