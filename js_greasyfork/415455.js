// ==UserScript==
// @name         bili高能条
// @namespace    http://tampermonkey.net/
// @version      1.321
// @description  解析高能条，实现自动跳过片头（暂时只开放动态漫）
// @author       kakasearch
// @include      *://www.bilibili.com/video/av*
// @include      *://www.bilibili.com/video/BV*
// @include      *://www.bilibili.com/bangumi/play/ep*
// @include      *://www.bilibili.com/bangumi/play/ss*
// @include      *://m.bilibili.com/bangumi/play/ep*
// @include      *://m.bilibili.com/bangumi/play/ss*
// @include      *://bangumi.bilibili.com/anime/*
// @include      *://bangumi.bilibili.com/movie/*
// @include      *://www.bilibili.com/bangumi/media/md*
// @include      *://www.bilibili.com/blackboard/html5player.html*
// @connect      comment.bilibili.com
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/415455/bili%E9%AB%98%E8%83%BD%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/415455/bili%E9%AB%98%E8%83%BD%E6%9D%A1.meta.js
// ==/UserScript==
/////////////////////////////////////////////bili_pass --- 一步到高能//////////////////////////////////////////////////////
(function() {
    const bili_pass_gnt={
        setting:{//脚本设置
            max_time:300,//单位秒，最大跳过时长，此时长之外的将视为不可信，0为不限制
            min_time:10,//单位秒，最小跳过时长，此时长之外的将视为不可信，0为不限制
            react_time:2.5,//弹幕发送的反应时间
            cid:'',//控制切p
            debug : 0,//开发模式
            pass_op : 1,//记录次剧集是否跳过,不要修改
        },
        info(){//输出信息
            const arg = Array.from(arguments);
            arg.unshift(`color: #030303; background-color:#D3D3D3`);
            arg.unshift('%c bili高能条:');
            console["info"].apply(console, arg);
        },
        get_time(gnt){
            var exp = /(\d+\.\d+) \d+\.\d+, \d+\.\d+ \d+\.\d+, \d+\.\d+ (\d+\.\d+)/ig;
            var time=[]
            var height = []
            let result
            while( (result = exp.exec(gnt.getAttribute('d')))!= null){
                time.push(result[1])
                height.push(parseFloat(result[2]))
            }
            //遍历
            for(let i=1;i++;i<=height.length-6){
                let min = Math.min(...height.slice(i+1,i+6))//最小值
                if(height[i]<min){
                    //找到了宽度5%区间内第一个最小值
                    return parseFloat(time[i])
                    //console.log(time[i])
                    break
                }
            }
            return 0
        },
        initfun(){
            //document.querySelector("#pbp-curve-path > path").getAttribute('d')//高能条码
            let init= setInterval(function(){
                let gnt = document.querySelector("#pbp-curve-path > path")//高能条加载完毕
                if(gnt){
                    clearInterval(init)
                    if( bili_pass_gnt.setting.debug ||/动态漫/.test(document.querySelector("#media_module > div > a.media-title").innerText)){
                        let first_height = bili_pass_gnt. get_time(gnt) //获取高能条最高点
                        if(first_height){
                            let video = document.getElementsByTagName('video')[0]
                            video.currentTime=video.duration*first_height/1000 - bili_pass_gnt.setting.react_time//跳转到高能条最高点
                            video.play()
                            bili_pass_gnt.info('已经跳转至最高能')
                        }else{
                            bili_pass_gnt.info('解析高能条最高点失败')
                        }
                    }
                }
            },100)
            },
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let ci = 0//防止observe导致的2次运行
    let obser = setInterval(
        function(){
            let video= document.querySelector("#bilibili-player video")
            let gnt = document.querySelector("#pbp-curve-path > path")//高能条加载完毕
            if(gnt && video){
                clearInterval(obser)
                bili_pass_gnt.initfun()
                let observer = new MutationObserver(()=>{if(ci == 0){ci =1;bili_pass_gnt.initfun()}else{ci =0 }})
                observer.observe(video, { attributes: true });//检测video变化,防止中途切p失效
            }

        },200
    )
    })();