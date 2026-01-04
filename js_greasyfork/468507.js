// ==UserScript==
// @name         教育干部网络学院刷课
// @namespace    Eucliwood
// @version      1.2
// @description  教育干部网络学院刷课，自动点击
// @author       Eucliwood
// @match        https://study.enaea.edu.cn/viewerforccvideo.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=enaea.edu.cn
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/468507/%E6%95%99%E8%82%B2%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/468507/%E6%95%99%E8%82%B2%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    var endFlag=false;
    setInterval(function(){//设置计时1000ms 执行代码块
        try{//避免出错停止
            var continueButtonList=document.querySelectorAll("#rest_tip > table > tbody > tr:nth-child(2) > td.td-content > div.dialog-button-container > button")
            //如果播放暂停则自动播放
            var mainVideo=document.querySelector("video");
            if(mainVideo.volume!=0)//如果没静音就静音
                mainVideo.volume=0;
            if(mainVideo.paused&&(!mainVideo.ended)){//先判断暂停没，并且到结尾
                TimeLog("视频暂停并且没结束");
                if(continueButtonList.length==0){//找不到继续的按钮就跳过
                    TimeLog("没有继续学习按钮");
                }else{
                    if(continueButtonList[0].innerText=="继续学习"){//如果按钮内包含就说明找到
                        continueButtonList[0].click();
                        TimeLog("出现继续学习，点击继续学习");
                    }else{//没找到
                        throw("内容不匹配");
                    }
                }
                var videoDiv=document.getElementById("J_CC_videoPlayerDiv");
                var videoDivClass=videoDiv.className;
                if(videoDivClass.includes("xgplayer-pause")){//有这个属性说明此时暂停了
                    TimeLog("视频被暂停");
                    document.querySelectorAll("#J_CC_videoPlayerDiv > xg-start > div.xgplayer-icon-play")[0].click();//暂停了点播放
                    TimeLog("已点击播放");
                }else{
                }
            }else{//不管
            }
        }catch(err){
            TimeLog(err);
        } 
    },1000);

    function TimeLog(str){
        console.log(new Date().toString()+str);
    }
    
})();