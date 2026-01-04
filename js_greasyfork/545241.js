// ==UserScript==
// @name         君睿在线挂机（湖南省安全监察员继续教育系统）
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  湖南省安全监察员继续教育系统培训+V(lly6655)
// @author       yq
// @match        *://*.aqscpx.com/*
// @icon         https://www.google.com/s2/favicons?domain=aqscpx.com
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/545241/%E5%90%9B%E7%9D%BF%E5%9C%A8%E7%BA%BF%E6%8C%82%E6%9C%BA%EF%BC%88%E6%B9%96%E5%8D%97%E7%9C%81%E5%AE%89%E5%85%A8%E7%9B%91%E5%AF%9F%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%B3%BB%E7%BB%9F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/545241/%E5%90%9B%E7%9D%BF%E5%9C%A8%E7%BA%BF%E6%8C%82%E6%9C%BA%EF%BC%88%E6%B9%96%E5%8D%97%E7%9C%81%E5%AE%89%E5%85%A8%E7%9B%91%E5%AF%9F%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%B3%BB%E7%BB%9F%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.clear()

    var interval=30 //间隔时间，秒，必须正整数
    var courses=[] //所有课程
    var nowIndex=0 //当前播放视频的序号

    var watchVideo
    var domain=document.domain
    var url=window.location.pathname
    //课堂页面
    if(domain=='hunanaqjc.aqscpx.com' && url.startsWith('/user/userCenter.do'))
    {
      document.querySelector("input.btn_mp3").click()
    }

    //课堂页面
    if(domain=='hunanaqjc.aqscpx.com' && url.startsWith('/user/toCourse.do'))
    {
        console.log('加载完成')
        //获取课程
        courses=document.querySelectorAll("td.t2")
        var aa=0
        var BF=document.querySelectorAll("input.btn_mp3")
        //遍历课程
        for(var i=2;i<courses.length;i+=3)
        {
            //课程完成进程
            var sRate=courses[i].innerHTML
            var rate=sRate.split('%')
            console.log(i)
            //进度未达到100%
            if(rate[0]<100){
                //模拟点击播放
                BF[nowIndex].click()
                return false
            }
           nowIndex=nowIndex+1
        }
        console.log('全部完成')
        return false
    }

    //视频页面
    if(domain=='hunanaqjc.aqscpx.com' && url.startsWith('/user/toAudio.do'))
    {
        //没有检测到课程，转到课程列表页面
        if(courses==null||courses.count==0)
        {
            //点击返回按钮，转到课程列表
            document.querySelector('.a_back').click()
            //跳转到toCourse页面
          //window.location.replace("/user/toCourse.do")
        }
        console.clear()
        console.log('播放第 '+ nowIndex +' / ' + courses.count + ' 视频')

        //时间设置有误，默认为30秒
        if(!(Number.isInteger(interval)&&interval>0))
        {
            interval=30
        }
        //循环检测
        watchVideo=setInterval(watch,interval*1000)
    }

    function watch(){
        var video=document.querySelector('video')
        if(!video.muted)
        {//自动静音
            video.muted=true
        }
        //暂停自动播放
        if(video.paused)
        {
            video.play()
        }
        //显示当前播放时间
        console.log(video.currentTime+'/'+video.duration)
        //完成，点击返回
        if(video.currentTime>=video.duration){
            clearInterval(watchVideo)
            document.querySelector('.a_back').click()
        }
    }
})();
