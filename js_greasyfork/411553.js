// ==UserScript==
// @name         Acfun自动发布视频
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  视频上传成功后自动点击发布，不再需要等待上传完成，主要适用于传视频多的录像师傅等up
// @author       费德勒的名单
// @match        https://member.acfun.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411553/Acfun%E8%87%AA%E5%8A%A8%E5%8F%91%E5%B8%83%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/411553/Acfun%E8%87%AA%E5%8A%A8%E5%8F%91%E5%B8%83%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

setInterval(function(){
    var status= document.getElementsByClassName("video-upload-item-status");
    var count=0;
    for(var i=0;i<status.length;i++){
        if(status[i].innerText=="上传完成"){
            count++;
        }
    }
    if(status.length==count&&count>0){
        document.getElementsByClassName("ivu-btn ivu-btn-primary")[0].click()
    }
},60000);