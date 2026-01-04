// ==UserScript==
// @name         腾讯视频播放到某个时间点自动下一集
// @namespace    http://tampermonkey.net/
// @namespace    Tencent_Video_Auto_Next
// @version      1.1
// @description  用于解决某些片子结束前有广告的烦恼比如某些动漫
// @require	http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @author      https://github.com/wuhao1477
// @match        https://v.qq.com/x/cover/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @charset	UTF-8
// @license      AGPL License
// @original-license  AGPL License
// @original-script   https://greasyfork.org/zh-CN/scripts/456372
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456372/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%88%B0%E6%9F%90%E4%B8%AA%E6%97%B6%E9%97%B4%E7%82%B9%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/456372/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%88%B0%E6%9F%90%E4%B8%AA%E6%97%B6%E9%97%B4%E7%82%B9%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var taskTime =60*60;//默认为60分钟
    var task1 = setInterval(()=>{
        let currentTime = 0;
        for(let i=0;i<$("video").length;i++){
            let currentTimeValue = $("video")[i].currentTime;
            if(currentTimeValue>currentTime){
               currentTime = currentTimeValue;
            }
        }
        if(currentTime>taskTime){
            console.log("到点下一集了！");
            $(".txp_btn_next_u").click()
        }else{
            console.log("还没到点呢！");
        }
    },1000)
    $(".player-bottom__intro")[0].innerHTML += `<div class="barrage-input"> <div id="task_tips_text">当前自动下一集的时间线是：${taskTime}秒   </div><input  id="edit_task_time_input" style="color:#000" placeholder="请定时下一集的时间"></input><button id="set_task_new_time" style="width:50px;height=100px;background:red">确定</button></div>`
    document.getElementById("set_task_new_time").onclick=function(value){
        console.log('设置新的时间为：');
        let new_task_time = document.getElementById("edit_task_time_input").value;
        console.log(new_task_time);
        let min_task_time = ($("video")[0].duration ||$("video")[1].duration ||$("video")[2].duration)/2 ||6*60;//最短6分钟
        if(new_task_time&&new_task_time>min_task_time){
            taskTime = new_task_time;
            document.getElementById("task_tips_text").innerHTML = `<div id="task_tips_text">当前自动下一集的时间线是：${taskTime}秒   </div>`;
            alert(`设置成功！`);
        }else if(new_task_time<=min_task_time){
            alert(`最小设置时间为：${min_task_time}!`);
        }
    }

    })();
