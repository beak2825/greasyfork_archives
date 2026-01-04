// ==UserScript==
// @name         YNU发展对象
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  此文件仅供脚本学习！！！
// @author       唐无诗
// @include      http://www.rdjypx.ynu.edu.cn/*/play?*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/476051/YNU%E5%8F%91%E5%B1%95%E5%AF%B9%E8%B1%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/476051/YNU%E5%8F%91%E5%B1%95%E5%AF%B9%E8%B1%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('It\'s runing Now');
    var i=0;var j=0;
    var colors="red";
    var time=getTimes();
    var pa = document.createElement('p');
    var n=130;//最大等待响应时长：n*3s
    var k=0;
    if(document.getElementsByClassName("video_cont")[0]===undefined){
        console.log("视频出错，即将刷新");
        location.reload();
    }else{
       document.getElementsByClassName("video_cont")[0].appendChild(pa);
    }
    showInfo('开始工作');
    var tm=setInterval(function(){
         var video = document.querySelector("video");
         if(video.paused){
              video.play();
         }
        if(document.getElementsByClassName("video_head").length==0&&document.getElementsByClassName("video_cont").length==0){
            console.log("视频出错，即将刷新");
            location.reload();
        }else{
            if(document.getElementsByClassName("video_red1")[0].children[0].style.color==colors){//如果当前已经看完
                showInfo("当前视频已看完，将点击下一视频");
                if(document.getElementsByClassName("video_red1")[0].nextSibling.nextSibling===null){
                    window.clearInterval(t1);
                    showInfo('当前课程没有需要学习的内容了！');
                    window.location.href="http://www.rdjypx.ynu.edu.cn/study_user/lesson?stg=4";
                }else{
                    document.getElementsByClassName("video_red1")[0].nextSibling.nextSibling.children[0].click();//点击下一视频
                }
            }else{
                if(document.getElementsByClassName("public_cancel")[0]===undefined){
                    if(document.getElementsByClassName("public_submit")[0]===undefined){
                        i=i+1;
                        showInfo('共拦截'+j+'次弹窗');
                        if(document.getElementsByClassName("plyr--stopped")[0]===undefined){
                            k=0;
                        }else{
                            k++;
                            if(k>=n/10-5){
                                showInfo('视频暂停中，将在'+((n/10-k)*time/60/1000).toFixed(2)+'分钟后刷新');
                            }
                            if(k>=n/10){
                                showInfo('视频暂停中,可能已播完，刷新');
                                location.reload();
                            }
                        }
                    }else{
                        document.getElementsByClassName("public_submit")[0].click();
                        i=0;
                        j=j+1;
                        showInfo('共拦截'+j+'次弹窗');
                    }
                }else{
                    document.getElementsByClassName("public_cancel")[0].click();
                    i=0;
                    j=j+1;
                    showInfo('共拦截'+j+'次弹窗');
                }
            }
        }
    },time);
})();

function getTimes(){
    var times=Math.random()*8 + 1;//1-9
    times=3*1000*1;//+times*10
    return times
}

function showInfo(str){
    console.log(str);
    document.getElementsByClassName("video_cont")[0].children[2].innerText=str;
}