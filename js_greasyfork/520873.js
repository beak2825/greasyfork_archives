// ==UserScript==
// @name         华中农业大学网课脚本
// @namespace    http://hzau.sccchina.net/
// @version      0.1
// @description  华中农业大学网课 自动刷课软件
// @author       Doom
// @license      MIT
// @match        *://*.sccchina.net/*
// @match        *://*.chinaedu.net/*
// @run-at       document-idle
// @grant        unsafeWindow
// @require      http://code.jquery.com/jquery-migrate-1.2.1.min.js
/* globals jQuery, $, waitForKeyElements */

// @downloadURL https://update.greasyfork.org/scripts/520873/%E5%8D%8E%E4%B8%AD%E5%86%9C%E4%B8%9A%E5%A4%A7%E5%AD%A6%E7%BD%91%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/520873/%E5%8D%8E%E4%B8%AD%E5%86%9C%E4%B8%9A%E5%A4%A7%E5%AD%A6%E7%BD%91%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function() {
    'use strict';
    $(document).ready(function() {
        if(window.self == window.top){
            console.log('当前不在iframe中');
            return ;
        }

        console.log('当前在iframe中');
        window.onload =()=>{
            if(isleftIframe(window)){
                console.log('预期自动刷课');
                console.log('課程加载完成');

                popClose();

                const all_videos = videos();
                if(all_videos == undefined || all_videos.length <= 0){
                    console.log('未加载到课程');
                    return;
                }


                console.log("所有课程:",all_videos);
                          
                let video_index = 0;                        
                console.log("play:", video_index);
                play(all_videos[video_index]);


                window.addEventListener("message", function(event){
                    console.log("iframe接受到消息:", event.data); 
                    if(event.data == 'playCompleted'){
                        if(video_index == all_videos.length-1)  {
                            console.log("所有video已经全部播放完成");
                        } else {
                            console.log("play:", ++video_index);
                            play(all_videos[video_index]);
                        }
                    }                  
                });
            }

            if(isVideoFrame(window)){
                window.addEventListener("message", function(event) {
                    console.log("videoFrame接受到消息:", event.data);
                    if(event.data == 'playVideo'){
                        playVideo();
                    }
                });
            }
        };

        function isleftIframe(window){
            // 判断当期是否是 'iframe': 通过判断 iframe:'frameVideo'是否存在来确认的
            if(undefined != window.frames['frameVideo'] && null !=window.frames['frameVideo']  ){
                return true;
            }

            return false;
        }
   
        function isVideoFrame(window){
            // 有个一个div: 'videoFrame'
             const video =  document.getElementById('videoFrame');
             if(video && video.tagName == 'DIV'){
                return true;
             }

             return false;
        }

       
        function popClose(){
            const pop_close = document.querySelector('#pop > h2 > em');
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true
            });

             console.log('关闭pop遮罩');
            pop_close.dispatchEvent(clickEvent);
        }

        function videos(){
            // 获取所有的课件列表
            let videos = [];
            const topLevelItems = document.querySelectorAll('li.leftOneLevel');
            topLevelItems.forEach(item => {
                // 查找该 li 元素下的所有 a 标签
                const allAnchors = item.querySelectorAll('a');


                // 遍历每个 a 标签，排除含有 <span class="arrow"></span> 的标签
               return Array.from(allAnchors).filter(anchor=>{
                    let isVideo = !anchor.querySelector('span.arrow');
                    if(isVideo){
                        console.log(anchor.title);
                        videos.push(anchor);
                    }
               });

                return allAnchors;
            });

            return videos;
        }



        function isActive(video){
           const activeLi = anchor.closest('li.active.activeState');
           console.log('课件:', anchor.title || anchor.href  );
           if(activeLi){
            console.log("正在播放中");
            }

            return activeLi;
        }



        function getFirst(videos){
            // 已经在播放中,从当前播放中开始
            for(let i=0;i<videos.length;i++){
                 if(isActive(video)){
                        return i;
                    }
            }

        
             // 如果没有开始,则从第一个开始
             return 0;
        }



        function playVideo(){
            console.log('start正式播放');
            // 自动播放前尝试先静音
            const video = document.querySelector('video');
            video.muted = true;  // 静音
            video.autoplay = true; 

            // 静音之后好像play没啥问题了??
            video.play();

            //    // 模拟点击事件: 播放
            // const clickEvent = new MouseEvent('click', {
            //     bubbles: true,
            //     cancelable: true
            // });

            //  // videoFrame_video :div上有个play按钮
            // const bigPlay = document.querySelector('div.vjs-big-play-button');
            // bigPlay.dispatchEvent(clickEvent);


            // // video上的play按钮
            // const videoPlay = document.querySelector('div.vjs-play-control.vjs-control');
            // videoPlay.dispatchEvent(clickEvent);
            console.log('end正式播放');


            // 2s后检查是否播放完成
            setTimeout(()=>{
                if(playCompleted()){
                    window.parent.postMessage( 'playCompleted','*');
                    return ;
                }

                // 如果还没结束,则/2s定时检查一次
                const intervalId  =  setInterval(()=>{
                    if(playCompleted()){
                      window.parent.postMessage( 'playCompleted','*');
                      clearInterval(intervalId);
                    }

                }, 5000);

            }, 2000);
        }


        function play(video){
            console.log('start播放课件:', video.title || video.href  );
            // video.click();

         
             const clickEvent = new MouseEvent('click', {
                    bubbles: true, // 事件是否冒泡
                    cancelable: true // 事件是否可取消
                });

     
            video.dispatchEvent(clickEvent);
            // 因为跨域了所以这里的clickEvent并不能传导到 iframe: 'frameVideo'中
            // 需要用到跨iframe通讯
            const videoFrame = window.frames['frameVideo']
            if(undefined == videoFrame || null == videoFrame){
                console.log('iframe: frameVideo找不到');
            }
            
            videoFrame.onload = ()=>{ 
                // 未加载完成的话,消息发出去也接受不到
                console.log('videoFrame加载完成,then playVideo');
                videoFrame.contentWindow.postMessage('playVideo', '*');
            };
            
            console.log('end播放课件:', video.title || video.href  );
        }

        function wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }


        function timeToSeconds(timeStr) {
            const timeParts = timeStr.split(':'); // 分割分钟和秒
            const minutes = parseInt(timeParts[0], 10); // 获取分钟
            const seconds = parseInt(timeParts[1], 10); // 获取秒数
            return (minutes * 60) + seconds; // 转换为秒
        }


        function playCompleted(){
            const currentTimeDiv = document.querySelector('div.vjs-current-time-display');
            const durationDiplay = document.querySelector('div.vjs-duration-display');

            // 检查是否成功找到元素
            if (currentTimeDiv) {
                // 获取时间值
                const currentTimeValue = currentTimeDiv.textContent.trim().replace('当前时间', '').trim(); // 包含 "当前时间 3:21"
                const durationValue = durationDiplay.textContent.trim().replace('时长', '').trim();; // 包含 "时长 3:21"


                console.log('当前时间的值:', currentTimeValue); // 输出 "3:21"
                console.log('时长:', durationValue); // 输出 "3:21"

                if(currentTimeValue == durationValue){
                    console.log("播放完成");
                    return true;
                }
                if(currentTimeValue =='0:00'){
                    console.log("未播放");
                }
                if(timeToSeconds(currentTimeValue) > 0 && timeToSeconds(currentTimeValue) < timeToSeconds(durationValue) ){
                    console.log("已播放部分");
                }
            } else {
                console.log('未找到目标 div');
            }
            return false;
        }


    });
})();
