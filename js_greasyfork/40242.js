// ==UserScript==
// @name         超星阅读自动下一章插件
// @namespace    http://tampermonkey.net/
// @version      1.5.4
// @description  超星阅读章节如果长时间停留不动则不会累积时间，写了这一个插件自动翻页，你们可以随心更改插件的间隔时间
// @description  Seconds为时间间隔 多少秒换一章节则填写秒数即可
// @author       西科大学子CFX
// @match        *://mooc1-3.chaoxing.com/course/*
// @match        *://mooc1-2.chaoxing.com/course/*
// @match        *://mooc1-1.chaoxing.com/course/*
// @match        *://mooc1-3.chaoxing.com/ztnodedetailcontroller/visitnodedetail?courseId=*
// @match        *://mooc1-2.chaoxing.com/ztnodedetailcontroller/visitnodedetail?courseId=*
// @match        *://mooc1-1.chaoxing.com/ztnodedetailcontroller/visitnodedetail?courseId=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40242/%E8%B6%85%E6%98%9F%E9%98%85%E8%AF%BB%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E7%AB%A0%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/40242/%E8%B6%85%E6%98%9F%E9%98%85%E8%AF%BB%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E7%AB%A0%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var time=new Date().getTime();
    var nowTime;
    var nowChapter=0;
    var Seconds=10;
    var hasStart=false;
    var chapters_list=[];
    function Doloop(){
        nowChapter = localStorage.getItem("nowChapter");
        chapters_list[nowChapter++].click();
        nowChapter = nowChapter % chapters_list.length;
        localStorage.setItem("nowChapter",nowChapter);
    }
    function clear (){
        localStorage.setItem("nowChapter",0);
        nowChapter=0;
        alert("Done");
    }
    function Timer()
    {
        nowTime=new Date().getTime();
        if(nowTime-time>=Seconds*1000){
            Doloop();
        }
    }
    function main (){
        hasStart=true;
        var cueBoard=$("#caContentBox");
        var Url=window.location.href;
        if(Url.indexOf("/course/")!==-1){
            var firstChapter=document.getElementsByClassName('mt10')[0];
            firstChapter=firstChapter.getElementsByTagName("a")[0];
            firstChapter.click();
        }
        else{
            nowChapter=localStorage.getItem("nowChapter");
            if(nowChapter===undefined||nowChapter===null){
                nowChapter=0;
            }
            var tips;
            tips="<p>当前章数更新完毕：第"+nowChapter+"节<br/>"+"当前换章节间隔："+Seconds+"s</p><p>如果超时进行下一节请刷新当前页面</p><button id='clearBtn'>点击重置章节为0</button>";
            cueBoard.prepend(tips);
            $("#clearBtn").attr("onclick","javascript:localStorage.setItem('nowChapter',0);nowChapter=0;alert('重置成功')");
            var chapters=document.getElementsByTagName('a');
            for(var index=0;index<chapters.length;index++)
            {
                var chapter=chapters[index];
                if(chapter.className=="wh wh")
                {
                    chapters_list.push(chapter);
                }
            }
            setInterval(Timer,1000);}
    }
    function ifStart(){
        if(!hasStart){
            main();
            clearInterval(ifStart);
        }
    }
    setInterval(ifStart,1000);
})();