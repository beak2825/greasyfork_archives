// ==UserScript==
// @name         牛马的一天
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  视频自动播放!
// @author       小熊
// @match        https://study.enaea.edu.cn/viewerforccvideo.do?*
// @match        https://study.enaea.edu.cn/circleIndexRedirect.do?action=toNewMyClass*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=enaea.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446458/%E7%89%9B%E9%A9%AC%E7%9A%84%E4%B8%80%E5%A4%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/446458/%E7%89%9B%E9%A9%AC%E7%9A%84%E4%B8%80%E5%A4%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var preIdx = -1;
    slience();
    setInterval(() => {
        if((window.location.href).substring(0,49)==='https://study.enaea.edu.cn/circleIndexRedirect.do'){
            console.log("查询课程");
            startLearn();
        }else{
        }
    }, 10 * 1000);

    setInterval(()=>{
        if((window.location.href).substring(0,46)==='https://study.enaea.edu.cn/viewerforccvideo.do'){
            console.log("运行视频课程");
            try {
                var courseProcessList = document.getElementsByClassName('cvtb-MCK-CsCt-studyProgress');
                if(courseProcessList && courseProcessList.length >0){
                    var idx = -1;
                    for(var i = 0 ; i < courseProcessList.length ; i++){
                        if(courseProcessList[i].innerText !== "100%"){
                            idx = i;
                            break;
                        }
                    }
                    var time =new Date().getTime();
                    if(idx === -1){
                        localStorage.setItem("runTime", 0);
                        window.close();
                    }else if(preIdx !=idx){
                        console.log("开始新听课"+idx + ":" + time);
                        localStorage.setItem("runTime",time);
                        courseProcessList[idx].click();
                        preIdx = idx;
                    }else{
                        console.log("继续听课"+idx+ ":" + time);
                        localStorage.setItem("runTime",time);
                    }
                }
                slience();
                if(document.getElementsByClassName("dialog-box").length!=0)
                {
                    console.log("检测到20分钟限制，去除限制");
                    document.getElementsByClassName("dialog-button-container")[0].children[0].click();
                }
                console.log("检测中");
            } catch (error) {
                console.log(error);
            }
        }
    }, 5 * 1000);

    function slience(){
        console.log("尝试获取播放器");
        var exist= document.getElementById('J_CC_videoPlayerDiv');
        if(exist){
            var findVedioNode = exist.childNodes;
            if(findVedioNode && findVedioNode.length >0){
                var vedio = findVedioNode[0];
                console.log("播放器禁音");
                vedio.muted =true;
            }
        }
    }

    function startLearn(){

        var current = new Date().getTime();
        var time = localStorage.getItem("runTime");
        if(!time){
            time = 0;
        }
        var fresh = localStorage.getItem("fresh");
        if(!fresh){
            fresh = 0;
        }if(current - fresh > 1000* 60){
            localStorage.setItem("fresh",current);
            location.reload();
        }
        if(current - time > 20*1000){
            console.log("获取课程");
            var progressNodes = document.getElementsByClassName('progressvalue');
            if(progressNodes && progressNodes.length > 0){
                var run = false;
                for(var i = 0 ; i < progressNodes.length; ++i){
                    var node = progressNodes[i];
                    console.log(i + ":" + node.innerText);
                    if(node && node.innerText !== "100%"){
                        node.parentNode.parentNode.nextElementSibling.getElementsByTagName('a')[0].click();
                        run =true;
                        break;
                    }
                }
                if(!run){
                    // 下一页面
                    document.getElementById('J_myOptionRecords_next').click();
                }
            }
        }
    }
})();