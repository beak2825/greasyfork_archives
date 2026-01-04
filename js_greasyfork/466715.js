// ==UserScript==
// @name         君睿在线挂机
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  君睿在线挂机,君睿业务很多，包括特种设备，职业教育。账号有限，大家自行修改使用。长时间学习后有些需要人脸识别（后台限制）。
// @author       yq
// @match        https://*.aqscpx.com/*
// @icon         https://www.google.com/s2/favicons?domain=aqscpx.com
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/466715/%E5%90%9B%E7%9D%BF%E5%9C%A8%E7%BA%BF%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/466715/%E5%90%9B%E7%9D%BF%E5%9C%A8%E7%BA%BF%E6%8C%82%E6%9C%BA.meta.js
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
    if(domain=='renshe.aqscpx.com' && url.startsWith('/user/toCourse.do'))
    {
        console.log('加载完成')
        //获取课程
        courses=document.querySelector('.st1').querySelector('.st3').querySelectorAll('tr')
        //遍历课程
        for(var i=0;i<courses.length;i++)
        {
            //课程完成进程
            var sRate=courses[i].querySelectorAll('td')[3].innerHTML
            var rate=sRate.split('%')
            console.log(i)
            //进度未达到100%
            if(rate[0]<100){
                nowIndex=i+1
                //模拟点击播放
                courses[i].querySelector('.t1').querySelector('a').onclick()
                return false
            }
        }
        console.log('全部完成')
        return false
    }

    //视频页面
    if(domain=='renshe.aqscpx.com' && url.startsWith('/user/toAudio.do'))
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
